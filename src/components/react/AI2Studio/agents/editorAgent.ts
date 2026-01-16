/**
 * EDITOR AGENT - Vision-Based Clip Surgeon
 *
 * This agent runs AFTER video generation, BEFORE final assembly.
 * Uses vision AI to analyze frames and find perfect cut points.
 *
 * USE CASES:
 * 1. CUT AT ACTION COMPLETE - Zoom done at 2.3s? Cut there.
 * 2. REMOVE DEAD AIR - Character stopped moving? Trim it.
 * 3. SPEED CONTROL - Slow shot needs x1.5 or x2 speed
 * 4. QUALITY CUT - Model degrades after 3s? Cut before
 * 5. COST EFFICIENCY - One 10s clip → multiple 2-3s clips
 *
 * PHILOSOPHY:
 * - Same as Sora's editing but for ALL models
 * - Vision detects "the moment" - when action peaks/completes
 * - Can be used for quality control OR creative pacing
 * - Outputs FFmpeg trim/speed commands
 */

// ============================================
// TYPES
// ============================================

export type CutReason =
  | 'action_complete'      // The motion/zoom/pan finished
  | 'dead_air'             // Nothing happening, static
  | 'quality_degradation'  // Model artifacts starting
  | 'character_done'       // Character finished action/expression
  | 'pacing'               // Creative choice for rhythm
  | 'loop_point'           // Good loop start/end detected
  | 'transition_ready';    // Natural transition moment

export type SpeedPreset =
  | 'x0.5'   // Slow mo (dramatic)
  | 'x0.75'  // Slightly slow
  | 'x1'     // Normal
  | 'x1.25'  // Slightly fast
  | 'x1.5'   // Fast pacing
  | 'x2'     // Very fast / time lapse feel
  | 'x3';    // Extreme speed up

export interface FrameAnalysis {
  frame_number: number;
  timestamp_ms: number;

  // Motion detection
  motion_level: number;  // 0-100, how much changed from previous
  motion_direction?: 'increasing' | 'stable' | 'decreasing';

  // Quality indicators
  quality_score: number;  // 0-100, visual quality
  artifacts_detected: boolean;
  blur_level: number;  // 0-100

  // Content detection
  has_character: boolean;
  character_action?: string;  // "speaking", "walking", "still", etc.

  // Camera motion
  camera_motion?: 'zoom_in' | 'zoom_out' | 'pan' | 'static' | 'orbit';
  camera_motion_complete: boolean;  // Has the move finished?

  // Composition
  is_well_framed: boolean;
  subject_centered: boolean;
}

export interface CutPoint {
  timestamp_ms: number;
  frame_number: number;
  reason: CutReason;
  confidence: number;  // 0-100
  description: string;

  // What type of cut
  cut_type: 'trim_start' | 'trim_end' | 'split';
}

export interface SpeedSegment {
  start_ms: number;
  end_ms: number;
  speed: SpeedPreset;
  reason: string;
}

export interface ClipAnalysis {
  clip_id: string;
  video_url: string;
  original_duration_ms: number;

  // Frame-by-frame analysis
  frames: FrameAnalysis[];
  analysis_fps: number;  // How many frames we sampled

  // Detected cut points
  cut_points: CutPoint[];

  // Recommended speed changes
  speed_segments: SpeedSegment[];

  // Best segment (if we had to pick one)
  best_segment?: {
    start_ms: number;
    end_ms: number;
    reason: string;
  };

  // Quality summary
  quality_summary: {
    overall_score: number;
    best_quality_range_ms: [number, number];
    quality_drops_at_ms: number[];  // Timestamps where quality degrades
  };

  // Motion summary
  motion_summary: {
    has_camera_motion: boolean;
    motion_complete_at_ms?: number;  // When camera move finishes
    dead_air_ranges_ms: Array<[number, number]>;  // Static/boring sections
  };
}

export interface TrimInstruction {
  clip_id: string;
  original_url: string;

  // Where to cut
  trim_start_ms: number;
  trim_end_ms: number;

  // Speed adjustment
  speed: SpeedPreset;

  // Final duration after trim + speed
  final_duration_ms: number;

  // FFmpeg command (ready to execute)
  ffmpeg_command: string;

  // Why we made these choices
  reasoning: string;
}

