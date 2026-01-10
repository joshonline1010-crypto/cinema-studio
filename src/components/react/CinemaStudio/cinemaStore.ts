// Cinema Studio State Management
import { create } from 'zustand';
import type { CameraPreset, LensPreset, CameraBodyPreset, FocusPreset } from './cameraPresets';

export type VideoModel = 'kling-o1' | 'kling-2.6' | 'seedance-1.5';

export interface Shot {
  id: string;
  startFrame: string | null;
  endFrame: string | null;
  cameraPresets: CameraPreset[];
  lens: LensPreset | null;
  cameraBody: CameraBodyPreset | null;
  focus: FocusPreset | null;
  motionPrompt: string;
  model: VideoModel;
  duration: number;
  videoUrl: string | null;
  status: 'draft' | 'generating' | 'complete' | 'error';
}

interface CinemaState {
  // Current shot being edited
  currentShot: Shot;

  // All shots in timeline
  shots: Shot[];

  // UI state
  selectedPresets: CameraPreset[];
  selectedLens: LensPreset | null;
  selectedCamera: CameraBodyPreset | null;
  selectedFocus: FocusPreset | null;
  isGenerating: boolean;
  generationProgress: number;
  error: string | null;

  // Actions
  setStartFrame: (url: string | null) => void;
  setEndFrame: (url: string | null) => void;
  togglePreset: (preset: CameraPreset) => void;
  clearPresets: () => void;
  setLens: (lens: LensPreset | null) => void;
  setCameraBody: (camera: CameraBodyPreset | null) => void;
  setFocus: (focus: FocusPreset | null) => void;
  setMotionPrompt: (prompt: string) => void;
  setModel: (model: VideoModel) => void;
  setDuration: (duration: number) => void;

  // Generation
  startGeneration: () => void;
  setProgress: (progress: number) => void;
  completeGeneration: (videoUrl: string) => void;
  failGeneration: (error: string) => void;

  // Timeline
  addShot: (shot: Shot) => void;
  removeShot: (id: string) => void;
  reorderShots: (fromIndex: number, toIndex: number) => void;
  saveCurrentAsShot: () => void;

  // Reset
  resetCurrent: () => void;
}

const createEmptyShot = (): Shot => ({
  id: `shot-${Date.now()}`,
  startFrame: null,
  endFrame: null,
  cameraPresets: [],
  lens: null,
  cameraBody: null,
  focus: null,
  motionPrompt: '',
  model: 'kling-2.6',
  duration: 5,
  videoUrl: null,
  status: 'draft'
});

export const useCinemaStore = create<CinemaState>((set, get) => ({
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
    ...(url ? { currentShot: { ...state.currentShot, endFrame: url, model: 'kling-o1' } } : {})
  })),

  togglePreset: (preset) => set((state) => {
    const exists = state.selectedPresets.find(p => p.id === preset.id);
    let newPresets: CameraPreset[];

    if (exists) {
      newPresets = state.selectedPresets.filter(p => p.id !== preset.id);
    } else if (state.selectedPresets.length < 3) {
      newPresets = [...state.selectedPresets, preset];
    } else {
      // Max 3 presets, replace oldest
      newPresets = [...state.selectedPresets.slice(1), preset];
    }

    // Auto-generate motion prompt from presets
    const autoPrompt = newPresets.map(p => p.prompt.split(',')[0]).join(', ');

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
    currentShot: { ...state.currentShot, cameraPresets: [], motionPrompt: '' }
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
    currentShot: { ...state.currentShot, videoUrl, status: 'complete' }
  })),

  failGeneration: (error) => set((state) => ({
    isGenerating: false,
    generationProgress: 0,
    error,
    currentShot: { ...state.currentShot, status: 'error' }
  })),

  addShot: (shot) => set((state) => ({
    shots: [...state.shots, shot]
  })),

  removeShot: (id) => set((state) => ({
    shots: state.shots.filter(s => s.id !== id)
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

// Auto-detect best model based on current state
export function detectBestModel(state: Pick<Shot, 'startFrame' | 'endFrame' | 'motionPrompt'>): VideoModel {
  // Has end frame? -> Kling O1 for transitions
  if (state.endFrame) {
    return 'kling-o1';
  }

  // Contains dialogue keywords? -> Seedance
  const dialogueKeywords = ['says', 'speaks', 'talking', 'dialogue', 'voice', 'speech'];
  if (dialogueKeywords.some(kw => state.motionPrompt.toLowerCase().includes(kw))) {
    return 'seedance-1.5';
  }

  // Default -> Kling 2.6 for general action
  return 'kling-2.6';
}
