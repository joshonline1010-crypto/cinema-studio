/**
 * WorldStateContext - Live 3D World State for Agents
 *
 * This gives agents REAL spatial awareness:
 * - Query entity positions
 * - Get distances between entities
 * - Get camera rig positions and look-at targets
 * - Update entity positions as scenes progress
 * - Track movement history
 *
 * Instead of agents guessing from text, they can:
 * - "Where is HERO_A?" → [5, 0, 3]
 * - "How far is HERO_A from VILLAIN_B?" → 4.2 meters
 * - "What camera sees both?" → RIG_WIDE_001
 */

import type {
  WorldStateJSON,
  CameraRigsJSON,
  EntityDefinition,
  CameraRigDefinition,
  BeatDefinition
} from './specTypes';
import type { Vector3 } from '../cws/types';

// ============================================
// TYPES
// ============================================

export interface EntityState {
  id: string;
  type: EntityDefinition['entity_type'];
  position: [number, number, number];
  orientation: { yaw: number; pitch: number; roll: number };
  // NEW: Heading/facing direction (where entity is LOOKING)
  facing: {
    direction: [number, number, number];  // Normalized vector
    targetEntityId?: string;              // Who they're facing (if any)
    description: string;                  // "facing camera", "looking at VILLAIN"
  };
  refImageUrl?: string;
  appearanceNotes: string;
  // Movement tracking
  positionHistory: Array<{
    beatId: string;
    position: [number, number, number];
    facing: string;
    action: string;
  }>;
}

// ============================================
// AGENT DECISION TYPES (for write-back)
// ============================================

export interface AgentPositionDecision {
  entityId: string;
  beatId: string;
  // Position change
  newPosition?: [number, number, number];
  positionDelta?: [number, number, number];  // Relative movement
  // Facing change
  facingTarget?: string;                     // Entity ID to face
  facingDirection?: [number, number, number]; // Or explicit direction
  facingDescription?: string;                 // "turns toward camera"
  // Story reasoning
  storyReason: string;                       // WHY this position makes sense
  // Validation
  requiresLineOfSight?: string[];            // Must be able to see these entities
}

export interface SpatialValidationResult {
  isValid: boolean;
  issues: Array<{
    type: 'teleport' | 'wrong_facing' | 'blocked_sightline' | 'impossible_distance';
    entityId: string;
    message: string;
    suggestion?: string;
  }>;
}

export interface CameraState {
  id: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  defaultLens: number;
  allowedLenses: number[];
  motionAllowed: boolean;
  allowedMotions: string[];
}

export interface SpatialQuery {
  type: 'distance' | 'direction' | 'visibility' | 'nearest';
  fromEntity?: string;
  toEntity?: string;
  fromPosition?: [number, number, number];
}

export interface SpatialResult {
  distance?: number;
  direction?: [number, number, number];
  isVisible?: boolean;
  nearestEntity?: string;
  nearestCamera?: string;
}

export interface MovementPlan {
  entityId: string;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  action: string;
  durationSeconds: number;
}

// ============================================
// WORLD STATE CONTEXT CLASS
// ============================================

