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

// ============================================
// UNIFIED PIPELINE - Everything in One
// ============================================
// Story Analyst + Director + Council + Spec + Producer - No toggles needed

// Story Analyst - THE FIRST BRAIN (analyzes WHY before anything else)
export { storyAnalystAgent } from './storyAnalystAgent';
export type { StoryAnalysisInput, StoryAnalysisOutput, KeyWord, EmotionBeat, LensChoice } from './storyAnalystAgent';

// Director - Film grammar, shot patterns, ref assignments
export { directorAgent } from './directorAgent';
export type { DirectorInput, DirectorOutput, ShotPlan, RefAssignment } from './directorAgent';

// Model Picker - Technical model selection (runs BEFORE Shot Compiler)
export {
  modelPickerAgent,
  MODEL_COSTS,
  printModelSelectionSummary
} from './modelPickerAgent';
export type {
  VideoModel as ModelPickerVideoModel,
  ImageModel,
  ModelCost,
  ModelSelection,
  ModelPickerInput,
  ModelPickerOutput
} from './modelPickerAgent';

// Producer - Execution order, dependencies, what waits for what
export { producerAgent } from './producerAgent';
export type { ProductionManifest, ProductionAsset, ExecutionPhase, AssetType } from './producerAgent';

// Unified Pipeline - Master orchestrator
export { unifiedPipeline } from './unifiedPipeline';
export type {
  UnifiedPipelineInput,
  UnifiedPipelineOutput,
  CouncilAdvice,
  ValidationResult,
  RefGeneratorFn
} from './unifiedPipeline';

// Verification Agent - Quality Control & Feedback Loop
export { verificationAgent } from './verificationAgent';
export type { VerificationResult, VerificationIssue, RepairAction as VerificationRepairAction, IssueSeverity, IssuePhase } from './verificationAgent';

// Editor Agent - Vision-Based Clip Surgeon (Trim, Speed, Cut Points)
export {
  editorAgent,
  buildFrameExtractionCommand,
  buildSingleFrameCommand,
  buildTrimCommand,
  calculateFinalDuration,
  buildEditTimelineJSON,
  exportTimelineJSON,
  buildSingleClipJSON,
  printAnalysisSummary,
  printTrimInstruction,
  FRAME_ANALYSIS_PROMPT,
  CUT_POINT_PROMPT
} from './editorAgent';
export type {
  CutReason,
  SpeedPreset,
  FrameAnalysis,
  CutPoint,
  SpeedSegment,
  ClipAnalysis,
  TrimInstruction,
  EditorInput,
  EditorOutput,
  EditTimelineJSON,
  EditClipJSON
} from './editorAgent';

// Audio Planner Agent - Voiceover, Dialogue, Music Timing
export {
  audioPlannerAgent,
  FAL_ENDPOINTS,
  routeAudioGeneration,
  // Character voice registry
  registerCharacterVoice,
  getCharacterVoice,
  findCharacterVoiceByName,
  getVoiceIdForCharacter,
  listCharacterVoices,
  clearVoiceRegistry,
  characterVoiceRegistry,
  ELEVENLABS_PRESETS,
  // Sora 2 multi-shot utilities
  buildSoraMultiShotPrompt,
  buildSoraRequest,
  validateSoraShotsForRefType,
  getPresetsForRefType,
  getBRollPresets,
  SORA_SHOT_PRESETS
} from './audioPlannerAgent';
export type {
  AudioPlan,
  VoiceoverSegment,
  DialogueSegment,
  MusicCue,
  SoundEffect,
  RenderTimelineEntry,
  VoiceStyle,
  AudioAssetType,
  AudioGenerationType,
  AudioRouting,
  SpeechMode,
  // Voice settings types
  VoiceProvider,
  CharacterVoiceSettings,
  // Sora 2 types
  SoraShotType,
  SoraCameraMove,
  SoraDuration,
  SoraResolution,
  SoraShotDefinition,
  SoraMultiShotInput,
  SoraMultiShotOutput,
  SoraRefType,
  SoraCollageContents
} from './audioPlannerAgent';

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
