/**
 * ShotCompilerAgent - Turns beats into executable shot cards
 *
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * Responsibilities:
 * - Turn each beat into Nano Banana prompt (image state)
 * - Turn each beat into Kling prompt (motion only)
 * - Plan Start/End frame pairing
 *
 * Rules:
 * - photo_and_video_planned_together
 * - use_ref_stack_order
 * - apply_continuity_lock_phrases
 * - choose_model_deterministically
 */

import type {
  SpecAgent,
  ShotCompilerInput,
  ShotCompilerOutput,
  ShotCard,
  BeatDefinition,
  WorldStateJSON,
  CameraRigsJSON,
  MasterRef
} from './specTypes';
import { PROMPT_TEMPLATES, GLOBAL_CONSTRAINTS, routeModel } from './specTypes';
import type { VideoModel } from './types';
import { callSpecAgent, buildShotCompilerPrompt } from './specAICaller';

// ============================================
// SYSTEM PROMPT
// ============================================

const SHOT_COMPILER_SYSTEM_PROMPT = `You are the SHOT COMPILER AGENT.

## CORE DOCTRINE
You compile BEATS into SHOT CARDS using the GAME ENGINE approach.
You treat the AI like Unreal Engine, not Photoshop.

## THE 3-LAYER OUTPUT (Every Shot Must Have)

### LAYER 1 — WORLD SPACE COORDINATES
Every actor has EXACT coordinates in METERS:
\`\`\`
Hero at (0, 0, 0) — LOCKED
Villain at (-5, 0, 8) — LOCKED
Camera at (-10, 2, -5)
\`\`\`

In your prompt, include: "Hero at world position (0,0,0), villain at (-5,0,8)"

### LAYER 2 — CAMERA DEFINITION
\`\`\`
Camera: position (-10, 2, -5), lookAt (0, 1.2, 4)
Lens: 35mm — LOCKED (NEVER CHANGES)
\`\`\`

KEY RULE: Lens is SACRED. Never zoom. Never crop. Distance = camera movement only.

### LAYER 3 — SCREEN SPACE ANCHORS (NDC)
Pin actors to screen positions to prevent drift:
\`\`\`
Hero anchored to screen (0.70, 0.55) ±3%
Villain anchored to screen (0.30, 0.50) ±6%
\`\`\`

In your prompt, include: "Hero in right-center of frame (70% from left), villain in left-center (30% from left)"

## TIME SYSTEM (Explicit Deltas)

Each shot has:
- time_start_seconds
- time_end_seconds
- time_delta (how much time passes)

Example for 30s video with 6 shots:
- Shot 1: 0.0s → 5.0s (delta: 5.0s)
- Shot 2: 5.0s → 10.0s (delta: 5.0s)
- etc.

NO REWINDS. Time only moves forward.

## COMPASS-BASED LIGHTING

Use compass directions for lighting:
\`\`\`
Key light from NORTH_WEST (upper-left)
Fill from EAST (right side)
5600K daylight
\`\`\`

In your prompt: "Key light from upper-left (northwest), warm fill from right"

## OBJECT PERSISTENCE

Objects that appear MUST persist:
- Debris remains visible
- Damage accumulates
- No magic resets

In your prompt: "Previous debris still visible, dust settling"

## IMAGE PROMPTING (Game Engine Style)

### Template
\`\`\`
[WORLD COORDINATES]: Hero at (0,0,0), Villain at (-5,0,8).
[SCREEN ANCHORS]: Hero right-center (70%), Villain left-center (30%).
[CAMERA]: 35mm lens from position (-10, 2, -5).
[LIGHTING]: Key light from NORTH_WEST, fill from EAST.
[ACTION]: [what happens in this shot].
[CONTINUITY]: THIS EXACT CHARACTER, THIS EXACT WORLD.
NO MIRRORING. NO DIRECTION FLIP. NO SCALE DRIFT.
\`\`\`

### Order
1. World positions (coordinates)
2. Screen anchors (NDC)
3. Camera (position, lens)
4. Lighting (compass)
5. Action (what changes)
6. Continuity locks

## VIDEO PROMPTING (Motion Only)

Formula: [CAMERA MOVEMENT], [SUBJECT MOTION], [BACKGROUND MOTION], [ENDPOINT]

### CRITICAL
- Video prompt = MOTION ONLY (image has all visual info)
- ONE camera movement max
- ALWAYS include endpoint ("then settles")
- Duration: 5s or 10s only

### Power Verbs
CHARGING, BILLOWING, ERUPTING, SLAMMING, ADVANCING, RECOILING

### Endpoints (Prevent 99% Hang)
"then settles", "then holds", "then stops", "then comes to rest"

## MODEL ROUTING

1. Character SPEAKS on camera? → SEEDANCE 1.5
2. START→END state change? → KLING O1
3. Motion/action? → KLING 2.6

## OUTPUT FORMAT

\`\`\`json
{
  "shot_id": "shot_01",
  "beat_id": "beat_01",

  // LAYER 1: World Space
  "actor_positions": [
    { "actor": "hero", "position": [0, 0, 0], "locked": true },
    { "actor": "villain", "position": [-5, 0, 8], "locked": true }
  ],

  // LAYER 2: Camera Space
  "camera": {
    "position": [-10, 2, -5],
    "look_at": [0, 1.2, 4],
    "lens_mm": 35
  },

  // LAYER 3: Screen Space
  "screen_anchors": [
    { "actor": "hero", "ndc": [0.70, 0.55], "drift": 0.03 },
    { "actor": "villain", "ndc": [0.30, 0.50], "drift": 0.06 }
  ],

  // Time
  "timing": {
    "start_seconds": 0.0,
    "end_seconds": 5.0,
    "delta_seconds": 5.0
  },

  // Lighting (Compass)
  "lighting": {
    "key_from": "NORTH_WEST",
    "fill_from": "EAST"
  },

  // Prompts
  "photo_prompt": "...",
  "video_model": "kling-2.6",
  "video_duration_seconds": 5,
  "video_motion_prompt": "...",

  "continuity_phrases": [
    "THIS EXACT CHARACTER",
    "THIS EXACT WORLD",
    "NO MIRRORING",
    "NO DIRECTION FLIP",
    "NO SCALE DRIFT"
  ]
}
\`\`\``;

