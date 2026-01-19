/**
 * AUDIO PLANNER AGENT - Voice Over & Dialogue Timing
 *
 * This agent runs AFTER Shot Compiler but BEFORE Producer.
 * It takes the Story Analyst's audio_narrative_plan and creates:
 *
 * 1. VOICEOVER SEGMENTS - Exact timing, text, voice style
 * 2. DIALOGUE MAPPING - Which shots need dialogue, what model to use
 * 3. MUSIC CUES - Where music changes, transitions
 * 4. SOUND DESIGN - Key sound effects by shot
 * 5. RENDER TIMELINE - Final audio/video sync instructions
 *
 * Output feeds into Producer for asset dependency planning.
 */

import type { ShotCard } from './specTypes';
import type { StoryAnalysisOutput } from './storyAnalystAgent';
import type { DirectorOutput } from './directorAgent';

// ============================================
// TYPES
// ============================================

export type VoiceStyle = 'narrator' | 'character' | 'documentary' | 'commercial' | 'dramatic';
export type AudioAssetType = 'voiceover' | 'dialogue' | 'music' | 'sfx';

// ============================================
// CHARACTER VOICE SETTINGS
// ============================================
//
// Each character can have saved voice settings:
// - elevenlabs_voice_id: Pre-made ElevenLabs voice (default TTS)
// - minimax_clone_id: Cloned voice for celebrity/real person
//
// FUTURE: Add YouTube search + extract voice feature
// - User provides celebrity name
// - We search YouTube for clean audio sample
// - Extract and clone via Minimax
//

export type VoiceProvider = 'elevenlabs' | 'minimax_clone';

export interface CharacterVoiceSettings {
  character_id: string;
  character_name: string;

  // Which provider to use
  provider: VoiceProvider;

  // ElevenLabs voice ID (pre-made voices)
  // See: https://elevenlabs.io/docs/voices
  elevenlabs_voice_id?: string;

  // Minimax clone ID (for celebrity/real person)
  // Created via FAL_ENDPOINTS.VOICE_CLONE
  minimax_clone_id?: string;

  // Voice characteristics (for UI/reference)
  voice_description?: string;
  voice_gender?: 'male' | 'female' | 'neutral';
  voice_age?: 'child' | 'young' | 'adult' | 'elderly';
  voice_accent?: string;

  // If this is a celebrity clone
  is_celebrity_clone?: boolean;
  celebrity_name?: string;

  // Source audio URL (if we have it)
  // FUTURE: This will be auto-extracted from YouTube
  source_audio_url?: string;
}

// In-memory registry of character voices
// In production, this would be stored in a database
export const characterVoiceRegistry: Map<string, CharacterVoiceSettings> = new Map();

/**
 * Register a character's voice settings
 */
export function registerCharacterVoice(settings: CharacterVoiceSettings): void {
  characterVoiceRegistry.set(settings.character_id, settings);
  console.log(`[VoiceRegistry] Registered voice for ${settings.character_name}: ${settings.provider}`);
}

/**
 * Get a character's voice settings
 */
export function getCharacterVoice(characterId: string): CharacterVoiceSettings | undefined {
  return characterVoiceRegistry.get(characterId);
}

/**
 * Get voice settings by character name (fuzzy match)
 */
export function findCharacterVoiceByName(name: string): CharacterVoiceSettings | undefined {
  const nameLower = name.toLowerCase();
  for (const [_, settings] of characterVoiceRegistry) {
    if (settings.character_name.toLowerCase() === nameLower) {
      return settings;
    }
  }
  return undefined;
}

/**
 * Get the appropriate voice ID for a character
 * Returns { provider, voice_id } or undefined if no voice registered
 */
export function getVoiceIdForCharacter(characterId: string): {
  provider: VoiceProvider;
  voice_id: string;
  is_clone: boolean;
} | undefined {
  const settings = characterVoiceRegistry.get(characterId);
  if (!settings) return undefined;

  if (settings.provider === 'minimax_clone' && settings.minimax_clone_id) {
    return {
      provider: 'minimax_clone',
      voice_id: settings.minimax_clone_id,
      is_clone: true
    };
  }

  if (settings.elevenlabs_voice_id) {
    return {
      provider: 'elevenlabs',
      voice_id: settings.elevenlabs_voice_id,
      is_clone: false
    };
  }

  return undefined;
}

/**
 * List all registered character voices
 */
export function listCharacterVoices(): CharacterVoiceSettings[] {
  return Array.from(characterVoiceRegistry.values());
}

/**
 * Clear all registered voices (for testing)
 */
export function clearVoiceRegistry(): void {
  characterVoiceRegistry.clear();
}

// ============================================
// PRESET ELEVENLABS VOICES
// ============================================
// Common ElevenLabs voice IDs for quick setup

