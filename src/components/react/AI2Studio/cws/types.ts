/**
 * CWS (Continuous World Storytelling) Type Definitions
 *
 * Treats images as "world state measurements" with 3D coordinates.
 * Integrates with Council Agents to enforce continuity.
 */

// ============================================
// 3D COORDINATE SYSTEM
// ============================================

export interface Vector3 {
  x: number;  // Left (-) / Right (+) relative to camera origin
  y: number;  // Down (-) / Up (+)
  z: number;  // Away from camera (-) / Toward camera (+)
}

// Facing direction on the horizontal plane
export type FacingDirection =
  | 'CAMERA'        // Facing toward camera (z+)
  | 'AWAY'          // Facing away from camera (z-)
  | 'LEFT'          // Facing stage left (x-)
  | 'RIGHT'         // Facing stage right (x+)
  | 'LEFT_CAMERA'   // 45deg between left and camera
  | 'RIGHT_CAMERA'  // 45deg between right and camera
  | 'LEFT_AWAY'     // 45deg between left and away
  | 'RIGHT_AWAY';   // 45deg between right and away

// ============================================
// ENTITY REGISTRY
// ============================================

export type EntityType = 'character' | 'vehicle' | 'prop' | 'environmental';

export interface EntityState {
  current: string;  // "standing", "sitting", "running", "open", "closed", etc.
  history: StateTransition[];
}

export interface StateTransition {
  from: string;
  to: string;
  panel: number;    // P1-P9 index where transition occurred
  shotId: string;
}

export interface VisualLock {
  costume?: string;        // "red jacket, blue pants"
  hair?: string;           // "blonde, shoulder length"
  accessories?: string[];  // ["green headphones", "watch"]
  expression?: string;     // Only locked if specified
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;

  // World position (world-locked)
  position: Vector3;
  facing: FacingDirection;

  // State tracking
  state: EntityState;

  // Visual identity lock
  visualLock?: VisualLock;

  // Reference image (for consistency)
  refImageUrl?: string;
}

// ============================================
// CHARACTER (extends Entity)
// ============================================

export interface TravelDirection {
  horizontal: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT' | 'STATIC';
  vertical: 'ASCENDING' | 'DESCENDING' | 'LEVEL';
  locked: boolean;  // Once set, flag violations
}

export interface VoiceInfo {
  voiceId?: string;
  pitch?: string;
  accent?: string;
}

export interface Character extends Entity {
  type: 'character';

  // Character-specific
  voice?: VoiceInfo;
  dna?: string;  // Full character DNA prompt for consistency

  // Screen direction tracking
  screenPosition: 'LEFT' | 'CENTER' | 'RIGHT';
  lookDirection: FacingDirection;

  // Travel direction (for walking/driving scenes)
  travelDirection?: TravelDirection;
}

// ============================================
// VEHICLE (extends Entity)
// ============================================

export type VehicleOrientation =
  | 'PROFILE_LEFT'
  | 'PROFILE_RIGHT'
  | 'FRONT'
  | 'REAR'
  | '3/4_FRONT_LEFT'
  | '3/4_FRONT_RIGHT'
  | '3/4_REAR_LEFT'
  | '3/4_REAR_RIGHT';

export interface Vehicle extends Entity {
  type: 'vehicle';

  // Vehicle-specific
  orientation: VehicleOrientation;

  // Interior vs Exterior tracking
  interiorEstablished: boolean;
  exteriorEstablished: boolean;
}

// ============================================
// PROP (extends Entity)
// ============================================

export interface Prop extends Entity {
  type: 'prop';

  // Prop state machine
  possibleStates: string[];    // ["closed", "open", "broken"]
  currentStateIndex: number;

  // Interaction tracking
  lastInteractedBy?: string;   // Entity ID
  lastInteractionPanel?: number;
}

// ============================================
// CAMERA RIG SYSTEM
// ============================================

export interface LensInfo {
  focalLength: number;     // 24, 35, 50, 85, 135, etc.
  aperture?: string;       // "f/1.4", "f/2.8"
  anamorphic?: boolean;
  special?: string;        // "tilt-shift", "macro", "fisheye"
}

export interface CameraRig {
  id: string;
  name: string;  // e.g., "WIDE_MASTER", "OTS_A", "CU_HERO"

  // Camera position in world space
  position: Vector3;

  // What the camera looks at
  lookAt: Vector3;

  // Camera properties
  lens: LensInfo;

