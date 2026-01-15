/**
 * BeatPlannerAgent - Phase 3 Beat Planning
 *
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * Responsibilities:
 * - Output beat list (time, POV owner, intent)
 * - Define required deltas per beat
 * - Define forbidden changes per beat
 *
 * Rules:
 * - each_beat_changes_reality
 * - enforce_distance_state_progression
 * - pov_is_question_driven
 * - plan_2_to_3_beats_ahead
 */

import type {
  SpecAgent,
  BeatPlannerInput,
  BeatPlannerOutput,
  BeatDefinition,
  WorldStateJSON,
  DistanceState,
  InformationOwner,
  CameraIntent,
  ForbiddenChange
} from './specTypes';

// ============================================
// SYSTEM PROMPT
// ============================================

const BEAT_PLANNER_SYSTEM_PROMPT = `You are the BEAT PLANNER AGENT for the AI2Studio production system.

## YOUR ROLE
You are responsible for PHASE 3: BEAT PLANNING.
Your job is to break down a story into BEATS - each beat is a world-state transition.

## KEY CONCEPT: BEAT = WORLD STATE TRANSITION

Each beat is NOT just a camera angle change.
Each beat MUST change reality in some way:
- Entity moves
- State changes (door opens, expression shifts)
- Information revealed
- Tension escalates/releases

## DURATION TO SHOT COUNT RULES

| Duration | Shot Count | Shot Duration |
|----------|------------|---------------|
| 10-15s   | 2-3 shots  | 5s each       |
| 30s      | 5-6 shots  | 5s each       |
| 60s      | 10-12 shots| 5s each       |
| 90s      | 15-18 shots| 5s each       |

IMPORTANT: Kling only allows 5 or 10 second durations!

## DISTANCE STATE PROGRESSION

Beats should follow natural progression:
FAR → APPROACH → ENGAGEMENT → CLOSE_QUARTERS → AFTERMATH → EXIT

You cannot jump from FAR to CLOSE_QUARTERS without showing the approach!

## INFORMATION OWNER

Every beat has someone who "owns" the information:
- HERO: Audience sees what hero sees/knows
- VILLAIN: Audience sees what villain sees/knows
- NEUTRAL: Objective observer
- AUDIENCE_ONLY: Audience knows something characters don't

## CAMERA INTENT

Each beat has a camera INTENT (not just angle):
- REVEAL: First time seeing something
- PURSUIT: Following action
- DOMINANCE: Low angle, power position
- VULNERABILITY: High angle, weakness
- CONFUSION: Dutch angle, disorientation
- PRECISION: Detail shot, focus on specific element
- SCALE: Wide shot, establishing size relationships
- INTIMACY: Close-up, emotional connection

## ENERGY LEVELS

Beats have energy from 1-5:
- 1: Calm, establishing
- 2: Building tension
- 3: Active, engaged
- 4: High tension
- 5: Maximum intensity (climax)

Rule: Max energy step-up per beat is 2. Recommended is 1.
Don't go from energy 1 to energy 5 in one beat!

## SHOT MODE

- NEW_SHOT: Generate fresh image
- MUTATE_PREVIOUS: Edit previous frame (better for continuity)

Prefer MUTATE_PREVIOUS when possible for better color/identity consistency.

## OUTPUT FORMAT

For each beat, output:

\`\`\`json
{
  "beat_id": "beat_01",
  "timecode_range_seconds": { "start": 0, "end": 5 },
  "distance_state": "FAR",
  "information_owner": "HERO",
  "camera_intent": "REVEAL",
  "energy_level": 1,
  "shot_mode": "NEW_SHOT",
  "camera_rig_id": "WIDE_MASTER",
  "lens_mm": 24,
  "start_frame_ref": {
    "type": "BASE_WORLD",
    "ref": ""
  },
  "world_lock": {
    "world_id": "world_123",
    "entities_locked": true,
    "lighting_direction_locked": true,
    "color_grade_locked": true,
    "direction_lock": "LEFT_TO_RIGHT"
  },
  "allowed_deltas": ["smoke_density", "expression_tension"],
  "forbidden_changes": ["mirroring", "identity_drift", "teleport"],
  "end_state_truth": "Hero stands alert, scanning the horizon"
}
\`\`\`

## NARRATIVE STRUCTURE PATTERNS

### Commercial/Product (30s)
1. HOOK (2-3s) - Grab attention, energy 3
2. STORY (15-20s) - Show benefit/journey, energy 2-4
3. HERO (5s) - Product hero shot, energy 4
4. TAGLINE (3-5s) - Call to action, energy 2

### Adventure/Action (60s)
1. ESTABLISH (5s) - Set the world, energy 1
2. CATALYST (5s) - Something happens, energy 2
3. PURSUIT (15s) - Chase/conflict, energy 3-4
4. ESCALATE (15s) - Stakes raise, energy 4
5. CLIMAX (10s) - Peak moment, energy 5
6. RESOLVE (10s) - Aftermath, energy 2

### Dialogue (30s)
1. ESTABLISH (5s) - Wide two-shot, energy 1
2. A_SPEAKS (8s) - OTS_A to CU_A, energy 2
3. B_REACTS (5s) - REACTION_INSERT, energy 2
4. B_SPEAKS (8s) - OTS_B to CU_B, energy 2
5. RESOLVE (4s) - Wide or CU based on tone, energy 1-3

## REMEMBER

- Every beat MUST change something about the world
- No teleporting between beats
- Respect the 180-degree rule
- Lock direction early and maintain it
- Plan 2-3 beats ahead for smooth pacing`;

