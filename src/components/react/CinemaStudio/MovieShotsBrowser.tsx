/**
 * Movie Shots Browser
 * Browse 2100+ professional film shots with filtering
 * Multi-select up to 7 as references
 * Asset swap: replace subjects with your own character/item
 */
import { useState, useEffect, useMemo, useRef } from 'react';

export interface MovieShot {
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

// User's custom asset for swapping
export interface UserAsset {
  id: string;
  name: string;
  type: 'character' | 'item' | 'vehicle' | 'creature';
  imageUrl: string;
  description: string; // Detailed description for prompt injection
}

interface MovieShotsBrowserProps {
  onSelectShots: (shots: Array<{ shot: MovieShot; imageUrl: string }>) => void;
  onClose: () => void;
  userAssets?: UserAsset[];
  onAddAsset?: (asset: UserAsset) => void;
  onRemoveAsset?: (assetId: string) => void;
  selectedAsset?: UserAsset | null;
  onSelectAsset?: (asset: UserAsset | null) => void;
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

export default function MovieShotsBrowser({
  onSelectShots,
  onClose,
  userAssets = [],
  onAddAsset,
  onRemoveAsset,
  selectedAsset,
  onSelectAsset
}: MovieShotsBrowserProps) {
  const [index, setIndex] = useState<MovieShotsIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Multi-select state
  const [selectedShots, setSelectedShots] = useState<Map<string, { shot: MovieShot; imageUrl: string }>>(new Map());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
  const [selectedShotType, setSelectedShotType] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(24);

  // Asset upload
  const [showAssetUpload, setShowAssetUpload] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<'character' | 'item' | 'vehicle' | 'creature'>('character');
  const [newAssetDescription, setNewAssetDescription] = useState('');
  const [newAssetImage, setNewAssetImage] = useState<string | null>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);

  // AI Generation mode
  const [assetMode, setAssetMode] = useState<'upload' | 'generate'>('upload');
  const [assetRefImages, setAssetRefImages] = useState<string[]>([]); // Reference images for generation
  const [assetGenerating, setAssetGenerating] = useState(false);
  const [assetGenError, setAssetGenError] = useState<string | null>(null);
  const refImageInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'shots' | 'assets'>('shots');

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
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          shot.film.toLowerCase().includes(query) ||
          shot.prompt.toLowerCase().includes(query) ||
          shot.tags.some(t => t.toLowerCase().includes(query)) ||
          shot.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedDirector && shot.director !== selectedDirector) return false;
      if (selectedEmotion && shot.emotion !== selectedEmotion) return false;
      if (selectedLighting && shot.lighting !== selectedLighting) return false;
      if (selectedShotType && shot.shot !== selectedShotType) return false;
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

  // Toggle shot selection
  const toggleShotSelection = (shot: MovieShot) => {
    const imageUrl = `/movie-shots/${shot.image}`;
    setSelectedShots(prev => {
      const newMap = new Map(prev);
      if (newMap.has(shot.id)) {
        newMap.delete(shot.id);
      } else if (newMap.size < 7) {
        newMap.set(shot.id, { shot, imageUrl });
      }
      return newMap;
    });
  };

  // Apply selected shots
  const applySelectedShots = () => {
    const shotsArray = Array.from(selectedShots.values());
    onSelectShots(shotsArray);
  };

