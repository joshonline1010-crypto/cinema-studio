/**
 * NANO BANANA PRO - PROMPT BUILDER
 * Based on complete prompting guide research
 *
 * GOLDEN RULES:
 * 1. Simple prompts work best - natural language beats complex engineering
 * 2. Subject FIRST, Technical LAST
 * 3. Prompt Improver = OFF for realistic results
 * 4. 2K is fastest (4K just upscales from 2K)
 * 5. Images 1-6 = HIGH PRIORITY (strongest influence)
 * 6. Last frame = Image 1 for sequences (color matching)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface PromptConfig {
  // Character
  character?: string;           // "THIS EXACT CHARACTER" or description
  characterAction?: string;     // What they're doing
  expression?: string;          // Specific expression

  // Environment
  environment?: string;         // Location/setting
  setDesign?: string;          // Props, furniture, decor

  // Style
  style?: string;              // Aesthetic direction
  mood?: string;               // Emotional tone

  // Camera
  shotType?: string;           // wide, medium, close-up, etc.
  cameraAngle?: string;        // eye level, low angle, high angle
  cameraMovement?: string;     // dolly in, steadicam, static
  lens?: string;               // 85mm, wide angle, etc.

  // Lighting - MUST BE SOURCE-BASED, NOT ABSTRACT
  lighting?: string;           // "spotlight from above", NOT "cinematic"

  // Continuity
  isSequence?: boolean;        // Add "maintain color grading"

  // Technical (goes at END)
  quality?: string;            // Default: "8K high detail"
}

export interface ReferenceConfig {
  // Position matters! 1-6 = highest priority
  images: {
    url: string;
    type: 'character' | 'background' | 'style' | 'outfit' | 'last_frame' | 'item';
    label?: string;  // For multi-character: "character_1", "character_2"
  }[];
}

// ============================================================================
// EXPRESSION KEYWORDS - FULL SPECTRUM (Use these for specific results)
// ============================================================================

export const EXPRESSIONS = {
  // HAPPINESS SPECTRUM
  happy_subtle: ['slight smile', 'hint of amusement', 'soft eyes'],
  happy_medium: ['genuine smile', 'warm expression', 'friendly eyes'],
  happy_strong: ['beaming with joy', 'wide smile', 'eyes crinkled with happiness'],
  happy_extreme: ['laughing out loud', 'head thrown back', 'tears of joy'],

  // SADNESS SPECTRUM
  sad_subtle: ['melancholy look', 'distant eyes', 'slight frown'],
  sad_medium: ['visibly sad', 'downcast eyes', 'mouth turned down'],
  sad_strong: ['devastated expression', 'tears welling up', 'trembling lip'],
  sad_extreme: ['sobbing uncontrollably', 'tears streaming', 'face contorted in grief'],

  // ANGER SPECTRUM
  angry_subtle: ['annoyed expression', 'slight frown', 'narrowed eyes'],
  angry_medium: ['angry scowl', 'furrowed brow', 'clenched jaw'],
  angry_strong: ['furious rage', 'baring teeth', 'veins visible on forehead'],
  angry_extreme: ['explosive fury', 'screaming', 'face red with anger'],

  // FEAR SPECTRUM
  fear_subtle: ['uneasy look', 'darting eyes', 'tense posture'],
  fear_medium: ['worried expression', 'wide eyes', 'biting lip'],
  fear_strong: ['terrified', 'eyes wide with fear', 'mouth open in shock'],
  fear_extreme: ['paralyzed with terror', 'screaming', 'pure panic in eyes'],

  // SURPRISE SPECTRUM
  surprise_subtle: ['raised eyebrow', 'curious look', 'head tilted'],
  surprise_medium: ['surprised expression', 'eyebrows raised', 'mouth slightly open'],
  surprise_strong: ['shocked', 'jaw dropped', 'eyes wide'],
  surprise_extreme: ['utterly stunned', 'frozen in disbelief', 'gasping'],

  // CONFIDENCE/POWER
  confident: ['confident smirk', 'one eyebrow raised', 'self-assured gaze', 'cocky grin', 'chin raised'],
  powerful: ['commanding presence', 'steely determined eyes', 'unwavering stare'],

  // VULNERABILITY
  vulnerable: ['uncertain expression', 'avoiding eye contact', 'eyes seeking reassurance'],
  defeated: ['defeated posture', 'hollow eyes', 'exhausted', 'bags under eyes', 'emotionally drained'],

  // LOVE/ATTRACTION
  love: ['looking lovingly', 'soft adoring gaze', 'gentle smile', 'eyes filled with love', 'tender expression'],
  longing: ['longing look', 'yearning in eyes', 'passionate intensity'],

  // DISGUST/CONTEMPT
  disgust: ['disgusted sneer', 'nose wrinkled', 'contemptuous look', 'lip curled'],

  // FOCUS/CONCENTRATION
  focused: ['intense focus', 'eyes locked on target', 'deep in thought', 'brow furrowed in concentration'],

  // NEUTRAL/STOIC
  neutral: ['neutral expression', 'emotionless face', 'stoic', 'poker face', 'calm and composed', 'deadpan'],

  // MENACING (Director specific)
  menacing: ['Kubrick stare', 'head tilted down eyes looking up through brow', 'intense piercing gaze']
};

// EYE DIRECTIONS
export const EYE_DIRECTIONS = [
  'looking directly at camera',
  'looking off to the left',
  'looking off to the right',
  'looking down, avoiding eye contact',
  'looking up, hopeful',
  'eyes closed, peaceful',
  'looking over shoulder',
  'side-eye glance, suspicious'
];

// ============================================================================
// MOVEMENT & ACTION VOCABULARY
// ============================================================================

export const ACTIONS = {
  // STATIC
  static: ['standing still', 'sitting motionless', 'frozen in place', 'posed', 'at rest'],

  // WALKING/RUNNING
  walk_slow: ['strolling casually', 'leisurely pace'],
  walk_normal: ['walking with purpose', 'steady stride'],
  walk_fast: ['walking briskly', 'hurried steps'],
  run: ['jogging', 'light run', 'sprinting at full speed', 'running desperately'],

  // JUMPING
  jump: ['leaping into the air', 'mid-jump', 'jumping over obstacle', 'backflip in mid-air'],
  fall: ['falling through the air', 'diving forward', 'floating/hovering'],

  // FIGHTING
  punch: ['throwing a punch with right fist', 'mid-punch fist connecting', 'uppercut motion'],
  kick: ['roundhouse kick leg extended', 'front kick foot forward', 'jump kick in mid-air'],
  block: ['arms raised in defensive block', 'deflecting incoming attack'],
  stance: ['fighting stance fists raised', 'martial arts ready position', 'boxer guard up'],
  weapon: ['swinging sword overhead', 'aiming gun at target', 'drawing weapon from holster'],

  // SITTING/LYING
  sit: ['sitting upright', 'slouched in chair', 'sitting cross-legged', 'perched on edge'],
  lie: ['lying on back', 'lying on side curled up', 'face down collapsed', 'sprawled out'],

  // REACHING/GRABBING
  reach: ['reaching out with hand', 'grabbing object tightly', 'hand extended offering', 'catching mid-air'],

  // TURNING
  turn: ['turning to face camera', 'looking over shoulder', 'spinning around', 'pivoting on heel'],

  // EMOTIONAL
  emotional: ['crying wiping tears', 'laughing holding stomach', 'screaming mouth wide', 'gasping in shock'],

  // WORK
  work: ['typing on keyboard', 'writing with pen', 'reading a book', 'cooking at stove'],

  // COMMUNICATION
  communicate: ['talking mouth open', 'gesturing while speaking', 'pointing at target', 'waving']
};

// ============================================================================
// BODY LANGUAGE & POSES
// ============================================================================

export const POSES = {
  confident: [
    'standing tall with perfect posture',
    'hands on hips power pose',
    'arms crossed assertive stance',
    'chin raised looking down at camera',
    'wide stance taking up space'
  ],
  submissive: [
    'hunched over making self small',
    'arms wrapped around self',
    'head bowed avoiding eye contact',
    'shoulders slumped defeated'
  ],
  aggressive: [
    'leaning forward aggressively',
    'fists clenched at sides',
    'finger pointing accusingly',
    'squared up ready to fight'
  ],
  relaxed: [
    'leaning against wall casually',
    'sprawled in chair totally relaxed',
    'hands behind head lounging'
  ],
  heroic: [
    'standing heroically cape flowing',
    'fist raised in triumph',
    'arms spread wide victorious',
    'silhouette against dramatic sky',
    'superhero landing pose'
  ],
  romantic: [
    'leaning in close',
    'hand on face',
    'embracing arms around each other',
    'holding hands',
    'forehead to forehead'
  ],
  thinking: [
    'hand on chin thinking',
    'stroking beard thoughtfully',
    'pacing deep in thought',
    'rubbing temples concentrating'
  ]
};

// ============================================================================
// OUTFITS & FASHION
// ============================================================================

export const OUTFITS = {
  casual: [
    'jeans and plain white t-shirt',
    'hoodie and sweatpants',
    'cargo shorts and tank top',
    'flannel shirt over band tee'
  ],
  formal: [
    'tailored black suit white dress shirt red tie',
    'elegant evening gown floor-length',
    'business casual blazer over button-down',
    'three-piece suit pocket square'
  ],
  fantasy: [
    'full plate armor battle-worn cape flowing',
    'flowing wizard robes stars embroidered',
    'leather armor with hood ranger style',
    'royal gown with gold trim crown'
  ],
  scifi: [
    'sleek spacesuit helmet under arm',
    'cyberpunk jacket with LED trim neon accents',
    'futuristic tactical armor hexagonal plating',
    'pilot jumpsuit with mission patches'
  ],
  streetwear: [
    'oversized hoodie designer sneakers gold chain',
    'leather jacket ripped jeans combat boots',
    'tracksuit fresh kicks snapback hat'
  ],
  athletic: [
    'basketball jersey and shorts',
    'soccer kit cleats shin guards',
    'boxing gear gloves shorts',
    'yoga outfit leggings sports bra'
  ],
  profession: {
    doctor: 'white lab coat stethoscope scrubs',
    chef: 'chef whites toque hat apron',
    police: 'police uniform badge utility belt',
    military: 'camouflage fatigues tactical vest boots',
    pilot: 'airline captain uniform wings pin hat'
  }
};

// ============================================================================
// ENVIRONMENTS & SETS
// ============================================================================

export const ENVIRONMENTS = {
  urban: {
    street: 'busy city street cars pedestrians storefronts',
    alley: 'dark narrow alley dumpsters fire escapes graffiti',
    rooftop: 'city rooftop water towers skyline view',
    subway: 'underground subway platform train approaching fluorescent lights',
    nightclub: 'nightclub interior neon lights dance floor DJ booth'
  },
  nature: {
    forest: 'dense forest tall trees dappled sunlight fallen leaves',
    beach: 'sandy beach waves crashing palm trees sunset horizon',
    mountain: 'snowy mountain peak vast vista clouds below',
    desert: 'endless desert dunes harsh sun heat shimmer',
    waterfall: 'majestic waterfall mist rising rainbow rocks'
  },
  interior: {
    living_room: 'cozy living room sofa coffee table TV plants',
    bedroom: 'bedroom unmade bed nightstand soft lamp light',
    kitchen: 'modern kitchen island counter stainless appliances',
    office: 'corporate office cubicles glass walls city view'
  },
  fantasy: {
    castle: 'medieval castle throne room stone walls torches banners',
    tavern: 'fantasy tavern wooden tables fireplace ale barrels',
    dungeon: 'dark dungeon chains on walls iron bars dripping water',
    enchanted: 'magical forest glowing mushrooms fairy lights mist'
  },
  scifi: {
    spaceship: 'spaceship cockpit holographic displays stars through window',
    space_station: 'orbital station viewing deck Earth visible below',
    alien_planet: 'alien landscape purple sky strange vegetation two moons',
    cyberpunk: 'neon-lit dystopian city holograms flying cars rain'
  },
  historical: {
    victorian: 'Victorian parlor ornate furniture velvet curtains gas lamps',
    twenties: '1920s speakeasy art deco jazz band cigarette smoke',
    fifties: '1950s diner checkered floor jukebox chrome stools',
    eighties: '1980s arcade neon signs arcade cabinets'
  }
};

// ============================================================================
// WEATHER & TIME CONDITIONS
// ============================================================================

export const WEATHER_TIME = {
  day: 'bright daylight blue sky white clouds',
  night: 'night time dark sky stars visible moonlight',
  sunset: 'golden hour orange and pink sky long shadows',
  sunrise: 'early morning soft pink light dew on grass',
  rain: 'rainy weather puddles reflections gray sky',
  snow: 'winter scene snow falling frost on surfaces',
  storm: 'thunderstorm lightning dark clouds dramatic',
  fog: 'thick fog limited visibility mysterious atmosphere'
};

// ============================================================================
// PROPS & OBJECTS
// ============================================================================

export const PROPS = {
  furniture: {
    seating: ['leather sofa', 'wooden chair', 'bar stool', 'throne', 'office chair', 'bean bag', 'rocking chair', 'bench'],
    tables: ['wooden dining table', 'glass coffee table', 'desk', 'workbench', 'kitchen island', 'nightstand', 'vanity'],
    beds: ['king size bed', 'bunk beds', 'canopy bed', 'hospital bed', 'sleeping bag', 'hammock', 'cot'],
    storage: ['bookshelf', 'wardrobe', 'filing cabinet', 'chest', 'dresser', 'closet', 'locker', 'trunk']
  },
  technology: {
    computing: ['laptop', 'desktop monitor', 'tablet', 'smartphone', 'holographic display', 'vintage computer'],
    audio: ['speakers', 'headphones', 'microphone', 'record player', 'radio', 'boombox', 'synthesizer'],
    visual: ['TV screen', 'projector', 'camera', 'VR headset', 'security monitors', 'digital billboard']
  },
  weapons: {
    melee: ['sword', 'katana', 'axe', 'dagger', 'spear', 'lightsaber', 'staff', 'hammer', 'mace'],
    ranged: ['pistol', 'rifle', 'bow and arrow', 'crossbow', 'laser gun', 'sniper rifle', 'shotgun'],
    shields: ['round shield', 'tower shield', 'energy shield', 'riot shield', 'magical barrier']
  },
  vehicles: ['motorcycle parked', 'sports car', 'vintage car', 'bicycle', 'helicopter', 'private jet', 'yacht', 'spaceship', 'tank', 'horse with saddle', 'dragon mount'],
  lighting_props: ['desk lamp', 'floor lamp', 'chandelier', 'candles', 'neon sign', 'string lights', 'spotlight', 'lantern', 'torch', 'campfire', 'fireplace', 'lava lamp'],
  food_drink: {
    drinks: ['coffee mug', 'wine glass', 'beer bottle', 'cocktail', 'water bottle', 'teacup', 'champagne flute'],
    food: ['plate of food', 'pizza', 'burger', 'sushi', 'birthday cake', 'bowl of fruit', 'sandwich']
  },
  decorative: {
    wall_art: ['paintings on wall', 'posters', 'mirrors', 'tapestry', 'mounted TV', 'clock', 'photos in frames'],
    plants: ['potted plants', 'flowers in vase', 'hanging plants', 'bonsai tree', 'cactus', 'bouquet'],
    decor: ['sculptures', 'trophies', 'globe', 'chess set', 'aquarium', 'snow globe', 'vintage radio']
  },
  books_papers: ['stack of books', 'open book', 'newspaper', 'magazine', 'scattered papers', 'notepad', 'ancient scroll', 'map', 'envelope', 'letter', 'journal', 'legal documents'],
  containers: ['cardboard boxes', 'wooden crate', 'treasure chest', 'briefcase', 'suitcase', 'backpack', 'gym bag', 'toolbox', 'first aid kit', 'cooler', 'safe']
};

// ============================================================================
// BUILDINGS & ARCHITECTURE
// ============================================================================

export const BUILDINGS = {
  residential: {
    houses: [
      'modern minimalist house, large windows, flat roof',
      'Victorian mansion, ornate trim, wrap-around porch',
      'cozy cottage, thatched roof, garden out front',
      'suburban home, two-story, white picket fence',
      'log cabin, stone chimney, forest setting'
    ],
    apartments: [
      'high-rise apartment building, balconies, city view',
      'brownstone apartment, fire escape, brick facade',
      'penthouse, floor-to-ceiling windows, rooftop terrace',
      'studio apartment, compact, open plan'
    ]
  },
  commercial: {
    retail: [
      'small shop front, awning, display window',
      'massive shopping mall, multiple floors, escalators',
      'street market stalls, colorful canopies'
    ],
    food: [
      'corner cafe, outdoor seating, umbrellas',
      'fast food restaurant, neon signs, drive-through',
      'fine dining restaurant, elegant entrance, valet',
      'food truck, menu board, serving window'
    ],
    office: [
      'glass skyscraper, corporate logos, plaza',
      'small office building, parking lot',
      'coworking space, open plan, glass walls'
    ]
  },
  industrial: [
    'abandoned factory, broken windows, rusted equipment',
    'working warehouse, loading docks, forklifts',
    'power plant, cooling towers, steam rising',
    'construction site, cranes, scaffolding, workers'
  ],
  fantasy: [
    'medieval castle, towers, drawbridge, moat',
    'wizard tower, spiraling, impossible architecture',
    'elven treehouse, carved into ancient tree',
    'dwarven stronghold, carved into mountain',
    'dragon\'s keep, black stone, skulls decorating'
  ],
  scifi: [
    'space station, rotating rings, solar panels',
    'futuristic megastructure, floating platforms',
    'domed city on Mars, red landscape outside',
    'cyberpunk megabuilding, neon signs covering facade',
    'alien architecture, organic curves, bioluminescent'
  ],
  religious: [
    'gothic cathedral, flying buttresses, rose window',
    'ancient temple, columns, weathered stone',
    'Japanese shrine, torii gate, paper lanterns',
    'mosque, domes, minarets, geometric patterns',
    'ancient pyramid, massive, desert setting'
  ],
  ruins: [
    'ancient ruins, crumbling columns, overgrown with vines',
    'abandoned mansion, broken windows, overgrown garden',
    'post-apocalyptic city, destroyed buildings, rubble',
    'sunken temple, underwater, coral growing'
  ]
};

// ============================================================================
// CAMERA SHOT VOCABULARY
// ============================================================================

export const SHOT_TYPES = {
  'extreme-long': 'extreme long shot showing vast space, tiny figure',
  'long': 'full body shot, head to toe visible',
  'medium-long': 'medium long shot from knees up',
  'medium': 'medium shot from waist up',
  'medium-close': 'medium close-up, chest up',
  'close-up': 'close-up shot on face',
  'extreme-close': 'extreme close-up on eyes'
};

export const CAMERA_ANGLES = {
  'eye-level': 'eye level with character',
  'low': 'low angle looking up at',
  'high': 'high angle looking down at',
  'dutch': 'tilted dutch angle',
  'birds-eye': 'bird\'s eye view looking directly down',
  'worms-eye': 'worm\'s eye view looking directly up'
};

export const CAMERA_MOVEMENTS = {
  'static': 'static shot',
  'dolly-in': 'slow dolly in toward',
  'dolly-out': 'dolly out pulling back from',
  'steadicam': 'steadicam following',
  'pan': 'pan across',
  'orbit': 'orbit around',
  'push-in': 'push in to',
  'pull-back': 'pull back revealing'
};

// ============================================================================
// LIGHTING - SOURCE-BASED (NOT ABSTRACT!)
// ============================================================================

export const LIGHTING_SOURCES = {
  // GOOD - Specific sources
  dramatic: 'single harsh spotlight from above, deep black shadows, face half-lit',
  warm: 'warm golden hour sunlight streaming through window from left, soft diffused glow',
  cold: 'cold blue fluorescent tubes overhead, sterile harsh light, clinical feel',
  romantic: 'warm candlelight from table below, soft orange glow on faces',
  horror: 'flashlight held below chin casting shadows upward, harsh white light',
  fire: 'orange fire glow from explosions behind, character silhouetted, sparks in air',
  neon: 'pink and blue neon signs reflecting on wet pavement, face lit by alternating colored light',
  moonlight: 'cold blue moonlight through window, silver highlights on face',
  sunset: 'warm golden sunset light from behind, rim lighting on hair and shoulders',
  overcast: 'soft diffused daylight, gray sky, even lighting no harsh shadows'
};

// BAD - Never use these abstract terms alone
export const AVOID_LIGHTING_TERMS = [
  'cinematic lighting',
  'dramatic lighting',
  'moody atmosphere',
  'muted colors',
  'professional lighting',
  'studio lighting'
];

// ============================================================================
// MAIN PROMPT BUILDER
// ============================================================================

/**
 * Build a prompt following Nano Banana best practices
 * ORDER: Character → Action → Environment → Style → Camera → Lighting → Technical
 */
