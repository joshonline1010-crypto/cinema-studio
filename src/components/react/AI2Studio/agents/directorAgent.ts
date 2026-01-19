/**
 * Director Agent - The Brain of the Production
 *
 * This agent is the MASTER PLANNER that thinks about:
 * 1. SCENE TYPE - What kind of scene is this? (dialog, action, chase, emotional)
 * 2. FILM GRAMMAR - What shot patterns work for this scene type?
 * 3. REF STRATEGY - Which character/environment refs for which shots?
 * 4. CHAIN LOGIC - When to chain from previous frame vs new shot?
 * 5. CAMERA STRATEGY - 180-degree rule, eyelines, screen direction
 *
 * The Director runs FIRST after WorldEngineer and tells all other agents
 * what to do.
 */

import { callSpecAgent } from './specAICaller';
import type { WorldEngineerOutput, BeatDefinition, MasterRef } from './specTypes';

// Movie shot references - fetched via API (not direct import - breaks browser!)
interface FormattedShotReference {
  id: string;
  url: string;
  director: string;
  directorFormatted: string;
  movie: string;
  year: number;
  shotType: string;
  angle: string;
  emotion: string;
  lighting: string;
  description: string;
  photoPrompt: string;
  tags: string[];
}

// ============================================
// DIRECTOR SYSTEM PROMPT - FILM GRAMMAR MASTER
// ============================================

