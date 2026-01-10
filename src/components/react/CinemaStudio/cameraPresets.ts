// Camera Movement Presets - Replicating Higgsfield Cinema Studio
// Each preset maps to a motion prompt for FAL.AI

export interface CameraPreset {
  id: string;
  name: string;
  category: 'dolly' | 'pan' | 'tilt' | 'orbit' | 'zoom' | 'special' | 'static';
  prompt: string;
  icon: string; // SVG path or emoji
  description: string;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  // DOLLY MOVEMENTS
  {
    id: 'dolly-in',
    name: 'Dolly In',
    category: 'dolly',
    prompt: 'dolly in, forward camera movement, approaching subject, smooth push in',
    icon: '⬆️',
    description: 'Camera moves toward subject'
  },
  {
    id: 'dolly-out',
    name: 'Dolly Out',
    category: 'dolly',
    prompt: 'dolly out, pull back, revealing shot, backward camera movement',
    icon: '⬇️',
    description: 'Camera moves away from subject'
  },
  {
    id: 'dolly-left',
    name: 'Truck Left',
    category: 'dolly',
    prompt: 'truck left, lateral tracking shot, camera slides left, parallax movement',
    icon: '⬅️',
    description: 'Camera slides left'
  },
  {
    id: 'dolly-right',
    name: 'Truck Right',
    category: 'dolly',
    prompt: 'truck right, lateral tracking shot, camera slides right, parallax movement',
    icon: '➡️',
    description: 'Camera slides right'
  },

  // PAN MOVEMENTS
  {
    id: 'pan-left',
    name: 'Pan Left',
    category: 'pan',
    prompt: 'pan left, horizontal sweep, smooth rotation left, camera turns',
    icon: '↩️',
    description: 'Camera rotates left on axis'
  },
  {
    id: 'pan-right',
    name: 'Pan Right',
    category: 'pan',
    prompt: 'pan right, horizontal sweep, smooth rotation right, camera turns',
    icon: '↪️',
    description: 'Camera rotates right on axis'
  },

  // TILT MOVEMENTS
  {
    id: 'tilt-up',
    name: 'Tilt Up',
    category: 'tilt',
    prompt: 'tilt up, vertical reveal, crane movement upward, looking up',
    icon: '🔼',
    description: 'Camera tilts upward'
  },
  {
    id: 'tilt-down',
    name: 'Tilt Down',
    category: 'tilt',
    prompt: 'tilt down, vertical movement down, looking down, descending view',
    icon: '🔽',
    description: 'Camera tilts downward'
  },

  // ORBIT MOVEMENTS
  {
    id: 'orbit-left',
    name: 'Orbit Left',
    category: 'orbit',
    prompt: 'orbit around subject counter-clockwise, circular tracking left, rotating view',
    icon: '🔄',
    description: 'Camera circles left around subject'
  },
  {
    id: 'orbit-right',
    name: 'Orbit Right',
    category: 'orbit',
    prompt: 'orbit around subject clockwise, circular tracking right, rotating view',
    icon: '🔃',
    description: 'Camera circles right around subject'
  },
  {
    id: 'orbit-360',
    name: '360 Orbit',
    category: 'orbit',
    prompt: '360-degree rotation around subject, full circular tracking, complete orbit',
    icon: '⭕',
    description: 'Full circle around subject'
  },

  // ZOOM MOVEMENTS
  {
    id: 'zoom-in',
    name: 'Zoom In',
    category: 'zoom',
    prompt: 'slow zoom in, push in, intimate framing, gradual magnification',
    icon: '🔍',
    description: 'Optical zoom toward subject'
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    category: 'zoom',
    prompt: 'slow zoom out, pull back zoom, wide reveal, gradual reduction',
    icon: '🔎',
    description: 'Optical zoom away from subject'
  },
  {
    id: 'crash-zoom',
    name: 'Crash Zoom',
    category: 'zoom',
    prompt: 'crash zoom in, rapid zoom, dramatic emphasis, fast push in',
    icon: '💥',
    description: 'Fast dramatic zoom'
  },

  // SPECIAL MOVEMENTS
  {
    id: 'handheld',
    name: 'Handheld',
    category: 'special',
    prompt: 'handheld camera shake, documentary style, subtle organic movement, natural sway',
    icon: '📹',
    description: 'Natural handheld movement'
  },
  {
    id: 'fpv-drone',
    name: 'FPV Drone',
    category: 'special',
    prompt: 'FPV drone movement, dynamic flight path, low altitude sweep, first person view',
    icon: '🚁',
    description: 'First-person drone perspective'
  },
  {
    id: 'bullet-time',
    name: 'Bullet Time',
    category: 'special',
    prompt: 'frozen spin around subject, time freeze, slow motion rotation, matrix effect',
    icon: '⏱️',
    description: 'Time freeze with rotation'
  },
  {
    id: 'snorricam',
    name: 'Snorricam',
    category: 'special',
    prompt: 'snorricam, subject-mounted camera, face stays centered, background moves',
    icon: '🎭',
    description: 'Camera fixed to subject'
  },
  {
    id: 'crane-up',
    name: 'Crane Up',
    category: 'special',
    prompt: 'crane shot rising, vertical arc upward, jib movement ascending, establishing shot',
    icon: '🏗️',
    description: 'Rising crane movement'
  },
  {
    id: 'crane-down',
    name: 'Crane Down',
    category: 'special',
    prompt: 'crane shot descending, vertical arc downward, jib movement down',
    icon: '⬇️',
    description: 'Descending crane movement'
  },
  {
    id: 'through-object',
    name: 'Through',
    category: 'special',
    prompt: 'camera moves through doorway, keyhole transition, passing through opening',
    icon: '🚪',
    description: 'Move through an opening'
  },
  {
    id: 'steadicam',
    name: 'Steadicam',
    category: 'special',
    prompt: 'steadicam following, smooth glide through space, floating camera movement',
    icon: '🎬',
    description: 'Smooth floating follow'
  },

  // STATIC
  {
    id: 'static',
    name: 'Static',
    category: 'static',
    prompt: 'static camera, locked off tripod shot, no movement, stable framing',
    icon: '📷',
    description: 'No camera movement'
  },
  {
    id: 'micro-movement',
    name: 'Subtle',
    category: 'static',
    prompt: 'subtle micro-movements, barely perceptible drift, breathing camera',
    icon: '〰️',
    description: 'Very subtle movement'
  }
];

// Group presets by category for UI
export const PRESET_CATEGORIES = [
  { id: 'dolly', name: 'Dolly', description: 'Forward/backward/lateral movement' },
  { id: 'pan', name: 'Pan', description: 'Horizontal rotation' },
  { id: 'tilt', name: 'Tilt', description: 'Vertical rotation' },
  { id: 'orbit', name: 'Orbit', description: 'Circular movement around subject' },
  { id: 'zoom', name: 'Zoom', description: 'Optical zoom in/out' },
  { id: 'special', name: 'Special', description: 'Advanced camera techniques' },
  { id: 'static', name: 'Static', description: 'Minimal or no movement' },
];

// Helper to get presets by category
export function getPresetsByCategory(category: string): CameraPreset[] {
  return CAMERA_PRESETS.filter(p => p.category === category);
}

// Helper to combine multiple presets into one prompt
export function combinePresets(presets: CameraPreset[]): string {
  if (presets.length === 0) return '';
  if (presets.length === 1) return presets[0].prompt;

  // Combine prompts, removing duplicates
  const combined = presets.map(p => p.name.toLowerCase()).join(' with ');
  const fullPrompt = presets.map(p => p.prompt.split(',')[0]).join(', ');
  return `${fullPrompt}, cinematic motion`;
}

// ============================================
// LENS PRESETS - Focal Length & Characteristics
// ============================================

export interface LensPreset {
  id: string;
  name: string;
  focalLength: string;
  prompt: string;
  icon: string;
  description: string;
}

export const LENS_PRESETS: LensPreset[] = [
  // WIDE ANGLE
  {
    id: 'ultra-wide-14',
    name: '14mm Ultra Wide',
    focalLength: '14mm',
    prompt: 'shot on 14mm ultra-wide lens, extreme wide angle, dramatic perspective distortion, vast field of view',
    icon: '🌐',
    description: 'Extreme wide, dramatic distortion'
  },
  {
    id: 'wide-24',
    name: '24mm Wide',
    focalLength: '24mm',
    prompt: 'shot on 24mm wide angle lens, expansive view, environmental context, slight perspective',
    icon: '📐',
    description: 'Classic wide angle'
  },
  {
    id: 'wide-35',
    name: '35mm',
    focalLength: '35mm',
    prompt: 'shot on 35mm lens, natural perspective, documentary feel, versatile framing',
    icon: '🎞️',
    description: 'Natural, documentary feel'
  },

  // STANDARD
  {
    id: 'standard-50',
    name: '50mm',
    focalLength: '50mm',
    prompt: 'shot on 50mm lens, natural human eye perspective, classic cinema look, minimal distortion',
    icon: '👁️',
    description: 'Human eye perspective'
  },

  // PORTRAIT / TELEPHOTO
  {
    id: 'portrait-85',
    name: '85mm Portrait',
    focalLength: '85mm',
    prompt: 'shot on 85mm portrait lens, flattering compression, beautiful bokeh, subject isolation',
    icon: '🖼️',
    description: 'Flattering portrait compression'
  },
  {
    id: 'tele-135',
    name: '135mm',
    focalLength: '135mm',
    prompt: 'shot on 135mm telephoto lens, strong compression, creamy background blur, intimate feel',
    icon: '🔭',
    description: 'Strong compression, intimate'
  },
  {
    id: 'tele-200',
    name: '200mm Telephoto',
    focalLength: '200mm',
    prompt: 'shot on 200mm telephoto lens, extreme compression, stacked planes, paparazzi aesthetic',
    icon: '📡',
    description: 'Extreme compression'
  },

  // SPECIAL LENSES
  {
    id: 'anamorphic',
    name: 'Anamorphic',
    focalLength: 'anamorphic',
    prompt: 'shot on anamorphic lens, horizontal lens flares, oval bokeh, 2.39:1 cinematic, widescreen',
    icon: '🎬',
    description: 'Cinematic flares & oval bokeh'
  },
  {
    id: 'anamorphic-vintage',
    name: 'Vintage Anamorphic',
    focalLength: 'vintage anamorphic',
    prompt: 'vintage anamorphic lens, blue streak lens flares, aberrations, organic imperfections, filmic',
    icon: '✨',
    description: 'Classic Hollywood look'
  },
  {
    id: 'macro',
    name: 'Macro',
    focalLength: 'macro',
    prompt: 'shot on macro lens, extreme close-up, tiny details revealed, microscopic view',
    icon: '🔬',
    description: 'Extreme detail close-up'
  },
  {
    id: 'fisheye',
    name: 'Fisheye',
    focalLength: 'fisheye',
    prompt: 'shot on fisheye lens, 180-degree view, barrel distortion, spherical perspective',
    icon: '🐟',
    description: 'Spherical wide distortion'
  },
  {
    id: 'tilt-shift',
    name: 'Tilt-Shift',
    focalLength: 'tilt-shift',
    prompt: 'tilt-shift lens effect, miniature look, selective focus plane, diorama effect',
    icon: '🏠',
    description: 'Miniature/diorama effect'
  }
];

