/**
 * Video Vocabulary Database
 * Ported from Multi-Angle Studio
 * Based on KLING_COMPLETE_MASTER_GUIDE.txt
 */

import type { VocabItem } from './promptVocabulary';

// === CAMERA MOVEMENTS ===
export const CAMERA_MOVEMENTS: Record<string, VocabItem[]> = {
  dolly: [
    { value: 'dolly_forward', label: 'Dolly Forward', prompt: 'slow dolly shot forward, pushing toward subject' },
    { value: 'dolly_around', label: 'Dolly Around', prompt: 'slow dolly shot around the subject' },
    { value: 'dolly_in', label: 'Dolly In', prompt: "dolly in toward subject's face" },
    { value: 'dolly_out', label: 'Dolly Out', prompt: 'dolly out revealing environment' },
    { value: 'dolly_zoom', label: 'Dolly Zoom (Vertigo)', prompt: 'cinematic dolly zoom, zali effect, camera rush forward, zoom out' }
  ],
  tracking: [
    { value: 'track_side', label: 'Track Side', prompt: 'smooth tracking shot following from the side' },
    { value: 'track_behind', label: 'Track Behind', prompt: 'tracking shot from behind, following subject' },
    { value: 'track_ground', label: 'Track Ground Level', prompt: 'wide shot tracking at ground level following movement' },
    { value: 'simple_follow', label: 'Simple Follow', prompt: 'simple follow shot' }
  ],
  push_pull: [
    { value: 'push_in', label: 'Push In', prompt: 'slow push-in creating intimacy' },
    { value: 'push_in_slow', label: 'Push In (10s)', prompt: 'static medium close-up with slow push-in over 10 seconds' },
    { value: 'pull_back', label: 'Pull Back', prompt: 'pull back revealing the full scene' },
    { value: 'pull_settle', label: 'Pull Back & Settle', prompt: 'camera pulls back then settles' }
  ],
  orbit: [
    { value: 'orbit_slow', label: 'Slow Orbit', prompt: 'camera orbits slowly around subject' },
    { value: 'orbit_180', label: '180 Orbit', prompt: 'slow 180-degree orbit' },
    { value: 'orbit_full', label: '360 Orbit', prompt: 'orbit around subject, 360 rotation, circular track' },
    { value: 'orbit_eye', label: 'Eye Level Orbit', prompt: 'camera circles subject, maintaining eye level' }
  ],
  pan_tilt: [
    { value: 'pan_left', label: 'Pan Left', prompt: 'slow pan left revealing landscape' },
    { value: 'pan_right', label: 'Pan Right', prompt: 'pan right following action' },
    { value: 'tilt_up', label: 'Tilt Up', prompt: 'tilt up from feet to face' },
    { value: 'tilt_down', label: 'Tilt Down', prompt: 'tilt down from sky to subject' },
    { value: 'whip_pan', label: 'Whip Pan', prompt: 'whip pan, fast direction change' }
  ],
  aerial: [
    { value: 'aerial_track', label: 'Aerial Track', prompt: 'wide-angle aerial shot tracking from above' },
    { value: 'drone_rise', label: 'Drone Rise', prompt: 'drone shot rising to reveal vista' },
    { value: 'aerial_push', label: 'Aerial Push', prompt: 'aerial push-in toward subject' },
    { value: 'birds_eye', label: "Bird's Eye", prompt: "bird's eye view slowly descending" },
    { value: 'fpv_dive', label: 'FPV Dive', prompt: 'FPV drone shot, high-speed dive, vertical drop, motion blur' }
  ],
  static: [
    { value: 'static', label: 'Static', prompt: 'static shot, slight movement' },
    { value: 'locked_off', label: 'Locked Off', prompt: 'locked-off camera, subject moves within frame' },
    { value: 'static_wide', label: 'Static Wide', prompt: 'static wide shot from elevated position' },
    { value: 'tripod', label: 'Tripod', prompt: 'static camera, locked off tripod shot' }
  ],
  handheld: [
    { value: 'handheld', label: 'Handheld', prompt: 'slight handheld movement, documentary feel' },
    { value: 'handheld_shake', label: 'Handheld Shake', prompt: 'subtle camera shake, intimate feel' },
    { value: 'handheld_urgent', label: 'Handheld Urgent', prompt: 'handheld following action, urgent energy' },
    { value: 'handheld_doc', label: 'Documentary', prompt: 'handheld documentary style, urgent following shot' }
  ],
  drift: [
    { value: 'drift_around', label: 'Drift Around', prompt: 'camera drifting around subject' },
    { value: 'drift', label: 'Drifting', prompt: 'we are drifting around' },
    { value: 'float', label: 'Floating', prompt: 'gentle floating camera movement' }
  ],
  special: [
    { value: 'crash_zoom', label: 'Crash Zoom', prompt: 'crash zoom, rapid push-in' },
    { value: 'dutch', label: 'Dutch Angle', prompt: 'Dutch angle, tilted frame' },
    { value: 'pov', label: 'POV', prompt: 'aggressive low angle POV camera' },
    { value: 'rack_focus', label: 'Rack Focus', prompt: 'rack focus, focus shift, anamorphic bokeh, slow dolly forward' },
    { value: 'steadicam', label: 'Steadicam', prompt: 'Steadicam following shot' }
  ]
};

