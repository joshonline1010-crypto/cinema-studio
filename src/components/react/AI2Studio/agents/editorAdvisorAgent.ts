/**
 * EDITOR ADVISOR AGENT - Refines Edit Intent Before Production
 *
 * This agent runs AFTER Continuity Validator, BEFORE Producer.
 * It reviews the Director's edit_intent for each shot and refines it
 * using actual editing knowledge.
 *
 * WHY SEPARATE AGENT?
 * - Director thinks about STORY (what emotion, what purpose)
 * - Editor thinks about CRAFT (when to cut, how fast, what rhythm)
 * - Editor knows what actually WORKS in editing
 *
 * This agent brings editing expertise to the planning phase,
 * so the Producer can create a better execution manifest.
 */

import type { ShotPlan, DirectorOutput } from './directorAgent';
import type { ShotCard, ShotCompilerOutput } from './specTypes';
import type { ScriptwriterOutput } from './scriptwriterAgent';

// ============================================
// TYPES
// ============================================

export interface EditDecision {
  shot_number: number;

  // Timing
  target_duration_ms: number;  // Final duration after editing
  trim_start_ms: number;  // How much to trim from start
  trim_end_ms: number;  // How much to trim from end

  // Speed
  speed_multiplier: number;  // 1.0 = normal, 1.5 = faster, 0.75 = slower
  speed_segments?: {
    start_ms: number;
    end_ms: number;
    speed: number;
  }[];

  // Cut triggers
  cut_trigger: string;  // When to cut to next shot
  cut_reasoning: string;  // Why this cut point

  // Rhythm
  beat_alignment: 'on_beat' | 'off_beat' | 'free';
  rhythm_notes: string;

  // Transitions
  transition_in: 'cut' | 'dissolve' | 'fade' | 'wipe';
  transition_out: 'cut' | 'dissolve' | 'fade' | 'wipe';
}

export interface EditorAdvisorInput {
  direction: DirectorOutput;
  shots?: ShotCompilerOutput;
  script?: ScriptwriterOutput;
  targetDuration: number;
}

export interface EditorAdvisorOutput {
  edit_decisions: EditDecision[];
  rhythm_analysis: {
    overall_tempo: 'slow' | 'medium' | 'fast' | 'variable';
    beat_pattern: string;  // e.g., "4-2-2-4-2-4" (shot durations)
    energy_curve: number[];
  };
  total_edited_duration_ms: number;
  summary: {
    shots_trimmed: number;
    shots_sped_up: number;
    shots_slowed_down: number;
    average_shot_duration_ms: number;
    editing_style: string;
  };
}

// ============================================
// EDITING KNOWLEDGE
// ============================================

const SHOT_TYPE_DURATIONS: Record<string, { min: number; ideal: number; max: number }> = {
  // Durations in milliseconds
  'HOOK': { min: 500, ideal: 1500, max: 2500 },
  'IMPACT': { min: 1000, ideal: 1500, max: 2500 },
  'REACTION': { min: 1500, ideal: 2500, max: 4000 },
  'CU': { min: 2000, ideal: 3000, max: 5000 },
  'ECU': { min: 1500, ideal: 2500, max: 4000 },
  'MEDIUM': { min: 2500, ideal: 4000, max: 6000 },
  'WIDE': { min: 3000, ideal: 5000, max: 8000 },
  'ESTABLISHING': { min: 3000, ideal: 4000, max: 6000 },
  'TRACKING': { min: 3000, ideal: 5000, max: 8000 },
  'POV': { min: 2000, ideal: 3000, max: 5000 },
  'OTS': { min: 2000, ideal: 3000, max: 5000 },
  'DEFAULT': { min: 2000, ideal: 4000, max: 6000 }
};

const CUT_TRIGGERS: Record<string, string[]> = {
  'CU': ['blink', 'expression_change', 'look_direction_change', 'dialogue_end'],
  'WIDE': ['movement_complete', 'camera_settles', 'beat_hit', 'entrance_complete'],
  'TRACKING': ['movement_complete', 'destination_reached', 'camera_settles'],
  'REACTION': ['peak_expression', 'look_change', 'gesture_complete'],
  'IMPACT': ['impact_moment', 'debris_settles', 'immediate'],
  'POV': ['scan_complete', 'focus_found', 'movement_stops']
};

