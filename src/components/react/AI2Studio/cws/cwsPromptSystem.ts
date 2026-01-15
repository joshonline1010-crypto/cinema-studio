/**
 * CWS Prompt System - System prompt additions for Continuous World Storytelling
 *
 * These rules are injected into the main AI2 system prompt when CWS mode is enabled.
 */

import type { WorldState, CameraRig, Entity, Character, DirectionLock } from './types';
import { STANDARD_RIGS } from './types';

// ============================================
// MAIN CWS SYSTEM PROMPT
// ============================================

export const CWS_SYSTEM_PROMPT = `
# CONTINUOUS WORLD STORYTELLING (CWS) MODE ACTIVE

You are now operating in CWS mode - treating every image as a "world state measurement" with precise 3D coordinates.
This ensures PERFECT continuity across shots.

---

## 3D COORDINATE SYSTEM

Every entity has a world position: Entity(x, y, z)
- **X**: Left (-) / Right (+) relative to camera origin
- **Y**: Down (-) / Up (+)
- **Z**: Away from camera (-) / Toward camera (+)

Example dialogue setup:
\`\`\`
CHARACTER_A at (-2, 0, 0) - stage left
CHARACTER_B at (+2, 0, 0) - stage right
CAMERA at (0, 1.5, 10) looking at (0, 1, 0)
\`\`\`

---

## CAMERA RIG SYSTEM

Use named camera positions for consistency. Available standard rigs:

| Rig ID | Position | Look At | Lens | Side |
|--------|----------|---------|------|------|
| WIDE_MASTER | (0, 1.5, 10) | (0, 1, 0) | 24mm | - |
| OTS_A | (-2, 1.5, 3) | (2, 1.5, 0) | 50mm | A |
| OTS_B | (2, 1.5, 3) | (-2, 1.5, 0) | 50mm | B |
| CU_A | (-1, 1.5, 2) | (0, 1.5, 0) | 85mm | A |
| CU_B | (1, 1.5, 2) | (0, 1.5, 0) | 85mm | B |
| REACTION_INSERT | (0, 1.5, 1.5) | (0, 1.5, 0) | 100mm | - |
| LOW_ANGLE_HERO | (0, 0.5, 3) | (0, 1.5, 0) | 24mm | - |
| HIGH_ANGLE_VULNERABLE | (0, 3, 3) | (0, 1, 0) | 35mm | - |

**Usage**: When planning shots, specify: \`rig: "OTS_A"\` or \`rig: "CU_B"\`

---

## ENTITY REGISTRY

For each shot, you MUST track visible entities. Output format:

\`\`\`json
{
  "cws": {
    "rigId": "CU_A",
    "visibleEntityIds": ["hero", "villain"],
    "panelIndex": 3,
    "stateDelta": {
      "statesChanged": [{ "entityId": "hero", "from": "calm", "to": "alert" }]
    }
  }
}
\`\`\`

---

## NO TELEPORTING RULE (CRITICAL!)

Entities MUST move through space logically:
- entrance → approach → interact → exit
- NEVER cut from "far away" to "right next to" without showing movement
- Track position changes between panels

**Example violation:**
- Panel 1: Hero at door (z=10)
- Panel 2: Hero next to villain (z=0) ← TELEPORT!

**Fix:** Add intermediate shot showing hero walking.

---

## DIRECTION LOCKS (WORLD-RELATIVE)

Lock directions relative to world axes, not just screen:

| Lock Type | Example | Prompt Addition |
|-----------|---------|-----------------|
| FACING | Character looks RIGHT | "facing RIGHT - MAINTAIN EXACT DIRECTION" |
| TRAVEL | Moving LEFT_TO_RIGHT | "Travel: LEFT_TO_RIGHT. NO MIRRORING. NO DIRECTION FLIP." |
| SCREEN_POSITION | On LEFT of frame | "character on LEFT - maintain screen position" |

**CRITICAL for driving scenes:**
- Exterior shows car going DOWNHILL
- Interior MUST show: road descending through windshield

---

## 180° RULE ENFORCEMENT

Camera must stay on ONE SIDE of the line of action:

1. Establish line with WIDE_MASTER
2. Choose side A or B
3. All subsequent shots must use rigs on SAME side
4. To cross: use neutral shot (WIDE_MASTER) or continuous movement

**Side A rigs:** OTS_A, CU_A
**Side B rigs:** OTS_B, CU_B
**Neutral rigs:** WIDE_MASTER, REACTION_INSERT

---

## BEAT = WORLD STATE TRANSITION

Each beat maps to entity state changes:

\`\`\`
BEAT: catalyst
  BEFORE: hero at (0,0,0), facing CAMERA, state=calm
  AFTER: hero at (0,0,2), facing AWAY, state=determined
  CAMERA: WIDE_MASTER → CU_A → REACTION_INSERT
\`\`\`

---

## 3x3 GRID PANEL INDEXING

For storyboard grids:
\`\`\`
P1  P2  P3
P4  P5  P6
P7  P8  P9
\`\`\`

Each panel declares:
- Camera rig
- Visible entities
- State delta from previous panel

---

## CWS OUTPUT FORMAT

Add "cws" field to EVERY shot:

\`\`\`json
{
  "id": "shot_03",
  "photo_prompt": "Hero turns toward villain...",
  "motion_prompt": "Slow push-in, then holds",
  "cws": {
    "rigId": "CU_A",
    "visibleEntityIds": ["hero", "villain"],
    "panelIndex": 3,
    "stateDelta": {
      "entitiesMoved": [{ "entityId": "hero", "from": {"x":0,"y":0,"z":5}, "to": {"x":0,"y":0,"z":2} }],
      "statesChanged": [{ "entityId": "hero", "from": "standing", "to": "crouching" }]
    }
  }
}
\`\`\`

---

## CWS VALIDATION CHECKLIST

Before EACH shot, verify:
□ Entity positions logical from previous shot
□ No teleporting (movement must be shown)
□ Facing directions consistent (or turn shown)
□ Camera on correct side of line of action
□ Travel direction locked and consistent
□ Interior/exterior views match
□ Prop states only progress forward
□ Lighting direction consistent within scene

---

## DIRECTION LOCK PHRASES (AUTO-ADD TO ALL PROMPTS)

When direction locks are active, ALWAYS append:
"THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE. [direction locks]. NO MIRRORING. NO DIRECTION FLIP."
`;

