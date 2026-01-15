/**
 * WorldEngineerAgent - Phase 0 World Engineering
 *
 * Based on AI2Studio Master Prompting & World Engineering Bible v4.0
 *
 * Responsibilities:
 * - Create WORLD_STATE.json (coordinates, geometry, lighting direction, anchors)
 * - Define WORLD-LOCKED ENTITIES
 * - Define CAMERA_RIGS.json (C + LookAt + allowed lenses)
 * - Define SCALE_ANCHORS
 * - Set DIRECTION_LOCK
 * - Persist SCENE_GEOGRAPHY_MEMORY
 *
 * Rules:
 * - enforce_one_world
 * - lock_lighting_direction
 * - define_scale_anchors
 * - declare_entities_world_locked
 */

import type {
  SpecAgent,
  WorldEngineerInput,
  WorldEngineerOutput,
  WorldStateJSON,
  CameraRigsJSON,
  CameraRigDefinition,
  ScaleAnchor,
  EntityDefinition,
  SceneGeographyMemory,
  RefInput
} from './specTypes';
import { CWS_LAWS, GLOBAL_CONSTRAINTS } from './specTypes';
import { STANDARD_RIGS } from '../cws/types';

// ============================================
// SYSTEM PROMPT
// ============================================

const WORLD_ENGINEER_SYSTEM_PROMPT = `You are the WORLD ENGINEER AGENT for the AI2Studio production system.

## YOUR ROLE
You are responsible for PHASE 0: WORLD ENGINEERING.
Your job is to establish ONE CONTINUOUS WORLD that all shots will reference.

## THE THREE FOUNDATIONAL LAWS (NON-NEGOTIABLE)

### LAW 1 — ONE WORLD
One world loaded once. Never reset.
Allowed changes are only reactions:
- smoke density
- dust/debris settling
- lighting intensity (not direction)

FORBIDDEN:
- No location swaps
- No re-lit worlds
- No re-scaled worlds

### LAW 2 — WORLD-LOCKED ENTITIES
Anything important must have:
- one identity
- continuous existence
- stable world position unless authored

FORBIDDEN:
- No teleport
- No disappear/reappear
- No duplicates

### LAW 3 — CAMERA OVER SUBJECT
The camera moves. The world does not.
- Dominance = angle, not proximity
- Intimacy = yaw, not push-in
- Scale = distance, not resizing

Move camera rigs. Don't cheat by moving subjects toward camera.

## YOUR OUTPUTS

You must output:

1. **WORLD_STATE.json** containing:
   - world_id (unique identifier)
   - environment_geometry (ground plane, static landmarks, description)
   - lighting (primary direction, color temp, fill, intensity, locked=true)
   - atmospherics (smoke/dust/haze baseline)
   - scale_anchors (real-world references for scale)
   - entities (all characters, vehicles, props with positions)

2. **CAMERA_RIGS.json** containing:
   - Standard rigs: WIDE_MASTER, OTS_A, OTS_B, CU_A, CU_B, REACTION_INSERT, etc.
   - Each rig has: position (x,y,z), lookAt (x,y,z), lens, allowed motions

3. **SCALE_ANCHORS** - Real-world references:
   - hands, doors, seats, ledges, building floors
   - NEVER say "big/small" alone - always anchor to real references

4. **SCENE_GEOGRAPHY_MEMORY**:
   - hero_side_of_frame (LEFT/RIGHT/CENTER)
   - villain_side_of_frame
   - light_direction_lock
   - color_grade_lock
   - forbid_flip: true

5. **BASE_WORLD_REFERENCE_PROMPT** - The prompt for generating the empty world image

## OUTPUT FORMAT

Return a JSON object with this structure:

\`\`\`json
{
  "worldState": { ... },
  "cameraRigs": { ... },
  "scaleAnchors": [ ... ],
  "entities": [ ... ],
  "sceneGeographyMemory": { ... },
  "baseWorldReferencePrompt": "..."
}
\`\`\`

## COORDINATE SYSTEM
Use game-engine coordinates:
- X = left (-) / right (+) relative to camera
- Y = up (+) / down (-)
- Z = toward camera (+) / away from camera (-)

## REMEMBER
The world must be described ONCE, then referenced FOREVER.
Every subsequent shot inherits this world state.`;

