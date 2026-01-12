// Scene Planning State Management
// Uses the proven scene JSON format (like shaun_the_plan.json)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Video models matching cinemaStore
export type SceneVideoModel = 'seedance-1.5' | 'kling-o1' | 'kling-2.6';

// Character reference with generate_prompt
export interface CharacterRef {
  id: string;
  name: string;
  description: string;
  costume: string;
  generate_prompt: string;
  ref_url?: string;  // Generated reference image URL
}

// Generic scene reference (for locations, objects, props, vehicles, buildings)
export interface SceneRef {
  id: string;
  name: string;
  type: 'location' | 'object' | 'prop' | 'vehicle' | 'building';
  description: string;
  generate_prompt: string;
  ref_url?: string;  // Generated reference image URL
}

// Shot - the detailed format that works
export interface SceneShot {
  shot_id: string;           // e.g., "shot_001"
  order: number;
  frames?: string;           // e.g., "1-2"
  shot_type: string;         // medium, close-up, wide, insert, etc.
  subject: string;           // Who/what is in frame
  location: string;          // Where
  start_frame?: string;      // Path or URL
  end_frame?: string;        // For start→end transitions
  duration: number;          // Seconds
  model: SceneVideoModel;
  dialog?: string;           // What they say (for seedance)
  photo_prompt: string;      // Full image generation prompt
  motion_prompt: string;     // Video motion prompt
  transition_in?: string;    // cut, whip-pan, fade
  transition_out: string;
  narrative_beat: string;    // Story moment tag

  // Runtime state (added by us)
  status: 'pending' | 'generating' | 'done';
  image_url?: string;
  video_url?: string;
}

// Audio layer (optional)
export interface AudioLayer {
  type: 'music' | 'ambience' | 'sfx' | 'dialog';
  file?: string;
  start_time?: number;
  end_time?: number;
  volume?: number;
  note?: string;
}

// Execution notes (optional)
export interface ExecutionNotes {
  total_shots?: number;
  dialog_shots?: number;
  motion_shots?: number;
  model_breakdown?: Record<string, string>;
  techniques?: string[];
  [key: string]: unknown;
}

// Full scene
export interface Scene {
  scene_id: string;
  name: string;
  description: string;
  duration_estimate: number;  // seconds
  location: string;
  time_of_day: string;
  mood: string;
  color_palette: string;
  aspect_ratio: string;
  director?: string;
  year?: number;

  character_references: Record<string, CharacterRef>;
  scene_references?: Record<string, SceneRef>;  // Locations, objects, props
  shots: SceneShot[];
  audio_layers?: AudioLayer[];
  execution_notes?: ExecutionNotes;

  // Metadata (added by us)
  created_at?: string;
  updated_at?: string;
}

interface SceneState {
  // State
  currentScene: Scene | null;
  scenes: Scene[];
  selectedShotId: string | null;

  // Actions
  loadScene: (sceneOrJson: string | Scene) => void;
  createScene: (metadata: Partial<Scene>) => Scene;
  clearScene: () => void;
  resetAllGenerated: () => void;  // Reset all images/videos/refs but keep plan

  // Shot management
  addShot: (shot: Omit<SceneShot, 'shot_id' | 'order' | 'status'>) => void;
  updateShot: (shotId: string, updates: Partial<SceneShot>) => void;
  removeShot: (shotId: string) => void;
  reorderShots: (shotIds: string[]) => void;

  // Character management
  addCharacter: (char: Omit<CharacterRef, 'id'>) => void;
  updateCharacter: (charId: string, updates: Partial<CharacterRef>) => void;
  removeCharacter: (charId: string) => void;

  // Scene reference management (locations, objects, props)
  addSceneRef: (ref: Omit<SceneRef, 'id'>) => void;
  updateSceneRef: (refId: string, updates: Partial<SceneRef>) => void;
  removeSceneRef: (refId: string) => void;

  // Selection
  selectShot: (shotId: string | null) => void;
  getSelectedShot: () => SceneShot | null;

  // Generation integration
  markShotGenerating: (shotId: string) => void;
  markShotComplete: (shotId: string, imageUrl: string, videoUrl?: string) => void;
  markShotPending: (shotId: string) => void;

  // Import/Export
  exportSceneJSON: () => string;
  importSceneJSON: (json: string) => boolean;

