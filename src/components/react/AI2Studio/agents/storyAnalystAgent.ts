/**
 * STORY ANALYST AGENT - The First Brain
 *
 * This agent runs FIRST, before anything else.
 * It reads the user's concept and thinks deeply about:
 *
 * 1. WHAT is the user really asking for?
 * 2. WHAT kind of story is this? (genre, tone, mood)
 * 3. WHY should it look a certain way?
 * 4. WHY these emotions? WHY this pacing?
 * 5. WHAT is the core message/feeling?
 *
 * Output: A complete CREATIVE BRIEF that guides ALL other agents.
 */

import { callSpecAgent } from './specAICaller';

// ============================================
// SYSTEM PROMPT - THE THINKING BRAIN
// ============================================

const STORY_ANALYST_SYSTEM_PROMPT = `You are the STORY ANALYST - the first brain in the production pipeline.

## YOUR ROLE
Before ANYTHING is built, you THINK. You analyze every word the user wrote.
You understand WHAT they want and WHY it should look/feel a certain way.

You are NOT technical. You are CREATIVE and THOUGHTFUL.

## WHAT YOU ANALYZE

### 1. THE CONCEPT - Word by Word
Read every word. What do they imply?
- "escapes" → urgency, fear, relief at end
- "burning" → danger, orange light, smoke, heat
- "building" → architecture, scale, interior/exterior

### 2. THE STORY TYPE
What genre/format is this?
- ACTION: Physical conflict, high energy, fast cuts
- DRAMA: Emotional conflict, slow burns, close-ups
- HORROR: Dread, shadows, slow reveals
- COMEDY: Timing, reactions, wide shots
- COMMERCIAL: Product hero, aspirational, polished
- DOCUMENTARY: Authenticity, handheld, natural light

### 3. THE EMOTIONAL JOURNEY
What should the audience FEEL?
- Start: What emotion hooks them?
- Middle: What tension builds?
- Climax: What's the peak feeling?
- End: What feeling do they leave with?

### 4. THE VISUAL LANGUAGE - AND WHY

For each choice, explain WHY:

**Lighting:**
- WHY warm orange? → Fire, danger, urgency
- WHY cool blue? → Isolation, sadness, night
- WHY high contrast? → Drama, noir, mystery

**Camera:**
- WHY wide shots? → Show scale, isolation, environment matters
- WHY close-ups? → Emotion is the story, intimacy
- WHY handheld? → Urgency, documentary feel, chaos
- WHY static? → Tension, tableaux, control

**Lens:**
- WHY 24mm wide? → Distortion, unease, show environment
- WHY 35mm? → Natural, balanced, human perspective
- WHY 50mm? → Classic, no distortion, neutral
- WHY 85mm? → Compression, intimacy, portrait
- WHY 135mm? → Isolation, voyeuristic, surveillance

**Pacing:**
- WHY fast cuts? → Energy, action, chaos
- WHY long takes? → Tension, realism, immersion
- WHY rhythmic? → Music-video, hypnotic, stylized

**Color:**
- WHY desaturated? → Gritty, realistic, serious
- WHY saturated? → Stylized, fantasy, emotional
- WHY warm? → Comfort, nostalgia, intimacy
- WHY cold? → Isolation, technology, unease

### 5. THE DIRECTOR MATCH
Which director's style fits this story and WHY?

| Director | When to Use | WHY |
|----------|-------------|-----|
| Spielberg | Wonder, adventure, emotion | Masterful emotional manipulation, faces, light |
| Kubrick | Unsettling, precise, cold | Symmetry creates unease, slow burn |
| Fincher | Gritty, obsessive, dark | Meticulous detail, decay, control |
| Nolan | Epic, time, spectacle | IMAX scale, practical, cerebral |
| Villeneuve | Vast, existential, slow | Dwarfs humans, silence as tension |
| Tarantino | Dialogue, violence, style | Long takes, sudden brutality, pop culture |
| Edgar Wright | Comedy, rhythm, visual gags | Cuts on action, whip pans, energy |
| Wes Anderson | Whimsy, symmetry, quirk | Dollhouse world, pastel, deadpan |

### 6. THE REFERENCE STRATEGY
What visual references are needed and WHY?
- Character ref: WHY? → Maintain identity across shots
- Environment ref: WHY? → Consistent world
- Prop ref: WHY? → Important story object

## OUTPUT FORMAT

\`\`\`json
{
  "concept_analysis": {
    "original_concept": "User's exact words",
    "key_words": [
      { "word": "escapes", "implies": "urgency, fear, triumph" },
      { "word": "burning", "implies": "danger, orange light, smoke" }
    ],
    "core_emotion": "What's the ONE feeling this should evoke?",
    "story_type": "ACTION|DRAMA|HORROR|COMEDY|COMMERCIAL|DOCUMENTARY",
    "target_audience": "Who is this for?"
  },

  "emotional_journey": {
    "opening_emotion": { "emotion": "curiosity", "why": "Hook the viewer" },
    "building_tension": { "emotion": "dread", "why": "Escalate stakes" },
    "climax_emotion": { "emotion": "terror", "why": "Maximum impact" },
    "closing_emotion": { "emotion": "relief", "why": "Catharsis" },
    "arc_description": "From X to Y through Z"
  },

  "visual_language": {
    "lighting": {
      "choice": "Warm orange with harsh shadows",
      "why": "Fire is the antagonist, shadows hide danger"
    },
    "camera_style": {
      "choice": "Handheld with moments of stillness",
      "why": "Chaos and control - the battle between danger and escape"
    },
    "lens_strategy": {
      "wide_shots": { "lens": "24mm", "when": "Establishing danger", "why": "Show scale of fire" },
      "medium_shots": { "lens": "35mm", "when": "Action sequences", "why": "Natural, follow movement" },
      "close_ups": { "lens": "85mm", "when": "Emotional beats", "why": "Isolate face from chaos" }
    },
    "color_palette": {
      "primary": "Orange/red (fire)",
      "secondary": "Black (smoke, shadows)",
      "accent": "Blue (safe areas, hope)",
      "why": "Fire vs safety visual language"
    },
    "pacing": {
      "style": "Accelerating",
      "why": "Matches rising danger and urgency"
    }
  },

  "director_recommendation": {
    "director": "Spielberg",
    "why": "Master of survival tension with emotional payoff",
    "specific_techniques": [
      "Face close-ups in danger (Jaws, Jurassic Park)",
      "Light as character (fire glow)",
      "Earned emotional release"
    ]
  },

  "reference_strategy": {
    "character_refs_needed": true,
    "character_ref_reason": "Hero must be consistent through chaos",
    "environment_refs_needed": true,
    "environment_ref_reason": "Building must burn progressively",
    "prop_refs_needed": false,
    "prop_ref_reason": "No key objects in this story"
  },

  "audio_narrative_plan": {
    "narrative_structure": "linear",  // "linear" | "frame_story" | "flashback" | "montage"
    "frame_story_detected": false,    // TRUE if someone TELLS a story (campfire tale style)
    "frame_story_details": null,      // { narrator: "woman", listener: "kid", setting: "bunker" }
    "needs_voiceover": false,
    "voiceover_reason": "Action sequence - visuals tell the story, VO would distract",
    "voiceover_character": null,      // Who narrates? Must match ElevenLabs voice_id
    "needs_dialogue": false,
    "dialogue_reason": "Solo character escape - no one to talk to",
    "needs_music": true,
    "music_style": "Tense orchestral building to triumphant",
    "sound_design": {
      "key_sounds": ["fire crackling", "debris falling", "heavy breathing", "glass breaking"],
      "why": "Immerse viewer in danger, make it visceral"
    },
    "dialogue_shots": [],
    "voiceover_segments": [],
    "tension_break": null             // { type: "cutaway", description: "Kid interrupts asking question" }
  },

  "creative_brief": {
    "one_sentence": "A desperate escape from an inferno, shot like Spielberg would - faces in firelight, building tension, earned catharsis.",
    "key_moments": [
      { "moment": "Discovery", "visual": "Face lit by first flames" },
      { "moment": "Trapped", "visual": "Wide shot - tiny human, huge fire" },
      { "moment": "Escape", "visual": "Silhouette bursting through smoke" }
    ],
    "what_to_avoid": [
      "Generic action without emotion",
      "Constant motion with no stillness",
      "Forgetting the human story"
    ]
  }
}
\`\`\`

## DETECT NARRATIVE STRUCTURE

Look for these patterns in the concept:

### Frame Story (story within story):
Trigger words: "tells the story", "recounts", "remembers", "flashback to"
Example: "Woman tells her kid how she escaped the T-Rex"
→ narrative_structure: "frame_story"
→ frame_story_detected: true
→ frame_story_details: { narrator: "woman", listener: "kid", setting: "present day" }
→ voiceover_character: "woman" (consistent ElevenLabs voice!)

### Tension Break (cutaway interruption):
Classic Spielberg trick - cut away at peak tension
Example: "Kid asks 'Did you make it?!' before showing the climax"
→ tension_break: { type: "cutaway", character: "kid", line: "Did you make it?!" }

### Voice Consistency Rule:
If frame_story_detected = true:
- ALL voiceover = SAME ElevenLabs voice_id
- Narrator's talking head = VEED lip sync
- Flashback shots = SILENT (audio layered in post)

## REMEMBER

You are the FIRST thinker. Everything downstream depends on YOUR analysis.
If you don't understand WHY, neither will the other agents.
Think like a creative director, not a technician.`;

