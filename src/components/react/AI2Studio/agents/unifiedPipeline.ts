/**
 * UNIFIED PIPELINE - Everything in One
 *
 * This is the MASTER orchestrator that runs the entire production pipeline:
 *
 * PHASE -1: STORY ANALYSIS (THE FIRST BRAIN)
 *   → StoryAnalyst reads every word, thinks about WHY
 *   → Analyzes emotions, visual language, director style, audio needs
 *   → Creates creative brief that guides ALL other agents
 *
 * PHASE 0: WORLD ENGINEERING
 *   → WorldEngineer creates 3D world with coordinates, entities, lighting
 *
 * PHASE 1: DIRECTION & PLANNING
 *   → Director analyzes scene type, creates shot sequence, assigns refs, plans chaining
 *   → Council agents deliberate on story, visuals, technical, production
 *
 * PHASE 2: REF GENERATION
 *   → Generate CHARACTER_MASTER refs (expression grids)
 *   → Generate ENVIRONMENT_MASTER refs (angle grids)
 *
 * PHASE 3: BEAT PLANNING
 *   → BeatPlanner uses Director's plan to create detailed beats
 *   → Each beat has coordinates, timing, energy, allowed deltas
 *
 * PHASE 4: SHOT COMPILATION
 *   → ShotCompiler writes actual prompts using ALL context
 *   → Photo prompts with character descriptions, refs, continuity locks
 *   → Video prompts with motion, endpoints, power verbs
 *
 * PHASE 5: VALIDATION
 *   → ContinuityValidator checks everything before generation
 *
 * PHASE 6: PRODUCTION MANIFEST
 *   → Producer creates execution graph with dependencies
 *   → Determines what refs/photos/videos need to be made and in what order
 *   → Plans what can parallelize vs what must wait
 *
 * NO TOGGLES. NO MODES. Just ONE pipeline that does everything.
 */

import { worldEngineerAgent } from './worldEngineerAgent';
import { directorAgent, type DirectorOutput } from './directorAgent';
import { beatPlannerAgent } from './beatPlannerAgent';
import { shotCompilerAgent } from './shotCompilerAgent';
import { continuityValidatorAgent } from './continuityValidatorAgent';
import { callSpecAgent } from './specAICaller';
import { producerAgent, type ProductionManifest } from './producerAgent';
import { storyAnalystAgent, type StoryAnalysisOutput } from './storyAnalystAgent';
import { verificationAgent, type VerificationResult } from './verificationAgent';
import { audioPlannerAgent, type AudioPlan } from './audioPlannerAgent';
import { modelPickerAgent, type ModelPickerOutput } from './modelPickerAgent';

import type {
  WorldEngineerOutput,
  BeatPlannerOutput,
  ShotCompilerOutput,
  ContinuityValidatorOutput,
  MasterRef,
  RefInput,
  ShotCard
} from './specTypes';

import type { VideoModel } from './types';

// ============================================
// UNIFIED PIPELINE TYPES
// ============================================

export interface UnifiedPipelineInput {
  concept: string;
  targetDuration: number;
  refs?: RefInput[];
  generateRefs?: boolean;  // Auto-generate refs if true
}

export interface UnifiedPipelineOutput {
  // Phase -1: Story Analysis (FIRST BRAIN)
  storyAnalysis: StoryAnalysisOutput;

  // Phase 0: World
  world: WorldEngineerOutput;

  // Phase 1: Direction
  direction: DirectorOutput;
  councilAdvice: CouncilAdvice;

  // Phase 2: Refs
  masterRefs: MasterRef[];

  // Phase 3: Beats
  beats: BeatPlannerOutput;

  // Phase 3b: Model Selection (BEFORE Shot Compiler!)
  modelSelection: ModelPickerOutput;

  // Phase 4: Shots (now knows which model for each shot)
  shots: ShotCompilerOutput;

  // Phase 4b: Audio Planning
  audioPlan: AudioPlan;

  // Phase 5: Validation
  validation: ValidationResult;

  // Phase 6: Production Manifest (execution order & dependencies)
  productionManifest: ProductionManifest;

  // Phase 7: Final Verification
  verification: VerificationResult;