// ============================================
// CONTEXT-AWARE PROMPT BUILDERS
// ============================================

/**
 * Build CWS context section for AI prompt based on current world state
 */
export function buildCWSContext(worldState: WorldState): string {
  if (!worldState.cwsEnabled) return '';

  const sections: string[] = ['## CURRENT CWS WORLD STATE'];

  // Scene info
  sections.push(`
**Scene:** ${worldState.sceneId}
**Panel:** ${worldState.currentPanel.panelIndex}
**Active Rig:** ${worldState.currentPanel.activeRig}
**Environment:** ${worldState.environment.location}, ${worldState.environment.timeOfDay}
**Lighting:** ${worldState.environment.lightingDirection}
`);

  // Entity positions
  const entityCount = Object.keys(worldState.entities).length;
  if (entityCount > 0) {
    sections.push('### ENTITIES IN WORLD:');
    for (const [id, entity] of Object.entries(worldState.entities)) {
      const pos = entity.position;
      sections.push(`- **${entity.name}** (${entity.type}): pos(${pos.x}, ${pos.y}, ${pos.z}), facing ${entity.facing}, state="${entity.state.current}"`);
    }
  }

  // Active direction locks
  const activeLocks = worldState.directionLocks.filter(l => l.active);
  if (activeLocks.length > 0) {
    sections.push('### ACTIVE DIRECTION LOCKS:');
    for (const lock of activeLocks) {
      sections.push(`- ${lock.entityId}: ${lock.lockType} locked to "${lock.lockedValue}"`);
    }
  }

  // 180-degree rule
  if (worldState.lineOfAction) {
    const { entityA, entityB, currentSide, violated } = worldState.lineOfAction;
    sections.push(`### 180° RULE:
- Line between: ${entityA} ↔ ${entityB}
- Camera on side: ${currentSide}
- Violated: ${violated ? 'YES (FIX REQUIRED)' : 'No'}
`);
  }

  // Visible entities in current panel
  if (worldState.currentPanel.visibleEntities.length > 0) {
    sections.push(`### VISIBLE IN CURRENT SHOT:`);
    sections.push(worldState.currentPanel.visibleEntities.join(', '));
  }

  return sections.join('\n');
}

