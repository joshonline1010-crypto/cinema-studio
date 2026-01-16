/**
 * PRODUCER AGENT - The Execution Orchestrator
 *
 * The Producer thinks about WHAT needs to be made, in WHAT ORDER, and WHY.
 *
 * This agent creates the EXECUTION GRAPH that answers:
 * 1. What REFS need to be generated first?
 * 2. What PHOTOS depend on which REFS?
 * 3. What VIDEOS depend on which PHOTOS?
 * 4. What needs to WAIT for what?
 * 5. What can run in PARALLEL?
 * 6. What is the CHAINING order?
 *
 * The output is a complete PRODUCTION MANIFEST with dependencies.
 */

import type { DirectorOutput, ShotPlan, RefAssignment } from './directorAgent';
import type { ShotCard, MasterRef } from './specTypes';
import { FAL_ENDPOINTS } from './audioPlannerAgent';

// ============================================
// TYPES
// ============================================

export type AssetType = 'CHARACTER_REF' | 'ENVIRONMENT_REF' | 'PROP_REF' | 'PHOTO' | 'VIDEO' | 'FRAME_EXTRACT' | 'SORA_MULTISHOT';

// Which tool/pipeline to use for rendering
export type RenderTool =
  | 'nano-banana'      // Image generation (default)
  | 'kling-2.6'        // Video - action, environment
  | 'kling-o1'         // Video - start→end transitions
  | 'seedance-1.5'     // Video - dialogue with lip sync
  | 'veed-fabric'      // Avatar lip sync
  | 'sora-2'           // B-roll multi-shot (NEW)
  | 'ffmpeg';          // Frame extraction

export interface ProductionAsset {
  id: string;
  type: AssetType;
  name: string;
  prompt?: string;

  // Dependencies
  dependsOn: string[];  // Asset IDs this depends on
  blockedBy: string[];  // Asset IDs that must complete first

  // Refs to use (for PHOTO/VIDEO types)
  refs?: {
    image_1?: string;  // Asset ID or 'BASE_WORLD'
    image_2?: string;  // Asset ID
    image_3?: string;  // Asset ID
  };

  // ============================================
  // RENDER TOOL ROUTING
  // ============================================
  // Which tool/pipeline to use for this asset
  render_tool?: RenderTool;

  // FAL API endpoint (from FAL_ENDPOINTS)
  fal_endpoint?: string;  // e.g., 'fal-ai/sora-2/image-to-video/pro'

  // Sora 2 specific (for SORA_MULTISHOT type)
  sora_config?: {
    ref_type: 'location_only' | 'character_only' | 'character_in_location' | 'collage';
    preset?: string;  // VEHICLE_FLYING, ATMOSPHERE_EXT, etc.
    shots_in_sequence?: number;  // How many shots this covers (1-3)
    reason?: string;  // Why using Sora 2
  };

  // Edit intent (passed through from Director)
  edit_intent?: {
    target_duration_ms?: number;
    pacing?: 'tight' | 'normal' | 'relaxed';
    cut_trigger?: string;
    allow_speed_up?: boolean;
    max_speed?: string;
  };

  // Dialogue info (passed through from Director)
  dialogue_info?: {
    has_dialogue: boolean;
    speech_mode: 'lip_sync' | 'pov' | 'inner_thoughts' | 'voice_only';
    character?: string;
  };

  // Execution status
  status: 'pending' | 'ready' | 'generating' | 'done' | 'error';
  canParallelize: boolean;
  priority: number;  // Lower = higher priority

  // Timing
  estimatedMs?: number;

  // Result
  url?: string;
}

export interface ExecutionPhase {
  phase: number;
  name: string;
  assets: string[];  // Asset IDs in this phase
  canParallelize: boolean;
  estimatedMs: number;
}

export interface ProductionManifest {
  projectId: string;
  concept: string;

  // All assets to produce
  assets: ProductionAsset[];

  // Execution order
  phases: ExecutionPhase[];

  // Dependency graph (asset ID → depends on asset IDs)
  dependencyGraph: Record<string, string[]>;

  // Reverse dependency graph (asset ID → blocks asset IDs)
  blocksGraph: Record<string, string[]>;

