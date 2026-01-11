/**
 * Movie Shots Browser
 * Browse 2100+ professional film shots with filtering
 * Use as reference images for Cinema Studio
 */
import { useState, useEffect, useMemo } from 'react';

interface MovieShot {
  id: string;
  image: string;
  film: string;
  year: number;
  director: string;
  shot: string;
  angle: string;
  movement: string;
  emotion: string;
  emotionIntensity: string;
  lighting: string;
  lightingSource: string;
  lightingColor: string;
  environment: string;
  location: string;
  weather: string | null;
  timeOfDay: string;
  genre: string[];
  decade: string;
  lens: string;
  tags: string[];
  prompt: string;
  framing: string;
  depth: string;
  compositionNotes: string;
  camera3d: { azimuth: number; elevation: number; distance: number } | null;
}

interface MovieShotsIndex {
  count: number;
  filters: {
    directors: string[];
    emotions: string[];
    lighting: string[];
    shotTypes: string[];
    environments: string[];
    decades: string[];
    films: string[];
  };
  shots: MovieShot[];
}

interface MovieShotsBrowserProps {
  onSelectShot: (shot: MovieShot, imageUrl: string) => void;
  onClose: () => void;
}

// Director display names
const DIRECTOR_NAMES: Record<string, string> = {
  'stanley-kubrick': 'Stanley Kubrick',
  'steven-spielberg': 'Steven Spielberg',
  'christopher-nolan': 'Christopher Nolan',
  'denis-villeneuve': 'Denis Villeneuve',
  'david-fincher': 'David Fincher',
  'quentin-tarantino': 'Quentin Tarantino',
  'wes-anderson': 'Wes Anderson',
  'martin-scorsese': 'Martin Scorsese',
  'ridley-scott': 'Ridley Scott',
  'terrence-malick': 'Terrence Malick',
  'akira-kurosawa': 'Akira Kurosawa',
  'alfred-hitchcock': 'Alfred Hitchcock',
  'bong-joon-ho': 'Bong Joon-ho',
  'damien-chazelle': 'Damien Chazelle',
  'francis-ford-coppola': 'Francis Ford Coppola',
  'james-cameron': 'James Cameron',
  'coen-brothers': 'Coen Brothers',
  'ari-aster': 'Ari Aster',
  'barry-jenkins': 'Barry Jenkins',
  'sam-mendes': 'Sam Mendes',
};

export default function MovieShotsBrowser({ onSelectShot, onClose }: MovieShotsBrowserProps) {
  const [index, setIndex] = useState<MovieShotsIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
  const [selectedShotType, setSelectedShotType] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(24);

  // Load index
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const response = await fetch('/movie-shots/index.json');
        if (!response.ok) throw new Error('Failed to load movie shots index');
        const data = await response.json();
        setIndex(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    loadIndex();
  }, []);

  // Filter shots
  const filteredShots = useMemo(() => {
    if (!index) return [];

    return index.shots.filter(shot => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          shot.film.toLowerCase().includes(query) ||
          shot.prompt.toLowerCase().includes(query) ||
          shot.tags.some(t => t.toLowerCase().includes(query)) ||
          shot.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Director filter
      if (selectedDirector && shot.director !== selectedDirector) return false;

      // Emotion filter
      if (selectedEmotion && shot.emotion !== selectedEmotion) return false;

      // Lighting filter
      if (selectedLighting && shot.lighting !== selectedLighting) return false;

      // Shot type filter
      if (selectedShotType && shot.shot !== selectedShotType) return false;

      // Environment filter
      if (selectedEnvironment && shot.environment !== selectedEnvironment) return false;

      return true;
    });
  }, [index, searchQuery, selectedDirector, selectedEmotion, selectedLighting, selectedShotType, selectedEnvironment]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedDirector, selectedEmotion, selectedLighting, selectedShotType, selectedEnvironment]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDirector(null);
    setSelectedEmotion(null);
    setSelectedLighting(null);
    setSelectedShotType(null);
    setSelectedEnvironment(null);
  };

  const hasActiveFilters = searchQuery || selectedDirector || selectedEmotion || selectedLighting || selectedShotType || selectedEnvironment;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Loading {index?.count || 2100}+ movie shots...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Movie Shots Library</h2>
          <p className="text-xs text-gray-500">
            {filteredShots.length} of {index?.count} shots
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search films, tags, locations..."
          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Director */}
        <select
          value={selectedDirector || ''}
          onChange={(e) => setSelectedDirector(e.target.value || null)}
          className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">All Directors</option>
          {index?.filters.directors.map(d => (
            <option key={d} value={d}>{DIRECTOR_NAMES[d] || d}</option>
          ))}
        </select>

        {/* Emotion */}
        <select
          value={selectedEmotion || ''}
          onChange={(e) => setSelectedEmotion(e.target.value || null)}
          className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">All Emotions</option>
          {index?.filters.emotions.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {/* Lighting */}
        <select
          value={selectedLighting || ''}
          onChange={(e) => setSelectedLighting(e.target.value || null)}
          className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">All Lighting</option>
          {index?.filters.lighting.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Shot Type */}
        <select
          value={selectedShotType || ''}
          onChange={(e) => setSelectedShotType(e.target.value || null)}
          className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">All Shot Types</option>
          {index?.filters.shotTypes.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Environment */}
        <select
          value={selectedEnvironment || ''}
          onChange={(e) => setSelectedEnvironment(e.target.value || null)}
          className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">All Environments</option>
          {index?.filters.environments.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filteredShots.slice(0, visibleCount).map((shot) => (
            <div
              key={shot.id}
              onClick={() => onSelectShot(shot, `/movie-shots/${shot.image}`)}
              className="group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border border-gray-700 hover:border-cyan-500 transition-colors"
            >
              <img
                src={`/movie-shots/${shot.image}`}
                alt={shot.film}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="text-[10px] text-white font-medium truncate">{shot.film}</div>
                  <div className="text-[9px] text-gray-400">{shot.shot} • {shot.emotion}</div>
                </div>
              </div>
              {/* Director Badge */}
              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {DIRECTOR_NAMES[shot.director] || shot.director}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredShots.length && (
          <div className="flex justify-center mt-4 pb-4">
            <button
              onClick={() => setVisibleCount(prev => prev + 24)}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-sm text-gray-400 transition-colors"
            >
              Load More ({filteredShots.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredShots.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 opacity-50">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-sm">No shots match your filters</p>
            <button onClick={clearFilters} className="mt-2 text-cyan-400 text-xs hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