export interface EditorInput {
  clip_id: string;
  video_url: string;
  duration_ms: number;

  // What we're looking for
  intent: {
    // Target duration (if we need specific length)
    target_duration_ms?: number;

    // What action to wait for
    wait_for?: 'zoom_complete' | 'character_stops' | 'camera_settles' | 'custom';
    custom_wait_description?: string;

    // Speed preferences
    allow_speed_up?: boolean;
    max_speed?: SpeedPreset;

    // Quality threshold
    min_quality_score?: number;

    // Pacing style
    pacing: 'tight' | 'normal' | 'relaxed';
  };

  // Shot context (helps with decisions)
  shot_context?: {
    shot_type: string;  // "establishing", "closeup", etc.
    is_b_roll: boolean;
    has_dialogue: boolean;
    beat_type?: string;  // "hook", "tension", "release", etc.
  };
}

export interface EditorOutput {
  clip_id: string;
  analysis: ClipAnalysis;
  trim_instruction: TrimInstruction;

  // Alternative cuts (if multiple good options)
  alternatives?: TrimInstruction[];
}

// ============================================
// FRAME EXTRACTION (FFmpeg)
// ============================================

/**
 * Build FFmpeg command to extract frames for analysis
 */
export function buildFrameExtractionCommand(
  videoPath: string,
  outputPattern: string,
  fps: number = 2  // 2 frames per second is usually enough
): string {
  // Extract frames at specified FPS
  return `ffmpeg -i "${videoPath}" -vf "fps=${fps}" -q:v 2 "${outputPattern}"`;
}

/**
 * Build FFmpeg command to extract specific frame at timestamp
 */
export function buildSingleFrameCommand(
  videoPath: string,
  timestampMs: number,
  outputPath: string
): string {
  const seconds = timestampMs / 1000;
  return `ffmpeg -ss ${seconds} -i "${videoPath}" -frames:v 1 -q:v 2 "${outputPath}"`;
}

// ============================================
// VISION ANALYSIS PROMPTS
// ============================================

/**
 * System prompt for Claude vision to analyze video frames
 */
export const FRAME_ANALYSIS_PROMPT = `You are analyzing video frames to find the perfect cut points.

For each frame, analyze:
1. MOTION LEVEL (0-100): How much changed from the previous frame?
2. QUALITY (0-100): Is the image sharp and artifact-free?
3. CAMERA MOTION: Is there zoom/pan/orbit happening? Is it complete?
4. CHARACTER STATE: If there's a character, what are they doing?
5. COMPOSITION: Is the frame well-composed?

Output JSON:
{
  "motion_level": 0-100,
  "quality_score": 0-100,
  "artifacts_detected": boolean,
  "camera_motion": "zoom_in" | "zoom_out" | "pan" | "static" | "orbit" | null,
  "camera_motion_complete": boolean,
  "has_character": boolean,
  "character_action": "speaking" | "walking" | "still" | "gesturing" | null,
  "is_well_framed": boolean,
  "notes": "any observations"
}`;

/**
 * Prompt for finding cut points from frame sequence
 */
export const CUT_POINT_PROMPT = `Analyze this sequence of frames from a video clip.

Find the BEST cut points for:
1. ACTION COMPLETE - When does the camera move/zoom finish?
2. DEAD AIR - Where is nothing happening?
3. QUALITY DROP - Where do artifacts/blur start?
4. PEAK MOMENT - Where is the best single frame?

Consider:
- We want TIGHT pacing (cut as soon as action completes)
- Dead air = bad (static frames with no purpose)
- Quality degradation = cut before it happens
- Character movement should complete naturally

Output JSON array of cut points:
[{
  "timestamp_ms": number,
  "reason": "action_complete" | "dead_air" | "quality_degradation" | "character_done" | "pacing",
  "confidence": 0-100,
  "cut_type": "trim_start" | "trim_end" | "split",
  "description": "why this is a good cut"
}]`;

// ============================================
// FFMPEG TRIM/SPEED COMMANDS
// ============================================

/**
 * Build FFmpeg command for trimming and speed adjustment
 */
