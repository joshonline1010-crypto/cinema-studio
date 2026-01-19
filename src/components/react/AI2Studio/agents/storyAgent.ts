/**
 * Story Agent - Decomposes concepts into structured segments
 *
 * Uses the 15/35/50 Escalation Formula:
 * - SETUP (15%): Establish world, introduce character, hint at conflict
 * - ESCALATION (35%): Conflict grows, obstacles mount, tension builds
 * - CLIMAX (50%): Maximum action, resolution, payoff
 */

import Anthropic from '@anthropic-ai/sdk';

// Types
export interface StoryPlan {
  id: string;
  concept: string;
  totalDuration: number;
  targetShotCount: number;
  escalationFormula: '15/35/50';
  segments: Segment[];
  characters: Character[];
  locations: Location[];
  threats: Threat[];
  createdAt: string;
}

export interface Segment {
  id: string;
  type: 'SETUP' | 'ESCALATION' | 'CLIMAX';
  name: string;
  order: number;
  intensityPercent: number;
  durationPercent: number;
  targetShotCount: number;
  beats: Beat[];
}

export interface Beat {
  id: string;
  order: number;
  description: string;
  intensity: number; // 0.0 - 1.0
  mood: 'calm' | 'tense' | 'action' | 'emotional' | 'triumphant';
  suggestedShotType?: string;
  suggestedCameraMove?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
  dna?: string; // Full character prompt for refs
}

export interface Location {
  id: string;
  name: string;
  description: string;
  mood?: string;
}

export interface Threat {
  id: string;
  name: string;
  description: string;
  type: 'natural' | 'mechanical' | 'creature' | 'environmental';
  intensityStates?: {
    dormant: string;
    active: string;
    dangerous: string;
    catastrophic: string;
  };
}

// Calculate shot count from duration
function calculateShotCount(durationSeconds: number): number {
  // Kling only allows 5 or 10 second videos
  // Use 5s shots for more cuts, 10s for slower pace
  if (durationSeconds <= 15) return Math.ceil(durationSeconds / 5);
  if (durationSeconds <= 30) return 5 + Math.floor((durationSeconds - 15) / 5);
  if (durationSeconds <= 60) return 8 + Math.floor((durationSeconds - 30) / 5);
  return Math.ceil(durationSeconds / 5); // ~12 shots per minute
}

// Distribute shots across segments using 15/35/50 formula
function distributeShots(totalShots: number): { setup: number; escalation: number; climax: number } {
  const setup = Math.max(1, Math.round(totalShots * 0.15));
  const escalation = Math.max(2, Math.round(totalShots * 0.35));
  const climax = totalShots - setup - escalation;

  return { setup, escalation, climax: Math.max(2, climax) };
}

// Story Agent system prompt
const STORY_AGENT_PROMPT = `You are a Story Decomposition Agent for short-form video production.

Your job is to break down a video concept into structured segments using the 15/35/50 ESCALATION FORMULA:

## ESCALATION FORMULA (15/35/50)
- **SETUP (15%)**: Establish world, introduce character, hint at conflict. Low intensity.
- **ESCALATION (35%)**: Conflict grows, obstacles mount, tension builds. Rising intensity.
- **CLIMAX (50%)**: Maximum action, resolution, payoff. Peak intensity.

## SHOT DURATION RULES (Kling Video)
- Videos can ONLY be 5 or 10 seconds
- 10-15s video = 2-3 shots @ 5s each
- 30s video = 5-6 shots @ 5s each
- 60s video = 10-12 shots @ 5s each

## YOUR OUTPUT FORMAT
You MUST respond with valid JSON matching this structure:

{
  "segments": [
    {
      "type": "SETUP",
      "name": "Brief segment name",
      "intensityPercent": 15,
      "beats": [
        {
          "description": "What happens in this beat",
          "intensity": 0.2,
          "mood": "calm",
          "suggestedShotType": "wide_shot",
          "suggestedCameraMove": "slow_pan"
        }
      ]
    },
    {
      "type": "ESCALATION",
      "name": "Brief segment name",
      "intensityPercent": 35,
      "beats": [...]
    },
    {
      "type": "CLIMAX",
      "name": "Brief segment name",
      "intensityPercent": 50,
      "beats": [...]
    }
  ],
  "characters": [
    {
      "name": "Character name",
      "description": "Visual description",
      "role": "protagonist"
    }
  ],
  "locations": [
    {
      "name": "Location name",
      "description": "Visual description of location",
      "mood": "ominous"
    }
  ],
  "threats": [
    {
      "name": "Threat name",
      "description": "What the threat is",
      "type": "natural"
    }
  ]
}

## BEAT INTENSITY GUIDE
- 0.0-0.2: Calm, establishing
- 0.3-0.4: Mild tension, building
- 0.5-0.6: Active conflict
- 0.7-0.8: High action
- 0.9-1.0: Maximum intensity, peak moments

## SHOT TYPE SUGGESTIONS
For SETUP: wide_shot, establishing, medium_shot
For ESCALATION: medium_shot, over_shoulder, tracking
For CLIMAX: close_up, extreme_close_up, dutch_angle, low_angle

## CAMERA MOVEMENT SUGGESTIONS
For SETUP: static, slow_pan, gentle_dolly
For ESCALATION: tracking, push_in, orbit
For CLIMAX: fast_push, dolly_zoom, handheld

Remember: Each beat should be one 5-second video. Plan beats accordingly.`;