// ============================================
// BEAT PLANNER AGENT
// ============================================

export const beatPlannerAgent: SpecAgent = {
  role: 'beat_planner',
  name: 'Beat Planner Agent',
  icon: '📋',
  color: 'violet',
  systemPrompt: BEAT_PLANNER_SYSTEM_PROMPT,

  async execute(input: BeatPlannerInput): Promise<BeatPlannerOutput> {
    console.log('[BeatPlanner] Planning beats for story:', input.storyOutline.substring(0, 50) + '...');
    console.log('[BeatPlanner] Target duration:', input.targetDurationSeconds, 'seconds');

    // Calculate shot count based on duration
    const shotCount = calculateShotCount(input.targetDurationSeconds);
    console.log('[BeatPlanner] Estimated shot count:', shotCount);

    // Detect narrative type
    const narrativeType = detectNarrativeType(input.storyOutline);
    console.log('[BeatPlanner] Detected narrative type:', narrativeType);

    // Generate beats based on narrative type
    const beats = generateBeats(
      input.storyOutline,
      input.targetDurationSeconds,
      shotCount,
      narrativeType,
      input.worldState,
      input.constraints
    );

    console.log('[BeatPlanner] Generated', beats.length, 'beats');

    return {
      beats,
      totalDuration: input.targetDurationSeconds,
      shotCount: beats.length
    };
  }
};

// ============================================
// SHOT COUNT CALCULATION
// ============================================

function calculateShotCount(durationSeconds: number): number {
  // Based on spec: shots are 5s each
  // But we add some buffer for pacing variety
  if (durationSeconds <= 15) return 3;
  if (durationSeconds <= 30) return 6;
  if (durationSeconds <= 60) return 12;
  if (durationSeconds <= 90) return 18;
  return Math.ceil(durationSeconds / 5);
}

// ============================================
// NARRATIVE TYPE DETECTION
// ============================================

type NarrativeType = 'commercial' | 'adventure' | 'dialogue' | 'montage' | 'emotional' | 'action';

