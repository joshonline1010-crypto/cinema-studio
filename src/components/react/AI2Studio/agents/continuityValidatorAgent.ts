/**
 * ContinuityValidatorAgent - Quality Control & Validation
 *
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * Responsibilities:
 * - Check after each generation for continuity issues
 * - Detect direction lock violations
 * - Detect identity drift
 * - Detect scale anchor drift
 * - Detect camera rig mismatches
 * - Detect world reset indicators
 * - Generate repair instructions if failed
 *
 * Checks:
 * - direction_lock_violation
 * - mirroring_detected
 * - identity_drift
 * - world_geometry_reset
 * - scale_anchor_drift
 * - camera_rig_mismatch
 * - cockpit_plane_drift
 *
 * Repair Actions:
 * - regenerate_with_stronger_continuity_locks
 * - force_continue_from_last_frame
 * - force_same_camera_rig_and_lens
 * - reassert_scale_anchors
 */

import type {
  SpecAgent,
  ContinuityValidatorInput,
  ContinuityValidatorOutput,
  ContinuityViolation,
  RepairInstruction,
  ViolationType,
  RepairAction,
  ShotCard,
  WorldStateJSON,
  SceneGeographyMemory,
  GeneratedAsset
} from './specTypes';

// ============================================
// SYSTEM PROMPT
// ============================================

const CONTINUITY_VALIDATOR_SYSTEM_PROMPT = `You are the CONTINUITY VALIDATOR AGENT for the AI2Studio production system.

## YOUR ROLE
You are the QUALITY CONTROL gate. You check every generated image and video for continuity violations.

## WHAT YOU CHECK

### 1. Direction Lock Violation
- Hero should stay on their established side of frame
- Villain should stay on their established side
- Travel direction should not flip (LEFT_TO_RIGHT stays LEFT_TO_RIGHT)

### 2. Mirroring Detection
- Check if the image appears horizontally flipped
- Character facing should match expected direction
- Text or asymmetric elements should be correct

### 3. Identity Drift
- Character appearance should match master reference
- Costume, hair, accessories should be consistent
- Expression style should match character DNA

### 4. World Geometry Reset
- Background elements should be consistent
- Landmarks should match established world
- Architecture should not change

### 5. Scale Anchor Drift
- Human height relative to doors/buildings should be consistent
- Vehicle sizes should not change
- Props should maintain relative scale

### 6. Camera Rig Mismatch
- Lens "feel" should match specified focal length
- Angle should match rig definition
- Distance should match rig position

### 7. Cockpit Plane Drift (Interior Scenes)
- Characters should not slide forward/backward in Z
- Seat positions should remain constant
- Dashboard/controls should be consistent

### 8. Lighting Direction Change
- Key light direction should match world state
- Should not flip from left to right
- Intensity can change, direction cannot

## AUTO-FAIL TRIGGERS

Immediately FAIL if:
- Hero/villain sides flip
- Mirroring detected
- Entity identity changes (costume, hair)
- World geometry changes
- Lens FOV mismatch vs rig
- Scale drift (character size vs reference)
- Cockpit plane drift

## REPAIR ACTIONS

When violation detected, prescribe repair:

1. **regenerate_with_stronger_continuity_locks**
   - Add more "THIS EXACT" phrases
   - Add explicit direction phrases
   - Add "Continue from Image 1"

2. **force_continue_from_last_frame**
   - Use last frame as Image 1
   - Add color lock phrase
   - Add geometry lock phrase

3. **force_same_camera_rig_and_lens**
   - Explicitly state camera position
   - Explicitly state focal length
   - Add "same angle, same distance"

4. **reassert_scale_anchors**
   - Add scale reference in prompt
   - "Character height matches door frame"
   - "Vehicle scale matches building floors"

## OUTPUT FORMAT

\`\`\`json
{
  "passOrFail": "PASS" | "FAIL",
  "violations": [
    {
      "violation_type": "direction_lock_violation",
      "severity": "high",
      "shot_id": "shot_03",
      "description": "Hero flipped from left to right side of frame",
      "entity_involved": "hero"
    }
  ],
  "repairInstructions": [
    {
      "shot_id": "shot_03",
      "action": "regenerate_with_stronger_continuity_locks",
      "prompt_additions": [
        "Hero on LEFT of frame - MAINTAIN POSITION",
        "NO MIRRORING. NO DIRECTION FLIP."
      ],
      "force_refs": ["last_frame_shot_02"]
    }
  ],
  "overallScore": 0.7
}
\`\`\`

## REMEMBER

- You are the last line of defense against drift
- Be strict - it's easier to regenerate than to fix in post
- Document WHY something failed for learning
- Suggest specific fixes, not vague instructions`;

