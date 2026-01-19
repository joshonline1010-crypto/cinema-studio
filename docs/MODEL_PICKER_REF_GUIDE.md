# Model Picker & Ref Planning Guide

## Core Concept

Every shot needs:
- The RIGHT video model
- The RIGHT refs
- The RIGHT chain strategy

Base it off movie plot lines so AI can understand easily.

---

## The 5 Video Models

| Model | Best For | Cost |
|-------|----------|------|
| sora-2 | Fast cuts, rapid action, quick pacing | $0.50 |
| kling-2.6 | Cinematic slow-mo, fighting, flying, driving, shooting | $0.35 |
| kling-o1 | Start→End zooms, character movement, VFX, explosions | $0.45 |
| seedance | HD close-up talking, hand movements, voices + SFX | $0.40 |
| veed-fabric | Lip sync only | $0.30 |

---

## The Decision Tree

```
Close-up TALKING with great voice/SFX?
├── YES → seedance
│
└── NO
    ├── Fast paced action? Quick cuts?
    │   └── YES → sora-2
    │
    ├── Cinematic action? (fighting, flying, driving, shooting)
    │   └── YES → kling-2.6 (slow motion)
    │
    ├── Need START → END zoom? VFX? Explosions?
    │   └── YES → kling-o1
    │
    └── Just lip sync, no action?
        └── YES → veed-fabric
```

---

## Model Breakdown

**sora-2 — Fast Action, Quick Cuts**
- Fast paced, no problem
- Rapid cuts for tension
- Best for: quick reaction shots, inserts, bursts

↓

**kling-2.6 — Cinematic Slow-Mo Action**
- Action movie style, slowed but still great
- Fighting sequences
- Flying, driving, shooting
- Use slow motion for impact

↓

**kling-o1 — Movement, Zooms, VFX**
- Character movement + zooms (simple, all at once)
- Go-to for any normal shot
- Great for VFX stuff, explosions + zooms
- BEST for start-to-end zooms
- Make START photo and END photo → let this beast work

↓

**seedance — HD Close-Up Talking**
- HD close-up, perfect face
- Great hand movement, showing stuff
- Close-up talking with action background
- Great voices, great SFX

↓

**veed-fabric — Lip Sync Only**
- Just lip sync, nothing else
- Simple talking head

---

## Workflow: Refs First, Vision Check

```
1. PLAN from movie plot lines
   ↓
2. MAKE ALL REFS FIRST
   - Character 3x3 grids
   - Environment 3x3 grids
   ↓
3. GENERATE shots with refs
   ↓
4. CUT ALL OUT
   ↓
5. VISION CHECK
   - Does it follow all rules?
   - Anything not right?
   ↓
6. NOT RIGHT → Send back as ref + what to change
   ACCEPTED → 8K upscale
```

---

## Camera Angle Changes

**Use nano-banana 3x3 grids**
- Plan camera compositions
- Generate angle variations
- Base off movie shot references

---

## Action Shot Recipe (Fighting)

**For any action shots that require fighting:**

**STEP 1:** kling-2.6 in slow motion (cinematic wide)

↓

**STEP 2:** Mix in close-up shots with sora-2 (fast cuts)

↓

**STEP 3:** Same shot angles, different models

**Example:**
```
WIDE FIGHT (slow-mo) → kling-2.6
CU PUNCH → sora-2 (fast)
WIDE REACTION → kling-2.6 (slow-mo)
CU FACE → sora-2 (fast)
IMPACT → kling-2.6 (slow-mo)
```

---

## Example 1: Action Fight Scene

**SHOT 1**
- Type: WIDE_MASTER (establishing)
- Model: kling-2.6 (slow motion)
- Refs: [ENVIRONMENT_MASTER, CHARACTER_A, CHARACTER_B]
- Prompt: "Two fighters face off, tension, slow motion approach"

↓

**SHOT 2**
- Type: CU_FIST (fast cut)
- Model: sora-2
- Refs: [PREVIOUS_FRAME]
- Prompt: "Fist swings, fast motion blur"

↓

**SHOT 3**
- Type: WIDE_IMPACT (slow-mo)
- Model: kling-2.6
- Refs: [PREVIOUS_FRAME, ENVIRONMENT_MASTER]
- Prompt: "Impact connects, slow motion, debris"

↓

**SHOT 4**
- Type: CU_REACTION (fast)
- Model: sora-2
- Refs: [PREVIOUS_FRAME, CHARACTER_MASTER]
- Prompt: "Face recoils, eyes wide"

↓

**SHOT 5**
- Type: ZOOM_TO_CU (start→end)
- Model: kling-o1
- START: Wide aftermath
- END: Close-up face
- Prompt: "Camera pushes in on victor"

---

## Example 2: Car Chase

**SHOT 1**
- Type: WIDE_HIGHWAY
- Model: kling-2.6 (slow motion)
- Prompt: "Car drifts around corner, sparks fly, cinematic"

↓

**SHOT 2**
- Type: CU_WHEEL (fast)
- Model: sora-2
- Prompt: "Tire screeches, rubber burns"

↓