export function buildTrimCommand(
  inputPath: string,
  outputPath: string,
  startMs: number,
  endMs: number,
  speed: SpeedPreset = 'x1'
): string {
  const startSec = startMs / 1000;
  const durationSec = (endMs - startMs) / 1000;

  // Speed factor
  const speedFactors: Record<SpeedPreset, number> = {
    'x0.5': 0.5,
    'x0.75': 0.75,
    'x1': 1,
    'x1.25': 1.25,
    'x1.5': 1.5,
    'x2': 2,
    'x3': 3
  };
  const factor = speedFactors[speed];

  if (factor === 1) {
    // No speed change, just trim
    return `ffmpeg -ss ${startSec} -i "${inputPath}" -t ${durationSec} -c copy "${outputPath}"`;
  } else {
    // Trim + speed change (need to re-encode)
    // setpts for video, atempo for audio
    const videoPts = 1 / factor;  // PTS = 0.5 for 2x speed

    // atempo only accepts 0.5-2.0, so chain for x3
    let audioFilter = '';
    if (factor <= 2) {
      audioFilter = `atempo=${factor}`;
    } else {
      // Chain atempo filters for speeds > 2x
      audioFilter = `atempo=2,atempo=${factor / 2}`;
    }

    return `ffmpeg -ss ${startSec} -i "${inputPath}" -t ${durationSec} -filter_complex "[0:v]setpts=${videoPts}*PTS[v];[0:a]${audioFilter}[a]" -map "[v]" -map "[a]" "${outputPath}"`;
  }
}

/**
 * Calculate final duration after trim + speed
 */
export function calculateFinalDuration(
  startMs: number,
  endMs: number,
  speed: SpeedPreset
): number {
  const trimmedDuration = endMs - startMs;
  const speedFactors: Record<SpeedPreset, number> = {
    'x0.5': 0.5,
    'x0.75': 0.75,
    'x1': 1,
    'x1.25': 1.25,
    'x1.5': 1.5,
    'x2': 2,
    'x3': 3
  };
  return Math.round(trimmedDuration / speedFactors[speed]);
}

// ============================================
// EDITOR AGENT
// ============================================