function detectNarrativeType(storyOutline: string): NarrativeType {
  const outlineLower = storyOutline.toLowerCase();

  // Commercial detection
  if (outlineLower.includes('product') ||
      outlineLower.includes('brand') ||
      outlineLower.includes('commercial') ||
      outlineLower.includes('advertisement') ||
      outlineLower.includes('promo')) {
    return 'commercial';
  }

  // Dialogue detection
  if (outlineLower.includes('conversation') ||
      outlineLower.includes('dialogue') ||
      outlineLower.includes('talks to') ||
      outlineLower.includes('speaks') ||
      outlineLower.includes('argues')) {
    return 'dialogue';
  }

  // Action detection
  if (outlineLower.includes('fight') ||
      outlineLower.includes('battle') ||
      outlineLower.includes('chase') ||
      outlineLower.includes('explosion') ||
      outlineLower.includes('combat')) {
    return 'action';
  }

  // Emotional detection
  if (outlineLower.includes('emotional') ||
      outlineLower.includes('sad') ||
      outlineLower.includes('happy') ||
      outlineLower.includes('love') ||
      outlineLower.includes('heartbreak')) {
    return 'emotional';
  }

  // Adventure as default for story-like content
  if (outlineLower.includes('journey') ||
      outlineLower.includes('adventure') ||
      outlineLower.includes('discover') ||
      outlineLower.includes('explore')) {
    return 'adventure';
  }

  // Default
  return 'adventure';
}

// ============================================
// BEAT GENERATION
// ============================================

function generateBeats(
  storyOutline: string,
  duration: number,
  shotCount: number,
  narrativeType: NarrativeType,
  worldState: WorldStateJSON,
  constraints?: BeatPlannerInput['constraints']
): BeatDefinition[] {
  // Get the beat template for this narrative type
  const template = getBeatTemplate(narrativeType, shotCount, duration);

  // Apply the template
  const beats: BeatDefinition[] = [];
  let currentTime = 0;

  for (let i = 0; i < template.length; i++) {
    const templateBeat = template[i];
    const beatDuration = templateBeat.durationPercent * duration / 100;

    const beat: BeatDefinition = {
      beat_id: `beat_${String(i + 1).padStart(2, '0')}`,
      timecode_range_seconds: {
        start: currentTime,
        end: currentTime + beatDuration
      },
      distance_state: templateBeat.distanceState,
      information_owner: templateBeat.informationOwner,
      camera_intent: templateBeat.cameraIntent,
      energy_level: templateBeat.energyLevel,
      shot_mode: i === 0 ? 'NEW_SHOT' : 'MUTATE_PREVIOUS',
      camera_rig_id: templateBeat.rigId,
      lens_mm: templateBeat.lens,
      start_frame_ref: {
        type: i === 0 ? 'BASE_WORLD' : 'PREVIOUS_LAST_FRAME',
        ref: ''
      },
      world_lock: {
        world_id: worldState.world_id,
        entities_locked: true,
        lighting_direction_locked: true,
        color_grade_locked: true,
        direction_lock: 'LEFT_TO_RIGHT'
      },
      allowed_deltas: templateBeat.allowedDeltas,
      forbidden_changes: ['mirroring', 'identity_drift', 'world_reset', 'teleport'],
      end_state_truth: templateBeat.endStateTruth
    };

    beats.push(beat);
    currentTime += beatDuration;
  }

  return beats;
}

// ============================================
// BEAT TEMPLATES
// ============================================

interface BeatTemplate {
  name: string;
  durationPercent: number;
  distanceState: DistanceState;
  informationOwner: InformationOwner;
  cameraIntent: CameraIntent;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  rigId: string;
  lens: number;
  allowedDeltas: string[];
  endStateTruth: string;
}

function getBeatTemplate(
  narrativeType: NarrativeType,
  shotCount: number,
  duration: number
): BeatTemplate[] {
  switch (narrativeType) {
    case 'commercial':
      return getCommercialTemplate(shotCount);
    case 'dialogue':
      return getDialogueTemplate(shotCount);
    case 'action':
      return getActionTemplate(shotCount);
    case 'emotional':
      return getEmotionalTemplate(shotCount);
    case 'adventure':
    default:
      return getAdventureTemplate(shotCount);
  }
}