export function buildPrompt(config: PromptConfig): string {
  const parts: string[] = [];

  // 1. CHARACTER (30%) - Who is in the scene
  if (config.character) {
    let charPart = config.character;
    if (config.expression) {
      charPart += ` with ${config.expression}`;
    }
    parts.push(charPart);
  }

  // 2. ACTION (20%) - What they're doing
  if (config.characterAction) {
    parts.push(config.characterAction);
  }

  // 3. ENVIRONMENT (20%) - Where they are
  if (config.environment) {
    parts.push(`in ${config.environment}`);
  }
  if (config.setDesign) {
    parts.push(config.setDesign);
  }

  // 4. STYLE (15%) - Aesthetic direction
  if (config.style) {
    parts.push(config.style);
  }
  if (config.mood) {
    parts.push(`${config.mood} mood`);
  }

  // 5. CAMERA - Shot type, angle, movement
  const cameraParts: string[] = [];
  if (config.shotType) {
    cameraParts.push(SHOT_TYPES[config.shotType as keyof typeof SHOT_TYPES] || config.shotType);
  }
  if (config.cameraAngle) {
    cameraParts.push(CAMERA_ANGLES[config.cameraAngle as keyof typeof CAMERA_ANGLES] || config.cameraAngle);
  }
  if (config.cameraMovement) {
    cameraParts.push(CAMERA_MOVEMENTS[config.cameraMovement as keyof typeof CAMERA_MOVEMENTS] || config.cameraMovement);
  }
  if (config.lens) {
    cameraParts.push(`${config.lens} lens`);
  }
  if (cameraParts.length > 0) {
    parts.push(cameraParts.join(', '));
  }

  // 6. LIGHTING - Must be source-based!
  if (config.lighting) {
    // Check if it's a preset key or custom
    const lightingValue = LIGHTING_SOURCES[config.lighting as keyof typeof LIGHTING_SOURCES] || config.lighting;
    parts.push(lightingValue);
  }

  // 7. CONTINUITY - For sequences
  if (config.isSequence) {
    parts.push('maintain color grading');
  }

  // 8. TECHNICAL (15%) - Goes at END
  parts.push(config.quality || '8K high detail');

  return parts.join(', ');
}

