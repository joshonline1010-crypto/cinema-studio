import type { APIRoute } from 'astro';

/**
 * Chain Shot API - Creates color-consistent shot transitions
 *
 * Flow:
 * 1. Extract last frame from previous video
 * 2. Generate color-locked edit prompt
 * 3. Create end frame via Nano Banana edit
 * 4. Return start/end frames + motion prompt for Kling O1
 */

const FAL_API_KEY = 'Key 30048d83-df50-41fa-9c2f-61be8fcdb719:8bb12ec91651bf9dc7ee420b44895305';

// Color lock phrases for consistency
const COLOR_LOCK_PREFIX = 'THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.';
const COLOR_LOCK_SUFFIX = 'Same costume, same lighting direction, maintain color grading.';

// Extract motion-only terms from description
function extractMotionPrompt(description: string): string {
  // Motion keywords to keep
  const motionPatterns = [
    /walks?|walking/gi,
    /runs?|running/gi,
    /turns?|turning/gi,
    /looks?|looking/gi,
    /reaches?|reaching/gi,
    /grabs?|grabbing/gi,
    /moves?|moving/gi,
    /dolly|pan|zoom|orbit|tracking|push/gi,
    /slowly|quickly|suddenly|gradually/gi,
    /rises?|rising|falls?|falling/gi,
    /smiles?|smiling|frowns?|frowning/gi,
    /nods?|nodding|shakes?|shaking/gi
  ];

  const words = description.split(/\s+/);
  const motionWords: string[] = [];

  for (const word of words) {
    for (const pattern of motionPatterns) {
      if (pattern.test(word)) {
        motionWords.push(word);
        break;
      }
    }
  }

  // Always add endpoint to prevent processing hangs
  const motionPrompt = motionWords.length > 0
    ? motionWords.join(' ') + ', then settles into position'
    : 'subtle motion, then holds';

  return motionPrompt;
}

// Build color-locked edit prompt
function buildColorLockPrompt(
  shotDescription: string,
  characterDNA?: string
): string {
  const parts = [COLOR_LOCK_PREFIX];

  if (characterDNA) {
    parts.push(`Character: ${characterDNA}.`);
  }

  parts.push(shotDescription);
  parts.push(COLOR_LOCK_SUFFIX);

  return parts.join(' ');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      previous_video_url,      // URL of the previous video to chain from
      next_shot_description,   // What the next shot should show
      character_dna,           // Character description for consistency
      video_model = 'kling-o1', // Model to use (kling-o1 for start→end)
      duration = '5',
      aspect_ratio = '16:9'
    } = body;

    if (!previous_video_url) {
      return new Response(JSON.stringify({
        error: 'previous_video_url required'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!next_shot_description) {
      return new Response(JSON.stringify({
        error: 'next_shot_description required'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Chain shot request:', {
      previous_video_url: previous_video_url.substring(0, 50) + '...',
      next_shot_description: next_shot_description.substring(0, 100),
      video_model,
      duration
    });

    // STEP 1: Extract last frame from previous video
    console.log('Step 1: Extracting last frame...');
    const extractResponse = await fetch(new URL('/api/cinema/extract-frame', request.url).href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_url: previous_video_url,
        position: 'last'
      })
    });

    if (!extractResponse.ok) {
      const error = await extractResponse.json();
      throw new Error(`Frame extraction failed: ${error.details || error.error}`);
    }

    const extractResult = await extractResponse.json();
    const startFrameUrl = extractResult.frame_url;
    console.log('Start frame extracted:', startFrameUrl);

    // STEP 2: Build color-locked edit prompt
    const colorLockPrompt = buildColorLockPrompt(next_shot_description, character_dna);
    console.log('Color lock prompt:', colorLockPrompt.substring(0, 150) + '...');

    // STEP 3: Generate end frame via Nano Banana edit
    console.log('Step 2: Generating end frame with color lock...');
    const editResponse = await fetch('https://fal.run/fal-ai/nano-banana-pro/edit', {
      method: 'POST',
      headers: {
        'Authorization': FAL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_urls: [startFrameUrl],
        prompt: colorLockPrompt,
        aspect_ratio,
        resolution: '2K'  // 2K for video (4K too large for Kling)
      })
    });

    if (!editResponse.ok) {
      const errorText = await editResponse.text();
      throw new Error(`End frame generation failed: ${errorText}`);
    }

    const editResult = await editResponse.json();
    const endFrameUrl = editResult.images?.[0]?.url || editResult.image?.url;

    if (!endFrameUrl) {
      throw new Error('No image URL in edit response');
    }

    console.log('End frame generated:', endFrameUrl);

    // STEP 4: Extract motion-only prompt
    const motionPrompt = extractMotionPrompt(next_shot_description);
    console.log('Motion prompt:', motionPrompt);

    // Return all the pieces needed for video generation
    const result = {
      success: true,
      start_frame_url: startFrameUrl,
      end_frame_url: endFrameUrl,
      color_lock_prompt: colorLockPrompt,
      motion_prompt: motionPrompt,
      recommended_model: video_model,
      video_params: {
        type: video_model === 'kling-o1' ? 'video-kling-o1' : 'video-sora-2',
        start_image_url: startFrameUrl,
        end_image_url: video_model === 'kling-o1' ? endFrameUrl : undefined,
        image_url: video_model !== 'kling-o1' ? startFrameUrl : undefined,
        prompt: motionPrompt,
        duration,
        aspect_ratio
      }
    };

    console.log('Chain shot complete:', {
      start: startFrameUrl.substring(0, 50) + '...',
      end: endFrameUrl.substring(0, 50) + '...'
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chain shot error:', error);
    return new Response(JSON.stringify({
      error: 'Chain shot failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
