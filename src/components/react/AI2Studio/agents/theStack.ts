/**
 * THE_STACK - Reference Image Stack System
 *
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * THE_STACK defines the priority order for reference images in shot generation:
 * - Image 1 (HIGHEST): LAST_FRAME - Last frame from previous video for continuity
 * - Image 2: CHARACTER_MASTER - Main character reference sheet
 * - Image 3: ENVIRONMENT_MASTER - Environment/location reference
 * - Others: Additional props, vehicles, secondary characters
 *
 * This module handles:
 * 1. Ref Stack Management - Ordering refs by priority
 * 2. Master Ref Generation - 3x3 grid prompts for character/location sheets
 * 3. Frame Extraction - Getting last frames from videos
 * 4. Ref Validation - Ensuring refs meet quality requirements
 */

import type { MasterRef, RefInput } from './specTypes';

// ============================================
// TYPES
// ============================================

export type RefPriority = 'LAST_FRAME' | 'CHARACTER_MASTER' | 'ENVIRONMENT_MASTER' | 'PROP_MASTER' | 'OTHER';

export interface StackedRef {
  position: 1 | 2 | 3 | 'other';
  priority: RefPriority;
  url: string;
  name: string;
  type: MasterRef['type'];
}

export interface RefStack {
  image_1: StackedRef | null; // LAST_FRAME (highest priority)
  image_2: StackedRef | null; // CHARACTER_MASTER
  image_3: StackedRef | null; // ENVIRONMENT_MASTER
  others: StackedRef[];       // Additional refs
}

export interface GridCell {
  index: number;
  row: number;
  col: number;
  variation: string;
}

export interface Grid3x3 {
  cells: GridCell[];
  totalCells: 9;
  rows: 3;
  cols: 3;
}

// ============================================
// CHARACTER GRID VARIATIONS (3x3 = 9 cells)
// ============================================

export const CHARACTER_GRID_VARIATIONS = {
  // Standard expression grid (most common)
  expressions: [
    'neutral expression, front view',
    'happy, joyful, smiling',
    'surprised, eyes wide',
    'determined, focused',
    'scared, worried',
    'sad, melancholy',
    'angry, intense',
    'curious, questioning',
    'relieved, peaceful'
  ],

  // Action poses for dynamic characters
  action_poses: [
    'standing neutral, front',
    'running pose, side view',
    'jumping action pose',
    'fighting stance, front',
    'crouching defensive',
    'reaching forward',
    'looking back over shoulder',
    'sitting relaxed',
    'walking mid-stride'
  ],

  // Angles for turnaround sheet
  turnaround: [
    'front view',
    'front 3/4 left',
    'profile left',
    'back 3/4 left',
    'back view',
    'back 3/4 right',
    'profile right',
    'front 3/4 right',
    'top-down view'
  ]
};

// ============================================
// ENVIRONMENT GRID VARIATIONS (3x3 = 9 cells)
// ============================================

export const ENVIRONMENT_GRID_VARIATIONS = {
  // Standard location coverage
  standard: [
    'wide establishing shot',
    'medium shot, eye level',
    'close-up detail shot',
    'low angle, dramatic',
    'high angle, overview',
    'entrance/exit view',
    'key feature detail',
    'atmosphere/mood shot',
    'alternate angle'
  ],

  // Interior focus
  interior: [
    'wide room view',
    'corner perspective',
    'window/light source',
    'doorway view',
    'ceiling detail',
    'floor/ground detail',
    'furniture/props context',
    'wall detail',
    'center of room'
  ],

  // Exterior focus
  exterior: [
    'wide establishing',
    'street level view',
    'elevated angle',
    'entrance close-up',
    'skyline/horizon',
    'ground texture',
    'architectural detail',
    'environmental elements',
    'time-of-day variant'
  ]
};

// ============================================
// PROP GRID VARIATIONS (3x3 = 9 cells)
// ============================================

