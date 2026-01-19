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
// NO STATIC SHOTS RULE (CRITICAL!)
// ============================================
// EVERY shot must have movement: zoom, shake, pan, or light change
// Static shots look DEAD and FROZEN - never use them!

const MOVEMENT_ADDITIONS = [
  'slow push-in, then settles',
  'subtle dolly forward, then holds',
  'gentle camera drift, then settles',
  'slight handheld movement, then settles',
  'slow orbit around subject, then holds',
  'subtle zoom in, then settles',
  'gentle pan right, then holds',
  'light flickers subtly, then stabilizes',
  'camera breathes slightly, then settles'
];

function ensureNoStaticShot(motionPrompt: string | undefined): string {
  if (!motionPrompt || motionPrompt.trim() === '') {
    // No prompt - add movement
    return MOVEMENT_ADDITIONS[Math.floor(Math.random() * MOVEMENT_ADDITIONS.length)];
  }

  const lowerPrompt = motionPrompt.toLowerCase();

  // Check if it's a static shot
  const staticIndicators = ['static shot', 'static camera', 'locked off', 'no movement', 'still'];
  const hasMovement = ['dolly', 'push', 'pull', 'pan', 'tilt', 'orbit', 'track', 'zoom', 'drift', 'handheld', 'shake', 'crane', 'aerial', 'follow'];

  const isStatic = staticIndicators.some(s => lowerPrompt.includes(s));
  const alreadyHasMovement = hasMovement.some(m => lowerPrompt.includes(m));

  if (isStatic || !alreadyHasMovement) {
    // Replace static with movement OR add movement
    const movement = MOVEMENT_ADDITIONS[Math.floor(Math.random() * MOVEMENT_ADDITIONS.length)];
    if (isStatic) {
      // Replace "static shot" with movement
      return motionPrompt.replace(/static\s*(shot|camera)?[,.]?\s*/gi, '') + ', ' + movement;
    } else {
      // Add movement to existing prompt
      return motionPrompt + ', ' + movement;
    }
  }

  // Already has movement - ensure it has an endpoint
  if (!lowerPrompt.includes('settles') && !lowerPrompt.includes('holds') && !lowerPrompt.includes('stops')) {
    return motionPrompt + ', then settles';
  }

  return motionPrompt;
}

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

1. Character SPEAKS on camera? → VEED FABRIC (lip sync)
2. Close-up/detail shot? → SORA 2 (excellent quality)
3. START→END state change? → KLING O1
4. Motion/action/wide? → KLING 2.6

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
          video_motion_prompt: ensureNoStaticShot(aiShot.video_prompt),
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
  console.log('[ShotCompiler] Concept available:', !!input.concept);
  console.log('[ShotCompiler] StoryAnalysis available:', !!input.storyAnalysis);

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
      scriptLine,
      input.concept,           // NEW: pass concept
      input.storyAnalysis      // NEW: pass storyAnalysis
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
  scriptLine?: any,
  concept?: string,
  storyAnalysis?: any
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

  // Build video motion prompt - now story-specific using concept!
  const motionPrompt = ensureNoStaticShot(buildMotionPrompt(beat, prevBeat, directorShot, concept, storyAnalysis));

  // Build Sora-specific prompt if video model is sora-2
  const soraPrompt = videoModel === 'sora-2'
    ? buildSoraPrompt(beat, directorShot, concept, storyAnalysis)
    : undefined;

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
    // Sora-specific fields
    sora_prompt: soraPrompt,
    sora_candidate: videoModel === 'sora-2',
    start_end_pairing: startEndPairing,
    continuity_phrases: continuityPhrases,
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
// MOTION PROMPT BUILDING - STORY-SPECIFIC!
// ============================================

