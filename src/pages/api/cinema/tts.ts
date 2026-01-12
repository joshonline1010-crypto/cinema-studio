import type { APIRoute } from 'astro';

// Use FAL.AI for TTS (same account as images/videos - already has credits!)
const FAL_API_KEY = 'Key 30048d83-df50-41fa-9c2f-61be8fcdb719:8bb12ec91651bf9dc7ee420b44895305';

// FAL Dia TTS - best quality, supports multi-speaker with [S1], [S2] tags
const TTS_ENDPOINT = 'https://fal.run/fal-ai/dia-tts';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      text,
      voice = 'narrator'  // Not used for Dia but kept for API compatibility
    } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`[TTS] Generating speech with FAL Dia: "${text.substring(0, 50)}..."`);

    // Call FAL Dia TTS
    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': FAL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] FAL error:', response.status, errorText);
      return new Response(JSON.stringify({
        error: 'TTS generation failed',
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log('[TTS] FAL response:', data);

    // Get audio URL from response
    const audioUrl = data.audio?.url || data.audio_url || data.url;

    if (!audioUrl) {
      return new Response(JSON.stringify({
        error: 'No audio URL in response',
        raw: data
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`[TTS] ✅ Audio generated: ${audioUrl}`);

    return new Response(JSON.stringify({
      success: true,
      audio_url: audioUrl,
      voice: voice,
      text_length: text.length,
      provider: 'fal-dia-tts'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[TTS] Error:', error);
    return new Response(JSON.stringify({
      error: 'TTS failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET endpoint to show info
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    provider: 'FAL Dia TTS',
    cost: '$0.04 per 1000 characters',
    features: [
      'High quality voice',
      'Multi-speaker with [S1], [S2] tags',
      'Natural nonverbals (laughter, pauses)'
    ],
    usage: 'POST { text: "Hello world" }',
    multi_speaker_example: '[S1] Hello! [S2] Hi there!'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
