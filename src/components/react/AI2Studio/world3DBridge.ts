/**
 * AI2 Studio ↔ Multi-Angle Studio Pro Bridge
 *
 * Connects AI2 Studio's shot planning to the real 3D world viewer
 * so you can SEE each shot visually and PLAY the full sequence.
 *
 * Multi-Angle Studio: http://localhost:5173 (World Mode)
 * AI2 Studio: http://localhost:4321/ai2
 */

// ============================================
// WORLD STATE TYPES (from Multi-Angle Studio)
// ============================================

export interface WorldEntity {
  id: string;
  name: string;
  type: 'actor' | 'prop' | 'static' | 'vehicle' | 'location';
  pos: [number, number, number];  // x, y, z in meters
  rotation?: [number, number, number];
  refImage?: string;
  locked: boolean;
  visible: boolean;
  description?: string;
  performance?: {
    pose: string;
    gazeTarget: string;
    expression: string;
  };
}

export interface WorldCamera {
  id: string;
  name: string;
  pos: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  activeLens: number;
  locked: boolean;
}

export interface WorldLighting {
  direction: string;
  locked: boolean;
  intensity: number;
  color?: string;
}

export interface WorldEnvironment {
  timeOfDay: string;
  weather: string;
  sunAzimuth: number;
  sunElevation: number;
}

export interface World3DState {
  worldId: string;
  name: string;
  entities: WorldEntity[];
  cameras: WorldCamera[];
  lighting: WorldLighting;
  environment: WorldEnvironment;
}

// ============================================
// TIMELINE TYPES (for playback)
// ============================================

export interface TimelineBeat {
  id: string;
  index: number;
  startTime: number;      // ms
  duration: number;       // ms
  cameraId: string;
  cameraMovement?: string;
  entityActions: any[];
  dialogue: any[];
  label: string;
  narrativeBeat?: string;
  transitionType: 'CUT' | 'DISSOLVE' | 'FADE_BLACK' | 'FADE_WHITE';
  // Generated content
  generatedImageUrl?: string;
  generatedVideoUrl?: string;
  status: 'PLANNED' | 'GENERATING' | 'COMPLETE' | 'ERROR';
}

export interface Timeline3D {
  id: string;
  name: string;
  beats: TimelineBeat[];
  totalDuration: number;
  currentTime: number;
  isPlaying: boolean;
}

// ============================================
// BRIDGE API
// ============================================

const MULTI_ANGLE_STUDIO_URL = 'http://localhost:5173';
const STORAGE_KEY = 'ai2_world_bridge';

/**
 * Check if Multi-Angle Studio is running
 */
export async function is3DViewerAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${MULTI_ANGLE_STUDIO_URL}`, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Open Multi-Angle Studio in a new window (directly to World Mode)
 */
export function open3DViewer(): Window | null {
  // Add #world to auto-switch to World Mode on load
  return window.open(`${MULTI_ANGLE_STUDIO_URL}#world`, 'multi-angle-studio', 'width=1400,height=900');
}

/**
 * Save world state to localStorage (shared between apps)
 */
export function saveWorldToSharedStorage(world: World3DState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    world,
    updatedAt: Date.now(),
    source: 'ai2-studio'
  }));

  // Also dispatch event for same-page listeners
  window.dispatchEvent(new CustomEvent('world3d-updated', { detail: world }));
}

/**
 * Load world state from localStorage
 */
export function loadWorldFromSharedStorage(): World3DState | null {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return parsed.world;
  } catch {
    return null;
  }
}

/**
 * Save timeline to localStorage (for playback sync)
 */
export function saveTimelineToSharedStorage(timeline: Timeline3D): void {
  localStorage.setItem(`${STORAGE_KEY}_timeline`, JSON.stringify({
    timeline,
    updatedAt: Date.now(),
    source: 'ai2-studio'
  }));

  window.dispatchEvent(new CustomEvent('timeline3d-updated', { detail: timeline }));
}

/**
 * Load timeline from localStorage
 */