// ============================================================================
// EDIT PROMPT BUILDER (For "Next Shot" / Reference-based editing)
// ============================================================================

/**
 * Build an edit prompt for reference-based generation
 * Always starts with "THIS EXACT SETUP"
 */
export function buildEditPrompt(config: Omit<PromptConfig, 'character' | 'environment'>): string {
  const parts: string[] = ['THIS EXACT SETUP'];

  // What CHANGES - action/expression
  if (config.characterAction) {
    parts.push(config.characterAction);
  }
  if (config.expression) {
    parts.push(config.expression);
  }

  // Camera changes
  if (config.cameraMovement) {
    parts.push(CAMERA_MOVEMENTS[config.cameraMovement as keyof typeof CAMERA_MOVEMENTS] || config.cameraMovement);
  }
  if (config.shotType) {
    parts.push(`to ${config.shotType}`);
  }

  // Lighting only if changing
  if (config.lighting) {
    const lightingValue = LIGHTING_SOURCES[config.lighting as keyof typeof LIGHTING_SOURCES] || config.lighting;
    parts.push(lightingValue);
  }

  // Always maintain color grading for edits
  parts.push('maintain color grading');

  // Technical at end
  parts.push(config.quality || '8K high detail');

  return parts.join(', ');
}

// ============================================================================
// REFERENCE IMAGE ORDERING
// ============================================================================