// ============================================
// WORLD ENGINEER AGENT
// ============================================

export const worldEngineerAgent: SpecAgent = {
  role: 'world_engineer',
  name: 'World Engineer Agent',
  icon: '🌍',
  color: 'emerald',
  systemPrompt: WORLD_ENGINEER_SYSTEM_PROMPT,

  async execute(input: WorldEngineerInput): Promise<WorldEngineerOutput> {
    console.log('[WorldEngineer] Starting world engineering for concept:', input.concept.substring(0, 50) + '...');

    // If we have an existing world state, use it as a base
    if (input.existingWorldState) {
      console.log('[WorldEngineer] Extending existing world state');
      return extendExistingWorld(input);
    }

    // Create new world from concept
    return createNewWorld(input);
  }
};

// ============================================
// CREATE NEW WORLD
// ============================================

async function createNewWorld(input: WorldEngineerInput): Promise<WorldEngineerOutput> {
  const worldId = `world_${Date.now()}`;

  // Analyze concept to extract entities and environment
  const analysis = analyzeConceptForWorld(input.concept, input.refs || []);

  // Build world state
  const worldState: WorldStateJSON = {
    world_id: worldId,
    environment_geometry: {
      ground_plane: { Y: 0 },
      static_landmarks: analysis.landmarks,
      static_description: analysis.environmentDescription
    },
    lighting: {
      primary_light_direction: analysis.lightingDirection,
      primary_light_color_temp: analysis.lightingTemp,
      secondary_fill: analysis.secondaryFill,
      intensity_baseline: 1.0,
      direction_locked: true
    },
    atmospherics: {
      smoke_baseline: analysis.atmospherics.smoke,
      dust_baseline: analysis.atmospherics.dust,
      haze: analysis.atmospherics.haze
    },
    scale_anchors: analysis.scaleAnchors,
    entities: analysis.entities
  };

  // Build camera rigs (start with standard rigs + custom if needed)
  const cameraRigs: CameraRigsJSON = {
    camera_rigs: buildCameraRigs(analysis)
  };

  // Build scene geography memory
  const sceneGeographyMemory: SceneGeographyMemory = {
    hero_side_of_frame: analysis.heroSide,
    villain_side_of_frame: analysis.villainSide,
    light_direction_lock: analysis.lightingDirection,
    color_grade_lock: analysis.colorGrade,
    forbid_flip: true
  };

  // Build base world reference prompt
  const baseWorldReferencePrompt = buildBaseWorldPrompt(analysis);

  console.log('[WorldEngineer] World created:', worldId);
  console.log('[WorldEngineer] Entities:', analysis.entities.length);
  console.log('[WorldEngineer] Camera rigs:', cameraRigs.camera_rigs.length);

  return {
    worldState,
    cameraRigs,
    scaleAnchors: analysis.scaleAnchors,
    baseWorldReferencePrompt,
    entities: analysis.entities,
    sceneGeographyMemory
  };
}

// ============================================
// EXTEND EXISTING WORLD
// ============================================

async function extendExistingWorld(input: WorldEngineerInput): Promise<WorldEngineerOutput> {
  // This would extend an existing world with new entities
  // For now, just return the existing world converted to our format
  const existing = input.existingWorldState!;

  // Convert existing world state to spec format
  // This is a stub - full implementation would merge new refs into existing world

  return createNewWorld(input);
}

// ============================================
// CONCEPT ANALYSIS
// ============================================