  // For 180-degree rule enforcement
  axisSide?: 'A' | 'B';  // Which side of the line of action
}

// Standard rig presets
export const STANDARD_RIGS: Record<string, CameraRig> = {
  WIDE_MASTER: {
    id: 'WIDE_MASTER',
    name: 'Wide Master',
    position: { x: 0, y: 1.5, z: 10 },
    lookAt: { x: 0, y: 1, z: 0 },
    lens: { focalLength: 24 }
  },
  OTS_A: {
    id: 'OTS_A',
    name: 'Over The Shoulder A',
    position: { x: -2, y: 1.5, z: 3 },
    lookAt: { x: 2, y: 1.5, z: 0 },
    lens: { focalLength: 50 },
    axisSide: 'A'
  },
  OTS_B: {
    id: 'OTS_B',
    name: 'Over The Shoulder B',
    position: { x: 2, y: 1.5, z: 3 },
    lookAt: { x: -2, y: 1.5, z: 0 },
    lens: { focalLength: 50 },
    axisSide: 'B'
  },
  CU_A: {
    id: 'CU_A',
    name: 'Close-up A',
    position: { x: -1, y: 1.5, z: 2 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 85 },
    axisSide: 'A'
  },
  CU_B: {
    id: 'CU_B',
    name: 'Close-up B',
    position: { x: 1, y: 1.5, z: 2 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 85 },
    axisSide: 'B'
  },
  REACTION_INSERT: {
    id: 'REACTION_INSERT',
    name: 'Reaction Insert',
    position: { x: 0, y: 1.5, z: 1.5 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 100 }
  },
  LOW_ANGLE_HERO: {
    id: 'LOW_ANGLE_HERO',
    name: 'Low Angle Hero',
    position: { x: 0, y: 0.5, z: 3 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 24 }
  },
  HIGH_ANGLE_VULNERABLE: {
    id: 'HIGH_ANGLE_VULNERABLE',
    name: 'High Angle Vulnerable',
    position: { x: 0, y: 3, z: 3 },
    lookAt: { x: 0, y: 1, z: 0 },
    lens: { focalLength: 35 }
  },
  TRACKING_LEFT: {
    id: 'TRACKING_LEFT',
    name: 'Tracking Shot Left',
    position: { x: -4, y: 1.5, z: 0 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 35 }
  },
  TRACKING_RIGHT: {
    id: 'TRACKING_RIGHT',
    name: 'Tracking Shot Right',
    position: { x: 4, y: 1.5, z: 0 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 35 }
  },
  BIRDS_EYE: {
    id: 'BIRDS_EYE',
    name: 'Birds Eye View',
    position: { x: 0, y: 8, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    lens: { focalLength: 24 }
  },
  DUTCH_ANGLE: {
    id: 'DUTCH_ANGLE',
    name: 'Dutch Angle',
    position: { x: 2, y: 1.5, z: 4 },
    lookAt: { x: 0, y: 1.5, z: 0 },
    lens: { focalLength: 35 }
    // Note: rotation would be applied via motion prompt
  }
};

// ============================================
// PANEL & SHOT STATE
// ============================================

export interface StateDelta {
  entitiesMoved: Array<{
    entityId: string;
    from: Vector3;
    to: Vector3;
  }>;
  statesChanged: Array<{
    entityId: string;
    from: string;
    to: string;
  }>;
  entitiesEntered: string[];
  entitiesExited: string[];
}

export interface PanelState {
  panelIndex: number;  // P1-P9 for 3x3 grid (1-9), or sequential for non-grid
  shotId: string;

  // Camera for this panel
  activeRig: string;  // ID from cameraRigs

  // Entities visible in this panel
  visibleEntities: string[];  // Entity IDs

  // State delta from previous panel
  stateDelta: StateDelta;
}

// ============================================
// 180-DEGREE RULE TRACKING
// ============================================

export interface LineOfAction {
  // The two primary entities forming the axis
  entityA: string;  // Entity ID
  entityB: string;

  // Camera must stay on one side
  currentSide: 'A' | 'B';

  // Has this been violated?
  violated: boolean;
  violationShot?: string;
}

// ============================================
// DIRECTION LOCKS
// ============================================

export type LockType = 'FACING' | 'TRAVEL' | 'SCREEN_POSITION';

export interface DirectionLock {
  entityId: string;
  lockType: LockType;
  lockedValue: string;
  lockedAtPanel: number;
  active: boolean;
}

// ============================================
// ENVIRONMENT STATE
// ============================================

export interface EnvironmentState {
  location: string;
  timeOfDay: string;
  weather?: string;
  lightingDirection: string;  // "from left", "from above", "backlit"
  ambientMood: string;
}

// ============================================
// WORLD STATE (Complete Scene State)
// ============================================

export interface WorldState {
  id: string;
  sceneId: string;

  // All entities in the world (using Record for easier serialization)
  entities: Record<string, Entity>;
  characters: Record<string, Character>;
  vehicles: Record<string, Vehicle>;
  props: Record<string, Prop>;

  // Available camera rigs for this scene
  cameraRigs: Record<string, CameraRig>;

  // Current panel/shot info
  currentPanel: PanelState;

  // History for continuity checking
  panelHistory: PanelState[];

  // 180-degree rule tracking
  lineOfAction?: LineOfAction;

  // Direction locks
  directionLocks: DirectionLock[];

  // Environment settings (constant within scene)
  environment: EnvironmentState;

  // CWS mode enabled
  cwsEnabled: boolean;
}

// ============================================
// BEAT STRUCTURE
// ============================================

export interface Beat {
  id: string;
  name: string;
  type: 'setup' | 'catalyst' | 'debate' | 'midpoint' | 'crisis' | 'climax' | 'resolution';

  // Expected intensity level
  intensity: 'subtle' | 'medium' | 'strong' | 'extreme';

  // Camera sequence for this beat
  suggestedRigs: string[];  // Rig IDs in order

  // Panel mapping for 3x3 grid (if applicable)
  panelMapping?: Record<number, string>;  // Panel index -> Shot ID
}

// ============================================
// CONTINUITY VIOLATIONS
// ============================================

export type ViolationType =
  | 'TELEPORT'           // Entity position jump without movement shown
  | 'DIRECTION_FLIP'     // Character facing reversed without turn
  | 'STATE_REGRESSION'   // Prop state went backwards without reset
  | '180_RULE_CROSS'     // Camera crossed line of action
  | 'IDENTITY_DRIFT'     // Visual appearance changed
  | 'TIME_INCONSISTENCY' // Time of day jumped
  | 'LIGHTING_FLIP'      // Lighting direction reversed
  | 'TRAVEL_DIRECTION'   // Vehicle/character travel direction flip
  | 'INTERIOR_EXTERIOR'; // Mismatch between interior and exterior view

export type ViolationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ContinuityViolation {
  type: ViolationType;
  severity: ViolationSeverity;
  entityId?: string;
  fromPanel: number;
  toPanel: number;
  description: string;
  suggestedFix: string;
}

// ============================================
// CWS SHOT EXTENSION
// ============================================

// CWS data to attach to shots
export interface CWSData {
  rigId: string;
  visibleEntityIds: string[];
  panelIndex?: number;
  stateDelta?: StateDelta;
}

// ============================================
// UTILITY TYPES
// ============================================

// For creating entities with sensible defaults
export type CreateEntityInput = Partial<Entity> & { id: string; name: string; type: EntityType };
export type CreateCharacterInput = Partial<Character> & { id: string; name: string };
export type CreateVehicleInput = Partial<Vehicle> & { id: string; name: string };
export type CreatePropInput = Partial<Prop> & { id: string; name: string };

// ============================================
// DEFAULT FACTORIES
// ============================================

export const createDefaultPosition = (): Vector3 => ({ x: 0, y: 0, z: 0 });

export const createDefaultEntityState = (): EntityState => ({
  current: 'idle',
  history: []
});

export const createDefaultStateDelta = (): StateDelta => ({
  entitiesMoved: [],
  statesChanged: [],
  entitiesEntered: [],
  entitiesExited: []
});

export const createDefaultEnvironment = (): EnvironmentState => ({
  location: 'unknown',
  timeOfDay: 'day',
  lightingDirection: 'from above',
  ambientMood: 'neutral'
});

export const createDefaultWorldState = (sceneId: string): WorldState => ({
  id: `ws_${Date.now()}`,
  sceneId,
  entities: {},
  characters: {},
  vehicles: {},
  props: {},
  cameraRigs: { ...STANDARD_RIGS },
  currentPanel: {
    panelIndex: 1,
    shotId: '',
    activeRig: 'WIDE_MASTER',
    visibleEntities: [],
    stateDelta: createDefaultStateDelta()
  },
  panelHistory: [],
  directionLocks: [],
  environment: createDefaultEnvironment(),
  cwsEnabled: false
});
