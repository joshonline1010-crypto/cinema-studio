/**
 * MODEL PICKER AGENT - The Technical Decision Maker
 *
 * This agent runs AFTER Director, BEFORE Shot Compiler.
 * It takes Director's plan and picks the BEST model for each shot.
 *
 * WHY SEPARATE AGENT?
 * - Director thinks CREATIVELY (what shot, why, emotion)
 * - Model Picker thinks TECHNICALLY (what model, cost, capability)
 * - Shot Compiler needs to know the model BEFORE writing prompts
 *
 * DECISION FACTORS:
 * 1. Dialogue/lip sync needs → Seedance 1.5 or VEED
 * 2. B-roll/atmosphere → Sora 2 (if flagged by Director)
 * 3. Start→End transitions → Kling O1
 * 4. Action/movement → Kling 2.6
 * 5. Budget constraints → Cheaper alternatives
 * 6. Quality requirements → Premium vs standard
 */

import type { ShotPlan, DirectorOutput } from './directorAgent';
import type { StoryAnalysisOutput } from './storyAnalystAgent';
import { FAL_ENDPOINTS } from './audioPlannerAgent';

// ============================================
// TYPES
// ============================================

export type VideoModel =
  | 'kling-2.6'      // Action, movement, general purpose
  | 'kling-o1'       // Start→End transitions
  | 'seedance-1.5'   // Dialogue with lip sync
  | 'sora-2'         // B-roll, multi-shot, atmosphere
  | 'veed-fabric';   // Avatar lip sync (photo→talking)

export type ImageModel =
  | 'nano-banana'    // Default image gen
  | 'nano-banana-edit'; // Image editing/angles

export interface ModelCost {
  model: VideoModel | ImageModel;
  costPerShot: number;  // USD
  estimatedTimeMs: number;
}

export const MODEL_COSTS: Record<VideoModel, ModelCost> = {
  'kling-2.6': { model: 'kling-2.6', costPerShot: 0.35, estimatedTimeMs: 45000 },
  'kling-o1': { model: 'kling-o1', costPerShot: 0.45, estimatedTimeMs: 60000 },
  'seedance-1.5': { model: 'seedance-1.5', costPerShot: 0.40, estimatedTimeMs: 50000 },
  'sora-2': { model: 'sora-2', costPerShot: 0.50, estimatedTimeMs: 180000 },
  'veed-fabric': { model: 'veed-fabric', costPerShot: 0.30, estimatedTimeMs: 30000 }
};

export interface ModelSelection {
  shot_number: number;
  shot_id: string;

  // Selected models
  image_model: ImageModel;
  video_model: VideoModel;

  // FAL endpoints
  image_endpoint: string;
  video_endpoint: string;

  // Why this model
  reasoning: string;

  // Technical details
  needs_lip_sync: boolean;
  needs_end_frame: boolean;  // For Kling O1
  is_b_roll: boolean;

  // Cost estimate
  estimated_cost: number;
  estimated_time_ms: number;

  // Special configs
  sora_config?: {
    ref_type: 'location_only' | 'character_only' | 'character_in_location' | 'collage';
    preset?: string;
  };
}

export interface ModelPickerInput {
  direction: DirectorOutput;
  storyAnalysis?: StoryAnalysisOutput;
  budget?: {
    maxPerShot?: number;
    maxTotal?: number;
    preferCheaper?: boolean;
  };
}

export interface ModelPickerOutput {
  selections: ModelSelection[];
  summary: {
    total_shots: number;
    models_used: Record<VideoModel, number>;
    total_estimated_cost: number;
    total_estimated_time_ms: number;
    lip_sync_shots: number;
    b_roll_shots: number;
    transition_shots: number;
  };
}

// ============================================
// MODEL SELECTION LOGIC
// ============================================