interface ConceptAnalysis {
  environmentDescription: string;
  environmentType: string;
  landmarks: string[];
  lightingDirection: string;
  lightingTemp: string;
  secondaryFill: string;
  atmospherics: {
    smoke: 'none' | 'light' | 'medium' | 'heavy';
    dust: 'none' | 'light' | 'medium' | 'heavy';
    haze: 'none' | 'light' | 'medium' | 'heavy';
  };
  scaleAnchors: ScaleAnchor[];
  entities: EntityDefinition[];
  heroSide: 'LEFT' | 'RIGHT' | 'CENTER';
  villainSide: 'LEFT' | 'RIGHT' | 'CENTER';
  colorGrade: string;
  needsCustomRigs: boolean;
  customRigSuggestions: string[];
}

function analyzeConceptForWorld(concept: string, refs: RefInput[]): ConceptAnalysis {
  const conceptLower = concept.toLowerCase();

  // Detect environment type
  const environmentType = detectEnvironmentType(conceptLower);

  // Detect entities from concept and refs
  const entities = extractEntities(concept, refs);

  // Detect lighting based on environment and keywords
  const lighting = detectLighting(conceptLower, environmentType);

  // Detect atmospherics
  const atmospherics = detectAtmospherics(conceptLower, environmentType);

  // Generate scale anchors based on environment
  const scaleAnchors = generateScaleAnchors(environmentType, conceptLower);

  // Detect hero/villain positioning
  const positioning = detectPositioning(conceptLower);

  // Detect if custom camera rigs are needed
  const customRigs = detectCustomRigNeeds(conceptLower, environmentType);

  return {
    environmentDescription: generateEnvironmentDescription(concept, environmentType),
    environmentType,
    landmarks: extractLandmarks(conceptLower, environmentType),
    lightingDirection: lighting.direction,
    lightingTemp: lighting.temp,
    secondaryFill: lighting.fill,
    atmospherics,
    scaleAnchors,
    entities,
    heroSide: positioning.heroSide,
    villainSide: positioning.villainSide,
    colorGrade: lighting.colorGrade,
    needsCustomRigs: customRigs.needed,
    customRigSuggestions: customRigs.suggestions
  };
}

// ============================================
// ENVIRONMENT DETECTION
// ============================================

function detectEnvironmentType(concept: string): string {
  const environmentKeywords: Record<string, string[]> = {
    'urban_exterior': ['city', 'street', 'urban', 'downtown', 'building', 'skyscraper', 'rooftop'],
    'urban_interior': ['office', 'apartment', 'room', 'hallway', 'elevator', 'lobby'],
    'nature_exterior': ['forest', 'mountain', 'beach', 'desert', 'field', 'river', 'lake', 'ocean'],
    'industrial': ['factory', 'warehouse', 'industrial', 'machinery', 'construction'],
    'vehicle_interior': ['car', 'cockpit', 'cabin', 'helicopter', 'plane', 'ship', 'boat'],
    'vehicle_exterior': ['chase', 'driving', 'flying', 'sailing'],
    'fantasy': ['castle', 'dungeon', 'magical', 'fantasy', 'dragon', 'wizard'],
    'sci_fi': ['spaceship', 'space', 'futuristic', 'robot', 'alien', 'cyberpunk'],
    'domestic': ['kitchen', 'bedroom', 'bathroom', 'living room', 'house', 'home']
  };

  for (const [envType, keywords] of Object.entries(environmentKeywords)) {
    if (keywords.some(kw => concept.includes(kw))) {
      return envType;
    }
  }

  return 'generic';
}

// ============================================
// ENTITY EXTRACTION
// ============================================