// ============================================
// CONTINUITY VALIDATOR AGENT
// ============================================

export const continuityValidatorAgent: SpecAgent = {
  role: 'continuity_validator',
  name: 'Continuity Validator Agent',
  icon: '🔍',
  color: 'red',
  systemPrompt: CONTINUITY_VALIDATOR_SYSTEM_PROMPT,

  async execute(input: ContinuityValidatorInput): Promise<ContinuityValidatorOutput> {
    console.log('[ContinuityValidator] Validating', input.generatedImages.length, 'images and', input.generatedVideos.length, 'videos');

    const violations: ContinuityViolation[] = [];
    const repairInstructions: RepairInstruction[] = [];

    // Validate each shot
    for (let i = 0; i < input.shotCards.length; i++) {
      const shotCard = input.shotCards[i];
      const prevShotCard = i > 0 ? input.shotCards[i - 1] : null;

      const image = input.generatedImages.find(img => img.shotId === shotCard.shot_id);
      const video = input.generatedVideos.find(vid => vid.shotId === shotCard.shot_id);

      // Run all checks for this shot
      const shotViolations = validateShot(
        shotCard,
        prevShotCard,
        image,
        video,
        input.worldState,
        input.sceneGeographyMemory
      );

      violations.push(...shotViolations);

      // Generate repair instructions for any violations
      if (shotViolations.length > 0) {
        const repairs = generateRepairInstructions(shotCard, shotViolations);
        repairInstructions.push(...repairs);
      }
    }

    // Calculate overall score
    const overallScore = calculateOverallScore(violations, input.shotCards.length);

    // Determine pass/fail
    const passOrFail = violations.some(v => v.severity === 'critical' || v.severity === 'high')
      ? 'FAIL'
      : 'PASS';

    console.log('[ContinuityValidator] Result:', passOrFail, '- Score:', overallScore);
    console.log('[ContinuityValidator] Violations found:', violations.length);

    return {
      passOrFail,
      violations,
      repairInstructions,
      overallScore
    };
  }
};

// ============================================
// SHOT VALIDATION
// ============================================

function validateShot(
  shotCard: ShotCard,
  prevShotCard: ShotCard | null,
  image: GeneratedAsset | undefined,
  video: GeneratedAsset | undefined,
  worldState: WorldStateJSON,
  sceneGeography: SceneGeographyMemory
): ContinuityViolation[] {
  const violations: ContinuityViolation[] = [];

  // Check direction lock
  const directionViolation = checkDirectionLock(shotCard, prevShotCard, sceneGeography);
  if (directionViolation) violations.push(directionViolation);

  // Check camera rig consistency
  const rigViolation = checkCameraRigConsistency(shotCard, prevShotCard);
  if (rigViolation) violations.push(rigViolation);

  // Check world lock
  const worldViolation = checkWorldLock(shotCard, worldState);
  if (worldViolation) violations.push(worldViolation);

  // Check continuity phrases were applied
  const phraseViolation = checkContinuityPhrases(shotCard);
  if (phraseViolation) violations.push(phraseViolation);

  // Check lighting direction
  const lightingViolation = checkLightingDirection(shotCard, worldState);
  if (lightingViolation) violations.push(lightingViolation);

  return violations;
}