function buildMotionPrompt(
  beat: BeatDefinition,
  prevBeat: BeatDefinition | null,
  directorShot?: any,
  concept?: string,
  storyAnalysis?: any
): string {
  const parts: string[] = [];

  // 1. CAMERA MOVEMENT - Based on rig and intent
  const cameraMove = getCameraMovement(beat);
  if (cameraMove) {
    parts.push(cameraMove);
  }

  // 2. SUBJECT MOTION - NOW USE CONCEPT FIRST!
  let storyAction: string | null = null;

  // PRIORITY 1: Extract from original concept (most reliable!)
  if (concept) {
    storyAction = extractActionFromConcept(concept, beat.camera_intent, beat.energy_level);
  }

  // PRIORITY 2: Use extracted_entities from story analysis
  if (!storyAction && storyAnalysis?.extracted_entities) {
    storyAction = buildActionFromEntities(storyAnalysis.extracted_entities, beat.camera_intent);
  }

  // PRIORITY 3: Use end_state_truth if available
  if (!storyAction && beat.end_state_truth && beat.end_state_truth.length > 5) {
    storyAction = extractActionFromBeat(beat.end_state_truth);
  }

  // PRIORITY 4: Fallback to generic delta mapping
  if (!storyAction) {
    const subjectMotion = getSubjectMotion(beat.allowed_deltas);
    if (subjectMotion) {
      storyAction = subjectMotion;
    }
  }

  if (storyAction) {
    parts.push(storyAction);
  }

  // 3. BACKGROUND MOTION - Energy-based
  const bgMotion = getBackgroundMotion(beat.energy_level);
  if (bgMotion) {
    parts.push(bgMotion);
  }

  // 4. ALWAYS ADD ENDPOINT - Prevents Kling hang
  parts.push('then settles');

  return parts.join(', ');
}

/**
 * Extract action from the original concept based on keywords and beat intent
 */
function extractActionFromConcept(concept: string, cameraIntent?: string, energyLevel?: number): string | null {
  const conceptLower = concept.toLowerCase();

  // CHASE/PURSUIT scenes
  if (conceptLower.includes('chase') || conceptLower.includes('running') || conceptLower.includes('fleeing')) {
    if (cameraIntent === 'PURSUIT' || cameraIntent === 'SCALE') {
      return 'subject RUNNING urgently, legs pumping, desperate motion';
    }
    if (cameraIntent === 'INTIMACY' || cameraIntent === 'PRECISION') {
      return 'heavy breathing, fear in eyes, sweat on face';
    }
    return 'urgent running motion, pursuit energy';
  }

  // ESCAPE scenes
  if (conceptLower.includes('escape') || conceptLower.includes('getaway')) {
    if (conceptLower.includes('plane') || conceptLower.includes('aircraft')) {
      return 'desperate dash toward aircraft, reaching for freedom';
    }
    return 'escape motion, urgent movement toward safety';
  }

  // POLICE/PURSUIT by antagonist
  if (conceptLower.includes('police') || conceptLower.includes('cop') || conceptLower.includes('officer')) {
    if (cameraIntent === 'DOMINANCE') {
      return 'authority figures closing in, determined pursuit';
    }
    return 'pursuit closing gap, tension building';
  }

  // VEHICLE scenes
  if (conceptLower.includes('car') || conceptLower.includes('driving') || conceptLower.includes('vehicle')) {
    return 'vehicle in motion, speed blur, urgent driving';
  }

  // PLANE/AIRCRAFT scenes
  if (conceptLower.includes('plane') || conceptLower.includes('aircraft') || conceptLower.includes('takeoff')) {
    return 'aircraft propeller spinning, engines warming, escape imminent';
  }

  // FIGHT/ACTION scenes
  if (conceptLower.includes('fight') || conceptLower.includes('battle') || conceptLower.includes('combat')) {
    if ((energyLevel || 3) >= 4) {
      return 'combat motion, impact, physical intensity';
    }
    return 'tension before strike, ready stance';
  }

  // EMOTIONAL scenes
  if (conceptLower.includes('sad') || conceptLower.includes('cry') || conceptLower.includes('emotional')) {
    return 'subtle emotional shift, tears forming, breath catching';
  }

  return null;
}

// ============================================
// SORA-SPECIFIC PROMPT BUILDING
// ============================================

/**
 * Build Sora prompt - FOCUS ON ONE SUBJECT from the ref image
 *
 * RULES:
 * 1. Sora can only focus on what's IN the ref image
 * 2. Close-up of woman = woman actions ONLY
 * 3. Close-up of dinosaur = dinosaur actions ONLY
 * 4. Use ACTION VERBS in CAPS (SPRINTS, CHARGES, PAWS)
 * 5. Add secondary motion (dust BILLOWS, lights GLOW)
 * 6. Include camera movement
 * 7. End with "then settles" or "then holds"
 */