/**
 * Generate lock phrase string to append to prompts
 */
export function generateLockPhrase(worldState: WorldState, entityId?: string): string {
  if (!worldState.cwsEnabled) return '';

  const phrases: string[] = ['THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE'];

  // Entity-specific locks
  if (entityId) {
    const entityLocks = worldState.directionLocks.filter(
      l => l.entityId === entityId && l.active
    );

    for (const lock of entityLocks) {
      switch (lock.lockType) {
        case 'FACING':
          phrases.push(`Character facing ${lock.lockedValue} - MAINTAIN EXACT DIRECTION`);
          break;
        case 'TRAVEL':
          phrases.push(`Travel direction: ${lock.lockedValue}. NO MIRRORING. NO DIRECTION FLIP.`);
          break;
        case 'SCREEN_POSITION':
          phrases.push(`Character on ${lock.lockedValue} of frame - MAINTAIN POSITION`);
          break;
      }
    }
  }

  // Environment locks
  if (worldState.environment.lightingDirection) {
    phrases.push(`Lighting from ${worldState.environment.lightingDirection} - SAME DIRECTION`);
  }

  // Always end with no mirroring
  if (!phrases.some(p => p.includes('NO MIRRORING'))) {
    phrases.push('NO MIRRORING. NO DIRECTION FLIP.');
  }

  return phrases.join('. ') + '.';
}

/**
 * Get camera rig suggestions based on beat type
 */
export function suggestRigsForBeat(beatType: string): string[] {
  const rigSuggestions: Record<string, string[]> = {
    'setup': ['WIDE_MASTER', 'TRACKING_LEFT', 'TRACKING_RIGHT'],
    'catalyst': ['WIDE_MASTER', 'CU_A', 'REACTION_INSERT'],
    'debate': ['OTS_A', 'OTS_B', 'CU_A', 'CU_B'],
    'midpoint': ['LOW_ANGLE_HERO', 'OTS_A', 'OTS_B', 'CU_A'],
    'crisis': ['HIGH_ANGLE_VULNERABLE', 'CU_A', 'CU_B', 'REACTION_INSERT'],
    'climax': ['LOW_ANGLE_HERO', 'WIDE_MASTER', 'CU_A', 'CU_B'],
    'resolution': ['WIDE_MASTER', 'TRACKING_LEFT', 'CU_A']
  };

  return rigSuggestions[beatType] || ['WIDE_MASTER', 'CU_A'];
}

/**
 * Format entity for prompt inclusion
 */
export function formatEntityForPrompt(entity: Entity): string {
  const pos = entity.position;
  return `${entity.name} at (${pos.x},${pos.y},${pos.z}), facing ${entity.facing}, ${entity.state.current}`;
}

/**
 * Format camera rig for prompt
 */
export function formatRigForPrompt(rig: CameraRig): string {
  const pos = rig.position;
  const look = rig.lookAt;
  return `${rig.name}: camera at (${pos.x},${pos.y},${pos.z}) looking at (${look.x},${look.y},${look.z}), ${rig.lens.focalLength}mm${rig.axisSide ? `, side ${rig.axisSide}` : ''}`;
}

/**
 * Build full CWS-enhanced system prompt section
 */
