/**
 * Prompt Vocabulary Database
 * Ported from Multi-Angle Studio
 * Based on NANO_BANANA_PROMPTING_COMPLETE_GUIDE.txt
 */

// === TYPE DEFINITIONS ===
export interface EmotionLevel {
  subtle: string;
  medium: string;
  strong: string;
  extreme: string;
}

export interface Emotion {
  label: string;
  levels: EmotionLevel;
}

export interface VocabItem {
  value: string;
  label: string;
  prompt: string;
}

// === EMOTIONS & EXPRESSIONS ===
export const EMOTIONS: Record<string, Emotion> = {
  happiness: {
    label: 'Happiness',
    levels: {
      subtle: 'slight smile, hint of amusement, soft eyes',
      medium: 'genuine smile, warm expression, friendly eyes',
      strong: 'beaming with joy, wide smile, eyes crinkled with happiness',
      extreme: 'laughing out loud, head thrown back, tears of joy'
    }
  },
  sadness: {
    label: 'Sadness',
    levels: {
      subtle: 'melancholy look, distant eyes, slight frown',
      medium: 'visibly sad, downcast eyes, mouth turned down',
      strong: 'devastated expression, tears welling up, trembling lip',
      extreme: 'sobbing uncontrollably, tears streaming, face contorted in grief'
    }
  },
  anger: {
    label: 'Anger',
    levels: {
      subtle: 'annoyed expression, slight frown, narrowed eyes',
      medium: 'angry scowl, furrowed brow, clenched jaw',
      strong: 'furious rage, baring teeth, veins visible on forehead',
      extreme: 'explosive fury, screaming, face red with anger'
    }
  },
  fear: {
    label: 'Fear',
    levels: {
      subtle: 'uneasy look, darting eyes, tense posture',
      medium: 'worried expression, wide eyes, biting lip',
      strong: 'terrified, eyes wide with fear, mouth open in shock',
      extreme: 'paralyzed with terror, screaming, pure panic in eyes'
    }
  },
  surprise: {
    label: 'Surprise',
    levels: {
      subtle: 'raised eyebrow, curious look, head tilted',
      medium: 'surprised expression, eyebrows raised, mouth slightly open',
      strong: 'shocked, jaw dropped, eyes wide',
      extreme: 'utterly stunned, frozen in disbelief, gasping'
    }
  },
  confidence: {
    label: 'Confidence',
    levels: {
      subtle: 'self-assured gaze, slight knowing smile',
      medium: 'confident smirk, one eyebrow raised',
      strong: 'commanding presence, steely determined eyes',
      extreme: 'powerful stance, unwavering stare, cocky grin'
    }
  },
  love: {
    label: 'Love',
    levels: {
      subtle: 'soft adoring gaze, gentle smile',
      medium: 'looking lovingly, tender expression',
      strong: 'eyes filled with love, longing look',
      extreme: 'passionate intensity, locked eyes, yearning'
    }
  },
  neutral: {
    label: 'Neutral',
    levels: {
      subtle: 'calm and composed, serene expression',
      medium: 'neutral expression, emotionless face',
      strong: 'stoic, revealing nothing, poker face',
      extreme: 'deadpan, blank stare, completely unreadable'
    }
  }
};

export const EYE_DIRECTIONS: VocabItem[] = [
  { value: 'at_camera', label: 'At Camera', prompt: 'looking directly at camera' },
  { value: 'left', label: 'Looking Left', prompt: 'looking off to the left' },
  { value: 'right', label: 'Looking Right', prompt: 'looking off to the right' },
  { value: 'down', label: 'Looking Down', prompt: 'looking down, avoiding eye contact' },
  { value: 'up', label: 'Looking Up', prompt: 'looking up, hopeful' },
  { value: 'over_shoulder', label: 'Over Shoulder', prompt: 'looking over shoulder' },
  { value: 'side_eye', label: 'Side Eye', prompt: 'side-eye glance, suspicious' },
  { value: 'closed', label: 'Eyes Closed', prompt: 'eyes closed, peaceful' }
];

