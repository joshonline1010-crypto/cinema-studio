/**
 * ScenePositionTracker - Beat-to-Beat Spatial Continuity
 *
 * Tracks entity positions across all beats and generates actorMovement data
 * that World Mode can visualize as movement paths.
 *
 * CORE PRINCIPLE: Characters don't teleport. Every position change must be
 * tracked and justified by an action (WALKING, RUNNING, DUCKING, etc.)
 */

import type { BeatDefinition, WorldStateJSON, EntityDefinition } from './specTypes';

// ============================================
// TYPES
// ============================================

export type MovementAction =
  | 'STANDING'
  | 'WALKING'
  | 'RUNNING'
  | 'SPRINTING'
  | 'DUCKING'
  | 'DIVING'
  | 'CROUCHING'
  | 'RISING'
  | 'CRAWLING'
  | 'JUMPING'
  | 'FALLING'
  | 'HEROIC_STRIDE'
  | 'RETREATING'
  | 'ADVANCING'
  | 'CIRCLING'
  | 'LOOKING_AROUND';

export interface ActorMovement {
  actorId: string;
  actorName?: string;
  startPos: [number, number, number];
  endPos: [number, number, number];
  action: MovementAction;
  speed?: number; // meters per second
}

export interface TrackedEntity {
  id: string;
  name: string;
  currentPos: [number, number, number];
  initialPos: [number, number, number];
  positionHistory: Array<{
    beatIndex: number;
    beatId: string;
    pos: [number, number, number];
    action: MovementAction;
  }>;
}

export interface BeatWithMovement extends BeatDefinition {
  actorMovement?: ActorMovement[];
}

export interface PositionTrackerOutput {
  beatsWithMovement: BeatWithMovement[];
  entityJourneys: Map<string, TrackedEntity>;
  totalDistance: Map<string, number>; // Total distance traveled per entity
}

// ============================================
// ACTION DETECTION FROM BEAT CONTENT
// ============================================

/**
 * Detect movement action from beat description/action
 */
function detectActionFromBeat(beat: BeatDefinition): MovementAction {
  const text = [
    beat.end_state_truth || '',
    beat.camera_intent || '',
    beat.allowed_deltas?.join(' ') || ''
  ].join(' ').toLowerCase();

  // High intensity actions
  if (text.includes('sprint') || text.includes('dash') || text.includes('charge')) {
    return 'SPRINTING';
  }
  if (text.includes('run') || text.includes('chase') || text.includes('flee')) {
    return 'RUNNING';
  }
  if (text.includes('dive') || text.includes('leap') || text.includes('lunge')) {
    return 'DIVING';
  }
  if (text.includes('jump') || text.includes('vault')) {
    return 'JUMPING';
  }
  if (text.includes('fall') || text.includes('drop') || text.includes('collapse')) {
    return 'FALLING';
  }

  // Medium intensity
  if (text.includes('walk') || text.includes('approach') || text.includes('move')) {
    return 'WALKING';
  }
  if (text.includes('advance') || text.includes('push forward')) {
    return 'ADVANCING';
  }
  if (text.includes('retreat') || text.includes('back away') || text.includes('fall back')) {
    return 'RETREATING';
  }
  if (text.includes('crouch') || text.includes('squat') || text.includes('low')) {
    return 'CROUCHING';
  }
  if (text.includes('duck') || text.includes('cover') || text.includes('dodge')) {
    return 'DUCKING';
  }
  if (text.includes('crawl') || text.includes('prone')) {
    return 'CRAWLING';
  }
  if (text.includes('rise') || text.includes('stand up') || text.includes('get up')) {
    return 'RISING';
  }
  if (text.includes('circle') || text.includes('orbit') || text.includes('surround')) {
    return 'CIRCLING';
  }
  if (text.includes('heroic') || text.includes('dramatic') || text.includes('stride')) {
    return 'HEROIC_STRIDE';
  }
  if (text.includes('look') || text.includes('scan') || text.includes('survey')) {
    return 'LOOKING_AROUND';
  }

  // Default
  return 'STANDING';
}

/**
 * Get movement speed based on action (meters per second)
 */
function getActionSpeed(action: MovementAction): number {
  switch (action) {
    case 'SPRINTING': return 8.0;
    case 'RUNNING': return 5.0;
    case 'DIVING': return 6.0;
    case 'JUMPING': return 4.0;
    case 'WALKING': return 1.5;
    case 'ADVANCING': return 2.0;
    case 'RETREATING': return 2.0;
    case 'HEROIC_STRIDE': return 1.0;
    case 'CRAWLING': return 0.5;
    case 'CROUCHING': return 0.3;
    case 'DUCKING': return 0.5;
    case 'CIRCLING': return 1.5;
    case 'RISING': return 0.5;
    case 'FALLING': return 5.0;
    case 'LOOKING_AROUND': return 0;
    case 'STANDING': return 0;
    default: return 0;
  }
}

/**
 * Calculate movement direction based on camera intent and action
 */
