/* empty css                                  */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BJ9NHA2f.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DznVaL5_.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { create } from 'zustand';
export { renderers } from '../renderers.mjs';

const createEmptyShot = () => ({
  id: `shot-${Date.now()}`,
  startFrame: null,
  endFrame: null,
  cameraPresets: [],
  lens: null,
  cameraBody: null,
  focus: null,
  motionPrompt: "",
  model: "kling-2.6",
  duration: 5,
  videoUrl: null,
  status: "draft"
});
const useCinemaStore = create((set, get) => ({
  currentShot: createEmptyShot(),
  shots: [],
  selectedPresets: [],
  selectedLens: null,
  selectedCamera: null,
  selectedFocus: null,
  isGenerating: false,
  generationProgress: 0,
  error: null,
  setStartFrame: (url) => set((state) => ({
    currentShot: { ...state.currentShot, startFrame: url }
  })),
  setEndFrame: (url) => set((state) => ({
    currentShot: { ...state.currentShot, endFrame: url },
    // Auto-select Kling O1 if end frame is set
    ...url ? { currentShot: { ...state.currentShot, endFrame: url, model: "kling-o1" } } : {}
  })),
  togglePreset: (preset) => set((state) => {
    const exists = state.selectedPresets.find((p) => p.id === preset.id);
    let newPresets;
    if (exists) {
      newPresets = state.selectedPresets.filter((p) => p.id !== preset.id);
    } else if (state.selectedPresets.length < 3) {
      newPresets = [...state.selectedPresets, preset];
    } else {
      newPresets = [...state.selectedPresets.slice(1), preset];
    }
    const autoPrompt = newPresets.map((p) => p.prompt.split(",")[0]).join(", ");
    return {
      selectedPresets: newPresets,
      currentShot: {
        ...state.currentShot,
        cameraPresets: newPresets,
        motionPrompt: state.currentShot.motionPrompt || autoPrompt
      }
    };
  }),
  clearPresets: () => set((state) => ({
    selectedPresets: [],
    currentShot: { ...state.currentShot, cameraPresets: [], motionPrompt: "" }
  })),
  setLens: (lens) => set((state) => ({
    selectedLens: lens,
    currentShot: { ...state.currentShot, lens }
  })),
  setCameraBody: (camera) => set((state) => ({
    selectedCamera: camera,
    currentShot: { ...state.currentShot, cameraBody: camera }
  })),
  setFocus: (focus) => set((state) => ({
    selectedFocus: focus,
    currentShot: { ...state.currentShot, focus }
  })),
  setMotionPrompt: (prompt) => set((state) => ({
    currentShot: { ...state.currentShot, motionPrompt: prompt }
  })),
  setModel: (model) => set((state) => ({
    currentShot: { ...state.currentShot, model }
  })),
  setDuration: (duration) => set((state) => ({
    currentShot: { ...state.currentShot, duration }
  })),
  startGeneration: () => set({
    isGenerating: true,
    generationProgress: 0,
    error: null
  }),
  setProgress: (progress) => set({ generationProgress: progress }),
  completeGeneration: (videoUrl) => set((state) => ({
    isGenerating: false,
    generationProgress: 100,
    currentShot: { ...state.currentShot, videoUrl, status: "complete" }
  })),
  failGeneration: (error) => set((state) => ({
    isGenerating: false,
    generationProgress: 0,
    error,
    currentShot: { ...state.currentShot, status: "error" }
  })),
  addShot: (shot) => set((state) => ({
    shots: [...state.shots, shot]
  })),
  removeShot: (id) => set((state) => ({
    shots: state.shots.filter((s) => s.id !== id)
  })),
  reorderShots: (fromIndex, toIndex) => set((state) => {
    const newShots = [...state.shots];
    const [removed] = newShots.splice(fromIndex, 1);
    newShots.splice(toIndex, 0, removed);
    return { shots: newShots };
  }),
  saveCurrentAsShot: () => set((state) => {
    if (state.currentShot.videoUrl) {
      return {
        shots: [...state.shots, { ...state.currentShot, id: `shot-${Date.now()}` }],
        currentShot: createEmptyShot(),
        selectedPresets: [],
        selectedLens: null,
        selectedCamera: null,
        selectedFocus: null
      };
    }
    return state;
  }),
  resetCurrent: () => set({
    currentShot: createEmptyShot(),
    selectedPresets: [],
    selectedLens: null,
    selectedCamera: null,
    selectedFocus: null,
    isGenerating: false,
    generationProgress: 0,
    error: null
  })
}));

