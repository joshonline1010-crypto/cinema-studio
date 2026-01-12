/* empty css                                  */
import { e as createComponent, f as createAstro, p as renderComponent, r as renderTemplate } from '../chunks/astro/server_D9cEOE7x.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_COul5jZt.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as THREE from 'three';
import { e as extractScenePlan } from '../chunks/aiPromptSystem_DUfgpd9k.mjs';
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
  characterDNA: null,
  sequencePlan: [],
  isAutoChaining: false,
  currentSequenceIndex: 0,
  selectedPresets: [],
  selectedLens: null,
  selectedCamera: null,
  selectedFocus: null,
  isGenerating: false,
  generationProgress: 0,
  error: null,
  setCharacterDNA: (dna) => set({ characterDNA: dna }),
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
  setGenerating: (generating) => set({ isGenerating: generating }),
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
  }),
  // Sequence Planner Actions
  addPlannedShot: (shot) => set((state) => ({
    sequencePlan: [...state.sequencePlan, {
      ...shot,
      id: `planned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "planned"
    }]
  })),
  updatePlannedShot: (id, updates) => set((state) => ({
    sequencePlan: state.sequencePlan.map(
      (shot) => shot.id === id ? { ...shot, ...updates } : shot
    )
  })),
  removePlannedShot: (id) => set((state) => ({
    sequencePlan: state.sequencePlan.filter((shot) => shot.id !== id)
  })),
  reorderPlannedShots: (fromIndex, toIndex) => set((state) => {
    const newPlan = [...state.sequencePlan];
    const [removed] = newPlan.splice(fromIndex, 1);
    newPlan.splice(toIndex, 0, removed);
    return { sequencePlan: newPlan };
  }),
  clearSequencePlan: () => set({
    sequencePlan: [],
    currentSequenceIndex: 0,
    isAutoChaining: false
  }),
  setAutoChaining: (enabled) => set({ isAutoChaining: enabled }),
  setCurrentSequenceIndex: (index) => set({ currentSequenceIndex: index }),
  markPlannedShotComplete: (id, imageUrl, videoUrl) => set((state) => ({
    sequencePlan: state.sequencePlan.map(
      (shot) => shot.id === id ? { ...shot, status: "complete", imageUrl, videoUrl } : shot
    )
  }))
}));
const DIALOGUE_KEYWORDS = [
  // Direct speech indicators
  "says",
  "speaks",
  "talking",
  "dialogue",
  "voice",
  "speech",
  "says:",
  "speaks:",
  // Quoted dialogue markers
  '"',
  "'",
  ":",
  "exclaims",
  "whispers",
  "shouts",
  "murmurs",
  "announces",
  "declares",
  "pleads",
  "asks",
  "responds",
  "replies",
  "explains",
  // Lip sync indicators
  "lip sync",
  "lipsync",
  "lip-sync",
  "mouthing",
  "mouth moves",
  // Emotional speech
  "warmly",
  "excitedly",
  "calmly",
  "confidently",
  "enthusiastically",
  "passionately",
  "angrily",
  "sadly",
  "playfully",
  "seriously",
  // UGC/talking head indicators
  "ugc",
  "talking head",
  "talking-head",
  "presenter",
  "host",
  "creator",
  "vlog",
  "interview",
  "testimonial",
  "direct to camera",
  "eye contact",
  // Language specifications
  "in english",
  "in mandarin",
  "in japanese",
  "in korean",
  "in spanish",
  "in portuguese",
  "in indonesian",
  "in cantonese",
  // Multi-speaker
  "conversation",
  "discusse",
  "chat",
  "banter"
];
function explainModelSelection(state) {
  const prompt = state.motionPrompt.toLowerCase();
  if (state.endFrame) {
    return "Kling O1: Start→End frame transition";
  }
  const matchedKeyword = DIALOGUE_KEYWORDS.find((kw) => prompt.includes(kw.toLowerCase()));
  if (matchedKeyword) {
    return `Seedance 1.5: Detected dialogue ("${matchedKeyword}")`;
  }
  return "Kling 2.6: General motion/action";
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const createEmptyScene = (metadata = {}) => ({
  scene_id: metadata.scene_id || generateId(),
  name: metadata.name || "New Scene",
  description: metadata.description || "",
  duration_estimate: metadata.duration_estimate || 0,
  location: metadata.location || "",
  time_of_day: metadata.time_of_day || "day",
  mood: metadata.mood || "",
  color_palette: metadata.color_palette || "",
  aspect_ratio: metadata.aspect_ratio || "16:9",
  director: metadata.director,
  year: metadata.year,
  character_references: metadata.character_references || {},
  scene_references: metadata.scene_references || {},
  shots: metadata.shots || [],
  audio_layers: metadata.audio_layers || [],
  execution_notes: metadata.execution_notes,
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
});
const parseSceneJSON = (json) => {
  try {
    const data = JSON.parse(json);
    const shots = (data.shots || []).map((shot, index) => ({
      shot_id: shot.shot_id || `shot_${String(index + 1).padStart(3, "0")}`,
      order: shot.order ?? index + 1,
      frames: shot.frames,
      shot_type: shot.shot_type || "medium",
      subject: shot.subject || "",
      location: shot.location || "",
      start_frame: shot.start_frame,
      end_frame: shot.end_frame,
      duration: shot.duration || 2,
      model: shot.model || "kling-2.6",
      dialog: shot.dialog,
      photo_prompt: shot.photo_prompt || "",
      motion_prompt: shot.motion_prompt || "",
      transition_in: shot.transition_in,
      transition_out: shot.transition_out || "cut",
      narrative_beat: shot.narrative_beat || "",
      // Runtime state
      status: shot.status || (shot.image_url ? "done" : "pending"),
      image_url: shot.image_url,
      video_url: shot.video_url
    }));
    return {
      scene_id: data.scene_id || generateId(),
      name: data.name || "Imported Scene",
      description: data.description || "",
      duration_estimate: data.duration_estimate || shots.reduce((sum, s) => sum + s.duration, 0),
      location: data.location || "",
      time_of_day: data.time_of_day || "day",
      mood: data.mood || "",
      color_palette: data.color_palette || "",
      aspect_ratio: data.aspect_ratio || "16:9",
      director: data.director,
      year: data.year,
      character_references: data.character_references || {},
      scene_references: data.scene_references || {},
      shots,
      audio_layers: data.audio_layers || [],
      execution_notes: data.execution_notes,
      created_at: data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (e) {
    console.error("Failed to parse scene JSON:", e);
    return null;
  }
};
const useSceneStore = create()(
  persist(
    (set, get) => ({
      currentScene: null,
      scenes: [],
      selectedShotId: null,
      loadScene: (sceneOrJson) => {
        let scene;
        if (typeof sceneOrJson === "string") {
          scene = parseSceneJSON(sceneOrJson);
        } else {
          scene = {
            ...sceneOrJson,
            shots: sceneOrJson.shots.map((shot) => ({
              ...shot,
              status: shot.status || (shot.image_url ? "done" : "pending")
            })),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
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
        if (typeof window !== "undefined") {
          localStorage.removeItem("cinema-scene-storage");
        }
        return set({ currentScene: null, selectedShotId: null });
      },
      // Reset all generated content but keep plan structure
      resetAllGenerated: () => set((state) => {
        if (!state.currentScene) return state;
        const resetShots = state.currentScene.shots.map((shot) => ({
          ...shot,
          image_url: void 0,
          video_url: void 0,
          status: "pending"
        }));
        const resetCharRefs = {};
        Object.entries(state.currentScene.character_references || {}).forEach(([id, char]) => {
          resetCharRefs[id] = { ...char, ref_url: void 0 };
        });
        const resetSceneRefs = {};
        Object.entries(state.currentScene.scene_references || {}).forEach(([id, ref]) => {
          resetSceneRefs[id] = { ...ref, ref_url: void 0 };
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
        const newShot = {
          ...shotData,
          shot_id: `shot_${String(order).padStart(3, "0")}`,
          order,
          status: "pending"
        };
        return {
          currentScene: {
            ...state.currentScene,
            shots: [...state.currentScene.shots, newShot],
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
      }),
      updateShot: (shotId, updates) => set((state) => {
        if (!state.currentScene) return state;
        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(
              (shot) => shot.shot_id === shotId ? { ...shot, ...updates } : shot
            ),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
      }),
      removeShot: (shotId) => set((state) => {
        if (!state.currentScene) return state;
        const shots = state.currentScene.shots.filter((shot) => shot.shot_id !== shotId).map((shot, index) => ({ ...shot, order: index + 1 }));
        return {
          currentScene: {
            ...state.currentScene,
            shots,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          },
          selectedShotId: state.selectedShotId === shotId ? null : state.selectedShotId
        };
      }),
      reorderShots: (shotIds) => set((state) => {
        if (!state.currentScene) return state;
        const shotMap = new Map(state.currentScene.shots.map((s) => [s.shot_id, s]));
        const reordered = shotIds.map((id) => shotMap.get(id)).filter((s) => !!s).map((shot, index) => ({ ...shot, order: index + 1 }));
        return {
          currentScene: {
            ...state.currentScene,
            shots: reordered,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
      }),
      // Character management
      addCharacter: (charData) => set((state) => {
        if (!state.currentScene) return state;
        const id = charData.name.toLowerCase().replace(/\s+/g, "_");
        const char = { ...charData, id };
        return {
          currentScene: {
            ...state.currentScene,
            character_references: {
              ...state.currentScene.character_references,
              [id]: char
            },
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
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
              [charId]: { ...existing, ...updates }
            },
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
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
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
      }),
      // Scene reference management (locations, objects, props)
      addSceneRef: (refData) => set((state) => {
        if (!state.currentScene) return state;
        const id = refData.name.toLowerCase().replace(/\s+/g, "_");
        const ref = { ...refData, id };
        return {
          currentScene: {
            ...state.currentScene,
            scene_references: {
              ...state.currentScene.scene_references,
              [id]: ref
            },
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
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
              [refId]: { ...existing, ...updates }
            },
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
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
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
      }),
      // Selection
      selectShot: (shotId) => set({ selectedShotId: shotId }),
      getSelectedShot: () => {
        const state = get();
        if (!state.currentScene || !state.selectedShotId) return null;
        return state.currentScene.shots.find((s) => s.shot_id === state.selectedShotId) || null;
      },
      // Generation integration
      markShotGenerating: (shotId) => set((state) => {
        if (!state.currentScene) return state;
        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(
              (shot) => shot.shot_id === shotId ? { ...shot, status: "generating" } : shot
            )
          }
        };
      }),
      markShotComplete: (shotId, imageUrl, videoUrl) => set((state) => {
        if (!state.currentScene) return state;
        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(
              (shot) => shot.shot_id === shotId ? {
                ...shot,
                status: "done",
                image_url: imageUrl,
                video_url: videoUrl || shot.video_url
              } : shot
            ),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
      }),
      markShotPending: (shotId) => set((state) => {
        if (!state.currentScene) return state;
        return {
          currentScene: {
            ...state.currentScene,
            shots: state.currentScene.shots.map(
              (shot) => shot.shot_id === shotId ? { ...shot, status: "pending" } : shot
            )
          }
        };
      }),
      // Import/Export
      exportSceneJSON: () => {
        const scene = get().currentScene;
        if (!scene) return "{}";
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
          shots: scene.shots.map((shot) => ({
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
            video_url: shot.video_url
          })),
          audio_layers: scene.audio_layers,
          execution_notes: scene.execution_notes
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
          if (shot.status === "done") stats.done++;
          else if (shot.status === "generating") stats.generating++;
          else stats.pending++;
        }
        return stats;
      }
    }),
    {
      name: "cinema-scene-storage",
      partialize: (state) => ({
        currentScene: state.currentScene,
        scenes: state.scenes
      })
    }
  )
);

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
    recommendedLighting: "low-key",
    recommendedStyle: "gritty",
    recommendedAtmosphere: "clear",
    recommendedFraming: "centered-symmetrical",
    recommendedSetDesign: "sterile-geometric",
    recommendedColorPalette: "desaturated-cold",
    recommendedCharacterStyle: "grunge-realistic",
    // Shot library - 12 signature Kubrick shots (from deep research)
    shotLibrary: [
      {
        id: "one-point-corridor",
        name: "One-Point Perspective Corridor",
        whenToUse: ["Establishing geography", "Character trapped by environment", "Building dread/inevitability"],
        prompt: "one-point perspective shot, symmetrical corridor, vanishing point center frame, geometric architecture, wide angle lens, stark lighting, character small in vast space, Kubrick style, clinical precision, cold institutional, 18mm wide angle",
        lens: "wide-14",
        movement: "static or slow push",
        rig: "tripod or Steadicam"
      },
      {
        id: "kubrick-stare",
        name: "The Kubrick Stare",
        whenToUse: ["Character crossed into madness", "Psychological break", "Direct confrontation with audience"],
        prompt: "Kubrick stare, head tilted down, eyes looking up at camera, intense menacing gaze, direct eye contact, close-up, cold lighting, centered framing, psychological intensity, character breaking sanity, unsettling, Kubrick style",
        lens: "standard-50",
        movement: "static or slow dolly in",
        rig: "tripod or dolly"
      },
      {
        id: "low-steadicam-follow",
        name: "Low Steadicam Follow",
        whenToUse: ["Child POV", "Vulnerability", "Space hunting character"],
        prompt: "low angle Steadicam shot, 18 inches from ground, following character from behind, smooth gliding movement, child perspective, wide angle lens, corridor or hallway, ominous smooth tracking, Kubrick style, The Shining aesthetic",
        lens: "wide-24",
        movement: "steadicam glide",
        rig: "modified Steadicam 18 inches"
      },
      {
        id: "steadicam-follow",
        name: "Steadicam Follow (Standard)",
        whenToUse: ["Character moving through environment", "Space has power over character", "Building tension through movement"],
        prompt: "Steadicam following shot, smooth gliding movement, character walking through space, symmetrical architecture, one-point perspective, wide angle, observational, ominous smooth tracking, Kubrick style, cold precision",
        lens: "wide-24",
        movement: "steadicam",
        rig: "Steadicam"
      },
      {
        id: "slow-dolly-in",
        name: "Slow Dolly In",
        whenToUse: ["Building to revelation", "Focusing attention", "Psychological intimacy"],
        prompt: "slow dolly in, pushing toward face, mathematical precision, centered subject, building tension, inevitable approach, intimate observation, Kubrick style, static subject, moving camera, cold lighting",
        lens: "standard-50",
        movement: "dolly-in",
        rig: "dolly track"
      },
      {
        id: "architectural-wide",
        name: "Architectural Wide",
        whenToUse: ["Establishing power of environment", "Character insignificance", "Institutional/cold spaces"],
        prompt: "extreme wide shot, architectural composition, geometric space, character dwarfed by environment, symmetrical framing, one-point perspective, institutional, cold sterile, Kubrick style, 18mm wide angle, vast interior space",
        lens: "wide-14",
        movement: "static",
        rig: "tripod"
      },
      {
        id: "reverse-zoom-tableau",
        name: "Reverse Zoom (Barry Lyndon)",
        whenToUse: ["Period drama", "Revealing context after intimacy", "Painterly tableaus"],
        prompt: "reverse zoom reveal, starting close-up pulling to wide tableau, painterly composition, 18th century aesthetic, candlelit interior, period costume, soft natural lighting, Barry Lyndon style, Kubrick",
        lens: "standard-50",
        movement: "zoom out",
        rig: "tripod"
      },
      {
        id: "overhead-topdown",
        name: "Overhead/Top-Down",
        whenToUse: ["Violence with clinical distance", "Maze/pattern reveal", "Gods-eye detachment"],
        prompt: "overhead top-down shot, looking straight down at subject, geometric composition, clinical detachment, pattern visible, Kubrick style, god's eye view, cold observation",
        lens: "wide-24",
        movement: "static",
        rig: "crane or ceiling mount"
      },
      {
        id: "interview-confrontation",
        name: "Interview/Confrontation",
        whenToUse: ["Character explaining/confessing", "Interview moments", "Psychological examination"],
        prompt: "medium shot interview framing, subject centered, looking slightly off-camera, static tripod, cold lighting, institutional background, confrontational, Kubrick style, psychological examination, clinical observation",
        lens: "standard-50",
        movement: "static",
        rig: "tripod"
      },
      {
        id: "helicopter-establishing",
        name: "Helicopter Establishing",
        whenToUse: ["Opening establishing shots", "Showing journey/isolation", "Environment dwarfs human"],
        prompt: "aerial helicopter shot, following vehicle through vast landscape, mountain roads, isolated journey, epic scale, character insignificant, nature dominates, Kubrick opening style, ominous establishing",
        lens: "telephoto-135",
        movement: "aerial tracking",
        rig: "helicopter mount"
      },
      {
        id: "bathroom-revelation",
        name: "Bathroom Revelation",
        whenToUse: ["Private moments of madness", "Intimate horror", "Institutional vulnerability"],
        prompt: "bathroom interior, harsh fluorescent lighting, cold tile surfaces, isolated figure, private horror, institutional space, vulnerable, Kubrick style, psychological breakdown, clinical harsh light",
        lens: "wide-24",
        movement: "static",
        rig: "tripod"
      },
      {
        id: "war-room-control",
        name: "War Room / Control Center",
        whenToUse: ["Power concentrated in space", "Institutional decision-making", "Satirical commentary"],
        prompt: "war room interior, circular geometric space, large central table, figures arranged around perimeter, dramatic overhead lighting, institutional power, Kubrick style, Dr. Strangelove aesthetic, cold sterile, military/governmental",
        lens: "wide-14",
        movement: "static or slow pan",
        rig: "tripod or dolly"
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
function generateEditPrompt(director, previousPrompt, shotNumber) {
  const prompt = previousPrompt.toLowerCase();
  let detectedBeat = "journey";
  for (const [beat, keywords] of Object.entries(STORY_BEATS)) {
    if (keywords.some((keyword) => prompt.includes(keyword))) {
      detectedBeat = beat;
      break;
    }
  }
  const progressions = STORY_PROGRESSIONS[detectedBeat] || STORY_PROGRESSIONS.journey;
  const progressionIndex = (shotNumber - 1) % progressions.length;
  const storyProgression = progressions[progressionIndex];
  const parts = [];
  parts.push("THIS EXACT SETUP");
  parts.push(`character ${storyProgression}`);
  if (director?.sceneResponses) {
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
    const sceneResponse = director.sceneResponses[sceneType];
    if (sceneResponse?.movement && sceneResponse.movement !== "static") {
      parts.push(sceneResponse.movement);
    }
  }
  parts.push("8K high detail");
  return parts.join(", ");
}

const AVOID_LIGHTING_TERMS = [
  "cinematic lighting",
  "dramatic lighting",
  "moody atmosphere",
  "muted colors",
  "professional lighting",
  "studio lighting"
];
function validatePrompt(prompt) {
  const warnings = [];
  AVOID_LIGHTING_TERMS.forEach((term) => {
    if (prompt.toLowerCase().includes(term.toLowerCase())) {
      warnings.push(`Avoid "${term}" - use specific light SOURCE instead (e.g., "spotlight from above")`);
    }
  });
  if (prompt.match(/^(4K|8K|cinematic|shot on|ARRI|RED)/i)) {
    warnings.push("Technical specs should be at END, not beginning. Put subject/action first.");
  }
  return {
    valid: warnings.length === 0,
    warnings
  };
}

const CAMERA_MOVEMENTS = {
  // TRACKING SHOTS
  tracking_ground: "Wide shot tracking at ground level following movement",
  tracking_side: "Smooth tracking shot following from the side",
  tracking_behind: "Tracking shot from behind, following subject",
  // DOLLY MOVEMENTS
  dolly_forward: "Slow dolly shot forward",
  dolly_around: "Slow dolly shot around the subject",
  dolly_in: "Dolly in toward subject",
  dolly_out: "Dolly out revealing environment",
  // PUSH/PULL
  push_in: "Slow push-in creating intimacy",
  push_in_10s: "Static medium close-up with slow push-in over 10 seconds",
  pull_back: "Pull back revealing the full scene, then settles",
  // ORBIT/ROTATE
  orbit_slow: "Camera orbits slowly around subject",
  orbit_180: "Slow 180-degree orbit",
  orbit_eye_level: "Camera circles subject, maintaining eye level",
  orbit_stop: "Rotating around at steady pace, then stops",
  // PAN/TILT
  pan_left: "Slow pan left revealing landscape",
  pan_right: "Pan right following action",
  tilt_up: "Tilt up from feet to face",
  tilt_down: "Tilt down from sky to subject",
  // AERIAL/DRONE
  aerial_track: "Wide-angle aerial shot tracking from above",
  drone_rise: "Drone shot rising to reveal vista",
  aerial_push: "Aerial push-in toward subject",
  birds_eye_descend: "Bird's eye view slowly descending",
  fpv_dive: "FPV drone shot, high-speed dive, vertical drop, motion blur",
  // STATIC
  static: "Static shot, slight movement",
  static_locked: "Locked-off camera, subject moves within frame",
  static_elevated: "Static wide shot from elevated position",
  // HANDHELD
  handheld_slight: "Slight handheld movement, documentary feel",
  handheld_subtle: "Subtle camera shake, intimate feel",
  handheld_urgent: "Handheld following action, urgent energy",
  // DRIFT
  drift_around: "Camera drifting around subject",
  drift_floating: "Gentle floating camera movement",
  // ADVANCED
  dolly_zoom: "Cinematic dolly zoom, zali effect",
  rack_focus: "Rack focus, focus shift",
  steadicam: "Steadicam following shot",
  whip_pan: "Whip pan, fast direction change",
  crash_zoom: "Crash zoom, rapid push-in",
  crane_up: "Crane up, rotate counterclockwise"
};
const SUBJECT_MOTIONS = {
  // Human actions
  walk_purpose: "walks purposefully, then stops",
  walk_casual: "strolls casually, then pauses",
  walk_toward: "walks toward camera, then stops and looks up",
  run_sprint: "sprints forward, then slows to stop",
  turn_camera: "turns head to camera, then holds gaze",
  turn_around: "spins around, then faces forward",
  look_over: "looks over shoulder, then turns back",
  // Gestures
  wave: "waves hand, then lowers arm",
  point: "points at camera, then arm drops",
  reach: "reaches out with hand, then pulls back",
  // Facial
  blink: "blinks naturally, forms slight smile",
  smile: "forms slight smile, holds expression",
  eyes_widen: "eyes widen in surprise, then settle",
  // Body parts
  hair_wind: "hair gently moves in breeze, then settles back into place",
  hair_settle: "hair moves with movement, then rests",
  clothing_flow: "dress flows with movement, then settles",
  cape_billow: "cape billows behind, then drapes down",
  // Emotional
  tears: "tears well up, single tear falls",
  laugh: "laughs briefly, then quiets",
  gasp: "gasps in shock, hand to chest"
};
const BACKGROUND_MOTIONS = {
  // Natural elements
  wind_leaves: "leaves sway gently, then still",
  wind_grass: "grass ripples in breeze, then settles",
  wind_curtains: "curtains flutter, then rest",
  // Water
  waves_lap: "waves lap at shore, then recede",
  ripples: "ripples spread across surface, then gentle waves settle",
  waterfall: "water falls continuously",
  // Fire/Smoke
  flames: "flames flicker and dance",
  embers: "embers drift upward, then dissipate",
  smoke: "smoke rises and disperses slowly",
  // Objects
  car_pass: "car drives past in background",
  leaves_fall: "leaves fall slowly to ground",
  rain: "rain drops streak down",
  dust: "dust particles drift in light beam"
};
const POWER_VERBS = [
  "WALKING",
  "RUNNING",
  "FLICKERING",
  "POURING",
  "CHARGING",
  "BILLOWING",
  "DRIFTING",
  "SWAYING",
  "SPINNING",
  "COLLAPSING",
  "ERUPTING",
  "CRASHING"
];
const AVOID_VERBS = [
  "moving",
  "going",
  "visible",
  "slowly",
  "gently",
  "being",
  "having",
  "appearing"
];
function hasEndpoint(prompt) {
  const endpoints = [
    "settles",
    "stops",
    "holds",
    "rests",
    "pauses",
    "freezes",
    "lands",
    "dissipates",
    "quiets",
    "slows"
  ];
  return endpoints.some((e) => prompt.toLowerCase().includes(e));
}
const VIDEO_TEMPLATES = {
  // Simple camera moves
  simple: {
    dolly_around: "slow dolly shot around the subject",
    push_in: "Slow push-in on face, subtle movement, then holds",
    orbit: "camera orbits slowly around subject, then settles",
    static: "static shot, subtle breathing motion"
  },
  // Full motion description
  full: {
    emotional: "Camera slowly orbits left, subject blinks naturally, forms slight smile, hair moves gently as if in soft breeze, background remains mostly static, movement settles",
    action: "Subject lunges forward, cape billows behind, camera follows the motion, dust kicks up from ground, action completes with landing pose",
    dramatic: "Slow dolly in toward face, eyes narrow with intensity, slight trembling, then stillness"
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
function validateVideoPrompt(prompt) {
  const warnings = [];
  const cameraKeywords = ["dolly", "orbit", "pan", "tilt", "zoom", "track", "crane", "push", "pull"];
  const foundCameraWords = cameraKeywords.filter((k) => prompt.toLowerCase().includes(k));
  if (foundCameraWords.length > 1) {
    warnings.push(`Multiple camera movements detected (${foundCameraWords.join(", ")}). Use ONE at a time to avoid warped geometry.`);
  }
  AVOID_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, "i");
    if (regex.test(prompt)) {
      warnings.push(`Weak verb "${verb}" detected. Use power verbs like: ${POWER_VERBS.slice(0, 3).join(", ")}`);
    }
  });
  if (!hasEndpoint(prompt)) {
    warnings.push('No motion endpoint detected. Add "then settles" or similar to prevent 99% hang.');
  }
  const sceneWords = ["in a", "wearing", "with dramatic", "background is", "setting is"];
  sceneWords.forEach((phrase) => {
    if (prompt.toLowerCase().includes(phrase)) {
      warnings.push(`Scene description "${phrase}" detected. Video prompts should be MOTION ONLY - image has all visual info.`);
    }
  });
  if (prompt.toLowerCase().includes("bullet time") || prompt.toLowerCase().includes("matrix effect")) {
    warnings.push("Bullet time / Matrix effect rarely works. Consider simple slow motion instead.");
  }
  if (prompt.toLowerCase().includes("fpv") || prompt.toLowerCase().includes("first person")) {
    warnings.push("FPV / First person view is inconsistent. Consider tracking shot instead.");
  }
  return {
    valid: warnings.length === 0,
    warnings
  };
}
const NATURAL_ELEMENTS = {
  // WIND/AIR EFFECTS
  hair: {
    gentle: "hair moves gently in breeze, strands catching light, then settles",
    flow: "hair flows with wind, then rests",
    blow: "hair blows across face, then clears",
    lift: "strands lift and settle"
  },
  clothing: {
    dress: "dress flows in wind, fabric rippling, movement subtle",
    cape: "cape billows dramatically behind, wind gusting, then falls",
    flutter: "clothing flutters gently, then stills",
    whip: "coat whips in strong wind, then calms"
  },
  vegetation: {
    leaves: "leaves sway in gentle breeze, dappled light, peaceful motion",
    grass: "grass ripples like waves, then settles",
    branches: "branches bend with wind, then straighten",
    flowers: "flowers bob gently, then still",
    trees: "trees sway slowly, then calm"
  },
  // WATER
  water: {
    ripples: "water ripples spread across surface, then gentle waves settle",
    waves: "waves lap gently at shore, rhythmic motion, foam dissolves",
    rain: "rain drops streak down window, collecting at bottom",
    waterfall: "waterfall cascades down rocks, mist rises, water pools below",
    drip: "water drips from faucet, drops fall, ripples in sink"
  },
  // FIRE/FLAMES
  fire: {
    flicker: "flames flicker gently, casting dancing shadows, warmth visible",
    candle: "candle flame wavers in draft, steadies, soft glow",
    sparks: "sparks rise from fire, drift upward, fade into darkness",
    embers: "embers glow orange, pulse with heat, slowly dim",
    bonfire: "bonfire blazes, flames dance, then settle"
  },
  // SMOKE/MIST
  smoke: {
    rise: "smoke rises slowly, curls and disperses, fades to nothing",
    mist: "mist swirls around subject feet, dreamlike, settles",
    steam: "steam rises from hot coffee, wisps curl, dissipate",
    fog: "fog rolls in from background, obscures scene partially",
    exhaust: "exhaust billows, drifts away, clears"
  },
  // DUST/PARTICLES
  dust: {
    motes: "dust motes float in sunbeam, drifting slowly, magical feel",
    kicked: "dust kicked up by footsteps, swirls, settles back down",
    particles: "particles drift through air, catching light, ethereal",
    debris: "debris scatters from impact, pieces fall, settle on ground",
    sand: "sand blows across ground, then settles"
  }
};
const WEATHER = {
  rain: {
    start: "rain begins falling, intensifies, streaks across window",
    stop: "rain slows, drops cease, surface glistens"
  },
  snow: {
    fall: "snow falls gently, flakes drifting, covering ground slowly",
    accumulate: "snow accumulates, scene whitens"
  },
  wind: {
    pickup: "wind picks up, trees bend, debris swirls, calms",
    gust: "gust blows through, then passes"
  },
  light: {
    shift: "sunlight shifts across room as clouds pass, returns to bright",
    dim: "light dims as sun sets, warm to cool tones",
    shadow: "shadow of tree branch moves slowly across wall"
  }
};
const MOTION_ENDPOINTS = [
  "then settles",
  "comes to rest",
  "stops moving",
  "lands on ground",
  "fades away",
  "dissipates",
  "stabilizes",
  "returns to position",
  "then stills",
  "holds position",
  "movement completes"
];

function buildQwenPromptContinuous(azimuth, elevation, distance) {
  const az = (azimuth % 360 + 360) % 360;
  let horizontal = "";
  if (az >= 337.5 || az < 22.5) horizontal = "front";
  else if (az >= 22.5 && az < 67.5) horizontal = "front-left quarter";
  else if (az >= 67.5 && az < 112.5) horizontal = "left profile";
  else if (az >= 112.5 && az < 157.5) horizontal = "back-left quarter";
  else if (az >= 157.5 && az < 202.5) horizontal = "back";
  else if (az >= 202.5 && az < 247.5) horizontal = "back-right quarter";
  else if (az >= 247.5 && az < 292.5) horizontal = "right profile";
  else horizontal = "front-right quarter";
  let vertical = "";
  if (elevation < -15) vertical = "low-angle";
  else if (elevation > 15) vertical = "high-angle";
  else vertical = "eye-level";
  let distanceLabel = "";
  if (distance < 0.8) distanceLabel = "close-up";
  else if (distance > 1.3) distanceLabel = "wide shot";
  else distanceLabel = "medium shot";
  return `<sks> ${horizontal} view ${vertical} shot ${distanceLabel}`;
}
const BATCH_PRESETS = {
  turnaround: [
    { label: "Front", azimuth: 0, elevation: 0, distance: 1 },
    { label: "Front-Left", azimuth: 45, elevation: 0, distance: 1 },
    { label: "Left", azimuth: 90, elevation: 0, distance: 1 },
    { label: "Back-Left", azimuth: 135, elevation: 0, distance: 1 },
    { label: "Back", azimuth: 180, elevation: 0, distance: 1 },
    { label: "Back-Right", azimuth: 225, elevation: 0, distance: 1 },
    { label: "Right", azimuth: 270, elevation: 0, distance: 1 },
    { label: "Front-Right", azimuth: 315, elevation: 0, distance: 1 }
  ],
  cardinal: [
    { label: "Front", azimuth: 0, elevation: 0, distance: 1 },
    { label: "Right", azimuth: 90, elevation: 0, distance: 1 },
    { label: "Back", azimuth: 180, elevation: 0, distance: 1 },
    { label: "Left", azimuth: 270, elevation: 0, distance: 1 }
  ],
  angles: [
    { label: "Low Angle", azimuth: 0, elevation: -20, distance: 1 },
    { label: "Eye Level", azimuth: 0, elevation: 0, distance: 1 },
    { label: "High Angle", azimuth: 0, elevation: 30, distance: 1 }
  ],
  distances: [
    { label: "Close-Up", azimuth: 0, elevation: 0, distance: 0.7 },
    { label: "Medium", azimuth: 0, elevation: 0, distance: 1 },
    { label: "Wide", azimuth: 0, elevation: 0, distance: 1.5 }
  ]
};

const BASE_DISTANCE = 1.6;
const AZIMUTH_RADIUS = 2.4;
const ELEVATION_RADIUS = 1.8;
const CENTER = new THREE.Vector3(0, 0.75, 0);
function Camera3DControl({
  azimuth,
  setAzimuth,
  elevation,
  setElevation,
  distance,
  setDistance,
  subjectImage
}) {
  const containerRef = useRef(null);
  const refs = useRef({
    scene: null,
    renderer: null,
    camera: null,
    animation: null,
    handles: {},
    plane: {},
    state: { azimuth, elevation, distance }
  });
  useEffect(() => {
    refs.current.state = { azimuth, elevation, distance };
  }, [azimuth, elevation, distance]);
  useEffect(() => {
    if (!containerRef.current) return;
    const wrapper = containerRef.current;
    const width = wrapper.clientWidth;
    const height = 400;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(1710638);
    refs.current.scene = scene;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1e3);
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0.5, 0);
    refs.current.camera = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    wrapper.appendChild(renderer.domElement);
    refs.current.renderer = renderer;
    const ambientLight = new THREE.AmbientLight(16777215, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(16777215, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    const gridHelper = new THREE.GridHelper(8, 16, 2763326, 2763326);
    gridHelper.position.y = 0;
    scene.add(gridHelper);
    const cardGroup = new THREE.Group();
    const cardGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 3816010,
      side: THREE.DoubleSide
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    cardGroup.add(card);
    const smileyCanvas = document.createElement("canvas");
    smileyCanvas.width = 256;
    smileyCanvas.height = 256;
    const ctx = smileyCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#3a3a4a";
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = "#f5a623";
      ctx.beginPath();
      ctx.arc(128, 128, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath();
      ctx.arc(100, 110, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(156, 110, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(128, 130, 45, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
    const smileyTexture = new THREE.CanvasTexture(smileyCanvas);
    const smileyMat = new THREE.MeshBasicMaterial({
      map: smileyTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const smileyPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), smileyMat);
    smileyPlane.position.z = 0.01;
    cardGroup.add(smileyPlane);
    cardGroup.position.set(0, 0.75, 0);
    scene.add(cardGroup);
    refs.current.plane = { cardGroup, smileyPlane, smileyMat };
    const azimuthRingGeo = new THREE.TorusGeometry(AZIMUTH_RADIUS, 0.05, 16, 64);
    const azimuthRingMat = new THREE.MeshStandardMaterial({
      color: 65433,
      emissive: 65433,
      emissiveIntensity: 0.4
    });
    const azimuthRing = new THREE.Mesh(azimuthRingGeo, azimuthRingMat);
    azimuthRing.rotation.x = Math.PI / 2;
    azimuthRing.position.y = 0.02;
    scene.add(azimuthRing);
    const azimuthHandleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const azimuthHandleMat = new THREE.MeshStandardMaterial({
      color: 65484,
      emissive: 65484,
      emissiveIntensity: 0.5
    });
    const azimuthHandle = new THREE.Mesh(azimuthHandleGeo, azimuthHandleMat);
    azimuthHandle.userData = { type: "azimuth" };
    scene.add(azimuthHandle);
    const createElevationArc = () => {
      const arcPoints = [];
      for (let i = 0; i <= 32; i++) {
        const angle = THREE.MathUtils.degToRad(-30 + 90 * i / 32);
        arcPoints.push(new THREE.Vector3(
          -0.5,
          ELEVATION_RADIUS * Math.sin(angle) + CENTER.y,
          ELEVATION_RADIUS * Math.cos(angle)
        ));
      }
      const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
      return new THREE.TubeGeometry(arcCurve, 32, 0.05, 8, false);
    };
    const elevationArcGeo = createElevationArc();
    const elevationArcMat = new THREE.MeshStandardMaterial({
      color: 16738740,
      emissive: 16738740,
      emissiveIntensity: 0.4
    });
    const elevationArc = new THREE.Mesh(elevationArcGeo, elevationArcMat);
    scene.add(elevationArc);
    const elevationHandleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const elevationHandleMat = new THREE.MeshStandardMaterial({
      color: 16738740,
      emissive: 16738740,
      emissiveIntensity: 0.5
    });
    const elevationHandle = new THREE.Mesh(elevationHandleGeo, elevationHandleMat);
    elevationHandle.userData = { type: "elevation" };
    scene.add(elevationHandle);
    const distanceLineGeo = new THREE.BufferGeometry();
    const distanceLineMat = new THREE.LineBasicMaterial({
      color: 16753920
    });
    const distanceLine = new THREE.Line(distanceLineGeo, distanceLineMat);
    scene.add(distanceLine);
    const distanceHandleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const distanceHandleMat = new THREE.MeshStandardMaterial({
      color: 16763904,
      emissive: 16763904,
      emissiveIntensity: 0.5
    });
    const distanceHandle = new THREE.Mesh(distanceHandleGeo, distanceHandleMat);
    distanceHandle.userData = { type: "distance" };
    scene.add(distanceHandle);
    const cameraGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.4, 0.25, 0.25);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 4871528 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    cameraGroup.add(body);
    const lensGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.18, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 2963272 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.z = Math.PI / 2;
    lens.position.x = -0.28;
    cameraGroup.add(lens);
    scene.add(cameraGroup);
    refs.current.handles = {
      azimuthHandle,
      elevationHandle,
      distanceHandle,
      distanceLine,
      cameraGroup,
      elevationArc,
      cardGroup
    };
    const updatePositions = () => {
      const { azimuth: az, elevation: el, distance: dist } = refs.current.state;
      const actualDistance = BASE_DISTANCE * dist;
      const azRad = THREE.MathUtils.degToRad(az);
      const elRad = THREE.MathUtils.degToRad(el);
      const camX = actualDistance * Math.sin(azRad) * Math.cos(elRad);
      const camY = actualDistance * Math.sin(elRad) + CENTER.y;
      const camZ = actualDistance * Math.cos(azRad) * Math.cos(elRad);
      cameraGroup.position.set(camX, camY, camZ);
      cameraGroup.lookAt(CENTER);
      azimuthHandle.position.set(
        AZIMUTH_RADIUS * Math.sin(azRad),
        0.02,
        AZIMUTH_RADIUS * Math.cos(azRad)
      );
      elevationHandle.position.set(
        -0.5,
        ELEVATION_RADIUS * Math.sin(elRad) + CENTER.y,
        ELEVATION_RADIUS * Math.cos(elRad)
      );
      const distHandleT = 0.7;
      distanceHandle.position.set(
        CENTER.x + (camX - CENTER.x) * distHandleT,
        CENTER.y + (camY - CENTER.y) * distHandleT,
        CENTER.z + (camZ - CENTER.z) * distHandleT
      );
      const linePoints = new Float32Array([
        CENTER.x,
        CENTER.y,
        CENTER.z,
        camX,
        camY,
        camZ
      ]);
      distanceLineGeo.setAttribute("position", new THREE.BufferAttribute(linePoints, 3));
    };
    updatePositions();
    const animate = () => {
      refs.current.animation = requestAnimationFrame(animate);
      updatePositions();
      renderer.render(scene, camera);
    };
    animate();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let dragTarget = null;
    const getMousePos = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onMouseDown = (e) => {
      getMousePos(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([azimuthHandle, elevationHandle, distanceHandle]);
      if (intersects.length > 0) {
        isDragging = true;
        dragTarget = intersects[0].object;
        dragTarget.material.emissiveIntensity = 1;
        dragTarget.scale.setScalar(1.3);
        renderer.domElement.style.cursor = "grabbing";
      }
    };
    const onMouseMove = (e) => {
      getMousePos(e);
      if (!isDragging) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([azimuthHandle, elevationHandle, distanceHandle]);
        renderer.domElement.style.cursor = intersects.length > 0 ? "grab" : "default";
        return;
      }
      if (dragTarget) {
        raycaster.setFromCamera(mouse, camera);
        const intersection = new THREE.Vector3();
        const userData = dragTarget.userData;
        if (userData.type === "azimuth") {
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          raycaster.ray.intersectPlane(plane, intersection);
          if (intersection) {
            let newAz = THREE.MathUtils.radToDeg(Math.atan2(intersection.x, intersection.z));
            if (newAz < 0) newAz += 360;
            setAzimuth(Math.round(newAz));
          }
        } else if (userData.type === "elevation") {
          const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.5);
          raycaster.ray.intersectPlane(plane, intersection);
          if (intersection) {
            const relY = intersection.y - CENTER.y;
            const relZ = intersection.z;
            let newEl = THREE.MathUtils.radToDeg(Math.atan2(relY, relZ));
            newEl = Math.max(-30, Math.min(60, newEl));
            setElevation(Math.round(newEl));
          }
        } else if (userData.type === "distance") {
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -CENTER.y);
          raycaster.ray.intersectPlane(plane, intersection);
          if (intersection) {
            const dist = intersection.distanceTo(new THREE.Vector3(CENTER.x, CENTER.y, CENTER.z)) / BASE_DISTANCE;
            const newDist = Math.max(0.6, Math.min(1.8, dist));
            setDistance(Math.round(newDist * 10) / 10);
          }
        }
      }
    };
    const onMouseUp = () => {
      if (dragTarget) {
        dragTarget.material.emissiveIntensity = 0.5;
        dragTarget.scale.setScalar(1);
      }
      isDragging = false;
      dragTarget = null;
      renderer.domElement.style.cursor = "default";
    };
    const onTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };
    const onTouchEnd = (e) => {
      e.preventDefault();
      onMouseUp();
    };
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mouseleave", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
    renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: false });
    const handleResize = () => {
      const newWidth = wrapper.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (refs.current.animation) {
        cancelAnimationFrame(refs.current.animation);
      }
      renderer.dispose();
      if (wrapper.contains(renderer.domElement)) {
        wrapper.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [setAzimuth, setElevation, setDistance]);
  useEffect(() => {
    if (!subjectImage || !refs.current.plane.smileyPlane) return;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(subjectImage, (texture) => {
      const { smileyPlane } = refs.current.plane;
      if (smileyPlane) {
        smileyPlane.material.map = texture;
        smileyPlane.material.needsUpdate = true;
      }
    });
  }, [subjectImage]);
  const qwenPrompt = buildQwenPromptContinuous(azimuth, elevation, distance);
  return /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 rounded-lg border border-zinc-700 p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🎬" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "3D Camera Control" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-400 mb-4", children: [
      /* @__PURE__ */ jsx("em", { children: "Drag the handles:" }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 ml-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full", style: { background: "#00ffcc" } }),
        " Azimuth"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 ml-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full", style: { background: "#ff69b4" } }),
        " Elevation"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 ml-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full", style: { background: "#ffcc00" } }),
        " Distance"
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        className: "rounded-xl overflow-hidden",
        style: { height: 400, background: "#1a1a2e" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 mt-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-zinc-400 block mb-1", children: "Azimuth" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: azimuth,
            onChange: (e) => setAzimuth(Number(e.target.value) % 360),
            className: "w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white",
            min: 0,
            max: 359
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-zinc-400 block mb-1", children: "Elevation" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: elevation,
            onChange: (e) => setElevation(Math.max(-30, Math.min(60, Number(e.target.value)))),
            className: "w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white",
            min: -30,
            max: 60
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-zinc-400 block mb-1", children: "Distance" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: distance,
            onChange: (e) => setDistance(Math.max(0.6, Math.min(1.8, Number(e.target.value)))),
            className: "w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white",
            min: 0.6,
            max: 1.8,
            step: 0.1
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 rounded-lg", style: { background: "rgba(0, 255, 136, 0.15)" }, children: /* @__PURE__ */ jsx("code", { className: "text-green-400 font-mono text-sm", children: qwenPrompt }) })
  ] });
}

const PRESET_OPTIONS = [
  { value: "turnaround", label: "Full Turnaround (8 angles)", count: 8 },
  { value: "cardinal", label: "Cardinal (4 angles)", count: 4 },
  { value: "angles", label: "Elevation (3 angles)", count: 3 },
  { value: "distances", label: "Distances (3 shots)", count: 3 }
];
function BatchGenerator({
  sourceImage,
  onBatchComplete,
  onImageGenerated,
  generateAngleImage
}) {
  const [selectedPreset, setSelectedPreset] = useState("cardinal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const handleGenerate = useCallback(async () => {
    if (!sourceImage) {
      alert("Please upload a source image first");
      return;
    }
    const angles = BATCH_PRESETS[selectedPreset];
    if (!angles) return;
    setIsGenerating(true);
    setProgress({ current: 0, total: angles.length });
    setResults([]);
    const batchResults = [];
    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      setProgress({ current: i + 1, total: angles.length });
      try {
        const url = await generateAngleImage(angle, sourceImage);
        const generated = {
          angle,
          status: "success",
          url
        };
        batchResults.push(generated);
        setResults([...batchResults]);
        if (onImageGenerated) {
          onImageGenerated(generated);
        }
      } catch (error) {
        const errorResult = {
          angle,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        };
        batchResults.push(errorResult);
        setResults([...batchResults]);
      }
    }
    setIsGenerating(false);
    onBatchComplete?.(batchResults);
  }, [sourceImage, selectedPreset, onBatchComplete, onImageGenerated, generateAngleImage]);
  const getAnglePreview = (preset) => {
    const angles = BATCH_PRESETS[preset];
    if (!angles) return "";
    return angles.map((a) => a.label).join(", ");
  };
  const currentPresetAngles = BATCH_PRESETS[selectedPreset] || [];
  return /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 rounded-lg border border-zinc-700 p-4 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🔄" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Batch Generator" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Select Preset" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: PRESET_OPTIONS.map((preset) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedPreset(preset.value),
          className: `p-3 rounded-lg border text-left transition-all ${selectedPreset === preset.value ? "border-cyan-500 bg-cyan-500/10" : "border-zinc-700 hover:border-zinc-500"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-sm text-white", children: preset.label }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-400 mt-1", children: getAnglePreview(preset.value) })
          ]
        },
        preset.value
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 mb-2", children: "Angles to Generate:" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: currentPresetAngles.map((angle, i) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-300",
          title: buildQwenPromptContinuous(angle.azimuth, angle.elevation, angle.distance),
          children: angle.label
        },
        i
      )) })
    ] }),
    isGenerating && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-zinc-400", children: [
        /* @__PURE__ */ jsx("span", { children: "Generating..." }),
        /* @__PURE__ */ jsxs("span", { children: [
          progress.current,
          " / ",
          progress.total
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-2 bg-zinc-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all",
          style: { width: `${progress.current / progress.total * 100}%` }
        }
      ) })
    ] }),
    results.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
        "Generated (",
        results.filter((r) => r.status === "success").length,
        " / ",
        results.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: results.map((result, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `aspect-square rounded-lg border overflow-hidden ${result.status === "success" ? "border-green-500/50" : result.status === "error" ? "border-red-500/50" : "border-zinc-700"}`,
          children: result.status === "success" && result.url ? /* @__PURE__ */ jsx("img", { src: result.url, alt: result.angle?.label, className: "w-full h-full object-cover" }) : result.status === "error" ? /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-red-500/10 text-red-400 text-xs", children: "Error" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-zinc-800", children: /* @__PURE__ */ jsx("span", { className: "animate-pulse text-zinc-400", children: "..." }) })
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleGenerate,
        disabled: isGenerating || !sourceImage,
        className: "w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/25",
        children: isGenerating ? `Generating ${progress.current}/${progress.total}...` : `Generate ${currentPresetAngles.length} Angles`
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-zinc-500", children: [
      "Estimated cost: ~$",
      (currentPresetAngles.length * 0.03).toFixed(2),
      " (",
      currentPresetAngles.length,
      " x $0.03)"
    ] })
  ] });
}

