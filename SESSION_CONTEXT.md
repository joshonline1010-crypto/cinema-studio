# Cinema Studio - Session Context
**Last Updated:** 2026-01-12

## Quick Start Command (Copy & Paste This)
```
Read these files to get up to speed on Cinema Studio:

1. C:\Users\yodes\Documents\n8n\video-studio\src\components\react\CinemaStudio\CinemaStudio.tsx (main UI - 5000+ lines)
2. C:\Users\yodes\Documents\n8n\video-studio\src\pages\api\cinema\generate.ts (FAL image/video API)
3. C:\Users\yodes\Documents\n8n\video-studio\src\pages\api\cinema\stitch.ts (FFmpeg render with audio mixing)
4. C:\Users\yodes\Documents\n8n\video-studio\src\pages\api\cinema\tts.ts (FAL Dia TTS)
5. C:\Users\yodes\Documents\n8n\video-studio\src\pages\api\ai\chat.ts (Claude AI chat)
6. C:\Users\yodes\Documents\n8n\video-studio\src\components\react\CinemaStudio\aiPromptSystem.ts (AI instructions)

Server: cd "C:\Users\yodes\Documents\n8n\video-studio" && npm run dev
URL: http://localhost:3000/cinema
```

## What Was Completed (Jan 12, 2026)

### Fixes
- **Stale State Bug Fixed**: Refs now properly passed to shots using local Map instead of React state
- **TTS Switched to FAL Dia**: Uses existing FAL credits ($0.04/1000 chars)
- **Audio Mixing**: Voiceover 120% volume, video audio 25% (background)
- **Single Shots**: Changed from 3x3 grids to single cinematic shots for refs
- **Execute Plan**: Runs everything automatically (refs → images → videos → render)
- **dotenv Loading**: Fixed Claude API key loading

### Git Status
- All committed and pushed to origin/master
- Latest commit: "Fix stale state bug - refs now properly passed to shots"

## TODO - What to Work On Next

### High Priority
1. **UI Lag with Large Projects**: Browser slows down with 40+ video elements
   - Solution: Add lazy loading or pagination for shots
   - Consider virtual scrolling for shot list

2. **Auto-Render Not Triggering**: Execute Plan generates everything but doesn't auto-call stitch
   - Need to check if render button click is required or if it should auto-trigger

3. **Shot Order in Stitch**: Videos were sorted alphabetically by URL, not by shot order
   - Need to preserve shot_id order when calling stitch API

### Medium Priority
4. **Dialog/Seedance Integration**: AI generates dialog fields but need to verify Seedance is actually used
5. **Progress Indicator**: Show real-time progress during parallel generation
6. **Error Recovery**: If one video fails, continue with others and allow retry

### Low Priority
7. **Video Preview in UI**: Add inline video player for each shot
8. **Export Plan as JSON**: Save/load plans for reuse
9. **Cost Estimator**: Show estimated FAL cost before execution

## Key Architecture

```
AI Chat → Plan JSON → Execute Plan:
  1. Generate character refs (parallel)
  2. Generate scene refs (parallel)
  3. Generate shot images with refs (parallel, uses edit endpoint)
  4. Compress images for Kling (<10MB)
  5. Generate videos (parallel)
  6. TTS from dialog fields
  7. FFmpeg stitch with audio mixing
  8. Upload to Catbox + save to Downloads
```

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| POST /api/cinema/generate | Image/video generation via FAL |
| POST /api/cinema/stitch | FFmpeg concat + audio mix |
| POST /api/cinema/tts | FAL Dia text-to-speech |
| POST /api/ai/chat | Claude AI for plan generation |
| POST /api/ai/prompt | AI prompt enhancement |

## Important Code Locations

- `executeEntirePlan()` - Line ~792 in CinemaStudio.tsx
- `getRefUrlsFromMap()` - Line ~903 (fixed stale state)
- `buildCharacterSheetPrompt()` - Line ~799 (single shots)
- `buildSceneRefSheetPrompt()` - Line ~805 (single shots)