function extractEntities(concept: string, refs: RefInput[]): EntityDefinition[] {
  const entities: EntityDefinition[] = [];
  let entityIndex = 0;

  // First, add entities from refs
  for (const ref of refs) {
    const entityType = mapRefTypeToEntityType(ref.type);
    entities.push({
      entity_id: `entity_${entityIndex++}`,
      entity_type: entityType,
      identity_lock: true,
      world_locked_by_default: true,
      base_world_position: getDefaultPosition(entityType, entityIndex),
      base_orientation: { yaw_deg: 0, pitch_deg: 0, roll_deg: 0 },
      allowed_motion_types: ['rotate_in_place', 'pose_change', 'micro_shift', 'authored_translation'],
      forbidden_motion_types: ['teleport', 'duplicate', 'vanish'],
      appearance_lock_notes: ref.description || `${ref.name} - maintain exact appearance`,
      ref_image_url: ref.url
    });
  }

  // Then, detect entities from concept text
  const characterKeywords = ['character', 'person', 'man', 'woman', 'hero', 'villain', 'protagonist', 'antagonist', 'robot', 'creature'];
  const vehicleKeywords = ['car', 'truck', 'helicopter', 'plane', 'ship', 'boat', 'motorcycle', 'bike', 'vehicle'];
  const propKeywords = ['weapon', 'gun', 'sword', 'book', 'phone', 'briefcase', 'bag'];

  const conceptLower = concept.toLowerCase();

  // Check for characters
  for (const kw of characterKeywords) {
    if (conceptLower.includes(kw) && !entities.some(e => e.entity_type === 'character')) {
      entities.push({
        entity_id: `entity_${entityIndex++}`,
        entity_type: 'character',
        identity_lock: true,
        world_locked_by_default: true,
        base_world_position: { x: 0, y: 0, z: 0 },
        base_orientation: { yaw_deg: 0, pitch_deg: 0, roll_deg: 0 },
        allowed_motion_types: ['rotate_in_place', 'pose_change', 'micro_shift', 'authored_translation'],
        forbidden_motion_types: ['teleport', 'duplicate', 'vanish'],
        appearance_lock_notes: `Primary ${kw} - maintain exact appearance throughout`
      });
      break;
    }
  }

  // Check for vehicles
  for (const kw of vehicleKeywords) {
    if (conceptLower.includes(kw) && !entities.some(e => e.entity_type === 'vehicle')) {
      entities.push({
        entity_id: `entity_${entityIndex++}`,
        entity_type: 'vehicle',
        identity_lock: true,
        world_locked_by_default: true,
        base_world_position: { x: 0, y: 0, z: 5 },
        base_orientation: { yaw_deg: 0, pitch_deg: 0, roll_deg: 0 },
        allowed_motion_types: ['authored_translation', 'rotate_in_place'],
        forbidden_motion_types: ['teleport', 'duplicate', 'vanish', 'resize'],
        appearance_lock_notes: `${kw} - maintain exact design and scale`
      });
      break;
    }
  }

  return entities;
}

function mapRefTypeToEntityType(refType: RefInput['type']): EntityDefinition['entity_type'] {
  switch (refType) {
    case 'character': return 'character';
    case 'vehicle': return 'vehicle';
    case 'product':
    case 'prop': return 'prop';
    case 'location': return 'architecture';
    default: return 'prop';
  }
}

function getDefaultPosition(entityType: EntityDefinition['entity_type'], index: number): { x: number; y: number; z: number } {
  // Spread entities across the scene
  const xOffset = (index % 2 === 0) ? -2 : 2;

  switch (entityType) {
    case 'character':
      return { x: xOffset, y: 0, z: 0 };
    case 'vehicle':
      return { x: 0, y: 0, z: 5 };
    case 'prop':
      return { x: 0, y: 1, z: 1 };
    default:
      return { x: 0, y: 0, z: 0 };
  }
}

// ============================================
// LIGHTING DETECTION
// ============================================