// Main decomposition function
export async function decomposeStory(
  concept: string,
  durationSeconds: number = 60,
  characterDNA?: string
): Promise<StoryPlan> {
  const client = new Anthropic();

  const totalShots = calculateShotCount(durationSeconds);
  const distribution = distributeShots(totalShots);

  const userPrompt = `Decompose this video concept into segments:

CONCEPT: "${concept}"
DURATION: ${durationSeconds} seconds
TARGET SHOTS: ${totalShots} total
  - SETUP: ${distribution.setup} shots
  - ESCALATION: ${distribution.escalation} shots
  - CLIMAX: ${distribution.climax} shots

${characterDNA ? `CHARACTER DNA: ${characterDNA}` : ''}

Create beats for each segment. Each beat = one 5-second video.
Respond with JSON only.`;

  console.log('[StoryAgent] Decomposing:', concept);
  console.log('[StoryAgent] Duration:', durationSeconds, 'shots:', totalShots);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: STORY_AGENT_PROMPT
  });

  // Extract JSON from response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse JSON (handle potential markdown code blocks)
  let jsonText = content.text;
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  const parsed = JSON.parse(jsonText);

  // Build full StoryPlan with IDs
  const storyPlan: StoryPlan = {
    id: `story_${Date.now()}`,
    concept,
    totalDuration: durationSeconds,
    targetShotCount: totalShots,
    escalationFormula: '15/35/50',
    segments: parsed.segments.map((seg: any, i: number) => ({
      id: `seg_${i}`,
      type: seg.type,
      name: seg.name,
      order: i,
      intensityPercent: seg.intensityPercent,
      durationPercent: seg.intensityPercent, // Same as intensity for this formula
      targetShotCount: seg.type === 'SETUP' ? distribution.setup :
                       seg.type === 'ESCALATION' ? distribution.escalation :
                       distribution.climax,
      beats: seg.beats.map((beat: any, j: number) => ({
        id: `beat_${i}_${j}`,
        order: j,
        description: beat.description,
        intensity: beat.intensity,
        mood: beat.mood,
        suggestedShotType: beat.suggestedShotType,
        suggestedCameraMove: beat.suggestedCameraMove
      }))
    })),
    characters: (parsed.characters || []).map((char: any, i: number) => ({
      id: `char_${i}`,
      name: char.name,
      description: char.description,
      role: char.role || 'protagonist',
      dna: characterDNA
    })),
    locations: (parsed.locations || []).map((loc: any, i: number) => ({
      id: `loc_${i}`,
      name: loc.name,
      description: loc.description,
      mood: loc.mood
    })),
    threats: (parsed.threats || []).map((threat: any, i: number) => ({
      id: `threat_${i}`,
      name: threat.name,
      description: threat.description,
      type: threat.type
    })),
    createdAt: new Date().toISOString()
  };

  console.log('[StoryAgent] Plan created:', {
    segments: storyPlan.segments.length,
    totalBeats: storyPlan.segments.reduce((acc, seg) => acc + seg.beats.length, 0),
    characters: storyPlan.characters.length,
    locations: storyPlan.locations.length,
    threats: storyPlan.threats.length
  });

  return storyPlan;
}

// Quick decomposition without API (uses templates)
export function quickDecompose(
  concept: string,
  durationSeconds: number = 30
): StoryPlan {
  const totalShots = calculateShotCount(durationSeconds);
  const distribution = distributeShots(totalShots);

  // Generate placeholder beats
  const setupBeats: Beat[] = Array.from({ length: distribution.setup }, (_, i) => ({
    id: `beat_0_${i}`,
    order: i,
    description: `Setup beat ${i + 1}: Establishing scene`,
    intensity: 0.1 + (i * 0.1),
    mood: 'calm' as const,
    suggestedShotType: i === 0 ? 'wide_shot' : 'medium_shot',
    suggestedCameraMove: 'slow_pan'
  }));

  const escalationBeats: Beat[] = Array.from({ length: distribution.escalation }, (_, i) => ({
    id: `beat_1_${i}`,
    order: i,
    description: `Escalation beat ${i + 1}: Building tension`,
    intensity: 0.3 + (i * 0.1),
    mood: 'tense' as const,
    suggestedShotType: 'medium_shot',
    suggestedCameraMove: 'tracking'
  }));

  const climaxBeats: Beat[] = Array.from({ length: distribution.climax }, (_, i) => ({
    id: `beat_2_${i}`,
    order: i,
    description: `Climax beat ${i + 1}: Peak action`,
    intensity: 0.7 + (i * 0.1),
    mood: 'action' as const,
    suggestedShotType: i === distribution.climax - 1 ? 'extreme_close_up' : 'close_up',
    suggestedCameraMove: 'fast_push'
  }));

  return {
    id: `story_${Date.now()}`,
    concept,
    totalDuration: durationSeconds,
    targetShotCount: totalShots,
    escalationFormula: '15/35/50',
    segments: [
      {
        id: 'seg_0',
        type: 'SETUP',
        name: 'Setup',
        order: 0,
        intensityPercent: 15,
        durationPercent: 15,
        targetShotCount: distribution.setup,
        beats: setupBeats
      },
      {
        id: 'seg_1',
        type: 'ESCALATION',
        name: 'Escalation',
        order: 1,
        intensityPercent: 35,
        durationPercent: 35,
        targetShotCount: distribution.escalation,
        beats: escalationBeats
      },
      {
        id: 'seg_2',
        type: 'CLIMAX',
        name: 'Climax',
        order: 2,
        intensityPercent: 50,
        durationPercent: 50,
        targetShotCount: distribution.climax,
        beats: climaxBeats
      }
    ],
    characters: [],
    locations: [],
    threats: [],
    createdAt: new Date().toISOString()
  };
}

// Export helper functions
export { calculateShotCount, distributeShots };