const DIRECTOR_SYSTEM_PROMPT = `You are the DIRECTOR AGENT - the creative brain of the production.

## YOUR ROLE
You analyze the story concept and create a COMPLETE PRODUCTION PLAN that tells all other agents exactly what to do. You think like a real film director - considering story, emotion, camera, and continuity.

## SCENE TYPE ANALYSIS

First, identify the scene type:

| Scene Type | Key Indicators | Shot Pattern |
|------------|----------------|--------------|
| DIALOG | Two+ characters talking | WIDE → OTS_A → CU_B → OTS_B → REACTION → WIDE |
| ACTION | Fighting, chasing, explosions | WIDE → TRACKING → CU → IMPACT → WIDE |
| CHASE | Pursuit, running, driving | TRACKING → POV → CU → WIDE → TRACKING |
| EMOTIONAL | Single character, internal moment | WIDE → MS → CU → ECU → CU → WIDE |
| REVEAL | Discovery, twist, surprise | WIDE → SLOW_PUSH → CU (reaction) → REVEAL_WIDE |
| MONTAGE | Time passage, preparation | CU → CU → CU → WIDE (rapid cuts) |

## FILM GRAMMAR RULES

### The 180-Degree Rule
- Draw an INVISIBLE LINE between two main subjects
- Camera MUST stay on ONE SIDE of this line
- Crossing the line = jarring, disorienting cut
- To cross: use NEUTRAL shot (WIDE_MASTER) as bridge

### Shot Patterns by Scene Type

**DIALOG SCENE (2 characters):**
\`\`\`
1. WIDE_MASTER - Establish both characters, relationship, space
2. OTS_A - Over Character A's shoulder, see Character B talking
3. CU_B - Character B's reaction/emotion
4. OTS_B - Over Character B's shoulder, see Character A respond
5. REACTION_INSERT - Micro-expression, detail
6. WIDE_MASTER - Resolve, show result of conversation
\`\`\`

**ACTION SCENE:**
\`\`\`
1. WIDE_MASTER - Establish space, combatants, stakes
2. TRACKING_LEFT - Follow movement, build energy
3. CU_A - Hero's determination/effort
4. LOW_ANGLE_HERO - Power moment
5. TRACKING_RIGHT - Counter movement
6. WIDE_MASTER - Result, aftermath
\`\`\`

**EMOTIONAL SCENE (single character):**
\`\`\`
1. WIDE - Character in environment (isolation/connection)
2. MS - Body language visible
3. CU - Face, emotion building
4. ECU - Eyes, tears, micro-expression (climax)
5. CU - Resolution of emotion
6. WIDE - New state, aftermath
\`\`\`

### Eyeline Rules
- Character looking LEFT = cut to something on RIGHT of next shot
- Maintain consistent eyelines within a scene
- Break eyeline only for dramatic effect

### Screen Direction
- Movement LEFT-TO-RIGHT = progress, positive
- Movement RIGHT-TO-LEFT = retreat, opposition
- LOCK direction for entire scene unless showing reversal

## REF ASSIGNMENT STRATEGY

### Which Ref for Which Shot?

**CHARACTER REFS:**
- Use CHARACTER_MASTER ref in EVERY shot where character appears
- For CU shots: character ref is HIGHEST priority (Image 1 position)
- For WIDE shots: environment ref higher, character ref in Image 2

**ENVIRONMENT REFS:**
- Use ENVIRONMENT_MASTER for establishing shots (shot 1, final shot)
- Use for any shot where environment is story-relevant

**CHAINING REFS (Image 1 = Previous Frame):**
- Shot 2 onwards: Image 1 = last frame of previous video
- This maintains: color grade, lighting, character appearance

### Ref Stack Order (Most Important First)
\`\`\`
For CU shots:     [PREVIOUS_FRAME, CHARACTER_MASTER, ENVIRONMENT_MASTER]
For WIDE shots:   [PREVIOUS_FRAME, ENVIRONMENT_MASTER, CHARACTER_MASTER]
For REACTION:     [PREVIOUS_FRAME, CHARACTER_MASTER]
For ESTABLISH:    [ENVIRONMENT_MASTER, CHARACTER_MASTER] (no previous)
\`\`\`

## CHAINING STRATEGY

### When to Chain (use previous frame)
- ALWAYS chain shots 2+ (maintains continuity)
- Especially important for: same scene, same lighting, same characters

### When to Break Chain (new shot)
- Scene change (new location)
- Time jump (hours/days later)
- Flashback/flash-forward
- Dramatic contrast (intentional discontinuity)

### Chain Phrase to Include
"Continue from Image 1. THIS EXACT CHARACTER. THIS EXACT LIGHTING.
THIS EXACT COLOR GRADE. Same costume, same environment, same time of day.
NO MIRRORING. NO DIRECTION FLIP."

## OUTPUT FORMAT

You must output a COMPLETE PRODUCTION PLAN:

\`\`\`json
{
  "scene_analysis": {
    "scene_type": "DIALOG|ACTION|CHASE|EMOTIONAL|REVEAL|MONTAGE",
    "primary_emotion": "tension|joy|fear|sadness|excitement|wonder",
    "energy_arc": [2, 3, 4, 5, 4, 2],
    "key_story_beats": ["Beat 1 description", "Beat 2 description"],
    "director_style": "Spielberg|Kubrick|Nolan|Fincher|etc",
    "style_reasoning": "Why this style fits the story"
  },

  "shot_sequence": [
    {
      "shot_number": 1,
      "shot_type": "WIDE_MASTER|OTS_A|CU_A|etc",
      "purpose": "Why this shot? What does it accomplish?",
      "camera_rig": "WIDE_MASTER",
      "lens_mm": 35,
      "duration_seconds": 5,
      "subject_focus": "hero|villain|environment|both",
      "camera_movement": "static|push_in|pull_back|orbit|tracking",
      "energy_level": 2,
      "target_duration_ms": 4000,
      "edit_intent": {
        "pacing": "normal",
        "cut_trigger": "camera_settles",
        "allow_speed_up": false,
        "trim_dead_air": true
      },
      "video_model": "kling-2.6",
      "model_reasoning": "Establishing shot, no dialogue"
    },
    {
      "shot_number": 2,
      "shot_type": "CU_A",
      "purpose": "Reaction shot - quick cut",
      "camera_rig": "TRIPOD_CU",
      "lens_mm": 85,
      "duration_seconds": 5,
      "subject_focus": "hero",
      "camera_movement": "static",
      "energy_level": 4,
      "target_duration_ms": 1500,
      "video_model": "kling-2.6",
      "model_reasoning": "Character reaction shot",
      "edit_intent": {
        "pacing": "tight",
        "cut_trigger": "character_stops",
        "allow_speed_up": true,
        "max_speed": "x1.5",
        "trim_dead_air": true
      }
    },
    {
      "shot_number": 3,
      "shot_type": "WIDE_EXT",
      "purpose": "B-roll atmosphere",
      "camera_rig": "AERIAL",
      "lens_mm": 24,
      "duration_seconds": 5,
      "subject_focus": "environment",
      "camera_movement": "orbit",
      "energy_level": 2,
      "target_duration_ms": 3000,
      "video_model": "kling-2.6",
      "model_reasoning": "Atmospheric shot with orbit movement",
      "edit_intent": {
        "pacing": "relaxed",
        "allow_speed_up": true,
        "max_speed": "x2"
      }
    }
  ],

  "ref_assignments": [
    {
      "shot_number": 1,
      "ref_stack": ["ENVIRONMENT_MASTER", "CHARACTER_MASTER_hero"],
      "chain_from_previous": false,
      "chain_reasoning": "First shot - establish fresh"
    },
    {
      "shot_number": 2,
      "ref_stack": ["PREVIOUS_FRAME", "CHARACTER_MASTER_hero", "ENVIRONMENT_MASTER"],
      "chain_from_previous": true,
      "chain_reasoning": "Maintain color/lighting continuity"
    }
  ],

  "continuity_locks": {
    "screen_direction": "LEFT_TO_RIGHT",
    "hero_side_of_frame": "LEFT",
    "light_direction": "NORTH_WEST",
    "180_line": "Between hero at (0,0,0) and exit at (-2,0,-1)",
    "color_grade": "Warm orange from fire, cool blue shadows"
  },

  "character_directions": [
    {
      "character": "hero",
      "arc": "Starts scared, grows determined, achieves escape",
      "key_expressions": ["fear", "determination", "relief"],
      "movement_pattern": "Moves from RIGHT to LEFT (toward exit)"
    }
  ]
}
\`\`\`

## SHOT PACING & EDIT PLANNING

Video models generate 5s or 10s clips. But good editing needs VARIABLE shot lengths:
- HOOK shots: 1-2s (quick cut, grab attention)
- IMPACT shots: 1.5-2s (punch, explosion, reveal)
- REACTION shots: 2-3s (just show face, cut)
- ACTION shots: 3-5s (full movement)
- ESTABLISHING shots: 4-6s (let it breathe)

**PLAN EDITS UPFRONT** - Set \`target_duration_ms\` and \`edit_intent\` for each shot:

\`\`\`json
{
  "shot_number": 3,
  "duration_seconds": 5,  // Model generates 5s
  "target_duration_ms": 1500,  // But we only NEED 1.5s
  "edit_intent": {
    "pacing": "tight",
    "cut_trigger": "zoom_complete",
    "cut_description": "Cut as soon as zoom reaches face",
    "allow_speed_up": true,
    "max_speed": "x1.5",
    "trim_dead_air": true
  }
}
\`\`\`

### When to Use Short Shots (1-3s)
- MONTAGE scenes (rapid cuts)
- HOOK openings (grab attention fast)
- IMPACT moments (punch, crash, reveal)
- REACTION cuts (character sees something)
- Transition beats between scenes

## DIALOGUE & SPEECH MODES

When a shot has dialogue, you MUST specify the speech mode:

| Mode | When to Use | What Happens |
|------|-------------|--------------|
| \`lip_sync\` | Character face visible, talking | VEED/Fabric adds lip movement |
| \`pov\` | Camera IS the character, they speak but we don't see them | Voice only, no avatar |
| \`inner_thoughts\` | Character visible but NOT speaking (thinking) | Voice plays, no lip sync |
| \`voice_only\` | Narration, off-screen voice | Pure TTS, no video modification |

Add \`dialogue_info\` to shots with speech:
\`\`\`json
{
  "shot_number": 4,
  "shot_type": "CU_A",
  "dialogue_info": {
    "has_dialogue": true,
    "speech_mode": "lip_sync",
    "character": "hero",
    "line_summary": "Hero says 'We need to go now'"
  }
}
\`\`\`

**RULES:**
- NEVER speed up dialogue shots (\`allow_speed_up: false\`)
- \`lip_sync\` requires character face visible
- \`pov\` means camera = character's eyes
- \`inner_thoughts\` = character on screen but mouth doesn't move

## VOICE & AUDIO TOOL CHAIN (PRE-PLAN THIS!)

When planning dialogue/voiceover, know the tools BEFORE you plan shots:

### CHARACTER VOICE STRATEGY

**RECURRING CHARACTERS (speak in multiple shots) → LOCK voice_id**
\`\`\`
hero     → voice_id: "eleven_hero_voice" (USE FOR ALL HERO DIALOGUE)
villain  → voice_id: "eleven_villain_voice" (USE FOR ALL VILLAIN DIALOGUE)
narrator → voice_id: "eleven_narrator_voice" (USE FOR ALL NARRATION)
\`\`\`
Same voice_id for voiceover, lip sync, inner thoughts, flashback narration.
This ensures voice CONSISTENCY across the entire production!

**ONE-TIME CHARACTERS (speak once, minor role) → ANY FITTING VOICE**
\`\`\`
random_guard → Just pick voice that fits: male, gruff, suits the scene
shopkeeper   → Just pick voice that fits: older, friendly, matches character
\`\`\`
No need to lock - just select appropriate ElevenLabs voice for character/story.

### Tool Selection:
| Need | Tool | Notes |
|------|------|-------|
| **TTS (any voice)** | ElevenLabs | Use LOCKED voice_id per character |
| **Lip sync (face visible)** | VEED Fabric | Takes ElevenLabs audio → syncs to face |
| **Clone celebrity voice** | MiniMax voice-clone | ONLY for celebrity/real person |
| **TTS with cloned voice** | MiniMax speech-02-hd | After cloning |

### Workflow by Shot Type:
\`\`\`
FACE VISIBLE + SPEAKING + ACTION/SFX BACKGROUND:
  → video_model: seedance (HD talking + voice + SFX!)
  → Great for: hand movements, showing stuff, action behind speaker

FACE VISIBLE + SPEAKING (simple talking head):
  → ElevenLabs TTS (character's locked voice_id)
  → VEED Fabric lip sync
  → video_model: veed-fabric

FACE NOT VISIBLE + SPEAKING (voiceover/narration):
  → ElevenLabs TTS only (character's locked voice_id)
  → video_model: sora-2 or kling-2.6 (silent video)
  → Audio layered in post

INNER THOUGHTS (face visible, NOT speaking):
  → ElevenLabs TTS (character's locked voice_id)
  → NO lip sync (mouth doesn't move)
  → video_model: sora-2

NARRATION OVER FLASHBACK:
  → ElevenLabs TTS (narrator's locked voice_id)
  → Flashback shots are SILENT video (sora-2 for CU, kling-2.6 for wide)
  → Audio layered in post
\`\`\`

### Frame Narrative (Story within Story):
When someone TELLS a story with flashbacks:
1. FRAME SHOTS (person talking + gestures) → seedance (HD talking + SFX)
   OR simple talking head → veed-fabric
2. FLASHBACK SHOTS (action) → Silent video (sora-2 for fast/CU, kling-2.6 for slow-mo wide)
3. VOICEOVER on flashback → SAME locked voice_id (consistency!)
4. Return to FRAME → Same model as step 1

### When to Use Full Length (4-10s)
- DIALOG (let actors breathe)
- EMOTIONAL climax (hold on face)
- ESTABLISHING (show environment)
- Complex camera moves (orbit, tracking)

### Speed Control
- \`x1.5\` - Energetic, commercial-style
- \`x2\` - Fast-paced montage, action
- \`x3\` - Time-lapse, transition filler
- NEVER speed up dialogue!

## VIDEO MODEL SELECTION (YOU DECIDE THIS!)

As Director, you SELECT the video model for each shot based on what the shot needs.
This is YOUR decision - you know the creative intent, so you pick the best tool.

### The 5 Video Models:

| Model | Best For | Cost | When to Use |
|-------|----------|------|-------------|
| **sora-2** | Close-ups, fast action, quick cuts, ANYTHING | $0.50 | **GO-TO MODEL!** Fast, versatile, great quality |
| **kling-2.6** | Cinematic slow-mo, fighting, flying, driving | $0.35 | Wide cinematic shots, slow motion action |
| **kling-o1** | Start→End zooms, VFX, explosions | $0.45 | When you have START and END frames |
| **seedance** | HD close-up TALKING with voice + SFX | $0.40 | Character speaks with action/SFX background |
| **veed-fabric** | Lip sync ONLY | $0.30 | Simple talking head, no action |

### Decision Tree:

\`\`\`
Close-up TALKING with great voice/SFX?
├── YES → seedance (HD talking + audio)
│
└── NO
    ├── Fast paced action? Quick cuts? Close-ups? Details?
    │   └── YES → sora-2 (FAST + versatile!)
    │
    ├── Cinematic slow-mo? (fighting, flying, driving, shooting)
    │   └── YES → kling-2.6 (slow motion)
    │
    ├── Need START → END zoom? VFX? Explosions?
    │   └── YES → kling-o1 (make START and END photos)
    │
    └── Just lip sync, no action?
        └── YES → veed-fabric
\`\`\`

### Action Fight Pattern (Alternating Models):
\`\`\`
WIDE FIGHT (slow-mo) → kling-2.6
CU PUNCH (fast) → sora-2
WIDE REACTION (slow-mo) → kling-2.6
CU FACE (fast) → sora-2
IMPACT ZOOM → kling-o1
\`\`\`

### Add video_model to EVERY shot:

\`\`\`json
{
  "shot_number": 1,
  "shot_type": "WIDE_MASTER",
  "video_model": "kling-2.6",
  "model_reasoning": "Establishing shot - wide shots use Kling"
}
\`\`\`

\`\`\`json
{
  "shot_number": 2,
  "shot_type": "CU_FACE",
  "video_model": "sora-2",
  "model_reasoning": "Close-up detail - Sora 2 excels here"
}
\`\`\`

For each shot, add:
- video_model: The model you've selected
- model_reasoning: Why this model fits

## SORA 2 - THE GO-TO MODEL!

Sora 2 is FAST, VERSATILE, and can handle ANYTHING. Use it as your default choice!

**BEST for Sora 2 (video_model: "sora-2"):**
- **CLOSE-UPS/MACRO** - faces, hands, feet, eyes, details
- **FAST ACTION** - quick cuts, rapid pacing, chase sequences
- **INSERT SHOTS** - buttons, dials, doors closing, timers, props
- **SFX-HEAVY SHOTS** - explosions, fire, smoke, debris, weather
- **SPEED RAMPS** - slow-mo to fast, dramatic timing
- **TENSION CUTS** - quick detail shots to build suspense
- **GENERAL SHOTS** - when in doubt, use Sora 2!

**Use other models when:**
- Cinematic slow-motion needed → kling-2.6
- Have specific START and END frames → kling-o1
- Character TALKING with voice/SFX → seedance
- Simple lip sync only → veed-fabric

## SORA 2 BURST PATTERNS (PACING CONTROL!)

Use BURSTS (3-6 rapid Sora 2 shots) to:
- SELL emotional gear shifts
- CREATE intensity through rapid cuts
- PUNCTUATE story turns
- BUILD anticipation before impact

### BURST TRIGGERS - When you detect these, plan a Sora 2 burst:

**STORY TURN:** Character shifts emotion/intention
→ CU_FACE (anger) → CU_HANDS (grip) → ECU_EYES → CU_BODY

**PACING ACCELERATION:** Energy jumps, chase begins
→ Rapid alternating angles, each 2-3s target duration

**PRE-IMPACT:** Something big about to hit
→ CU projectile → different angle → target reaction → IMPACT

**VEHICLE PERFORMANCE:** Drifting, racing, gear changes
→ CU_GEAR_SHIFT → CU_GAUGE → CU_STEERING → CU_PEDAL → CU_DRIVER_FACE

**DESTRUCTION CASCADE:** Something breaks apart
→ IMPACT → PART_A explodes → PART_B → DEBRIS → AFTERMATH

## REMEMBER

You are the DIRECTOR. You see the WHOLE picture. You make creative decisions that serve the STORY. Every technical choice (shot type, ref, chain) must serve an EMOTIONAL purpose.

Think like Spielberg, Kubrick, Nolan, Fincher - masters who use camera and editing to tell stories, not just record them.`;