export const PROP_GRID_VARIATIONS = {
  // Standard prop coverage
  standard: [
    'front view',
    'side view left',
    'side view right',
    'three-quarter left',
    'three-quarter right',
    'back view',
    'top-down view',
    'close-up detail',
    'in-context use'
  ],

  // Vehicle coverage
  vehicle: [
    'EXT front',
    'EXT side',
    'EXT three-quarter',
    'EXT back',
    'EXT aerial',
    'EXT in motion',
    'INT dashboard',
    'INT seats/cabin',
    'INT controls detail'
  ]
};

// ============================================
// THE STACK CLASS
// ============================================

export class TheStack {
  private stack: RefStack;

  constructor() {
    this.stack = {
      image_1: null,
      image_2: null,
      image_3: null,
      others: []
    };
  }

  /**
   * Set the last frame reference (Image 1 - highest priority)
   */
  setLastFrame(url: string, name: string = 'Last Frame'): void {
    this.stack.image_1 = {
      position: 1,
      priority: 'LAST_FRAME',
      url,
      name,
      type: 'CHARACTER_MASTER' // Type doesn't matter for last frame
    };
  }

  /**
   * Set the character master reference (Image 2)
   */
  setCharacterMaster(url: string, name: string): void {
    this.stack.image_2 = {
      position: 2,
      priority: 'CHARACTER_MASTER',
      url,
      name,
      type: 'CHARACTER_MASTER'
    };
  }

  /**
   * Set the environment master reference (Image 3)
   */
  setEnvironmentMaster(url: string, name: string): void {
    this.stack.image_3 = {
      position: 3,
      priority: 'ENVIRONMENT_MASTER',
      url,
      name,
      type: 'ENVIRONMENT_MASTER'
    };
  }

  /**
   * Add additional reference (props, secondary characters, etc.)
   */
  addOther(url: string, name: string, type: MasterRef['type']): void {
    this.stack.others.push({
      position: 'other',
      priority: type === 'PROP_MASTER' ? 'PROP_MASTER' : 'OTHER',
      url,
      name,
      type
    });
  }

  /**
   * Get the current stack
   */
  getStack(): RefStack {
    return { ...this.stack };
  }

  /**
   * Get refs as ordered array for API calls
   * Returns [image_1, image_2, image_3, ...others] with nulls filtered
   */
  getOrderedUrls(): string[] {
    const urls: string[] = [];

    if (this.stack.image_1) urls.push(this.stack.image_1.url);
    if (this.stack.image_2) urls.push(this.stack.image_2.url);
    if (this.stack.image_3) urls.push(this.stack.image_3.url);

    for (const other of this.stack.others) {
      urls.push(other.url);
    }

    return urls;
  }

  /**
   * Get refs formatted for shot card
   */
  getForShotCard(): {
    image_1: string;
    image_2: string;
    image_3: string;
    others: string[];
  } {
    return {
      image_1: this.stack.image_1?.url || 'LAST_FRAME',
      image_2: this.stack.image_2?.url || 'CHARACTER_MASTER',
      image_3: this.stack.image_3?.url || 'ENVIRONMENT_MASTER',
      others: this.stack.others.map(o => o.url)
    };
  }

  /**
   * Clear the stack
   */
  clear(): void {
    this.stack = {
      image_1: null,
      image_2: null,
      image_3: null,
      others: []
    };
  }

  /**
   * Build stack from MasterRef array (from spec agents)
   */
  static fromMasterRefs(refs: MasterRef[], lastFrameUrl?: string): TheStack {
    const stack = new TheStack();

    // Set last frame if provided
    if (lastFrameUrl) {
      stack.setLastFrame(lastFrameUrl);
    }

    // Process refs by type
    for (const ref of refs) {
      switch (ref.type) {
        case 'CHARACTER_MASTER':
          if (!stack.stack.image_2) {
            stack.setCharacterMaster(ref.url, ref.name);
          } else {
            stack.addOther(ref.url, ref.name, ref.type);
          }
          break;

        case 'ENVIRONMENT_MASTER':
          if (!stack.stack.image_3) {
            stack.setEnvironmentMaster(ref.url, ref.name);
          } else {
            stack.addOther(ref.url, ref.name, ref.type);
          }
          break;

        case 'PROP_MASTER':
          stack.addOther(ref.url, ref.name, ref.type);
          break;
      }
    }

    return stack;
  }

