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

export * from './specTypes';
export * from './specAgents';

export { worldEngineerAgent } from './worldEngineerAgent';
export { beatPlannerAgent } from './beatPlannerAgent';
export { shotCompilerAgent } from './shotCompilerAgent';
export { continuityValidatorAgent } from './continuityValidatorAgent';

export { specOrchestrator, specAgents } from './specAgents';

// World State Persistence
export { worldStatePersistence } from './worldStatePersistence';
export type { ProjectSession, GeneratedAssetRecord, WorldStateSnapshot } from './worldStatePersistence';

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