// ============================================
// CAMERA PRESETS - Camera Body & Film Stock
// ============================================

export interface CameraBodyPreset {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  description: string;
}

export const CAMERA_BODY_PRESETS: CameraBodyPreset[] = [
  // CINEMA CAMERAS
  {
    id: 'arri-alexa',
    name: 'ARRI Alexa',
    prompt: 'shot on ARRI Alexa, rich color science, cinematic dynamic range, Hollywood production',
    icon: '🎥',
    description: 'Hollywood standard, rich colors'
  },
  {
    id: 'arri-65',
    name: 'ARRI 65',
    prompt: 'shot on ARRI 65 large format, stunning detail, IMAX-quality, epic scope',
    icon: '🎞️',
    description: 'Large format IMAX quality'
  },
  {
    id: 'red-v-raptor',
    name: 'RED V-Raptor',
    prompt: 'shot on RED V-Raptor 8K, ultra high resolution, sharp detail, modern cinema look',
    icon: '🔴',
    description: 'Sharp 8K digital cinema'
  },
  {
    id: 'sony-venice',
    name: 'Sony Venice',
    prompt: 'shot on Sony Venice, dual ISO, wide color gamut, versatile cinematic look',
    icon: '📹',
    description: 'Versatile dual ISO cinema'
  },
  {
    id: 'blackmagic',
    name: 'Blackmagic URSA',
    prompt: 'shot on Blackmagic URSA, raw capture, indie cinema aesthetic, high dynamic range',
    icon: '⬛',
    description: 'Indie cinema raw look'
  },

  // FILM STOCKS
  {
    id: 'imax-70mm',
    name: 'IMAX 70mm',
    prompt: 'shot on IMAX 70mm film, massive resolution, epic scale, theatrical experience',
    icon: '🏛️',
    description: 'Epic IMAX theatrical'
  },
  {
    id: 'kodak-5219',
    name: 'Kodak Vision3 500T',
    prompt: 'shot on Kodak Vision3 500T film stock, warm tungsten, beautiful grain, classic Hollywood',
    icon: '🟡',
    description: 'Warm tungsten film look'
  },
  {
    id: 'kodak-5207',
    name: 'Kodak Vision3 250D',
    prompt: 'shot on Kodak Vision3 250D daylight film, natural colors, fine grain, daylight balanced',
    icon: '☀️',
    description: 'Natural daylight film'
  },
  {
    id: 'fuji-eterna',
    name: 'Fuji Eterna',
    prompt: 'shot on Fuji Eterna film, subtle colors, gentle contrast, Japanese cinema aesthetic',
    icon: '🗻',
    description: 'Subtle Japanese cinema look'
  },

  // VINTAGE / SPECIAL
  {
    id: 'super-8',
    name: 'Super 8',
    focalLength: 'super8',
    prompt: 'shot on Super 8 film, heavy grain, vintage home movie look, nostalgic, light leaks',
    icon: '📼',
    description: 'Nostalgic home movie grain'
  },
  {
    id: '16mm-bolex',
    name: '16mm Bolex',
    prompt: 'shot on 16mm Bolex, documentary texture, indie film grain, authentic vintage',
    icon: '🎬',
    description: 'Indie documentary texture'
  },
  {
    id: 'vhs',
    name: 'VHS Camcorder',
    prompt: 'VHS camcorder footage, low resolution, tracking lines, retro 80s aesthetic, analog',
    icon: '📺',
    description: 'Retro VHS aesthetic'
  },
  {
    id: 'dslr-cinematic',
    name: 'DSLR Cinematic',
    prompt: 'DSLR cinematic footage, shallow depth of field, digital but filmic, run and gun',
    icon: '📷',
    description: 'Modern DSLR film look'
  }
];

// ============================================
// FOCUS / DEPTH OF FIELD PRESETS
// ============================================

export interface FocusPreset {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  description: string;
}

export const FOCUS_PRESETS: FocusPreset[] = [
  // DEPTH OF FIELD
  {
    id: 'shallow-dof',
    name: 'Shallow DOF',
    prompt: 'shallow depth of field, f/1.4, creamy bokeh, subject isolation, background blur',
    icon: '🔘',
    description: 'Blurred background, subject pop'
  },
  {
    id: 'medium-dof',
    name: 'Medium DOF',
    prompt: 'medium depth of field, f/4, balanced focus, some background detail visible',
    icon: '◐',
    description: 'Balanced focus range'
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    prompt: 'deep focus, f/11, everything in focus, sharp from foreground to background, Citizen Kane style',
    icon: '◉',
    description: 'Everything sharp, Citizen Kane'
  },

  // FOCUS TECHNIQUES
  {
    id: 'rack-focus',
    name: 'Rack Focus',
    prompt: 'rack focus, focus pull from foreground to background, shifting attention, focus transition',
    icon: '🔄',
    description: 'Focus shift between planes'
  },
  {
    id: 'follow-focus',
    name: 'Follow Focus',
    prompt: 'follow focus on moving subject, maintained sharp focus, tracking focus pull',
    icon: '🎯',
    description: 'Track moving subject'
  },
  {
    id: 'split-diopter',
    name: 'Split Diopter',
    prompt: 'split diopter effect, two focal planes both sharp, De Palma style, dual focus',
    icon: '↔️',
    description: 'Two planes in focus, De Palma'
  },
  {
    id: 'soft-focus',
    name: 'Soft Focus',
    prompt: 'soft focus, dreamy glow, diffused edges, romantic haze, vaseline lens effect',
    icon: '🌫️',
    description: 'Dreamy soft romantic look'
  },
  {
    id: 'out-of-focus-start',
    name: 'Focus In',
    prompt: 'starts out of focus then pulls into sharp focus, focus reveal, emerging clarity',
    icon: '🔍',
    description: 'Blur to sharp reveal'
  },
  {
    id: 'focus-out',
    name: 'Focus Out',
    prompt: 'sharp focus fading to blur, defocus transition, dissolving into soft blur',
    icon: '💨',
    description: 'Sharp to blur transition'
  },

  // BOKEH STYLES
  {
    id: 'bokeh-circles',
    name: 'Circular Bokeh',
    prompt: 'beautiful circular bokeh, smooth round highlights, creamy background blur',
    icon: '⭕',
    description: 'Smooth round blur highlights'
  },
  {
    id: 'bokeh-anamorphic',
    name: 'Oval Bokeh',
    prompt: 'oval anamorphic bokeh, elongated highlights, cinematic widescreen blur',
    icon: '🥚',
    description: 'Anamorphic oval highlights'
  },
  {
    id: 'bokeh-swirl',
    name: 'Swirly Bokeh',
    prompt: 'swirly bokeh, vintage lens character, Helios-style swirl, busy artistic blur',
    icon: '🌀',
    description: 'Vintage Helios swirl effect'
  }
];

// ============================================
// STYLE PRESETS - Visual Looks & Moods
// ============================================

export interface StylePreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'film-noir',
    name: 'Film Noir',
    prompt: 'film noir style, high contrast, deep shadows, 1940s detective film, black and white, dramatic lighting',
    description: 'Classic detective film look'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    prompt: 'golden hour lighting, warm sunset tones, magic hour, soft golden light, romantic atmosphere',
    description: 'Warm sunset magic hour'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'cyberpunk aesthetic, neon lights, rain-soaked streets, futuristic dystopia, pink and blue neon',
    description: 'Neon-lit futuristic dystopia'
  },
  {
    id: 'horror',
    name: 'Horror',
    prompt: 'horror film atmosphere, dark shadows, unsettling tension, dread, ominous lighting',
    description: 'Dark unsettling tension'
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    prompt: 'dreamy ethereal look, soft focus, pastel colors, hazy glow, fantasy atmosphere',
    description: 'Soft ethereal fantasy'
  },
  {
    id: 'gritty',
    name: 'Gritty',
    prompt: 'gritty realistic look, desaturated colors, harsh lighting, raw documentary style',
    description: 'Raw realistic documentary'
  },
  {
    id: 'vintage-70s',
    name: '70s Vintage',
    prompt: '1970s film look, warm color grade, film grain, faded blacks, retro vintage',
    description: 'Retro 1970s film style'
  },
  {
    id: 'blockbuster',
    name: 'Blockbuster',
    prompt: 'Hollywood blockbuster style, teal and orange color grade, high production value, epic scale',
    description: 'Big budget Hollywood look'
  },
  {
    id: 'anime',
    name: 'Anime Style',
    prompt: 'anime visual style, vibrant colors, dramatic lighting, Japanese animation aesthetic',
    description: 'Japanese animation look'
  },
  {
    id: 'wes-anderson',
    name: 'Wes Anderson',
    prompt: 'Wes Anderson style, symmetrical framing, pastel color palette, whimsical, centered composition',
    description: 'Symmetrical whimsical pastel'
  }
];

// ============================================
// LIGHTING PRESETS
// ============================================