// ============================================
// SHOT COMPILER AGENT
// ============================================

export const shotCompilerAgent: SpecAgent = {
  role: 'shot_compiler',
  name: 'Shot Compiler Agent',
  icon: '🎬',
  color: 'orange',
  systemPrompt: SHOT_COMPILER_SYSTEM_PROMPT,

  async execute(input: ShotCompilerInput): Promise<ShotCompilerOutput> {
    console.log('[ShotCompiler] 🧠 CALLING CLAUDE AI to compile shot cards...');
    console.log('[ShotCompiler] Beats to compile:', input.beats.length);

    // Build the user prompt for Claude
    const userPrompt = buildShotCompilerPrompt(
      input.beats,
      input.worldState,
      input.masterRefs
    );

    // Call Claude with the system prompt
    const aiResponse = await callSpecAgent({
      systemPrompt: SHOT_COMPILER_SYSTEM_PROMPT,
      userMessage: userPrompt,
      expectJson: true,
      model: 'claude-sonnet'
    });

    if (!aiResponse.success) {
      console.error('[ShotCompiler] AI call failed:', aiResponse.error);
      console.log('[ShotCompiler] Falling back to template-based compilation...');
      return compileShotCardsFallback(input);
    }

    console.log('[ShotCompiler] ✅ Got AI response from:', aiResponse.provider);

    // Parse the AI response
    const aiData = aiResponse.data;

    try {
      // Extract shot cards from AI response
      const shotCards: ShotCard[] = (aiData.shotCards || []).map((aiShot: any, index: number) => {
        const beat = input.beats[index] || input.beats[0];

        // GET DIRECTOR'S PLAN FOR THIS SHOT (contains video_model, shot_type, etc.)
        const directorShot = input.directorPlan?.shotSequence?.[index];

        // Use Director's video_model if available, otherwise fallback to routing logic
        const characterSpeaks = directorShot?.dialogue_info?.has_dialogue ||
          beat.allowed_deltas?.some((d: string) =>
            d.includes('lip_sync') || d.includes('dialogue') || d.includes('speaks')
          ) || false;
        const needsStartEnd = aiShot.requires_end_frame || false;
        const videoModel = directorShot?.video_model ||
          aiShot.model_recommendation ||
          routeModel({ characterSpeaksOnCamera: characterSpeaks, needsStartEndStateChange: needsStartEnd });

        // Get script line for this shot if available
        const scriptLine = input.script?.find(s => s.shot_number === index + 1);

        return {
          shot_id: aiShot.shot_id || `shot_${String(index + 1).padStart(2, '0')}`,
          beat_id: aiShot.beat_id || beat.beat_id || `beat_${String(index + 1).padStart(2, '0')}`,
          type: 'STATE_IMAGE' as const,
          // USE DIRECTOR'S SHOT TYPE
          shot_type: directorShot?.shot_type || aiShot.shot_type || beat.camera_rig_id || 'WIDE_MASTER',
          camera_rig_id: directorShot?.camera_rig || aiShot.camera_rig_id || beat.camera_rig_id || 'WIDE_MASTER',
          lens_mm: directorShot?.lens_mm || aiShot.lens_mm || beat.lens_mm || 35,
          direction_lock: beat.world_lock?.direction_lock || 'LEFT_TO_RIGHT',
          refs: {
            image_1: index > 0 ? 'LAST_FRAME' : 'BASE_WORLD',
            image_2: aiShot.ref_urls?.[0] || '',
            image_3: aiShot.ref_urls?.[1] || '',
            others: aiShot.ref_urls?.slice(2) || []
          },
          photo_prompt: aiShot.photo_prompt || 'Scene continues',
          // USE DIRECTOR'S VIDEO MODEL
          video_model: videoModel,
          video_duration_seconds: directorShot?.duration_seconds || aiShot.duration_seconds || 5,
          video_motion_prompt: aiShot.video_prompt || 'Static shot, subtle ambient movement, then settles',
          start_end_pairing: {
            start_frame: 'this_shot_image',
            end_frame: needsStartEnd ? 'next_shot_image' : '',
            notes: ''
          },
          continuity_phrases: aiShot.identity_lock_phrase?.split('. ') || [
            'THIS EXACT CHARACTER',
            'THIS EXACT LIGHTING',
            'NO MIRRORING'
          ],
          // DIRECTOR'S SORA FLAGS
          sora_candidate: directorShot?.sora_candidate || false,
          sora_preset: directorShot?.sora_preset,
          sora_reason: directorShot?.sora_reason,
          model_reasoning: directorShot?.model_reasoning,
          // DIALOGUE INFO (from Director + Script)
          dialogue_info: directorShot?.dialogue_info ? {
            has_dialogue: directorShot.dialogue_info.has_dialogue,
            speech_mode: directorShot.dialogue_info.speech_mode,
            character: directorShot.dialogue_info.character,
            line_summary: scriptLine?.line_text || directorShot.dialogue_info.line_summary
          } : undefined
        };
      });

      console.log('[ShotCompiler] 🎬 Generated', shotCards.length, 'shot cards by AI');
      shotCards.forEach((card, i) => {
        console.log(`[ShotCompiler]   Shot ${i + 1}: ${card.photo_prompt?.substring(0, 80)}...`);
      });

      return { shotCards };
    } catch (parseError) {
      console.error('[ShotCompiler] Error parsing AI response:', parseError);
      console.log('[ShotCompiler] AI raw response:', aiResponse.rawText.substring(0, 500));
      return compileShotCardsFallback(input);
    }
  }
};