function buildSoraPrompt(
  beat: BeatDefinition,
  directorShot: any,
  concept?: string,
  storyAnalysis?: any
): string {
  // Determine what the shot is focused on based on rig/shot type
  const shotType = (directorShot?.shot_type || beat.camera_rig_id || '').toLowerCase();
  const isCloseUp = shotType.includes('cu') || shotType.includes('close') || shotType.includes('ecu');
  const isWide = shotType.includes('wide') || shotType.includes('master') || shotType.includes('establish');

  // Get the subject focus from director or default
  const subjectFocus = directorShot?.subject_focus || 'character';

  // Get entities for context
  const entities = storyAnalysis?.extracted_entities || {};
  const protagonist = entities.characters?.find((c: any) => c.role === 'protagonist');
  const antagonist = entities.characters?.find((c: any) => c.role === 'antagonist');

  // Build the action prompt based on shot type and concept
  const actionPrompt = buildSoraActionPrompt(
    concept || '',
    subjectFocus,
    isCloseUp,
    isWide,
    beat.camera_intent,
    beat.energy_level,
    protagonist?.name,
    antagonist?.name
  );

  // Get camera movement
  const cameraMove = getSoraCameraMove(beat.camera_intent, isCloseUp);

  // Combine: Subject ACTION, secondary motion, camera, then holds
  const parts: string[] = [];

  parts.push(actionPrompt);

  if (cameraMove) {
    parts.push(cameraMove);
  }

  // Always end with a hold/settle
  parts.push('then holds final moment');

  return parts.join(', ');
}

/**
 * Build the main action prompt for Sora - SINGLE SUBJECT FOCUS
 */
