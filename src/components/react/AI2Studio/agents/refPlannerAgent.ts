/**
 * REF PLANNER AGENT - Plans Reference Images and Chaining Strategy
 *
 * This agent runs AFTER Director selects shots, BEFORE Ref Generation.
 * It owns ALL decisions about:
 * 1. What CHARACTER_MASTER refs are needed
 * 2. What ENVIRONMENT_MASTER refs are needed
 * 3. What PROP refs are needed
 * 4. Which shots chain from PREVIOUS_FRAME
 * 5. Ref priority order for each shot (Image 1, 2, 3)
 *
 * REPLACES: Council's "production" advice which was just suggestions nobody acted on.
 * NOW: Ref Planner creates a concrete manifest that Ref Generation executes.
 */

import type { ShotPlan, DirectorOutput } from './directorAgent';
import type { WorldEngineerOutput } from './specTypes';
import type { StoryAnalysisOutput } from './storyAnalystAgent';
import type { CoveragePlannerOutput, CoverageAngle } from './coveragePlannerAgent';

// ============================================
// TYPES
// ============================================

export interface RefRequirement {
  ref_id: string;  // e.g., "char_hero", "env_building_exterior"
  ref_type: 'CHARACTER_MASTER' | 'ENVIRONMENT_MASTER' | 'PROP_MASTER';
  name: string;  // Human readable name
  description: string;  // What this ref captures
  grid_type: '3x3_expressions' | '3x3_angles' | '6_views' | 'single';
  priority: 'required' | 'recommended' | 'optional';
  used_in_shots: number[];  // Which shot numbers need this ref
  generation_prompt_hint: string;  // Hint for ref generation
}

export interface ShotRefStack {
  shot_number: number;
  image_1: string | 'PREVIOUS_FRAME' | 'BASE_WORLD';  // Highest priority
  image_2: string | null;
  image_3: string | null;
  chain_from_previous: boolean;
  chain_reasoning: string;
  continuity_phrases: string[];  // Lock phrases to add to prompts
}

export interface ChainingStrategy {
  strategy: 'full_chain' | 'selective_chain' | 'no_chain';
  description: string;
  chain_breaks: number[];  // Shot numbers where chain breaks
  chain_break_reasons: string[];
}

export interface RefPlannerInput {
  direction: DirectorOutput;
  coverage?: CoveragePlannerOutput;
  world?: WorldEngineerOutput;
  storyAnalysis?: StoryAnalysisOutput;
  existingRefs?: { id: string; type: string; url?: string }[];
}

export interface RefPlannerOutput {
  ref_requirements: RefRequirement[];
  shot_ref_stacks: ShotRefStack[];
  chaining_strategy: ChainingStrategy;
  generation_order: string[];  // Order to generate refs
  summary: {
    total_refs_needed: number;
    character_refs: number;
    environment_refs: number;
    prop_refs: number;
    shots_chaining: number;
    shots_fresh: number;
  };
}

// ============================================
// REF PLANNER AGENT
// ============================================