// Fallback when AI fails
function compileShotCardsFallback(input: ShotCompilerInput): ShotCompilerOutput {
  console.log('[ShotCompiler] Using template fallback...');

  const shotCards: ShotCard[] = [];

  for (let i = 0; i < input.beats.length; i++) {
    const beat = input.beats[i];
    const prevBeat = i > 0 ? input.beats[i - 1] : null;
    const nextBeat = i < input.beats.length - 1 ? input.beats[i + 1] : null;

    // GET DIRECTOR'S PLAN FOR THIS SHOT
    const directorShot = input.directorPlan?.shotSequence?.[i];
    const scriptLine = input.script?.find(s => s.shot_number === i + 1);

    const shotCard = compileBeatToShotCard(
      beat,
      prevBeat,
      nextBeat,
      input.worldState,
      input.cameraRigs,
      input.masterRefs,
      i,
      directorShot,
      scriptLine
    );

    shotCards.push(shotCard);
  }

  return { shotCards };
}

// ============================================
// BEAT TO SHOT CARD COMPILATION
// ============================================

function compileBeatToShotCard(
  beat: BeatDefinition,
  prevBeat: BeatDefinition | null,
  nextBeat: BeatDefinition | null,
  worldState: WorldStateJSON,
  cameraRigs: CameraRigsJSON,
  masterRefs: MasterRef[],
  index: number,
  directorShot?: any,
  scriptLine?: any
): ShotCard {
  // Determine if character speaks (for model routing)
  const characterSpeaks = directorShot?.dialogue_info?.has_dialogue ||
    beat.allowed_deltas?.some(d =>
      d.includes('lip_sync') || d.includes('dialogue') || d.includes('speaks')
    ) || false;

  // Determine if START→END transition needed
  const needsStartEnd = beat.camera_intent === 'REVEAL' ||
    beat.distance_state !== prevBeat?.distance_state ||
    beat.energy_level - (prevBeat?.energy_level || 1) >= 2;

  // USE DIRECTOR'S VIDEO MODEL if available, otherwise fallback to routing
  const videoModel = directorShot?.video_model ||
    routeModel({
      characterSpeaksOnCamera: characterSpeaks,
      needsStartEndStateChange: needsStartEnd
    });

  // Build photo prompt
  const photoPrompt = buildPhotoPrompt(beat, prevBeat, worldState, index);

  // Build video motion prompt
  const motionPrompt = buildMotionPrompt(beat, prevBeat);

  // Determine refs
  const refs = determineRefs(beat, prevBeat, masterRefs, index);

  // Build continuity phrases
  const continuityPhrases = buildContinuityPhrases(beat, prevBeat);

  // Determine start/end pairing
  const startEndPairing = determineStartEndPairing(beat, nextBeat, videoModel);

  return {
    shot_id: `shot_${String(index + 1).padStart(2, '0')}`,
    beat_id: beat.beat_id,
    type: index === 0 ? 'STATE_IMAGE' : 'STATE_IMAGE',
    // USE DIRECTOR'S SHOT TYPE
    shot_type: directorShot?.shot_type || beat.camera_rig_id || 'WIDE_MASTER',
    camera_rig_id: directorShot?.camera_rig || beat.camera_rig_id,
    lens_mm: directorShot?.lens_mm || beat.lens_mm,
    direction_lock: beat.world_lock?.direction_lock || 'LEFT_TO_RIGHT',
    refs,
    photo_prompt: photoPrompt,
    video_model: videoModel,
    video_duration_seconds: directorShot?.duration_seconds || 5,
    video_motion_prompt: motionPrompt,
    start_end_pairing: startEndPairing,
    continuity_phrases: continuityPhrases,
    // DIRECTOR'S SORA FLAGS
    sora_candidate: directorShot?.sora_candidate || false,
    sora_preset: directorShot?.sora_preset,
    sora_reason: directorShot?.sora_reason,
    model_reasoning: directorShot?.model_reasoning,
    // DIALOGUE INFO
    dialogue_info: directorShot?.dialogue_info ? {
      has_dialogue: directorShot.dialogue_info.has_dialogue,
      speech_mode: directorShot.dialogue_info.speech_mode,
      character: directorShot.dialogue_info.character,
      line_summary: scriptLine?.line_text || directorShot.dialogue_info.line_summary
    } : undefined
  };
}