function detectLighting(concept: string, envType: string): {
  direction: string;
  temp: string;
  fill: string;
  colorGrade: string;
} {
  // Time of day detection
  if (concept.includes('sunset') || concept.includes('golden hour')) {
    return {
      direction: 'from upper-left at 15 degrees above horizon',
      temp: '3200K warm orange',
      fill: 'soft blue ambient from right',
      colorGrade: 'warm golden with blue shadows'
    };
  }
  if (concept.includes('night') || concept.includes('dark')) {
    return {
      direction: 'from above-right, artificial light',
      temp: '5600K neutral',
      fill: 'minimal ambient',
      colorGrade: 'high contrast, deep shadows'
    };
  }
  if (concept.includes('overcast') || concept.includes('cloudy')) {
    return {
      direction: 'diffused from above',
      temp: '6500K cool daylight',
      fill: 'soft ambient all around',
      colorGrade: 'muted, desaturated'
    };
  }

  // Environment-based defaults
  switch (envType) {
    case 'urban_interior':
      return {
        direction: 'from window stage-left',
        temp: '5000K neutral-warm',
        fill: 'soft practical lights',
        colorGrade: 'natural indoor'
      };
    case 'vehicle_interior':
      return {
        direction: 'from windshield/windows',
        temp: '5600K daylight',
        fill: 'dashboard glow',
        colorGrade: 'contrasty, focused'
      };
    case 'sci_fi':
      return {
        direction: 'from multiple practical sources',
        temp: '6500K cool blue',
        fill: 'neon accents',
        colorGrade: 'cyan/magenta split toning'
      };
    default:
      return {
        direction: 'from upper-left at 45 degrees',
        temp: '5600K daylight',
        fill: 'soft bounce from ground',
        colorGrade: 'natural cinematic'
      };
  }
}

// ============================================
// ATMOSPHERICS DETECTION
// ============================================

function detectAtmospherics(concept: string, envType: string): {
  smoke: 'none' | 'light' | 'medium' | 'heavy';
  dust: 'none' | 'light' | 'medium' | 'heavy';
  haze: 'none' | 'light' | 'medium' | 'heavy';
} {
  let smoke: 'none' | 'light' | 'medium' | 'heavy' = 'none';
  let dust: 'none' | 'light' | 'medium' | 'heavy' = 'none';
  let haze: 'none' | 'light' | 'medium' | 'heavy' = 'none';

  // Smoke detection
  if (concept.includes('fire') || concept.includes('explosion') || concept.includes('burning')) {
    smoke = 'heavy';
  } else if (concept.includes('smoke') || concept.includes('steam')) {
    smoke = 'medium';
  }

  // Dust detection
  if (concept.includes('desert') || concept.includes('construction') || concept.includes('rubble')) {
    dust = 'medium';
  } else if (concept.includes('dusty') || concept.includes('old')) {
    dust = 'light';
  }

  // Haze detection
  if (concept.includes('fog') || concept.includes('mist')) {
    haze = 'heavy';
  } else if (concept.includes('morning') || concept.includes('atmospheric')) {
    haze = 'light';
  }

  // Environment defaults
  if (envType === 'industrial') {
    smoke = smoke === 'none' ? 'light' : smoke;
  }

  return { smoke, dust, haze };
}

// ============================================
// SCALE ANCHORS
// ============================================