// ============================================
// DIRECTOR AGENT TYPES
// ============================================

export interface DirectorInput {
  concept: string;
  targetDuration: number;
  worldState: WorldEngineerOutput;
  availableRefs: MasterRef[];
  // Optional story analysis from Story Analyst (Phase -1)
  storyAnalysis?: {
    storyType?: string;
    emotionalArc?: string;
    recommendedDirector?: string;
    directorTechniques?: string[];
    visualLanguage?: any;
    audioNeeds?: any;
  };
}

export interface ShotPlan {
  shot_number: number;
  shot_type: string;
  purpose: string;
  camera_rig: string;
  lens_mm: number;
  duration_seconds: number;  // What model will generate (5 or 10)
  subject_focus: string;
  camera_movement: string;
  energy_level: number;

  // ============================================
  // EDIT PLANNING - For Editor Agent
  // ============================================
  // Models only generate 5s or 10s clips, but we often need:
  // - Super short shots (1-2s for fast pacing)
  // - Trimmed clips (cut when action done)
  // - Speed changes (x1.5, x2 for energy)
  //
  // Director plans this UPFRONT so Editor knows what to do.

  // What duration we ACTUALLY want after editing
  target_duration_ms?: number;  // e.g., 1500 for 1.5s shot

  // How to edit this shot
  edit_intent?: {
    pacing: 'tight' | 'normal' | 'relaxed';
    // What to wait for before cutting
    cut_trigger?: 'zoom_complete' | 'character_stops' | 'camera_settles' | 'beat_hit' | 'custom';
    cut_description?: string;  // e.g., "cut as soon as zoom reaches face"
    // Speed preferences
    allow_speed_up?: boolean;
    max_speed?: 'x1' | 'x1.25' | 'x1.5' | 'x2' | 'x3';
    // Trim preferences
    trim_dead_air?: boolean;  // Auto-remove static sections
  };