// ============================================
// PHOTO PROMPT BUILDING
// ============================================

function buildPhotoPrompt(
  beat: BeatDefinition,
  prevBeat: BeatDefinition | null,
  worldState: WorldStateJSON,
  index: number
): string {
  const parts: string[] = [];

  // If not first shot, add continuation
  if (prevBeat && index > 0) {
    parts.push('Continue from Image 1');
    parts.push('Same world state, same lighting direction, same color grade');
  }

  // Add character/subject anchor
  if (worldState.entities.length > 0) {
    const mainEntity = worldState.entities[0];
    if (mainEntity.entity_type === 'character') {
      parts.push('THIS EXACT CHARACTER');
    }
  }

  // Add camera info
  const cameraDistance = getCameraDistanceFromRig(beat.camera_rig_id);
  parts.push(`${cameraDistance}, ${beat.lens_mm}mm lens`);

  // Add lighting from world state
  parts.push(`Lighting: ${worldState.lighting.primary_light_direction}`);

  // Add the delta for this beat
  if (beat.allowed_deltas.length > 0) {
    const deltaDescription = beat.allowed_deltas.slice(0, 2).join(', ');
    parts.push(`Only delta: ${deltaDescription}`);
  }

  // Add end state truth
  parts.push(beat.end_state_truth);

  // Add direction lock
  parts.push('NO MIRRORING. NO DIRECTION FLIP');

  // Add quality suffix
  parts.push(PROMPT_TEMPLATES.quality_suffix);

  return parts.join('. ');
}