// === POSES & BODY LANGUAGE ===
export const POSES: Record<string, VocabItem[]> = {
  confident: [
    { value: 'power_pose', label: 'Power Pose', prompt: 'hands on hips, power pose, standing tall' },
    { value: 'arms_crossed', label: 'Arms Crossed', prompt: 'arms crossed, assertive stance' },
    { value: 'casual_lean', label: 'Casual Lean', prompt: 'leaning against wall casually, one foot flat against wall' },
    { value: 'chin_up', label: 'Chin Up', prompt: 'chin raised, looking down at camera, wide stance' }
  ],
  action: [
    { value: 'fighting_stance', label: 'Fighting Stance', prompt: 'fighting stance, fists raised, knees bent' },
    { value: 'hero_landing', label: 'Hero Landing', prompt: 'superhero landing pose, one knee and fist on ground' },
    { value: 'running', label: 'Running', prompt: 'running at full speed, mid-stride' },
    { value: 'jumping', label: 'Jumping', prompt: 'mid-jump, feet off ground, dynamic pose' },
    { value: 'punching', label: 'Punching', prompt: 'throwing a punch, fist extended forward' },
    { value: 'kicking', label: 'Kicking', prompt: 'roundhouse kick, leg extended' }
  ],
  relaxed: [
    { value: 'standing_relaxed', label: 'Standing Relaxed', prompt: 'standing relaxed, natural posture' },
    { value: 'sitting_casual', label: 'Sitting Casual', prompt: 'sitting casually, relaxed posture' },
    { value: 'lying_back', label: 'Lying Back', prompt: 'lying on back, looking up, relaxed' },
    { value: 'lounging', label: 'Lounging', prompt: 'sprawled in chair, totally relaxed, hands behind head' }
  ],
  emotional: [
    { value: 'crying', label: 'Crying', prompt: 'crying, wiping tears, hunched over' },
    { value: 'laughing', label: 'Laughing', prompt: 'laughing hard, holding stomach, head tilted back' },
    { value: 'thinking', label: 'Thinking', prompt: 'hand on chin, deep in thought, contemplative' },
    { value: 'defeated', label: 'Defeated', prompt: 'shoulders slumped, head bowed, defeated posture' }
  ],
  heroic: [
    { value: 'victory', label: 'Victory', prompt: 'arms raised in triumph, fists to the sky, victorious' },
    { value: 'cape_flowing', label: 'Cape Flowing', prompt: 'standing heroically, cape flowing in wind' },
    { value: 'looking_horizon', label: 'Looking at Horizon', prompt: 'looking off into distance, noble stance, determined' },
    { value: 'walking_explosion', label: 'Walking from Explosion', prompt: 'walking away from explosion, not looking back' }
  ],
  communication: [
    { value: 'pointing', label: 'Pointing', prompt: 'pointing finger at target, assertive' },
    { value: 'waving', label: 'Waving', prompt: 'waving hello, friendly gesture' },
    { value: 'shushing', label: 'Shushing', prompt: 'finger to lips, shushing gesture' },
    { value: 'thumbs_up', label: 'Thumbs Up', prompt: 'giving thumbs up, approving smile' }
  ]
};