function generateScaleAnchors(envType: string, concept: string): ScaleAnchor[] {
  const anchors: ScaleAnchor[] = [];

  // Universal human-scale anchors
  anchors.push({
    anchor_name: 'human_height',
    real_world_reference: 'Average adult human standing',
    approx_size_m: 1.75
  });

  // Environment-specific anchors
  switch (envType) {
    case 'urban_exterior':
      anchors.push(
        { anchor_name: 'door_frame', real_world_reference: 'Standard door', approx_size_m: 2.1 },
        { anchor_name: 'building_floor', real_world_reference: 'Single building floor', approx_size_m: 3.5 },
        { anchor_name: 'car_height', real_world_reference: 'Sedan roof height', approx_size_m: 1.5 }
      );
      break;
    case 'urban_interior':
      anchors.push(
        { anchor_name: 'door_frame', real_world_reference: 'Interior door', approx_size_m: 2.0 },
        { anchor_name: 'desk_height', real_world_reference: 'Office desk', approx_size_m: 0.75 },
        { anchor_name: 'ceiling_height', real_world_reference: 'Standard ceiling', approx_size_m: 2.7 }
      );
      break;
    case 'vehicle_interior':
      anchors.push(
        { anchor_name: 'seat_height', real_world_reference: 'Car seat from floor', approx_size_m: 0.4 },
        { anchor_name: 'steering_wheel', real_world_reference: 'Steering wheel diameter', approx_size_m: 0.38 },
        { anchor_name: 'headrest', real_world_reference: 'Headrest to seat', approx_size_m: 0.6 }
      );
      break;
    default:
      anchors.push(
        { anchor_name: 'arm_length', real_world_reference: 'Human arm span', approx_size_m: 0.6 },
        { anchor_name: 'hand_span', real_world_reference: 'Human hand', approx_size_m: 0.2 }
      );
  }

  return anchors;
}

// ============================================
// POSITIONING
// ============================================

function detectPositioning(concept: string): {
  heroSide: 'LEFT' | 'RIGHT' | 'CENTER';
  villainSide: 'LEFT' | 'RIGHT' | 'CENTER';
} {
  // Default cinematic convention: hero stage left, villain stage right
  // This respects the 180-degree rule for dialogue scenes

  if (concept.includes('chase') || concept.includes('pursuit')) {
    // In chases, pursuer (villain) is behind (screen right in L-to-R motion)
    return { heroSide: 'LEFT', villainSide: 'RIGHT' };
  }

  if (concept.includes('confrontation') || concept.includes('face off') || concept.includes('standoff')) {
    // Face-to-face: split left/right
    return { heroSide: 'LEFT', villainSide: 'RIGHT' };
  }

  // Single character: center
  if (!concept.includes('vs') && !concept.includes('versus') && !concept.includes('against')) {
    return { heroSide: 'CENTER', villainSide: 'CENTER' };
  }

  return { heroSide: 'LEFT', villainSide: 'RIGHT' };
}

// ============================================
// CAMERA RIGS
// ============================================

function buildCameraRigs(analysis: ConceptAnalysis): CameraRigDefinition[] {
  const rigs: CameraRigDefinition[] = [];

  // Always include standard rigs
  for (const [rigId, rig] of Object.entries(STANDARD_RIGS)) {
    rigs.push({
      rig_id: rigId,
      camera_position: rig.position,
      look_at: rig.lookAt,
      default_lens_mm: rig.lens.focalLength,
      allowed_lenses_mm: [24, 35, 50, 85],
      camera_motion_allowed: false,
      allowed_camera_motions: ['static', 'slow_push_in', 'slow_orbit'],
      notes: rig.name
    });
  }

  // Add environment-specific rigs
  if (analysis.environmentType === 'vehicle_interior') {
    rigs.push({
      rig_id: 'COCKPIT_WIDE',
      camera_position: { x: 0, y: 1.2, z: -0.5 },
      look_at: { x: 0, y: 1.2, z: 5 },
      default_lens_mm: 24,
      allowed_lenses_mm: [18, 24, 35],
      camera_motion_allowed: false,
      allowed_camera_motions: ['static'],
      notes: 'Wide cockpit view showing both occupants and windshield'
    });
    rigs.push({
      rig_id: 'DRIVER_CU',
      camera_position: { x: 0.5, y: 1.2, z: 0 },
      look_at: { x: -0.3, y: 1.2, z: 0 },
      default_lens_mm: 50,
      allowed_lenses_mm: [35, 50, 85],
      camera_motion_allowed: false,
      allowed_camera_motions: ['static'],
      notes: 'Driver close-up from passenger side'
    });
  }

  return rigs;
}

// ============================================
// CUSTOM RIG DETECTION
// ============================================