function getCameraDistanceFromRig(rigId: string): string {
  const rigDistances: Record<string, string> = {
    'WIDE_MASTER': 'wide shot',
    'OTS_A': 'over-the-shoulder medium shot',
    'OTS_B': 'over-the-shoulder medium shot',
    'CU_A': 'close-up',
    'CU_B': 'close-up',
    'REACTION_INSERT': 'extreme close-up',
    'LOW_ANGLE_HERO': 'low angle wide shot',
    'HIGH_ANGLE_VULNERABLE': 'high angle medium shot',
    'TRACKING_LEFT': 'tracking medium shot',
    'TRACKING_RIGHT': 'tracking medium shot',
    'BIRDS_EYE': 'birds-eye view',
    'DUTCH_ANGLE': 'dutch angle medium shot'
  };

  return rigDistances[rigId] || 'medium shot';
}

// ============================================
// MOTION PROMPT BUILDING
// ============================================

function buildMotionPrompt(
  beat: BeatDefinition,
  prevBeat: BeatDefinition | null
): string {
  const parts: string[] = [];

  // Camera movement based on rig and intent
  const cameraMove = getCameraMovement(beat);
  if (cameraMove) {
    parts.push(cameraMove);
  }

  // Subject motion from deltas
  const subjectMotion = getSubjectMotion(beat.allowed_deltas);
  if (subjectMotion) {
    parts.push(subjectMotion);
  }

  // Background motion
  const bgMotion = getBackgroundMotion(beat.energy_level);
  if (bgMotion) {
    parts.push(bgMotion);
  }

  // ALWAYS add endpoint
  parts.push('then settles');

  return parts.join(', ');
}

function getCameraMovement(beat: BeatDefinition): string | null {
  // Map camera intent to movement
  const intentToMovement: Record<string, string> = {
    'REVEAL': 'slow pull back revealing',
    'PURSUIT': 'smooth tracking shot following',
    'DOMINANCE': 'static low angle shot',
    'VULNERABILITY': 'slow push-in from above',
    'CONFUSION': 'slight handheld drift',
    'PRECISION': 'static shot',
    'SCALE': 'slow establishing pan',
    'INTIMACY': 'gentle push-in on face'
  };

  return intentToMovement[beat.camera_intent] || 'static shot';
}

