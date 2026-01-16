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
import movieShotsService from '../services/movieShotsService';
import type { FormattedShotReference } from '../types/movieShots';

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
      "sora_candidate": false,
      "sora_reason": "Story-critical establishing shot"
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
      "edit_intent": {
        "pacing": "tight",
        "cut_trigger": "character_stops",
        "allow_speed_up": true,
        "max_speed": "x1.5",
        "trim_dead_air": true
      },
      "sora_candidate": false,
      "sora_reason": "Character face - need precise continuity"
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
      "edit_intent": {
        "pacing": "relaxed",
        "allow_speed_up": true,
        "max_speed": "x2"
      },
      "sora_candidate": true,
      "sora_reason": "Pure atmosphere, no characters, no dialogue",
      "sora_ref_type": "location_only",
      "sora_preset": "ATMOSPHERE_EXT"
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

### Tool Selection:
| Need | Tool | Notes |
|------|------|-------|
| **TTS (any voice)** | ElevenLabs | Use same voice_id = consistent voice! |
| **Lip sync (face visible)** | VEED Fabric | Takes ElevenLabs audio → syncs to face |
| **Clone celebrity voice** | MiniMax voice-clone | ONLY for celebrity/real person |
| **TTS with cloned voice** | MiniMax speech-02-hd | After cloning |

