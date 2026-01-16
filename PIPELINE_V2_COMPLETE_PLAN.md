# AI2 Studio Pipeline V2 - Complete Architecture

**Created:** 2026-01-16
**Status:** IMPLEMENTED - Ready for Testing

---

## OVERVIEW

The pipeline is a 15-phase system that takes a concept and produces:
1. Shot cards with prompts
2. Video model assignments
3. Ref management
4. Edit decisions
5. Production manifest

---

## THE CORE WORKFLOW

### Step 1: Create Base Image (The "Baseplate")

Using: `fal-ai/nano-banana-pro`

```javascript
{
  "prompt": "Giant mech robot in destroyed city, gray armor, red glowing eyes...",
  "image_size": "landscape_16_9"
}
```

This BASE_IMAGE becomes your MASTER REFERENCE. All other shots derive from this.

### Step 2: Create Different Angles from Base

Using: `fal-ai/nano-banana-pro/edit`

```javascript
{
  "image_urls": ["BASE_IMAGE_URL"],  // Reference the base
  "prompt": "THIS EXACT ROBOT from Image 1, CLOSE-UP of face, 85mm lens,
             THIS EXACT LIGHTING, THIS EXACT COLOR GRADE, maintain exact likeness"
}
```

**Key Phrases (always include):**
- "THIS EXACT [subject] from Image 1"
- "THIS EXACT LIGHTING"
- "THIS EXACT COLOR GRADE"
- "maintain exact likeness"
- "NO MIRRORING"

### Step 3: Generate Video from Image

**Kling 2.6** (action/movement):
```javascript
{
  "image_url": "ANGLE_URL",
  "prompt": "Robot eyes flare, head turns, then settles",
  "duration": "5"
}
```

**Kling O1** (controlled start→end):
```javascript
{
  "start_image_url": "WIDE_SHOT_URL",
  "end_image_url": "CLOSEUP_URL",  // Generate this with /edit first!
  "prompt": "Slow dolly in",
  "duration": "5"
}
```

**Seedance 1.5** (dialogue):
```javascript
{
  "image_url": "CLOSEUP_URL",
  "prompt": "Character speaks",
  "duration": "5"
}
```

### Step 4: Extract Last Frame for Chaining

```bash
ffmpeg -sseof -0.1 -i VIDEO_1.mp4 -frames:v 1 -q:v 2 last_frame.jpg
```

The last frame of Video 1 becomes Image 1 for Video 2.

### Step 5: Edit from Last Frame (NOT Original Base)

**WRONG (causes color drift):**
```
BASE → edit → ANGLE_A (color shift)
BASE → edit → ANGLE_B (different shift)
```

**RIGHT (maintains consistency):**
```
BASE → video → LAST_FRAME_1
LAST_FRAME_1 → edit → ANGLE_B
ANGLE_B → video → LAST_FRAME_2
LAST_FRAME_2 → edit → ANGLE_C
```

---

## VIDEO MODEL DECISION TREE

```
Does character SPEAK on camera?
├── YES, face visible → seedance-1.5
├── YES, static close-up → veed-fabric
└── NO → continue...

Do you need controlled start→end transition?
├── YES → kling-o1 (requires start AND end image)
└── NO → continue...

Is this B-roll/atmosphere (no character)?
├── YES → sora-2
└── NO → kling-2.6 (default)
```

---

## THE 15 PHASES

| Phase | Agent | Purpose |
|-------|-------|---------|
| 1 | Story Analyst | WHY - emotion, style, genre, director |
| 2 | Beat Planner | WHAT - story beats, structure |
| 3 | Coverage Planner | OPTIONS - all camera angles per beat |
| 4 | Director | SELECTS - angles, models, film grammar |
| 5 | Scriptwriter | DIALOGUE - actual lines, voiceover |
| 6 | World Engineer | WHERE - 3D coordinates, positions |
| 7 | Ref Planner | REFS - what refs, chaining strategy |
| 8 | Ref Generation | CREATE - generate the images |
| 9 | Ref Validator | CHECK - do refs exist? |
| 10 | Shot Compiler | PROMPTS - write the actual prompts |
| 11 | Audio Planner | SOUND - TTS, music, SFX |
| 12 | Continuity Validator | VALIDATE - no 180° violations |
| 13 | Editor Advisor | CUTS - timing, trim, speed |
| 14 | Producer | MANIFEST - execution order |
| 15 | Verification | QC - final check |

---

## AGENT RESPONSIBILITIES

### Story Analyst (Phase 1)
- Analyzes concept word by word
- Sets genre, emotion, director style
- Defines visual language (lens, color, pacing)
- Determines if dialogue/voiceover needed

### Beat Planner (Phase 2)
- Creates story structure (INTRO → BUILD → CLIMAX → END)
- Sets energy level per beat (1-5)
- Defines timing

### Coverage Planner (Phase 3)
- For EACH beat, plans multiple camera angles
- Each angle includes: shot_type, lens_mm, purpose, recommended_model
- Provides options (A, B, C, D angles)

### Director (Phase 4)
- SELECTS which angles to use
- Picks video_model per shot (model-aware!)
- Sets dialogue_info, edit_intent
- Enforces film grammar (180-degree rule)

### Scriptwriter (Phase 5)
- Writes ACTUAL dialogue lines
- Creates voiceover narration
- Provides character voice descriptions

### World Engineer (Phase 6)
- Builds 3D world with coordinates
- Positions entities (robot RIGHT, helicopter LEFT)
- Defines camera positions per rig

