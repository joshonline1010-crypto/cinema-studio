/**
 * SCRIPTWRITER AGENT - Writes Actual Dialogue and Narration
 *
 * This agent runs AFTER Director selects shots, BEFORE Shot Compiler.
 * It takes the Director's dialogue_info and writes the ACTUAL script lines.
 *
 * WHY SEPARATE AGENT?
 * - Story Analyst identifies IF dialogue is needed
 * - Director flags WHICH shots have dialogue
 * - Audio Planner routes to TTS/lip sync
 * - BUT nobody was writing the actual lines!
 *
 * Scriptwriter fixes this gap.
 */

import { callSpecAgent } from './specAICaller';
import type { ShotPlan, DirectorOutput } from './directorAgent';
import type { StoryAnalysisOutput } from './storyAnalystAgent';

// ============================================
// TYPES
// ============================================

export interface DialogueLine {
  shot_number: number;
  character: string;
  speech_mode: 'lip_sync' | 'pov' | 'inner_thoughts' | 'voice_only';
  line: string;  // The actual dialogue
  emotion: string;  // How to deliver it
  duration_hint_seconds: number;  // Estimated speaking time
  notes?: string;  // Delivery notes for TTS
}

export interface VoiceoverSegment {
  segment_id: string;
  timing: 'opening' | 'transition' | 'closing' | 'continuous';
  start_shot: number;
  end_shot: number;
  text: string;
  tone: string;
  duration_hint_seconds: number;
}

export interface CharacterVoice {
  character: string;
  voice_description: string;  // For TTS casting
  personality_notes: string;
  speaking_style: string;
}

export interface ScriptwriterInput {
  concept: string;
  direction: DirectorOutput;
  storyAnalysis: StoryAnalysisOutput;
  targetDuration: number;
}

export interface ScriptwriterOutput {
  dialogue_lines: DialogueLine[];
  voiceover_segments: VoiceoverSegment[];
  character_voices: CharacterVoice[];
  total_speaking_time_seconds: number;
  summary: {
    total_dialogue_lines: number;
    total_voiceover_segments: number;
    characters_with_dialogue: string[];
    shots_with_dialogue: number[];
    needs_lip_sync: boolean;
  };
}

// ============================================
// SYSTEM PROMPT
// ============================================

const SCRIPTWRITER_SYSTEM_PROMPT = `You are the SCRIPTWRITER - you write compelling dialogue and narration.

## YOUR ROLE
Take the Director's shot plan and write the ACTUAL words characters say.
You write dialogue, inner monologue, and voiceover narration.

## DIALOGUE WRITING PRINCIPLES

### Keep It Short
- Video dialogue is SHORT. 2-5 seconds per line max.
- No monologues. Punchy, impactful lines.
- Every word must earn its place.

### Match the Moment
- Read the shot's PURPOSE and EMOTION
- Dialogue should reinforce, not fight, the visual
- "Show don't tell" - visuals do heavy lifting

### Speech Modes
| Mode | What to Write | Example |
|------|---------------|---------|
| lip_sync | Actual spoken words | "We need to move. NOW." |
| pov | What character says (we don't see them) | "I've never seen anything like this..." |
| inner_thoughts | Internal monologue | "This is it. No turning back." |
| voice_only | Narration | "In the summer of 2024..." |

### Duration Hints
Estimate speaking time:
- Short exclamation: 1s ("Go!")
- Quick line: 2s ("We need to move.")
- Full sentence: 3-4s ("I've been waiting for this moment my whole life.")
- Complex line: 5s+ (avoid unless necessary)

## VOICEOVER TYPES

### Opening Narration
Sets the scene, hooks viewer
"In a world where..." or "They said it couldn't be done..."

### Transition Narration
Bridges scenes or time jumps
"Three days later..." or "Meanwhile, across town..."

### Closing Narration
Wraps up, provides resolution
"And that's how..." or "From that day forward..."

### Continuous Narration
Documentary style, runs throughout
(Avoid unless explicitly documentary style)

## CHARACTER VOICE CASTING

For each speaking character, provide:
- Voice description (for TTS)
- Personality notes
- Speaking style

Example:
\`\`\`json
{
  "character": "hero",
  "voice_description": "Male, 30s, deep and confident, slight rasp",
  "personality_notes": "Determined, protective, hiding fear",
  "speaking_style": "Short sentences, commanding, occasional dry humor"
}
\`\`\`

## OUTPUT FORMAT

\`\`\`json
{
  "dialogue_lines": [
    {
      "shot_number": 3,
      "character": "hero",
      "speech_mode": "lip_sync",
      "line": "We need to move. NOW.",
      "emotion": "urgent determination",
      "duration_hint_seconds": 2,
      "notes": "Emphasis on NOW, slightly breathless"
    }
  ],
  "voiceover_segments": [
    {
      "segment_id": "vo_opening",
      "timing": "opening",
      "start_shot": 1,
      "end_shot": 2,
      "text": "They said the building was abandoned. They were wrong.",
      "tone": "ominous, building tension",
      "duration_hint_seconds": 4
    }
  ],
  "character_voices": [
    {
      "character": "hero",
      "voice_description": "Male, 30s, deep and confident",
      "personality_notes": "Brave but human, relatable fear",
      "speaking_style": "Short, punchy, action-oriented"
    }
  ]
}
\`\`\`

## REMEMBER

- Every line should feel NECESSARY
- Match the tone of the story analysis
- Keep it SHORT for video format
- Write for the EAR, not the page`;