// === ENVIRONMENTS ===
export const ENVIRONMENTS: Record<string, VocabItem[]> = {
  urban: [
    { value: 'city_street', label: 'City Street', prompt: 'busy city street, cars, pedestrians, storefronts' },
    { value: 'alley', label: 'Dark Alley', prompt: 'dark narrow alley, dumpsters, fire escapes, graffiti' },
    { value: 'rooftop', label: 'Rooftop', prompt: 'city rooftop, water towers, skyline view' },
    { value: 'subway', label: 'Subway', prompt: 'underground subway platform, fluorescent lights' },
    { value: 'nightclub', label: 'Nightclub', prompt: 'nightclub interior, neon lights, dance floor' },
    { value: 'office', label: 'Office', prompt: 'corporate office, glass walls, city view' }
  ],
  nature: [
    { value: 'forest', label: 'Forest', prompt: 'dense forest, tall trees, dappled sunlight, fallen leaves' },
    { value: 'beach', label: 'Beach', prompt: 'sandy beach, waves crashing, palm trees, sunset horizon' },
    { value: 'mountain', label: 'Mountain', prompt: 'snowy mountain peak, vast vista, clouds below' },
    { value: 'desert', label: 'Desert', prompt: 'endless desert dunes, harsh sun, heat shimmer' },
    { value: 'meadow', label: 'Meadow', prompt: 'flower meadow, rolling hills, blue sky, butterflies' },
    { value: 'waterfall', label: 'Waterfall', prompt: 'majestic waterfall, mist rising, rainbow, rocks' }
  ],
  interior: [
    { value: 'living_room', label: 'Living Room', prompt: 'cozy living room, sofa, coffee table, plants' },
    { value: 'bedroom', label: 'Bedroom', prompt: 'bedroom, bed, nightstand, soft lamp light' },
    { value: 'kitchen', label: 'Kitchen', prompt: 'modern kitchen, island counter, stainless appliances' },
    { value: 'library', label: 'Library', prompt: 'grand library, floor-to-ceiling bookshelves, reading lamps' },
    { value: 'restaurant', label: 'Restaurant', prompt: 'upscale restaurant, elegant decor, warm candlelight' }
  ],
  fantasy: [
    { value: 'castle', label: 'Castle', prompt: 'medieval castle throne room, stone walls, torches, banners' },
    { value: 'tavern', label: 'Tavern', prompt: 'fantasy tavern, wooden tables, fireplace, ale barrels' },
    { value: 'dungeon', label: 'Dungeon', prompt: 'dark dungeon, chains on walls, iron bars, dripping water' },
    { value: 'enchanted_forest', label: 'Enchanted Forest', prompt: 'magical forest, glowing mushrooms, fairy lights, mist' },
    { value: 'wizard_tower', label: 'Wizard Tower', prompt: 'wizard study, books everywhere, potions, artifacts' }
  ],
  scifi: [
    { value: 'spaceship', label: 'Spaceship', prompt: 'spaceship cockpit, holographic displays, stars through window' },
    { value: 'space_station', label: 'Space Station', prompt: 'orbital station, viewing deck, Earth visible below' },
    { value: 'alien_planet', label: 'Alien Planet', prompt: 'alien landscape, purple sky, strange vegetation, two moons' },
    { value: 'cyberpunk_city', label: 'Cyberpunk City', prompt: 'neon-lit dystopian city, holograms, flying cars, rain' },
    { value: 'lab', label: 'High-Tech Lab', prompt: 'high-tech laboratory, screens, equipment, glass tubes' }
  ],
  historical: [
    { value: 'victorian', label: 'Victorian', prompt: 'Victorian parlor, ornate furniture, velvet curtains, gas lamps' },
    { value: '1920s', label: '1920s Speakeasy', prompt: '1920s speakeasy, art deco, jazz band, cigarette smoke' },
    { value: '1950s', label: '1950s Diner', prompt: '1950s diner, checkered floor, jukebox, chrome stools' },
    { value: '1980s', label: '1980s Arcade', prompt: '1980s arcade, neon signs, arcade cabinets' }
  ],
  studio: [
    { value: 'white_studio', label: 'White Studio', prompt: 'clean white studio background, seamless backdrop, soft lighting' },
    { value: 'dark_studio', label: 'Dark Studio', prompt: 'dark studio background, dramatic spotlight, black backdrop' },
    { value: 'gradient', label: 'Gradient', prompt: 'smooth gradient background, professional studio lighting' }
  ]
};