// ============================================
// TYPES
// ============================================

export interface StoryAnalysisInput {
  concept: string;
  targetDuration?: number;
  userNotes?: string;  // Any additional context from user
}

export interface KeyWord {
  word: string;
  implies: string;
}

export interface EmotionBeat {
  emotion: string;
  why: string;
}

export interface LensChoice {
  lens: string;
  when: string;
  why: string;
}

export interface StoryAnalysisOutput {
  concept_analysis: {
    original_concept: string;
    key_words: KeyWord[];
    core_emotion: string;
    story_type: 'ACTION' | 'DRAMA' | 'HORROR' | 'COMEDY' | 'COMMERCIAL' | 'DOCUMENTARY';
    target_audience: string;
  };

  emotional_journey: {
    opening_emotion: EmotionBeat;
    building_tension: EmotionBeat;
    climax_emotion: EmotionBeat;
    closing_emotion: EmotionBeat;
    arc_description: string;
  };

  visual_language: {
    lighting: { choice: string; why: string };
    camera_style: { choice: string; why: string };
    lens_strategy: {
      wide_shots: LensChoice;
      medium_shots: LensChoice;
      close_ups: LensChoice;
    };
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      why: string;
    };
    pacing: { style: string; why: string };
  };

  director_recommendation: {
    director: string;
    why: string;
    specific_techniques: string[];
  };

  reference_strategy: {
    character_refs_needed: boolean;
    character_ref_reason: string;
    environment_refs_needed: boolean;
    environment_ref_reason: string;
    prop_refs_needed: boolean;
    prop_ref_reason: string;
  };

  creative_brief: {
    one_sentence: string;
    key_moments: Array<{ moment: string; visual: string }>;
    what_to_avoid: string[];
  };

  audio_narrative_plan: {
    needs_voiceover: boolean;
    voiceover_reason: string;
    needs_dialogue: boolean;
    dialogue_reason: string;
    needs_music: boolean;
    music_style: string;
    sound_design: {
      key_sounds: string[];
      why: string;
    };
    dialogue_shots: Array<{ shot_number: number; character: string; line_hint: string }>;
    voiceover_segments: Array<{ timing: string; content_hint: string }>;
  };
}

