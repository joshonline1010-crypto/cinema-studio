import type { APIRoute } from 'astro';

// Direct FAL.AI integration - no n8n needed
const FAL_API_KEY = 'Key 30048d83-df50-41fa-9c2f-61be8fcdb719:8bb12ec91651bf9dc7ee420b44895305';

// FAL endpoints
const FAL_ENDPOINTS = {
  'video-kling': 'https://fal.run/fal-ai/kling-video/v2.6/pro/image-to-video',
  'video-kling-o1': 'https://fal.run/fal-ai/kling-video/o1/pro/image-to-video', // O1 uses start + tail_image_url
  'video-seedance': 'https://fal.run/fal-ai/seedance-1-lite/image-to-video',
  'image': 'https://fal.run/fal-ai/nano-banana-pro',
  'image-edit': 'https://fal.run/fal-ai/nano-banana-pro/edit',
  'face-adapter': 'https://fal.run/fal-ai/ip-adapter-face-id'
};

async function callFal(endpoint: string, body: any): Promise<any> {
  console.log('Calling FAL:', endpoint, body);

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

  return response.json();
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
      duration = '5',
      aspect_ratio = '16:9',
      resolution = '2K'
    } = body;

    console.log('Cinema Studio request:', { type, prompt, duration, aspect_ratio, resolution });

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
        const falBody: any = {
          prompt,
          duration,
          aspect_ratio
        };

        if (start_image_url) falBody.image_url = start_image_url;
        if (end_image_url) falBody.tail_image_url = end_image_url;

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
      case 'image-video': {
        // Generate image with nano-banana - always 4K
        if (reference_image) {
          result = await callFal(FAL_ENDPOINTS['image-edit'], {
            image_urls: [reference_image],
            prompt: `${prompt}, maintain exact likeness and features of the person in the reference`,
            aspect_ratio,
            resolution: '4K'
          });
        } else {
          result = await callFal(FAL_ENDPOINTS['image'], {
            prompt,
            aspect_ratio,
            resolution: '4K'
          });
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
