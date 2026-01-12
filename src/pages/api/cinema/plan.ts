import type { APIRoute } from 'astro';

// Scene planning endpoint - uses Claude to generate a full shot plan
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// System prompt for scene planning
const PLANNING_SYSTEM_PROMPT = `You are a professional film director and cinematographer. Given a video concept, you create detailed shot-by-shot plans.

OUTPUT FORMAT: Return ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "scene_id": "unique_snake_case_id",
  "name": "Scene Name",
  "description": "What happens in this scene",
  "duration_estimate": 60,
  "location": "Location description",
  "time_of_day": "day|night|dawn|dusk",
  "mood": "comedic|dramatic|tense|peaceful|action",
  "color_palette": "warm|cool|neutral|vibrant|desaturated",
  "aspect_ratio": "16:9",
  "director": "Director Style (e.g., Edgar Wright, Wes Anderson)",

  "character_references": {
    "character_id": {
      "id": "character_id",
      "name": "Display Name",
      "description": "Physical description",
      "costume": "What they wear",
      "generate_prompt": "Full prompt to generate character reference image"
    }
  },

  "shots": [
    {
      "shot_id": "S01_B01_C01",
      "order": 1,
      "shot_type": "wide|medium|close-up|extreme-close-up|insert|establishing",
      "subject": "Who/what is in frame",
      "location": "specific location",
      "duration": 3,
      "model": "seedance-1.5|kling-o1|kling-2.6",
      "dialog": "What character says (only if speaking)",
      "photo_prompt": "Full image generation prompt with style, lighting, composition",
      "motion_prompt": "Video motion only - camera movement and subject action, ending with motion endpoint",
      "transition_out": "cut|whip-pan|fade|dissolve",
      "narrative_beat": "story_moment_tag"
    }
  ]
}

SHOT NAMING CONVENTION:
- S## = Segment number (S01, S02, etc.)
- B## = Beat within segment (B01, B02, etc.)
- C## = Camera/cut within beat (C01, C02, etc.)
Example: S01_B02_C03 = Segment 1, Beat 2, Camera 3

MODEL SELECTION RULES (CRITICAL):
- "seedance-1.5": Use when character SPEAKS dialog, lip-sync needed, cartoon/animated characters
- "kling-o1": Use for START→END transitions, zoom/orbit, state changes with specific end frame
- "kling-2.6": Use for action, environment motion, no dialog, dynamic camera

MOTION PROMPT RULES:
- ONLY describe motion, not visual details (image has all visual info)
- ONE camera movement per shot
- ALWAYS end with motion endpoint: "then settles", "then holds", "then stops"
- Use power verbs: WALKING, BILLOWING, CHARGING (not "moving", "going")

PROMPT STRUCTURE:
Subject → Action → Environment → Style → Camera → Lighting → Technical

ESCALATION FORMULA (for disaster/adventure videos):
- Start calm, build tension
- Each segment should escalate in intensity
- Alternate between wide establishing shots and close reaction shots

Generate between 6-20 shots depending on the video length requested.`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { description, style = 'cinematic', director, characters } = body as {
      description: string;
      style?: string;
      director?: string;
      characters?: string[];
    };

    if (!description) {
      return new Response(JSON.stringify({ error: 'description is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for API key
    if (!ANTHROPIC_API_KEY) {
      // Fallback to demo plan for testing
      console.log('No ANTHROPIC_API_KEY, returning demo plan');
      return new Response(JSON.stringify(generateDemoPlan(description)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the user message
    let userMessage = `Create a shot-by-shot plan for this video:\n\n${description}`;

    if (style) {
      userMessage += `\n\nStyle: ${style}`;
    }
    if (director) {
      userMessage += `\nDirector reference: ${director}`;
    }
    if (characters && characters.length > 0) {
      userMessage += `\nMain characters: ${characters.join(', ')}`;
    }

    console.log('Planning request:', userMessage.substring(0, 200));

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: PLANNING_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);

      // Return demo plan on API error
      return new Response(JSON.stringify(generateDemoPlan(description)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    // Parse JSON from response
    let plan;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse plan JSON:', parseError);
      console.log('Raw content:', content.substring(0, 500));

      // Return demo plan on parse error
      return new Response(JSON.stringify(generateDemoPlan(description)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure required fields
    plan.created_at = new Date().toISOString();
    plan.updated_at = new Date().toISOString();

    // Add status to shots
    if (plan.shots) {
      plan.shots = plan.shots.map((shot: any, index: number) => ({
        ...shot,
        order: shot.order || index + 1,
        status: 'pending'
      }));
    }

    console.log(`Generated plan: ${plan.name} with ${plan.shots?.length || 0} shots`);

    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Plan API error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Demo plan generator for testing without API key
function generateDemoPlan(description: string) {
  const words = description.split(' ').slice(0, 3).join('_').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const sceneId = words || 'demo_scene';

  return {
    scene_id: sceneId,
    name: description.split('.')[0].substring(0, 50) || 'Demo Scene',
    description: description,
    duration_estimate: 45,
    location: 'Various locations',
    time_of_day: 'day',
    mood: 'cinematic',
    color_palette: 'vibrant',
    aspect_ratio: '16:9',
    director: 'Demo Director',

    character_references: {
      main_character: {
        id: 'main_character',
        name: 'Main Character',
        description: 'The protagonist of the scene',
        costume: 'Casual attire',
        generate_prompt: 'Character portrait, cinematic lighting, 8K'
      }
    },

    shots: [
      {
        shot_id: 'S01_B01_C01',
        order: 1,
        shot_type: 'establishing',
        subject: 'Location',
        location: 'Main location',
        duration: 3,
        model: 'kling-2.6',
        photo_prompt: 'Wide establishing shot of the location, golden hour lighting, cinematic composition, 8K',
        motion_prompt: 'Slow dolly forward, camera gently pushes in, then settles',
        transition_out: 'cut',
        narrative_beat: 'opening',
        status: 'pending'
      },
      {
        shot_id: 'S01_B01_C02',
        order: 2,
        shot_type: 'medium',
        subject: 'Main Character',
        location: 'Main location',
        duration: 4,
        model: 'kling-2.6',
        photo_prompt: 'Medium shot of main character, looking determined, dramatic lighting, cinematic, 8K',
        motion_prompt: 'Character walks forward slowly, wind moves through hair, then stops and looks up',
        transition_out: 'cut',
        narrative_beat: 'introduction',
        status: 'pending'
      },
      {
        shot_id: 'S01_B02_C01',
        order: 3,
        shot_type: 'close-up',
        subject: 'Main Character face',
        location: 'Main location',
        duration: 3,
        model: 'seedance-1.5',
        dialog: 'This is just the beginning...',
        photo_prompt: 'Close-up of character face, expressive eyes, soft rim lighting, cinematic depth of field, 8K',
        motion_prompt: 'Subtle head movement as character speaks, slight smile forms, then holds',
        transition_out: 'fade',
        narrative_beat: 'dialog',
        status: 'pending'
      },
      {
        shot_id: 'S02_B01_C01',
        order: 4,
        shot_type: 'wide',
        subject: 'Action scene',
        location: 'Secondary location',
        duration: 5,
        model: 'kling-2.6',
        photo_prompt: 'Wide action shot, dynamic composition, dramatic sky, motion blur elements, cinematic, 8K',
        motion_prompt: 'Fast tracking shot following action, camera sweeps around subject, then pulls back to reveal',
        transition_out: 'whip-pan',
        narrative_beat: 'action_peak',
        status: 'pending'
      },
      {
        shot_id: 'S02_B02_C01',
        order: 5,
        shot_type: 'medium',
        subject: 'Aftermath',
        location: 'Secondary location',
        duration: 4,
        model: 'kling-2.6',
        photo_prompt: 'Medium shot aftermath scene, dust settling, character in frame, moody lighting, cinematic, 8K',
        motion_prompt: 'Slow push in on character, debris settles around them, then camera holds steady',
        transition_out: 'dissolve',
        narrative_beat: 'resolution',
        status: 'pending'
      },
      {
        shot_id: 'S02_B02_C02',
        order: 6,
        shot_type: 'wide',
        subject: 'Final shot',
        location: 'Main location',
        duration: 4,
        model: 'kling-o1',
        photo_prompt: 'Wide final shot, character silhouette against dramatic sky, golden hour, epic composition, 8K',
        motion_prompt: 'Slow dolly out to reveal full scene, then gentle tilt up to sky, holds on final frame',
        transition_out: 'fade',
        narrative_beat: 'ending',
        status: 'pending'
      }
    ],

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
