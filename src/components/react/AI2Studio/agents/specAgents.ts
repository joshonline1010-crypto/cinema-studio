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
  masterRefs: MasterRef[];  // Generated refs from Phase 1
  validation: ContinuityValidatorOutput | null;
  currentPhase: PipelinePhase;
  success: boolean;
  errors: string[];
}

// Callback for generating refs (called by UI)
export type RefGeneratorCallback = (params: {
  type: 'character' | 'environment' | 'prop';
  prompt: string;
  name: string;
}) => Promise<{ url: string }>;

export const specOrchestrator = {
  /**
   * Run the full spec pipeline from concept to shot cards
   *
   * @param input - Pipeline input with concept, duration, refs
   * @param refGenerator - Optional callback to generate refs (if not provided, uses input refs)
   */
  async runPipeline(
    input: SpecPipelineInput,
    refGenerator?: RefGeneratorCallback
  ): Promise<SpecPipelineOutput> {
    const errors: string[] = [];
    let currentPhase: PipelinePhase = 'PHASE_0_WORLD_ENGINEERING';

    console.log('[SpecOrchestrator] Starting pipeline for concept:', input.concept.substring(0, 50) + '...');

    // Phase 0: World Engineering
    console.log('[SpecOrchestrator] Phase 0: World Engineering');
    const worldState = await worldEngineerAgent.execute({
      concept: input.concept,
      refs: input.refs
    }) as WorldEngineerOutput;

    // Phase 1: Generate Master Refs (if generator provided and no refs given)
    currentPhase = 'PHASE_1_MASTERS';
    console.log('[SpecOrchestrator] Phase 1: Master References');

    let masterRefs: MasterRef[] = [];

    // Check if we have existing refs
    const existingRefs = (input.refs || []).map((ref, i) => ({
      id: `ref_${i}`,
      type: ref.type === 'character' ? 'CHARACTER_MASTER' as const :
            ref.type === 'location' ? 'ENVIRONMENT_MASTER' as const :
            'PROP_MASTER' as const,
      url: ref.url,
      name: ref.name
    }));

    if (existingRefs.length > 0) {
      console.log('[SpecOrchestrator] Using', existingRefs.length, 'provided refs');
      masterRefs = existingRefs;
    } else if (refGenerator) {
      // Generate refs based on world state entities
      console.log('[SpecOrchestrator] Generating master refs from world state...');

      // Generate CHARACTER_MASTER for each character entity
      const characterEntities = worldState.entities.filter(e => e.entity_type === 'character');
      for (const entity of characterEntities) {
        console.log('[SpecOrchestrator] Generating CHARACTER_MASTER for:', entity.entity_id);
        const prompt = `${entity.appearance_lock_notes}, 3x3 grid showing 9 expressions: neutral, happy, sad, angry, surprised, determined, fearful, confident, exhausted. White background, consistent character across all cells. THIS EXACT CHARACTER in each cell.`;

        try {
          const result = await refGenerator({
            type: 'character',
            prompt,
            name: entity.entity_id
          });
          masterRefs.push({
            id: `char_${entity.entity_id}`,
            type: 'CHARACTER_MASTER',
            url: result.url,
            name: entity.entity_id
          });
        } catch (err) {
          console.error('[SpecOrchestrator] Failed to generate CHARACTER_MASTER:', err);
          errors.push(`Failed to generate character ref for ${entity.entity_id}`);
        }
      }

      // Generate ENVIRONMENT_MASTER from world state
      console.log('[SpecOrchestrator] Generating ENVIRONMENT_MASTER');
      const envPrompt = `${worldState.worldState.environment_geometry.static_description}, 3x3 grid showing environment from 9 angles: wide front, wide left, wide right, medium front, medium left, medium right, detail shot 1, detail shot 2, overhead. Empty scene, no characters. Lighting: ${worldState.worldState.lighting.primary_light_direction}.`;

      try {
        const result = await refGenerator({
          type: 'environment',
          prompt: envPrompt,
          name: 'environment'
        });
        masterRefs.push({
          id: 'env_master',
          type: 'ENVIRONMENT_MASTER',
          url: result.url,
          name: 'environment'
        });
      } catch (err) {
        console.error('[SpecOrchestrator] Failed to generate ENVIRONMENT_MASTER:', err);
        errors.push('Failed to generate environment ref');
      }

      console.log('[SpecOrchestrator] Generated', masterRefs.length, 'master refs');
    } else {
      console.log('[SpecOrchestrator] No refs provided and no generator - shots will have no refs');
    }

    // Phase 3a: Beat Planning
    currentPhase = 'PHASE_3_BEATS_AND_STATE_FRAMES';
    console.log('[SpecOrchestrator] Phase 3a: Beat Planning');
    const beats = await beatPlannerAgent.execute({
      storyOutline: input.concept,
      targetDurationSeconds: input.targetDuration,
      constraints: input.constraints,
      worldState: worldState.worldState
    }) as BeatPlannerOutput;

    // Phase 3b: Shot Compilation
    console.log('[SpecOrchestrator] Phase 3b: Shot Compilation');
    const shotCards = await shotCompilerAgent.execute({
      worldState: worldState.worldState,
      cameraRigs: worldState.cameraRigs,
      beats: beats.beats,
      masterRefs
    }) as ShotCompilerOutput;

    console.log('[SpecOrchestrator] Pipeline complete');
    console.log('[SpecOrchestrator] Generated:', shotCards.shotCards.length, 'shot cards with', masterRefs.length, 'refs');

    return {
      worldState,
      beats,
      shotCards,
      masterRefs,
      validation: null, // Will be populated after generation
      currentPhase,
      success: errors.length === 0,
      errors
    };
  },

  /**
   * Get required refs for a concept (without generating them)
   * Call this first to show user what refs are needed
   */
  async planRefs(input: SpecPipelineInput): Promise<{
    characterRefs: Array<{ name: string; prompt: string }>;
    environmentRef: { prompt: string };
    propRefs: Array<{ name: string; prompt: string }>;
  }> {
    // Run world engineer to analyze concept
    const worldState = await worldEngineerAgent.execute({
      concept: input.concept,
      refs: input.refs
    }) as WorldEngineerOutput;

    const characterRefs = worldState.entities
      .filter(e => e.entity_type === 'character')
      .map(e => ({
        name: e.entity_id,
        prompt: `${e.appearance_lock_notes}, 3x3 expression grid: neutral, happy, sad, angry, surprised, determined, fearful, confident, exhausted. White background. THIS EXACT CHARACTER.`
      }));

    const environmentRef = {
      prompt: `${worldState.worldState.environment_geometry.static_description}, 3x3 angle grid. Empty scene, no characters. Lighting: ${worldState.worldState.lighting.primary_light_direction}.`
    };

    const propRefs = worldState.entities
      .filter(e => e.entity_type === 'prop' || e.entity_type === 'vehicle')
      .map(e => ({
        name: e.entity_id,
        prompt: `${e.appearance_lock_notes}, 3x3 grid showing object from multiple angles.`
      }));

    return { characterRefs, environmentRef, propRefs };
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