export class WorldStateContext {
  private entities: Map<string, EntityState> = new Map();
  private cameras: Map<string, CameraState> = new Map();
  private worldId: string = '';
  private groundPlaneY: number = 0;
  private lightingDirection: string = 'front-left';
  private currentBeatId: string = '';

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize from WorldEngineer output
   */
  initFromWorldState(worldState: WorldStateJSON, cameraRigs?: CameraRigsJSON): void {
    this.worldId = worldState.world_id;
    this.groundPlaneY = worldState.environment_geometry?.ground_plane?.Y || 0;
    this.lightingDirection = worldState.lighting?.primary_light_direction || 'front-left';

    // Load entities
    this.entities.clear();
    for (const entity of worldState.entities || []) {
      // Calculate initial facing from yaw
      const yawRad = ((entity.base_orientation?.yaw_deg || 0) * Math.PI) / 180;
      const facingDir: [number, number, number] = [
        Math.sin(yawRad),
        0,
        -Math.cos(yawRad)  // Negative Z is "forward" in our coordinate system
      ];

      this.entities.set(entity.entity_id, {
        id: entity.entity_id,
        type: entity.entity_type,
        position: [
          entity.base_world_position?.x || 0,
          entity.base_world_position?.y || 0,
          entity.base_world_position?.z || 0
        ],
        orientation: {
          yaw: entity.base_orientation?.yaw_deg || 0,
          pitch: entity.base_orientation?.pitch_deg || 0,
          roll: entity.base_orientation?.roll_deg || 0
        },
        facing: {
          direction: facingDir,
          targetEntityId: undefined,
          description: 'facing forward'
        },
        refImageUrl: entity.ref_image_url,
        appearanceNotes: entity.appearance_lock_notes || '',
        positionHistory: []
      });
    }

    // Load camera rigs
    this.cameras.clear();
    for (const rig of cameraRigs?.camera_rigs || []) {
      this.cameras.set(rig.rig_id, {
        id: rig.rig_id,
        position: [
          rig.camera_position?.x || 0,
          rig.camera_position?.y || 0,
          rig.camera_position?.z || 0
        ],
        lookAt: [
          rig.look_at?.x || 0,
          rig.look_at?.y || 0,
          rig.look_at?.z || 0
        ],
        defaultLens: rig.default_lens_mm || 50,
        allowedLenses: rig.allowed_lenses_mm || [35, 50, 85],
        motionAllowed: rig.camera_motion_allowed || false,
        allowedMotions: rig.allowed_camera_motions || []
      });
    }

    console.log(`[WorldStateContext] Initialized: ${this.entities.size} entities, ${this.cameras.size} cameras`);
  }

  // ============================================
  // ENTITY QUERIES
  // ============================================

  /**
   * Get entity position by ID
   */
  getEntityPosition(entityId: string): [number, number, number] | null {
    const entity = this.entities.get(entityId);
    return entity ? [...entity.position] : null;
  }

  /**
   * Get all entity IDs
   */
  getEntityIds(): string[] {
    return Array.from(this.entities.keys());
  }

  /**
   * Get entity by ID
   */
  getEntity(entityId: string): EntityState | null {
    const entity = this.entities.get(entityId);
    return entity ? { ...entity } : null;
  }

  /**
   * Get all entities of a type
   */
  getEntitiesByType(type: EntityDefinition['entity_type']): EntityState[] {
    return Array.from(this.entities.values()).filter(e => e.type === type);
  }

  /**
   * Get all characters
   */
  getCharacters(): EntityState[] {
    return this.getEntitiesByType('character');
  }

  // ============================================
  // SPATIAL CALCULATIONS
  // ============================================

  /**
   * Calculate distance between two entities
   */
  getDistanceBetween(entityA: string, entityB: string): number | null {
    const posA = this.getEntityPosition(entityA);
    const posB = this.getEntityPosition(entityB);
    if (!posA || !posB) return null;

    return Math.sqrt(
      Math.pow(posB[0] - posA[0], 2) +
      Math.pow(posB[1] - posA[1], 2) +
      Math.pow(posB[2] - posA[2], 2)
    );
  }

  /**
   * Get direction vector from entity A to entity B (normalized)
   */
  getDirectionBetween(entityA: string, entityB: string): [number, number, number] | null {
    const posA = this.getEntityPosition(entityA);
    const posB = this.getEntityPosition(entityB);
    if (!posA || !posB) return null;

    const dx = posB[0] - posA[0];
    const dy = posB[1] - posA[1];
    const dz = posB[2] - posA[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length === 0) return [0, 0, 0];
    return [dx / length, dy / length, dz / length];
  }

