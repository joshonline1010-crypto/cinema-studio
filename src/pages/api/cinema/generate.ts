import type { APIRoute } from 'astro';

// Direct FAL.AI integration - no n8n needed
const FAL_API_KEY = 'Key 30048d83-df50-41fa-9c2f-61be8fcdb719:8bb12ec91651bf9dc7ee420b44895305';

// FAL endpoints
// Videos: use queue.fal.run (async with polling - videos take 30-60s)
// Images: use fal.run (sync - images are fast, ~10-20s)
const FAL_ENDPOINTS = {
  'video-kling': 'https://queue.fal.run/fal-ai/kling-video/v2.6/pro/image-to-video',
  'video-kling-o1': 'https://queue.fal.run/fal-ai/kling-video/o1/image-to-video',
  'video-seedance': 'https://queue.fal.run/fal-ai/seedance-1-lite/image-to-video',
  'image': 'https://fal.run/fal-ai/nano-banana-pro',           // Text-to-image
  'image-edit': 'https://fal.run/fal-ai/nano-banana-pro/edit', // Image-to-image (with reference)
  'face-adapter': 'https://fal.run/fal-ai/ip-adapter-face-id'
};

async function callFal(endpoint: string, body: any): Promise<any> {
  console.log('Calling FAL:', endpoint, JSON.stringify(body, null, 2));

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': FAL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('FAL error:', response.status, errorText);
    throw new Error(`FAL API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // If queue endpoint, poll for result
  if (endpoint.includes('queue.fal.run') && data.request_id) {
    console.log('Queue request submitted, polling for result:', data.request_id);
    return await pollFalResult(data.request_id, endpoint);
  }

  return data;
}

// Poll for queue result
// IMPORTANT: Kling polling uses fal-ai/kling-video/requests/{id} (NOT /o1/ or /v2.6/)
async function pollFalResult(requestId: string, endpoint: string, maxAttempts = 120): Promise<any> {
  // Determine base path for polling based on endpoint
  let basePath = 'fal-ai/kling-video';
  if (endpoint.includes('seedance')) {
    basePath = 'fal-ai/seedance-1-lite';
  } else if (endpoint.includes('nano-banana')) {
    basePath = 'fal-ai/nano-banana-pro';
  }

  const statusUrl = `https://queue.fal.run/${basePath}/requests/${requestId}/status`;
  const resultUrl = `https://queue.fal.run/${basePath}/requests/${requestId}`;

  console.log('Polling URLs:', { statusUrl, resultUrl });

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    try {
      const statusRes = await fetch(statusUrl, {
        headers: { 'Authorization': FAL_API_KEY }
      });

      if (!statusRes.ok) {
        const errText = await statusRes.text();
        console.log(`Status check failed (${statusRes.status}): ${errText}`);
        continue;
      }

      const status = await statusRes.json();
      console.log(`Poll ${i + 1}/${maxAttempts}: ${status.status}`);

      if (status.status === 'COMPLETED') {
        // Get full result
        const resultRes = await fetch(resultUrl, {
          headers: { 'Authorization': FAL_API_KEY }
        });
        return await resultRes.json();
      }

      if (status.status === 'FAILED') {
        throw new Error(`FAL request failed: ${JSON.stringify(status)}`);
      }
    } catch (err) {
      console.log('Poll error:', err);
    }
  }

  throw new Error('FAL request timed out after polling');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      type,
      prompt,
      image_url,
      start_image_url,
      end_image_url,
      reference_image,
      image_urls,  // Array of reference images (takes priority over single reference_image)
      duration = '5',
      aspect_ratio = '16:9',
      resolution = '2K'
    } = body;

    console.log('Cinema Studio request:', { type, prompt, duration, aspect_ratio, resolution });
    console.log('Reference image received:', reference_image ? 'YES - ' + reference_image.substring(0, 50) + '...' : 'NO');

    let result: any;

    switch (type) {
      case 'video-kling': {
        // Kling 2.6 - single image to video
        result = await callFal(FAL_ENDPOINTS['video-kling'], {
          image_url: image_url || start_image_url,
          prompt,
          duration,
          aspect_ratio
        });
        break;
      }

      case 'video-kling-o1': {
        // Kling O1 - supports start + end frame
        // CORRECT PARAMS: start_image_url + end_image_url (NOT image_url + tail_image_url)
        const falBody: any = {
          prompt,
          duration
        };

        if (start_image_url) falBody.start_image_url = start_image_url;
        if (end_image_url) falBody.end_image_url = end_image_url;

        result = await callFal(FAL_ENDPOINTS['video-kling-o1'], falBody);
        break;
      }

      case 'video-seedance': {
        // Seedance - for dialogue/character animation
        const seedBody: any = {
          image_url: image_url || start_image_url,
          prompt
        };

        if (end_image_url) seedBody.end_image_url = end_image_url;

        result = await callFal(FAL_ENDPOINTS['video-seedance'], seedBody);
        break;
      }

      case 'image':
      case 'image-video':
      case 'edit': {
        // Generate image with nano-banana - always 4K
        const imageBody: any = {
          prompt,
          aspect_ratio,
          resolution: '4K'
        };

        // Combine all reference sources: image_urls array > single reference_image
        const allRefs: string[] = [];
        if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
          allRefs.push(...image_urls);
        } else if (reference_image) {
          allRefs.push(reference_image);
        }

        // Use different endpoint based on whether reference images are provided
        if (allRefs.length > 0) {
          // Image-to-image: use /edit endpoint with image_urls array
          imageBody.image_urls = allRefs;
          console.log('Using EDIT endpoint with', allRefs.length, 'reference(s):', allRefs.map(u => u.substring(0, 50) + '...'));
          result = await callFal(FAL_ENDPOINTS['image-edit'], imageBody);
        } else {
          // Text-to-image: use regular endpoint
          console.log('Using TEXT-TO-IMAGE endpoint (no reference)');
          result = await callFal(FAL_ENDPOINTS['image'], imageBody);
        }
        break;
      }

      default:
        return new Response(JSON.stringify({
          error: `Invalid type: ${type}. Use video-kling, video-kling-o1, video-seedance, or image`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    console.log('FAL result:', result);

    // Extract video/image URL from response
    const response_data = {
      success: true,
      video_url: result.video?.url || result.video_url || null,
      image_url: result.images?.[0]?.url || result.image?.url || result.image_url || null,
      request_id: result.request_id || null,
      raw: result
    };

    return new Response(JSON.stringify(response_data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Cinema generate error:', error);
    return new Response(JSON.stringify({
      error: 'Generation failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