  // Meta
  success: boolean;
  errors: string[];
  timing: {
    storyAnalysisMs: number;
    worldMs: number;
    directionMs: number;
    councilMs: number;
    refsMs: number;
    beatsMs: number;
    modelPickerMs: number;
    shotsMs: number;
    audioPlanMs: number;
    producerMs: number;
    verificationMs: number;
    totalMs: number;
  };
}

export interface CouncilAdvice {
  narrative: {
    beatStructure: string;
    emotionalArc: string;
    pacingNotes: string;
  };
  visual: {
    directorStyle: string;
    shotRecommendations: string[];
    lightingNotes: string;
  };
  technical: {
    modelSelections: Array<{ shot: number; model: string; reason: string }>;
    motionValidation: string[];
  };
  production: {
    chainStrategy: string;
    refUsage: string[];
    continuityLocks: string[];
  };
}

export interface ValidationResult {
  overallScore: number;
  passed: boolean;
  issues: Array<{
    shot: number;
    severity: 'warning' | 'error';
    issue: string;
    fix: string;
  }>;
}

// ============================================
// COUNCIL INTEGRATION
// ============================================

const COUNCIL_SYSTEM_PROMPT = `You are a COUNCIL of 4 film production experts deliberating on a production plan.

You represent 4 perspectives:
1. NARRATIVE - Story structure, emotional arc, pacing
2. VISUAL - Director style, shot composition, lighting
3. TECHNICAL - Video model selection, motion prompts, API constraints
4. PRODUCTION - Ref usage, chaining, continuity

Analyze the Director's plan and provide consolidated advice.

Return JSON:
{
  "narrative": {
    "beatStructure": "Analysis of story beats",
    "emotionalArc": "How emotion builds and releases",
    "pacingNotes": "Pacing recommendations"
  },
  "visual": {
    "directorStyle": "Recommended director style and why",
    "shotRecommendations": ["Shot 1 advice", "Shot 2 advice"],
    "lightingNotes": "Lighting consistency notes"
  },
  "technical": {
    "modelSelections": [
      { "shot": 1, "model": "kling-2.6", "reason": "Action scene, no dialogue" }
    ],
    "motionValidation": ["Motion prompt 1 is good", "Motion prompt 2 needs endpoint"]
  },
  "production": {
    "chainStrategy": "Chain shots 2-6 from previous frame for continuity",
    "refUsage": ["Use CHARACTER_MASTER in all shots", "ENVIRONMENT in shots 1, 6"],
    "continuityLocks": ["Lock direction LEFT_TO_RIGHT", "Lock lighting NORTH_WEST"]
  }
}`;

async function getCouncilAdvice(
  concept: string,
  world: WorldEngineerOutput,
  direction: DirectorOutput,
  storyAnalysis?: StoryAnalysisOutput
): Promise<CouncilAdvice> {
  console.log('[Council] 🧠 Deliberating on production plan...');

  const userPrompt = `Deliberate on this production plan:

CONCEPT: "${concept}"

STORY ANALYSIS (from Story Analyst):
- Story Type: ${storyAnalysis?.concept_analysis?.story_type || 'ACTION'}
- Core Emotion: ${storyAnalysis?.concept_analysis?.core_emotion || 'engagement'}
- Director Style: ${storyAnalysis?.director_recommendation?.director || 'Spielberg'}
- Audio Needs: Voice-over: ${storyAnalysis?.audio_narrative_plan?.needs_voiceover ? 'YES' : 'NO'}, Dialogue: ${storyAnalysis?.audio_narrative_plan?.needs_dialogue ? 'YES' : 'NO'}

DIRECTOR'S PLAN:
${JSON.stringify(direction, null, 2)}

WORLD STATE:
${JSON.stringify(world.worldState, null, 2)}

Provide your consolidated council advice as JSON.`;

  const response = await callSpecAgent({
    systemPrompt: COUNCIL_SYSTEM_PROMPT,
    userMessage: userPrompt,
    expectJson: true,
    model: 'claude-sonnet'
  });

  if (!response.success) {
    console.log('[Council] Using default advice');
    return getDefaultCouncilAdvice(direction);
  }

  console.log('[Council] ✅ Council deliberation complete');
  return response.data as CouncilAdvice;
}

