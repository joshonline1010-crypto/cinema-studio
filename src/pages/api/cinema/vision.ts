import type { APIRoute } from 'astro';

// Vision API - analyze images and generate smart prompts
// Tries n8n Vision Agent first, falls back to preset prompts

const N8N_VISION_WEBHOOK = 'http://localhost:5678/webhook/vision-edit-prompt';

// Preset close-up prompts based on task type
const CLOSEUP_PRESETS = {
  dialogue: `THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Cinematic close-up shot, face fills 70% of frame, shallow depth of field f/1.4,
soft bokeh background, prepared for dialogue scene, expressive eyes with catchlight,
natural skin texture, subtle rim light. Same costume, same lighting direction.
8K detail, photorealistic, cinematic color grading.`,

  emotional: `THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Extreme close-up, eyes and upper face fill frame, intimate emotional moment,
catch light reflecting in eyes, shallow depth of field, soft skin detail.
Same costume, same lighting. Cinematic 8K.`,

  reaction: `THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Medium close-up, head and shoulders visible, reaction shot ready,
natural expression, soft fill light, clean background separation.
Same costume, same lighting direction. 8K cinematic.`,

  profile: `THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Side profile close-up, 45-degree angle from current position, silhouette edge light,
dramatic side lighting, same color palette, cinematic depth.
Same costume, same lighting setup. 8K detail.`
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { image_url, task, character_dna, prompt } = body;

    if (!image_url) {
      return new Response(JSON.stringify({ error: 'image_url required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Task-based close-up generation
    if (task === 'closeup') {
      // Try n8n Vision Agent first
      try {
        const n8nResponse = await fetch(N8N_VISION_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference_image_url: image_url,
            task: 'closeup',
            character_dna: character_dna || ''
          }),
          signal: AbortSignal.timeout(10000) // 10s timeout
        });

        if (n8nResponse.ok) {
          const n8nData = await n8nResponse.json();
          if (n8nData.closeup_prompt || n8nData.edit_prompt) {
            return new Response(JSON.stringify({
              success: true,
              closeup_prompt: n8nData.closeup_prompt || n8nData.edit_prompt,
              source: 'n8n-vision'
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      } catch (n8nErr) {
        console.warn('n8n Vision Agent not available:', n8nErr);
      }

      // Fallback to preset prompts
      const dnaPrefix = character_dna ? `${character_dna}. ` : '';
      const closeupPrompt = dnaPrefix + CLOSEUP_PRESETS.dialogue;

      return new Response(JSON.stringify({
        success: true,
        closeup_prompt: closeupPrompt,
        source: 'preset'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generic image description task
    if (prompt) {
      // Try n8n for general vision tasks
      try {
        const n8nResponse = await fetch(N8N_VISION_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference_image_url: image_url,
            prompt: prompt
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (n8nResponse.ok) {
          const n8nData = await n8nResponse.json();
          return new Response(JSON.stringify({
            success: true,
            description: n8nData.description || n8nData.edit_prompt || 'No description available',
            source: 'n8n-vision'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (n8nErr) {
        console.warn('n8n Vision not available for prompt task');
      }

      // Fallback - return generic response
      return new Response(JSON.stringify({
        success: false,
        error: 'Vision analysis not available',
        source: 'none'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'task or prompt required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Vision API error:', error);
    return new Response(JSON.stringify({
      error: 'Vision processing failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
