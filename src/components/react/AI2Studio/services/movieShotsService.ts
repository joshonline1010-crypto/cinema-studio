/**
 * MOVIE SHOTS SERVICE
 *
 * Provides query interface to the MOVIE SHOTS reference database.
 * Used by AI2 Studio agents to fetch real film reference shots.
 *
 * Located at: C:\Users\yodes\Documents\Production-System\MOVIE SHOTS
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  ShotQuery,
  ShotReference,
  MovieShotsIndex,
  FormattedShotReference
} from '../types/movieShots';
import {
  DIRECTOR_NAME_MAP,
  DIRECTOR_ALIASES,
  SHOT_TYPE_MAP
} from '../types/movieShots';

// ============================================
// CONFIGURATION
// ============================================

const MOVIE_SHOTS_BASE_PATH = 'C:\\Users\\yodes\\Documents\\Production-System\\MOVIE SHOTS';
const INDEX_FILE = path.join(MOVIE_SHOTS_BASE_PATH, 'index.json');

// Cache for loaded index
let cachedIndex: MovieShotsIndex | null = null;
let cacheLoadTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================
// INDEX LOADER
// ============================================

async function loadIndex(): Promise<MovieShotsIndex> {
  const now = Date.now();

  // Return cached if still valid
  if (cachedIndex && (now - cacheLoadTime) < CACHE_TTL) {
    return cachedIndex;
  }

  try {
    const data = fs.readFileSync(INDEX_FILE, 'utf-8');
    cachedIndex = JSON.parse(data) as MovieShotsIndex;
    cacheLoadTime = now;
    console.log(`[MovieShots] Loaded index with ${cachedIndex.count} shots`);
    return cachedIndex;
  } catch (err) {
    console.error('[MovieShots] Failed to load index:', err);
    // Return empty index on failure
    return {
      generated: new Date().toISOString(),
      count: 0,
      filters: {
        directors: [],
        emotions: [],
        lighting: [],
        shotTypes: [],
        environments: [],
        decades: [],
        films: [],
        lenses: [],
        angles: []
      },
      shots: []
    };
  }
}

// ============================================
// QUERY HELPERS
// ============================================

function normalizeDirector(director: string): string {
  const lower = director.toLowerCase().trim();
  return DIRECTOR_ALIASES[lower] || lower;
}

function normalizeShotType(coverageType: string): string[] {
  return SHOT_TYPE_MAP[coverageType] || [coverageType.toLowerCase().replace(/_/g, '-')];
}

function buildImageUrl(shot: ShotReference): string {
  // Build full path to the image
  return path.join(MOVIE_SHOTS_BASE_PATH, shot.image);
}

function formatShotReference(shot: ShotReference): FormattedShotReference {
  const directorFormatted = DIRECTOR_NAME_MAP[shot.director] || shot.director;

  // Build description
  const description = [
    `${shot.shot} shot from "${shot.film}" (${shot.year})`,
    `Directed by ${directorFormatted}`,
    shot.emotion ? `Emotion: ${shot.emotion}` : null,
    shot.lighting ? `Lighting: ${shot.lighting}` : null,
    shot.angle ? `Angle: ${shot.angle}` : null
  ].filter(Boolean).join('. ');

  // Build motion prompt from movement
  let motionPrompt: string | undefined;
  if (shot.movement && shot.movement !== 'static') {
    motionPrompt = `${shot.movement} camera movement`;
  }

  return {
    id: shot.id,
    url: buildImageUrl(shot),
    director: shot.director,
    directorFormatted,
    movie: shot.film,
    year: shot.year,
    shotType: shot.shot,
    angle: shot.angle,
    emotion: shot.emotion,
    lighting: shot.lighting,
    description,
    photoPrompt: shot.prompt || description,
    motionPrompt,
    tags: shot.tags || []
  };
}

// ============================================
// MAIN QUERY FUNCTION
// ============================================

export async function queryShots(query: ShotQuery): Promise<FormattedShotReference[]> {
  const index = await loadIndex();

  if (!index.shots.length) {
    console.warn('[MovieShots] No shots in index');
    return [];
  }

  let results = [...index.shots];

  // Filter by director
  if (query.director) {
    const normalizedDirector = normalizeDirector(query.director);
    results = results.filter(shot =>
      shot.director.toLowerCase().includes(normalizedDirector)
    );
  }

  // Filter by shot type
  if (query.shotType) {
    const shotTypes = normalizeShotType(query.shotType);
    results = results.filter(shot =>
      shotTypes.some(type => shot.shot.toLowerCase() === type)
    );
  }

  // Filter by emotion
  if (query.emotion) {
    const emotion = query.emotion.toLowerCase();
    results = results.filter(shot =>
      shot.emotion?.toLowerCase().includes(emotion)
    );
  }

  // Filter by camera movement
  if (query.cameraMovement) {
    const movement = query.cameraMovement.toLowerCase();
    results = results.filter(shot =>
      shot.movement?.toLowerCase().includes(movement)
    );
  }

  // Filter by lighting
  if (query.lighting) {
    const lighting = query.lighting.toLowerCase();
    results = results.filter(shot =>
      shot.lighting?.toLowerCase().includes(lighting)
    );
  }

  // Filter by environment
  if (query.environment) {
    const env = query.environment.toLowerCase();
    results = results.filter(shot =>
      shot.environment?.toLowerCase().includes(env)
    );
  }

  // Filter by angle
  if (query.angle) {
    const angle = query.angle.toLowerCase().replace(/_/g, '-');
    results = results.filter(shot =>
      shot.angle?.toLowerCase() === angle
    );
  }

  // Filter by decade
  if (query.decade) {
    results = results.filter(shot => shot.decade === query.decade);
  }

  // Filter by genre
  if (query.genre) {
    const genre = query.genre.toLowerCase();
    results = results.filter(shot =>
      shot.genre?.some(g => g.toLowerCase() === genre)
    );
  }

  // Filter by lens
  if (query.lens) {
    const lens = query.lens.toLowerCase();
    results = results.filter(shot =>
      shot.lens?.toLowerCase().includes(lens)
    );
  }

  // Apply limit
  const limit = query.limit || 5;
  results = results.slice(0, limit);

  // Format results
  return results.map(formatShotReference);
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Get reference shots for a specific director style
 */