export const refPlannerAgent = {
  role: 'ref_planner',
  name: 'Ref Planner Agent',
  icon: '🖼️',
  color: 'green',

  /**
   * Plan all refs and chaining for the production
   */
  execute(input: RefPlannerInput): RefPlannerOutput {
    console.log('[RefPlanner] 🖼️ Planning refs and chaining strategy...');

    const shots = input.direction.shot_sequence || [];
    const entities = input.world?.entities || [];
    const existingRefs = input.existingRefs || [];

    // Step 1: Identify all required refs
    const refRequirements = this.identifyRefRequirements(shots, entities, input.storyAnalysis);

    // Step 2: Filter out refs we already have
    const neededRefs = refRequirements.filter(req => {
      const exists = existingRefs.some(
        existing => existing.id === req.ref_id && existing.url
      );
      if (exists) {
        console.log(`[RefPlanner] Ref already exists: ${req.ref_id}`);
      }
      return !exists;
    });

    // Step 3: Plan chaining strategy
    const chainingStrategy = this.planChainingStrategy(shots, input.direction);

    // Step 4: Build ref stacks for each shot
    const shotRefStacks = this.buildShotRefStacks(
      shots,
      refRequirements,
      chainingStrategy,
      input.direction
    );

    // Step 5: Determine generation order
    const generationOrder = this.determineGenerationOrder(neededRefs);

    // Summary
    const summary = {
      total_refs_needed: neededRefs.length,
      character_refs: neededRefs.filter(r => r.ref_type === 'CHARACTER_MASTER').length,
      environment_refs: neededRefs.filter(r => r.ref_type === 'ENVIRONMENT_MASTER').length,
      prop_refs: neededRefs.filter(r => r.ref_type === 'PROP_MASTER').length,
      shots_chaining: shotRefStacks.filter(s => s.chain_from_previous).length,
      shots_fresh: shotRefStacks.filter(s => !s.chain_from_previous).length
    };

    console.log('[RefPlanner] ✅ Ref plan complete');
    console.log(`[RefPlanner] Refs needed: ${summary.total_refs_needed}`);
    console.log(`[RefPlanner] Chaining: ${summary.shots_chaining}/${shots.length} shots chain`);

    return {
      ref_requirements: refRequirements,
      shot_ref_stacks: shotRefStacks,
      chaining_strategy: chainingStrategy,
      generation_order: generationOrder,
      summary
    };
  },

  /**
   * Identify what refs are needed based on shots and story analysis entities
   */
  identifyRefRequirements(
    shots: ShotPlan[],
    entities: any[],
    storyAnalysis?: StoryAnalysisOutput
  ): RefRequirement[] {
    const refs: RefRequirement[] = [];

    // PRIORITY: Use extracted_entities from story analysis - these have ACTUAL names!
    const extractedEntities = storyAnalysis?.extracted_entities;

    if (extractedEntities) {
      console.log('[RefPlanner] Using extracted entities from story analysis');

      // Create CHARACTER_MASTER refs from extracted characters
      for (const char of extractedEntities.characters || []) {
        const usedInShots = shots.map(s => s.shot_number); // Characters appear in all shots
        refs.push({
          ref_id: `char_${char.name.replace(/\s+/g, '_')}`,
          ref_type: 'CHARACTER_MASTER',
          name: char.name,  // ACTUAL name like "woman", "police"
          description: char.description || `3x3 expression grid for ${char.name}`,
          grid_type: '3x3_expressions',
          priority: char.role === 'protagonist' ? 'required' : 'recommended',
          used_in_shots: usedInShots,
          generation_prompt_hint: `${char.name} - ${char.description}`
        });
      }

      // Create ENVIRONMENT_MASTER refs from extracted locations
      for (const loc of extractedEntities.locations || []) {
        const wideShots = shots
          .filter(s => s.shot_type.includes('WIDE') || s.shot_type.includes('ESTABLISHING'))
          .map(s => s.shot_number);

        refs.push({
          ref_id: `env_${loc.name.replace(/\s+/g, '_')}`,
          ref_type: 'ENVIRONMENT_MASTER',
          name: loc.name,  // ACTUAL name like "building", "street"
          description: loc.description || `3x3 angle grid for ${loc.name}`,
          grid_type: '3x3_angles',
          priority: 'required',
          used_in_shots: wideShots.length > 0 ? wideShots : [1, shots.length],
          generation_prompt_hint: `${loc.name} - ${loc.description}`
        });
      }

      // Create PROP_MASTER refs from extracted vehicles and props
      for (const vehicle of extractedEntities.vehicles || []) {
        refs.push({
          ref_id: `vehicle_${vehicle.name.replace(/\s+/g, '_')}`,
          ref_type: 'PROP_MASTER',
          name: vehicle.name,  // ACTUAL name like "escape plane", "helicopter"
          description: vehicle.description || `Reference for ${vehicle.name}`,
          grid_type: '6_views',
          priority: 'recommended',
          used_in_shots: shots.map(s => s.shot_number),
          generation_prompt_hint: `${vehicle.name} - ${vehicle.description}`
        });
      }

      for (const prop of extractedEntities.props || []) {
        refs.push({
          ref_id: `prop_${prop.name.replace(/\s+/g, '_')}`,
          ref_type: 'PROP_MASTER',
          name: prop.name,  // ACTUAL name like "briefcase", "weapon"
          description: prop.description || `Reference for ${prop.name}`,
          grid_type: '6_views',
          priority: 'optional',
          used_in_shots: [],
          generation_prompt_hint: `${prop.name} - ${prop.description}`
        });
      }

      // If no characters extracted, add a default based on story
      if (refs.filter(r => r.ref_type === 'CHARACTER_MASTER').length === 0) {
        refs.push({
          ref_id: 'char_main',
          ref_type: 'CHARACTER_MASTER',
          name: 'Main Character',
          description: '3x3 expression grid for main character',
          grid_type: '3x3_expressions',
          priority: 'required',
          used_in_shots: shots.map(s => s.shot_number),
          generation_prompt_hint: 'Story protagonist'
        });
      }

      // If no locations extracted, add main environment
      if (refs.filter(r => r.ref_type === 'ENVIRONMENT_MASTER').length === 0) {
        refs.push({
          ref_id: 'env_main',
          ref_type: 'ENVIRONMENT_MASTER',
          name: 'Main Environment',
          description: '3x3 angle grid for main environment',
          grid_type: '3x3_angles',
          priority: 'required',
          used_in_shots: [1, shots.length],
          generation_prompt_hint: 'Story environment'
        });
      }

      return refs;
    }

    // FALLBACK: Old method if no extracted entities (shouldn't happen)
    console.log('[RefPlanner] No extracted entities, using fallback method');
    const charactersSeen = new Set<string>();
    const environmentsSeen = new Set<string>();

    // Analyze each shot for ref needs
    for (const shot of shots) {
      // Character refs from subject_focus
      if (shot.subject_focus && shot.subject_focus !== 'environment') {
        const subjects = shot.subject_focus.split(/[,+&]/);
        for (const subject of subjects) {
          const charName = subject.trim().toLowerCase();
          if (charName && charName !== 'both' && charName !== 'all') {
            charactersSeen.add(charName);
          }
        }
      }

      // Dialogue character
      if (shot.dialogue_info?.character) {
        charactersSeen.add(shot.dialogue_info.character.toLowerCase());
      }

      // Environment from shot type
      if (shot.shot_type.includes('WIDE') || shot.shot_type.includes('ESTABLISHING')) {
        environmentsSeen.add('main_environment');
      }
    }

    // Add character refs from entities
    for (const entity of entities) {
      if (entity.entity_type === 'character') {
        charactersSeen.add(entity.entity_id.toLowerCase());
      }
    }

    // Create CHARACTER_MASTER refs
    for (const charName of charactersSeen) {
      const usedInShots = shots
        .filter(s =>
          s.subject_focus?.toLowerCase().includes(charName) ||
          s.dialogue_info?.character?.toLowerCase() === charName
        )
        .map(s => s.shot_number);

      refs.push({
        ref_id: `char_${charName}`,
        ref_type: 'CHARACTER_MASTER',
        name: charName,
        description: `3x3 expression grid for ${charName}`,
        grid_type: '3x3_expressions',
        priority: usedInShots.length > 2 ? 'required' : 'recommended',
        used_in_shots: usedInShots.length > 0 ? usedInShots : shots.map(s => s.shot_number),
        generation_prompt_hint: storyAnalysis?.reference_strategy?.character_ref_reason || 'Maintain character consistency'
      });
    }

    // Create ENVIRONMENT_MASTER ref
    if (environmentsSeen.size > 0 || storyAnalysis?.reference_strategy?.environment_refs_needed) {
      const wideShots = shots
        .filter(s => s.shot_type.includes('WIDE') || s.shot_type.includes('ESTABLISHING'))
        .map(s => s.shot_number);

      refs.push({
        ref_id: 'env_main',
        ref_type: 'ENVIRONMENT_MASTER',
        name: 'Main Environment',
        description: '3x3 angle grid for main environment',
        grid_type: '3x3_angles',
        priority: 'required',
        used_in_shots: wideShots.length > 0 ? wideShots : [1, shots.length],
        generation_prompt_hint: storyAnalysis?.reference_strategy?.environment_ref_reason || 'Establish consistent world'
      });
    }

    // Add any prop refs if story analysis mentions them
    if (storyAnalysis?.reference_strategy?.prop_refs_needed) {
      refs.push({
        ref_id: 'prop_main',
        ref_type: 'PROP_MASTER',
        name: 'Key Prop',
        description: 'Important story prop',
        grid_type: '6_views',
        priority: 'optional',
        used_in_shots: [],
        generation_prompt_hint: storyAnalysis.reference_strategy.prop_ref_reason || 'Key story object'
      });
    }

    return refs;
  },

  /**
   * Determine chaining strategy based on scene continuity
   */
  planChainingStrategy(shots: ShotPlan[], direction: DirectorOutput): ChainingStrategy {
    const chainBreaks: number[] = [1]; // First shot is always a break
    const chainBreakReasons: string[] = ['First shot - establish fresh'];

    // Look for natural chain breaks
    for (let i = 1; i < shots.length; i++) {
      const shot = shots[i];
      const prevShot = shots[i - 1];

      // Big energy level jump
      if (Math.abs(shot.energy_level - prevShot.energy_level) >= 3) {
        chainBreaks.push(shot.shot_number);
        chainBreakReasons.push(`Energy jump at shot ${shot.shot_number}`);
        continue;
      }

      // Shot type changes dramatically (WIDE to ECU or vice versa)
      const isWide = shot.shot_type.includes('WIDE');
      const prevIsWide = prevShot.shot_type.includes('WIDE');
      const isECU = shot.shot_type.includes('ECU');
      const prevIsECU = prevShot.shot_type.includes('ECU');

      if ((isWide && prevIsECU) || (isECU && prevIsWide)) {
        // This is actually fine for chaining - dramatic cuts benefit from consistency
      }

      // Sora candidate breaks chain (different generation pipeline)
      if (shot.sora_candidate && !prevShot.sora_candidate) {
        chainBreaks.push(shot.shot_number);
        chainBreakReasons.push(`Sora 2 shot ${shot.shot_number} - different pipeline`);
      }
    }

    // Determine overall strategy
    let strategy: 'full_chain' | 'selective_chain' | 'no_chain';
    if (chainBreaks.length === 1) {
      strategy = 'full_chain';
    } else if (chainBreaks.length <= shots.length / 2) {
      strategy = 'selective_chain';
    } else {
      strategy = 'no_chain';
    }

    return {
      strategy,
      description: strategy === 'full_chain'
        ? 'All shots chain from previous for maximum continuity'
        : strategy === 'selective_chain'
          ? 'Strategic chain breaks for scene transitions'
          : 'Minimal chaining - each shot establishes fresh',
      chain_breaks: chainBreaks,
      chain_break_reasons: chainBreakReasons
    };
  },

  /**
   * Build the ref stack for each shot
   */
  buildShotRefStacks(
    shots: ShotPlan[],
    refs: RefRequirement[],
    chainingStrategy: ChainingStrategy,
    direction: DirectorOutput
  ): ShotRefStack[] {
    const stacks: ShotRefStack[] = [];
    const continuityLocks = direction.continuity_locks;

    for (const shot of shots) {
      const isChainBreak = chainingStrategy.chain_breaks.includes(shot.shot_number);
      const chainFromPrevious = !isChainBreak && shot.shot_number > 1;

      // Determine ref priority based on shot type
      const isCU = shot.shot_type.includes('CU') || shot.shot_type.includes('CLOSEUP');
      const isWide = shot.shot_type.includes('WIDE') || shot.shot_type.includes('ESTABLISHING');
      const isPOV = shot.shot_type.includes('POV');

      // Find relevant refs for this shot
      const charRef = refs.find(r =>
        r.ref_type === 'CHARACTER_MASTER' &&
        r.used_in_shots.includes(shot.shot_number)
      );
      const envRef = refs.find(r => r.ref_type === 'ENVIRONMENT_MASTER');

      // Build stack based on shot type
      let image_1: string | 'PREVIOUS_FRAME' | 'BASE_WORLD';
      let image_2: string | null = null;
      let image_3: string | null = null;

      if (chainFromPrevious) {
        // Chained shot - previous frame is Image 1
        image_1 = 'PREVIOUS_FRAME';
        if (isCU && charRef) {
          image_2 = charRef.ref_id;
          image_3 = envRef?.ref_id || null;
        } else if (isWide && envRef) {
          image_2 = envRef.ref_id;
          image_3 = charRef?.ref_id || null;
        } else {
          image_2 = charRef?.ref_id || envRef?.ref_id || null;
        }
      } else {
        // Fresh shot - no previous frame
        if (isWide) {
          image_1 = envRef?.ref_id || 'BASE_WORLD';
          image_2 = charRef?.ref_id || null;
        } else if (isPOV) {
          image_1 = envRef?.ref_id || 'BASE_WORLD';
          // No character in POV
        } else {
          image_1 = charRef?.ref_id || 'BASE_WORLD';
          image_2 = envRef?.ref_id || null;
        }
      }

      // Build continuity phrases
      const continuityPhrases: string[] = [
        'THIS EXACT CHARACTER',
        'THIS EXACT LIGHTING',
        'THIS EXACT COLOR GRADE'
      ];

      if (continuityLocks) {
        if (continuityLocks.screen_direction) {
          continuityPhrases.push(`Direction: ${continuityLocks.screen_direction}`);
        }
        if (continuityLocks.light_direction) {
          continuityPhrases.push(`Light from: ${continuityLocks.light_direction}`);
        }
      }

      if (chainFromPrevious) {
        continuityPhrases.push('Continue from Image 1');
        continuityPhrases.push('NO MIRRORING');
        continuityPhrases.push('NO DIRECTION FLIP');
      }

      stacks.push({
        shot_number: shot.shot_number,
        image_1,
        image_2,
        image_3,
        chain_from_previous: chainFromPrevious,
        chain_reasoning: chainFromPrevious
          ? 'Maintain continuity from previous frame'
          : isChainBreak
            ? chainingStrategy.chain_break_reasons[chainingStrategy.chain_breaks.indexOf(shot.shot_number)] || 'New establishing shot'
            : 'First shot',
        continuity_phrases: continuityPhrases
      });
    }

    return stacks;
  },

  /**
   * Determine order to generate refs (dependencies first)
   */
  determineGenerationOrder(refs: RefRequirement[]): string[] {
    // Environment first (sets the world), then characters, then props
    const order: string[] = [];

    const envRefs = refs.filter(r => r.ref_type === 'ENVIRONMENT_MASTER');
    const charRefs = refs.filter(r => r.ref_type === 'CHARACTER_MASTER');
    const propRefs = refs.filter(r => r.ref_type === 'PROP_MASTER');

    // Required first, then recommended, then optional
    const byPriority = (a: RefRequirement, b: RefRequirement) => {
      const priorityOrder = { required: 0, recommended: 1, optional: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    };

    order.push(...envRefs.sort(byPriority).map(r => r.ref_id));
    order.push(...charRefs.sort(byPriority).map(r => r.ref_id));
    order.push(...propRefs.sort(byPriority).map(r => r.ref_id));

    return order;
  }
};

export default refPlannerAgent;
