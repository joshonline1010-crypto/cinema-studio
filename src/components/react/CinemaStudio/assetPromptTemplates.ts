/**
 * Asset Generation Prompt Templates
 * Unified 3x3 Grid System for Characters, Backgrounds & Props
 *
 * Uses fal.ai's nano-banana-pro model with comprehensive grid coverage
 */

// ============================================================================
// TYPES
// ============================================================================

export type AssetType = 'character' | 'background' | 'prop';

export type PropCategory =
  | 'simple'      // Tools, Items, Objects
  | 'interactive' // Doors, Boxes, Books, Chests
  | 'electronic'  // Phones, TVs, Computers, Machines
  | 'vehicle'     // Cars, Boats, Planes
  | 'building'    // Houses, Shops, Structures
  | 'weapon'      // Swords, Guns, Wands
  | 'container';  // Bottles, Jars, Cups

export type GridSize = '3x3' | '5x5';

export type CharacterVariant = 'base' | 'damage' | 'emotion_extreme';
export type BackgroundVariant = 'base' | 'destroyed' | 'on_fire' | 'flooded' | 'night';
export type PropVariant = 'base' | 'damaged' | 'glowing' | 'wet' | 'dusty' | 'golden';

export interface AssetGenerationConfig {
  assetType: AssetType;
  description: string;
  gridSize?: GridSize;

  // Character-specific
  characterVariant?: CharacterVariant;

  // Background-specific
  locationType?: 'INT' | 'EXT' | 'INT-EXT';
  timeOfDay?: string;
  mood?: string;
  backgroundVariant?: BackgroundVariant;

  // Prop-specific
  propCategory?: PropCategory;
  propVariant?: PropVariant;
}

export interface GeneratedPrompt {
  prompt: string;
  gridSize: GridSize;
  totalCells: number;
  variations: string[];
}

// ============================================================================
// 3x3 VARIATION DEFINITIONS
// ============================================================================

// Character expression/pose variations
export const CHARACTER_VARIATIONS = {
  default: [
    'neutral expression front view',
    'happy joyful smiling',
    'surprised shocked eyes wide',
    'determined focused resolute',
    'scared fearful worried',
    'sad melancholy expression',
    'angry frustrated intense',
    'curious interested questioning',
    'relieved peaceful calm'
  ],
  emotion_extreme: [
    'terrified screaming',
    'crying tears',
    'extremely angry',
    'shocked surprised',
    'disgusted',
    'confused puzzled',
    'exhausted tired',
    'embarrassed blushing',
    'mischievous smirking'
  ]
};

// Background angle/shot variations
export const BACKGROUND_VARIATIONS = {
  default: [
    'wide establishing shot',
    'medium shot',
    'close detail shot',
    'low angle dramatic',
    'eye level neutral',
    'high angle overview',
    'key prop detail',
    'atmosphere shot',
    'exit/entrance view'
  ]
};

// Prop variations by category
export const PROP_VARIATIONS: Record<PropCategory, string[]> = {
  simple: [
    'front view',
    'side view left',
    'side view right',
    'three-quarter left',
    'three-quarter right',
    'back view',
    'top-down view',
    'close-up detail',
    'in-use context'
  ],
  interactive: [
    'closed front view',
    'partially open',
    'fully open',
    'closed side view',
    'opening action',
    'open side view',
    'closed three-quarter',
    'open three-quarter',
    'interior detail'
  ],
  electronic: [
    'off front view',
    'on/active front view',
    'on with content',
    'off side view',
    'on side view',
    'on three-quarter',
    'screen detail',
    'button/control detail',
    'back/ports view'
  ],
  vehicle: [
    'EXT front view',
    'EXT side view',
    'EXT three-quarter',
    'EXT back view',
    'EXT top-down',
    'EXT action/moving',
    'INT dashboard/cockpit',
    'INT seats/cabin',
    'INT detail controls'
  ],
  building: [
    'EXT front facade',
    'EXT side view',
    'EXT three-quarter',
    'EXT back view',
    'EXT aerial/roof',
    'EXT entrance detail',
    'INT main room',
    'INT secondary room',
    'INT detail/feature'
  ],
  weapon: [
    'idle/sheathed front',
    'drawn/ready front',
    'in-action/swing',
    'side profile',
    'three-quarter view',
    'back view',
    'handle detail',
    'blade/tip detail',
    'full length glamour'
  ],
  container: [
    'empty front view',
    'half-full front',
    'full front view',
    'empty side view',
    'pouring action',
    'full side view',
    'lid/cap detail',
    'contents detail',
    'label/texture detail'
  ]
};

