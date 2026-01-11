import { useState, useRef, useEffect } from 'react';
import { useCinemaStore, detectBestModel, explainModelSelection, type VideoModel } from './cinemaStore';
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
  generateDirectorSuggestion,
  generateEditPrompt,
  type DirectorShotPreset,
} from './cameraPresets';
import { validatePrompt, LIGHTING_SOURCES } from './promptBuilder';
import {
  validateVideoPrompt,
  buildVideoPrompt,
  buildObjectMotion,
  selectVideoModel,
  buildSeedanceDialoguePrompt,
  CAMERA_MOVEMENTS,
  SUBJECT_MOTIONS,
  BACKGROUND_MOTIONS,
  NATURAL_ELEMENTS,
  FALLING_OBJECTS,
  VEHICLES,
  MECHANICAL,
  LIGHT_EFFECTS,
  WEATHER,
  VIDEO_TEMPLATES,
  MOTION_ENDPOINTS,
  type VideoModel as VideoModelType,
} from './videoPromptBuilder';

// Multi-Angle Studio Components
import Camera3DControl from './Camera3DControl';
import BatchGenerator from './BatchGenerator';
import MovieShotsBrowser, { type MovieShot, type UserAsset } from './MovieShotsBrowser';
import { buildQwenPromptContinuous, type BatchAngle } from './promptVocabulary';

// AI Prompt Assistant
import type { AIPromptContext } from './aiPromptSystem';

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