// ============================================
// EDITOR ADVISOR AGENT
// ============================================

export const editorAdvisorAgent = {
  role: 'editor_advisor',
  name: 'Editor Advisor Agent',
  icon: '✂️',
  color: 'red',

  /**
   * Review and refine edit intent for all shots
   */
  execute(input: EditorAdvisorInput): EditorAdvisorOutput {
    console.log('[EditorAdvisor] ✂️ Reviewing edit intent...');

    const shots = input.direction.shot_sequence || [];
    const editDecisions: EditDecision[] = [];
    const energyCurve: number[] = [];

    let totalDuration = 0;
    let shotsTrimmed = 0;
    let shotsSped = 0;
    let shotsSlowed = 0;

    // Analyze each shot
    for (const shot of shots) {
      const decision = this.analyzeShot(shot, input);
      editDecisions.push(decision);

      totalDuration += decision.target_duration_ms;
      energyCurve.push(shot.energy_level);

      if (decision.trim_start_ms > 0 || decision.trim_end_ms > 0) shotsTrimmed++;
      if (decision.speed_multiplier > 1.0) shotsSped++;
      if (decision.speed_multiplier < 1.0) shotsSlowed++;
    }

    // Analyze rhythm
    const beatPattern = editDecisions.map(d =>
      Math.round(d.target_duration_ms / 1000)
    ).join('-');

    const avgDuration = totalDuration / editDecisions.length;
    let overallTempo: 'slow' | 'medium' | 'fast' | 'variable';
    if (avgDuration < 2000) overallTempo = 'fast';
    else if (avgDuration < 3500) overallTempo = 'medium';
    else if (avgDuration < 5000) overallTempo = 'slow';
    else overallTempo = 'variable';

    // Determine editing style
    let editingStyle = 'Standard narrative';
    if (shotsSped > shots.length / 2) editingStyle = 'Fast-paced action';
    else if (shotsSlowed > shots.length / 2) editingStyle = 'Contemplative, slow burn';
    else if (shotsTrimmed > shots.length * 0.7) editingStyle = 'Tight, punchy cuts';

    console.log('[EditorAdvisor] ✅ Edit decisions complete');
    console.log(`[EditorAdvisor] Total edited duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`[EditorAdvisor] Style: ${editingStyle}`);

    return {
      edit_decisions: editDecisions,
      rhythm_analysis: {
        overall_tempo: overallTempo,
        beat_pattern: beatPattern,
        energy_curve: energyCurve
      },
      total_edited_duration_ms: totalDuration,
      summary: {
        shots_trimmed: shotsTrimmed,
        shots_sped_up: shotsSped,
        shots_slowed_down: shotsSlowed,
        average_shot_duration_ms: avgDuration,
        editing_style: editingStyle
      }
    };
  },

  /**
   * Analyze a single shot and determine edit decisions
   */
  analyzeShot(shot: ShotPlan, input: EditorAdvisorInput): EditDecision {
    const shotType = this.getShotTypeCategory(shot.shot_type);
    const durations = SHOT_TYPE_DURATIONS[shotType] || SHOT_TYPE_DURATIONS['DEFAULT'];

    // Start with Director's intent if available
    let targetDuration = shot.target_duration_ms || durations.ideal;
    let speedMultiplier = 1.0;

    // Respect Director's edit_intent if provided
    const editIntent = shot.edit_intent;

    // Adjust based on pacing
    if (editIntent?.pacing === 'tight') {
      targetDuration = Math.min(targetDuration, durations.min + 500);
    } else if (editIntent?.pacing === 'relaxed') {
      targetDuration = Math.max(targetDuration, durations.ideal);
    }

    // Handle speed preferences
    if (editIntent?.allow_speed_up) {
      const maxSpeed = parseFloat(editIntent.max_speed?.replace('x', '') || '1.5');
      // If we need the shot shorter than generated, speed it up
      const generatedMs = shot.duration_seconds * 1000;
      if (targetDuration < generatedMs * 0.7) {
        speedMultiplier = Math.min(maxSpeed, generatedMs / targetDuration);
      }
    }

    // Dialogue shots should NOT be sped up
    if (shot.dialogue_info?.has_dialogue && shot.dialogue_info.speech_mode === 'lip_sync') {
      speedMultiplier = 1.0;
      // Duration should match dialogue
      const dialogueLine = input.script?.dialogue_lines?.find(
        l => l.shot_number === shot.shot_number
      );
      if (dialogueLine) {
        targetDuration = Math.max(targetDuration, dialogueLine.duration_hint_seconds * 1000);
      }
    }

    // Calculate trims
    const generatedMs = shot.duration_seconds * 1000;
    const adjustedGenerated = generatedMs / speedMultiplier;
    const trimTotal = Math.max(0, adjustedGenerated - targetDuration);
    const trimStart = Math.round(trimTotal * 0.3);  // 30% from start
    const trimEnd = Math.round(trimTotal * 0.7);    // 70% from end

    // Determine cut trigger
    const cutTriggers = CUT_TRIGGERS[shotType] || CUT_TRIGGERS['DEFAULT'] || ['camera_settles'];
    const cutTrigger = editIntent?.cut_trigger || cutTriggers[0];

    // Determine transitions
    const isFirstShot = shot.shot_number === 1;
    const isLastShot = shot.shot_number === input.direction.shot_sequence?.length;

    return {
      shot_number: shot.shot_number,
      target_duration_ms: targetDuration,
      trim_start_ms: trimStart,
      trim_end_ms: trimEnd,
      speed_multiplier: speedMultiplier,
      cut_trigger: cutTrigger,
      cut_reasoning: this.getCutReasoning(shot, cutTrigger),
      beat_alignment: shot.energy_level >= 4 ? 'on_beat' : 'free',
      rhythm_notes: this.getRhythmNotes(shot),
      transition_in: isFirstShot ? 'fade' : 'cut',
      transition_out: isLastShot ? 'fade' : 'cut'
    };
  },

  /**
   * Get shot type category for duration lookup
   */
  getShotTypeCategory(shotType: string): string {
    const upper = shotType.toUpperCase();

    if (upper.includes('HOOK')) return 'HOOK';
    if (upper.includes('IMPACT')) return 'IMPACT';
    if (upper.includes('REACTION')) return 'REACTION';
    if (upper.includes('ECU') || upper.includes('EXTREME')) return 'ECU';
    if (upper.includes('CU') || upper.includes('CLOSEUP') || upper.includes('CLOSE')) return 'CU';
    if (upper.includes('MEDIUM') || upper.includes('MS')) return 'MEDIUM';
    if (upper.includes('WIDE') || upper.includes('WS')) return 'WIDE';
    if (upper.includes('ESTABLISH')) return 'ESTABLISHING';
    if (upper.includes('TRACK')) return 'TRACKING';
    if (upper.includes('POV')) return 'POV';
    if (upper.includes('OTS')) return 'OTS';

    return 'DEFAULT';
  },

  /**
   * Get reasoning for cut trigger
   */
  getCutReasoning(shot: ShotPlan, trigger: string): string {
    const reasonings: Record<string, string> = {
      'blink': 'Cut on natural blink for seamless transition',
      'expression_change': 'Cut as expression peaks for emotional impact',
      'look_direction_change': 'Cut on eyeline change to motivate next shot',
      'dialogue_end': 'Cut immediately after last word',
      'movement_complete': 'Cut when action finishes for clean exit',
      'camera_settles': 'Cut when camera motion completes',
      'beat_hit': 'Cut on music/rhythm beat for energy',
      'impact_moment': 'Cut on impact for maximum punch',
      'peak_expression': 'Cut at emotional peak',
      'immediate': 'Hard cut for jarring effect'
    };

    return reasonings[trigger] || `Cut on ${trigger}`;
  },

  /**
   * Get rhythm notes for the shot
   */
  getRhythmNotes(shot: ShotPlan): string {
    if (shot.energy_level >= 5) {
      return 'High energy - quick cut, tight framing';
    } else if (shot.energy_level >= 3) {
      return 'Medium energy - standard timing';
    } else {
      return 'Low energy - let it breathe, hold longer';
    }
  }
};

export default editorAdvisorAgent;