function getMovementDirection(
  beat: BeatDefinition,
  action: MovementAction,
  entityIndex: number
): [number, number, number] {
  const intent = (beat.camera_intent || '').toLowerCase();
  const desc = (beat.end_state_truth || '').toLowerCase();

  // Direction vectors (normalized-ish)
  const FORWARD: [number, number, number] = [0, 0, -1];  // Toward camera
  const BACKWARD: [number, number, number] = [0, 0, 1];  // Away from camera
  const LEFT: [number, number, number] = [-1, 0, 0];
  const RIGHT: [number, number, number] = [1, 0, 0];
  const UP: [number, number, number] = [0, 1, 0];
  const DOWN: [number, number, number] = [0, -1, 0];

  // Determine direction based on context
  if (desc.includes('toward camera') || desc.includes('approaching')) {
    return FORWARD;
  }
  if (desc.includes('away') || desc.includes('retreating')) {
    return BACKWARD;
  }
  if (desc.includes('left')) {
    return LEFT;
  }
  if (desc.includes('right')) {
    return RIGHT;
  }
  if (action === 'FALLING' || action === 'DUCKING' || action === 'CROUCHING') {
    return DOWN;
  }
  if (action === 'RISING' || action === 'JUMPING') {
    return UP;
  }

  // Default: slight forward/lateral movement based on entity index
  // This creates natural separation between characters
  const angle = (entityIndex * 45) * Math.PI / 180;
  return [Math.sin(angle) * 0.5, 0, -Math.cos(angle) * 0.5];
}

// ============================================
// MAIN TRACKER CLASS
// ============================================

export class ScenePositionTracker {
  private entities: Map<string, TrackedEntity> = new Map();
  private worldState: WorldStateJSON | null = null;

  /**
   * Initialize tracker with world state
   */
  initialize(worldState: WorldStateJSON): void {
    this.worldState = worldState;
    this.entities.clear();

    // Create tracked entities from world state
    for (const entity of worldState.entities || []) {
      const pos: [number, number, number] = [
        entity.base_world_position?.x || 0,
        entity.base_world_position?.y || 0,
        entity.base_world_position?.z || 0
      ];

      this.entities.set(entity.entity_id, {
        id: entity.entity_id,
        name: entity.entity_id,
        currentPos: [...pos],
        initialPos: [...pos],
        positionHistory: []
      });
    }

    console.log('[ScenePositionTracker] Initialized with', this.entities.size, 'entities');
  }

  /**
   * Process all beats and generate actorMovement data
   */
  processBeats(beats: BeatDefinition[]): PositionTrackerOutput {
    const beatsWithMovement: BeatWithMovement[] = [];

    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i];
      const movements = this.processSingleBeat(beat, i);