  // Summary
  summary: {
    totalAssets: number;
    refCount: number;
    photoCount: number;
    videoCount: number;
    soraCount: number;  // Sora 2 B-roll shots
    estimatedTotalMs: number;
    parallelizablePhases: number;
  };
}

// ============================================
// PRODUCER AGENT
// ============================================

export const producerAgent = {
  role: 'producer',
  name: 'Producer Agent',
  icon: '📊',
  color: 'blue',

  /**
   * Create a complete production manifest from Director's plan and Shot Cards
   */
  createManifest(
    concept: string,
    direction: DirectorOutput,
    shotCards: ShotCard[],
    existingRefs: MasterRef[]
  ): ProductionManifest {
    console.log('[Producer] 📊 Creating production manifest...');

    const assets: ProductionAsset[] = [];
    const dependencyGraph: Record<string, string[]> = {};
    const blocksGraph: Record<string, string[]> = {};

    // ========================================
    // PHASE 1: REFS (No dependencies)
    // ========================================

    // Check what refs we need vs what we have
    const neededRefs = this.analyzeNeededRefs(direction, shotCards);
    const existingRefIds = new Set(existingRefs.map(r => r.id));

    // Create CHARACTER_REF assets
    for (const charRef of neededRefs.characters) {
      if (!existingRefIds.has(charRef.id)) {
        const assetId = `ref_char_${charRef.name}`;
        assets.push({
          id: assetId,
          type: 'CHARACTER_REF',
          name: `Character: ${charRef.name}`,
          prompt: charRef.prompt,
          dependsOn: [],
          blockedBy: [],
          status: 'pending',
          canParallelize: true,  // All refs can generate in parallel!
          priority: 1,
          estimatedMs: 15000
        });
        dependencyGraph[assetId] = [];
        blocksGraph[assetId] = [];
      }
    }

    // Create ENVIRONMENT_REF asset
    if (neededRefs.environment && !existingRefIds.has('env_master')) {
      const assetId = 'ref_env_master';
      assets.push({
        id: assetId,
        type: 'ENVIRONMENT_REF',
        name: 'Environment Master',
        prompt: neededRefs.environment.prompt,
        dependsOn: [],
        blockedBy: [],
        status: 'pending',
        canParallelize: true,
        priority: 1,
        estimatedMs: 15000
      });
      dependencyGraph[assetId] = [];
      blocksGraph[assetId] = [];
    }

    // ========================================
    // PHASE 2: PHOTOS (Depend on refs)
    // ========================================

    for (let i = 0; i < shotCards.length; i++) {
      const shot = shotCards[i];
      const refAssignment = direction.ref_assignments?.[i];
      const assetId = `photo_${shot.shot_id}`;

      // Determine dependencies
      const deps: string[] = [];
      const refs: ProductionAsset['refs'] = {};

      // Image 1: Previous frame OR base world
      if (refAssignment?.chain_from_previous && i > 0) {
        // Depends on FRAME EXTRACT from previous video
        const prevFrameId = `frame_${shotCards[i-1].shot_id}`;
        deps.push(prevFrameId);
        refs.image_1 = prevFrameId;
      } else {
        refs.image_1 = 'BASE_WORLD';
      }

      // Image 2: Character ref
      const charRefId = `ref_char_${neededRefs.characters[0]?.name || 'hero'}`;
      if (assets.find(a => a.id === charRefId)) {
        deps.push(charRefId);
        refs.image_2 = charRefId;
      }

      // Image 3: Environment ref (for wide shots)
      if (shot.camera_rig_id?.includes('WIDE') || i === 0 || i === shotCards.length - 1) {
        const envRefId = 'ref_env_master';
        if (assets.find(a => a.id === envRefId)) {
          deps.push(envRefId);
          refs.image_3 = envRefId;
        }
      }

      assets.push({
        id: assetId,
        type: 'PHOTO',
        name: `Shot ${i + 1}: ${shot.camera_rig_id}`,
        prompt: shot.photo_prompt,
        dependsOn: deps,
        blockedBy: [...deps],
        refs,
        status: 'pending',
        canParallelize: !refAssignment?.chain_from_previous,  // Can parallelize if not chaining
        priority: 10 + i,
        estimatedMs: 18000
      });

      dependencyGraph[assetId] = deps;

      // Update blocks graph
      for (const dep of deps) {
        if (!blocksGraph[dep]) blocksGraph[dep] = [];
        blocksGraph[dep].push(assetId);
      }
    }

    // ========================================
    // PHASE 3: VIDEOS (Depend on photos)
    // ========================================
    // Check Director's shot_sequence for sora_candidate flags

    for (let i = 0; i < shotCards.length; i++) {
      const shot = shotCards[i];
      const shotPlan = direction.shot_sequence?.[i];
      const photoId = `photo_${shot.shot_id}`;
      const assetId = `video_${shot.shot_id}`;

      // ============================================
      // SORA 2 ROUTING CHECK
      // ============================================
      // If Director flagged this as sora_candidate, route to Sora 2
      const useSora = shotPlan?.sora_candidate === true;

      if (useSora && shotPlan) {
        // Use Sora 2 for this shot (or group of shots)
        assets.push({
          id: assetId,
          type: 'SORA_MULTISHOT',
          name: `Sora B-Roll ${i + 1}: ${shotPlan.sora_preset || 'multi-shot'}`,
          prompt: shot.video_motion_prompt,
          dependsOn: [photoId],  // Still needs the ref image
          blockedBy: [photoId],
          render_tool: 'sora-2',
          fal_endpoint: FAL_ENDPOINTS.SORA_IMAGE_TO_VIDEO,  // Direct endpoint reference
          sora_config: {
            ref_type: shotPlan.sora_ref_type || 'location_only',
            preset: shotPlan.sora_preset,
            shots_in_sequence: 1,  // Could be 1-3 depending on grouping
            reason: shotPlan.sora_reason
          },
          // Pass through edit intent from Director
          edit_intent: shotPlan.edit_intent ? {
            target_duration_ms: shotPlan.target_duration_ms,
            pacing: shotPlan.edit_intent.pacing,
            cut_trigger: shotPlan.edit_intent.cut_trigger,
            allow_speed_up: shotPlan.edit_intent.allow_speed_up,
            max_speed: shotPlan.edit_intent.max_speed
          } : undefined,
          // Pass through dialogue info from Director
          dialogue_info: shotPlan.dialogue_info,
          status: 'pending',
          canParallelize: true,  // Sora shots can run in parallel!
          priority: 20 + i,
          estimatedMs: 180000  // ~3 min for Sora 2
        });

        console.log(`[Producer] 🎬 Shot ${i + 1} → SORA 2 (${shotPlan.sora_reason})`);
      } else {
        // Normal pipeline
        const deps = [photoId];

        // If using Kling O1 with end frame, also depends on next photo
        if (shot.video_model === 'kling-o1' && i < shotCards.length - 1) {
          deps.push(`photo_${shotCards[i + 1].shot_id}`);
        }

        // Determine render tool from model
        let renderTool: RenderTool = 'kling-2.6';
        if (shot.video_model === 'kling-o1') renderTool = 'kling-o1';
        else if (shot.video_model === 'seedance-1.5') renderTool = 'seedance-1.5';

        // Check if dialogue needs lip sync
        const needsLipSync = shotPlan?.dialogue_info?.has_dialogue &&
                            shotPlan.dialogue_info.speech_mode === 'lip_sync';
        if (needsLipSync) {
          renderTool = 'seedance-1.5';  // Force Seedance for lip sync
        }

        assets.push({
          id: assetId,
          type: 'VIDEO',
          name: `Video ${i + 1}: ${renderTool}`,
          prompt: shot.video_motion_prompt,
          dependsOn: deps,
          blockedBy: [...deps],
          render_tool: renderTool,
          // Pass through edit intent from Director
          edit_intent: shotPlan?.edit_intent ? {
            target_duration_ms: shotPlan.target_duration_ms,
            pacing: shotPlan.edit_intent.pacing,
            cut_trigger: shotPlan.edit_intent.cut_trigger,
            allow_speed_up: shotPlan.edit_intent.allow_speed_up,
            max_speed: shotPlan.edit_intent.max_speed
          } : undefined,
          // Pass through dialogue info from Director
          dialogue_info: shotPlan?.dialogue_info,
          status: 'pending',
          canParallelize: false,  // Videos typically sequential for chaining
          priority: 20 + i,
          estimatedMs: 45000
        });

        // Log routing decision
        if (needsLipSync) {
          console.log(`[Producer] 🎬 Shot ${i + 1} → SEEDANCE (lip sync for ${shotPlan?.dialogue_info?.character})`);
        }
      }

      dependencyGraph[assetId] = assets.find(a => a.id === assetId)?.dependsOn || [];

      for (const dep of dependencyGraph[assetId]) {
        if (!blocksGraph[dep]) blocksGraph[dep] = [];
        blocksGraph[dep].push(assetId);
      }
    }

    // ========================================
    // PHASE 3b: FRAME EXTRACTS (For chaining)
    // ========================================

    for (let i = 0; i < shotCards.length - 1; i++) {
      const shot = shotCards[i];
      const nextRefAssignment = direction.ref_assignments?.[i + 1];

      // Only need frame extract if next shot chains from previous
      if (nextRefAssignment?.chain_from_previous) {
        const videoId = `video_${shot.shot_id}`;
        const assetId = `frame_${shot.shot_id}`;

        assets.push({
          id: assetId,
          type: 'FRAME_EXTRACT',
          name: `Last frame of Shot ${i + 1}`,
          dependsOn: [videoId],
          blockedBy: [videoId],
          status: 'pending',
          canParallelize: false,
          priority: 25 + i,
          estimatedMs: 2000
        });

        dependencyGraph[assetId] = [videoId];

        if (!blocksGraph[videoId]) blocksGraph[videoId] = [];
        blocksGraph[videoId].push(assetId);
      }
    }

    // ========================================
    // BUILD EXECUTION PHASES
    // ========================================

    const phases = this.buildExecutionPhases(assets, dependencyGraph);

    // ========================================
    // CREATE MANIFEST
    // ========================================

    const manifest: ProductionManifest = {
      projectId: `prod_${Date.now()}`,
      concept,
      assets,
      phases,
      dependencyGraph,
      blocksGraph,
      summary: {
        totalAssets: assets.length,
        refCount: assets.filter(a => a.type.includes('REF')).length,
        photoCount: assets.filter(a => a.type === 'PHOTO').length,
        videoCount: assets.filter(a => a.type === 'VIDEO').length,
        soraCount: assets.filter(a => a.type === 'SORA_MULTISHOT').length,
        estimatedTotalMs: assets.reduce((sum, a) => sum + (a.estimatedMs || 0), 0),
        parallelizablePhases: phases.filter(p => p.canParallelize).length
      }
    };

    console.log('[Producer] ✅ Manifest created:');
    console.log(`[Producer]   Total assets: ${manifest.summary.totalAssets}`);
    console.log(`[Producer]   Refs: ${manifest.summary.refCount}`);
    console.log(`[Producer]   Photos: ${manifest.summary.photoCount}`);
    console.log(`[Producer]   Videos: ${manifest.summary.videoCount}`);
    if (manifest.summary.soraCount > 0) {
      console.log(`[Producer]   🎬 Sora 2 B-Roll: ${manifest.summary.soraCount} (faster parallel!)`);
    }
    console.log(`[Producer]   Phases: ${phases.length}`);

    return manifest;
  },

  /**
   * Analyze what refs are needed based on Director's plan
   */
  analyzeNeededRefs(
    direction: DirectorOutput,
    shotCards: ShotCard[]
  ): {
    characters: Array<{ id: string; name: string; prompt: string }>;
    environment: { id: string; prompt: string } | null;
    props: Array<{ id: string; name: string; prompt: string }>;
  } {
    const characters: Array<{ id: string; name: string; prompt: string }> = [];
    const props: Array<{ id: string; name: string; prompt: string }> = [];

    // Extract character info from direction
    if (direction.character_directions) {
      for (const char of direction.character_directions) {
        characters.push({
          id: `char_${char.character}`,
          name: char.character,
          prompt: `${char.arc}, showing expressions: ${char.key_expressions.join(', ')}. 3x3 expression grid. THIS EXACT CHARACTER in each cell.`
        });
      }
    }

    // Default character if none specified
    if (characters.length === 0) {
      characters.push({
        id: 'char_hero',
        name: 'hero',
        prompt: 'Main character, 3x3 expression grid showing 9 expressions. THIS EXACT CHARACTER in each cell.'
      });
    }

    // Environment is always needed for wide shots
    const environment = {
      id: 'env_master',
      prompt: 'Environment from 9 angles, 3x3 grid. Empty scene, no characters.'
    };

    return { characters, environment, props };
  },

  /**
   * Build execution phases from dependency graph
   */
  buildExecutionPhases(
    assets: ProductionAsset[],
    dependencyGraph: Record<string, string[]>
  ): ExecutionPhase[] {
    const phases: ExecutionPhase[] = [];
    const completed = new Set<string>();
    let remaining = [...assets];
    let phaseNum = 1;

    while (remaining.length > 0) {
      // Find assets with all dependencies satisfied
      const ready = remaining.filter(asset => {
        const deps = dependencyGraph[asset.id] || [];
        return deps.every(dep => completed.has(dep));
      });

      if (ready.length === 0) {
        console.error('[Producer] Circular dependency detected!');
        break;
      }

      // Group by type for naming
      const types = [...new Set(ready.map(a => a.type))];
      const canParallelize = ready.every(a => a.canParallelize);

      phases.push({
        phase: phaseNum,
        name: types.join(' + '),
        assets: ready.map(a => a.id),
        canParallelize,
        estimatedMs: canParallelize
          ? Math.max(...ready.map(a => a.estimatedMs || 0))
          : ready.reduce((sum, a) => sum + (a.estimatedMs || 0), 0)
      });

      // Mark as completed
      for (const asset of ready) {
        completed.add(asset.id);
      }

      // Remove from remaining
      remaining = remaining.filter(a => !completed.has(a.id));
      phaseNum++;
    }

    return phases;
  },

  /**
   * Get next assets ready for execution
   */
  getReadyAssets(manifest: ProductionManifest): ProductionAsset[] {
    return manifest.assets.filter(asset => {
      if (asset.status !== 'pending') return false;

      // Check all dependencies are done
      const deps = manifest.dependencyGraph[asset.id] || [];
      return deps.every(depId => {
        const depAsset = manifest.assets.find(a => a.id === depId);
        return depAsset?.status === 'done';
      });
    });
  },

  /**
   * Mark asset as complete and return newly unblocked assets
   */
  completeAsset(manifest: ProductionManifest, assetId: string, url: string): string[] {
    const asset = manifest.assets.find(a => a.id === assetId);
    if (!asset) return [];

    asset.status = 'done';
    asset.url = url;

    // Find assets that were blocked by this one
    const unblocked = manifest.blocksGraph[assetId] || [];

    // Check which are now ready
    const nowReady: string[] = [];
    for (const blockedId of unblocked) {
      const blockedAsset = manifest.assets.find(a => a.id === blockedId);
      if (!blockedAsset || blockedAsset.status !== 'pending') continue;

      // Check if all its dependencies are done
      const deps = manifest.dependencyGraph[blockedId] || [];
      const allDepsDone = deps.every(depId => {
        const depAsset = manifest.assets.find(a => a.id === depId);
        return depAsset?.status === 'done';
      });

      if (allDepsDone) {
        nowReady.push(blockedId);
      }
    }

    return nowReady;
  },

  /**
   * Print execution plan for debugging
   */
  printExecutionPlan(manifest: ProductionManifest): string {
    let output = '# PRODUCTION EXECUTION PLAN\n\n';

    for (const phase of manifest.phases) {
      output += `## Phase ${phase.phase}: ${phase.name}\n`;
      output += `Parallel: ${phase.canParallelize ? 'YES' : 'NO'}\n`;
      output += `Est. time: ${phase.estimatedMs}ms\n\n`;

      for (const assetId of phase.assets) {
        const asset = manifest.assets.find(a => a.id === assetId);
        if (!asset) continue;

        output += `- ${asset.name}\n`;
        if (asset.dependsOn.length > 0) {
          output += `  Depends on: ${asset.dependsOn.join(', ')}\n`;
        }
        if (asset.refs) {
          output += `  Refs: ${JSON.stringify(asset.refs)}\n`;
        }
      }
      output += '\n';
    }

    output += `## Summary\n`;
    output += `Total assets: ${manifest.summary.totalAssets}\n`;
    output += `Est. total time: ${manifest.summary.estimatedTotalMs}ms\n`;

    return output;
  }
};

export default producerAgent;