  /**
   * Find nearest entity to a position
   */
  getNearestEntity(position: [number, number, number], excludeId?: string): { entityId: string; distance: number } | null {
    let nearest: { entityId: string; distance: number } | null = null;

    this.entities.forEach((entity, id) => {
      if (id === excludeId) return;

      const dist = Math.sqrt(
        Math.pow(entity.position[0] - position[0], 2) +
        Math.pow(entity.position[1] - position[1], 2) +
        Math.pow(entity.position[2] - position[2], 2)
      );

      if (!nearest || dist < nearest.distance) {
        nearest = { entityId: id, distance: dist };
      }
    });

    return nearest;
  }

  /**
   * Check if two entities are within a certain distance
   */
  areEntitiesNear(entityA: string, entityB: string, threshold: number = 3): boolean {
    const distance = this.getDistanceBetween(entityA, entityB);
    return distance !== null && distance <= threshold;
  }

  /**
   * Get relative position description (for prompts)
   */
  getRelativePositionDescription(entityA: string, entityB: string): string {
    const posA = this.getEntityPosition(entityA);
    const posB = this.getEntityPosition(entityB);
    if (!posA || !posB) return 'unknown';

    const dx = posB[0] - posA[0];
    const dz = posB[2] - posA[2];
    const distance = this.getDistanceBetween(entityA, entityB) || 0;

    let horizontal = '';
    if (Math.abs(dx) > 0.5) {
      horizontal = dx > 0 ? 'right of' : 'left of';
    }

    let depth = '';
    if (Math.abs(dz) > 0.5) {
      depth = dz > 0 ? 'behind' : 'in front of';
    }

    const distDesc = distance < 2 ? 'close to' : distance < 5 ? 'near' : 'far from';

    if (horizontal && depth) {
      return `${distDesc} (${horizontal}, ${depth})`;
    }
    return `${distDesc} ${horizontal || depth || 'beside'}`;
  }

  // ============================================
  // CAMERA QUERIES
  // ============================================

  /**
   * Get camera rig by ID
   */
  getCameraRig(rigId: string): CameraState | null {
    const camera = this.cameras.get(rigId);
    return camera ? { ...camera } : null;
  }

  /**
   * Get all camera rig IDs
   */
  getCameraRigIds(): string[] {
    return Array.from(this.cameras.keys());
  }

  /**
   * Find best camera for framing entities
   */
  getBestCameraFor(entityIds: string[]): string | null {
    if (entityIds.length === 0) return null;

    // Calculate center of all entities
    let centerX = 0, centerY = 0, centerZ = 0;
    let count = 0;

    for (const id of entityIds) {
      const pos = this.getEntityPosition(id);
      if (pos) {
        centerX += pos[0];
        centerY += pos[1];
        centerZ += pos[2];
        count++;
      }
    }

    if (count === 0) return null;

    centerX /= count;
    centerY /= count;
    centerZ /= count;

    // Find camera whose lookAt is closest to this center
    let bestCamera: string | null = null;
    let bestScore = Infinity;

    this.cameras.forEach((camera, id) => {
      const dist = Math.sqrt(
        Math.pow(camera.lookAt[0] - centerX, 2) +
        Math.pow(camera.lookAt[1] - centerY, 2) +
        Math.pow(camera.lookAt[2] - centerZ, 2)
      );

      if (dist < bestScore) {
        bestScore = dist;
        bestCamera = id;
      }
    });

    return bestCamera;
  }

  /**
   * Get camera distance to entity
   */
  getCameraDistanceToEntity(cameraId: string, entityId: string): number | null {
    const camera = this.cameras.get(cameraId);
    const entity = this.entities.get(entityId);
    if (!camera || !entity) return null;

    return Math.sqrt(
      Math.pow(entity.position[0] - camera.position[0], 2) +
      Math.pow(entity.position[1] - camera.position[1], 2) +
      Math.pow(entity.position[2] - camera.position[2], 2)
    );
  }

  // ============================================
  // MOVEMENT & UPDATES
  // ============================================

  /**
   * Update entity position (for beat progression)
   */
  updateEntityPosition(entityId: string, newPosition: [number, number, number], action: string = 'MOVED'): void {
    const entity = this.entities.get(entityId);
    if (!entity) return;

    // Record history with facing
    entity.positionHistory.push({
      beatId: this.currentBeatId,
      position: [...entity.position],
      facing: entity.facing.description,
      action
    });

    // Update position
    entity.position = [...newPosition];
  }