/**
 * Order reference images correctly for Nano Banana
 * - Position 1-6 = highest influence
 * - LAST FRAME must be position 1 for sequences
 * - Character ref in position 1 (or 2 if sequence)
 */
export function orderReferences(refs: ReferenceConfig['images'], isSequence: boolean = false): string[] {
  const ordered: string[] = [];

  if (isSequence) {
    // For sequences: Last frame MUST be position 1
    const lastFrame = refs.find(r => r.type === 'last_frame');
    if (lastFrame) ordered.push(lastFrame.url);

    // Character ref in position 2
    const charRef = refs.find(r => r.type === 'character');
    if (charRef) ordered.push(charRef.url);
  } else {
    // For first shot: Character ref in position 1
    const charRef = refs.find(r => r.type === 'character');
    if (charRef) ordered.push(charRef.url);
  }

  // Background ref in position 2 or 3
  const bgRef = refs.find(r => r.type === 'background');
  if (bgRef) ordered.push(bgRef.url);

  // Style ref
  const styleRef = refs.find(r => r.type === 'style');
  if (styleRef) ordered.push(styleRef.url);

  // Item refs
  const itemRefs = refs.filter(r => r.type === 'item');
  itemRefs.forEach(r => ordered.push(r.url));

  // Any remaining
  refs.forEach(r => {
    if (!ordered.includes(r.url)) {
      ordered.push(r.url);
    }
  });

  return ordered;
}

