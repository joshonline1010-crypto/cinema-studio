import { useState, useRef, useEffect } from 'react';
import { useCinemaStore, detectBestModel, type VideoModel } from './cinemaStore';
import {
  CAMERA_PRESETS,
  LENS_PRESETS,
  CAMERA_BODY_PRESETS,
  FOCUS_PRESETS,
  STYLE_PRESETS,
  LIGHTING_PRESETS,
  ATMOSPHERE_PRESETS,
  MOTION_SPEED_PRESETS,
  DIRECTOR_PRESETS,
  EMOTION_PRESETS,
  SHOT_SETUPS,
  FRAMING_PRESETS,
  SET_DESIGN_PRESETS,
  COLOR_PALETTE_PRESETS,
  CHARACTER_STYLE_PRESETS,
  buildCinemaPrompt,
} from './cameraPresets';

// Clean SVG Icons
const Icons = {
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="2" y="4" width="16" height="16" rx="2" />
      <path d="M22 8l-4 2v4l4 2V8z" />
    </svg>
  ),
  movement: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  aspectRatio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  sound: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M5 12h14" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  style: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.3" />
      <path d="M12 2c3 3 4.5 6.5 4.5 10" />
      <path d="M2 12h10" />
      <circle cx="19" cy="19" r="3" />
      <path d="M22 22l-1.5-1.5" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  weather: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2" />
      <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  director: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M4 20h16M4 4l8 8-8 8M12 4l8 8-8 8" />
    </svg>
  ),
  emotion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
    </svg>
  ),
  shot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="8" y1="2" x2="8" y2="8" />
      <line x1="16" y1="2" x2="16" y2="8" />
    </svg>
  ),
  framing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <line x1="8" y1="3" x2="8" y2="21" opacity="0.3" />
      <line x1="16" y1="3" x2="16" y2="21" opacity="0.3" />
      <line x1="3" y1="8" x2="21" y2="8" opacity="0.3" />
      <line x1="3" y1="16" x2="21" y2="16" opacity="0.3" />
    </svg>
  ),
  setDesign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <rect x="9" y="13" width="6" height="8" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  character: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21v-2a6.5 6.5 0 0113 0v2" />
    </svg>
  ),
};

// Scroll-wheel selector column
function ScrollColumn({
  items,
  selectedIndex,
  onSelect,
  label,
  renderItem,
  renderLabel,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label: string;
  renderItem: (item: string, isSelected: boolean) => React.ReactNode;
  renderLabel?: (item: string) => string;
}) {
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    let newIndex = selectedIndex + direction;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    onSelect(newIndex);
  };

  const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
  const nextIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;

  return (
    <div onWheel={handleWheel} className="flex flex-col items-center cursor-ns-resize select-none">
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{label}</div>
      <div
        onClick={() => onSelect(prevIndex)}
        className="h-12 flex items-center justify-center opacity-20 hover:opacity-40 transition-all cursor-pointer"
      >
        {renderItem(items[prevIndex], false)}
      </div>
      <div className="w-24 h-24 bg-gray-800/80 rounded-2xl flex flex-col items-center justify-center border border-gray-700 my-1">
        {renderItem(items[selectedIndex], true)}
      </div>
      <div className="text-xs text-white mt-2 font-medium text-center">
        {renderLabel ? renderLabel(items[selectedIndex]) : items[selectedIndex]}
      </div>
      <div
        onClick={() => onSelect(nextIndex)}
        className="h-12 flex items-center justify-center opacity-20 hover:opacity-40 transition-all cursor-pointer mt-1"
      >
        {renderItem(items[nextIndex], false)}
      </div>
    </div>
  );
}