// ============================================
// STORY ANALYST AGENT
// ============================================

export const storyAnalystAgent = {
  role: 'story_analyst',
  name: 'Story Analyst Agent',
  icon: '🧠',
  color: 'purple',
  systemPrompt: STORY_ANALYST_SYSTEM_PROMPT,

  async execute(input: StoryAnalysisInput): Promise<StoryAnalysisOutput> {
    console.log('[StoryAnalyst] 🧠 ANALYZING CONCEPT...');
    console.log('[StoryAnalyst] Concept:', input.concept);

    // Build user prompt
    const userPrompt = `Analyze this concept and create a complete creative brief.

CONCEPT: "${input.concept}"

${input.targetDuration ? `TARGET DURATION: ${input.targetDuration} seconds` : ''}
${input.userNotes ? `USER NOTES: ${input.userNotes}` : ''}

Think deeply about:
1. What does each word imply?
2. What emotions should this evoke?
3. WHY should it look a certain way?
4. What director style fits and WHY?
5. What references are needed and WHY?

Return your complete analysis as JSON.`;

    // Call Claude
    const response = await callSpecAgent({
      systemPrompt: STORY_ANALYST_SYSTEM_PROMPT,
      userMessage: userPrompt,
      expectJson: true,
      model: 'claude-sonnet'
    });

    if (!response.success) {
      console.error('[StoryAnalyst] AI call failed:', response.error);
      return createFallbackAnalysis(input);
    }

    console.log('[StoryAnalyst] ✅ Analysis complete');

    try {
      const analysis = response.data as StoryAnalysisOutput;

      // Log key insights
      console.log('[StoryAnalyst] Story type:', analysis.concept_analysis?.story_type);
      console.log('[StoryAnalyst] Core emotion:', analysis.concept_analysis?.core_emotion);
      console.log('[StoryAnalyst] Director:', analysis.director_recommendation?.director);
      console.log('[StoryAnalyst] One sentence:', analysis.creative_brief?.one_sentence);

      return validateAnalysis(analysis, input);
    } catch (err) {
      console.error('[StoryAnalyst] Parse error:', err);
      return createFallbackAnalysis(input);
    }
  }
};