function getDefaultCouncilAdvice(direction: DirectorOutput): CouncilAdvice {
  return {
    narrative: {
      beatStructure: 'Standard dramatic structure',
      emotionalArc: direction.scene_analysis?.energy_arc?.join(' → ') || '2 → 3 → 4 → 5 → 4 → 2',
      pacingNotes: 'Maintain steady build to climax'
    },
    visual: {
      directorStyle: direction.scene_analysis?.director_style || 'Spielberg',
      shotRecommendations: direction.shot_sequence?.map(s => s.purpose) || [],
      lightingNotes: 'Maintain consistent lighting direction'
    },
    technical: {
      modelSelections: direction.shot_sequence?.map((s, i) => ({
        shot: i + 1,
        model: 'kling-2.6',
        reason: 'Default action model'
      })) || [],
      motionValidation: ['Add endpoints to all motion prompts']
    },
    production: {
      chainStrategy: 'Chain all shots from previous frame except shot 1',
      refUsage: ['CHARACTER_MASTER in all character shots', 'ENVIRONMENT_MASTER in wide shots'],
      continuityLocks: ['Lock screen direction', 'Lock lighting', 'Lock color grade']
    }
  };
}

// ============================================
// REF GENERATION
// ============================================

export type RefGeneratorFn = (params: {
  type: 'character' | 'environment' | 'prop';
  prompt: string;
  name: string;
}) => Promise<{ url: string }>;

async function generateMasterRefs(
  world: WorldEngineerOutput,
  direction: DirectorOutput,
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

  // If no generator or we have refs, return what we have
  if (!refGenerator || existingRefs.length > 0) {
    console.log('[Refs] Using', masterRefs.length, 'existing refs');
    return masterRefs;
  }

  // Generate refs based on world state
  console.log('[Refs] 🎨 Generating master references...');

  // Generate CHARACTER_MASTER for each character
  const characters = world.entities?.filter(e => e.entity_type === 'character') || [];
  for (const char of characters) {
    console.log('[Refs] Generating CHARACTER_MASTER for:', char.entity_id);

    const prompt = `${char.appearance_lock_notes || 'Character'}, 3x3 expression grid showing 9 expressions: neutral, happy, sad, angry, surprised, determined, fearful, confident, exhausted. White background, consistent character across all 9 cells. THIS EXACT CHARACTER in each cell. High detail, consistent lighting.`;

    try {
      const result = await refGenerator({
        type: 'character',
        prompt,
        name: char.entity_id
      });

      masterRefs.push({
        id: `char_${char.entity_id}`,
        type: 'CHARACTER_MASTER',
        url: result.url,
        name: char.entity_id
      });
    } catch (err) {
      console.error('[Refs] Failed to generate character ref:', err);
    }
  }

  // Generate ENVIRONMENT_MASTER
  if (world.worldState?.environment_geometry?.static_description) {
    console.log('[Refs] Generating ENVIRONMENT_MASTER');

    const envPrompt = `${world.worldState.environment_geometry.static_description}, 3x3 grid showing environment from 9 angles: wide front, wide left, wide right, medium front, medium left, medium right, detail 1, detail 2, overhead view. EMPTY SCENE - no characters. Lighting: ${world.worldState.lighting?.primary_light_direction || 'natural'}. Consistent across all cells.`;

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
      console.error('[Refs] Failed to generate environment ref:', err);
    }
  }

  console.log('[Refs] ✅ Generated', masterRefs.length, 'master refs');
  return masterRefs;
}

// ============================================
// ENHANCED SHOT COMPILATION
// ============================================

