/**
 * KLING VIDEO PROMPT BUILDER
 * Based on complete Kling 2.6 + O1 master guide research
 *
 * GOLDEN RULES:
 * 1. VIDEO PROMPTS = MOTION ONLY (image has all visual info)
 * 2. Keep video prompts SIMPLE (complex = distortion)
 * 3. ONE camera movement at a time
 * 4. ADD MOTION ENDPOINTS (prevents 99% hang)
 * 5. Use POWER VERBS (walking, running, flickering, billowing)
 * 6. 2K resolution for Kling (4K too large)
 */

// ============================================================================
// TYPES
// ============================================================================

export type VideoModel = 'kling-2.6' | 'kling-o1' | 'seedance-1.5';

export interface VideoPromptConfig {
  // Camera movement (ONE only!)
  cameraMovement?: string;

  // Subject motion
  subjectMotion?: string;

  // Background motion (optional)
  backgroundMotion?: string;

  // Motion endpoint (REQUIRED to prevent hang!)
  motionEndpoint?: string;

  // For O1: start/end frame transition
  isStartEndTransition?: boolean;
  transitionDescription?: string;
}

export interface StartEndConfig {
  // What changes between frames
  subjectChange: string;        // "Character turns around"
  cameraChange?: string;        // "Dolly in toward face"
  environmentChange?: string;   // "Light transitions from golden to twilight"
  emotionalArc?: string;        // "Intensity builds"
}

// ============================================================================
// MODEL SELECTION DECISION TREE
// ============================================================================

export interface ModelDecision {
  model: VideoModel;
  reason: string;
  params: {
    startImageParam: string;   // image_url vs start_image_url
    endImageParam?: string;    // end_image_url if applicable
  };
}

/**
 * Decide which Kling model to use based on requirements
 */
export function selectVideoModel(
  characterTalks: boolean,
  hasStartEndTransition: boolean,
  needsMultiReference: boolean
): ModelDecision {
  // Decision tree from the guide
  if (characterTalks) {
    return {
      model: 'seedance-1.5',
      reason: 'Character speech requires Seedance for lip sync',
      params: {
        startImageParam: 'image_url',
        endImageParam: 'end_image_url'
      }
    };
  }

  if (hasStartEndTransition) {
    return {
      model: 'kling-o1',
      reason: 'START→END frame transition requires Kling O1',
      params: {
        startImageParam: 'start_image_url',
        endImageParam: 'end_image_url'
      }
    };
  }

  if (needsMultiReference) {
    return {
      model: 'kling-o1',
      reason: 'Multi-reference composition requires Kling O1 reference-to-video',
      params: {
        startImageParam: 'image_urls',
        endImageParam: undefined
      }
    };
  }

  // Default: Simple image-to-video with Kling 2.6
  return {
    model: 'kling-2.6',
    reason: 'Simple animation - Kling 2.6 is best value',
    params: {
      startImageParam: 'image_url',
      endImageParam: undefined
    }
  };
}

// ============================================================================
// CAMERA MOVEMENT VOCABULARY (Complete from guide)
// ============================================================================