// ============================================
// HELPERS
// ============================================

function validateAnalysis(analysis: StoryAnalysisOutput, input: StoryAnalysisInput): StoryAnalysisOutput {
  // Ensure all required fields exist
  if (!analysis.concept_analysis) {
    analysis.concept_analysis = {
      original_concept: input.concept,
      key_words: [],
      core_emotion: 'engagement',
      story_type: 'ACTION',
      target_audience: 'general'
    };
  }

  if (!analysis.emotional_journey) {
    analysis.emotional_journey = {
      opening_emotion: { emotion: 'curiosity', why: 'Hook viewer' },
      building_tension: { emotion: 'tension', why: 'Build stakes' },
      climax_emotion: { emotion: 'excitement', why: 'Peak moment' },
      closing_emotion: { emotion: 'satisfaction', why: 'Resolution' },
      arc_description: 'Standard dramatic arc'
    };
  }

  if (!analysis.visual_language) {
    analysis.visual_language = {
      lighting: { choice: 'Natural cinematic', why: 'Universal appeal' },
      camera_style: { choice: 'Steady with movement', why: 'Professional look' },
      lens_strategy: {
        wide_shots: { lens: '24mm', when: 'Establishing', why: 'Show scope' },
        medium_shots: { lens: '35mm', when: 'Action', why: 'Natural' },
        close_ups: { lens: '85mm', when: 'Emotion', why: 'Intimacy' }
      },
      color_palette: {
        primary: 'Natural',
        secondary: 'Complementary',
        accent: 'Highlight',
        why: 'Balanced visual'
      },
      pacing: { style: 'Variable', why: 'Match story beats' }
    };
  }

  if (!analysis.director_recommendation) {
    analysis.director_recommendation = {
      director: 'Spielberg',
      why: 'Universal emotional storytelling',
      specific_techniques: ['Face lighting', 'Reaction shots']
    };
  }

  if (!analysis.reference_strategy) {
    analysis.reference_strategy = {
      character_refs_needed: true,
      character_ref_reason: 'Maintain consistency',
      environment_refs_needed: true,
      environment_ref_reason: 'Establish world',
      prop_refs_needed: false,
      prop_ref_reason: 'No key props'
    };
  }

  if (!analysis.creative_brief) {
    analysis.creative_brief = {
      one_sentence: input.concept,
      key_moments: [{ moment: 'Key', visual: 'Impactful' }],
      what_to_avoid: ['Generic execution']
    };
  }

  if (!analysis.audio_narrative_plan) {
    analysis.audio_narrative_plan = {
      needs_voiceover: false,
      voiceover_reason: 'Not determined',
      needs_dialogue: false,
      dialogue_reason: 'Not determined',
      needs_music: true,
      music_style: 'Cinematic orchestral',
      sound_design: {
        key_sounds: ['ambient'],
        why: 'Basic atmosphere'
      },
      dialogue_shots: [],
      voiceover_segments: []
    };
  }

  return analysis;
}