const MODEL_PICKER_SYSTEM_PROMPT = `You are the MODEL PICKER AGENT - the technical decision maker.

## YOUR ROLE
You analyze each shot from the Director's plan and select the BEST video model.
You think about CAPABILITIES, COST, and QUALITY.

## VIDEO MODEL CAPABILITIES

| Model | Best For | Limitations | Cost |
|-------|----------|-------------|------|
| **kling-2.6** | Action, movement, general | No lip sync | $0.35 |
| **kling-o1** | Start→End transitions, zooms | Needs 2 images | $0.45 |
| **seedance-1.5** | Dialogue with lip sync | Slower | $0.40 |
| **sora-2** | B-roll, multi-shot, atmosphere | No precise character control | $0.50 |
| **veed-fabric** | Photo→talking avatar | Static background | $0.30 |

## DECISION TREE

\`\`\`
Does shot have dialogue with visible face?
├── YES → Is face close-up and stationary?
│         ├── YES → veed-fabric (avatar)
│         └── NO  → seedance-1.5 (video lip sync)
└── NO  → Is this B-roll/atmosphere? (sora_candidate from Director)
          ├── YES → sora-2 (multi-shot efficiency)
          └── NO  → Does shot need start→end transition?
                    ├── YES → kling-o1 (needs end frame)
                    └── NO  → kling-2.6 (default action)
\`\`\`

## SPECIAL RULES

1. **LIP SYNC DETECTION**
   - dialogue_info.speech_mode === 'lip_sync' → Seedance or VEED
   - dialogue_info.speech_mode === 'pov' → NO lip sync needed (voice only)
   - dialogue_info.speech_mode === 'inner_thoughts' → NO lip sync (face visible, no mouth move)

2. **SORA 2 RULES** (from Director's sora_candidate)
   - ONLY if sora_candidate === true
   - NEVER for dialogue
   - NEVER for story-critical character action
   - GOOD for: vehicles, atmosphere, transitions, B-roll

3. **KLING O1 TRIGGERS**
   - Camera movement that changes framing significantly
   - Zoom in/out that needs controlled end state
   - Scene transitions within same environment

4. **BUDGET MODE**
   - If preferCheaper: kling-2.6 over seedance unless lip sync required
   - If maxPerShot set: warn if selection exceeds

## OUTPUT FORMAT

For each shot, output:
\`\`\`json
{
  "shot_number": 1,
  "video_model": "kling-2.6",
  "reasoning": "Action shot, no dialogue, standard movement",
  "needs_lip_sync": false,
  "needs_end_frame": false,
  "is_b_roll": false,
  "estimated_cost": 0.35
}
\`\`\`
`;

// ============================================
// MODEL PICKER AGENT
// ============================================