export interface LightingPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural Light',
    prompt: 'natural lighting, available light, realistic illumination',
    description: 'Realistic available light'
  },
  {
    id: 'three-point',
    name: 'Three Point',
    prompt: 'three point lighting setup, key light, fill light, back light, studio lighting',
    description: 'Classic studio setup'
  },
  {
    id: 'rembrandt',
    name: 'Rembrandt',
    prompt: 'Rembrandt lighting, triangle shadow on cheek, dramatic portraiture, chiaroscuro',
    description: 'Classic portrait triangle shadow'
  },
  {
    id: 'silhouette',
    name: 'Silhouette',
    prompt: 'silhouette lighting, backlit, rim light only, subject in shadow',
    description: 'Backlit shadow outline'
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    prompt: 'neon lighting, colored light gels, cyberpunk glow, pink and blue neon',
    description: 'Colorful neon glow'
  },
  {
    id: 'harsh-sun',
    name: 'Harsh Sun',
    prompt: 'harsh midday sun, hard shadows, high contrast, bright highlights',
    description: 'Strong midday sunlight'
  },
  {
    id: 'overcast',
    name: 'Overcast',
    prompt: 'overcast soft light, diffused illumination, no harsh shadows, even lighting',
    description: 'Soft diffused daylight'
  },
  {
    id: 'candlelight',
    name: 'Candlelight',
    prompt: 'candlelight illumination, warm flickering light, intimate atmosphere, orange glow',
    description: 'Warm intimate flicker'
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    prompt: 'moonlight illumination, blue night lighting, cool tones, nocturnal atmosphere',
    description: 'Cool blue night light'
  },
  {
    id: 'volumetric',
    name: 'Volumetric',
    prompt: 'volumetric lighting, god rays, light shafts through atmosphere, dramatic beams',
    description: 'Dramatic light rays'
  }
];

// ============================================
// ASPECT RATIO PRESETS
// ============================================

export interface AspectRatioPreset {
  id: string;
  name: string;
  ratio: string;
  prompt: string;
  description: string;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: '16:9',
    name: 'Widescreen',
    ratio: '16:9',
    prompt: '16:9 widescreen format',
    description: 'Standard HD/4K format'
  },
  {
    id: '21:9',
    name: 'Cinematic',
    ratio: '21:9',
    prompt: '21:9 ultra-wide cinematic, anamorphic widescreen, letterbox format',
    description: 'Ultra-wide cinema scope'
  },
  {
    id: '2.39:1',
    name: 'Anamorphic',
    ratio: '2.39:1',
    prompt: '2.39:1 anamorphic scope, CinemaScope aspect ratio',
    description: 'Classic anamorphic scope'
  },
  {
    id: '9:16',
    name: 'Vertical',
    ratio: '9:16',
    prompt: '9:16 vertical portrait format, mobile video, TikTok format',
    description: 'TikTok/Reels/Shorts'
  },
  {
    id: '1:1',
    name: 'Square',
    ratio: '1:1',
    prompt: '1:1 square format, Instagram square',
    description: 'Instagram square format'
  },
  {
    id: '4:3',
    name: 'Classic',
    ratio: '4:3',
    prompt: '4:3 academy ratio, classic TV format, vintage aspect',
    description: 'Classic TV/Academy'
  },
  {
    id: '4:5',
    name: 'Portrait',
    ratio: '4:5',
    prompt: '4:5 portrait format, Instagram portrait',
    description: 'Instagram portrait'
  }
];

// ============================================
// MOTION SPEED PRESETS
// ============================================

export interface MotionSpeedPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const MOTION_SPEED_PRESETS: MotionSpeedPreset[] = [
  {
    id: 'very-slow',
    name: 'Very Slow',
    prompt: 'very slow motion, ultra smooth, glacial pace, meditative',
    description: 'Ultra slow meditative'
  },
  {
    id: 'slow',
    name: 'Slow',
    prompt: 'slow motion, gentle movement, smooth and deliberate',
    description: 'Gentle deliberate motion'
  },
  {
    id: 'normal',
    name: 'Normal',
    prompt: 'natural speed, normal motion, realistic timing',
    description: 'Natural realistic speed'
  },
  {
    id: 'fast',
    name: 'Fast',
    prompt: 'fast motion, dynamic movement, energetic pace, quick',
    description: 'Dynamic energetic motion'
  },
  {
    id: 'speed-ramp',
    name: 'Speed Ramp',
    prompt: 'speed ramping, slow to fast transition, time manipulation, dramatic timing',
    description: 'Slow-mo to fast transition'
  },
  {
    id: 'timelapse',
    name: 'Timelapse',
    prompt: 'timelapse motion, accelerated time, hours in seconds',
    description: 'Accelerated time passage'
  },
  {
    id: 'hyperlapse',
    name: 'Hyperlapse',
    prompt: 'hyperlapse, moving timelapse, traveling through time, dynamic timelapse',
    description: 'Moving timelapse'
  }
];

// ============================================
// FRAME RATE STYLE PRESETS
// ============================================

export interface FrameRatePreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const FRAME_RATE_PRESETS: FrameRatePreset[] = [
  {
    id: '24fps',
    name: '24fps Cinema',
    prompt: 'cinematic 24fps, film motion blur, classic cinema cadence',
    description: 'Classic film look'
  },
  {
    id: '12fps',
    name: '12fps Stop Motion',
    prompt: 'stop motion style 12fps, choppy animation, claymation feel',
    description: 'Stop motion animation'
  },
  {
    id: '60fps',
    name: '60fps Smooth',
    prompt: 'smooth 60fps, hyper-real motion, soap opera effect, ultra smooth',
    description: 'Ultra smooth motion'
  },
  {
    id: '8fps',
    name: '8fps Vintage',
    prompt: 'old film 8fps, flickering vintage footage, early cinema, choppy',
    description: 'Early cinema flicker'
  },
  {
    id: 'variable',
    name: 'Variable FPS',
    prompt: 'variable frame rate, some moments slow some fast, dynamic timing',
    description: 'Mixed speed moments'
  }
];

// ============================================
// WEATHER / ATMOSPHERE PRESETS
// ============================================

export interface AtmospherePreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const ATMOSPHERE_PRESETS: AtmospherePreset[] = [
  {
    id: 'clear',
    name: 'Clear',
    prompt: 'clear atmosphere, crisp visibility, no atmospheric effects',
    description: 'Clear crisp air'
  },
  {
    id: 'fog',
    name: 'Fog',
    prompt: 'thick fog, atmospheric haze, mysterious foggy, low visibility',
    description: 'Mysterious thick fog'
  },
  {
    id: 'mist',
    name: 'Mist',
    prompt: 'light mist, morning haze, subtle atmospheric diffusion',
    description: 'Light morning mist'
  },
  {
    id: 'rain',
    name: 'Rain',
    prompt: 'heavy rain, wet surfaces, rain drops, puddle reflections, stormy',
    description: 'Rainy wet atmosphere'
  },
  {
    id: 'snow',
    name: 'Snow',
    prompt: 'falling snow, winter atmosphere, snowflakes, cold breath visible',
    description: 'Winter snowfall'
  },
  {
    id: 'dust',
    name: 'Dust',
    prompt: 'dust particles, volumetric dust, hazy dusty air, particles in light',
    description: 'Dusty particle-filled air'
  },
  {
    id: 'smoke',
    name: 'Smoke',
    prompt: 'smoke atmosphere, hazy smoke, atmospheric smoke wisps',
    description: 'Smoky hazy atmosphere'
  },
  {
    id: 'underwater',
    name: 'Underwater',
    prompt: 'underwater atmosphere, light rays through water, bubbles, aquatic',
    description: 'Submerged underwater'
  },
  {
    id: 'heat-haze',
    name: 'Heat Haze',
    prompt: 'heat distortion, desert mirage, shimmering hot air',
    description: 'Hot shimmering distortion'
  }
];

// ============================================
// TRANSITION PRESETS (for multi-shot)
// ============================================

export interface TransitionPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const TRANSITION_PRESETS: TransitionPreset[] = [
  {
    id: 'cut',
    name: 'Hard Cut',
    prompt: 'hard cut, direct transition, no effect',
    description: 'Direct instant cut'
  },
  {
    id: 'match-cut',
    name: 'Match Cut',
    prompt: 'match cut transition, shape continuity, graphic match between shots',
    description: 'Shape/action continuity'
  },
  {
    id: 'whip-pan',
    name: 'Whip Pan',
    prompt: 'whip pan transition, fast blur pan, motion blur wipe',
    description: 'Fast blur pan transition'
  },
  {
    id: 'morph',
    name: 'Morph',
    prompt: 'morphing transition, smooth blend between subjects, seamless transform',
    description: 'Smooth morph blend'
  },
  {
    id: 'zoom-through',
    name: 'Zoom Through',
    prompt: 'zoom through transition, push through to next scene, infinite zoom',
    description: 'Push through zoom'
  },
  {
    id: 'dissolve',
    name: 'Dissolve',
    prompt: 'dissolve transition, cross fade, overlapping blend',
    description: 'Gradual cross fade'
  },
  {
    id: 'iris',
    name: 'Iris',
    prompt: 'iris wipe transition, circular reveal, vintage iris',
    description: 'Circular iris wipe'
  }
];

// ============================================
// DIRECTOR STYLE PRESETS - Famous filmmakers
// ============================================

// Shot library entry for director-specific signature shots
export interface DirectorShotPreset {
  id: string;
  name: string;
  whenToUse: string[];
  prompt: string;
  lens?: string;
  movement?: string;
  rig?: string;
}

// Rules for what a director would/wouldn't do
export interface DirectorRules {
  neverDo: string[];
  alwaysDo: string[];
  signature: string[];
}

// Scene-specific shot recommendations
export interface DirectorSceneResponse {
  shot: string;
  lens: string;
  movement: string;
  why?: string;
}

export interface DirectorPreset {
  id: string;
  name: string;
  director: string;
  prompt: string;
  description: string;
  // Recommended settings to auto-apply
  recommendedCamera?: string;
  recommendedLens?: string;
  recommendedMovement?: string[];
  recommendedLighting?: string;
  recommendedStyle?: string;
  recommendedAtmosphere?: string;
  // Additional director-specific settings
  recommendedFraming?: string;
  recommendedSetDesign?: string;
  recommendedColorPalette?: string;
  recommendedCharacterStyle?: string;
  // Deep director research data
  shotLibrary?: DirectorShotPreset[];
  rules?: DirectorRules;
  sceneResponses?: Record<string, DirectorSceneResponse>;
  colorPalette?: Record<string, string>;
  avoidPrompts?: string[];
}