export function buildCWSSystemPromptSection(worldState: WorldState | null): string {
  if (!worldState?.cwsEnabled) {
    return ''; // CWS not enabled, return empty
  }

  return `
${CWS_SYSTEM_PROMPT}

${buildCWSContext(worldState)}
`;
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if a camera transition respects 180-degree rule
 */
export function validateCameraTransition(
  fromRigId: string,
  toRigId: string,
  worldState: WorldState
): { valid: boolean; reason?: string } {
  const fromRig = worldState.cameraRigs[fromRigId];
  const toRig = worldState.cameraRigs[toRigId];

  if (!fromRig || !toRig) {
    return { valid: true }; // Can't validate if rigs don't exist
  }

  if (!worldState.lineOfAction) {
    return { valid: true }; // No line of action defined
  }

  // Check if crossing axis
  if (fromRig.axisSide && toRig.axisSide && fromRig.axisSide !== toRig.axisSide) {
    return {
      valid: false,
      reason: `Camera crossed from side ${fromRig.axisSide} to side ${toRig.axisSide}. Insert neutral shot.`
    };
  }

  return { valid: true };
}

/**
 * Check if entity movement is reasonable (no teleporting)
 */
export function validateEntityMovement(
  entityId: string,
  fromPos: { x: number; y: number; z: number },
  toPos: { x: number; y: number; z: number }
): { valid: boolean; distance: number; reason?: string } {
  const distance = Math.sqrt(
    Math.pow(toPos.x - fromPos.x, 2) +
    Math.pow(toPos.y - fromPos.y, 2) +
    Math.pow(toPos.z - fromPos.z, 2)
  );

  if (distance > 2) {
    return {
      valid: false,
      distance,
      reason: `Entity moved ${distance.toFixed(1)} units. Add intermediate shot showing movement.`
    };
  }

  return { valid: true, distance };
}

// ============================================
// AGENT-SPECIFIC PROMPTS
// ============================================

export const CWS_NARRATIVE_AGENT_ADDITION = `
## CWS NARRATIVE RULES

When planning beats, map each to world state transitions:
- WHAT entities move? Track position changes.
- WHAT states change? Door opens, character sits, etc.
- WHAT camera sequence tells this beat?

Output beat structure as:
\`\`\`
BEAT: [name]
  ENTITIES: [list of involved entities]
  STATE_CHANGES: [what changes]
  RIG_SEQUENCE: [camera rig order]
  INTENSITY: [subtle/medium/strong/extreme]
\`\`\`
`;

export const CWS_VISUAL_AGENT_ADDITION = `
## CWS VISUAL RULES

When selecting camera placement:
1. Check current side of 180° rule
2. Select from appropriate rig list (side A or B)
3. Track camera position for continuity
4. Match lens to emotional beat (wide=context, close=emotion)

Available rigs by side:
- **Side A:** OTS_A, CU_A
- **Side B:** OTS_B, CU_B
- **Neutral:** WIDE_MASTER, REACTION_INSERT, LOW_ANGLE_HERO, HIGH_ANGLE_VULNERABLE

Output rig selection with reasoning:
\`\`\`
RIG: [rig_id]
  REASON: [why this rig for this beat]
  180_RULE: [side A/B/neutral]
\`\`\`
`;

export const CWS_TECHNICAL_AGENT_ADDITION = `
## CWS TECHNICAL RULES

When validating motion prompts:
1. Check entity movement respects direction locks
2. Verify camera transition is physically possible
3. Add lock phrases automatically if needed

Required validation:
\`\`\`
MOTION_CHECK:
  DIRECTION_LOCKS: [respected/violated]
  CAMERA_VALID: [yes/no]
  LOCK_PHRASE_NEEDED: [yes/no]
  SUGGESTED_ADDITIONS: [any phrases to add]
\`\`\`
`;

export const CWS_PRODUCTION_AGENT_ADDITION = `
## CWS PRODUCTION RULES

Before approving any shot, verify:

1. **NO TELEPORTING**
   - Entity position delta < 2 units OR movement shown
   - Flag: "TELEPORT VIOLATION" if jumped

2. **NO DIRECTION FLIP**
   - Check travel direction matches lock
   - Check facing direction matches lock
   - Flag: "DIRECTION VIOLATION" if flipped

3. **NO STATE REGRESSION**
   - Props can only progress forward (closed→open, not open→closed)
   - Flag: "STATE REGRESSION" if backwards

4. **180° RULE RESPECTED**
   - Camera stays on established side
   - Flag: "180 VIOLATION" if crossed without bridge

Output continuity report:
\`\`\`
CONTINUITY_CHECK:
  TELEPORT: [pass/fail + entity]
  DIRECTION: [pass/fail + entity]
  STATE: [pass/fail + prop]
  180_RULE: [pass/fail]
  LOCK_PHRASE: [generated phrase]
\`\`\`
`;

export default {
  CWS_SYSTEM_PROMPT,
  buildCWSContext,
  buildCWSSystemPromptSection,
  generateLockPhrase,
  suggestRigsForBeat,
  formatEntityForPrompt,
  formatRigForPrompt,
  validateCameraTransition,
  validateEntityMovement,
  CWS_NARRATIVE_AGENT_ADDITION,
  CWS_VISUAL_AGENT_ADDITION,
  CWS_TECHNICAL_AGENT_ADDITION,
  CWS_PRODUCTION_AGENT_ADDITION
};