export const ELEVENLABS_PRESETS = {
  // Male voices
  ADAM: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Adam', gender: 'male', style: 'deep, narrative' },
  ANTONI: { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male', style: 'warm, friendly' },
  ARNOLD: { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'male', style: 'crisp, authoritative' },
  JOSH: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male', style: 'young, energetic' },
  SAM: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', gender: 'male', style: 'raspy, dynamic' },

  // Female voices
  BELLA: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female', style: 'soft, expressive' },
  ELLI: { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', gender: 'female', style: 'young, emotional' },
  RACHEL: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', style: 'calm, conversational' },
  DOMI: { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'female', style: 'strong, clear' },

  // Narrator voices
  NARRATOR_DEEP: { id: '29vD33N1CtxCmqQRPOHJ', name: 'Drew', gender: 'male', style: 'deep narrator' },
  NARRATOR_WARM: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Clyde', gender: 'male', style: 'warm narrator' },
} as const;

// ============================================
// FAL.AI AUDIO/VIDEO ENDPOINTS
// ============================================
//
// VOICE GENERATION STRATEGY:
// - ElevenLabs (TTS_NARRATION): Default for all normal TTS - narration, dialogue, voiceover
// - Minimax (VOICE_CLONE + TTS_CLONED): Only for CELEBRITY/REAL PERSON voice clones
//
// AVATAR/LIP SYNC:
// - VEED/Fabric: For on-camera dialogue where face is visible (turns photo into talking avatar)
// - ElevenLabs: For off-camera dialogue, POV, inner thoughts (no lip sync needed)
//

export const FAL_ENDPOINTS = {
  // Image editing - multi-angle from refs
  IMAGE_EDIT: 'fal-ai/nano-banana-pro/edit',

  // Voice cloning - create custom voice from sample (CELEBRITY/REAL PERSON only)
  VOICE_CLONE: 'fal-ai/minimax/voice-clone',

  // TTS with cloned voice (use AFTER creating clone via VOICE_CLONE)
  TTS_CLONED: 'fal-ai/minimax/speech-02-hd',

  // Photo + Audio → Talking avatar (ON-CAMERA lip sync)
  AVATAR_LIPSYNC: 'veed/fabric-1.0',

  // TTS for narration/off-camera - DEFAULT for all normal voice generation
  TTS_NARRATION: 'fal-ai/elevenlabs/text-to-dialogue/eleven-v3',

  // Transcription
  TRANSCRIBE: 'fal-ai/eleven',

  // ============================================
  // SORA 2 - Multi-shot from single ref
  // ============================================
  // Use for: Multiple camera angles from ONE ref image
  // NOT for: Audio (mute and use your own pipeline)
  SORA_IMAGE_TO_VIDEO: 'fal-ai/sora-2/image-to-video/pro',
  SORA_TEXT_TO_VIDEO: 'fal-ai/sora-2/text-to-video/pro',
  SORA_REMIX: 'fal-ai/sora-2/video-to-video/remix'
} as const;

// ============================================
// SORA 2 MULTI-SHOT GENERATOR
// ============================================
// Takes a ref image and generates multiple camera angles/shots
// Output: Video with cuts (MUTE AUDIO - use your own pipeline)
//
// ⚠️  USE CASE: B-ROLL / FILLER ONLY (for now)
// ============================================
//
// GOOD FOR:
// - Helicopter flying (generic atmosphere)
// - Vehicle/environment coverage
// - Multi-angle filler shots
// - Mood/atmosphere footage
// - Non-critical transitions
//
// NOT FOR:
// - Story-critical shots
// - Character dialogue/action
// - "Flying TO location" (story beat)
// - Anything needing precise continuity
// - Plot moments
//
// PHILOSOPHY:
// 1. Test with small non-critical shots first
// 2. See how ref consistency holds up
// 3. If quality proves good → expand usage
// 4. Never replace main pipeline for story shots
//

export type SoraShotType = 'wide' | 'medium' | 'close-up' | 'extreme-close-up' | 'over-shoulder' | 'low-angle' | 'high-angle' | 'dutch' | 'pov';
export type SoraCameraMove = 'static' | 'dolly-in' | 'dolly-out' | 'pan-left' | 'pan-right' | 'tilt-up' | 'tilt-down' | 'orbit' | 'tracking' | 'crane-up' | 'crane-down' | 'handheld';
export type SoraDuration = 4 | 8 | 12;
export type SoraResolution = '720p' | '1080p';

export interface SoraShotDefinition {
  duration_seconds: 4;  // Each shot segment (Sora uses 4s chunks)
  shot_type: SoraShotType;
  camera_movement: SoraCameraMove;
  description?: string;  // Optional extra details
}

// What's in the reference image - CRITICAL for shot rules
export type SoraRefType =
  | 'location_only'      // Just environment (helicopter INT) - NO characters allowed in shots
  | 'character_only'     // Just character - location may drift
  | 'character_in_location'  // Character + environment - character CAN interact
  | 'collage';           // Multiple refs combined into one image

// What's included in a collage ref
export interface SoraCollageContents {
  has_character: boolean;
  has_location: boolean;
  has_multiple_angles: boolean;  // Same subject from different angles
  description: string;  // e.g., "Left: character front view. Right: helicopter cockpit interior"
}

export interface SoraMultiShotInput {
  ref_image_url: string;
  shots: SoraShotDefinition[];  // 1-3 shots (4s each = max 12s)
  aspect_ratio?: '16:9' | '9:16';
  resolution?: SoraResolution;
  style_hint?: string;  // e.g., "cinematic", "documentary", "dramatic"

  // CRITICAL: What's in the ref image?
  // This determines what can appear in the generated shots
  ref_type: SoraRefType;

  // If ref_type is 'collage', describe what's in it
  collage_contents?: SoraCollageContents;
}

// ============================================
// SORA REF RULES - READ THIS
// ============================================
//
// Sora image-to-video takes ONLY ONE image. What's in that image
// determines what can appear in the generated video:
//
// REF TYPE              | WHAT CAN APPEAR IN SHOTS
// ----------------------|------------------------------------------
// location_only         | Environment only. NO characters.
//                       | (Sora doesn't know what they look like)
//                       | Example: Helicopter INT startup sequence
//
// character_only        | Character can appear, but location may
//                       | drift/change between shots.
//                       | Example: Character close-ups, reactions
//
// character_in_location | Character CAN interact with environment.
//                       | Best for: Character enters helicopter,
//                       | sits down, looks around, etc.
//
// RULE: If you need character + specific location, the ref image
//       MUST show both together. You cannot "add" a character
//       to a location-only ref.
//
// ============================================
// COLLAGE TECHNIQUE - MULTIPLE REFS IN ONE
// ============================================
//
// To include multiple refs (character + location, multiple angles):
// 1. Create a COLLAGE combining all refs into ONE image
// 2. Send collage as the single ref
// 3. Sora will see and respect ALL elements in the collage
//
// COLLAGE LAYOUTS:
// - Side by side: [Character | Location]
// - Grid: 2x2 with character angles + location
// - Top/bottom: Character on top, location below
//
// The model extracts visual info from ALL parts of the collage
// and maintains consistency across the generated video.
//

export interface SoraMultiShotOutput {
  video_url: string;
  duration_seconds: number;
  shots_generated: number;
  prompt_used: string;
  // IMPORTANT: Audio is auto-generated by Sora - MUTE IT
  audio_warning: 'MUTE_AND_REPLACE_WITH_YOUR_AUDIO';
}

/**
 * Build camera movement phrase for Sora prompt
 */
function buildCameraPhrase(move: SoraCameraMove): string {
  const phrases: Record<SoraCameraMove, string> = {
    'static': 'static camera, locked off',
    'dolly-in': 'slow dolly-in toward subject',
    'dolly-out': 'slow dolly-out, pulling back',
    'pan-left': 'gentle pan left',
    'pan-right': 'gentle pan right',
    'tilt-up': 'slow tilt upward',
    'tilt-down': 'slow tilt downward',
    'orbit': 'camera slowly orbits around subject',
    'tracking': 'tracking shot following subject',
    'crane-up': 'crane shot rising upward',
    'crane-down': 'crane shot descending',
    'handheld': 'handheld camera, slight natural movement'
  };
  return phrases[move] || 'static camera';
}

/**
 * Build shot type phrase for Sora prompt
 */
function buildShotPhrase(type: SoraShotType): string {
  const phrases: Record<SoraShotType, string> = {
    'wide': 'wide establishing shot',
    'medium': 'medium shot',
    'close-up': 'close-up, shallow depth of field',
    'extreme-close-up': 'extreme close-up, very shallow DOF',
    'over-shoulder': 'over-the-shoulder shot',
    'low-angle': 'low angle looking up',
    'high-angle': 'high angle looking down',
    'dutch': 'dutch angle, tilted frame',
    'pov': 'POV shot, first-person perspective'
  };
  return phrases[type] || 'medium shot';
}

/**
 * Build the Sora prompt for multi-shot generation
 *
 * IMPORTANT: These shots are SILENT - no talking, no dialogue, no speech.
 * Voiceover/audio is added separately via our own pipeline (ElevenLabs etc).
 *
 * REF TYPE RULES:
 * - location_only: NO people/characters in shots
 * - character_only: Character can appear, location may vary
 * - character_in_location: Character can interact with environment
 */
export function buildSoraMultiShotPrompt(input: SoraMultiShotInput): string {
  const shots = input.shots.slice(0, 3);  // Max 3 shots (12 seconds)

  let prompt = '';

  // CRITICAL: No talking in video - we add voiceover separately
  prompt += 'IMPORTANT: No dialogue, no speech, no talking, no lip movement. Silent scene only.\n\n';

  // REF TYPE RULES - what can appear based on ref image content
  if (input.ref_type === 'location_only') {
    prompt += 'RULE: No people or characters in any shot. Environment/location only.\n';
    prompt += 'Show only the space, objects, and ambient movement (lights, instruments, etc).\n\n';
  } else if (input.ref_type === 'character_only') {
    prompt += 'Focus on the character. Background/location may vary between shots.\n\n';
  } else if (input.ref_type === 'character_in_location') {
    prompt += 'Character interacts with environment. Maintain both character and location consistency.\n\n';
  } else if (input.ref_type === 'collage' && input.collage_contents) {
    // Collage - describe what's in it so Sora understands
    prompt += 'Reference image is a collage containing multiple views:\n';
    prompt += `${input.collage_contents.description}\n`;
    prompt += 'Use ALL elements from the collage to maintain consistency.\n';

    if (input.collage_contents.has_character && input.collage_contents.has_location) {
      prompt += 'Character can interact with the environment shown.\n';
    } else if (!input.collage_contents.has_character) {
      prompt += 'No characters - environment/objects only.\n';
    }

    if (input.collage_contents.has_multiple_angles) {
      prompt += 'Multiple angles shown - maintain exact appearance from all views.\n';
    }
    prompt += '\n';
  }

  // Add style hint if provided
  if (input.style_hint) {
    prompt += `Style: ${input.style_hint}\n\n`;
  }

  // Add each shot
  shots.forEach((shot, i) => {
    const startTime = i * 4;
    const endTime = startTime + 4;
    const shotPhrase = buildShotPhrase(shot.shot_type);
    const cameraPhrase = buildCameraPhrase(shot.camera_movement);

    prompt += `Shot ${i + 1} (${startTime}-${endTime}s): ${shotPhrase}, ${cameraPhrase}`;
    if (shot.description) {
      prompt += `, ${shot.description}`;
    }

    // Reinforce no-character rule for location_only
    if (input.ref_type === 'location_only') {
      prompt += ' (no people visible)';
    }

    prompt += '\n';
  });

  // Final instructions
  prompt += '\nMaintain consistent lighting across all shots.';

  if (input.ref_type === 'location_only') {
    prompt += '\nNo humans, no characters, no people in frame. Empty environment only.';
  } else {
    prompt += '\nCharacters do not speak or move lips.';
  }

  prompt += '\nAmbient sound only.';

  return prompt.trim();
}

/**
 * Validate shot definitions against ref type
 * Returns warnings if shots might not work with given ref type
 */
export function validateSoraShotsForRefType(
  shots: SoraShotDefinition[],
  refType: SoraRefType
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (refType === 'location_only') {
    // Check for shot types that typically feature characters
    const characterShots = shots.filter(s =>
      s.shot_type === 'close-up' ||
      s.shot_type === 'extreme-close-up' ||
      s.shot_type === 'over-shoulder'
    );

    if (characterShots.length > 0) {
      warnings.push(
        `Warning: ${characterShots.length} shot(s) use character-focused framing (close-up, OTS) ` +
        `but ref_type is 'location_only'. These will show environment details instead of characters.`
      );
    }

    // Check descriptions for character mentions
    shots.forEach((shot, i) => {
      if (shot.description?.toLowerCase().match(/character|person|people|human|pilot|passenger/)) {
        warnings.push(
          `Warning: Shot ${i + 1} description mentions characters but ref_type is 'location_only'. ` +
          `Remove character references or use a different ref that includes the character.`
        );
      }
    });
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

/**
 * Generate API request body for Sora image-to-video
 */
export function buildSoraRequest(input: SoraMultiShotInput): {
  endpoint: string;
  body: Record<string, any>;
  prompt: string;
} {
  const prompt = buildSoraMultiShotPrompt(input);
  const totalDuration = Math.min(input.shots.length * 4, 12) as SoraDuration;

  return {
    endpoint: FAL_ENDPOINTS.SORA_IMAGE_TO_VIDEO,
    body: {
      image_url: input.ref_image_url,
      prompt: prompt,
      duration: String(totalDuration),
      resolution: input.resolution || '720p',
      aspect_ratio: input.aspect_ratio || '16:9'
    },
    prompt: prompt
  };
}

/**
 * Quick presets for common multi-shot patterns
 */
export const SORA_SHOT_PRESETS = {
  // ============================================
  // LOCATION-ONLY PRESETS (no characters)
  // ============================================

  // Vehicle/cockpit interior startup sequence
  VEHICLE_INT_STARTUP: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'static' as const, description: 'full interior view, instruments powering on' },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'pan-right' as const, description: 'control panel details, lights flickering' },
    { duration_seconds: 4 as const, shot_type: 'low-angle' as const, camera_movement: 'tilt-up' as const, description: 'looking up at overhead switches and displays' }
  ],

  // Room/environment exploration
  ENVIRONMENT_EXPLORE: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'dolly-in' as const, description: 'establishing the space' },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'pan-left' as const, description: 'revealing details' },
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'crane-up' as const, description: 'pulling back to show full environment' }
  ],

  // Machinery/tech detail shots
  TECH_DETAILS: [
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'tracking' as const, description: 'moving along equipment' },
    { duration_seconds: 4 as const, shot_type: 'low-angle' as const, camera_movement: 'static' as const, description: 'dramatic angle on machinery' },
    { duration_seconds: 4 as const, shot_type: 'high-angle' as const, camera_movement: 'crane-down' as const, description: 'descending overview' }
  ],

  // ============================================
  // B-ROLL / FILLER PRESETS (primary use case)
  // ============================================

  // Vehicle in motion (helicopter, car, boat, etc)
  VEHICLE_FLYING: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'tracking' as const, description: 'vehicle moving through space' },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'pan-right' as const, description: 'following the vehicle' },
    { duration_seconds: 4 as const, shot_type: 'low-angle' as const, camera_movement: 'static' as const, description: 'vehicle passes overhead' }
  ],

  // Exterior establishing / atmosphere
  ATMOSPHERE_EXT: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'static' as const, description: 'wide establishing' },
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'pan-left' as const, description: 'slow pan across scene' },
    { duration_seconds: 4 as const, shot_type: 'high-angle' as const, camera_movement: 'crane-down' as const, description: 'descending into scene' }
  ],

  // Interior atmosphere / mood
  ATMOSPHERE_INT: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'dolly-in' as const, description: 'entering the space' },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'pan-right' as const, description: 'scanning the room' },
    { duration_seconds: 4 as const, shot_type: 'low-angle' as const, camera_movement: 'tilt-up' as const, description: 'looking up at details' }
  ],

  // Quick transition filler (8 seconds)
  TRANSITION_FILLER: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'static' as const, description: 'scene establishing' },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'dolly-in' as const, description: 'moving closer' }
  ],

  // ============================================
  // CHARACTER PRESETS (requires character in ref)
  // ============================================

  // Wide → Medium → Close (classic coverage)
  COVERAGE_STANDARD: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'dolly-in' as const },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'handheld' as const },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'static' as const }
  ],

  // Orbit around subject (product/hero shot)
  ORBIT_HERO: [
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'orbit' as const },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'orbit' as const },
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'dolly-out' as const }
  ],

  // Dramatic reveal (low to high)
  DRAMATIC_REVEAL: [
    { duration_seconds: 4 as const, shot_type: 'low-angle' as const, camera_movement: 'crane-up' as const },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'static' as const },
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'dolly-out' as const }
  ],

  // Documentary style (needs character)
  DOCUMENTARY: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'handheld' as const },
    { duration_seconds: 4 as const, shot_type: 'over-shoulder' as const, camera_movement: 'handheld' as const },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'handheld' as const }
  ],

  // Quick 2-shot (8 seconds)
  QUICK_TWO_SHOT: [
    { duration_seconds: 4 as const, shot_type: 'wide' as const, camera_movement: 'static' as const },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'dolly-in' as const }
  ],

  // ============================================
  // HYPER-KINETIC B-ROLL (TESTED - HIGH QUALITY)
  // ============================================
  // Based on real testing: Close-ups and macro shots work BEST
  // 12 seconds = 5 shots is the optimal quality/length balance
  // Use "Fast cut" / "Quick cut" / "Rapid cut" prompt pattern
  //
  // INPUT: Photo becomes START FRAME - ensure it's what you want to show
  // or be ready to vision-check and trim first 1-2 seconds if static
  //
  // ⚠️ QUALITY NOTES:
  // - Close-ups / Macro = BEST quality
  // - Wide shots = WORST quality ("looks ass")
  // - Focal length changes = VERY GOOD
  // - Pacing / visual timing = VERY GOOD

  // Military/Tech cockpit startup (TESTED - WORKS EXCELLENT)
  COCKPIT_STARTUP_HYPER: [
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'dolly-in' as const, description: 'cyclic control stick gripped, hand tensing' },
    { duration_seconds: 4 as const, shot_type: 'extreme-close-up' as const, camera_movement: 'static' as const, description: 'ammunition counter display, SAFE to ARMED' },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'handheld' as const, description: 'hand slamming master arm switch' }
  ],

  // Tactical display sequence (TESTED)
  TACTICAL_DISPLAY_HYPER: [
    { duration_seconds: 4 as const, shot_type: 'extreme-close-up' as const, camera_movement: 'static' as const, description: 'finger tapping tactical display screen' },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'pan-right' as const, description: 'hand flipping toggle switches' },
    { duration_seconds: 4 as const, shot_type: 'extreme-close-up' as const, camera_movement: 'dolly-in' as const, description: 'buttons being pressed rapidly' }
  ],

  // Hands-on-controls sequence (TESTED)
  HANDS_CONTROLS_HYPER: [
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'tracking' as const, description: 'hands moving across control panel' },
    { duration_seconds: 4 as const, shot_type: 'extreme-close-up' as const, camera_movement: 'handheld' as const, description: 'fingers on buttons and switches' },
    { duration_seconds: 4 as const, shot_type: 'medium' as const, camera_movement: 'dolly-out' as const, description: 'wider view showing full console with hands' }
  ],

  // Generic hyper-kinetic B-roll (works for any subject)
  HYPER_KINETIC_CLOSEUPS: [
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'dolly-in' as const, description: 'fast cut to detail' },
    { duration_seconds: 4 as const, shot_type: 'extreme-close-up' as const, camera_movement: 'handheld' as const, description: 'macro detail shot' },
    { duration_seconds: 4 as const, shot_type: 'close-up' as const, camera_movement: 'tracking' as const, description: 'following motion' }
  ]
} as const;