export const CAMERA_MOVEMENTS = {
  // TRACKING SHOTS
  tracking_ground: 'Wide shot tracking at ground level following movement',
  tracking_side: 'Smooth tracking shot following from the side',
  tracking_behind: 'Tracking shot from behind, following subject',

  // DOLLY MOVEMENTS
  dolly_forward: 'Slow dolly shot forward',
  dolly_around: 'Slow dolly shot around the subject',
  dolly_in: 'Dolly in toward subject',
  dolly_out: 'Dolly out revealing environment',

  // PUSH/PULL
  push_in: 'Slow push-in creating intimacy',
  push_in_10s: 'Static medium close-up with slow push-in over 10 seconds',
  pull_back: 'Pull back revealing the full scene, then settles',

  // ORBIT/ROTATE
  orbit_slow: 'Camera orbits slowly around subject',
  orbit_180: 'Slow 180-degree orbit',
  orbit_eye_level: 'Camera circles subject, maintaining eye level',
  orbit_stop: 'Rotating around at steady pace, then stops',

  // PAN/TILT
  pan_left: 'Slow pan left revealing landscape',
  pan_right: 'Pan right following action',
  tilt_up: 'Tilt up from feet to face',
  tilt_down: 'Tilt down from sky to subject',

  // AERIAL/DRONE
  aerial_track: 'Wide-angle aerial shot tracking from above',
  drone_rise: 'Drone shot rising to reveal vista',
  aerial_push: 'Aerial push-in toward subject',
  birds_eye_descend: 'Bird\'s eye view slowly descending',
  fpv_dive: 'FPV drone shot, high-speed dive, vertical drop, motion blur',

  // STATIC
  static: 'Static shot, slight movement',
  static_locked: 'Locked-off camera, subject moves within frame',
  static_elevated: 'Static wide shot from elevated position',

  // HANDHELD
  handheld_slight: 'Slight handheld movement, documentary feel',
  handheld_subtle: 'Subtle camera shake, intimate feel',
  handheld_urgent: 'Handheld following action, urgent energy',

  // DRIFT
  drift_around: 'Camera drifting around subject',
  drift_floating: 'Gentle floating camera movement',

  // ADVANCED
  dolly_zoom: 'Cinematic dolly zoom, zali effect',
  rack_focus: 'Rack focus, focus shift',
  steadicam: 'Steadicam following shot',
  whip_pan: 'Whip pan, fast direction change',
  crash_zoom: 'Crash zoom, rapid push-in',
  crane_up: 'Crane up, rotate counterclockwise'
};

// ============================================================================
// MOTION DESCRIPTIONS (Actions & Movement)
// ============================================================================

export const SUBJECT_MOTIONS = {
  // Human actions
  walk_purpose: 'walks purposefully, then stops',
  walk_casual: 'strolls casually, then pauses',
  walk_toward: 'walks toward camera, then stops and looks up',
  run_sprint: 'sprints forward, then slows to stop',
  turn_camera: 'turns head to camera, then holds gaze',
  turn_around: 'spins around, then faces forward',
  look_over: 'looks over shoulder, then turns back',

  // Gestures
  wave: 'waves hand, then lowers arm',
  point: 'points at camera, then arm drops',
  reach: 'reaches out with hand, then pulls back',

  // Facial
  blink: 'blinks naturally, forms slight smile',
  smile: 'forms slight smile, holds expression',
  eyes_widen: 'eyes widen in surprise, then settle',

  // Body parts
  hair_wind: 'hair gently moves in breeze, then settles back into place',
  hair_settle: 'hair moves with movement, then rests',
  clothing_flow: 'dress flows with movement, then settles',
  cape_billow: 'cape billows behind, then drapes down',

  // Emotional
  tears: 'tears well up, single tear falls',
  laugh: 'laughs briefly, then quiets',
  gasp: 'gasps in shock, hand to chest'
};

export const BACKGROUND_MOTIONS = {
  // Natural elements
  wind_leaves: 'leaves sway gently, then still',
  wind_grass: 'grass ripples in breeze, then settles',
  wind_curtains: 'curtains flutter, then rest',

  // Water
  waves_lap: 'waves lap at shore, then recede',
  ripples: 'ripples spread across surface, then gentle waves settle',
  waterfall: 'water falls continuously',

  // Fire/Smoke
  flames: 'flames flicker and dance',
  embers: 'embers drift upward, then dissipate',
  smoke: 'smoke rises and disperses slowly',

  // Objects
  car_pass: 'car drives past in background',
  leaves_fall: 'leaves fall slowly to ground',
  rain: 'rain drops streak down',
  dust: 'dust particles drift in light beam'
};

// Power verbs that produce better results
export const POWER_VERBS = [
  'WALKING', 'RUNNING', 'FLICKERING', 'POURING',
  'CHARGING', 'BILLOWING', 'DRIFTING', 'SWAYING',
  'SPINNING', 'COLLAPSING', 'ERUPTING', 'CRASHING'
];

// Weak verbs to avoid
export const AVOID_VERBS = [
  'moving', 'going', 'visible', 'slowly', 'gently',
  'being', 'having', 'appearing'
];

// ============================================================================
// MAIN VIDEO PROMPT BUILDER (Kling 2.6)
// ============================================================================

/**
 * Build a video prompt for Kling 2.6 image-to-video
 *
 * TEMPLATE: "[CAMERA MOVEMENT], [SUBJECT MOTION], [BACKGROUND MOTION], [ENDPOINT]"
 *
 * CRITICAL: Video prompt = MOTION ONLY. Image has all visual info!
 */