export const DIRECTOR_PRESETS: DirectorPreset[] = [
  {
    id: 'kubrick',
    name: 'Kubrick',
    director: 'Stanley Kubrick',
    prompt: 'Stanley Kubrick style, symmetrical one-point perspective, wide angle lens, cold sterile lighting, meticulous composition, centered framing, geometric architecture, Steadicam glide, clinical observation',
    description: 'Symmetrical, cold, meticulous',
    recommendedCamera: 'arri-alexa',
    recommendedLens: 'wide-24',
    recommendedMovement: ['dolly-in', 'steadicam', 'static'],
    recommendedLighting: 'low-key',
    recommendedStyle: 'gritty',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'centered-symmetrical',
    recommendedSetDesign: 'sterile-geometric',
    recommendedColorPalette: 'desaturated-cold',
    recommendedCharacterStyle: 'grunge-realistic',
    // Shot library - 12 signature Kubrick shots (from deep research)
    shotLibrary: [
      {
        id: 'one-point-corridor',
        name: 'One-Point Perspective Corridor',
        whenToUse: ['Establishing geography', 'Character trapped by environment', 'Building dread/inevitability'],
        prompt: 'one-point perspective shot, symmetrical corridor, vanishing point center frame, geometric architecture, wide angle lens, stark lighting, character small in vast space, Kubrick style, clinical precision, cold institutional, 18mm wide angle',
        lens: 'wide-14',
        movement: 'static or slow push',
        rig: 'tripod or Steadicam'
      },
      {
        id: 'kubrick-stare',
        name: 'The Kubrick Stare',
        whenToUse: ['Character crossed into madness', 'Psychological break', 'Direct confrontation with audience'],
        prompt: 'Kubrick stare, head tilted down, eyes looking up at camera, intense menacing gaze, direct eye contact, close-up, cold lighting, centered framing, psychological intensity, character breaking sanity, unsettling, Kubrick style',
        lens: 'standard-50',
        movement: 'static or slow dolly in',
        rig: 'tripod or dolly'
      },
      {
        id: 'low-steadicam-follow',
        name: 'Low Steadicam Follow',
        whenToUse: ['Child POV', 'Vulnerability', 'Space hunting character'],
        prompt: 'low angle Steadicam shot, 18 inches from ground, following character from behind, smooth gliding movement, child perspective, wide angle lens, corridor or hallway, ominous smooth tracking, Kubrick style, The Shining aesthetic',
        lens: 'wide-24',
        movement: 'steadicam glide',
        rig: 'modified Steadicam 18 inches'
      },
      {
        id: 'steadicam-follow',
        name: 'Steadicam Follow (Standard)',
        whenToUse: ['Character moving through environment', 'Space has power over character', 'Building tension through movement'],
        prompt: 'Steadicam following shot, smooth gliding movement, character walking through space, symmetrical architecture, one-point perspective, wide angle, observational, ominous smooth tracking, Kubrick style, cold precision',
        lens: 'wide-24',
        movement: 'steadicam',
        rig: 'Steadicam'
      },
      {
        id: 'slow-dolly-in',
        name: 'Slow Dolly In',
        whenToUse: ['Building to revelation', 'Focusing attention', 'Psychological intimacy'],
        prompt: 'slow dolly in, pushing toward face, mathematical precision, centered subject, building tension, inevitable approach, intimate observation, Kubrick style, static subject, moving camera, cold lighting',
        lens: 'standard-50',
        movement: 'dolly-in',
        rig: 'dolly track'
      },
      {
        id: 'architectural-wide',
        name: 'Architectural Wide',
        whenToUse: ['Establishing power of environment', 'Character insignificance', 'Institutional/cold spaces'],
        prompt: 'extreme wide shot, architectural composition, geometric space, character dwarfed by environment, symmetrical framing, one-point perspective, institutional, cold sterile, Kubrick style, 18mm wide angle, vast interior space',
        lens: 'wide-14',
        movement: 'static',
        rig: 'tripod'
      },
      {
        id: 'reverse-zoom-tableau',
        name: 'Reverse Zoom (Barry Lyndon)',
        whenToUse: ['Period drama', 'Revealing context after intimacy', 'Painterly tableaus'],
        prompt: 'reverse zoom reveal, starting close-up pulling to wide tableau, painterly composition, 18th century aesthetic, candlelit interior, period costume, soft natural lighting, Barry Lyndon style, Kubrick',
        lens: 'standard-50',
        movement: 'zoom out',
        rig: 'tripod'
      },
      {
        id: 'overhead-topdown',
        name: 'Overhead/Top-Down',
        whenToUse: ['Violence with clinical distance', 'Maze/pattern reveal', 'Gods-eye detachment'],
        prompt: 'overhead top-down shot, looking straight down at subject, geometric composition, clinical detachment, pattern visible, Kubrick style, god\'s eye view, cold observation',
        lens: 'wide-24',
        movement: 'static',
        rig: 'crane or ceiling mount'
      },
      {
        id: 'interview-confrontation',
        name: 'Interview/Confrontation',
        whenToUse: ['Character explaining/confessing', 'Interview moments', 'Psychological examination'],
        prompt: 'medium shot interview framing, subject centered, looking slightly off-camera, static tripod, cold lighting, institutional background, confrontational, Kubrick style, psychological examination, clinical observation',
        lens: 'standard-50',
        movement: 'static',
        rig: 'tripod'
      },
      {
        id: 'helicopter-establishing',
        name: 'Helicopter Establishing',
        whenToUse: ['Opening establishing shots', 'Showing journey/isolation', 'Environment dwarfs human'],
        prompt: 'aerial helicopter shot, following vehicle through vast landscape, mountain roads, isolated journey, epic scale, character insignificant, nature dominates, Kubrick opening style, ominous establishing',
        lens: 'telephoto-135',
        movement: 'aerial tracking',
        rig: 'helicopter mount'
      },
      {
        id: 'bathroom-revelation',
        name: 'Bathroom Revelation',
        whenToUse: ['Private moments of madness', 'Intimate horror', 'Institutional vulnerability'],
        prompt: 'bathroom interior, harsh fluorescent lighting, cold tile surfaces, isolated figure, private horror, institutional space, vulnerable, Kubrick style, psychological breakdown, clinical harsh light',
        lens: 'wide-24',
        movement: 'static',
        rig: 'tripod'
      },
      {
        id: 'war-room-control',
        name: 'War Room / Control Center',
        whenToUse: ['Power concentrated in space', 'Institutional decision-making', 'Satirical commentary'],
        prompt: 'war room interior, circular geometric space, large central table, figures arranged around perimeter, dramatic overhead lighting, institutional power, Kubrick style, Dr. Strangelove aesthetic, cold sterile, military/governmental',
        lens: 'wide-14',
        movement: 'static or slow pan',
        rig: 'tripod or dolly'
      }
    ],
    // Rules - what Kubrick would and wouldn't do
    rules: {
      neverDo: [
        'handheld chaos',
        'dutch angles',
        'crash zooms',
        'quick MTV-style cuts',
        'warm emotional lighting',
        'asymmetrical sloppy framing'
      ],
      alwaysDo: [
        'one-point perspective in corridors',
        'center subjects in frame',
        'wide angle for geography',
        'hold shots past comfort',
        'geometric precision',
        'practical lighting sources'
      ],
      signature: [
        'Steadicam follow through corridors',
        'Kubrick stare (eyes up through brow at camera)',
        'one-point perspective symmetry',
        'slow dolly in to face',
        'low Steadicam at child height'
      ]
    },
    // Scene-specific responses
    sceneResponses: {
      'horror_corridor': {
        shot: 'wide one-point perspective',
        lens: '18mm wide',
        movement: 'Steadicam glide',
        why: 'Corridor becomes inescapable geometry'
      },
      'character_madness': {
        shot: 'slow dolly to close-up, then stare',
        lens: '25-35mm',
        movement: 'slow dolly in',
        why: 'Intimacy with the breakdown, then direct confrontation'
      },
      'dialogue_tension': {
        shot: 'static wide or medium',
        lens: '25mm minimum',
        movement: 'static tripod',
        why: 'Cold observation, let tension build without cutting'
      },
      'child_pov': {
        shot: 'low tracking',
        lens: 'wide',
        movement: 'Steadicam at 18 inches',
        why: 'World as child sees it, vulnerable perspective'
      },
      'violence': {
        shot: 'wide or medium, often static',
        lens: 'wide for context',
        movement: 'static or slow motion',
        why: 'Clinical detachment, forcing audience to watch'
      },
      'establishing': {
        shot: 'extreme wide one-point',
        lens: '18mm',
        movement: 'static or slow Steadicam',
        why: 'Show full geography, character dwarfed by space'
      }
    },
    // Color palette with hex codes
    colorPalette: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
      accent: '#8B0000',
      shadows: '#0D0D0D',
      highlights: '#C8C8C8'
    },
    // Prompts to avoid when generating Kubrick-style content
    avoidPrompts: [
      'handheld',
      'shaky camera',
      'quick cuts',
      'dutch angle',
      'tilted frame',
      'warm emotional',
      'soft romantic',
      'asymmetrical chaos',
      'crash zoom',
      'MTV style'
    ]
  },
  {
    id: 'spielberg',
    name: 'Spielberg',
    director: 'Steven Spielberg',
    prompt: 'warm lighting, lens flares, emotional close-ups, dynamic camera movement, blockbuster style, wonder and awe',
    description: 'Warm, emotional, wonder',
    recommendedCamera: 'arri-alexa',
    recommendedMovement: ['steadicam', 'crane-up'],
    recommendedLighting: 'natural',
    recommendedStyle: 'blockbuster',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'rule-of-thirds',
    recommendedSetDesign: 'retro-americana',
    recommendedColorPalette: 'teal-orange',
    recommendedCharacterStyle: 'classic-hollywood'
  },
  {
    id: 'tarantino',
    name: 'Tarantino',
    director: 'Quentin Tarantino',
    prompt: 'low angle shots, trunk shot, pop culture aesthetic, stylized violence, film grain, saturated colors',
    description: 'Low angles, pop culture style',
    recommendedCamera: 'kodak-5219',
    recommendedMovement: ['dolly-in', 'pan-left'],
    recommendedLighting: 'three-point',
    recommendedStyle: 'vintage-70s',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'low-angle-hero',
    recommendedSetDesign: 'retro-americana',
    recommendedColorPalette: 'sepia-vintage',
    recommendedCharacterStyle: 'retro-70s'
  },
  {
    id: 'fincher',
    name: 'Fincher',
    director: 'David Fincher',
    prompt: 'dark and moody, desaturated colors, low-key lighting, meticulous framing, clinical precision',
    description: 'Dark, moody, precise',
    recommendedCamera: 'red-v-raptor',
    recommendedLens: 'standard-50',
    recommendedLighting: 'silhouette',
    recommendedStyle: 'gritty',
    recommendedAtmosphere: 'fog',
    recommendedFraming: 'rule-of-thirds',
    recommendedSetDesign: 'gritty-decay',
    recommendedColorPalette: 'desaturated-cold',
    recommendedCharacterStyle: 'grunge-realistic'
  },
  {
    id: 'nolan',
    name: 'Nolan',
    director: 'Christopher Nolan',
    prompt: 'IMAX grandeur, practical effects look, blue and orange grade, epic scale, non-linear feeling',
    description: 'IMAX epic, blue/orange',
    recommendedCamera: 'imax-70mm',
    recommendedLens: 'wide-24',
    recommendedMovement: ['steadicam', 'crane-up'],
    recommendedLighting: 'natural',
    recommendedStyle: 'blockbuster',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'wide-negative-space',
    recommendedSetDesign: 'sci-fi-industrial',
    recommendedColorPalette: 'teal-orange',
    recommendedCharacterStyle: 'sci-fi-functional'
  },
  {
    id: 'villeneuve',
    name: 'Villeneuve',
    director: 'Denis Villeneuve',
    prompt: 'vast landscapes, minimal dialogue aesthetic, Roger Deakins style, muted colors, atmospheric, contemplative',
    description: 'Vast, atmospheric, Deakins',
    recommendedCamera: 'arri-65',
    recommendedLens: 'wide-35',
    recommendedMovement: ['dolly-in', 'steadicam'],
    recommendedLighting: 'silhouette',
    recommendedStyle: 'desaturated',
    recommendedAtmosphere: 'fog',
    recommendedFraming: 'wide-negative-space',
    recommendedSetDesign: 'vast-landscapes',
    recommendedColorPalette: 'desaturated-cold',
    recommendedCharacterStyle: 'minimalist-modern'
  },
  {
    id: 'wes-anderson-dir',
    name: 'Wes Anderson',
    director: 'Wes Anderson',
    prompt: 'perfectly symmetrical, pastel color palette, whimsical, centered subjects, tableau shots, dollhouse framing',
    description: 'Symmetrical pastel whimsy',
    recommendedLens: 'wide-24',
    recommendedMovement: ['pan-left', 'pan-right'],
    recommendedLighting: 'three-point',
    recommendedStyle: 'wes-anderson',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'centered-symmetrical',
    recommendedSetDesign: 'dollhouse-whimsy',
    recommendedColorPalette: 'wes-anderson-pastel',
    recommendedCharacterStyle: 'wes-anderson-quirky'
  },
  {
    id: 'wong-kar-wai',
    name: 'Wong Kar-wai',
    director: 'Wong Kar-wai',
    prompt: 'step-printed slow motion, smeared colors, neon-lit Hong Kong, romantic melancholy, Christopher Doyle style',
    description: 'Neon romance, step-print',
    recommendedCamera: 'kodak-5219',
    recommendedMovement: ['handheld'],
    recommendedLighting: 'neon',
    recommendedStyle: 'neon-noir',
    recommendedAtmosphere: 'rain',
    recommendedFraming: 'frames-within-frames',
    recommendedSetDesign: 'neon-urban',
    recommendedColorPalette: 'neon-noir',
    recommendedCharacterStyle: 'classic-hollywood'
  },
  {
    id: 'tarkovsky',
    name: 'Tarkovsky',
    director: 'Andrei Tarkovsky',
    prompt: 'long takes, contemplative pacing, water and nature elements, philosophical atmosphere, poetic cinema',
    description: 'Poetic, contemplative, nature',
    recommendedMovement: ['steadicam', 'static'],
    recommendedLighting: 'natural',
    recommendedStyle: 'desaturated',
    recommendedAtmosphere: 'rain',
    recommendedFraming: 'wide-negative-space',
    recommendedSetDesign: 'nature-organic',
    recommendedColorPalette: 'sepia-vintage',
    recommendedCharacterStyle: 'natural-earthy'
  },
  {
    id: 'depalma',
    name: 'De Palma',
    director: 'Brian De Palma',
    prompt: 'split diopter, split screen feeling, Hitchcock homage, voyeuristic, thriller tension, operatic',
    description: 'Split diopter, Hitchcock homage',
    recommendedMovement: ['dolly-in', 'orbit-right'],
    recommendedLighting: 'dramatic',
    recommendedStyle: 'thriller',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'over-shoulder',
    recommendedSetDesign: 'gothic-ornate',
    recommendedColorPalette: 'technicolor-vivid',
    recommendedCharacterStyle: 'classic-hollywood'
  },
  {
    id: 'refn',
    name: 'Refn',
    director: 'Nicolas Winding Refn',
    prompt: 'neon-drenched, extreme color gels, synth-wave aesthetic, Drive style, hyperreal, violent beauty',
    description: 'Neon-drenched, Drive style',
    recommendedLens: 'anamorphic',
    recommendedMovement: ['dolly-in', 'steadicam'],
    recommendedLighting: 'neon',
    recommendedStyle: 'neon-noir',
    recommendedAtmosphere: 'night',
    recommendedFraming: 'profile-side',
    recommendedSetDesign: 'neon-urban',
    recommendedColorPalette: 'neon-noir',
    recommendedCharacterStyle: 'cyberpunk-street'
  },
  {
    id: 'malick',
    name: 'Malick',
    director: 'Terrence Malick',
    prompt: 'magic hour golden light, whispered voiceover feeling, nature documentary style, ethereal, spiritual',
    description: 'Golden hour, ethereal nature',
    recommendedMovement: ['steadicam', 'handheld'],
    recommendedLighting: 'golden-hour',
    recommendedStyle: 'golden-hour',
    recommendedAtmosphere: 'clear',
    recommendedFraming: 'wide-negative-space',
    recommendedSetDesign: 'nature-organic',
    recommendedColorPalette: 'golden-hour-warm',
    recommendedCharacterStyle: 'natural-earthy'
  }
];