function buildSoraActionPrompt(
  concept: string,
  subjectFocus: string,
  isCloseUp: boolean,
  isWide: boolean,
  cameraIntent?: string,
  energyLevel?: number,
  protagonistName?: string,
  antagonistName?: string
): string {
  const conceptLower = concept.toLowerCase();
  const energy = energyLevel || 3;

  // Determine the primary subject based on shot focus
  const focusOnProtagonist = subjectFocus.includes('hero') || subjectFocus.includes('character') ||
                             subjectFocus === protagonistName;
  const focusOnAntagonist = subjectFocus.includes('villain') || subjectFocus.includes('threat') ||
                            subjectFocus === antagonistName;

  // CHASE/PURSUIT scenes
  if (conceptLower.includes('chase') || conceptLower.includes('running') || conceptLower.includes('fleeing')) {
    if (isCloseUp) {
      if (focusOnProtagonist || !focusOnAntagonist) {
        // Close-up of person running
        return energy >= 4
          ? `${protagonistName || 'Woman'} SPRINTS forward with desperate urgency, sweat on brow, eyes wide with fear, breath visible`
          : `${protagonistName || 'Woman'} RUNS with determined focus, hair flowing, muscles tensed`;
      } else {
        // Close-up of pursuer
        return `${antagonistName || 'Pursuer'} CHARGES with relentless determination, focused predator gaze`;
      }
    } else {
      // Wide shot - show the chase
      return `${protagonistName || 'Woman'} SPRINTS forward, ${antagonistName || 'pursuer'} CHARGES behind with ground-shaking presence, dust BILLOWS from movement`;
    }
  }

  // ESCAPE/PLANE scenes
  if (conceptLower.includes('escape') && (conceptLower.includes('plane') || conceptLower.includes('aircraft'))) {
    if (isCloseUp) {
      if (subjectFocus.includes('plane') || subjectFocus.includes('vehicle')) {
        return 'Aircraft propeller SPINS with increasing speed, engine ROARS to life, metal GLEAMS under lights';
      } else {
        return `${protagonistName || 'Woman'} REACHES desperately toward aircraft, hope in eyes, fingers STRETCHING`;
      }
    } else {
      return `${protagonistName || 'Woman'} DASHES toward waiting aircraft, propeller SPINS, dust SWIRLS from engine wash`;
    }
  }

  // POLICE/AUTHORITY pursuit
  if (conceptLower.includes('police') || conceptLower.includes('cop')) {
    if (isCloseUp && focusOnAntagonist) {
      return 'Officer ADVANCES with authority, badge GLINTS, radio CRACKLES, determined expression';
    } else if (isCloseUp) {
      return `${protagonistName || 'Woman'} GLANCES back in fear, panic in eyes, chest HEAVES with exertion`;
    } else {
      return `${protagonistName || 'Woman'} FLEES as police CLOSE IN, sirens FLASH in background, tension BUILDS`;
    }
  }

  // DINOSAUR/CREATURE scenes (from the example)
  if (conceptLower.includes('dinosaur') || conceptLower.includes('t-rex') || conceptLower.includes('rex')) {
    if (isCloseUp) {
      if (subjectFocus.includes('rex') || subjectFocus.includes('dinosaur') || focusOnAntagonist) {
        return 'T-Rex PAWS at sealed door in frustration, massive claws SCRAPE against metal, dust SETTLES around the scene';
      } else {
        return `${protagonistName || 'Woman'} appears in window showing relief, breath FOGS glass, warning lights continue steady GLOW`;
      }
    } else {
      return `T-Rex ROARS with primal fury, ${protagonistName || 'woman'} COWERS behind barrier, dust BILLOWS from dinosaur movement`;
    }
  }

  // VEHICLE scenes
  if (conceptLower.includes('car') || conceptLower.includes('vehicle') || conceptLower.includes('driving')) {
    if (isCloseUp) {
      if (subjectFocus.includes('vehicle') || subjectFocus.includes('car')) {
        return 'Wheels SPIN on asphalt, engine REVS with power, exhaust BILLOWS, chrome GLEAMS';
      } else {
        return `Driver GRIPS wheel with white knuckles, eyes DART to mirror, jaw CLENCHES with focus`;
      }
    } else {
      return 'Vehicle TEARS through scene, tires SCREECH on turn, dust TRAILS behind';
    }
  }

  // EMOTIONAL/DRAMATIC scenes
  if (conceptLower.includes('fear') || conceptLower.includes('terror') || conceptLower.includes('scared')) {
    return isCloseUp
      ? `${protagonistName || 'Character'} TREMBLES with fear, eyes WIDEN, breath CATCHES, tears WELL`
      : `${protagonistName || 'Character'} BACKS AWAY slowly, shadow LOOMS, tension BUILDS in the air`;
  }

  if (conceptLower.includes('hope') || conceptLower.includes('relief') || conceptLower.includes('triumph')) {
    return isCloseUp
      ? `${protagonistName || 'Character'} expression SHIFTS to relief, shoulders DROP, smile SPREADS, eyes BRIGHTEN`
      : `${protagonistName || 'Character'} STANDS triumphant, light BREAKS through, atmosphere LIFTS`;
  }

  // DEFAULT based on energy and intent
  if (isCloseUp) {
    if (energy >= 4) {
      return `${protagonistName || 'Character'} shows intense emotion, expression SHIFTS dramatically, subtle movements reveal inner turmoil`;
    } else {
      return `${protagonistName || 'Character'} displays subtle reaction, eyes MOVE thoughtfully, breathing STEADIES`;
    }
  } else {
    if (energy >= 4) {
      return `${protagonistName || 'Character'} MOVES with urgency through scene, environment REACTS, dust and particles DRIFT`;
    } else {
      return `${protagonistName || 'Character'} navigates scene with purpose, ambient elements SHIFT subtly, atmosphere BREATHES`;
    }
  }
}

/**
 * Get Sora camera movement based on intent
 */
function getSoraCameraMove(intent?: string, isCloseUp?: boolean): string {
  if (!intent) return isCloseUp ? 'camera HOLDS steady' : 'camera DRIFTS slowly';

  switch (intent) {
    case 'REVEAL': return 'camera PULLS BACK revealing';
    case 'PURSUIT': return 'camera TRACKS movement';
    case 'DOMINANCE': return 'camera TILTS UP imposingly';
    case 'VULNERABILITY': return 'camera LOOKS DOWN';
    case 'PRECISION': return 'camera HOLDS on detail';
    case 'SCALE': return 'camera PANS across scene';
    case 'INTIMACY': return 'camera PUSHES IN gently';
    case 'CONFUSION': return 'camera SHAKES slightly';
    default: return isCloseUp ? 'camera HOLDS steady' : 'camera DRIFTS slowly';
  }
}

/**
 * Build action from extracted entities
 */
