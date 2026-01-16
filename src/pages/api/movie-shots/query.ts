/**
 * Movie Shots API Endpoint
 *
 * Provides query access to the MOVIE SHOTS reference database.
 * Used by AI2 Studio UI to display reference shots.
 *
 * GET /api/movie-shots/query?director=spielberg&limit=5
 * GET /api/movie-shots/query?shotType=close-up&emotion=fear
 */

import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const MOVIE_SHOTS_BASE_PATH = 'C:\\Users\\yodes\\Documents\\Production-System\\MOVIE SHOTS';
const INDEX_FILE = path.join(MOVIE_SHOTS_BASE_PATH, 'index.json');

// Director name mapping
const DIRECTOR_NAME_MAP: Record<string, string> = {
  'stanley-kubrick': 'Stanley Kubrick',
  'steven-spielberg': 'Steven Spielberg',
  'quentin-tarantino': 'Quentin Tarantino',
  'david-fincher': 'David Fincher',
  'christopher-nolan': 'Christopher Nolan',
  'denis-villeneuve': 'Denis Villeneuve',
  'wes-anderson': 'Wes Anderson',
  'akira-kurosawa': 'Akira Kurosawa',
  'martin-scorsese': 'Martin Scorsese',
  'ridley-scott': 'Ridley Scott',
};

// Director aliases
const DIRECTOR_ALIASES: Record<string, string> = {
  'kubrick': 'stanley-kubrick',
  'spielberg': 'steven-spielberg',
  'tarantino': 'quentin-tarantino',
  'fincher': 'david-fincher',
  'nolan': 'christopher-nolan',
  'villeneuve': 'denis-villeneuve',
  'wes anderson': 'wes-anderson',
  'kurosawa': 'akira-kurosawa',
  'scorsese': 'martin-scorsese',
  'ridley scott': 'ridley-scott',
};

// Shot type mapping
const SHOT_TYPE_MAP: Record<string, string[]> = {
  'WIDE_MASTER': ['extreme-long', 'long'],
  'WIDE_ESTABLISHING': ['extreme-long', 'long'],
  'MEDIUM_SHOT': ['medium', 'medium-long'],
  'CU_FACE': ['close-up', 'medium-close'],
  'CU': ['close-up'],
  'ECU': ['extreme-close'],
};

// Cache
let cachedIndex: any = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

function loadIndex() {
  const now = Date.now();
  if (cachedIndex && (now - cacheTime) < CACHE_TTL) {
    return cachedIndex;
  }

  try {
    const data = fs.readFileSync(INDEX_FILE, 'utf-8');
    cachedIndex = JSON.parse(data);
    cacheTime = now;
    return cachedIndex;
  } catch (err) {
    console.error('[MovieShots API] Failed to load index:', err);
    return { shots: [], filters: {} };
  }
}

function normalizeDirector(director: string): string {
  const lower = director.toLowerCase().trim();
  return DIRECTOR_ALIASES[lower] || lower;
}

function normalizeShotType(coverageType: string): string[] {
  return SHOT_TYPE_MAP[coverageType] || [coverageType.toLowerCase().replace(/_/g, '-')];
}

function formatShot(shot: any) {
  const directorFormatted = DIRECTOR_NAME_MAP[shot.director] || shot.director;

  return {
    id: shot.id,
    url: path.join(MOVIE_SHOTS_BASE_PATH, shot.image),
    director: shot.director,
    directorFormatted,
    movie: shot.film,
    year: shot.year,
    shotType: shot.shot,
    angle: shot.angle,
    emotion: shot.emotion,
    lighting: shot.lighting,
    description: [
      `${shot.shot} shot from "${shot.film}" (${shot.year})`,
      `Directed by ${directorFormatted}`,
      shot.emotion ? `Emotion: ${shot.emotion}` : null,
      shot.lighting ? `Lighting: ${shot.lighting}` : null,
    ].filter(Boolean).join('. '),
    photoPrompt: shot.prompt || `${shot.shot} shot, ${shot.emotion || 'dramatic'} mood, ${shot.lighting || 'cinematic'} lighting`,
    tags: shot.tags || []
  };
}

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;

  const director = params.get('director');
  const shotType = params.get('shotType');
  const emotion = params.get('emotion');
  const cameraMovement = params.get('cameraMovement');
  const lighting = params.get('lighting');
  const limit = parseInt(params.get('limit') || '5');

  const index = loadIndex();
  let results = [...(index.shots || [])];

  // Filter by director
  if (director) {
    const normalized = normalizeDirector(director);
    results = results.filter(shot =>
      shot.director?.toLowerCase().includes(normalized)
    );
  }

  // Filter by shot type
  if (shotType) {
    const types = normalizeShotType(shotType);
    results = results.filter(shot =>
      types.some(t => shot.shot?.toLowerCase() === t)
    );
  }

  // Filter by emotion
  if (emotion) {
    const em = emotion.toLowerCase();
    results = results.filter(shot =>
      shot.emotion?.toLowerCase().includes(em)
    );
  }

  // Filter by camera movement
  if (cameraMovement) {
    const mov = cameraMovement.toLowerCase();
    results = results.filter(shot =>
      shot.movement?.toLowerCase().includes(mov)
    );
  }

  // Filter by lighting
  if (lighting) {
    const light = lighting.toLowerCase();
    results = results.filter(shot =>
      shot.lighting?.toLowerCase().includes(light)
    );
  }

  // Apply limit
  results = results.slice(0, limit);

  // Format results
  const formatted = results.map(formatShot);

  return new Response(JSON.stringify({
    success: true,
    count: formatted.length,
    shots: formatted
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { director, shotType, emotion, limit = 5 } = body;

  const index = loadIndex();
  let results = [...(index.shots || [])];

  if (director) {
    const normalized = normalizeDirector(director);
    results = results.filter(shot =>
      shot.director?.toLowerCase().includes(normalized)
    );
  }

  if (shotType) {
    const types = normalizeShotType(shotType);
    results = results.filter(shot =>
      types.some(t => shot.shot?.toLowerCase() === t)
    );
  }

  if (emotion) {
    const em = emotion.toLowerCase();
    results = results.filter(shot =>
      shot.emotion?.toLowerCase().includes(em)
    );
  }

  results = results.slice(0, limit);
  const formatted = results.map(formatShot);

  return new Response(JSON.stringify({
    success: true,
    count: formatted.length,
    shots: formatted
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