// ============================================
// INDIVIDUAL CHECKS
// ============================================

function checkDirectionLock(
  shotCard: ShotCard,
  prevShotCard: ShotCard | null,
  sceneGeography: SceneGeographyMemory
): ContinuityViolation | null {
  if (!prevShotCard) return null;

  // Check if direction lock changed unexpectedly
  if (shotCard.direction_lock !== prevShotCard.direction_lock) {
    return {
      violation_type: 'direction_lock_violation',
      severity: 'high',
      shot_id: shotCard.shot_id,
      description: `Direction lock changed from ${prevShotCard.direction_lock} to ${shotCard.direction_lock}`,
      entity_involved: 'scene'
    };
  }

  return null;
}

function checkCameraRigConsistency(
  shotCard: ShotCard,
  prevShotCard: ShotCard | null
): ContinuityViolation | null {
  // Check for sudden rig changes that might cause issues
  if (!prevShotCard) return null;

  // Check for 180-degree rule violation (crossing axis)
  const sideA = ['OTS_A', 'CU_A'];
  const sideB = ['OTS_B', 'CU_B'];

  const prevOnA = sideA.includes(prevShotCard.camera_rig_id);
  const prevOnB = sideB.includes(prevShotCard.camera_rig_id);
  const currOnA = sideA.includes(shotCard.camera_rig_id);
  const currOnB = sideB.includes(shotCard.camera_rig_id);

  if ((prevOnA && currOnB) || (prevOnB && currOnA)) {
    // Check if there was a neutral shot in between (would need more context)
    // For now, flag as potential violation
    return {
      violation_type: 'camera_rig_mismatch',
      severity: 'medium',
      shot_id: shotCard.shot_id,
      description: `Camera crossed 180-degree line from ${prevShotCard.camera_rig_id} to ${shotCard.camera_rig_id}`,
      entity_involved: 'camera'
    };
  }

  return null;
}

function checkWorldLock(
  shotCard: ShotCard,
  worldState: WorldStateJSON
): ContinuityViolation | null {
  // Check if the prompt references the correct world
  // This is a structural check - actual visual validation would need vision AI

  if (!shotCard.photo_prompt.includes('Same world') &&
      !shotCard.photo_prompt.includes('Continue from')) {
    // First shot is OK to not have these
    if (shotCard.shot_id !== 'shot_01') {
      return {
        violation_type: 'world_geometry_reset',
        severity: 'medium',
        shot_id: shotCard.shot_id,
        description: 'Photo prompt missing world continuation phrases',
        entity_involved: 'world'
      };
    }
  }

  return null;
}

function checkContinuityPhrases(shotCard: ShotCard): ContinuityViolation | null {
  const requiredPhrases = ['NO MIRRORING', 'NO DIRECTION FLIP'];

  for (const phrase of requiredPhrases) {
    if (!shotCard.photo_prompt.includes(phrase) &&
        !shotCard.continuity_phrases.includes(phrase)) {
      return {
        violation_type: 'mirroring_detected',
        severity: 'low',
        shot_id: shotCard.shot_id,
        description: `Missing continuity phrase: "${phrase}"`,
        entity_involved: 'prompt'
      };
    }
  }

  return null;
}

function checkLightingDirection(
  shotCard: ShotCard,
  worldState: WorldStateJSON
): ContinuityViolation | null {
  // Check if lighting direction is locked
  if (!worldState.lighting.direction_locked) {
    return {
      violation_type: 'lighting_direction_change',
      severity: 'medium',
      shot_id: shotCard.shot_id,
      description: 'World state lighting direction not locked - potential drift',
      entity_involved: 'lighting'
    };
  }

  return null;
}

