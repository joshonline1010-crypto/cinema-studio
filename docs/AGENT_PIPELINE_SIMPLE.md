# AI2 Studio Agent Pipeline - Simple Guide

## Core Concept

15 agents think about your concept, then 6 steps generate the video.
- Each agent has ONE job
- Outputs flow to next agent
- Director picks the video model for each shot

---

## The Pipeline at a Glance

```
USER: "Lamborghini truck commercial"
         ↓
  15 Planning Phases
         ↓
  6 Generation Steps
         ↓
  FINAL VIDEO
```

---

## Phase 1: Story Analyst

**THINKS ABOUT:**
- What type of story? (commercial, drama, action)
- What emotional arc? (calm → intense → triumphant)
- Which director style? (Spielberg, Bay, Kubrick)

↓

**OUTPUTS:**
- story_type: "commercial"
- emotional_arc: "awe → thrill → desire"
- recommended_director: "Michael Bay"

---

## Phase 2: Beat Planner

**THINKS ABOUT:**
- How many beats for this duration?
- Where does energy peak?
- What changes between beats?

↓

**OUTPUTS:**
```
BEAT 1: HOOK - Truck emerges, energy: 3
BEAT 2: POWER - Engine roars, energy: 5
BEAT 3: BEAUTY - Hero shot, energy: 4
BEAT 4: TAGLINE - Logo, energy: 2
```

---

## Phase 4: Director (KEY DECISION MAKER)

**THINKS ABOUT:**
- What shot type for each beat?
- Which VIDEO MODEL for each shot?
- Does anyone speak? (→ lip sync)
- Is it close-up? (→ sora-2)

↓

**OUTPUTS:**
```
SHOT 1: WIDE_MASTER
  video_model: kling-2.6
  reason: "Establishing shot, no dialogue"

SHOT 2: CU_GRILLE
  video_model: sora-2
  reason: "Close-up detail - Sora excels"

SHOT 3: CU_DRIVER (speaks)
  video_model: veed-fabric
  reason: "Lip sync needed"
```

---

## Video Model Decision Tree

```
Does character SPEAK with visible face?
├── YES → veed-fabric (lip sync)
│
└── NO
    ├── CLOSE-UP or DETAIL?
    │   └── YES → sora-2 (fast + quality)
    │
    ├── Start→End transition?
    │   └── YES → kling-o1
    │
    └── WIDE/MEDIUM action
        └── kling-2.6
```

---

## Model Quick Reference

| Model | Best For | Cost |
|-------|----------|------|
| sora-2 | Close-ups, details, bursts | $0.50 |
| kling-2.6 | Wide/medium action | $0.35 |
| kling-o1 | Start→End transitions | $0.45 |
| veed-fabric | Lip sync | $0.30 |

---

## Sora-2 Burst Patterns

When Director detects these moments, it plans rapid Sora-2 sequences:

**STORY TURN** (emotion shift)
```
CU_FACE → CU_HANDS → ECU_EYES → CU_BODY
```

↓

**VEHICLE PERFORMANCE** (great for commercials!)
```
CU_GEAR_SHIFT → CU_GAUGE → CU_STEERING → CU_PEDAL → CU_DRIVER_FACE
```

↓

**PRE-IMPACT** (something about to hit)
```
CU_PROJECTILE → CU_DIFF_ANGLE → CU_TARGET_REACT → IMPACT
```

↓

**DESTRUCTION CASCADE**
```
IMPACT → PART_A → PART_B → DEBRIS → AFTERMATH
```

---

## Phases 5-15 (Quick Summary)

**Phase 5: Scriptwriter**
- Writes dialogue lines
- Knows lip_sync vs voiceover

↓

**Phase 6: World Engineer**
- 3D world, camera rigs
- Entity positions

↓

**Phases 7-9: Ref Planning**
- CHARACTER_MASTER (3x3 expression grid)
- ENVIRONMENT_MASTER (3x3 angle grid)
- Chaining strategy

↓

**Phase 10: Shot Compiler**
- Final prompts with all refs
- "THIS EXACT CHARACTER" anchors

↓

**Phase 11: Audio Planner**
- Locked voice_id per character
- Music cues, SFX markers

↓

**Phase 13: Editor Advisor**
- target_duration_ms (trim 5s → 1.5s)
- cut_triggers, speed control

↓

**Phase 14: Producer**
- Cost estimates
- Generation order

---

## Generation Steps (AI2Studio.tsx)

**STEP 1: Generate Refs**
- CHARACTER_MASTER grid
- ENVIRONMENT_MASTER grid

↓

**STEP 2: Ref Approval**
- User approves/rejects

↓

**STEP 3: Generate Images (Two-Phase)**
- PHASE 1: BASE shots first
- PHASE 2: NON-BASE with base refs

↓

**STEP 4: Image Approval**
- ✓ Approved
- ✗ Rejected
- 🔄 Regenerate

↓

**STEP 5: Generate Videos**
- Compress to <10MB
- Route to correct model
- Frame chaining option

↓

**STEP 6: Stitch**
- FFmpeg concat
- Upload to Catbox
- Final URL

---

## Key Rules

1. **Director picks video_model** for each shot - not random
2. **Close-ups → sora-2** - fast and high quality
3. **Wide shots → kling-2.6** - handles full body
4. **Speaking + face visible → veed-fabric** - lip sync
5. **Burst patterns** - rapid sora-2 cuts for intensity
6. **Frame chaining** - last frame → next start for continuity
7. **Two-phase images** - base shots first, then others with refs

---

## Cost per Shot

| Step | Cost |
|------|------|
| Image (nano-banana) | $0.03 |
| 4K Upscale | $0.05 |
| Video (average) | $0.35 |
| **Total per shot** | **~$0.43** |

---

## Files Location

```
C:\Users\yodes\Documents\n8n\video-studio\src\components\react\AI2Studio\
├── AI2Studio.tsx           ← Main UI
└── agents/
    ├── storyAnalystAgent.ts
    ├── beatPlannerAgent.ts
    ├── directorAgent.ts    ← KEY: model selection
    ├── shotCompilerAgent.ts
    ├── audioPlannerAgent.ts
    └── unifiedPipelineV2.ts ← Orchestrator
```