// === MOTION DESCRIPTIONS ===
export const MOTION_TYPES: Record<string, VocabItem[]> = {
  human: [
    { value: 'walk_purpose', label: 'Walk Purposefully', prompt: 'walks purposefully' },
    { value: 'stroll', label: 'Stroll', prompt: 'strolls casually' },
    { value: 'run', label: 'Run', prompt: 'runs toward camera' },
    { value: 'sprint', label: 'Sprint', prompt: 'sprints' },
    { value: 'turn_head', label: 'Turn Head', prompt: 'turns head to camera' },
    { value: 'look_shoulder', label: 'Look Over Shoulder', prompt: 'looks over shoulder' },
    { value: 'wave', label: 'Wave', prompt: 'waves hand' },
    { value: 'point', label: 'Point', prompt: 'points at camera' },
    { value: 'reach', label: 'Reach Out', prompt: 'reaches out' }
  ],
  facial: [
    { value: 'blink', label: 'Blink', prompt: 'blinks naturally' },
    { value: 'smile', label: 'Smile Forms', prompt: 'forms slight smile' },
    { value: 'eyes_widen', label: 'Eyes Widen', prompt: 'eyes widen' },
    { value: 'eyes_track', label: 'Eyes Track', prompt: 'eyes track movement' },
    { value: 'gaze_shift', label: 'Gaze Shift', prompt: 'gaze shifts left' }
  ],
  body_parts: [
    { value: 'hair_breeze', label: 'Hair in Breeze', prompt: 'hair moves gently in breeze, then settles' },
    { value: 'dress_flow', label: 'Dress Flows', prompt: 'dress flows with movement' },
    { value: 'cape_billow', label: 'Cape Billows', prompt: 'cape billows behind' },
    { value: 'fingers_drum', label: 'Fingers Drum', prompt: 'fingers drum on table' },
    { value: 'hand_reach', label: 'Hand Reaches', prompt: 'hand reaches for object' }
  ],
  natural: [
    { value: 'leaves_sway', label: 'Leaves Sway', prompt: 'leaves sway gently' },
    { value: 'grass_ripple', label: 'Grass Ripples', prompt: 'grass ripples' },
    { value: 'curtains_flutter', label: 'Curtains Flutter', prompt: 'curtains flutter' },
    { value: 'waves_lap', label: 'Waves Lap', prompt: 'waves lap at shore' },
    { value: 'water_ripple', label: 'Water Ripples', prompt: 'ripples spread, then settle' },
    { value: 'flames_flicker', label: 'Flames Flicker', prompt: 'flames flicker' },
    { value: 'embers_drift', label: 'Embers Drift', prompt: 'embers drift upward' },
    { value: 'smoke_rise', label: 'Smoke Rises', prompt: 'smoke rises and disperses' }
  ],
  objects: [
    { value: 'car_pass', label: 'Car Passes', prompt: 'car drives past' },
    { value: 'wheels_spin', label: 'Wheels Spin', prompt: 'bicycle wheels spin' },
    { value: 'leaves_fall', label: 'Leaves Fall', prompt: 'leaves fall slowly' },
    { value: 'rain_streak', label: 'Rain Streaks', prompt: 'rain drops streak' },
    { value: 'dust_drift', label: 'Dust Drifts', prompt: 'dust particles drift' }
  ]
};