export function loadTimelineFromSharedStorage(): Timeline3D | null {
  const data = localStorage.getItem(`${STORAGE_KEY}_timeline`);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return parsed.timeline;
  } catch {
    return null;
  }
}

// ============================================
// CONVERT AI2 STUDIO → 3D WORLD
// ============================================

import type { ShotCard, WorldStateJSON } from './agents/specTypes';

/**
 * Convert AI2 Studio WorldStateJSON to Multi-Angle Studio format
 */
export function convertAI2WorldTo3D(ai2World: WorldStateJSON): World3DState {
  const entities: WorldEntity[] = (ai2World.entities || []).map((entity, i) => ({
    id: entity.entity_id || `entity_${i}`,
    name: entity.entity_id || `Entity ${i + 1}`,
    type: entity.entity_type as any || 'actor',
    pos: [
      entity.base_world_position?.x || 0,
      entity.base_world_position?.y || 0,
      entity.base_world_position?.z || 0
    ],
    rotation: [
      entity.base_orientation?.pitch_deg || 0,
      entity.base_orientation?.yaw_deg || 0,
      entity.base_orientation?.roll_deg || 0
    ],
    refImage: entity.ref_image_url,
    locked: entity.identity_lock || false,
    visible: true,
    description: entity.appearance_lock_notes
  }));

  return {
    worldId: ai2World.world_id || `world_${Date.now()}`,
    name: ai2World.world_id || 'AI2 World',
    entities,
    cameras: [], // Will be populated from camera rigs
    lighting: {
      direction: ai2World.lighting?.primary_light_direction || 'front-left',
      locked: ai2World.lighting?.direction_locked || true,
      intensity: ai2World.lighting?.intensity_baseline || 0.8,
      color: ai2World.lighting?.primary_light_color_temp
    },
    environment: {
      timeOfDay: 'AFTERNOON',
      weather: 'CLEAR',
      sunAzimuth: 45,
      sunElevation: 45
    }
  };
}

/**
 * Convert AI2 Studio ShotCards to Timeline beats
 */
export function convertShotCardsToTimeline(
  shotCards: ShotCard[],
  projectName: string = 'AI2 Project'
): Timeline3D {
  const beats: TimelineBeat[] = shotCards.map((shot, index) => ({
    id: shot.shot_id || `beat_${index}`,
    index,
    startTime: index * 5000, // 5 seconds each
    duration: (shot.video_duration_seconds || 5) * 1000,
    cameraId: shot.camera_rig_id || 'default',
    cameraMovement: extractCameraMovement(shot.video_motion_prompt),
    entityActions: [],
    dialogue: shot.dialogue_info ? [{
      speakerId: shot.dialogue_info.character || 'unknown',
      text: shot.dialogue_info.line_summary || '',
      emotion: 'NEUTRAL'
    }] : [],
    label: shot.photo_prompt?.substring(0, 50) || `Shot ${index + 1}`,
    narrativeBeat: mapEnergyToNarrative(index, shotCards.length),
    transitionType: 'CUT',
    generatedImageUrl: shot.refs?.image_1,
    status: 'PLANNED'
  }));

  const totalDuration = beats.reduce((sum, b) => sum + b.duration, 0);

  return {
    id: `timeline_${Date.now()}`,
    name: projectName,
    beats,
    totalDuration,
    currentTime: 0,
    isPlaying: false
  };
}

/**
 * Extract camera movement type from motion prompt
 */
function extractCameraMovement(motionPrompt?: string): string {
  if (!motionPrompt) return 'static';

  const prompt = motionPrompt.toLowerCase();

  if (prompt.includes('dolly in') || prompt.includes('push in')) return 'dolly_in';
  if (prompt.includes('dolly out') || prompt.includes('pull back')) return 'dolly_out';
  if (prompt.includes('orbit')) return 'orbit_left';
  if (prompt.includes('pan left')) return 'pan_left';
  if (prompt.includes('pan right')) return 'pan_right';
  if (prompt.includes('tilt up')) return 'tilt_up';
  if (prompt.includes('tilt down')) return 'tilt_down';
  if (prompt.includes('crane up')) return 'crane_up';
  if (prompt.includes('crane down')) return 'crane_down';
  if (prompt.includes('zoom in')) return 'zoom_in';
  if (prompt.includes('zoom out')) return 'zoom_out';
  if (prompt.includes('handheld')) return 'handheld';
  if (prompt.includes('truck left')) return 'truck_left';
  if (prompt.includes('truck right')) return 'truck_right';

  return 'static';
}