  /**
   * Build stack from RefInput array (from user input)
   */
  static fromRefInputs(refs: RefInput[], lastFrameUrl?: string): TheStack {
    const masterRefs: MasterRef[] = refs.map((ref, i) => ({
      id: `ref_${i}`,
      type: ref.type === 'character' ? 'CHARACTER_MASTER' as const :
            ref.type === 'location' ? 'ENVIRONMENT_MASTER' as const :
            'PROP_MASTER' as const,
      url: ref.url,
      name: ref.name
    }));

    return TheStack.fromMasterRefs(masterRefs, lastFrameUrl);
  }
}

// ============================================
// 3x3 GRID PROMPT BUILDERS
// ============================================

/**
 * Build a 3x3 character master prompt
 */
export function buildCharacterMasterPrompt(
  characterDescription: string,
  variationType: keyof typeof CHARACTER_GRID_VARIATIONS = 'expressions',
  style: string = 'fluffy 3D cinematic render'
): string {
  const variations = CHARACTER_GRID_VARIATIONS[variationType];

  const gridLayout = `
Row 1: ${variations[0]}, ${variations[1]}, ${variations[2]}
Row 2: ${variations[3]}, ${variations[4]}, ${variations[5]}
Row 3: ${variations[6]}, ${variations[7]}, ${variations[8]}`;

  return `3x3 STRICT GRID with 9 EQUAL SIZE PANELS showing character in 9 different poses/expressions:

Character: ${characterDescription}

${gridLayout}

STRICT GRID LAYOUT - ALL 9 panels MUST be EXACTLY SAME SIZE, no gaps no borders no text
THIS EXACT CHARACTER in every panel - consistent design
Same outfit, same colors, same proportions across all panels
Clean white/light gray background in EACH PANEL
${style}
raytracing 8K high detail
NO MIRRORING between panels`;
}

/**
 * Build a 3x3 environment master prompt
 */
export function buildEnvironmentMasterPrompt(
  locationDescription: string,
  variationType: keyof typeof ENVIRONMENT_GRID_VARIATIONS = 'standard',
  timeOfDay: string = 'day',
  mood: string = 'neutral'
): string {
  const variations = ENVIRONMENT_GRID_VARIATIONS[variationType];

  const gridLayout = `
Row 1: ${variations[0]}, ${variations[1]}, ${variations[2]}
Row 2: ${variations[3]}, ${variations[4]}, ${variations[5]}
Row 3: ${variations[6]}, ${variations[7]}, ${variations[8]}`;

  return `3x3 STRICT GRID with 9 EQUAL SIZE PANELS showing location in 9 different angles:

Location: ${locationDescription}
Time: ${timeOfDay}
Mood: ${mood}

${gridLayout}

STRICT GRID LAYOUT - ALL 9 panels MUST be EXACTLY SAME SIZE, no gaps no borders no text
THIS EXACT LOCATION in every panel - consistent architecture and features
EMPTY SCENE - NO CHARACTERS - NO PEOPLE - NO FIGURES
Same lighting direction, same color grade across all panels
cinematic, detailed, atmospheric
raytracing 8K high detail`;
}

/**
 * Build a 3x3 prop master prompt
 */
export function buildPropMasterPrompt(
  propDescription: string,
  variationType: keyof typeof PROP_GRID_VARIATIONS = 'standard'
): string {
  const variations = PROP_GRID_VARIATIONS[variationType];

  const gridLayout = `
Row 1: ${variations[0]}, ${variations[1]}, ${variations[2]}
Row 2: ${variations[3]}, ${variations[4]}, ${variations[5]}
Row 3: ${variations[6]}, ${variations[7]}, ${variations[8]}`;

  return `3x3 STRICT GRID with 9 EQUAL SIZE PANELS showing prop in 9 different angles:

Prop: ${propDescription}

${gridLayout}

STRICT GRID LAYOUT - ALL 9 panels MUST be EXACTLY SAME SIZE, no gaps no borders no text
THIS EXACT PROP in every panel - consistent design and details
Same materials, same colors, same proportions across all panels
Clean white background in EACH PANEL - isolated, no shadows
product shot style, studio lighting
ultra detailed, sharp focus
raytracing 8K high detail`;
}