// ============================================================================
// VARIANT MODIFIERS
// ============================================================================

export const CHARACTER_VARIANT_MODIFIERS: Record<CharacterVariant, string> = {
  base: '',
  damage: ', showing battle damage, torn clothes, scratches',
  emotion_extreme: '' // Uses different variation set
};

export const BACKGROUND_VARIANT_MODIFIERS: Record<BackgroundVariant, string> = {
  base: '',
  destroyed: '\nSHOW DESTRUCTION: debris, broken structures, damage, smoke',
  on_fire: '\nON FIRE: flames, smoke, orange glow, burning',
  flooded: '\nFLOODED: water covering floor, reflections, wet surfaces',
  night: '\nNIGHT VERSION: dark, moonlight, shadows, dim lighting'
};

export const PROP_VARIANT_MODIFIERS: Record<PropVariant, string> = {
  base: '',
  damaged: ', showing wear and damage, scratches, dents',
  glowing: ', magical glow effect, energy emanating',
  wet: ', wet surface, water droplets, reflections',
  dusty: ', covered in dust, aged appearance',
  golden: ', gold/gilded version, precious metal'
};

// ============================================================================
// PROP CATEGORY DISPLAY NAMES
// ============================================================================

export const PROP_CATEGORY_NAMES: Record<PropCategory, string> = {
  simple: 'Simple (Tools, Items)',
  interactive: 'Interactive (Doors, Boxes)',
  electronic: 'Electronic (Phones, TVs)',
  vehicle: 'Vehicle (Cars, Boats)',
  building: 'Building (Houses, Shops)',
  weapon: 'Weapon (Swords, Wands)',
  container: 'Container (Bottles, Jars)'
};

// ============================================================================
// PROMPT BUILDERS
// ============================================================================

function formatVariationsAsRows(variations: string[]): string {
  return `Row 1: ${variations[0]}, ${variations[1]}, ${variations[2]}
Row 2: ${variations[3]}, ${variations[4]}, ${variations[5]}
Row 3: ${variations[6]}, ${variations[7]}, ${variations[8]}`;
}

export function buildCharacterPrompt(config: AssetGenerationConfig): GeneratedPrompt {
  const { description, gridSize = '3x3', characterVariant = 'base' } = config;
  const gridNum = gridSize === '3x3' ? 9 : 25;

  // Get variations based on variant
  const variations = characterVariant === 'emotion_extreme'
    ? CHARACTER_VARIATIONS.emotion_extreme
    : CHARACTER_VARIATIONS.default;

  // Apply variant modifier to description
  const modifiedDesc = description + CHARACTER_VARIANT_MODIFIERS[characterVariant];

  const prompt = `${gridSize} STRICT GRID with ${gridNum} EQUAL SIZE PANELS showing character in ${gridNum} different poses/angles:

Character: ${modifiedDesc}

${formatVariationsAsRows(variations)}

STRICT GRID LAYOUT - ALL ${gridNum} panels MUST be EXACTLY SAME SIZE, no gaps no borders no text
Consistent character design across all panels
Same outfit, same colors, same proportions
Clean white/light gray background in EACH PANEL
Uniform grid spacing with NO irregular panel sizes
raytracing 8K high detail`;

  return {
    prompt,
    gridSize,
    totalCells: gridNum,
    variations
  };
}