// === SPEED MODIFIERS ===
export const SPEED_MODIFIERS: VocabItem[] = [
  { value: 'ultra_slow', label: 'Ultra Slow Motion', prompt: 'ultra slow motion' },
  { value: 'slow', label: 'Slow Motion', prompt: 'slow motion' },
  { value: 'normal', label: 'Normal Speed', prompt: '' },
  { value: 'fast', label: 'Fast', prompt: 'fast movement' },
  { value: 'rapid', label: 'Rapid', prompt: 'rapid motion' }
];

// === QUALITY MARKERS ===
export const QUALITY_MARKERS: VocabItem[] = [
  { value: 'cinematic', label: 'Cinematic', prompt: 'cinematic' },
  { value: 'detailed', label: 'Extremely Detailed', prompt: 'extremely detailed' },
  { value: 'dof', label: 'Shallow DOF', prompt: 'narrow depth of field' },
  { value: 'blur', label: 'Motion Blur', prompt: 'realistic motion blur' },
  { value: 'filmic', label: 'Filmic', prompt: 'cinematic color grade with filmic look' },
  { value: 'bokeh', label: 'Anamorphic Bokeh', prompt: 'shallow depth of field, anamorphic bokeh' },
  { value: 'grain', label: 'Film Grain', prompt: 'film grain, organic texture' },
  { value: 'preserve', label: 'Preserve Motion', prompt: 'preserve camera motion and timing, keep character identity consistent' }
];

// === VIDEO PRESETS ===
export interface VideoPreset {
  label: string;
  prompt: string;
}

export const VIDEO_PRESETS: Record<string, VideoPreset[]> = {
  simple: [
    { label: 'Slow Dolly Around', prompt: 'slow dolly shot around the subject' },
    { label: 'Push In', prompt: 'slow push-in creating intimacy' },
    { label: 'Static + Blink', prompt: 'static shot, subject blinks naturally, slight smile forms' },
    { label: 'Ultra Slow Mo', prompt: 'ultra slow motion, slow dolly shot around the subject' }
  ],
  cinematic: [
    { label: 'Nike Commercial', prompt: 'slow dolly shot around the subject, ultra slow motion' },
    { label: 'Documentary', prompt: 'slight handheld movement, documentary feel, subtle shake' },
    { label: 'Dolly Zoom', prompt: 'cinematic dolly zoom, zali effect, camera rush forward, zoom out' },
    { label: 'Reveal Shot', prompt: 'camera pulls back revealing the full scene, then settles' }
  ],
  action: [
    { label: 'Aggressive POV', prompt: 'aggressive low angle POV camera' },
    { label: 'Tracking Action', prompt: 'smooth tracking shot following from the side, urgent energy' },
    { label: 'FPV Dive', prompt: 'FPV drone shot, high-speed dive, vertical drop, motion blur' },
    { label: 'Crash Zoom', prompt: 'crash zoom, rapid push-in' }
  ],
  subject_motion: [
    { label: 'Turn & Walk', prompt: 'subject turns and walks away, camera follows' },
    { label: 'Hair + Smile', prompt: 'hair moves gently in breeze, forms slight smile, then settles' },
    { label: 'Look Around', prompt: 'subject looks around, eyes track movement, slight head turn' },
    { label: 'Cape + Run', prompt: 'cape billows behind, subject runs forward, camera tracks alongside' }
  ]
};

// === TRANSFORMATIONS (Kling O1) ===
export interface Transformation {
  label: string;
  template: string;
  examples: string[];
}

export const TRANSFORMATIONS: Record<string, Transformation> = {
  add: {
    label: 'Add Object',
    template: 'add [OBJECT] to @video',
    examples: [
      'add an ancient half-rotted shipwreck into video',
      'add a UFO in the sky',
      'Add the orange cat on the ground into video'
    ]
  },
  remove: {
    label: 'Remove Object',
    template: 'remove [OBJECT] from @video',
    examples: [
      'remove the left pirate',
      'video remove the left character',
      'leave only five people in this video'
    ]
  },
  replace: {
    label: 'Replace',
    template: 'replace [OLD] with [NEW]',
    examples: [
      'car in the video is now @image',
      'replace the left pirate with a weathered ancient Roman stone statue'
    ]
  },
  change: {
    label: 'Change Property',
    template: 'change [PROPERTY] to [VALUE]',
    examples: [
      'change the background to a frozen, cold, and snowy scene',
      "change the character's outfit to red",
      'change the time of day to sunset'
    ]
  },
  style: {
    label: 'Style Transfer',
    template: 'convert @video to [STYLE] style',
    examples: [
      'convert video to anime style',
      'convert video to My Little Pony style',
      'Restyle @video to noir black and white'
    ]
  },
  weather: {
    label: 'Weather Change',
    template: 'Change the weather to [WEATHER]',
    examples: [
      'Change the weather to heavy rain',
      'add thick fog and mist to the scene'
    ]
  },
  camera: {
    label: 'Camera Change',
    template: 'Generate a [ANGLE] of @video',
    examples: [
      'Generate a close-up from the side with depth of field',
      'drone view of @video',
      "bird's eye view of @video"
    ]
  }
};