// ============================================
// SCRIPTWRITER AGENT
// ============================================

export const scriptwriterAgent = {
  role: 'scriptwriter',
  name: 'Scriptwriter Agent',
  icon: '✍️',
  color: 'orange',
  systemPrompt: SCRIPTWRITER_SYSTEM_PROMPT,

  async execute(input: ScriptwriterInput): Promise<ScriptwriterOutput> {
    console.log('[Scriptwriter] ✍️ Writing script for concept...');

    // Find shots with dialogue
    const dialogueShots = input.direction.shot_sequence.filter(
      s => s.dialogue_info?.has_dialogue
    );

    console.log('[Scriptwriter] Shots with dialogue:', dialogueShots.length);
    console.log('[Scriptwriter] Needs voiceover:', input.storyAnalysis?.audio_narrative_plan?.needs_voiceover);

    // If no dialogue and no voiceover, return empty
    if (dialogueShots.length === 0 && !input.storyAnalysis?.audio_narrative_plan?.needs_voiceover) {
      console.log('[Scriptwriter] No dialogue or voiceover needed');
      return this.createEmptyScript();
    }

    const userPrompt = this.buildPrompt(input, dialogueShots);

    const response = await callSpecAgent({
      systemPrompt: SCRIPTWRITER_SYSTEM_PROMPT,
      userMessage: userPrompt,
      expectJson: true,
      model: 'claude-sonnet'
    });

    if (!response.success) {
      console.error('[Scriptwriter] AI call failed:', response.error);
      return this.createFallbackScript(input, dialogueShots);
    }

    console.log('[Scriptwriter] ✅ Script written');

    try {
      const script = response.data as ScriptwriterOutput;
      return this.validateAndEnhance(script, input);
    } catch (err) {
      console.error('[Scriptwriter] Parse error:', err);
      return this.createFallbackScript(input, dialogueShots);
    }
  },

  buildPrompt(input: ScriptwriterInput, dialogueShots: ShotPlan[]): string {
    const concept = input.concept;
    const storyType = input.storyAnalysis?.concept_analysis?.story_type || 'ACTION';
    const coreEmotion = input.storyAnalysis?.concept_analysis?.core_emotion || 'tension';
    const needsVoiceover = input.storyAnalysis?.audio_narrative_plan?.needs_voiceover || false;

    const dialogueInfo = dialogueShots.map(s => ({
      shot_number: s.shot_number,
      shot_type: s.shot_type,
      purpose: s.purpose,
      character: s.dialogue_info?.character,
      speech_mode: s.dialogue_info?.speech_mode,
      line_summary: s.dialogue_info?.line_summary
    }));

    const characterArcs = input.direction.character_directions || [];

    return `Write the script for this video.

CONCEPT: "${concept}"
STORY TYPE: ${storyType}
CORE EMOTION: ${coreEmotion}
TARGET DURATION: ${input.targetDuration} seconds

CREATIVE BRIEF:
${input.storyAnalysis?.creative_brief?.one_sentence || concept}

KEY MOMENTS:
${input.storyAnalysis?.creative_brief?.key_moments?.map(m => `- ${m.moment}: ${m.visual}`).join('\n') || 'Not specified'}

CHARACTER ARCS:
${characterArcs.map(c => `- ${c.character}: ${c.arc}`).join('\n') || 'Not specified'}

SHOTS WITH DIALOGUE:
${JSON.stringify(dialogueInfo, null, 2)}

${needsVoiceover ? `VOICEOVER NEEDED:
Style: ${input.storyAnalysis?.audio_narrative_plan?.music_style || 'cinematic'}
Consider opening and/or closing narration.` : 'NO VOICEOVER NEEDED'}

Write:
1. Actual dialogue lines for each dialogue shot
2. Voiceover segments if needed
3. Character voice descriptions for TTS casting

Return JSON with dialogue_lines, voiceover_segments, and character_voices.`;
  },

  validateAndEnhance(script: ScriptwriterOutput, input: ScriptwriterInput): ScriptwriterOutput {
    // Calculate totals
    let totalSpeakingTime = 0;
    const shotsWithDialogue: number[] = [];
    const charactersWithDialogue: string[] = [];

    for (const line of script.dialogue_lines || []) {
      totalSpeakingTime += line.duration_hint_seconds || 2;
      if (!shotsWithDialogue.includes(line.shot_number)) {
        shotsWithDialogue.push(line.shot_number);
      }
      if (line.character && !charactersWithDialogue.includes(line.character)) {
        charactersWithDialogue.push(line.character);
      }
    }

    for (const vo of script.voiceover_segments || []) {
      totalSpeakingTime += vo.duration_hint_seconds || 3;
    }

    const needsLipSync = script.dialogue_lines?.some(
      l => l.speech_mode === 'lip_sync'
    ) || false;

    return {
      dialogue_lines: script.dialogue_lines || [],
      voiceover_segments: script.voiceover_segments || [],
      character_voices: script.character_voices || [],
      total_speaking_time_seconds: totalSpeakingTime,
      summary: {
        total_dialogue_lines: script.dialogue_lines?.length || 0,
        total_voiceover_segments: script.voiceover_segments?.length || 0,
        characters_with_dialogue: charactersWithDialogue,
        shots_with_dialogue: shotsWithDialogue,
        needs_lip_sync: needsLipSync
      }
    };
  },

  createEmptyScript(): ScriptwriterOutput {
    return {
      dialogue_lines: [],
      voiceover_segments: [],
      character_voices: [],
      total_speaking_time_seconds: 0,
      summary: {
        total_dialogue_lines: 0,
        total_voiceover_segments: 0,
        characters_with_dialogue: [],
        shots_with_dialogue: [],
        needs_lip_sync: false
      }
    };
  },

  createFallbackScript(input: ScriptwriterInput, dialogueShots: ShotPlan[]): ScriptwriterOutput {
    console.log('[Scriptwriter] Using fallback script...');

    const dialogueLines: DialogueLine[] = dialogueShots.map(shot => ({
      shot_number: shot.shot_number,
      character: shot.dialogue_info?.character || 'hero',
      speech_mode: shot.dialogue_info?.speech_mode || 'lip_sync',
      line: shot.dialogue_info?.line_summary || 'Action speaks louder than words.',
      emotion: 'determined',
      duration_hint_seconds: 2,
      notes: 'Deliver with conviction'
    }));

    const voiceoverSegments: VoiceoverSegment[] = [];
    if (input.storyAnalysis?.audio_narrative_plan?.needs_voiceover) {
      voiceoverSegments.push({
        segment_id: 'vo_opening',
        timing: 'opening',
        start_shot: 1,
        end_shot: 1,
        text: `${input.concept.substring(0, 50)}...`,
        tone: 'cinematic',
        duration_hint_seconds: 3
      });
    }

    const characterVoices: CharacterVoice[] = [{
      character: 'hero',
      voice_description: 'Confident, determined, relatable',
      personality_notes: 'Brave but human',
      speaking_style: 'Short and impactful'
    }];

    return this.validateAndEnhance({
      dialogue_lines: dialogueLines,
      voiceover_segments: voiceoverSegments,
      character_voices: characterVoices,
      total_speaking_time_seconds: 0,
      summary: {
        total_dialogue_lines: 0,
        total_voiceover_segments: 0,
        characters_with_dialogue: [],
        shots_with_dialogue: [],
        needs_lip_sync: false
      }
    }, input);
  }
};

export default scriptwriterAgent;