  /**
   * Set current beat (for history tracking)
   */
  setCurrentBeat(beatId: string): void {
    this.currentBeatId = beatId;
  }

  /**
   * Plan movement from beat definition
   */
  planMovementForBeat(beat: BeatDefinition): MovementPlan[] {
    const plans: MovementPlan[] = [];
    const duration = beat.timecode_range_seconds
      ? (beat.timecode_range_seconds.end - beat.timecode_range_seconds.start)
      : 5;

    // Analyze beat for movement hints
    const text = [
      beat.end_state_truth || '',
      beat.allowed_deltas?.join(' ') || ''
    ].join(' ').toLowerCase();

    // Check each entity for movement
    this.entities.forEach((entity, id) => {
      if (text.includes(id.toLowerCase()) || text.includes('all') || beat.energy_level >= 4) {
        // Detect action
        let action = 'STANDING';
        let speed = 0;

        if (text.includes('run') || text.includes('chase')) {
          action = 'RUNNING';
          speed = 5;
        } else if (text.includes('walk') || text.includes('approach')) {
          action = 'WALKING';
          speed = 1.5;
        } else if (text.includes('sprint') || text.includes('charge')) {
          action = 'SPRINTING';
          speed = 8;
        } else if (text.includes('duck') || text.includes('crouch')) {
          action = 'DUCKING';
          speed = 0.5;
        }

        if (speed > 0) {
          const distance = Math.min(speed * duration, 10);
          const direction = this.inferMovementDirection(text, entity.position);

          const toPosition: [number, number, number] = [
            entity.position[0] + direction[0] * distance,
            Math.max(0, entity.position[1] + direction[1] * distance),
            entity.position[2] + direction[2] * distance
          ];

          plans.push({
            entityId: id,
            fromPosition: [...entity.position],
            toPosition,
            action,
            durationSeconds: duration
          });
        }
      }
    });

    return plans;
  }

  /**
   * Infer movement direction from text
   */
  private inferMovementDirection(text: string, currentPos: [number, number, number]): [number, number, number] {
    if (text.includes('toward camera') || text.includes('forward')) {
      return [0, 0, -1];
    }
    if (text.includes('away') || text.includes('retreat')) {
      return [0, 0, 1];
    }
    if (text.includes('left')) {
      return [-1, 0, 0];
    }
    if (text.includes('right')) {
      return [1, 0, 0];
    }
    if (text.includes('down') || text.includes('duck') || text.includes('crouch')) {
      return [0, -0.5, 0];
    }
    if (text.includes('up') || text.includes('jump') || text.includes('rise')) {
      return [0, 0.5, 0];
    }
    // Default: slight forward movement
    return [0, 0, -0.3];
  }

  /**
   * Apply movement plans to update positions
   */
  applyMovementPlans(plans: MovementPlan[]): void {
    for (const plan of plans) {
      this.updateEntityPosition(plan.entityId, plan.toPosition, plan.action);
    }
  }

  // ============================================
  // AGENT CONTEXT GENERATION
  // ============================================