      beatsWithMovement.push({
        ...beat,
        actorMovement: movements
      });
    }

    // Calculate total distances
    const totalDistance = new Map<string, number>();
    this.entities.forEach((entity, id) => {
      let distance = 0;
      for (let i = 1; i < entity.positionHistory.length; i++) {
        const prev = entity.positionHistory[i - 1].pos;
        const curr = entity.positionHistory[i].pos;
        distance += Math.sqrt(
          Math.pow(curr[0] - prev[0], 2) +
          Math.pow(curr[1] - prev[1], 2) +
          Math.pow(curr[2] - prev[2], 2)
        );
      }
      totalDistance.set(id, distance);
    });

    console.log('[ScenePositionTracker] Processed', beats.length, 'beats');
    console.log('[ScenePositionTracker] Entity journeys:',
      Array.from(totalDistance.entries()).map(([id, dist]) => `${id}: ${dist.toFixed(1)}m`).join(', ')
    );

    return {
      beatsWithMovement,
      entityJourneys: this.entities,
      totalDistance
    };
  }

  /**
   * Process a single beat and update entity positions
   */
  private processSingleBeat(beat: BeatDefinition, beatIndex: number): ActorMovement[] {
    const movements: ActorMovement[] = [];
    const action = detectActionFromBeat(beat);
    const speed = getActionSpeed(action);
    // Calculate duration from timecode range (already in seconds)
    const beatDuration = beat.timecode_range_seconds
      ? (beat.timecode_range_seconds.end - beat.timecode_range_seconds.start)
      : 5;

    // Calculate max movement distance for this beat
    const maxDistance = speed * beatDuration;

    let entityIndex = 0;
    this.entities.forEach((entity, entityId) => {
      const startPos: [number, number, number] = [...entity.currentPos];

      // Determine if this entity moves in this beat
      const shouldMove = this.entityShouldMove(entity, beat, action);

      if (shouldMove && maxDistance > 0) {
        // Calculate movement
        const direction = getMovementDirection(beat, action, entityIndex);
        const distance = Math.min(maxDistance, this.getContextualDistance(beat, action));

        const endPos: [number, number, number] = [
          startPos[0] + direction[0] * distance,
          startPos[1] + direction[1] * distance,
          startPos[2] + direction[2] * distance
        ];

        // Clamp Y to floor (0) unless jumping/falling
        if (action !== 'JUMPING' && action !== 'FALLING') {
          endPos[1] = Math.max(0, endPos[1]);
        }

        // Update entity position
        entity.currentPos = [...endPos];
        entity.positionHistory.push({
          beatIndex,
          beatId: beat.beat_id,
          pos: [...endPos],
          action
        });

        movements.push({
          actorId: entityId,
          actorName: entity.name,
          startPos,
          endPos,
          action,
          speed
        });
      } else {
        // Entity doesn't move but we still track position
        entity.positionHistory.push({
          beatIndex,
          beatId: beat.beat_id,
          pos: [...entity.currentPos],
          action: 'STANDING'
        });

        // Still add movement data (for World Mode to know position)
        movements.push({
          actorId: entityId,
          actorName: entity.name,
          startPos,
          endPos: startPos, // Same position
          action: 'STANDING',
          speed: 0
        });
      }

      entityIndex++;
    });

    return movements;
  }

  /**
   * Determine if entity should move in this beat
   */
  private entityShouldMove(entity: TrackedEntity, beat: BeatDefinition, action: MovementAction): boolean {
    // Static actions = no movement
    if (action === 'STANDING' || action === 'LOOKING_AROUND') {
      return false;
    }

    // Check if beat mentions this entity
    const beatText = [
      beat.end_state_truth || '',
      beat.allowed_deltas?.join(' ') || ''
    ].join(' ').toLowerCase();

    // If beat specifically mentions this entity, they move
    if (beatText.includes(entity.id.toLowerCase()) || beatText.includes(entity.name.toLowerCase())) {
      return true;
    }

    // Group actions - everyone moves
    if (beatText.includes('all') || beatText.includes('everyone') || beatText.includes('group')) {
      return true;
    }

    // High energy beats - protagonists move
    if (beat.energy_level && beat.energy_level >= 4) {
      return true;
    }

    // Default: yes move (STANDING/LOOKING_AROUND already filtered above)
    return true;
  }

  /**
   * Get contextual movement distance based on beat content
   */
  private getContextualDistance(beat: BeatDefinition, action: MovementAction): number {
    const energy = beat.energy_level || 3;
    const duration = beat.timecode_range_seconds
      ? (beat.timecode_range_seconds.end - beat.timecode_range_seconds.start)
      : 5;

    // Base distance on energy and action
    let baseDistance = getActionSpeed(action) * duration;

    // Scale by energy level
    if (energy >= 5) {
      baseDistance *= 1.5; // Climax - big movements
    } else if (energy >= 4) {
      baseDistance *= 1.2;
    } else if (energy <= 2) {
      baseDistance *= 0.5; // Calm - small movements
    }

    // Cap maximum distance per beat (prevents teleporting)
    return Math.min(baseDistance, 10); // Max 10 meters per beat
  }

  /**
   * Get current position of an entity
   */
  getEntityPosition(entityId: string): [number, number, number] | null {
    const entity = this.entities.get(entityId);
    return entity ? [...entity.currentPos] : null;
  }

  /**
   * Get all current positions
   */
  getAllPositions(): Map<string, [number, number, number]> {
    const positions = new Map<string, [number, number, number]>();
    this.entities.forEach((entity, id) => {
      positions.set(id, [...entity.currentPos]);
    });
    return positions;
  }

  /**
   * Reset all entities to initial positions
   */
  reset(): void {
    this.entities.forEach(entity => {
      entity.currentPos = [...entity.initialPos];
      entity.positionHistory = [];
    });
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const scenePositionTracker = new ScenePositionTracker();

// ============================================
// HELPER FUNCTION FOR PIPELINE INTEGRATION
// ============================================

/**
 * Process beats and add actorMovement data
 * Use this in the pipeline after beat planning
 */
export function addMovementToBeats(
  beats: BeatDefinition[],
  worldState: WorldStateJSON
): BeatWithMovement[] {
  const tracker = new ScenePositionTracker();
  tracker.initialize(worldState);
  const result = tracker.processBeats(beats);
  return result.beatsWithMovement;
}

/**
 * Generate movement summary for debugging
 */
export function generateMovementSummary(beatsWithMovement: BeatWithMovement[]): string {
  const lines: string[] = ['=== MOVEMENT SUMMARY ==='];

  for (const beat of beatsWithMovement) {
    lines.push(`\nBeat ${beat.beat_id}:`);
    for (const move of beat.actorMovement || []) {
      const distance = Math.sqrt(
        Math.pow(move.endPos[0] - move.startPos[0], 2) +
        Math.pow(move.endPos[1] - move.startPos[1], 2) +
        Math.pow(move.endPos[2] - move.startPos[2], 2)
      );
      lines.push(`  ${move.actorId}: ${move.action} (${distance.toFixed(1)}m)`);
      lines.push(`    ${move.startPos.map(n => n.toFixed(1)).join(',')} → ${move.endPos.map(n => n.toFixed(1)).join(',')}`);
    }
  }

  return lines.join('\n');
}

export default scenePositionTracker;
