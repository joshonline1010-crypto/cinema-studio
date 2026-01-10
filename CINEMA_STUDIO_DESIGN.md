# Cinema Studio UI - Design Specification

**Aesthetic Direction:** Cinematic Dark + Film Industry Professional
**Inspired by:** Higgsfield Cinema Studio, DaVinci Resolve, Premiere Pro
**Tech Stack:** Astro + React + Tailwind (existing video-studio)

---

## DESIGN PHILOSOPHY

### Tone: Cinematic Control Room
- **Dark theme** with subtle film grain texture
- **Teal/Orange** color accents (cinematic grade palette)
- **Monospace fonts** for technical data, **Display fonts** for headers
- **Grid-based** camera preset selector
- **Film strip** visual metaphor for timeline

### Key Differentiator
The **Camera Movement Grid** - a visual grid where each cell represents a camera movement, clickable with instant preview animations showing the motion path.

---

## COLOR PALETTE

```css
:root {
  /* Base */
  --bg-primary: #0a0a0b;       /* Near black */
  --bg-secondary: #141416;     /* Dark panels */
  --bg-elevated: #1a1a1e;      /* Cards, dropdowns */
  --bg-hover: #252529;         /* Hover states */

  /* Accents - Cinematic Grade */
  --accent-teal: #00d4aa;      /* Primary action */
  --accent-orange: #ff6b35;    /* Secondary/warning */
  --accent-gold: #ffd700;      /* Premium/highlight */

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;

  /* Borders */
  --border-subtle: #2a2a2e;
  --border-focus: #00d4aa;

  /* Film grain overlay */
  --grain-opacity: 0.03;
}
```

---

## TYPOGRAPHY

```css
/* Headers - Cinematic feel */
font-family: 'Bebas Neue', 'Impact', sans-serif;

/* Body - Technical precision */
font-family: 'JetBrains Mono', 'SF Mono', monospace;

/* UI Elements */
font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
```

---

## LAYOUT STRUCTURE

```
+------------------------------------------------------------------+
|  HEADER: Logo | Project Name | [Generate] [Export] | User        |
+------------------------------------------------------------------+
|         |                                          |              |
|  CAMERA |         CANVAS / PREVIEW                 |   TIMELINE   |
|  PRESETS|     (Start Frame | End Frame)            |   / SHOTS    |
|   GRID  |                                          |              |
|         |     [Upload] [Generate] [AI Suggest]     |   Shot 1     |
|  50+    |                                          |   Shot 2     |
|  moves  |     ======= MOTION PATH =======          |   Shot 3     |
|         |                                          |   ...        |
|         +------------------------------------------+              |
|         |         PROMPT / SETTINGS                |              |
|         |  [Duration] [Aspect] [Model] [CFG]       |              |
+---------+------------------------------------------+--------------+
|                    STATUS BAR: Credits | Queue | Connection      |
+------------------------------------------------------------------+
```

---

## COMPONENT SPECIFICATIONS

### 1. Camera Movement Grid

```
+-------+-------+-------+-------+
| Dolly | Dolly | Pan   | Pan   |
|  In   |  Out  | Left  | Right |
+-------+-------+-------+-------+
| Tilt  | Tilt  | Orbit | Orbit |
|  Up   |  Down | Left  | Right |
+-------+-------+-------+-------+
| Zoom  | Zoom  | Hand- | Static|
|  In   |  Out  | held  |       |
+-------+-------+-------+-------+
| Crash | Bullet| FPV   | Crane |
| Zoom  | Time  | Drone |  Up   |
+-------+-------+-------+-------+
```

**Each cell:**
- 80x80px minimum
- Hover: animated icon showing motion path
- Selected: teal border glow
- Stack up to 3 (shows combined indicator)

### 2. Start/End Frame Canvas

```
+---------------------------+    +---------------------------+
|                           |    |                           |
|     START FRAME           | -> |     END FRAME             |
|                           |    |                           |
|   [Drop image here]       |    |   [Drop image or leave    |
|   [or Generate]           |    |    empty for single]      |
|                           |    |                           |
+---------------------------+    +---------------------------+
         |                                   |
         +------- MOTION PATH LINE ----------+
                 (animated dots)
```

### 3. Model Selector

```
+------------------------------------------+
|  MODEL SELECTION                          |
+------------------------------------------+
|  [x] Kling O1      Start/End frames      |
|  [ ] Kling 2.6     Action, motion        |
|  [ ] Seedance 1.5  Character speaks      |
+------------------------------------------+
|  Auto-detect based on:                   |
|  - Has end frame? -> Kling O1            |
|  - Has dialogue? -> Seedance             |
|  - Default -> Kling 2.6                  |
+------------------------------------------+
```