export const editorAgent = {
  role: 'editor',
  name: 'Editor Agent (Clip Surgeon)',
  icon: '✂️',
  color: 'red',

  /**
   * Analyze a video clip and find optimal cut points
   *
   * NOTE: This requires vision AI to analyze frames.
   * In production, you'd:
   * 1. Extract frames with FFmpeg
   * 2. Send to Claude Vision API
   * 3. Aggregate results
   */
  async analyzeClip(
    input: EditorInput,
    visionAnalyzer: (frameUrls: string[]) => Promise<FrameAnalysis[]>
  ): Promise<ClipAnalysis> {
    console.log(`[Editor] ✂️ Analyzing clip ${input.clip_id}...`);

    // This would be called after frame extraction
    // For now, return structure showing what we'd compute

    const frames: FrameAnalysis[] = [];
    const cut_points: CutPoint[] = [];
    const speed_segments: SpeedSegment[] = [];

    // Analyze frames (placeholder - real impl calls vision AI)
    // const frames = await visionAnalyzer(extractedFrameUrls);

    // Find cut points based on analysis
    // ... vision-based detection logic ...

    return {
      clip_id: input.clip_id,
      video_url: input.video_url,
      original_duration_ms: input.duration_ms,
      frames,
      analysis_fps: 2,
      cut_points,
      speed_segments,
      quality_summary: {
        overall_score: 85,
        best_quality_range_ms: [0, input.duration_ms * 0.7],
        quality_drops_at_ms: []
      },
      motion_summary: {
        has_camera_motion: true,
        motion_complete_at_ms: undefined,
        dead_air_ranges_ms: []
      }
    };
  },

  /**
   * Generate trim instruction from analysis
   */
  generateTrimInstruction(
    analysis: ClipAnalysis,
    intent: EditorInput['intent']
  ): TrimInstruction {
    console.log(`[Editor] ✂️ Generating trim for ${analysis.clip_id}...`);

    let trimStart = 0;
    let trimEnd = analysis.original_duration_ms;
    let speed: SpeedPreset = 'x1';
    let reasoning = '';

    // Find best trim points from analysis
    const actionComplete = analysis.cut_points.find(c => c.reason === 'action_complete');
    const qualityDrop = analysis.cut_points.find(c => c.reason === 'quality_degradation');
    const deadAir = analysis.cut_points.find(c => c.reason === 'dead_air');

    // Priority 1: Cut at action complete (for zoom/pan shots)
    if (intent.wait_for && actionComplete) {
      trimEnd = actionComplete.timestamp_ms;
      reasoning = `Cut at ${trimEnd}ms - ${actionComplete.description}`;
    }

    // Priority 2: Cut before quality drops
    if (qualityDrop && qualityDrop.timestamp_ms < trimEnd) {
      trimEnd = qualityDrop.timestamp_ms;
      reasoning = `Cut at ${trimEnd}ms - quality degrades after`;
    }

    // Priority 3: Remove dead air from start
    if (deadAir && deadAir.cut_type === 'trim_start') {
      trimStart = deadAir.timestamp_ms;
      reasoning += ` | Trim ${trimStart}ms dead air from start`;
    }

    // Speed adjustment based on pacing
    if (intent.allow_speed_up && intent.pacing === 'tight') {
      const currentDuration = trimEnd - trimStart;
      const targetDuration = intent.target_duration_ms || currentDuration;

      if (currentDuration > targetDuration * 1.3) {
        speed = 'x1.5';
        reasoning += ' | Speed x1.5 for tight pacing';
      } else if (currentDuration > targetDuration * 1.8) {
        speed = 'x2';
        reasoning += ' | Speed x2 for very tight pacing';
      }
    }

    // Respect max speed
    if (intent.max_speed) {
      const speedOrder: SpeedPreset[] = ['x0.5', 'x0.75', 'x1', 'x1.25', 'x1.5', 'x2', 'x3'];
      const maxIndex = speedOrder.indexOf(intent.max_speed);
      const currentIndex = speedOrder.indexOf(speed);
      if (currentIndex > maxIndex) {
        speed = intent.max_speed;
      }
    }

    const finalDuration = calculateFinalDuration(trimStart, trimEnd, speed);

    return {
      clip_id: analysis.clip_id,
      original_url: analysis.video_url,
      trim_start_ms: trimStart,
      trim_end_ms: trimEnd,
      speed,
      final_duration_ms: finalDuration,
      ffmpeg_command: buildTrimCommand(
        analysis.video_url,  // Would be local path in practice
        `${analysis.clip_id}_trimmed.mp4`,
        trimStart,
        trimEnd,
        speed
      ),
      reasoning: reasoning || 'No cuts needed'
    };
  },

  /**
   * Quick analysis - just find the best end point
   * For when you just want "cut when zoom done"
   */
  findActionCompletePoint(
    frameAnalyses: FrameAnalysis[],
    actionType: 'zoom_complete' | 'character_stops' | 'camera_settles'
  ): number | null {
    for (let i = 1; i < frameAnalyses.length; i++) {
      const prev = frameAnalyses[i - 1];
      const curr = frameAnalyses[i];

      switch (actionType) {
        case 'zoom_complete':
          // Camera was moving, now stopped
          if (prev.camera_motion && !prev.camera_motion_complete && curr.camera_motion_complete) {
            return curr.timestamp_ms;
          }
          break;

        case 'character_stops':
          // Character was moving, now still
          if (prev.character_action && prev.character_action !== 'still' && curr.character_action === 'still') {
            return curr.timestamp_ms;
          }
          break;

        case 'camera_settles':
          // Motion level drops to near zero
          if (prev.motion_level > 20 && curr.motion_level < 10) {
            return curr.timestamp_ms;
          }
          break;
      }
    }

    return null;
  },

  /**
   * Find dead air segments (static frames with no purpose)
   */
  findDeadAirSegments(
    frameAnalyses: FrameAnalysis[],
    minDurationMs: number = 500  // At least 500ms to count as dead air
  ): Array<[number, number]> {
    const deadSegments: Array<[number, number]> = [];
    let segmentStart: number | null = null;

    for (const frame of frameAnalyses) {
      const isDeadAir = frame.motion_level < 5 &&
                        !frame.camera_motion &&
                        frame.character_action === 'still';

      if (isDeadAir && segmentStart === null) {
        segmentStart = frame.timestamp_ms;
      } else if (!isDeadAir && segmentStart !== null) {
        const duration = frame.timestamp_ms - segmentStart;
        if (duration >= minDurationMs) {
          deadSegments.push([segmentStart, frame.timestamp_ms]);
        }
        segmentStart = null;
      }
    }

    return deadSegments;
  },

  /**
   * Recommend speed based on content and target duration
   */
  recommendSpeed(
    currentDurationMs: number,
    targetDurationMs: number,
    hasDialogue: boolean,
    pacing: 'tight' | 'normal' | 'relaxed'
  ): SpeedPreset {
    // Never speed up dialogue
    if (hasDialogue) return 'x1';

    const ratio = currentDurationMs / targetDurationMs;

    if (pacing === 'relaxed') {
      return 'x1';
    }

    if (pacing === 'tight') {
      if (ratio > 2.5) return 'x3';
      if (ratio > 1.8) return 'x2';
      if (ratio > 1.3) return 'x1.5';
      if (ratio > 1.1) return 'x1.25';
    }

    // Normal pacing
    if (ratio > 2) return 'x2';
    if (ratio > 1.5) return 'x1.5';

    return 'x1';
  }
};