### Ref Planner (Phase 7)
- Plans which refs each shot needs
- Determines chaining strategy
- Outputs shot_ref_stacks with Image 1, 2, 3

### Ref Validator (Phase 9)
- Confirms refs exist before Shot Compiler
- Validates URLs are valid
- Gates the pipeline if critical refs missing

### Shot Compiler (Phase 10)
- Writes photo_prompt per shot
- Writes video_motion_prompt per shot
- Includes all continuity phrases

### Editor Advisor (Phase 13)
- Determines target_duration_ms (how much of 5s clip to use)
- Sets trim_start_ms, trim_end_ms
- Recommends cut_trigger (when to cut)
- FUTURE: Uses vision to analyze generated clips

---

## REF PLANNER OUTPUT EXAMPLE

```javascript
shot_ref_stacks: [
  {
    shot_number: 1,
    image_1: "BASE_WORLD",
    chain_from_previous: false,
    chain_reasoning: "First shot - establish fresh"
  },
  {
    shot_number: 2,
    image_1: "PREVIOUS_FRAME",
    image_2: "char_robot",
    chain_from_previous: true,
    continuity_phrases: [
      "Continue from Image 1",
      "THIS EXACT CHARACTER",
      "THIS EXACT LIGHTING",
      "NO MIRRORING"
    ]
  }
]
```

---

## EDITOR ADVISOR OUTPUT EXAMPLE

```javascript
{
  shot_number: 2,
  target_duration_ms: 2500,     // Only need 2.5s of 5s clip
  trim_start_ms: 0,
  trim_end_ms: 2500,            // Trim last 2.5s
  speed_multiplier: 1.0,
  cut_trigger: "expression_change",
  cut_reasoning: "Cut when eyes finish flaring"
}
```

---

## CHAINING STRATEGY

**When to Chain (use PREVIOUS_FRAME):**
- Same scene, same characters
- Continuous action
- Maintaining color grade

**When to Break Chain:**
- Scene change (new location)
- Time jump
- Flashback/flash-forward
- Dramatic contrast

---

## FILES CREATED

| File | Purpose |
|------|---------|
| `coveragePlannerAgent.ts` | Plans all camera angles per beat |
| `scriptwriterAgent.ts` | Writes actual dialogue lines |
| `refPlannerAgent.ts` | Plans refs and chaining |
| `refValidatorAgent.ts` | Validates refs exist |
| `editorAdvisorAgent.ts` | Refines edit decisions |
| `unifiedPipelineV2.ts` | Orchestrates all 15 phases |

---

## HOW TO TEST

1. Start dev server: `npm run dev`
2. Open: `http://localhost:3002/ai2`
3. Enter a concept
4. Click "Run Spec Pipeline"
5. Watch console for 15 phases
6. Review output summary

---

## SORA 2 TESTED RULES (January 2026)

Based on REAL TESTING with cockpit/military footage:

### QUALITY BY SHOT TYPE

| Shot Type | Quality |
|-----------|---------|
| Extreme close-up / Macro | ⭐⭐⭐⭐⭐ BEST |
| Close-up | ⭐⭐⭐⭐⭐ EXCELLENT |
| Medium (with action) | ⭐⭐⭐ GOOD |
| Wide shots | ⭐ POOR ("looks ass") |

### OPTIMAL SETTINGS

- **12 seconds = 5 shots** (best quality balance)
- **Input photo = START FRAME** (plan accordingly)
- **2x2 storyboard grids work** as input!
- Focal length changes = VERY GOOD
- Pacing / visual timing = VERY GOOD

### TESTED PROMPT PATTERN

```
[SETUP] shot from [POV], rapid fast cuts:

Fast cut - [CLOSE-UP action description]
Quick cut - [TIGHT shot of detail]
Rapid cut - [MACRO on hands/controls]
Final cut - [EXTREME close-up payoff]

Hyper-kinetic editing, 0.5-1 second per shot,
[lighting], [textures], shallow depth of field,
[camera moves: snap zoom, whip pan, rapid zoom]
```

### START FRAME RULE

The input photo becomes frame 1 of the video:
- If photo is what you WANT shown → GOOD, proceed
- If photo is just a ref → Vision-check first 1-2 seconds, trim if static

### TESTED PRESETS (in audioPlannerAgent.ts)

- `COCKPIT_STARTUP_HYPER` - Military/tech cockpit startup
- `TACTICAL_DISPLAY_HYPER` - Screens, buttons, tactical interfaces
- `HANDS_CONTROLS_HYPER` - Hands on controls/switches
- `HYPER_KINETIC_CLOSEUPS` - Generic fast B-roll

### CODE LOCATION

```typescript
import {
  SORA_QUALITY_RULES,
  buildHyperKineticSoraPrompt,
  SORA_SHOT_PRESETS
} from './agents/audioPlannerAgent';
```

---

## FUTURE ENHANCEMENTS

1. **Vision-based Editing** - Analyze generated clips to find optimal cut points
2. **Style Database** - Build database of genres, directors, techniques
3. **User Preview** - Show storyboard before spending on generation
4. **Automatic Regeneration** - If ref validation fails, auto-regenerate

---

## COUNCIL STATUS: REMOVED

Its responsibilities are now split:
- NARRATIVE → Story Analyst
- VISUAL → Director
- TECHNICAL → Director (model selection)
- PRODUCTION → Ref Planner
