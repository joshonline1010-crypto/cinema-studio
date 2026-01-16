/**
 * Spec AI Caller - Calls Claude API for spec agents
 *
 * This module provides AI calling capabilities to spec agents so they
 * can use Claude to ACTUALLY THINK about the user's concept instead
 * of just doing keyword matching and template filling.
 */

// Type for AI response
export interface AICallerResponse {
  success: boolean;
  data: any;
  rawText: string;
  provider: 'claude' | 'openai' | 'fallback';
  error?: string;
}

// Type for agent call options
export interface AgentCallOptions {
  systemPrompt: string;
  userMessage: string;
  expectJson?: boolean;
  model?: 'claude-opus' | 'claude-sonnet' | 'gpt-5.2';
}

/**
 * Call the AI API from the browser
 * Uses the existing /api/ai/chat endpoint
 */
export async function callSpecAgent(options: AgentCallOptions): Promise<AICallerResponse> {
  const { systemPrompt, userMessage, expectJson = true, model = 'claude-sonnet' } = options;

  console.log('[SpecAICaller] Calling AI with system prompt length:', systemPrompt.length);
  console.log('[SpecAICaller] User message:', userMessage.substring(0, 100) + '...');

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        sessionId: `spec-agent-${Date.now()}`,
        model: model,
        clearHistory: true,  // Fresh context each call
        extendedThinking: false,  // Don't need thinking for structured output
        systemPrompt: systemPrompt  // Custom system prompt for the agent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SpecAICaller] API error:', response.status, errorText);
      return {
        success: false,
        data: null,
        rawText: '',
        provider: 'fallback',
        error: `API error: ${response.status} - ${errorText}`
      };
    }

    const result = await response.json();
    const responseText = result.response || '';
    const provider = result.provider?.includes('claude') ? 'claude' :
                     result.provider?.includes('openai') ? 'openai' : 'fallback';

    console.log('[SpecAICaller] Got response from:', provider);
    console.log('[SpecAICaller] Response length:', responseText.length);

    // Parse JSON if expected
    let data = responseText;
    if (expectJson) {
      try {
        // Extract JSON from response (might have markdown code blocks)
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                          responseText.match(/(\{[\s\S]*\})/);

        if (jsonMatch) {
          data = JSON.parse(jsonMatch[1]);
          console.log('[SpecAICaller] Successfully parsed JSON');
        } else {
          // Try parsing the whole response as JSON
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.warn('[SpecAICaller] JSON parse failed, returning raw text');
        // Keep data as raw text
      }
    }

    return {
      success: true,
      data,
      rawText: responseText,
      provider: provider as 'claude' | 'openai' | 'fallback'
    };

  } catch (error) {
    console.error('[SpecAICaller] Network error:', error);
    return {
      success: false,
      data: null,
      rawText: '',
      provider: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Build a structured prompt for world engineering
 */
export function buildWorldEngineerPrompt(concept: string, refs: any[]): string {
  const refDescriptions = refs.map((ref, i) =>
    `REF ${i + 1} (${ref.type}): ${ref.name}${ref.description ? ` - ${ref.description}` : ''}`
  ).join('\n');

  return `Analyze this concept and create a complete 3D WORLD STATE with Game Engine precision.

CONCEPT:
"${concept}"

${refs.length > 0 ? `REFERENCE IMAGES PROVIDED:\n${refDescriptions}\n` : ''}
TARGET OUTPUT: Complete world definition with coordinates, entities, camera rigs, and lighting.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation outside JSON.

Think about:
1. WHO are the characters? What do they look like? Where are they positioned?
2. WHAT is the environment? Interior/exterior? Urban/natural? Scale?
3. WHERE is everything in 3D space? Use meters for coordinates.
4. WHAT is the lighting? Time of day? Direction? Color temperature?
5. WHAT are the scale anchors? (human = 1.8m, door = 2.1m)

Return JSON with this structure:
{
  "worldState": {
    "world_id": "world_xxx",
    "environment_geometry": {
      "ground_plane": { "Y": 0 },
      "static_landmarks": ["landmark1", "landmark2"],
      "static_description": "DETAILED description of the environment specific to this concept"
    },
    "lighting": {
      "primary_light_direction": "from upper-left at 45 degrees (or specific to concept)",
      "primary_light_color_temp": "5600K daylight (or specific)",
      "secondary_fill": "soft bounce (or specific)",
      "intensity_baseline": 1.0,
      "direction_locked": true
    },
    "atmospherics": {
      "smoke_baseline": "none|light|medium|heavy",
      "dust_baseline": "none|light|medium|heavy",
      "haze": "none|light|medium|heavy"
    },
    "scale_anchors": [
      { "anchor_name": "human_height", "real_world_reference": "Adult human", "approx_size_m": 1.75 }
    ],
    "entities": []
  },
  "entities": [
    {
      "entity_id": "hero_1",
      "entity_type": "character",
      "identity_lock": true,
      "world_locked_by_default": true,
      "base_world_position": { "x": 0, "y": 0, "z": 0 },
      "base_orientation": { "yaw_deg": 0, "pitch_deg": 0, "roll_deg": 0 },
      "allowed_motion_types": ["rotate_in_place", "pose_change", "micro_shift", "authored_translation"],
      "forbidden_motion_types": ["teleport", "duplicate", "vanish"],
      "appearance_lock_notes": "DETAILED description of character appearance, clothing, features - BE SPECIFIC"
    }
  ],
  "cameraRigs": {
    "camera_rigs": [
      {
        "rig_id": "WIDE_MASTER",
        "camera_position": { "x": 0, "y": 1.5, "z": 10 },
        "look_at": { "x": 0, "y": 1, "z": 0 },
        "default_lens_mm": 35,
        "notes": "Main establishing shot"
      }
    ]
  },
  "sceneGeographyMemory": {
    "hero_side_of_frame": "LEFT|RIGHT|CENTER",
    "villain_side_of_frame": "LEFT|RIGHT|CENTER",
    "light_direction_lock": "upper-left",
    "color_grade_lock": "natural cinematic",
    "forbid_flip": true
  },
  "baseWorldReferencePrompt": "Complete prompt to generate the BASE WORLD IMAGE - include all visual details, lighting, atmosphere. This is the EMPTY SCENE before characters are added."
}`;
}

/**
 * Build a structured prompt for beat planning
 */
export function buildBeatPlannerPrompt(
  storyOutline: string,
  targetDuration: number,
  worldState: any
): string {
  // Calculate expected shot count
  let shotCount = 6;
  if (targetDuration <= 15) shotCount = 3;
  else if (targetDuration <= 30) shotCount = 6;
  else if (targetDuration <= 60) shotCount = 12;
  else if (targetDuration <= 90) shotCount = 18;
  else shotCount = Math.ceil(targetDuration / 5);

  return `Plan the BEATS (story moments) for this video with GAME ENGINE precision.

STORY CONCEPT:
"${storyOutline}"

TARGET DURATION: ${targetDuration} seconds
EXPECTED SHOTS: ${shotCount} shots (each ~5 seconds)

WORLD STATE (already established):
${JSON.stringify(worldState, null, 2)}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation.

For each beat, think about:
1. WHAT HAPPENS in this moment? Be specific to the story.
2. WHERE are the characters in 3D space? (Use coordinates from world state)
3. HOW should the camera frame this? (Use rig IDs: WIDE_MASTER, OTS_A, CU_A, etc.)
4. WHAT is the emotional intensity? (1-5 scale)
5. WHAT can change and what is FORBIDDEN to change?

Return JSON:
{
  "beats": [
    {
      "beat_id": "beat_01",
      "timecode_range_seconds": { "start": 0, "end": 5 },
      "distance_state": "FAR|APPROACH|ENGAGEMENT|CLOSE_QUARTERS|AFTERMATH|EXIT",
      "information_owner": "HERO|VILLAIN|NEUTRAL|AUDIENCE_ONLY",
      "camera_intent": "REVEAL|PURSUIT|DOMINANCE|VULNERABILITY|PRECISION|SCALE|INTIMACY",
      "energy_level": 1,
      "shot_mode": "NEW_SHOT|MUTATE_PREVIOUS",
      "camera_rig_id": "WIDE_MASTER",
      "lens_mm": 35,
      "actor_positions": [
        { "actor": "hero", "position": [0, 0, 0], "locked": true },
        { "actor": "threat", "position": [-5, 0, 12], "locked": false }
      ],
      "screen_anchors": [
        { "actor": "hero", "ndc": [0.7, 0.55], "drift": 0.03 }
      ],
      "compass": {
        "movement_direction": "SOUTH",
        "key_light_from": "NORTH_WEST"
      },
      "start_frame_ref": { "type": "BASE_WORLD|PREVIOUS_LAST_FRAME", "ref": "" },
      "world_lock": {
        "world_id": "${worldState?.world_id || 'world_001'}",
        "entities_locked": true,
        "lighting_direction_locked": true,
        "color_grade_locked": true,
        "direction_lock": "LEFT_TO_RIGHT"
      },
      "allowed_deltas": ["expression_change", "pose_shift", "movement"],
      "forbidden_changes": ["mirroring", "identity_drift", "teleport", "world_reset"],
      "end_state_truth": "SPECIFIC description of what the audience sees at the END of this beat - BE CONCRETE about character actions, positions, expressions"
    }
  ],
  "totalDuration": ${targetDuration},
  "shotCount": ${shotCount},
  "narrativeArc": "Brief description of the overall story arc"
}`;
}

/**
 * Build a structured prompt for shot compilation
 */
export function buildShotCompilerPrompt(
  beats: any[],
  worldState: any,
  masterRefs: any[]
): string {
  const refList = masterRefs.map((ref, i) =>
    `- ${ref.name} (${ref.type}): ${ref.url || 'pending generation'}`
  ).join('\n');

  return `Compile SHOT CARDS with image generation prompts from these beats.

BEATS TO COMPILE:
${JSON.stringify(beats, null, 2)}

WORLD STATE:
${JSON.stringify(worldState, null, 2)}

MASTER REFERENCES:
${refList || 'No refs yet - generate without character refs'}

IMPORTANT: Return ONLY valid JSON. No markdown.

For EACH beat, create a shot card with:
1. PHOTO PROMPT: Detailed image generation prompt with character, action, environment, lighting
2. VIDEO PROMPT: Motion-only prompt (what MOVES, not what EXISTS)
3. LOCK PHRASES: Identity and continuity lock phrases

PHOTO PROMPT RULES:
- Subject FIRST, technical LAST
- Include "THIS EXACT CHARACTER" for character shots
- Include actual character description from world state
- Include environment and lighting details
- End with technical: "35mm lens, cinematic depth of field"

VIDEO PROMPT RULES:
- MOTION ONLY - image already has visuals
- One camera movement at a time
- ALWAYS include endpoint: "then settles", "then holds"
- Use power verbs: STRIDE, BILLOW, SURGE (not "walk", "move")
- Keep under 50 words

Return JSON:
{
  "shotCards": [
    {
      "shot_id": "shot_01",
      "beat_id": "beat_01",
      "photo_prompt": "DETAILED prompt for image generation - include character description, action, environment, lighting, camera angle. BE SPECIFIC to this story.",
      "video_prompt": "Motion-only prompt. Character advances forward, camera holds steady, slight ambient movement, then settles.",
      "identity_lock_phrase": "THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE. Maintain costume, maintain lighting direction, maintain color grading.",
      "camera_rig_id": "WIDE_MASTER",
      "lens_mm": 35,
      "duration_seconds": 5,
      "model_recommendation": "kling-2.6|kling-o1|seedance-1.5",
      "requires_end_frame": false,
      "ref_urls": ["url1", "url2"]
    }
  ]
}`;
}

export default {
  callSpecAgent,
  buildWorldEngineerPrompt,
  buildBeatPlannerPrompt,
  buildShotCompilerPrompt
};