// ============================================
// UTILITY: Print analysis summary
// ============================================

export function printAnalysisSummary(analysis: ClipAnalysis): string {
  let output = `\n✂️ CLIP ANALYSIS: ${analysis.clip_id}\n`;
  output += `${'='.repeat(50)}\n\n`;

  output += `📹 Original Duration: ${analysis.original_duration_ms}ms\n`;
  output += `🎯 Quality Score: ${analysis.quality_summary.overall_score}/100\n`;
  output += `🎬 Has Camera Motion: ${analysis.motion_summary.has_camera_motion}\n`;

  if (analysis.motion_summary.motion_complete_at_ms) {
    output += `✅ Motion Complete At: ${analysis.motion_summary.motion_complete_at_ms}ms\n`;
  }

  output += `\n📍 CUT POINTS:\n`;
  for (const cut of analysis.cut_points) {
    output += `  - [${cut.timestamp_ms}ms] ${cut.reason} (${cut.confidence}%): ${cut.description}\n`;
  }

  if (analysis.motion_summary.dead_air_ranges_ms.length > 0) {
    output += `\n💤 DEAD AIR SEGMENTS:\n`;
    for (const [start, end] of analysis.motion_summary.dead_air_ranges_ms) {
      output += `  - ${start}ms - ${end}ms (${end - start}ms)\n`;
    }
  }

  output += `\n⚡ SPEED SEGMENTS:\n`;
  for (const seg of analysis.speed_segments) {
    output += `  - [${seg.start_ms}-${seg.end_ms}ms] ${seg.speed}: ${seg.reason}\n`;
  }

  return output;
}

export function printTrimInstruction(trim: TrimInstruction): string {
  let output = `\n✂️ TRIM INSTRUCTION: ${trim.clip_id}\n`;
  output += `${'='.repeat(50)}\n\n`;

  output += `📥 Original: ${trim.original_url}\n`;
  output += `⏱️ Trim: ${trim.trim_start_ms}ms → ${trim.trim_end_ms}ms\n`;
  output += `⚡ Speed: ${trim.speed}\n`;
  output += `📏 Final Duration: ${trim.final_duration_ms}ms\n`;
  output += `💭 Reasoning: ${trim.reasoning}\n`;
  output += `\n🔧 FFmpeg Command:\n${trim.ffmpeg_command}\n`;

  return output;
}

// ============================================
// JSON EXPORT FORMAT - For External Software
// ============================================
//
// This format is designed for your video editing software
// to consume directly. All data needed for FFmpeg operations.
//

export interface EditTimelineJSON {
  version: '1.0';
  project_id: string;
  created_at: string;

  // Global settings
  settings: {
    output_format: 'mp4' | 'webm' | 'mov';
    output_resolution?: string;
    output_fps?: number;
  };

  // All clips in timeline order
  clips: EditClipJSON[];

  // Final assembly instructions
  assembly: {
    // Total duration after all edits
    final_duration_ms: number;
    // FFmpeg concat command for final assembly
    concat_command: string;
  };
}

export interface EditClipJSON {
  // Identification
  clip_id: string;
  shot_id: string;  // Reference to original shot plan
  sequence_index: number;  // Order in timeline

  // Source
  source: {
    url: string;
    local_path?: string;
    original_duration_ms: number;
  };

  // Trim operations
  trim: {
    start_ms: number;
    end_ms: number;
    // Frame-accurate timestamps (for precise cutting)
    start_frame?: number;
    end_frame?: number;
  };