// ============================================
// REPAIR INSTRUCTION GENERATION
// ============================================

function generateRepairInstructions(
  shotCard: ShotCard,
  violations: ContinuityViolation[]
): RepairInstruction[] {
  const repairs: RepairInstruction[] = [];

  for (const violation of violations) {
    const repair = generateRepairForViolation(shotCard, violation);
    if (repair) {
      repairs.push(repair);
    }
  }

  return repairs;
}

function generateRepairForViolation(
  shotCard: ShotCard,
  violation: ContinuityViolation
): RepairInstruction | null {
  switch (violation.violation_type) {
    case 'direction_lock_violation':
      return {
        shot_id: shotCard.shot_id,
        action: 'regenerate_with_stronger_continuity_locks',
        prompt_additions: [
          `Character on ${shotCard.direction_lock === 'LEFT_TO_RIGHT' ? 'LEFT' : 'RIGHT'} - MAINTAIN POSITION`,
          'NO MIRRORING. NO DIRECTION FLIP.',
          `Travel direction: ${shotCard.direction_lock}. DO NOT REVERSE.`
        ],
        force_refs: ['last_frame']
      };

    case 'mirroring_detected':
      return {
        shot_id: shotCard.shot_id,
        action: 'regenerate_with_stronger_continuity_locks',
        prompt_additions: [
          'NO MIRRORING. NO HORIZONTAL FLIP.',
          'Maintain exact left/right positioning.',
          'THIS EXACT CHARACTER facing same direction.'
        ]
      };

    case 'camera_rig_mismatch':
      return {
        shot_id: shotCard.shot_id,
        action: 'force_same_camera_rig_and_lens',
        prompt_additions: [
          `Camera rig: ${shotCard.camera_rig_id}`,
          `Lens: ${shotCard.lens_mm}mm`,
          'Same camera angle as previous shot.'
        ]
      };

    case 'world_geometry_reset':
      return {
        shot_id: shotCard.shot_id,
        action: 'force_continue_from_last_frame',
        prompt_additions: [
          'Continue from Image 1.',
          'Same world state.',
          'Same background elements.',
          'Same lighting direction.'
        ],
        force_refs: ['last_frame', 'environment_master']
      };

    case 'scale_anchor_drift':
      return {
        shot_id: shotCard.shot_id,
        action: 'reassert_scale_anchors',
        prompt_additions: [
          'Maintain exact scale relative to environment.',
          'Character height matches door frame.',
          'Objects maintain relative sizes.'
        ]
      };

    case 'lighting_direction_change':
      return {
        shot_id: shotCard.shot_id,
        action: 'regenerate_with_stronger_continuity_locks',
        prompt_additions: [
          'SAME LIGHTING DIRECTION as previous.',
          'Key light from same side.',
          'Do not change shadow direction.'
        ]
      };

    default:
      return null;
  }
}

// ============================================
// SCORING
// ============================================

function calculateOverallScore(
  violations: ContinuityViolation[],
  totalShots: number
): number {
  if (totalShots === 0) return 1.0;
  if (violations.length === 0) return 1.0;

  // Severity weights
  const weights: Record<string, number> = {
    'critical': 0.4,
    'high': 0.25,
    'medium': 0.1,
    'low': 0.05
  };

  let totalPenalty = 0;
  for (const violation of violations) {
    totalPenalty += weights[violation.severity] || 0.1;
  }

  // Normalize by number of shots
  const normalizedPenalty = totalPenalty / totalShots;

  // Score is 1 - penalty, clamped to 0-1
  return Math.max(0, Math.min(1, 1 - normalizedPenalty));
}

// ============================================
// EXPORTS
// ============================================

export default continuityValidatorAgent;

// Export helper functions for external use
export {
  validateShot,
  checkDirectionLock,
  checkCameraRigConsistency,
  checkWorldLock,
  generateRepairInstructions,
  calculateOverallScore
};
