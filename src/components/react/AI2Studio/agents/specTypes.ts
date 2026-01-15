/**
 * AI2Studio Spec Agent Types
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * These types define the 4 spec-compliant agents:
 * - WorldEngineerAgent
 * - BeatPlannerAgent
 * - ShotCompilerAgent
 * - ContinuityValidatorAgent
 */

import type { VideoModel, Shot } from './types';
import type { Vector3, CameraRig, Entity, WorldState, DirectionLock, EnvironmentState } from '../cws/types';

// ============================================
// SPEC AGENT DOMAIN TYPES
// ============================================

export type SpecAgentRole = 'world_engineer' | 'beat_planner' | 'shot_compiler' | 'continuity_validator';

export interface SpecAgent {
  role: SpecAgentRole;
  name: string;
  icon: string;
  color: string;
  systemPrompt: string;
  execute(input: any): Promise<any>;
}

// ============================================
// WORLD ENGINEER AGENT TYPES
// ============================================

export interface WorldEngineerInput {
  concept: string;
  refs?: RefInput[];
  existingWorldState?: WorldState;
}

export interface RefInput {
  url: string;
  type: 'character' | 'location' | 'product' | 'vehicle' | 'prop';
  name: string;
  description?: string;
}

export interface WorldEngineerOutput {
  worldState: WorldStateJSON;
  cameraRigs: CameraRigsJSON;
  scaleAnchors: ScaleAnchor[];
  baseWorldReferencePrompt: string;
  entities: EntityDefinition[];
  sceneGeographyMemory: SceneGeographyMemory;
}

export interface WorldStateJSON {
  world_id: string;
  environment_geometry: {
    ground_plane: { Y: number };
    static_landmarks: string[];
    static_description: string;
  };
  lighting: {
    primary_light_direction: string;
    primary_light_color_temp: string;
    secondary_fill: string;
    intensity_baseline: number;
    direction_locked: boolean;
  };
  atmospherics: {
    smoke_baseline: 'none' | 'light' | 'medium' | 'heavy';
    dust_baseline: 'none' | 'light' | 'medium' | 'heavy';
    haze: 'none' | 'light' | 'medium' | 'heavy';
  };
  scale_anchors: ScaleAnchor[];
  entities: EntityDefinition[];
}

export interface CameraRigsJSON {
  camera_rigs: CameraRigDefinition[];
}

export interface CameraRigDefinition {
  rig_id: string;
  camera_position: Vector3;
  look_at: Vector3;
  default_lens_mm: number;
  allowed_lenses_mm: number[];
  camera_motion_allowed: boolean;
  allowed_camera_motions: string[];
  notes?: string;
}

export interface ScaleAnchor {
  anchor_name: string;
  real_world_reference: string;
  approx_size_m: number;
}

export interface EntityDefinition {
  entity_id: string;
  entity_type: 'character' | 'vehicle' | 'prop' | 'architecture' | 'projectile';
  identity_lock: boolean;
  world_locked_by_default: boolean;
  base_world_position: Vector3;
  base_orientation: { yaw_deg: number; pitch_deg: number; roll_deg: number };
  allowed_motion_types: string[];
  forbidden_motion_types: string[];
  appearance_lock_notes: string;
  ref_image_url?: string;
}

export interface SceneGeographyMemory {
  hero_side_of_frame: 'LEFT' | 'RIGHT' | 'CENTER';
  villain_side_of_frame: 'LEFT' | 'RIGHT' | 'CENTER';
  light_direction_lock: string;
  color_grade_lock: string;
  forbid_flip: boolean;
}

// ============================================
// BEAT PLANNER AGENT TYPES
// ============================================

export interface BeatPlannerInput {
  storyOutline: string;
  targetDurationSeconds: number;
  constraints?: BeatConstraints;
  worldState: WorldStateJSON;
}

export interface BeatConstraints {
  maxShots?: number;
  requiredBeats?: string[];
  forbiddenBeats?: string[];
  pacingStyle?: 'slow' | 'medium' | 'fast' | 'variable';
}

export interface BeatPlannerOutput {
  beats: BeatDefinition[];
  totalDuration: number;
  shotCount: number;
}