  // Speed
  speed: {
    factor: number;  // 1.0 = normal, 2.0 = 2x speed, 0.5 = slow mo
    preset: SpeedPreset;
  };

  // Final output
  output: {
    duration_ms: number;  // After trim + speed
    timeline_start_ms: number;  // Position in final video
    timeline_end_ms: number;
  };

  // FFmpeg command for this clip
  ffmpeg: {
    trim_command: string;
    // Optional: filters for effects
    video_filters?: string[];
    audio_filters?: string[];
  };

  // Metadata
  metadata: {
    cut_reason?: CutReason;
    quality_score?: number;
    has_dialogue: boolean;
    is_b_roll: boolean;
  };
}

/**
 * Build complete JSON timeline for external software
 */
export function buildEditTimelineJSON(
  projectId: string,
  trimInstructions: TrimInstruction[],
  shotMetadata: Map<string, { shot_id: string; has_dialogue: boolean; is_b_roll: boolean }>
): EditTimelineJSON {
  const clips: EditClipJSON[] = [];
  let currentTimelinePosition = 0;

  // Speed factor lookup
  const speedFactors: Record<SpeedPreset, number> = {
    'x0.5': 0.5,
    'x0.75': 0.75,
    'x1': 1,
    'x1.25': 1.25,
    'x1.5': 1.5,
    'x2': 2,
    'x3': 3
  };

  for (let i = 0; i < trimInstructions.length; i++) {
    const trim = trimInstructions[i];
    const meta = shotMetadata.get(trim.clip_id) || {
      shot_id: trim.clip_id,
      has_dialogue: false,
      is_b_roll: false
    };

    const clip: EditClipJSON = {
      clip_id: trim.clip_id,
      shot_id: meta.shot_id,
      sequence_index: i,

      source: {
        url: trim.original_url,
        original_duration_ms: trim.trim_end_ms  // Approximate
      },

      trim: {
        start_ms: trim.trim_start_ms,
        end_ms: trim.trim_end_ms
      },

      speed: {
        factor: speedFactors[trim.speed],
        preset: trim.speed
      },

      output: {
        duration_ms: trim.final_duration_ms,
        timeline_start_ms: currentTimelinePosition,
        timeline_end_ms: currentTimelinePosition + trim.final_duration_ms
      },

      ffmpeg: {
        trim_command: trim.ffmpeg_command
      },

      metadata: {
        has_dialogue: meta.has_dialogue,
        is_b_roll: meta.is_b_roll
      }
    };

    clips.push(clip);
    currentTimelinePosition += trim.final_duration_ms;
  }

  // Build concat command
  const inputFiles = clips.map((c, i) => `-i "${c.clip_id}_trimmed.mp4"`).join(' ');
  const filterInputs = clips.map((_, i) => `[${i}:v][${i}:a]`).join('');
  const concatCommand = `ffmpeg ${inputFiles} -filter_complex "${filterInputs}concat=n=${clips.length}:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" output_final.mp4`;

  return {
    version: '1.0',
    project_id: projectId,
    created_at: new Date().toISOString(),

    settings: {
      output_format: 'mp4'
    },

    clips,

    assembly: {
      final_duration_ms: currentTimelinePosition,
      concat_command: concatCommand
    }
  };
}

/**
 * Export timeline as JSON string (for file output)
 */
export function exportTimelineJSON(timeline: EditTimelineJSON): string {
  return JSON.stringify(timeline, null, 2);
}

/**
 * Quick single-clip JSON for simple operations
 */
export function buildSingleClipJSON(trim: TrimInstruction): object {
  const speedFactors: Record<SpeedPreset, number> = {
    'x0.5': 0.5, 'x0.75': 0.75, 'x1': 1, 'x1.25': 1.25,
    'x1.5': 1.5, 'x2': 2, 'x3': 3
  };

  return {
    clip_id: trim.clip_id,
    source_url: trim.original_url,
    trim_start_ms: trim.trim_start_ms,
    trim_end_ms: trim.trim_end_ms,
    speed_factor: speedFactors[trim.speed],
    speed_preset: trim.speed,
    final_duration_ms: trim.final_duration_ms,
    ffmpeg_command: trim.ffmpeg_command,
    reasoning: trim.reasoning
  };
}
