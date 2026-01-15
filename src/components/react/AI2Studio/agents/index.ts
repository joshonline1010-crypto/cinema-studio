// Council Agents - Export all agents and orchestrator

export * from './types';

// Original Council Agents (for backwards compatibility)
export { narrativeAgent } from './narrativeAgent';
export { visualAgent } from './visualAgent';
export { technicalAgent } from './technicalAgent';
export { productionAgent } from './productionAgent';

export {
  councilOrchestrator,
  runCouncilMeeting,
  queryCouncilAgent,
  getCouncilAgents
} from './councilOrchestrator';

// ============================================
// NEW: Spec-Compliant Agents (PDF Spec v4.0)
// ============================================
// These implement the AI2Studio Master Prompting & World Engineering Bible
// with the 4 official agents: WorldEngineer, BeatPlanner, ShotCompiler, ContinuityValidator

// NOTE: specTypes has some overlapping type names with types.ts
// Export specific types to avoid conflicts
export {
  CWS_LAWS,
  GLOBAL_CONSTRAINTS,
  PROMPT_TEMPLATES,
  routeModel,
  PIPELINE_PHASES
} from './specTypes';
export type {
  SpecAgentRole,
  SpecAgent,
  WorldStateJSON,
  CameraRigsJSON,
  SceneGeographyMemory,
  WorldEngineerInput,
  WorldEngineerOutput,
  BeatDefinition,
  BeatPlannerInput,
  BeatPlannerOutput,
  ShotCard,
  ShotCompilerInput,
  ShotCompilerOutput,
  ContinuityViolation,
  RepairInstruction,
  ContinuityValidatorInput,
  ContinuityValidatorOutput,
  RefInput,
  MasterRef,
  ViolationType,
  RepairAction,
  PipelinePhase as SpecPipelinePhase
} from './specTypes';

// Re-export GeneratedAsset from specTypes with different name to avoid conflict
export type { GeneratedAsset as SpecGeneratedAsset } from './specTypes';

// Spec Agents
export { worldEngineerAgent, analyzeConceptForWorld, buildBaseWorldPrompt } from './worldEngineerAgent';
export { beatPlannerAgent, calculateShotCount, detectNarrativeType, generateBeats } from './beatPlannerAgent';
export { shotCompilerAgent, buildPhotoPrompt as buildSpecPhotoPrompt, buildMotionPrompt as buildSpecMotionPrompt } from './shotCompilerAgent';
export { continuityValidatorAgent } from './continuityValidatorAgent';

export { specOrchestrator, specAgents } from './specAgents';

// World State Persistence
export { worldStatePersistence } from './worldStatePersistence';
export type { ProjectSession, GeneratedAssetRecord, WorldStateSnapshot } from './worldStatePersistence';

// GAME ENGINE DOCTRINE - 3-Layer Control System
export * from './gameEngineDoctrine';

// THE_STACK - Reference Image Stack System
export {
  TheStack,
  buildCharacterMasterPrompt,
  buildEnvironmentMasterPrompt,
  buildPropMasterPrompt,
  createGrid,
  getGridCellCoordinates,
  getAllGridCellCoordinates,
  buildRefLockPhrases,
  validateRefStack,
  CHARACTER_GRID_VARIATIONS,
  ENVIRONMENT_GRID_VARIATIONS,
  PROP_GRID_VARIATIONS
} from './theStack';
export type { RefPriority, StackedRef, RefStack, GridCell, Grid3x3 } from './theStack';