// ============================================
// EMOTION-BASED PRESETS
// ============================================

export interface EmotionPreset {
  id: string;
  name: string;
  emotion: string;
  prompt: string;
  description: string;
  recommendedStyle?: string;
  recommendedLighting?: string;
  recommendedMovement?: string[];
}

export const EMOTION_PRESETS: EmotionPreset[] = [
  {
    id: 'fear',
    name: 'Fear',
    emotion: 'Fear/Dread',
    prompt: 'dutch angle, unstable framing, dark shadows, unsettling, horror atmosphere, something lurking',
    description: 'Horror tension, unstable',
    recommendedLighting: 'silhouette',
    recommendedMovement: ['dolly-in', 'handheld']
  },
  {
    id: 'joy',
    name: 'Joy',
    emotion: 'Joy/Happiness',
    prompt: 'bright warm lighting, golden tones, open framing, uplifting, celebration, warm colors',
    description: 'Bright, warm, uplifting',
    recommendedStyle: 'golden-hour',
    recommendedMovement: ['crane-up', 'orbit-360']
  },
  {
    id: 'tension',
    name: 'Tension',
    emotion: 'Suspense/Tension',
    prompt: 'tight framing, claustrophobic, shallow focus, ticking clock feeling, building dread',
    description: 'Tight, claustrophobic',
    recommendedLighting: 'harsh-sun',
    recommendedMovement: ['dolly-in', 'zoom-in']
  },
  {
    id: 'romance',
    name: 'Romance',
    emotion: 'Love/Romance',
    prompt: 'soft focus, warm glow, intimate framing, shallow depth of field, dreamy bokeh, tender',
    description: 'Soft, intimate, dreamy',
    recommendedStyle: 'dreamy',
    recommendedLighting: 'candlelight',
    recommendedMovement: ['orbit-right', 'dolly-in']
  },
  {
    id: 'power',
    name: 'Power',
    emotion: 'Power/Dominance',
    prompt: 'low angle looking up, heroic framing, dramatic backlighting, imposing, authoritative',
    description: 'Low angle, imposing',
    recommendedLighting: 'silhouette',
    recommendedMovement: ['tilt-up', 'dolly-in']
  },
  {
    id: 'vulnerability',
    name: 'Vulnerability',
    emotion: 'Weakness/Vulnerability',
    prompt: 'high angle looking down, small in frame, isolated, overwhelming space, exposed',
    description: 'High angle, isolated',
    recommendedMovement: ['crane-up', 'dolly-out']
  },
  {
    id: 'mystery',
    name: 'Mystery',
    emotion: 'Mystery/Intrigue',
    prompt: 'obscured view, partial reveals, shadows, noir lighting, hidden elements, enigmatic',
    description: 'Obscured, shadowy reveals',
    recommendedStyle: 'film-noir',
    recommendedLighting: 'silhouette',
    recommendedMovement: ['dolly-in', 'pan-right']
  },
  {
    id: 'chaos',
    name: 'Chaos',
    emotion: 'Chaos/Panic',
    prompt: 'shaky handheld, quick cuts feeling, dutch angles, disorienting, frantic, unstable',
    description: 'Shaky, disorienting',
    recommendedMovement: ['handheld', 'crash-zoom']
  },
  {
    id: 'peace',
    name: 'Peace',
    emotion: 'Calm/Serenity',
    prompt: 'static wide shots, balanced composition, natural lighting, slow movement, tranquil',
    description: 'Still, balanced, calm',
    recommendedLighting: 'natural',
    recommendedMovement: ['static', 'micro-movement']
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia',
    emotion: 'Nostalgia/Memory',
    prompt: 'soft edges, warm color grade, film grain, hazy glow, dreamlike, faded memories',
    description: 'Warm, grainy, dreamlike',
    recommendedStyle: 'vintage-70s',
    recommendedCamera: 'super-8'
  },
  {
    id: 'isolation',
    name: 'Isolation',
    emotion: 'Loneliness/Isolation',
    prompt: 'empty space, small subject in vast environment, cold tones, distant framing, alone',
    description: 'Empty, distant, cold',
    recommendedLens: 'wide-24',
    recommendedMovement: ['dolly-out', 'crane-up']
  },
  {
    id: 'rage',
    name: 'Rage',
    emotion: 'Anger/Rage',
    prompt: 'extreme close-ups, red color cast, intense, aggressive camera movement, visceral',
    description: 'Intense close-ups, red',
    recommendedMovement: ['crash-zoom', 'handheld']
  }
];

// ============================================
// COMPLETE SHOT SETUPS - Story Beats
// ============================================

export interface ShotSetup {
  id: string;
  name: string;
  storyBeat: string;
  prompt: string;
  description: string;
  // Pre-configured complete setup
  camera?: string;
  lens?: string;
  lighting?: string;
  movement?: string[];
  style?: string;
  atmosphere?: string;
}