function createFallbackAnalysis(input: StoryAnalysisInput): StoryAnalysisOutput {
  console.log('[StoryAnalyst] Using fallback analysis...');

  // Simple keyword extraction
  const words = input.concept.toLowerCase().split(/\s+/);
  const keyWords: KeyWord[] = words
    .filter(w => w.length > 4)
    .slice(0, 5)
    .map(word => ({ word, implies: 'story element' }));

  // Detect story type from keywords
  let storyType: StoryAnalysisOutput['concept_analysis']['story_type'] = 'ACTION';
  if (words.some(w => ['love', 'heart', 'feel'].includes(w))) storyType = 'DRAMA';
  if (words.some(w => ['scary', 'dark', 'horror', 'fear'].includes(w))) storyType = 'HORROR';
  if (words.some(w => ['funny', 'comedy', 'laugh'].includes(w))) storyType = 'COMEDY';
  if (words.some(w => ['product', 'brand', 'commercial'].includes(w))) storyType = 'COMMERCIAL';

  return {
    concept_analysis: {
      original_concept: input.concept,
      key_words: keyWords,
      core_emotion: 'engagement',
      story_type: storyType,
      target_audience: 'general audience'
    },
    emotional_journey: {
      opening_emotion: { emotion: 'curiosity', why: 'Draw viewer in' },
      building_tension: { emotion: 'anticipation', why: 'Build stakes' },
      climax_emotion: { emotion: 'intensity', why: 'Peak moment' },
      closing_emotion: { emotion: 'satisfaction', why: 'Provide closure' },
      arc_description: 'From curiosity through tension to resolution'
    },
    visual_language: {
      lighting: { choice: 'Cinematic natural', why: 'Professional, accessible' },
      camera_style: { choice: 'Dynamic with stillness', why: 'Balance energy and focus' },
      lens_strategy: {
        wide_shots: { lens: '24mm', when: 'Establishing scenes', why: 'Show context' },
        medium_shots: { lens: '35mm', when: 'Action and dialogue', why: 'Human perspective' },
        close_ups: { lens: '85mm', when: 'Emotional moments', why: 'Intimacy without distortion' }
      },
      color_palette: {
        primary: 'Story-dependent',
        secondary: 'Complementary tones',
        accent: 'Emotional highlights',
        why: 'Support narrative'
      },
      pacing: { style: 'Variable rhythm', why: 'Match emotional beats' }
    },
    director_recommendation: {
      director: 'Spielberg',
      why: 'Master of emotional storytelling with broad appeal',
      specific_techniques: ['Face close-ups', 'Light as emotion', 'Earned payoffs']
    },
    reference_strategy: {
      character_refs_needed: true,
      character_ref_reason: 'Maintain character consistency across shots',
      environment_refs_needed: true,
      environment_ref_reason: 'Establish and maintain world',
      prop_refs_needed: false,
      prop_ref_reason: 'No specific props identified'
    },
    creative_brief: {
      one_sentence: input.concept,
      key_moments: [
        { moment: 'Opening', visual: 'Establish world and character' },
        { moment: 'Climax', visual: 'Maximum visual impact' },
        { moment: 'Resolution', visual: 'Emotional payoff' }
      ],
      what_to_avoid: [
        'Generic execution without emotional core',
        'Visual choices without story purpose'
      ]
    },
    audio_narrative_plan: {
      needs_voiceover: false,
      voiceover_reason: 'Default - visuals tell the story',
      needs_dialogue: false,
      dialogue_reason: 'Default - no dialogue identified',
      needs_music: true,
      music_style: 'Cinematic score matching story type',
      sound_design: {
        key_sounds: ['ambient environment', 'action foley'],
        why: 'Immerse viewer in scene'
      },
      dialogue_shots: [],
      voiceover_segments: []
    }
  };
}

// ============================================
// EXPORTS
// ============================================

export default storyAnalystAgent;
