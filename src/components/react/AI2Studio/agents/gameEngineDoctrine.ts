/**
 * GAME ENGINE DOCTRINE
 *
 * Full System Doctrine for treating AI like a deterministic world simulator.
 * Based on the "GAME 3D CODE" and "PICASSO CODE" documents.
 *
 * Core Breakthrough: AI models behave better when treated like a game engine + film set,
 * not an art generator. Define a single shared world, lock coordinates, separate world truth
 * from camera perception, and enforce redundant constraints.
 *
 * The 3-Layer Control System:
 * - Layer 1: WORLD SPACE (3D Truth) - Objective reality, nothing cheats
 * - Layer 2: CAMERA SPACE (Perception) - How the world is observed, not changed
 * - Layer 3: SCREEN SPACE (NDC Validation) - Prevents drift, scale cheating, flipping
 */

// ============================================
// LAYER 1: WORLD SPACE (3D TRUTH)
// ============================================
// This is objective reality. Nothing cheats here.
// X = left/right, Y = up/down, Z = forward/back
// Units are METERS

export interface WorldCoordinates {
  x: number;  // Left (-) / Right (+)
  y: number;  // Down (-) / Up (+)
  z: number;  // Back (-) / Forward (+)
}

export interface WorldSpaceTruth {
  units: 'meters';
  origin: WorldCoordinates;
  gravity_direction: { x: 0; y: -1; z: 0 };
  time_seconds: number;
}

export interface WorldBounds {
  min: WorldCoordinates;
  max: WorldCoordinates;
}

export interface ActorWorldPosition {
  actor_id: string;
  position: WorldCoordinates;
  locked: boolean;  // If true, NEVER moves unless explicitly specified
  bounds?: WorldBounds;  // Allowed movement range if not locked
  facing_direction: CompassDirection;
}

// ============================================
// COMPASS SYSTEM (Directional Truth)
// ============================================
// Reduces ambiguity by using cardinal directions

export type CompassDirection =
  | 'NORTH'      // +Z = skyline / threat direction
  | 'SOUTH'      // -Z = camera fallback space
  | 'EAST'       // +X = defender bias
  | 'WEST'       // -X = attacker bias
  | 'NORTH_EAST'
  | 'NORTH_WEST'
  | 'SOUTH_EAST'
  | 'SOUTH_WEST'
  | 'UP'         // +Y
  | 'DOWN';      // -Y

export interface CompassLighting {
  key_light_from: CompassDirection;
  key_light_intensity: number;  // 0-1
  fill_light_from: CompassDirection;
  fill_light_intensity: number;
  rim_light_from?: CompassDirection;
  rim_light_intensity?: number;
  color_temperature_kelvin: number;  // e.g., 5600 for daylight
}

export interface CompassBasedDirection {
  movement_direction: CompassDirection;
  eyeline_direction: CompassDirection;
  threat_from: CompassDirection;
}

// ============================================
// LAYER 2: CAMERA SPACE (Perception)
// ============================================
// How the world is OBSERVED, not changed.
// Cuts happen by switching cameras, not by moving the world.

export interface CameraDefinition {
  camera_id: string;
  position: WorldCoordinates;
  look_at: WorldCoordinates;
  lens_mm: number;  // SACRED - never changes within a sequence
  sensor_size?: 'full_frame' | 'super35' | 'aps-c';
}

export interface CameraStack {
  cameras: CameraDefinition[];
  active_camera_id: string;
}

export interface CameraCut {
  from_camera_id: string;
  to_camera_id: string;
  cut_type: 'hard' | 'dissolve' | 'wipe';
  motivation: string;  // Why this cut happens
}

// ============================================
// LAYER 3: SCREEN SPACE (NDC Validation)
// ============================================
// Even with world + camera defined, models still cheat.
// Screen-space constraints act as validators.
// NDC: (0,0) = top-left, (1,1) = bottom-right, (0.5, 0.5) = center

export interface NDCCoordinates {
  x: number;  // 0.0 = left edge, 1.0 = right edge
  y: number;  // 0.0 = top edge, 1.0 = bottom edge
}

export interface ScreenSpaceAnchor {
  actor_id: string;
  screen_position: NDCCoordinates;
  allowed_drift: number;  // e.g., 0.03 = ±3% of screen
}

export interface ScreenSpaceConstraints {
  anchors: ScreenSpaceAnchor[];
  dominant_side: 'LEFT' | 'RIGHT' | 'CENTER';
  forbid_flip: boolean;
  forbid_scale_drift: boolean;
}