export const SHOT_SETUPS: ShotSetup[] = [
  // ESTABLISHING SHOTS
  {
    id: 'epic-establish',
    name: 'Epic Establishing',
    storyBeat: 'Opening/Location Reveal',
    prompt: 'vast establishing shot, epic scale, location reveal, IMAX grandeur, sweeping vista',
    description: 'Epic location reveal',
    camera: 'imax-70mm',
    lens: 'wide-24',
    movement: ['crane-up', 'pan-right'],
    style: 'blockbuster'
  },
  {
    id: 'intimate-establish',
    name: 'Intimate Intro',
    storyBeat: 'Character Introduction',
    prompt: 'intimate character introduction, environmental portrait, revealing details',
    description: 'Character intro in environment',
    lens: 'portrait-85',
    lighting: 'natural',
    movement: ['dolly-in']
  },

  // DIALOGUE SHOTS
  {
    id: 'confrontation',
    name: 'Confrontation',
    storyBeat: 'Heated Argument',
    prompt: 'two-shot tension, alternating close-ups, confrontational framing, dramatic',
    description: 'Tense dialogue showdown',
    lens: 'standard-50',
    lighting: 'harsh-sun',
    movement: ['dolly-in', 'orbit-left']
  },
  {
    id: 'confession',
    name: 'Confession',
    storyBeat: 'Emotional Reveal',
    prompt: 'intimate single shot, slow push in, emotional vulnerability, tears close-up',
    description: 'Emotional confession moment',
    lens: 'portrait-85',
    lighting: 'natural',
    movement: ['dolly-in'],
    style: 'dreamy'
  },

  // ACTION SHOTS
  {
    id: 'chase',
    name: 'Chase Scene',
    storyBeat: 'Pursuit/Chase',
    prompt: 'dynamic chase, following action, fast movement, adrenaline, tracking pursuit',
    description: 'High-energy pursuit',
    movement: ['steadicam', 'fpv-drone'],
    style: 'blockbuster'
  },
  {
    id: 'fight',
    name: 'Fight Scene',
    storyBeat: 'Combat/Fight',
    prompt: 'kinetic fight choreography, impact shots, visceral action, dynamic angles',
    description: 'Visceral combat action',
    movement: ['handheld', 'crash-zoom'],
    lens: 'wide-35'
  },

  // EMOTIONAL BEATS
  {
    id: 'death-scene',
    name: 'Death Scene',
    storyBeat: 'Character Death',
    prompt: 'slow motion, intimate close-ups, fading light, emotional devastation, final moment',
    description: 'Tragic farewell moment',
    lighting: 'candlelight',
    movement: ['dolly-in', 'crane-up'],
    style: 'dreamy'
  },
  {
    id: 'reunion',
    name: 'Reunion',
    storyBeat: 'Emotional Reunion',
    prompt: 'building anticipation, recognition moment, embrace, joyful tears, warm lighting',
    description: 'Heartwarming reunion',
    lighting: 'natural',
    style: 'golden-hour',
    movement: ['dolly-in', 'orbit-right']
  },
  {
    id: 'victory',
    name: 'Victory Moment',
    storyBeat: 'Triumph/Win',
    prompt: 'heroic framing, low angle, rising crane, triumphant, golden hour, epic music moment',
    description: 'Triumphant hero shot',
    camera: 'imax-70mm',
    movement: ['crane-up', 'orbit-360'],
    style: 'blockbuster',
    lighting: 'natural'
  },

  // HORROR SHOTS
  {
    id: 'jumpscare',
    name: 'Jump Scare',
    storyBeat: 'Horror Reveal',
    prompt: 'slow approach, building tension, sudden reveal, sharp movement, shock',
    description: 'Building to shock reveal',
    lighting: 'silhouette',
    movement: ['dolly-in', 'crash-zoom'],
    style: 'horror'
  },
  {
    id: 'stalker',
    name: 'Stalker POV',
    storyBeat: 'Being Watched',
    prompt: 'voyeuristic framing, hidden observer, through obstacles, predatory, unseen threat',
    description: 'Predatory watching',
    movement: ['dolly-in', 'handheld'],
    lens: 'tele-200',
    style: 'horror'
  },

  // TRANSITIONS
  {
    id: 'time-passage',
    name: 'Time Passage',
    storyBeat: 'Montage/Time Skip',
    prompt: 'timelapse elements, dissolve feeling, seasons changing, time flowing',
    description: 'Time passing montage',
    movement: ['static', 'orbit-360'],
    atmosphere: 'clear'
  },
  {
    id: 'dream-sequence',
    name: 'Dream Sequence',
    storyBeat: 'Dream/Vision',
    prompt: 'surreal imagery, soft focus, floating camera, otherworldly, ethereal glow',
    description: 'Dreamlike surreal',
    style: 'dreamy',
    movement: ['steadicam', 'orbit-right'],
    atmosphere: 'mist'
  },

  // GENRE-SPECIFIC
  {
    id: 'noir-detective',
    name: 'Noir Detective',
    storyBeat: 'Investigation',
    prompt: 'hard shadows, rain-wet streets, fedora silhouette, venetian blinds, cigarette smoke',
    description: 'Classic noir investigation',
    style: 'film-noir',
    lighting: 'silhouette',
    atmosphere: 'rain',
    movement: ['dolly-in', 'pan-left']
  },
  {
    id: 'sci-fi-discovery',
    name: 'Sci-Fi Discovery',
    storyBeat: 'Alien/Tech Discovery',
    prompt: 'awe and wonder, slow reveal, technology glow, scale revelation, 2001 monolith moment',
    description: 'Awe-inspiring discovery',
    camera: 'imax-70mm',
    lens: 'wide-24',
    movement: ['crane-up', 'dolly-in'],
    style: 'cyberpunk'
  }
];

// ============================================
// FRAMING/COMPOSITION PRESETS
// ============================================

export interface FramingPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  example?: string; // Director known for this
}

export const FRAMING_PRESETS: FramingPreset[] = [
  {
    id: 'centered-symmetrical',
    name: 'Centered Symmetrical',
    prompt: 'perfectly centered subject, symmetrical composition, one-point perspective, tableau framing',
    description: 'Subject dead center, perfect symmetry',
    example: 'Wes Anderson, Kubrick'
  },
  {
    id: 'rule-of-thirds',
    name: 'Rule of Thirds',
    prompt: 'rule of thirds composition, off-center subject, balanced asymmetry, classic framing',
    description: 'Classic balanced composition',
    example: 'Spielberg'
  },
  {
    id: 'dutch-angle',
    name: 'Dutch Angle',
    prompt: 'dutch angle, tilted frame, canted camera, disorienting composition, unsettling',
    description: 'Tilted unsettling frame',
    example: 'Terry Gilliam, Horror'
  },
  {
    id: 'extreme-closeup',
    name: 'Extreme Close-up',
    prompt: 'extreme close-up, eyes only, macro detail, intimate framing, face filling frame',
    description: 'Face/detail fills frame',
    example: 'Sergio Leone'
  },
  {
    id: 'wide-negative-space',
    name: 'Wide Negative Space',
    prompt: 'vast negative space, tiny subject in frame, environmental scale, lonely composition',
    description: 'Subject dwarfed by environment',
    example: 'Villeneuve, Tarkovsky'
  },
  {
    id: 'profile-side',
    name: 'Profile/Side Shot',
    prompt: 'perfect profile shot, side view, lateral framing, flat staging, theatrical',
    description: 'Pure side profile view',
    example: 'Wes Anderson'
  },
  {
    id: 'over-shoulder',
    name: 'Over the Shoulder',
    prompt: 'over-the-shoulder framing, conversation shot, foreground silhouette, depth staging',
    description: 'Classic dialogue framing',
    example: 'Classic Hollywood'
  },
  {
    id: 'low-angle-hero',
    name: 'Low Angle Hero',
    prompt: 'low angle shot, looking up at subject, heroic framing, powerful stance, ground level',
    description: 'Looking up, powerful',
    example: 'Tarantino trunk shot'
  },
  {
    id: 'high-angle-vulnerable',
    name: 'High Angle Vulnerable',
    prompt: 'high angle shot, looking down on subject, vulnerable framing, small in frame',
    description: 'Looking down, vulnerable',
    example: 'Hitchcock'
  },
  {
    id: 'frames-within-frames',
    name: 'Frames Within Frames',
    prompt: 'doorway framing, window frame, natural frame within frame, nested composition',
    description: 'Subject framed by environment',
    example: 'John Ford'
  }
];

// ============================================
// SET DESIGN/PRODUCTION DESIGN PRESETS
// ============================================

export interface SetDesignPreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  director?: string;
}

export const SET_DESIGN_PRESETS: SetDesignPreset[] = [
  {
    id: 'sterile-geometric',
    name: 'Sterile Geometric',
    prompt: 'sterile white corridors, geometric architecture, clinical spaces, brutalist design, cold institutional',
    description: 'Cold, clinical, geometric',
    director: 'Kubrick'
  },
  {
    id: 'dollhouse-whimsy',
    name: 'Dollhouse Whimsy',
    prompt: 'miniature dollhouse aesthetic, perfectly organized spaces, pastel interiors, vintage props, handcrafted details',
    description: 'Whimsical miniature world',
    director: 'Wes Anderson'
  },
  {
    id: 'neon-urban',
    name: 'Neon Urban',
    prompt: 'neon-lit streets, rain-wet asphalt, Asian signage, cyberpunk urban, electric colors at night',
    description: 'Neon-drenched city nights',
    director: 'Refn, Wong Kar-wai'
  },
  {
    id: 'gritty-decay',
    name: 'Gritty Urban Decay',
    prompt: 'urban decay, grimy textures, industrial spaces, rust and dirt, lived-in squalor',
    description: 'Dark, dirty, decaying',
    director: 'Fincher'
  },
  {
    id: 'vast-landscapes',
    name: 'Vast Landscapes',
    prompt: 'vast desert landscapes, monumental scale, natural formations, epic vistas, dwarfing human scale',
    description: 'Epic natural environments',
    director: 'Villeneuve, Malick'
  },
  {
    id: 'retro-americana',
    name: 'Retro Americana',
    prompt: '1950s-70s Americana, diners and motels, vintage cars, nostalgic America, Kodachrome look',
    description: 'Nostalgic American past',
    director: 'Tarantino, Coen Brothers'
  },
  {
    id: 'gothic-ornate',
    name: 'Gothic Ornate',
    prompt: 'gothic architecture, ornate Victorian interiors, candlelit chambers, dark wood and velvet',
    description: 'Dark, ornate, Victorian',
    director: 'Guillermo del Toro'
  },
  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    prompt: 'minimalist interior design, clean lines, sparse furnishing, modern architecture, negative space',
    description: 'Clean, minimal, modern',
    director: 'Fincher, Villeneuve'
  },
  {
    id: 'nature-organic',
    name: 'Nature Organic',
    prompt: 'organic natural settings, forests and fields, golden wheat, flowing water, earth and sky',
    description: 'Natural, organic, earthy',
    director: 'Malick, Tarkovsky'
  },
  {
    id: 'sci-fi-industrial',
    name: 'Sci-Fi Industrial',
    prompt: 'industrial sci-fi corridors, exposed pipes and machinery, functional spacecraft design, Alien aesthetic',
    description: 'Functional future industrial',
    director: 'Ridley Scott'
  }
];