// ============================================
// GRID CELL UTILITIES
// ============================================

/**
 * Create a Grid3x3 structure with variations
 */
export function createGrid(variations: string[]): Grid3x3 {
  if (variations.length !== 9) {
    throw new Error('Grid requires exactly 9 variations');
  }

  const cells: GridCell[] = variations.map((variation, index) => ({
    index,
    row: Math.floor(index / 3),
    col: index % 3,
    variation
  }));

  return {
    cells,
    totalCells: 9,
    rows: 3,
    cols: 3
  };
}

/**
 * Get cell coordinates for cutting a generated 3x3 grid image
 */
export function getGridCellCoordinates(
  imageWidth: number,
  imageHeight: number,
  cellIndex: number
): { x: number; y: number; width: number; height: number } {
  const cellWidth = imageWidth / 3;
  const cellHeight = imageHeight / 3;

  const row = Math.floor(cellIndex / 3);
  const col = cellIndex % 3;

  return {
    x: col * cellWidth,
    y: row * cellHeight,
    width: cellWidth,
    height: cellHeight
  };
}

/**
 * Get all cell coordinates for a 3x3 grid
 */
export function getAllGridCellCoordinates(
  imageWidth: number,
  imageHeight: number
): Array<{ index: number; x: number; y: number; width: number; height: number }> {
  return Array.from({ length: 9 }, (_, i) => ({
    index: i,
    ...getGridCellCoordinates(imageWidth, imageHeight, i)
  }));
}

// ============================================
// REF STACK UTILITIES
// ============================================

/**
 * Build continuity lock prompt additions based on ref stack
 */
export function buildRefLockPhrases(stack: RefStack): string[] {
  const phrases: string[] = [];

  if (stack.image_1) {
    phrases.push('Continue from Image 1');
    phrases.push('Same world state as reference');
  }

  if (stack.image_2) {
    phrases.push('THIS EXACT CHARACTER from reference');
    phrases.push('Maintain character identity');
  }

  if (stack.image_3) {
    phrases.push('Same environment as reference');
    phrases.push('Maintain world geometry');
  }

  phrases.push('THIS EXACT LIGHTING');
  phrases.push('THIS EXACT COLOR GRADE');
  phrases.push('NO MIRRORING');
  phrases.push('NO DIRECTION FLIP');

  return phrases;
}

/**
 * Validate that refs meet minimum requirements
 */
export function validateRefStack(stack: RefStack): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for character master (highly recommended)
  if (!stack.image_2) {
    warnings.push('No CHARACTER_MASTER ref - character consistency may suffer');
  }

  // Check for environment master (recommended)
  if (!stack.image_3) {
    warnings.push('No ENVIRONMENT_MASTER ref - world consistency may suffer');
  }

  // Check URL validity
  const allRefs = [stack.image_1, stack.image_2, stack.image_3, ...stack.others].filter(Boolean);
  for (const ref of allRefs) {
    if (ref && !ref.url.startsWith('http')) {
      errors.push(`Invalid URL for ${ref.name}: ${ref.url}`);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

// ============================================
// EXPORTS
// ============================================

export default TheStack;

export {
  // Class
  TheStack,

  // Grid builders
  buildCharacterMasterPrompt,
  buildEnvironmentMasterPrompt,
  buildPropMasterPrompt,

  // Grid utilities
  createGrid,
  getGridCellCoordinates,
  getAllGridCellCoordinates,

  // Ref utilities
  buildRefLockPhrases,
  validateRefStack,

  // Variation data
  CHARACTER_GRID_VARIATIONS,
  ENVIRONMENT_GRID_VARIATIONS,
  PROP_GRID_VARIATIONS
};