export interface BeatDefinition {
  beat_id: string;
  timecode_range_seconds: { start: number; end: number };
  distance_state: DistanceState;
  information_owner: InformationOwner;
  camera_intent: CameraIntent;
  energy_level: 1 | 2 | 3 | 4 | 5;
  shot_mode: 'NEW_SHOT' | 'MUTATE_PREVIOUS';
  camera_rig_id: string;
  lens_mm: number;
  start_frame_ref: {
    type: 'BASE_WORLD' | 'PREVIOUS_LAST_FRAME' | 'EXPLICIT_IMAGE_URL';
    ref: string;
  };
  world_lock: {
    world_id: string;
    entities_locked: boolean;
    lighting_direction_locked: boolean;
    color_grade_locked: boolean;
    direction_lock: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT';
  };
  allowed_deltas: string[];
  forbidden_changes: ForbiddenChange[];
  end_state_truth: string;
}

export type DistanceState = 'FAR' | 'APPROACH' | 'ENGAGEMENT' | 'CLOSE_QUARTERS' | 'AFTERMATH' | 'EXIT';
export type InformationOwner = 'HERO' | 'VILLAIN' | 'NEUTRAL' | 'AUDIENCE_ONLY';
export type CameraIntent = 'REVEAL' | 'PURSUIT' | 'DOMINANCE' | 'VULNERABILITY' | 'CONFUSION' | 'PRECISION' | 'SCALE' | 'INTIMACY';
export type ForbiddenChange =
  | 'mirroring'
  | 'identity_drift'
  | 'world_reset'
  | 'lighting_direction_change'
  | 'scale_drift'
  | 'unplanned_camera_rig_change'
  | 'geometry_reset'
  | 'teleport';

// ============================================
// SHOT COMPILER AGENT TYPES
// ============================================

export interface ShotCompilerInput {
  worldState: WorldStateJSON;
  cameraRigs: CameraRigsJSON;
  beats: BeatDefinition[];
  masterRefs: MasterRef[];
}

export interface MasterRef {
  id: string;
  type: 'ENVIRONMENT_MASTER' | 'CHARACTER_MASTER' | 'PROP_MASTER';
  url: string;
  name: string;
}

export interface ShotCompilerOutput {
  shotCards: ShotCard[];
}

export interface ShotCard {
  shot_id: string;
  beat_id: string;
  type: 'STATE_IMAGE' | 'GRID' | 'VIDEO_CLIP';
  camera_rig_id: string;
  lens_mm: number;
  direction_lock: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT';
  refs: {
    image_1: string;  // LAST_FRAME or BASE
    image_2: string;  // CHARACTER_MASTER
    image_3: string;  // ENVIRONMENT_MASTER
    others: string[];
  };
  photo_prompt: string;
  video_model: VideoModel;
  video_duration_seconds: 5 | 10;
  video_motion_prompt: string;
  start_end_pairing: {
    start_frame: string;
    end_frame: string;
    notes: string;
  };
  continuity_phrases: string[];
}

// ============================================
// CONTINUITY VALIDATOR AGENT TYPES
// ============================================

export interface ContinuityValidatorInput {
  generatedImages: GeneratedAsset[];
  generatedVideos: GeneratedAsset[];
  worldState: WorldStateJSON;
  sceneGeographyMemory: SceneGeographyMemory;
  shotCards: ShotCard[];
}

export interface GeneratedAsset {
  id: string;
  shotId: string;
  url: string;
  type: 'image' | 'video';
}

export interface ContinuityValidatorOutput {
  passOrFail: 'PASS' | 'FAIL';
  violations: ContinuityViolation[];
  repairInstructions: RepairInstruction[];
  overallScore: number;
}

export interface ContinuityViolation {
  violation_type: ViolationType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  shot_id: string;
  description: string;
  entity_involved?: string;
}

export type ViolationType =
  // Legacy violations
  | 'direction_lock_violation'
  | 'mirroring_detected'
  | 'identity_drift'
  | 'world_geometry_reset'
  | 'scale_anchor_drift'
  | 'camera_rig_mismatch'
  | 'cockpit_plane_drift'
  | 'lighting_direction_change'
  | 'teleport_detected'
  // LAYER 1: World Space violations
  | 'world_space_teleport'         // Actor moved > 1m without movement delta
  | 'object_spawn_violation'       // Object appeared from nowhere
  | 'debris_persistence_violation' // Debris/damage disappeared
  // LAYER 2: Camera Space violations (SACRED)
  | 'lens_change_violation'        // CRITICAL - lens changed
  | '180_degree_violation'         // Camera crossed axis
  | 'camera_move_not_switch'       // Cut via move, not switch
  // LAYER 3: Screen Space violations
  | 'ndc_drift_violation'          // Actor drifted beyond tolerance
  | 'screen_flip_violation'        // Left-right swap detected
  | 'screen_scale_drift'           // Character scale changed > 10%
  // Time violations
  | 'time_rewind_violation'        // Time went backwards
  | 'time_jump_violation'          // Time skipped without transition
  | 'time_delta_mismatch'          // Motion doesn't match delta
  // Compass violations
  | 'compass_light_flip'           // Key light direction changed
  | 'shadow_direction_flip';       // Shadow direction flipped

