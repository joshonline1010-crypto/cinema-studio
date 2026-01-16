/**
 * UNIFIED PIPELINE V2 - Complete Rewrite
 *
 * This is the NEW pipeline with all gaps fixed:
 *
 * PHASE 1: STORY ANALYST (First Brain)
 *   → Analyzes concept, sets style/genre/emotion/director
 *
 * PHASE 2: BEAT PLANNER (moved earlier)
 *   → Creates story beats BEFORE Director
 *
 * PHASE 3: COVERAGE PLANNER (NEW!)
 *   → Plans all camera angles per beat
 *
 * PHASE 4: DIRECTOR (Model-Aware)
 *   → Selects angles, picks models, sets dialogue_info
 *   → NOW includes video_model selection
 *
 * PHASE 5: SCRIPTWRITER (NEW!)
 *   → Writes actual dialogue lines
 *
 * PHASE 6: WORLD ENGINEER (moved later)
 *   → Now knows what shots are planned
 *
 * PHASE 7: REF PLANNER (NEW! - Replaces Council)
 *   → Plans refs + chaining strategy
 *
 * PHASE 8: REF GENERATION
 *   → Generates CHARACTER_MASTER, ENVIRONMENT_MASTER
 *
 * PHASE 9: REF VALIDATOR (NEW!)
 *   → Validates refs before Shot Compiler
 *
 * PHASE 10: SHOT COMPILER
 *   → Writes prompts with EVERYTHING available
 *
 * PHASE 11: AUDIO PLANNER
 *   → Has actual script lines now
 *
 * PHASE 12: CONTINUITY VALIDATOR
 *   → Validates continuity
 *
 * PHASE 13: EDITOR ADVISOR (NEW!)
 *   → Refines edit_intent with editing knowledge
 *
 * PHASE 14: PRODUCER
 *   → Creates execution manifest
 *
 * PHASE 15: VERIFICATION
 *   → Final QC
 *
 * NO COUNCIL. Everything has an owner now.
 */

import { storyAnalystAgent, type StoryAnalysisOutput } from './storyAnalystAgent';
import { beatPlannerAgent } from './beatPlannerAgent';
import { coveragePlannerAgent, type CoveragePlannerOutput } from './coveragePlannerAgent';
import { directorAgent, type DirectorOutput } from './directorAgent';
import { scriptwriterAgent, type ScriptwriterOutput } from './scriptwriterAgent';
import { worldEngineerAgent } from './worldEngineerAgent';
import { refPlannerAgent, type RefPlannerOutput } from './refPlannerAgent';
import { refValidatorAgent, type RefValidatorOutput } from './refValidatorAgent';
import { shotCompilerAgent } from './shotCompilerAgent';
import { audioPlannerAgent, type AudioPlan } from './audioPlannerAgent';
import { continuityValidatorAgent } from './continuityValidatorAgent';
import { editorAdvisorAgent, type EditorAdvisorOutput } from './editorAdvisorAgent';
import { producerAgent, type ProductionManifest } from './producerAgent';
import { verificationAgent, type VerificationResult } from './verificationAgent';

import type {
  WorldEngineerOutput,
  BeatPlannerOutput,
  ShotCompilerOutput,
  ContinuityValidatorOutput,
  MasterRef,
  RefInput
} from './specTypes';

// ============================================
// UNIFIED PIPELINE V2 TYPES
// ============================================

export interface UnifiedPipelineV2Input {
  concept: string;
  targetDuration: number;
  refs?: RefInput[];
  generateRefs?: boolean;
}

export interface UnifiedPipelineV2Output {
  // Phase 1: Story Analysis
  storyAnalysis: StoryAnalysisOutput;

  // Phase 2: Beats
  beats: BeatPlannerOutput;

  // Phase 3: Coverage
  coverage: CoveragePlannerOutput;

  // Phase 4: Direction (now with video_model per shot)
  direction: DirectorOutput;

  // Phase 5: Script
  script: ScriptwriterOutput;

  // Phase 6: World
  world: WorldEngineerOutput;

  // Phase 7: Ref Plan
  refPlan: RefPlannerOutput;

  // Phase 8: Generated Refs
  masterRefs: MasterRef[];

  // Phase 9: Validated Refs
  refValidation: RefValidatorOutput;

  // Phase 10: Shots
  shots: ShotCompilerOutput;

  // Phase 11: Audio
  audioPlan: AudioPlan;

  // Phase 12: Continuity
  continuity: ContinuityValidatorOutput;

  // Phase 13: Edit Decisions
  editAdvice: EditorAdvisorOutput;