export function buildVideoPrompt(config: VideoPromptConfig): string {
  const parts: string[] = [];

  // Camera movement (ONE only!)
  if (config.cameraMovement) {
    const movement = CAMERA_MOVEMENTS[config.cameraMovement as keyof typeof CAMERA_MOVEMENTS]
      || config.cameraMovement;
    parts.push(movement);
  }

  // Subject motion
  if (config.subjectMotion) {
    const motion = SUBJECT_MOTIONS[config.subjectMotion as keyof typeof SUBJECT_MOTIONS]
      || config.subjectMotion;
    parts.push(motion);
  }

  // Background motion (optional)
  if (config.backgroundMotion) {
    const bgMotion = BACKGROUND_MOTIONS[config.backgroundMotion as keyof typeof BACKGROUND_MOTIONS]
      || config.backgroundMotion;
    parts.push(bgMotion);
  }

  // Motion endpoint (CRITICAL - prevents 99% hang)
  if (config.motionEndpoint) {
    parts.push(config.motionEndpoint);
  } else if (!hasEndpoint(parts.join(', '))) {
    // Auto-add endpoint if missing
    parts.push('movement settles');
  }

  return parts.join(', ');
}

/**
 * Check if prompt already has a motion endpoint
 */
function hasEndpoint(prompt: string): boolean {
  const endpoints = [
    'settles', 'stops', 'holds', 'rests', 'pauses',
    'freezes', 'lands', 'dissipates', 'quiets', 'slows'
  ];
  return endpoints.some(e => prompt.toLowerCase().includes(e));
}

// ============================================================================
// START→END TRANSITION BUILDER (Kling O1)
// ============================================================================

/**
 * Build a video prompt for Kling O1 START→END frame transitions
 *
 * Use when you have both a start frame and end frame and want smooth interpolation
 */
export function buildStartEndPrompt(config: StartEndConfig): string {
  const parts: string[] = [];

  // Subject change (what happens to character)
  parts.push(config.subjectChange);

  // Camera change
  if (config.cameraChange) {
    parts.push(config.cameraChange);
  }

  // Environment change
  if (config.environmentChange) {
    parts.push(config.environmentChange);
  }

  // Emotional arc
  if (config.emotionalArc) {
    parts.push(config.emotionalArc);
  }

  // Add quality markers
  parts.push('Extremely detailed, cinematic, narrow depth of field, realistic motion blur');

  return parts.join('. ');
}

// ============================================================================
// O1 REFERENCE SYNTAX
// ============================================================================

export const O1_REFERENCE_SYNTAX = {
  // @ Reference tags
  video: '@Video',      // Reference video for motion
  image1: '@Image1',    // First uploaded image
  image2: '@Image2',    // Second uploaded image
  element: '@Element',  // Named character/object element

  // Example prompts
  examples: {
    characterInScene: '@Element1 standing in @Image1 environment. Cinematic lighting.',
    characterWalking: '@Element1 walking confidently through @Image1. Camera follows. Dolly forward.',
    imageAsStart: 'Take @Image1 as the start frame. @Element1 enters from left. Cinematic.',
    twoCharacters: '@Element1 and @Element2 talking in @Image1. Medium shot. Shallow depth of field.',
    videoContinuation: '@Video Create the next shot, extremely detailed, narrow depth of field, camera shake',
    motionPreserve: 'KEEP THE MOTION THE SAME',
    fullCombo: 'Use the camera motion from @Video to have @Element in @Image1 environment'
  }
};

// ============================================================================
// TRANSFORMATION COMMANDS (Kling O1)
// ============================================================================

export const TRANSFORMATION_COMMANDS = {
  add: 'add [object] to @video',
  remove: 'remove [object] from @video',
  change: 'change [property] to [new value]',
  replace: '[object] in @video is now @image',
  style: 'convert @video to [style] style',
  camera: 'Generate a close-up from the side with depth of field',
  weather: 'Change the weather to [weather description]',
  background: 'Change the background of @video to [description]'
};

// ============================================================================
// QUICK TEMPLATES
// ============================================================================