export const modelPickerAgent = {
  role: 'model_picker',
  name: 'Model Picker Agent',
  icon: '🎯',
  color: 'purple',

  /**
   * Pick the best model for each shot
   */
  pickModels(input: ModelPickerInput): ModelPickerOutput {
    console.log('[ModelPicker] 🎯 Analyzing shots for model selection...');

    const selections: ModelSelection[] = [];
    const modelCounts: Record<VideoModel, number> = {
      'kling-2.6': 0,
      'kling-o1': 0,
      'seedance-1.5': 0,
      'sora-2': 0,
      'veed-fabric': 0
    };

    let totalCost = 0;
    let totalTime = 0;
    let lipSyncShots = 0;
    let bRollShots = 0;
    let transitionShots = 0;

    const shots = input.direction.shot_sequence || [];

    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i];
      const selection = this.selectModelForShot(shot, i, shots, input.budget);

      selections.push(selection);
      modelCounts[selection.video_model]++;
      totalCost += selection.estimated_cost;
      totalTime += selection.estimated_time_ms;

      if (selection.needs_lip_sync) lipSyncShots++;
      if (selection.is_b_roll) bRollShots++;
      if (selection.needs_end_frame) transitionShots++;

      console.log(`[ModelPicker] Shot ${i + 1} → ${selection.video_model} (${selection.reasoning})`);
    }

    console.log(`[ModelPicker] ✅ Selected models for ${shots.length} shots`);
    console.log(`[ModelPicker] 💰 Total estimated cost: $${totalCost.toFixed(2)}`);

    return {
      selections,
      summary: {
        total_shots: shots.length,
        models_used: modelCounts,
        total_estimated_cost: totalCost,
        total_estimated_time_ms: totalTime,
        lip_sync_shots: lipSyncShots,
        b_roll_shots: bRollShots,
        transition_shots: transitionShots
      }
    };
  },

  /**
   * Select model for a single shot
   */
  selectModelForShot(
    shot: ShotPlan,
    index: number,
    allShots: ShotPlan[],
    budget?: ModelPickerInput['budget']
  ): ModelSelection {
    let videoModel: VideoModel = 'kling-2.6';
    let reasoning = '';
    let needsLipSync = false;
    let needsEndFrame = false;
    let isBRoll = false;

    // ========================================
    // DECISION 1: Check for dialogue/lip sync
    // ========================================
    if (shot.dialogue_info?.has_dialogue) {
      const speechMode = shot.dialogue_info.speech_mode;

      if (speechMode === 'lip_sync') {
        needsLipSync = true;

        // Check if it's a static close-up (good for VEED avatar)
        const isStaticCloseup =
          shot.camera_movement === 'static' &&
          (shot.shot_type.includes('CU') || shot.shot_type.includes('CLOSEUP'));

        if (isStaticCloseup) {
          videoModel = 'veed-fabric';
          reasoning = `Dialogue with lip sync - static closeup, using avatar`;
        } else {
          videoModel = 'seedance-1.5';
          reasoning = `Dialogue with lip sync - ${shot.dialogue_info.character} speaking`;
        }
      } else if (speechMode === 'pov') {
        // POV = camera is character, no face visible
        videoModel = 'kling-2.6';
        reasoning = 'POV dialogue - no lip sync needed (voice only)';
      } else if (speechMode === 'inner_thoughts') {
        // Face visible but no mouth movement
        videoModel = 'kling-2.6';
        reasoning = 'Inner thoughts - face visible but no lip sync';
      } else {
        // voice_only
        videoModel = 'kling-2.6';
        reasoning = 'Voice only narration - no lip sync';
      }
    }

    // ========================================
    // DECISION 2: Check for Sora 2 B-roll
    // ========================================
    else if (shot.sora_candidate === true) {
      videoModel = 'sora-2';
      isBRoll = true;
      reasoning = shot.sora_reason || 'B-roll/atmosphere - using Sora 2 multi-shot';
    }

    // ========================================
    // DECISION 3: Check for Kling O1 transitions
    // ========================================
    else if (this.needsKlingO1(shot, index, allShots)) {
      videoModel = 'kling-o1';
      needsEndFrame = true;
      reasoning = 'Start→End transition - using Kling O1 with end frame';
    }

    // ========================================
    // DECISION 4: Default to Kling 2.6
    // ========================================
    else {
      videoModel = 'kling-2.6';
      reasoning = 'Standard action/movement shot';
    }

    // ========================================
    // BUDGET CHECK
    // ========================================
    const cost = MODEL_COSTS[videoModel];

    if (budget?.preferCheaper && !needsLipSync && videoModel !== 'kling-2.6') {
      // Downgrade to cheaper if possible
      if (videoModel === 'sora-2' || videoModel === 'kling-o1') {
        videoModel = 'kling-2.6';
        reasoning += ' (budget: downgraded to kling-2.6)';
      }
    }

    if (budget?.maxPerShot && cost.costPerShot > budget.maxPerShot) {
      console.warn(`[ModelPicker] ⚠️ Shot ${index + 1} exceeds budget: $${cost.costPerShot} > $${budget.maxPerShot}`);
    }

    // ========================================
    // BUILD SELECTION
    // ========================================
    const finalCost = MODEL_COSTS[videoModel];

    return {
      shot_number: shot.shot_number,
      shot_id: `shot_${shot.shot_number}`,

      image_model: 'nano-banana',
      video_model: videoModel,

      image_endpoint: FAL_ENDPOINTS.IMAGE_EDIT,
      video_endpoint: this.getVideoEndpoint(videoModel),

      reasoning,

      needs_lip_sync: needsLipSync,
      needs_end_frame: needsEndFrame,
      is_b_roll: isBRoll,

      estimated_cost: finalCost.costPerShot,
      estimated_time_ms: finalCost.estimatedTimeMs,

      sora_config: videoModel === 'sora-2' ? {
        ref_type: shot.sora_ref_type || 'location_only',
        preset: shot.sora_preset
      } : undefined
    };
  },

  /**
   * Check if shot needs Kling O1 (start→end transition)
   */
  needsKlingO1(shot: ShotPlan, index: number, allShots: ShotPlan[]): boolean {
    // Significant camera movement that changes framing
    const transitionMoves = ['push_in', 'pull_back', 'dolly_zoom', 'crane_up', 'crane_down'];
    if (transitionMoves.some(m => shot.camera_movement?.includes(m))) {
      return true;
    }

    // Shot type changes significantly (WIDE → CU in same shot)
    if (shot.purpose?.toLowerCase().includes('transition')) {
      return true;
    }

    // Energy level jumps significantly
    if (index > 0) {
      const prevShot = allShots[index - 1];
      const energyDelta = Math.abs(shot.energy_level - prevShot.energy_level);
      if (energyDelta >= 3) {
        return true;
      }
    }

    return false;
  },

  /**
   * Get FAL endpoint for video model
   */
  getVideoEndpoint(model: VideoModel): string {
    switch (model) {
      case 'sora-2':
        return FAL_ENDPOINTS.SORA_IMAGE_TO_VIDEO;
      case 'seedance-1.5':
        return 'fal-ai/seedance/image-to-video';  // TODO: Add to FAL_ENDPOINTS
      case 'kling-o1':
        return 'fal-ai/kling-video/o1/image-to-video';  // TODO: Add to FAL_ENDPOINTS
      case 'kling-2.6':
        return 'fal-ai/kling-video/v2.6/image-to-video';  // TODO: Add to FAL_ENDPOINTS
      case 'veed-fabric':
        return FAL_ENDPOINTS.AVATAR_LIPSYNC;
      default:
        return 'fal-ai/kling-video/v2.6/image-to-video';
    }
  },

  /**
   * Get system prompt for AI-powered model selection (if needed)
   */
  getSystemPrompt(): string {
    return MODEL_PICKER_SYSTEM_PROMPT;
  }
};

// ============================================
// UTILITY: Print model selection summary
// ============================================

export function printModelSelectionSummary(output: ModelPickerOutput): string {
  let result = `\n🎯 MODEL PICKER SUMMARY\n${'='.repeat(50)}\n\n`;

  result += `📊 SHOTS BY MODEL:\n`;
  for (const [model, count] of Object.entries(output.summary.models_used)) {
    if (count > 0) {
      result += `  - ${model}: ${count} shots\n`;
    }
  }

  result += `\n📈 BREAKDOWN:\n`;
  result += `  - Lip sync shots: ${output.summary.lip_sync_shots}\n`;
  result += `  - B-roll shots: ${output.summary.b_roll_shots}\n`;
  result += `  - Transition shots: ${output.summary.transition_shots}\n`;

  result += `\n💰 COST ESTIMATE: $${output.summary.total_estimated_cost.toFixed(2)}\n`;
  result += `⏱️ TIME ESTIMATE: ${Math.round(output.summary.total_estimated_time_ms / 1000)}s\n`;

  result += `\n📋 PER-SHOT SELECTIONS:\n`;
  for (const sel of output.selections) {
    result += `  Shot ${sel.shot_number}: ${sel.video_model} - ${sel.reasoning}\n`;
  }

  return result;
}