// ============================================
// TIME SYSTEM (Causality)
// ============================================
// Time must be explicit or the model will montage.

export interface TimeWindow {
  total_duration_seconds: number;
  current_time_seconds: number;
}

export interface PanelTiming {
  panel_id: string;
  time_start_seconds: number;
  time_end_seconds: number;
  delta_seconds: number;  // How much time passes in this panel
}

export interface TimelineEvent {
  event_id: string;
  timestamp_seconds: number;
  event_type: 'spawn' | 'impact' | 'destroy' | 'state_change';
  actor_id: string;
  description: string;
}

export interface Timeline {
  events: TimelineEvent[];
  no_rewinds: true;  // Time only moves forward
  no_jumps: true;    // No skipping time
}

// ============================================
// OBJECT LIFECYCLE (Physics)
// ============================================
// Objects are not props — they are entities with physics.

export interface PhysicsObject {
  object_id: string;
  mass_kg: number;
  spawn_origin: WorldCoordinates;
  current_position: WorldCoordinates;
  velocity?: WorldCoordinates;
  affected_by_gravity: boolean;
  state: ObjectState;
}

export type ObjectState =
  | 'intact'
  | 'falling'
  | 'impacted'
  | 'shattered'
  | 'deformed'
  | 'burning'
  | 'destroyed';

export interface ImpactEvent {
  object_id: string;
  impact_position: WorldCoordinates;
  impact_force: number;
  result: ObjectState;
  debris_persists: boolean;  // Shards/dust remain visible
}

export interface ObjectLifecycle {
  spawn: TimelineEvent;
  impacts: ImpactEvent[];
  current_state: ObjectState;
  persistence: boolean;  // Object remains visible across panels
}

// ============================================
// PICASSO CODE (Multi-View Compression)
// ============================================
// For single impossible photographs with multiple viewpoints.
// NOT for grids - for single frames only.

export interface PicassoInvariants {
  one_subject: true;           // Same object, same features, same proportions
  one_timestamp: true;         // Frozen moment, no pose resets between views
  every_view_correct: true;    // Each viewpoint obeys perspective, scale, lighting
  one_coordinate_system: true; // One world space, many projections
}

export interface PicassoCameraStack {
  truth_view: CameraDefinition;      // Main orientation, provides readability skeleton
  information_view: CameraDefinition; // Adds side face, unseen plane, second angle
  continuity_view?: CameraDefinition; // Confirms volume, gives depth cues
}

export interface PicassoMergeRules {
  no_double_counting_mass: true;     // No duplicated anatomy
  overlap_motivated: 'layered_glass' | 'folded_paper' | 'rotating_blueprint';
  lighting_global: true;             // Same light source direction across views
  silhouette_owner: string;          // Which camera owns the primary silhouette
}

// ============================================
// FULL WORLD STATE (Core Output)
// ============================================

export interface GameEngineWorldState {
  // Layer 1: World Space
  world: WorldSpaceTruth;
  actors: ActorWorldPosition[];
  objects: PhysicsObject[];
  compass_lighting: CompassLighting;

  // Layer 2: Camera Space
  cameras: CameraStack;
  lens_locked: boolean;  // SACRED - never changes

  // Layer 3: Screen Space
  screen_constraints: ScreenSpaceConstraints;

  // Time
  timeline: Timeline;
  panel_timings: PanelTiming[];
}

// ============================================
// SHOT CARD (Full Definition)
// ============================================

export interface GameEngineShotCard {
  shot_id: string;

  // World Space
  actor_positions: ActorWorldPosition[];
  object_states: PhysicsObject[];

  // Camera Space
  camera: CameraDefinition;
  lens_mm: number;  // Locked

  // Screen Space
  screen_anchors: ScreenSpaceAnchor[];
  dominant_side: 'LEFT' | 'RIGHT' | 'CENTER';

  // Time
  timing: PanelTiming;
  time_delta_seconds: number;

  // Compass
  lighting: CompassLighting;
  movement_direction: CompassDirection;

  // Output Prompts
  photo_prompt: string;
  motion_prompt: string;
  continuity_locks: string[];
}

// ============================================
// VALIDATION CHECKLIST
// ============================================

export interface DoctrinValidation {
  // World Space checks
  positions_locked: boolean;
  no_teleporting: boolean;
  physics_causal: boolean;

  // Camera Space checks
  lens_unchanged: boolean;
  cuts_via_camera_switch: boolean;