### Workflow by Shot Type:
\`\`\`
VOICEOVER (face NOT visible):
  → ElevenLabs TTS only (no VEED needed)

TALKING HEAD (face visible):
  → ElevenLabs TTS → VEED lip sync

NARRATION OVER FLASHBACK:
  → ElevenLabs TTS (voiceover track)
  → Flashback shots are SILENT video (sora-2/kling)
  → Audio layered in post

MULTIPLE CHARACTERS TALKING:
  → Each character = different ElevenLabs voice_id
  → Each gets VEED lip sync when on camera
\`\`\`

### Frame Narrative (Story within Story):
When someone TELLS a story with flashbacks:
1. FRAME SHOTS (person talking) → ElevenLabs + VEED lip sync
2. FLASHBACK SHOTS (action) → Silent video (sora-2/kling) + music/SFX
3. VOICEOVER on flashback → Same ElevenLabs voice_id (consistency!)
4. Return to FRAME → Same VEED lip sync setup

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

### Available Models:

| Model | Best For | Cost | When to Use |
|-------|----------|------|-------------|
| **sora-2** | CLOSE-UPS, details, b-roll | $0.50 | **PREFER THIS for ECU/CU shots!** Fast, great quality on close-ups |
| **kling-2.6** | WIDE/MEDIUM action | $0.35 | Wide shots, full-body movement |
| **kling-o1** | Start→End transitions | $0.45 | Controlled zoom/orbit with specific end frame |
| **seedance-1.5** | Dialogue with lip sync | $0.40 | Character SPEAKS with visible face |
| **veed-fabric** | Talking head avatar | $0.30 | Static close-up with character talking |

### SORA 2 QUALITY RULES (CRITICAL!)
- **CLOSE-UPS = BEST** (ECU, CU, INSERT) → Sora 2 excels here!
- **WIDE SHOTS = POOR** → Never use Sora 2 for wide/establishing
- **12 seconds = 5 shots optimal** for fast editing
- **Input image = START FRAME** (highest priority)

### Decision Tree:

\`\`\`
Is it a CLOSE-UP or DETAIL shot? (ECU, CU, INSERT, MACRO)
├── YES → sora-2 (FAST + great quality on close-ups!)
│   Examples: feet running, hands grabbing, eyes widening, dials/buttons
│
└── NO (WIDE or MEDIUM shot)
    ├── Does character SPEAK? → seedance-1.5 or veed-fabric
    ├── Start→End transition needed? → kling-o1
    └── Standard action → kling-2.6

CHASE/ACTION SCENE PATTERN (use lots of Sora 2!):
- CU feet running → sora-2
- WIDE establishing → kling-2.6
- CU hands reaching → sora-2
- CU villain approaching → sora-2
- MEDIUM hero reacts → kling-2.6
- INSERT detail (door closing, timer) → sora-2
\`\`\`

### Add video_model to EVERY shot:

\`\`\`json
{
  "shot_number": 1,
  "shot_type": "WIDE_MASTER",
  "video_model": "kling-2.6",
  "model_reasoning": "Establishing shot, no dialogue, standard movement"
}
\`\`\`

## SORA 2 - USE IT AGGRESSIVELY!

Sora 2 is FAST and EXCELLENT for close-ups. Use it to create dynamic editing with lots of cuts!

**BEST for Sora 2 (sora_candidate: true, video_model: sora-2):**
- **CLOSE-UPS/MACRO** - faces, hands, feet, eyes, details (BEST QUALITY!)
- **INSERT SHOTS** - buttons, dials, doors closing, timers, props
- **SFX-HEAVY SHOTS** - explosions, fire, smoke, debris, weather
- **SPEED RAMPS** - slow-mo to fast, dramatic timing changes
- **TRANSITIONS** - smooth camera moves, whip pans, reveals
- **TENSION CUTS** - quick detail shots to build suspense
- Vehicle/environment atmosphere (cityscapes, weather)
- B-roll filler between scenes

**HYPER-KINETIC EDITING with Sora 2:**
For chase/action scenes, use MANY quick Sora 2 shots:
- CU feet pounding → CU predator feet → CU hands reaching → INSERT door closing
- Each 2-3 seconds, rapid cuts = tension!
- Sora 2 generates FAST so you can make many variations

**NOT for Sora 2:**
- WIDE establishing shots (poor quality on wide)
- Full-body character action (use Kling)
- Dialogue scenes (use Seedance)
- Shots requiring specific start→end control (use Kling O1)

**Sora 2 Presets for Action/Chase:**
| Preset | Use For | Duration |
|--------|---------|----------|
| FEET_RUNNING | Hero/villain feet pounding ground | 2-3s |
| HANDS_REACHING | Desperate grab for door/lever/object | 2-3s |
| EYES_WIDENING | Fear/shock reaction close-up | 2s |
| PREDATOR_APPROACH | Villain/monster getting closer | 3s |
| DOOR_CLOSING | Bunker/elevator/escape closing | 3s |
| TIMER_COUNTDOWN | Clock/display counting down | 2s |
| DEBRIS_FLYING | Explosion aftermath, dust, particles | 2-3s |
| SPEED_RAMP_SLOW | Dramatic slow-mo moment | 3s |
| IMPACT_MOMENT | Hit/crash/collision detail | 2s |

For each shot, add:
- video_model: The model you've selected
- model_reasoning: Why this model fits
- sora_candidate: true/false
- sora_reason: Why it is/isn't a good candidate
- sora_ref_type: 'location_only' | 'character_only' | 'character_in_location'
- sora_preset: Suggested preset from table above

## SORA-2 BURST PATTERNS (PACING & STORY TURNS!)

Sora-2 is your **PACING CONTROL TOOL**. Use BURSTS (3-6 rapid shots) to:
- SELL emotional gear shifts
- CREATE intensity through rapid cuts
- PUNCTUATE story turns
- BUILD anticipation before impact

### AUTOMATIC BURST TRIGGERS - When you see these, plan a Sora-2 burst:

**TRIGGER 1: STORY TURN (Emotional Gear Shift)**
\`\`\`
DETECT: "Character decides to..." / "Now it's personal" / "Everything changes"
DETECT: Character shifts from defensive → offensive
DETECT: Stakes suddenly change
ACTION: Plan 3-5 shot DETERMINATION BURST
SHOTS: CU_FACE (anger) → CU_HANDS (grip) → ECU_EYES (locked) → CU_BODY (forward)
\`\`\`

**TRIGGER 2: PACING ACCELERATION**
\`\`\`
DETECT: Energy jumps +3 or more (e.g., 4 → 8)
DETECT: Chase begins / Fight escalates / Timer starts
DETECT: "Suddenly..." / "In an instant..."
ACTION: Plan 4-6 shot SPEED BURST
SHOTS: Rapid alternating angles, each 2-3s, building intensity
\`\`\`

**TRIGGER 3: PRE-IMPACT ANTICIPATION**
\`\`\`
DETECT: Something big about to hit (punch, rocket, crash)
DETECT: Projectile in flight
ACTION: Plan 2-4 shot ANTICIPATION BURST before impact
SHOTS: CU projectile → different angle → target reaction → IMPACT
\`\`\`

**TRIGGER 4: REACTION SEQUENCE**
\`\`\`
DETECT: Character sees something shocking
DETECT: Multiple characters react to same event
DETECT: "The moment they realized..."
ACTION: Plan 3-4 shot REACTION BURST
SHOTS: CU_FACE_A → CU_FACE_B → ECU_EYES → WIDE_REVEAL
\`\`\`

**TRIGGER 5: PREPARATION/LOADING**
\`\`\`
DETECT: Character preparing for action / Suiting up
DETECT: Weapon loading, vehicle starting, ritual before battle
ACTION: Plan 4-5 shot PREP BURST
SHOTS: CU_HANDS → DETAIL → CU_FACE → DETAIL → READY_POSE
\`\`\`

**TRIGGER 6: DESTRUCTION CASCADE**
\`\`\`
DETECT: Something breaks apart / Chain reaction
DETECT: Robot/vehicle exploding, building collapsing
ACTION: Plan 3-5 shot DESTRUCTION BURST
SHOTS: IMPACT → PART_A explodes → PART_B explodes → DEBRIS → AFTERMATH
\`\`\`

**TRIGGER 7: INTERIOR ACTION (Cockpit, Vehicle, Mech)**
\`\`\`
DETECT: Action inside vehicle/cockpit/mech
DETECT: Pilot/driver taking action
ACTION: Plan 3-4 shot INTERIOR BURST
SHOTS: COCKPIT_WIDE → CU_CONTROLS → CU_PILOT_FACE → POV_WINDOW
\`\`\`

**TRIGGER 8: VEHICLE PERFORMANCE (Drifting, Racing, Flying)**
\`\`\`
DETECT: Car drifting / Racing scene / Fast driving
DETECT: Gear changes, pedal work, steering action
DETECT: Speed showcase / Performance moment
ACTION: Plan 4-6 shot VEHICLE BURST
SHOTS: CU_GEAR_SHIFT → CU_GAUGE → CU_STEERING → CU_PEDAL → CU_DRIVER_FACE → EXT_DRIFT
REQ_REFS: VEHICLE_INTERIOR (gauge cluster, gear shift, steering wheel, pedals)
\`\`\`

### BURST REF REQUIREMENTS (CRITICAL!)

**IMPORTANT: Bursts need MATCHING REFS to work!**

When you plan a burst, you MUST specify what refs are needed:

| Burst Type | Required Refs | Example |
|------------|---------------|---------|
| VEHICLE_INTERIOR | gauge_cluster, gear_shift, steering_wheel, pedals | Car drift scene |
| COCKPIT_ACTION | cockpit_wide, control_panel, pilot_seat, windshield | Helicopter/jet |
| MECH_INTERIOR | cockpit_hud, control_sticks, pilot_harness, screens | Giant robot |
| CHARACTER_REACTION | face_neutral, face_angry, face_determined, face_fear | Emotion burst |
| WEAPON_LOADING | gun_chamber, magazine, hands_loading, scope | Prep sequence |
| DESTRUCTION_PARTS | body_part_A, body_part_B, debris, fire_detail | Robot exploding |

### Add required_refs to burst planning:

\`\`\`json
{
  "burst_info": {
    "is_burst": true,
    "burst_id": "BURST_002_DRIFT",
    "burst_type": "VEHICLE_PERFORMANCE",
    "burst_trigger": "Car enters drift sequence",

    "required_refs": [
      {
        "ref_id": "car_interior_gauge",
        "ref_type": "DETAIL",
        "description": "Close-up of speedometer/tachometer gauge cluster",
        "must_match": "Same car interior as establishing shot"
      },
      {
        "ref_id": "car_interior_gearshift",
        "ref_type": "DETAIL",
        "description": "Gear shift lever with driver's hand",
        "must_match": "Same car interior"
      },
      {
        "ref_id": "car_interior_steering",
        "ref_type": "DETAIL",
        "description": "Steering wheel being turned hard",
        "must_match": "Same car interior"
      },
      {
        "ref_id": "car_interior_pedals",
        "ref_type": "DETAIL",
        "description": "Foot on gas/brake pedals",
        "must_match": "Same car interior"
      }
    ]
  }
}
\`\`\`

**THE PLANNING CHAIN:**
\`\`\`
1. Director detects burst trigger (car drifting scene)
2. Director plans burst structure (4-6 interior shots)
3. Director specifies required_refs (gauge, gear, steering, pedals)
4. Ref Planner generates these refs FIRST (consistent style!)
5. Shot Compiler assigns refs to burst shots
6. Sora-2 generates burst with matching refs
\`\`\`

### BURST STRUCTURE IN OUTPUT:

When you detect a trigger, mark the shots as a burst:

\`\`\`json
{
  "shot_number": 4,
  "shot_type": "CU_FACE",
  "video_model": "sora-2",
  "sora_candidate": true,
  "sora_preset": "GEAR_SHIFT_FACE",

  "burst_info": {
    "is_burst": true,
    "burst_id": "BURST_001_DETERMINATION",
    "burst_type": "GEAR_SHIFT",
    "burst_position": 1,
    "burst_total": 4,
    "burst_trigger": "Hero decides to fight back after helicopter hit",
    "burst_emotion": "defensive_to_aggressive",
    "pacing": "rapid"
  }
}
\`\`\`

### BURST SIZE BY INTENSITY:

| Story Moment | Burst Size | Duration Each |
|--------------|------------|---------------|
| Minor shift | 2-3 shots | 5s each |
| Medium turn | 3-4 shots | 5s each |
| Major climax | 4-6 shots | 5s each |
| Ultimate moment | 6-8 shots | 5s each |

### SORA-2 vs KLING DECISION:

| Situation | Model | Why |
|-----------|-------|-----|
| Normal dialogue | Kling 2.6 | Steady pacing needed |
| Walking/traveling | Kling 2.6 | Continuous motion |
| Establishing shot | Kling 2.6 | Wide = Kling territory |
| **STORY TURN** | **Sora-2 BURST** | Sell the emotional shift! |
| **FAST ACTION** | **Sora-2 BURST** | Pacing control |
| **PRE-IMPACT** | **Sora-2 BURST** | Build tension |
| **DESTRUCTION** | **Sora-2 BURST** | Chaos details |
| Calm after storm | Kling 2.6 | Reset to normal |

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
  // SORA 2 B-ROLL DETECTION
  // ============================================
  // Director flags shots that could use Sora 2 for efficiency
  // Producer will route to Sora 2 based on this flag

  sora_candidate: boolean;  // Can this shot use Sora 2?
  sora_reason?: string;     // Why it's a good/bad candidate
  sora_ref_type?: 'location_only' | 'character_only' | 'character_in_location' | 'collage';
  sora_preset?: string;     // Suggested preset (VEHICLE_FLYING, ATMOSPHERE_EXT, etc.)

  // ============================================
  // VIDEO MODEL SELECTION - Director decides!
  // ============================================
  // Director picks the model for each shot based on creative needs
  video_model: 'kling-2.6' | 'kling-o1' | 'seedance-1.5' | 'sora-2' | 'veed-fabric';
  model_reasoning?: string;  // Why this model was chosen
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
        movieShotRefs = await movieShotsService.getShotsByDirector(recommendedDirector, 5);
        console.log('[Director] 📽️ Found', movieShotRefs.length, 'reference shots');
      }

      // If no director-specific refs, get by emotion
      if (movieShotRefs.length === 0 && input.storyAnalysis?.emotionalArc) {
        const emotion = input.storyAnalysis.emotionalArc.split(' ')[0].toLowerCase();
        console.log('[Director] 🎭 Fetching shots by emotion:', emotion);
        movieShotRefs = await movieShotsService.getShotsByEmotion(emotion, 5);
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
    // Default: not Sora 2 candidate (story shots need full pipeline)
    sora_candidate: false,
    sora_reason: 'Story-critical shot - needs full pipeline for character continuity',
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