async function compileEnhancedShots(
  beats: BeatPlannerOutput,
  world: WorldEngineerOutput,
  direction: DirectorOutput,
  council: CouncilAdvice,
  masterRefs: MasterRef[],
  modelSelection?: ModelPickerOutput  // NEW: Model selection from Model Picker Agent
): Promise<ShotCompilerOutput> {
  console.log('[ShotCompiler] 🎬 Compiling shots with full context...');

  // Build enhanced input with Director's plan and Council advice
  const enhancedInput = {
    worldState: world.worldState,
    cameraRigs: world.cameraRigs,
    beats: beats.beats,
    masterRefs,
    // Add director's plan
    directorPlan: {
      shotSequence: direction.shot_sequence,
      refAssignments: direction.ref_assignments,
      continuityLocks: direction.continuity_locks,
      characterDirections: direction.character_directions
    },
    // Add council advice
    councilAdvice: {
      modelSelections: council.technical.modelSelections,
      chainStrategy: council.production.chainStrategy,
      visualStyle: council.visual.directorStyle
    },
    // NEW: Add model selection from Model Picker
    modelSelection: modelSelection?.selections || []
  };

  // Call shot compiler with enhanced context
  const result = await shotCompilerAgent.execute(enhancedInput) as ShotCompilerOutput;

  // Enhance shot cards with Director's ref assignments AND Model Picker's model selection
  result.shotCards = result.shotCards.map((shot, i) => {
    const refAssignment = direction.ref_assignments?.[i];
    const shotPlan = direction.shot_sequence?.[i];
    // PRIORITIZE Model Picker selection over Council selection
    const pickedModel = modelSelection?.selections?.[i];
    const councilModel = council.technical.modelSelections?.[i];

    // Determine final video model - Model Picker takes priority!
    let finalVideoModel: VideoModel = shot.video_model;
    let modelReasoning = '';

    if (pickedModel) {
      // Model Picker made a decision - USE IT
      finalVideoModel = pickedModel.video_model as VideoModel;
      modelReasoning = pickedModel.reasoning;
      console.log(`[ShotCompiler] Shot ${i + 1}: ${pickedModel.video_model} (${pickedModel.reasoning})`);
    } else if (councilModel?.model) {
      // Fallback to council if no Model Picker
      finalVideoModel = councilModel.model as VideoModel;
      modelReasoning = councilModel.reason;
    }

    return {
      ...shot,
      // Apply ref stack from Director
      refs: refAssignment ? {
        image_1: refAssignment.chain_from_previous ? 'PREVIOUS_FRAME' : 'BASE_WORLD',
        image_2: refAssignment.ref_stack?.[1] || shot.refs.image_2,
        image_3: refAssignment.ref_stack?.[2] || shot.refs.image_3,
        others: shot.refs.others
      } : shot.refs,
      // Apply camera rig from Director
      camera_rig_id: shotPlan?.camera_rig || shot.camera_rig_id,
      lens_mm: shotPlan?.lens_mm || shot.lens_mm,
      // Apply model from Model Picker (PRIORITY) or Council
      video_model: finalVideoModel,
      // Add continuity locks + model reasoning
      continuity_phrases: [
        ...shot.continuity_phrases,
        `Direction: ${direction.continuity_locks?.screen_direction || 'LEFT_TO_RIGHT'}`,
        `Lighting: ${direction.continuity_locks?.light_direction || 'NORTH_WEST'}`,
        refAssignment?.chain_from_previous ? 'Continue from Image 1' : 'New establishing shot',
        modelReasoning ? `Model: ${modelReasoning}` : ''
      ].filter(Boolean)
    };
  });

  console.log('[ShotCompiler] ✅ Enhanced', result.shotCards.length, 'shot cards');
  return result;
}

// ============================================
// VALIDATION
// ============================================

async function validatePipeline(
  shots: ShotCompilerOutput,
  world: WorldEngineerOutput,
  direction: DirectorOutput
): Promise<ValidationResult> {
  console.log('[Validator] 🔍 Validating production plan...');

  const issues: ValidationResult['issues'] = [];
  let score = 100;

  // Check each shot
  for (let i = 0; i < shots.shotCards.length; i++) {
    const shot = shots.shotCards[i];
    const refAssignment = direction.ref_assignments?.[i];

    // Check if chaining is correct
    if (i > 0 && refAssignment?.chain_from_previous && shot.refs.image_1 !== 'PREVIOUS_FRAME') {
      issues.push({
        shot: i + 1,
        severity: 'warning',
        issue: 'Shot should chain from previous frame but is not',
        fix: 'Set refs.image_1 to PREVIOUS_FRAME'
      });
      score -= 5;
    }

    // Check if shot has photo prompt
    if (!shot.photo_prompt || shot.photo_prompt.length < 50) {
      issues.push({
        shot: i + 1,
        severity: 'error',
        issue: 'Photo prompt too short or missing',
        fix: 'Add detailed photo prompt with character, action, environment'
      });
      score -= 10;
    }

    // Check if video prompt has endpoint
    if (shot.video_motion_prompt && !shot.video_motion_prompt.includes('then')) {
      issues.push({
        shot: i + 1,
        severity: 'warning',
        issue: 'Video prompt missing motion endpoint',
        fix: 'Add endpoint like "then settles" or "then holds"'
      });
      score -= 5;
    }

    // Check continuity locks
    if (!shot.continuity_phrases || shot.continuity_phrases.length < 3) {
      issues.push({
        shot: i + 1,
        severity: 'warning',
        issue: 'Missing continuity lock phrases',
        fix: 'Add THIS EXACT CHARACTER, direction lock, lighting lock'
      });
      score -= 3;
    }
  }

  // Check overall continuity
  const directions = shots.shotCards.map(s =>
    s.continuity_phrases?.find(p => p.includes('Direction'))
  );
  const uniqueDirections = [...new Set(directions.filter(Boolean))];
  if (uniqueDirections.length > 1) {
    issues.push({
      shot: 0,
      severity: 'error',
      issue: 'Inconsistent screen direction across shots',
      fix: 'Lock direction to one value for entire sequence'
    });
    score -= 15;
  }

  console.log('[Validator] ✅ Score:', score, '| Issues:', issues.length);

  return {
    overallScore: Math.max(0, score),
    passed: score >= 70,
    issues
  };
}