export const VIDEO_TEMPLATES = {
  // Simple camera moves
  simple: {
    dolly_around: 'slow dolly shot around the subject',
    push_in: 'Slow push-in on face, subtle movement, then holds',
    orbit: 'camera orbits slowly around subject, then settles',
    static: 'static shot, subtle breathing motion'
  },

  // With subject motion
  withSubject: {
    turn: 'Camera slowly orbits left, subject turns head toward camera, then holds gaze',
    walk: 'Tracking shot following from side, subject walks purposefully, then stops',
    smile: 'Slow push-in, subject blinks naturally, forms slight smile, holds',
    hair: 'Camera slowly orbits, hair moves gently in breeze, then settles'
  },

  // Full motion description
  full: {
    emotional: 'Camera slowly orbits left, subject blinks naturally, forms slight smile, hair moves gently as if in soft breeze, background remains mostly static, movement settles',
    action: 'Subject lunges forward, cape billows behind, camera follows the motion, dust kicks up from ground, action completes with landing pose',
    dramatic: 'Slow dolly in toward face, eyes narrow with intensity, slight trembling, then stillness'
  },

  // START→END transitions (Kling O1)
  startEnd: {
    turnAway: 'Character turns and walks away. Slow dolly follow. Hair flows with movement. Cinematic.',
    zoomIn: 'Dolly in toward face. Emotional intensity builds. Shallow depth of field.',
    dayToNight: 'Light transitions from golden morning to twilight. Character looks up at changing sky.',
    stateChange: 'Character transforms from calm to alert. Eyes widen. Posture shifts.'
  },

  // Continuations (Kling O1)
  continuation: {
    nextShot: '@Video Create the next shot, extremely detailed, narrow depth of field, cinematic',
    keepMotion: 'KEEP THE MOTION THE SAME, [new description]',
    transferMotion: 'Animate the character in @Image1 using the exact movement from @Video'
  },

  // SEEDANCE 1.5 - Dialogue & Lip Sync Templates
  seedance: {
    // Basic UGC talking head
    ugc_basic: 'Medium close-up, eye level, soft bokeh background. Subject speaks directly to camera with natural expressions. Slow push-in, focus on eyes. She speaks confidently: "[DIALOGUE]". Cinematic UGC style, clean audio.',

    // Energetic creator
    ugc_energetic: 'Close-up, slightly low angle for confidence. Animated expressions, casual outfit. Handheld slight movement, dynamic energy. He speaks excitedly: "[DIALOGUE]". High energy, bright natural light.',

    // Product presenter
    product_demo: 'Medium shot, presenter slightly off-center, product prominent. Professional appearance, warm genuine smile. Camera slowly pushes in. She explains: "[DIALOGUE]". Clean commercial lighting.',

    // Emotional close-up
    emotional: 'Close-up on face, soft focus on eyes. Subtle micro-expressions, emotional depth. Static camera with slight handheld warmth. She whispers: "[DIALOGUE]". Quiet, contemplative atmosphere.',

    // Interview style
    interview: 'Medium close-up, subject slightly off-center, soft bokeh. Professional, natural pauses, thoughtful expression. Slow subtle push-in during emotional moments. She reflects: "[DIALOGUE]". Documentary lighting.',

    // Two characters dialogue
    dialogue_two: 'Medium shot, two people facing each other. Character on left speaks first: "[DIALOGUE1]". Camera slowly dollies right to capture reaction. Second character responds: "[DIALOGUE2]". Natural room ambience.',

    // Social media hook
    social_hook: 'Extreme close-up, direct eye contact. Confident expression, one eyebrow raised. Slight lean toward camera. He asks: "[DIALOGUE]". Punchy rhythm, immediate engagement.',

    // Multi-language
    mandarin: 'Medium close-up, professional setting. Subject speaks in fluent Mandarin with professional tone: "[DIALOGUE]". Clean audio, subtle office ambience.',
    spanish: 'Close-up, vibrant colorful background. Animated expressions, expressive gestures. She speaks enthusiastically in Spanish: "[DIALOGUE]". Warm lighting.',
    japanese: 'Medium shot, minimal modern setting. Calm demeanor, measured pacing. He speaks in polite Japanese: "[DIALOGUE]". Serene atmosphere.'
  }
};

