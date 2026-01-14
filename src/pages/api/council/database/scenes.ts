// API Endpoint: Load reverse engineered scenes
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// Path to scenes folder
const SCENES_PATH = 'C:\\Users\\yodes\\Documents\\Production-System\\MOVIE SHOTS\\scenes';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sceneId = url.searchParams.get('id');

    if (!sceneId) {
      // Return list of available scenes
      return new Response(JSON.stringify({
        success: true,
        scenes: [
          {
            id: 'shaun_the_plan',
            name: 'The Plan (Shaun of the Dead)',
            director: 'Edgar Wright',
            year: 2004,
            shots: 61,
            duration: 104.67
          }
        ]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load specific scene
    const scenePath = path.join(SCENES_PATH, `${sceneId}.json`);

    try {
      const sceneContent = await fs.readFile(scenePath, 'utf-8');
      const scene = JSON.parse(sceneContent);

      return new Response(JSON.stringify({
        success: true,
        scene
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      // Return mock scene if file doesn't exist
      if (sceneId === 'shaun_the_plan') {
        return new Response(JSON.stringify({
          success: true,
          scene: getMockShaunScene(),
          message: 'Using partial mock data'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: `Scene not found: ${sceneId}`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('[API] Scene load error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Mock Shaun of the Dead scene (simplified)
function getMockShaunScene() {
  return {
    sceneId: 'shaun_the_plan',
    name: 'The Plan - Shaun of the Dead',
    description: "Shaun explains his zombie survival plan with Edgar Wright's signature match-cut montage",
    director: 'Edgar Wright',
    year: 2004,
    cinematographer: 'David M. Dunlap',
    aspectRatio: '2.35:1',
    extraction: {
      fps: 3,
      totalFrames: 314,
      totalDurationSec: 104.67
    },
    visualStyle: {
      camera: 'ARRI 435',
      lens: 'Panavision Primo anamorphic',
      colorGrade: 'desaturated, teal shadows, warm highlights',
      lightingStyle: 'practical sources, overcast daylight',
      aspectRatio: '2.35:1'
    },
    shots: [
      {
        shotId: 'shot_001',
        order: 1,
        model: 'seedance-1.5',
        photoPromptStart: 'MCU of heavyset man sitting on brown leather couch...',
        motionPrompt: 'Slow zoom out pulling back, man SPINS cricket bat...',
        speakerOnScreen: true
      },
      {
        shotId: 'shot_002',
        order: 2,
        model: 'seedance-1.5',
        photoPromptStart: 'MS of blonde man standing in flat...',
        motionPrompt: 'Slow push-in toward face, character TURNS...',
        speakerOnScreen: true
      },
      {
        shotId: 'shot_003',
        order: 3,
        model: 'kling-2.6',
        photoPromptStart: 'Whip pan motion blur transition...',
        motionPrompt: 'Rapid whip pan motion blur...',
        speakerOnScreen: false
      }
    ],
    summary: {
      totalShots: 61,
      dialogShots: 18,
      actionShots: 29,
      transitionShots: 8,
      insertShots: 6,
      modelBreakdown: {
        'seedance-1.5': 18,
        'kling-2.6': 39,
        'kling-o1': 4
      },
      estimatedCost: {
        videoGeneration: '$21.35',
        imageGeneration: '$1.83',
        total: '$23.18'
      }
    },
    techniques: [
      'Whip pan transitions between scenes (8 instances)',
      'Flash frame punctuation (1 instance)',
      'Rapid match cuts on action words',
      'ECU insert shots of mundane objects',
      'Visualization montage matching dialogue',
      'Prop manipulation (Ed spinning cricket bat)',
      'Camera push-in with character turn combo'
    ]
  };
}