function getCommercialTemplate(shotCount: number): BeatTemplate[] {
  // Commercial: HOOK → STORY → HERO → TAGLINE
  return [
    {
      name: 'HOOK',
      durationPercent: 15,
      distanceState: 'FAR',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'REVEAL',
      energyLevel: 3,
      rigId: 'WIDE_MASTER',
      lens: 24,
      allowedDeltas: ['smoke_density', 'lighting_intensity'],
      endStateTruth: 'Attention grabbed, product world established'
    },
    {
      name: 'STORY_1',
      durationPercent: 25,
      distanceState: 'APPROACH',
      informationOwner: 'HERO',
      cameraIntent: 'PURSUIT',
      energyLevel: 2,
      rigId: 'TRACKING_LEFT',
      lens: 35,
      allowedDeltas: ['pose_change', 'expression_tension', 'micro_shift'],
      endStateTruth: 'Product benefit being demonstrated'
    },
    {
      name: 'STORY_2',
      durationPercent: 25,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'HERO',
      cameraIntent: 'INTIMACY',
      energyLevel: 3,
      rigId: 'CU_A',
      lens: 50,
      allowedDeltas: ['facial_expression', 'hand_gesture'],
      endStateTruth: 'Emotional connection with product'
    },
    {
      name: 'HERO',
      durationPercent: 20,
      distanceState: 'CLOSE_QUARTERS',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'SCALE',
      energyLevel: 4,
      rigId: 'LOW_ANGLE_HERO',
      lens: 35,
      allowedDeltas: ['lighting_intensity', 'sparkle'],
      endStateTruth: 'Product shown in hero glory shot'
    },
    {
      name: 'TAGLINE',
      durationPercent: 15,
      distanceState: 'EXIT',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'PRECISION',
      energyLevel: 2,
      rigId: 'WIDE_MASTER',
      lens: 50,
      allowedDeltas: ['settle'],
      endStateTruth: 'Call to action, brand solidified'
    }
  ];
}

function getDialogueTemplate(shotCount: number): BeatTemplate[] {
  // Dialogue: ESTABLISH → A_SPEAKS → B_REACTS → B_SPEAKS → RESOLVE
  return [
    {
      name: 'ESTABLISH',
      durationPercent: 15,
      distanceState: 'FAR',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'REVEAL',
      energyLevel: 1,
      rigId: 'WIDE_MASTER',
      lens: 24,
      allowedDeltas: ['subtle_movement'],
      endStateTruth: 'Both characters visible, relationship established'
    },
    {
      name: 'A_SPEAKS',
      durationPercent: 25,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'HERO',
      cameraIntent: 'INTIMACY',
      energyLevel: 2,
      rigId: 'OTS_A',
      lens: 50,
      allowedDeltas: ['lip_sync', 'expression_change', 'gesture'],
      endStateTruth: 'Character A delivers their line'
    },
    {
      name: 'B_REACTS',
      durationPercent: 15,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'VILLAIN',
      cameraIntent: 'PRECISION',
      energyLevel: 2,
      rigId: 'REACTION_INSERT',
      lens: 85,
      allowedDeltas: ['micro_expression', 'eye_movement'],
      endStateTruth: 'Character B reacts to what was said'
    },
    {
      name: 'B_SPEAKS',
      durationPercent: 25,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'VILLAIN',
      cameraIntent: 'INTIMACY',
      energyLevel: 2,
      rigId: 'OTS_B',
      lens: 50,
      allowedDeltas: ['lip_sync', 'expression_change', 'gesture'],
      endStateTruth: 'Character B responds'
    },
    {
      name: 'RESOLVE',
      durationPercent: 20,
      distanceState: 'EXIT',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'REVEAL',
      energyLevel: 1,
      rigId: 'WIDE_MASTER',
      lens: 35,
      allowedDeltas: ['settle', 'posture_shift'],
      endStateTruth: 'Conversation concludes, tension resolved or escalated'
    }
  ];
}