// SEEDANCE DIALOGUE HELPER
export function buildSeedanceDialoguePrompt(
  template: keyof typeof VIDEO_TEMPLATES.seedance,
  dialogue: string,
  options?: {
    dialogue2?: string;
    characterDescription?: string;
    emotion?: 'warm' | 'excited' | 'calm' | 'sad' | 'angry' | 'playful';
    cameraMovement?: 'static' | 'push-in' | 'orbit' | 'handheld';
  }
): string {
  let prompt = VIDEO_TEMPLATES.seedance[template];

  // Replace dialogue placeholder
  prompt = prompt.replace('[DIALOGUE]', dialogue);
  if (options?.dialogue2) {
    prompt = prompt.replace('[DIALOGUE1]', dialogue);
    prompt = prompt.replace('[DIALOGUE2]', options.dialogue2);
  }

  // Add emotion modifier
  if (options?.emotion) {
    const emotionMap: Record<string, string> = {
      warm: 'speaks warmly with genuine affection',
      excited: 'exclaims enthusiastically',
      calm: 'says calmly with measured pacing',
      sad: 'whispers with barely contained emotion',
      angry: 'states firmly with controlled intensity',
      playful: 'teases with mischievous tone'
    };
    prompt = prompt.replace('speaks', emotionMap[options.emotion] || 'speaks');
  }

  return prompt;
}

// ============================================================================
// WHAT WORKS / WHAT FAILS
// ============================================================================

export const WORKS_WELL = [
  'Close-ups (less for model to process)',
  'Simple camera movements',
  'Slow motion',
  'Subject-focused shots',
  'Single clear action',
  'Dolly zoom / Vertigo effect (incredible in Kling 2.6)',
  'Parallax depth effects',
  'Physics-based cloth/hair simulation'
];

export const STRUGGLES = [
  'Bullet time / Matrix effect (never worked in tests)',
  'FPV / First person view (inconsistent)',
  'Complex multi-movement shots',
  'Wide shots with lots of elements',
  'Multiple simultaneous camera moves',
  'Open-ended motion without endpoints (causes 99% hang)'
];

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate video prompt follows Kling best practices
 */