function getSubjectMotion(deltas: string[]): string | null {
  // Map deltas to motion descriptions (power verbs!)
  for (const delta of deltas) {
    if (delta.includes('fast_movement')) return 'subject CHARGING forward';
    if (delta.includes('impact')) return 'SLAMMING collision';
    if (delta.includes('explosion')) return 'ERUPTING outward';
    if (delta.includes('smoke') || delta.includes('debris')) return 'particles BILLOWING';
    if (delta.includes('expression')) return 'subtle expression shift';
    if (delta.includes('turn')) return 'character turns';
    if (delta.includes('gesture')) return 'gentle gesture';
    if (delta.includes('breathing')) return 'subtle breathing motion';
  }
  return null;
}

function getBackgroundMotion(energyLevel: number): string | null {
  if (energyLevel >= 4) return 'environment SHAKING';
  if (energyLevel >= 3) return 'dust particles drifting';
  if (energyLevel >= 2) return 'subtle ambient movement';
  return null;
}

// ============================================
// REF DETERMINATION
// ============================================

function determineRefs(
  beat: BeatDefinition,
  prevBeat: BeatDefinition | null,
  masterRefs: MasterRef[],
  index: number
): ShotCard['refs'] {
  const refs: ShotCard['refs'] = {
    image_1: index > 0 ? 'LAST_FRAME' : 'BASE_WORLD',
    image_2: '',
    image_3: '',
    others: []
  };

  // Find character master
  const characterMaster = masterRefs.find(r => r.type === 'CHARACTER_MASTER');
  if (characterMaster) {
    refs.image_2 = characterMaster.url || 'CHARACTER_MASTER';
  }

  // Find environment master
  const envMaster = masterRefs.find(r => r.type === 'ENVIRONMENT_MASTER');
  if (envMaster) {
    refs.image_3 = envMaster.url || 'ENVIRONMENT_MASTER';
  }

  // Add any prop masters to others
  const propMasters = masterRefs.filter(r => r.type === 'PROP_MASTER');
  refs.others = propMasters.map(p => p.url || p.id);

  return refs;
}

// ============================================
// CONTINUITY PHRASES
// ============================================

function buildContinuityPhrases(
  beat: BeatDefinition,
  prevBeat: BeatDefinition | null
): string[] {
  const phrases: string[] = [];

  // Always include core phrases
  phrases.push('THIS EXACT CHARACTER');
  phrases.push('THIS EXACT LIGHTING');
  phrases.push('THIS EXACT COLOR GRADE');
  phrases.push('NO MIRRORING');
  phrases.push('NO DIRECTION FLIP');

  // Add direction lock phrase
  if (beat.world_lock.direction_lock) {
    phrases.push(`Travel: ${beat.world_lock.direction_lock}`);
  }

  // If continuing from previous shot, add more
  if (prevBeat) {
    phrases.push('Continue from Image 1');
    phrases.push('Same world geometry');
    phrases.push('Same scale anchors');
  }

  return phrases;
}

// ============================================
// START/END PAIRING
// ============================================

function determineStartEndPairing(
  beat: BeatDefinition,
  nextBeat: BeatDefinition | null,
  videoModel: VideoModel
): ShotCard['start_end_pairing'] {
  // Kling O1 needs both start and end frames
  const needsEndFrame = videoModel === 'kling-o1';

  return {
    start_frame: 'this_shot_image',
    end_frame: needsEndFrame
      ? (nextBeat ? 'next_shot_image' : 'generate_end_state')
      : '',
    notes: needsEndFrame
      ? 'Kling O1 requires end frame for state transition'
      : 'Single frame video generation'
  };
}

// ============================================
// EXPORTS
// ============================================

export default shotCompilerAgent;

// Export helper functions for external use
export {
  compileBeatToShotCard,
  buildPhotoPrompt,
  buildMotionPrompt,
  determineRefs,
  buildContinuityPhrases
};