function getActionTemplate(shotCount: number): BeatTemplate[] {
  // Action: ESTABLISH → INCITE → ESCALATE → PEAK → AFTERMATH
  return [
    {
      name: 'ESTABLISH',
      durationPercent: 10,
      distanceState: 'FAR',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'SCALE',
      energyLevel: 2,
      rigId: 'WIDE_MASTER',
      lens: 24,
      allowedDeltas: ['dust', 'smoke'],
      endStateTruth: 'Action space established'
    },
    {
      name: 'INCITE',
      durationPercent: 15,
      distanceState: 'APPROACH',
      informationOwner: 'HERO',
      cameraIntent: 'REVEAL',
      energyLevel: 3,
      rigId: 'TRACKING_LEFT',
      lens: 35,
      allowedDeltas: ['movement', 'expression_tension'],
      endStateTruth: 'Conflict initiated'
    },
    {
      name: 'ESCALATE_1',
      durationPercent: 20,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'HERO',
      cameraIntent: 'PURSUIT',
      energyLevel: 4,
      rigId: 'TRACKING_RIGHT',
      lens: 50,
      allowedDeltas: ['impact', 'debris', 'fast_movement'],
      endStateTruth: 'Action intensifies'
    },
    {
      name: 'ESCALATE_2',
      durationPercent: 20,
      distanceState: 'CLOSE_QUARTERS',
      informationOwner: 'VILLAIN',
      cameraIntent: 'DOMINANCE',
      energyLevel: 4,
      rigId: 'LOW_ANGLE_HERO',
      lens: 24,
      allowedDeltas: ['impact', 'expression_extreme'],
      endStateTruth: 'Stakes at highest'
    },
    {
      name: 'PEAK',
      durationPercent: 20,
      distanceState: 'CLOSE_QUARTERS',
      informationOwner: 'HERO',
      cameraIntent: 'PRECISION',
      energyLevel: 5,
      rigId: 'CU_A',
      lens: 85,
      allowedDeltas: ['decisive_action', 'reaction'],
      endStateTruth: 'Climactic moment'
    },
    {
      name: 'AFTERMATH',
      durationPercent: 15,
      distanceState: 'AFTERMATH',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'VULNERABILITY',
      energyLevel: 2,
      rigId: 'HIGH_ANGLE_VULNERABLE',
      lens: 35,
      allowedDeltas: ['settle', 'dust_settling', 'breathing'],
      endStateTruth: 'Consequence of action visible'
    }
  ];
}

function getEmotionalTemplate(shotCount: number): BeatTemplate[] {
  // Emotional: QUIET → BUILD → PEAK → RELEASE
  return [
    {
      name: 'QUIET',
      durationPercent: 25,
      distanceState: 'FAR',
      informationOwner: 'HERO',
      cameraIntent: 'INTIMACY',
      energyLevel: 1,
      rigId: 'WIDE_MASTER',
      lens: 50,
      allowedDeltas: ['subtle_movement', 'breathing'],
      endStateTruth: 'Emotional state established'
    },
    {
      name: 'BUILD_1',
      durationPercent: 25,
      distanceState: 'APPROACH',
      informationOwner: 'HERO',
      cameraIntent: 'INTIMACY',
      energyLevel: 2,
      rigId: 'CU_A',
      lens: 85,
      allowedDeltas: ['micro_expression', 'eye_moisture'],
      endStateTruth: 'Emotion building'
    },
    {
      name: 'BUILD_2',
      durationPercent: 20,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'HERO',
      cameraIntent: 'VULNERABILITY',
      energyLevel: 3,
      rigId: 'REACTION_INSERT',
      lens: 100,
      allowedDeltas: ['tear', 'trembling', 'breath_catch'],
      endStateTruth: 'Emotion peaking'
    },
    {
      name: 'PEAK',
      durationPercent: 15,
      distanceState: 'CLOSE_QUARTERS',
      informationOwner: 'HERO',
      cameraIntent: 'PRECISION',
      energyLevel: 4,
      rigId: 'CU_A',
      lens: 85,
      allowedDeltas: ['full_emotion_release'],
      endStateTruth: 'Emotional climax'
    },
    {
      name: 'RELEASE',
      durationPercent: 15,
      distanceState: 'EXIT',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'SCALE',
      energyLevel: 2,
      rigId: 'WIDE_MASTER',
      lens: 35,
      allowedDeltas: ['settle', 'resolve'],
      endStateTruth: 'Emotion resolved'
    }
  ];
}