// ============================================
// SORA 2 TESTED QUALITY RULES (January 2026)
// ============================================
// These rules are based on REAL TESTING results:
//
// SHOT TYPE QUALITY RANKING:
// 1. Extreme close-up / Macro  = ⭐⭐⭐⭐⭐ BEST
// 2. Close-up                  = ⭐⭐⭐⭐⭐ EXCELLENT
// 3. Medium (with action)      = ⭐⭐⭐   GOOD
// 4. Wide shots                = ⭐      POOR ("looks ass")
//
// OPTIMAL SETTINGS:
// - Duration: 12 seconds = 5 shots (best quality balance)
// - Storyboards: 2x2 grids work as input!
// - Start Frame: Input photo = first frame of video
//
// CAMERA MOVES THAT WORK WELL:
// - Snap zoom, rapid zoom in
// - Whip pan transitions
// - Dolly in/out
// - Handheld for tension
//
// PROMPT PATTERN (TESTED):
// "[SETUP] shot from [POV], rapid fast cuts:
//  Fast cut - [close-up description]
//  Quick cut - [detail description]
//  Rapid cut - [action description]
//  Final cut - [payoff shot]
//  Hyper-kinetic editing, 0.5-1 second per shot,
//  [lighting], [textures], shallow depth of field"
//
// START FRAME RULE:
// The input photo becomes frame 1 of the video.
// - If photo is what you want shown: GOOD
// - If photo is just a ref: Use vision to check first 1-2s and trim
//
export const SORA_QUALITY_RULES = {
  BEST_SHOT_TYPES: ['extreme-close-up', 'close-up'],
  GOOD_SHOT_TYPES: ['medium', 'over-shoulder'],
  AVOID_SHOT_TYPES: ['wide'],  // Quality suffers

  OPTIMAL_DURATION_SECONDS: 12,
  OPTIMAL_SHOT_COUNT: 5,

  // For hyper-kinetic editing, each cut should be:
  CUT_DURATION_RANGE: { min: 0.5, max: 1.0 },

  // Input can be storyboard grid
  ACCEPTS_STORYBOARD_INPUT: true,
  STORYBOARD_FORMATS: ['2x2', '3x3'],

  // First frame rule
  INPUT_IS_START_FRAME: true,
  VISION_CHECK_RECOMMENDED: true,  // Check first 1-2 seconds
} as const;