export function buildBackgroundPrompt(config: AssetGenerationConfig): GeneratedPrompt {
  const {
    description,
    gridSize = '3x3',
    locationType = 'INT-EXT',
    timeOfDay = 'day',
    mood = 'neutral',
    backgroundVariant = 'base'
  } = config;

  const gridNum = gridSize === '3x3' ? 9 : 25;
  const variations = BACKGROUND_VARIATIONS.default;
  const variantMod = BACKGROUND_VARIANT_MODIFIERS[backgroundVariant];

  const prompt = `${gridSize} STRICT GRID with ${gridNum} EQUAL SIZE PANELS showing ${description}:

Location Type: ${locationType}
Time of Day: ${timeOfDay}
Mood/Atmosphere: ${mood}${variantMod}

${formatVariationsAsRows(variations)}

STRICT GRID LAYOUT - ALL ${gridNum} panels MUST be EXACTLY SAME SIZE, no gaps no borders no text
EMPTY SCENE - NO CHARACTERS - NO PEOPLE - NO FIGURES
Consistent lighting and ${mood} mood across all panels
cinematic, detailed, atmospheric
raytracing 8K high detail`;

  return {
    prompt,
    gridSize,
    totalCells: gridNum,
    variations
  };
}

export function buildPropPrompt(config: AssetGenerationConfig): GeneratedPrompt {
  const {
    description,
    gridSize = '3x3',
    propCategory = 'simple',
    propVariant = 'base'
  } = config;

  const gridNum = gridSize === '3x3' ? 9 : 25;
  const variations = PROP_VARIATIONS[propCategory];
  const variantMod = PROP_VARIANT_MODIFIERS[propVariant];
  const modifiedDesc = description + variantMod;

  const prompt = `${gridSize} STRICT GRID with ${gridNum} EQUAL SIZE PANELS showing ${modifiedDesc} in ${gridNum} different angles/states:

Prop Type: ${propCategory}
Base Description: ${description}

${formatVariationsAsRows(variations)}

STRICT GRID LAYOUT - ALL ${gridNum} panels MUST be EXACTLY SAME SIZE, no gaps no borders no text
Consistent prop design across all panels
Same colors, same materials, same proportions
Clean white/light gray background in EACH PANEL - isolated on pure white background, no shadows
Uniform grid spacing with NO irregular panel sizes
product shot style, studio lighting, ultra detailed, sharp focus
raytracing 8K high detail`;

  return {
    prompt,
    gridSize,
    totalCells: gridNum,
    variations
  };
}

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

export function generateAssetPrompt(config: AssetGenerationConfig): GeneratedPrompt {
  switch (config.assetType) {
    case 'character':
      return buildCharacterPrompt(config);
    case 'background':
      return buildBackgroundPrompt(config);
    case 'prop':
      return buildPropPrompt(config);
    default:
      throw new Error(`Unknown asset type: ${config.assetType}`);
  }
}

// ============================================================================
// QUICK REFERENCE - VARIATION LISTS
// ============================================================================

export const QUICK_VARIATIONS = {
  character: 'neutral, happy, surprised, determined, scared, sad, angry, curious, relieved',
  background: 'wide establishing, medium, close detail, low angle, eye level, high angle, prop detail, atmosphere, exit view',
  props: {
    simple: 'front, side-L, side-R, 3Q-L, 3Q-R, back, top, detail, context',
    interactive: 'closed, partial, open, closed-side, opening, open-side, closed-3Q, open-3Q, interior',
    electronic: 'off-front, on-front, on-content, off-side, on-side, on-3Q, screen, controls, back',
    vehicle: 'EXT-front, EXT-side, EXT-3Q, EXT-back, EXT-top, EXT-action, INT-dash, INT-cabin, INT-detail',
    building: 'EXT-front, EXT-side, EXT-3Q, EXT-back, EXT-aerial, EXT-entrance, INT-main, INT-secondary, INT-detail',
    weapon: 'idle, ready, action, side, 3Q, back, handle, blade, glamour',
    container: 'empty, half, full, empty-side, pouring, full-side, lid, contents, label'
  }
};

// ============================================================================
// API REQUEST HELPERS
// ============================================================================

export interface AssetGenerationRequest {
  type: 'image' | 'edit';
  prompt: string;
  resolution: '4K';
  aspect_ratio: '16:9';
  image_urls?: string[];
}

export function buildApiRequest(
  generatedPrompt: GeneratedPrompt,
  referenceImages?: string[]
): AssetGenerationRequest {
  const request: AssetGenerationRequest = {
    type: referenceImages && referenceImages.length > 0 ? 'edit' : 'image',
    prompt: generatedPrompt.prompt,
    resolution: '4K',
    aspect_ratio: '16:9'
  };

  if (referenceImages && referenceImages.length > 0) {
    request.image_urls = referenceImages;
  }

  return request;
}