  // Handle asset image upload
  const handleAssetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewAssetImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle reference image upload for AI generation
  const handleRefImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload to Catbox
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    try {
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
      });
      const url = await response.text();
      if (url && url.startsWith('https://')) {
        setAssetRefImages(prev => [...prev.slice(0, 6), url.trim()]); // Max 7 refs
      }
    } catch (err) {
      console.error('Ref upload failed:', err);
    }
    e.target.value = '';
  };

  // Remove reference image
  const removeRefImage = (index: number) => {
    setAssetRefImages(prev => prev.filter((_, i) => i !== index));
  };

  // Generate asset with AI
  const generateAsset = async () => {
    if (!newAssetDescription || !onAddAsset) return;

    setAssetGenerating(true);
    setAssetGenError(null);

    try {
      // Build prompt based on asset type
      const typePrompts: Record<string, string> = {
        character: 'Character portrait, centered composition, full detail, clean background.',
        item: 'Product shot, centered, clean white background, studio lighting.',
        vehicle: 'Vehicle showcase, 3/4 angle, clean studio environment.',
        creature: 'Fantasy creature portrait, detailed, clean background, concept art style.'
      };

      const fullPrompt = `${newAssetDescription}. ${typePrompts[newAssetType]} High quality, 4K, detailed.`;

      // Call generate API with optional refs
      const requestBody: any = {
        type: assetRefImages.length > 0 ? 'edit' : 'image',
        prompt: fullPrompt,
        aspect_ratio: '1:1'
      };

      if (assetRefImages.length > 0) {
        requestBody.image_urls = assetRefImages;
      }

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.image_url) {
        // Auto-add to assets
        const asset: UserAsset = {
          id: `asset-${Date.now()}`,
          name: newAssetName || `Generated ${newAssetType}`,
          type: newAssetType,
          imageUrl: data.image_url,
          description: newAssetDescription
        };
        onAddAsset(asset);

        // Reset form
        resetAssetForm();
      } else {
        setAssetGenError(data.error || 'Generation failed');
      }
    } catch (err) {
      setAssetGenError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAssetGenerating(false);
    }
  };

  // Reset asset form
  const resetAssetForm = () => {
    setNewAssetName('');
    setNewAssetDescription('');
    setNewAssetImage(null);
    setAssetRefImages([]);
    setAssetMode('upload');
    setAssetGenError(null);
    setShowAssetUpload(false);
  };

  // Save new asset
  const saveNewAsset = () => {
    if (!newAssetName || !newAssetDescription || !newAssetImage || !onAddAsset) return;
    const asset: UserAsset = {
      id: `asset-${Date.now()}`,
      name: newAssetName,
      type: newAssetType,
      imageUrl: newAssetImage,
      description: newAssetDescription
    };
    onAddAsset(asset);
    resetAssetForm();
  };

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
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Movie Shots Library</h2>
          {/* Tabs */}
          <div className="flex bg-[#2a2a2a] rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('shots')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'shots'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Shots ({filteredShots.length})
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'assets'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              My Assets ({userAssets.length})
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Selection count */}
          {selectedShots.size > 0 && (
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
              {selectedShots.size}/7 selected
            </span>
          )}
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* SHOTS TAB */}
      {activeTab === 'shots' && (
        <>
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

          {/* Active Asset Indicator */}
          {selectedAsset && (
            <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <img src={selectedAsset.imageUrl} alt={selectedAsset.name} className="w-10 h-10 rounded object-cover" />
              <div className="flex-1">
                <div className="text-xs text-green-400 font-medium">Swapping with: {selectedAsset.name}</div>
                <div className="text-[10px] text-gray-400 truncate">{selectedAsset.description.substring(0, 50)}...</div>
              </div>
              <button
                onClick={() => onSelectAsset?.(null)}
                className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
              >
                Clear
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            <select value={selectedDirector || ''} onChange={(e) => setSelectedDirector(e.target.value || null)}
              className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50">
              <option value="">All Directors</option>
              {index?.filters.directors.map(d => <option key={d} value={d}>{DIRECTOR_NAMES[d] || d}</option>)}
            </select>
            <select value={selectedEmotion || ''} onChange={(e) => setSelectedEmotion(e.target.value || null)}
              className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50">
              <option value="">All Emotions</option>
              {index?.filters.emotions.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select value={selectedLighting || ''} onChange={(e) => setSelectedLighting(e.target.value || null)}
              className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50">
              <option value="">All Lighting</option>
              {index?.filters.lighting.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={selectedShotType || ''} onChange={(e) => setSelectedShotType(e.target.value || null)}
              className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50">
              <option value="">All Shot Types</option>
              {index?.filters.shotTypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={selectedEnvironment || ''} onChange={(e) => setSelectedEnvironment(e.target.value || null)}
              className="bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50">
              <option value="">All Environments</option>
              {index?.filters.environments.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors">
                Clear All
              </button>
            )}
          </div>

          {/* Selected Shots Preview */}
          {selectedShots.size > 0 && (
            <div className="mb-3 p-2 bg-[#1f1f1f] rounded-lg border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-cyan-400">Selected Reference Shots</span>
                <button
                  onClick={() => setSelectedShots(new Map())}
                  className="text-xs text-red-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Array.from(selectedShots.values()).map(({ shot, imageUrl }, idx) => (
                  <div key={shot.id} className="relative group">
                    <img src={imageUrl} alt={shot.film} className="w-16 h-10 object-cover rounded border border-cyan-500/50" />
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                      {idx + 1}
                    </div>
                    <button
                      onClick={() => toggleShotSelection(shot)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2 h-2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={applySelectedShots}
                className="mt-2 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Use {selectedShots.size} Shot{selectedShots.size > 1 ? 's' : ''} as Reference
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredShots.slice(0, visibleCount).map((shot) => {
                const isSelected = selectedShots.has(shot.id);
                return (
                  <div
                    key={shot.id}
                    onClick={() => toggleShotSelection(shot)}
                    className={`group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                        : 'border-gray-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <img src={`/movie-shots/${shot.image}`} alt={shot.film} className="w-full h-full object-cover" loading="lazy" />
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
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
                );
              })}
            </div>

            {/* Load More */}
            {visibleCount < filteredShots.length && (
              <div className="flex justify-center mt-4 pb-4">
                <button onClick={() => setVisibleCount(prev => prev + 24)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-sm text-gray-400 transition-colors">
                  Load More ({filteredShots.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {filteredShots.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 opacity-50">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p className="text-sm">No shots match your filters</p>
                <button onClick={clearFilters} className="mt-2 text-cyan-400 text-xs hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ASSETS TAB */}
      {activeTab === 'assets' && (
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-3">
              Upload your own characters, items, or creatures. When you select a movie shot,
              the subject will be swapped with your asset in the generated prompt.
            </p>

            {/* Add Asset Button */}
            {!showAssetUpload && onAddAsset && (
              <button
                onClick={() => setShowAssetUpload(true)}
                className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-lg text-gray-400 hover:text-green-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add New Asset
              </button>
            )}

            {/* Asset Upload/Generate Form */}
            {showAssetUpload && (
              <div className="p-4 bg-[#1f1f1f] rounded-lg border border-green-500/30 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-green-400 font-medium">New Asset</span>
                  <button onClick={resetAssetForm} className="text-gray-400 hover:text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex mb-3 bg-[#2a2a2a] rounded-lg p-1">
                  <button
                    onClick={() => setAssetMode('upload')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                      assetMode === 'upload' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Upload Image
                  </button>
                  <button
                    onClick={() => setAssetMode('generate')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                      assetMode === 'generate' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Generate with AI
                  </button>
                </div>

                {/* Error Display */}
                {assetGenError && (
                  <div className="mb-3 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-300">
                    {assetGenError}
                  </div>
                )}

                {/* UPLOAD MODE */}
                {assetMode === 'upload' && (
                  <div className="mb-3">
                    {newAssetImage ? (
                      <div className="relative">
                        <img src={newAssetImage} alt="Asset preview" className="w-full h-32 object-contain bg-[#2a2a2a] rounded-lg" />
                        <button
                          onClick={() => setNewAssetImage(null)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3 h-3">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => assetInputRef.current?.click()}
                        className="w-full h-24 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-green-400 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 mb-1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <span className="text-xs">Upload Image</span>
                      </button>
                    )}
                    <input ref={assetInputRef} type="file" accept="image/*" onChange={handleAssetImageUpload} className="hidden" />
                  </div>
                )}

                {/* GENERATE MODE */}
                {assetMode === 'generate' && (
                  <div className="mb-3">
                    <div className="text-[10px] text-gray-500 uppercase mb-2">Reference Images (Optional)</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {assetRefImages.map((url, idx) => (
                        <div key={idx} className="relative w-14 h-14">
                          <img src={url} alt={`Ref ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-purple-500/50" />
                          <button
                            onClick={() => removeRefImage(idx)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2 h-2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {assetRefImages.length < 7 && (
                        <button
                          onClick={() => refImageInputRef.current?.click()}
                          className="w-14 h-14 border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-400 transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <input ref={refImageInputRef} type="file" accept="image/*" onChange={handleRefImageUpload} className="hidden" />
                    <div className="text-[9px] text-gray-500">
                      Add reference images for style/character consistency. Leave empty to generate from description only.
                    </div>
                  </div>
                )}

                {/* Name */}
                <input
                  type="text"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="Asset name (e.g., CHIP, Iron Golem)"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mb-2"
                />

                {/* Type */}
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value as any)}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 mb-2"
                >
                  <option value="character">Character</option>
                  <option value="item">Item / Object</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="creature">Creature</option>
                </select>

                {/* Description */}
                <textarea
                  value={newAssetDescription}
                  onChange={(e) => setNewAssetDescription(e.target.value)}
                  placeholder={assetMode === 'generate'
                    ? "Describe what to generate (e.g., 'Fluffy yellow chipmunk with green headphones, red jacket, blue pants, cute cartoon style, 8K')"
                    : "Detailed description for AI swapping (e.g., 'Fluffy yellow chipmunk with green headphones, red jacket, blue pants')"
                  }
                  rows={3}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mb-3 resize-none"
                />

                {/* Action Button */}
                {assetMode === 'upload' ? (
                  <button
                    onClick={saveNewAsset}
                    disabled={!newAssetName || !newAssetDescription || !newAssetImage}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      newAssetName && newAssetDescription && newAssetImage
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Asset
                  </button>
                ) : (
                  <button
                    onClick={generateAsset}
                    disabled={!newAssetDescription || assetGenerating}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      newAssetDescription && !assetGenerating
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {assetGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>✨ Generate & Add to Assets</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {userAssets.map((asset) => {
              const isActive = selectedAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset?.(isActive ? null : asset)}
                  className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-[#1f1f1f] border-gray-700 hover:border-green-500/50'
                  }`}
                >
                  <img src={asset.imageUrl} alt={asset.name} className="w-full h-20 object-contain bg-[#2a2a2a] rounded mb-2" />
                  <div className="text-sm text-white font-medium truncate">{asset.name}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{asset.type}</div>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                  {onRemoveAsset && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveAsset(asset.id); }}
                      className="absolute top-2 left-2 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3 h-3">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {userAssets.length === 0 && !showAssetUpload && (
            <div className="text-center py-8 text-gray-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3 opacity-50">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21v-2a6.5 6.5 0 0113 0v2" />
              </svg>
              <p className="text-sm">No assets yet</p>
              <p className="text-xs mt-1">Add your characters or items to swap them into movie shots</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