// ============================================
// COLOR PALETTE PRESETS
// ============================================

export interface ColorPalettePreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  colors: string[]; // Hex colors for UI preview
  director?: string;
}

export const COLOR_PALETTE_PRESETS: ColorPalettePreset[] = [
  {
    id: 'wes-anderson-pastel',
    name: 'Wes Anderson Pastels',
    prompt: 'pastel color palette, soft pink and mint, powder blue and cream, candy colors, muted pastels',
    description: 'Soft pastels, pinks, yellows',
    colors: ['#F4A4A4', '#A4D4AE', '#F4E4BC', '#A4C4D4', '#E4D4F4'],
    director: 'Wes Anderson'
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    prompt: 'teal and orange color grade, complementary colors, blockbuster look, warm skin tones cool shadows',
    description: 'Hollywood blockbuster grade',
    colors: ['#008080', '#FF8C00', '#004040', '#FFA500', '#006666'],
    director: 'Michael Bay, Transformers'
  },
  {
    id: 'desaturated-cold',
    name: 'Desaturated Cold',
    prompt: 'desaturated color palette, muted tones, cold blue-grey, drained of warmth, clinical',
    description: 'Cold, muted, lifeless',
    colors: ['#4A5568', '#2D3748', '#718096', '#A0AEC0', '#1A202C'],
    director: 'Fincher'
  },
  {
    id: 'neon-noir',
    name: 'Neon Noir',
    prompt: 'neon color palette, hot pink and electric blue, magenta and cyan, glowing colors in darkness',
    description: 'Electric neons in dark',
    colors: ['#FF00FF', '#00FFFF', '#FF1493', '#00CED1', '#8B00FF'],
    director: 'Refn, Gaspar Noé'
  },
  {
    id: 'golden-hour-warm',
    name: 'Golden Hour Warm',
    prompt: 'golden hour palette, warm amber tones, magic hour light, honey and gold, nostalgic warmth',
    description: 'Warm golden tones',
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#F4A460'],
    director: 'Malick'
  },
  {
    id: 'noir-monochrome',
    name: 'Noir Monochrome',
    prompt: 'high contrast black and white, film noir shadows, silver and black, monochromatic',
    description: 'Black & white noir',
    colors: ['#000000', '#1A1A1A', '#4A4A4A', '#8A8A8A', '#FFFFFF'],
    director: 'Classic Noir'
  },
  {
    id: 'sepia-vintage',
    name: 'Sepia Vintage',
    prompt: 'sepia tones, vintage photograph look, faded browns and creams, aged film stock',
    description: 'Old photograph feel',
    colors: ['#704214', '#8B7355', '#C4A777', '#E8D4A8', '#F5DEB3'],
    director: '1970s films'
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    prompt: 'green color cast, digital matrix look, green-tinted blacks, cyberpunk green',
    description: 'Digital green tint',
    colors: ['#00FF00', '#003300', '#00CC00', '#006600', '#00FF66'],
    director: 'The Matrix'
  },
  {
    id: 'bleach-bypass',
    name: 'Bleach Bypass',
    prompt: 'bleach bypass look, high contrast, desaturated but harsh, metallic sheen, Saving Private Ryan',
    description: 'High contrast, low saturation',
    colors: ['#2F4F4F', '#696969', '#808080', '#A9A9A9', '#C0C0C0'],
    director: 'Spielberg (war films)'
  },
  {
    id: 'technicolor-vivid',
    name: 'Technicolor Vivid',
    prompt: 'technicolor saturation, vivid primary colors, rich reds and blues, classic Hollywood glamour',
    description: 'Saturated classic Hollywood',
    colors: ['#FF0000', '#0000FF', '#FFD700', '#00FF00', '#FF00FF'],
    director: 'Classic Hollywood musicals'
  }
];

// ============================================
// CHARACTER STYLE/COSTUME PRESETS
// ============================================

export interface CharacterStylePreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  director?: string;
}

export const CHARACTER_STYLE_PRESETS: CharacterStylePreset[] = [
  {
    id: 'wes-anderson-quirky',
    name: 'Quirky Vintage',
    prompt: 'quirky vintage costumes, matching outfits, retro uniforms, coordinated colors, deadpan expressions',
    description: 'Matching, vintage, quirky',
    director: 'Wes Anderson'
  },
  {
    id: 'noir-hardboiled',
    name: 'Noir Hardboiled',
    prompt: 'fedora and trench coat, cigarette smoking, shadowed faces, 1940s suits, femme fatale glamour',
    description: 'Classic noir archetypes',
    director: 'Film Noir'
  },
  {
    id: 'grunge-realistic',
    name: 'Grunge Realistic',
    prompt: 'realistic worn clothing, sweat and dirt, lived-in costumes, unglamorous, authentic',
    description: 'Dirty, realistic, worn',
    director: 'Fincher'
  },
  {
    id: 'sci-fi-functional',
    name: 'Sci-Fi Functional',
    prompt: 'functional space suits, utilitarian future clothing, practical sci-fi costumes, NASA-inspired',
    description: 'Practical future wear',
    director: 'Nolan, Ridley Scott'
  },
  {
    id: 'retro-70s',
    name: 'Retro 70s',
    prompt: '1970s fashion, bell bottoms, big collars, mustaches and sideburns, brown and orange palette',
    description: '70s period costumes',
    director: 'Tarantino, Coen Bros'
  },
  {
    id: 'gothic-romantic',
    name: 'Gothic Romantic',
    prompt: 'gothic romantic costumes, flowing dark fabrics, Victorian silhouettes, pale makeup, dramatic',
    description: 'Dark romantic Victorian',
    director: 'Tim Burton'
  },
  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    prompt: 'minimalist contemporary clothing, clean lines, monochromatic outfits, simple elegant',
    description: 'Clean modern minimal',
    director: 'Denis Villeneuve'
  },
  {
    id: 'cyberpunk-street',
    name: 'Cyberpunk Street',
    prompt: 'cyberpunk street fashion, neon accents, tech wear, Asian influences, rain jacket and goggles',
    description: 'Future street style',
    director: 'Blade Runner'
  },
  {
    id: 'classic-hollywood',
    name: 'Classic Hollywood Glamour',
    prompt: 'classic Hollywood glamour, elegant gowns, tuxedos, perfectly styled hair, golden age beauty',
    description: 'Old Hollywood elegance',
    director: 'Golden Age'
  },
  {
    id: 'natural-earthy',
    name: 'Natural Earthy',
    prompt: 'natural fabrics, earthy tones, flowing linen, minimal makeup, organic and honest',
    description: 'Simple, natural, organic',
    director: 'Malick'
  }
];

// ============================================
// HELPERS
// ============================================

// Combine all cinematography selections into final prompt
export function buildCinemaPrompt(options: {
  movement?: CameraPreset[];
  lens?: LensPreset;
  camera?: CameraBodyPreset;
  focus?: FocusPreset;
  style?: StylePreset;
  lighting?: LightingPreset;
  atmosphere?: AtmospherePreset;
  motionSpeed?: MotionSpeedPreset;
  frameRate?: FrameRatePreset;
  customPrompt?: string;
}): string {
  const parts: string[] = [];

  // Add style first (establishes overall mood)
  if (options.style) {
    parts.push(options.style.prompt.split(',')[0]);
  }

  // Add camera body (establishes look)
  if (options.camera) {
    parts.push(options.camera.prompt.split(',')[0]);
  }

  // Add lens
  if (options.lens) {
    parts.push(options.lens.prompt.split(',').slice(0, 2).join(','));
  }

  // Add focus/DOF
  if (options.focus) {
    parts.push(options.focus.prompt.split(',')[0]);
  }

  // Add lighting
  if (options.lighting) {
    parts.push(options.lighting.prompt.split(',')[0]);
  }

  // Add atmosphere/weather
  if (options.atmosphere) {
    parts.push(options.atmosphere.prompt.split(',')[0]);
  }

  // Add camera movements
  if (options.movement && options.movement.length > 0) {
    const movements = options.movement.map(m => m.prompt.split(',')[0]).join(', ');
    parts.push(movements);
  }

  // Add motion speed
  if (options.motionSpeed) {
    parts.push(options.motionSpeed.prompt.split(',')[0]);
  }

  // Add frame rate style
  if (options.frameRate) {
    parts.push(options.frameRate.prompt.split(',')[0]);
  }

  // Add custom prompt
  if (options.customPrompt) {
    parts.push(options.customPrompt);
  }

  // Always end with cinematic
  parts.push('cinematic');

  return parts.join(', ');
}

// ============================================
// STORY-BASED DIRECTOR SUGGESTION GENERATOR
// Suggests what happens NEXT in the story (for IMAGE generation)
// NOT camera movements - actual story continuation!
// ============================================

// Story beat detection keywords
const STORY_BEATS = {
  chase: ['chase', 'chasing', 'running', 'fleeing', 'escape', 'pursued', 'hunting'],
  danger: ['dragon', 'monster', 'enemy', 'threat', 'attack', 'fire', 'explosion', 'danger'],
  calm: ['peaceful', 'calm', 'relaxing', 'serene', 'quiet', 'resting', 'sleeping'],
  discovery: ['finding', 'discover', 'looking', 'searching', 'exploring', 'cave', 'door'],
  confrontation: ['facing', 'battle', 'fight', 'standoff', 'versus', 'against'],
  emotion: ['sad', 'happy', 'crying', 'laughing', 'scared', 'terrified', 'angry', 'love'],
  journey: ['walking', 'traveling', 'path', 'road', 'forest', 'mountain', 'desert'],
  victory: ['winning', 'victory', 'defeating', 'celebrating', 'triumph'],
  defeat: ['falling', 'losing', 'injured', 'trapped', 'captured']
};