export interface RepairInstruction {
  shot_id: string;
  action: RepairAction;
  prompt_additions: string[];
  force_refs?: string[];
}

export type RepairAction =
  // Legacy repair actions
  | 'regenerate_with_stronger_continuity_locks'
  | 'force_continue_from_last_frame'
  | 'force_same_camera_rig_and_lens'
  | 'reassert_scale_anchors'
  | 'add_direction_lock_phrases'
  // 3-Layer repair actions
  | 'reassert_world_coordinates'   // Add explicit XYZ positions
  | 'reassert_time_continuity'     // Add time delta assertions
  | 'reassert_compass_lighting'    // Add compass light direction
  | 'reassert_ndc_anchors'         // Add screen-space anchor constraints
  | 'force_lens_lock'              // Force 35mm lens assertion
  | 'force_debris_persistence';    // Add debris persistence phrases

// ============================================
// CWS LAWS (Non-Negotiable Rules)
// ============================================

export const CWS_LAWS = {
  LAW_1_ONE_WORLD: {
    summary: 'One world loaded once. Never reset, re-lit (direction), or re-scaled.',
    allowed_world_changes: ['debris', 'smoke_density', 'dust', 'lighting_intensity_only', 'heat_shimmer', 'sparks', 'debris_settling', 'light_flicker'],
    forbidden_world_changes: ['scene_swap', 'world_redesign', 'lighting_direction_change', 'scale_reset', 'teleport_geometry', 'spawn_new_structures']
  },
  LAW_2_WORLD_LOCKED_ENTITIES: {
    summary: 'Important entities have continuous identity and existence. No teleporting, duplicating, or disappearing/reappearing.',
    rules: {
      identity_must_persist: true,
      continuous_existence_required: true,
      position_lock_required_by_default: true
    },
    forbidden: ['teleport', 'duplicate_entity', 'disappear_reappear', 'identity_drift']
  },
  LAW_3_CAMERA_OVER_SUBJECT: {
    summary: 'Prefer camera rig movement/yaw over subject cheating. Dominance from angle, intimacy from yaw, scale from distance not resizing.',
    prefer: ['camera_yaw', 'camera_orbit', 'camera_lateral_offset', 'camera_rig_swap_planned'],
    avoid: ['push_subject_toward_camera_for_drama', 'rotate_subject_to_face_camera_for_drama', 'resize_subject']
  }
} as const;

// ============================================
// GLOBAL CONSTRAINTS
// ============================================

export const GLOBAL_CONSTRAINTS = {
  direction_lock_required: true,
  direction_lock_values: ['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT'],
  no_mirroring_required_phrase: 'NO MIRRORING. NO DIRECTION FLIP.',
  one_lens_per_reality_default: true,
  allowed_lenses_mm: [24, 35, 50, 85, 100, 135],
  avoid_prompt_prefix_terms: ['8K', '4K', 'HDR', 'RAYTRACING'],
  lighting_definition_rule: 'Describe lighting as physical source/direction/intensity, not mood adjectives.',
  time_is_not_motion: true,
  environment_reacts_not_acts: true
} as const;

// ============================================
// PROMPT TEMPLATES
// ============================================

