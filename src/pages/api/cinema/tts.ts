import type { APIRoute } from 'astro';
import { config } from 'dotenv';

// Load .env file
config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

// Popular ElevenLabs voices
const VOICES = {
  'rachel': '21m00Tcm4TlvDq8ikWAM',      // Calm, young female
  'drew': '29vD33N1CtxCmqQRPOHJ',        // Well-rounded male
  'clyde': '2EiwWnXFnvU5JabPnv8n',       // War veteran, deep
  'paul': '5Q0t7uMcjvnagumLfvZi',        // Ground reporter male
  'domi': 'AZnzlk1XvdvUeBnXmlld',        // Strong, young female
  'dave': 'CYw3kZ02Hs0563khs1Fj',        // Essex accent male
  'fin': 'D38z5RcWu1voky8WS1ja',         // Sailor, Irish male
  'sarah': 'EXAVITQu4vr4xnSDxMaL',       // Soft, young female
  'antoni': 'ErXwobaYiN019PkySvjV',      // Well-rounded male
  'thomas': 'GBv7mTt0atIp3Br8iCZE',      // Calm male
  'charlie': 'IKne3meq5aSn9XLyUdCD',     // Australian male
  'george': 'JBFqnCBsd6RMkjVDRZzb',      // Warm British male
  'emily': 'LcfcDJNUP1GQjkzn1xUU',       // Calm female
  'elli': 'MF3mGyEYCl7XYWbV9V6O',        // Young female
  'callum': 'N2lVS1w4EtoT3dr4eOWO',      // Transatlantic male
  'patrick': 'ODq5zmih8GrVes37Dizd',     // Shouty male
  'harry': 'SOYHLrjzK2X1ezoPC6cr',       // Anxious male
  'liam': 'TX3LPaxmHKxFdv7VOQHJ',        // Articulate male
  'dorothy': 'ThT5KcBeYPX3keUQqHPh',     // Pleasant female
  'josh': 'TxGEqnHWrfWFTfGW9XjX',        // Deep young male
  'arnold': 'VR6AewLTigWG4xSOukaG',      // Crisp male
  'charlotte': 'XB0fDUnXU5powFXDhCwa',   // Seductive female
  'matilda': 'XrExE9yKIg1WjnnlVkGX',     // Warm female
  'james': 'ZQe5CZNOzWyzPSCn5a3c',       // Calm Australian male
  'joseph': 'Zlb1dXrM653N07WRdFW3',      // British male
  'jeremy': 'bVMeCyTHy58xNoL34h3p',      // Excited Irish male
  'michael': 'flq6f7yk4E4fJM5XTYuZ',     // Older male
  'ethan': 'g5CIjZEefAph4nQFvHAz',       // Young male
  'chris': 'iP95p4xoKVk53GoZ742B',       // Casual male
  'gigi': 'jBpfuIE2acCO8z3wKNLl',        // Childish female
  'freya': 'jsCqWAovK2LkecY7zXl4',       // Young female
  'brian': 'nPczCjzI2devNBz1zQrb',       // Deep American male
  'grace': 'oWAxZDx7w5VEj9dCyTzz',       // Southern American female
  'daniel': 'onwK4e9ZLuTAKqWW03F9',      // Deep British male
  'lily': 'pFZP5JQG7iQjIQuC4Bku',        // Warm British female
  'serena': 'pMsXgVXv3BLzUgSXRplE',      // Pleasant female
  'adam': 'pNInz6obpgDQGcFmaJgB',        // Deep male
  'nicole': 'piTKgcLEGmPE4e6mEKli',      // Whisper female
  'bill': 'pqHfZKP75CvOlQylNhV4',        // American male
  'jessie': 't0jbNlBVZ17f02VDIeMI',      // Raspy male
  'sam': 'yoZ06aMxZJJ28mfd3POQ',         // Raspy male
  'glinda': 'z9fAnlkpzviPz146aGWa',      // Witch female
  'giovanni': 'zcAOhNBS3c14rBihAFp1',    // Italian male
  'mimi': 'zrHiDhphv9ZnVXBqCLjz',        // Swedish female
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      text,
      voice = 'rachel',  // Default voice
      model = 'eleven_multilingual_v2'  // Best quality model
    } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!ELEVENLABS_API_KEY) {
      return new Response(JSON.stringify({
        error: 'ElevenLabs API key not configured',
        hint: 'Add ELEVENLABS_API_KEY to .env file'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get voice ID
    const voiceId = VOICES[voice as keyof typeof VOICES] || VOICES['rachel'];

    console.log(`[TTS] Generating speech: "${text.substring(0, 50)}..." with voice: ${voice}`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] ElevenLabs error:', response.status, errorText);
      return new Response(JSON.stringify({
        error: 'TTS generation failed',
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();

    // Upload to catbox for URL
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    formData.append('fileToUpload', blob, 'voiceover.mp3');

    const uploadResponse = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    const audioUrl = await uploadResponse.text();
    if (!audioUrl.startsWith('https://')) {
      throw new Error('Audio upload failed: ' + audioUrl);
    }

    console.log(`[TTS] Audio generated: ${audioUrl.trim()}`);

    return new Response(JSON.stringify({
      success: true,
      audio_url: audioUrl.trim(),
      voice: voice,
      text_length: text.length
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

// GET endpoint to list available voices
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    voices: Object.keys(VOICES),
    default: 'rachel',
    hint: 'POST with { text: "Hello", voice: "rachel" }'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
