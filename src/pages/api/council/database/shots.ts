// API Endpoint: Query MOVIE SHOTS database
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// Path to MOVIE SHOTS database
const MOVIE_SHOTS_PATH = 'C:\\Users\\yodes\\Documents\\Production-System\\MOVIE SHOTS';
const INDEX_FILE = path.join(MOVIE_SHOTS_PATH, 'index.json');

interface ShotFilters {
  director?: string;
  emotion?: string;
  emotionIntensity?: string;
  movement?: string;
  shotType?: string;
  lighting?: string;
  environment?: string;
  genre?: string;
  decade?: string;
  lens?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);

    // Parse filters from query params
    const filters: ShotFilters = {
      director: url.searchParams.get('director') || undefined,
      emotion: url.searchParams.get('emotion') || undefined,
      emotionIntensity: url.searchParams.get('emotionIntensity') || undefined,
      movement: url.searchParams.get('movement') || undefined,
      shotType: url.searchParams.get('shotType') || undefined,
      lighting: url.searchParams.get('lighting') || undefined,
      environment: url.searchParams.get('environment') || undefined,
      genre: url.searchParams.get('genre') || undefined,
      decade: url.searchParams.get('decade') || undefined,
      lens: url.searchParams.get('lens') || undefined,
      search: url.searchParams.get('search') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '50'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    };

    // Load index file
    let indexData: any;
    try {
      const indexContent = await fs.readFile(INDEX_FILE, 'utf-8');
      indexData = JSON.parse(indexContent);
    } catch (err) {
      // Return mock data if file doesn't exist
      return new Response(JSON.stringify({
        success: true,
        shots: getMockShots(filters),
        total: 10,
        filters: filters,
        message: 'Using mock data - index.json not found'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get shots array from index
    let shots = indexData.shots || [];

    // Apply filters
    if (filters.director) {
      shots = shots.filter((s: any) =>
        s.director?.toLowerCase().includes(filters.director!.toLowerCase())
      );
    }

    if (filters.emotion) {
      shots = shots.filter((s: any) =>
        s.emotion?.toLowerCase() === filters.emotion!.toLowerCase()
      );
    }

    if (filters.emotionIntensity) {
      shots = shots.filter((s: any) =>
        s.emotionIntensity?.toLowerCase() === filters.emotionIntensity!.toLowerCase()
      );
    }

    if (filters.movement) {
      shots = shots.filter((s: any) =>
        s.movement?.toLowerCase().includes(filters.movement!.toLowerCase().replace('_', '-'))
      );
    }

    if (filters.shotType) {
      shots = shots.filter((s: any) =>
        s.shot?.toLowerCase().includes(filters.shotType!.toLowerCase())
      );
    }

    if (filters.lighting) {
      shots = shots.filter((s: any) =>
        s.lighting?.toLowerCase().includes(filters.lighting!.toLowerCase())
      );
    }

    if (filters.environment) {
      shots = shots.filter((s: any) =>
        s.environment?.toLowerCase().includes(filters.environment!.toLowerCase())
      );
    }

    if (filters.genre) {
      shots = shots.filter((s: any) =>
        s.genre?.some((g: string) => g.toLowerCase().includes(filters.genre!.toLowerCase()))
      );
    }

    if (filters.decade) {
      shots = shots.filter((s: any) =>
        s.decade?.includes(filters.decade!)
      );
    }

    if (filters.lens) {
      shots = shots.filter((s: any) =>
        s.lens?.includes(filters.lens!)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      shots = shots.filter((s: any) =>
        s.film?.toLowerCase().includes(searchLower) ||
        s.prompt?.toLowerCase().includes(searchLower) ||
        s.tags?.some((t: string) => t.toLowerCase().includes(searchLower)) ||
        s.id?.toLowerCase().includes(searchLower)
      );
    }

    // Get total before pagination
    const total = shots.length;

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    shots = shots.slice(offset, offset + limit);

    return new Response(JSON.stringify({
      success: true,
      shots,
      total,
      offset,
      limit,
      filters
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[API] Shot query error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      shots: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Mock data for when index.json doesn't exist
function getMockShots(filters: ShotFilters) {
  const mockShots = [
    {
      id: 'kubrick_2001_001',
      film: '2001: A Space Odyssey',
      year: 1968,
      director: 'stanley-kubrick',
      shot: 'extreme-wide',
      angle: 'eye-level',
      movement: 'static',
      emotion: 'awe',
      emotionIntensity: 'strong',
      lighting: 'dramatic',
      environment: 'scifi',
      genre: ['scifi'],
      decade: '1960s',
      lens: '50mm',
      tags: ['space', 'monolith', 'symmetry'],
      prompt: 'Centered symmetrical shot of monolith against starfield'
    },
    {
      id: 'spielberg_jaws_001',
      film: 'Jaws',
      year: 1975,
      director: 'steven-spielberg',
      shot: 'close-up',
      angle: 'eye-level',
      movement: 'dolly-zoom',
      emotion: 'fear',
      emotionIntensity: 'strong',
      lighting: 'natural',
      environment: 'beach',
      genre: ['thriller', 'horror'],
      decade: '1970s',
      lens: '85mm',
      tags: ['reaction', 'dolly-zoom', 'vertigo'],
      prompt: 'Famous dolly zoom reaction shot on beach'
    },
    {
      id: 'fincher_se7en_001',
      film: 'Se7en',
      year: 1995,
      director: 'david-fincher',
      shot: 'medium',
      angle: 'high',
      movement: 'static',
      emotion: 'menacing',
      emotionIntensity: 'strong',
      lighting: 'low-key',
      environment: 'interior',
      genre: ['thriller', 'noir'],
      decade: '1990s',
      lens: '35mm',
      tags: ['dark', 'gritty', 'mystery'],
      prompt: 'High angle shot in dark interrogation room'
    }
  ];

  // Apply basic filtering to mock data
  let filtered = mockShots;

  if (filters.director) {
    filtered = filtered.filter(s =>
      s.director.toLowerCase().includes(filters.director!.toLowerCase())
    );
  }

  if (filters.emotion) {
    filtered = filtered.filter(s =>
      s.emotion.toLowerCase() === filters.emotion!.toLowerCase()
    );
  }

  return filtered;
}