/**
 * Build a hyper-kinetic Sora prompt using the TESTED pattern
 * This is the prompt format that works best for fast B-roll
 */
export function buildHyperKineticSoraPrompt(
  scene_description: string,
  pov: string,
  shots: Array<{ cut_type: 'Fast cut' | 'Quick cut' | 'Rapid cut' | 'Final cut'; description: string }>,
  style?: {
    lighting?: string;
    textures?: string;
    additional?: string;
  }
): string {
  let prompt = `${scene_description} shot from ${pov}, rapid fast cuts:\n\n`;

  for (const shot of shots) {
    prompt += `${shot.cut_type} - ${shot.description}\n\n`;
  }

  prompt += `Hyper-kinetic editing, 0.5-1 second per shot`;

  if (style?.lighting) {
    prompt += `, ${style.lighting}`;
  } else {
    prompt += `, dramatic instrument glow`;
  }

  if (style?.textures) {
    prompt += `, ${style.textures}`;
  } else {
    prompt += `, metallic textures`;
  }

  prompt += `, shallow depth of field`;

  if (style?.additional) {
    prompt += `, ${style.additional}`;
  }

  return prompt;
}

// Helper to get appropriate presets for ref type
export function getPresetsForRefType(refType: SoraRefType): string[] {
  if (refType === 'location_only') {
    return [
      // B-roll / filler (primary use)
      'VEHICLE_FLYING',
      'ATMOSPHERE_EXT',
      'ATMOSPHERE_INT',
      'TRANSITION_FILLER',
      // Interior details
      'VEHICLE_INT_STARTUP',
      'ENVIRONMENT_EXPLORE',
      'TECH_DETAILS'
    ];
  } else {
    return ['COVERAGE_STANDARD', 'ORBIT_HERO', 'DRAMATIC_REVEAL', 'DOCUMENTARY', 'QUICK_TWO_SHOT'];
  }
}