const CAMERA_PRESETS = [
  // DOLLY MOVEMENTS
  {
    id: "dolly-in",
    name: "Dolly In",
    category: "dolly",
    prompt: "dolly in, forward camera movement, approaching subject, smooth push in",
    icon: "⬆️",
    description: "Camera moves toward subject"
  },
  {
    id: "dolly-out",
    name: "Dolly Out",
    category: "dolly",
    prompt: "dolly out, pull back, revealing shot, backward camera movement",
    icon: "⬇️",
    description: "Camera moves away from subject"
  },
  {
    id: "dolly-left",
    name: "Truck Left",
    category: "dolly",
    prompt: "truck left, lateral tracking shot, camera slides left, parallax movement",
    icon: "⬅️",
    description: "Camera slides left"
  },
  {
    id: "dolly-right",
    name: "Truck Right",
    category: "dolly",
    prompt: "truck right, lateral tracking shot, camera slides right, parallax movement",
    icon: "➡️",
    description: "Camera slides right"
  },
  // PAN MOVEMENTS
  {
    id: "pan-left",
    name: "Pan Left",
    category: "pan",
    prompt: "pan left, horizontal sweep, smooth rotation left, camera turns",
    icon: "↩️",
    description: "Camera rotates left on axis"
  },
  {
    id: "pan-right",
    name: "Pan Right",
    category: "pan",
    prompt: "pan right, horizontal sweep, smooth rotation right, camera turns",
    icon: "↪️",
    description: "Camera rotates right on axis"
  },
  // TILT MOVEMENTS
  {
    id: "tilt-up",
    name: "Tilt Up",
    category: "tilt",
    prompt: "tilt up, vertical reveal, crane movement upward, looking up",
    icon: "🔼",
    description: "Camera tilts upward"
  },
  {
    id: "tilt-down",
    name: "Tilt Down",
    category: "tilt",
    prompt: "tilt down, vertical movement down, looking down, descending view",
    icon: "🔽",
    description: "Camera tilts downward"
  },
  // ORBIT MOVEMENTS
  {
    id: "orbit-left",
    name: "Orbit Left",
    category: "orbit",
    prompt: "orbit around subject counter-clockwise, circular tracking left, rotating view",
    icon: "🔄",
    description: "Camera circles left around subject"
  },
  {
    id: "orbit-right",
    name: "Orbit Right",
    category: "orbit",
    prompt: "orbit around subject clockwise, circular tracking right, rotating view",
    icon: "🔃",
    description: "Camera circles right around subject"
  },
  {
    id: "orbit-360",
    name: "360 Orbit",
    category: "orbit",
    prompt: "360-degree rotation around subject, full circular tracking, complete orbit",
    icon: "⭕",
    description: "Full circle around subject"
  },
  // ZOOM MOVEMENTS
  {
    id: "zoom-in",
    name: "Zoom In",
    category: "zoom",
    prompt: "slow zoom in, push in, intimate framing, gradual magnification",
    icon: "🔍",
    description: "Optical zoom toward subject"
  },
  {
    id: "zoom-out",
    name: "Zoom Out",
    category: "zoom",
    prompt: "slow zoom out, pull back zoom, wide reveal, gradual reduction",
    icon: "🔎",
    description: "Optical zoom away from subject"
  },
  {
    id: "crash-zoom",
    name: "Crash Zoom",
    category: "zoom",
    prompt: "crash zoom in, rapid zoom, dramatic emphasis, fast push in",
    icon: "💥",
    description: "Fast dramatic zoom"
  },
  // SPECIAL MOVEMENTS
  {
    id: "handheld",
    name: "Handheld",
    category: "special",
    prompt: "handheld camera shake, documentary style, subtle organic movement, natural sway",
    icon: "📹",
    description: "Natural handheld movement"
  },
  {
    id: "fpv-drone",
    name: "FPV Drone",
    category: "special",
    prompt: "FPV drone movement, dynamic flight path, low altitude sweep, first person view",
    icon: "🚁",
    description: "First-person drone perspective"
  },
  {
    id: "bullet-time",
    name: "Bullet Time",
    category: "special",
    prompt: "frozen spin around subject, time freeze, slow motion rotation, matrix effect",
    icon: "⏱️",
    description: "Time freeze with rotation"
  },
  {
    id: "snorricam",
    name: "Snorricam",
    category: "special",
    prompt: "snorricam, subject-mounted camera, face stays centered, background moves",
    icon: "🎭",
    description: "Camera fixed to subject"
  },
  {
    id: "crane-up",
    name: "Crane Up",
    category: "special",
    prompt: "crane shot rising, vertical arc upward, jib movement ascending, establishing shot",
    icon: "🏗️",
    description: "Rising crane movement"
  },
  {
    id: "crane-down",
    name: "Crane Down",
    category: "special",
    prompt: "crane shot descending, vertical arc downward, jib movement down",
    icon: "⬇️",
    description: "Descending crane movement"
  },
  {
    id: "through-object",
    name: "Through",
    category: "special",
    prompt: "camera moves through doorway, keyhole transition, passing through opening",
    icon: "🚪",
    description: "Move through an opening"
  },
  {
    id: "steadicam",
    name: "Steadicam",
    category: "special",
    prompt: "steadicam following, smooth glide through space, floating camera movement",
    icon: "🎬",
    description: "Smooth floating follow"
  },
  // STATIC
  {
    id: "static",
    name: "Static",
    category: "static",
    prompt: "static camera, locked off tripod shot, no movement, stable framing",
    icon: "📷",
    description: "No camera movement"
  },
  {
    id: "micro-movement",
    name: "Subtle",
    category: "static",
    prompt: "subtle micro-movements, barely perceptible drift, breathing camera",
    icon: "〰️",
    description: "Very subtle movement"
  }
];
const LENS_PRESETS = [
  // WIDE ANGLE
  {
    id: "ultra-wide-14",
    name: "14mm Ultra Wide",
    focalLength: "14mm",
    prompt: "shot on 14mm ultra-wide lens, extreme wide angle, dramatic perspective distortion, vast field of view",
    icon: "🌐",
    description: "Extreme wide, dramatic distortion"
  },
  {
    id: "wide-24",
    name: "24mm Wide",
    focalLength: "24mm",
    prompt: "shot on 24mm wide angle lens, expansive view, environmental context, slight perspective",
    icon: "📐",
    description: "Classic wide angle"
  },
  {
    id: "wide-35",
    name: "35mm",
    focalLength: "35mm",
    prompt: "shot on 35mm lens, natural perspective, documentary feel, versatile framing",
    icon: "🎞️",
    description: "Natural, documentary feel"
  },
  // STANDARD
  {
    id: "standard-50",
    name: "50mm",
    focalLength: "50mm",
    prompt: "shot on 50mm lens, natural human eye perspective, classic cinema look, minimal distortion",
    icon: "👁️",
    description: "Human eye perspective"
  },
  // PORTRAIT / TELEPHOTO
  {
    id: "portrait-85",
    name: "85mm Portrait",
    focalLength: "85mm",
    prompt: "shot on 85mm portrait lens, flattering compression, beautiful bokeh, subject isolation",
    icon: "🖼️",
    description: "Flattering portrait compression"
  },
  {
    id: "tele-135",
    name: "135mm",
    focalLength: "135mm",
    prompt: "shot on 135mm telephoto lens, strong compression, creamy background blur, intimate feel",
    icon: "🔭",
    description: "Strong compression, intimate"
  },
  {
    id: "tele-200",
    name: "200mm Telephoto",
    focalLength: "200mm",
    prompt: "shot on 200mm telephoto lens, extreme compression, stacked planes, paparazzi aesthetic",
    icon: "📡",
    description: "Extreme compression"
  },
  // SPECIAL LENSES
  {
    id: "anamorphic",
    name: "Anamorphic",
    focalLength: "anamorphic",
    prompt: "shot on anamorphic lens, horizontal lens flares, oval bokeh, 2.39:1 cinematic, widescreen",
    icon: "🎬",
    description: "Cinematic flares & oval bokeh"
  },
  {
    id: "anamorphic-vintage",
    name: "Vintage Anamorphic",
    focalLength: "vintage anamorphic",
    prompt: "vintage anamorphic lens, blue streak lens flares, aberrations, organic imperfections, filmic",
    icon: "✨",
    description: "Classic Hollywood look"
  },
  {
    id: "macro",
    name: "Macro",
    focalLength: "macro",
    prompt: "shot on macro lens, extreme close-up, tiny details revealed, microscopic view",
    icon: "🔬",
    description: "Extreme detail close-up"
  },
  {
    id: "fisheye",
    name: "Fisheye",
    focalLength: "fisheye",
    prompt: "shot on fisheye lens, 180-degree view, barrel distortion, spherical perspective",
    icon: "🐟",
    description: "Spherical wide distortion"
  },
  {
    id: "tilt-shift",
    name: "Tilt-Shift",
    focalLength: "tilt-shift",
    prompt: "tilt-shift lens effect, miniature look, selective focus plane, diorama effect",
    icon: "🏠",
    description: "Miniature/diorama effect"
  }
];
const CAMERA_BODY_PRESETS = [
  // CINEMA CAMERAS
  {
    id: "arri-alexa",
    name: "ARRI Alexa",
    prompt: "shot on ARRI Alexa, rich color science, cinematic dynamic range, Hollywood production",
    icon: "🎥",
    description: "Hollywood standard, rich colors"
  },
  {
    id: "arri-65",
    name: "ARRI 65",
    prompt: "shot on ARRI 65 large format, stunning detail, IMAX-quality, epic scope",
    icon: "🎞️",
    description: "Large format IMAX quality"
  },
  {
    id: "red-v-raptor",
    name: "RED V-Raptor",
    prompt: "shot on RED V-Raptor 8K, ultra high resolution, sharp detail, modern cinema look",
    icon: "🔴",
    description: "Sharp 8K digital cinema"
  },
  {
    id: "sony-venice",
    name: "Sony Venice",
    prompt: "shot on Sony Venice, dual ISO, wide color gamut, versatile cinematic look",
    icon: "📹",
    description: "Versatile dual ISO cinema"
  },
  {
    id: "blackmagic",
    name: "Blackmagic URSA",
    prompt: "shot on Blackmagic URSA, raw capture, indie cinema aesthetic, high dynamic range",
    icon: "⬛",
    description: "Indie cinema raw look"
  },
  // FILM STOCKS
  {
    id: "imax-70mm",
    name: "IMAX 70mm",
    prompt: "shot on IMAX 70mm film, massive resolution, epic scale, theatrical experience",
    icon: "🏛️",
    description: "Epic IMAX theatrical"
  },
  {
    id: "kodak-5219",
    name: "Kodak Vision3 500T",
    prompt: "shot on Kodak Vision3 500T film stock, warm tungsten, beautiful grain, classic Hollywood",
    icon: "🟡",
    description: "Warm tungsten film look"
  },
  {
    id: "kodak-5207",
    name: "Kodak Vision3 250D",
    prompt: "shot on Kodak Vision3 250D daylight film, natural colors, fine grain, daylight balanced",
    icon: "☀️",
    description: "Natural daylight film"
  },
  {
    id: "fuji-eterna",
    name: "Fuji Eterna",
    prompt: "shot on Fuji Eterna film, subtle colors, gentle contrast, Japanese cinema aesthetic",
    icon: "🗻",
    description: "Subtle Japanese cinema look"
  },
  // VINTAGE / SPECIAL
  {
    id: "super-8",
    name: "Super 8",
    focalLength: "super8",
    prompt: "shot on Super 8 film, heavy grain, vintage home movie look, nostalgic, light leaks",
    icon: "📼",
    description: "Nostalgic home movie grain"
  },
  {
    id: "16mm-bolex",
    name: "16mm Bolex",
    prompt: "shot on 16mm Bolex, documentary texture, indie film grain, authentic vintage",
    icon: "🎬",
    description: "Indie documentary texture"
  },
  {
    id: "vhs",
    name: "VHS Camcorder",
    prompt: "VHS camcorder footage, low resolution, tracking lines, retro 80s aesthetic, analog",
    icon: "📺",
    description: "Retro VHS aesthetic"
  },
  {
    id: "dslr-cinematic",
    name: "DSLR Cinematic",
    prompt: "DSLR cinematic footage, shallow depth of field, digital but filmic, run and gun",
    icon: "📷",
    description: "Modern DSLR film look"
  }
];
const STYLE_PRESETS = [
  {
    id: "film-noir",
    name: "Film Noir",
    prompt: "film noir style, high contrast, deep shadows, 1940s detective film, black and white, dramatic lighting",
    description: "Classic detective film look"
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    prompt: "golden hour lighting, warm sunset tones, magic hour, soft golden light, romantic atmosphere",
    description: "Warm sunset magic hour"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    prompt: "cyberpunk aesthetic, neon lights, rain-soaked streets, futuristic dystopia, pink and blue neon",
    description: "Neon-lit futuristic dystopia"
  },
  {
    id: "horror",
    name: "Horror",
    prompt: "horror film atmosphere, dark shadows, unsettling tension, dread, ominous lighting",
    description: "Dark unsettling tension"
  },
  {
    id: "dreamy",
    name: "Dreamy",
    prompt: "dreamy ethereal look, soft focus, pastel colors, hazy glow, fantasy atmosphere",
    description: "Soft ethereal fantasy"
  },
  {
    id: "gritty",
    name: "Gritty",
    prompt: "gritty realistic look, desaturated colors, harsh lighting, raw documentary style",
    description: "Raw realistic documentary"
  },
  {
    id: "vintage-70s",
    name: "70s Vintage",
    prompt: "1970s film look, warm color grade, film grain, faded blacks, retro vintage",
    description: "Retro 1970s film style"
  },
  {
    id: "blockbuster",
    name: "Blockbuster",
    prompt: "Hollywood blockbuster style, teal and orange color grade, high production value, epic scale",
    description: "Big budget Hollywood look"
  },
  {
    id: "anime",
    name: "Anime Style",
    prompt: "anime visual style, vibrant colors, dramatic lighting, Japanese animation aesthetic",
    description: "Japanese animation look"
  },
  {
    id: "wes-anderson",
    name: "Wes Anderson",
    prompt: "Wes Anderson style, symmetrical framing, pastel color palette, whimsical, centered composition",
    description: "Symmetrical whimsical pastel"
  }
];
const LIGHTING_PRESETS = [
  {
    id: "natural",
    name: "Natural Light",
    prompt: "natural lighting, available light, realistic illumination",
    description: "Realistic available light"
  },
  {
    id: "three-point",
    name: "Three Point",
    prompt: "three point lighting setup, key light, fill light, back light, studio lighting",
    description: "Classic studio setup"
  },
  {
    id: "rembrandt",
    name: "Rembrandt",
    prompt: "Rembrandt lighting, triangle shadow on cheek, dramatic portraiture, chiaroscuro",
    description: "Classic portrait triangle shadow"
  },
  {
    id: "silhouette",
    name: "Silhouette",
    prompt: "silhouette lighting, backlit, rim light only, subject in shadow",
    description: "Backlit shadow outline"
  },
  {
    id: "neon",
    name: "Neon Glow",
    prompt: "neon lighting, colored light gels, cyberpunk glow, pink and blue neon",
    description: "Colorful neon glow"
  },
  {
    id: "harsh-sun",
    name: "Harsh Sun",
    prompt: "harsh midday sun, hard shadows, high contrast, bright highlights",
    description: "Strong midday sunlight"
  },
  {
    id: "overcast",
    name: "Overcast",
    prompt: "overcast soft light, diffused illumination, no harsh shadows, even lighting",
    description: "Soft diffused daylight"
  },
  {
    id: "candlelight",
    name: "Candlelight",
    prompt: "candlelight illumination, warm flickering light, intimate atmosphere, orange glow",
    description: "Warm intimate flicker"
  },
  {
    id: "moonlight",
    name: "Moonlight",
    prompt: "moonlight illumination, blue night lighting, cool tones, nocturnal atmosphere",
    description: "Cool blue night light"
  },
  {
    id: "volumetric",
    name: "Volumetric",
    prompt: "volumetric lighting, god rays, light shafts through atmosphere, dramatic beams",
    description: "Dramatic light rays"
  }
];
const MOTION_SPEED_PRESETS = [
  {
    id: "very-slow",
    name: "Very Slow",
    prompt: "very slow motion, ultra smooth, glacial pace, meditative",
    description: "Ultra slow meditative"
  },
  {
    id: "slow",
    name: "Slow",
    prompt: "slow motion, gentle movement, smooth and deliberate",
    description: "Gentle deliberate motion"
  },
  {
    id: "normal",
    name: "Normal",
    prompt: "natural speed, normal motion, realistic timing",
    description: "Natural realistic speed"
  },
  {
    id: "fast",
    name: "Fast",
    prompt: "fast motion, dynamic movement, energetic pace, quick",
    description: "Dynamic energetic motion"
  },
  {
    id: "speed-ramp",
    name: "Speed Ramp",
    prompt: "speed ramping, slow to fast transition, time manipulation, dramatic timing",
    description: "Slow-mo to fast transition"
  },
  {
    id: "timelapse",
    name: "Timelapse",
    prompt: "timelapse motion, accelerated time, hours in seconds",
    description: "Accelerated time passage"
  },
  {
    id: "hyperlapse",
    name: "Hyperlapse",
    prompt: "hyperlapse, moving timelapse, traveling through time, dynamic timelapse",
    description: "Moving timelapse"
  }
];
const ATMOSPHERE_PRESETS = [
  {
    id: "clear",
    name: "Clear",
    prompt: "clear atmosphere, crisp visibility, no atmospheric effects",
    description: "Clear crisp air"
  },
  {
    id: "fog",
    name: "Fog",
    prompt: "thick fog, atmospheric haze, mysterious foggy, low visibility",
    description: "Mysterious thick fog"
  },
  {
    id: "mist",
    name: "Mist",
    prompt: "light mist, morning haze, subtle atmospheric diffusion",
    description: "Light morning mist"
  },
  {
    id: "rain",
    name: "Rain",
    prompt: "heavy rain, wet surfaces, rain drops, puddle reflections, stormy",
    description: "Rainy wet atmosphere"
  },
  {
    id: "snow",
    name: "Snow",
    prompt: "falling snow, winter atmosphere, snowflakes, cold breath visible",
    description: "Winter snowfall"
  },
  {
    id: "dust",
    name: "Dust",
    prompt: "dust particles, volumetric dust, hazy dusty air, particles in light",
    description: "Dusty particle-filled air"
  },
  {
    id: "smoke",
    name: "Smoke",
    prompt: "smoke atmosphere, hazy smoke, atmospheric smoke wisps",
    description: "Smoky hazy atmosphere"
  },
  {
    id: "underwater",
    name: "Underwater",
    prompt: "underwater atmosphere, light rays through water, bubbles, aquatic",
    description: "Submerged underwater"
  },
  {
    id: "heat-haze",
    name: "Heat Haze",
    prompt: "heat distortion, desert mirage, shimmering hot air",
    description: "Hot shimmering distortion"
  }
];
const DIRECTOR_PRESETS = [
  {
    id: "kubrick",
    name: "Kubrick",
    director: "Stanley Kubrick",
    prompt: "Stanley Kubrick style, symmetrical one-point perspective, wide angle lens, cold sterile lighting, meticulous composition, centered framing, geometric architecture, Steadicam glide, clinical observation",
    description: "Symmetrical, cold, meticulous",
    recommendedCamera: "arri-alexa",
    recommendedLens: "wide-24",
    recommendedMovement: ["dolly-in", "steadicam", "static"],
    recommendedLighting: "harsh-sun",
    recommendedStyle: "gritty",
    recommendedAtmosphere: "clear",
    recommendedFraming: "centered-symmetrical",
    recommendedSetDesign: "sterile-geometric",
    recommendedColorPalette: "desaturated-cold",
    recommendedCharacterStyle: "grunge-realistic",
    // Shot library - 12 signature Kubrick shots
    shotLibrary: [
      {
        id: "one-point-corridor",
        name: "One-Point Corridor",
        whenToUse: ["Establishing geography", "Character trapped", "Building dread"],
        prompt: "one-point perspective shot, symmetrical corridor, vanishing point center frame, geometric architecture, wide angle lens, stark lighting, character small in vast space, Kubrick style, clinical precision, cold institutional, 18mm wide angle",
        lens: "18mm wide",
        movement: "static or slow push",
        rig: "tripod or Steadicam"
      },
      {
        id: "kubrick-stare",
        name: "Kubrick Stare",
        whenToUse: ["Character madness", "Psychological break", "Direct confrontation"],
        prompt: "Kubrick stare, head tilted down, eyes looking up at camera, intense menacing gaze, direct eye contact, close-up, cold lighting, centered framing, psychological intensity, character breaking sanity, unsettling, Kubrick style",
        lens: "25-35mm",
        movement: "static or slow dolly in",
        rig: "tripod or dolly"
      },
      {
        id: "low-steadicam",
        name: "Low Steadicam Follow",
        whenToUse: ["Child POV", "Vulnerability", "Space hunting character"],
        prompt: "low angle Steadicam shot, 18 inches from ground, following character from behind, smooth gliding movement, child perspective, wide angle lens, corridor or hallway, ominous smooth tracking, Kubrick style, The Shining aesthetic",
        lens: "18-24mm wide",
        movement: "smooth glide",
        rig: 'modified Steadicam (18")'
      },
      {
        id: "steadicam-follow",
        name: "Steadicam Follow",
        whenToUse: ["Character moving through space", "Building tension", "Space has power"],
        prompt: "Steadicam following shot, smooth gliding movement, character walking through space, symmetrical architecture, one-point perspective, wide angle, observational, ominous smooth tracking, Kubrick style, cold precision",
        lens: "18-24mm",
        movement: "smooth follow",
        rig: "Steadicam"
      },
      {
        id: "slow-dolly-in",
        name: "Slow Dolly In",
        whenToUse: ["Building revelation", "Focusing attention", "Psychological intimacy"],
        prompt: "slow dolly in, pushing toward face, mathematical precision, centered subject, building tension, inevitable approach, intimate observation, Kubrick style, static subject, moving camera, cold lighting",
        lens: "25-35mm",
        movement: "slow dolly in",
        rig: "dolly"
      },
      {
        id: "architectural-wide",
        name: "Architectural Wide",
        whenToUse: ["Environment power", "Character insignificance", "Institutional spaces"],
        prompt: "extreme wide shot, architectural composition, geometric space, character dwarfed by environment, symmetrical framing, one-point perspective, institutional, cold sterile, Kubrick style, 18mm wide angle, vast interior space",
        lens: "18mm",
        movement: "static",
        rig: "tripod"
      },
      {
        id: "reverse-zoom",
        name: "Reverse Zoom (Barry Lyndon)",
        whenToUse: ["Period drama", "Revealing context", "Painterly effect"],
        prompt: "reverse zoom reveal, starting close-up pulling to wide tableau, painterly composition, 18th century aesthetic, candlelit interior, period costume, soft natural lighting, Barry Lyndon style, Kubrick",
        lens: "50mm (f/0.7 for candle)",
        movement: "slow zoom out",
        rig: "tripod"
      },
      {
        id: "overhead",
        name: "Overhead/Top-Down",
        whenToUse: ["Violence", "Maze reveal", "Gods eye detachment"],
        prompt: "overhead top-down shot, looking straight down at subject, geometric composition, clinical detachment, pattern visible, Kubrick style, gods eye view, cold observation",
        lens: "wide",
        movement: "static",
        rig: "crane or rig"
      },
      {
        id: "interview-confrontation",
        name: "Interview/Confrontation",
        whenToUse: ["Character explaining", "Interview moments", "Psychological examination"],
        prompt: "medium shot interview framing, subject centered, looking slightly off-camera, static tripod, cold lighting, institutional background, confrontational, Kubrick style, psychological examination, clinical observation",
        lens: "25-35mm",
        movement: "static",
        rig: "tripod"
      },
      {
        id: "helicopter-establishing",
        name: "Helicopter Establishing",
        whenToUse: ["Opening shot", "Showing isolation", "Epic scale"],
        prompt: "aerial helicopter shot, following vehicle through vast landscape, mountain roads, isolated journey, epic scale, character insignificant, nature dominates, Kubrick opening style, ominous establishing",
        lens: "wide",
        movement: "aerial follow",
        rig: "helicopter"
      },
      {
        id: "bathroom-revelation",
        name: "Bathroom Revelation",
        whenToUse: ["Private madness", "Intimate horror", "Vulnerability"],
        prompt: "bathroom interior, harsh fluorescent lighting, cold tile surfaces, isolated figure, private horror, institutional space, vulnerable, Kubrick style, psychological breakdown, clinical harsh light",
        lens: "25mm",
        movement: "static or slow",
        rig: "tripod"
      },
      {
        id: "war-room",
        name: "War Room/Control Center",
        whenToUse: ["Power concentrated", "Institutional decisions", "Satirical"],
        prompt: "war room interior, circular geometric space, large central table, figures arranged around perimeter, dramatic overhead lighting, institutional power, Kubrick style, Dr. Strangelove aesthetic, cold sterile, military/governmental",
        lens: "18-24mm wide",
        movement: "static or slow pan",
        rig: "tripod"
      }
    ],
    // Rules - what Kubrick would and wouldn't do
    rules: {
      neverDo: [
        "handheld chaos",
        "dutch angles",
        "crash zooms",
        "quick MTV-style cuts",
        "warm emotional lighting",
        "asymmetrical sloppy framing"
      ],
      alwaysDo: [
        "one-point perspective in corridors",
        "center subjects in frame",
        "wide angle for geography",
        "hold shots past comfort",
        "geometric precision",
        "practical lighting sources"
      ],
      signature: [
        "Steadicam follow through corridors",
        "Kubrick stare (eyes up through brow at camera)",
        "one-point perspective symmetry",
        "slow dolly in to face",
        "low Steadicam at child height"
      ]
    },
    // Scene-specific responses
    sceneResponses: {
      "horror_corridor": {
        shot: "wide one-point perspective",
        lens: "18mm wide",
        movement: "Steadicam glide",
        why: "Corridor becomes inescapable geometry"
      },
      "character_madness": {
        shot: "slow dolly to close-up, then stare",
        lens: "25-35mm",
        movement: "slow dolly in",
        why: "Intimacy with the breakdown, then direct confrontation"
      },
      "dialogue_tension": {
        shot: "static wide or medium",
        lens: "25mm minimum",
        movement: "static tripod",
        why: "Cold observation, let tension build without cutting"
      },
      "child_pov": {
        shot: "low tracking",
        lens: "wide",
        movement: "Steadicam at 18 inches",
        why: "World as child sees it, vulnerable perspective"
      },
      "violence": {
        shot: "wide or medium, often static",
        lens: "wide for context",
        movement: "static or slow motion",
        why: "Clinical detachment, forcing audience to watch"
      },
      "establishing": {
        shot: "extreme wide one-point",
        lens: "18mm",
        movement: "static or slow Steadicam",
        why: "Show full geography, character dwarfed by space"
      }
    },
    // Color palette with hex codes
    colorPalette: {
      primary: "#1A1A1A",
      secondary: "#4A4A4A",
      accent: "#8B0000",
      shadows: "#0D0D0D",
      highlights: "#C8C8C8"
    },
    // Prompts to avoid when generating Kubrick-style content
    avoidPrompts: [
      "handheld",
      "shaky camera",
      "quick cuts",
      "dutch angle",
      "tilted frame",
      "warm emotional",
      "soft romantic",
      "asymmetrical chaos",
      "crash zoom",
      "MTV style"
    ]
  },
  {
    id: "spielberg",
    name: "Spielberg",
    director: "Steven Spielberg",
    prompt: "warm lighting, lens flares, emotional close-ups, dynamic camera movement, blockbuster style, wonder and awe",
    description: "Warm, emotional, wonder",
    recommendedCamera: "arri-alexa",
    recommendedMovement: ["steadicam", "crane-up"],
    recommendedLighting: "natural",
    recommendedStyle: "blockbuster",
    recommendedAtmosphere: "clear",
    recommendedFraming: "rule-of-thirds",
    recommendedSetDesign: "retro-americana",
    recommendedColorPalette: "teal-orange",
    recommendedCharacterStyle: "classic-hollywood"
  },
  {
    id: "tarantino",
    name: "Tarantino",
    director: "Quentin Tarantino",
    prompt: "low angle shots, trunk shot, pop culture aesthetic, stylized violence, film grain, saturated colors",
    description: "Low angles, pop culture style",
    recommendedCamera: "kodak-5219",
    recommendedMovement: ["dolly-in", "pan-left"],
    recommendedLighting: "three-point",
    recommendedStyle: "vintage-70s",
    recommendedAtmosphere: "clear",
    recommendedFraming: "low-angle-hero",
    recommendedSetDesign: "retro-americana",
    recommendedColorPalette: "sepia-vintage",
    recommendedCharacterStyle: "retro-70s"
  },
  {
    id: "fincher",
    name: "Fincher",
    director: "David Fincher",
    prompt: "dark and moody, desaturated colors, low-key lighting, meticulous framing, clinical precision",
    description: "Dark, moody, precise",
    recommendedCamera: "red-v-raptor",
    recommendedLens: "standard-50",
    recommendedLighting: "silhouette",
    recommendedStyle: "gritty",
    recommendedAtmosphere: "fog",
    recommendedFraming: "rule-of-thirds",
    recommendedSetDesign: "gritty-decay",
    recommendedColorPalette: "desaturated-cold",
    recommendedCharacterStyle: "grunge-realistic"
  },
  {
    id: "nolan",
    name: "Nolan",
    director: "Christopher Nolan",
    prompt: "IMAX grandeur, practical effects look, blue and orange grade, epic scale, non-linear feeling",
    description: "IMAX epic, blue/orange",
    recommendedCamera: "imax-70mm",
    recommendedLens: "wide-24",
    recommendedMovement: ["steadicam", "crane-up"],
    recommendedLighting: "natural",
    recommendedStyle: "blockbuster",
    recommendedAtmosphere: "clear",
    recommendedFraming: "wide-negative-space",
    recommendedSetDesign: "sci-fi-industrial",
    recommendedColorPalette: "teal-orange",
    recommendedCharacterStyle: "sci-fi-functional"
  },
  {
    id: "villeneuve",
    name: "Villeneuve",
    director: "Denis Villeneuve",
    prompt: "vast landscapes, minimal dialogue aesthetic, Roger Deakins style, muted colors, atmospheric, contemplative",
    description: "Vast, atmospheric, Deakins",
    recommendedCamera: "arri-65",
    recommendedLens: "wide-35",
    recommendedMovement: ["dolly-in", "steadicam"],
    recommendedLighting: "silhouette",
    recommendedStyle: "desaturated",
    recommendedAtmosphere: "fog",
    recommendedFraming: "wide-negative-space",
    recommendedSetDesign: "vast-landscapes",
    recommendedColorPalette: "desaturated-cold",
    recommendedCharacterStyle: "minimalist-modern"
  },
  {
    id: "wes-anderson-dir",
    name: "Wes Anderson",
    director: "Wes Anderson",
    prompt: "perfectly symmetrical, pastel color palette, whimsical, centered subjects, tableau shots, dollhouse framing",
    description: "Symmetrical pastel whimsy",
    recommendedLens: "wide-24",
    recommendedMovement: ["pan-left", "pan-right"],
    recommendedLighting: "three-point",
    recommendedStyle: "wes-anderson",
    recommendedAtmosphere: "clear",
    recommendedFraming: "centered-symmetrical",
    recommendedSetDesign: "dollhouse-whimsy",
    recommendedColorPalette: "wes-anderson-pastel",
    recommendedCharacterStyle: "wes-anderson-quirky"
  },
  {
    id: "wong-kar-wai",
    name: "Wong Kar-wai",
    director: "Wong Kar-wai",
    prompt: "step-printed slow motion, smeared colors, neon-lit Hong Kong, romantic melancholy, Christopher Doyle style",
    description: "Neon romance, step-print",
    recommendedCamera: "kodak-5219",
    recommendedMovement: ["handheld"],
    recommendedLighting: "neon",
    recommendedStyle: "neon-noir",
    recommendedAtmosphere: "rain",
    recommendedFraming: "frames-within-frames",
    recommendedSetDesign: "neon-urban",
    recommendedColorPalette: "neon-noir",
    recommendedCharacterStyle: "classic-hollywood"
  },
  {
    id: "tarkovsky",
    name: "Tarkovsky",
    director: "Andrei Tarkovsky",
    prompt: "long takes, contemplative pacing, water and nature elements, philosophical atmosphere, poetic cinema",
    description: "Poetic, contemplative, nature",
    recommendedMovement: ["steadicam", "static"],
    recommendedLighting: "natural",
    recommendedStyle: "desaturated",
    recommendedAtmosphere: "rain",
    recommendedFraming: "wide-negative-space",
    recommendedSetDesign: "nature-organic",
    recommendedColorPalette: "sepia-vintage",
    recommendedCharacterStyle: "natural-earthy"
  },
  {
    id: "depalma",
    name: "De Palma",
    director: "Brian De Palma",
    prompt: "split diopter, split screen feeling, Hitchcock homage, voyeuristic, thriller tension, operatic",
    description: "Split diopter, Hitchcock homage",
    recommendedMovement: ["dolly-in", "orbit-right"],
    recommendedLighting: "dramatic",
    recommendedStyle: "thriller",
    recommendedAtmosphere: "clear",
    recommendedFraming: "over-shoulder",
    recommendedSetDesign: "gothic-ornate",
    recommendedColorPalette: "technicolor-vivid",
    recommendedCharacterStyle: "classic-hollywood"
  },
  {
    id: "refn",
    name: "Refn",
    director: "Nicolas Winding Refn",
    prompt: "neon-drenched, extreme color gels, synth-wave aesthetic, Drive style, hyperreal, violent beauty",
    description: "Neon-drenched, Drive style",
    recommendedLens: "anamorphic",
    recommendedMovement: ["dolly-in", "steadicam"],
    recommendedLighting: "neon",
    recommendedStyle: "neon-noir",
    recommendedAtmosphere: "night",
    recommendedFraming: "profile-side",
    recommendedSetDesign: "neon-urban",
    recommendedColorPalette: "neon-noir",
    recommendedCharacterStyle: "cyberpunk-street"
  },
  {
    id: "malick",
    name: "Malick",
    director: "Terrence Malick",
    prompt: "magic hour golden light, whispered voiceover feeling, nature documentary style, ethereal, spiritual",
    description: "Golden hour, ethereal nature",
    recommendedMovement: ["steadicam", "handheld"],
    recommendedLighting: "golden-hour",
    recommendedStyle: "golden-hour",
    recommendedAtmosphere: "clear",
    recommendedFraming: "wide-negative-space",
    recommendedSetDesign: "nature-organic",
    recommendedColorPalette: "golden-hour-warm",
    recommendedCharacterStyle: "natural-earthy"
  }
];
const EMOTION_PRESETS = [
  {
    id: "fear",
    name: "Fear",
    emotion: "Fear/Dread",
    prompt: "dutch angle, unstable framing, dark shadows, unsettling, horror atmosphere, something lurking",
    description: "Horror tension, unstable",
    recommendedLighting: "silhouette",
    recommendedMovement: ["dolly-in", "handheld"]
  },
  {
    id: "joy",
    name: "Joy",
    emotion: "Joy/Happiness",
    prompt: "bright warm lighting, golden tones, open framing, uplifting, celebration, warm colors",
    description: "Bright, warm, uplifting",
    recommendedStyle: "golden-hour",
    recommendedMovement: ["crane-up", "orbit-360"]
  },
  {
    id: "tension",
    name: "Tension",
    emotion: "Suspense/Tension",
    prompt: "tight framing, claustrophobic, shallow focus, ticking clock feeling, building dread",
    description: "Tight, claustrophobic",
    recommendedLighting: "harsh-sun",
    recommendedMovement: ["dolly-in", "zoom-in"]
  },
  {
    id: "romance",
    name: "Romance",
    emotion: "Love/Romance",
    prompt: "soft focus, warm glow, intimate framing, shallow depth of field, dreamy bokeh, tender",
    description: "Soft, intimate, dreamy",
    recommendedStyle: "dreamy",
    recommendedLighting: "candlelight",
    recommendedMovement: ["orbit-right", "dolly-in"]
  },
  {
    id: "power",
    name: "Power",
    emotion: "Power/Dominance",
    prompt: "low angle looking up, heroic framing, dramatic backlighting, imposing, authoritative",
    description: "Low angle, imposing",
    recommendedLighting: "silhouette",
    recommendedMovement: ["tilt-up", "dolly-in"]
  },
  {
    id: "vulnerability",
    name: "Vulnerability",
    emotion: "Weakness/Vulnerability",
    prompt: "high angle looking down, small in frame, isolated, overwhelming space, exposed",
    description: "High angle, isolated",
    recommendedMovement: ["crane-up", "dolly-out"]
  },
  {
    id: "mystery",
    name: "Mystery",
    emotion: "Mystery/Intrigue",
    prompt: "obscured view, partial reveals, shadows, noir lighting, hidden elements, enigmatic",
    description: "Obscured, shadowy reveals",
    recommendedStyle: "film-noir",
    recommendedLighting: "silhouette",
    recommendedMovement: ["dolly-in", "pan-right"]
  },
  {
    id: "chaos",
    name: "Chaos",
    emotion: "Chaos/Panic",
    prompt: "shaky handheld, quick cuts feeling, dutch angles, disorienting, frantic, unstable",
    description: "Shaky, disorienting",
    recommendedMovement: ["handheld", "crash-zoom"]
  },
  {
    id: "peace",
    name: "Peace",
    emotion: "Calm/Serenity",
    prompt: "static wide shots, balanced composition, natural lighting, slow movement, tranquil",
    description: "Still, balanced, calm",
    recommendedLighting: "natural",
    recommendedMovement: ["static", "micro-movement"]
  },
  {
    id: "nostalgia",
    name: "Nostalgia",
    emotion: "Nostalgia/Memory",
    prompt: "soft edges, warm color grade, film grain, hazy glow, dreamlike, faded memories",
    description: "Warm, grainy, dreamlike",
    recommendedStyle: "vintage-70s",
    recommendedCamera: "super-8"
  },
  {
    id: "isolation",
    name: "Isolation",
    emotion: "Loneliness/Isolation",
    prompt: "empty space, small subject in vast environment, cold tones, distant framing, alone",
    description: "Empty, distant, cold",
    recommendedLens: "wide-24",
    recommendedMovement: ["dolly-out", "crane-up"]
  },
  {
    id: "rage",
    name: "Rage",
    emotion: "Anger/Rage",
    prompt: "extreme close-ups, red color cast, intense, aggressive camera movement, visceral",
    description: "Intense close-ups, red",
    recommendedMovement: ["crash-zoom", "handheld"]
  }
];
const SHOT_SETUPS = [
  // ESTABLISHING SHOTS
  {
    id: "epic-establish",
    name: "Epic Establishing",
    storyBeat: "Opening/Location Reveal",
    prompt: "vast establishing shot, epic scale, location reveal, IMAX grandeur, sweeping vista",
    description: "Epic location reveal",
    camera: "imax-70mm",
    lens: "wide-24",
    movement: ["crane-up", "pan-right"],
    style: "blockbuster"
  },
  {
    id: "intimate-establish",
    name: "Intimate Intro",
    storyBeat: "Character Introduction",
    prompt: "intimate character introduction, environmental portrait, revealing details",
    description: "Character intro in environment",
    lens: "portrait-85",
    lighting: "natural",
    movement: ["dolly-in"]
  },
  // DIALOGUE SHOTS
  {
    id: "confrontation",
    name: "Confrontation",
    storyBeat: "Heated Argument",
    prompt: "two-shot tension, alternating close-ups, confrontational framing, dramatic",
    description: "Tense dialogue showdown",
    lens: "standard-50",
    lighting: "harsh-sun",
    movement: ["dolly-in", "orbit-left"]
  },
  {
    id: "confession",
    name: "Confession",
    storyBeat: "Emotional Reveal",
    prompt: "intimate single shot, slow push in, emotional vulnerability, tears close-up",
    description: "Emotional confession moment",
    lens: "portrait-85",
    lighting: "natural",
    movement: ["dolly-in"],
    style: "dreamy"
  },
  // ACTION SHOTS
  {
    id: "chase",
    name: "Chase Scene",
    storyBeat: "Pursuit/Chase",
    prompt: "dynamic chase, following action, fast movement, adrenaline, tracking pursuit",
    description: "High-energy pursuit",
    movement: ["steadicam", "fpv-drone"],
    style: "blockbuster"
  },
  {
    id: "fight",
    name: "Fight Scene",
    storyBeat: "Combat/Fight",
    prompt: "kinetic fight choreography, impact shots, visceral action, dynamic angles",
    description: "Visceral combat action",
    movement: ["handheld", "crash-zoom"],
    lens: "wide-35"
  },
  // EMOTIONAL BEATS
  {
    id: "death-scene",
    name: "Death Scene",
    storyBeat: "Character Death",
    prompt: "slow motion, intimate close-ups, fading light, emotional devastation, final moment",
    description: "Tragic farewell moment",
    lighting: "candlelight",
    movement: ["dolly-in", "crane-up"],
    style: "dreamy"
  },
  {
    id: "reunion",
    name: "Reunion",
    storyBeat: "Emotional Reunion",
    prompt: "building anticipation, recognition moment, embrace, joyful tears, warm lighting",
    description: "Heartwarming reunion",
    lighting: "natural",
    style: "golden-hour",
    movement: ["dolly-in", "orbit-right"]
  },
  {
    id: "victory",
    name: "Victory Moment",
    storyBeat: "Triumph/Win",
    prompt: "heroic framing, low angle, rising crane, triumphant, golden hour, epic music moment",
    description: "Triumphant hero shot",
    camera: "imax-70mm",
    movement: ["crane-up", "orbit-360"],
    style: "blockbuster",
    lighting: "natural"
  },
  // HORROR SHOTS
  {
    id: "jumpscare",
    name: "Jump Scare",
    storyBeat: "Horror Reveal",
    prompt: "slow approach, building tension, sudden reveal, sharp movement, shock",
    description: "Building to shock reveal",
    lighting: "silhouette",
    movement: ["dolly-in", "crash-zoom"],
    style: "horror"
  },
  {
    id: "stalker",
    name: "Stalker POV",
    storyBeat: "Being Watched",
    prompt: "voyeuristic framing, hidden observer, through obstacles, predatory, unseen threat",
    description: "Predatory watching",
    movement: ["dolly-in", "handheld"],
    lens: "tele-200",
    style: "horror"
  },
  // TRANSITIONS
  {
    id: "time-passage",
    name: "Time Passage",
    storyBeat: "Montage/Time Skip",
    prompt: "timelapse elements, dissolve feeling, seasons changing, time flowing",
    description: "Time passing montage",
    movement: ["static", "orbit-360"],
    atmosphere: "clear"
  },
  {
    id: "dream-sequence",
    name: "Dream Sequence",
    storyBeat: "Dream/Vision",
    prompt: "surreal imagery, soft focus, floating camera, otherworldly, ethereal glow",
    description: "Dreamlike surreal",
    style: "dreamy",
    movement: ["steadicam", "orbit-right"],
    atmosphere: "mist"
  },
  // GENRE-SPECIFIC
  {
    id: "noir-detective",
    name: "Noir Detective",
    storyBeat: "Investigation",
    prompt: "hard shadows, rain-wet streets, fedora silhouette, venetian blinds, cigarette smoke",
    description: "Classic noir investigation",
    style: "film-noir",
    lighting: "silhouette",
    atmosphere: "rain",
    movement: ["dolly-in", "pan-left"]
  },
  {
    id: "sci-fi-discovery",
    name: "Sci-Fi Discovery",
    storyBeat: "Alien/Tech Discovery",
    prompt: "awe and wonder, slow reveal, technology glow, scale revelation, 2001 monolith moment",
    description: "Awe-inspiring discovery",
    camera: "imax-70mm",
    lens: "wide-24",
    movement: ["crane-up", "dolly-in"],
    style: "cyberpunk"
  }
];
const FRAMING_PRESETS = [
  {
    id: "centered-symmetrical",
    name: "Centered Symmetrical",
    prompt: "perfectly centered subject, symmetrical composition, one-point perspective, tableau framing",
    description: "Subject dead center, perfect symmetry",
    example: "Wes Anderson, Kubrick"
  },
  {
    id: "rule-of-thirds",
    name: "Rule of Thirds",
    prompt: "rule of thirds composition, off-center subject, balanced asymmetry, classic framing",
    description: "Classic balanced composition",
    example: "Spielberg"
  },
  {
    id: "dutch-angle",
    name: "Dutch Angle",
    prompt: "dutch angle, tilted frame, canted camera, disorienting composition, unsettling",
    description: "Tilted unsettling frame",
    example: "Terry Gilliam, Horror"
  },
  {
    id: "extreme-closeup",
    name: "Extreme Close-up",
    prompt: "extreme close-up, eyes only, macro detail, intimate framing, face filling frame",
    description: "Face/detail fills frame",
    example: "Sergio Leone"
  },
  {
    id: "wide-negative-space",
    name: "Wide Negative Space",
    prompt: "vast negative space, tiny subject in frame, environmental scale, lonely composition",
    description: "Subject dwarfed by environment",
    example: "Villeneuve, Tarkovsky"
  },
  {
    id: "profile-side",
    name: "Profile/Side Shot",
    prompt: "perfect profile shot, side view, lateral framing, flat staging, theatrical",
    description: "Pure side profile view",
    example: "Wes Anderson"
  },
  {
    id: "over-shoulder",
    name: "Over the Shoulder",
    prompt: "over-the-shoulder framing, conversation shot, foreground silhouette, depth staging",
    description: "Classic dialogue framing",
    example: "Classic Hollywood"
  },
  {
    id: "low-angle-hero",
    name: "Low Angle Hero",
    prompt: "low angle shot, looking up at subject, heroic framing, powerful stance, ground level",
    description: "Looking up, powerful",
    example: "Tarantino trunk shot"
  },
  {
    id: "high-angle-vulnerable",
    name: "High Angle Vulnerable",
    prompt: "high angle shot, looking down on subject, vulnerable framing, small in frame",
    description: "Looking down, vulnerable",
    example: "Hitchcock"
  },
  {
    id: "frames-within-frames",
    name: "Frames Within Frames",
    prompt: "doorway framing, window frame, natural frame within frame, nested composition",
    description: "Subject framed by environment",
    example: "John Ford"
  }
];
const SET_DESIGN_PRESETS = [
  {
    id: "sterile-geometric",
    name: "Sterile Geometric",
    prompt: "sterile white corridors, geometric architecture, clinical spaces, brutalist design, cold institutional",
    description: "Cold, clinical, geometric",
    director: "Kubrick"
  },
  {
    id: "dollhouse-whimsy",
    name: "Dollhouse Whimsy",
    prompt: "miniature dollhouse aesthetic, perfectly organized spaces, pastel interiors, vintage props, handcrafted details",
    description: "Whimsical miniature world",
    director: "Wes Anderson"
  },
  {
    id: "neon-urban",
    name: "Neon Urban",
    prompt: "neon-lit streets, rain-wet asphalt, Asian signage, cyberpunk urban, electric colors at night",
    description: "Neon-drenched city nights",
    director: "Refn, Wong Kar-wai"
  },
  {
    id: "gritty-decay",
    name: "Gritty Urban Decay",
    prompt: "urban decay, grimy textures, industrial spaces, rust and dirt, lived-in squalor",
    description: "Dark, dirty, decaying",
    director: "Fincher"
  },
  {
    id: "vast-landscapes",
    name: "Vast Landscapes",
    prompt: "vast desert landscapes, monumental scale, natural formations, epic vistas, dwarfing human scale",
    description: "Epic natural environments",
    director: "Villeneuve, Malick"
  },
  {
    id: "retro-americana",
    name: "Retro Americana",
    prompt: "1950s-70s Americana, diners and motels, vintage cars, nostalgic America, Kodachrome look",
    description: "Nostalgic American past",
    director: "Tarantino, Coen Brothers"
  },
  {
    id: "gothic-ornate",
    name: "Gothic Ornate",
    prompt: "gothic architecture, ornate Victorian interiors, candlelit chambers, dark wood and velvet",
    description: "Dark, ornate, Victorian",
    director: "Guillermo del Toro"
  },
  {
    id: "minimalist-modern",
    name: "Minimalist Modern",
    prompt: "minimalist interior design, clean lines, sparse furnishing, modern architecture, negative space",
    description: "Clean, minimal, modern",
    director: "Fincher, Villeneuve"
  },
  {
    id: "nature-organic",
    name: "Nature Organic",
    prompt: "organic natural settings, forests and fields, golden wheat, flowing water, earth and sky",
    description: "Natural, organic, earthy",
    director: "Malick, Tarkovsky"
  },
  {
    id: "sci-fi-industrial",
    name: "Sci-Fi Industrial",
    prompt: "industrial sci-fi corridors, exposed pipes and machinery, functional spacecraft design, Alien aesthetic",
    description: "Functional future industrial",
    director: "Ridley Scott"
  }
];
const COLOR_PALETTE_PRESETS = [
  {
    id: "wes-anderson-pastel",
    name: "Wes Anderson Pastels",
    prompt: "pastel color palette, soft pink and mint, powder blue and cream, candy colors, muted pastels",
    description: "Soft pastels, pinks, yellows",
    colors: ["#F4A4A4", "#A4D4AE", "#F4E4BC", "#A4C4D4", "#E4D4F4"],
    director: "Wes Anderson"
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    prompt: "teal and orange color grade, complementary colors, blockbuster look, warm skin tones cool shadows",
    description: "Hollywood blockbuster grade",
    colors: ["#008080", "#FF8C00", "#004040", "#FFA500", "#006666"],
    director: "Michael Bay, Transformers"
  },
  {
    id: "desaturated-cold",
    name: "Desaturated Cold",
    prompt: "desaturated color palette, muted tones, cold blue-grey, drained of warmth, clinical",
    description: "Cold, muted, lifeless",
    colors: ["#4A5568", "#2D3748", "#718096", "#A0AEC0", "#1A202C"],
    director: "Fincher"
  },
  {
    id: "neon-noir",
    name: "Neon Noir",
    prompt: "neon color palette, hot pink and electric blue, magenta and cyan, glowing colors in darkness",
    description: "Electric neons in dark",
    colors: ["#FF00FF", "#00FFFF", "#FF1493", "#00CED1", "#8B00FF"],
    director: "Refn, Gaspar Noé"
  },
  {
    id: "golden-hour-warm",
    name: "Golden Hour Warm",
    prompt: "golden hour palette, warm amber tones, magic hour light, honey and gold, nostalgic warmth",
    description: "Warm golden tones",
    colors: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#F4A460"],
    director: "Malick"
  },
  {
    id: "noir-monochrome",
    name: "Noir Monochrome",
    prompt: "high contrast black and white, film noir shadows, silver and black, monochromatic",
    description: "Black & white noir",
    colors: ["#000000", "#1A1A1A", "#4A4A4A", "#8A8A8A", "#FFFFFF"],
    director: "Classic Noir"
  },
  {
    id: "sepia-vintage",
    name: "Sepia Vintage",
    prompt: "sepia tones, vintage photograph look, faded browns and creams, aged film stock",
    description: "Old photograph feel",
    colors: ["#704214", "#8B7355", "#C4A777", "#E8D4A8", "#F5DEB3"],
    director: "1970s films"
  },
  {
    id: "matrix-green",
    name: "Matrix Green",
    prompt: "green color cast, digital matrix look, green-tinted blacks, cyberpunk green",
    description: "Digital green tint",
    colors: ["#00FF00", "#003300", "#00CC00", "#006600", "#00FF66"],
    director: "The Matrix"
  },
  {
    id: "bleach-bypass",
    name: "Bleach Bypass",
    prompt: "bleach bypass look, high contrast, desaturated but harsh, metallic sheen, Saving Private Ryan",
    description: "High contrast, low saturation",
    colors: ["#2F4F4F", "#696969", "#808080", "#A9A9A9", "#C0C0C0"],
    director: "Spielberg (war films)"
  },
  {
    id: "technicolor-vivid",
    name: "Technicolor Vivid",
    prompt: "technicolor saturation, vivid primary colors, rich reds and blues, classic Hollywood glamour",
    description: "Saturated classic Hollywood",
    colors: ["#FF0000", "#0000FF", "#FFD700", "#00FF00", "#FF00FF"],
    director: "Classic Hollywood musicals"
  }
];
const CHARACTER_STYLE_PRESETS = [
  {
    id: "wes-anderson-quirky",
    name: "Quirky Vintage",
    prompt: "quirky vintage costumes, matching outfits, retro uniforms, coordinated colors, deadpan expressions",
    description: "Matching, vintage, quirky",
    director: "Wes Anderson"
  },
  {
    id: "noir-hardboiled",
    name: "Noir Hardboiled",
    prompt: "fedora and trench coat, cigarette smoking, shadowed faces, 1940s suits, femme fatale glamour",
    description: "Classic noir archetypes",
    director: "Film Noir"
  },
  {
    id: "grunge-realistic",
    name: "Grunge Realistic",
    prompt: "realistic worn clothing, sweat and dirt, lived-in costumes, unglamorous, authentic",
    description: "Dirty, realistic, worn",
    director: "Fincher"
  },
  {
    id: "sci-fi-functional",
    name: "Sci-Fi Functional",
    prompt: "functional space suits, utilitarian future clothing, practical sci-fi costumes, NASA-inspired",
    description: "Practical future wear",
    director: "Nolan, Ridley Scott"
  },
  {
    id: "retro-70s",
    name: "Retro 70s",
    prompt: "1970s fashion, bell bottoms, big collars, mustaches and sideburns, brown and orange palette",
    description: "70s period costumes",
    director: "Tarantino, Coen Bros"
  },
  {
    id: "gothic-romantic",
    name: "Gothic Romantic",
    prompt: "gothic romantic costumes, flowing dark fabrics, Victorian silhouettes, pale makeup, dramatic",
    description: "Dark romantic Victorian",
    director: "Tim Burton"
  },
  {
    id: "minimalist-modern",
    name: "Minimalist Modern",
    prompt: "minimalist contemporary clothing, clean lines, monochromatic outfits, simple elegant",
    description: "Clean modern minimal",
    director: "Denis Villeneuve"
  },
  {
    id: "cyberpunk-street",
    name: "Cyberpunk Street",
    prompt: "cyberpunk street fashion, neon accents, tech wear, Asian influences, rain jacket and goggles",
    description: "Future street style",
    director: "Blade Runner"
  },
  {
    id: "classic-hollywood",
    name: "Classic Hollywood Glamour",
    prompt: "classic Hollywood glamour, elegant gowns, tuxedos, perfectly styled hair, golden age beauty",
    description: "Old Hollywood elegance",
    director: "Golden Age"
  },
  {
    id: "natural-earthy",
    name: "Natural Earthy",
    prompt: "natural fabrics, earthy tones, flowing linen, minimal makeup, organic and honest",
    description: "Simple, natural, organic",
    director: "Malick"
  }
];
function buildCinemaPrompt(options) {
  const parts = [];
  if (options.style) {
    parts.push(options.style.prompt.split(",")[0]);
  }
  if (options.camera) {
    parts.push(options.camera.prompt.split(",")[0]);
  }
  if (options.lens) {
    parts.push(options.lens.prompt.split(",").slice(0, 2).join(","));
  }
  if (options.focus) {
    parts.push(options.focus.prompt.split(",")[0]);
  }
  if (options.lighting) {
    parts.push(options.lighting.prompt.split(",")[0]);
  }
  if (options.atmosphere) {
    parts.push(options.atmosphere.prompt.split(",")[0]);
  }
  if (options.movement && options.movement.length > 0) {
    const movements = options.movement.map((m) => m.prompt.split(",")[0]).join(", ");
    parts.push(movements);
  }
  if (options.motionSpeed) {
    parts.push(options.motionSpeed.prompt.split(",")[0]);
  }
  if (options.frameRate) {
    parts.push(options.frameRate.prompt.split(",")[0]);
  }
  if (options.customPrompt) {
    parts.push(options.customPrompt);
  }
  parts.push("cinematic");
  return parts.join(", ");
}
const STORY_BEATS = {
  chase: ["chase", "chasing", "running", "fleeing", "escape", "pursued", "hunting"],
  danger: ["dragon", "monster", "enemy", "threat", "attack", "fire", "explosion", "danger"],
  calm: ["peaceful", "calm", "relaxing", "serene", "quiet", "resting", "sleeping"],
  discovery: ["finding", "discover", "looking", "searching", "exploring", "cave", "door"],
  confrontation: ["facing", "battle", "fight", "standoff", "versus", "against"],
  emotion: ["sad", "happy", "crying", "laughing", "scared", "terrified", "angry", "love"],
  journey: ["walking", "traveling", "path", "road", "forest", "mountain", "desert"],
  victory: ["winning", "victory", "defeating", "celebrating", "triumph"],
  defeat: ["falling", "losing", "injured", "trapped", "captured"]
};
const STORY_PROGRESSIONS = {
  chase: [
    "finds temporary shelter and catches breath",
    "reaches a dead end and must turn to face the threat",
    "discovers a hidden escape route",
    "trips and falls, threat closing in",
    "is saved by an unexpected ally"
  ],
  danger: [
    "narrowly dodges the attack",
    "finds cover behind debris",
    "faces the threat with newfound courage",
    "witnesses the destruction from a distance",
    "prepares for the final confrontation"
  ],
  calm: [
    "notices something unusual in the distance",
    "is interrupted by unexpected visitor",
    "makes an important decision",
    "reflects on the journey so far",
    "prepares to leave this peaceful place"
  ],
  discovery: [
    "enters the mysterious space cautiously",
    "finds exactly what they were looking for",
    "triggers an unexpected trap",
    "uncovers a shocking revelation",
    "realizes they are not alone"
  ],
  confrontation: [
    "makes the first move",
    "circles the opponent, looking for weakness",
    "exchanges fierce blows",
    "gains the upper hand momentarily",
    "is pushed back but refuses to give up"
  ],
  emotion: [
    "takes a moment to process the feelings",
    "shares the moment with a companion",
    "channels the emotion into action",
    "finds comfort in the environment",
    "makes a decision based on this feeling"
  ],
  journey: [
    "pauses to take in the breathtaking view",
    "encounters an obstacle in the path",
    "meets a fellow traveler",
    "finds signs of civilization ahead",
    "notices the weather changing dramatically"
  ],
  victory: [
    "stands triumphant over the defeated foe",
    "celebrates with allies",
    "reflects on what it cost to win",
    "claims the prize or reward",
    "looks toward the next challenge"
  ],
  defeat: [
    "struggles to get back up",
    "is rescued at the last moment",
    "finds inner strength to continue",
    "accepts help from an unlikely source",
    "plots a new strategy from the ground"
  ]
};
const DIRECTOR_STORY_STYLES = {
  kubrick: {
    visualStyle: "perfectly centered, symmetrical composition",
    emotionalTone: "cold, inevitable, haunting",
    lightingHint: "stark contrast, cold blue light"
  },
  spielberg: {
    visualStyle: "warm medium shot, face visible",
    emotionalTone: "hopeful, emotional, human",
    lightingHint: "golden light, lens flares"
  },
  tarantino: {
    visualStyle: "extreme close-up, intense angle",
    emotionalTone: "stylized, intense, cool",
    lightingHint: "dramatic shadows, saturated colors"
  },
  fincher: {
    visualStyle: "dark corners, clinical precision",
    emotionalTone: "tense, methodical, unsettling",
    lightingHint: "sickly green tint, underexposed"
  },
  nolan: {
    visualStyle: "epic wide shot, massive scale",
    emotionalTone: "grand, philosophical, weighty",
    lightingHint: "IMAX grandeur, natural elements"
  },
  villeneuve: {
    visualStyle: "vast negative space, tiny figure",
    emotionalTone: "contemplative, awe-inspiring, lonely",
    lightingHint: "diffused light, fog, atmosphere"
  },
  "wes-anderson": {
    visualStyle: "perfectly symmetrical, pastel colors",
    emotionalTone: "whimsical, melancholy, quirky",
    lightingHint: "soft even lighting, storybook quality"
  },
  "wong-kar-wai": {
    visualStyle: "neon reflections, rain-soaked",
    emotionalTone: "romantic, longing, dreamlike",
    lightingHint: "neon reds and blues, motion blur"
  },
  tarkovsky: {
    visualStyle: "nature elements, water reflections",
    emotionalTone: "poetic, spiritual, meditative",
    lightingHint: "natural light through trees, mist"
  },
  "de-palma": {
    visualStyle: "voyeuristic angle, split focus",
    emotionalTone: "suspenseful, paranoid, stylish",
    lightingHint: "dramatic venetian blind shadows"
  },
  refn: {
    visualStyle: "neon-drenched, stark silhouettes",
    emotionalTone: "hypnotic, violent beauty, minimal",
    lightingHint: "hot pink and electric blue neon"
  },
  malick: {
    visualStyle: "golden hour, nature communion",
    emotionalTone: "ethereal, transcendent, flowing",
    lightingHint: "magic hour sunlight, lens flares"
  }
};
function generateDirectorSuggestion(director, previousPrompt, shotNumber) {
  const prompt = previousPrompt.toLowerCase();
  let detectedBeat = "journey";
  for (const [beat, keywords] of Object.entries(STORY_BEATS)) {
    if (keywords.some((keyword) => prompt.includes(keyword))) {
      detectedBeat = beat;
      break;
    }
  }
  const beatToSceneMap = {
    "danger": "horror_corridor",
    "chase": "horror_corridor",
    "emotion": "character_madness",
    "confrontation": "dialogue_tension",
    "calm": "establishing",
    "journey": "establishing",
    "discovery": "establishing",
    "defeat": "character_madness",
    "victory": "establishing"
  };
  const sceneType = beatToSceneMap[detectedBeat];
  const sceneResponse = director.sceneResponses?.[sceneType];
  const progressions = STORY_PROGRESSIONS[detectedBeat] || STORY_PROGRESSIONS.journey;
  const progressionIndex = (shotNumber - 1) % progressions.length;
  const storyProgression = progressions[progressionIndex];
  const directorStyle = DIRECTOR_STORY_STYLES[director.id] || {
    visualStyle: "cinematic composition"};
  let signatureShot;
  if (director.shotLibrary && shotNumber % 3 === 0) {
    const shotIndex = Math.floor(shotNumber / 3) % director.shotLibrary.length;
    signatureShot = director.shotLibrary[shotIndex];
  }
  const parts = [];
  parts.push(`Character ${storyProgression}`);
  if (sceneResponse) {
    parts.push(`${sceneResponse.shot}, ${sceneResponse.lens}, ${sceneResponse.movement}`);
  } else {
    parts.push(directorStyle.visualStyle);
  }
  if (director.recommendedCamera) {
    const camera = CAMERA_BODY_PRESETS.find((c) => c.id === director.recommendedCamera);
    if (camera) {
      parts.push(`shot on ${camera.name}`);
    }
  }
  if (director.recommendedLens) {
    const lens = LENS_PRESETS.find((l) => l.id === director.recommendedLens);
    if (lens) {
      parts.push(lens.focalLength ? `${lens.focalLength} ${lens.name}` : lens.name);
    }
  }
  if (director.recommendedFraming) {
    const framing = FRAMING_PRESETS.find((f) => f.id === director.recommendedFraming);
    if (framing) {
      parts.push(framing.name.toLowerCase());
    }
  }
  if (director.recommendedLighting) {
    const lighting = LIGHTING_PRESETS.find((l) => l.id === director.recommendedLighting);
    if (lighting) {
      parts.push(lighting.name.toLowerCase() + " lighting");
    }
  }
  if (director.recommendedAtmosphere) {
    const atmosphere = ATMOSPHERE_PRESETS.find((a) => a.id === director.recommendedAtmosphere);
    if (atmosphere) {
      parts.push(atmosphere.name.toLowerCase() + " atmosphere");
    }
  }
  if (director.recommendedColorPalette) {
    const palette = COLOR_PALETTE_PRESETS.find((p) => p.id === director.recommendedColorPalette);
    if (palette) {
      parts.push(palette.name.toLowerCase() + " colors");
    }
  }
  if (director.recommendedSetDesign) {
    const setDesign = SET_DESIGN_PRESETS.find((s) => s.id === director.recommendedSetDesign);
    if (setDesign) {
      parts.push(setDesign.name.toLowerCase() + " environment");
    }
  }
  if (director.recommendedCharacterStyle) {
    const charStyle = CHARACTER_STYLE_PRESETS.find((c) => c.id === director.recommendedCharacterStyle);
    if (charStyle) {
      parts.push(charStyle.name.toLowerCase() + " style");
    }
  }
  if (director.recommendedStyle) {
    const style = STYLE_PRESETS.find((s) => s.id === director.recommendedStyle);
    if (style) {
      parts.push(style.name.toLowerCase());
    }
  }
  if (signatureShot) {
    parts.push(`[${signatureShot.name}]`);
  }
  let result = parts.join(", ");
  if (director.avoidPrompts && director.avoidPrompts.length > 0) {
    for (const avoidTerm of director.avoidPrompts) {
      const regex = new RegExp(avoidTerm, "gi");
      result = result.replace(regex, "");
    }
    result = result.replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();
  }
  return result;
}