  // Screen Space checks
  anchors_within_drift: boolean;
  no_scale_drift: boolean;
  no_flip: boolean;

  // Time checks
  time_monotonic: boolean;  // Only moves forward
  no_jumps: boolean;

  // Continuity
  identity_preserved: boolean;
  debris_persists: boolean;
  lighting_consistent: boolean;
}

// ============================================
// DOCTRINE CONSTANTS
// ============================================

export const DOCTRINE = {
  // Recommended lens for human-scale, readable verticality
  RECOMMENDED_LENS_MM: 35,
  ALTERNATIVE_LENS_MM: 40,

  // Screen space defaults
  DEFAULT_DRIFT_TOLERANCE: 0.03,  // ±3% of screen

  // Time defaults
  DEFAULT_PANEL_DELTA_SECONDS: 0.5,
  MIN_PANEL_DELTA_SECONDS: 0.25,
  MAX_PANEL_DELTA_SECONDS: 0.6,

  // Compass defaults
  DEFAULT_KEY_LIGHT: 'NORTH_WEST' as CompassDirection,
  DEFAULT_FILL_LIGHT: 'EAST' as CompassDirection,

  // Physics
  GRAVITY_M_S2: 9.81,
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a world coordinate
 */
export function coord(x: number, y: number, z: number): WorldCoordinates {
  return { x, y, z };
}

/**
 * Create an NDC screen position
 */
export function ndc(x: number, y: number): NDCCoordinates {
  return { x, y };
}

/**
 * Convert compass direction to world vector
 */
export function compassToVector(direction: CompassDirection): WorldCoordinates {
  switch (direction) {
    case 'NORTH': return { x: 0, y: 0, z: 1 };
    case 'SOUTH': return { x: 0, y: 0, z: -1 };
    case 'EAST': return { x: 1, y: 0, z: 0 };
    case 'WEST': return { x: -1, y: 0, z: 0 };
    case 'UP': return { x: 0, y: 1, z: 0 };
    case 'DOWN': return { x: 0, y: -1, z: 0 };
    case 'NORTH_EAST': return { x: 0.707, y: 0, z: 0.707 };
    case 'NORTH_WEST': return { x: -0.707, y: 0, z: 0.707 };
    case 'SOUTH_EAST': return { x: 0.707, y: 0, z: -0.707 };
    case 'SOUTH_WEST': return { x: -0.707, y: 0, z: -0.707 };
  }
}

/**
 * Build screen anchor phrase for prompt
 */
export function buildScreenAnchorPhrase(anchor: ScreenSpaceAnchor): string {
  const xPos = anchor.screen_position.x < 0.4 ? 'left' :
               anchor.screen_position.x > 0.6 ? 'right' : 'center';
  const yPos = anchor.screen_position.y < 0.4 ? 'upper' :
               anchor.screen_position.y > 0.6 ? 'lower' : 'middle';
  return `${anchor.actor_id} anchored to ${yPos}-${xPos} of frame (±${anchor.allowed_drift * 100}% drift allowed)`;
}

/**
 * Build compass lighting phrase for prompt
 */
export function buildCompassLightingPhrase(lighting: CompassLighting): string {
  return `Key light from ${lighting.key_light_from}, fill from ${lighting.fill_light_from}, ${lighting.color_temperature_kelvin}K`;
}

/**
 * Validate that shot follows doctrine
 */
export function validateDoctrine(
  shot: GameEngineShotCard,
  previousShot?: GameEngineShotCard
): DoctrinValidation {
  const validation: DoctrinValidation = {
    positions_locked: true,
    no_teleporting: true,
    physics_causal: true,
    lens_unchanged: true,
    cuts_via_camera_switch: true,
    anchors_within_drift: true,
    no_scale_drift: true,
    no_flip: true,
    time_monotonic: true,
    no_jumps: true,
    identity_preserved: true,
    debris_persists: true,
    lighting_consistent: true
  };

  if (previousShot) {
    // Check lens unchanged
    if (shot.lens_mm !== previousShot.lens_mm) {
      validation.lens_unchanged = false;
    }

    // Check time moves forward
    if (shot.timing.time_start_seconds < previousShot.timing.time_end_seconds) {
      validation.time_monotonic = false;
    }

    // Check no flip
    if (shot.dominant_side !== previousShot.dominant_side) {
      validation.no_flip = false;
    }

    // Check lighting consistent
    if (shot.lighting.key_light_from !== previousShot.lighting.key_light_from) {
      validation.lighting_consistent = false;
    }
  }

  return validation;
}

export default DOCTRINE;