export function validateVideoPrompt(prompt: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for multiple camera movements
  const cameraKeywords = ['dolly', 'orbit', 'pan', 'tilt', 'zoom', 'track', 'crane', 'push', 'pull'];
  const foundCameraWords = cameraKeywords.filter(k => prompt.toLowerCase().includes(k));
  if (foundCameraWords.length > 1) {
    warnings.push(`Multiple camera movements detected (${foundCameraWords.join(', ')}). Use ONE at a time to avoid warped geometry.`);
  }

  // Check for weak verbs
  AVOID_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(prompt)) {
      warnings.push(`Weak verb "${verb}" detected. Use power verbs like: ${POWER_VERBS.slice(0, 3).join(', ')}`);
    }
  });

  // Check for missing endpoint
  if (!hasEndpoint(prompt)) {
    warnings.push('No motion endpoint detected. Add "then settles" or similar to prevent 99% hang.');
  }

  // Check for scene description (shouldn't be in video prompt)
  const sceneWords = ['in a', 'wearing', 'with dramatic', 'background is', 'setting is'];
  sceneWords.forEach(phrase => {
    if (prompt.toLowerCase().includes(phrase)) {
      warnings.push(`Scene description "${phrase}" detected. Video prompts should be MOTION ONLY - image has all visual info.`);
    }
  });

  // Check for known failures
  if (prompt.toLowerCase().includes('bullet time') || prompt.toLowerCase().includes('matrix effect')) {
    warnings.push('Bullet time / Matrix effect rarely works. Consider simple slow motion instead.');
  }
  if (prompt.toLowerCase().includes('fpv') || prompt.toLowerCase().includes('first person')) {
    warnings.push('FPV / First person view is inconsistent. Consider tracking shot instead.');
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

// ============================================================================
// QUICK PROMPT GENERATOR
// ============================================================================

export type QuickVideoType =
  | 'dolly_around'
  | 'push_in'
  | 'orbit'
  | 'tracking'
  | 'static'
  | 'slow_motion'
  | 'turn_camera'
  | 'walk'
  | 'emotional';

/**
 * Generate a quick video prompt from preset type
 */
export function quickVideoPrompt(type: QuickVideoType): string {
  switch (type) {
    case 'dolly_around':
      return 'Slow dolly shot around the subject, movement settles';
    case 'push_in':
      return 'Slow push-in on face, subject blinks naturally, then holds';
    case 'orbit':
      return 'Camera orbits slowly around subject, 180-degree arc, then stops';
    case 'tracking':
      return 'Smooth tracking shot following from the side, movement completes';
    case 'static':
      return 'Static shot, subtle breathing motion, locked-off camera';
    case 'slow_motion':
      return 'Ultra slow motion, subtle movement, dust particles frozen, then settles';
    case 'turn_camera':
      return 'Camera slowly orbits left, subject turns head toward camera, holds gaze';
    case 'walk':
      return 'Subject walks toward camera, confident stride, then stops and looks up';
    case 'emotional':
      return 'Slow push-in, eyes well with emotion, single tear falls, expression holds';
    default:
      return 'Slow dolly shot around the subject, movement settles';
  }
}

// ============================================================================
// COST REFERENCE
// ============================================================================

export const VIDEO_COSTS = {
  'kling-2.6': {
    '5s': 0.35,
    '10s': 0.70
  },
  'kling-o1': {
    'basic': 0.30,
    'with_video_ref': 0.36,
    'full_combo': 1.09,
    'ref_to_video_per_sec': 0.112
  },
  'seedance-1.5': {
    '5s': 0.30  // Approximate
  }
};

// ============================================================================
// OBJECT MOVEMENTS - COMPLETE VOCABULARY
// ============================================================================

/**
 * NATURAL ELEMENTS - Wind, Water, Fire, Smoke, Dust
 */
export const NATURAL_ELEMENTS = {
  // WIND/AIR EFFECTS
  hair: {
    gentle: 'hair moves gently in breeze, strands catching light, then settles',
    flow: 'hair flows with wind, then rests',
    blow: 'hair blows across face, then clears',
    lift: 'strands lift and settle'
  },
  clothing: {
    dress: 'dress flows in wind, fabric rippling, movement subtle',
    cape: 'cape billows dramatically behind, wind gusting, then falls',
    flutter: 'clothing flutters gently, then stills',
    whip: 'coat whips in strong wind, then calms'
  },
  vegetation: {
    leaves: 'leaves sway in gentle breeze, dappled light, peaceful motion',
    grass: 'grass ripples like waves, then settles',
    branches: 'branches bend with wind, then straighten',
    flowers: 'flowers bob gently, then still',
    trees: 'trees sway slowly, then calm'
  },

  // WATER
  water: {
    ripples: 'water ripples spread across surface, then gentle waves settle',
    waves: 'waves lap gently at shore, rhythmic motion, foam dissolves',
    rain: 'rain drops streak down window, collecting at bottom',
    waterfall: 'waterfall cascades down rocks, mist rises, water pools below',
    drip: 'water drips from faucet, drops fall, ripples in sink'
  },

  // FIRE/FLAMES
  fire: {
    flicker: 'flames flicker gently, casting dancing shadows, warmth visible',
    candle: 'candle flame wavers in draft, steadies, soft glow',
    sparks: 'sparks rise from fire, drift upward, fade into darkness',
    embers: 'embers glow orange, pulse with heat, slowly dim',
    bonfire: 'bonfire blazes, flames dance, then settle'
  },

  // SMOKE/MIST
  smoke: {
    rise: 'smoke rises slowly, curls and disperses, fades to nothing',
    mist: 'mist swirls around subject feet, dreamlike, settles',
    steam: 'steam rises from hot coffee, wisps curl, dissipate',
    fog: 'fog rolls in from background, obscures scene partially',
    exhaust: 'exhaust billows, drifts away, clears'
  },

  // DUST/PARTICLES
  dust: {
    motes: 'dust motes float in sunbeam, drifting slowly, magical feel',
    kicked: 'dust kicked up by footsteps, swirls, settles back down',
    particles: 'particles drift through air, catching light, ethereal',
    debris: 'debris scatters from impact, pieces fall, settle on ground',
    sand: 'sand blows across ground, then settles'
  }
};

/**
 * FALLING OBJECTS - With physics-based descriptions
 */
export const FALLING_OBJECTS = {
  // General falling with physics
  general: {
    slow: 'drifts down gently, floats, settles softly',
    normal: 'falls naturally, lands with thump',
    fast: 'plummets, crashes, impacts hard',
    tumble: 'tumbles end over end, lands'
  },

  // Specific objects
  paper: {
    flutter: 'paper floats down, flutter to floor, lands flat',
    scatter: 'papers flutter from desk, spiral down, scatter on floor',
    letter: 'letter drifts down, lands softly'
  },
  heavy: {
    book: 'book falls from shelf, tumbles, lands open on floor',
    rock: 'rock falls with weight, impacts ground',
    drop: 'heavy object crashes down, impacts with thud'
  },
  light: {
    feather: 'feather drifts down slowly, catches air, lands softly',
    leaf: 'leaves fall from tree, spiral down, carpet the ground',
    petal: 'petals drift down gently, land softly'
  },
  liquid: {
    spill: 'liquid spills, spreads across surface, pools',
    drops: 'water drops fall, splash on surface',
    pour: 'liquid pours steadily, then stops'
  },
  glass: {
    shatter: 'glass falls from table, shatters on impact, pieces scatter',
    break: 'vase breaks, fragments fly outward, crash to floor'
  }
};

/**
 * VEHICLES - Ground, Air, Water
 */
export const VEHICLES = {
  // Cars/Ground
  car: {
    pass: 'car drives quickly past camera, motion blur, exhaust visible',
    approach: 'vehicle approaches slowly, headlights bright, stops in frame',
    speed: 'sports car speeds around corner, tires squeal, straightens',
    park: 'car pulls into parking spot, slows, comes to stop',
    exit: 'car drives away, taillights recede, disappears'
  },

  // Flying
  aircraft: {
    plane: 'plane flies across sky, contrail stretching behind',
    helicopter: 'helicopter hovers in place, rotors spinning, descends slowly',
    drone: 'drone rises smoothly, hovers, moves forward'
  },

  // Water
  boat: {
    glide: 'boat glides across calm water, wake trailing behind',
    rock: 'ship rocks gently on waves, sails billowing',
    paddle: 'kayak paddles through water, ripples spread'
  }
};

/**
 * MECHANICAL OBJECTS - Doors, Switches, Machinery
 */
export const MECHANICAL = {
  doors: {
    open_slow: 'door opens slowly, light spills through, figure visible',
    slam: 'door slams shut, frame shakes slightly, echo',
    swing: 'door swings open, then stops',
    close: 'door closes gently, clicks shut'
  },
  windows: {
    open: 'window opens, curtains flutter inward, fresh air',
    shut: 'window shuts, latch clicks',
    slide: 'window slides up, stops'
  },
  switches: {
    button: 'finger presses button, click, light activates',
    flip: 'switch flips up, power hums on',
    lever: 'lever pulls down, mechanism engages',
    dial: 'dial turns, clicks into position'
  },
  machinery: {
    gears: 'gears mesh and turn, clockwork precision, steady rhythm',
    wheels: 'wheels spin up to speed, blur of motion, stabilize',
    parts: 'machine parts move in sequence, synchronized motion'
  }
};

/**
 * LIGHT EFFECTS - Sources, Reflections, Shadows
 */
export const LIGHT_EFFECTS = {
  sources: {
    neon: 'neon sign flickers to life, buzzes, glows steadily',
    lamp: 'lamp clicks on, warm light fills room',
    flashlight: 'flashlight beam sweeps across darkness, stops on object',
    candle: 'candle flame wavers, shadows dance, steadies',
    screen: 'screen glows, illuminates face'
  },
  shadows: {
    shift: 'shadows shift as light source moves, settling into new position',
    dance: 'shadows dance on wall, then still',
    lengthen: 'shadow lengthens, then stops'
  },
  reflections: {
    ripple: 'reflection ripples in water, distorts, clears',
    play: 'light plays across face, changing mood',
    sparkle: 'light sparkles on surface, then dims'
  }
};

/**
 * PROJECTILES - Throwing, Catching, Flying Objects
 */
export const PROJECTILES = {
  throw: {
    ball: 'ball thrown across frame, arcs through air, caught',
    paper_plane: 'paper airplane glides, dips, lands on desk',
    stone: 'stone skips across water, bounces three times, sinks'
  },
  catch: {
    hand: 'hand reaches up, catches ball, brings it down',
    grab: 'object flies toward subject, caught cleanly, examined'
  }
};

/**
 * BREAKING/DESTRUCTION
 */
export const DESTRUCTION = {
  shatter: {
    glass: 'glass shatters on impact, pieces scatter, settle on ground',
    window: 'window cracks, splinters, shards fall'
  },
  crumble: {
    wall: 'wall crumbles slowly, pieces fall, dust rises',
    structure: 'structure collapses inward, debris cloud rises, settles'
  },
  explode: {
    burst: 'explosion bursts outward, fire and debris, shockwave visible',
    scatter: 'object explodes, fragments scatter, smoke rises'
  }
};

/**
 * FLOATING/HOVERING
 */
export const FLOATING = {
  air: {
    float: 'object floats gently, bobs slightly, maintains position',
    hover: 'multiple items hover in pattern, rotate slowly',
    levitate: 'levitating object rises, pauses, descends slowly'
  },
  water: {
    surface: 'leaf floats on water surface, drifts slowly, circles',
    bob: 'bottle bobs on waves, rocks gently, moves with current'
  }
};

/**
 * WEATHER TRANSITIONS
 */
export const WEATHER = {
  rain: {
    start: 'rain begins falling, intensifies, streaks across window',
    stop: 'rain slows, drops cease, surface glistens'
  },
  snow: {
    fall: 'snow falls gently, flakes drifting, covering ground slowly',
    accumulate: 'snow accumulates, scene whitens'
  },
  wind: {
    pickup: 'wind picks up, trees bend, debris swirls, calms',
    gust: 'gust blows through, then passes'
  },
  light: {
    shift: 'sunlight shifts across room as clouds pass, returns to bright',
    dim: 'light dims as sun sets, warm to cool tones',
    shadow: 'shadow of tree branch moves slowly across wall'
  }
};

/**
 * SPEED MODIFIERS - Use with any motion
 */
export const SPEED_MODIFIERS = {
  slow: ['slowly', 'gently', 'softly', 'gradually', 'drifts', 'floats', 'glides', 'eases'],
  normal: ['steadily', 'smoothly', 'naturally', 'moves', 'travels', 'proceeds'],
  fast: ['quickly', 'rapidly', 'violently', 'crashes', 'slams', 'bursts', 'explodes', 'with impact']
};

/**
 * MOTION ENDPOINTS - Always end with one of these!
 */
export const MOTION_ENDPOINTS = [
  'then settles',
  'comes to rest',
  'stops moving',
  'lands on ground',
  'fades away',
  'dissipates',
  'stabilizes',
  'returns to position',
  'then stills',
  'holds position',
  'movement completes'
];

// ============================================================================
// OBJECT MOTION BUILDER
// ============================================================================

export type ObjectCategory =
  | 'natural'
  | 'falling'
  | 'vehicle'
  | 'mechanical'
  | 'light'
  | 'projectile'
  | 'destruction'
  | 'floating'
  | 'weather';

/**
 * Build an object motion prompt with automatic endpoint
 */
export function buildObjectMotion(
  category: ObjectCategory,
  type: string,
  variant: string,
  customEndpoint?: string
): string {
  let motion = '';

  switch (category) {
    case 'natural':
      motion = (NATURAL_ELEMENTS as any)[type]?.[variant] || '';
      break;
    case 'falling':
      motion = (FALLING_OBJECTS as any)[type]?.[variant] || '';
      break;
    case 'vehicle':
      motion = (VEHICLES as any)[type]?.[variant] || '';
      break;
    case 'mechanical':
      motion = (MECHANICAL as any)[type]?.[variant] || '';
      break;
    case 'light':
      motion = (LIGHT_EFFECTS as any)[type]?.[variant] || '';
      break;
    case 'projectile':
      motion = (PROJECTILES as any)[type]?.[variant] || '';
      break;
    case 'destruction':
      motion = (DESTRUCTION as any)[type]?.[variant] || '';
      break;
    case 'floating':
      motion = (FLOATING as any)[type]?.[variant] || '';
      break;
    case 'weather':
      motion = (WEATHER as any)[type]?.[variant] || '';
      break;
  }

  // Add endpoint if missing
  if (motion && !hasEndpoint(motion)) {
    motion += ', ' + (customEndpoint || 'then settles');
  }

  return motion;
}
