/**
 * World State Persistence Module
 *
 * Handles saving and loading WorldState JSON files for continuity
 * across sessions. Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * Storage Structure:
 * - Each project gets a unique directory
 * - WORLD_STATE.json - The master world definition
 * - CAMERA_RIGS.json - Camera rig definitions
 * - SCENE_GEOGRAPHY_MEMORY.json - Scene memory for continuity
 * - SHOT_CARDS/ - Individual shot card JSONs
 * - VALIDATION_REPORTS/ - QC validation results
 */

import type {
  WorldEngineerOutput,
  WorldStateJSON,
  CameraRigsJSON,
  SceneGeographyMemory,
  ShotCard,
  ContinuityValidatorOutput
} from './specTypes';

// ============================================
// TYPES
// ============================================

export interface ProjectSession {
  projectId: string;
  projectName: string;
  createdAt: string;
  lastModified: string;
  concept: string;
  targetDuration: number;
  worldState: WorldStateJSON | null;
  cameraRigs: CameraRigsJSON | null;
  sceneGeographyMemory: SceneGeographyMemory | null;
  shotCards: ShotCard[];
  validationHistory: ContinuityValidatorOutput[];
  generatedAssets: GeneratedAssetRecord[];
}

export interface GeneratedAssetRecord {
  id: string;
  shotId: string;
  type: 'image' | 'video';
  url: string;
  generatedAt: string;
  validationStatus: 'pending' | 'passed' | 'failed' | 'repaired';
}

export interface WorldStateSnapshot {
  timestamp: string;
  version: number;
  worldState: WorldStateJSON;
  cameraRigs: CameraRigsJSON;
  sceneGeographyMemory: SceneGeographyMemory;
}

// ============================================
// IN-MEMORY STORAGE (Browser-Compatible)
// ============================================

// Since we're in a browser environment, we use localStorage for persistence
const STORAGE_KEY_PREFIX = 'ai2studio_world_';
const SESSIONS_INDEX_KEY = 'ai2studio_sessions_index';

/**
 * Generate a unique project ID
 */
function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all session IDs from storage index
 */