// === DURATION OPTIONS ===
export interface DurationOption {
  value: string;
  label: string;
  cost: number;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { value: '5', label: '5 seconds', cost: 1 },
  { value: '10', label: '10 seconds', cost: 2 }
];

// === ASPECT RATIOS ===
export interface AspectRatioOption {
  value: string;
  label: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '21:9', label: '21:9 (Cinematic)' }
];

// === VIDEO PROMPT BUILDER ===
export interface VideoPromptOptions {
  cameraMovement?: string;
  motions?: string[];
  speed?: string;
  qualityMarkers?: string[];
  customAdditions?: string;
  endpoint?: string;
}

/**
 * Build video prompt from selections
 */
export function buildVideoPrompt(options: VideoPromptOptions): string {
  const {
    cameraMovement,
    motions = [],
    speed,
    qualityMarkers = [],
    customAdditions = '',
    endpoint = ''
  } = options;

  const parts: string[] = [];

  // Speed first if ultra slow
  if (speed === 'ultra_slow') {
    parts.push('ultra slow motion');
  }

  // Camera movement
  if (cameraMovement) {
    for (const category of Object.values(CAMERA_MOVEMENTS)) {
      const cam = category.find(c => c.value === cameraMovement);
      if (cam) {
        parts.push(cam.prompt);
        break;
      }
    }
  }

  // Subject motions
  for (const motion of motions) {
    for (const category of Object.values(MOTION_TYPES)) {
      const mot = category.find(m => m.value === motion);
      if (mot) {
        parts.push(mot.prompt);
        break;
      }
    }
  }

  // Speed (if not ultra slow, add at end)
  if (speed && speed !== 'ultra_slow' && speed !== 'normal') {
    const speedData = SPEED_MODIFIERS.find(s => s.value === speed);
    if (speedData?.prompt) parts.push(speedData.prompt);
  }

  // Quality markers
  for (const quality of qualityMarkers) {
    const qual = QUALITY_MARKERS.find(q => q.value === quality);
    if (qual?.prompt) parts.push(qual.prompt);
  }

  // Endpoint (important for preventing hangs!)
  if (endpoint) {
    parts.push(endpoint);
  }

  // Custom additions
  if (customAdditions.trim()) {
    parts.push(customAdditions.trim());
  }

  return parts.join(', ');
}

// === MODEL RECOMMENDATION ===
export interface ModelRecommendationOptions {
  hasEndFrame?: boolean;
  hasMultipleElements?: boolean;
  needsTransformation?: boolean;
  needsMotionTransfer?: boolean;
  characterTalks?: boolean;
}

/**
 * Get model decision based on needs
 */
export function getRecommendedModel(options: ModelRecommendationOptions): string {
  const {
    hasEndFrame = false,
    hasMultipleElements = false,
    needsTransformation = false,
    needsMotionTransfer = false,
    characterTalks = false
  } = options;

  if (characterTalks) {
    return 'seedance-1.5';
  }
  if (hasMultipleElements) {
    return 'kling-o1-ref';
  }
  if (hasEndFrame || needsTransformation || needsMotionTransfer) {
    return 'kling-o1';
  }
  return 'kling-2.6';
}

// === FLAT LISTS FOR DROPDOWNS ===
export function getAllCameraMovements(): VocabItem[] {
  return Object.values(CAMERA_MOVEMENTS).flat();
}

export function getAllMotionTypes(): VocabItem[] {
  return Object.values(MOTION_TYPES).flat();
}

export function getCameraMovementCategories(): string[] {
  return Object.keys(CAMERA_MOVEMENTS);
}

export function getMotionTypeCategories(): string[] {
  return Object.keys(MOTION_TYPES);
}
