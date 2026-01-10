// Cinema Studio - Higgsfield-style UI for FAL.AI video generation
export { default as CinemaStudio } from './CinemaStudio';
export { default as CameraGrid } from './CameraGrid';
export { default as FrameCanvas } from './FrameCanvas';
export { useCinemaStore, detectBestModel } from './cinemaStore';
export {
  CAMERA_PRESETS,
  PRESET_CATEGORIES,
  LENS_PRESETS,
  CAMERA_BODY_PRESETS,
  FOCUS_PRESETS,
  STYLE_PRESETS,
  LIGHTING_PRESETS,
  ASPECT_RATIO_PRESETS,
  MOTION_SPEED_PRESETS,
  FRAME_RATE_PRESETS,
  ATMOSPHERE_PRESETS,
  TRANSITION_PRESETS,
  DIRECTOR_PRESETS,
  EMOTION_PRESETS,
  SHOT_SETUPS,
  // NEW: Visual design presets
  FRAMING_PRESETS,
  SET_DESIGN_PRESETS,
  COLOR_PALETTE_PRESETS,
  CHARACTER_STYLE_PRESETS,
  combinePresets,
  buildCinemaPrompt
} from './cameraPresets';
export type {
  CameraPreset,
  LensPreset,
  CameraBodyPreset,
  FocusPreset,
  StylePreset,
  LightingPreset,
  AspectRatioPreset,
  MotionSpeedPreset,
  FrameRatePreset,
  AtmospherePreset,
  TransitionPreset,
  DirectorPreset,
  EmotionPreset,
  ShotSetup,
  // NEW: Visual design types
  FramingPreset,
  SetDesignPreset,
  ColorPalettePreset,
  CharacterStylePreset
} from './cameraPresets';
export type { VideoModel, Shot } from './cinemaStore';