// === OUTFITS ===
export const OUTFITS: Record<string, VocabItem[]> = {
  casual: [
    { value: 'jeans_tshirt', label: 'Jeans & T-Shirt', prompt: 'wearing jeans and a plain white t-shirt' },
    { value: 'hoodie', label: 'Hoodie', prompt: 'dressed in hoodie and sweatpants, comfortable look' },
    { value: 'summer', label: 'Summer Casual', prompt: 'cargo shorts and tank top, summer casual' },
    { value: 'flannel', label: 'Flannel', prompt: 'flannel shirt over band tee, relaxed style' }
  ],
  formal: [
    { value: 'suit', label: 'Business Suit', prompt: 'wearing tailored black suit, white dress shirt, tie' },
    { value: 'evening_gown', label: 'Evening Gown', prompt: 'in elegant evening gown, floor-length' },
    { value: 'business_casual', label: 'Business Casual', prompt: 'business casual, blazer over button-down, no tie' },
    { value: 'tuxedo', label: 'Tuxedo', prompt: 'wearing black tuxedo, bow tie, polished shoes' }
  ],
  fantasy: [
    { value: 'plate_armor', label: 'Plate Armor', prompt: 'wearing full plate armor, battle-worn, cape flowing' },
    { value: 'wizard_robes', label: 'Wizard Robes', prompt: 'in flowing wizard robes, stars and moons embroidered' },
    { value: 'ranger', label: 'Ranger', prompt: 'leather armor with hood, ranger style, quiver on back' },
    { value: 'royal', label: 'Royal', prompt: 'royal gown with gold trim, crown, velvet cape' }
  ],
  scifi: [
    { value: 'spacesuit', label: 'Spacesuit', prompt: 'sleek spacesuit, helmet under arm' },
    { value: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk jacket with LED trim, neon accents' },
    { value: 'tactical', label: 'Tactical Armor', prompt: 'futuristic tactical armor, hexagonal plating' },
    { value: 'pilot', label: 'Pilot Jumpsuit', prompt: 'pilot jumpsuit with mission patches' }
  ],
  streetwear: [
    { value: 'urban', label: 'Urban', prompt: 'oversized hoodie, designer sneakers, gold chain' },
    { value: 'leather', label: 'Leather', prompt: 'leather jacket, ripped jeans, combat boots' },
    { value: 'tracksuit', label: 'Tracksuit', prompt: 'tracksuit, fresh kicks, snapback hat' },
    { value: 'vintage', label: 'Vintage', prompt: 'vintage band tee, distressed denim, vans' }
  ],
  profession: [
    { value: 'doctor', label: 'Doctor', prompt: 'white lab coat, stethoscope, scrubs underneath' },
    { value: 'chef', label: 'Chef', prompt: 'chef whites, toque hat, apron' },
    { value: 'police', label: 'Police', prompt: 'police uniform, badge, utility belt' },
    { value: 'military', label: 'Military', prompt: 'camouflage fatigues, tactical vest, boots' },
    { value: 'firefighter', label: 'Firefighter', prompt: 'bunker gear, helmet, oxygen tank' }
  ],
  athletic: [
    { value: 'basketball', label: 'Basketball', prompt: 'basketball jersey and shorts, headband' },
    { value: 'boxing', label: 'Boxing', prompt: 'boxing gear, gloves, shorts, no shirt' },
    { value: 'yoga', label: 'Yoga', prompt: 'yoga outfit, leggings, sports bra' },
    { value: 'running', label: 'Running', prompt: 'running gear, compression shorts, tank' }
  ]
};

// === PROPS ===
export const PROPS: Record<string, VocabItem[]> = {
  weapons: [
    { value: 'sword', label: 'Sword', prompt: 'holding a sword' },
    { value: 'katana', label: 'Katana', prompt: 'wielding a katana' },
    { value: 'gun', label: 'Gun', prompt: 'holding a pistol' },
    { value: 'bow', label: 'Bow', prompt: 'holding bow and arrow' },
    { value: 'staff', label: 'Magic Staff', prompt: 'holding a glowing magic staff' },
    { value: 'lightsaber', label: 'Lightsaber', prompt: 'wielding a glowing lightsaber' }
  ],
  tech: [
    { value: 'phone', label: 'Phone', prompt: 'holding smartphone' },
    { value: 'laptop', label: 'Laptop', prompt: 'laptop open in front' },
    { value: 'headphones', label: 'Headphones', prompt: 'wearing headphones' },
    { value: 'camera', label: 'Camera', prompt: 'holding a camera' }
  ],
  food_drink: [
    { value: 'coffee', label: 'Coffee', prompt: 'holding coffee mug' },
    { value: 'wine', label: 'Wine', prompt: 'holding wine glass' },
    { value: 'beer', label: 'Beer', prompt: 'holding beer bottle' },
    { value: 'food', label: 'Food Plate', prompt: 'plate of food on table' }
  ],
  accessories: [
    { value: 'sunglasses', label: 'Sunglasses', prompt: 'wearing sunglasses' },
    { value: 'hat', label: 'Hat', prompt: 'wearing a hat' },
    { value: 'backpack', label: 'Backpack', prompt: 'wearing a backpack' },
    { value: 'umbrella', label: 'Umbrella', prompt: 'holding an umbrella' }
  ],
  vehicles: [
    { value: 'motorcycle', label: 'Motorcycle', prompt: 'motorcycle parked nearby' },
    { value: 'car', label: 'Sports Car', prompt: 'sports car in background' },
    { value: 'bicycle', label: 'Bicycle', prompt: 'bicycle leaning against wall' }
  ]
};

// === LIGHTING ===
export const LIGHTING: Record<string, VocabItem[]> = {
  dramatic: [
    { value: 'spotlight', label: 'Spotlight', prompt: 'single harsh spotlight from above, deep black shadows' },
    { value: 'noir', label: 'Film Noir', prompt: 'face half-lit half in darkness, noir style' },
    { value: 'rim', label: 'Rim Light', prompt: 'strong rim light from behind, silhouette effect' }
  ],
  warm: [
    { value: 'golden_hour', label: 'Golden Hour', prompt: 'warm golden hour sunlight, soft diffused glow, long shadows' },
    { value: 'candlelight', label: 'Candlelight', prompt: 'warm candlelight from below, soft orange glow on face' },
    { value: 'fireplace', label: 'Fireplace', prompt: 'warm fireplace glow from the side, flickering light' }
  ],
  cold: [
    { value: 'fluorescent', label: 'Fluorescent', prompt: 'cold blue fluorescent tubes overhead, sterile harsh light' },
    { value: 'moonlight', label: 'Moonlight', prompt: 'cold blue moonlight through window, night atmosphere' },
    { value: 'overcast', label: 'Overcast', prompt: 'gray overcast daylight, soft diffused, no harsh shadows' }
  ],
  neon: [
    { value: 'neon_pink_blue', label: 'Pink & Blue Neon', prompt: 'pink and blue neon signs reflecting, cyberpunk lighting' },
    { value: 'neon_green', label: 'Green Neon', prompt: 'green neon glow, matrix-style lighting' },
    { value: 'neon_red', label: 'Red Neon', prompt: 'red neon light casting crimson glow' }
  ],
  natural: [
    { value: 'bright_day', label: 'Bright Day', prompt: 'bright daylight, blue sky, natural outdoor lighting' },
    { value: 'sunset', label: 'Sunset', prompt: 'sunset light, orange and pink sky, warm golden tones' },
    { value: 'sunrise', label: 'Sunrise', prompt: 'early morning sunrise, soft pink light, fresh atmosphere' }
  ],
  special: [
    { value: 'fire', label: 'Fire Glow', prompt: 'orange fire glow from explosions, character lit by flames' },
    { value: 'underwater', label: 'Underwater', prompt: 'blue-green underwater light, caustics, diffused' },
    { value: 'horror', label: 'Horror', prompt: 'flashlight from below casting shadows upward, horror lighting' }
  ]
};

// === CAMERA SHOTS ===
export const CAMERA_SHOTS: Record<string, VocabItem[]> = {
  distance: [
    { value: 'extreme_long', label: 'Extreme Long Shot', prompt: 'extreme long shot, tiny figure in vast space' },
    { value: 'long', label: 'Full Body', prompt: 'full body shot, head to toe' },
    { value: 'medium_long', label: 'Medium Long', prompt: 'medium long shot from knees up' },
    { value: 'medium', label: 'Medium (Waist Up)', prompt: 'medium shot from waist up' },
    { value: 'medium_close', label: 'Medium Close', prompt: 'medium close-up, chest up' },
    { value: 'close', label: 'Close-Up', prompt: 'close-up shot on face' },
    { value: 'extreme_close', label: 'Extreme Close-Up', prompt: 'extreme close-up on eyes' }
  ],
  angle: [
    { value: 'eye_level', label: 'Eye Level', prompt: 'eye level with character' },
    { value: 'low', label: 'Low Angle', prompt: 'low angle looking up at character, heroic' },
    { value: 'high', label: 'High Angle', prompt: 'high angle looking down at character' },
    { value: 'dutch', label: 'Dutch Angle', prompt: 'tilted camera angle, tension' },
    { value: 'birds_eye', label: "Bird's Eye", prompt: 'birds eye view looking directly down' },
    { value: 'worms_eye', label: "Worm's Eye", prompt: 'worms eye view looking directly up' }
  ],
  position: [
    { value: 'centered', label: 'Centered', prompt: '' },
    { value: 'rule_thirds_left', label: 'Left Third', prompt: 'off-center composition, character on left third' },
    { value: 'rule_thirds_right', label: 'Right Third', prompt: 'off-center composition, character on right third' },
    { value: 'over_shoulder', label: 'Over Shoulder', prompt: 'over the shoulder shot' },
    { value: 'pov', label: 'POV', prompt: 'POV shot, first person view' }
  ]
};

// === ACTIONS ===
export const ACTIONS: VocabItem[] = [
  { value: 'standing', label: 'Standing', prompt: 'standing' },
  { value: 'walking', label: 'Walking', prompt: 'walking with purpose' },
  { value: 'running', label: 'Running', prompt: 'running at full speed' },
  { value: 'sitting', label: 'Sitting', prompt: 'sitting' },
  { value: 'lying', label: 'Lying Down', prompt: 'lying down' },
  { value: 'jumping', label: 'Jumping', prompt: 'jumping in the air' },
  { value: 'fighting', label: 'Fighting', prompt: 'in combat, fighting' },
  { value: 'talking', label: 'Talking', prompt: 'talking, mouth open mid-word' },
  { value: 'thinking', label: 'Thinking', prompt: 'deep in thought' },
  { value: 'working', label: 'Working', prompt: 'working, focused on task' },
  { value: 'reading', label: 'Reading', prompt: 'reading a book' },
  { value: 'typing', label: 'Typing', prompt: 'typing on keyboard' },
  { value: 'dancing', label: 'Dancing', prompt: 'dancing, dynamic pose' },
  { value: 'cooking', label: 'Cooking', prompt: 'cooking at stove' }
];

// === WEATHER ===
export const WEATHER: VocabItem[] = [
  { value: 'clear', label: 'Clear', prompt: '' },
  { value: 'rain', label: 'Rainy', prompt: 'rainy weather, puddles, reflections' },
  { value: 'snow', label: 'Snowing', prompt: 'snow falling, frost on surfaces, winter' },
  { value: 'storm', label: 'Storm', prompt: 'thunderstorm, lightning, dark clouds' },
  { value: 'fog', label: 'Foggy', prompt: 'thick fog, limited visibility, mysterious' }
];

// === TIME OF DAY ===
export const TIME_OF_DAY: VocabItem[] = [
  { value: 'day', label: 'Day', prompt: 'bright daylight' },
  { value: 'night', label: 'Night', prompt: 'night time, dark sky, moonlight' },
  { value: 'sunset', label: 'Sunset', prompt: 'golden hour, sunset, orange and pink sky' },
  { value: 'sunrise', label: 'Sunrise', prompt: 'early morning, sunrise, soft pink light' },
  { value: 'twilight', label: 'Twilight', prompt: 'twilight, blue hour, fading light' }
];

// === QWEN 3D ANGLE PROMPT BUILDER ===
export interface AngleSettings {
  azimuth: number;
  elevation: number;
  distance: number;
}

/**
 * Build a Qwen-compatible 3D angle prompt
 * Format: <sks> front-left quarter view eye-level shot close-up
 */
export function buildQwenPromptContinuous(azimuth: number, elevation: number, distance: number): string {
  // Normalize azimuth to 0-360
  const az = ((azimuth % 360) + 360) % 360;

  // Horizontal position
  let horizontal = '';
  if (az >= 337.5 || az < 22.5) horizontal = 'front';
  else if (az >= 22.5 && az < 67.5) horizontal = 'front-left quarter';
  else if (az >= 67.5 && az < 112.5) horizontal = 'left profile';
  else if (az >= 112.5 && az < 157.5) horizontal = 'back-left quarter';
  else if (az >= 157.5 && az < 202.5) horizontal = 'back';
  else if (az >= 202.5 && az < 247.5) horizontal = 'back-right quarter';
  else if (az >= 247.5 && az < 292.5) horizontal = 'right profile';
  else horizontal = 'front-right quarter';

  // Vertical position
  let vertical = '';
  if (elevation < -15) vertical = 'low-angle';
  else if (elevation > 15) vertical = 'high-angle';
  else vertical = 'eye-level';

  // Distance
  let distanceLabel = '';
  if (distance < 0.8) distanceLabel = 'close-up';
  else if (distance > 1.3) distanceLabel = 'wide shot';
  else distanceLabel = 'medium shot';

  return `<sks> ${horizontal} view ${vertical} shot ${distanceLabel}`;
}

// === BATCH ANGLE PRESETS ===
export interface BatchAngle {
  label: string;
  azimuth: number;
  elevation: number;
  distance: number;
}

export const BATCH_PRESETS: Record<string, BatchAngle[]> = {
  turnaround: [
    { label: 'Front', azimuth: 0, elevation: 0, distance: 1.0 },
    { label: 'Front-Left', azimuth: 45, elevation: 0, distance: 1.0 },
    { label: 'Left', azimuth: 90, elevation: 0, distance: 1.0 },
    { label: 'Back-Left', azimuth: 135, elevation: 0, distance: 1.0 },
    { label: 'Back', azimuth: 180, elevation: 0, distance: 1.0 },
    { label: 'Back-Right', azimuth: 225, elevation: 0, distance: 1.0 },
    { label: 'Right', azimuth: 270, elevation: 0, distance: 1.0 },
    { label: 'Front-Right', azimuth: 315, elevation: 0, distance: 1.0 }
  ],
  cardinal: [
    { label: 'Front', azimuth: 0, elevation: 0, distance: 1.0 },
    { label: 'Right', azimuth: 90, elevation: 0, distance: 1.0 },
    { label: 'Back', azimuth: 180, elevation: 0, distance: 1.0 },
    { label: 'Left', azimuth: 270, elevation: 0, distance: 1.0 }
  ],
  angles: [
    { label: 'Low Angle', azimuth: 0, elevation: -20, distance: 1.0 },
    { label: 'Eye Level', azimuth: 0, elevation: 0, distance: 1.0 },
    { label: 'High Angle', azimuth: 0, elevation: 30, distance: 1.0 }
  ],
  distances: [
    { label: 'Close-Up', azimuth: 0, elevation: 0, distance: 0.7 },
    { label: 'Medium', azimuth: 0, elevation: 0, distance: 1.0 },
    { label: 'Wide', azimuth: 0, elevation: 0, distance: 1.5 }
  ]
};

// === PROMPT BUILDER ===
export interface PromptBuilderOptions {
  emotion?: string;
  emotionLevel?: keyof EmotionLevel;
  eyeDirection?: string;
  pose?: string;
  action?: string;
  environment?: string;
  outfit?: string;
  props?: string[];
  lighting?: string;
  cameraDistance?: string;
  cameraAngle?: string;
  cameraPosition?: string;
  weather?: string;
  timeOfDay?: string;
  isSequenceContinuation?: boolean;
  customAdditions?: string;
}

/**
 * Build a complete prompt from selected options
 */
export function buildPromptFromSelections(options: PromptBuilderOptions): string {
  const {
    emotion,
    emotionLevel = 'medium',
    eyeDirection,
    pose,
    action,
    environment,
    outfit,
    props = [],
    lighting,
    cameraDistance,
    cameraAngle,
    cameraPosition,
    weather,
    timeOfDay,
    isSequenceContinuation = false,
    customAdditions = ''
  } = options;

  const parts: string[] = [];

  // Character anchor
  parts.push('THIS EXACT CHARACTER');

  // Action/Pose
  if (action) {
    const actionData = ACTIONS.find(a => a.value === action);
    if (actionData) parts.push(actionData.prompt);
  }
  if (pose) {
    for (const category of Object.values(POSES)) {
      const poseData = category.find(p => p.value === pose);
      if (poseData) {
        parts.push(poseData.prompt);
        break;
      }
    }
  }

  // Emotion & Expression
  if (emotion && EMOTIONS[emotion]) {
    const emotionData = EMOTIONS[emotion].levels[emotionLevel];
    if (emotionData) parts.push(emotionData);
  }

  // Eye direction
  if (eyeDirection) {
    const eyeData = EYE_DIRECTIONS.find(e => e.value === eyeDirection);
    if (eyeData) parts.push(eyeData.prompt);
  }

  // Environment
  if (environment) {
    for (const category of Object.values(ENVIRONMENTS)) {
      const envData = category.find(e => e.value === environment);
      if (envData) {
        parts.push(`in ${envData.prompt}`);
        break;
      }
    }
  }

  // Outfit
  if (outfit) {
    for (const category of Object.values(OUTFITS)) {
      const outfitData = category.find(o => o.value === outfit);
      if (outfitData) {
        parts.push(outfitData.prompt);
        break;
      }
    }
  }

  // Props
  if (props.length > 0) {
    for (const prop of props) {
      for (const category of Object.values(PROPS)) {
        const propData = category.find(p => p.value === prop);
        if (propData) {
          parts.push(propData.prompt);
          break;
        }
      }
    }
  }

  // Weather
  if (weather && weather !== 'clear') {
    const weatherData = WEATHER.find(w => w.value === weather);
    if (weatherData?.prompt) parts.push(weatherData.prompt);
  }

  // Time of day
  if (timeOfDay) {
    const timeData = TIME_OF_DAY.find(t => t.value === timeOfDay);
    if (timeData?.prompt) parts.push(timeData.prompt);
  }

  // Camera
  const cameraParts: string[] = [];
  if (cameraDistance) {
    const distData = CAMERA_SHOTS.distance.find(d => d.value === cameraDistance);
    if (distData) cameraParts.push(distData.prompt);
  }
  if (cameraAngle) {
    const angleData = CAMERA_SHOTS.angle.find(a => a.value === cameraAngle);
    if (angleData) cameraParts.push(angleData.prompt);
  }
  if (cameraPosition && cameraPosition !== 'centered') {
    const posData = CAMERA_SHOTS.position.find(p => p.value === cameraPosition);
    if (posData?.prompt) cameraParts.push(posData.prompt);
  }
  if (cameraParts.length > 0) {
    parts.push(cameraParts.join(', '));
  }

  // Lighting
  if (lighting) {
    for (const category of Object.values(LIGHTING)) {
      const lightData = category.find(l => l.value === lighting);
      if (lightData) {
        parts.push(lightData.prompt);
        break;
      }
    }
  }

  // Custom additions
  if (customAdditions.trim()) {
    parts.push(customAdditions.trim());
  }

  // Sequence continuation
  if (isSequenceContinuation) {
    parts.push('maintain exact color grading from previous shot');
  }

  return parts.join(', ');
}