// Sequence Planning Types (local, for AI-generated sequences)
interface AIPlannedShot {
  shotNumber: number;
  shotType: string;
  cameraMovement: string;
  subjectAction: string;
  prompt: string;
  motionPrompt?: string;
  status: 'pending' | 'generating-image' | 'generating-video' | 'completed' | 'needs-ref' | 'error';
  imageUrl?: string;
  videoUrl?: string;
  error?: string;
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
    characterDNA,
    setCharacterDNA,
    sequencePlan,
    isAutoChaining,
    currentSequenceIndex,
    addPlannedShot,
    updatePlannedShot,
    removePlannedShot,
    clearSequencePlan,
    setAutoChaining,
    setCurrentSequenceIndex,
    markPlannedShotComplete,
  } = useCinemaStore();

  const [promptText, setPromptText] = useState('');
  const [promptWarnings, setPromptWarnings] = useState<string[]>([]); // Nano Banana prompting warnings
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
  const [showCharacterDNA, setShowCharacterDNA] = useState(false); // Character DNA panel for shot chaining
  const [showSequencePlanner, setShowSequencePlanner] = useState(false); // Sequence Planner panel
  const [showVideoMotion, setShowVideoMotion] = useState(false); // Video prompt builder panel
  const [cameraPanelTab, setCameraPanelTab] = useState<'all' | 'recommended'>('all');

  // Multi-Angle Studio State
  const [show3DCamera, setShow3DCamera] = useState(false); // 3D Camera Control panel
  const [showBatchGenerator, setShowBatchGenerator] = useState(false); // Batch angle generator
  const [showMovieShots, setShowMovieShots] = useState(false); // Movie Shots browser
  const [showContinueFromVideo, setShowContinueFromVideo] = useState(false); // Continue from Video workflow
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]); // User's custom character/item assets
  const [selectedAssetForSwap, setSelectedAssetForSwap] = useState<UserAsset | null>(null); // Asset to swap into prompts

  // Continue from Video State
  const [continueVideoUrl, setContinueVideoUrl] = useState(''); // Source video URL
  const [continueExtractedFrame, setContinueExtractedFrame] = useState<string | null>(null); // Extracted last frame
  const [continueCloseupUrl, setContinueCloseupUrl] = useState<string | null>(null); // Generated close-up
  const [continueDialogue, setContinueDialogue] = useState(''); // Dialogue text for Seedance
  const [continueDialogueVideoUrl, setContinueDialogueVideoUrl] = useState<string | null>(null); // Generated dialogue video
  const [continueStep, setContinueStep] = useState<1 | 2 | 3 | 4>(1); // Current workflow step
  const [continueLoading, setContinueLoading] = useState(false); // Loading state
  const [continueError, setContinueError] = useState<string | null>(null); // Error message
  const [continueLocalFileName, setContinueLocalFileName] = useState<string | null>(null); // Local file name for display
  const continueVideoInputRef = useRef<HTMLInputElement>(null); // File input ref
  const [cameraAzimuth, setCameraAzimuth] = useState(0); // 3D camera azimuth (0-360)
  const [cameraElevation, setCameraElevation] = useState(0); // 3D camera elevation (-30 to 60)
  const [cameraDistance, setCameraDistance] = useState(1.0); // 3D camera distance (0.6-1.8)

  // AI Chat Assistant State
  const [showAIPrompt, setShowAIPrompt] = useState(false); // AI Chat panel
  const [aiInput, setAiInput] = useState(''); // User's message
  const [aiGenerating, setAiGenerating] = useState(false); // Loading state
  const [aiError, setAiError] = useState<string | null>(null); // Error message
  const [ollamaStatus, setOllamaStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [aiSessionId] = useState(() => `cinema-${Date.now()}`); // Unique session ID
  const aiChatRef = useRef<HTMLDivElement>(null); // For auto-scroll
  const [aiMode, setAiMode] = useState<'quick' | 'chat'>('quick'); // Toggle between quick prompt and chat mode
  const [aiCopiedIndex, setAiCopiedIndex] = useState<number | null>(null); // Track which message was copied
  const [aiRefImages, setAiRefImages] = useState<Array<{ url: string; description: string | null }>>([]);  // Up to 7 ref images
  const [aiRefLoading, setAiRefLoading] = useState<number | null>(null); // Which image is being analyzed
  const aiRefInputRef = useRef<HTMLInputElement>(null);

  // Sequence Planning & Auto-Execute State (characterDNA comes from store)
  const [plannedSequence, setPlannedSequence] = useState<AIPlannedShot[]>([]);
  const [sequenceExecuting, setSequenceExecuting] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0); // Which shot is being processed
  const [sequenceNeedsRef, setSequenceNeedsRef] = useState(false); // Pause if ref needed

  // Video Prompt Builder State
  const [videoCameraMovement, setVideoCameraMovement] = useState<string | null>(null);
  const [videoSubjectMotion, setVideoSubjectMotion] = useState<string | null>(null);
  const [videoBackgroundMotion, setVideoBackgroundMotion] = useState<string | null>(null);
  const [videoObjectMotion, setVideoObjectMotion] = useState<string | null>(null);
  const [videoPromptWarnings, setVideoPromptWarnings] = useState<string[]>([]);
  const [showVideoPromptPreview, setShowVideoPromptPreview] = useState(false);
  const [videoMotionTab, setVideoMotionTab] = useState<'camera' | 'subject' | 'background' | 'objects' | 'templates' | 'dialogue'>('camera');
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

  // Build VIDEO motion prompt from selections (motion only, no scene description!)
  const buildVideoMotionPrompt = () => {
    const parts: string[] = [];

    // Camera movement
    if (videoCameraMovement) {
      const movement = CAMERA_MOVEMENTS[videoCameraMovement as keyof typeof CAMERA_MOVEMENTS] || videoCameraMovement;
      parts.push(movement);
    }

    // Subject motion
    if (videoSubjectMotion) {
      const motion = SUBJECT_MOTIONS[videoSubjectMotion as keyof typeof SUBJECT_MOTIONS] || videoSubjectMotion;
      parts.push(motion);
    }

    // Background motion
    if (videoBackgroundMotion) {
      const bgMotion = BACKGROUND_MOTIONS[videoBackgroundMotion as keyof typeof BACKGROUND_MOTIONS] || videoBackgroundMotion;
      parts.push(bgMotion);
    }

    // Object motion
    if (videoObjectMotion) {
      parts.push(videoObjectMotion);
    }

    // If no selections but has prompt text, use that
    if (parts.length === 0 && promptText) {
      return promptText;
    }

    // Auto-add endpoint if needed
    const prompt = parts.join(', ');
    const hasEndpoint = MOTION_ENDPOINTS.some(e => prompt.toLowerCase().includes(e.replace('then ', '').replace('comes to ', '')));
    if (prompt && !hasEndpoint) {
      return prompt + ', then settles';
    }

    return prompt;
  };

  // Validate video prompt and update warnings
  useEffect(() => {
    if (mode === 'video') {
      const videoPrompt = buildVideoMotionPrompt() || promptText;
      if (videoPrompt) {
        const validation = validateVideoPrompt(videoPrompt);
        setVideoPromptWarnings(validation.warnings);
      } else {
        setVideoPromptWarnings([]);
      }
    }
  }, [mode, videoCameraMovement, videoSubjectMotion, videoBackgroundMotion, videoObjectMotion, promptText]);

  // Auto-update motion prompt when 3D camera moves (only when 3D panel is open)
  useEffect(() => {
    if (show3DCamera && mode === 'video') {
      const qwenPrompt = buildQwenPromptContinuous(cameraAzimuth, cameraElevation, cameraDistance);
      setMotionPrompt(qwenPrompt);
    }
  }, [cameraAzimuth, cameraElevation, cameraDistance, show3DCamera]);

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
      console.error('Compression failed:', err);
      // DON'T silently fallback - that sends 20MB to Kling which fails!
      throw new Error('Image compression failed. Cannot send to Kling without compressing first.');
    }
  };

  // ============================================
  // AI PROMPT ASSISTANT FUNCTION
  // ============================================
  const handleAIGenerate = async () => {
    if (!aiInput.trim()) {
      setAiError('Please enter a description');
      return;
    }

    setAiGenerating(true);
    setAiError(null);

    try {
      const context: AIPromptContext = {
        mode: mode,
        model: currentShot.model,
        aspectRatio: aspectRatio,
        resolution: resolution,
        characterDNA: characterDNA,
        isSequenceContinuation: sequencePlan.length > 0,
        currentPrompt: mode === 'image' ? promptText : currentShot.motionPrompt
      };

      const response = await fetch('/api/ai/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: aiInput,
          context: context,
          model: 'mistral'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'AI generation failed');
      }

      // Put the generated prompt into the appropriate field
      if (mode === 'image') {
        setPromptText(data.prompt);
      } else {
        setMotionPrompt(data.prompt);
      }

      // Clear input and close panel
      setAiInput('');
      setShowAIPrompt(false);

    } catch (err) {
      console.error('AI prompt error:', err);
      setAiError(err instanceof Error ? err.message : 'Failed to generate prompt');
    } finally {
      setAiGenerating(false);
    }
  };

  // Check Ollama status when AI panel opens
  const checkOllamaStatus = async () => {
    try {
      const response = await fetch('/api/ai/prompt', { method: 'GET' });
      const data = await response.json();
      setOllamaStatus(data.status === 'ok' ? 'ok' : 'error');
    } catch {
      setOllamaStatus('error');
    }
  };

  // ============================================
  // AI CHAT FUNCTION (with memory - uses Qwen3)
  // ============================================
  const handleAIChat = async () => {
    if (!aiInput.trim()) {
      setAiError('Please enter a message');
      return;
    }

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiGenerating(true);
    setAiError(null);

    // Add user message to history immediately
    setAiChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    // Auto-scroll
    setTimeout(() => {
      if (aiChatRef.current) {
        aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
      }
    }, 100);

    try {
      // Always include current session context (prompt, image, settings, ref images)
      const sessionContext = buildChatContext();
      const messageWithContext = sessionContext
        ? `${userMessage}\n${sessionContext}`
        : userMessage;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageWithContext,
          sessionId: aiSessionId,
          model: 'qwen3:8b'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Chat failed');
      }

      // Add assistant response to history
      setAiChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);

      // Auto-scroll
      setTimeout(() => {
        if (aiChatRef.current) {
          aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
        }
      }, 100);

    } catch (err) {
      console.error('AI chat error:', err);
      setAiError(err instanceof Error ? err.message : 'Chat failed');
      // Remove the user message if there was an error
      setAiChatHistory(prev => prev.slice(0, -1));
    } finally {
      setAiGenerating(false);
    }
  };

  // Use prompt from chat (copy to prompt field) - keeps chat open so you can see it
  const usePromptFromChat = (content: string, index: number) => {
    // Always set promptText so it shows in the textarea
    setPromptText(content);
    // Also set motion prompt for video mode
    if (mode === 'video') {
      setMotionPrompt(content);
    }
    // Show "Copied!" feedback
    setAiCopiedIndex(index);
    setTimeout(() => setAiCopiedIndex(null), 2000);
  };

  // Clear chat history
  const clearAIChatHistory = async () => {
    setAiChatHistory([]);
    setAiRefImages([]); // Also clear ref images
    try {
      await fetch(`/api/ai/chat?sessionId=${aiSessionId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear chat history:', err);
    }
  };

  // Add reference image to AI chat
  const handleAiRefImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limit
    if (aiRefImages.length >= 7) {
      setAiError('Maximum 7 reference images allowed');
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      // Add image with null description (will be analyzed)
      const newIndex = aiRefImages.length;
      setAiRefImages(prev => [...prev, { url: dataUrl, description: null }]);
      setAiRefLoading(newIndex);

      try {
        // Call Vision Agent to get description
        const response = await fetch('/api/cinema/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: dataUrl,
            prompt: 'Describe this image in detail for a cinematographer. Include: subject, composition, lighting, colors, mood, camera angle, and any notable visual elements.'
          })
        });

        if (response.ok) {
          const data = await response.json();
          // Update the image with its description
          setAiRefImages(prev => prev.map((img, i) =>
            i === newIndex ? { ...img, description: data.description || 'Image uploaded' } : img
          ));
        } else {
          // Just mark as uploaded without description
          setAiRefImages(prev => prev.map((img, i) =>
            i === newIndex ? { ...img, description: 'Reference image ' + (newIndex + 1) } : img
          ));
        }
      } catch (err) {
        console.error('Vision analysis failed:', err);
        setAiRefImages(prev => prev.map((img, i) =>
          i === newIndex ? { ...img, description: 'Reference image ' + (newIndex + 1) } : img
        ));
      } finally {
        setAiRefLoading(null);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // Remove reference image
  const removeAiRefImage = (index: number) => {
    setAiRefImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload local image to Catbox and return public URL
  const uploadLocalImageToCatbox = async (localPath: string): Promise<string | null> => {
    try {
      // Fetch the local image
      const response = await fetch(localPath);
      if (!response.ok) return null;

      const blob = await response.blob();

      // Upload to Catbox
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', blob, 'movie-shot.jpg');

      const uploadResponse = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
      });

      const url = await uploadResponse.text();
      if (url && url.startsWith('https://')) {
        return url.trim();
      }
      return null;
    } catch (err) {
      console.error('Failed to upload movie shot to Catbox:', err);
      return null;
    }
  };

  // Handle selecting multiple movie shots as references
  const handleSelectMovieShots = async (shots: Array<{ shot: MovieShot; imageUrl: string }>) => {
    if (shots.length === 0) return;

    // Close the panel immediately for better UX
    setShowMovieShots(false);

    // Show uploading status
    setIsGenerating(true);
    setProgress(0);
    setStatusMessage('Uploading movie shot references...');

    try {
      // First shot becomes the main reference - upload to Catbox
      const primaryShot = shots[0];
      setProgress(10);

      const primaryUrl = await uploadLocalImageToCatbox(primaryShot.imageUrl);
      if (!primaryUrl) {
        throw new Error('Failed to upload primary shot');
      }

      setReferenceImage(primaryUrl);
      setStartFrame(primaryUrl);
      setProgress(40);

      // Additional shots (2-7) become AI reference images - upload each
      if (shots.length > 1) {
        const additionalRefs: Array<{ url: string; description: string }> = [];

        for (let i = 1; i < shots.length; i++) {
          setProgress(40 + (i / shots.length) * 50);
          setStatusMessage(`Uploading reference ${i + 1}/${shots.length}...`);

          const url = await uploadLocalImageToCatbox(shots[i].imageUrl);
          if (url) {
            additionalRefs.push({
              url,
              description: shots[i].shot.prompt
            });
          }
        }

        if (additionalRefs.length > 0) {
          setAiRefImages(prev => {
            // Merge with existing, up to 7 total
            const combined = [...prev, ...additionalRefs];
            return combined.slice(0, 7);
          });
        }
      }

      // Build prompt from primary shot with character swap instructions
      let finalPrompt = primaryShot.shot.prompt || '';

      // Priority: Asset > Character DNA > Reference Image
      if (selectedAssetForSwap && finalPrompt) {
        // User has specific asset selected for swap
        finalPrompt = `USE MY CHARACTER REFERENCE: ${selectedAssetForSwap.description}. Replace any person/character in this shot with my character from the reference image. ${finalPrompt}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`;
      } else if (characterDNA && finalPrompt) {
        // Character DNA defined - use it for swap
        finalPrompt = `USE MY CHARACTER REFERENCE: ${characterDNA}. Replace any person/character in this shot with my character from the reference image. ${finalPrompt}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`;
      } else if (referenceImage && finalPrompt) {
        // Just a reference image without DNA - still instruct to use it
        finalPrompt = `USE CHARACTER FROM REFERENCE IMAGE: Replace any person/character in this shot with the character shown in my reference image. Maintain exact appearance, clothing, features. ${finalPrompt}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`;
      }

      if (finalPrompt) {
        setPromptText(finalPrompt);
      }

      // Apply 3D camera from primary shot if available
      if (primaryShot.shot.camera3d) {
        setCameraAzimuth(primaryShot.shot.camera3d.azimuth || 0);
        setCameraElevation(primaryShot.shot.camera3d.elevation || 0);
        setCameraDistance(primaryShot.shot.camera3d.distance || 1.0);
      }

      // Apply director style if matches our presets
      const directorMap: Record<string, number> = {
        'stanley-kubrick': 0,
        'steven-spielberg': 1,
        'quentin-tarantino': 2,
        'david-fincher': 3,
        'christopher-nolan': 4,
        'denis-villeneuve': 5,
        'wes-anderson': 6,
        'terrence-malick': 10,
      };
      if (primaryShot.shot.director && directorMap[primaryShot.shot.director] !== undefined) {
        setDirectorIndex(directorMap[primaryShot.shot.director]);
      }

      // Apply emotion if available
      const emotionMap: Record<string, number> = {
        'awe': 0, 'melancholy': 1, 'tense': 2, 'love': 3, 'fear': 4, 'loneliness': 5,
        'mysterious': 6, 'hope': 7, 'sadness': 8, 'contemplative': 9, 'peaceful': 10,
      };
      if (primaryShot.shot.emotion && emotionMap[primaryShot.shot.emotion] !== undefined) {
        setEmotionIndex(emotionMap[primaryShot.shot.emotion]);
      }

      setStatusMessage('Movie shot references ready!');
      setProgress(100);
    } catch (err) {
      console.error('Failed to process movie shots:', err);
      setStatusMessage('Failed to upload movie shots');
    } finally {
      // Clear status after a short delay
      setTimeout(() => {
        setIsGenerating(false);
        setStatusMessage(null);
        setProgress(0);
      }, 1500);
    }
  };

  // Asset management handlers
  const handleAddAsset = (asset: UserAsset) => {
    setUserAssets(prev => [...prev, asset]);
    // Persist to localStorage
    localStorage.setItem('cinema-user-assets', JSON.stringify([...userAssets, asset]));
  };

  const handleRemoveAsset = (assetId: string) => {
    setUserAssets(prev => {
      const updated = prev.filter(a => a.id !== assetId);
      localStorage.setItem('cinema-user-assets', JSON.stringify(updated));
      return updated;
    });
    // Clear selection if removed asset was selected
    if (selectedAssetForSwap?.id === assetId) {
      setSelectedAssetForSwap(null);
    }
  };

  // Load assets from localStorage on mount
  useEffect(() => {
    const savedAssets = localStorage.getItem('cinema-user-assets');
    if (savedAssets) {
      try {
        setUserAssets(JSON.parse(savedAssets));
      } catch (e) {
        console.error('Failed to load saved assets:', e);
      }
    }
  }, []);

  // ============================================
  // SHOT PLAN PARSING & AUTO-EXECUTE
  // ============================================

  // Detect if a message contains a shot sequence plan
  const detectShotPlan = (content: string): boolean => {
    // Look for patterns like "SHOT 1:", "Shot 1 (WIDE):", "1. ESTABLISHING:", etc.
    const patterns = [
      /SHOT\s*\d+\s*[:\(]/i,
      /Shot\s*\d+\s*[:\(]/i,
      /^\d+\.\s*(WIDE|MEDIUM|CLOSE|ESTABLISHING|ECU|POV)/im,
      /\(ESTABLISHING\)|\(WIDE\)|\(MEDIUM\)|\(CLOSE-UP\)|\(ECU\)/i
    ];
    return patterns.some(p => p.test(content));
  };

  // Parse Qwen's shot plan into structured data
  const parseShotPlan = (content: string): AIPlannedShot[] => {
    const shots: AIPlannedShot[] = [];

    // Split by shot markers
    const shotBlocks = content.split(/(?=SHOT\s*\d+|Shot\s*\d+|^\d+\.\s*\()/im).filter(Boolean);

    for (const block of shotBlocks) {
      // Extract shot number
      const numMatch = block.match(/(?:SHOT|Shot)\s*(\d+)|^(\d+)\./i);
      if (!numMatch) continue;
      const shotNumber = parseInt(numMatch[1] || numMatch[2]);

      // Extract shot type (WIDE, MEDIUM, CLOSE-UP, etc.)
      const typeMatch = block.match(/\((ESTABLISHING|WIDE|MEDIUM|CLOSE-UP|CLOSE|ECU|POV|FULL|MASTER)\)/i);
      const shotType = typeMatch ? typeMatch[1].toUpperCase() : 'MEDIUM';

      // Extract camera movement
      const camMatch = block.match(/(?:camera|movement|motion)[:\s]+([^,\n]+)/i);
      const cameraMovement = camMatch ? camMatch[1].trim() : 'static';

      // Extract subject action
      const actionMatch = block.match(/(?:subject|action|actor)[:\s]+([^,\n]+)/i);
      const subjectAction = actionMatch ? actionMatch[1].trim() : '';

      // The full prompt is everything after the shot header, cleaned up
      let prompt = block
        .replace(/^(?:SHOT|Shot)\s*\d+\s*[:\(]?[^:]*[:\)]?\s*/i, '')
        .replace(/^\d+\.\s*\([^)]*\)\s*/i, '')
        .trim();

      // Extract motion prompt if present
      const motionMatch = prompt.match(/(?:VIDEO|MOTION)[:\s]+([^\n]+)/i);
      const motionPrompt = motionMatch ? motionMatch[1].trim() : undefined;

      // Clean the image prompt (remove video/motion line)
      if (motionMatch) {
        prompt = prompt.replace(/(?:VIDEO|MOTION)[:\s]+[^\n]+/i, '').trim();
      }

      shots.push({
        shotNumber,
        shotType,
        cameraMovement,
        subjectAction,
        prompt,
        motionPrompt,
        status: 'pending'
      });
    }

    return shots;
  };

  // Load a shot plan from chat into the sequence planner
  const loadShotPlan = (content: string) => {
    const parsed = parseShotPlan(content);
    if (parsed.length > 0) {
      setPlannedSequence(parsed);
      setSequenceProgress(0);
      setSequenceExecuting(false);
      setSequenceNeedsRef(false);
    }
  };

  // Execute the entire shot sequence automatically
  const executeSequence = async () => {
    if (plannedSequence.length === 0) return;

    setSequenceExecuting(true);
    setSequenceNeedsRef(false);

    // Check if we need a reference image for the first shot
    if (!currentShot.startFrame && !referenceImage) {
      setSequenceNeedsRef(true);
      setSequenceExecuting(false);
      return;
    }

    let lastFrame = currentShot.startFrame || referenceImage || '';
    const COLOR_LOCK = 'THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.';

    for (let i = 0; i < plannedSequence.length; i++) {
      setSequenceProgress(i);
      const shot = plannedSequence[i];

      try {
        // Update shot status
        setPlannedSequence(prev => prev.map((s, idx) =>
          idx === i ? { ...s, status: 'generating-image' } : s
        ));

        // Build image prompt with color lock and character DNA
        let imagePrompt = shot.prompt;
        const dna = characterDNA || '';
        if (i > 0) {
          // Add color lock phrases for consistency after first shot
          imagePrompt = `${COLOR_LOCK} ${shot.shotType} shot. ${dna ? dna + '. ' : ''}${shot.prompt}`;
        } else if (dna) {
          imagePrompt = `${dna}. ${shot.prompt}`;
        }

        // Generate image
        const imageResponse = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image',
            prompt: imagePrompt,
            aspect_ratio: aspectRatio,
            resolution: resolution,
            reference_image: lastFrame
          })
        });

        const imageData = await imageResponse.json();
        if (!imageData.image_url) throw new Error('Image generation failed');

        // Update shot with image
        setPlannedSequence(prev => prev.map((s, idx) =>
          idx === i ? { ...s, imageUrl: imageData.image_url, status: 'generating-video' } : s
        ));

        // Compress for video
        const compressed = await compressForKling(imageData.image_url);

        // Generate video
        const videoPrompt = shot.motionPrompt || `${shot.cameraMovement}, ${shot.subjectAction}, then settles`;
        const selectedModel = autoSelectModel();

        const videoResponse = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: selectedModel === 'kling-o1' ? 'video-kling-o1' :
                  selectedModel === 'seedance-1.5' ? 'video-seedance' : 'video-kling',
            prompt: videoPrompt,
            [selectedModel === 'kling-o1' ? 'start_image_url' : 'image_url']: compressed,
            duration: String(currentShot.duration),
            aspect_ratio: aspectRatio
          })
        });

        const videoData = await videoResponse.json();
        if (!videoData.video_url) throw new Error('Video generation failed');

        // Update shot with video
        setPlannedSequence(prev => prev.map((s, idx) =>
          idx === i ? { ...s, videoUrl: videoData.video_url, status: 'completed' } : s
        ));

        // Extract last frame for next shot
        const extractedFrame = await extractLastFrame(videoData.video_url);
        if (extractedFrame) {
          lastFrame = extractedFrame;
        }

        // Small delay between shots
        await new Promise(r => setTimeout(r, 500));

      } catch (err) {
        console.error(`Shot ${i + 1} failed:`, err);
        setPlannedSequence(prev => prev.map((s, idx) =>
          idx === i ? { ...s, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } : s
        ));
        // Continue to next shot despite error
      }
    }

    setSequenceExecuting(false);
    setSequenceProgress(plannedSequence.length);
  };

  // Resume sequence after adding reference
  const resumeSequenceWithRef = () => {
    if (sequenceNeedsRef && currentShot.startFrame) {
      setSequenceNeedsRef(false);
      executeSequence();
    }
  };

  // Clear the sequence
  const clearSequence = () => {
    setPlannedSequence([]);
    setSequenceProgress(0);
    setSequenceExecuting(false);
    setSequenceNeedsRef(false);
  };

  // Build context with current shot info, shot history, and reference images for chat
  const buildChatContext = (): string => {
    let context = '';

    // Always include current shot info if available
    if (currentShot.startFrame || promptText || currentShot.motionPrompt) {
      context += '\n\n=== CURRENT SHOT ===\n';

      if (currentShot.startFrame) {
        context += `HAS IMAGE: Yes\n`;
      }

      if (promptText) {
        context += `IMAGE PROMPT: "${promptText}"\n`;
      }

      if (currentShot.motionPrompt) {
        context += `MOTION PROMPT: "${currentShot.motionPrompt}"\n`;
      }

      if (currentShot.model) {
        context += `MODEL: ${currentShot.model}\n`;
      }

      context += `MODE: ${mode === 'image' ? 'Image' : 'Video'}\n`;
      context += `ASPECT: ${aspectRatio} | RES: ${resolution}\n`;

      if (characterDNA) {
        context += `CHARACTER DNA: ${characterDNA}\n`;
      }
    }

    // Include shot history for sequence planning
    if (shots.length > 0) {
      context += '\n=== SHOT HISTORY (for sequence planning) ===\n';
      shots.slice(-5).forEach((shot, i) => {
        context += `Shot ${i + 1}: ${shot.motionPrompt || 'No prompt'}\n`;
      });
      context += `Total shots: ${shots.length}\n`;
      context += '\nYou can plan the NEXT shot in the sequence. Use consistency phrases!\n';
    }

    // Include sequence plan if active
    if (sequencePlan.length > 0) {
      context += '\n=== PLANNED SEQUENCE ===\n';
      sequencePlan.forEach((planned, i) => {
        const status = i < currentSequenceIndex ? 'DONE' : i === currentSequenceIndex ? 'CURRENT' : 'PENDING';
        context += `[${status}] Shot ${i + 1}: ${planned.angle} - ${planned.action}\n`;
      });
    }

    // Add reference images if any
    if (aiRefImages.length > 0) {
      context += '\n=== REFERENCE IMAGES ===\n';
      aiRefImages.forEach((img, i) => {
        context += `[Ref ${i + 1}]: ${img.description || 'No description'}\n`;
      });
    }

    if (context) {
      context += '\n---\nYou can: modify prompts, plan sequences, suggest next shots, explain cinematography.\n';
    }

    return context;
  };

  // ============================================
  // MAIN GENERATE FUNCTION
  // ============================================
  const handleGenerate = async () => {
    // Clear director suggestion when generating
    setDirectorSuggestion(null);

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
        // Collect ALL reference images: startFrame/referenceImage + aiRefImages
        const allRefUrls: string[] = [];
        const primaryRef = currentShot.startFrame || referenceImage;
        if (primaryRef) allRefUrls.push(primaryRef);
        if (aiRefImages.length > 0) {
          allRefUrls.push(...aiRefImages.map(r => r.url));
        }

        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image',
            prompt: fullPrompt,
            aspect_ratio: aspectRatio,
            resolution: resolution,
            // Send all refs as array (primary ref + aiRefImages)
            image_urls: allRefUrls.length > 0 ? allRefUrls : undefined
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
  const [directorSuggestion, setDirectorSuggestion] = useState<string | null>(null);

  // Clear director suggestion when director changes
  useEffect(() => {
    setDirectorSuggestion(null);
  }, [directorIndex]);

  // Validate prompt for Nano Banana best practices (real-time warnings)
  useEffect(() => {
    if (promptText.length > 10) {
      const validation = validatePrompt(promptText);
      setPromptWarnings(validation.warnings);
    } else {
      setPromptWarnings([]);
    }
  }, [promptText]);

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

  // ============================================
  // CONTINUE FROM VIDEO WORKFLOW
  // ============================================

  // Step 1: Extract last frame from source video
  const continueStep1ExtractFrame = async () => {
    if (!continueVideoUrl) {
      setContinueError('Please enter a video URL');
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      const frameUrl = await extractLastFrame(continueVideoUrl);
      if (frameUrl) {
        setContinueExtractedFrame(frameUrl);
        setContinueStep(2);
      } else {
        setContinueError('Failed to extract frame from video');
      }
    } catch (err) {
      setContinueError('Error extracting frame: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setContinueLoading(false);
    }
  };

  // Step 2: Generate close-up for dialogue
  const continueStep2GenerateCloseup = async () => {
    if (!continueExtractedFrame) {
      setContinueError('No frame extracted');
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      // Generate close-up using /edit endpoint
      const editPrompt = `THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Cinematic close-up shot, face fills frame, shallow depth of field,
soft bokeh background, ready for dialogue, expressive eyes, natural skin texture.
Same costume, same lighting direction.`;

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'edit',
          image_urls: [continueExtractedFrame],
          prompt: editPrompt,
          aspect_ratio: '16:9',
          resolution: '2K'
        })
      });

      const data = await response.json();
      if (data.image_url) {
        setContinueCloseupUrl(data.image_url);
        setContinueStep(3);
      } else {
        setContinueError('Failed to generate close-up: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setContinueError('Error generating close-up: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setContinueLoading(false);
    }
  };

  // Step 3: Generate dialogue video with Seedance
  const continueStep3GenerateDialogue = async () => {
    if (!continueCloseupUrl || !continueDialogue.trim()) {
      setContinueError('Please enter the dialogue text');
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      // Build Seedance dialogue prompt
      const seedancePrompt = `Close-up on face, soft focus on eyes, natural expressions.
Slow push-in, focus locked on eyes, minimal shake.
Subject speaks warmly: "${continueDialogue}"
Cinematic UGC style, clean audio, natural room tone, then settles.`;

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video-seedance',
          image_url: continueCloseupUrl,
          prompt: seedancePrompt,
          duration: '5',
          aspect_ratio: '16:9'
        })
      });

      const data = await response.json();
      if (data.video_url) {
        setContinueDialogueVideoUrl(data.video_url);
        setContinueStep(4);
      } else {
        setContinueError('Failed to generate dialogue video: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setContinueError('Error generating dialogue: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setContinueLoading(false);
    }
  };

  // Step 4: Stitch videos together
  const continueStep4StitchVideos = async () => {
    if (!continueVideoUrl || !continueDialogueVideoUrl) {
      setContinueError('Missing videos to stitch');
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      const response = await fetch('/api/cinema/stitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videos: [continueVideoUrl, continueDialogueVideoUrl]
        })
      });

      const data = await response.json();
      if (data.video_url) {
        // Open result in new tab or add to shots
        window.open(data.video_url, '_blank');
        setShowContinueFromVideo(false);
        // Reset state
        setContinueVideoUrl('');
        setContinueExtractedFrame(null);
        setContinueCloseupUrl(null);
        setContinueDialogue('');
        setContinueDialogueVideoUrl(null);
        setContinueStep(1);
      } else {
        setContinueError('Failed to stitch videos: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setContinueError('Error stitching: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setContinueLoading(false);
    }
  };

  // Reset continue workflow
  const resetContinueWorkflow = () => {
    setContinueVideoUrl('');
    setContinueExtractedFrame(null);
    setContinueCloseupUrl(null);
    setContinueDialogue('');
    setContinueDialogueVideoUrl(null);
    setContinueStep(1);
    setContinueError(null);
    setContinueLoading(false);
    setContinueLocalFileName(null);
    if (continueVideoInputRef.current) {
      continueVideoInputRef.current.value = '';
    }
  };

  // Handle local video file upload
  const handleContinueLocalVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setContinueError('Please select a video file');
      return;
    }

    // Check file size (max 200MB for Catbox)
    if (file.size > 200 * 1024 * 1024) {
      setContinueError('Video file too large (max 200MB)');
      return;
    }

    setContinueLoading(true);
    setContinueError(null);
    setContinueLocalFileName(file.name);

    try {
      // Upload to Catbox
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', file);

      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
      });

      const url = await response.text();

      if (url && url.startsWith('https://')) {
        setContinueVideoUrl(url.trim());
        setContinueError(null);
      } else {
        setContinueError('Upload failed: ' + url);
        setContinueLocalFileName(null);
      }
    } catch (err) {
      setContinueError('Upload error: ' + (err instanceof Error ? err.message : 'Unknown'));
      setContinueLocalFileName(null);
    } finally {
      setContinueLoading(false);
    }
  };

  // Call Vision Agent to generate smart edit prompt
  const callVisionAgent = async (
    referenceImageUrl: string,
    previousPrompt: string,
    director: typeof DIRECTOR_PRESETS[0] | null,
    storyBeat: string,
    shotNumber: number,
    shotHistory: Array<{ prompt: string; startFrame?: string }> = []
  ): Promise<string | null> => {
    console.log('🎬 Calling Vision Agent...', {
      hasDirector: !!director,
      directorName: director?.name || 'NONE',
      storyBeat,
      shotNumber,
      historyLength: shotHistory.length
    });
    try {
      const response = await fetch('http://localhost:5678/webhook/vision-edit-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_image_url: referenceImageUrl,
          previous_prompt: previousPrompt,
          // Send full shot history for story context
          shot_history: shotHistory.map((shot, idx) => ({
            shot_number: idx + 1,
            prompt: shot.prompt,
            image_url: shot.startFrame
          })),
          // Send ALL director data so AI has full context
          director: director ? {
            // Basic info
            name: director.name,
            director: director.director,
            description: director.description,
            prompt: director.prompt,
            // Rules and behaviors
            rules: director.rules,
            sceneResponses: director.sceneResponses,
            avoidPrompts: director.avoidPrompts,
            // Shot library (signature shots)
            shotLibrary: director.shotLibrary,
            // Visual recommendations
            colorPalette: director.colorPalette,
            recommendedCamera: director.recommendedCamera,
            recommendedLens: director.recommendedLens,
            recommendedMovement: director.recommendedMovement,
            recommendedLighting: director.recommendedLighting,
            recommendedFraming: director.recommendedFraming,
            recommendedStyle: director.recommendedStyle,
            recommendedAtmosphere: director.recommendedAtmosphere,
            recommendedSetDesign: director.recommendedSetDesign,
            recommendedColorPalette: director.recommendedColorPalette,
            recommendedCharacterStyle: director.recommendedCharacterStyle
          } : null,
          story_beat: storyBeat,
          shot_number: shotNumber
        })
      });

      if (!response.ok) {
        console.warn('❌ Vision agent returned non-OK status:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('📥 Vision Agent Response:', data);
      if (data.success && data.edit_prompt) {
        console.log('✅ VISION AGENT SUCCESS!');
        console.log('🔍 Detected in image:', data.detected_in_image);
        console.log('📝 Changes from original:', data.changes_from_original);
        console.log('🎬 Director reasoning:', data.director_reasoning);
        return `🤖 ${data.edit_prompt}`; // Prefix to show it came from Vision Agent
      }
      console.warn('⚠️ Vision agent response missing data:', data);
      return null;
    } catch (err) {
      console.error('❌ Vision agent FAILED:', err);
      return null;
    }
  };

  // Chain current shot to next - pass generated image as reference for next IMAGE
  // NOTE: This is for CHAINING shots (sequential), NOT for start→end single videos
  const handleChainToNext = async () => {
    // SHOT CHAINING FIX: Use video's last frame for color consistency
    // The Golden Rule: Never generate from original base image.
    // Always chain from the LAST FRAME of the previous video.
    let previousGeneratedImage: string | null = null;

    if (currentShot.videoUrl) {
      // Extract last frame from video for color-consistent chaining
      const extractedFrame = await extractLastFrame(currentShot.videoUrl);
      previousGeneratedImage = extractedFrame || currentShot.startFrame;
    } else {
      // Fallback to startFrame if no video exists
      previousGeneratedImage = currentShot.startFrame;
    }

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

    // Get director for edit prompt generation
    const director = directorIndex !== null ? DIRECTOR_PRESETS[directorIndex] : null;
    const shotNum = shots.length + 1;

    // Detect story beat from previous prompt
    const promptLower = currentPromptText.toLowerCase();
    let storyBeat = 'journey';
    const beatKeywords: Record<string, string[]> = {
      danger: ['danger', 'threat', 'enemy', 'attack', 'chase', 'run'],
      emotion: ['cry', 'sad', 'happy', 'love', 'fear', 'angry'],
      confrontation: ['face', 'confront', 'argue', 'fight', 'stand'],
      calm: ['rest', 'peace', 'quiet', 'sit', 'think', 'look']
    };
    for (const [beat, keywords] of Object.entries(beatKeywords)) {
      if (keywords.some(k => promptLower.includes(k))) {
        storyBeat = beat;
        break;
      }
    }

    // Try Vision Agent first (GPT-4 Vision analyzes image)
    // Falls back to local generateEditPrompt if vision agent is unavailable
    let suggestion: string | null = null;

    if (previousGeneratedImage) {
      // Pass full shot history so AI knows the complete story progression
      // Map shots to the format expected by callVisionAgent
      const shotHistory = shots.map(s => ({
        prompt: s.motionPrompt,
        startFrame: s.startFrame || undefined
      }));
      suggestion = await callVisionAgent(
        previousGeneratedImage,
        currentPromptText,
        director,
        storyBeat,
        shotNum,
        shotHistory
      );
    }

    // Fallback to local function if vision agent failed
    if (!suggestion) {
      console.log('⚠️ Using LOCAL fallback (generateEditPrompt) - Vision Agent did not respond');
      suggestion = `📋 ${generateEditPrompt(director, currentPromptText, shotNum)}`; // Prefix to show fallback
    }

    setDirectorSuggestion(suggestion);
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
            {/* If playing a shot from timeline, show that video */}
            {playingShot && shots.find(s => s.id === playingShot)?.videoUrl ? (
              <video
                key={playingShot}
                src={shots.find(s => s.id === playingShot)?.videoUrl || undefined}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            ) : currentShot.videoUrl ? (
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

      {/* Character DNA Panel - for shot chaining consistency */}
      {showCharacterDNA && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowCharacterDNA(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-lg text-xs font-medium text-teal-300">Character DNA</span>
                <span className="text-xs text-gray-500">Consistent character for shot chaining</span>
              </div>
              <button onClick={() => setShowCharacterDNA(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-[#2a2a2a] rounded-xl p-4 mb-5 border border-gray-700/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-300 font-medium mb-1">Why Character DNA?</div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    When chaining multiple shots, AI can drift character features (face, clothing, colors).
                    Character DNA is your reusable description that stays constant across ALL shots.
                    Copy-paste this exact text into every prompt for consistent characters.
                  </div>
                </div>
              </div>
            </div>

            {/* Character DNA Input */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 block">Character Description (copy-paste this into all prompts)</label>
              <textarea
                value={characterDNA || ''}
                onChange={(e) => setCharacterDNA(e.target.value || null)}
                placeholder="Example: Asian man in his 40s, weathered face, salt-pepper stubble, worn tan flight suit with mission patches, determined eyes, short cropped black hair"
                className="w-full h-32 bg-[#252525] rounded-xl border border-gray-700/50 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 resize-none"
              />
            </div>

            {/* Template Examples */}
            <div className="mt-5 pt-5 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-3">Quick Templates (click to use)</div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Young woman, mid-20s, long dark hair, casual outfit, confident expression',
                  'Elderly man, white beard, weathered face, warm eyes, comfortable sweater',
                  'Child, about 8 years old, curious expression, colorful clothes, messy hair',
                  'Professional in suit, sharp features, glasses, serious demeanor'
                ].map((template, i) => (
                  <button
                    key={i}
                    onClick={() => setCharacterDNA(template)}
                    className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-[10px] text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {template.substring(0, 40)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Character from DNA */}
            {characterDNA && (
              <div className="mt-5 pt-5 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-3">Generate Character Image from DNA</div>
                <div className="flex gap-2">
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Wide)</option>
                    <option value="21:9">21:9 (Cinema)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (!characterDNA) return;
                      setShowCharacterDNA(false);
                      startGeneration();
                      setProgress(10);
                      setStatusMessage('Generating character from DNA...');

                      try {
                        const characterPrompt = `${characterDNA}. Character portrait, high quality, 4K, detailed, clean background, centered composition.`;
                        const response = await fetch('/api/cinema/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'image',
                            prompt: characterPrompt,
                            aspect_ratio: aspectRatio,
                            resolution: '4K'
                          })
                        });

                        setProgress(50);
                        const data = await response.json();

                        if (data.image_url) {
                          setProgress(100);
                          // Set as reference image for future shots
                          setReferenceImage(data.image_url);
                          setStartFrame(data.image_url);
                          setStatusMessage('Character generated! Set as reference.');
                          setTimeout(() => {
                            failGeneration('');
                            setStatusMessage(null);
                          }, 2000);
                        } else {
                          throw new Error(data.error || 'Generation failed');
                        }
                      } catch (err) {
                        failGeneration(err instanceof Error ? err.message : 'Unknown error');
                      }
                    }}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>Generate Character Image</>
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-gray-500 mt-2">
                  Creates a character image from your DNA description and sets it as the reference for all shots.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCharacterDNA(null)}
                className="px-4 py-2.5 bg-[#2a2a2a] hover:bg-gray-700 rounded-xl text-xs text-gray-400 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCharacterDNA(false)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-black rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Save Character DNA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sequence Planner Panel */}
      {showSequencePlanner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSequencePlanner(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg text-xs font-medium text-orange-300">Sequence Planner</span>
                <span className="text-xs text-gray-500">Plan multiple shots before generating</span>
              </div>
              <button onClick={() => setShowSequencePlanner(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            {/* Character DNA Reference */}
            {characterDNA && (
              <div className="bg-teal-950/30 border border-teal-700/50 rounded-xl p-3 mb-4">
                <div className="text-[9px] text-teal-400 uppercase mb-1 font-medium">Character DNA (applied to all shots)</div>
                <div className="text-xs text-teal-200">{characterDNA}</div>
              </div>
            )}

            {/* Shot List */}
            <div className="space-y-3 mb-5 max-h-[40vh] overflow-y-auto">
              {sequencePlan.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3 opacity-50">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 17.5h7M17.5 14v7" />
                  </svg>
                  <div className="text-sm">No shots planned yet</div>
                  <div className="text-xs mt-1">Add shots below to build your sequence</div>
                </div>
              ) : (
                sequencePlan.map((shot, idx) => (
                  <div
                    key={shot.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      shot.status === 'complete' ? 'bg-green-950/30 border-green-700/50' :
                      shot.status === 'generating' ? 'bg-orange-950/30 border-orange-700/50' :
                      'bg-[#2a2a2a] border-gray-700/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      shot.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                      shot.status === 'generating' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {shot.status === 'complete' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : shot.status === 'generating' ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-sm font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white">{shot.angle}</span>
                        <span className="text-[10px] text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{shot.cameraMove}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{shot.action}</div>
                    </div>
                    {shot.status === 'planned' && (
                      <button
                        onClick={() => removePlannedShot(shot.id)}
                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Shot Form */}
            <div className="bg-[#252525] rounded-xl p-4 border border-gray-700/50">
              <div className="text-xs text-gray-400 mb-3">Add New Shot</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Shot Type</label>
                  <select
                    id="seq-angle"
                    className="w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-2"
                    defaultValue=""
                  >
                    <option value="">Select...</option>
                    <option value="Wide shot">Wide shot</option>
                    <option value="Medium shot">Medium shot</option>
                    <option value="Closeup">Closeup</option>
                    <option value="Extreme closeup">Extreme closeup</option>
                    <option value="Over shoulder">Over shoulder</option>
                    <option value="Side profile">Side profile</option>
                    <option value="Low angle">Low angle</option>
                    <option value="High angle">High angle</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Camera Move</label>
                  <select
                    id="seq-camera"
                    className="w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-2"
                    defaultValue=""
                  >
                    <option value="">Select...</option>
                    <option value="static">Static</option>
                    <option value="dolly in">Dolly in</option>
                    <option value="dolly out">Dolly out</option>
                    <option value="orbit left">Orbit left</option>
                    <option value="orbit right">Orbit right</option>
                    <option value="pan left">Pan left</option>
                    <option value="pan right">Pan right</option>
                    <option value="push in">Push in</option>
                    <option value="steadicam follow">Steadicam follow</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Action/Description</label>
                  <input
                    id="seq-action"
                    type="text"
                    placeholder="e.g., character turns head"
                    className="w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-3"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const angleEl = document.getElementById('seq-angle') as HTMLSelectElement;
                  const cameraEl = document.getElementById('seq-camera') as HTMLSelectElement;
                  const actionEl = document.getElementById('seq-action') as HTMLInputElement;
                  if (angleEl.value && cameraEl.value && actionEl.value) {
                    addPlannedShot({
                      angle: angleEl.value,
                      cameraMove: cameraEl.value,
                      action: actionEl.value
                    });
                    angleEl.value = '';
                    cameraEl.value = '';
                    actionEl.value = '';
                  }
                }}
                className="mt-3 w-full h-9 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-xs font-semibold transition-colors"
              >
                + Add Shot to Sequence
              </button>
            </div>

            {/* Auto-Chain Toggle */}
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoChaining(!isAutoChaining)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isAutoChaining ? 'bg-orange-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isAutoChaining ? 'left-6' : 'left-0.5'}`} />
                </button>
                <div>
                  <div className="text-xs text-white font-medium">Auto-Chain Mode</div>
                  <div className="text-[10px] text-gray-500">Automatically generate next shot when current completes</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearSequencePlan}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowSequencePlanner(false)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Sequence ({sequencePlan.length} shots)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Camera Control Panel */}
      {show3DCamera && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShow3DCamera(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300">3D Camera Control</span>
                <span className="text-xs text-gray-500">Drag handles to set angle</span>
              </div>
              <button onClick={() => setShow3DCamera(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            <Camera3DControl
              azimuth={cameraAzimuth}
              setAzimuth={setCameraAzimuth}
              elevation={cameraElevation}
              setElevation={setCameraElevation}
              distance={cameraDistance}
              setDistance={setCameraDistance}
              subjectImage={currentShot.startFrame}
            />

            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-700">
              <button
                onClick={() => {
                  // Apply Qwen prompt to motion prompt
                  const qwenPrompt = buildQwenPromptContinuous(cameraAzimuth, cameraElevation, cameraDistance);
                  const currentPrompt = currentShot.motionPrompt;
                  setMotionPrompt(currentPrompt ? `${currentPrompt}, ${qwenPrompt}` : qwenPrompt);
                  setShow3DCamera(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Apply Angle to Prompt
              </button>
              <button
                onClick={() => setShow3DCamera(false)}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Generator Panel */}
      {showBatchGenerator && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowBatchGenerator(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300">Batch Generator</span>
                <span className="text-xs text-gray-500">Generate multiple angles at once</span>
              </div>
              <button onClick={() => setShowBatchGenerator(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            <BatchGenerator
              sourceImage={currentShot.startFrame}
              onBatchComplete={(results) => {
                console.log('Batch complete:', results);
                setShowBatchGenerator(false);
              }}
              onImageGenerated={(result) => {
                console.log('Image generated:', result);
              }}
              generateAngleImage={async (angle: BatchAngle, sourceImage: string) => {
                // This should call your image generation API with the angle
                const prompt = buildQwenPromptContinuous(angle.azimuth, angle.elevation, angle.distance);
                console.log('Generating image with angle:', angle, 'prompt:', prompt);
                // TODO: Implement actual API call
                // For now return a placeholder
                throw new Error('Batch generation API not implemented yet. Use the 3D Camera Control to set individual angles.');
              }}
            />
          </div>
        </div>
      )}

      {/* Movie Shots Browser Panel */}
      {showMovieShots && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowMovieShots(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-6xl w-full mx-4 h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <MovieShotsBrowser
              onSelectShots={handleSelectMovieShots}
              onClose={() => setShowMovieShots(false)}
              userAssets={userAssets}
              onAddAsset={handleAddAsset}
              onRemoveAsset={handleRemoveAsset}
              selectedAsset={selectedAssetForSwap}
              onSelectAsset={setSelectedAssetForSwap}
            />
          </div>
        </div>
      )}

      {/* Continue from Video Panel */}
      {showContinueFromVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowContinueFromVideo(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300">
                  🎬 Continue from Video
                </span>
                <span className="text-[10px] text-gray-500">Video → Extract → Close-up → Dialogue → Stitch</span>
              </div>
              <button onClick={() => setShowContinueFromVideo(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6 px-4">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    continueStep >= step
                      ? continueStep === step ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {continueStep > step ? '✓' : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-0.5 mx-1 ${continueStep > step ? 'bg-green-500' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Error Display */}
            {continueError && (
              <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
                {continueError}
              </div>
            )}

            {/* Step 1: Video URL Input */}
            {continueStep === 1 && (
              <div className="space-y-4">
                <div className="text-sm text-gray-300 mb-2">Step 1: Choose your video</div>

                {/* Local File Upload */}
                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase">Upload from computer</div>
                  <label className="block">
                    <input
                      ref={continueVideoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleContinueLocalVideoUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => continueVideoInputRef.current?.click()}
                      className={`w-full px-4 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center gap-3 ${
                        continueLocalFileName
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
                      }`}
                    >
                      {continueLoading && !continueVideoUrl ? (
                        <>
                          <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                          <span className="text-sm text-gray-400">Uploading {continueLocalFileName}...</span>
                        </>
                      ) : continueLocalFileName ? (
                        <>
                          <span className="text-green-400">✓</span>
                          <span className="text-sm text-gray-300">{continueLocalFileName}</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span className="text-sm text-gray-400">Click to select video file</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-700" />
                  <span className="text-xs text-gray-500">or paste URL</span>
                  <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  value={continueVideoUrl}
                  onChange={e => { setContinueVideoUrl(e.target.value); setContinueLocalFileName(null); }}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />

                <button
                  onClick={continueStep1ExtractFrame}
                  disabled={continueLoading || !continueVideoUrl}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {continueLoading && continueVideoUrl ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Extracting last frame...
                    </>
                  ) : (
                    <>📸 Extract Last Frame</>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Generate Close-up */}
            {continueStep === 2 && (
              <div className="space-y-4">
                <div className="text-sm text-gray-300 mb-2">Step 2: Generate dialogue-ready close-up</div>
                {continueExtractedFrame && (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Extracted Frame</div>
                      <img src={continueExtractedFrame} alt="Extracted" className="w-full h-32 object-cover rounded-lg border border-gray-700" />
                    </div>
                    <div className="flex-1 flex items-center justify-center text-4xl">→</div>
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Will Generate</div>
                      <div className="w-full h-32 bg-[#2a2a2a] rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">
                        Close-up shot
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setContinueStep(1)}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={continueStep2GenerateCloseup}
                    disabled={continueLoading}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {continueLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating close-up...
                      </>
                    ) : (
                      <>🎯 Generate Close-up</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Enter Dialogue */}
            {continueStep === 3 && (
              <div className="space-y-4">
                <div className="text-sm text-gray-300 mb-2">Step 3: Enter dialogue for character to speak</div>
                {continueCloseupUrl && (
                  <div className="mb-4">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">Generated Close-up</div>
                    <img src={continueCloseupUrl} alt="Close-up" className="w-48 h-28 object-cover rounded-lg border border-gray-700" />
                  </div>
                )}
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">What should they say?</div>
                  <textarea
                    value={continueDialogue}
                    onChange={e => setContinueDialogue(e.target.value)}
                    placeholder="Hello everyone! Welcome to my video. Today I'm going to show you something amazing..."
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setContinueStep(2)}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={continueStep3GenerateDialogue}
                    disabled={continueLoading || !continueDialogue.trim()}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {continueLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating with Seedance...
                      </>
                    ) : (
                      <>🗣️ Generate Dialogue (Seedance)</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Stitch Videos */}
            {continueStep === 4 && (
              <div className="space-y-4">
                <div className="text-sm text-gray-300 mb-2">Step 4: Stitch videos together</div>
                <div className="flex gap-4 items-center">
                  {continueDialogueVideoUrl && (
                    <>
                      <div className="flex-1">
                        <div className="text-[10px] text-gray-500 uppercase mb-1">Original Video</div>
                        <video src={continueVideoUrl} className="w-full h-24 object-cover rounded-lg border border-gray-700" muted />
                      </div>
                      <div className="text-2xl">+</div>
                      <div className="flex-1">
                        <div className="text-[10px] text-gray-500 uppercase mb-1">Dialogue Video</div>
                        <video src={continueDialogueVideoUrl} className="w-full h-24 object-cover rounded-lg border border-purple-500" muted controls />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setContinueStep(3)}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={continueStep4StitchVideos}
                    disabled={continueLoading}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {continueLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Stitching videos...
                      </>
                    ) : (
                      <>🎬 Stitch & Download</>
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={resetContinueWorkflow}
                    className="text-xs text-gray-500 hover:text-gray-300"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Prompt Assistant Panel */}
      {showAIPrompt && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAIPrompt(false)}>
          <div className={`bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl w-full mx-4 ${aiMode === 'chat' ? 'max-w-2xl h-[80vh] flex flex-col' : 'max-w-xl'}`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-xs font-medium text-yellow-300 flex items-center gap-1.5">
                  {Icons.sparkle}
                  AI Assistant
                </span>
                {/* Mode Toggle */}
                <div className="flex bg-[#2a2a2a] rounded-lg p-0.5">
                  <button
                    onClick={() => setAiMode('quick')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      aiMode === 'quick'
                        ? 'bg-yellow-500 text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Quick (Mistral)
                  </button>
                  <button
                    onClick={() => setAiMode('chat')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      aiMode === 'chat'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Chat (Qwen3)
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {aiMode === 'chat' && aiChatHistory.length > 0 && (
                  <button
                    onClick={clearAIChatHistory}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button onClick={() => setShowAIPrompt(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                  {Icons.close}
                </button>
              </div>
            </div>

            {/* Ollama Status */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                ollamaStatus === 'ok' ? 'bg-green-500' :
                ollamaStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-xs text-gray-400">
                {ollamaStatus === 'ok' ? `Ollama connected (${aiMode === 'chat' ? 'Qwen3' : 'Mistral'})` :
                 ollamaStatus === 'error' ? 'Ollama not running - start with: ollama serve' :
                 'Checking Ollama...'}
              </span>
              <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                mode === 'image'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {mode === 'image' ? 'Image' : 'Video'}
              </span>
            </div>

            {/* QUICK MODE */}
            {aiMode === 'quick' && (
              <>
                {/* Input */}
                <div className="mb-4">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder={mode === 'image'
                      ? "e.g., \"woman in cafe, lonely, Fincher style\" or \"epic battle, Nolan, IMAX\""
                      : "e.g., \"slow push in, eyes widen\" or \"orbit around, hair blows in wind\""
                    }
                    className="w-full h-24 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 resize-none"
                    disabled={aiGenerating}
                  />
                </div>

                {/* Error */}
                {aiError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    {aiError}
                  </div>
                )}

                {/* Examples */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Examples (click to try):</div>
                  <div className="flex flex-wrap gap-2">
                    {mode === 'image' ? (
                      <>
                        <button onClick={() => setAiInput('woman in cafe, lonely, Fincher style')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">lonely cafe, Fincher</button>
                        <button onClick={() => setAiInput('epic battle scene, Nolan, IMAX')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">epic battle, Nolan</button>
                        <button onClick={() => setAiInput('romantic scene, Wong Kar-wai, neon rain')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">romantic, Wong Kar-wai</button>
                        <button onClick={() => setAiInput('symmetrical hotel, Kubrick stare')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">hotel, Kubrick</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setAiInput('slow push in, subject turns head')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">push in + head turn</button>
                        <button onClick={() => setAiInput('orbit around, hair blows in wind')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">orbit + wind</button>
                        <button onClick={() => setAiInput('static shot, rain falls, eyes blink')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">static + rain</button>
                        <button onClick={() => setAiInput('dolly out reveal, smoke rises')} className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors">dolly out reveal</button>
                      </>
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerating || !aiInput.trim() || ollamaStatus === 'error'}
                  className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    aiGenerating || !aiInput.trim() || ollamaStatus === 'error'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
                  }`}
                >
                  {aiGenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Generating with Mistral...
                    </>
                  ) : (
                    <>
                      {Icons.sparkle}
                      Generate {mode === 'image' ? 'Image' : 'Motion'} Prompt
                    </>
                  )}
                </button>

                {/* Info */}
                <div className="mt-4 text-[10px] text-gray-500 text-center">
                  Quick mode: One-shot prompt generation with Mistral
                </div>
              </>
            )}

            {/* CHAT MODE */}
            {aiMode === 'chat' && (
              <>
                {/* Chat History */}
                <div ref={aiChatRef} className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0">
                  {aiChatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-lg mb-2">Chat with Qwen3</div>
                      <div className="text-xs">Ask about cinematography, get prompts, refine ideas...</div>
                      <div className="text-xs mt-1 text-purple-400">Memory is saved to disk!</div>
                    </div>
                  ) : (
                    aiChatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl p-3 ${
                            msg.role === 'user'
                              ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                              : 'bg-[#2a2a2a] border border-gray-700 text-gray-200'
                          }`}
                        >
                          <div className="text-xs opacity-50 mb-1">
                            {msg.role === 'user' ? 'You' : 'Qwen3'}
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          {msg.role === 'assistant' && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <button
                                onClick={() => usePromptFromChat(msg.content, idx)}
                                className={`px-2 py-1 rounded text-xs transition-colors ${
                                  aiCopiedIndex === idx
                                    ? 'bg-green-500/30 text-green-400'
                                    : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                                }`}
                              >
                                {aiCopiedIndex === idx ? 'Copied to Prompt!' : 'Use as Prompt'}
                              </button>
                              {/* Execute Plan button - shows only when shot plan is detected */}
                              {detectShotPlan(msg.content) && (
                                <button
                                  onClick={() => loadShotPlan(msg.content)}
                                  className="px-2 py-1 rounded text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors flex items-center gap-1"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    <path d="M9 12l2 2 4-4" />
                                  </svg>
                                  Load Plan ({parseShotPlan(msg.content).length} shots)
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {aiGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          <span className="text-xs">Qwen3 thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sequence Planner Panel */}
                {plannedSequence.length > 0 && (
                  <div className="mb-3 p-3 bg-[#1f1f1f] rounded-xl border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-cyan-400 font-medium">
                        Shot Sequence ({plannedSequence.filter(s => s.status === 'completed').length}/{plannedSequence.length} complete)
                      </span>
                      <div className="flex gap-2">
                        {!sequenceExecuting && !sequenceNeedsRef && (
                          <button
                            onClick={executeSequence}
                            className="px-2 py-1 rounded text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors flex items-center gap-1"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Execute All
                          </button>
                        )}
                        {sequenceExecuting && (
                          <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                            Generating...
                          </span>
                        )}
                        <button
                          onClick={clearSequence}
                          className="px-2 py-1 rounded text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Needs Reference Warning */}
                    {sequenceNeedsRef && (
                      <div className="mb-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-xs">
                        Add a reference image first! Upload a start frame or generate an image before executing.
                        <button
                          onClick={resumeSequenceWithRef}
                          disabled={!currentShot.startFrame}
                          className={`ml-2 px-2 py-0.5 rounded ${
                            currentShot.startFrame
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Resume
                        </button>
                      </div>
                    )}

                    {/* Character DNA Input */}
                    <div className="mb-2">
                      <input
                        type="text"
                        value={characterDNA || ''}
                        onChange={(e) => setCharacterDNA(e.target.value)}
                        placeholder="Character DNA (e.g., 'Asian man, 40s, tan flight suit')"
                        className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    {/* Shot List */}
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {plannedSequence.map((shot, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-1.5 rounded text-xs ${
                            shot.status === 'completed' ? 'bg-green-500/10 border border-green-500/30' :
                            shot.status === 'generating-image' || shot.status === 'generating-video' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                            shot.status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                            'bg-[#2a2a2a] border border-gray-700'
                          }`}
                        >
                          {/* Status Icon */}
                          <div className="w-4 h-4 flex items-center justify-center">
                            {shot.status === 'completed' ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-green-400">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : shot.status === 'generating-image' || shot.status === 'generating-video' ? (
                              <svg className="w-3 h-3 text-yellow-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
                              </svg>
                            ) : shot.status === 'error' ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-red-400">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            ) : (
                              <span className="text-gray-500">{shot.shotNumber}</span>
                            )}
                          </div>

                          {/* Shot Info */}
                          <div className="flex-1 truncate">
                            <span className="text-cyan-300 font-medium">{shot.shotType}</span>
                            <span className="text-gray-400 ml-1">- {shot.prompt.substring(0, 40)}...</span>
                          </div>

                          {/* Status Text */}
                          <span className={`text-[10px] ${
                            shot.status === 'generating-image' ? 'text-yellow-400' :
                            shot.status === 'generating-video' ? 'text-blue-400' :
                            shot.status === 'completed' ? 'text-green-400' :
                            shot.status === 'error' ? 'text-red-400' :
                            'text-gray-500'
                          }`}>
                            {shot.status === 'generating-image' ? 'Image...' :
                             shot.status === 'generating-video' ? 'Video...' :
                             shot.status === 'completed' ? 'Done' :
                             shot.status === 'error' ? 'Failed' :
                             'Pending'}
                          </span>

                          {/* Thumbnails */}
                          {shot.imageUrl && (
                            <img src={shot.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Images */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Reference Images ({aiRefImages.length}/7)</span>
                    {aiRefImages.length < 7 && (
                      <button
                        onClick={() => aiRefInputRef.current?.click()}
                        className="px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors flex items-center gap-1"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Image
                      </button>
                    )}
                    <input
                      ref={aiRefInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAiRefImageUpload}
                      className="hidden"
                    />
                  </div>
                  {aiRefImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {aiRefImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img.url}
                            alt={`Ref ${idx + 1}`}
                            className={`w-16 h-16 object-cover rounded-lg border ${
                              aiRefLoading === idx ? 'border-yellow-500 animate-pulse' : 'border-gray-700'
                            }`}
                          />
                          <div className="absolute -top-1 -left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                            {idx + 1}
                          </div>
                          <button
                            onClick={() => removeAiRefImage(idx)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                          {aiRefLoading === idx && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 animate-spin text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                              </svg>
                            </div>
                          )}
                          {img.description && !aiRefLoading && (
                            <div className="absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-1 overflow-hidden">
                              <div className="text-[8px] text-gray-300 line-clamp-4">{img.description}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error */}
                {aiError && (
                  <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    {aiError}
                  </div>
                )}

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAIChat();
                      }
                    }}
                    placeholder="Ask about cinematography, get prompts, refine ideas..."
                    className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    disabled={aiGenerating}
                  />
                  <button
                    onClick={handleAIChat}
                    disabled={aiGenerating || !aiInput.trim() || ollamaStatus === 'error'}
                    className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      aiGenerating || !aiInput.trim() || ollamaStatus === 'error'
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>

                {/* Info - show active context */}
                <div className="mt-3 text-[10px] text-gray-500 text-center">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span>Qwen3 sees:</span>
                    {promptText && <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">Prompt</span>}
                    {currentShot.startFrame && <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Image</span>}
                    {currentShot.motionPrompt && <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">Motion</span>}
                    {shots.length > 0 && <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">{shots.length} Shots</span>}
                    {sequencePlan.length > 0 && <span className="px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded">Sequence</span>}
                    {aiRefImages.length > 0 && <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">{aiRefImages.length} Refs</span>}
                    {!promptText && !currentShot.startFrame && shots.length === 0 && aiRefImages.length === 0 && <span className="text-gray-600">No context yet</span>}
                  </div>
                </div>
              </>
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

      {/* VIDEO MOTION PANEL - For video mode prompts */}
      {showVideoMotion && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowVideoMotion(false)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg text-xs font-medium text-white">Video Motion Builder</span>
                <span className="text-[10px] text-gray-500">Motion only - image has all visual info!</span>
              </div>
              <button onClick={() => setShowVideoMotion(false)} className="w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                {Icons.close}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-3">
              {(['camera', 'subject', 'background', 'objects', 'templates', 'dialogue'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setVideoMotionTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    videoMotionTab === tab
                      ? tab === 'dialogue' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
                      : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tab === 'dialogue' ? '🗣️ Dialogue' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto max-h-[50vh] pr-2">
              {/* Camera Movements */}
              {videoMotionTab === 'camera' && (
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(CAMERA_MOVEMENTS).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setVideoCameraMovement(videoCameraMovement === key ? null : key)}
                      className={`rounded-lg p-3 text-left transition-all ${
                        videoCameraMovement === key
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-xs font-medium">{key.replace(/_/g, ' ')}</div>
                      <div className={`text-[9px] mt-1 ${videoCameraMovement === key ? 'text-purple-200' : 'text-gray-500'}`}>
                        {value.substring(0, 50)}...
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Subject Motions */}
              {videoMotionTab === 'subject' && (
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(SUBJECT_MOTIONS).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setVideoSubjectMotion(videoSubjectMotion === key ? null : key)}
                      className={`rounded-lg p-3 text-left transition-all ${
                        videoSubjectMotion === key
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-xs font-medium">{key.replace(/_/g, ' ')}</div>
                      <div className={`text-[9px] mt-1 ${videoSubjectMotion === key ? 'text-blue-200' : 'text-gray-500'}`}>
                        {value.substring(0, 50)}...
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Background Motions */}
              {videoMotionTab === 'background' && (
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(BACKGROUND_MOTIONS).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setVideoBackgroundMotion(videoBackgroundMotion === key ? null : key)}
                      className={`rounded-lg p-3 text-left transition-all ${
                        videoBackgroundMotion === key
                          ? 'bg-green-600 text-white ring-2 ring-green-400'
                          : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-xs font-medium">{key.replace(/_/g, ' ')}</div>
                      <div className={`text-[9px] mt-1 ${videoBackgroundMotion === key ? 'text-green-200' : 'text-gray-500'}`}>
                        {value}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Object Motions */}
              {videoMotionTab === 'objects' && (
                <div className="space-y-4">
                  {/* Natural Elements */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">Natural Elements</div>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(NATURAL_ELEMENTS).map(([category, motions]) => (
                        Object.entries(motions).map(([key, value]) => (
                          <button
                            key={`${category}-${key}`}
                            onClick={() => setVideoObjectMotion(videoObjectMotion === value ? null : value)}
                            className={`rounded-lg p-2 text-left transition-all ${
                              videoObjectMotion === value
                                ? 'bg-orange-600 text-white ring-2 ring-orange-400'
                                : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <div className="text-[10px] font-medium">{category}: {key}</div>
                          </button>
                        ))
                      ))}
                    </div>
                  </div>
                  {/* Weather */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">Weather</div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(WEATHER).map(([category, motions]) => (
                        Object.entries(motions).map(([key, value]) => (
                          <button
                            key={`weather-${category}-${key}`}
                            onClick={() => setVideoObjectMotion(videoObjectMotion === value ? null : value)}
                            className={`rounded-lg p-2 text-left transition-all ${
                              videoObjectMotion === value
                                ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                                : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <div className="text-[10px] font-medium">{category}: {key}</div>
                          </button>
                        ))
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Templates */}
              {videoMotionTab === 'templates' && (
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">Quick Templates (click to use)</div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(VIDEO_TEMPLATES.full).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setPromptText(value);
                            setShowVideoMotion(false);
                          }}
                          className="rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all"
                        >
                          <div className="text-xs font-medium text-purple-400 mb-1">{key}</div>
                          <div className="text-[10px] text-gray-400">{value}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">Simple Presets</div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(VIDEO_TEMPLATES.simple).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setPromptText(value);
                            setShowVideoMotion(false);
                          }}
                          className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-gray-700 text-left transition-all"
                        >
                          <div className="text-[10px] font-medium">{key}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dialogue / Seedance Templates */}
              {videoMotionTab === 'dialogue' && (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-xs text-purple-400 font-medium mb-1">Seedance 1.5 Pro - Dialogue & Lip Sync</div>
                    <div className="text-[10px] text-gray-400">
                      These templates use Seedance for perfect lip-sync and audio generation.
                      Replace [DIALOGUE] with your actual spoken text.
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">UGC / Talking Head</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.ugc_basic);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all"
                      >
                        <div className="text-xs font-medium text-purple-400 mb-1">Basic UGC</div>
                        <div className="text-[10px] text-gray-400">Confident presenter, soft bokeh, push-in</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.ugc_energetic);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all"
                      >
                        <div className="text-xs font-medium text-purple-400 mb-1">Energetic Creator</div>
                        <div className="text-[10px] text-gray-400">High energy, handheld movement, excited</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">Scene Types</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.product_demo);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium text-amber-400">Product Demo</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.emotional);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium text-red-400">Emotional</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.interview);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium text-blue-400">Interview</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.dialogue_two);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium text-green-400">Two Characters</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.social_hook);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium text-pink-400">Social Hook</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-2 font-medium">Multi-Language</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.mandarin);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium">🇨🇳 Mandarin</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.spanish);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium">🇪🇸 Spanish</div>
                      </button>
                      <button
                        onClick={() => {
                          setMotionPrompt(VIDEO_TEMPLATES.seedance.japanese);
                          setShowVideoMotion(false);
                        }}
                        className="rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all"
                      >
                        <div className="text-[10px] font-medium">🇯🇵 Japanese</div>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase mb-2">Seedance Tips</div>
                    <ul className="text-[10px] text-gray-400 space-y-1">
                      <li>• Replace [DIALOGUE] with actual speech</li>
                      <li>• Specify emotion: "speaks warmly", "exclaims excitedly"</li>
                      <li>• Add language: "speaks in Mandarin with professional tone"</li>
                      <li>• Include camera: "slow push-in", "handheld slight movement"</li>
                      <li>• Audio is generated automatically - no separate TTS needed!</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="text-[9px] text-gray-500 uppercase mb-2">Video Motion Prompt Preview:</div>
              <div className="px-3 py-2 bg-[#0a0a0a] rounded-lg text-xs text-gray-300 min-h-[40px]">
                {buildVideoMotionPrompt() || <span className="text-gray-600 italic">Select motions above...</span>}
              </div>
              {videoPromptWarnings.length > 0 && (
                <div className="mt-2 px-3 py-2 bg-orange-950/50 border border-orange-700/50 rounded-lg">
                  {videoPromptWarnings.map((warning, idx) => (
                    <div key={idx} className="text-[10px] text-orange-300">⚠ {warning}</div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setVideoCameraMovement(null);
                    setVideoSubjectMotion(null);
                    setVideoBackgroundMotion(null);
                    setVideoObjectMotion(null);
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    const prompt = buildVideoMotionPrompt();
                    if (prompt) {
                      setPromptText(prompt);
                      setMotionPrompt(prompt);
                    }
                    setShowVideoMotion(false);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs text-white font-medium transition-colors"
                >
                  Apply to Prompt
                </button>
              </div>
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
          <div className="flex-1 min-w-[280px] flex flex-col gap-2">
            {/* Previous shot context */}
            {previousPrompt && currentShot.startFrame && !promptText && (
              <div className="text-[10px] text-gray-500 px-1">
                Continuing from: "{previousPrompt.slice(0, 50)}..." - What happens next?
              </div>
            )}
            {/* Director Suggestion - clickable to add to prompt */}
            {directorSuggestion && directorIndex !== null && currentShot.startFrame && (
              <button
                onClick={() => {
                  setPromptText(prev => prev ? `${prev}, ${directorSuggestion}` : directorSuggestion);
                  setDirectorSuggestion(null);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 border border-purple-500/50 rounded-lg text-left hover:bg-purple-900/50 transition-all group"
              >
                <span className="text-purple-400 text-lg">💡</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-purple-400 font-medium">
                    {DIRECTOR_PRESETS[directorIndex].name} would:
                  </div>
                  <div className="text-xs text-gray-300 group-hover:text-white truncate">
                    "{directorSuggestion}"
                  </div>
                </div>
                <span className="text-[9px] text-purple-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Click to add →
                </span>
              </button>
            )}
            {/* Shot Library - Director signature shots as clickable chips */}
            {directorIndex !== null && DIRECTOR_PRESETS[directorIndex].shotLibrary && (
              <div className="flex flex-wrap gap-1.5 px-1">
                <span className="text-[9px] text-gray-500 uppercase mr-1 self-center">
                  {DIRECTOR_PRESETS[directorIndex].name} shots:
                </span>
                {DIRECTOR_PRESETS[directorIndex].shotLibrary!.slice(0, 6).map((shot) => (
                  <button
                    key={shot.id}
                    onClick={() => setPromptText(shot.prompt)}
                    className="px-2 py-1 bg-[#2a2a2a] hover:bg-purple-900/30 border border-gray-700 hover:border-purple-500/50 rounded text-[10px] text-gray-400 hover:text-purple-300 transition-all"
                    title={`${shot.name}\nWhen: ${shot.whenToUse.join(', ')}\nLens: ${shot.lens || 'varies'}`}
                  >
                    {shot.name}
                  </button>
                ))}
                {DIRECTOR_PRESETS[directorIndex].shotLibrary!.length > 6 && (
                  <span className="text-[9px] text-gray-600 self-center">
                    +{DIRECTOR_PRESETS[directorIndex].shotLibrary!.length - 6} more
                  </span>
                )}
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
            {/* Nano Banana Prompting Warnings (Image mode) */}
            {mode === 'image' && promptWarnings.length > 0 && (
              <div className="px-3 py-2 bg-orange-950/50 border border-orange-700/50 rounded-lg">
                <div className="text-[9px] text-orange-400 uppercase mb-1 font-medium">Image Prompt Tips:</div>
                {promptWarnings.map((warning, idx) => (
                  <div key={idx} className="text-[10px] text-orange-300">• {warning}</div>
                ))}
              </div>
            )}
            {/* Video Prompt Warnings (Video mode) */}
            {mode === 'video' && videoPromptWarnings.length > 0 && (
              <div className="px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg">
                <div className="text-[9px] text-purple-400 uppercase mb-1 font-medium">Video Prompt Tips:</div>
                {videoPromptWarnings.map((warning, idx) => (
                  <div key={idx} className="text-[10px] text-purple-300">• {warning}</div>
                ))}
              </div>
            )}
            {/* Video Motion Preview (Video mode) */}
            {mode === 'video' && (videoCameraMovement || videoSubjectMotion || videoBackgroundMotion || videoObjectMotion) && (
              <div className="px-3 py-2 bg-purple-950/30 border border-purple-800/50 rounded-lg">
                <div className="text-[9px] text-purple-400 uppercase mb-1 font-medium">Video Motion:</div>
                <div className="text-[10px] text-purple-200">{buildVideoMotionPrompt()}</div>
              </div>
            )}
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

            {/* Control Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setShowMovements(true); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  selectedPresets.length > 0
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.movement}
                <span>Motion</span>
              </button>

              {/* Video Motion Builder - Only in video mode */}
              {mode === 'video' && (
                <button
                  onClick={() => setShowVideoMotion(true)}
                  className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                    videoCameraMovement || videoSubjectMotion || videoBackgroundMotion || videoObjectMotion
                      ? 'bg-purple-700 text-white'
                      : 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-300 hover:from-purple-800/50 hover:to-blue-800/50 border border-purple-700/50'
                  }`}
                >
                  {Icons.video}
                  <span>Video Motion</span>
                  {(videoCameraMovement || videoSubjectMotion || videoBackgroundMotion || videoObjectMotion) && (
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  )}
                </button>
              )}

              <button
                onClick={() => { setShowDirectors(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  directorIndex !== null
                    ? 'bg-gray-700 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {Icons.director}
                <span>{directorIndex !== null ? directors[directorIndex].name : 'Director'}</span>
              </button>

              {/* Character DNA Button - for shot chaining consistency */}
              <button
                onClick={() => { setShowCharacterDNA(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  characterDNA
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="Character DNA - consistent character description for shot chaining"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v2M12 16v2M8 12H6M18 12h-2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{characterDNA ? 'DNA Set' : 'Character'}</span>
              </button>

              {/* Sequence Planner Button */}
              <button
                onClick={() => { setShowSequencePlanner(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowCharacterDNA(false); setShow3DCamera(false); setShowBatchGenerator(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  sequencePlan.length > 0
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="Sequence Planner - plan multiple shots before generating"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>{sequencePlan.length > 0 ? `${sequencePlan.length} Shots` : 'Sequence'}</span>
              </button>

              {/* 3D Camera Control Button */}
              <button
                onClick={() => { setShow3DCamera(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowCharacterDNA(false); setShowSequencePlanner(false); setShowBatchGenerator(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  show3DCamera
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="3D Camera Control - set angle with visual 3D preview"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>3D Angle</span>
              </button>

              {/* Batch Generator Button */}
              <button
                onClick={() => { setShowBatchGenerator(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowCharacterDNA(false); setShowSequencePlanner(false); setShow3DCamera(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  showBatchGenerator
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="Batch Generator - generate multiple angles at once"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                  <polyline points="7.5 19.79 7.5 14.6 3 12" />
                  <polyline points="21 12 16.5 14.6 16.5 19.79" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span>Batch</span>
              </button>

              {/* Movie Shots Browser Button */}
              <button
                onClick={() => { setShowMovieShots(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowCharacterDNA(false); setShowSequencePlanner(false); setShow3DCamera(false); setShowBatchGenerator(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  showMovieShots
                    ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="Movie Shots Library - 2100+ professional film shots"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
                <span>Shots</span>
              </button>

              {/* Continue from Video Button */}
              <button
                onClick={() => { setShowContinueFromVideo(true); resetContinueWorkflow(); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  showContinueFromVideo
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="Continue from Video - Extract frame → Close-up → Dialogue → Stitch"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <polygon points="5 3 19 12 5 21 5 3" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
                <span>Continue</span>
              </button>

              {/* AI Prompt Assistant Button */}
              <button
                onClick={() => { setShowAIPrompt(true); checkOllamaStatus(); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowEmotions(false); setShowShotSetups(false); setShowCharacterDNA(false); setShowSequencePlanner(false); setShow3DCamera(false); setShowBatchGenerator(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
                  showAIPrompt
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-gray-700'
                }`}
                title="AI Prompt Assistant - describe what you want in simple terms"
              >
                {Icons.sparkle}
                <span>AI</span>
              </button>

              <button
                onClick={() => { setShowEmotions(true); setShowMovements(false); setShowCameraPanel(false); setShowStyles(false); setShowLighting(false); setShowAtmosphere(false); setShowDirectors(false); setShowShotSetups(false); }}
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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
                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${
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

              {/* Video Model Auto-Selection Indicator */}
              {mode === 'video' && (
                <div className="relative group">
                  <button
                    className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      autoSelectModel() === 'seedance-1.5'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : autoSelectModel() === 'kling-o1'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {autoSelectModel() === 'seedance-1.5' ? '🗣️ Seedance' :
                     autoSelectModel() === 'kling-o1' ? '🎬 Kling O1' : '🎥 Kling 2.6'}
                  </button>
                  {/* Tooltip with explanation */}
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="font-medium text-white mb-1">Model Auto-Selection</div>
                    <div className="text-gray-400">{explainModelSelection({
                      startFrame: currentShot.startFrame,
                      endFrame: currentShot.endFrame,
                      motionPrompt: currentShot.motionPrompt
                    })}</div>
                    <div className="mt-2 pt-2 border-t border-gray-700 text-gray-500">
                      <div>• <span className="text-purple-400">Seedance</span>: Dialogue/Lip-sync</div>
                      <div>• <span className="text-blue-400">Kling O1</span>: Start→End transitions</div>
                      <div>• <span className="text-amber-400">Kling 2.6</span>: General action</div>
                    </div>
                  </div>
                </div>
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
            {/* START Frame Upload */}
            <div className="cursor-pointer group">
              <div
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    setStatusMessage('Uploading start frame...');
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/cinema/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.url) {
                        setStartFrame(data.url);
                        setStatusMessage('Start frame uploaded!');
                      } else {
                        setStatusMessage('Upload failed');
                      }
                    } catch (err) {
                      setStatusMessage('Upload failed');
                    }
                    setTimeout(() => setStatusMessage(null), 1500);
                  };
                  input.click();
                }}
                className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  currentShot.startFrame
                    ? 'border-transparent'
                    : 'border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30'
                }`}
              >
                {currentShot.startFrame ? (
                  <div className="relative w-full h-full">
                    <img src={currentShot.startFrame} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setStartFrame(''); }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]"
                    >x</button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-500">{Icons.plus}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium mt-1">START</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium">FRAME</span>
                  </>
                )}
              </div>
            </div>

            {/* END Frame Upload */}
            <div className="cursor-pointer group">
              <div
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    setStatusMessage('Uploading end frame...');
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/cinema/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.url) {
                        setEndFrame(data.url);
                        setStatusMessage('End frame uploaded!');
                      } else {
                        setStatusMessage('Upload failed');
                      }
                    } catch (err) {
                      setStatusMessage('Upload failed');
                    }
                    setTimeout(() => setStatusMessage(null), 1500);
                  };
                  input.click();
                }}
                className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  currentShot.endFrame
                    ? 'border-transparent'
                    : 'border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30'
                }`}
              >
                {currentShot.endFrame ? (
                  <div className="relative w-full h-full">
                    <img src={currentShot.endFrame} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setEndFrame(''); }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]"
                    >x</button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-500">{Icons.plus}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium mt-1">END</span>
                    <span className="text-[9px] text-gray-500 uppercase font-medium">FRAME</span>
                  </>
                )}
              </div>
            </div>

            {/* Reference Image - for face/character consistency */}
            <div className="cursor-pointer group">
              <div
                onClick={() => !referenceImage && refInputRef.current?.click()}
                className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  referenceImage
                    ? 'border-purple-500 border-solid'
                    : 'border-gray-600 hover:border-purple-400 group-hover:bg-purple-900/10'
                }`}
              >
                {referenceImage ? (
                  <div className="relative w-full h-full">
                    <img src={referenceImage} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-purple-400">{Icons.plus}</span>
                    <span className="text-[9px] text-purple-400 uppercase font-medium mt-1">REF</span>
                    <span className="text-[9px] text-purple-400 uppercase font-medium">CHAR</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={refInputRef} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                console.log('REF CHAR upload started:', file.name);
                // Upload via server proxy to avoid CORS
                setStatusMessage('Uploading reference...');
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await fetch('/api/cinema/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  console.log('Upload response:', data);
                  if (data.url) {
                    setReferenceImage(data.url);
                    setStatusMessage('Reference uploaded!');
                  } else {
                    setStatusMessage('Upload failed: ' + (data.error || 'Unknown'));
                  }
                } catch (err) {
                  console.error('Upload error:', err);
                  setStatusMessage('Upload failed');
                }
                setTimeout(() => setStatusMessage(null), 2000);
                e.target.value = '';
              }} />
            </div>

            {/* Additional Reference Images */}
            {aiRefImages.length > 0 && (
              <div className="flex items-center gap-1">
                {aiRefImages.slice(0, 3).map((ref, idx) => (
                  <div key={idx} className="relative w-10 h-10 group">
                    <img src={ref.url} className="w-full h-full object-cover rounded-lg border border-yellow-500/50" />
                    <button
                      onClick={() => removeAiRefImage(idx)}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-[8px]">x</span>
                    </button>
                  </div>
                ))}
                {aiRefImages.length > 3 && (
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 text-[10px]">
                    +{aiRefImages.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Add More Refs Button */}
            <div className="cursor-pointer">
              <div
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file || aiRefImages.length >= 7) return;
                    console.log('Additional ref upload started:', file.name);
                    setStatusMessage('Uploading ref image...');
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/cinema/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      console.log('Upload response:', data);
                      if (data.url) {
                        setAiRefImages(prev => [...prev, { url: data.url, description: null }]);
                        setStatusMessage('Reference added!');
                      } else {
                        setStatusMessage('Upload failed: ' + (data.error || 'Unknown'));
                      }
                    } catch (err) {
                      console.error('Upload error:', err);
                      setStatusMessage('Upload failed');
                    }
                    setTimeout(() => setStatusMessage(null), 2000);
                  };
                  input.click();
                }}
                className="w-10 h-16 rounded-lg border border-dashed border-yellow-500/30 hover:border-yellow-500/60 flex flex-col items-center justify-center text-yellow-400/60 hover:text-yellow-400 transition-all"
              >
                <span className="text-lg">+</span>
                <span className="text-[8px]">REF</span>
              </div>
            </div>
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
