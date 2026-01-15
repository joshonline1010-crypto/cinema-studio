/**
 * CWS Store - Zustand state management for Continuous World Storytelling
 *
 * Manages world state, entities, camera rigs, and continuity tracking.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WorldState,
  Entity,
  Character,
  Vehicle,
  Prop,
  CameraRig,
  PanelState,
  DirectionLock,
  ContinuityViolation,
  Vector3,
  FacingDirection,
  StateDelta,
  EnvironmentState,
  ViolationType,
  ViolationSeverity
} from './types';
import {
  STANDARD_RIGS,
  createDefaultWorldState,
  createDefaultStateDelta,
  createDefaultEntityState,
  createDefaultPosition
} from './types';

// ============================================
// STORE INTERFACE
// ============================================

interface CWSStore {
  // Core state
  worldState: WorldState | null;
  cwsEnabled: boolean;
  violations: ContinuityViolation[];

  // Actions - World State
  initializeWorldState: (sceneId: string) => void;
  resetWorldState: () => void;
  toggleCWS: (enabled: boolean) => void;

  // Actions - Entities
  addCharacter: (character: Partial<Character> & { id: string; name: string }) => void;
  addVehicle: (vehicle: Partial<Vehicle> & { id: string; name: string }) => void;
  addProp: (prop: Partial<Prop> & { id: string; name: string }) => void;
  updateEntityPosition: (entityId: string, position: Vector3) => void;
  updateEntityFacing: (entityId: string, facing: FacingDirection) => void;
  updateEntityState: (entityId: string, newState: string, shotId: string) => void;
  removeEntity: (entityId: string) => void;

  // Actions - Camera Rigs
  addCameraRig: (rig: CameraRig) => void;
  removeCameraRig: (rigId: string) => void;
  setActiveRig: (rigId: string) => void;

  // Actions - Panels
  advancePanel: (shotId: string, rigId: string, visibleEntityIds: string[]) => void;
  updatePanelStateDelta: (delta: StateDelta) => void;

  // Actions - Direction Locks
  addDirectionLock: (lock: Omit<DirectionLock, 'active'>) => void;
  removeDirectionLock: (entityId: string, lockType: DirectionLock['lockType']) => void;
  toggleDirectionLock: (entityId: string, lockType: DirectionLock['lockType'], active: boolean) => void;

  // Actions - Environment
  updateEnvironment: (updates: Partial<EnvironmentState>) => void;

  // Actions - 180-Degree Rule
  setLineOfAction: (entityA: string, entityB: string) => void;
  clearLineOfAction: () => void;

  // Actions - Violations
  checkContinuity: () => ContinuityViolation[];
  clearViolations: () => void;
  acknowledgeViolation: (index: number) => void;

  // Utilities
  getEntity: (entityId: string) => Entity | undefined;
  getVisibleEntities: () => Entity[];
  generateLockPhrase: (entityId?: string) => string;
  exportWorldState: () => string;
  importWorldState: (json: string) => boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const calculateDistance = (a: Vector3, b: Vector3): number => {
  return Math.sqrt(
    Math.pow(b.x - a.x, 2) +
    Math.pow(b.y - a.y, 2) +
    Math.pow(b.z - a.z, 2)
  );
};

const detectViolations = (current: WorldState, previous: PanelState | null): ContinuityViolation[] => {
  const violations: ContinuityViolation[] = [];

  if (!previous || !current.cwsEnabled) return violations;

  // Check each character for violations
  for (const [id, char] of Object.entries(current.characters)) {
    // Check travel direction consistency
    if (char.travelDirection?.locked) {
      const lock = current.directionLocks.find(
        l => l.entityId === id && l.lockType === 'TRAVEL' && l.active
      );
      if (lock && lock.lockedValue !== char.travelDirection.horizontal) {
        violations.push({
          type: 'TRAVEL_DIRECTION',
          severity: 'critical',
          entityId: id,
          fromPanel: previous.panelIndex,
          toPanel: current.currentPanel.panelIndex,
          description: `${char.name} travel direction changed from ${lock.lockedValue} to ${char.travelDirection.horizontal}`,
          suggestedFix: 'Add "NO MIRRORING. NO DIRECTION FLIP." to prompt'
        });
      }
    }
  }

  // Check 180-degree rule
  if (current.lineOfAction) {
    const currentRig = current.cameraRigs[current.currentPanel.activeRig];
    const prevRig = current.cameraRigs[previous.activeRig];

    if (currentRig?.axisSide && prevRig?.axisSide && currentRig.axisSide !== prevRig.axisSide) {
      violations.push({
        type: '180_RULE_CROSS',
        severity: 'high',
        fromPanel: previous.panelIndex,
        toPanel: current.currentPanel.panelIndex,
        description: 'Camera crossed line of action without neutral bridge',
        suggestedFix: 'Insert neutral shot or continuous camera movement to bridge'
      });
    }
  }

  // Check for entity teleporting (position jumps > 2 units without movement shown)
  const movedEntities = current.currentPanel.stateDelta.entitiesMoved;
  for (const move of movedEntities) {
    const distance = calculateDistance(move.from, move.to);
    if (distance > 2) {
      violations.push({
        type: 'TELEPORT',
        severity: 'high',
        entityId: move.entityId,
        fromPanel: previous.panelIndex,
        toPanel: current.currentPanel.panelIndex,
        description: `Entity moved ${distance.toFixed(1)} units without shown movement`,
        suggestedFix: 'Add intermediate shot showing movement, or reduce distance'
      });
    }
  }

  // Check for state regression (props going backwards)
  for (const [id, prop] of Object.entries(current.props)) {
    const stateChange = current.currentPanel.stateDelta.statesChanged.find(s => s.entityId === id);
    if (stateChange) {
      const fromIndex = prop.possibleStates.indexOf(stateChange.from);
      const toIndex = prop.possibleStates.indexOf(stateChange.to);
      if (toIndex < fromIndex && toIndex >= 0) {
        violations.push({
          type: 'STATE_REGRESSION',
          severity: 'medium',
          entityId: id,
          fromPanel: previous.panelIndex,
          toPanel: current.currentPanel.panelIndex,
          description: `${prop.name} state regressed from ${stateChange.from} to ${stateChange.to}`,
          suggestedFix: 'Show the state reset action or maintain previous state'
        });
      }
    }
  }

  return violations;
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useCWSStore = create<CWSStore>()(
  persist(
    (set, get) => ({
      // Initial state
      worldState: null,
      cwsEnabled: false,
      violations: [],

      // Initialize world state for a new scene
      initializeWorldState: (sceneId: string) => {
        set({
          worldState: createDefaultWorldState(sceneId),
          violations: []
        });
      },

      // Reset world state
      resetWorldState: () => {
        set({ worldState: null, violations: [] });
      },

      // Toggle CWS mode
      toggleCWS: (enabled: boolean) => {
        const { worldState } = get();
        if (worldState) {
          set({
            worldState: { ...worldState, cwsEnabled: enabled },
            cwsEnabled: enabled
          });
        } else {
          set({ cwsEnabled: enabled });
        }
      },

      // Add a character
      addCharacter: (charInput) => {
        const { worldState } = get();
        if (!worldState) return;

        const character: Character = {
          type: 'character',
          position: charInput.position || createDefaultPosition(),
          facing: charInput.facing || 'CAMERA',
          state: charInput.state || createDefaultEntityState(),
          screenPosition: charInput.screenPosition || 'CENTER',
          lookDirection: charInput.lookDirection || 'CAMERA',
          ...charInput
        };

        set({
          worldState: {
            ...worldState,
            characters: { ...worldState.characters, [character.id]: character },
            entities: { ...worldState.entities, [character.id]: character }
          }
        });
      },

      // Add a vehicle
      addVehicle: (vehicleInput) => {
        const { worldState } = get();
        if (!worldState) return;

        const vehicle: Vehicle = {
          type: 'vehicle',
          position: vehicleInput.position || createDefaultPosition(),
          facing: vehicleInput.facing || 'RIGHT',
          state: vehicleInput.state || createDefaultEntityState(),
          orientation: vehicleInput.orientation || 'PROFILE_RIGHT',
          interiorEstablished: vehicleInput.interiorEstablished || false,
          exteriorEstablished: vehicleInput.exteriorEstablished || false,
          ...vehicleInput
        };

        set({
          worldState: {
            ...worldState,
            vehicles: { ...worldState.vehicles, [vehicle.id]: vehicle },
            entities: { ...worldState.entities, [vehicle.id]: vehicle }
          }
        });
      },

      // Add a prop
      addProp: (propInput) => {
        const { worldState } = get();
        if (!worldState) return;

        const prop: Prop = {
          type: 'prop',
          position: propInput.position || createDefaultPosition(),
          facing: propInput.facing || 'CAMERA',
          state: propInput.state || createDefaultEntityState(),
          possibleStates: propInput.possibleStates || ['default'],
          currentStateIndex: propInput.currentStateIndex || 0,
          ...propInput
        };

        set({
          worldState: {
            ...worldState,
            props: { ...worldState.props, [prop.id]: prop },
            entities: { ...worldState.entities, [prop.id]: prop }
          }
        });
      },

      // Update entity position
      updateEntityPosition: (entityId: string, position: Vector3) => {
        const { worldState } = get();
        if (!worldState) return;

        const entity = worldState.entities[entityId];
        if (!entity) return;

        const updatedEntity = { ...entity, position };

        // Update in appropriate collection
        const updates: Partial<WorldState> = {
          entities: { ...worldState.entities, [entityId]: updatedEntity }
        };

        if (entity.type === 'character') {
          updates.characters = { ...worldState.characters, [entityId]: updatedEntity as Character };
        } else if (entity.type === 'vehicle') {
          updates.vehicles = { ...worldState.vehicles, [entityId]: updatedEntity as Vehicle };
        } else if (entity.type === 'prop') {
          updates.props = { ...worldState.props, [entityId]: updatedEntity as Prop };
        }

        set({ worldState: { ...worldState, ...updates } });
      },

      // Update entity facing
      updateEntityFacing: (entityId: string, facing: FacingDirection) => {
        const { worldState } = get();
        if (!worldState) return;

        const entity = worldState.entities[entityId];
        if (!entity) return;

        const updatedEntity = { ...entity, facing };

        set({
          worldState: {
            ...worldState,
            entities: { ...worldState.entities, [entityId]: updatedEntity },
            characters: entity.type === 'character'
              ? { ...worldState.characters, [entityId]: updatedEntity as Character }
              : worldState.characters
          }
        });
      },

      // Update entity state
      updateEntityState: (entityId: string, newState: string, shotId: string) => {
        const { worldState } = get();
        if (!worldState) return;

        const entity = worldState.entities[entityId];
        if (!entity) return;

        const transition = {
          from: entity.state.current,
          to: newState,
          panel: worldState.currentPanel.panelIndex,
          shotId
        };

        const updatedEntity = {
          ...entity,
          state: {
            current: newState,
            history: [...entity.state.history, transition]
          }
        };

        set({
          worldState: {
            ...worldState,
            entities: { ...worldState.entities, [entityId]: updatedEntity }
          }
        });
      },

      // Remove entity
      removeEntity: (entityId: string) => {
        const { worldState } = get();
        if (!worldState) return;

        const { [entityId]: _, ...entities } = worldState.entities;
        const { [entityId]: _c, ...characters } = worldState.characters;
        const { [entityId]: _v, ...vehicles } = worldState.vehicles;
        const { [entityId]: _p, ...props } = worldState.props;

        set({
          worldState: { ...worldState, entities, characters, vehicles, props }
        });
      },

      // Add camera rig
      addCameraRig: (rig: CameraRig) => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: {
            ...worldState,
            cameraRigs: { ...worldState.cameraRigs, [rig.id]: rig }
          }
        });
      },

      // Remove camera rig
      removeCameraRig: (rigId: string) => {
        const { worldState } = get();
        if (!worldState) return;

        const { [rigId]: _, ...cameraRigs } = worldState.cameraRigs;
        set({ worldState: { ...worldState, cameraRigs } });
      },

      // Set active camera rig
      setActiveRig: (rigId: string) => {
        const { worldState } = get();
        if (!worldState || !worldState.cameraRigs[rigId]) return;

        set({
          worldState: {
            ...worldState,
            currentPanel: { ...worldState.currentPanel, activeRig: rigId }
          }
        });
      },

      // Advance to next panel
      advancePanel: (shotId: string, rigId: string, visibleEntityIds: string[]) => {
        const { worldState } = get();
        if (!worldState) return;

        const previousPanel = worldState.currentPanel;
        const newPanel: PanelState = {
          panelIndex: previousPanel.panelIndex + 1,
          shotId,
          activeRig: rigId,
          visibleEntities: visibleEntityIds,
          stateDelta: createDefaultStateDelta()
        };

        const updatedWorldState = {
          ...worldState,
          currentPanel: newPanel,
          panelHistory: [...worldState.panelHistory, previousPanel]
        };

        // Check for violations
        const violations = detectViolations(updatedWorldState, previousPanel);

        set({
          worldState: updatedWorldState,
          violations: [...get().violations, ...violations]
        });
      },

      // Update panel state delta
      updatePanelStateDelta: (delta: StateDelta) => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: {
            ...worldState,
            currentPanel: {
              ...worldState.currentPanel,
              stateDelta: delta
            }
          }
        });
      },

      // Add direction lock
      addDirectionLock: (lock) => {
        const { worldState } = get();
        if (!worldState) return;

        const newLock: DirectionLock = { ...lock, active: true };

        set({
          worldState: {
            ...worldState,
            directionLocks: [...worldState.directionLocks, newLock]
          }
        });
      },

      // Remove direction lock
      removeDirectionLock: (entityId, lockType) => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: {
            ...worldState,
            directionLocks: worldState.directionLocks.filter(
              l => !(l.entityId === entityId && l.lockType === lockType)
            )
          }
        });
      },

      // Toggle direction lock
      toggleDirectionLock: (entityId, lockType, active) => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: {
            ...worldState,
            directionLocks: worldState.directionLocks.map(l =>
              l.entityId === entityId && l.lockType === lockType
                ? { ...l, active }
                : l
            )
          }
        });
      },

      // Update environment
      updateEnvironment: (updates) => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: {
            ...worldState,
            environment: { ...worldState.environment, ...updates }
          }
        });
      },

      // Set line of action for 180-degree rule
      setLineOfAction: (entityA, entityB) => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: {
            ...worldState,
            lineOfAction: {
              entityA,
              entityB,
              currentSide: 'A',
              violated: false
            }
          }
        });
      },

      // Clear line of action
      clearLineOfAction: () => {
        const { worldState } = get();
        if (!worldState) return;

        set({
          worldState: { ...worldState, lineOfAction: undefined }
        });
      },

      // Check continuity and return violations
      checkContinuity: () => {
        const { worldState } = get();
        if (!worldState || !worldState.cwsEnabled) return [];

        const lastPanel = worldState.panelHistory[worldState.panelHistory.length - 1] || null;
        return detectViolations(worldState, lastPanel);
      },

      // Clear all violations
      clearViolations: () => {
        set({ violations: [] });
      },

      // Acknowledge a specific violation
      acknowledgeViolation: (index) => {
        const { violations } = get();
        set({ violations: violations.filter((_, i) => i !== index) });
      },

      // Get entity by ID
      getEntity: (entityId) => {
        const { worldState } = get();
        return worldState?.entities[entityId];
      },

      // Get visible entities for current panel
      getVisibleEntities: () => {
        const { worldState } = get();
        if (!worldState) return [];

        return worldState.currentPanel.visibleEntities
          .map(id => worldState.entities[id])
          .filter(Boolean);
      },

      // Generate direction lock phrase for prompts
      generateLockPhrase: (entityId) => {
        const { worldState } = get();
        if (!worldState || !worldState.cwsEnabled) return '';

        const locks: string[] = ['THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE'];

        // Add entity-specific locks
        if (entityId) {
          const entityLocks = worldState.directionLocks.filter(
            l => l.entityId === entityId && l.active
          );

          for (const lock of entityLocks) {
            if (lock.lockType === 'FACING') {
              locks.push(`Character facing ${lock.lockedValue} - MAINTAIN EXACT DIRECTION`);
            }
            if (lock.lockType === 'TRAVEL') {
              locks.push(`Travel direction: ${lock.lockedValue}. NO MIRRORING. NO DIRECTION FLIP.`);
            }
          }
        }

        // Add environment locks
        if (worldState.environment.lightingDirection) {
          locks.push(`Lighting from ${worldState.environment.lightingDirection} - SAME DIRECTION`);
        }

        return locks.join('. ') + '.';
      },

      // Export world state as JSON
      exportWorldState: () => {
        const { worldState } = get();
        return JSON.stringify(worldState, null, 2);
      },

      // Import world state from JSON
      importWorldState: (json) => {
        try {
          const imported = JSON.parse(json) as WorldState;
          set({ worldState: imported, violations: [] });
          return true;
        } catch {
          return false;
        }
      }
    }),
    {
      name: 'cws-store',
      partialize: (state) => ({
        worldState: state.worldState,
        cwsEnabled: state.cwsEnabled
      })
    }
  )
);

// Export for use in components
export default useCWSStore;