  // ============================================
  // DIALOGUE INFO - For Audio Planner
  // ============================================
  // If this shot has dialogue, specify how it should be handled

  dialogue_info?: {
    has_dialogue: boolean;
    speech_mode: 'lip_sync' | 'pov' | 'inner_thoughts' | 'voice_only';
    character?: string;  // Who is speaking
    line_summary?: string;  // Brief summary of what they say
  };

  // ============================================
  // VIDEO MODEL SELECTION - Director decides!
  // ============================================
  // Director picks the model for each shot based on creative needs
  video_model: 'kling-2.6' | 'kling-o1' | 'sora-2' | 'seedance' | 'veed-fabric';
  model_reasoning?: string;  // Why this model was chosen

  // SORA-SPECIFIC FIELDS
  sora_candidate?: boolean;  // Good for Sora (no precise character control)
  sora_preset?: string;      // Sora preset name
  sora_ref_type?: 'location_only' | 'character_only' | 'character_in_location' | 'collage';
  sora_reason?: string;      // Why Sora was chosen/not chosen
}

export interface RefAssignment {
  shot_number: number;
  ref_stack: string[];
  chain_from_previous: boolean;
  chain_reasoning: string;
}

export interface DirectorOutput {
  scene_analysis: {
    scene_type: 'DIALOG' | 'ACTION' | 'CHASE' | 'EMOTIONAL' | 'REVEAL' | 'MONTAGE';
    primary_emotion: string;
    energy_arc: number[];
    key_story_beats: string[];
    director_style: string;
    style_reasoning: string;
  };
  shot_sequence: ShotPlan[];
  ref_assignments: RefAssignment[];
  continuity_locks: {
    screen_direction: string;
    hero_side_of_frame: string;
    light_direction: string;
    line_180: string;
    color_grade: string;
  };
  character_directions: Array<{
    character: string;
    arc: string;
    key_expressions: string[];
    movement_pattern: string;
  }>;
  // NEW: Movie shot references from the database
  movie_shot_references?: FormattedShotReference[];
}