  /**
   * Generate spatial context string for agent prompts
   */
  generateSpatialContext(): string {
    const lines: string[] = ['=== CURRENT WORLD STATE ==='];

    lines.push('\nENTITIES:');
    this.entities.forEach((entity, id) => {
      const pos = entity.position;
      lines.push(`  ${id} (${entity.type}): position [${pos[0].toFixed(1)}, ${pos[1].toFixed(1)}, ${pos[2].toFixed(1)}]`);
    });

    lines.push('\nCAMERA RIGS:');
    this.cameras.forEach((camera, id) => {
      lines.push(`  ${id}: position [${camera.position[0].toFixed(1)}, ${camera.position[1].toFixed(1)}, ${camera.position[2].toFixed(1)}] → lookAt [${camera.lookAt[0].toFixed(1)}, ${camera.lookAt[1].toFixed(1)}, ${camera.lookAt[2].toFixed(1)}]`);
    });

    lines.push('\nSPATIAL RELATIONSHIPS:');
    const entityIds = this.getEntityIds();
    for (let i = 0; i < entityIds.length; i++) {
      for (let j = i + 1; j < entityIds.length; j++) {
        const dist = this.getDistanceBetween(entityIds[i], entityIds[j]);
        if (dist !== null) {
          lines.push(`  ${entityIds[i]} ↔ ${entityIds[j]}: ${dist.toFixed(1)}m`);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate JSON context for agent
   */
  toJSON(): object {
    return {
      worldId: this.worldId,
      groundPlaneY: this.groundPlaneY,
      lightingDirection: this.lightingDirection,
      entities: Object.fromEntries(this.entities),
      cameras: Object.fromEntries(this.cameras)
    };
  }

  /**
   * Get summary stats
   */
  getSummary(): string {
    return `World "${this.worldId}": ${this.entities.size} entities, ${this.cameras.size} cameras`;
  }

  // ============================================
  // AGENT POSITION DECISIONS (WRITE-BACK)
  // ============================================

  /**
   * Apply an agent's position decision
   * Agents can now TELL us where characters should be
   */
  applyAgentDecision(decision: AgentPositionDecision): SpatialValidationResult {
    const entity = this.entities.get(decision.entityId);
    if (!entity) {
      return {
        isValid: false,
        issues: [{
          type: 'teleport',
          entityId: decision.entityId,
          message: `Entity "${decision.entityId}" not found`
        }]
      };
    }

    const issues: SpatialValidationResult['issues'] = [];
    const oldPosition = [...entity.position] as [number, number, number];

    // Calculate new position
    let newPosition: [number, number, number] = [...entity.position];
    if (decision.newPosition) {
      newPosition = decision.newPosition;
    } else if (decision.positionDelta) {
      newPosition = [
        entity.position[0] + decision.positionDelta[0],
        entity.position[1] + decision.positionDelta[1],
        entity.position[2] + decision.positionDelta[2]
      ];
    }

    // Validate: Check for teleportation (unrealistic movement)
    const distance = Math.sqrt(
      Math.pow(newPosition[0] - oldPosition[0], 2) +
      Math.pow(newPosition[1] - oldPosition[1], 2) +
      Math.pow(newPosition[2] - oldPosition[2], 2)
    );

    if (distance > 15) {
      issues.push({
        type: 'teleport',
        entityId: decision.entityId,
        message: `Movement of ${distance.toFixed(1)}m is too far for one beat`,
        suggestion: `Break into multiple beats or use cut/transition`
      });
    }

    // Update position
    entity.position = newPosition;

    // Handle facing direction
    if (decision.facingTarget) {
      this.setEntityFacing(decision.entityId, decision.facingTarget);
    } else if (decision.facingDirection) {
      entity.facing.direction = decision.facingDirection;
      entity.facing.targetEntityId = undefined;
      entity.facing.description = decision.facingDescription || 'custom direction';
    }

    // Validate line of sight requirements
    if (decision.requiresLineOfSight) {
      for (const targetId of decision.requiresLineOfSight) {
        if (!this.canEntitySee(decision.entityId, targetId)) {
          issues.push({
            type: 'blocked_sightline',
            entityId: decision.entityId,
            message: `${decision.entityId} cannot see ${targetId} from this position`,
            suggestion: `Adjust position or add camera cut`
          });
        }
      }
    }

    // Record in history
    entity.positionHistory.push({
      beatId: this.currentBeatId,
      position: oldPosition,
      facing: entity.facing.description,
      action: decision.storyReason
    });

    console.log(`[WorldStateContext] Applied decision: ${decision.entityId} moved ${distance.toFixed(1)}m (${decision.storyReason})`);

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Apply multiple agent decisions at once
   */
  applyAgentDecisions(decisions: AgentPositionDecision[]): SpatialValidationResult {
    const allIssues: SpatialValidationResult['issues'] = [];

    for (const decision of decisions) {
      const result = this.applyAgentDecision(decision);
      allIssues.push(...result.issues);
    }

    return {
      isValid: allIssues.length === 0,
      issues: allIssues
    };
  }

  // ============================================
  // FACING/HEADING CONTROL
  // ============================================

  /**
   * Set entity to face another entity
   */
  setEntityFacing(entityId: string, targetEntityId: string): void {
    const entity = this.entities.get(entityId);
    const target = this.entities.get(targetEntityId);
    if (!entity || !target) return;

    // Calculate direction vector
    const dx = target.position[0] - entity.position[0];
    const dy = target.position[1] - entity.position[1];
    const dz = target.position[2] - entity.position[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length > 0) {
      entity.facing.direction = [dx / length, dy / length, dz / length];
      entity.facing.targetEntityId = targetEntityId;
      entity.facing.description = `facing ${targetEntityId}`;

      // Update yaw in orientation
      entity.orientation.yaw = Math.atan2(dx, -dz) * (180 / Math.PI);
    }
  }

  /**
   * Set entity to face camera
   */
  setEntityFacingCamera(entityId: string, cameraId: string): void {
    const entity = this.entities.get(entityId);
    const camera = this.cameras.get(cameraId);
    if (!entity || !camera) return;

    const dx = camera.position[0] - entity.position[0];
    const dy = camera.position[1] - entity.position[1];
    const dz = camera.position[2] - entity.position[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length > 0) {
      entity.facing.direction = [dx / length, dy / length, dz / length];
      entity.facing.targetEntityId = undefined;
      entity.facing.description = `facing camera ${cameraId}`;

      entity.orientation.yaw = Math.atan2(dx, -dz) * (180 / Math.PI);
    }
  }

  /**
   * Get entity facing description for prompts
   */
  getEntityFacingDescription(entityId: string): string {
    const entity = this.entities.get(entityId);
    if (!entity) return 'unknown';
    return entity.facing.description;
  }

  /**
   * Check if entity can "see" another (simple line-of-sight)
   */
  canEntitySee(entityId: string, targetId: string): boolean {
    const entity = this.entities.get(entityId);
    const target = this.entities.get(targetId);
    if (!entity || !target) return false;

    // Calculate angle between facing direction and direction to target
    const dx = target.position[0] - entity.position[0];
    const dz = target.position[2] - entity.position[2];
    const toTargetAngle = Math.atan2(dx, -dz);
    const facingAngle = Math.atan2(entity.facing.direction[0], -entity.facing.direction[2]);

    // Allow ~120 degree field of view
    const angleDiff = Math.abs(toTargetAngle - facingAngle);
    return angleDiff < Math.PI / 3 || angleDiff > (5 * Math.PI / 3);
  }

  // ============================================
  // ENHANCED SPATIAL CONTEXT (WITH FACING)
  // ============================================

  /**
   * Generate full spatial context with facing info for agent prompts
   */
  generateFullSpatialContext(): string {
    const lines: string[] = ['=== CURRENT WORLD STATE (FULL) ==='];

    lines.push('\nENTITIES (with facing):');
    this.entities.forEach((entity, id) => {
      const pos = entity.position;
      lines.push(`  ${id} (${entity.type}):`);
      lines.push(`    Position: [${pos[0].toFixed(1)}, ${pos[1].toFixed(1)}, ${pos[2].toFixed(1)}]`);
      lines.push(`    Facing: ${entity.facing.description}`);
      if (entity.facing.targetEntityId) {
        lines.push(`    Looking at: ${entity.facing.targetEntityId}`);
      }
    });

    lines.push('\nCAMERA RIGS:');
    this.cameras.forEach((camera, id) => {
      lines.push(`  ${id}:`);
      lines.push(`    Position: [${camera.position[0].toFixed(1)}, ${camera.position[1].toFixed(1)}, ${camera.position[2].toFixed(1)}]`);
      lines.push(`    Looking at: [${camera.lookAt[0].toFixed(1)}, ${camera.lookAt[1].toFixed(1)}, ${camera.lookAt[2].toFixed(1)}]`);
      lines.push(`    Lens: ${camera.defaultLens}mm`);
    });

    lines.push('\nSPATIAL RELATIONSHIPS:');
    const entityIds = this.getEntityIds();
    for (let i = 0; i < entityIds.length; i++) {
      for (let j = i + 1; j < entityIds.length; j++) {
        const dist = this.getDistanceBetween(entityIds[i], entityIds[j]);
        const canSeeA = this.canEntitySee(entityIds[i], entityIds[j]);
        const canSeeB = this.canEntitySee(entityIds[j], entityIds[i]);
        if (dist !== null) {
          let sightline = '';
          if (canSeeA && canSeeB) sightline = ' (mutual eye contact possible)';
          else if (canSeeA) sightline = ` (${entityIds[i]} can see ${entityIds[j]})`;
          else if (canSeeB) sightline = ` (${entityIds[j]} can see ${entityIds[i]})`;
          lines.push(`  ${entityIds[i]} ↔ ${entityIds[j]}: ${dist.toFixed(1)}m${sightline}`);
        }
      }
    }

    lines.push('\nSTORY CONTEXT RULES:');
    lines.push('  - Characters should face who they are talking to');
    lines.push('  - Characters should face threats/danger');
    lines.push('  - Camera should capture faces when possible');
    lines.push('  - Movement should be physically possible (max ~10m per beat)');

    return lines.join('\n');
  }

  /**
   * Validate story spatial consistency
   */
  validateStoryConsistency(storyContext: {
    speakingTo?: { from: string; to: string }[];
    threats?: { entity: string; threatFrom: string }[];
    focusCharacters?: string[];
  }): SpatialValidationResult {
    const issues: SpatialValidationResult['issues'] = [];

    // Check speaking characters face each other
    for (const pair of storyContext.speakingTo || []) {
      const fromEntity = this.entities.get(pair.from);
      const toEntity = this.entities.get(pair.to);
      if (fromEntity && toEntity) {
        if (!this.canEntitySee(pair.from, pair.to)) {
          issues.push({
            type: 'wrong_facing',
            entityId: pair.from,
            message: `${pair.from} is speaking to ${pair.to} but not facing them`,
            suggestion: `Add: setEntityFacing("${pair.from}", "${pair.to}")`
          });
        }
      }
    }

    // Check characters face threats
    for (const threat of storyContext.threats || []) {
      if (!this.canEntitySee(threat.entity, threat.threatFrom)) {
        issues.push({
          type: 'wrong_facing',
          entityId: threat.entity,
          message: `${threat.entity} should be aware of threat from ${threat.threatFrom}`,
          suggestion: `Consider if character should face or flee from threat`
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const worldStateContext = new WorldStateContext();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create context from pipeline world output
 */
export function createWorldContext(worldOutput: { worldState: WorldStateJSON; cameraRigs?: CameraRigsJSON }): WorldStateContext {
  const ctx = new WorldStateContext();
  ctx.initFromWorldState(worldOutput.worldState, worldOutput.cameraRigs);
  return ctx;
}

/**
 * Quick spatial query
 */
export function querySpatial(
  ctx: WorldStateContext,
  query: SpatialQuery
): SpatialResult {
  const result: SpatialResult = {};

  if (query.type === 'distance' && query.fromEntity && query.toEntity) {
    result.distance = ctx.getDistanceBetween(query.fromEntity, query.toEntity) || undefined;
  }

  if (query.type === 'direction' && query.fromEntity && query.toEntity) {
    result.direction = ctx.getDirectionBetween(query.fromEntity, query.toEntity) || undefined;
  }

  if (query.type === 'nearest' && query.fromPosition) {
    const nearest = ctx.getNearestEntity(query.fromPosition);
    if (nearest) {
      result.nearestEntity = nearest.entityId;
      result.distance = nearest.distance;
    }
  }

  return result;
}

export default worldStateContext;