function detectCustomRigNeeds(concept: string, envType: string): {
  needed: boolean;
  suggestions: string[];
} {
  const suggestions: string[] = [];

  if (envType === 'vehicle_interior') {
    suggestions.push('COCKPIT_WIDE', 'DRIVER_CU', 'PASSENGER_CU', 'WINDSHIELD_POV');
  }

  if (concept.includes('chase') || concept.includes('pursuit')) {
    suggestions.push('TRACKING_SIDE', 'AERIAL_FOLLOW', 'GROUND_LEVEL_SPEED');
  }

  if (concept.includes('fight') || concept.includes('action')) {
    suggestions.push('HANDHELD_CLOSE', 'WHIP_PAN_READY', 'IMPACT_LOW');
  }

  return {
    needed: suggestions.length > 0,
    suggestions
  };
}

// ============================================
// LANDMARKS
// ============================================

function extractLandmarks(concept: string, envType: string): string[] {
  const landmarks: string[] = [];

  // Environment-based defaults
  switch (envType) {
    case 'urban_exterior':
      landmarks.push('main_street', 'building_A', 'building_B', 'sky_backdrop');
      break;
    case 'urban_interior':
      landmarks.push('entry_door', 'main_window', 'back_wall');
      break;
    case 'vehicle_interior':
      landmarks.push('windshield', 'dashboard', 'driver_seat', 'passenger_seat');
      break;
    default:
      landmarks.push('ground_plane', 'horizon_line', 'sky');
  }

  return landmarks;
}

// ============================================
// ENVIRONMENT DESCRIPTION
// ============================================

function generateEnvironmentDescription(concept: string, envType: string): string {
  // Generate a stable environment description for prompts
  const baseDescriptions: Record<string, string> = {
    'urban_exterior': 'Urban cityscape with buildings, streets, and urban infrastructure',
    'urban_interior': 'Interior space with walls, windows, and indoor elements',
    'nature_exterior': 'Natural outdoor environment with terrain and vegetation',
    'industrial': 'Industrial setting with machinery and utilitarian structures',
    'vehicle_interior': 'Vehicle interior with seats, controls, and windows',
    'vehicle_exterior': 'Exterior vehicle scene with motion and environment',
    'fantasy': 'Fantasy environment with magical or medieval elements',
    'sci_fi': 'Science fiction setting with futuristic technology',
    'domestic': 'Domestic interior with home furnishings and decor',
    'generic': 'Neutral environment'
  };

  return baseDescriptions[envType] || baseDescriptions['generic'];
}

// ============================================
// BASE WORLD PROMPT
// ============================================

function buildBaseWorldPrompt(analysis: ConceptAnalysis): string {
  const parts: string[] = [];

  // Environment description
  parts.push(analysis.environmentDescription);

  // Lighting
  parts.push(`Lighting: ${analysis.lightingDirection}`);
  parts.push(`Color temperature: ${analysis.lightingTemp}`);

  // Atmospherics (if any)
  if (analysis.atmospherics.smoke !== 'none') {
    parts.push(`${analysis.atmospherics.smoke} smoke in the air`);
  }
  if (analysis.atmospherics.dust !== 'none') {
    parts.push(`${analysis.atmospherics.dust} dust particles visible`);
  }
  if (analysis.atmospherics.haze !== 'none') {
    parts.push(`${analysis.atmospherics.haze} atmospheric haze`);
  }

  // Empty scene directive
  parts.push('EMPTY SCENE - NO CHARACTERS');
  parts.push('Establishing environment only');

  // Technical suffix
  parts.push('Ultra-detailed cinematic render, soft lighting, clean depth of field');

  return parts.join('. ');
}

// ============================================
// EXPORTS
// ============================================

export default worldEngineerAgent;

// Export helper functions for external use
export {
  analyzeConceptForWorld,
  buildCameraRigs,
  generateScaleAnchors,
  buildBaseWorldPrompt
};
