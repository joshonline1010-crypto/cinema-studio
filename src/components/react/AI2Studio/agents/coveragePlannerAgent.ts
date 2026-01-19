/**
 * COVERAGE PLANNER AGENT - Plans All Camera Angles Per Beat
 *
 * This agent runs AFTER Beat Planner, BEFORE Director.
 * For each story beat, it plans ALL possible camera angles (coverage).
 *
 * Real filmmaking shoots COVERAGE - multiple angles for each moment.
 * The Director then SELECTS which angles to use in the final edit.
 *
 * WHY SEPARATE AGENT?
 * - Beat Planner thinks about STORY (what happens)
 * - Coverage Planner thinks about CAMERA (how to capture it)
 * - Director thinks about SELECTION (which angles to use)
 */

import { callSpecAgent } from './specAICaller';
import type { BeatDefinition } from './specTypes';
import type { StoryAnalysisOutput } from './storyAnalystAgent';
import { MODEL_COSTS, type VideoModel } from './modelPickerAgent';

// ============================================
// TYPES
// ============================================

export interface CoverageAngle {
  angle_id: string;  // A, B, C, D...
  shot_type: string;  // WIDE_EXT, CU_FACE, POV, OTS_A, etc.
  camera_rig: string;  // WIDE_MASTER, TRIPOD_CU, DOLLY_SIDE, etc.
  lens_mm: number;
  purpose: string;  // Why this angle exists
  subject: string;  // What's in frame (hero, villain, environment, both)
  camera_movement: 'static' | 'push_in' | 'pull_back' | 'orbit' | 'tracking' | 'handheld' | 'crane';

  // Model routing (Coverage Planner recommends, Director confirms)
  recommended_model: VideoModel;
  model_reasoning: string;

  // Flags
  is_primary: boolean;  // Main angle for this beat
  is_dialogue_ready: boolean;  // Can handle lip sync if needed
  sora_candidate: boolean;  // Good for Sora 2 (no precise character control needed)

  // Ref requirements
  ref_needs: ('CHARACTER_MASTER' | 'ENVIRONMENT_MASTER' | 'PROP_MASTER' | 'PREVIOUS_FRAME')[];

  // Estimated duration if used
  suggested_duration_seconds: number;

  // For chaining
  chains_from_previous: boolean;
}

export interface BeatCoverage {
  beat_id: string;
  beat_description: string;
  emotion: string;
  energy_level: number;
  duration_seconds: number;

  // All possible angles for this beat
  coverage_options: CoverageAngle[];

  // Recommendations
  recommended_primary: string;  // angle_id
  recommended_sequence: string[];  // angle_ids in order
  alternate_sequence: string[];  // full coverage option
  min_coverage: string[];  // budget option (fewest shots)

  // Dialogue in this beat?
  has_dialogue: boolean;
  dialogue_angles: string[];  // Which angles can handle dialogue
}

export interface CoveragePlannerInput {
  beats: BeatDefinition[];
  storyAnalysis: StoryAnalysisOutput;
  targetDuration: number;
  budget?: {
    preferMinimalCoverage?: boolean;
    maxShotsPerBeat?: number;
  };
}

export interface CoveragePlannerOutput {
  beat_coverages: BeatCoverage[];
  total_angles_planned: number;
  recommended_total_shots: number;
  minimal_total_shots: number;
  model_distribution: Record<VideoModel, number>;
  estimated_cost: {
    recommended: number;
    minimal: number;
    full_coverage: number;
  };
}

// ============================================
// SYSTEM PROMPT
// ============================================