// ============================================================================
// MULTI-CHARACTER PROMPT BUILDER
// ============================================================================

/**
 * Build prompt for scenes with multiple characters
 */
export function buildMultiCharacterPrompt(
  characters: {
    imagePosition: number;  // Which image slot (1, 2, 3...)
    position: string;       // "on the left", "on the right", "center"
    action: string;         // What they're doing
    expression?: string;    // Their expression
  }[],
  environment: string,
  lighting: string,
  isSequence: boolean = false
): string {
  const parts: string[] = [];

  // Each character with their image reference
  characters.forEach(char => {
    let charPart = `character_${char.imagePosition} (from Image ${char.imagePosition}): ${char.position}, ${char.action}`;
    if (char.expression) {
      charPart += `, ${char.expression}`;
    }
    parts.push(charPart);
  });

  // Environment
  parts.push(environment);

  // Lighting (source-based!)
  parts.push(lighting);

  // Continuity
  if (isSequence) {
    parts.push('maintain color grading');
  }

  // Technical
  parts.push('8K high detail');

  return parts.join('\n');
}

// ============================================================================
// CONTINUATION PROMPT (Minimal - for shot sequences)
// ============================================================================

/**
 * Build minimal continuation prompt for shot sequences
 * These short prompts work perfectly when you have last_frame as Image 1
 */