/**
 * Map shot index to narrative beat based on 15/35/50 formula
 */
function mapEnergyToNarrative(index: number, total: number): string {
  const position = index / total;

  if (position < 0.15) return 'SETUP';
  if (position < 0.5) return 'RISING';
  if (position < 0.85) return 'CLIMAX';
  return 'RESOLUTION';
}

// ============================================
// SYNC FUNCTIONS
// ============================================

/**
 * Push current AI2 shot plan to 3D viewer
 */
export function pushShotsTo3DViewer(
  shotCards: ShotCard[],
  worldState?: WorldStateJSON,
  projectName?: string
): void {
  // Convert and save world
  if (worldState) {
    const world3D = convertAI2WorldTo3D(worldState);
    saveWorldToSharedStorage(world3D);
  }

  // Convert and save timeline
  const timeline = convertShotCardsToTimeline(shotCards, projectName);
  saveTimelineToSharedStorage(timeline);

  console.log('[World3DBridge] Pushed', shotCards.length, 'shots to 3D viewer');
}

/**
 * Open 3D viewer with current shots loaded
 */
export function openViewerWithShots(
  shotCards: ShotCard[],
  worldState?: WorldStateJSON,
  projectName?: string
): Window | null {
  // Push data first
  pushShotsTo3DViewer(shotCards, worldState, projectName);

  // Open viewer
  return open3DViewer();
}

/**
 * Listen for updates from 3D viewer
 */
export function onWorldUpdated(callback: (world: World3DState) => void): () => void {
  const handler = (event: CustomEvent) => callback(event.detail);
  window.addEventListener('world3d-updated' as any, handler);
  return () => window.removeEventListener('world3d-updated' as any, handler);
}

/**
 * Listen for timeline updates (playback position, etc.)
 */
export function onTimelineUpdated(callback: (timeline: Timeline3D) => void): () => void {
  const handler = (event: CustomEvent) => callback(event.detail);
  window.addEventListener('timeline3d-updated' as any, handler);
  return () => window.removeEventListener('timeline3d-updated' as any, handler);
}

// ============================================
// PLAYBACK CONTROL
// ============================================

/**
 * Send playback command to 3D viewer
 */
export function sendPlaybackCommand(command: 'play' | 'pause' | 'stop' | 'seek', value?: number): void {
  localStorage.setItem(`${STORAGE_KEY}_playback`, JSON.stringify({
    command,
    value,
    timestamp: Date.now()
  }));

  window.dispatchEvent(new CustomEvent('playback-command', {
    detail: { command, value }
  }));
}

/**
 * Play full sequence from start
 */
export function playFullSequence(): void {
  sendPlaybackCommand('seek', 0);
  setTimeout(() => sendPlaybackCommand('play'), 100);
}

/**
 * Jump to specific shot
 */
export function jumpToShot(shotIndex: number): void {
  const timeline = loadTimelineFromSharedStorage();
  if (timeline && timeline.beats[shotIndex]) {
    sendPlaybackCommand('seek', timeline.beats[shotIndex].startTime);
  }
}

/**
 * Get current playback position
 */
export function getPlaybackPosition(): { beatIndex: number; timeMs: number } | null {
  const timeline = loadTimelineFromSharedStorage();
  if (!timeline) return null;

  const currentBeat = timeline.beats.find(b =>
    timeline.currentTime >= b.startTime &&
    timeline.currentTime < b.startTime + b.duration
  );

  return {
    beatIndex: currentBeat?.index || 0,
    timeMs: timeline.currentTime
  };
}