const COVERAGE_PLANNER_SYSTEM_PROMPT = `You are the COVERAGE PLANNER - you think like a Director of Photography.

## YOUR ROLE
For each story beat, you plan ALL the camera angles that COULD be shot.
This is called COVERAGE in filmmaking - you shoot multiple angles so the editor has options.

You are NOT selecting which angles to USE (Director does that).
You are planning what angles are AVAILABLE.

## COVERAGE PRINCIPLES

### Every Beat Needs:
1. **ESTABLISHING** - Show where we are, who's there
2. **ACTION** - The main thing happening
3. **REACTION** - Response to the action
4. **DETAIL** - Close-up of important element

### Coverage by Beat Type:

**ACTION BEAT:**
- WIDE_MASTER: Full scene, all combatants
- TRACKING: Follow movement
- LOW_ANGLE_HERO: Power shot
- HIGH_ANGLE: Vulnerability/overview
- CU_IMPACT: The hit/explosion/effect
- REACTION: Character response

**DIALOGUE BEAT:**
- WIDE_TWO_SHOT: Both characters
- OTS_A: Over A's shoulder, see B
- OTS_B: Over B's shoulder, see A
- CU_A: Character A's face
- CU_B: Character B's face
- REACTION_INSERT: Micro-expression

**EMOTIONAL BEAT:**
- WIDE: Character in environment (isolation)
- MEDIUM: Body language visible
- CU: Face, emotion building
- ECU: Eyes, tears, detail
- POV: What character sees

**TRANSITION/ATMOSPHERE:**
- WIDE_EXT: Location establishing
- AERIAL: Bird's eye view
- DETAIL: Environmental detail
- TIME_LAPSE: Time passage

## MODEL ROUTING

Recommend the right model for each angle:

| Angle Type | Best Model | Why |
|------------|------------|-----|
| Dialogue CU with lip sync | veed-fabric | Lip sync capability |
| Static talking head | veed-fabric | Avatar mode |
| Close-up/detail shot | sora-2 | Excellent quality on CU |
| Action/movement | kling-2.6 | General motion |
| Start→End transition | kling-o1 | Controlled endpoints |
| POV/atmosphere (no character) | sora-2 | Multi-shot, no precise control needed |
| B-roll/establishing | kling-2.6 | Wide shots need Kling |

## SORA 2 CANDIDATES

Mark as sora_candidate: true if:
- No character face needs precise control
- Pure environment/atmosphere
- Vehicle/object motion
- Establishing shots without dialogue
- POV shots

Mark as sora_candidate: false if:
- Character face visible and important
- Dialogue or lip sync needed
- Story-critical character action
- Needs precise continuity with other shots

## OUTPUT FORMAT

For each beat, output:
\`\`\`json
{
  "beat_id": "beat_01",
  "beat_description": "Hero enters burning building",
  "emotion": "determination mixed with fear",
  "energy_level": 3,
  "duration_seconds": 5,

  "coverage_options": [
    {
      "angle_id": "A",
      "shot_type": "WIDE_EXT",
      "camera_rig": "WIDE_MASTER",
      "lens_mm": 24,
      "purpose": "Establish scale - tiny human vs massive fire",
      "subject": "hero + building",
      "camera_movement": "static",
      "recommended_model": "kling-2.6",
      "model_reasoning": "Environmental establishing shot",
      "is_primary": true,
      "is_dialogue_ready": false,
      "sora_candidate": true,
      "ref_needs": ["ENVIRONMENT_MASTER", "CHARACTER_MASTER"],
      "suggested_duration_seconds": 3,
      "chains_from_previous": false
    }
  ],

  "recommended_primary": "A",
  "recommended_sequence": ["A", "C"],
  "alternate_sequence": ["A", "B", "C", "D"],
  "min_coverage": ["A"],

  "has_dialogue": false,
  "dialogue_angles": []
}
\`\`\`

## REMEMBER

You are planning OPTIONS, not making final decisions.
Give the Director good choices by covering all the angles that could work.
Think about continuity - which angles chain well together?`;

// ============================================
// COVERAGE PLANNER AGENT
// ============================================