export function buildContinuationPrompt(
  newAction: string,
  cameraChange?: string
): string {
  const parts = ['Continue from Image 1', `THIS EXACT CHARACTER now ${newAction}`];

  if (cameraChange) {
    parts.push(cameraChange);
  }

  parts.push('maintain exact color grading');

  return parts.join(', ');
}

// ============================================================================
// BACKGROUND REPLACEMENT
// ============================================================================

/**
 * Build prompt for replacing background while keeping character
 */
export function buildBackgroundReplacePrompt(newBackground: string): string {
  return `Keep THIS EXACT CHARACTER exactly as shown, same pose, same lighting on figure, REPLACE background with: ${newBackground}`;
}

// ============================================================================
// EXPRESSION CHANGE
// ============================================================================

/**
 * Build prompt for changing expression only
 */
export function buildExpressionChangePrompt(newExpression: string): string {
  return `THIS EXACT CHARACTER in same scene, same pose, same lighting, change expression to ${newExpression}`;
}

// ============================================================================
// OUTFIT SWAP
// ============================================================================

/**
 * Build prompt for outfit swap (requires outfit ref as Image 2)
 */
export function buildOutfitSwapPrompt(poseDescription?: string): string {
  const pose = poseDescription || 'standing pose';
  return `Take THIS EXACT CHARACTER from Image 1, dress them in the outfit shown in Image 2, ${pose}, maintain character likeness`;
}