### 4. Timeline / Shot List

```
+----------------------------------+
|  SHOTS                    [+Add] |
+----------------------------------+
|  01 | [thumb] | Dolly In  | 5s  |
|  02 | [thumb] | Orbit     | 5s  |
|  03 | [thumb] | Static    | 3s  |
+----------------------------------+
|  [Concatenate All]               |
+----------------------------------+
```

### 5. Prompt Input

```
+------------------------------------------+
|  MOTION PROMPT                            |
+------------------------------------------+
|  [                                      ] |
|  [  Character advances slowly...        ] |
|  [                                      ] |
+------------------------------------------+
|  Suggested: "dolly in, cinematic"        |
|  (based on camera selection)             |
+------------------------------------------+
```

---

## INTERACTIONS

### Camera Preset Selection
1. Click single preset → selected (teal glow)
2. Shift+click → add to stack (up to 3)
3. Hover → animated preview of motion
4. Double-click → auto-fill prompt

### Frame Upload
1. Drag & drop image onto canvas
2. Or click to open file browser
3. Or type prompt → generate with nano-banana
4. Paste URL directly

### Generate Video
1. Select camera move(s)
2. Upload/generate frames
3. (Optional) Write motion prompt
4. Click [Generate]
5. Progress bar with status
6. Preview when complete

### Shot Sequence
1. Add shots to timeline
2. Drag to reorder
3. Click [Concatenate] to merge
4. Option for crossfade transitions

---

## ANIMATIONS

### Camera Preset Hover
```css
@keyframes dolly-in {
  0% { transform: scale(1) translateZ(0); }
  100% { transform: scale(1.2) translateZ(20px); }
}

@keyframes orbit {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes pan-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-20px); }
}
```

### Motion Path
```css
@keyframes motion-dots {
  0% { left: 0; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
```

### Film Grain Overlay
```css
.film-grain {
  background-image: url("data:image/svg+xml,...");
  opacity: var(--grain-opacity);
  pointer-events: none;
  animation: grain 0.5s steps(10) infinite;
}
```

---

## API INTEGRATION

### Backend Endpoints (n8n webhooks)

```javascript
// Generate image
POST /webhook/universal-api
{ type: "image-video", prompt: "..." }

// Generate video (Kling O1)
POST /webhook/universal-api
{
  type: "video-kling-o1",
  start_image_url: "...",
  end_image_url: "...",
  prompt: "dolly in, cinematic"
}

// Generate video (Kling 2.6)
POST /webhook/universal-api
{
  type: "video-kling",
  image_url: "...",
  prompt: "character walks forward"
}

// Concatenate shots
POST /webhook/ffmpeg-concat
{
  videos: ["url1", "url2", "url3"],
  output_name: "final_sequence"
}
```

---

## RESPONSIVE BEHAVIOR

### Desktop (1920+)
- Full 3-column layout
- Camera grid: 4x4
- Large preview canvas

### Laptop (1440)
- 2-column (camera + canvas merged)
- Timeline at bottom
- Camera grid: 3x4

### Tablet (1024)
- Single column
- Collapsible panels
- Camera grid: 4x3

---

## FILE STRUCTURE

```
video-studio/src/
├── components/react/
│   ├── CinemaStudio/
│   │   ├── CinemaStudio.tsx      # Main container
│   │   ├── CameraGrid.tsx        # 50+ camera presets
│   │   ├── FrameCanvas.tsx       # Start/End frame dropzone
│   │   ├── MotionPath.tsx        # Animated connection line
│   │   ├── ModelSelector.tsx     # Kling O1/2.6/Seedance
│   │   ├── PromptInput.tsx       # Motion prompt with suggestions
│   │   ├── Timeline.tsx          # Shot sequence list
│   │   ├── GenerateButton.tsx    # Main action button
│   │   └── index.ts              # Exports
│   └── ...existing components
├── stores/
│   └── cinemaStore.ts            # Zustand state for cinema studio
├── styles/
│   └── cinema.css                # Cinema-specific styles
└── pages/
    └── cinema.astro              # Cinema studio page
```

---

## NEXT STEPS

1. [ ] Create CinemaStudio.tsx main component
2. [ ] Create CameraGrid.tsx with 50+ presets
3. [ ] Create FrameCanvas.tsx with drag-drop
4. [ ] Create cinemaStore.ts for state management
5. [ ] Add /cinema route to video-studio
6. [ ] Connect to n8n Universal API
7. [ ] Add shot timeline + concatenation

---

*Design specification created 2026-01-10*
