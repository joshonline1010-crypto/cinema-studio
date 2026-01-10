# Cinema Studio - Complete Guide

**Location:** `C:\Users\yodes\Documents\n8n\video-studio`
**URL:** http://localhost:3001/cinema
**Created:** 2026-01-10

---

## QUICK START

```bash
# 1. Start n8n (required for video generation)
C:\Users\yodes\Documents\n8n\start-n8n.bat

# 2. Start Video Studio
cd C:\Users\yodes\Documents\n8n\video-studio
npm run dev

# 3. Open Cinema Studio
http://localhost:3001/cinema

# Login: admin / admin123
```

---

## HOW IT WORKS

```
Cinema Studio UI
       |
       v
/api/cinema/generate (Astro API)
       |
       v
n8n Universal API (/webhook/universal-api)
       |
       v
FAL.AI (Kling O1 / 2.6 / Seedance)
       |
       v
Video URL returned to UI
```

---

## COMPONENTS

### File Structure
```
video-studio/src/components/react/CinemaStudio/
├── index.ts              # Exports all components
├── cameraPresets.ts      # 24+ camera movement presets
├── cinemaStore.ts        # Zustand state management
├── CameraGrid.tsx        # Clickable preset grid
├── FrameCanvas.tsx       # Drag-drop frame upload
└── CinemaStudio.tsx      # Main container

video-studio/src/pages/
├── cinema.astro          # Cinema Studio page
└── api/cinema/
    └── generate.ts       # API endpoint for generation
```

### Key Files
| File | Purpose |
|------|---------|
| `CinemaStudio.tsx` | Main UI component |
| `CameraGrid.tsx` | Camera preset selector |
| `FrameCanvas.tsx` | Frame upload/generation |
| `cinemaStore.ts` | State management |
| `cameraPresets.ts` | All camera movements |
| `generate.ts` | n8n API bridge |

---

## ADDING NEW CAMERA PRESETS

Edit `cameraPresets.ts`:

```typescript
// Add to CAMERA_PRESETS array
{
  id: 'my-new-move',
  name: 'My Move',
  category: 'special',  // dolly | pan | tilt | orbit | zoom | special | static
  prompt: 'my custom motion prompt, cinematic, smooth',
  icon: '🎥',
  description: 'What this movement does'
}
```

---

## CINEMATOGRAPHY CONTROLS

Cinema Studio includes professional cinematography presets beyond just camera movement:

### Camera Bodies / Film Stocks (14 presets)
| Type | Examples |
|------|----------|
| Cinema Cameras | ARRI Alexa, ARRI 65, RED V-Raptor, Sony Venice, Blackmagic URSA |
| Film Stocks | IMAX 70mm, Kodak Vision3 500T, Kodak Vision3 250D, Fuji Eterna |
| Vintage | Super 8, 16mm Bolex, VHS Camcorder, DSLR Cinematic |

### Lenses (12 presets)
| Category | Options |
|----------|---------|
| Wide Angle | 14mm Ultra Wide, 24mm Wide, 35mm |
| Standard | 50mm (human eye perspective) |
| Portrait/Telephoto | 85mm Portrait, 135mm, 200mm Telephoto |
| Special | Anamorphic, Vintage Anamorphic, Macro, Fisheye, Tilt-Shift |

### Focus / DOF (12 presets)
| Type | Options |
|------|---------|
| Depth of Field | Shallow DOF (f/1.4), Medium DOF (f/4), Deep Focus (f/11) |
| Focus Techniques | Rack Focus, Follow Focus, Split Diopter, Soft Focus, Focus In/Out |
| Bokeh Styles | Circular Bokeh, Oval Bokeh (anamorphic), Swirly Bokeh (Helios) |

### Adding New Cinematography Presets

```typescript
// Add to LENS_PRESETS, CAMERA_BODY_PRESETS, or FOCUS_PRESETS
{
  id: 'my-lens',
  name: 'My Lens',
  focalLength: '28mm',  // for lenses only
  prompt: 'shot on 28mm lens, street photography look, environmental portraits',
  icon: '📸',
  description: 'Street photography style'
}
```

The `buildCinemaPrompt()` function automatically combines all selections into the final prompt.

---

## ADDING NEW MODELS

### 1. Update cinemaStore.ts
```typescript
// Add to VideoModel type
export type VideoModel = 'kling-o1' | 'kling-2.6' | 'seedance-1.5' | 'new-model';
```

