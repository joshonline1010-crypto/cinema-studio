/**
 * AI2Studio Spec Agents - Index
 *
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * This module exports the 4 spec-compliant agents that implement
 * the Continuous World Storytelling (CWS) production pipeline:
 *
 * 1. WorldEngineerAgent - Phase 0: Create stable world truth
 * 2. BeatPlannerAgent - Phase 3: Plan beats as world-state transitions
 * 3. ShotCompilerAgent - Phase 3: Turn beats into executable shot cards
 * 4. ContinuityValidatorAgent - QC: Validate continuity, prescribe repairs
 *
 * Usage:
 *
 * ```typescript
 * import { specOrchestrator } from './specAgents';
 *
 * // Run full pipeline
 * const result = await specOrchestrator.runPipeline({
 *   concept: "A hero confronts a villain in a destroyed city",
 *   targetDuration: 30,
 *   refs: [{ url: "...", type: "character", name: "Hero" }]
 * });
 *
 * // Or run individual agents
 * const worldState = await specOrchestrator.runWorldEngineer({ concept: "..." });
 * const beats = await specOrchestrator.runBeatPlanner({ storyOutline: "...", worldState });
 * ```
 */

// Export types
export * from './specTypes';

// Export individual agents
export { worldEngineerAgent, analyzeConceptForWorld, buildBaseWorldPrompt } from './worldEngineerAgent';
export { beatPlannerAgent, calculateShotCount, detectNarrativeType, generateBeats } from './beatPlannerAgent';
export { shotCompilerAgent, buildPhotoPrompt, buildMotionPrompt } from './shotCompilerAgent';
export { continuityValidatorAgent, validateShot, calculateOverallScore } from './continuityValidatorAgent';

// Import for orchestrator
import { worldEngineerAgent } from './worldEngineerAgent';
import { beatPlannerAgent } from './beatPlannerAgent';
import { shotCompilerAgent } from './shotCompilerAgent';
import { continuityValidatorAgent } from './continuityValidatorAgent';

import type {
  WorldEngineerInput,
  WorldEngineerOutput,
  BeatPlannerInput,
  BeatPlannerOutput,
  ShotCompilerInput,
  ShotCompilerOutput,
  ContinuityValidatorInput,
  ContinuityValidatorOutput,
  RefInput,
  MasterRef,
  PipelinePhase
} from './specTypes';

// ============================================
// SPEC ORCHESTRATOR
// ============================================

export interface SpecPipelineInput {
  concept: string;
  targetDuration: number;
  refs?: RefInput[];
  constraints?: {
    maxShots?: number;
    pacingStyle?: 'slow' | 'medium' | 'fast' | 'variable';
  };
}

export interface SpecPipelineOutput {
  worldState: WorldEngineerOutput;
  beats: BeatPlannerOutput;
  shotCards: ShotCompilerOutput;
  validation: ContinuityValidatorOutput | null;
  currentPhase: PipelinePhase;
  success: boolean;
  errors: string[];
}

export const specOrchestrator = {
  /**
   * Run the full spec pipeline from concept to shot cards
   */
  async runPipeline(input: SpecPipelineInput): Promise<SpecPipelineOutput> {
    const errors: string[] = [];
    let currentPhase: PipelinePhase = 'PHASE_0_WORLD_ENGINEERING';

    console.log('[SpecOrchestrator] Starting pipeline for concept:', input.concept.substring(0, 50) + '...');

    // Phase 0: World Engineering
    console.log('[SpecOrchestrator] Phase 0: World Engineering');
    const worldState = await worldEngineerAgent.execute({
      concept: input.concept,
      refs: input.refs
    }) as WorldEngineerOutput;

    currentPhase = 'PHASE_3_BEATS_AND_STATE_FRAMES';

    // Phase 3a: Beat Planning
    console.log('[SpecOrchestrator] Phase 3a: Beat Planning');
    const beats = await beatPlannerAgent.execute({
      storyOutline: input.concept,
      targetDurationSeconds: input.targetDuration,
      constraints: input.constraints,
      worldState: worldState.worldState
    }) as BeatPlannerOutput;

    // Phase 3b: Shot Compilation
    console.log('[SpecOrchestrator] Phase 3b: Shot Compilation');
    const masterRefs: MasterRef[] = (input.refs || []).map((ref, i) => ({
      id: `ref_${i}`,
      type: ref.type === 'character' ? 'CHARACTER_MASTER' as const :
            ref.type === 'location' ? 'ENVIRONMENT_MASTER' as const :
            'PROP_MASTER' as const,
      url: ref.url,
      name: ref.name
    }));

    const shotCards = await shotCompilerAgent.execute({
      worldState: worldState.worldState,
      cameraRigs: worldState.cameraRigs,
      beats: beats.beats,
      masterRefs
    }) as ShotCompilerOutput;

    console.log('[SpecOrchestrator] Pipeline complete');
    console.log('[SpecOrchestrator] Generated:', shotCards.shotCards.length, 'shot cards');

    return {
      worldState,
      beats,
      shotCards,
      validation: null, // Will be populated after generation
      currentPhase,
      success: true,
      errors
    };
  },

  /**
   * Run World Engineer agent only
   */
  async runWorldEngineer(input: WorldEngineerInput): Promise<WorldEngineerOutput> {
    return worldEngineerAgent.execute(input) as Promise<WorldEngineerOutput>;
  },

  /**
   * Run Beat Planner agent only
   */
  async runBeatPlanner(input: BeatPlannerInput): Promise<BeatPlannerOutput> {
    return beatPlannerAgent.execute(input) as Promise<BeatPlannerOutput>;
  },

  /**
   * Run Shot Compiler agent only
   */
  async runShotCompiler(input: ShotCompilerInput): Promise<ShotCompilerOutput> {
    return shotCompilerAgent.execute(input) as Promise<ShotCompilerOutput>;
  },

  /**
   * Run Continuity Validator agent only
   */
  async runContinuityValidator(input: ContinuityValidatorInput): Promise<ContinuityValidatorOutput> {
    return continuityValidatorAgent.execute(input) as Promise<ContinuityValidatorOutput>;
  },

  /**
   * Validate generated assets and get repair instructions
   */
  async validateAndRepair(
    shotCards: ShotCompilerOutput,
    generatedImages: Array<{ id: string; shotId: string; url: string }>,
    generatedVideos: Array<{ id: string; shotId: string; url: string }>,
    worldState: WorldEngineerOutput
  ): Promise<ContinuityValidatorOutput> {
    return continuityValidatorAgent.execute({
      generatedImages: generatedImages.map(i => ({ ...i, type: 'image' as const })),
      generatedVideos: generatedVideos.map(v => ({ ...v, type: 'video' as const })),
      worldState: worldState.worldState,
      sceneGeographyMemory: worldState.sceneGeographyMemory,
      shotCards: shotCards.shotCards
    }) as Promise<ContinuityValidatorOutput>;
  }
};

// ============================================
// AGENT COLLECTION
// ============================================

export const specAgents = {
  worldEngineer: worldEngineerAgent,
  beatPlanner: beatPlannerAgent,
  shotCompiler: shotCompilerAgent,
  continuityValidator: continuityValidatorAgent
};

export default specOrchestrator;