  // Stats
  getStats: () => { total: number; done: number; generating: number; pending: number };
}

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create empty scene
const createEmptyScene = (metadata: Partial<Scene> = {}): Scene => ({
  scene_id: metadata.scene_id || generateId(),
  name: metadata.name || 'New Scene',
  description: metadata.description || '',
  duration_estimate: metadata.duration_estimate || 0,
  location: metadata.location || '',
  time_of_day: metadata.time_of_day || 'day',
  mood: metadata.mood || '',
  color_palette: metadata.color_palette || '',
  aspect_ratio: metadata.aspect_ratio || '16:9',
  director: metadata.director,
  year: metadata.year,
  character_references: metadata.character_references || {},
  scene_references: metadata.scene_references || {},
  shots: metadata.shots || [],
  audio_layers: metadata.audio_layers || [],
  execution_notes: metadata.execution_notes,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Parse imported JSON and add runtime status to shots
const parseSceneJSON = (json: string): Scene | null => {
  try {
    const data = JSON.parse(json);

    // Add status to each shot if not present
    const shots: SceneShot[] = (data.shots || []).map((shot: Partial<SceneShot>, index: number) => ({
      shot_id: shot.shot_id || `shot_${String(index + 1).padStart(3, '0')}`,
      order: shot.order ?? index + 1,
      frames: shot.frames,
      shot_type: shot.shot_type || 'medium',
      subject: shot.subject || '',
      location: shot.location || '',
      start_frame: shot.start_frame,
      end_frame: shot.end_frame,
      duration: shot.duration || 2,
      model: shot.model || 'kling-2.6',
      dialog: shot.dialog,
      photo_prompt: shot.photo_prompt || '',
      motion_prompt: shot.motion_prompt || '',
      transition_in: shot.transition_in,
      transition_out: shot.transition_out || 'cut',
      narrative_beat: shot.narrative_beat || '',
      // Runtime state
      status: shot.status || (shot.image_url ? 'done' : 'pending'),
      image_url: shot.image_url,
      video_url: shot.video_url,
    }));

    return {
      scene_id: data.scene_id || generateId(),
      name: data.name || 'Imported Scene',
      description: data.description || '',
      duration_estimate: data.duration_estimate || shots.reduce((sum, s) => sum + s.duration, 0),
      location: data.location || '',
      time_of_day: data.time_of_day || 'day',
      mood: data.mood || '',
      color_palette: data.color_palette || '',
      aspect_ratio: data.aspect_ratio || '16:9',
      director: data.director,
      year: data.year,
      character_references: data.character_references || {},
      scene_references: data.scene_references || {},
      shots,
      audio_layers: data.audio_layers || [],
      execution_notes: data.execution_notes,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (e) {
    console.error('Failed to parse scene JSON:', e);
    return null;
  }
};

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => ({
      currentScene: null,
      scenes: [],
      selectedShotId: null,

      loadScene: (sceneOrJson) => {
        let scene: Scene | null;

        if (typeof sceneOrJson === 'string') {
          scene = parseSceneJSON(sceneOrJson);
        } else {
          // Clone and add runtime status
          scene = {
            ...sceneOrJson,
            shots: sceneOrJson.shots.map(shot => ({
              ...shot,
              status: shot.status || (shot.image_url ? 'done' : 'pending'),
            })),
            updated_at: new Date().toISOString(),
          };
        }

        if (scene) {
          set({ currentScene: scene, selectedShotId: null });
        }
      },

      createScene: (metadata) => {
        const scene = createEmptyScene(metadata);
        set({ currentScene: scene, selectedShotId: null });
        return scene;
      },

      clearScene: () => {
        // Also clear from localStorage directly
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cinema-scene-storage');
        }
        return set({ currentScene: null, selectedShotId: null });
      },

      // Reset all generated content but keep plan structure
      resetAllGenerated: () => set((state) => {
        if (!state.currentScene) return state;

        // Reset all shots - clear image_url, video_url, set status to pending
        const resetShots = state.currentScene.shots.map(shot => ({
          ...shot,
          image_url: undefined,
          video_url: undefined,
          status: 'pending' as const
        }));

        // Reset all character refs - clear ref_url
        const resetCharRefs: Record<string, CharacterRef> = {};
        Object.entries(state.currentScene.character_references || {}).forEach(([id, char]) => {
          resetCharRefs[id] = { ...char, ref_url: undefined };
        });

        // Reset all scene refs - clear ref_url
        const resetSceneRefs: Record<string, SceneRef> = {};
        Object.entries(state.currentScene.scene_references || {}).forEach(([id, ref]) => {
          resetSceneRefs[id] = { ...ref, ref_url: undefined };
        });

        return {
          currentScene: {
            ...state.currentScene,
            shots: resetShots,
            character_references: resetCharRefs,
            scene_references: resetSceneRefs
          }
        };
      }),

      // Shot management
      addShot: (shotData) => set((state) => {
        if (!state.currentScene) return state;

        const order = state.currentScene.shots.length + 1;
        const newShot: SceneShot = {
          ...shotData,
          shot_id: `shot_${String(order).padStart(3, '0')}`,
          order,
          status: 'pending',
        };

        return {
          currentScene: {
            ...state.currentScene,
            shots: [...state.currentScene.shots, newShot],
            updated_at: new Date().toISOString(),
          }
        };
      }),

      updateShot: (shotId, updates) => set((state) => {
        if (!state.currentScene) return state;

        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(shot =>
              shot.shot_id === shotId ? { ...shot, ...updates } : shot
            ),
            updated_at: new Date().toISOString(),
          }
        };
      }),

      removeShot: (shotId) => set((state) => {
        if (!state.currentScene) return state;

        const shots = state.currentScene.shots
          .filter(shot => shot.shot_id !== shotId)
          .map((shot, index) => ({ ...shot, order: index + 1 }));

        return {
          currentScene: {
            ...state.currentScene,
            shots,
            updated_at: new Date().toISOString(),
          },
          selectedShotId: state.selectedShotId === shotId ? null : state.selectedShotId,
        };
      }),

      reorderShots: (shotIds) => set((state) => {
        if (!state.currentScene) return state;

        const shotMap = new Map(state.currentScene.shots.map(s => [s.shot_id, s]));
        const reordered = shotIds
          .map(id => shotMap.get(id))
          .filter((s): s is SceneShot => !!s)
          .map((shot, index) => ({ ...shot, order: index + 1 }));

        return {
          currentScene: {
            ...state.currentScene,
            shots: reordered,
            updated_at: new Date().toISOString(),
          }
        };
      }),

      // Character management
      addCharacter: (charData) => set((state) => {
        if (!state.currentScene) return state;

        const id = charData.name.toLowerCase().replace(/\s+/g, '_');
        const char: CharacterRef = { ...charData, id };

        return {
          currentScene: {
            ...state.currentScene,
            character_references: {
              ...state.currentScene.character_references,
              [id]: char,
            },
            updated_at: new Date().toISOString(),
          }
        };
      }),

      updateCharacter: (charId, updates) => set((state) => {
        if (!state.currentScene) return state;

        const existing = state.currentScene.character_references[charId];
        if (!existing) return state;

        return {
          currentScene: {
            ...state.currentScene,
            character_references: {
              ...state.currentScene.character_references,
              [charId]: { ...existing, ...updates },
            },
            updated_at: new Date().toISOString(),
          }
        };
      }),

      removeCharacter: (charId) => set((state) => {
        if (!state.currentScene) return state;

        const { [charId]: _, ...remaining } = state.currentScene.character_references;

        return {
          currentScene: {
            ...state.currentScene,
            character_references: remaining,
            updated_at: new Date().toISOString(),
          }
        };
      }),

      // Scene reference management (locations, objects, props)
      addSceneRef: (refData) => set((state) => {
        if (!state.currentScene) return state;

        const id = refData.name.toLowerCase().replace(/\s+/g, '_');
        const ref: SceneRef = { ...refData, id };

        return {
          currentScene: {
            ...state.currentScene,
            scene_references: {
              ...state.currentScene.scene_references,
              [id]: ref,
            },
            updated_at: new Date().toISOString(),
          }
        };
      }),

      updateSceneRef: (refId, updates) => set((state) => {
        if (!state.currentScene) return state;

        const existing = state.currentScene.scene_references?.[refId];
        if (!existing) return state;

        return {
          currentScene: {
            ...state.currentScene,
            scene_references: {
              ...state.currentScene.scene_references,
              [refId]: { ...existing, ...updates },
            },
            updated_at: new Date().toISOString(),
          }
        };
      }),

      removeSceneRef: (refId) => set((state) => {
        if (!state.currentScene || !state.currentScene.scene_references) return state;

        const { [refId]: _, ...remaining } = state.currentScene.scene_references;

        return {
          currentScene: {
            ...state.currentScene,
            scene_references: remaining,
            updated_at: new Date().toISOString(),
          }
        };
      }),

      // Selection
      selectShot: (shotId) => set({ selectedShotId: shotId }),

      getSelectedShot: () => {
        const state = get();
        if (!state.currentScene || !state.selectedShotId) return null;
        return state.currentScene.shots.find(s => s.shot_id === state.selectedShotId) || null;
      },

      // Generation integration
      markShotGenerating: (shotId) => set((state) => {
        if (!state.currentScene) return state;

        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(shot =>
              shot.shot_id === shotId ? { ...shot, status: 'generating' } : shot
            ),
          }
        };
      }),

      markShotComplete: (shotId, imageUrl, videoUrl) => set((state) => {
        if (!state.currentScene) return state;

        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(shot =>
              shot.shot_id === shotId ? {
                ...shot,
                status: 'done',
                image_url: imageUrl,
                video_url: videoUrl || shot.video_url,
              } : shot
            ),
            updated_at: new Date().toISOString(),
          }
        };
      }),

      markShotPending: (shotId) => set((state) => {
        if (!state.currentScene) return state;

        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(shot =>
              shot.shot_id === shotId ? { ...shot, status: 'pending' } : shot
            ),
          }
        };
      }),

      // Import/Export
      exportSceneJSON: () => {
        const scene = get().currentScene;
        if (!scene) return '{}';

        // Export in the same format as shaun_the_plan.json
        const exportData = {
          scene_id: scene.scene_id,
          name: scene.name,
          description: scene.description,
          duration_estimate: scene.duration_estimate,
          location: scene.location,
          time_of_day: scene.time_of_day,
          mood: scene.mood,
          color_palette: scene.color_palette,
          aspect_ratio: scene.aspect_ratio,
          director: scene.director,
          year: scene.year,
          character_references: scene.character_references,
          shots: scene.shots.map(shot => ({
            shot_id: shot.shot_id,
            order: shot.order,
            frames: shot.frames,
            shot_type: shot.shot_type,
            subject: shot.subject,
            location: shot.location,
            start_frame: shot.start_frame,
            end_frame: shot.end_frame,
            duration: shot.duration,
            model: shot.model,
            dialog: shot.dialog,
            photo_prompt: shot.photo_prompt,
            motion_prompt: shot.motion_prompt,
            transition_in: shot.transition_in,
            transition_out: shot.transition_out,
            narrative_beat: shot.narrative_beat,
            // Include generated URLs
            image_url: shot.image_url,
            video_url: shot.video_url,
          })),
          audio_layers: scene.audio_layers,
          execution_notes: scene.execution_notes,
        };

        return JSON.stringify(exportData, null, 2);
      },

      importSceneJSON: (json) => {
        const scene = parseSceneJSON(json);
        if (scene) {
          set({ currentScene: scene, selectedShotId: null });
          return true;
        }
        return false;
      },

      // Stats
      getStats: () => {
        const scene = get().currentScene;
        if (!scene) return { total: 0, done: 0, generating: 0, pending: 0 };

        const stats = { total: scene.shots.length, done: 0, generating: 0, pending: 0 };
        for (const shot of scene.shots) {
          if (shot.status === 'done') stats.done++;
          else if (shot.status === 'generating') stats.generating++;
          else stats.pending++;
        }
        return stats;
      },
    }),
    {
      name: 'cinema-scene-storage',
      partialize: (state) => ({
        currentScene: state.currentScene,
        scenes: state.scenes,
      }),
    }
  )
);

// Helper: Get model display name
export function getModelDisplayName(model: SceneVideoModel): string {
  switch (model) {
    case 'seedance-1.5': return 'Seedance';
    case 'kling-o1': return 'Kling O1';
    case 'kling-2.6': return 'Kling 2.6';
    default: return model;
  }
}

// Helper: Get transition display
export function getTransitionIcon(transition: string): string {
  switch (transition) {
    case 'whip-pan': return '↔';
    case 'fade': return '◐';
    case 'cut': return '|';
    default: return '|';
  }
}