function getSessionsIndex(): string[] {
  try {
    const index = localStorage.getItem(SESSIONS_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  } catch {
    return [];
  }
}

/**
 * Update sessions index
 */
function updateSessionsIndex(projectIds: string[]): void {
  localStorage.setItem(SESSIONS_INDEX_KEY, JSON.stringify(projectIds));
}

// ============================================
// WORLD STATE PERSISTENCE API
// ============================================

export const worldStatePersistence = {
  /**
   * Create a new project session
   */
  createSession(params: {
    projectName: string;
    concept: string;
    targetDuration: number;
  }): ProjectSession {
    const projectId = generateProjectId();
    const now = new Date().toISOString();

    const session: ProjectSession = {
      projectId,
      projectName: params.projectName,
      createdAt: now,
      lastModified: now,
      concept: params.concept,
      targetDuration: params.targetDuration,
      worldState: null,
      cameraRigs: null,
      sceneGeographyMemory: null,
      shotCards: [],
      validationHistory: [],
      generatedAssets: []
    };

    // Save to storage
    this.saveSession(session);

    // Update index
    const index = getSessionsIndex();
    index.push(projectId);
    updateSessionsIndex(index);

    console.log('[WorldStatePersistence] Created session:', projectId);
    return session;
  },

  /**
   * Save a project session to storage
   */
  saveSession(session: ProjectSession): void {
    const key = `${STORAGE_KEY_PREFIX}${session.projectId}`;
    session.lastModified = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(session));
    console.log('[WorldStatePersistence] Saved session:', session.projectId);
  },

  /**
   * Load a project session from storage
   */
  loadSession(projectId: string): ProjectSession | null {
    const key = `${STORAGE_KEY_PREFIX}${projectId}`;
    const data = localStorage.getItem(key);
    if (!data) {
      console.log('[WorldStatePersistence] Session not found:', projectId);
      return null;
    }
    return JSON.parse(data) as ProjectSession;
  },

  /**
   * List all available sessions
   */
  listSessions(): Array<{ projectId: string; projectName: string; lastModified: string; concept: string }> {
    const index = getSessionsIndex();
    const sessions: Array<{ projectId: string; projectName: string; lastModified: string; concept: string }> = [];

    for (const projectId of index) {
      const session = this.loadSession(projectId);
      if (session) {
        sessions.push({
          projectId: session.projectId,
          projectName: session.projectName,
          lastModified: session.lastModified,
          concept: session.concept
        });
      }
    }

    // Sort by last modified (newest first)
    sessions.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    return sessions;
  },

  /**
   * Delete a project session
   */
  deleteSession(projectId: string): void {
    const key = `${STORAGE_KEY_PREFIX}${projectId}`;
    localStorage.removeItem(key);

    // Update index
    const index = getSessionsIndex().filter(id => id !== projectId);
    updateSessionsIndex(index);

    console.log('[WorldStatePersistence] Deleted session:', projectId);
  },

  /**
   * Save world engineer output to session
   */
  saveWorldState(projectId: string, output: WorldEngineerOutput): void {
    const session = this.loadSession(projectId);
    if (!session) {
      console.error('[WorldStatePersistence] Session not found:', projectId);
      return;
    }

    session.worldState = output.worldState;
    session.cameraRigs = output.cameraRigs;
    session.sceneGeographyMemory = output.sceneGeographyMemory;

    this.saveSession(session);
    console.log('[WorldStatePersistence] World state saved for:', projectId);
  },

  /**
   * Save shot cards to session
   */
  saveShotCards(projectId: string, shotCards: ShotCard[]): void {
    const session = this.loadSession(projectId);
    if (!session) {
      console.error('[WorldStatePersistence] Session not found:', projectId);
      return;
    }

    session.shotCards = shotCards;
    this.saveSession(session);
    console.log('[WorldStatePersistence] Shot cards saved:', shotCards.length);
  },

  /**
   * Add a generated asset record
   */
  addGeneratedAsset(projectId: string, asset: Omit<GeneratedAssetRecord, 'generatedAt' | 'validationStatus'>): void {
    const session = this.loadSession(projectId);
    if (!session) {
      console.error('[WorldStatePersistence] Session not found:', projectId);
      return;
    }

    session.generatedAssets.push({
      ...asset,
      generatedAt: new Date().toISOString(),
      validationStatus: 'pending'
    });

    this.saveSession(session);
  },

  /**
   * Update asset validation status
   */
  updateAssetValidation(projectId: string, assetId: string, status: GeneratedAssetRecord['validationStatus']): void {
    const session = this.loadSession(projectId);
    if (!session) return;

    const asset = session.generatedAssets.find(a => a.id === assetId);
    if (asset) {
      asset.validationStatus = status;
      this.saveSession(session);
    }
  },

  /**
   * Save validation result to history
   */
  addValidationResult(projectId: string, result: ContinuityValidatorOutput): void {
    const session = this.loadSession(projectId);
    if (!session) {
      console.error('[WorldStatePersistence] Session not found:', projectId);
      return;
    }

    session.validationHistory.push(result);
    this.saveSession(session);
    console.log('[WorldStatePersistence] Validation result added. Total:', session.validationHistory.length);
  },

  /**
   * Get the latest world state for a project
   */
  getWorldState(projectId: string): WorldStateJSON | null {
    const session = this.loadSession(projectId);
    return session?.worldState || null;
  },

  /**
   * Get camera rigs for a project
   */
  getCameraRigs(projectId: string): CameraRigsJSON | null {
    const session = this.loadSession(projectId);
    return session?.cameraRigs || null;
  },

  /**
   * Get scene geography memory for a project
   */
  getSceneGeographyMemory(projectId: string): SceneGeographyMemory | null {
    const session = this.loadSession(projectId);
    return session?.sceneGeographyMemory || null;
  },

  /**
   * Export session to JSON (for backup/sharing)
   */
  exportSession(projectId: string): string | null {
    const session = this.loadSession(projectId);
    if (!session) return null;
    return JSON.stringify(session, null, 2);
  },

  /**
   * Import session from JSON
   */
  importSession(json: string): ProjectSession | null {
    try {
      const session = JSON.parse(json) as ProjectSession;

      // Generate new ID to avoid conflicts
      const oldId = session.projectId;
      session.projectId = generateProjectId();
      session.projectName = `${session.projectName} (imported)`;
      session.lastModified = new Date().toISOString();

      this.saveSession(session);

      // Update index
      const index = getSessionsIndex();
      index.push(session.projectId);
      updateSessionsIndex(index);

      console.log('[WorldStatePersistence] Imported session:', oldId, '->', session.projectId);
      return session;
    } catch (error) {
      console.error('[WorldStatePersistence] Import failed:', error);
      return null;
    }
  },

  /**
   * Create a snapshot of current world state (for version history)
   */
  createSnapshot(projectId: string): WorldStateSnapshot | null {
    const session = this.loadSession(projectId);
    if (!session || !session.worldState || !session.cameraRigs || !session.sceneGeographyMemory) {
      return null;
    }

    return {
      timestamp: new Date().toISOString(),
      version: session.validationHistory.length + 1,
      worldState: session.worldState,
      cameraRigs: session.cameraRigs,
      sceneGeographyMemory: session.sceneGeographyMemory
    };
  },

  /**
   * Get storage usage stats
   */
  getStorageStats(): { sessionsCount: number; totalSize: string } {
    const index = getSessionsIndex();
    let totalBytes = 0;

    for (const projectId of index) {
      const key = `${STORAGE_KEY_PREFIX}${projectId}`;
      const data = localStorage.getItem(key);
      if (data) {
        totalBytes += data.length * 2; // UTF-16 encoding
      }
    }

    return {
      sessionsCount: index.length,
      totalSize: `${(totalBytes / 1024).toFixed(2)} KB`
    };
  },

  /**
   * Clear all sessions (use with caution!)
   */
  clearAllSessions(): void {
    const index = getSessionsIndex();
    for (const projectId of index) {
      const key = `${STORAGE_KEY_PREFIX}${projectId}`;
      localStorage.removeItem(key);
    }
    updateSessionsIndex([]);
    console.log('[WorldStatePersistence] All sessions cleared');
  }
};

// ============================================
// EXPORTS
// ============================================

export default worldStatePersistence;