export async function getShotsByDirector(
  director: string,
  limit: number = 5
): Promise<FormattedShotReference[]> {
  return queryShots({ director, limit });
}

/**
 * Get reference shots for a specific shot type
 */
export async function getShotsByType(
  shotType: string,
  director?: string,
  limit: number = 3
): Promise<FormattedShotReference[]> {
  return queryShots({ shotType, director, limit });
}

/**
 * Get reference shots matching an emotion
 */
export async function getShotsByEmotion(
  emotion: string,
  limit: number = 5
): Promise<FormattedShotReference[]> {
  return queryShots({ emotion, limit });
}

/**
 * Get all available directors
 */
export async function getAvailableDirectors(): Promise<string[]> {
  const index = await loadIndex();
  return index.filters.directors;
}

/**
 * Get all available shot types
 */
export async function getAvailableShotTypes(): Promise<string[]> {
  const index = await loadIndex();
  return index.filters.shotTypes;
}

/**
 * Get all available emotions
 */
export async function getAvailableEmotions(): Promise<string[]> {
  const index = await loadIndex();
  return index.filters.emotions;
}

/**
 * Format references for inclusion in agent prompts
 */
export function formatReferencesForPrompt(refs: FormattedShotReference[]): string {
  if (!refs.length) return '';

  return refs.map((ref, i) => {
    return [
      `Reference ${i + 1}: ${ref.movie} (${ref.directorFormatted})`,
      `  Shot: ${ref.shotType}, Angle: ${ref.angle}`,
      `  Emotion: ${ref.emotion}, Lighting: ${ref.lighting}`,
      `  How to recreate: ${ref.photoPrompt}`
    ].join('\n');
  }).join('\n\n');
}

/**
 * Get a summary of the database for agent context
 */
export async function getDatabaseSummary(): Promise<string> {
  const index = await loadIndex();
  return [
    `MOVIE SHOTS DATABASE: ${index.count} shots indexed`,
    `Directors: ${index.filters.directors.length} (${index.filters.directors.slice(0, 5).join(', ')}...)`,
    `Shot Types: ${index.filters.shotTypes.join(', ')}`,
    `Emotions: ${index.filters.emotions.length} types`,
    `Decades: ${index.filters.decades.join(', ')}`
  ].join('\n');
}

// ============================================
// EXPORTS
// ============================================

const movieShotsService = {
  query: queryShots,
  getShotsByDirector,
  getShotsByType,
  getShotsByEmotion,
  getAvailableDirectors,
  getAvailableShotTypes,
  getAvailableEmotions,
  formatReferencesForPrompt,
  getDatabaseSummary
};

export default movieShotsService;