export default function CinemaStudio() {
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
    resetCurrent,
  } = useCinemaStore();

  const [promptText, setPromptText] = useState('');
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
  const [cameraPanelTab, setCameraPanelTab] = useState<'all' | 'recommended'>('all');
  const [mode, setMode] = useState<'image' | 'video'>('video');
  const [imageTarget, setImageTarget] = useState<'start' | 'end' | null>(null); // null = normal image, 'start'/'end' = transition workflow
  const [includeCameraSettings, setIncludeCameraSettings] = useState(true); // Toggle camera/lens info in prompt
  const [showPromptPreview, setShowPromptPreview] = useState(false); // Show what will be sent
  const [shotCount, setShotCount] = useState(1);

  // Independent state for each column
  const [cameraIndex, setCameraIndex] = useState(0);
  const [lensIndex, setLensIndex] = useState(3); // Start at 50mm
  const [focalIndex, setFocalIndex] = useState(3); // Start at 50
  const [apertureIndex, setApertureIndex] = useState(1); // Start at f/2.8

  // New feature indices
  const [styleIndex, setStyleIndex] = useState<number | null>(null);
  const [lightingIndex, setLightingIndex] = useState<number | null>(null);
  const [atmosphereIndex, setAtmosphereIndex] = useState<number | null>(null);
  const [speedIndex, setSpeedIndex] = useState(2); // Normal speed
  const [directorIndex, setDirectorIndex] = useState<number | null>(null);
  const [emotionIndex, setEmotionIndex] = useState<number | null>(null);
  const [shotSetupIndex, setShotSetupIndex] = useState<number | null>(null);
  const [framingIndex, setFramingIndex] = useState<number | null>(null);
  const [setDesignIndex, setSetDesignIndex] = useState<number | null>(null);
  const [colorPaletteIndex, setColorPaletteIndex] = useState<number | null>(null);
  const [characterStyleIndex, setCharacterStyleIndex] = useState<number | null>(null);

  // Resolution and Aspect Ratio
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('2K');
  const [showAspectPanel, setShowAspectPanel] = useState(false);
  const [showResPanel, setShowResPanel] = useState(false);

  // Reference image (for face/character consistency)
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const refInputRef = useRef<HTMLInputElement>(null);


  // Model capabilities
  const MODEL_SETTINGS = {
    image: {
      aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16', '21:9'],
      // All images auto-compressed to JPEG before video generation
      resolutions: ['512', '1K', '2K', '4K'],
      defaultRes: '2K'
    },
    'kling-2.6': {
      aspectRatios: ['16:9', '9:16', '1:1'],
      durations: [5, 10],
      defaultDuration: 5
    },
    'kling-o1': {
      aspectRatios: ['16:9', '9:16', '1:1'],
      durations: [5, 10],
      defaultDuration: 5
    },
    'seedance-1.5': {
      aspectRatios: ['16:9', '9:16', '1:1'],
      durations: [5],
      defaultDuration: 5
    }
  };

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
  const focalLengths = ['14', '24', '35', '50', '85', '135', '200'];
  const apertures = ['f/1.4', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16'];

  // Sync selections to store
  const handleCameraChange = (index: number) => {
    setCameraIndex(index);
    setCameraBody(cameras[index]);
  };

  const handleLensChange = (index: number) => {
    setLensIndex(index);
    setLens(lenses[index]);
  };

  // Build the full cinematography prompt from all selections
  const buildFullPrompt = () => {
    const baseMotion = promptText || currentShot.motionPrompt ||
      selectedPresets.map(p => p.prompt.split(',')[0]).join(', ') || '';

    // Only include camera settings if toggle is ON
    let cinematographyPrompt = '';
    if (includeCameraSettings) {
      const cameraPart = cameras[cameraIndex] ? `shot on ${cameras[cameraIndex].name}` : '';
      const lensPart = lenses[lensIndex] ? lenses[lensIndex].name : '';
      const focalPart = `${focalLengths[focalIndex]}mm`;
      const aperturePart = apertures[apertureIndex];
      cinematographyPrompt = [cameraPart, lensPart, focalPart, aperturePart].filter(Boolean).join(', ');
    }

    const extraParts: string[] = [];
    if (directorIndex !== null) extraParts.push(directors[directorIndex].prompt.split(',')[0]);
    if (emotionIndex !== null) extraParts.push(emotions[emotionIndex].prompt.split(',')[0]);
    if (shotSetupIndex !== null) extraParts.push(shotSetups[shotSetupIndex].prompt.split(',')[0]);
    if (framingIndex !== null) extraParts.push(framings[framingIndex].prompt.split(',')[0]);
    if (setDesignIndex !== null) extraParts.push(setDesigns[setDesignIndex].prompt.split(',')[0]);
    if (colorPaletteIndex !== null) extraParts.push(colorPalettes[colorPaletteIndex].prompt.split(',')[0]);
    if (characterStyleIndex !== null) extraParts.push(characterStyles[characterStyleIndex].prompt.split(',')[0]);

    return buildCinemaPrompt({
      movement: selectedPresets.length > 0 ? selectedPresets : undefined,
      style: styleIndex !== null ? styles[styleIndex] : undefined,
      lighting: lightingIndex !== null ? lightings[lightingIndex] : undefined,
      atmosphere: atmosphereIndex !== null ? atmospheres[atmosphereIndex] : undefined,
      motionSpeed: speeds[speedIndex],
      customPrompt: [...extraParts, cinematographyPrompt, baseMotion].filter(Boolean).join(', ') || 'cinematic'
    });
  };

  // Auto-detect best model based on current settings
  const autoSelectModel = (): VideoModel => {
    // Has end frame? -> Kling O1 for transitions
    if (currentShot.endFrame) return 'kling-o1';

    // Emotion suggests dialogue/speaking? -> Seedance
    if (emotionIndex !== null) {
      const dialogueEmotions = ['romance', 'confession', 'confrontation'];
      if (dialogueEmotions.includes(emotions[emotionIndex].id)) return 'seedance-1.5';
    }

    // Shot setup is dialogue-heavy? -> Seedance
    if (shotSetupIndex !== null) {
      const dialogueSetups = ['confession', 'confrontation'];
      if (dialogueSetups.includes(shotSetups[shotSetupIndex].id)) return 'seedance-1.5';
    }

    // Default -> Kling 2.6 for action/general
    return 'kling-2.6';
  };

  // ============================================
  // AUTO-COMPRESS FOR KLING (ImageMagick)
  // ============================================
  const compressForKling = async (imageUrl: string): Promise<string> => {
    // Skip if already compressed (catbox jpg)
    if (imageUrl.includes('catbox.moe') && imageUrl.endsWith('.jpg')) {
      console.log('Already compressed, skipping');
      return imageUrl;
    }

    console.log('Compressing image for Kling...');

    try {
      const response = await fetch('/api/cinema/compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Compression failed');
      }

      if (data.image_url) {
        console.log(`Compressed: ${(data.original_size / 1024 / 1024).toFixed(2)}MB → ${(data.compressed_size / 1024).toFixed(0)}KB`);
        return data.image_url;
      }

      throw new Error('No compressed URL returned');
    } catch (err) {
      console.error('Compression failed, using original:', err);
      return imageUrl; // Fallback to original
    }
  };

  // ============================================
  // MAIN GENERATE FUNCTION
  // ============================================
  const handleGenerate = async () => {
    const fullPrompt = buildFullPrompt();

    // ========== IMAGE MODE ==========
    if (mode === 'image') {
      if (!promptText && !fullPrompt) {
        alert('Please enter a prompt to generate an image!');
        return;
      }

      startGeneration();
      setProgress(10);

      try {
        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image',
            prompt: fullPrompt,
            aspect_ratio: aspectRatio,
            resolution: resolution,
            // CHAINING FIX: Use extracted last frame (startFrame) if available, else original reference
            reference_image: currentShot.startFrame || referenceImage || undefined
          })
        });

        setProgress(50);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || data.details || 'Image generation failed');

        if (data.image_url) {
          setProgress(100);

          // Set as START, END, or normal frame based on imageTarget setting
          if (imageTarget === 'end') {
            // END frame for transition workflow
            setEndFrame(data.image_url);
            setMode('video');
            failGeneration('');
            alert('END image generated! Both frames ready - Kling O1 will be used for transition video.');
          } else if (imageTarget === 'start') {
            // START frame for transition workflow
            setStartFrame(data.image_url);
            failGeneration('');
            // Auto-switch to END mode for next generation
            setImageTarget('end');
            // Stay in image mode
          } else {
            // Normal image (no START/END) - just go to video
            setStartFrame(data.image_url);
            setMode('video');
            failGeneration('');
            // Kling 2.6 will be used (no end frame)
          }
        } else {
          throw new Error('No image URL in response');
        }
      } catch (err) {
        failGeneration(err instanceof Error ? err.message : 'Unknown error');
      }
      return;
    }

    // ========== VIDEO MODE ==========
    if (!currentShot.startFrame) {
      alert('Please add a start frame first! Switch to Image mode to generate one.');
      return;
    }

    startGeneration();
    setProgress(5);

    try {
      // Auto-select best model
      const selectedModel = autoSelectModel();
      setModel(selectedModel);
      setProgress(10);

      // ===== AUTO-COMPRESS IMAGES FOR KLING =====
      // Compress to 4K JPEG under 10MB using ImageMagick
      const compressedStart = await compressForKling(currentShot.startFrame);
      setProgress(15);

      let compressedEnd: string | undefined;
      if (currentShot.endFrame) {
        compressedEnd = await compressForKling(currentShot.endFrame);
      }
      setProgress(20);

      let requestBody: any = {
        prompt: fullPrompt,
        duration: String(currentShot.duration),
        aspect_ratio: aspectRatio
      };

      // Configure request based on model (using compressed images)
      if (selectedModel === 'kling-o1') {
        requestBody.type = 'video-kling-o1';
        requestBody.start_image_url = compressedStart;
        if (compressedEnd) requestBody.end_image_url = compressedEnd;
      } else if (selectedModel === 'seedance-1.5') {
        requestBody.type = 'video-seedance';
        requestBody.image_url = compressedStart;
        if (compressedEnd) requestBody.end_image_url = compressedEnd;
      } else {
        requestBody.type = 'video-kling';
        requestBody.image_url = compressedStart;
      }

      setProgress(25);

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      setProgress(40);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || data.details || 'Generation failed');

      setProgress(80);

      if (data.video_url) {
        setProgress(100);
        completeGeneration(data.video_url);

        // After video completes, offer to chain to next shot
        if (shots.length < 3) { // Allow up to 4 shots
          setChainPrompt(true);
        }
      } else {
        throw new Error('No video URL in response');
      }
    } catch (err) {
      failGeneration(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // State for shot chaining prompt
  const [chainPrompt, setChainPrompt] = useState(false);
  const [previousPrompt, setPreviousPrompt] = useState<string>('');
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  const [playingShot, setPlayingShot] = useState<string | null>(null);

  // Extract last frame from video
  const extractLastFrame = async (videoUrl: string): Promise<string | null> => {
    try {
      setIsExtractingFrame(true);
      const response = await fetch('/api/cinema/extract-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl, position: 'last' })
      });
      const data = await response.json();
      if (data.success && data.frame_url) {
        return data.frame_url;
      }
      return null;
    } catch (err) {
      console.error('Frame extraction failed:', err);
      return null;
    } finally {
      setIsExtractingFrame(false);
    }
  };

  // Chain current shot to next - pass generated image as reference for next IMAGE
  // NOTE: This is for CHAINING shots (sequential), NOT for start→end single videos
  const handleChainToNext = async () => {
    // Capture the generated image BEFORE saving (which resets currentShot)
    // This image becomes the REFERENCE for generating the NEXT shot's image
    const previousGeneratedImage = currentShot.startFrame;

    // Save the current prompt for context
    const currentPromptText = promptText;
    setPreviousPrompt(currentPromptText);

    // Save current shot to timeline (this resets currentShot!)
    saveCurrentAsShot();

    // Set the previous generated image as reference for next shot
    // In IMAGE mode, this will be used as reference_image for nano-banana
    // DO NOT set endFrame here - that's for start→end video workflow, not chaining
    if (previousGeneratedImage) {
      setStartFrame(previousGeneratedImage);
    }

    // Clear prompt for new shot
    setPromptText('');

    setChainPrompt(false);
    setMode('image'); // Switch to image mode to generate next image with reference
  };

  // Play a shot from timeline
  const handlePlayShot = (shotId: string) => {
    setPlayingShot(playingShot === shotId ? null : shotId);
  };

  // Concatenate all shots into final video
  const handleConcatenateShots = async () => {
    if (shots.length < 2) {
      alert('Need at least 2 shots to concatenate!');
      return;
    }

    startGeneration();
    try {
      // Call n8n workflow for ffmpeg concat
      const videoUrls = shots.map(s => s.videoUrl).filter(Boolean);

      const response = await fetch('http://localhost:5678/webhook/ffmpeg-concat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: videoUrls })
      });

      const data = await response.json();
      if (data.output_url) {
        completeGeneration(data.output_url);
        alert('Videos concatenated! Final video ready.');
      } else {
        throw new Error('Concatenation failed');
      }
    } catch (err) {
      failGeneration(err instanceof Error ? err.message : 'Concatenation failed');
    }
  };

  const cost = currentShot.duration === 5 ? 8 : 16;
  const summaryText = `${cameras[cameraIndex]?.name || 'Camera'}, ${lenses[lensIndex]?.name || 'Lens'}, ${focalLengths[focalIndex]}mm, ${apertures[apertureIndex]}`;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="relative aspect-video bg-[#151515] rounded-xl overflow-hidden border border-gray-800/30">
            {currentShot.videoUrl ? (
              <video src={currentShot.videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            ) : currentShot.startFrame ? (
              <img src={currentShot.startFrame} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center mb-4">
                  {mode === 'image' ? Icons.image : Icons.video}
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-medium">CINEMA STUDIO</div>
                <div className="text-gray-600 text-[11px]">
                  {mode === 'image'
                    ? 'Enter a prompt and click Generate to create a start frame'
                    : 'Switch to Image mode or upload a frame to begin'}
                </div>
              </div>
            )}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-[#e8ff00] text-sm font-medium">Generating... {generationProgress}%</div>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Shot Timeline - Click to play any shot */}
          {shots.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Shot Timeline ({shots.length})</span>
                  {previousPrompt && (
                    <span className="text-[10px] text-gray-600 italic truncate max-w-xs">
                      Prev: "{previousPrompt.slice(0, 40)}..."
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {shots.length >= 2 && (
                    <button
                      onClick={handleConcatenateShots}
                      className="px-3 py-1.5 bg-[#e8ff00] text-black rounded-lg text-xs font-semibold hover:bg-[#f0ff4d] transition-colors"
                    >
                      Export All
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {shots.map((shot, idx) => (
                  <button
                    key={shot.id}
                    onClick={() => handlePlayShot(shot.id)}
                    className={`relative group flex-shrink-0 transition-all ${
                      playingShot === shot.id ? 'ring-2 ring-[#e8ff00] scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`w-32 aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden border ${
                      playingShot === shot.id ? 'border-[#e8ff00]' : 'border-gray-800'
                    }`}>
                      {shot.videoUrl ? (
                        playingShot === shot.id ? (
                          <video src={shot.videoUrl} className="w-full h-full object-cover" autoPlay loop muted />
                        ) : (
                          <video src={shot.videoUrl} className="w-full h-full object-cover" muted />
                        )
                      ) : shot.startFrame ? (
                        <img src={shot.startFrame} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                          Shot {idx + 1}
                        </div>
                      )}
                      {/* Play overlay */}
                      {shot.videoUrl && playingShot !== shot.id && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="black" className="w-4 h-4 ml-0.5">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {/* Now playing indicator */}
                      {playingShot === shot.id && (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-[#e8ff00] rounded text-[9px] text-black font-bold">
                          PLAYING
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] text-gray-300">
                      #{idx + 1} - {shot.duration}s
                    </div>
                  </button>
                ))}
                {/* Next shot slot - clickable to start chaining */}
                <button
                  onClick={() => {
                    // If we have a completed video, trigger chaining
                    if (currentShot.videoUrl) {
                      setChainPrompt(true);
                    } else if (shots.length > 0) {
                      // Use last shot's data for chaining
                      const lastShot = shots[shots.length - 1];
                      if (lastShot.startFrame) {
                        setStartFrame(lastShot.startFrame);
                        setMode('image');
                        setPreviousPrompt(promptText || lastShot.motionPrompt);
                        setPromptText('');
                      }
                    }
                  }}
                  className="w-32 aspect-video bg-[#151515] rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center flex-shrink-0 hover:border-[#e8ff00] hover:bg-[#1a1a1a] transition-all group"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600 group-hover:text-[#e8ff00] mb-1">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-gray-600 group-hover:text-[#e8ff00] text-[10px]">Next Shot</span>
                </button>
              </div>
              {isExtractingFrame && (
                <div className="mt-2 text-xs text-[#e8ff00] flex items-center gap-2">
                  <div className="w-3 h-3 border border-[#e8ff00] border-t-transparent rounded-full animate-spin" />
                  Extracting last frame for next shot...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chain Prompt Modal - Ask user if they want to continue to next shot */}
      {chainPrompt && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              {isExtractingFrame ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-[#e8ff00]/10 flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Setting up next shot...</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Extracting last frame from video to use as your next starting point.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-[#e8ff00]/10 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#e8ff00" strokeWidth="2" className="w-8 h-8">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Shot {shots.length + 1} Complete!</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Continue to the next shot?
                  </p>
                  <p className="text-gray-500 text-xs mb-6">
                    We'll use the last frame of this video as your next starting point.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setChainPrompt(false)}
                      className="flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Stay Here
                    </button>
                    <button
                      onClick={handleChainToNext}
                      className="flex-1 px-4 py-3 bg-[#e8ff00] text-black rounded-xl text-sm font-semibold hover:bg-[#f0ff4d] transition-colors flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      Next Shot
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera/Lens Panel - Clean Modern */}
      {showCameraPanel && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowCameraPanel(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-8 shadow-2xl max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setCameraPanelTab('all')}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${cameraPanelTab === 'all' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setCameraPanelTab('recommended')}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${cameraPanelTab === 'recommended' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'}`}
                >
                  By Director
                </button>
              </div>
              <button onClick={() => setShowCameraPanel(false)} className="w-10 h-10 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            {/* Recommended Tab - Director-based presets */}
            {cameraPanelTab === 'recommended' && (
              <div className="space-y-4">
                <div className="text-sm text-gray-400 mb-4">Select a director to see their signature camera setups:</div>
                <div className="grid grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
                  {directors.map((dir, idx) => (
                    <button
                      key={dir.id}
                      onClick={() => {
                        // Apply all recommended settings
                        if (dir.recommendedCamera) {
                          const camIdx = cameras.findIndex(c => c.id === dir.recommendedCamera);
                          if (camIdx !== -1) { setCameraIndex(camIdx); setCameraBody(cameras[camIdx]); }
                        }
                        if (dir.recommendedLens) {
                          const lensIdx = lenses.findIndex(l => l.id === dir.recommendedLens);
                          if (lensIdx !== -1) { setLensIndex(lensIdx); setLens(lenses[lensIdx]); }
                        }
                        if (dir.recommendedMovement) {
                          clearPresets();
                          dir.recommendedMovement.forEach(movId => {
                            const preset = CAMERA_PRESETS.find(p => p.id === movId);
                            if (preset) togglePreset(preset);
                          });
                        }
                        setDirectorIndex(idx);
                        setShowCameraPanel(false);
                      }}
                      className="rounded-xl p-4 bg-[#2a2a2a] text-left hover:bg-gray-700 transition-all hover:scale-[1.02]"
                    >
                      <div className="text-sm font-bold text-white">{dir.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{dir.director}</div>
                      <div className="mt-3 space-y-1">
                        {dir.recommendedCamera && (
                          <div className="text-[10px] text-gray-400">
                            <span className="text-gray-600">Camera:</span> {cameras.find(c => c.id === dir.recommendedCamera)?.name}
                          </div>
                        )}
                        {dir.recommendedLens && (
                          <div className="text-[10px] text-gray-400">
                            <span className="text-gray-600">Lens:</span> {lenses.find(l => l.id === dir.recommendedLens)?.name}
                          </div>
                        )}
                        {dir.recommendedMovement && (
                          <div className="text-[10px] text-gray-400">
                            <span className="text-gray-600">Motion:</span> {dir.recommendedMovement.map(m => CAMERA_PRESETS.find(p => p.id === m)?.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Tab - 4-Column Scroll Selector */}
            {cameraPanelTab === 'all' && (
            <>
            <div className="flex justify-center gap-10">
              {/* Camera */}
              <ScrollColumn
                items={cameras.map(c => c.id)}
                selectedIndex={cameraIndex}
                onSelect={handleCameraChange}
                label="CAMERA"
                renderItem={(id, isSelected) => (
                  <div className={`${isSelected ? 'w-14 h-14' : 'w-8 h-8'} rounded-lg bg-gray-700 flex items-center justify-center transition-all`}>
                    <span className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>{Icons.camera}</span>
                  </div>
                )}
                renderLabel={(id) => {
                  const cam = cameras.find(c => c.id === id);
                  return cam?.name || '';
                }}
              />

              {/* Lens */}
              <ScrollColumn
                items={lenses.map(l => l.id)}
                selectedIndex={lensIndex}
                onSelect={handleLensChange}
                label="LENS"
                renderItem={(id, isSelected) => (
                  <div className={`${isSelected ? 'w-14 h-14' : 'w-8 h-8'} rounded-full border-2 ${isSelected ? 'border-white' : 'border-gray-600'} flex items-center justify-center transition-all`}>
                    <div className={`${isSelected ? 'w-6 h-6' : 'w-3 h-3'} rounded-full bg-gray-400 transition-all`} />
                  </div>
                )}
                renderLabel={(id) => {
                  const lens = lenses.find(l => l.id === id);
                  return lens?.name || '';
                }}
              />

              {/* Focal Length */}
              <ScrollColumn
                items={focalLengths}
                selectedIndex={focalIndex}
                onSelect={setFocalIndex}
                label="FOCAL LENGTH"
                renderItem={(fl, isSelected) => (
                  <span className={`font-bold ${isSelected ? 'text-3xl text-white' : 'text-lg text-gray-500'} transition-all`}>{fl}</span>
                )}
                renderLabel={(fl) => `${fl}mm`}
              />

              {/* Aperture */}
              <ScrollColumn
                items={apertures}
                selectedIndex={apertureIndex}
                onSelect={setApertureIndex}
                label="APERTURE"
                renderItem={(ap, isSelected) => {
                  const openings: Record<string, number> = {
                    'f/1.4': 90, 'f/2.8': 75, 'f/4': 60, 'f/5.6': 50, 'f/8': 40, 'f/11': 30, 'f/16': 20
                  };
                  const size = isSelected ? openings[ap] : openings[ap] * 0.5;
                  return (
                    <div className={`${isSelected ? 'w-14 h-14' : 'w-8 h-8'} rounded-full border-2 ${isSelected ? 'border-gray-500' : 'border-gray-700'} flex items-center justify-center transition-all`}>
                      <div className="rounded-full bg-gray-400 transition-all" style={{ width: `${size}%`, height: `${size}%` }} />
                    </div>
                  );
                }}
                renderLabel={(ap) => ap}
              />
            </div>

            {/* Summary */}
            <div className="mt-8 text-center text-gray-500 text-xs">
              {summaryText}
            </div>
            </>
            )}
          </div>
        </div>
      )}

      {/* Movements Panel - Clean Grid */}
      {showMovements && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowMovements(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Camera movement</span>
              <button onClick={() => setShowMovements(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-3 overflow-y-auto max-h-[60vh] pr-2">
              {CAMERA_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => togglePreset(preset)}
                  className={`rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${
                    selectedPresets.some(p => p.id === preset.id)
                      ? 'ring-2 ring-[#e8ff00] ring-offset-2 ring-offset-[#1a1a1a]'
                      : ''
                  }`}
                >
                  <div className="aspect-square bg-[#2a2a2a] flex items-center justify-center relative">
                    {/* Movement Icon - Arrow based on type */}
                    <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
                        {preset.category === 'dolly' && <path d="M12 19V5M5 12l7-7 7 7" />}
                        {preset.category === 'pan' && <path d="M5 12h14M12 5l7 7-7 7" />}
                        {preset.category === 'tilt' && <path d="M12 5v14M5 12l7 7 7-7" />}
                        {preset.category === 'orbit' && <circle cx="12" cy="12" r="7" />}
                        {preset.category === 'zoom' && <><circle cx="11" cy="11" r="6" /><path d="M21 21l-4.35-4.35" /></>}
                        {preset.category === 'special' && <path d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z" />}
                        {preset.category === 'static' && <rect x="6" y="6" width="12" height="12" rx="2" />}
                      </svg>
                    </div>
                    {selectedPresets.some(p => p.id === preset.id) && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#e8ff00] rounded-md flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-3 h-3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-1.5 bg-[#222] text-center">
                    <div className="text-[10px] text-gray-300 font-medium truncate">{preset.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Styles Panel */}
      {showStyles && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowStyles(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Visual Style</span>
              <button onClick={() => setShowStyles(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {styles.map((style, idx) => (
                <button
                  key={style.id}
                  onClick={() => { setStyleIndex(styleIndex === idx ? null : idx); setShowStyles(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${
                    styleIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{style.name}</div>
                  <div className={`text-[10px] mt-1 ${styleIndex === idx ? 'text-black/60' : 'text-gray-500'}`}>{style.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lighting Panel */}
      {showLighting && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowLighting(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Lighting</span>
              <button onClick={() => setShowLighting(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {lightings.map((light, idx) => (
                <button
                  key={light.id}
                  onClick={() => { setLightingIndex(lightingIndex === idx ? null : idx); setShowLighting(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${
                    lightingIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{light.name}</div>
                  <div className={`text-[10px] mt-1 ${lightingIndex === idx ? 'text-black/60' : 'text-gray-500'}`}>{light.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Atmosphere Panel */}
      {showAtmosphere && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAtmosphere(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Weather / Atmosphere</span>
              <button onClick={() => setShowAtmosphere(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {atmospheres.map((atm, idx) => (
                <button
                  key={atm.id}
                  onClick={() => { setAtmosphereIndex(atmosphereIndex === idx ? null : idx); setShowAtmosphere(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${
                    atmosphereIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{atm.name}</div>
                  <div className={`text-[10px] mt-1 ${atmosphereIndex === idx ? 'text-black/60' : 'text-gray-500'}`}>{atm.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Directors Panel */}
      {showDirectors && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowDirectors(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Director Styles</span>
              <button onClick={() => setShowDirectors(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[50vh]">
              {directors.map((dir, idx) => (
                <button
                  key={dir.id}
                  onClick={() => { setDirectorIndex(directorIndex === idx ? null : idx); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    directorIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{dir.name}</div>
                  <div className={`text-[10px] mt-0.5 ${directorIndex === idx ? 'text-black/60' : 'text-gray-500'}`}>{dir.director}</div>
                  <div className={`text-[10px] mt-2 ${directorIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{dir.description}</div>
                </button>
              ))}
            </div>

            {/* Recommended Settings for Selected Director */}
            {directorIndex !== null && (
              <div className="mt-5 pt-5 border-t border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-white">
                    Recommended for {directors[directorIndex].name}
                  </div>
                  <button
                    onClick={() => {
                      const dir = directors[directorIndex];
                      // Apply recommended camera
                      if (dir.recommendedCamera) {
                        const camIdx = cameras.findIndex(c => c.id === dir.recommendedCamera);
                        if (camIdx !== -1) { setCameraIndex(camIdx); setCameraBody(cameras[camIdx]); }
                      }
                      // Apply recommended lens
                      if (dir.recommendedLens) {
                        const lensIdx = lenses.findIndex(l => l.id === dir.recommendedLens);
                        if (lensIdx !== -1) { setLensIndex(lensIdx); setLens(lenses[lensIdx]); }
                      }
                      // Apply recommended movements
                      if (dir.recommendedMovement) {
                        clearPresets();
                        dir.recommendedMovement.forEach(movId => {
                          const preset = CAMERA_PRESETS.find(p => p.id === movId);
                          if (preset) togglePreset(preset);
                        });
                      }
                      // Apply recommended lighting
                      if (dir.recommendedLighting) {
                        const lightIdx = lightings.findIndex(l => l.id === dir.recommendedLighting);
                        if (lightIdx !== -1) setLightingIndex(lightIdx);
                      }
                      // Apply recommended style
                      if (dir.recommendedStyle) {
                        const styleIdx = styles.findIndex(s => s.id === dir.recommendedStyle);
                        if (styleIdx !== -1) setStyleIndex(styleIdx);
                      }
                      // Apply recommended atmosphere
                      if (dir.recommendedAtmosphere) {
                        const atmoIdx = atmospheres.findIndex(a => a.id === dir.recommendedAtmosphere);
                        if (atmoIdx !== -1) setAtmosphereIndex(atmoIdx);
                      }
                      // Apply recommended framing
                      if (dir.recommendedFraming) {
                        const framIdx = framings.findIndex(f => f.id === dir.recommendedFraming);
                        if (framIdx !== -1) setFramingIndex(framIdx);
                      }
                      // Apply recommended set design
                      if (dir.recommendedSetDesign) {
                        const setIdx = setDesigns.findIndex(s => s.id === dir.recommendedSetDesign);
                        if (setIdx !== -1) setSetDesignIndex(setIdx);
                      }
                      // Apply recommended color palette
                      if (dir.recommendedColorPalette) {
                        const colorIdx = colorPalettes.findIndex(c => c.id === dir.recommendedColorPalette);
                        if (colorIdx !== -1) setColorPaletteIndex(colorIdx);
                      }
                      // Apply recommended character style
                      if (dir.recommendedCharacterStyle) {
                        const charIdx = characterStyles.findIndex(c => c.id === dir.recommendedCharacterStyle);
                        if (charIdx !== -1) setCharacterStyleIndex(charIdx);
                      }
                      setShowDirectors(false);
                    }}
                    className="px-4 py-2 bg-[#e8ff00] text-black rounded-lg text-xs font-semibold hover:bg-[#f0ff4d] transition-colors"
                  >
                    Apply All Recommended
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Recommended Camera */}
                  <div className="bg-[#2a2a2a] rounded-xl p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Camera</div>
                    {directors[directorIndex].recommendedCamera ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">{Icons.camera}</div>
                        <div className="text-sm text-white">{cameras.find(c => c.id === directors[directorIndex].recommendedCamera)?.name || 'Any'}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Any camera works</div>
                    )}
                  </div>

                  {/* Recommended Lens */}
                  <div className="bg-[#2a2a2a] rounded-xl p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Lens</div>
                    {directors[directorIndex].recommendedLens ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                        </div>
                        <div className="text-sm text-white">{lenses.find(l => l.id === directors[directorIndex].recommendedLens)?.name || 'Any'}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Any lens works</div>
                    )}
                  </div>

                  {/* Recommended Movements */}
                  <div className="bg-[#2a2a2a] rounded-xl p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Movements</div>
                    {directors[directorIndex].recommendedMovement && directors[directorIndex].recommendedMovement.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {directors[directorIndex].recommendedMovement.map(movId => {
                          const preset = CAMERA_PRESETS.find(p => p.id === movId);
                          return preset ? (
                            <span key={movId} className="px-2 py-1 bg-gray-700 rounded text-[10px] text-gray-300">{preset.name}</span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Any movement</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emotions Panel */}
      {showEmotions && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowEmotions(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Emotion / Mood</span>
              <button onClick={() => setShowEmotions(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]">
              {emotions.map((emo, idx) => (
                <button
                  key={emo.id}
                  onClick={() => { setEmotionIndex(emotionIndex === idx ? null : idx); setShowEmotions(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    emotionIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{emo.name}</div>
                  <div className={`text-[10px] mt-0.5 ${emotionIndex === idx ? 'text-black/60' : 'text-gray-500'}`}>{emo.emotion}</div>
                  <div className={`text-[10px] mt-2 ${emotionIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{emo.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shot Setups Panel */}
      {showShotSetups && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowShotSetups(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Story Beat / Shot Setup</span>
              <button onClick={() => setShowShotSetups(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]">
              {shotSetups.map((setup, idx) => (
                <button
                  key={setup.id}
                  onClick={() => { setShotSetupIndex(shotSetupIndex === idx ? null : idx); setShowShotSetups(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    shotSetupIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{setup.name}</div>
                  <div className={`text-[10px] mt-0.5 ${shotSetupIndex === idx ? 'text-black/60' : 'text-gray-500'}`}>{setup.storyBeat}</div>
                  <div className={`text-[10px] mt-2 ${shotSetupIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{setup.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Framing Panel */}
      {showFraming && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowFraming(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Framing / Composition</span>
              <button onClick={() => setShowFraming(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]">
              {framings.map((framing, idx) => (
                <button
                  key={framing.id}
                  onClick={() => { setFramingIndex(framingIndex === idx ? null : idx); setShowFraming(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    framingIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{framing.name}</div>
                  <div className={`text-[10px] mt-1 ${framingIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{framing.description}</div>
                  {framing.example && (
                    <div className={`text-[9px] mt-2 italic ${framingIndex === idx ? 'text-black/50' : 'text-gray-500'}`}>{framing.example}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Set Design Panel */}
      {showSetDesign && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSetDesign(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Set Design / Environment</span>
              <button onClick={() => setShowSetDesign(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]">
              {setDesigns.map((design, idx) => (
                <button
                  key={design.id}
                  onClick={() => { setSetDesignIndex(setDesignIndex === idx ? null : idx); setShowSetDesign(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    setDesignIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{design.name}</div>
                  <div className={`text-[10px] mt-1 ${setDesignIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{design.description}</div>
                  {design.director && (
                    <div className={`text-[9px] mt-2 italic ${setDesignIndex === idx ? 'text-black/50' : 'text-gray-500'}`}>{design.director}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Color Palette Panel */}
      {showColorPalette && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowColorPalette(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Color Palette</span>
              <button onClick={() => setShowColorPalette(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]">
              {colorPalettes.map((palette, idx) => (
                <button
                  key={palette.id}
                  onClick={() => { setColorPaletteIndex(colorPaletteIndex === idx ? null : idx); setShowColorPalette(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    colorPaletteIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{palette.name}</div>
                  {/* Color swatches */}
                  <div className="flex gap-1 mt-2">
                    {palette.colors.slice(0, 5).map((color, colorIdx) => (
                      <div
                        key={colorIdx}
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className={`text-[10px] mt-2 ${colorPaletteIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{palette.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Character Style Panel */}
      {showCharacterStyle && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowCharacterStyle(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300">Character Style / Costume</span>
              <button onClick={() => setShowCharacterStyle(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]">
              {characterStyles.map((style, idx) => (
                <button
                  key={style.id}
                  onClick={() => { setCharacterStyleIndex(characterStyleIndex === idx ? null : idx); setShowCharacterStyle(false); }}
                  className={`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${
                    characterStyleIndex === idx
                      ? 'bg-[#e8ff00] text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-bold">{style.name}</div>
                  <div className={`text-[10px] mt-1 ${characterStyleIndex === idx ? 'text-black/70' : 'text-gray-400'}`}>{style.description}</div>
                  {style.director && (
                    <div className={`text-[9px] mt-2 italic ${characterStyleIndex === idx ? 'text-black/50' : 'text-gray-500'}`}>{style.director}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Toolbar - Clean Higgsfield Style */}
      <div className="border-t border-gray-800/50 bg-[#1a1a1a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {/* Mode Toggle - Vertical Stack */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setMode('image')}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                mode === 'image'
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              {Icons.image}
              <span className="text-[9px] mt-1 font-medium">Image</span>
            </button>
            <button
              onClick={() => setMode('video')}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                mode === 'video'
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              {Icons.video}
              <span className="text-[9px] mt-1 font-medium">Video</span>
            </button>
          </div>

          {/* START/END Toggle - Only visible in Image mode */}
          {/* Double-click to deselect = normal image mode (Kling 2.6) */}
          {mode === 'image' && (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setImageTarget(imageTarget === 'start' ? null : 'start')}
                className={`px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${
                  imageTarget === 'start'
                    ? 'bg-[#e8ff00] text-black'
                    : currentShot.startFrame ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                title="Click to select, click again to deselect"
              >
                START {currentShot.startFrame && '✓'}
              </button>
              <button
                onClick={() => setImageTarget(imageTarget === 'end' ? null : 'end')}
                className={`px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${
                  imageTarget === 'end'
                    ? 'bg-[#e8ff00] text-black'
                    : currentShot.endFrame ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                title="Click to select, click again to deselect"
              >
                END {currentShot.endFrame && '✓'}
              </button>
              {/* Hints */}
              {imageTarget === null && (
                <div className="text-[9px] text-gray-500">
                  Normal → Kling 2.6
                </div>
              )}
              {imageTarget === 'start' && !currentShot.startFrame && (
                <div className="text-[9px] text-gray-500">
                  Transition mode
                </div>
              )}
              {imageTarget === 'end' && !currentShot.startFrame && (
                <div className="text-[9px] text-orange-400">
                  Generate START first!
                </div>
              )}
              {imageTarget === 'end' && currentShot.startFrame && !currentShot.endFrame && (
                <div className="text-[9px] text-[#e8ff00]">
                  Using START as ref →
                </div>
              )}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Previous shot context */}
            {previousPrompt && currentShot.startFrame && !promptText && (
              <div className="text-[10px] text-gray-500 px-1">
                Continuing from: "{previousPrompt.slice(0, 50)}..." - What happens next?
              </div>
            )}
            {/* Prompt Input - Larger */}
            <div className="relative">
              <input
                type="text"
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setMotionPrompt(e.target.value);
                }}
                placeholder={previousPrompt && currentShot.startFrame
                  ? "What happens next in the scene..."
                  : "Describe the scene you imagine..."}
                className="w-full px-5 py-3.5 bg-[#2a2a2a] border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 text-sm pr-20"
              />
              {/* Preview Toggle */}
              <button
                onClick={() => setShowPromptPreview(!showPromptPreview)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-medium transition-all ${
                  showPromptPreview
                    ? 'bg-[#e8ff00] text-black'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {showPromptPreview ? 'HIDE' : 'PREVIEW'}
              </button>
            </div>
            {/* Full Prompt Preview */}
            {showPromptPreview && (
              <div className="px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <div className="text-[9px] text-gray-500 uppercase mb-1">Full prompt being sent:</div>
                <div className="text-[11px] text-gray-300 break-words">
                  {buildFullPrompt() || <span className="text-gray-600 italic">Enter a prompt above</span>}
                </div>
                {!includeCameraSettings && (
                  <div className="text-[9px] text-orange-400 mt-1">Camera settings OFF</div>
                )}
              </div>
            )}

            {/* Control Pills - Horizontal scroll, no wrap */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <button
                onClick={() => { setShowMovements(true); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  selectedPresets.length > 0
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.movement}
                <span>Motion</span>
              </button>

              <button
                onClick={() => { setShowDirectors(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  directorIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.director}
                <span>{directorIndex !== null ? directors[directorIndex].name : 'Director'}</span>
              </button>

              <button
                onClick={() => { setShowEmotions(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  emotionIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.emotion}
                <span>{emotionIndex !== null ? emotions[emotionIndex].name : 'Emotion'}</span>
              </button>

              <button
                onClick={() => { setShowShotSetups(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  shotSetupIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.shot}
                <span>{shotSetupIndex !== null ? shotSetups[shotSetupIndex].name : 'Shot'}</span>
              </button>

              <div className="w-px h-6 bg-gray-700 mx-1" />

              <button
                onClick={() => { setShowStyles(true); setShowMovements(false); setShowCameraPanel(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  styleIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.style}
                <span>{styleIndex !== null ? styles[styleIndex].name : 'Style'}</span>
              </button>

              <button
                onClick={() => { setShowLighting(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  lightingIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.light}
                <span>{lightingIndex !== null ? lightings[lightingIndex].name : 'Light'}</span>
              </button>

              <button
                onClick={() => { setShowAtmosphere(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowFraming(false); setShowSetDesign(false); setShowColorPalette(false); setShowCharacterStyle(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  atmosphereIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.weather}
                <span>{atmosphereIndex !== null ? atmospheres[atmosphereIndex].name : 'Weather'}</span>
              </button>

              <div className="w-px h-6 bg-gray-700 mx-1" />

              {/* Visual Design Controls */}
              <button
                onClick={() => { setShowFraming(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowSetDesign(false); setShowColorPalette(false); setShowCharacterStyle(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  framingIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.framing}
                <span>{framingIndex !== null ? framings[framingIndex].name : 'Framing'}</span>
              </button>

              <button
                onClick={() => { setShowSetDesign(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowFraming(false); setShowColorPalette(false); setShowCharacterStyle(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  setDesignIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.setDesign}
                <span>{setDesignIndex !== null ? setDesigns[setDesignIndex].name : 'Set'}</span>
              </button>

              <button
                onClick={() => { setShowColorPalette(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowFraming(false); setShowSetDesign(false); setShowCharacterStyle(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  colorPaletteIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.palette}
                <span>{colorPaletteIndex !== null ? colorPalettes[colorPaletteIndex].name : 'Colors'}</span>
              </button>

              <button
                onClick={() => { setShowCharacterStyle(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowFraming(false); setShowSetDesign(false); setShowColorPalette(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all flex-shrink-0 ${
                  characterStyleIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.character}
                <span>{characterStyleIndex !== null ? characterStyles[characterStyleIndex].name : 'Costume'}</span>
              </button>

              <div className="w-px h-6 bg-gray-700 mx-1" />

              {/* Aspect Ratio - cycles through options based on mode */}
              <button
                onClick={() => {
                  const ratios = mode === 'image'
                    ? MODEL_SETTINGS.image.aspectRatios
                    : MODEL_SETTINGS['kling-2.6'].aspectRatios;
                  const currentIdx = ratios.indexOf(aspectRatio);
                  const nextIdx = (currentIdx + 1) % ratios.length;
                  setAspectRatio(ratios[nextIdx]);
                }}
                className="h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5"
              >
                {Icons.aspectRatio}
                <span>{aspectRatio}</span>
              </button>

              {/* Resolution - only for image mode */}
              {mode === 'image' && (
                <button
                  onClick={() => {
                    const resolutions = MODEL_SETTINGS.image.resolutions;
                    const currentIdx = resolutions.indexOf(resolution);
                    const nextIdx = (currentIdx + 1) % resolutions.length;
                    setResolution(resolutions[nextIdx]);
                  }}
                  className="h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 3v18" />
                  </svg>
                  <span>{resolution}</span>
                </button>
              )}

              {/* Duration - only for video mode */}
              {mode === 'video' && (
                <button
                  onClick={() => setDuration(currentShot.duration === 5 ? 10 : 5)}
                  className="h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                >
                  {Icons.clock}
                  <span>{currentShot.duration}s</span>
                </button>
              )}

              <button
                onClick={() => setSpeedIndex((speedIndex + 1) % speeds.length)}
                className="h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5"
              >
                {Icons.speed}
                <span>{speeds[speedIndex].name}</span>
              </button>

              {/* Shot Counter */}
              <div className="flex items-center gap-1 ml-1 text-gray-500">
                <button
                  onClick={() => setShotCount(Math.max(1, shotCount - 1))}
                  className="w-6 h-6 rounded-md bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  {Icons.minus}
                </button>
                <span className="text-xs font-medium w-6 text-center">{shotCount}/4</span>
                <button
                  onClick={() => setShotCount(Math.min(4, shotCount + 1))}
                  className="w-6 h-6 rounded-md bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  {Icons.plus}
                </button>
              </div>
            </div>
          </div>

          {/* Frame Upload Boxes */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer group">
              <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                currentShot.startFrame
                  ? 'border-transparent'
                  : 'border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30'
              }`}>
                {currentShot.startFrame ? (
                  <img src={currentShot.startFrame} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <span className="text-gray-500">{Icons.plus}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium mt-1">START</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium">FRAME</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setStartFrame(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </label>

            <label className="cursor-pointer group">
              <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                currentShot.endFrame
                  ? 'border-transparent'
                  : 'border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30'
              }`}>
                {currentShot.endFrame ? (
                  <img src={currentShot.endFrame} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <span className="text-gray-500">{Icons.plus}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium mt-1">END</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium">FRAME</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setEndFrame(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </label>

            {/* Reference Image - for face/character consistency */}
            <label className="cursor-pointer group">
              <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                referenceImage
                  ? 'border-purple-500 border-solid'
                  : 'border-gray-600 hover:border-purple-400 group-hover:bg-purple-900/10'
              }`}>
                {referenceImage ? (
                  <div className="relative w-full h-full">
                    <img src={referenceImage} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={(e) => { e.preventDefault(); setReferenceImage(null); }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-purple-400">{Icons.plus}</span>
                    <span className="text-[9px] text-purple-400 uppercase font-medium mt-1">REF</span>
                    <span className="text-[9px] text-purple-400 uppercase font-medium">FACE</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={refInputRef} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setReferenceImage(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
          </div>

          {/* Camera Settings Button - Click to open panel, has ON/OFF toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCameraPanel(true)}
              className={`h-16 px-4 rounded-xl flex items-center gap-3 transition-all ${
                includeCameraSettings
                  ? 'bg-[#2a2a2a] hover:bg-gray-700'
                  : 'bg-[#1a1a1a] opacity-50 hover:opacity-70'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                includeCameraSettings ? 'bg-gray-700' : 'bg-gray-800'
              }`}>
                {Icons.camera}
              </div>
              <div className="text-left">
                <div className={`text-xs font-medium ${includeCameraSettings ? 'text-white' : 'text-gray-500'}`}>
                  {cameras[cameraIndex]?.name || 'Camera'}
                </div>
                <div className="text-[10px] text-gray-500">
                  {includeCameraSettings ? `${focalLengths[focalIndex]}mm, ${apertures[apertureIndex]}` : 'OFF - not in prompt'}
                </div>
              </div>
            </button>
            {/* ON/OFF Toggle */}
            <button
              onClick={() => setIncludeCameraSettings(!includeCameraSettings)}
              className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                includeCameraSettings
                  ? 'bg-green-600 text-white hover:bg-green-500'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title={includeCameraSettings ? 'Camera settings ON - click to disable' : 'Camera settings OFF - click to enable'}
            >
              {includeCameraSettings ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Generate Button - Bright Yellow */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`h-16 px-8 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              isGenerating
                ? 'bg-gray-700 text-gray-400'
                : 'bg-[#e8ff00] text-black hover:bg-[#f0ff4d] shadow-lg shadow-[#e8ff00]/20'
            }`}
          >
            {isGenerating ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'image' ? 'GENERATE IMAGE' : 'GENERATE VIDEO'}</span>
                <span className="opacity-60 flex items-center gap-1">{Icons.sparkle} {mode === 'image' ? 3 : cost}</span>
              </>
            )}
          </button>

          {/* Next Shot Button - shows when video complete or shots exist */}
          {(currentShot.videoUrl || shots.length > 0) && !isGenerating && (
            <button
              onClick={() => {
                if (currentShot.videoUrl) {
                  setChainPrompt(true);
                } else if (shots.length > 0) {
                  const lastShot = shots[shots.length - 1];
                  if (lastShot.startFrame) {
                    setStartFrame(lastShot.startFrame);
                    setMode('image');
                    setPreviousPrompt(promptText || lastShot.motionPrompt);
                    setPromptText('');
                  }
                }
              }}
              className="h-16 px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-[#2a2a2a] text-white hover:bg-gray-700 border border-gray-700"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span>NEXT SHOT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