### 2. Update CinemaStudio.tsx
```typescript
// Add to MODEL_INFO
const MODEL_INFO = {
  // ...existing models
  'new-model': {
    name: 'New Model',
    description: 'What it does'
  }
};
```

### 3. Update generate.ts API
```typescript
// Add case for new model
case 'video-new-model':
  requestBody = {
    type: 'video-new-model',
    image_url,
    prompt
  };
  break;
```

### 4. Update n8n Universal API
Add handler for the new type in your n8n workflow.

---

## CUSTOMIZING THE UI

### Colors
The UI uses Tailwind with custom `vs-*` colors:
```css
/* In tailwind.config.mjs */
colors: {
  'vs-dark': '#0a0a0f',    /* Background */
  'vs-card': '#12121a',    /* Cards */
  'vs-border': '#1e1e2e',  /* Borders */
  'vs-accent': '#8b5cf6',  /* Purple accent */
}
```

### Adding new sections
Edit `CinemaStudio.tsx` - add inside the `<main>` element:
```tsx
{/* Your new section */}
<div className="mb-6">
  <label className="block text-xs text-gray-400 uppercase mb-2">
    Your Section
  </label>
  {/* Your content */}
</div>
```

---

## STATE MANAGEMENT

Using Zustand store (`cinemaStore.ts`):

```typescript
// Access state
const { currentShot, selectedPresets } = useCinemaStore();

// Update state
const { setStartFrame, setMotionPrompt, setModel } = useCinemaStore();
setStartFrame('https://example.com/image.png');
setMotionPrompt('dolly in, cinematic');
setModel('kling-o1');

// Generation flow
startGeneration();
setProgress(50);
completeGeneration('https://example.com/video.mp4');
// or
failGeneration('Error message');
```

---

## API ENDPOINT

`POST /api/cinema/generate`

### Request Body
```json
{
  "type": "video-kling-o1",
  "start_image_url": "https://...",
  "end_image_url": "https://...",
  "prompt": "dolly in, cinematic motion",
  "duration": "5"
}
```

### Types
| Type | Model | Params |
|------|-------|--------|
| `image-video` | nano-banana | prompt |
| `video-kling` | Kling 2.6 | image_url, prompt |
| `video-kling-o1` | Kling O1 | start_image_url, end_image_url, prompt |
| `video-seedance` | Seedance | image_url, prompt |

### Response
```json
{
  "success": true,
  "video_url": "https://fal.media/...",
  "image_url": null,
  "request_id": "abc123"
}
```

---

## FEATURES TO ADD

### Ideas for Advanced Features

1. **Color Consistency Chain**
   - Extract last frame from video
   - Use as base for next shot
   - Automatic color matching

2. **Batch Generation**
   - Queue multiple shots
   - Generate all in sequence
   - Auto-concatenate

3. **Style Presets**
   - Film noir, Golden hour, Cyberpunk
   - Camera specs (ARRI, IMAX)
   - Lens presets (35mm, 50mm)

4. **AI Prompt Suggestions**
   - Based on selected presets
   - Scene analysis from image
   - Motion recommendations

5. **Export Options**
   - Download single video
   - Concatenate timeline
   - Export with transitions
   - Add music/audio

6. **Reference Library**
   - Save favorite frames
   - Style reference images
   - Motion reference videos

---

## TROUBLESHOOTING

### Black Screen
- Check browser console for errors
- Make sure `client:load` is on component in .astro file

### Generation Fails
- Verify n8n is running: http://localhost:5678
- Check Universal API workflow is active
- Check FAL.AI credits

### Slow Loading
- Large images may take time
- Use 2K resolution, not 4K

### No Camera Presets
- Check CameraGrid import in CinemaStudio
- Verify cameraPresets.ts exports

---

## DEVELOPMENT

### Hot Reload
Changes auto-reload when you save files.

### Add Console Logs
```typescript
console.log('Debug:', someValue);
```
Check browser DevTools → Console.

### Test API Directly
```bash
curl -X POST http://localhost:3001/api/cinema/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"image-video","prompt":"a cute cat"}'
```

---

## COSTS

| Action | Cost |
|--------|------|
| Image (nano-banana) | ~$0.03 |
| Video 5s (Kling) | ~$0.35 |
| Video 10s (Kling) | ~$0.70 |
| Seedance | ~$0.30 |

---

*Guide created 2026-01-10*
