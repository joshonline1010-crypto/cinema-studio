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

// ============================================
// SYSTEM PROMPT
// ============================================

const SHOT_COMPILER_SYSTEM_PROMPT = `You are the SHOT COMPILER AGENT for the AI2Studio production system.

## YOUR ROLE
You turn BEATS into executable SHOT CARDS.
Each shot card contains everything needed to generate one image and one video.

## IMAGE PROMPTING RULES (Nano Banana Pro)

### Order
Subject FIRST → then environment → then camera → then lighting → then technical

### Key Rules
- 2K for speed (4K only final upscale)
- Prompt improver OFF
- Use anchor phrase: "THIS EXACT CHARACTER"
- Lighting described as SOURCE (e.g., "sunset from upper-left") not mood
- Last Frame = Image 1 (highest continuity priority)

### Template - Single Character
\`\`\`
THIS EXACT CHARACTER [pose/action],
[same world/environment],
[lighting SOURCE],
[camera distance], [lens]mm,
NO MIRRORING. NO DIRECTION FLIP.
Ultra-detailed fluffy 3D cinematic render, soft lighting, soft shadows, clean depth of field.
\`\`\`

### Template - Continuation
\`\`\`
Continue from Image 1.
Same world state, same lighting direction, same color grade.
Only apply this delta: [state change].
Forbidden: identity change, geometry reset, scale drift, mirroring.
\`\`\`

## VIDEO PROMPTING RULES (Kling / Seedance)

### Core Formula
[CAMERA MOVEMENT], [SUBJECT MOTION], [BACKGROUND MOTION], [ENDPOINT]

### Key Rules
- Video prompt describes MOTION ONLY, not visuals (image has all visual info)
- ONE camera movement max (or none)
- Always include motion endpoint ("then settles")
- Duration only 5s or 10s
- Use power verbs: CHARGING / BILLOWING / ERUPTING / SLAMMING

### Working Camera Phrases
- "static shot, subtle drift"
- "slow push-in on face, then holds"
- "smooth tracking shot from side"
- "slow 180-degree orbit, then settles"
- "pull back revealing full scene"

### Motion Endpoints (Anti-Hang)
- "then settles"
- "then holds"
- "then comes to rest"
- "then stops"

## MODEL ROUTING

Decision tree:
1. Does character speak on camera? → SEEDANCE 1.5
2. Is it START→END state change? → KLING O1
3. Otherwise → KLING 2.6

## REF STACK ORDER

For each shot, refs should be stacked:
1. LAST_FRAME (from previous shot - highest priority)
2. CHARACTER_MASTER (for character consistency)
3. ENVIRONMENT_MASTER (for world consistency)
4. Additional refs as needed

## CONTINUITY LOCK PHRASES

Always append to prompts when chaining:
"THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE. NO MIRRORING. NO DIRECTION FLIP."

## OUTPUT FORMAT

For each beat, output a shot card:

\`\`\`json
{
  "shot_id": "shot_01",
  "beat_id": "beat_01",
  "type": "STATE_IMAGE",
  "camera_rig_id": "WIDE_MASTER",
  "lens_mm": 24,
  "direction_lock": "LEFT_TO_RIGHT",
  "refs": {
    "image_1": "LAST_FRAME",
    "image_2": "CHARACTER_MASTER",
    "image_3": "ENVIRONMENT_MASTER",
    "others": []
  },
  "photo_prompt": "...",
  "video_model": "kling-2.6",
  "video_duration_seconds": 5,
  "video_motion_prompt": "...",
  "start_end_pairing": {
    "start_frame": "this_shot_image",
    "end_frame": "next_shot_image_or_generated",
    "notes": ""
  },
  "continuity_phrases": ["THIS EXACT CHARACTER", "NO MIRRORING", "NO DIRECTION FLIP"]
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
    console.log('[ShotCompiler] Compiling', input.beats.length, 'beats into shot cards');

    const shotCards: ShotCard[] = [];

    for (let i = 0; i < input.beats.length; i++) {
      const beat = input.beats[i];
      const prevBeat = i > 0 ? input.beats[i - 1] : null;
      const nextBeat = i < input.beats.length - 1 ? input.beats[i + 1] : null;

      const shotCard = compileBeatToShotCard(
        beat,
        prevBeat,
        nextBeat,
        input.worldState,
        input.cameraRigs,
        input.masterRefs,
        i
      );

      shotCards.push(shotCard);
    }

    console.log('[ShotCompiler] Generated', shotCards.length, 'shot cards');

    return { shotCards };
  }
};

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
  index: number
): ShotCard {
  // Determine if character speaks (for model routing)
  const characterSpeaks = beat.allowed_deltas.some(d =>
    d.includes('lip_sync') || d.includes('dialogue') || d.includes('speaks')
  );

  // Determine if START→END transition needed
  const needsStartEnd = beat.camera_intent === 'REVEAL' ||
    beat.distance_state !== prevBeat?.distance_state ||
    beat.energy_level - (prevBeat?.energy_level || 1) >= 2;

  // Route model
  const videoModel = routeModel({
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
    camera_rig_id: beat.camera_rig_id,
    lens_mm: beat.lens_mm,
    direction_lock: beat.world_lock.direction_lock,
    refs,
    photo_prompt: photoPrompt,
    video_model: videoModel,
    video_duration_seconds: 5,
    video_motion_prompt: motionPrompt,
    start_end_pairing: startEndPairing,
    continuity_phrases: continuityPhrases
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