const DIRECTOR_NAMES = {
  "stanley-kubrick": "Stanley Kubrick",
  "steven-spielberg": "Steven Spielberg",
  "christopher-nolan": "Christopher Nolan",
  "denis-villeneuve": "Denis Villeneuve",
  "david-fincher": "David Fincher",
  "quentin-tarantino": "Quentin Tarantino",
  "wes-anderson": "Wes Anderson",
  "martin-scorsese": "Martin Scorsese",
  "ridley-scott": "Ridley Scott",
  "terrence-malick": "Terrence Malick",
  "akira-kurosawa": "Akira Kurosawa",
  "alfred-hitchcock": "Alfred Hitchcock",
  "bong-joon-ho": "Bong Joon-ho",
  "damien-chazelle": "Damien Chazelle",
  "francis-ford-coppola": "Francis Ford Coppola",
  "james-cameron": "James Cameron",
  "coen-brothers": "Coen Brothers",
  "ari-aster": "Ari Aster",
  "barry-jenkins": "Barry Jenkins",
  "sam-mendes": "Sam Mendes"
};
function MovieShotsBrowser({
  onSelectShots,
  onClose,
  userAssets = [],
  onAddAsset,
  onRemoveAsset,
  selectedAsset,
  onSelectAsset
}) {
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShots, setSelectedShots] = useState(/* @__PURE__ */ new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedLighting, setSelectedLighting] = useState(null);
  const [selectedShotType, setSelectedShotType] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const [showAssetUpload, setShowAssetUpload] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("character");
  const [newAssetDescription, setNewAssetDescription] = useState("");
  const [newAssetImage, setNewAssetImage] = useState(null);
  const assetInputRef = useRef(null);
  const [assetMode, setAssetMode] = useState("upload");
  const [assetRefImages, setAssetRefImages] = useState([]);
  const [assetGenerating, setAssetGenerating] = useState(false);
  const [assetGenError, setAssetGenError] = useState(null);
  const refImageInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("shots");
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const response = await fetch("/movie-shots/index.json");
        if (!response.ok) throw new Error("Failed to load movie shots index");
        const data = await response.json();
        setIndex(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    loadIndex();
  }, []);
  const filteredShots = useMemo(() => {
    if (!index) return [];
    return index.shots.filter((shot) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = shot.film.toLowerCase().includes(query) || shot.prompt.toLowerCase().includes(query) || shot.tags.some((t) => t.toLowerCase().includes(query)) || shot.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedDirector && shot.director !== selectedDirector) return false;
      if (selectedEmotion && shot.emotion !== selectedEmotion) return false;
      if (selectedLighting && shot.lighting !== selectedLighting) return false;
      if (selectedShotType && shot.shot !== selectedShotType) return false;
      if (selectedEnvironment && shot.environment !== selectedEnvironment) return false;
      return true;
    });
  }, [index, searchQuery, selectedDirector, selectedEmotion, selectedLighting, selectedShotType, selectedEnvironment]);
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedDirector, selectedEmotion, selectedLighting, selectedShotType, selectedEnvironment]);
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDirector(null);
    setSelectedEmotion(null);
    setSelectedLighting(null);
    setSelectedShotType(null);
    setSelectedEnvironment(null);
  };
  const hasActiveFilters = searchQuery || selectedDirector || selectedEmotion || selectedLighting || selectedShotType || selectedEnvironment;
  const toggleShotSelection = (shot) => {
    const imageUrl = `/movie-shots/${shot.image}`;
    setSelectedShots((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(shot.id)) {
        newMap.delete(shot.id);
      } else if (newMap.size < 7) {
        newMap.set(shot.id, { shot, imageUrl });
      }
      return newMap;
    });
  };
  const applySelectedShots = () => {
    const shotsArray = Array.from(selectedShots.values());
    onSelectShots(shotsArray);
  };
  const handleAssetImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewAssetImage(event.target?.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleRefImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/cinema/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.url) {
        setAssetRefImages((prev) => [...prev.slice(0, 6), data.url]);
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (err) {
      console.error("Ref upload failed:", err);
    }
    e.target.value = "";
  };
  const removeRefImage = (index2) => {
    setAssetRefImages((prev) => prev.filter((_, i) => i !== index2));
  };
  const generateAsset = async () => {
    if (!newAssetDescription || !onAddAsset) return;
    setAssetGenerating(true);
    setAssetGenError(null);
    try {
      const typePrompts = {
        character: "Character portrait, centered composition, full detail, clean background.",
        item: "Product shot, centered, clean white background, studio lighting.",
        vehicle: "Vehicle showcase, 3/4 angle, clean studio environment.",
        creature: "Fantasy creature portrait, detailed, clean background, concept art style."
      };
      const fullPrompt = `${newAssetDescription}. ${typePrompts[newAssetType]} High quality, 4K, detailed.`;
      const requestBody = {
        type: assetRefImages.length > 0 ? "edit" : "image",
        prompt: fullPrompt,
        aspect_ratio: "1:1"
      };
      if (assetRefImages.length > 0) {
        requestBody.image_urls = assetRefImages;
      }
      const response = await fetch("/api/cinema/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (data.image_url) {
        const asset = {
          id: `asset-${Date.now()}`,
          name: newAssetName || `Generated ${newAssetType}`,
          type: newAssetType,
          imageUrl: data.image_url,
          description: newAssetDescription
        };
        onAddAsset(asset);
        resetAssetForm();
      } else {
        setAssetGenError(data.error || "Generation failed");
      }
    } catch (err) {
      setAssetGenError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAssetGenerating(false);
    }
  };
  const resetAssetForm = () => {
    setNewAssetName("");
    setNewAssetDescription("");
    setNewAssetImage(null);
    setAssetRefImages([]);
    setAssetMode("upload");
    setAssetGenError(null);
    setShowAssetUpload(false);
  };
  const saveNewAsset = () => {
    if (!newAssetName || !newAssetDescription || !newAssetImage || !onAddAsset) return;
    const asset = {
      id: `asset-${Date.now()}`,
      name: newAssetName,
      type: newAssetType,
      imageUrl: newAssetImage,
      description: newAssetDescription
    };
    onAddAsset(asset);
    resetAssetForm();
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-gray-400", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }),
      "Loading ",
      index?.count || 2100,
      "+ movie shots..."
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm", children: error });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-white", children: "Movie Shots Library" }),
        /* @__PURE__ */ jsxs("div", { className: "flex bg-[#2a2a2a] rounded-lg p-0.5", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("shots"),
              className: `px-3 py-1 rounded-md text-xs font-medium transition-all ${activeTab === "shots" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`,
              children: [
                "Shots (",
                filteredShots.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("assets"),
              className: `px-3 py-1 rounded-md text-xs font-medium transition-all ${activeTab === "assets" ? "bg-green-500 text-black" : "text-gray-400 hover:text-white"}`,
              children: [
                "My Assets (",
                userAssets.length,
                ")"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        selectedShots.size > 0 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs", children: [
          selectedShots.size,
          "/7 selected"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-700 rounded-lg transition-colors", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5 text-gray-400", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) })
      ] })
    ] }),
    activeTab === "shots" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: "Search films, tags, locations...",
          className: "w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
        }
      ) }),
      selectedAsset && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: selectedAsset.imageUrl, alt: selectedAsset.name, className: "w-10 h-10 rounded object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-green-400 font-medium", children: [
            "Swapping with: ",
            selectedAsset.name
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400 truncate", children: [
            selectedAsset.description.substring(0, 50),
            "..."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onSelectAsset?.(null),
            className: "px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30",
            children: "Clear"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedDirector || "",
            onChange: (e) => setSelectedDirector(e.target.value || null),
            className: "bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Directors" }),
              index?.filters.directors.map((d) => /* @__PURE__ */ jsx("option", { value: d, children: DIRECTOR_NAMES[d] || d }, d))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedEmotion || "",
            onChange: (e) => setSelectedEmotion(e.target.value || null),
            className: "bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Emotions" }),
              index?.filters.emotions.map((e) => /* @__PURE__ */ jsx("option", { value: e, children: e }, e))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedLighting || "",
            onChange: (e) => setSelectedLighting(e.target.value || null),
            className: "bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Lighting" }),
              index?.filters.lighting.map((l) => /* @__PURE__ */ jsx("option", { value: l, children: l }, l))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedShotType || "",
            onChange: (e) => setSelectedShotType(e.target.value || null),
            className: "bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Shot Types" }),
              index?.filters.shotTypes.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedEnvironment || "",
            onChange: (e) => setSelectedEnvironment(e.target.value || null),
            className: "bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Environments" }),
              index?.filters.environments.map((e) => /* @__PURE__ */ jsx("option", { value: e, children: e }, e))
            ]
          }
        ),
        hasActiveFilters && /* @__PURE__ */ jsx("button", { onClick: clearFilters, className: "px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors", children: "Clear All" })
      ] }),
      selectedShots.size > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-2 bg-[#1f1f1f] rounded-lg border border-cyan-500/30", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-cyan-400", children: "Selected Reference Shots" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedShots(/* @__PURE__ */ new Map()),
              className: "text-xs text-red-400 hover:underline",
              children: "Clear All"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: Array.from(selectedShots.values()).map(({ shot, imageUrl }, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("img", { src: imageUrl, alt: shot.film, className: "w-16 h-10 object-cover rounded border border-cyan-500/50" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -left-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold", children: idx + 1 }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggleShotSelection(shot),
              className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
              children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", className: "w-2 h-2", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
            }
          )
        ] }, shot.id)) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: applySelectedShots,
            className: "mt-2 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity",
            children: [
              "Use ",
              selectedShots.size,
              " Shot",
              selectedShots.size > 1 ? "s" : "",
              " as Reference"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2", children: filteredShots.slice(0, visibleCount).map((shot) => {
          const isSelected = selectedShots.has(shot.id);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => toggleShotSelection(shot),
              className: `group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-cyan-500 ring-2 ring-cyan-500/30" : "border-gray-700 hover:border-cyan-500/50"}`,
              children: [
                /* @__PURE__ */ jsx("img", { src: `/movie-shots/${shot.image}`, alt: shot.film, className: "w-full h-full object-cover", loading: "lazy" }),
                isSelected && /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-white font-medium truncate", children: shot.film }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-gray-400", children: [
                    shot.shot,
                    " • ",
                    shot.emotion
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity", children: DIRECTOR_NAMES[shot.director] || shot.director })
              ]
            },
            shot.id
          );
        }) }),
        visibleCount < filteredShots.length && /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-4 pb-4", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setVisibleCount((prev) => prev + 24),
            className: "px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-sm text-gray-400 transition-colors",
            children: [
              "Load More (",
              filteredShots.length - visibleCount,
              " remaining)"
            ]
          }
        ) }),
        filteredShots.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-gray-500", children: [
          /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-12 h-12 mb-3 opacity-50", children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
            /* @__PURE__ */ jsx("path", { d: "M21 21l-4.35-4.35" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No shots match your filters" }),
          /* @__PURE__ */ jsx("button", { onClick: clearFilters, className: "mt-2 text-cyan-400 text-xs hover:underline", children: "Clear filters" })
        ] })
      ] })
    ] }),
    activeTab === "assets" && /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mb-3", children: "Upload your own characters, items, or creatures. When you select a movie shot, the subject will be swapped with your asset in the generated prompt." }),
        !showAssetUpload && onAddAsset && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowAssetUpload(true),
            className: "w-full py-3 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-lg text-gray-400 hover:text-green-400 transition-colors flex items-center justify-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) }),
              "Add New Asset"
            ]
          }
        ),
        showAssetUpload && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[#1f1f1f] rounded-lg border border-green-500/30 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-green-400 font-medium", children: "New Asset" }),
            /* @__PURE__ */ jsx("button", { onClick: resetAssetForm, className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex mb-3 bg-[#2a2a2a] rounded-lg p-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setAssetMode("upload"),
                className: `flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${assetMode === "upload" ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`,
                children: "Upload Image"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setAssetMode("generate"),
                className: `flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${assetMode === "generate" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"}`,
                children: "Generate with AI"
              }
            )
          ] }),
          assetGenError && /* @__PURE__ */ jsx("div", { className: "mb-3 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-300", children: assetGenError }),
          assetMode === "upload" && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            newAssetImage ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("img", { src: newAssetImage, alt: "Asset preview", className: "w-full h-32 object-contain bg-[#2a2a2a] rounded-lg" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setNewAssetImage(null),
                  className: "absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center",
                  children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
                }
              )
            ] }) : /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => assetInputRef.current?.click(),
                className: "w-full h-24 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-green-400 transition-colors",
                children: [
                  /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-6 h-6 mb-1", children: [
                    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
                    /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                    /* @__PURE__ */ jsx("path", { d: "M21 15l-5-5L5 21" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Upload Image" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("input", { ref: assetInputRef, type: "file", accept: "image/*", onChange: handleAssetImageUpload, className: "hidden" })
          ] }),
          assetMode === "generate" && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2", children: "Reference Images (Optional)" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-2", children: [
              assetRefImages.map((url, idx) => /* @__PURE__ */ jsxs("div", { className: "relative w-14 h-14", children: [
                /* @__PURE__ */ jsx("img", { src: url, alt: `Ref ${idx + 1}`, className: "w-full h-full object-cover rounded-lg border border-purple-500/50" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => removeRefImage(idx),
                    className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center",
                    children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", className: "w-2 h-2", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
                  }
                )
              ] }, idx)),
              assetRefImages.length < 7 && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => refImageInputRef.current?.click(),
                  className: "w-14 h-14 border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-400 transition-colors",
                  children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("input", { ref: refImageInputRef, type: "file", accept: "image/*", onChange: handleRefImageUpload, className: "hidden" }),
            /* @__PURE__ */ jsx("div", { className: "text-[9px] text-gray-500", children: "Add reference images for style/character consistency. Leave empty to generate from description only." })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newAssetName,
              onChange: (e) => setNewAssetName(e.target.value),
              placeholder: "Asset name (e.g., CHIP, Iron Golem)",
              className: "w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mb-2"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: newAssetType,
              onChange: (e) => setNewAssetType(e.target.value),
              className: "w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 mb-2",
              children: [
                /* @__PURE__ */ jsx("option", { value: "character", children: "Character" }),
                /* @__PURE__ */ jsx("option", { value: "item", children: "Item / Object" }),
                /* @__PURE__ */ jsx("option", { value: "vehicle", children: "Vehicle" }),
                /* @__PURE__ */ jsx("option", { value: "creature", children: "Creature" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: newAssetDescription,
              onChange: (e) => setNewAssetDescription(e.target.value),
              placeholder: assetMode === "generate" ? "Describe what to generate (e.g., 'Fluffy yellow chipmunk with green headphones, red jacket, blue pants, cute cartoon style, 8K')" : "Detailed description for AI swapping (e.g., 'Fluffy yellow chipmunk with green headphones, red jacket, blue pants')",
              rows: 3,
              className: "w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mb-3 resize-none"
            }
          ),
          assetMode === "upload" ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: saveNewAsset,
              disabled: !newAssetName || !newAssetDescription || !newAssetImage,
              className: `w-full py-2 rounded-lg text-sm font-medium transition-colors ${newAssetName && newAssetDescription && newAssetImage ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`,
              children: "Save Asset"
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: generateAsset,
              disabled: !newAssetDescription || assetGenerating,
              className: `w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${newAssetDescription && !assetGenerating ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`,
              children: assetGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Generating..."
              ] }) : /* @__PURE__ */ jsx(Fragment, { children: "✨ Generate & Add to Assets" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: userAssets.map((asset) => {
        const isActive = selectedAsset?.id === asset.id;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => onSelectAsset?.(isActive ? null : asset),
            className: `relative p-3 rounded-lg border-2 cursor-pointer transition-all ${isActive ? "bg-green-500/10 border-green-500" : "bg-[#1f1f1f] border-gray-700 hover:border-green-500/50"}`,
            children: [
              /* @__PURE__ */ jsx("img", { src: asset.imageUrl, alt: asset.name, className: "w-full h-20 object-contain bg-[#2a2a2a] rounded mb-2" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-white font-medium truncate", children: asset.name }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 capitalize", children: asset.type }),
              isActive && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) }) }),
              onRemoveAsset && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    onRemoveAsset(asset.id);
                  },
                  className: "absolute top-2 left-2 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity",
                  children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
                }
              )
            ]
          },
          asset.id
        );
      }) }),
      userAssets.length === 0 && !showAssetUpload && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
        /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-12 h-12 mx-auto mb-3 opacity-50", children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" }),
          /* @__PURE__ */ jsx("path", { d: "M5.5 21v-2a6.5 6.5 0 0113 0v2" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No assets yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "Add your characters or items to swap them into movie shots" })
      ] })
    ] })
  ] });
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
    setGenerating,
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
    markPlannedShotComplete
  } = useCinemaStore();
  const {
    currentScene,
    selectedShotId,
    loadScene,
    clearScene,
    resetAllGenerated,
    exportSceneJSON,
    selectShot: selectSceneShot,
    updateShot: updateSceneShot,
    markShotGenerating,
    markShotComplete,
    updateCharacter,
    addSceneRef,
    updateSceneRef
  } = useSceneStore();
  const [promptText, setPromptText] = useState("");
  const [promptWarnings, setPromptWarnings] = useState([]);
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
  const [showCharacterDNA, setShowCharacterDNA] = useState(false);
  const [showSequencePlanner, setShowSequencePlanner] = useState(false);
  const [showVideoMotion, setShowVideoMotion] = useState(false);
  const [cameraPanelTab, setCameraPanelTab] = useState("all");
  const [show3DCamera, setShow3DCamera] = useState(false);
  const [showBatchGenerator, setShowBatchGenerator] = useState(false);
  const [showMovieShots, setShowMovieShots] = useState(false);
  const [showContinueFromVideo, setShowContinueFromVideo] = useState(false);
  const [userAssets, setUserAssets] = useState([]);
  const [selectedAssetForSwap, setSelectedAssetForSwap] = useState(null);
  const [continueVideoUrl, setContinueVideoUrl] = useState("");
  const [continueExtractedFrame, setContinueExtractedFrame] = useState(null);
  const [continueCloseupUrl, setContinueCloseupUrl] = useState(null);
  const [continueDialogue, setContinueDialogue] = useState("");
  const [continueDialogueVideoUrl, setContinueDialogueVideoUrl] = useState(null);
  const [continueStep, setContinueStep] = useState(1);
  const [continueLoading, setContinueLoading] = useState(false);
  const [continueError, setContinueError] = useState(null);
  const [continueLocalFileName, setContinueLocalFileName] = useState(null);
  const continueVideoInputRef = useRef(null);
  const [cameraAzimuth, setCameraAzimuth] = useState(0);
  const [cameraElevation, setCameraElevation] = useState(0);
  const [cameraDistance, setCameraDistance] = useState(1);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState("unknown");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiSessionId] = useState(() => `cinema-${Date.now()}`);
  const aiChatRef = useRef(null);
  const [aiMode, setAiMode] = useState("chat");
  const [aiCopiedIndex, setAiCopiedIndex] = useState(null);
  const [aiRefImages, setAiRefImages] = useState([]);
  const [aiRefLoading, setAiRefLoading] = useState(null);
  const aiRefInputRef = useRef(null);
  const [plannedSequence, setPlannedSequence] = useState([]);
  const [sequenceExecuting, setSequenceExecuting] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [sequenceNeedsRef, setSequenceNeedsRef] = useState(false);
  const [executingPlan, setExecutingPlan] = useState(false);
  const [planCollapsed, setPlanCollapsed] = useState(false);
  const [planProgress, setPlanProgress] = useState(0);
  const [videoCameraMovement, setVideoCameraMovement] = useState(null);
  const [videoSubjectMotion, setVideoSubjectMotion] = useState(null);
  const [videoBackgroundMotion, setVideoBackgroundMotion] = useState(null);
  const [videoObjectMotion, setVideoObjectMotion] = useState(null);
  const [videoPromptWarnings, setVideoPromptWarnings] = useState([]);
  const [showVideoPromptPreview, setShowVideoPromptPreview] = useState(false);
  const [videoMotionTab, setVideoMotionTab] = useState("camera");
  const [mode, setMode] = useState("video");
  const [imageTarget, setImageTarget] = useState(null);
  const [includeCameraSettings, setIncludeCameraSettings] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
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
  const buildVideoMotionPrompt = () => {
    const parts = [];
    if (videoCameraMovement) {
      const movement = CAMERA_MOVEMENTS[videoCameraMovement] || videoCameraMovement;
      parts.push(movement);
    }
    if (videoSubjectMotion) {
      const motion = SUBJECT_MOTIONS[videoSubjectMotion] || videoSubjectMotion;
      parts.push(motion);
    }
    if (videoBackgroundMotion) {
      const bgMotion = BACKGROUND_MOTIONS[videoBackgroundMotion] || videoBackgroundMotion;
      parts.push(bgMotion);
    }
    if (videoObjectMotion) {
      parts.push(videoObjectMotion);
    }
    if (parts.length === 0 && promptText) {
      return promptText;
    }
    const prompt = parts.join(", ");
    const hasEndpoint = MOTION_ENDPOINTS.some((e) => prompt.toLowerCase().includes(e.replace("then ", "").replace("comes to ", "")));
    if (prompt && !hasEndpoint) {
      return prompt + ", then settles";
    }
    return prompt;
  };
  useEffect(() => {
    if (mode === "video") {
      const videoPrompt = buildVideoMotionPrompt() || promptText;
      if (videoPrompt) {
        const validation = validateVideoPrompt(videoPrompt);
        setVideoPromptWarnings(validation.warnings);
      } else {
        setVideoPromptWarnings([]);
      }
    }
  }, [mode, videoCameraMovement, videoSubjectMotion, videoBackgroundMotion, videoObjectMotion, promptText]);
  useEffect(() => {
    if (show3DCamera && mode === "video") {
      const qwenPrompt = buildQwenPromptContinuous(cameraAzimuth, cameraElevation, cameraDistance);
      setMotionPrompt(qwenPrompt);
    }
  }, [cameraAzimuth, cameraElevation, cameraDistance, show3DCamera]);
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
  const handleSceneShotSelect = (shot) => {
    setPromptText(shot.photo_prompt);
    setMotionPrompt(shot.motion_prompt);
    const modelMap = {
      "seedance-1.5": "seedance-1.5",
      "kling-o1": "kling-o1",
      "kling-2.6": "kling-2.6"
    };
    if (modelMap[shot.model]) {
      setModel(modelMap[shot.model]);
    }
    if (shot.start_frame) {
      setStartFrame(shot.start_frame);
    }
    if (shot.end_frame) {
      setEndFrame(shot.end_frame);
    }
    if (shot.image_url) {
      setReferenceImage(shot.image_url);
    }
    if (shot.dialog && shot.model === "seedance-1.5") {
      setMode("video");
    }
    setStatusMessage(`Loaded shot: ${shot.shot_id} - ${shot.subject}`);
  };
  const handleGenerateSceneShot = async (shot) => {
    selectSceneShot(shot.shot_id);
    handleSceneShotSelect(shot);
    markShotGenerating(shot.shot_id);
    setStatusMessage(`Generating: ${shot.shot_id}...`);
    try {
      const prompt = shot.photo_prompt || `${shot.subject}, ${shot.shot_type} shot, ${shot.location || ""}, cinematic, 8K`;
      const refImage = shot.start_frame || currentShot.startFrame;
      const response = await fetch("/api/cinema/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: refImage ? "edit" : "image",
          prompt,
          aspect_ratio: currentScene?.aspect_ratio || "16:9",
          resolution: "4K",
          reference_image: refImage || void 0
        })
      });
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.image_url || data.images?.[0]?.url;
        if (imageUrl) {
          markShotComplete(shot.shot_id, imageUrl);
          setStartFrame(imageUrl);
          setStatusMessage(`Generated: ${shot.shot_id}`);
        } else {
          console.error(`No image URL for ${shot.shot_id}:`, data);
          setStatusMessage(`No image URL returned for ${shot.shot_id}`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Failed ${shot.shot_id}:`, errorData);
        setStatusMessage(`Failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(`Error generating ${shot.shot_id}:`, err);
      setStatusMessage(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  };
  const handleGenerateSceneVideo = async (shot) => {
    if (!shot.image_url) {
      setStatusMessage("Generate image first!");
      return;
    }
    setStatusMessage(`Generating video for ${shot.shot_id}...`);
    try {
      let videoType = "video-kling";
      if (shot.model === "seedance-1.5") {
        videoType = "video-seedance";
      } else if (shot.model === "kling-o1" || shot.end_frame) {
        videoType = "video-kling-o1";
      }
      const response = await fetch("/api/cinema/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: videoType,
          prompt: shot.motion_prompt || "subtle motion, cinematic",
          start_image_url: shot.image_url,
          end_image_url: shot.end_frame || void 0,
          duration: String(shot.duration || 5)
        })
      });
      if (response.ok) {
        const data = await response.json();
        const videoUrl = data.video_url;
        if (videoUrl) {
          markShotComplete(shot.shot_id, shot.image_url, videoUrl);
          setStatusMessage(`Video ready: ${shot.shot_id}`);
        } else {
          console.error(`No video URL for ${shot.shot_id}:`, data);
          setStatusMessage(`No video URL returned`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Video failed ${shot.shot_id}:`, errorData);
        setStatusMessage(`Video failed: ${errorData.error || "Unknown"}`);
      }
    } catch (err) {
      console.error(`Video error ${shot.shot_id}:`, err);
      setStatusMessage(`Video error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  };
  const executeEntirePlan = async () => {
    if (!currentScene || executingPlan) return;
    setExecutingPlan(true);
    setPlanProgress(0);
    const buildCharacterSheetPrompt = (char) => {
      if (char.generate_prompt && char.generate_prompt.includes("3x3")) {
        return char.generate_prompt;
      }
      const desc = `${char.description || char.name}${char.costume ? `, wearing ${char.costume}` : ""}`;
      return `Character reference sheet, 3x3 grid layout, ${desc}. Top row: front view, 3/4 view, side profile. Middle row: back view, close-up face, expression variations showing happy and serious and surprised. Bottom row: full body standing pose, action pose, costume and prop details. White background, consistent soft studio lighting, character turnaround style, 4K high detail`;
    };
    const buildSceneRefSheetPrompt = (ref) => {
      if (ref.generate_prompt && ref.generate_prompt.includes("3x3")) {
        return ref.generate_prompt;
      }
      const desc = ref.description || ref.name;
      if (ref.type === "location") {
        return `Location reference sheet, 3x3 grid layout, ${desc}. Top row: wide establishing exterior shot, medium exterior angle, exterior architectural detail. Middle row: wide empty interior view, medium interior shot, interior props and details. Bottom row: dawn golden hour lighting, bright daylight, dusk blue hour atmosphere. Architectural visualization style, cinematic composition, no people, empty spaces, 4K`;
      } else {
        return `Object reference sheet, 3x3 grid layout, ${desc}. Top row: front view, side profile view, rear view. Middle row: 3/4 angle hero shot, top-down view, detail closeup of key features. Bottom row: object in environment context (no people), empty interior view, wide shot showing scale. Product photography style, clean studio lighting, white background, no humans, 4K`;
      }
    };
    const charRefs = Object.values(currentScene.character_references || {}).filter((c) => !c.ref_url);
    const sceneRefs = Object.values(currentScene.scene_references || {}).filter((r) => !r.ref_url);
    const totalRefs = charRefs.length + sceneRefs.length;
    if (totalRefs > 0) {
      setStatusMessage(`Step 1: Generating ${totalRefs} reference sheets (3x3 grids) in parallel...`);
      const refPromises = [
        ...charRefs.map(async (char) => {
          try {
            const prompt = buildCharacterSheetPrompt(char);
            console.log(`Generating char ref: ${char.name}`, prompt);
            const response = await fetch("/api/cinema/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "image",
                prompt,
                aspect_ratio: "1:1",
                // Square for ref sheets
                resolution: "4K"
              })
            });
            if (response.ok) {
              const data = await response.json();
              const url = data.image_url || data.images?.[0]?.url;
              if (url) updateCharacter(char.id, { ref_url: url });
            }
          } catch (err) {
            console.error(`Ref gen failed for ${char.name}:`, err);
          }
        }),
        ...sceneRefs.map(async (ref) => {
          try {
            const prompt = buildSceneRefSheetPrompt(ref);
            console.log(`Generating scene ref: ${ref.name} (${ref.type})`, prompt);
            const response = await fetch("/api/cinema/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "image",
                prompt,
                aspect_ratio: "1:1",
                resolution: "4K"
              })
            });
            if (response.ok) {
              const data = await response.json();
              const url = data.image_url || data.images?.[0]?.url;
              if (url) updateSceneRef(ref.id, { ref_url: url });
            }
          } catch (err) {
            console.error(`Ref gen failed for ${ref.name}:`, err);
          }
        })
      ];
      await Promise.all(refPromises);
      setStatusMessage(`Refs complete! Now generating images...`);
    }
    const pendingShots = currentScene.shots.filter((s) => s.status === "pending");
    if (pendingShots.length === 0) {
      setExecutingPlan(false);
      setStatusMessage("All shots already generated!");
      return;
    }
    const BATCH_SIZE = 4;
    setStatusMessage(`Step 2: Generating ${pendingShots.length} images (${BATCH_SIZE} at a time)...`);
    pendingShots.forEach((shot) => markShotGenerating(shot.shot_id));
    for (let i = 0; i < pendingShots.length; i += BATCH_SIZE) {
      const batch = pendingShots.slice(i, i + BATCH_SIZE);
      setPlanProgress(i);
      setStatusMessage(`Generating images ${i + 1}-${Math.min(i + BATCH_SIZE, pendingShots.length)} of ${pendingShots.length}...`);
      const imagePromises = batch.map(async (shot) => {
        try {
          const prompt = shot.photo_prompt || `${shot.subject}, ${shot.shot_type} shot, ${shot.location || ""}, cinematic, 8K`;
          const refUrls = getRefUrlsForShot(shot);
          const response = await fetch("/api/cinema/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: refUrls.length > 0 ? "edit" : "image",
              prompt,
              aspect_ratio: currentScene.aspect_ratio || "16:9",
              resolution: "4K",
              image_urls: refUrls.length > 0 ? refUrls : void 0
            })
          });
          if (response.ok) {
            const data = await response.json();
            const imageUrl = data.image_url || data.images?.[0]?.url;
            if (imageUrl) {
              markShotComplete(shot.shot_id, imageUrl);
              return { shot_id: shot.shot_id, image_url: imageUrl, success: true };
            }
          }
          return { shot_id: shot.shot_id, success: false };
        } catch (err) {
          console.error(`Image error for ${shot.shot_id}:`, err);
          return { shot_id: shot.shot_id, success: false };
        }
      });
      await Promise.all(imagePromises);
    }
    setStatusMessage(`All images done! Now generating videos in parallel...`);
    const shotsWithImages = currentScene.shots.filter((s) => s.image_url && !s.video_url);
    if (shotsWithImages.length > 0) {
      setStatusMessage(`Step 3: Generating ${shotsWithImages.length} videos (${BATCH_SIZE} at a time)...`);
      for (let i = 0; i < shotsWithImages.length; i += BATCH_SIZE) {
        const batch = shotsWithImages.slice(i, i + BATCH_SIZE);
        setPlanProgress(i);
        setStatusMessage(`Generating videos ${i + 1}-${Math.min(i + BATCH_SIZE, shotsWithImages.length)} of ${shotsWithImages.length}...`);
        const videoPromises = batch.map(async (shot) => {
          try {
            let videoType = "video-kling";
            if (shot.model === "seedance-1.5") {
              videoType = "video-seedance";
            } else if (shot.model === "kling-o1" || shot.end_frame) {
              videoType = "video-kling-o1";
            }
            const videoResponse = await fetch("/api/cinema/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: videoType,
                prompt: shot.motion_prompt || "subtle motion, cinematic",
                start_image_url: shot.image_url,
                end_image_url: shot.end_frame || void 0,
                duration: String(shot.duration || 5)
              })
            });
            if (videoResponse.ok) {
              const videoData = await videoResponse.json();
              const videoUrl = videoData.video_url;
              if (videoUrl) {
                markShotComplete(shot.shot_id, shot.image_url, videoUrl);
                return { shot_id: shot.shot_id, success: true };
              }
            }
            return { shot_id: shot.shot_id, success: false };
          } catch (err) {
            console.error(`Video error for ${shot.shot_id}:`, err);
            return { shot_id: shot.shot_id, success: false };
          }
        });
        await Promise.all(videoPromises);
      }
    }
    setExecutingPlan(false);
    setPlanProgress(0);
    setStatusMessage(`Plan complete! ${pendingShots.length} shots generated.`);
  };
  const stopPlanExecution = () => {
    setExecutingPlan(false);
    setPlanProgress(0);
    setStatusMessage("Plan execution stopped.");
  };
  const executeAllVideos = async () => {
    if (!currentScene || executingPlan) return;
    const shotsNeedingVideo = currentScene.shots.filter((s) => s.image_url && !s.video_url);
    if (shotsNeedingVideo.length === 0) {
      setStatusMessage("All videos already generated!");
      return;
    }
    setExecutingPlan(true);
    setPlanProgress(0);
    setStatusMessage(`Generating ${shotsNeedingVideo.length} videos...`);
    for (let i = 0; i < shotsNeedingVideo.length; i++) {
      const shot = shotsNeedingVideo[i];
      setPlanProgress(i + 1);
      setStatusMessage(`Video ${i + 1}/${shotsNeedingVideo.length}: ${shot.shot_id}`);
      try {
        let videoType = "video-kling";
        if (shot.model === "seedance-1.5") {
          videoType = "video-seedance";
        } else if (shot.model === "kling-o1" || shot.end_frame) {
          videoType = "video-kling-o1";
        }
        const response = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: videoType,
            prompt: shot.motion_prompt || "subtle motion, cinematic",
            start_image_url: shot.image_url,
            end_image_url: shot.end_frame || void 0,
            duration: String(shot.duration || 5)
          })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.video_url) {
            markShotComplete(shot.shot_id, shot.image_url, data.video_url);
            setStatusMessage(`Video ${i + 1}/${shotsNeedingVideo.length} done!`);
          } else {
            console.error(`No video URL for ${shot.shot_id}`);
            setStatusMessage(`Video ${i + 1} failed - no URL`);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Video failed ${shot.shot_id}:`, errorData);
          setStatusMessage(`Video ${i + 1} failed: ${errorData.error || "Unknown"}`);
        }
      } catch (err) {
        console.error(`Video error ${shot.shot_id}:`, err);
        setStatusMessage(`Video ${i + 1} error`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2e3));
    }
    setExecutingPlan(false);
    setPlanProgress(0);
    setStatusMessage(`All ${shotsNeedingVideo.length} videos generated!`);
  };
  const generateAllRefs = async () => {
    if (!currentScene || executingPlan) return;
    const charRefs = Object.values(currentScene.character_references || {}).filter((c) => !c.ref_url && c.generate_prompt);
    const sceneRefs = Object.values(currentScene.scene_references || {}).filter((r) => !r.ref_url && r.generate_prompt);
    const totalRefs = charRefs.length + sceneRefs.length;
    if (totalRefs === 0) {
      setStatusMessage("All references already generated!");
      return;
    }
    setExecutingPlan(true);
    setPlanProgress(0);
    setStatusMessage(`Generating ${totalRefs} reference images...`);
    let completed = 0;
    for (const char of charRefs) {
      completed++;
      setPlanProgress(completed);
      setStatusMessage(`Ref ${completed}/${totalRefs}: ${char.name} (character sheet)`);
      try {
        const response = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "image",
            prompt: char.generate_prompt,
            aspect_ratio: "1:1",
            // Square for 3x3 grid sheets
            resolution: "4K"
          })
        });
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.image_url || data.images?.[0]?.url;
          if (imageUrl) {
            updateCharacter(char.id, { ref_url: imageUrl });
            setStatusMessage(`✓ ${char.name} ref done`);
          }
        }
      } catch (err) {
        console.error(`Failed to generate ref for ${char.name}:`, err);
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    for (const ref of sceneRefs) {
      completed++;
      setPlanProgress(completed);
      setStatusMessage(`Ref ${completed}/${totalRefs}: ${ref.name} (${ref.type} sheet)`);
      try {
        const response = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "image",
            prompt: ref.generate_prompt,
            aspect_ratio: "1:1",
            // Square for all 3x3 grid sheets
            resolution: "4K"
          })
        });
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.image_url || data.images?.[0]?.url;
          if (imageUrl) {
            updateSceneRef(ref.id, { ref_url: imageUrl });
            setStatusMessage(`✓ ${ref.name} ref done`);
          }
        }
      } catch (err) {
        console.error(`Failed to generate ref for ${ref.name}:`, err);
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    setExecutingPlan(false);
    setPlanProgress(0);
    setStatusMessage(`All ${totalRefs} reference images generated!`);
  };
  const getRefUrlsForShot = (shot) => {
    if (!currentScene) return [];
    const refs = [];
    Object.values(currentScene.character_references || {}).forEach((char) => {
      if (char.ref_url && (shot.subject?.toLowerCase().includes(char.name.toLowerCase()) || shot.photo_prompt?.toLowerCase().includes(char.name.toLowerCase()))) {
        refs.push(char.ref_url);
      }
    });
    Object.values(currentScene.scene_references || {}).forEach((ref) => {
      if (ref.ref_url && ref.type === "location" && shot.location?.toLowerCase().includes(ref.name.toLowerCase())) {
        refs.push(ref.ref_url);
      }
    });
    Object.values(currentScene.scene_references || {}).forEach((ref) => {
      if (ref.ref_url && ref.type !== "location" && (shot.subject?.toLowerCase().includes(ref.name.toLowerCase()) || shot.photo_prompt?.toLowerCase().includes(ref.name.toLowerCase()))) {
        refs.push(ref.ref_url);
      }
    });
    return refs;
  };
  const handleAIGenerate = async () => {
    if (!aiInput.trim()) {
      setAiError("Please enter a description");
      return;
    }
    setAiGenerating(true);
    setAiError(null);
    try {
      const context = {
        mode,
        model: currentShot.model,
        aspectRatio,
        resolution,
        characterDNA,
        isSequenceContinuation: sequencePlan.length > 0,
        currentPrompt: mode === "image" ? promptText : currentShot.motionPrompt
      };
      const response = await fetch("/api/ai/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: aiInput,
          context,
          model: "mistral"
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || "AI generation failed");
      }
      if (mode === "image") {
        setPromptText(data.prompt);
      } else {
        setMotionPrompt(data.prompt);
      }
      setAiInput("");
      setShowAIPrompt(false);
    } catch (err) {
      console.error("AI prompt error:", err);
      setAiError(err instanceof Error ? err.message : "Failed to generate prompt");
    } finally {
      setAiGenerating(false);
    }
  };
  const checkOllamaStatus = async () => {
    try {
      const response = await fetch("/api/ai/prompt", { method: "GET" });
      const data = await response.json();
      setOllamaStatus(data.status === "ok" ? "ok" : "error");
    } catch {
      setOllamaStatus("error");
    }
  };
  const handleAIChat = async () => {
    if (!aiInput.trim()) {
      setAiError("Please enter a message");
      return;
    }
    const userMessage = aiInput.trim();
    setAiInput("");
    setAiGenerating(true);
    setAiError(null);
    setAiChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setTimeout(() => {
      if (aiChatRef.current) {
        aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
      }
    }, 100);
    try {
      const sessionContext = buildChatContext();
      const messageWithContext = sessionContext ? `${userMessage}
${sessionContext}` : userMessage;
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageWithContext,
          sessionId: aiSessionId,
          model: "qwen3:8b"
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || "Chat failed");
      }
      setAiChatHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
      setTimeout(() => {
        if (aiChatRef.current) {
          aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("AI chat error:", err);
      setAiError(err instanceof Error ? err.message : "Chat failed");
      setAiChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setAiGenerating(false);
    }
  };
  const usePromptFromChat = (content, index) => {
    setPromptText(content);
    if (mode === "video") {
      setMotionPrompt(content);
    }
    setAiCopiedIndex(index);
    setTimeout(() => setAiCopiedIndex(null), 2e3);
  };
  const clearAIChatHistory = async () => {
    setAiChatHistory([]);
    setAiRefImages([]);
    try {
      await fetch(`/api/ai/chat?sessionId=${aiSessionId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to clear chat history:", err);
    }
  };
  const handleAiRefImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (aiRefImages.length >= 7) {
      setAiError("Maximum 7 reference images allowed");
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      const newIndex = aiRefImages.length;
      setAiRefImages((prev) => [...prev, { url: dataUrl, description: null }]);
      setAiRefLoading(newIndex);
      try {
        const response = await fetch("/api/cinema/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: dataUrl,
            prompt: "Describe this image in detail for a cinematographer. Include: subject, composition, lighting, colors, mood, camera angle, and any notable visual elements."
          })
        });
        if (response.ok) {
          const data = await response.json();
          setAiRefImages((prev) => prev.map(
            (img, i) => i === newIndex ? { ...img, description: data.description || "Image uploaded" } : img
          ));
        } else {
          setAiRefImages((prev) => prev.map(
            (img, i) => i === newIndex ? { ...img, description: "Reference image " + (newIndex + 1) } : img
          ));
        }
      } catch (err) {
        console.error("Vision analysis failed:", err);
        setAiRefImages((prev) => prev.map(
          (img, i) => i === newIndex ? { ...img, description: "Reference image " + (newIndex + 1) } : img
        ));
      } finally {
        setAiRefLoading(null);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const removeAiRefImage = (index) => {
    setAiRefImages((prev) => prev.filter((_, i) => i !== index));
  };
  const uploadLocalImageToCatbox = async (localPath) => {
    try {
      const response = await fetch(localPath);
      if (!response.ok) return null;
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("reqtype", "fileupload");
      formData.append("fileToUpload", blob, "movie-shot.jpg");
      const uploadResponse = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData
      });
      const url = await uploadResponse.text();
      if (url && url.startsWith("https://")) {
        return url.trim();
      }
      return null;
    } catch (err) {
      console.error("Failed to upload movie shot to Catbox:", err);
      return null;
    }
  };
  const handleSelectMovieShots = async (shots2) => {
    if (shots2.length === 0) return;
    setShowMovieShots(false);
    setGenerating(true);
    setProgress(0);
    setStatusMessage("Uploading movie shot references...");
    try {
      const primaryShot = shots2[0];
      setProgress(10);
      const primaryUrl = await uploadLocalImageToCatbox(primaryShot.imageUrl);
      if (!primaryUrl) {
        throw new Error("Failed to upload primary shot");
      }
      setReferenceImage(primaryUrl);
      setStartFrame(primaryUrl);
      setProgress(40);
      if (shots2.length > 1) {
        const additionalRefs = [];
        for (let i = 1; i < shots2.length; i++) {
          setProgress(40 + i / shots2.length * 50);
          setStatusMessage(`Uploading reference ${i + 1}/${shots2.length}...`);
          const url = await uploadLocalImageToCatbox(shots2[i].imageUrl);
          if (url) {
            additionalRefs.push({
              url,
              description: shots2[i].shot.prompt
            });
          }
        }
        if (additionalRefs.length > 0) {
          setAiRefImages((prev) => {
            const combined = [...prev, ...additionalRefs];
            return combined.slice(0, 7);
          });
        }
      }
      let finalPrompt = primaryShot.shot.prompt || "";
      if (selectedAssetForSwap && finalPrompt) {
        finalPrompt = `USE MY CHARACTER REFERENCE: ${selectedAssetForSwap.description}. Replace any person/character in this shot with my character from the reference image. ${finalPrompt}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`;
      } else if (characterDNA && finalPrompt) {
        finalPrompt = `USE MY CHARACTER REFERENCE: ${characterDNA}. Replace any person/character in this shot with my character from the reference image. ${finalPrompt}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`;
      } else if (referenceImage && finalPrompt) {
        finalPrompt = `USE CHARACTER FROM REFERENCE IMAGE: Replace any person/character in this shot with the character shown in my reference image. Maintain exact appearance, clothing, features. ${finalPrompt}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`;
      }
      if (finalPrompt) {
        setPromptText(finalPrompt);
      }
      if (primaryShot.shot.camera3d) {
        setCameraAzimuth(primaryShot.shot.camera3d.azimuth || 0);
        setCameraElevation(primaryShot.shot.camera3d.elevation || 0);
        setCameraDistance(primaryShot.shot.camera3d.distance || 1);
      }
      const directorMap = {
        "stanley-kubrick": 0,
        "steven-spielberg": 1,
        "quentin-tarantino": 2,
        "david-fincher": 3,
        "christopher-nolan": 4,
        "denis-villeneuve": 5,
        "wes-anderson": 6,
        "terrence-malick": 10
      };
      if (primaryShot.shot.director && directorMap[primaryShot.shot.director] !== void 0) {
        setDirectorIndex(directorMap[primaryShot.shot.director]);
      }
      const emotionMap = {
        "awe": 0,
        "melancholy": 1,
        "tense": 2,
        "love": 3,
        "fear": 4,
        "loneliness": 5,
        "mysterious": 6,
        "hope": 7,
        "sadness": 8,
        "contemplative": 9,
        "peaceful": 10
      };
      if (primaryShot.shot.emotion && emotionMap[primaryShot.shot.emotion] !== void 0) {
        setEmotionIndex(emotionMap[primaryShot.shot.emotion]);
      }
      setStatusMessage("Movie shot references ready!");
      setProgress(100);
    } catch (err) {
      console.error("Failed to process movie shots:", err);
      setStatusMessage("Failed to upload movie shots");
    } finally {
      setTimeout(() => {
        setGenerating(false);
        setStatusMessage(null);
        setProgress(0);
      }, 1500);
    }
  };
  const handleAddAsset = (asset) => {
    setUserAssets((prev) => [...prev, asset]);
    localStorage.setItem("cinema-user-assets", JSON.stringify([...userAssets, asset]));
  };
  const handleRemoveAsset = (assetId) => {
    setUserAssets((prev) => {
      const updated = prev.filter((a) => a.id !== assetId);
      localStorage.setItem("cinema-user-assets", JSON.stringify(updated));
      return updated;
    });
    if (selectedAssetForSwap?.id === assetId) {
      setSelectedAssetForSwap(null);
    }
  };
  useEffect(() => {
    const savedAssets = localStorage.getItem("cinema-user-assets");
    if (savedAssets) {
      try {
        setUserAssets(JSON.parse(savedAssets));
      } catch (e) {
        console.error("Failed to load saved assets:", e);
      }
    }
  }, []);
  const detectShotPlan = (content) => {
    if (extractScenePlan(content)) return true;
    const patterns = [
      /SHOT\s*\d+\s*[:\(]/i,
      /Shot\s*\d+\s*[:\(]/i,
      /^\d+\.\s*(WIDE|MEDIUM|CLOSE|ESTABLISHING|ECU|POV)/im,
      /\(ESTABLISHING\)|\(WIDE\)|\(MEDIUM\)|\(CLOSE-UP\)|\(ECU\)/i
    ];
    return patterns.some((p) => p.test(content));
  };
  const detectJsonPlan = (content) => {
    return extractScenePlan(content) !== null;
  };
  const parseShotPlan = (content) => {
    const shots2 = [];
    const shotBlocks = content.split(/(?=SHOT\s*\d+|Shot\s*\d+|^\d+\.\s*\()/im).filter(Boolean);
    for (const block of shotBlocks) {
      const numMatch = block.match(/(?:SHOT|Shot)\s*(\d+)|^(\d+)\./i);
      if (!numMatch) continue;
      const shotNumber = parseInt(numMatch[1] || numMatch[2]);
      const typeMatch = block.match(/\((ESTABLISHING|WIDE|MEDIUM|CLOSE-UP|CLOSE|ECU|POV|FULL|MASTER)\)/i);
      const shotType = typeMatch ? typeMatch[1].toUpperCase() : "MEDIUM";
      const camMatch = block.match(/(?:camera|movement|motion)[:\s]+([^,\n]+)/i);
      const cameraMovement = camMatch ? camMatch[1].trim() : "static";
      const actionMatch = block.match(/(?:subject|action|actor)[:\s]+([^,\n]+)/i);
      const subjectAction = actionMatch ? actionMatch[1].trim() : "";
      let prompt = block.replace(/^(?:SHOT|Shot)\s*\d+\s*[:\(]?[^:]*[:\)]?\s*/i, "").replace(/^\d+\.\s*\([^)]*\)\s*/i, "").trim();
      const motionMatch = prompt.match(/(?:VIDEO|MOTION)[:\s]+([^\n]+)/i);
      const motionPrompt = motionMatch ? motionMatch[1].trim() : void 0;
      if (motionMatch) {
        prompt = prompt.replace(/(?:VIDEO|MOTION)[:\s]+[^\n]+/i, "").trim();
      }
      shots2.push({
        shotNumber,
        shotType,
        cameraMovement,
        subjectAction,
        prompt,
        motionPrompt,
        status: "pending"
      });
    }
    return shots2;
  };
  const loadShotPlan = (content) => {
    const jsonPlan = extractScenePlan(content);
    if (jsonPlan) {
      loadScene(jsonPlan);
      setPlanCollapsed(false);
      return;
    }
    const parsed = parseShotPlan(content);
    if (parsed.length > 0) {
      setPlannedSequence(parsed);
      setSequenceProgress(0);
      setSequenceExecuting(false);
      setSequenceNeedsRef(false);
    }
  };
  const getJsonPlanShotCount = (content) => {
    const plan = extractScenePlan(content);
    return plan?.shots?.length || 0;
  };
  const executeSequence = async () => {
    if (plannedSequence.length === 0) return;
    setSequenceExecuting(true);
    setSequenceNeedsRef(false);
    if (!currentShot.startFrame && !referenceImage) {
      setSequenceNeedsRef(true);
      setSequenceExecuting(false);
      return;
    }
    let lastFrame = currentShot.startFrame || referenceImage || "";
    const COLOR_LOCK = "THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.";
    for (let i = 0; i < plannedSequence.length; i++) {
      setSequenceProgress(i);
      const shot = plannedSequence[i];
      try {
        setPlannedSequence((prev) => prev.map(
          (s, idx) => idx === i ? { ...s, status: "generating-image" } : s
        ));
        let imagePrompt = shot.prompt;
        const dna = characterDNA || "";
        if (i > 0) {
          imagePrompt = `${COLOR_LOCK} ${shot.shotType} shot. ${dna ? dna + ". " : ""}${shot.prompt}`;
        } else if (dna) {
          imagePrompt = `${dna}. ${shot.prompt}`;
        }
        const imageResponse = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "image",
            prompt: imagePrompt,
            aspect_ratio: aspectRatio,
            resolution,
            reference_image: lastFrame
          })
        });
        const imageData = await imageResponse.json();
        if (!imageData.image_url) throw new Error("Image generation failed");
        setPlannedSequence((prev) => prev.map(
          (s, idx) => idx === i ? { ...s, imageUrl: imageData.image_url, status: "generating-video" } : s
        ));
        const compressed = await compressForKling(imageData.image_url);
        const videoPrompt = shot.motionPrompt || `${shot.cameraMovement}, ${shot.subjectAction}, then settles`;
        const selectedModel = autoSelectModel();
        const videoResponse = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedModel === "kling-o1" ? "video-kling-o1" : selectedModel === "seedance-1.5" ? "video-seedance" : "video-kling",
            prompt: videoPrompt,
            [selectedModel === "kling-o1" ? "start_image_url" : "image_url"]: compressed,
            duration: String(currentShot.duration),
            aspect_ratio: aspectRatio
          })
        });
        const videoData = await videoResponse.json();
        if (!videoData.video_url) throw new Error("Video generation failed");
        setPlannedSequence((prev) => prev.map(
          (s, idx) => idx === i ? { ...s, videoUrl: videoData.video_url, status: "completed" } : s
        ));
        const extractedFrame = await extractLastFrame(videoData.video_url);
        if (extractedFrame) {
          lastFrame = extractedFrame;
        }
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`Shot ${i + 1} failed:`, err);
        setPlannedSequence((prev) => prev.map(
          (s, idx) => idx === i ? { ...s, status: "error", error: err instanceof Error ? err.message : "Unknown error" } : s
        ));
      }
    }
    setSequenceExecuting(false);
    setSequenceProgress(plannedSequence.length);
  };
  const resumeSequenceWithRef = () => {
    if (sequenceNeedsRef && currentShot.startFrame) {
      setSequenceNeedsRef(false);
      executeSequence();
    }
  };
  const clearSequence = () => {
    setPlannedSequence([]);
    setSequenceProgress(0);
    setSequenceExecuting(false);
    setSequenceNeedsRef(false);
  };
  const startManualSequence = () => {
    if (sequencePlan.length === 0) return;
    if (!currentShot.startFrame && !referenceImage) {
      setStatusMessage("Add a START FRAME or REF image first");
      setTimeout(() => setStatusMessage(null), 2e3);
      return;
    }
    const converted = sequencePlan.map((shot, idx) => ({
      shotNumber: idx + 1,
      shotType: shot.angle,
      cameraMovement: shot.cameraMove,
      subjectAction: shot.action,
      prompt: `${shot.angle}. ${characterDNA ? characterDNA + ". " : ""}${shot.action}`,
      motionPrompt: `${shot.cameraMove}, ${shot.action}, then settles`,
      status: "pending"
    }));
    setPlannedSequence(converted);
    setShowSequencePlanner(false);
    clearSequencePlan();
    setStatusMessage(`Starting sequence: ${converted.length} shots`);
    setTimeout(() => setStatusMessage(null), 2e3);
    setTimeout(() => {
      executeSequence();
    }, 100);
  };
  const buildChatContext = () => {
    let context = "";
    if (currentShot.startFrame || promptText || currentShot.motionPrompt) {
      context += "\n\n=== CURRENT SHOT ===\n";
      if (currentShot.startFrame) {
        context += `HAS IMAGE: Yes
`;
      }
      if (promptText) {
        context += `IMAGE PROMPT: "${promptText}"
`;
      }
      if (currentShot.motionPrompt) {
        context += `MOTION PROMPT: "${currentShot.motionPrompt}"
`;
      }
      if (currentShot.model) {
        context += `MODEL: ${currentShot.model}
`;
      }
      context += `MODE: ${mode === "image" ? "Image" : "Video"}
`;
      context += `ASPECT: ${aspectRatio} | RES: ${resolution}
`;
      if (characterDNA) {
        context += `CHARACTER DNA: ${characterDNA}
`;
      }
    }
    if (shots.length > 0) {
      context += "\n=== SHOT HISTORY (for sequence planning) ===\n";
      shots.slice(-5).forEach((shot, i) => {
        context += `Shot ${i + 1}: ${shot.motionPrompt || "No prompt"}
`;
      });
      context += `Total shots: ${shots.length}
`;
      context += "\nYou can plan the NEXT shot in the sequence. Use consistency phrases!\n";
    }
    if (sequencePlan.length > 0) {
      context += "\n=== PLANNED SEQUENCE ===\n";
      sequencePlan.forEach((planned, i) => {
        const status = i < currentSequenceIndex ? "DONE" : i === currentSequenceIndex ? "CURRENT" : "PENDING";
        context += `[${status}] Shot ${i + 1}: ${planned.angle} - ${planned.action}
`;
      });
    }
    if (aiRefImages.length > 0) {
      context += "\n=== REFERENCE IMAGES ===\n";
      aiRefImages.forEach((img, i) => {
        context += `[Ref ${i + 1}]: ${img.description || "No description"}
`;
      });
    }
    if (context) {
      context += "\n---\nYou can: modify prompts, plan sequences, suggest next shots, explain cinematography.\n";
    }
    return context;
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
        const allRefUrls = [];
        const primaryRef = currentShot.startFrame || referenceImage;
        if (primaryRef) allRefUrls.push(primaryRef);
        if (aiRefImages.length > 0) {
          allRefUrls.push(...aiRefImages.map((r) => r.url));
        }
        const response = await fetch("/api/cinema/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "image",
            prompt: fullPrompt,
            aspect_ratio: aspectRatio,
            resolution,
            // Send all refs as array (primary ref + aiRefImages)
            image_urls: allRefUrls.length > 0 ? allRefUrls : void 0
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
  useEffect(() => {
    if (promptText.length > 10) {
      const validation = validatePrompt(promptText);
      setPromptWarnings(validation.warnings);
    } else {
      setPromptWarnings([]);
    }
  }, [promptText]);
  const extractLastFrame = async (videoUrl) => {
    try {
      setIsExtractingFrame(true);
      const response = await fetch("/api/cinema/extract-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: videoUrl, position: "last" })
      });
      const data = await response.json();
      if (data.success && data.frame_url) {
        return data.frame_url;
      }
      return null;
    } catch (err) {
      console.error("Frame extraction failed:", err);
      return null;
    } finally {
      setIsExtractingFrame(false);
    }
  };
  const continueStep1ExtractFrame = async () => {
    if (!continueVideoUrl) {
      setContinueError("Please enter a video URL");
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
        setContinueError("Failed to extract frame from video");
      }
    } catch (err) {
      setContinueError("Error extracting frame: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setContinueLoading(false);
    }
  };
  const continueStep2GenerateCloseup = async () => {
    if (!continueExtractedFrame) {
      setContinueError("No frame extracted");
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      let editPrompt = "";
      try {
        const visionResponse = await fetch("/api/cinema/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: continueExtractedFrame,
            task: "closeup",
            character_dna: characterDNA || void 0
          })
        });
        if (visionResponse.ok) {
          const visionData = await visionResponse.json();
          if (visionData.success && visionData.closeup_prompt) {
            editPrompt = visionData.closeup_prompt;
            console.log("Vision Agent close-up prompt:", editPrompt);
          }
        }
      } catch (visionErr) {
        console.warn("Vision Agent not available, using fallback prompt");
      }
      if (!editPrompt) {
        const dnaPrefix = characterDNA ? `${characterDNA}. ` : "";
        editPrompt = `${dnaPrefix}THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Cinematic close-up shot, face fills 70% of frame, shallow depth of field f/1.4,
soft bokeh background, prepared for dialogue scene, expressive eyes with catchlight,
natural skin texture, subtle rim light. Same costume, same lighting direction.
8K detail, photorealistic, cinematic color grading.`;
      }
      const response = await fetch("/api/cinema/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "edit",
          image_urls: [continueExtractedFrame],
          prompt: editPrompt,
          aspect_ratio: "16:9",
          resolution: "2K"
        })
      });
      const data = await response.json();
      if (data.image_url) {
        setContinueCloseupUrl(data.image_url);
        setContinueStep(3);
      } else {
        setContinueError("Failed to generate close-up: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setContinueError("Error generating close-up: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setContinueLoading(false);
    }
  };
  const continueStep3GenerateDialogue = async () => {
    if (!continueCloseupUrl || !continueDialogue.trim()) {
      setContinueError("Please enter the dialogue text");
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      const seedancePrompt = `Close-up on face, soft focus on eyes, natural expressions.
Slow push-in, focus locked on eyes, minimal shake.
Subject speaks warmly: "${continueDialogue}"
Cinematic UGC style, clean audio, natural room tone, then settles.`;
      const response = await fetch("/api/cinema/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video-seedance",
          image_url: continueCloseupUrl,
          prompt: seedancePrompt,
          duration: "5",
          aspect_ratio: "16:9"
        })
      });
      const data = await response.json();
      if (data.video_url) {
        setContinueDialogueVideoUrl(data.video_url);
        setContinueStep(4);
      } else {
        setContinueError("Failed to generate dialogue video: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setContinueError("Error generating dialogue: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setContinueLoading(false);
    }
  };
  const continueStep4StitchVideos = async () => {
    if (!continueVideoUrl || !continueDialogueVideoUrl) {
      setContinueError("Missing videos to stitch");
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    try {
      const response = await fetch("/api/cinema/stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videos: [continueVideoUrl, continueDialogueVideoUrl]
        })
      });
      const data = await response.json();
      if (data.video_url) {
        window.open(data.video_url, "_blank");
        setShowContinueFromVideo(false);
        setContinueVideoUrl("");
        setContinueExtractedFrame(null);
        setContinueCloseupUrl(null);
        setContinueDialogue("");
        setContinueDialogueVideoUrl(null);
        setContinueStep(1);
      } else {
        setContinueError("Failed to stitch videos: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setContinueError("Error stitching: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setContinueLoading(false);
    }
  };
  const resetContinueWorkflow = () => {
    setContinueVideoUrl("");
    setContinueExtractedFrame(null);
    setContinueCloseupUrl(null);
    setContinueDialogue("");
    setContinueDialogueVideoUrl(null);
    setContinueStep(1);
    setContinueError(null);
    setContinueLoading(false);
    setContinueLocalFileName(null);
    if (continueVideoInputRef.current) {
      continueVideoInputRef.current.value = "";
    }
  };
  const handleContinueLocalVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setContinueError("Please select a video file");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setContinueError("Video file too large (max 200MB)");
      return;
    }
    setContinueLoading(true);
    setContinueError(null);
    setContinueLocalFileName(file.name);
    try {
      const formData = new FormData();
      formData.append("reqtype", "fileupload");
      formData.append("fileToUpload", file);
      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData
      });
      const url = await response.text();
      if (url && url.startsWith("https://")) {
        setContinueVideoUrl(url.trim());
        setContinueError(null);
      } else {
        setContinueError("Upload failed: " + url);
        setContinueLocalFileName(null);
      }
    } catch (err) {
      setContinueError("Upload error: " + (err instanceof Error ? err.message : "Unknown"));
      setContinueLocalFileName(null);
    } finally {
      setContinueLoading(false);
    }
  };
  const callVisionAgent = async (referenceImageUrl, previousPrompt2, director, storyBeat, shotNumber, shotHistory = []) => {
    console.log("🎬 Calling Vision Agent...", {
      hasDirector: !!director,
      directorName: director?.name || "NONE",
      storyBeat,
      shotNumber,
      historyLength: shotHistory.length
    });
    try {
      const response = await fetch("http://localhost:5678/webhook/vision-edit-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference_image_url: referenceImageUrl,
          previous_prompt: previousPrompt2,
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
        console.warn("❌ Vision agent returned non-OK status:", response.status);
        return null;
      }
      const data = await response.json();
      console.log("📥 Vision Agent Response:", data);
      if (data.success && data.edit_prompt) {
        console.log("✅ VISION AGENT SUCCESS!");
        console.log("🔍 Detected in image:", data.detected_in_image);
        console.log("📝 Changes from original:", data.changes_from_original);
        console.log("🎬 Director reasoning:", data.director_reasoning);
        return `🤖 ${data.edit_prompt}`;
      }
      console.warn("⚠️ Vision agent response missing data:", data);
      return null;
    } catch (err) {
      console.error("❌ Vision agent FAILED:", err);
      return null;
    }
  };
  const handleChainToNext = async () => {
    let previousGeneratedImage = null;
    if (currentShot.videoUrl) {
      const extractedFrame = await extractLastFrame(currentShot.videoUrl);
      previousGeneratedImage = extractedFrame || currentShot.startFrame;
    } else {
      previousGeneratedImage = currentShot.startFrame;
    }
    const currentPromptText = promptText;
    setPreviousPrompt(currentPromptText);
    saveCurrentAsShot();
    if (previousGeneratedImage) {
      setStartFrame(previousGeneratedImage);
    }
    setPromptText("");
    setChainPrompt(false);
    setMode("image");
    const director = directorIndex !== null ? DIRECTOR_PRESETS[directorIndex] : null;
    const shotNum = shots.length + 1;
    const promptLower = currentPromptText.toLowerCase();
    let storyBeat = "journey";
    const beatKeywords = {
      danger: ["danger", "threat", "enemy", "attack", "chase", "run"],
      emotion: ["cry", "sad", "happy", "love", "fear", "angry"],
      confrontation: ["face", "confront", "argue", "fight", "stand"],
      calm: ["rest", "peace", "quiet", "sit", "think", "look"]
    };
    for (const [beat, keywords] of Object.entries(beatKeywords)) {
      if (keywords.some((k) => promptLower.includes(k))) {
        storyBeat = beat;
        break;
      }
    }
    let suggestion = null;
    if (previousGeneratedImage) {
      const shotHistory = shots.map((s) => ({
        prompt: s.motionPrompt,
        startFrame: s.startFrame || void 0
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
    if (!suggestion) {
      console.log("⚠️ Using LOCAL fallback (generateEditPrompt) - Vision Agent did not respond");
      suggestion = `📋 ${generateEditPrompt(director, currentPromptText, shotNum)}`;
    }
    setDirectorSuggestion(suggestion);
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
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0d0d0d] text-white flex", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-video bg-[#151515] rounded-xl overflow-hidden border border-gray-800/30", children: [
        playingShot && shots.find((s) => s.id === playingShot)?.videoUrl ? /* @__PURE__ */ jsx(
          "video",
          {
            src: shots.find((s) => s.id === playingShot)?.videoUrl || void 0,
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
    showCharacterDNA && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowCharacterDNA(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-lg text-xs font-medium text-teal-300", children: "Character DNA" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Consistent character for shot chaining" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowCharacterDNA(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-[#2a2a2a] rounded-xl p-4 mb-5 border border-gray-700/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4 text-teal-400", children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsx("path", { d: "M12 16v-4M12 8h.01" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-300 font-medium mb-1", children: "Why Character DNA?" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 leading-relaxed", children: "When chaining multiple shots, AI can drift character features (face, clothing, colors). Character DNA is your reusable description that stays constant across ALL shots. Copy-paste this exact text into every prompt for consistent characters." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-400 block", children: "Character Description (copy-paste this into all prompts)" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: characterDNA || "",
            onChange: (e) => setCharacterDNA(e.target.value || null),
            placeholder: "Example: Asian man in his 40s, weathered face, salt-pepper stubble, worn tan flight suit with mission patches, determined eyes, short cropped black hair",
            className: "w-full h-32 bg-[#252525] rounded-xl border border-gray-700/50 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-5 border-t border-gray-700", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mb-3", children: "Quick Templates (click to use)" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: [
          "Young woman, mid-20s, long dark hair, casual outfit, confident expression",
          "Elderly man, white beard, weathered face, warm eyes, comfortable sweater",
          "Child, about 8 years old, curious expression, colorful clothes, messy hair",
          "Professional in suit, sharp features, glasses, serious demeanor"
        ].map((template, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setCharacterDNA(template),
            className: "px-3 py-1.5 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-[10px] text-gray-400 hover:text-gray-200 transition-colors",
            children: [
              template.substring(0, 40),
              "..."
            ]
          },
          i
        )) })
      ] }),
      characterDNA && /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-5 border-t border-gray-700", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mb-3", children: "Generate Character Image from DNA" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: aspectRatio,
              onChange: (e) => setAspectRatio(e.target.value),
              className: "bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "1:1", children: "1:1 (Square)" }),
                /* @__PURE__ */ jsx("option", { value: "16:9", children: "16:9 (Wide)" }),
                /* @__PURE__ */ jsx("option", { value: "21:9", children: "21:9 (Cinema)" }),
                /* @__PURE__ */ jsx("option", { value: "9:16", children: "9:16 (Portrait)" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: async () => {
                if (!characterDNA) return;
                setShowCharacterDNA(false);
                startGeneration();
                setProgress(10);
                setStatusMessage("Generating character from DNA...");
                try {
                  const characterPrompt = `${characterDNA}. Character portrait, high quality, 4K, detailed, clean background, centered composition.`;
                  const response = await fetch("/api/cinema/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "image",
                      prompt: characterPrompt,
                      aspect_ratio: aspectRatio,
                      resolution: "4K"
                    })
                  });
                  setProgress(50);
                  const data = await response.json();
                  if (data.image_url) {
                    setProgress(100);
                    setReferenceImage(data.image_url);
                    setStartFrame(data.image_url);
                    setStatusMessage("Character generated! Set as reference.");
                    setTimeout(() => {
                      failGeneration("");
                      setStatusMessage(null);
                    }, 2e3);
                  } else {
                    throw new Error(data.error || "Generation failed");
                  }
                } catch (err) {
                  failGeneration(err instanceof Error ? err.message : "Unknown error");
                }
              },
              disabled: isGenerating,
              className: "flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2",
              children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Generating..."
              ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Generate Character Image" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 mt-2", children: "Creates a character image from your DNA description and sets it as the reference for all shots." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setCharacterDNA(null),
            className: "px-4 py-2.5 bg-[#2a2a2a] hover:bg-gray-700 rounded-xl text-xs text-gray-400 transition-colors",
            children: "Clear"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowCharacterDNA(false),
            className: "flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-black rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity",
            children: "Save Character DNA"
          }
        )
      ] })
    ] }) }),
    showSequencePlanner && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowSequencePlanner(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg text-xs font-medium text-orange-300", children: "Sequence Planner" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Plan multiple shots before generating" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowSequencePlanner(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      characterDNA && /* @__PURE__ */ jsxs("div", { className: "bg-teal-950/30 border border-teal-700/50 rounded-xl p-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-teal-400 uppercase mb-1 font-medium", children: "Character DNA (applied to all shots)" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-teal-200", children: characterDNA })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-5 max-h-[40vh] overflow-y-auto", children: sequencePlan.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
        /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-12 h-12 mx-auto mb-3 opacity-50", children: [
          /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
          /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
          /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
          /* @__PURE__ */ jsx("path", { d: "M14 17.5h7M17.5 14v7" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm", children: "No shots planned yet" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs mt-1", children: "Add shots below to build your sequence" })
      ] }) : sequencePlan.map((shot, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-3 p-3 rounded-xl border transition-all ${shot.status === "complete" ? "bg-green-950/30 border-green-700/50" : shot.status === "generating" ? "bg-orange-950/30 border-orange-700/50" : "bg-[#2a2a2a] border-gray-700/50"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${shot.status === "complete" ? "bg-green-500/20 text-green-400" : shot.status === "generating" ? "bg-orange-500/20 text-orange-400" : "bg-gray-700 text-gray-400"}`, children: shot.status === "complete" ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M5 13l4 4L19 7" }) }) : shot.status === "generating" ? /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: idx + 1 }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-white", children: shot.angle }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500", children: "•" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: shot.cameraMove })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500 truncate", children: shot.action })
            ] }),
            shot.status === "planned" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removePlannedShot(shot.id),
                className: "w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors",
                children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-3.5 h-3.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
              }
            )
          ]
        },
        shot.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-[#252525] rounded-xl p-4 border border-gray-700/50", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mb-3", children: "Add New Shot" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-gray-500 block mb-1", children: "Shot Type" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "seq-angle",
                className: "w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-2",
                defaultValue: "",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select..." }),
                  /* @__PURE__ */ jsx("option", { value: "Wide shot", children: "Wide shot" }),
                  /* @__PURE__ */ jsx("option", { value: "Medium shot", children: "Medium shot" }),
                  /* @__PURE__ */ jsx("option", { value: "Closeup", children: "Closeup" }),
                  /* @__PURE__ */ jsx("option", { value: "Extreme closeup", children: "Extreme closeup" }),
                  /* @__PURE__ */ jsx("option", { value: "Over shoulder", children: "Over shoulder" }),
                  /* @__PURE__ */ jsx("option", { value: "Side profile", children: "Side profile" }),
                  /* @__PURE__ */ jsx("option", { value: "Low angle", children: "Low angle" }),
                  /* @__PURE__ */ jsx("option", { value: "High angle", children: "High angle" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-gray-500 block mb-1", children: "Camera Move" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "seq-camera",
                className: "w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-2",
                defaultValue: "",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select..." }),
                  /* @__PURE__ */ jsx("option", { value: "static", children: "Static" }),
                  /* @__PURE__ */ jsx("option", { value: "dolly in", children: "Dolly in" }),
                  /* @__PURE__ */ jsx("option", { value: "dolly out", children: "Dolly out" }),
                  /* @__PURE__ */ jsx("option", { value: "orbit left", children: "Orbit left" }),
                  /* @__PURE__ */ jsx("option", { value: "orbit right", children: "Orbit right" }),
                  /* @__PURE__ */ jsx("option", { value: "pan left", children: "Pan left" }),
                  /* @__PURE__ */ jsx("option", { value: "pan right", children: "Pan right" }),
                  /* @__PURE__ */ jsx("option", { value: "push in", children: "Push in" }),
                  /* @__PURE__ */ jsx("option", { value: "steadicam follow", children: "Steadicam follow" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-gray-500 block mb-1", children: "Action/Description" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "seq-action",
                type: "text",
                placeholder: "e.g., character turns head",
                className: "w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-3"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const angleEl = document.getElementById("seq-angle");
              const cameraEl = document.getElementById("seq-camera");
              const actionEl = document.getElementById("seq-action");
              if (angleEl.value && cameraEl.value && actionEl.value) {
                addPlannedShot({
                  angle: angleEl.value,
                  cameraMove: cameraEl.value,
                  action: actionEl.value
                });
                angleEl.value = "";
                cameraEl.value = "";
                actionEl.value = "";
              }
            },
            className: "mt-3 w-full h-9 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-xs font-semibold transition-colors",
            children: "+ Add Shot to Sequence"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-5 pt-5 border-t border-gray-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setAutoChaining(!isAutoChaining),
              className: `w-12 h-6 rounded-full transition-colors relative ${isAutoChaining ? "bg-orange-500" : "bg-gray-700"}`,
              children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isAutoChaining ? "left-6" : "left-0.5"}` })
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white font-medium", children: "Auto-Chain Mode" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500", children: "Automatically generate next shot when current completes" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: clearSequencePlan,
              className: "px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors",
              children: "Clear All"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: startManualSequence,
              disabled: sequencePlan.length === 0 || !currentShot.startFrame && !referenceImage,
              className: "px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
              title: !currentShot.startFrame && !referenceImage ? "Add a START FRAME or REF image first" : "",
              children: sequencePlan.length === 0 ? "Add shots first" : !currentShot.startFrame && !referenceImage ? "Need ref image" : `Generate ${sequencePlan.length} shots`
            }
          )
        ] })
      ] })
    ] }) }),
    show3DCamera && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShow3DCamera(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300", children: "3D Camera Control" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Drag handles to set angle" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShow3DCamera(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx(
        Camera3DControl,
        {
          azimuth: cameraAzimuth,
          setAzimuth: setCameraAzimuth,
          elevation: cameraElevation,
          setElevation: setCameraElevation,
          distance: cameraDistance,
          setDistance: setCameraDistance,
          subjectImage: currentShot.startFrame
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-5 pt-5 border-t border-gray-700", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const qwenPrompt = buildQwenPromptContinuous(cameraAzimuth, cameraElevation, cameraDistance);
              const currentPrompt = currentShot.motionPrompt;
              setMotionPrompt(currentPrompt ? `${currentPrompt}, ${qwenPrompt}` : qwenPrompt);
              setShow3DCamera(false);
            },
            className: "flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity",
            children: "Apply Angle to Prompt"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShow3DCamera(false),
            className: "px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors",
            children: "Cancel"
          }
        )
      ] })
    ] }) }),
    showBatchGenerator && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowBatchGenerator(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300", children: "Batch Generator" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Generate multiple angles at once" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowBatchGenerator(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx(
        BatchGenerator,
        {
          sourceImage: currentShot.startFrame,
          onBatchComplete: (results) => {
            console.log("Batch complete:", results);
            setShowBatchGenerator(false);
          },
          onImageGenerated: (result) => {
            console.log("Image generated:", result);
          },
          generateAngleImage: async (angle, sourceImage) => {
            const prompt = buildQwenPromptContinuous(angle.azimuth, angle.elevation, angle.distance);
            console.log("Generating image with angle:", angle, "prompt:", prompt);
            throw new Error("Batch generation API not implemented yet. Use the 3D Camera Control to set individual angles.");
          }
        }
      )
    ] }) }),
    showMovieShots && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowMovieShots(false), children: /* @__PURE__ */ jsx("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-6xl w-full mx-4 h-[85vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
      MovieShotsBrowser,
      {
        onSelectShots: handleSelectMovieShots,
        onClose: () => setShowMovieShots(false),
        userAssets,
        onAddAsset: handleAddAsset,
        onRemoveAsset: handleRemoveAsset,
        selectedAsset: selectedAssetForSwap,
        onSelectAsset: setSelectedAssetForSwap
      }
    ) }) }),
    showContinueFromVideo && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowContinueFromVideo(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300", children: "🎬 Continue from Video" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500", children: "Video → Extract → Close-up → Dialogue → Stitch" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowContinueFromVideo(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6 px-4", children: [1, 2, 3, 4].map((step) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${continueStep >= step ? continueStep === step ? "bg-purple-500 text-white" : "bg-green-500 text-white" : "bg-gray-700 text-gray-400"}`, children: continueStep > step ? "✓" : step }),
        step < 4 && /* @__PURE__ */ jsx("div", { className: `w-16 h-0.5 mx-1 ${continueStep > step ? "bg-green-500" : "bg-gray-700"}` })
      ] }, step)) }),
      continueError && /* @__PURE__ */ jsx("div", { className: "mb-4 px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300", children: continueError }),
      continueStep === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-300 mb-2", children: "Step 1: Choose your video" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase", children: "Upload from computer" }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: continueVideoInputRef,
                type: "file",
                accept: "video/*",
                onChange: handleContinueLocalVideoUpload,
                className: "hidden"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => continueVideoInputRef.current?.click(),
                className: `w-full px-4 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center gap-3 ${continueLocalFileName ? "border-green-500/50 bg-green-500/10" : "border-gray-600 hover:border-purple-500 hover:bg-purple-500/5"}`,
                children: continueLoading && !continueVideoUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400", children: [
                    "Uploading ",
                    continueLocalFileName,
                    "..."
                  ] })
                ] }) : continueLocalFileName ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-300", children: continueLocalFileName })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5 text-gray-500", children: [
                    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                    /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
                    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: "Click to select video file" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-700" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "or paste URL" }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-700" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: continueVideoUrl,
            onChange: (e) => {
              setContinueVideoUrl(e.target.value);
              setContinueLocalFileName(null);
            },
            placeholder: "https://example.com/video.mp4",
            className: "w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: continueStep1ExtractFrame,
            disabled: continueLoading || !continueVideoUrl,
            className: "w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",
            children: continueLoading && continueVideoUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
              "Extracting last frame..."
            ] }) : /* @__PURE__ */ jsx(Fragment, { children: "📸 Extract Last Frame" })
          }
        )
      ] }),
      continueStep === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-300 mb-2", children: "Step 2: Generate dialogue-ready close-up" }),
        continueExtractedFrame && /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-1", children: "Extracted Frame" }),
            /* @__PURE__ */ jsx("img", { src: continueExtractedFrame, alt: "Extracted", className: "w-full h-32 object-cover rounded-lg border border-gray-700" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center text-4xl", children: "→" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-1", children: "Will Generate" }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-32 bg-[#2a2a2a] rounded-lg border border-gray-700 flex items-center justify-center text-gray-500", children: "Close-up shot" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setContinueStep(1),
              className: "px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors",
              children: "← Back"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: continueStep2GenerateCloseup,
              disabled: continueLoading,
              className: "flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",
              children: continueLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Generating close-up..."
              ] }) : /* @__PURE__ */ jsx(Fragment, { children: "🎯 Generate Close-up" })
            }
          )
        ] })
      ] }),
      continueStep === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-300 mb-2", children: "Step 3: Enter dialogue for character to speak" }),
        continueCloseupUrl && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-1", children: "Generated Close-up" }),
          /* @__PURE__ */ jsx("img", { src: continueCloseupUrl, alt: "Close-up", className: "w-48 h-28 object-cover rounded-lg border border-gray-700" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-1", children: "What should they say?" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: continueDialogue,
              onChange: (e) => setContinueDialogue(e.target.value),
              placeholder: "Hello everyone! Welcome to my video. Today I'm going to show you something amazing...",
              className: "w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setContinueStep(2),
              className: "px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors",
              children: "← Back"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: continueStep3GenerateDialogue,
              disabled: continueLoading || !continueDialogue.trim(),
              className: "flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",
              children: continueLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Generating with Seedance..."
              ] }) : /* @__PURE__ */ jsx(Fragment, { children: "🗣️ Generate Dialogue (Seedance)" })
            }
          )
        ] })
      ] }),
      continueStep === 4 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-300 mb-2", children: "Step 4: Stitch videos together" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 items-center", children: continueDialogueVideoUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-1", children: "Original Video" }),
            /* @__PURE__ */ jsx("video", { src: continueVideoUrl, className: "w-full h-24 object-cover rounded-lg border border-gray-700", muted: true })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl", children: "+" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-1", children: "Dialogue Video" }),
            /* @__PURE__ */ jsx("video", { src: continueDialogueVideoUrl, className: "w-full h-24 object-cover rounded-lg border border-purple-500", muted: true, controls: true })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setContinueStep(3),
              className: "px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors",
              children: "← Back"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: continueStep4StitchVideos,
              disabled: continueLoading,
              className: "flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",
              children: continueLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Stitching videos..."
              ] }) : /* @__PURE__ */ jsx(Fragment, { children: "🎬 Stitch & Download" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: resetContinueWorkflow,
            className: "text-xs text-gray-500 hover:text-gray-300",
            children: "Start Over"
          }
        ) })
      ] })
    ] }) }),
    showAIPrompt && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/95 z-50 flex flex-col", onClick: () => setShowAIPrompt(false), children: /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-[#0f0f0f] flex flex-col h-full w-full overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-800/50 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-sm font-medium text-yellow-300 flex items-center gap-2", children: [
            Icons.sparkle,
            "AI Assistant"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex bg-[#2a2a2a] rounded-lg p-0.5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setAiMode("chat"),
                className: `px-3 py-1 rounded-md text-xs font-medium transition-all ${aiMode === "chat" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"}`,
                children: "Chat"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setAiMode("quick"),
                className: `px-3 py-1 rounded-md text-xs font-medium transition-all ${aiMode === "quick" ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`,
                children: "Prompt"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setAiMode("settings"),
                className: `px-3 py-1 rounded-md text-xs font-medium transition-all ${aiMode === "settings" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"}`,
                children: "Settings"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          aiMode === "chat" && aiChatHistory.length > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: clearAIChatHistory,
              className: "px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors",
              children: "Clear"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowAIPrompt(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] border-b border-gray-800/30 flex-shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${ollamaStatus === "ok" ? "bg-green-500" : ollamaStatus === "error" ? "bg-red-500" : "bg-yellow-500"}` }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: ollamaStatus === "ok" ? `Ollama connected (${aiMode === "chat" ? "Qwen3" : "Mistral"})` : ollamaStatus === "error" ? "Ollama not running - start with: ollama serve" : "Checking Ollama..." }),
        /* @__PURE__ */ jsx("span", { className: `ml-auto px-2 py-0.5 rounded text-xs font-medium ${mode === "image" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"}`, children: mode === "image" ? "Image" : "Video" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden flex flex-col p-6", children: [
        aiMode === "quick" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
            "textarea",
            {
              value: aiInput,
              onChange: (e) => setAiInput(e.target.value),
              placeholder: mode === "image" ? 'e.g., "woman in cafe, lonely, Fincher style" or "epic battle, Nolan, IMAX"' : 'e.g., "slow push in, eyes widen" or "orbit around, hair blows in wind"',
              className: "w-full h-24 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 resize-none",
              disabled: aiGenerating
            }
          ) }),
          aiError && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs", children: aiError }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mb-2", children: "Examples (click to try):" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: mode === "image" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("woman in cafe, lonely, Fincher style"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "lonely cafe, Fincher" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("epic battle scene, Nolan, IMAX"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "epic battle, Nolan" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("romantic scene, Wong Kar-wai, neon rain"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "romantic, Wong Kar-wai" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("symmetrical hotel, Kubrick stare"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "hotel, Kubrick" })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("slow push in, subject turns head"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "push in + head turn" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("orbit around, hair blows in wind"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "orbit + wind" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("static shot, rain falls, eyes blink"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "static + rain" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setAiInput("dolly out reveal, smoke rises"), className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors", children: "dolly out reveal" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleAIGenerate,
              disabled: aiGenerating || !aiInput.trim() || ollamaStatus === "error",
              className: `w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${aiGenerating || !aiInput.trim() || ollamaStatus === "error" ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400"}`,
              children: aiGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }),
                "Generating with Mistral..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                Icons.sparkle,
                "Generate ",
                mode === "image" ? "Image" : "Motion",
                " Prompt"
              ] })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-4 text-[10px] text-gray-500 text-center", children: "Quick mode: One-shot prompt generation with Mistral" })
        ] }),
        aiMode === "chat" && /* @__PURE__ */ jsxs(Fragment, { children: [
          currentScene && /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-xl border border-green-500/30 overflow-hidden", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => setPlanCollapsed(!planCollapsed),
                className: "p-3 bg-[#1f1f1f] cursor-pointer hover:bg-[#252525] transition-colors",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        className: `w-4 h-4 text-gray-400 transition-transform ${planCollapsed ? "" : "rotate-90"}`,
                        children: /* @__PURE__ */ jsx("path", { d: "M9 18l6-6-6-6" })
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white", children: currentScene.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                      currentScene.shots.filter((s) => s.status === "done").length,
                      "/",
                      currentScene.shots.length,
                      " shots"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-green-400", children: [
                    "~",
                    currentScene.duration_estimate,
                    "s"
                  ] })
                ] })
              }
            ),
            !planCollapsed && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-[#1a1a1a] border-t border-gray-800/50 max-h-[300px] overflow-y-auto", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mb-3", children: [
                currentScene.mood && /* @__PURE__ */ jsxs("span", { className: "mr-3", children: [
                  "Mood: ",
                  currentScene.mood
                ] }),
                currentScene.director && /* @__PURE__ */ jsxs("span", { children: [
                  "Director: ",
                  currentScene.director
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-green-500 transition-all",
                  style: { width: `${currentScene.shots.filter((s) => s.status === "done").length / currentScene.shots.length * 100}%` }
                }
              ) }) }),
              (() => {
                const charRefs = Object.values(currentScene.character_references || {});
                const sceneRefs = Object.values(currentScene.scene_references || {});
                const totalRefs = charRefs.length + sceneRefs.length;
                const pendingRefs = [...charRefs, ...sceneRefs].filter((r) => !r.ref_url && r.generate_prompt).length;
                const doneRefs = totalRefs - pendingRefs;
                if (totalRefs === 0) return null;
                return /* @__PURE__ */ jsxs("div", { className: "mb-3 p-2 bg-[#252525] rounded-lg border border-gray-700/50", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-orange-300", children: "References" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-500", children: [
                        "(",
                        doneRefs,
                        "/",
                        totalRefs,
                        " done)"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: generateAllRefs,
                        disabled: pendingRefs === 0 || executingPlan,
                        className: `px-2 py-1 rounded text-[10px] font-medium transition-all ${pendingRefs === 0 || executingPlan ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30"}`,
                        children: [
                          "Generate Refs (",
                          pendingRefs,
                          ")"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pb-2", children: [
                    charRefs.map((char) => {
                      const isGenerating2 = executingPlan && !char.ref_url;
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${char.ref_url ? "ring-2 ring-green-500" : isGenerating2 ? "ring-2 ring-yellow-500" : "ring-1 ring-purple-500/50"}`,
                          title: `${char.name} - Character Sheet
${char.description}`,
                          children: [
                            char.ref_url ? /* @__PURE__ */ jsx("img", { src: char.ref_url, alt: char.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-purple-500/20 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "👤" }) }),
                            isGenerating2 && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-yellow-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }) }),
                            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-purple-300 font-medium truncate", children: char.name }),
                              char.ref_url && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-3 h-3 text-green-400", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) })
                            ] }) })
                          ]
                        },
                        char.id
                      );
                    }),
                    sceneRefs.filter((r) => r.type === "location").map((ref) => {
                      const isGenerating2 = executingPlan && !ref.ref_url;
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${ref.ref_url ? "ring-2 ring-green-500" : isGenerating2 ? "ring-2 ring-yellow-500" : "ring-1 ring-cyan-500/50"}`,
                          title: `${ref.name} - Location Sheet (INT/EXT)
${ref.description}`,
                          children: [
                            ref.ref_url ? /* @__PURE__ */ jsx("img", { src: ref.ref_url, alt: ref.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-cyan-500/20 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "📍" }) }),
                            isGenerating2 && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-yellow-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }) }),
                            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-cyan-300 font-medium truncate", children: ref.name }),
                              ref.ref_url && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-3 h-3 text-green-400", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) })
                            ] }) })
                          ]
                        },
                        ref.id
                      );
                    }),
                    sceneRefs.filter((r) => r.type !== "location").map((ref) => {
                      const isGenerating2 = executingPlan && !ref.ref_url;
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${ref.ref_url ? "ring-2 ring-green-500" : isGenerating2 ? "ring-2 ring-yellow-500" : "ring-1 ring-green-500/50"}`,
                          title: `${ref.name} - ${ref.type === "vehicle" ? "Vehicle" : "Object"} Sheet
${ref.description}`,
                          children: [
                            ref.ref_url ? /* @__PURE__ */ jsx("img", { src: ref.ref_url, alt: ref.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-green-500/20 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: ref.type === "vehicle" ? "🚗" : "📦" }) }),
                            isGenerating2 && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-yellow-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }) }),
                            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-green-300 font-medium truncate", children: ref.name }),
                              ref.ref_url && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-3 h-3 text-green-400", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) })
                            ] }) })
                          ]
                        },
                        ref.id
                      );
                    })
                  ] })
                ] });
              })(),
              /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-col gap-2", children: !executingPlan ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: executeEntirePlan,
                    disabled: currentScene.shots.filter((s) => s.status === "pending").length === 0,
                    className: `flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${currentScene.shots.filter((s) => s.status === "pending").length === 0 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500"}`,
                    children: [
                      /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                        /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
                        /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                        /* @__PURE__ */ jsx("path", { d: "M21 15l-5-5L5 21" })
                      ] }),
                      "Images (",
                      currentScene.shots.filter((s) => s.status === "pending").length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: executeAllVideos,
                    disabled: currentScene.shots.filter((s) => s.image_url && !s.video_url).length === 0,
                    className: `flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${currentScene.shots.filter((s) => s.image_url && !s.video_url).length === 0 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-400 hover:to-pink-500"}`,
                    children: [
                      /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }),
                      "Videos (",
                      currentScene.shots.filter((s) => s.image_url && !s.video_url).length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: resetAllGenerated,
                    className: "px-3 py-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm font-medium transition-colors flex items-center gap-1",
                    title: "Reset all refs, images, videos - keep plan",
                    children: [
                      /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                        /* @__PURE__ */ jsx("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                        /* @__PURE__ */ jsx("path", { d: "M3 3v5h5" })
                      ] }),
                      "Reset"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 py-2.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }),
                  "Generating ",
                  planProgress,
                  "..."
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: stopPlanExecution,
                    className: "px-4 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors",
                    children: "Stop"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-3", children: currentScene.shots.map((shot, idx) => {
                const hasDialog = !!shot.dialog;
                const hasVideo = !!shot.video_url;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: () => {
                      selectSceneShot(shot.shot_id);
                      handleSceneShotSelect(shot);
                    },
                    className: `relative rounded-lg cursor-pointer transition-all overflow-hidden group ${selectedShotId === shot.shot_id ? "ring-2 ring-purple-500" : "hover:ring-1 hover:ring-gray-500"}`,
                    title: `${shot.shot_id}: ${shot.subject}
${shot.shot_type} • ${shot.duration}s`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-[#2a2a2a] relative", children: [
                        shot.image_url ? /* @__PURE__ */ jsx("img", { src: shot.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-600", children: /* @__PURE__ */ jsx("span", { className: "text-[10px]", children: idx + 1 }) }),
                        /* @__PURE__ */ jsx("div", { className: `absolute top-0.5 left-0.5 w-2 h-2 rounded-full ${shot.status === "done" ? "bg-green-500" : shot.status === "generating" ? "bg-yellow-500 animate-pulse" : "bg-gray-600"}` }),
                        hasVideo && /* @__PURE__ */ jsx("div", { className: "absolute top-0.5 right-0.5 bg-green-500 rounded px-1", children: /* @__PURE__ */ jsx("span", { className: "text-[8px] text-white", children: "▶" }) }),
                        /* @__PURE__ */ jsx("div", { className: `absolute bottom-0.5 left-0.5 px-1 rounded text-[7px] font-medium ${shot.model === "seedance-1.5" ? "bg-purple-500/80 text-white" : shot.model === "kling-o1" ? "bg-blue-500/80 text-white" : "bg-gray-600/80 text-white"}`, children: shot.model === "seedance-1.5" ? "S" : shot.model === "kling-o1" ? "O1" : "2.6" }),
                        hasDialog && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0.5 right-0.5 bg-yellow-500/80 rounded px-1", children: /* @__PURE__ */ jsx("span", { className: "text-[8px]", children: "🗣" }) })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "bg-[#1a1a1a] px-1 py-0.5 text-center", children: /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-400 truncate block", children: shot.shot_id.replace("S0", "").replace("_B0", ".").replace("_C0", ".") }) }),
                      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[8px] text-white text-center line-clamp-2", children: shot.subject }),
                        shot.status === "pending" && /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleGenerateSceneShot(shot);
                            },
                            className: "px-2 py-0.5 rounded bg-green-500 text-[8px] text-white hover:bg-green-400",
                            children: "Gen"
                          }
                        ),
                        shot.status === "done" && !shot.video_url && /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleGenerateSceneVideo(shot);
                            },
                            className: "px-2 py-0.5 rounded bg-purple-500 text-[8px] text-white hover:bg-purple-400",
                            children: "Video"
                          }
                        )
                      ] })
                    ]
                  },
                  shot.shot_id
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: aiChatRef, className: "flex-1 overflow-y-auto mb-4 space-y-3 min-h-0", children: [
            aiChatHistory.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-500 py-8", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg mb-2", children: "Chat with Qwen3" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Ask about cinematography, get prompts, plan videos..." }),
              /* @__PURE__ */ jsx("div", { className: "text-xs mt-1 text-purple-400", children: "Memory is saved to disk!" }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 text-xs text-gray-600", children: 'Try: "Plan a 30 second video of..."' })
            ] }) : aiChatHistory.map((msg, idx) => /* @__PURE__ */ jsx(
              "div",
              {
                className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
                children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `max-w-[85%] rounded-xl p-3 ${msg.role === "user" ? "bg-purple-500/20 border border-purple-500/30 text-purple-100" : "bg-[#2a2a2a] border border-gray-700 text-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs opacity-50 mb-1", children: msg.role === "user" ? "You" : "Qwen3" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm whitespace-pre-wrap", children: msg.content }),
                      msg.role === "assistant" && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => usePromptFromChat(msg.content, idx),
                            className: `px-2 py-1 rounded text-xs transition-colors ${aiCopiedIndex === idx ? "bg-green-500/30 text-green-400" : "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"}`,
                            children: aiCopiedIndex === idx ? "Copied to Prompt!" : "Use as Prompt"
                          }
                        ),
                        detectShotPlan(msg.content) && /* @__PURE__ */ jsxs(
                          "button",
                          {
                            onClick: () => loadShotPlan(msg.content),
                            className: `px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${detectJsonPlan(msg.content) ? "bg-green-500/20 hover:bg-green-500/30 text-green-400" : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"}`,
                            children: [
                              /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-3 h-3", children: [
                                /* @__PURE__ */ jsx("path", { d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }),
                                /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4" })
                              ] }),
                              detectJsonPlan(msg.content) ? `Load to Grid (${getJsonPlanShotCount(msg.content)} shots)` : `Load Plan (${parseShotPlan(msg.content).length} shots)`
                            ]
                          }
                        )
                      ] })
                    ]
                  }
                )
              },
              idx
            )),
            aiGenerating && /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx("div", { className: "bg-[#2a2a2a] border border-gray-700 rounded-xl p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-400", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Qwen3 thinking..." })
            ] }) }) })
          ] }),
          plannedSequence.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-3 bg-[#1f1f1f] rounded-xl border border-cyan-500/30", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-cyan-400 font-medium", children: [
                "Shot Sequence (",
                plannedSequence.filter((s) => s.status === "completed").length,
                "/",
                plannedSequence.length,
                " complete)"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                !sequenceExecuting && !sequenceNeedsRef && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: executeSequence,
                    className: "px-2 py-1 rounded text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }),
                      "Execute All"
                    ]
                  }
                ),
                sequenceExecuting && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }),
                  "Generating..."
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: clearSequence,
                    className: "px-2 py-1 rounded text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors",
                    children: "Clear"
                  }
                )
              ] })
            ] }),
            sequenceNeedsRef && /* @__PURE__ */ jsxs("div", { className: "mb-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-xs", children: [
              "Add a reference image first! Upload a start frame or generate an image before executing.",
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: resumeSequenceWithRef,
                  disabled: !currentShot.startFrame,
                  className: `ml-2 px-2 py-0.5 rounded ${currentShot.startFrame ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`,
                  children: "Resume"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: characterDNA || "",
                onChange: (e) => setCharacterDNA(e.target.value),
                placeholder: "Character DNA (e.g., 'Asian man, 40s, tan flight suit')",
                className: "w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 max-h-40 overflow-y-auto p-1", children: plannedSequence.map((shot, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `relative aspect-video rounded overflow-hidden cursor-pointer group ${shot.status === "completed" ? "ring-1 ring-green-500" : shot.status === "generating-image" || shot.status === "generating-video" ? "ring-1 ring-yellow-500" : shot.status === "error" ? "ring-1 ring-red-500" : "ring-1 ring-gray-700"}`,
                title: `${shot.shotType}: ${shot.prompt.substring(0, 60)}...`,
                children: [
                  shot.imageUrl ? /* @__PURE__ */ jsx("img", { src: shot.imageUrl, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-[#2a2a2a] flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500", children: shot.shotNumber }) }),
                  /* @__PURE__ */ jsx("div", { className: `absolute inset-0 flex items-center justify-center ${shot.status === "generating-image" || shot.status === "generating-video" ? "bg-black/50" : ""}`, children: (shot.status === "generating-image" || shot.status === "generating-video") && /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-yellow-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }) }),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] text-cyan-300 font-medium truncate", children: shot.shotType }),
                    shot.status === "completed" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-2.5 h-2.5 text-green-400", children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" }) }),
                    shot.status === "error" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-2.5 h-2.5 text-red-400", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1", children: /* @__PURE__ */ jsxs("span", { className: "text-[8px] text-white text-center line-clamp-2", children: [
                    shot.prompt.substring(0, 30),
                    "..."
                  ] }) })
                ]
              },
              idx
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                "Reference Images (",
                aiRefImages.length,
                "/7)"
              ] }),
              aiRefImages.length < 7 && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => aiRefInputRef.current?.click(),
                  className: "px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) }),
                    "Add Image"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: aiRefInputRef,
                  type: "file",
                  accept: "image/*",
                  onChange: handleAiRefImageUpload,
                  className: "hidden"
                }
              )
            ] }),
            aiRefImages.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: aiRefImages.map((img, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: img.url,
                  alt: `Ref ${idx + 1}`,
                  className: `w-16 h-16 object-cover rounded-lg border ${aiRefLoading === idx ? "border-yellow-500 animate-pulse" : "border-gray-700"}`
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold", children: idx + 1 }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removeAiRefImage(idx),
                  className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity",
                  children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-3 h-3", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" }) })
                }
              ),
              aiRefLoading === idx && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 animate-spin text-yellow-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }) }),
              img.description && !aiRefLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-1 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "text-[8px] text-gray-300 line-clamp-4", children: img.description }) })
            ] }, idx)) })
          ] }),
          aiError && /* @__PURE__ */ jsx("div", { className: "mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs", children: aiError }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: aiInput,
                onChange: (e) => setAiInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAIChat();
                  }
                },
                placeholder: "Ask about cinematography, get prompts, refine ideas...",
                className: "flex-1 bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50",
                disabled: aiGenerating
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleAIChat,
                disabled: aiGenerating || !aiInput.trim() || ollamaStatus === "error",
                className: `px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${aiGenerating || !aiInput.trim() || ollamaStatus === "error" ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400"}`,
                children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 text-[10px] text-gray-500 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsx("span", { children: "Qwen3 sees:" }),
            promptText && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded", children: "Prompt" }),
            currentShot.startFrame && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded", children: "Image" }),
            currentShot.motionPrompt && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded", children: "Motion" }),
            shots.length > 0 && /* @__PURE__ */ jsxs("span", { className: "px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded", children: [
              shots.length,
              " Shots"
            ] }),
            sequencePlan.length > 0 && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded", children: "Sequence" }),
            aiRefImages.length > 0 && /* @__PURE__ */ jsxs("span", { className: "px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded", children: [
              aiRefImages.length,
              " Refs"
            ] }),
            !promptText && !currentShot.startFrame && shots.length === 0 && aiRefImages.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "No context yet" })
          ] }) })
        ] }),
        aiMode === "settings" && /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white mb-4", children: "AI Assistant Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-400 mb-2 block", children: "Character DNA" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: characterDNA || "",
                onChange: (e) => setCharacterDNA(e.target.value || null),
                placeholder: "Describe your consistent character (e.g., 'Asian man, 40s, tan flight suit, short black hair')",
                className: "w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 min-h-[80px] resize-none"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-1", children: "Applied to all generated prompts for consistency" })
          ] }),
          currentScene && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-[#1f1f1f] rounded-xl border border-gray-700", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mb-2", children: "Loaded Scene" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-white font-medium", children: currentScene.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [
              currentScene.shots.length,
              " shots • ",
              currentScene.shots.filter((s) => s.status === "done").length,
              " complete"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  clearScene();
                  setPlanCollapsed(false);
                },
                className: "mt-2 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors",
                children: "Clear Scene"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-400 mb-2 block", children: "Import Scene Plan" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  accept: ".json",
                  onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const json = event.target?.result;
                          loadScene(json);
                          setAiMode("chat");
                        } catch (err) {
                          console.error("Failed to parse scene JSON:", err);
                        }
                      };
                      reader.readAsText(file);
                    }
                  },
                  className: "hidden",
                  id: "scene-file-input"
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "scene-file-input",
                  className: "flex-1 py-2 px-4 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 text-gray-300 text-sm text-center cursor-pointer transition-colors border border-gray-700 border-dashed",
                  children: "Choose JSON file..."
                }
              )
            ] })
          ] }),
          currentScene && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-400 mb-2 block", children: "Export Scene" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  const json = exportSceneJSON();
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${currentScene.name.replace(/\s+/g, "_")}_export.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                },
                className: "w-full py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm transition-colors",
                children: "Download Scene JSON"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-[#1f1f1f] rounded-xl border border-gray-700", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "Ollama Status" }),
              /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-0.5 rounded ${ollamaStatus === "ok" ? "bg-green-500/20 text-green-400" : ollamaStatus === "unknown" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`, children: ollamaStatus === "ok" ? "Connected" : ollamaStatus === "unknown" ? "Checking..." : "Offline" })
            ] }),
            ollamaStatus === "error" && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: "Make sure Ollama is running with Qwen3:4B model" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 text-center mt-4", children: "Cinema Studio v2.0 • AI Assistant powered by Qwen3" })
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
    showVideoMotion && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center", onClick: () => setShowVideoMotion(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg text-xs font-medium text-white", children: "Video Motion Builder" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500", children: "Motion only - image has all visual info!" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowVideoMotion(false), className: "w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors", children: Icons.close })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-4 border-b border-gray-800 pb-3", children: ["camera", "subject", "background", "objects", "templates", "dialogue"].map((tab) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setVideoMotionTab(tab),
          className: `px-4 py-2 rounded-lg text-xs font-medium transition-all ${videoMotionTab === tab ? tab === "dialogue" ? "bg-purple-600 text-white" : "bg-purple-600 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
          children: tab === "dialogue" ? "🗣️ Dialogue" : tab.charAt(0).toUpperCase() + tab.slice(1)
        },
        tab
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto max-h-[50vh] pr-2", children: [
        videoMotionTab === "camera" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: Object.entries(CAMERA_MOVEMENTS).map(([key, value]) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setVideoCameraMovement(videoCameraMovement === key ? null : key),
            className: `rounded-lg p-3 text-left transition-all ${videoCameraMovement === key ? "bg-purple-600 text-white ring-2 ring-purple-400" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium", children: key.replace(/_/g, " ") }),
              /* @__PURE__ */ jsxs("div", { className: `text-[9px] mt-1 ${videoCameraMovement === key ? "text-purple-200" : "text-gray-500"}`, children: [
                value.substring(0, 50),
                "..."
              ] })
            ]
          },
          key
        )) }),
        videoMotionTab === "subject" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: Object.entries(SUBJECT_MOTIONS).map(([key, value]) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setVideoSubjectMotion(videoSubjectMotion === key ? null : key),
            className: `rounded-lg p-3 text-left transition-all ${videoSubjectMotion === key ? "bg-blue-600 text-white ring-2 ring-blue-400" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium", children: key.replace(/_/g, " ") }),
              /* @__PURE__ */ jsxs("div", { className: `text-[9px] mt-1 ${videoSubjectMotion === key ? "text-blue-200" : "text-gray-500"}`, children: [
                value.substring(0, 50),
                "..."
              ] })
            ]
          },
          key
        )) }),
        videoMotionTab === "background" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: Object.entries(BACKGROUND_MOTIONS).map(([key, value]) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setVideoBackgroundMotion(videoBackgroundMotion === key ? null : key),
            className: `rounded-lg p-3 text-left transition-all ${videoBackgroundMotion === key ? "bg-green-600 text-white ring-2 ring-green-400" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium", children: key.replace(/_/g, " ") }),
              /* @__PURE__ */ jsx("div", { className: `text-[9px] mt-1 ${videoBackgroundMotion === key ? "text-green-200" : "text-gray-500"}`, children: value })
            ]
          },
          key
        )) }),
        videoMotionTab === "objects" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "Natural Elements" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: Object.entries(NATURAL_ELEMENTS).map(([category, motions]) => Object.entries(motions).map(([key, value]) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setVideoObjectMotion(videoObjectMotion === value ? null : value),
                className: `rounded-lg p-2 text-left transition-all ${videoObjectMotion === value ? "bg-orange-600 text-white ring-2 ring-orange-400" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-medium", children: [
                  category,
                  ": ",
                  key
                ] })
              },
              `${category}-${key}`
            ))) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "Weather" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: Object.entries(WEATHER).map(([category, motions]) => Object.entries(motions).map(([key, value]) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setVideoObjectMotion(videoObjectMotion === value ? null : value),
                className: `rounded-lg p-2 text-left transition-all ${videoObjectMotion === value ? "bg-cyan-600 text-white ring-2 ring-cyan-400" : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-medium", children: [
                  category,
                  ": ",
                  key
                ] })
              },
              `weather-${category}-${key}`
            ))) })
          ] })
        ] }),
        videoMotionTab === "templates" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "Quick Templates (click to use)" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: Object.entries(VIDEO_TEMPLATES.full).map(([key, value]) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setPromptText(value);
                  setShowVideoMotion(false);
                },
                className: "rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-purple-400 mb-1", children: key }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400", children: value })
                ]
              },
              key
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "Simple Presets" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: Object.entries(VIDEO_TEMPLATES.simple).map(([key, value]) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setPromptText(value);
                  setShowVideoMotion(false);
                },
                className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-gray-700 text-left transition-all",
                children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium", children: key })
              },
              key
            )) })
          ] })
        ] }),
        videoMotionTab === "dialogue" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-purple-400 font-medium mb-1", children: "Seedance 1.5 Pro - Dialogue & Lip Sync" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400", children: "These templates use Seedance for perfect lip-sync and audio generation. Replace [DIALOGUE] with your actual spoken text." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "UGC / Talking Head" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.ugc_basic);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-purple-400 mb-1", children: "Basic UGC" }),
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400", children: "Confident presenter, soft bokeh, push-in" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.ugc_energetic);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-purple-400 mb-1", children: "Energetic Creator" }),
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400", children: "High energy, handheld movement, excited" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "Scene Types" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.product_demo);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-amber-400", children: "Product Demo" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.emotional);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-red-400", children: "Emotional" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.interview);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-blue-400", children: "Interview" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.dialogue_two);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-green-400", children: "Two Characters" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.social_hook);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-pink-400", children: "Social Hook" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2 font-medium", children: "Multi-Language" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.mandarin);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium", children: "🇨🇳 Mandarin" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.spanish);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium", children: "🇪🇸 Spanish" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMotionPrompt(VIDEO_TEMPLATES.seedance.japanese);
                    setShowVideoMotion(false);
                  },
                  className: "rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",
                  children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium", children: "🇯🇵 Japanese" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 uppercase mb-2", children: "Seedance Tips" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-[10px] text-gray-400 space-y-1", children: [
              /* @__PURE__ */ jsx("li", { children: "• Replace [DIALOGUE] with actual speech" }),
              /* @__PURE__ */ jsx("li", { children: '• Specify emotion: "speaks warmly", "exclaims excitedly"' }),
              /* @__PURE__ */ jsx("li", { children: '• Add language: "speaks in Mandarin with professional tone"' }),
              /* @__PURE__ */ jsx("li", { children: '• Include camera: "slow push-in", "handheld slight movement"' }),
              /* @__PURE__ */ jsx("li", { children: "• Audio is generated automatically - no separate TTS needed!" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-gray-800", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-gray-500 uppercase mb-2", children: "Video Motion Prompt Preview:" }),
        /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-[#0a0a0a] rounded-lg text-xs text-gray-300 min-h-[40px]", children: buildVideoMotionPrompt() || /* @__PURE__ */ jsx("span", { className: "text-gray-600 italic", children: "Select motions above..." }) }),
        videoPromptWarnings.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 px-3 py-2 bg-orange-950/50 border border-orange-700/50 rounded-lg", children: videoPromptWarnings.map((warning, idx) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-orange-300", children: [
          "⚠ ",
          warning
        ] }, idx)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setVideoCameraMovement(null);
                setVideoSubjectMotion(null);
                setVideoBackgroundMotion(null);
                setVideoObjectMotion(null);
              },
              className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors",
              children: "Clear All"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const prompt = buildVideoMotionPrompt();
                if (prompt) {
                  setPromptText(prompt);
                  setMotionPrompt(prompt);
                }
                setShowVideoMotion(false);
              },
              className: "px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs text-white font-medium transition-colors",
              children: "Apply to Prompt"
            }
          )
        ] })
      ] })
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
        mode === "image" && promptWarnings.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-orange-950/50 border border-orange-700/50 rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-orange-400 uppercase mb-1 font-medium", children: "Image Prompt Tips:" }),
          promptWarnings.map((warning, idx) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-orange-300", children: [
            "• ",
            warning
          ] }, idx))
        ] }),
        mode === "video" && videoPromptWarnings.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-purple-400 uppercase mb-1 font-medium", children: "Video Prompt Tips:" }),
          videoPromptWarnings.map((warning, idx) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-purple-300", children: [
            "• ",
            warning
          ] }, idx))
        ] }),
        mode === "video" && (videoCameraMovement || videoSubjectMotion || videoBackgroundMotion || videoObjectMotion) && /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-purple-950/30 border border-purple-800/50 rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-purple-400 uppercase mb-1 font-medium", children: "Video Motion:" }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-purple-200", children: buildVideoMotionPrompt() })
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
          mode === "video" && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowVideoMotion(true),
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${videoCameraMovement || videoSubjectMotion || videoBackgroundMotion || videoObjectMotion ? "bg-purple-700 text-white" : "bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-300 hover:from-purple-800/50 hover:to-blue-800/50 border border-purple-700/50"}`,
              children: [
                Icons.video,
                /* @__PURE__ */ jsx("span", { children: "Video Motion" }),
                (videoCameraMovement || videoSubjectMotion || videoBackgroundMotion || videoObjectMotion) && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-purple-400 rounded-full animate-pulse" })
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
                setShowCharacterDNA(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${characterDNA ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "Character DNA - consistent character description for shot chaining",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" }),
                  /* @__PURE__ */ jsx("path", { d: "M12 6v2M12 16v2M8 12H6M18 12h-2" }),
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: characterDNA ? "DNA Set" : "Character" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowSequencePlanner(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowCharacterDNA(false);
                setShow3DCamera(false);
                setShowBatchGenerator(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${sequencePlan.length > 0 ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "Sequence Planner - plan multiple shots before generating",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
                  /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: sequencePlan.length > 0 ? `${sequencePlan.length} Shots` : "Sequence" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShow3DCamera(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowCharacterDNA(false);
                setShowSequencePlanner(false);
                setShowBatchGenerator(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${show3DCamera ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "3D Camera Control - set angle with visual 3D preview",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("path", { d: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" }),
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13", r: "4" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: "3D Angle" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowBatchGenerator(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowCharacterDNA(false);
                setShowSequencePlanner(false);
                setShow3DCamera(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${showBatchGenerator ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "Batch Generator - generate multiple angles at once",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("path", { d: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" }),
                  /* @__PURE__ */ jsx("polyline", { points: "7.5 4.21 12 6.81 16.5 4.21" }),
                  /* @__PURE__ */ jsx("polyline", { points: "7.5 19.79 7.5 14.6 3 12" }),
                  /* @__PURE__ */ jsx("polyline", { points: "21 12 16.5 14.6 16.5 19.79" }),
                  /* @__PURE__ */ jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
                  /* @__PURE__ */ jsx("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: "Batch" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowMovieShots(true);
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowCharacterDNA(false);
                setShowSequencePlanner(false);
                setShow3DCamera(false);
                setShowBatchGenerator(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${showMovieShots ? "bg-gradient-to-r from-amber-500 to-red-500 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "Movie Shots Library - 2100+ professional film shots",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "2.18", ry: "2.18" }),
                  /* @__PURE__ */ jsx("line", { x1: "7", y1: "2", x2: "7", y2: "22" }),
                  /* @__PURE__ */ jsx("line", { x1: "17", y1: "2", x2: "17", y2: "22" }),
                  /* @__PURE__ */ jsx("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
                  /* @__PURE__ */ jsx("line", { x1: "2", y1: "7", x2: "7", y2: "7" }),
                  /* @__PURE__ */ jsx("line", { x1: "2", y1: "17", x2: "7", y2: "17" }),
                  /* @__PURE__ */ jsx("line", { x1: "17", y1: "17", x2: "22", y2: "17" }),
                  /* @__PURE__ */ jsx("line", { x1: "17", y1: "7", x2: "22", y2: "7" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: "Shots" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowContinueFromVideo(true);
                resetContinueWorkflow();
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${showContinueFromVideo ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "Continue from Video - Extract frame → Close-up → Dialogue → Stitch",
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: [
                  /* @__PURE__ */ jsx("polygon", { points: "5 3 19 12 5 21 5 3" }),
                  /* @__PURE__ */ jsx("line", { x1: "19", y1: "5", x2: "19", y2: "19" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: "Continue" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setShowAIPrompt(true);
                checkOllamaStatus();
                setShowMovements(false);
                setShowCameraPanel(false);
                setShowStyles(false);
                setShowLighting(false);
                setShowAtmosphere(false);
                setShowDirectors(false);
                setShowEmotions(false);
                setShowShotSetups(false);
                setShowCharacterDNA(false);
                setShowSequencePlanner(false);
                setShow3DCamera(false);
                setShowBatchGenerator(false);
              },
              className: `h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${showAIPrompt ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black" : "bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,
              title: "AI Prompt Assistant - describe what you want in simple terms",
              children: [
                Icons.sparkle,
                /* @__PURE__ */ jsx("span", { children: "AI" })
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
          mode === "video" && /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${autoSelectModel() === "seedance-1.5" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : autoSelectModel() === "kling-o1" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`,
                children: autoSelectModel() === "seedance-1.5" ? "🗣️ Seedance" : autoSelectModel() === "kling-o1" ? "🎬 Kling O1" : "🎥 Kling 2.6"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-full left-0 mb-2 w-64 p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-white mb-1", children: "Model Auto-Selection" }),
              /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: explainModelSelection({
                startFrame: currentShot.startFrame,
                endFrame: currentShot.endFrame,
                motionPrompt: currentShot.motionPrompt
              }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-2 border-t border-gray-700 text-gray-500", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  "• ",
                  /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Seedance" }),
                  ": Dialogue/Lip-sync"
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  "• ",
                  /* @__PURE__ */ jsx("span", { className: "text-blue-400", children: "Kling O1" }),
                  ": Start→End transitions"
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  "• ",
                  /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: "Kling 2.6" }),
                  ": General action"
                ] })
              ] })
            ] })
          ] }),
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
        /* @__PURE__ */ jsx("div", { className: "cursor-pointer group", children: /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setStatusMessage("Uploading start frame...");
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await fetch("/api/cinema/upload", { method: "POST", body: formData });
                  const data = await res.json();
                  if (data.url) {
                    setStartFrame(data.url);
                    setStatusMessage("Start frame uploaded!");
                  } else {
                    setStatusMessage("Upload failed");
                  }
                } catch (err) {
                  setStatusMessage("Upload failed");
                }
                setTimeout(() => setStatusMessage(null), 1500);
              };
              input.click();
            },
            className: `w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${currentShot.startFrame ? "border-transparent" : "border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30"}`,
            children: currentShot.startFrame ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
              /* @__PURE__ */ jsx("img", { src: currentShot.startFrame, className: "w-full h-full object-cover rounded-lg" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setStartFrame("");
                  },
                  className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",
                  children: "x"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: Icons.plus }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium mt-1", children: "START" }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium", children: "FRAME" })
            ] })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "cursor-pointer group", children: /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setStatusMessage("Uploading end frame...");
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await fetch("/api/cinema/upload", { method: "POST", body: formData });
                  const data = await res.json();
                  if (data.url) {
                    setEndFrame(data.url);
                    setStatusMessage("End frame uploaded!");
                  } else {
                    setStatusMessage("Upload failed");
                  }
                } catch (err) {
                  setStatusMessage("Upload failed");
                }
                setTimeout(() => setStatusMessage(null), 1500);
              };
              input.click();
            },
            className: `w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${currentShot.endFrame ? "border-transparent" : "border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30"}`,
            children: currentShot.endFrame ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
              /* @__PURE__ */ jsx("img", { src: currentShot.endFrame, className: "w-full h-full object-cover rounded-lg" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setEndFrame("");
                  },
                  className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",
                  children: "x"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: Icons.plus }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium mt-1", children: "END" }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-500 uppercase font-medium", children: "FRAME" })
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "cursor-pointer group", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => !referenceImage && refInputRef.current?.click(),
              className: `w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${referenceImage ? "border-purple-500 border-solid" : "border-gray-600 hover:border-purple-400 group-hover:bg-purple-900/10"}`,
              children: referenceImage ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
                /* @__PURE__ */ jsx("img", { src: referenceImage, className: "w-full h-full object-cover rounded-lg" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setReferenceImage(null);
                    },
                    className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",
                    children: "x"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: Icons.plus }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-purple-400 uppercase font-medium mt-1", children: "REF" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-purple-400 uppercase font-medium", children: "CHAR" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", ref: refInputRef, onChange: async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            console.log("REF CHAR upload started:", file.name);
            setStatusMessage("Uploading reference...");
            const formData = new FormData();
            formData.append("file", file);
            try {
              const res = await fetch("/api/cinema/upload", { method: "POST", body: formData });
              const data = await res.json();
              console.log("Upload response:", data);
              if (data.url) {
                setReferenceImage(data.url);
                setStatusMessage("Reference uploaded!");
              } else {
                setStatusMessage("Upload failed: " + (data.error || "Unknown"));
              }
            } catch (err) {
              console.error("Upload error:", err);
              setStatusMessage("Upload failed");
            }
            setTimeout(() => setStatusMessage(null), 2e3);
            e.target.value = "";
          } })
        ] }),
        aiRefImages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          aiRefImages.slice(0, 3).map((ref, idx) => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10 group", children: [
            /* @__PURE__ */ jsx("img", { src: ref.url, className: "w-full h-full object-cover rounded-lg border border-yellow-500/50" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeAiRefImage(idx),
                className: "absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                children: /* @__PURE__ */ jsx("span", { className: "text-white text-[8px]", children: "x" })
              }
            )
          ] }, idx)),
          aiRefImages.length > 3 && /* @__PURE__ */ jsxs("div", { className: "w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 text-[10px]", children: [
            "+",
            aiRefImages.length - 3
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cursor-pointer", children: /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async (e) => {
                const file = e.target.files?.[0];
                if (!file || aiRefImages.length >= 7) return;
                console.log("Additional ref upload started:", file.name);
                setStatusMessage("Uploading ref image...");
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await fetch("/api/cinema/upload", { method: "POST", body: formData });
                  const data = await res.json();
                  console.log("Upload response:", data);
                  if (data.url) {
                    setAiRefImages((prev) => [...prev, { url: data.url, description: null }]);
                    setStatusMessage("Reference added!");
                  } else {
                    setStatusMessage("Upload failed: " + (data.error || "Unknown"));
                  }
                } catch (err) {
                  console.error("Upload error:", err);
                  setStatusMessage("Upload failed");
                }
                setTimeout(() => setStatusMessage(null), 2e3);
              };
              input.click();
            },
            className: "w-10 h-16 rounded-lg border border-dashed border-yellow-500/30 hover:border-yellow-500/60 flex flex-col items-center justify-center text-yellow-400/60 hover:text-yellow-400 transition-all",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg", children: "+" }),
              /* @__PURE__ */ jsx("span", { className: "text-[8px]", children: "REF" })
            ]
          }
        ) })
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
  ] }) });
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