  // Phase 14: Production Manifest
  productionManifest: ProductionManifest;

  // Phase 15: Verification
  verification: VerificationResult;

  // Meta
  success: boolean;
  errors: string[];
  timing: Record<string, number>;
}

export type RefGeneratorFn = (params: {
  type: 'character' | 'environment' | 'prop';
  prompt: string;
  name: string;
}) => Promise<{ url: string }>;

// ============================================
// UNIFIED PIPELINE V2 ORCHESTRATOR
// ============================================

export const unifiedPipelineV2 = {
  /**
   * Run the complete unified pipeline v2
   */
  async run(
    input: UnifiedPipelineV2Input,
    refGenerator?: RefGeneratorFn,
    onProgress?: (phase: string, message: string) => void
  ): Promise<UnifiedPipelineV2Output> {
    const errors: string[] = [];
    const timing: Record<string, number> = {};
    const totalStart = Date.now();

    const progress = (phase: string, msg: string) => {
      console.log(`[PipelineV2] ${phase}: ${msg}`);
      onProgress?.(phase, msg);
    };

    try {
      // ============================================
      // PHASE 1: STORY ANALYSIS (First Brain)
      // ============================================
      progress('PHASE_1', '🧠 Story Analyst thinking...');
      const phase1Start = Date.now();

      const storyAnalysis = await storyAnalystAgent.execute({
        concept: input.concept,
        targetDuration: input.targetDuration
      });

      timing.phase1_story = Date.now() - phase1Start;
      progress('PHASE_1', `✅ Story analysis complete (${timing.phase1_story}ms)`);

      // ============================================
      // PHASE 2: BEAT PLANNING (moved earlier!)
      // ============================================
      progress('PHASE_2', '📋 Planning story beats...');
      const phase2Start = Date.now();

      const beats = await beatPlannerAgent.execute({
        storyOutline: input.concept,
        targetDurationSeconds: input.targetDuration,
        worldState: null,  // Not available yet
        constraints: {
          pacingStyle: storyAnalysis.visual_language?.pacing?.style || 'variable'
        }
      }) as BeatPlannerOutput;

      timing.phase2_beats = Date.now() - phase2Start;
      progress('PHASE_2', `✅ ${beats.beats?.length || 0} beats planned (${timing.phase2_beats}ms)`);

      // ============================================
      // PHASE 3: COVERAGE PLANNING (NEW!)
      // ============================================
      progress('PHASE_3', '📷 Planning camera coverage...');
      const phase3Start = Date.now();

      const coverage = await coveragePlannerAgent.execute({
        beats: beats.beats || [],
        storyAnalysis,
        targetDuration: input.targetDuration
      });

      timing.phase3_coverage = Date.now() - phase3Start;
      progress('PHASE_3', `✅ ${coverage.total_angles_planned} angles planned (${timing.phase3_coverage}ms)`);

      // ============================================
      // PHASE 4: DIRECTION (Model-Aware!)
      // ============================================
      progress('PHASE_4', '🎬 Director creating production plan...');
      const phase4Start = Date.now();

      // Director now gets coverage options AND picks models
      const direction = await directorAgent.execute({
        concept: input.concept,
        targetDuration: input.targetDuration,
        worldState: { worldState: null, cameraRigs: null, entities: [] } as any,
        availableRefs: [],
        storyAnalysis: {
          storyType: storyAnalysis.concept_analysis?.story_type,
          emotionalArc: storyAnalysis.emotional_journey?.arc_description,
          recommendedDirector: storyAnalysis.director_recommendation?.director,
          directorTechniques: storyAnalysis.director_recommendation?.specific_techniques,
          visualLanguage: storyAnalysis.visual_language,
          audioNeeds: storyAnalysis.audio_narrative_plan
        }
      });

      timing.phase4_direction = Date.now() - phase4Start;
      progress('PHASE_4', `✅ ${direction.shot_sequence?.length || 0} shots planned (${timing.phase4_direction}ms)`);

      // Log model distribution
      const modelCounts: Record<string, number> = {};
      for (const shot of direction.shot_sequence || []) {
        const model = shot.video_model || 'kling-2.6';
        modelCounts[model] = (modelCounts[model] || 0) + 1;
      }
      console.log('[PipelineV2] Model distribution:', modelCounts);

      // ============================================
      // PHASE 5: SCRIPTWRITING (NEW!)
      // ============================================
      progress('PHASE_5', '✍️ Writing script...');
      const phase5Start = Date.now();

      const script = await scriptwriterAgent.execute({
        concept: input.concept,
        direction,
        storyAnalysis,
        targetDuration: input.targetDuration
      });

      timing.phase5_script = Date.now() - phase5Start;
      progress('PHASE_5', `✅ ${script.summary.total_dialogue_lines} dialogue lines (${timing.phase5_script}ms)`);

      // ============================================
      // PHASE 6: WORLD ENGINEERING (moved later)
      // ============================================
      progress('PHASE_6', '🌍 Building 3D world...');
      const phase6Start = Date.now();

      let world: WorldEngineerOutput;
      try {
        world = await worldEngineerAgent.execute({
          concept: input.concept,
          refs: input.refs,
          storyContext: {
            storyType: storyAnalysis.concept_analysis?.story_type,
            lighting: storyAnalysis.visual_language?.lighting?.choice,
            colorPalette: storyAnalysis.visual_language?.color_palette
          },
          // NEW: Pass shot info so world can be built for the shots
          shotInfo: {
            shotCount: direction.shot_sequence?.length || 6,
            shotTypes: direction.shot_sequence?.map(s => s.shot_type) || []
          }
        }) as WorldEngineerOutput;
      } catch (worldErr) {
        console.error('[PipelineV2] World Engineer failed:', worldErr);
        // Create fallback world state
        world = {
          worldState: {
            environment_geometry: {
              static_description: 'Generic scene environment',
              bounding_box: { width: 100, height: 50, depth: 100 }
            },
            lighting: {
              primary_light_direction: 'natural overhead',
              light_type: 'natural'
            },
            camera_positions: {}
          },
          cameraRigs: {
            rigs: {
              WIDE_MASTER: { position: { x: 0, y: 5, z: 20 }, rotation: { pan: 0, tilt: -10, roll: 0 }, lens_mm: 24 },
              MEDIUM_A: { position: { x: 5, y: 3, z: 10 }, rotation: { pan: -15, tilt: 0, roll: 0 }, lens_mm: 35 },
              CLOSEUP_A: { position: { x: 2, y: 2, z: 5 }, rotation: { pan: 0, tilt: 0, roll: 0 }, lens_mm: 85 }
            }
          },
          entities: []
        } as WorldEngineerOutput;
        errors.push('World Engineer failed - using fallback');
      }

      // Ensure world has required properties
      if (!world || !world.worldState) {
        console.warn('[PipelineV2] World state missing, creating fallback');
        world = {
          ...world,
          worldState: {
            environment_geometry: { static_description: 'Scene environment' },
            lighting: { primary_light_direction: 'natural' },
            camera_positions: {}
          }
        } as WorldEngineerOutput;
      }

      timing.phase6_world = Date.now() - phase6Start;
      progress('PHASE_6', `✅ World built (${timing.phase6_world}ms)`);

      // ============================================
      // PHASE 7: REF PLANNING (NEW! - Replaces Council)
      // ============================================
      progress('PHASE_7', '🖼️ Planning refs and chaining...');
      const phase7Start = Date.now();

      const refPlan = refPlannerAgent.execute({
        direction,
        coverage,
        world,
        storyAnalysis,
        existingRefs: input.refs?.map(r => ({ id: r.name, type: r.type, url: r.url }))
      });

      timing.phase7_refPlan = Date.now() - phase7Start;
      progress('PHASE_7', `✅ ${refPlan.summary.total_refs_needed} refs needed (${timing.phase7_refPlan}ms)`);

      // ============================================
      // PHASE 8: REF GENERATION
      // ============================================
      progress('PHASE_8', '🎨 Generating refs...');
      const phase8Start = Date.now();

      const masterRefs = await this.generateRefs(
        refPlan,
        world,
        input.refs || [],
        input.generateRefs ? refGenerator : undefined
      );

      timing.phase8_refGen = Date.now() - phase8Start;
      progress('PHASE_8', `✅ ${masterRefs.length} refs ready (${timing.phase8_refGen}ms)`);

      // ============================================
      // PHASE 9: REF VALIDATION (NEW!)
      // ============================================
      progress('PHASE_9', '✅ Validating refs...');
      const phase9Start = Date.now();

      const refValidation = refValidatorAgent.execute({
        refPlan,
        generatedRefs: masterRefs,
        previousFrameAvailable: false  // First run, no previous frames
      });

      timing.phase9_refVal = Date.now() - phase9Start;
      progress('PHASE_9', `✅ Validation: ${refValidation.summary.shots_ready}/${refValidation.summary.total_shots} ready (${timing.phase9_refVal}ms)`);

      if (!refValidation.ready_to_compile) {
        console.warn('[PipelineV2] ⚠️ Some refs missing, proceeding with warnings');
        errors.push(`Ref validation issues: ${refValidation.issues.length}`);
      }

      // ============================================
      // PHASE 10: SHOT COMPILATION
      // ============================================
      progress('PHASE_10', '🎬 Compiling shot cards...');
      const phase10Start = Date.now();

      const shots = await shotCompilerAgent.execute({
        worldState: world.worldState,
        cameraRigs: world.cameraRigs,
        beats: beats.beats || [],
        masterRefs,
        directorPlan: {
          shotSequence: direction.shot_sequence,
          refAssignments: direction.ref_assignments,
          continuityLocks: direction.continuity_locks,
          characterDirections: direction.character_directions
        },
        script: script.dialogue_lines,
        validatedRefs: refValidation.validated_stacks
      }) as ShotCompilerOutput;

      timing.phase10_shots = Date.now() - phase10Start;
      progress('PHASE_10', `✅ ${shots.shotCards?.length || 0} shot cards compiled (${timing.phase10_shots}ms)`);

      // ============================================
      // PHASE 11: AUDIO PLANNING
      // ============================================
      progress('PHASE_11', '🎙️ Planning audio...');
      const phase11Start = Date.now();

      // Note: Script is available in the pipeline but AudioPlanner
      // currently uses direction.dialogue_info for dialogue detection.
      // TODO: Extend AudioPlannerInput to use script.dialogue_lines for actual text
      const audioPlan = audioPlannerAgent.createPlan({
        concept: input.concept,
        shots: shots.shotCards || [],
        storyAnalysis,
        direction,
        targetDuration: input.targetDuration
      });

      timing.phase11_audio = Date.now() - phase11Start;
      progress('PHASE_11', `✅ Audio plan ready (${timing.phase11_audio}ms)`);

      // ============================================
      // PHASE 12: CONTINUITY VALIDATION
      // ============================================
      progress('PHASE_12', '🔍 Validating continuity...');
      const phase12Start = Date.now();

      const continuity = await continuityValidatorAgent.execute({
        worldState: world.worldState,
        shots: shots.shotCards || [],
        continuityLocks: direction.continuity_locks
      }) as ContinuityValidatorOutput;

      timing.phase12_continuity = Date.now() - phase12Start;
      progress('PHASE_12', `✅ Continuity score: ${continuity.overallScore} (${timing.phase12_continuity}ms)`);

      // ============================================
      // PHASE 13: EDITOR ADVISOR (NEW!)
      // ============================================
      progress('PHASE_13', '✂️ Editor reviewing cuts...');
      const phase13Start = Date.now();

      const editAdvice = editorAdvisorAgent.execute({
        direction,
        shots,
        script,
        targetDuration: input.targetDuration
      });

      timing.phase13_editor = Date.now() - phase13Start;
      progress('PHASE_13', `✅ Edit plan: ${editAdvice.summary.editing_style} (${timing.phase13_editor}ms)`);

      // ============================================
      // PHASE 14: PRODUCTION MANIFEST
      // ============================================
      progress('PHASE_14', '📊 Creating production manifest...');
      const phase14Start = Date.now();

      const productionManifest = producerAgent.createManifest(
        input.concept,
        direction,
        shots.shotCards || [],
        masterRefs
      );

      timing.phase14_producer = Date.now() - phase14Start;
      progress('PHASE_14', `✅ ${productionManifest.summary.totalAssets} assets planned (${timing.phase14_producer}ms)`);

      // ============================================
      // PHASE 15: FINAL VERIFICATION
      // ============================================
      progress('PHASE_15', '✅ Final verification...');
      const phase15Start = Date.now();

      const partialOutput = {
        storyAnalysis,
        world,
        direction,
        councilAdvice: null,  // No council in V2
        masterRefs,
        beats,
        modelSelection: null,  // Integrated into Director
        shots,
        audioPlan,
        validation: { overallScore: continuity.overallScore, passed: continuity.passOrFail === 'PASS', issues: [] },
        productionManifest,
        verification: null as any,
        success: false,
        errors: [],
        timing
      };

      const verification = verificationAgent.verify(partialOutput as any, input.targetDuration);

      timing.phase15_verify = Date.now() - phase15Start;
      timing.total = Date.now() - totalStart;

      progress('PHASE_15', `✅ Verification score: ${verification.score}/100 (${timing.phase15_verify}ms)`);
      progress('COMPLETE', `🎉 Pipeline complete in ${timing.total}ms`);

      // ============================================
      // RETURN COMPLETE OUTPUT
      // ============================================
      return {
        storyAnalysis,
        beats,
        coverage,
        direction,
        script,
        world,
        refPlan,
        masterRefs,
        refValidation,
        shots,
        audioPlan,
        continuity,
        editAdvice,
        productionManifest,
        verification,
        success: verification.passed && refValidation.ready_to_compile,
        errors,
        timing
      };

    } catch (error) {
      console.error('[PipelineV2] Error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');
      timing.total = Date.now() - totalStart;

      // Return error state
      return {
        storyAnalysis: null as any,
        beats: null as any,
        coverage: null as any,
        direction: null as any,
        script: null as any,
        world: null as any,
        refPlan: null as any,
        masterRefs: [],
        refValidation: null as any,
        shots: null as any,
        audioPlan: null as any,
        continuity: null as any,
        editAdvice: null as any,
        productionManifest: null as any,
        verification: {
          passed: false,
          score: 0,
          issues: [{
            id: 'pipeline_error',
            phase: 'cross_phase' as const,
            severity: 'critical' as const,
            category: 'pipeline',
            message: errors[0] || 'Unknown pipeline error',
            autoFixable: false,
            fix: 'Check logs for details'
          }],
          repairs: [],
          summary: { critical: 1, warnings: 0, info: 0, completeness: 0, consistency: 0 }
        },
        success: false,
        errors,
        timing
      };
    }
  },

  /**
   * Generate refs based on Ref Planner's requirements
   */
  async generateRefs(
    refPlan: RefPlannerOutput,
    world: WorldEngineerOutput,
    existingRefs: RefInput[],
    refGenerator?: RefGeneratorFn
  ): Promise<MasterRef[]> {
    const masterRefs: MasterRef[] = [];

    // Convert existing refs
    for (const ref of existingRefs) {
      masterRefs.push({
        id: `ref_${masterRefs.length}`,
        type: ref.type === 'character' ? 'CHARACTER_MASTER' :
              ref.type === 'location' ? 'ENVIRONMENT_MASTER' : 'PROP_MASTER',
        url: ref.url,
        name: ref.name
      });
    }

    // If no generator, return existing
    if (!refGenerator) {
      console.log('[PipelineV2] No ref generator, using existing refs');
      return masterRefs;
    }

    // Generate refs in order specified by Ref Planner
    for (const refId of refPlan.generation_order) {
      const req = refPlan.ref_requirements.find(r => r.ref_id === refId);
      if (!req) continue;

      // Skip if already have this ref
      if (masterRefs.some(r => r.id === refId || r.name === req.name)) {
        continue;
      }

      console.log(`[PipelineV2] Generating ref: ${refId} (${req.ref_type})`);

      try {
        const prompt = this.buildRefPrompt(req, world);
        const result = await refGenerator({
          type: req.ref_type === 'CHARACTER_MASTER' ? 'character' :
                req.ref_type === 'ENVIRONMENT_MASTER' ? 'environment' : 'prop',
          prompt,
          name: req.name
        });

        masterRefs.push({
          id: refId,
          type: req.ref_type,
          url: result.url,
          name: req.name
        });
      } catch (err) {
        console.error(`[PipelineV2] Failed to generate ref ${refId}:`, err);
      }
    }

    return masterRefs;
  },

  /**
   * Build generation prompt for a ref
   */
  buildRefPrompt(req: any, world: WorldEngineerOutput): string {
    if (req.ref_type === 'CHARACTER_MASTER') {
      const entity = world.entities?.find(e => e.entity_id === req.name);
      const appearance = entity?.appearance_lock_notes || req.name;

      return `${appearance}, 3x3 expression grid showing 9 expressions: neutral, happy, sad, angry, surprised, determined, fearful, confident, exhausted. White background, consistent character across all 9 cells. THIS EXACT CHARACTER in each cell. High detail, consistent lighting.`;
    }

    if (req.ref_type === 'ENVIRONMENT_MASTER') {
      const envDesc = world.worldState?.environment_geometry?.static_description || 'Environment';
      const lighting = world.worldState?.lighting?.primary_light_direction || 'natural';

      return `${envDesc}, 3x3 grid showing environment from 9 angles: wide front, wide left, wide right, medium front, medium left, medium right, detail 1, detail 2, overhead view. EMPTY SCENE - no characters. Lighting: ${lighting}. Consistent across all cells.`;
    }

    return `${req.name}, ${req.description}`;
  }
};

// ============================================
// EXPORTS
// ============================================

export default unifiedPipelineV2;