// What typically follows each story beat
const STORY_PROGRESSIONS: Record<string, string[]> = {
  chase: [
    'finds temporary shelter and catches breath',
    'reaches a dead end and must turn to face the threat',
    'discovers a hidden escape route',
    'trips and falls, threat closing in',
    'is saved by an unexpected ally'
  ],
  danger: [
    'narrowly dodges the attack',
    'finds cover behind debris',
    'faces the threat with newfound courage',
    'witnesses the destruction from a distance',
    'prepares for the final confrontation'
  ],
  calm: [
    'notices something unusual in the distance',
    'is interrupted by unexpected visitor',
    'makes an important decision',
    'reflects on the journey so far',
    'prepares to leave this peaceful place'
  ],
  discovery: [
    'enters the mysterious space cautiously',
    'finds exactly what they were looking for',
    'triggers an unexpected trap',
    'uncovers a shocking revelation',
    'realizes they are not alone'
  ],
  confrontation: [
    'makes the first move',
    'circles the opponent, looking for weakness',
    'exchanges fierce blows',
    'gains the upper hand momentarily',
    'is pushed back but refuses to give up'
  ],
  emotion: [
    'takes a moment to process the feelings',
    'shares the moment with a companion',
    'channels the emotion into action',
    'finds comfort in the environment',
    'makes a decision based on this feeling'
  ],
  journey: [
    'pauses to take in the breathtaking view',
    'encounters an obstacle in the path',
    'meets a fellow traveler',
    'finds signs of civilization ahead',
    'notices the weather changing dramatically'
  ],
  victory: [
    'stands triumphant over the defeated foe',
    'celebrates with allies',
    'reflects on what it cost to win',
    'claims the prize or reward',
    'looks toward the next challenge'
  ],
  defeat: [
    'struggles to get back up',
    'is rescued at the last moment',
    'finds inner strength to continue',
    'accepts help from an unlikely source',
    'plots a new strategy from the ground'
  ]
};

// Director personality templates for story framing
const DIRECTOR_STORY_STYLES: Record<string, {
  visualStyle: string;
  emotionalTone: string;
  lightingHint: string;
}> = {
  kubrick: {
    visualStyle: 'perfectly centered, symmetrical composition',
    emotionalTone: 'cold, inevitable, haunting',
    lightingHint: 'stark contrast, cold blue light'
  },
  spielberg: {
    visualStyle: 'warm medium shot, face visible',
    emotionalTone: 'hopeful, emotional, human',
    lightingHint: 'golden light, lens flares'
  },
  tarantino: {
    visualStyle: 'extreme close-up, intense angle',
    emotionalTone: 'stylized, intense, cool',
    lightingHint: 'dramatic shadows, saturated colors'
  },
  fincher: {
    visualStyle: 'dark corners, clinical precision',
    emotionalTone: 'tense, methodical, unsettling',
    lightingHint: 'sickly green tint, underexposed'
  },
  nolan: {
    visualStyle: 'epic wide shot, massive scale',
    emotionalTone: 'grand, philosophical, weighty',
    lightingHint: 'IMAX grandeur, natural elements'
  },
  villeneuve: {
    visualStyle: 'vast negative space, tiny figure',
    emotionalTone: 'contemplative, awe-inspiring, lonely',
    lightingHint: 'diffused light, fog, atmosphere'
  },
  'wes-anderson': {
    visualStyle: 'perfectly symmetrical, pastel colors',
    emotionalTone: 'whimsical, melancholy, quirky',
    lightingHint: 'soft even lighting, storybook quality'
  },
  'wong-kar-wai': {
    visualStyle: 'neon reflections, rain-soaked',
    emotionalTone: 'romantic, longing, dreamlike',
    lightingHint: 'neon reds and blues, motion blur'
  },
  tarkovsky: {
    visualStyle: 'nature elements, water reflections',
    emotionalTone: 'poetic, spiritual, meditative',
    lightingHint: 'natural light through trees, mist'
  },
  'de-palma': {
    visualStyle: 'voyeuristic angle, split focus',
    emotionalTone: 'suspenseful, paranoid, stylish',
    lightingHint: 'dramatic venetian blind shadows'
  },
  refn: {
    visualStyle: 'neon-drenched, stark silhouettes',
    emotionalTone: 'hypnotic, violent beauty, minimal',
    lightingHint: 'hot pink and electric blue neon'
  },
  malick: {
    visualStyle: 'golden hour, nature communion',
    emotionalTone: 'ethereal, transcendent, flowing',
    lightingHint: 'magic hour sunlight, lens flares'
  }
};

export function generateDirectorSuggestion(
  director: DirectorPreset,
  previousPrompt: string,
  shotNumber: number
): string {
  const prompt = previousPrompt.toLowerCase();

  // 1. Detect what story beat the previous shot was
  let detectedBeat = 'journey'; // default
  for (const [beat, keywords] of Object.entries(STORY_BEATS)) {
    if (keywords.some(keyword => prompt.includes(keyword))) {
      detectedBeat = beat;
      break;
    }
  }

  // 2. Check if director has scene-specific response for this beat
  // Map story beats to scene types
  const beatToSceneMap: Record<string, string> = {
    'danger': 'horror_corridor',
    'chase': 'horror_corridor',
    'emotion': 'character_madness',
    'confrontation': 'dialogue_tension',
    'calm': 'establishing',
    'journey': 'establishing',
    'discovery': 'establishing',
    'defeat': 'character_madness',
    'victory': 'establishing'
  };

  const sceneType = beatToSceneMap[detectedBeat];
  const sceneResponse = director.sceneResponses?.[sceneType];

  // 3. Get possible story progressions for this beat
  const progressions = STORY_PROGRESSIONS[detectedBeat] || STORY_PROGRESSIONS.journey;

  // 4. Pick a progression (cycle through based on shot number for variety)
  const progressionIndex = (shotNumber - 1) % progressions.length;
  const storyProgression = progressions[progressionIndex];

  // 5. Get director's visual style from our templates
  const directorStyle = DIRECTOR_STORY_STYLES[director.id] || {
    visualStyle: 'cinematic composition',
    emotionalTone: 'dramatic',
    lightingHint: 'atmospheric lighting'
  };

  // 6. Occasionally suggest a signature shot from shot library (every 3rd shot)
  let signatureShot: DirectorShotPreset | undefined;
  if (director.shotLibrary && shotNumber % 3 === 0) {
    const shotIndex = Math.floor(shotNumber / 3) % director.shotLibrary.length;
    signatureShot = director.shotLibrary[shotIndex];
  }

  // 7. Build FULL suggestion with ALL technical recommendations
  const parts: string[] = [];

  // === STORY (what happens next) ===
  parts.push(`Character ${storyProgression}`);

  // === VISUAL STYLE (use scene response if available) ===
  if (sceneResponse) {
    parts.push(`${sceneResponse.shot}, ${sceneResponse.lens}, ${sceneResponse.movement}`);
  } else {
    parts.push(directorStyle.visualStyle);
  }

  // === CAMERA BODY (ARRI, RED, IMAX, etc.) ===
  if (director.recommendedCamera) {
    const camera = CAMERA_BODY_PRESETS.find(c => c.id === director.recommendedCamera);
    if (camera) {
      parts.push(`shot on ${camera.name}`);
    }
  }

  // === LENS with mm ===
  if (director.recommendedLens) {
    const lens = LENS_PRESETS.find(l => l.id === director.recommendedLens);
    if (lens) {
      // Include focal length if available
      parts.push(lens.focalLength ? `${lens.focalLength} ${lens.name}` : lens.name);
    }
  }

  // === FRAMING / COMPOSITION ===
  if (director.recommendedFraming) {
    const framing = FRAMING_PRESETS.find(f => f.id === director.recommendedFraming);
    if (framing) {
      parts.push(framing.name.toLowerCase());
    }
  }

  // === LIGHTING PRESET ===
  if (director.recommendedLighting) {
    const lighting = LIGHTING_PRESETS.find(l => l.id === director.recommendedLighting);
    if (lighting) {
      parts.push(lighting.name.toLowerCase() + ' lighting');
    }
  }

  // === ATMOSPHERE (fog, rain, clear, etc.) ===
  if (director.recommendedAtmosphere) {
    const atmosphere = ATMOSPHERE_PRESETS.find(a => a.id === director.recommendedAtmosphere);
    if (atmosphere) {
      parts.push(atmosphere.name.toLowerCase() + ' atmosphere');
    }
  }

  // === COLOR PALETTE ===
  if (director.recommendedColorPalette) {
    const palette = COLOR_PALETTE_PRESETS.find(p => p.id === director.recommendedColorPalette);
    if (palette) {
      parts.push(palette.name.toLowerCase() + ' colors');
    }
  }

  // === SET DESIGN / ENVIRONMENT ===
  if (director.recommendedSetDesign) {
    const setDesign = SET_DESIGN_PRESETS.find(s => s.id === director.recommendedSetDesign);
    if (setDesign) {
      parts.push(setDesign.name.toLowerCase() + ' environment');
    }
  }

  // === CHARACTER STYLE ===
  if (director.recommendedCharacterStyle) {
    const charStyle = CHARACTER_STYLE_PRESETS.find(c => c.id === director.recommendedCharacterStyle);
    if (charStyle) {
      parts.push(charStyle.name.toLowerCase() + ' style');
    }
  }

  // === STYLE PRESET (genre/mood) ===
  if (director.recommendedStyle) {
    const style = STYLE_PRESETS.find(s => s.id === director.recommendedStyle);
    if (style) {
      parts.push(style.name.toLowerCase());
    }
  }

  // === SIGNATURE SHOT (if applicable) ===
  if (signatureShot) {
    parts.push(`[${signatureShot.name}]`);
  }

  // Build final result
  let result = parts.join(', ');

  // Filter out any terms from avoidPrompts
  if (director.avoidPrompts && director.avoidPrompts.length > 0) {
    for (const avoidTerm of director.avoidPrompts) {
      const regex = new RegExp(avoidTerm, 'gi');
      result = result.replace(regex, '');
    }
    // Clean up any double commas or spaces from removal
    result = result.replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim();
  }

  return result;
}

// Helper to get a director's signature shot by scene context
export function getDirectorSignatureShot(
  director: DirectorPreset,
  sceneContext: string
): DirectorShotPreset | undefined {
  if (!director.shotLibrary) return undefined;

  const context = sceneContext.toLowerCase();

  // Find a shot whose whenToUse matches the context
  return director.shotLibrary.find(shot =>
    shot.whenToUse.some(use => context.includes(use.toLowerCase()))
  );
}