function buildActionFromEntities(entities: any, cameraIntent?: string): string | null {
  const chars = entities.characters || [];
  const vehicles = entities.vehicles || [];

  // If we have a protagonist being chased
  const protagonist = chars.find((c: any) => c.role === 'protagonist');
  const antagonist = chars.find((c: any) => c.role === 'antagonist');

  if (protagonist && antagonist) {
    if (cameraIntent === 'PURSUIT') {
      return `${protagonist.name} running, ${antagonist.name} in pursuit`;
    }
    if (cameraIntent === 'VULNERABILITY') {
      return `${protagonist.name} cornered, fear visible`;
    }
  }

  // If we have vehicles
  if (vehicles.length > 0) {
    const vehicle = vehicles[0];
    if (vehicle.name.includes('plane') || vehicle.name.includes('aircraft')) {
      return 'aircraft ready for escape, propeller motion';
    }
    return `${vehicle.name} in motion`;
  }

  // Single protagonist action
  if (protagonist) {
    return `${protagonist.name} in motion, urgent action`;
  }

  return null;
}

/**
 * Extract story-specific action from beat's end_state_truth
 */
function extractActionFromBeat(endStateTruth: string): string | null {
  if (!endStateTruth) return null;

  const actionWords = endStateTruth.toLowerCase();

  // Chase/pursuit actions
  if (actionWords.includes('running') || actionWords.includes('fleeing')) {
    return 'subject RUNNING, urgent movement';
  }
  if (actionWords.includes('chasing') || actionWords.includes('pursuing')) {
    return 'character CHARGING forward in pursuit';
  }

  // Escape actions
  if (actionWords.includes('escape') || actionWords.includes('escaping')) {
    return 'desperate escape motion, urgent';
  }
  if (actionWords.includes('reaching') || actionWords.includes('grabbing')) {
    return 'hand REACHING forward urgently';
  }

  // Vehicle actions
  if (actionWords.includes('driving') || actionWords.includes('speeding')) {
    return 'vehicle motion blur, speed';
  }
  if (actionWords.includes('flying') || actionWords.includes('takeoff')) {
    return 'aircraft movement, propeller spin';
  }

  // Emotional actions
  if (actionWords.includes('looking') || actionWords.includes('gazing')) {
    return 'subtle head turn, eye movement';
  }
  if (actionWords.includes('breathing') || actionWords.includes('panting')) {
    return 'heavy breathing motion, chest heaving';
  }
  if (actionWords.includes('screaming') || actionWords.includes('shouting')) {
    return 'mouth opening, expressive face';
  }

  // Combat actions
  if (actionWords.includes('fighting') || actionWords.includes('attacking')) {
    return 'combat motion, impact';
  }
  if (actionWords.includes('falling') || actionWords.includes('collapsing')) {
    return 'body FALLING, gravity';
  }

  // Movement direction
  if (actionWords.includes('approaching') || actionWords.includes('advancing')) {
    return 'subject ADVANCING toward camera';
  }
  if (actionWords.includes('retreating') || actionWords.includes('backing')) {
    return 'subject moving away, retreating';
  }

  // Generic motion based on content
  if (actionWords.includes('moving') || actionWords.includes('walking')) {
    return 'character movement, natural motion';
  }

  return null;
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
// REF DETERMINATION - Show ACTUAL ref names!
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

  // Find character master - USE ACTUAL NAME!
  const characterMaster = masterRefs.find(r => r.type === 'CHARACTER_MASTER');
  if (characterMaster) {
    // Show name in UI format: "👤 Woman" or "CHARACTER: Woman"
    refs.image_2 = `CHARACTER: ${characterMaster.name || 'Unknown'}`;
  }

  // Find environment master - USE ACTUAL NAME!
  const envMaster = masterRefs.find(r => r.type === 'ENVIRONMENT_MASTER');
  if (envMaster) {
    // Show name in UI format: "🏞️ Street" or "LOCATION: Street"
    refs.image_3 = `LOCATION: ${envMaster.name || 'Unknown'}`;
  }

  // Add any prop/vehicle masters to others - USE ACTUAL NAMES!
  const propMasters = masterRefs.filter(r => r.type === 'PROP_MASTER');
  refs.others = propMasters.map(p => `PROP: ${p.name || p.id}`);

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