// Get B-roll specific presets (recommended starting point)
export function getBRollPresets(): string[] {
  return [
    'VEHICLE_FLYING',
    'ATMOSPHERE_EXT',
    'ATMOSPHERE_INT',
    'TRANSITION_FILLER',
    'VEHICLE_INT_STARTUP',
    'ENVIRONMENT_EXPLORE'
  ];
}

// Audio generation routing
export type AudioGenerationType =
  | 'narration'           // Off-camera voice → ElevenLabs TTS
  | 'off_camera_dialogue' // Character speaks but not visible → ElevenLabs TTS
  | 'on_camera_dialogue'  // Character speaks AND visible → VEED/Fabric lip sync
  | 'pov_dialogue'        // POV shot - hear character but don't see face → TTS only
  | 'inner_thoughts'      // Character visible but speaking as thoughts → TTS only (no lip sync)
  | 'cloned_voice';       // Custom cloned voice → Minimax

// Speech mode - controls whether to use lip sync
export type SpeechMode =
  | 'lip_sync'       // Normal on-camera dialogue with lip movement
  | 'pov'            // POV shot - voice only, no face visible
  | 'inner_thoughts' // Face visible but no lip sync (thinking)
  | 'voice_only';    // Just audio, no video modification

export interface AudioRouting {
  type: AudioGenerationType;
  endpoint: string;
  needs_avatar: boolean;
  needs_voice_clone: boolean;
  description: string;
}

/**
 * Determine which endpoint to use for audio generation
 *
 * SPEECH MODES:
 * - lip_sync: Normal dialogue with mouth movement (VEED/Fabric avatar)
 * - pov: POV shot - hear character voice but don't see face (TTS only)
 * - inner_thoughts: Character visible but no lip sync (internal monologue effect)
 * - voice_only: Just generate audio, don't modify video
 */
export function routeAudioGeneration(params: {
  is_narration: boolean;
  character_visible: boolean;
  use_cloned_voice: boolean;
  speech_mode?: SpeechMode;  // NEW: Override automatic detection
}): AudioRouting {
  const { is_narration, character_visible, use_cloned_voice, speech_mode } = params;

  // Narration or voiceover - no face needed
  if (is_narration) {
    return {
      type: 'narration',
      endpoint: use_cloned_voice ? FAL_ENDPOINTS.TTS_CLONED : FAL_ENDPOINTS.TTS_NARRATION,
      needs_avatar: false,
      needs_voice_clone: use_cloned_voice,
      description: 'Narration/voiceover - ElevenLabs TTS (no lip sync)'
    };
  }

  // Check for special speech modes first (user override)
  if (speech_mode === 'pov') {
    // POV shot - character speaks but we see through their eyes
    return {
      type: 'pov_dialogue',
      endpoint: use_cloned_voice ? FAL_ENDPOINTS.TTS_CLONED : FAL_ENDPOINTS.TTS_NARRATION,
      needs_avatar: false,
      needs_voice_clone: use_cloned_voice,
      description: 'POV dialogue - Character speaks from their perspective (no lip sync, just audio)'
    };
  }

  if (speech_mode === 'inner_thoughts') {
    // Character is visible but speaking as thoughts (no mouth movement)
    return {
      type: 'inner_thoughts',
      endpoint: use_cloned_voice ? FAL_ENDPOINTS.TTS_CLONED : FAL_ENDPOINTS.TTS_NARRATION,
      needs_avatar: false,
      needs_voice_clone: use_cloned_voice,
      description: 'Inner thoughts - Character visible but audio plays as internal monologue (no lip sync)'
    };
  }

  if (speech_mode === 'voice_only') {
    // Just audio, no video modification at all
    return {
      type: 'off_camera_dialogue',
      endpoint: use_cloned_voice ? FAL_ENDPOINTS.TTS_CLONED : FAL_ENDPOINTS.TTS_NARRATION,
      needs_avatar: false,
      needs_voice_clone: use_cloned_voice,
      description: 'Voice only - Audio track without video modification'
    };
  }

  // Character dialogue - check if face is visible (default behavior)
  // Note: If we reach here, speech_mode is either 'lip_sync' or undefined (default)
  if (character_visible) {
    // ON-CAMERA: Need lip sync with VEED/Fabric
    return {
      type: 'on_camera_dialogue',
      endpoint: FAL_ENDPOINTS.AVATAR_LIPSYNC,
      needs_avatar: true,
      needs_voice_clone: use_cloned_voice,
      description: 'On-camera dialogue - VEED/Fabric (lip sync avatar)'
    };
  } else {
    // OFF-CAMERA: Just need audio
    return {
      type: 'off_camera_dialogue',
      endpoint: use_cloned_voice ? FAL_ENDPOINTS.TTS_CLONED : FAL_ENDPOINTS.TTS_NARRATION,
      needs_avatar: false,
      needs_voice_clone: use_cloned_voice,
      description: 'Off-camera dialogue - ElevenLabs TTS (no lip sync)'
    };
  }
}

export interface VoiceoverSegment {
  id: string;
  start_time_ms: number;
  end_time_ms: number;
  duration_ms: number;
  text: string;
  voice_style: VoiceStyle;
  emotion: string;
  // Which shots this spans
  shot_ids: string[];
  // TTS parameters
  tts_params?: {
    voice_id?: string;
    speed?: number;
    pitch?: number;
  };
}

export interface DialogueSegment {
  id: string;
  shot_id: string;
  character: string;
  line: string;

  // Is the character's face visible in this shot?
  character_visible: boolean;

  // Speech mode - controls lip sync behavior
  // - lip_sync: Normal dialogue with mouth movement
  // - pov: POV shot - voice only, character not visible
  // - inner_thoughts: Character visible but no lip sync (thinking effect)
  // - voice_only: Just audio, no video modification
  speech_mode: SpeechMode;

  // Audio generation routing
  audio_routing: AudioRouting;

  // If face visible AND speech_mode is lip_sync → needs lip sync avatar (VEED/Fabric)
  // Otherwise → just TTS (ElevenLabs or Minimax)
  lip_sync_required: boolean;

  // Video model: SEEDANCE for lip sync if using video gen, or VEED for avatar
  recommended_video_model: 'seedance-1.5' | 'kling-2.6' | 'veed-fabric';

  // Voice settings
  use_cloned_voice: boolean;
  voice_clone_id?: string;  // If using saved cloned voice

  start_time_ms: number;
  duration_ms: number;
}

export interface MusicCue {
  id: string;
  type: 'start' | 'transition' | 'end' | 'hit';
  time_ms: number;
  description: string;
  mood: string;
  // Shot this occurs at
  shot_id?: string;
}

export interface SoundEffect {
  id: string;
  shot_id: string;
  time_offset_ms: number;  // Offset from shot start
  description: string;
  priority: 'essential' | 'nice_to_have';
}

export interface AudioPlan {
  project_id: string;
  total_duration_ms: number;

  // Does this video need audio?
  has_voiceover: boolean;
  has_dialogue: boolean;
  has_music: boolean;
  has_sfx: boolean;

  // Segments
  voiceover_segments: VoiceoverSegment[];
  dialogue_segments: DialogueSegment[];
  music_cues: MusicCue[];
  sound_effects: SoundEffect[];