export const coveragePlannerAgent = {
  role: 'coverage_planner',
  name: 'Coverage Planner Agent',
  icon: '📷',
  color: 'blue',
  systemPrompt: COVERAGE_PLANNER_SYSTEM_PROMPT,

  async execute(input: CoveragePlannerInput): Promise<CoveragePlannerOutput> {
    console.log('[CoveragePlanner] 📷 Planning coverage for', input.beats.length, 'beats...');

    const userPrompt = this.buildPrompt(input);

    const response = await callSpecAgent({
      systemPrompt: COVERAGE_PLANNER_SYSTEM_PROMPT,
      userMessage: userPrompt,
      expectJson: true,
      model: 'claude-sonnet'
    });

    if (!response.success) {
      console.error('[CoveragePlanner] AI call failed:', response.error);
      return this.createFallbackCoverage(input);
    }

    console.log('[CoveragePlanner] ✅ Coverage plan received');

    try {
      const rawData = response.data as { beat_coverages?: BeatCoverage[] };
      const beatCoverages = rawData.beat_coverages || this.createFallbackCoverage(input).beat_coverages;

      // Calculate stats
      const stats = this.calculateStats(beatCoverages);

      console.log('[CoveragePlanner] Total angles planned:', stats.totalAngles);
      console.log('[CoveragePlanner] Recommended shots:', stats.recommendedShots);
      console.log('[CoveragePlanner] Model distribution:', stats.modelDistribution);

      return {
        beat_coverages: beatCoverages,
        total_angles_planned: stats.totalAngles,
        recommended_total_shots: stats.recommendedShots,
        minimal_total_shots: stats.minimalShots,
        model_distribution: stats.modelDistribution,
        estimated_cost: stats.estimatedCost
      };
    } catch (err) {
      console.error('[CoveragePlanner] Parse error:', err);
      return this.createFallbackCoverage(input);
    }
  },

  buildPrompt(input: CoveragePlannerInput): string {
    const beatsJson = JSON.stringify(input.beats, null, 2);
    const storyType = input.storyAnalysis?.concept_analysis?.story_type || 'ACTION';
    const directorStyle = input.storyAnalysis?.director_recommendation?.director || 'Spielberg';

    return `Plan camera coverage for these story beats.

STORY TYPE: ${storyType}
DIRECTOR STYLE: ${directorStyle}
TARGET DURATION: ${input.targetDuration} seconds
${input.budget?.preferMinimalCoverage ? 'BUDGET MODE: Prefer minimal coverage' : ''}
${input.budget?.maxShotsPerBeat ? `MAX SHOTS PER BEAT: ${input.budget.maxShotsPerBeat}` : ''}

STORY ANALYSIS:
- Core emotion: ${input.storyAnalysis?.concept_analysis?.core_emotion || 'engagement'}
- Visual style: ${input.storyAnalysis?.visual_language?.camera_style?.choice || 'cinematic'}
- Pacing: ${input.storyAnalysis?.visual_language?.pacing?.style || 'variable'}

DIALOGUE NEEDS:
- Needs dialogue: ${input.storyAnalysis?.audio_narrative_plan?.needs_dialogue ? 'YES' : 'NO'}
- Needs voiceover: ${input.storyAnalysis?.audio_narrative_plan?.needs_voiceover ? 'YES' : 'NO'}

BEATS TO COVER:
${beatsJson}

For each beat, plan all possible camera angles (coverage).
Consider what the Director will need to cut together a compelling sequence.

Return JSON with beat_coverages array.`;
  },

  calculateStats(beatCoverages: BeatCoverage[]): {
    totalAngles: number;
    recommendedShots: number;
    minimalShots: number;
    modelDistribution: Record<VideoModel, number>;
    estimatedCost: { recommended: number; minimal: number; full_coverage: number };
  } {
    let totalAngles = 0;
    let recommendedShots = 0;
    let minimalShots = 0;
    const modelDistribution: Record<VideoModel, number> = {
      'kling-2.6': 0,
      'kling-o1': 0,
      'sora-2': 0,
      'veed-fabric': 0
    };

    let recommendedCost = 0;
    let minimalCost = 0;
    let fullCost = 0;

    for (const beat of beatCoverages) {
      totalAngles += beat.coverage_options.length;
      recommendedShots += beat.recommended_sequence.length;
      minimalShots += beat.min_coverage.length;

      for (const angle of beat.coverage_options) {
        const model = angle.recommended_model;
        if (model && MODEL_COSTS[model]) {
          fullCost += MODEL_COSTS[model].costPerShot;

          if (beat.recommended_sequence.includes(angle.angle_id)) {
            modelDistribution[model]++;
            recommendedCost += MODEL_COSTS[model].costPerShot;
          }

          if (beat.min_coverage.includes(angle.angle_id)) {
            minimalCost += MODEL_COSTS[model].costPerShot;
          }
        }
      }
    }

    return {
      totalAngles,
      recommendedShots,
      minimalShots,
      modelDistribution,
      estimatedCost: {
        recommended: recommendedCost,
        minimal: minimalCost,
        full_coverage: fullCost
      }
    };
  },

  createFallbackCoverage(input: CoveragePlannerInput): CoveragePlannerOutput {
    console.log('[CoveragePlanner] Using fallback coverage...');

    const beatCoverages: BeatCoverage[] = input.beats.map((beat, i) => {
      const isFirst = i === 0;
      const isLast = i === input.beats.length - 1;
      const isDialogue = input.storyAnalysis?.audio_narrative_plan?.needs_dialogue || false;

      const coverage: CoverageAngle[] = [
        // A: Wide establishing
        {
          angle_id: 'A',
          shot_type: isFirst ? 'WIDE_ESTABLISHING' : 'WIDE_MASTER',
          camera_rig: 'WIDE_MASTER',
          lens_mm: 24,
          purpose: isFirst ? 'Establish scene and characters' : 'Show full action',
          subject: 'all',
          camera_movement: 'static',
          recommended_model: 'kling-2.6',
          model_reasoning: 'Wide environmental shot',
          is_primary: true,
          is_dialogue_ready: false,
          sora_candidate: !isFirst, // First shot needs character consistency
          ref_needs: ['ENVIRONMENT_MASTER', 'CHARACTER_MASTER'],
          suggested_duration_seconds: isFirst ? 4 : 3,
          chains_from_previous: !isFirst
        },
        // B: Medium shot
        {
          angle_id: 'B',
          shot_type: 'MEDIUM_SHOT',
          camera_rig: 'DOLLY_SIDE',
          lens_mm: 35,
          purpose: 'Show body language and action',
          subject: 'hero',
          camera_movement: 'tracking',
          recommended_model: 'kling-2.6',
          model_reasoning: 'Movement shot',
          is_primary: false,
          is_dialogue_ready: true,
          sora_candidate: false,
          ref_needs: ['PREVIOUS_FRAME', 'CHARACTER_MASTER'],
          suggested_duration_seconds: 3,
          chains_from_previous: true
        },
        // C: Close-up
        {
          angle_id: 'C',
          shot_type: 'CU_FACE',
          camera_rig: 'TRIPOD_CU',
          lens_mm: 85,
          purpose: 'Emotional anchor - show face',
          subject: 'hero face',
          camera_movement: 'static',
          recommended_model: isDialogue ? 'veed-fabric' : 'kling-2.6',
          model_reasoning: isDialogue ? 'Dialogue shot needs VEED lip sync' : 'Reaction shot',
          is_primary: false,
          is_dialogue_ready: true,
          sora_candidate: false,
          ref_needs: ['PREVIOUS_FRAME', 'CHARACTER_MASTER'],
          suggested_duration_seconds: 2,
          chains_from_previous: true
        },
        // D: POV or detail
        {
          angle_id: 'D',
          shot_type: 'POV',
          camera_rig: 'HANDHELD',
          lens_mm: 24,
          purpose: 'What character sees',
          subject: 'environment only',
          camera_movement: 'handheld',
          recommended_model: 'sora-2',
          model_reasoning: 'No character, pure atmosphere',
          is_primary: false,
          is_dialogue_ready: false,
          sora_candidate: true,
          ref_needs: ['ENVIRONMENT_MASTER'],
          suggested_duration_seconds: 2,
          chains_from_previous: false
        }
      ];

      return {
        beat_id: beat.beat_id || `beat_${String(i + 1).padStart(2, '0')}`,
        beat_description: `Beat ${i + 1}`,
        emotion: 'engagement',
        energy_level: beat.energy_level || 3,
        duration_seconds: beat.timecode_range_seconds
          ? (beat.timecode_range_seconds.end - beat.timecode_range_seconds.start)
          : 5,
        coverage_options: coverage,
        recommended_primary: 'A',
        recommended_sequence: isLast ? ['A', 'C'] : ['A', 'B'],
        alternate_sequence: ['A', 'B', 'C', 'D'],
        min_coverage: ['A'],
        has_dialogue: isDialogue,
        dialogue_angles: isDialogue ? ['C'] : []
      };
    });

    const stats = this.calculateStats(beatCoverages);

    return {
      beat_coverages: beatCoverages,
      total_angles_planned: stats.totalAngles,
      recommended_total_shots: stats.recommendedShots,
      minimal_total_shots: stats.minimalShots,
      model_distribution: stats.modelDistribution,
      estimated_cost: stats.estimatedCost
    };
  }
};

export default coveragePlannerAgent;