function getAdventureTemplate(shotCount: number): BeatTemplate[] {
  // Adventure: ESTABLISH → CATALYST → PURSUIT → ESCALATE → CLIMAX → RESOLVE
  return [
    {
      name: 'ESTABLISH',
      durationPercent: 10,
      distanceState: 'FAR',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'SCALE',
      energyLevel: 1,
      rigId: 'WIDE_MASTER',
      lens: 24,
      allowedDeltas: ['ambient_movement'],
      endStateTruth: 'World and protagonist established'
    },
    {
      name: 'CATALYST',
      durationPercent: 10,
      distanceState: 'FAR',
      informationOwner: 'HERO',
      cameraIntent: 'REVEAL',
      energyLevel: 2,
      rigId: 'WIDE_MASTER',
      lens: 35,
      allowedDeltas: ['reaction', 'turn'],
      endStateTruth: 'Something disrupts the status quo'
    },
    {
      name: 'RESPONSE',
      durationPercent: 15,
      distanceState: 'APPROACH',
      informationOwner: 'HERO',
      cameraIntent: 'PURSUIT',
      energyLevel: 3,
      rigId: 'TRACKING_LEFT',
      lens: 35,
      allowedDeltas: ['movement_start', 'determination'],
      endStateTruth: 'Hero responds to catalyst'
    },
    {
      name: 'PURSUIT',
      durationPercent: 20,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'HERO',
      cameraIntent: 'PURSUIT',
      energyLevel: 3,
      rigId: 'TRACKING_RIGHT',
      lens: 50,
      allowedDeltas: ['fast_movement', 'environment_reaction'],
      endStateTruth: 'Active pursuit of goal'
    },
    {
      name: 'ESCALATE',
      durationPercent: 15,
      distanceState: 'ENGAGEMENT',
      informationOwner: 'VILLAIN',
      cameraIntent: 'DOMINANCE',
      energyLevel: 4,
      rigId: 'LOW_ANGLE_HERO',
      lens: 24,
      allowedDeltas: ['obstacle_appears', 'tension_rise'],
      endStateTruth: 'Stakes raised, obstacle appears'
    },
    {
      name: 'CLIMAX',
      durationPercent: 15,
      distanceState: 'CLOSE_QUARTERS',
      informationOwner: 'HERO',
      cameraIntent: 'PRECISION',
      energyLevel: 5,
      rigId: 'CU_A',
      lens: 85,
      allowedDeltas: ['decisive_moment', 'peak_action'],
      endStateTruth: 'Decisive moment'
    },
    {
      name: 'RESOLVE',
      durationPercent: 15,
      distanceState: 'AFTERMATH',
      informationOwner: 'NEUTRAL',
      cameraIntent: 'SCALE',
      energyLevel: 2,
      rigId: 'WIDE_MASTER',
      lens: 35,
      allowedDeltas: ['settle', 'resolution'],
      endStateTruth: 'Outcome established, new status quo'
    }
  ];
}

// ============================================
// EXPORTS
// ============================================

export default beatPlannerAgent;

// Export helper functions for external use
export {
  calculateShotCount,
  detectNarrativeType,
  generateBeats,
  getBeatTemplate
};