// ============================================
// DIRECTOR AGENT
// ============================================

export const directorAgent = {
  role: 'director',
  name: 'Director Agent',
  icon: '🎬',
  color: 'red',
  systemPrompt: DIRECTOR_SYSTEM_PROMPT,

  async execute(input: DirectorInput): Promise<DirectorOutput> {
    console.log('[Director] 🎬 ANALYZING SCENE AND CREATING PRODUCTION PLAN...');
    console.log('[Director] Concept:', input.concept.substring(0, 80));
    console.log('[Director] Duration:', input.targetDuration, 'seconds');
    console.log('[Director] Available refs:', input.availableRefs.length);

    // Calculate expected shot count
    let shotCount = 6;
    if (input.targetDuration <= 15) shotCount = 3;
    else if (input.targetDuration <= 30) shotCount = 6;
    else if (input.targetDuration <= 60) shotCount = 12;
    else shotCount = Math.ceil(input.targetDuration / 5);

    // ============================================
    // QUERY MOVIE SHOTS DATABASE FOR REFERENCES
    // ============================================
    let movieShotRefs: FormattedShotReference[] = [];
    try {
      // Get recommended director from story analysis (if available)
      const recommendedDirector = input.storyAnalysis?.recommendedDirector;

      if (recommendedDirector) {
        console.log('[Director] 🎥 Fetching reference shots for director:', recommendedDirector);
        const response = await fetch(`/api/movie-shots/query?director=${encodeURIComponent(recommendedDirector)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          movieShotRefs = data.shots || [];
        }
        console.log('[Director] 📽️ Found', movieShotRefs.length, 'reference shots');
      }

      // If no director-specific refs, get by emotion
      if (movieShotRefs.length === 0 && input.storyAnalysis?.emotionalArc) {
        const emotion = input.storyAnalysis.emotionalArc.split(' ')[0].toLowerCase();
        console.log('[Director] 🎭 Fetching shots by emotion:', emotion);
        const response = await fetch(`/api/movie-shots/query?emotion=${encodeURIComponent(emotion)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          movieShotRefs = data.shots || [];
        }
      }
    } catch (err) {
      console.warn('[Director] Could not fetch movie shot references:', err);
    }

    // Build user prompt (now includes movie shot references)
    const userPrompt = buildDirectorPrompt(input, shotCount, movieShotRefs);

    // Call Claude
    const aiResponse = await callSpecAgent({
      systemPrompt: DIRECTOR_SYSTEM_PROMPT,
      userMessage: userPrompt,
      expectJson: true,
      model: 'claude-sonnet'
    });

    if (!aiResponse.success) {
      console.error('[Director] AI call failed:', aiResponse.error);
      return createFallbackPlan(input, shotCount);
    }

    console.log('[Director] ✅ Got production plan from:', aiResponse.provider);

    try {
      const plan = aiResponse.data as DirectorOutput;

      console.log('[Director] Scene type:', plan.scene_analysis?.scene_type);
      console.log('[Director] Director style:', plan.scene_analysis?.director_style);
      console.log('[Director] Shot count:', plan.shot_sequence?.length);

      // Validate and fill in any missing fields, include movie shot refs
      const validatedPlan = validateAndFillPlan(plan, input, shotCount);
      validatedPlan.movie_shot_references = movieShotRefs;
      return validatedPlan;
    } catch (err) {
      console.error('[Director] Error parsing plan:', err);
      const fallback = createFallbackPlan(input, shotCount);
      fallback.movie_shot_references = movieShotRefs;
      return fallback;
    }
  }
};

// ============================================
// PROMPT BUILDER
// ============================================

function buildDirectorPrompt(input: DirectorInput, shotCount: number, movieShotRefs?: FormattedShotReference[]): string {
  const refList = (input.availableRefs || []).map(r =>
    `- ${r.name} (${r.type}): ${r.url ? 'AVAILABLE' : 'pending'}`
  ).join('\n');

  // Safely access worldState - may not exist yet in V2 pipeline
  const worldState = input.worldState || {};
  const entities = (worldState.entities || []).map((e: any) =>
    `- ${e.entity_id} (${e.entity_type}) at position (${e.base_world_position?.x || 0}, ${e.base_world_position?.y || 0}, ${e.base_world_position?.z || 0})`
  ).join('\n') || 'No entities defined yet';

  const worldStateJson = worldState.worldState
    ? JSON.stringify(worldState.worldState, null, 2)
    : '{ "note": "World will be built after direction" }';

  const sceneGeoJson = worldState.sceneGeographyMemory
    ? JSON.stringify(worldState.sceneGeographyMemory, null, 2)
    : '{ "note": "Scene geography pending" }';

  // Format movie shot references if available
  const movieRefSection = movieShotRefs && movieShotRefs.length > 0
    ? `

MOVIE SHOT REFERENCES (Study these for framing and style):
${movieShotRefs.map((ref, i) => `
Reference ${i + 1}: ${ref.movie} (${ref.directorFormatted})
- Shot Type: ${ref.shotType}, Angle: ${ref.angle}
- Emotion: ${ref.emotion}, Lighting: ${ref.lighting}
- How to recreate: ${ref.photoPrompt}
- Tags: ${ref.tags.join(', ')}
`).join('\n')}`
    : '';

  return `Create a COMPLETE PRODUCTION PLAN for this concept.

CONCEPT: "${input.concept}"

TARGET DURATION: ${input.targetDuration} seconds
EXPECTED SHOTS: ${shotCount} shots (each ~5 seconds)
${movieRefSection}
WORLD STATE:
${worldStateJson}

ENTITIES IN SCENE:
${entities}

AVAILABLE REFS:
${refList || 'No refs yet - plan for CHARACTER_MASTER and ENVIRONMENT_MASTER'}

SCENE GEOGRAPHY:
${sceneGeoJson}

---

Analyze this scene and create a production plan. Think about:
1. What TYPE of scene is this? (dialog, action, emotional, etc.)
2. What SHOT PATTERN fits this scene type?
3. Which REFS go in which shots and WHY?
4. When to CHAIN from previous frame vs new shot?
5. What CONTINUITY LOCKS are needed?

Return your complete production plan as JSON.`;
}

// ============================================
// VALIDATION & FALLBACK
// ============================================

function validateAndFillPlan(
  plan: DirectorOutput,
  input: DirectorInput,
  shotCount: number
): DirectorOutput {
  // Ensure all required fields exist
  if (!plan.scene_analysis) {
    plan.scene_analysis = {
      scene_type: 'ACTION',
      primary_emotion: 'tension',
      energy_arc: Array(shotCount).fill(0).map((_, i) => Math.min(5, 2 + Math.floor(i / 2))),
      key_story_beats: ['Setup', 'Confrontation', 'Climax', 'Resolution'],
      director_style: 'Spielberg',
      style_reasoning: 'Default dramatic style'
    };
  }

  if (!plan.shot_sequence || plan.shot_sequence.length === 0) {
    plan.shot_sequence = createDefaultShotSequence(shotCount, plan.scene_analysis.scene_type);
  }

  if (!plan.ref_assignments || plan.ref_assignments.length === 0) {
    plan.ref_assignments = createDefaultRefAssignments(shotCount, input.availableRefs);
  }

  if (!plan.continuity_locks) {
    plan.continuity_locks = {
      screen_direction: 'LEFT_TO_RIGHT',
      hero_side_of_frame: 'LEFT',
      light_direction: 'NORTH_WEST',
      line_180: 'Established between main subjects',
      color_grade: 'Natural cinematic'
    };
  }

  if (!plan.character_directions) {
    plan.character_directions = [];
  }

  return plan;
}

function createFallbackPlan(input: DirectorInput, shotCount: number): DirectorOutput {
  console.log('[Director] Using fallback plan...');

  return {
    scene_analysis: {
      scene_type: 'ACTION',
      primary_emotion: 'tension',
      energy_arc: [2, 3, 4, 5, 4, 2].slice(0, shotCount),
      key_story_beats: ['Establish', 'Build', 'Climax', 'Resolve'],
      director_style: 'Spielberg',
      style_reasoning: 'Classic dramatic structure'
    },
    shot_sequence: createDefaultShotSequence(shotCount, 'ACTION'),
    ref_assignments: createDefaultRefAssignments(shotCount, input.availableRefs),
    continuity_locks: {
      screen_direction: 'LEFT_TO_RIGHT',
      hero_side_of_frame: 'LEFT',
      light_direction: 'NORTH_WEST',
      line_180: 'Between hero and goal',
      color_grade: 'Natural cinematic'
    },
    character_directions: [{
      character: 'hero',
      arc: 'Faces challenge and overcomes',
      key_expressions: ['determined', 'struggling', 'triumphant'],
      movement_pattern: 'Progresses toward goal'
    }]
  };
}

function createDefaultShotSequence(shotCount: number, sceneType: string): ShotPlan[] {
  const patterns: Record<string, string[]> = {
    'DIALOG': ['WIDE_MASTER', 'OTS_A', 'CU_B', 'OTS_B', 'REACTION_INSERT', 'WIDE_MASTER'],
    'ACTION': ['WIDE_MASTER', 'TRACKING_LEFT', 'CU_A', 'LOW_ANGLE_HERO', 'TRACKING_RIGHT', 'WIDE_MASTER'],
    'EMOTIONAL': ['WIDE_MASTER', 'MS', 'CU_A', 'REACTION_INSERT', 'CU_A', 'WIDE_MASTER'],
    'CHASE': ['WIDE_MASTER', 'TRACKING_LEFT', 'CU_A', 'POV', 'TRACKING_RIGHT', 'WIDE_MASTER'],
    'REVEAL': ['WIDE_MASTER', 'PUSH_IN', 'CU_A', 'REVEAL_WIDE', 'REACTION_INSERT', 'WIDE_MASTER']
  };

  const pattern = patterns[sceneType] || patterns['ACTION'];

  return Array(shotCount).fill(0).map((_, i) => ({
    shot_number: i + 1,
    shot_type: pattern[i % pattern.length],
    purpose: `Shot ${i + 1} - ${pattern[i % pattern.length]}`,
    camera_rig: pattern[i % pattern.length],
    lens_mm: pattern[i % pattern.length].includes('CU') ? 85 : 35,
    duration_seconds: 5,
    subject_focus: 'hero',
    camera_movement: 'static',
    energy_level: Math.min(5, 2 + Math.floor(i / 2)),
    // Default video model
    video_model: 'kling-2.6' as const,
    model_reasoning: 'Default action model for story shots'
  }));
}

function createDefaultRefAssignments(shotCount: number, availableRefs: MasterRef[]): RefAssignment[] {
  const charRef = availableRefs.find(r => r.type === 'CHARACTER_MASTER');
  const envRef = availableRefs.find(r => r.type === 'ENVIRONMENT_MASTER');

  return Array(shotCount).fill(0).map((_, i) => ({
    shot_number: i + 1,
    ref_stack: i === 0
      ? [envRef?.name || 'ENVIRONMENT_MASTER', charRef?.name || 'CHARACTER_MASTER']
      : ['PREVIOUS_FRAME', charRef?.name || 'CHARACTER_MASTER', envRef?.name || 'ENVIRONMENT_MASTER'],
    chain_from_previous: i > 0,
    chain_reasoning: i === 0 ? 'First shot - establish fresh' : 'Maintain continuity from previous frame'
  }));
}

// ============================================
// EXPORTS
// ============================================

export default directorAgent;