export const PROMPT_TEMPLATES = {
  quality_suffix: 'Ultra-detailed fluffy 3D cinematic render, soft lighting, soft shadows, clean depth of field.',

  image_state_continuation: `Continue from Image 1.
Same world state, same camera rig, same lens, same lighting direction, same color grade.
Only apply this delta: {DELTA}.
Forbidden: mirroring, identity change, scale drift, geometry reset.
{QUALITY_SUFFIX}`,

  single_character: `THIS EXACT CHARACTER {POSE_ACTION},
{ENVIRONMENT},
{LIGHTING_SOURCE},
{SHOT_DISTANCE}, {LENS}mm,
NO MIRRORING. NO DIRECTION FLIP.
{QUALITY_SUFFIX}`,

  video_motion_formula: '{CAMERA_MOVEMENT}, {SUBJECT_MOTION_POWER_VERB}, {BACKGROUND_REACTION}, {ENDPOINT}',

  cws_delta_card: `Continue from Image 1.
Same world. Same lighting direction. Same camera rig. Same lens.
Only delta: {DELTA}.
Forbidden: mirroring, identity change, scale drift, geometry reset.`,

  direction_lock_phrase: 'THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE. {DIRECTION_LOCKS}. NO MIRRORING. NO DIRECTION FLIP.'
} as const;

// ============================================
// MODEL ROUTING DECISION TREE
// ============================================

export function routeModel(params: {
  characterSpeaksOnCamera: boolean;
  needsStartEndStateChange: boolean;
}): VideoModel {
  if (params.characterSpeaksOnCamera) {
    return 'seedance-1.5';
  }
  if (params.needsStartEndStateChange) {
    return 'kling-o1';
  }
  return 'kling-2.6';
}

// ============================================
// PRODUCTION PIPELINE PHASES
// ============================================

export type PipelinePhase =
  | 'PHASE_0_WORLD_ENGINEERING'
  | 'PHASE_1_MASTERS'
  | 'PHASE_2_GRIDS'
  | 'PHASE_3_BEATS_AND_STATE_FRAMES'
  | 'PHASE_4_VIDEO_SOLVER_MODE'
  | 'PHASE_5_ASSEMBLY';

export const PIPELINE_PHASES: Record<PipelinePhase, { goal: string; steps: string[]; outputs: string[] }> = {
  PHASE_0_WORLD_ENGINEERING: {
    goal: 'Create stable world truth and camera rigs.',
    steps: [
      'generate_BASE_WORLD_REFERENCE_image',
      'write_WORLD_STATE_json',
      'define_WORLD_LOCKED_ENTITIES',
      'define_CAMERA_RIGS_json',
      'define_SCALE_ANCHORS',
      'set_DIRECTION_LOCK',
      'persist_SCENE_GEOGRAPHY_MEMORY'
    ],
    outputs: ['BASE_WORLD_REFERENCE', 'WORLD_STATE.json', 'CAMERA_RIGS.json', 'SCALE_ANCHORS.json']
  },
  PHASE_1_MASTERS: {
    goal: 'Generate masters for reuse.',
    steps: [
      'generate_ENVIRONMENT_MASTER_empty',
      'generate_CHARACTER_MASTER_hero',
      'generate_CHARACTER_MASTER_villain_optional',
      'generate_PROP_MASTERS_optional'
    ],
    outputs: ['ENVIRONMENT_MASTER', 'CHARACTER_MASTER_SET', 'PROP_MASTER_SET']
  },
  PHASE_2_GRIDS: {
    goal: 'Enforce constraint via multi-view measurement.',
    steps: [
      'generate_BACKGROUND_GRID_3x3_camera_only',
      'generate_CHARACTER_EXPRESSION_GRID_3x3',
      'generate_PROP_STATE_GRIDS_optional'
    ],
    outputs: ['GRID_IMAGES_SET']
  },
  PHASE_3_BEATS_AND_STATE_FRAMES: {
    goal: 'Plan beats as world-state deltas and generate state frames.',
    steps: [
      'beat_planner_outputs_beats_json',
      'shot_compiler_outputs_photo_video_plans',
      'generate_IMAGE_STATE_for_each_beat',
      'extract_LAST_FRAME_for_chaining'
    ],
    outputs: ['BEATS.json', 'STATE_FRAMES_SET', 'LAST_FRAMES_SET']
  },
  PHASE_4_VIDEO_SOLVER_MODE: {
    goal: 'Interpolate motion between controlled states.',
    steps: [
      'pair_START_END_frames_per_clip',
      'route_model_per_decision_tree',
      'generate_VIDEO_per_clip',
      'validate_video_continuity'
    ],
    outputs: ['CLIPS_SET']
  },
  PHASE_5_ASSEMBLY: {
    goal: 'Final edit and export.',
    steps: ['concat_clips', 'sound_design', 'final_color_grade_pass', 'export_master'],
    outputs: ['FINAL_VIDEO']
  }
};