// ============================================================================
// QUICK REFERENCE TABLE
// ============================================================================

export const SCENARIO_TEMPLATES = {
  // First shot of sequence
  firstShot: {
    refs: ['CHARACTER_REF'],
    promptTemplate: 'Full description of scene, character, environment, lighting'
  },

  // Continuation shot
  continuation: {
    refs: ['LAST_FRAME', 'CHARACTER_REF'],
    promptTemplate: 'Continue from Image 1, character now [ACTION], maintain color grading'
  },

  // Same scene, different angle
  angleChange: {
    refs: ['PREVIOUS_FRAME', 'CHARACTER_REF'],
    promptTemplate: '[NEW ANGLE] of same scene, THIS EXACT CHARACTER, same lighting'
  },

  // New location
  newLocation: {
    refs: ['CHARACTER_REF', 'BACKGROUND_REF'],
    promptTemplate: 'THIS EXACT CHARACTER in location from Image 2, [POSE], [LIGHTING]'
  },

  // Adding second character
  addCharacter: {
    refs: ['CURRENT_SCENE', 'NEW_CHARACTER_REF'],
    promptTemplate: 'Add character from Image 2 to the scene, standing on the right'
  },

  // Outfit change
  outfitChange: {
    refs: ['CHARACTER_REF', 'OUTFIT_REF'],
    promptTemplate: 'THIS EXACT CHARACTER from Image 1 wearing outfit from Image 2'
  },

  // Expression change
  expressionChange: {
    refs: ['CURRENT_IMAGE'],
    promptTemplate: 'THIS EXACT CHARACTER, change expression to [EXPRESSION]'
  },

  // Background replacement
  backgroundReplace: {
    refs: ['CURRENT_IMAGE'],
    promptTemplate: 'Keep character exactly as shown, REPLACE background with: [NEW BG]'
  }
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate prompt doesn't use bad lighting terms
 */
export function validatePrompt(prompt: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  AVOID_LIGHTING_TERMS.forEach(term => {
    if (prompt.toLowerCase().includes(term.toLowerCase())) {
      warnings.push(`Avoid "${term}" - use specific light SOURCE instead (e.g., "spotlight from above")`);
    }
  });

  // Check if technical specs are at the beginning (bad)
  if (prompt.match(/^(4K|8K|cinematic|shot on|ARRI|RED)/i)) {
    warnings.push('Technical specs should be at END, not beginning. Put subject/action first.');
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}