  // Timeline for rendering
  render_timeline: RenderTimelineEntry[];

  // Summary
  summary: {
    voiceover_count: number;
    dialogue_count: number;
    music_cues_count: number;
    sfx_count: number;
    total_audio_assets: number;
    shots_needing_seedance: string[];  // Shot IDs that need lip sync
  };
}

export interface RenderTimelineEntry {
  time_ms: number;
  type: 'shot_start' | 'shot_end' | 'voiceover_start' | 'voiceover_end' | 'dialogue' | 'music_cue' | 'sfx';
  asset_id: string;
  details: string;
}

export interface AudioPlannerInput {
  concept: string;
  shots: ShotCard[];
  storyAnalysis: StoryAnalysisOutput;
  direction: DirectorOutput;
  targetDuration: number;
}

// ============================================
// AUDIO PLANNER AGENT
// ============================================

export const audioPlannerAgent = {
  role: 'audio_planner',
  name: 'Audio Planner Agent',
  icon: '🎙️',
  color: 'orange',

  /**
   * Create complete audio plan from story analysis and shots
   */
  createPlan(input: AudioPlannerInput): AudioPlan {
    console.log('[AudioPlanner] 🎙️ Creating audio plan...');

    const audioNeeds = input.storyAnalysis?.audio_narrative_plan;
    const shots = input.shots;
    const targetDurationMs = input.targetDuration * 1000;

    // Calculate shot timings
    const shotTimings = this.calculateShotTimings(shots, targetDurationMs);

    // Initialize plan
    const plan: AudioPlan = {
      project_id: `audio_${Date.now()}`,
      total_duration_ms: targetDurationMs,
      has_voiceover: audioNeeds?.needs_voiceover || false,
      has_dialogue: audioNeeds?.needs_dialogue || false,
      has_music: audioNeeds?.needs_music || true,
      has_sfx: true,  // Always have some SFX
      voiceover_segments: [],
      dialogue_segments: [],
      music_cues: [],
      sound_effects: [],
      render_timeline: [],
      summary: {
        voiceover_count: 0,
        dialogue_count: 0,
        music_cues_count: 0,
        sfx_count: 0,
        total_audio_assets: 0,
        shots_needing_seedance: []
      }
    };

    // Plan voiceover if needed
    if (plan.has_voiceover) {
      plan.voiceover_segments = this.planVoiceover(
        audioNeeds?.voiceover_segments || [],
        shotTimings,
        input.storyAnalysis
      );
      plan.summary.voiceover_count = plan.voiceover_segments.length;
    }

    // Plan dialogue if needed
    if (plan.has_dialogue) {
      plan.dialogue_segments = this.planDialogue(
        audioNeeds?.dialogue_shots || [],
        shots,
        shotTimings
      );
      plan.summary.dialogue_count = plan.dialogue_segments.length;
      plan.summary.shots_needing_seedance = plan.dialogue_segments
        .filter(d => d.lip_sync_required)
        .map(d => d.shot_id);
    }

    // Plan music cues
    plan.music_cues = this.planMusicCues(
      shotTimings,
      input.storyAnalysis?.emotional_journey,
      audioNeeds?.music_style || 'cinematic'
    );
    plan.summary.music_cues_count = plan.music_cues.length;

    // Plan sound effects
    plan.sound_effects = this.planSoundEffects(
      shots,
      shotTimings,
      audioNeeds?.sound_design?.key_sounds || []
    );
    plan.summary.sfx_count = plan.sound_effects.length;

    // Build render timeline
    plan.render_timeline = this.buildRenderTimeline(plan, shotTimings);

    // Calculate totals
    plan.summary.total_audio_assets =
      plan.summary.voiceover_count +
      plan.summary.dialogue_count +
      plan.summary.sfx_count;

    console.log('[AudioPlanner] ✅ Audio plan created:');
    console.log(`[AudioPlanner]   Voiceover segments: ${plan.summary.voiceover_count}`);
    console.log(`[AudioPlanner]   Dialogue segments: ${plan.summary.dialogue_count}`);
    console.log(`[AudioPlanner]   Music cues: ${plan.summary.music_cues_count}`);
    console.log(`[AudioPlanner]   Sound effects: ${plan.summary.sfx_count}`);
    console.log(`[AudioPlanner]   Shots needing SEEDANCE: ${plan.summary.shots_needing_seedance.length}`);

    return plan;
  },

  /**
   * Calculate timing for each shot
   */
  calculateShotTimings(
    shots: ShotCard[],
    totalDurationMs: number
  ): Array<{ shot_id: string; start_ms: number; end_ms: number; duration_ms: number }> {
    // Get durations from shots or distribute evenly
    const durations = shots.map(shot => {
      // Try to parse duration from shot (use 5s default)
      const duration = (shot as any).duration_seconds || (shot as any).duration || 5;
      return duration * 1000;
    });

    const totalShot = durations.reduce((a, b) => a + b, 0);
    const scale = totalDurationMs / totalShot;

    let currentTime = 0;
    return shots.map((shot, i) => {
      const duration = Math.round(durations[i] * scale);
      const timing = {
        shot_id: shot.shot_id,
        start_ms: currentTime,
        end_ms: currentTime + duration,
        duration_ms: duration
      };
      currentTime += duration;
      return timing;
    });
  },

  /**
   * Plan voiceover segments
   */
  planVoiceover(
    voiceoverHints: Array<{ timing: string; content_hint: string }>,
    shotTimings: Array<{ shot_id: string; start_ms: number; end_ms: number }>,
    storyAnalysis: StoryAnalysisOutput
  ): VoiceoverSegment[] {
    const segments: VoiceoverSegment[] = [];

    if (voiceoverHints.length > 0) {
      // Use provided hints
      voiceoverHints.forEach((hint, i) => {
        // Parse timing hint (e.g., "opening", "climax", "0-5s")
        const timing = this.parseTimingHint(hint.timing, shotTimings);

        segments.push({
          id: `vo_${i}`,
          start_time_ms: timing.start_ms,
          end_time_ms: timing.end_ms,
          duration_ms: timing.end_ms - timing.start_ms,
          text: hint.content_hint,
          voice_style: 'narrator',
          emotion: storyAnalysis?.emotional_journey?.opening_emotion?.emotion || 'neutral',
          shot_ids: shotTimings
            .filter(s => s.start_ms >= timing.start_ms && s.end_ms <= timing.end_ms)
            .map(s => s.shot_id)
        });
      });
    } else {
      // Auto-plan: opening narration and closing
      // Opening VO
      const openingShots = shotTimings.slice(0, 2);
      if (openingShots.length > 0) {
        segments.push({
          id: 'vo_opening',
          start_time_ms: openingShots[0].start_ms + 500,  // 500ms delay
          end_time_ms: openingShots[openingShots.length - 1].end_ms - 500,
          duration_ms: openingShots.reduce((a, s) => a + (s.end_ms - s.start_ms), 0) - 1000,
          text: '[Opening narration - to be written]',
          voice_style: 'narrator',
          emotion: storyAnalysis?.emotional_journey?.opening_emotion?.emotion || 'curious',
          shot_ids: openingShots.map(s => s.shot_id)
        });
      }
    }

    return segments;
  },

  /**
   * Plan dialogue segments
   *
   * ROUTING LOGIC:
   * - Character ON SCREEN + lip_sync mode → VEED/Fabric lip sync
   * - Character ON SCREEN + inner_thoughts mode → TTS only (no lip sync, thinking effect)
   * - POV mode → TTS only (character speaks from their perspective)
   * - Character OFF SCREEN → ElevenLabs TTS with cloned voice
   *
   * SPEECH MODES:
   * - lip_sync: Normal on-camera dialogue with mouth movement
   * - pov: POV shot - voice only, no face visible (e.g., character's internal monologue)
   * - inner_thoughts: Character visible but no lip sync (thinking effect)
   * - voice_only: Just audio, no video modification
   */
  planDialogue(
    dialogueHints: Array<{
      shot_number: number;
      character: string;
      line_hint: string;
      character_visible?: boolean;  // Optional override
      speech_mode?: SpeechMode;     // NEW: Control lip sync behavior
      use_cloned_voice?: boolean;
      voice_clone_id?: string;
    }>,
    shots: ShotCard[],
    shotTimings: Array<{ shot_id: string; start_ms: number; end_ms: number; duration_ms: number }>
  ): DialogueSegment[] {
    const segments: DialogueSegment[] = [];

    dialogueHints.forEach((hint, i) => {
      const shotIndex = hint.shot_number - 1;
      if (shotIndex >= 0 && shotIndex < shots.length) {
        const shot = shots[shotIndex];
        const timing = shotTimings[shotIndex];

        // Determine if character is visible based on shot type
        // CU, MCU, MS, OTS = face visible → default to lip_sync
        // WIDE, ESTABLISHING, EWS = face not visible → just audio
        const shotType = (shot.camera_rig_id || '').toLowerCase();
        const isCloseShot = shotType.includes('cu') ||
                           shotType.includes('close') ||
                           shotType.includes('medium') ||
                           shotType.includes('ots') ||
                           shotType.includes('over');

        // Detect POV shots automatically
        const isPOVShot = shotType.includes('pov') ||
                         shotType.includes('first person') ||
                         shotType.includes('subjective');

        // Allow manual override for visibility
        const characterVisible = hint.character_visible !== undefined
          ? hint.character_visible
          : isCloseShot;

        // Determine speech mode
        // Priority: explicit hint > auto-detect POV > default based on visibility
        let speechMode: SpeechMode = hint.speech_mode || 'lip_sync';
        if (!hint.speech_mode) {
          if (isPOVShot) {
            speechMode = 'pov';
          } else if (!characterVisible) {
            speechMode = 'voice_only';
          }
        }

        // Get audio routing with speech_mode
        // Default: use_cloned_voice = false (ElevenLabs is default)
        // Only set true for celebrity/real person voice clones
        const audioRouting = routeAudioGeneration({
          is_narration: false,
          character_visible: characterVisible,
          use_cloned_voice: hint.use_cloned_voice ?? false,  // Default: ElevenLabs (no clone)
          speech_mode: speechMode
        });

        // Lip sync only if face is visible AND speech_mode is lip_sync
        const needsLipSync = characterVisible && speechMode === 'lip_sync';

        segments.push({
          id: `dialogue_${i}`,
          shot_id: shot.shot_id,
          character: hint.character,
          line: hint.line_hint,

          // Visibility & speech mode
          character_visible: characterVisible,
          speech_mode: speechMode,
          audio_routing: audioRouting,

          // Lip sync only if face visible AND speech_mode is lip_sync
          lip_sync_required: needsLipSync,

          // Video model based on lip sync requirement
          // NEEDS LIP SYNC: VEED/Fabric for avatar lip sync
          // NO LIP SYNC: Keep original video model
          recommended_video_model: needsLipSync ? 'veed-fabric' : 'kling-2.6',

          // Voice settings - Default: false (ElevenLabs), true only for celebrity/real person clones
          use_cloned_voice: hint.use_cloned_voice ?? false,
          voice_clone_id: hint.voice_clone_id,

          start_time_ms: timing.start_ms + 500,
          duration_ms: Math.min(timing.duration_ms - 1000, 4000)
        });

        const modeLabel = speechMode === 'lip_sync' ? '👄 LIP SYNC' :
                         speechMode === 'inner_thoughts' ? '💭 THOUGHTS' :
                         speechMode === 'pov' ? '👁️ POV' : '🔊 VOICE ONLY';
        console.log(`[AudioPlanner] Dialogue ${i}: ${modeLabel} "${hint.line_hint.substring(0, 30)}..." → ${audioRouting.description}`);
      }
    });

    return segments;
  },

  /**
   * Plan music cues
   */
  planMusicCues(
    shotTimings: Array<{ shot_id: string; start_ms: number; end_ms: number }>,
    emotionalJourney: StoryAnalysisOutput['emotional_journey'] | undefined,
    musicStyle: string
  ): MusicCue[] {
    const cues: MusicCue[] = [];

    // Start music
    cues.push({
      id: 'music_start',
      type: 'start',
      time_ms: 0,
      description: `${musicStyle} begins`,
      mood: emotionalJourney?.opening_emotion?.emotion || 'neutral',
      shot_id: shotTimings[0]?.shot_id
    });

    // Transition at midpoint
    const midIndex = Math.floor(shotTimings.length / 2);
    if (midIndex > 0 && midIndex < shotTimings.length) {
      cues.push({
        id: 'music_transition',
        type: 'transition',
        time_ms: shotTimings[midIndex].start_ms,
        description: 'Music builds/transitions',
        mood: emotionalJourney?.building_tension?.emotion || 'tension',
        shot_id: shotTimings[midIndex].shot_id
      });
    }

    // Climax hit
    const climaxIndex = Math.floor(shotTimings.length * 0.75);
    if (climaxIndex > 0 && climaxIndex < shotTimings.length) {
      cues.push({
        id: 'music_climax',
        type: 'hit',
        time_ms: shotTimings[climaxIndex].start_ms,
        description: 'Musical climax',
        mood: emotionalJourney?.climax_emotion?.emotion || 'intense',
        shot_id: shotTimings[climaxIndex].shot_id
      });
    }

    // End
    const lastShot = shotTimings[shotTimings.length - 1];
    if (lastShot) {
      cues.push({
        id: 'music_end',
        type: 'end',
        time_ms: lastShot.end_ms,
        description: `${musicStyle} resolves`,
        mood: emotionalJourney?.closing_emotion?.emotion || 'resolved',
        shot_id: lastShot.shot_id
      });
    }

    return cues;
  },

  /**
   * Plan sound effects
   */
  planSoundEffects(
    shots: ShotCard[],
    shotTimings: Array<{ shot_id: string; start_ms: number; duration_ms: number }>,
    keySounds: string[]
  ): SoundEffect[] {
    const effects: SoundEffect[] = [];

    // Add essential sounds per shot based on content
    shots.forEach((shot, i) => {
      const timing = shotTimings[i];

      // Analyze shot prompt for sounds
      const prompt = shot.photo_prompt?.toLowerCase() || '';

      // Fire
      if (prompt.includes('fire') || prompt.includes('flame') || prompt.includes('burn')) {
        effects.push({
          id: `sfx_fire_${i}`,
          shot_id: shot.shot_id,
          time_offset_ms: 0,
          description: 'Fire crackling',
          priority: 'essential'
        });
      }

      // Explosion
      if (prompt.includes('explod') || prompt.includes('blast')) {
        effects.push({
          id: `sfx_explosion_${i}`,
          shot_id: shot.shot_id,
          time_offset_ms: Math.floor(timing.duration_ms / 2),
          description: 'Explosion impact',
          priority: 'essential'
        });
      }

      // Water
      if (prompt.includes('water') || prompt.includes('rain') || prompt.includes('ocean')) {
        effects.push({
          id: `sfx_water_${i}`,
          shot_id: shot.shot_id,
          time_offset_ms: 0,
          description: 'Water ambience',
          priority: 'nice_to_have'
        });
      }

      // Footsteps
      if (prompt.includes('walk') || prompt.includes('run') || prompt.includes('step')) {
        effects.push({
          id: `sfx_footsteps_${i}`,
          shot_id: shot.shot_id,
          time_offset_ms: 0,
          description: 'Footsteps',
          priority: 'nice_to_have'
        });
      }
    });

    // Add key sounds from story analysis
    keySounds.forEach((sound, i) => {
      // Add to first shot if not already covered
      if (shots.length > 0 && !effects.some(e => e.description.toLowerCase().includes(sound.toLowerCase()))) {
        effects.push({
          id: `sfx_key_${i}`,
          shot_id: shots[0].shot_id,
          time_offset_ms: 0,
          description: sound,
          priority: 'essential'
        });
      }
    });

    return effects;
  },

  /**
   * Build render timeline
   */
  buildRenderTimeline(
    plan: AudioPlan,
    shotTimings: Array<{ shot_id: string; start_ms: number; end_ms: number }>
  ): RenderTimelineEntry[] {
    const entries: RenderTimelineEntry[] = [];

    // Add shot markers
    shotTimings.forEach(timing => {
      entries.push({
        time_ms: timing.start_ms,
        type: 'shot_start',
        asset_id: timing.shot_id,
        details: `Shot ${timing.shot_id} begins`
      });
      entries.push({
        time_ms: timing.end_ms,
        type: 'shot_end',
        asset_id: timing.shot_id,
        details: `Shot ${timing.shot_id} ends`
      });
    });

    // Add voiceover markers
    plan.voiceover_segments.forEach(vo => {
      entries.push({
        time_ms: vo.start_time_ms,
        type: 'voiceover_start',
        asset_id: vo.id,
        details: `VO: "${(vo.text || '').substring(0, 30)}..."`
      });
      entries.push({
        time_ms: vo.end_time_ms,
        type: 'voiceover_end',
        asset_id: vo.id,
        details: `VO ends`
      });
    });

    // Add dialogue markers
    plan.dialogue_segments.forEach(d => {
      entries.push({
        time_ms: d.start_time_ms,
        type: 'dialogue',
        asset_id: d.id,
        details: `${d.character}: "${(d.line || '').substring(0, 30)}..."`
      });
    });

    // Add music cues
    plan.music_cues.forEach(cue => {
      entries.push({
        time_ms: cue.time_ms,
        type: 'music_cue',
        asset_id: cue.id,
        details: `Music ${cue.type}: ${cue.description}`
      });
    });

    // Sort by time
    entries.sort((a, b) => a.time_ms - b.time_ms);

    return entries;
  },

  /**
   * Parse timing hint string to ms range
   */
  parseTimingHint(
    hint: string,
    shotTimings: Array<{ shot_id: string; start_ms: number; end_ms: number }>
  ): { start_ms: number; end_ms: number } {
    const hint_lower = hint.toLowerCase();

    // Handle keywords
    if (hint_lower === 'opening' || hint_lower === 'start') {
      const firstShots = shotTimings.slice(0, 2);
      return {
        start_ms: firstShots[0]?.start_ms || 0,
        end_ms: firstShots[firstShots.length - 1]?.end_ms || 5000
      };
    }

    if (hint_lower === 'climax' || hint_lower === 'peak') {
      const climaxIndex = Math.floor(shotTimings.length * 0.75);
      const climaxShot = shotTimings[climaxIndex];
      return {
        start_ms: climaxShot?.start_ms || 0,
        end_ms: climaxShot?.end_ms || 5000
      };
    }

    if (hint_lower === 'closing' || hint_lower === 'end') {
      const lastShots = shotTimings.slice(-2);
      return {
        start_ms: lastShots[0]?.start_ms || 0,
        end_ms: lastShots[lastShots.length - 1]?.end_ms || 5000
      };
    }

    // Handle time range like "0-5s"
    const timeMatch = hint.match(/(\d+)-(\d+)s?/);
    if (timeMatch) {
      return {
        start_ms: parseInt(timeMatch[1]) * 1000,
        end_ms: parseInt(timeMatch[2]) * 1000
      };
    }

    // Default: first 5 seconds
    return { start_ms: 0, end_ms: 5000 };
  },

  /**
   * Get shots that need SEEDANCE model for lip sync
   */
  getSeedanceShots(plan: AudioPlan): string[] {
    return plan.summary.shots_needing_seedance;
  },

  /**
   * Print audio plan for debugging
   */
  printPlan(plan: AudioPlan): string {
    let output = '# AUDIO PLAN\n\n';

    output += `## Summary\n`;
    output += `- Total Duration: ${plan.total_duration_ms}ms\n`;
    output += `- Voiceover: ${plan.has_voiceover ? 'YES' : 'NO'} (${plan.summary.voiceover_count} segments)\n`;
    output += `- Dialogue: ${plan.has_dialogue ? 'YES' : 'NO'} (${plan.summary.dialogue_count} segments)\n`;
    output += `- Music Cues: ${plan.summary.music_cues_count}\n`;
    output += `- Sound Effects: ${plan.summary.sfx_count}\n\n`;

    if (plan.summary.shots_needing_seedance.length > 0) {
      output += `## ⚠️ Shots Requiring SEEDANCE (Lip Sync)\n`;
      plan.summary.shots_needing_seedance.forEach(id => {
        output += `- ${id}\n`;
      });
      output += '\n';
    }

    if (plan.voiceover_segments.length > 0) {
      output += `## Voiceover Segments\n`;
      plan.voiceover_segments.forEach(vo => {
        output += `- [${vo.start_time_ms}ms - ${vo.end_time_ms}ms] ${vo.voice_style}: "${vo.text}"\n`;
      });
      output += '\n';
    }

    if (plan.dialogue_segments.length > 0) {
      output += `## Dialogue\n`;
      plan.dialogue_segments.forEach(d => {
        const modeIcon = d.speech_mode === 'lip_sync' ? '👄' :
                        d.speech_mode === 'inner_thoughts' ? '💭' :
                        d.speech_mode === 'pov' ? '👁️' : '🔊';
        output += `- Shot ${d.shot_id}: ${modeIcon} ${d.character} says "${d.line}" (${d.recommended_video_model})\n`;
      });
      output += '\n';
    }

    output += `## Render Timeline\n`;
    plan.render_timeline.slice(0, 20).forEach(entry => {
      output += `- ${entry.time_ms}ms: [${entry.type}] ${entry.details}\n`;
    });
    if (plan.render_timeline.length > 20) {
      output += `... and ${plan.render_timeline.length - 20} more entries\n`;
    }

    return output;
  }
};

export default audioPlannerAgent;
