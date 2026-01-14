// API Endpoint: Generate content based on council consensus
// Wraps the existing /api/cinema/generate endpoint
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      prompt,
      model,
      duration,
      motionPrompt,
      director,
      refs,
      chainStrategy,
    } = body;

    console.log('[Council Generate] Starting:', { prompt: prompt?.slice(0, 50), model, duration });

    // Step 1: Generate base image using cinema endpoint
    console.log('[Council Generate] Step 1: Generating image...');

    const imagePrompt = buildImagePrompt(prompt, director, refs);

    const imageRes = await fetch(new URL('/api/cinema/generate', request.url).href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'image',
        prompt: imagePrompt,
        aspect_ratio: '16:9',
        resolution: '4K',
        // Include character refs if available
        image_urls: refs?.filter((r: any) => r.type === 'character').map((r: any) => r.url) || []
      })
    });

    if (!imageRes.ok) {
      const err = await imageRes.json();
      throw new Error(`Image generation failed: ${err.error || err.details}`);
    }

    const imageData = await imageRes.json();
    const imageUrl = imageData.image_url;

    if (!imageUrl) {
      throw new Error('No image URL returned');
    }

    console.log('[Council Generate] Image ready:', imageUrl);

    // Step 2: Generate video using cinema endpoint
    console.log('[Council Generate] Step 2: Generating video...');

    // Map council model names to cinema types
    const modelToType: Record<string, string> = {
      'kling-2.6': 'video-kling',
      'kling-o1': 'video-kling-o1',
      'seedance-1.5': 'video-seedance'
    };

    const videoType = modelToType[model] || 'video-kling';
    const videoPromptText = motionPrompt || buildMotionPrompt(prompt, director);

    const videoBody: any = {
      type: videoType,
      prompt: videoPromptText,
      duration: duration || '5',
    };

    // Different params for different models
    if (model === 'kling-o1') {
      videoBody.start_image_url = imageUrl;
      if (chainStrategy?.previousFrameUrl) {
        videoBody.end_image_url = chainStrategy.previousFrameUrl;
      }
    } else {
      videoBody.image_url = imageUrl;
    }

    const videoRes = await fetch(new URL('/api/cinema/generate', request.url).href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoBody)
    });

    if (!videoRes.ok) {
      const err = await videoRes.json();
      throw new Error(`Video generation failed: ${err.error || err.details}`);
    }

    const videoData = await videoRes.json();
    const videoUrl = videoData.video_url;

    if (!videoUrl) {
      throw new Error('No video URL returned');
    }

    console.log('[Council Generate] Video ready:', videoUrl);

    // Return success
    return new Response(JSON.stringify({
      success: true,
      imageUrl,
      videoUrl,
      model,
      duration,
      prompts: {
        image: imagePrompt,
        motion: videoPromptText,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[Council Generate] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ============================================
// PROMPT BUILDERS
// ============================================

function buildImagePrompt(prompt: string, director?: any, refs?: any[]): string {
  const parts: string[] = [];

  // Base prompt
  parts.push(prompt);

  // Director style
  if (director?.name) {
    const directorStyles: Record<string, string> = {
      'kubrick': 'shot on Panavision 70mm, centered symmetrical framing, cold precise lighting',
      'spielberg': 'shot on ARRI, emotional face lighting, warm tones',
      'nolan': 'shot on IMAX 65mm, practical lighting, deep focus',
      'fincher': 'shot on RED camera, low-key lighting, muted color palette',
      'wright': 'dynamic framing, high contrast, punchy colors',
      'tarantino': 'shot on 35mm film, low angle, high saturation',
    };
    const style = directorStyles[director.name.toLowerCase()] || '';
    if (style) parts.push(style);
  }

  // Quality suffix
  parts.push('8K, photorealistic, high detail, cinematic');

  return parts.join('. ');
}

function buildMotionPrompt(prompt: string, director?: any): string {
  const parts: string[] = [];

  // Extract key action from prompt
  const action = extractAction(prompt);
  if (action) {
    parts.push(action);
  }

  // Add camera movement based on director
  if (director?.name) {
    const directorMoves: Record<string, string> = {
      'kubrick': 'slow dolly forward, then holds',
      'spielberg': 'smooth tracking shot, subtle movement',
      'nolan': 'static wide shot with subtle parallax',
      'fincher': 'precision camera move, then settles',
      'wright': 'quick pan, sharp movement',
      'tarantino': 'low angle static, character moves in frame',
    };
    const move = directorMoves[director.name.toLowerCase()] || 'subtle camera movement, then settles';
    parts.push(move);
  } else {
    parts.push('subtle camera movement, then settles');
  }

  return parts.join('. ');
}

function extractAction(prompt: string): string {
  const actionWords = ['walks', 'runs', 'explores', 'enters', 'looks', 'turns', 'moves', 'stands'];
  const words = prompt.toLowerCase().split(' ');

  for (const action of actionWords) {
    if (words.includes(action)) {
      const idx = words.indexOf(action);
      const start = Math.max(0, idx - 2);
      const end = Math.min(words.length, idx + 3);
      return words.slice(start, end).join(' ');
    }
  }

  return 'subtle movement';
}