**SHOT 3**
- Type: CU_DRIVER (talking)
- Model: seedance
- Prompt: "Driver yells, hands grip wheel"
- Audio: Voice + engine SFX

↓

**SHOT 4**
- Type: WIDE_TO_CU (zoom)
- Model: kling-o1
- START: Wide chase shot
- END: Close on driver face
- Prompt: "Camera zooms through action"

---

## Example 3: Dialogue with Action Background

**SHOT 1**
- Type: CU_TALKING (action behind)
- Model: seedance
- Refs: [CHARACTER_MASTER]
- Prompt: "Character speaks, explosions in background"
- Audio: Voice + SFX

↓

**SHOT 2**
- Type: CU_HANDS (showing something)
- Model: seedance
- Refs: [PREVIOUS_FRAME]
- Prompt: "Hands hold object, gestures while talking"

↓

**SHOT 3**
- Type: WIDE_REVEAL
- Model: kling-2.6
- Refs: [PREVIOUS_FRAME, ENVIRONMENT_MASTER]
- Prompt: "Pull back to reveal full scene"

---

## Example 4: VFX Explosion Sequence

**SHOT 1**
- Type: WIDE_SETUP
- Model: kling-2.6
- Prompt: "Building stands, tension"

↓

**SHOT 2**
- Type: EXPLOSION_ZOOM (start→end)
- Model: kling-o1
- START: Building intact
- END: Mid-explosion
- Prompt: "Explosion erupts, camera zooms toward blast"

↓

**SHOT 3**
- Type: CU_DEBRIS (fast)
- Model: sora-2
- Prompt: "Debris flies, glass shatters, fast cuts"

↓

**SHOT 4**
- Type: AFTERMATH_ZOOM (start→end)
- Model: kling-o1
- START: Smoke cloud
- END: Through smoke to survivor
- Prompt: "Camera pushes through smoke"

---

## Ref Types

**CHARACTER_MASTER**
- 3x3 expression grid
- Use in ANY shot with character

↓

**ENVIRONMENT_MASTER**
- 3x3 angle grid
- Use for establishing shots

↓

**PREVIOUS_FRAME**
- Last frame of previous video
- Use for Shot 2+ (always chain)

---

## Ref Stack by Shot Type

| Shot Type | Ref Stack |
|-----------|-----------|
| WIDE (shot 1) | [ENVIRONMENT, CHARACTER] |
| WIDE (shot 2+) | [PREVIOUS_FRAME, ENVIRONMENT, CHARACTER] |
| CU (shot 1) | [CHARACTER] |
| CU (shot 2+) | [PREVIOUS_FRAME, CHARACTER] |
| INSERT | [PREVIOUS_FRAME] |
| TALKING | [PREVIOUS_FRAME, CHARACTER] + audio |
| START→END | [START_IMAGE, END_IMAGE] (same refs for both!) |

---

## Quick Reference

**Model Selection**
```
TALKING + CLOSE-UP + SFX? → seedance
FAST ACTION? QUICK CUTS? → sora-2
CINEMATIC SLOW-MO? FIGHTING? → kling-2.6
ZOOM? VFX? START→END? → kling-o1
JUST LIP SYNC? → veed-fabric
```

↓

**Action Fight Pattern**
```
WIDE (slow-mo) → kling-2.6
CU (fast) → sora-2
WIDE (slow-mo) → kling-2.6
CU (fast) → sora-2
ZOOM → kling-o1
```

↓

**Workflow**
```
1. Plan from movie plots
2. Make ALL refs first
3. Generate shots
4. Vision check everything
5. Fix bad ones OR 8K upscale good ones
```

---

## What Each Model Needs

**sora-2**
- image_url (start frame)
- prompt (motion only)

↓

**kling-2.6**
- image_url (start frame)
- prompt (motion only)

↓

**kling-o1**
- start_image_url
- end_image_url
- prompt (how to get there)

↓

**seedance**
- image_url (face/character)
- audio_url (voice + SFX)
- prompt (action description)

↓

**veed-fabric**
- image_url (face)
- audio_url (voice only)

---

## Chaining Rules

**ALWAYS Chain When:**
- Same scene continuing
- Same lighting
- Shot 2 onwards

**BREAK Chain When:**
- Scene change
- Time jump
- Flashback

**Chain Phrase:**
```
Continue from Image 1. THIS EXACT CHARACTER.
THIS EXACT LIGHTING. THIS EXACT COLOR GRADE.
NO MIRRORING. NO DIRECTION FLIP.
```

---

## Vision Check Rules

After generating, vision checks for:
- Character consistency (same face, clothes)
- Environment consistency (same location)
- Color grade match
- No mirroring/flipping
- Action makes sense
- Follows movie plot logic

**If wrong:** Send back as ref + what to change
**If right:** 8K upscale → approved

---

## Cost Per Shot

| Step | Cost |
|------|------|
| Image | $0.03 |
| 4K Upscale | $0.05 |
| 8K Upscale | $0.08 |
| Video (sora-2) | $0.50 |
| Video (kling-2.6) | $0.35 |
| Video (kling-o1) | $0.45 |
| Video (seedance) | $0.40 |
| Video (veed-fabric) | $0.30 |
| **Average** | **~$0.45** |