const Icons = {
  image: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-5 h-5", children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M21 15l-5-5L5 21" })
  ] }),
  video: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-5 h-5", children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "4", width: "16", height: "16", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M22 8l-4 2v4l4 2V8z" })
  ] }),
  movement: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) }),
  aspectRatio: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: /* @__PURE__ */ jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }) }),
  clock: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 3" })
  ] }),
  plus: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) }),
  minus: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14" }) }),
  sparkle: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" }) }),
  camera: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-5 h-5", children: [
    /* @__PURE__ */ jsx("path", { d: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  close: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }),
  style: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.3" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2c3 3 4.5 6.5 4.5 10" }),
    /* @__PURE__ */ jsx("path", { d: "M2 12h10" }),
    /* @__PURE__ */ jsx("circle", { cx: "19", cy: "19", r: "3" }),
    /* @__PURE__ */ jsx("path", { d: "M22 22l-1.5-1.5" })
  ] }),
  light: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "5" }),
    /* @__PURE__ */ jsx("path", { d: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })
  ] }),
  weather: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("path", { d: "M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2" }),
    /* @__PURE__ */ jsx("path", { d: "M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" })
  ] }),
  speed: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) }),
  director: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M4 20h16M4 4l8 8-8 8M12 4l8 8-8 8" }) }),
  emotion: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }),
    /* @__PURE__ */ jsx("line", { x1: "9", y1: "9", x2: "9.01", y2: "9", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("line", { x1: "15", y1: "9", x2: "15.01", y2: "9", strokeWidth: "2" })
  ] }),
  shot: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "2" }),
    /* @__PURE__ */ jsx("line", { x1: "2", y1: "8", x2: "22", y2: "8" }),
    /* @__PURE__ */ jsx("line", { x1: "8", y1: "2", x2: "8", y2: "8" }),
    /* @__PURE__ */ jsx("line", { x1: "16", y1: "2", x2: "16", y2: "8" })
  ] }),
  framing: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "1" }),
    /* @__PURE__ */ jsx("line", { x1: "8", y1: "3", x2: "8", y2: "21", opacity: "0.3" }),
    /* @__PURE__ */ jsx("line", { x1: "16", y1: "3", x2: "16", y2: "21", opacity: "0.3" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "21", y2: "8", opacity: "0.3" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "16", x2: "21", y2: "16", opacity: "0.3" })
  ] }),
  setDesign: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("path", { d: "M3 21h18" }),
    /* @__PURE__ */ jsx("path", { d: "M5 21V7l7-4 7 4v14" }),
    /* @__PURE__ */ jsx("rect", { x: "9", y: "13", width: "6", height: "8" })
  ] }),
  palette: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "8", r: "1.5", fill: "currentColor" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "12", r: "1.5", fill: "currentColor" }),
    /* @__PURE__ */ jsx("circle", { cx: "16", cy: "12", r: "1.5", fill: "currentColor" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "16", r: "1.5", fill: "currentColor" })
  ] }),
  character: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M5.5 21v-2a6.5 6.5 0 0113 0v2" })
  ] })
};
function ScrollColumn({
  items,
  selectedIndex,
  onSelect,
  label,
  renderItem,
  renderLabel
}) {
  const handleWheel = (e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    let newIndex = selectedIndex + direction;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    onSelect(newIndex);
  };
  const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
  const nextIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
  return /* @__PURE__ */ jsxs("div", { onWheel: handleWheel, className: "flex flex-col items-center cursor-ns-resize select-none", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium", children: label }),
    /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => onSelect(prevIndex),
        className: "h-12 flex items-center justify-center opacity-20 hover:opacity-40 transition-all cursor-pointer",
        children: renderItem(items[prevIndex], false)
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-800/80 rounded-2xl flex flex-col items-center justify-center border border-gray-700 my-1", children: renderItem(items[selectedIndex], true) }),
    /* @__PURE__ */ jsx("div", { className: "text-xs text-white mt-2 font-medium text-center", children: renderLabel ? renderLabel(items[selectedIndex]) : items[selectedIndex] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => onSelect(nextIndex),
        className: "h-12 flex items-center justify-center opacity-20 hover:opacity-40 transition-all cursor-pointer mt-1",
        children: renderItem(items[nextIndex], false)
      }
    )
  ] });
}
function CinemaStudio() {
  const {
    currentShot,
    shots,
    selectedPresets,
    selectedLens,
    selectedCamera,
    selectedFocus,
    isGenerating,
    generationProgress,
    error,
    setStartFrame,
    setEndFrame,
    setMotionPrompt,
    setModel,
    setDuration,
    setLens,
    setCameraBody,
    setFocus,
    togglePreset,
    clearPresets,
    startGeneration,
    setProgress,
    completeGeneration,
    failGeneration,
    saveCurrentAsShot,
    resetCurrent
  } = useCinemaStore();
  const [promptText, setPromptText] = useState("");
  const [showCameraPanel, setShowCameraPanel] = useState(false);
  const [showMovements, setShowMovements] = useState(false);
  const [showStyles, setShowStyles] = useState(false);
  const [showLighting, setShowLighting] = useState(false);
  const [showAtmosphere, setShowAtmosphere] = useState(false);
  const [showDirectors, setShowDirectors] = useState(false);
  const [showEmotions, setShowEmotions] = useState(false);
  const [showShotSetups, setShowShotSetups] = useState(false);
  const [showFraming, setShowFraming] = useState(false);
  const [showSetDesign, setShowSetDesign] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showCharacterStyle, setShowCharacterStyle] = useState(false);
  const [cameraPanelTab, setCameraPanelTab] = useState("all");
  const [mode, setMode] = useState("video");
  const [imageTarget, setImageTarget] = useState(null);
  const [includeCameraSettings, setIncludeCameraSettings] = useState(true);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [shotCount, setShotCount] = useState(1);
  const [cameraIndex, setCameraIndex] = useState(0);
  const [lensIndex, setLensIndex] = useState(3);
  const [focalIndex, setFocalIndex] = useState(3);
  const [apertureIndex, setApertureIndex] = useState(1);
  const [styleIndex, setStyleIndex] = useState(null);
  const [lightingIndex, setLightingIndex] = useState(null);
  const [atmosphereIndex, setAtmosphereIndex] = useState(null);
  const [speedIndex, setSpeedIndex] = useState(2);
  const [directorIndex, setDirectorIndex] = useState(null);
  const [emotionIndex, setEmotionIndex] = useState(null);
  const [shotSetupIndex, setShotSetupIndex] = useState(null);
  const [framingIndex, setFramingIndex] = useState(null);
  const [setDesignIndex, setSetDesignIndex] = useState(null);
  const [colorPaletteIndex, setColorPaletteIndex] = useState(null);
  const [characterStyleIndex, setCharacterStyleIndex] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("2K");
  const [showAspectPanel, setShowAspectPanel] = useState(false);
  const [showResPanel, setShowResPanel] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const refInputRef = useRef(null);
  const MODEL_SETTINGS = {
    image: {
      aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "21:9"],
      // All images auto-compressed to JPEG before video generation
      resolutions: ["512", "1K", "2K", "4K"]},
    "kling-2.6": {
      aspectRatios: ["16:9", "9:16", "1:1"]}};
  const cameras = CAMERA_BODY_PRESETS;
  const lenses = LENS_PRESETS;
  const styles = STYLE_PRESETS;
  const lightings = LIGHTING_PRESETS;
  const atmospheres = ATMOSPHERE_PRESETS;
  const speeds = MOTION_SPEED_PRESETS;
  const directors = DIRECTOR_PRESETS;
  const emotions = EMOTION_PRESETS;
  const shotSetups = SHOT_SETUPS;
  const framings = FRAMING_PRESETS;
  const setDesigns = SET_DESIGN_PRESETS;
  const colorPalettes = COLOR_PALETTE_PRESETS;
  const characterStyles = CHARACTER_STYLE_PRESETS;
  const focalLengths = ["14", "24", "35", "50", "85", "135", "200"];
  const apertures = ["f/1.4", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"];
  const handleCameraChange = (index) => {
    setCameraIndex(index);
    setCameraBody(cameras[index]);
  };
  const handleLensChange = (index) => {
    setLensIndex(index);
    setLens(lenses[index]);
  };
  const buildFullPrompt = () => {
    const baseMotion = promptText || currentShot.motionPrompt || selectedPresets.map((p) => p.prompt.split(",")[0]).join(", ") || "";
    let cinematographyPrompt = "";
    if (includeCameraSettings) {
      const cameraPart = cameras[cameraIndex] ? `shot on ${cameras[cameraIndex].name}` : "";
      const lensPart = lenses[lensIndex] ? lenses[lensIndex].name : "";
      const focalPart = `${focalLengths[focalIndex]}mm`;
      const aperturePart = apertures[apertureIndex];
      cinematographyPrompt = [cameraPart, lensPart, focalPart, aperturePart].filter(Boolean).join(", ");
    }
    const extraParts = [];
    if (directorIndex !== null) extraParts.push(directors[directorIndex].prompt.split(",")[0]);
    if (emotionIndex !== null) extraParts.push(emotions[emotionIndex].prompt.split(",")[0]);
    if (shotSetupIndex !== null) extraParts.push(shotSetups[shotSetupIndex].prompt.split(",")[0]);
    if (framingIndex !== null) extraParts.push(framings[framingIndex].prompt.split(",")[0]);
    if (setDesignIndex !== null) extraParts.push(setDesigns[setDesignIndex].prompt.split(",")[0]);
    if (colorPaletteIndex !== null) extraParts.push(colorPalettes[colorPaletteIndex].prompt.split(",")[0]);
    if (characterStyleIndex !== null) extraParts.push(characterStyles[characterStyleIndex].prompt.split(",")[0]);
    return buildCinemaPrompt({
      movement: selectedPresets.length > 0 ? selectedPresets : void 0,
      style: styleIndex !== null ? styles[styleIndex] : void 0,
      lighting: lightingIndex !== null ? lightings[lightingIndex] : void 0,
      atmosphere: atmosphereIndex !== null ? atmospheres[atmosphereIndex] : void 0,
      motionSpeed: speeds[speedIndex],
      customPrompt: [...extraParts, cinematographyPrompt, baseMotion].filter(Boolean).join(", ") || "cinematic"
    });
  };
  const autoSelectModel = () => {
    if (currentShot.endFrame) return "kling-o1";
    if (emotionIndex !== null) {
      const dialogueEmotions = ["romance", "confession", "confrontation"];
      if (dialogueEmotions.includes(emotions[emotionIndex].id)) return "seedance-1.5";
    }
    if (shotSetupIndex !== null) {
      const dialogueSetups = ["confession", "confrontation"];
      if (dialogueSetups.includes(shotSetups[shotSetupIndex].id)) return "seedance-1.5";
    }
    return "kling-2.6";
  };
  const compressForKling = async (imageUrl) => {
    if (imageUrl.includes("catbox.moe") && imageUrl.endsWith(".jpg")) {
      console.log("Already compressed, skipping");
      return imageUrl;
    }
    console.log("Compressing image for Kling...");
    try {
      const response = await fetch("/api/cinema/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Compression failed");
      }
      if (data.image_url) {
        console.log(`Compressed: ${(data.original_size / 1024 / 1024).toFixed(2)}MB → ${(data.compressed_size / 1024).toFixed(0)}KB`);
        return data.image_url;
      }
      throw new Error("No compressed URL returned");
    } catch (err) {
      console.error("Compression failed:", err);
      throw new Error("Image compression failed. Cannot send to Kling without compressing first.");
    }
  };
  const handleGenerate = async () => {
    setDirectorSuggestion(null);
    const fullPrompt = buildFullPrompt();
    if (mode === "image") {
      if (!promptText && !fullPrompt) {
        alert("Please enter a prompt to generate an image!");
        return;
      }
      startGeneration();
      setProgress(10);
      try {
        const response = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "image",
            prompt: fullPrompt,
            aspect_ratio: aspectRatio,
            resolution,
            // CHAINING FIX: Use extracted last frame (startFrame) if available, else original reference
            reference_image: currentShot.startFrame || referenceImage || void 0
          })
        });
        setProgress(50);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.details || "Image generation failed");
        if (data.image_url) {
          setProgress(100);
          if (imageTarget === "end") {
            setEndFrame(data.image_url);
            setMode("video");
            failGeneration("");
            alert("END image generated! Both frames ready - Kling O1 will be used for transition video.");
          } else if (imageTarget === "start") {
            setStartFrame(data.image_url);
            failGeneration("");
            setImageTarget("end");
          } else {
            setStartFrame(data.image_url);
            setMode("video");
            failGeneration("");
          }
        } else {
          throw new Error("No image URL in response");
        }
      } catch (err) {
        failGeneration(err instanceof Error ? err.message : "Unknown error");
      }
      return;
    }
    if (!currentShot.startFrame) {
      alert("Please add a start frame first! Switch to Image mode to generate one.");
      return;
    }
    startGeneration();
    setProgress(5);
    try {
      const selectedModel = autoSelectModel();
      setModel(selectedModel);
      setProgress(10);
      const compressedStart = await compressForKling(currentShot.startFrame);
      setProgress(15);
      let compressedEnd;
      if (currentShot.endFrame) {
        compressedEnd = await compressForKling(currentShot.endFrame);
      }
      setProgress(20);
      let requestBody = {
        prompt: fullPrompt,
        duration: String(currentShot.duration),
        aspect_ratio: aspectRatio
      };
      if (selectedModel === "kling-o1") {
        requestBody.type = "video-kling-o1";
        requestBody.start_image_url = compressedStart;
        if (compressedEnd) requestBody.end_image_url = compressedEnd;
      } else if (selectedModel === "seedance-1.5") {
        requestBody.type = "video-seedance";
        requestBody.image_url = compressedStart;
        if (compressedEnd) requestBody.end_image_url = compressedEnd;
      } else {
        requestBody.type = "video-kling";
        requestBody.image_url = compressedStart;
      }
      setProgress(25);
      const response = await fetch("/api/cinema/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      setProgress(40);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "Generation failed");
      setProgress(80);
      if (data.video_url) {
        setProgress(100);
        completeGeneration(data.video_url);
        if (shots.length < 3) {
          setChainPrompt(true);
        }
      } else {
        throw new Error("No video URL in response");
      }
    } catch (err) {
      failGeneration(err instanceof Error ? err.message : "Unknown error");
    }
  };
  const [chainPrompt, setChainPrompt] = useState(false);
  const [previousPrompt, setPreviousPrompt] = useState("");
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  const [playingShot, setPlayingShot] = useState(null);
  const [directorSuggestion, setDirectorSuggestion] = useState(null);
  useEffect(() => {
    setDirectorSuggestion(null);
  }, [directorIndex]);
  const handleChainToNext = async () => {
    const previousGeneratedImage = currentShot.startFrame;
    const currentPromptText = promptText;
    setPreviousPrompt(currentPromptText);
    saveCurrentAsShot();
    if (previousGeneratedImage) {
      setStartFrame(previousGeneratedImage);
    }
    setPromptText("");
    setChainPrompt(false);
    setMode("image");
    if (directorIndex !== null) {
      const director = DIRECTOR_PRESETS[directorIndex];
      const suggestion = generateDirectorSuggestion(
        director,
        currentPromptText,
        shots.length + 1
      );
      setDirectorSuggestion(suggestion);
    } else {
      setDirectorSuggestion(null);
    }
  };
  const handlePlayShot = (shotId) => {
    setPlayingShot(playingShot === shotId ? null : shotId);
  };
  const handleConcatenateShots = async () => {
    if (shots.length < 2) {
      alert("Need at least 2 shots to concatenate!");
      return;
    }
    startGeneration();
    try {
      const videoUrls = shots.map((s) => s.videoUrl).filter(Boolean);
      const response = await fetch("http://localhost:5678/webhook/ffmpeg-concat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos: videoUrls })
      });
      const data = await response.json();
      if (data.output_url) {
        completeGeneration(data.output_url);
        alert("Videos concatenated! Final video ready.");
      } else {
        throw new Error("Concatenation failed");
      }
    } catch (err) {
      failGeneration(err instanceof Error ? err.message : "Concatenation failed");
    }
  };
  const cost = currentShot.duration === 5 ? 8 : 16;
  const summaryText = `${cameras[cameraIndex]?.name || "Camera"}, ${lenses[lensIndex]?.name || "Lens"}, ${focalLengths[focalIndex]}mm, ${apertures[apertureIndex]}`;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0d0d0d] text-white flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-video bg-[#151515] rounded-xl overflow-hidden border border-gray-800/30", children: [
        playingShot && shots.find((s) => s.id === playingShot)?.videoUrl ? /* @__PURE__ */ jsx(
          "video",
          {
            src: shots.find((s) => s.id === playingShot)?.videoUrl,
            controls: true,
            autoPlay: true,
            loop: true,
            className: "w-full h-full object-contain"
          },
          playingShot
        ) : currentShot.videoUrl ? /* @__PURE__ */ jsx("video", { src: currentShot.videoUrl, controls: true, autoPlay: true, loop: true, className: "w-full h-full object-contain" }) : currentShot.startFrame ? /* @__PURE__ */ jsx("img", { src: currentShot.startFrame, alt: "Preview", className: "w-full h-full object-contain" }) : /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center mb-4", children: mode === "image" ? Icons.image : Icons.video }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-500 text-xs uppercase tracking-widest mb-1 font-medium", children: "CINEMA STUDIO" }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-600 text-[11px]", children: mode === "image" ? "Enter a prompt and click Generate to create a start frame" : "Switch to Image mode or upload a frame to begin" })
        ] }),
        isGenerating && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/95 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin mb-4" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[#e8ff00] text-sm font-medium", children: [
            "Generating... ",
            generationProgress,
            "%"
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm", children: error }),
      shots.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 uppercase tracking-wider", children: [
              "Shot Timeline (",
              shots.length,
              ")"
            ] }),
            previousPrompt && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-600 italic truncate max-w-xs", children: [
              'Prev: "',
              previousPrompt.slice(0, 40),
              '..."'
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: shots.length >= 2 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleConcatenateShots,
              className: "px-3 py-1.5 bg-[#e8ff00] text-black rounded-lg text-xs font-semibold hover:bg-[#f0ff4d] transition-colors",
              children: "Export All"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 overflow-x-auto pb-2", children: [
          shots.map((shot, idx) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handlePlayShot(shot.id),
              className: `relative group flex-shrink-0 transition-all ${playingShot === shot.id ? "ring-2 ring-[#e8ff00] scale-105" : "hover:scale-105"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: `w-32 aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden border ${playingShot === shot.id ? "border-[#e8ff00]" : "border-gray-800"}`, children: [
                  shot.videoUrl ? playingShot === shot.id ? /* @__PURE__ */ jsx("video", { src: shot.videoUrl, className: "w-full h-full object-cover", autoPlay: true, loop: true, muted: true }) : /* @__PURE__ */ jsx("video", { src: shot.videoUrl, className: "w-full h-full object-cover", muted: true }) : shot.startFrame ? /* @__PURE__ */ jsx("img", { src: shot.startFrame, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex items-center justify-center text-gray-600 text-xs", children: [
                    "Shot ",
                    idx + 1
                  ] }),
                  shot.videoUrl && playingShot !== shot.id && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white/90 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "black", className: "w-4 h-4 ml-0.5", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }) }),
                  playingShot === shot.id && /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 px-1.5 py-0.5 bg-[#e8ff00] rounded text-[9px] text-black font-bold", children: "PLAYING" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] text-gray-300", children: [
                  "#",
                  idx + 1,
                  " - ",
                  shot.duration,
                  "s"
                ] })
              ]
            },
            shot.id
          )),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (currentShot.videoUrl) {
                  setChainPrompt(true);
                } else if (shots.length > 0) {
                  const lastShot = shots[shots.length - 1];
                  if (lastShot.startFrame) {
                    setStartFrame(lastShot.startFrame);
                    setMode("image");
                    setPreviousPrompt(promptText || lastShot.motionPrompt);
                    setPromptText("");
                  }
                }
              },
              className: "w-32 aspect-video bg-[#151515] rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center flex-shrink-0 hover:border-[#e8ff00] hover:bg-[#1a1a1a] transition-all group",
              children: [
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5 text-gray-600 group-hover:text-[#e8ff00] mb-1", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 group-hover:text-[#e8ff00] text-[10px]", children: "Next Shot" })
              ]
            }
          )
        ] }),
        isExtractingFrame && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-[#e8ff00] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border border-[#e8ff00] border-t-transparent rounded-full animate-spin" }),
          "Extracting last frame for next shot..."
        ] })
      ] })
    ] }) }),
    chainPrompt && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-md w-full mx-4", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: isExtractingFrame ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-[#e8ff00]/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "Setting up next shot..." }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-6", children: "Extracting last frame from video to use as your next starting point." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-[#e8ff00]/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "#e8ff00", strokeWidth: "2", className: "w-8 h-8", children: /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-white mb-2", children: [
        "Shot ",
        shots.length + 1,
        " Complete!"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-2", children: "Continue to the next shot?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs mb-6", children: "We'll use the last frame of this video as your next starting point." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setChainPrompt(false),
            className: "flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors",
            children: "Stay Here"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleChainToNext,
            className: "flex-1 px-4 py-3 bg-[#e8ff00] text-black rounded-xl text-sm font-semibold hover:bg-[#f0ff4d] transition-colors flex items-center justify-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) }),
              "Next Shot"
            ]
          }
        )
      ] })
    ] }) }) }) }),
    showCameraPanel && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowCameraPanel(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-8 shadow-2xl max-w-4xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCameraPanelTab("all"),
              className: `px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${cameraPanelTab === "all" ? "bg-white text-black" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: "All"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCameraPanelTab("recommended"),
              className: `px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${cameraPanelTab === "recommended" ? "bg-white text-black" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: "By Director"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowCameraPanel(false), className: "w-10 h-10 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      cameraPanelTab === "recommended" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 mb-4", children: "Select a director to see their signature camera setups:" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto", children: directors.map((dir, idx) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              if (dir.recommendedCamera) {
                const camIdx = cameras.findIndex((c) => c.id === dir.recommendedCamera);
                if (camIdx !== -1) {
                  setCameraIndex(camIdx);
                  setCameraBody(cameras[camIdx]);
                }
              }
              if (dir.recommendedLens) {
                const lensIdx = lenses.findIndex((l) => l.id === dir.recommendedLens);
                if (lensIdx !== -1) {
                  setLensIndex(lensIdx);
                  setLens(lenses[lensIdx]);
                }
              }
              if (dir.recommendedMovement) {
                clearPresets();
                dir.recommendedMovement.forEach((movId) => {
                  const preset = CAMERA_PRESETS.find((p) => p.id === movId);
                  if (preset) togglePreset(preset);
                });
              }
              setDirectorIndex(idx);
              setShowCameraPanel(false);
            },
            className: "rounded-xl p-4 bg-[#2a2a2a] text-left hover:bg-gray-700 transition-all hover:scale-[1.02]",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-white", children: dir.name }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 mt-0.5", children: dir.director }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1", children: [
                dir.recommendedCamera && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Camera:" }),
                  " ",
                  cameras.find((c) => c.id === dir.recommendedCamera)?.name
                ] }),
                dir.recommendedLens && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Lens:" }),
                  " ",
                  lenses.find((l) => l.id === dir.recommendedLens)?.name
                ] }),
                dir.recommendedMovement && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Motion:" }),
                  " ",
                  dir.recommendedMovement.map((m) => CAMERA_PRESETS.find((p) => p.id === m)?.name).join(", ")
                ] })
              ] })
            ]
          },
          dir.id
        )) })
      ] }),
      cameraPanelTab === "all" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-10", children: [
          /* @__PURE__ */ jsx(
            ScrollColumn,
            {
              items: cameras.map((c) => c.id),
              selectedIndex: cameraIndex,
              onSelect: handleCameraChange,
              label: "CAMERA",
              renderItem: (id, isSelected) => /* @__PURE__ */ jsx("div", { className: `${isSelected ? "w-14 h-14" : "w-8 h-8"} rounded-lg bg-gray-700 flex items-center justify-center transition-all`, children: /* @__PURE__ */ jsx("span", { className: `${isSelected ? "text-white" : "text-gray-400"}`, children: Icons.camera }) }),
              renderLabel: (id) => {
                const cam = cameras.find((c) => c.id === id);
                return cam?.name || "";
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ScrollColumn,
            {
              items: lenses.map((l) => l.id),
              selectedIndex: lensIndex,
              onSelect: handleLensChange,
              label: "LENS",
              renderItem: (id, isSelected) => /* @__PURE__ */ jsx("div", { className: `${isSelected ? "w-14 h-14" : "w-8 h-8"} rounded-full border-2 ${isSelected ? "border-white" : "border-gray-600"} flex items-center justify-center transition-all`, children: /* @__PURE__ */ jsx("div", { className: `${isSelected ? "w-6 h-6" : "w-3 h-3"} rounded-full bg-gray-400 transition-all` }) }),
              renderLabel: (id) => {
                const lens = lenses.find((l) => l.id === id);
                return lens?.name || "";
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ScrollColumn,
            {
              items: focalLengths,
              selectedIndex: focalIndex,
              onSelect: setFocalIndex,
              label: "FOCAL LENGTH",
              renderItem: (fl, isSelected) => /* @__PURE__ */ jsx("span", { className: `font-bold ${isSelected ? "text-3xl text-white" : "text-lg text-gray-500"} transition-all`, children: fl }),
              renderLabel: (fl) => `${fl}mm`
            }
          ),
          /* @__PURE__ */ jsx(
            ScrollColumn,
            {
              items: apertures,
              selectedIndex: apertureIndex,
              onSelect: setApertureIndex,
              label: "APERTURE",
              renderItem: (ap, isSelected) => {
                const openings = {
                  "f/1.4": 90,
                  "f/2.8": 75,
                  "f/4": 60,
                  "f/5.6": 50,
                  "f/8": 40,
                  "f/11": 30,
                  "f/16": 20
                };
                const size = isSelected ? openings[ap] : openings[ap] * 0.5;
                return /* @__PURE__ */ jsx("div", { className: `${isSelected ? "w-14 h-14" : "w-8 h-8"} rounded-full border-2 ${isSelected ? "border-gray-500" : "border-gray-700"} flex items-center justify-center transition-all`, children: /* @__PURE__ */ jsx("div", { className: "rounded-full bg-gray-400 transition-all", style: { width: `${size}%`, height: `${size}%` } }) });
              },
              renderLabel: (ap) => ap
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-gray-500 text-xs", children: summaryText })
      ] })
    ] }) }),
    showMovements && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowMovements(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Camera movement" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowMovements(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 gap-3 overflow-y-auto max-h-[60vh] pr-2", children: CAMERA_PRESETS.map((preset) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => togglePreset(preset),
          className: `rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${selectedPresets.some((p) => p.id === preset.id) ? "ring-2 ring-[#e8ff00] ring-offset-2 ring-offset-[#1a1a1a]" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-[#2a2a2a] flex items-center justify-center relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5 text-gray-400", children: [
                preset.category === "dolly" && /* @__PURE__ */ jsx("path", { d: "M12 19V5M5 12l7-7 7 7" }),
                preset.category === "pan" && /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }),
                preset.category === "tilt" && /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12l7 7 7-7" }),
                preset.category === "orbit" && /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "7" }),
                preset.category === "zoom" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "6" }),
                  /* @__PURE__ */ jsx("path", { d: "M21 21l-4.35-4.35" })
                ] }),
                preset.category === "special" && /* @__PURE__ */ jsx("path", { d: "M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z" }),
                preset.category === "static" && /* @__PURE__ */ jsx("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" })
              ] }) }),
              selectedPresets.some((p) => p.id === preset.id) && /* @__PURE__ */ jsx("div", { className: "absolute top-1.5 right-1.5 w-5 h-5 bg-[#e8ff00] rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "black", strokeWidth: "3", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "py-2 px-1.5 bg-[#222] text-center", children: /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-300 font-medium truncate", children: preset.name }) })
          ]
        },
        preset.id
      )) })
    ] }) }),
    showStyles && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowStyles(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Visual Style" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowStyles(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3", children: styles.map((style, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setStyleIndex(styleIndex === idx ? null : idx);
            setShowStyles(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${styleIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: style.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 ${styleIndex === idx ? "text-black/60" : "text-gray-500"}`, children: style.description })
          ]
        },
        style.id
      )) })
    ] }) }),
    showLighting && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowLighting(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Lighting" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowLighting(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3", children: lightings.map((light, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setLightingIndex(lightingIndex === idx ? null : idx);
            setShowLighting(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${lightingIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: light.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 ${lightingIndex === idx ? "text-black/60" : "text-gray-500"}`, children: light.description })
          ]
        },
        light.id
      )) })
    ] }) }),
    showAtmosphere && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowAtmosphere(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Weather / Atmosphere" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAtmosphere(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3", children: atmospheres.map((atm, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setAtmosphereIndex(atmosphereIndex === idx ? null : idx);
            setShowAtmosphere(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${atmosphereIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: atm.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 ${atmosphereIndex === idx ? "text-black/60" : "text-gray-500"}`, children: atm.description })
          ]
        },
        atm.id
      )) })
    ] }) }),
    showDirectors && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowDirectors(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Director Styles" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowDirectors(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 overflow-y-auto max-h-[50vh]", children: directors.map((dir, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setDirectorIndex(directorIndex === idx ? null : idx);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${directorIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: dir.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-0.5 ${directorIndex === idx ? "text-black/60" : "text-gray-500"}`, children: dir.director }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-2 ${directorIndex === idx ? "text-black/70" : "text-gray-400"}`, children: dir.description })
          ]
        },
        dir.id
      )) }),
      directorIndex !== null && /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-5 border-t border-gray-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-white", children: [
            "Recommended for ",
            directors[directorIndex].name
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const dir = directors[directorIndex];
                if (dir.recommendedCamera) {
                  const camIdx = cameras.findIndex((c) => c.id === dir.recommendedCamera);
                  if (camIdx !== -1) {
                    setCameraIndex(camIdx);
                    setCameraBody(cameras[camIdx]);
                  }
                }
                if (dir.recommendedLens) {
                  const lensIdx = lenses.findIndex((l) => l.id === dir.recommendedLens);
                  if (lensIdx !== -1) {
                    setLensIndex(lensIdx);
                    setLens(lenses[lensIdx]);
                  }
                }
                if (dir.recommendedMovement) {
                  clearPresets();
                  dir.recommendedMovement.forEach((movId) => {
                    const preset = CAMERA_PRESETS.find((p) => p.id === movId);
                    if (preset) togglePreset(preset);
                  });
                }
                if (dir.recommendedLighting) {
                  const lightIdx = lightings.findIndex((l) => l.id === dir.recommendedLighting);
                  if (lightIdx !== -1) setLightingIndex(lightIdx);
                }
                if (dir.recommendedStyle) {
                  const styleIdx = styles.findIndex((s) => s.id === dir.recommendedStyle);
                  if (styleIdx !== -1) setStyleIndex(styleIdx);
                }
                if (dir.recommendedAtmosphere) {
                  const atmoIdx = atmospheres.findIndex((a) => a.id === dir.recommendedAtmosphere);
                  if (atmoIdx !== -1) setAtmosphereIndex(atmoIdx);
                }
                if (dir.recommendedFraming) {
                  const framIdx = framings.findIndex((f) => f.id === dir.recommendedFraming);
                  if (framIdx !== -1) setFramingIndex(framIdx);
                }
                if (dir.recommendedSetDesign) {
                  const setIdx = setDesigns.findIndex((s) => s.id === dir.recommendedSetDesign);
                  if (setIdx !== -1) setSetDesignIndex(setIdx);
                }
                if (dir.recommendedColorPalette) {
                  const colorIdx = colorPalettes.findIndex((c) => c.id === dir.recommendedColorPalette);
                  if (colorIdx !== -1) setColorPaletteIndex(colorIdx);
                }
                if (dir.recommendedCharacterStyle) {
                  const charIdx = characterStyles.findIndex((c) => c.id === dir.recommendedCharacterStyle);
                  if (charIdx !== -1) setCharacterStyleIndex(charIdx);
                }
                setShowDirectors(false);
              },
              className: "px-4 py-2 bg-[#e8ff00] text-black rounded-lg text-xs font-semibold hover:bg-[#f0ff4d] transition-colors",
              children: "Apply All Recommended"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-[#2a2a2a] rounded-xl p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase tracking-wider mb-2", children: "Camera" }),
            directors[directorIndex].recommendedCamera ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center", children: Icons.camera }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-white", children: cameras.find((c) => c.id === directors[directorIndex].recommendedCamera)?.name || "Any" })
            ] }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Any camera works" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#2a2a2a] rounded-xl p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase tracking-wider mb-2", children: "Lens" }),
            directors[directorIndex].recommendedLens ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-gray-400" }) }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-white", children: lenses.find((l) => l.id === directors[directorIndex].recommendedLens)?.name || "Any" })
            ] }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Any lens works" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#2a2a2a] rounded-xl p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase tracking-wider mb-2", children: "Movements" }),
            directors[directorIndex].recommendedMovement && directors[directorIndex].recommendedMovement.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: directors[directorIndex].recommendedMovement.map((movId) => {
              const preset = CAMERA_PRESETS.find((p) => p.id === movId);
              return preset ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-gray-700 rounded text-[10px] text-gray-300", children: preset.name }, movId) : null;
            }) }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Any movement" })
          ] })
        ] })
      ] })
    ] }) }),
    showEmotions && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowEmotions(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Emotion / Mood" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowEmotions(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]", children: emotions.map((emo, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setEmotionIndex(emotionIndex === idx ? null : idx);
            setShowEmotions(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${emotionIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: emo.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-0.5 ${emotionIndex === idx ? "text-black/60" : "text-gray-500"}`, children: emo.emotion }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-2 ${emotionIndex === idx ? "text-black/70" : "text-gray-400"}`, children: emo.description })
          ]
        },
        emo.id
      )) })
    ] }) }),
    showShotSetups && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowShotSetups(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Story Beat / Shot Setup" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowShotSetups(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]", children: shotSetups.map((setup, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setShotSetupIndex(shotSetupIndex === idx ? null : idx);
            setShowShotSetups(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${shotSetupIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: setup.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-0.5 ${shotSetupIndex === idx ? "text-black/60" : "text-gray-500"}`, children: setup.storyBeat }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-2 ${shotSetupIndex === idx ? "text-black/70" : "text-gray-400"}`, children: setup.description })
          ]
        },
        setup.id
      )) })
    ] }) }),
    showFraming && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowFraming(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Framing / Composition" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowFraming(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]", children: framings.map((framing, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setFramingIndex(framingIndex === idx ? null : idx);
            setShowFraming(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${framingIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: framing.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 ${framingIndex === idx ? "text-black/70" : "text-gray-400"}`, children: framing.description }),
            framing.example && /* @__PURE__ */ jsx("div", { className: `text-[9px] mt-2 italic ${framingIndex === idx ? "text-black/50" : "text-gray-500"}`, children: framing.example })
          ]
        },
        framing.id
      )) })
    ] }) }),
    showSetDesign && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowSetDesign(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Set Design / Environment" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowSetDesign(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]", children: setDesigns.map((design, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setSetDesignIndex(setDesignIndex === idx ? null : idx);
            setShowSetDesign(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${setDesignIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: design.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 ${setDesignIndex === idx ? "text-black/70" : "text-gray-400"}`, children: design.description }),
            design.director && /* @__PURE__ */ jsx("div", { className: `text-[9px] mt-2 italic ${setDesignIndex === idx ? "text-black/50" : "text-gray-500"}`, children: design.director })
          ]
        },
        design.id
      )) })
    ] }) }),
    showColorPalette && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowColorPalette(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Color Palette" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowColorPalette(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]", children: colorPalettes.map((palette, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setColorPaletteIndex(colorPaletteIndex === idx ? null : idx);
            setShowColorPalette(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${colorPaletteIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: palette.name }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-1 mt-2", children: palette.colors.slice(0, 5).map((color, colorIdx) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-4 h-4 rounded-sm",
                style: { backgroundColor: color }
              },
              colorIdx
            )) }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-2 ${colorPaletteIndex === idx ? "text-black/70" : "text-gray-400"}`, children: palette.description })
          ]
        },
        palette.id
      )) })
    ] }) }),
    showCharacterStyle && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowCharacterStyle(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300", children: "Character Style / Costume" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowCharacterStyle(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]", children: characterStyles.map((style, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setCharacterStyleIndex(characterStyleIndex === idx ? null : idx);
            setShowCharacterStyle(false);
          },
          className: `rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${characterStyleIndex === idx ? "bg-[#e8ff00] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: style.name }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 ${characterStyleIndex === idx ? "text-black/70" : "text-gray-400"}`, children: style.description }),
            style.director && /* @__PURE__ */ jsx("div", { className: `text-[9px] mt-2 italic ${characterStyleIndex === idx ? "text-black/50" : "text-gray-500"}`, children: style.director })
          ]
        },
        style.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-800/50 bg-[#1a1a1a] px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMode("image"),
            className: `w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${mode === "image" ? "bg-gray-700 text-white" : "bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300"}`,
            children: [
              Icons.image,
              /* @__PURE__ */ jsx("span", { className: "text-[9px] mt-1 font-medium", children: "Image" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMode("video"),
            className: `w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${mode === "video" ? "bg-gray-700 text-white" : "bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300"}`,
            children: [
              Icons.video,
              /* @__PURE__ */ jsx("span", { className: "text-[9px] mt-1 font-medium", children: "Video" })
            ]
          }
        )
      ] }),
      mode === "image" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setImageTarget(imageTarget === "start" ? null : "start"),
            className: `px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${imageTarget === "start" ? "bg-[#e8ff00] text-black" : currentShot.startFrame ? "bg-green-900 text-green-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`,
            title: "Click to select, click again to deselect",
            children: [
              "START ",
              currentShot.startFrame && "✓"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setImageTarget(imageTarget === "end" ? null : "end"),
            className: `px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${imageTarget === "end" ? "bg-[#e8ff00] text-black" : currentShot.endFrame ? "bg-green-900 text-green-400" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`,
            title: "Click to select, click again to deselect",
            children: [
              "END ",
              currentShot.endFrame && "✓"
            ]
          }
        ),
        imageTarget === null && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-gray-500", children: "Normal → Kling 2.6" }),
        imageTarget === "start" && !currentShot.startFrame && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-gray-500", children: "Transition mode" }),
        imageTarget === "end" && !currentShot.startFrame && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-orange-400", children: "Generate START first!" }),
        imageTarget === "end" && currentShot.startFrame && !currentShot.endFrame && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-[#e8ff00]", children: "Using START as ref →" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-[280px] flex flex-col gap-2", children: [
        previousPrompt && currentShot.startFrame && !promptText && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-500 px-1", children: [
          'Continuing from: "',
          previousPrompt.slice(0, 50),
          '..." - What happens next?'
        ] }),
        directorSuggestion && directorIndex !== null && currentShot.startFrame && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setPromptText((prev) => prev ? `${prev}, ${directorSuggestion}` : directorSuggestion);
              setDirectorSuggestion(null);
            },
            className: "flex items-center gap-2 px-3 py-2 bg-purple-900/30 border border-purple-500/50 rounded-lg text-left hover:bg-purple-900/50 transition-all group",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 text-lg", children: "💡" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-purple-400 font-medium", children: [
                  DIRECTOR_PRESETS[directorIndex].name,
                  " would:"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-300 group-hover:text-white truncate", children: [
                  '"',
                  directorSuggestion,
                  '"'
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-purple-500 opacity-0 group-hover:opacity-100 whitespace-nowrap", children: "Click to add →" })
            ]
          }
        ),
        directorIndex !== null && DIRECTOR_PRESETS[directorIndex].shotLibrary && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 px-1", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-gray-500 uppercase mr-1 self-center", children: [
            DIRECTOR_PRESETS[directorIndex].name,
            " shots:"
          ] }),
          DIRECTOR_PRESETS[directorIndex].shotLibrary.slice(0, 6).map((shot) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setPromptText(shot.prompt),
              className: "px-2 py-1 bg-[#2a2a2a] hover:bg-purple-900/30 border border-gray-700 hover:border-purple-500/50 rounded text-[10px] text-gray-400 hover:text-purple-300 transition-all",
              title: `${shot.name}
When: ${shot.whenToUse.join(", ")}
Lens: ${shot.lens || "varies"}`,
              children: shot.name
            },
            shot.id
          )),
          DIRECTOR_PRESETS[directorIndex].shotLibrary.length > 6 && /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-gray-600 self-center", children: [
            "+",
            DIRECTOR_PRESETS[directorIndex].shotLibrary.length - 6,
            " more"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: promptText,
              onChange: (e) => {
                setPromptText(e.target.value);
                setMotionPrompt(e.target.value);
              },
              placeholder: previousPrompt && currentShot.startFrame ? "What happens next in the scene..." : "Describe the scene you imagine...",
              className: "w-full px-5 py-3.5 bg-[#2a2a2a] border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 text-sm pr-20"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowPromptPreview(!showPromptPreview),
              className: `absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-medium transition-all ${showPromptPreview ? "bg-[#e8ff00] text-black" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`,
              children: showPromptPreview ? "HIDE" : "PREVIEW"
            }
          )
        ] }),
        showPromptPreview && /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-gray-500 uppercase mb-1", children: "Full prompt being sent:" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-300 break-words", children: buildFullPrompt() || /* @__PURE__ */ jsx("span", { className: "text-gray-600 italic", children: "Enter a prompt above" }) }),
          !includeCameraSettings && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-orange-400 mt-1", children: "Camera settings OFF" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowMovements(true);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${selectedPresets.length > 0 ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.movement,
                /* @__PURE__ */ jsx("span", { children: "Motion" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowDirectors(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowEmotions(false);
                setShowShotSetups(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${directorIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.director,
                /* @__PURE__ */ jsx("span", { children: directorIndex !== null ? directors[directorIndex].name : "Director" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowEmotions(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowShotSetups(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${emotionIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.emotion,
                /* @__PURE__ */ jsx("span", { children: emotionIndex !== null ? emotions[emotionIndex].name : "Emotion" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowShotSetups(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${shotSetupIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.shot,
                /* @__PURE__ */ jsx("span", { children: shotSetupIndex !== null ? shotSetups[shotSetupIndex].name : "Shot" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowStyles(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${styleIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.style,
                /* @__PURE__ */ jsx("span", { children: styleIndex !== null ? styles[styleIndex].name : "Style" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowLighting(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${lightingIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.light,
                /* @__PURE__ */ jsx("span", { children: lightingIndex !== null ? lightings[lightingIndex].name : "Light" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowAtmosphere(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowFraming(false);
                setShowSetDesign(false);
                setShowColorPalette(false);
                setShowCharacterStyle(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${atmosphereIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.weather,
                /* @__PURE__ */ jsx("span", { children: atmosphereIndex !== null ? atmospheres[atmosphereIndex].name : "Weather" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowFraming(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowSetDesign(false);
                setShowColorPalette(false);
                setShowCharacterStyle(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${framingIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.framing,
                /* @__PURE__ */ jsx("span", { children: framingIndex !== null ? framings[framingIndex].name : "Framing" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowSetDesign(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowFraming(false);
                setShowColorPalette(false);
                setShowCharacterStyle(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${setDesignIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.setDesign,
                /* @__PURE__ */ jsx("span", { children: setDesignIndex !== null ? setDesigns[setDesignIndex].name : "Set" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowColorPalette(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowFraming(false);
                setShowSetDesign(false);
                setShowCharacterStyle(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${colorPaletteIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.palette,
                /* @__PURE__ */ jsx("span", { children: colorPaletteIndex !== null ? colorPalettes[colorPaletteIndex].name : "Colors" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowCharacterStyle(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowFraming(false);
                setShowSetDesign(false);
                setShowColorPalette(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${characterStyleIndex !== null ? "bg-gray-700 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              children: [
                Icons.character,
                /* @__PURE__ */ jsx("span", { children: characterStyleIndex !== null ? characterStyles[characterStyleIndex].name : "Costume" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-gray-700 mx-1" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const ratios = mode === "image" ? MODEL_SETTINGS.image.aspectRatios : MODEL_SETTINGS["kling-2.6"].aspectRatios;
                const currentIdx = ratios.indexOf(aspectRatio);
                const nextIdx = (currentIdx + 1) % ratios.length;
                setAspectRatio(ratios[nextIdx]);
              },
              className: "h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",
              children: [
                Icons.aspectRatio,
                /* @__PURE__ */ jsx("span", { children: aspectRatio })
              ]
            }
          ),
          mode === "image" && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const resolutions = MODEL_SETTINGS.image.resolutions;
                const currentIdx = resolutions.indexOf(resolution);
                const nextIdx = (currentIdx + 1) % resolutions.length;
                setResolution(resolutions[nextIdx]);
              },
              className: "h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
                  /* @__PURE__ */ jsx("path", { d: "M3 9h18M9 3v18" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: resolution })
              ]
            }
          ),
          mode === "video" && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDuration(currentShot.duration === 5 ? 10 : 5),
              className: "h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",
              children: [
                Icons.clock,
                /* @__PURE__ */ jsxs("span", { children: [
                  currentShot.duration,
                  "s"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSpeedIndex((speedIndex + 1) % speeds.length),
              className: "h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",
              children: [
                Icons.speed,
                /* @__PURE__ */ jsx("span", { children: speeds[speedIndex].name })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 ml-1 text-gray-500", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShotCount(Math.max(1, shotCount - 1)),
                className: "w-6 h-6 rounded-md bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center transition-colors",
                children: Icons.minus
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium w-6 text-center", children: [
              shotCount,
              "/4"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShotCount(Math.min(4, shotCount + 1)),
                className: "w-6 h-6 rounded-md bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center transition-colors",
                children: Icons.plus
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer group", children: [
          /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${currentShot.startFrame ? "border-transparent" : "border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30"}`, children: currentShot.startFrame ? /* @__PURE__ */ jsx("img", { src: currentShot.startFrame, className: "w-full h-full object-cover rounded-lg" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: Icons.plus }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium mt-1", children: "START" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium", children: "FRAME" })
          ] }) }),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setStartFrame(ev.target?.result);
              reader.readAsDataURL(file);
            }
          } })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer group", children: [
          /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${currentShot.endFrame ? "border-transparent" : "border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30"}`, children: currentShot.endFrame ? /* @__PURE__ */ jsx("img", { src: currentShot.endFrame, className: "w-full h-full object-cover rounded-lg" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: Icons.plus }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium mt-1", children: "END" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium", children: "FRAME" })
          ] }) }),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setEndFrame(ev.target?.result);
              reader.readAsDataURL(file);
            }
          } })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer group", children: [
          /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${referenceImage ? "border-purple-500 border-solid" : "border-gray-600 hover:border-purple-400 group-hover:bg-purple-900/10"}`, children: referenceImage ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
            /* @__PURE__ */ jsx("img", { src: referenceImage, className: "w-full h-full object-cover rounded-lg" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.preventDefault();
                  setReferenceImage(null);
                },
                className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",
                children: "x"
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: Icons.plus }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-purple-400 uppercase font-medium mt-1", children: "REF" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-purple-400 uppercase font-medium", children: "FACE" })
          ] }) }),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", ref: refInputRef, onChange: (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setReferenceImage(ev.target?.result);
              reader.readAsDataURL(file);
            }
          } })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowCameraPanel(true),
            className: `h-16 px-4 rounded-xl flex items-center gap-3 transition-all ${includeCameraSettings ? "bg-[#2a2a2a] hover:bg-gray-700" : "bg-[#1a1a1a] opacity-50 hover:opacity-70"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${includeCameraSettings ? "bg-gray-700" : "bg-gray-800"}`, children: Icons.camera }),
              /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsx("div", { className: `text-xs font-medium ${includeCameraSettings ? "text-white" : "text-gray-500"}`, children: cameras[cameraIndex]?.name || "Camera" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500", children: includeCameraSettings ? `${focalLengths[focalIndex]}mm, ${apertures[apertureIndex]}` : "OFF - not in prompt" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIncludeCameraSettings(!includeCameraSettings),
            className: `h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${includeCameraSettings ? "bg-green-600 text-white hover:bg-green-500" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`,
            title: includeCameraSettings ? "Camera settings ON - click to disable" : "Camera settings OFF - click to enable",
            children: includeCameraSettings ? "ON" : "OFF"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleGenerate,
          disabled: isGenerating,
          className: `h-16 px-8 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${isGenerating ? "bg-gray-700 text-gray-400" : "bg-[#e8ff00] text-black hover:bg-[#f0ff4d] shadow-lg shadow-[#e8ff00]/20"}`,
          children: isGenerating ? /* @__PURE__ */ jsx("span", { className: "w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { children: mode === "image" ? "GENERATE IMAGE" : "GENERATE VIDEO" }),
            /* @__PURE__ */ jsxs("span", { className: "opacity-60 flex items-center gap-1", children: [
              Icons.sparkle,
              " ",
              mode === "image" ? 3 : cost
            ] })
          ] })
        }
      ),
      (currentShot.videoUrl || shots.length > 0) && !isGenerating && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            if (currentShot.videoUrl) {
              setChainPrompt(true);
            } else if (shots.length > 0) {
              const lastShot = shots[shots.length - 1];
              if (lastShot.startFrame) {
                setStartFrame(lastShot.startFrame);
                setMode("image");
                setPreviousPrompt(promptText || lastShot.motionPrompt);
                setPromptText("");
              }
            }
          },
          className: "h-16 px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-[#2a2a2a] text-white hover:bg-gray-700 border border-gray-700",
          children: [
            /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) }),
            /* @__PURE__ */ jsx("span", { children: "NEXT SHOT" })
          ]
        }
      )
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Cinema = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cinema;
  Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Cinema Studio" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CinemaStudio", CinemaStudio, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/CinemaStudio", "client:component-export": "CinemaStudio" })} ` })}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/cinema.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/cinema.astro";
const $$url = "/cinema";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cinema,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