// ============================================
// UNIFIED PIPELINE ORCHESTRATOR
// ============================================

export const unifiedPipeline = {
  /**
   * Run the complete unified pipeline
   */
  async run(
    input: UnifiedPipelineInput,
    refGenerator?: RefGeneratorFn,
    onProgress?: (phase: string, message: string) => void
  ): Promise<UnifiedPipelineOutput> {
    const errors: string[] = [];
    const timing: UnifiedPipelineOutput['timing'] = {
      storyAnalysisMs: 0,
      worldMs: 0,
      directionMs: 0,
      councilMs: 0,
      refsMs: 0,
      beatsMs: 0,
      modelPickerMs: 0,
      shotsMs: 0,
      audioPlanMs: 0,
      producerMs: 0,
      verificationMs: 0,
      totalMs: 0
    };

    const totalStart = Date.now();
    const progress = (phase: string, msg: string) => {
      console.log(`[UnifiedPipeline] ${phase}: ${msg}`);
      onProgress?.(phase, msg);
    };

    try {
      // ============================================
      // PHASE -1: STORY ANALYSIS (THE FIRST BRAIN)
      // ============================================
      progress('PHASE_STORY', '🧠 Story Analyst thinking about concept...');
      const storyStart = Date.now();

      const storyAnalysis = await storyAnalystAgent.execute({
        concept: input.concept,
        targetDuration: input.targetDuration
      });

      timing.storyAnalysisMs = Date.now() - storyStart;
      progress('PHASE_STORY', `Story analysis complete in ${timing.storyAnalysisMs}ms`);
      console.log('[UnifiedPipeline] Story type:', storyAnalysis.concept_analysis?.story_type);
      console.log('[UnifiedPipeline] Core emotion:', storyAnalysis.concept_analysis?.core_emotion);
      console.log('[UnifiedPipeline] Director rec:', storyAnalysis.director_recommendation?.director);

      // ============================================
      // PHASE 0: WORLD ENGINEERING
      // ============================================
      // WorldEngineer now gets Story Analyst's visual language insights
      progress('PHASE_0', 'Creating 3D world state...');
      const worldStart = Date.now();

      const world = await worldEngineerAgent.execute({
        concept: input.concept,
        refs: input.refs,
        // Pass story analysis insights for better world building
        storyContext: {
          storyType: storyAnalysis.concept_analysis?.story_type,
          lighting: storyAnalysis.visual_language?.lighting?.choice,
          colorPalette: storyAnalysis.visual_language?.color_palette
        }
      }) as WorldEngineerOutput;

      timing.worldMs = Date.now() - worldStart;
      progress('PHASE_0', `World created in ${timing.worldMs}ms`);

      // ============================================
      // PHASE 1: DIRECTION & COUNCIL
      // ============================================
      // Director now gets Story Analyst's recommendations
      progress('PHASE_1', 'Director analyzing scene...');
      const directionStart = Date.now();

      const direction = await directorAgent.execute({
        concept: input.concept,
        targetDuration: input.targetDuration,
        worldState: world,
        availableRefs: [],
        // Pass story analysis for informed decisions
        storyAnalysis: {
          storyType: storyAnalysis.concept_analysis?.story_type,
          emotionalArc: storyAnalysis.emotional_journey?.arc_description,
          recommendedDirector: storyAnalysis.director_recommendation?.director,
          directorTechniques: storyAnalysis.director_recommendation?.specific_techniques,
          visualLanguage: storyAnalysis.visual_language,
          audioNeeds: storyAnalysis.audio_narrative_plan
        }
      });

      timing.directionMs = Date.now() - directionStart;
      progress('PHASE_1', `Direction complete in ${timing.directionMs}ms`);

      progress('PHASE_1', 'Council deliberating...');
      const councilStart = Date.now();

      // Council also receives story analysis for informed deliberation
      const councilAdvice = await getCouncilAdvice(input.concept, world, direction, storyAnalysis);

      timing.councilMs = Date.now() - councilStart;
      progress('PHASE_1', `Council complete in ${timing.councilMs}ms`);

      // ============================================
      // PHASE 2: REF GENERATION
      // ============================================
      progress('PHASE_2', 'Generating master references...');
      const refsStart = Date.now();

      const masterRefs = await generateMasterRefs(
        world,
        direction,
        input.refs || [],
        input.generateRefs ? refGenerator : undefined
      );

      timing.refsMs = Date.now() - refsStart;
      progress('PHASE_2', `Refs complete in ${timing.refsMs}ms (${masterRefs.length} refs)`);

      // ============================================
      // PHASE 3: BEAT PLANNING
      // ============================================
      progress('PHASE_3', 'Planning story beats...');
      const beatsStart = Date.now();

      const beats = await beatPlannerAgent.execute({
        storyOutline: input.concept,
        targetDurationSeconds: input.targetDuration,
        worldState: world.worldState,
        constraints: {
          // Use Director's plan to constrain beats
          pacingStyle: direction.scene_analysis.scene_type === 'ACTION' ? 'fast' : 'medium'
        }
      }) as BeatPlannerOutput;

      timing.beatsMs = Date.now() - beatsStart;
      progress('PHASE_3', `Beats complete in ${timing.beatsMs}ms (${beats.beats.length} beats)`);

      // ============================================
      // PHASE 3b: MODEL SELECTION (BEFORE Shot Compiler!)
      // ============================================
      // This is CRITICAL - we must know which model for each shot
      // BEFORE writing prompts. Different models need different prompts.
      progress('PHASE_3b', '🎯 Selecting models for each shot...');
      const modelPickerStart = Date.now();

      const modelSelection = modelPickerAgent.pickModels({
        direction,
        storyAnalysis,
        budget: {
          preferCheaper: false  // Can be set by user later
        }
      });

      timing.modelPickerMs = Date.now() - modelPickerStart;
      progress('PHASE_3b', `Model selection complete in ${timing.modelPickerMs}ms`);
      console.log('[UnifiedPipeline] 🎯 Model summary:');
      console.log(`[UnifiedPipeline]   - Lip sync shots: ${modelSelection.summary.lip_sync_shots}`);
      console.log(`[UnifiedPipeline]   - B-roll shots: ${modelSelection.summary.b_roll_shots}`);
      console.log(`[UnifiedPipeline]   - Estimated cost: $${modelSelection.summary.total_estimated_cost.toFixed(2)}`);

      // ============================================
      // PHASE 4: SHOT COMPILATION (Now with model info!)
      // ============================================
      progress('PHASE_4', 'Compiling shot cards...');
      const shotsStart = Date.now();

      const shots = await compileEnhancedShots(
        beats,
        world,
        direction,
        councilAdvice,
        masterRefs,
        modelSelection  // Pass model selection to Shot Compiler!
      );

      timing.shotsMs = Date.now() - shotsStart;
      progress('PHASE_4', `Shots complete in ${timing.shotsMs}ms (${shots.shotCards.length} shots)`);

      // ============================================
      // PHASE 4b: AUDIO PLANNING
      // ============================================
      progress('PHASE_4b', '🎙️ Creating audio plan...');
      const audioStart = Date.now();

      const audioPlan = audioPlannerAgent.createPlan({
        concept: input.concept,
        shots: shots.shotCards,
        storyAnalysis,
        direction,
        targetDuration: input.targetDuration
      });

      timing.audioPlanMs = Date.now() - audioStart;
      progress('PHASE_4b', `Audio plan complete in ${timing.audioPlanMs}ms`);

      // Update shots that need SEEDANCE for lip sync
      if (audioPlan.summary.shots_needing_seedance.length > 0) {
        console.log('[UnifiedPipeline] 🎙️ Updating shots for lip sync:');
        audioPlan.summary.shots_needing_seedance.forEach(shotId => {
          const shot = shots.shotCards.find(s => s.shot_id === shotId);
          if (shot) {
            shot.video_model = 'seedance-1.5';
            console.log(`[UnifiedPipeline]   → ${shotId} → SEEDANCE (lip sync)`);
          }
        });
      }

      // ============================================
      // PHASE 5: VALIDATION
      // ============================================
      progress('PHASE_5', 'Validating production plan...');

      const validation = await validatePipeline(shots, world, direction);

      progress('PHASE_5', `Validation complete. Score: ${validation.overallScore}`);

      // ============================================
      // PHASE 6: PRODUCTION MANIFEST (Execution Order & Dependencies)
      // ============================================
      progress('PHASE_6', '📊 Producer creating execution manifest...');
      const producerStart = Date.now();

      const productionManifest = producerAgent.createManifest(
        input.concept,
        direction,
        shots.shotCards,
        masterRefs
      );

      timing.producerMs = Date.now() - producerStart;
      progress('PHASE_6', `Production manifest complete in ${timing.producerMs}ms`);
      console.log('[UnifiedPipeline] Production phases:', productionManifest.phases.length);
      console.log('[UnifiedPipeline] Total assets:', productionManifest.summary.totalAssets);

      // ============================================
      // PHASE 7: FINAL VERIFICATION (Quality Control)
      // ============================================
      progress('PHASE_7', '✅ Running final verification...');
      const verificationStart = Date.now();

      // Build partial output for verification
      const partialOutput: UnifiedPipelineOutput = {
        storyAnalysis,
        world,
        direction,
        councilAdvice,
        masterRefs,
        beats,
        modelSelection,
        shots,
        audioPlan,
        validation,
        productionManifest,
        verification: null as any,  // Will be filled
        success: false,
        errors: [],
        timing: timing
      };

      const finalVerification = verificationAgent.verify(partialOutput, input.targetDuration);

      timing.verificationMs = Date.now() - verificationStart;
      progress('PHASE_7', `Verification complete in ${timing.verificationMs}ms - Score: ${finalVerification.score}/100`);

      // Log verification summary
      if (finalVerification.summary.critical > 0) {
        console.log('[UnifiedPipeline] ⚠️ CRITICAL ISSUES:', finalVerification.summary.critical);
        finalVerification.repairs.forEach(r => {
          console.log(`[UnifiedPipeline]   → ${r.action.toUpperCase()} ${r.phase}: ${r.details}`);
        });
      }

      // ============================================
      // COMPLETE
      // ============================================
      timing.totalMs = Date.now() - totalStart;

      // Determine overall success: both validation AND verification must pass
      const overallSuccess = validation.passed && finalVerification.passed;

      console.log('[UnifiedPipeline] ✅ PIPELINE COMPLETE');
      console.log('[UnifiedPipeline] Total time:', timing.totalMs, 'ms');
      console.log('[UnifiedPipeline] Shots:', shots.shotCards.length);
      console.log('[UnifiedPipeline] Validation score:', validation.overallScore);
      console.log('[UnifiedPipeline] Verification score:', finalVerification.score);
      console.log('[UnifiedPipeline] Overall success:', overallSuccess);

      return {
        storyAnalysis,
        world,
        direction,
        councilAdvice,
        masterRefs,
        beats,
        modelSelection,
        shots,
        audioPlan,
        validation,
        productionManifest,
        verification: finalVerification,
        success: overallSuccess,
        errors,
        timing
      };

    } catch (error) {
      console.error('[UnifiedPipeline] Error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');

      // Return partial result
      return {
        storyAnalysis: null as any,
        world: null as any,
        direction: null as any,
        councilAdvice: null as any,
        masterRefs: [],
        beats: null as any,
        modelSelection: null as any,
        shots: null as any,
        audioPlan: null as any,
        validation: { overallScore: 0, passed: false, issues: [] },
        productionManifest: null as any,
        verification: { passed: false, score: 0, issues: [], repairs: [], summary: { critical: 1, warnings: 0, info: 0, completeness: 0, consistency: 0 } },
        success: false,
        errors,
        timing: { ...timing, totalMs: Date.now() - totalStart }
      };
    }
  }
};

// ============================================
// EXPORTS
// ============================================

export default unifiedPipeline;
