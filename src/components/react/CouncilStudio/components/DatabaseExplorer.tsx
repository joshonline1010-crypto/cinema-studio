// DatabaseExplorer - Query interface for MOVIE SHOTS database
import React, { useState, useEffect } from 'react';
import { useCouncilStore } from '../councilStore';
import type { DatabaseShot, ShotFilters, ReverseEngineeredScene } from '../agents/types';

// Available filter options
const DIRECTORS = [
  'kubrick', 'spielberg', 'fincher', 'nolan', 'villeneuve',
  'wes_anderson', 'tarantino', 'edgar_wright', 'scorsese', 'hitchcock'
];

const EMOTIONS = [
  'awe', 'menacing', 'joy', 'sadness', 'fear', 'anger',
  'surprise', 'contempt', 'disgust', 'neutral', 'love', 'hope'
];

const CAMERA_MOVEMENTS = [
  'static', 'dolly_in', 'dolly_out', 'pan_left', 'pan_right',
  'tilt_up', 'tilt_down', 'orbit', 'tracking', 'handheld', 'steadicam'
];

const SHOT_TYPES = [
  'ECU', 'CU', 'MCU', 'MS', 'MLS', 'WS', 'EWS'
];

const AVAILABLE_SCENES = [
  { id: 'shaun_the_plan', name: 'The Plan (Shaun of the Dead)', director: 'Edgar Wright', shots: 61 }
];

export default function DatabaseExplorer() {
  const {
    shotQueryResults,
    activeScene,
    shotFilters,
    isLoading,
    queryShots,
    loadScene,
    setShotFilters,
    setActiveScene
  } = useCouncilStore();

  // Local state for filters
  const [localFilters, setLocalFilters] = useState<ShotFilters>({});
  const [activeView, setActiveView] = useState<'shots' | 'scenes'>('shots');
  const [selectedShot, setSelectedShot] = useState<DatabaseShot | null>(null);

  // ============================================
  // HANDLERS
  // ============================================

  const handleFilterChange = (key: keyof ShotFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    queryShots(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    queryShots({});
  };

  const handleLoadScene = async (sceneId: string) => {
    await loadScene(sceneId);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Shot Database</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('shots')}
              className={`px-3 py-1 text-sm rounded ${
                activeView === 'shots' ? 'bg-blue-600' : 'bg-zinc-800'
              }`}
            >
              Shots
            </button>
            <button
              onClick={() => setActiveView('scenes')}
              className={`px-3 py-1 text-sm rounded ${
                activeView === 'scenes' ? 'bg-blue-600' : 'bg-zinc-800'
              }`}
            >
              Scenes
            </button>
          </div>
        </div>

        {activeView === 'shots' && (
          <>
            {/* Filter Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <select
                value={localFilters.director || ''}
                onChange={(e) => handleFilterChange('director', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm"
              >
                <option value="">Director</option>
                {DIRECTORS.map((d) => (
                  <option key={d} value={d}>
                    {d.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <select
                value={localFilters.emotion || ''}
                onChange={(e) => handleFilterChange('emotion', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm"
              >
                <option value="">Emotion</option>
                {EMOTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={localFilters.movement || ''}
                onChange={(e) => handleFilterChange('movement', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm"
              >
                <option value="">Movement</option>
                {CAMERA_MOVEMENTS.map((m) => (
                  <option key={m} value={m}>
                    {m.replace('_', ' ')}
                  </option>
                ))}
              </select>

              <select
                value={localFilters.shotType || ''}
                onChange={(e) => handleFilterChange('shotType', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm"
              >
                <option value="">Shot Type</option>
                {SHOT_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by tags, film, prompt..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 rounded text-sm"
              >
                {isLoading ? '...' : 'Search'}
              </button>
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeView === 'shots' && (
          <>
            {/* Results Count */}
            {shotQueryResults.length > 0 && (
              <div className="text-sm text-zinc-400 mb-3">
                {shotQueryResults.length} shots found
              </div>
            )}

            {/* Shot Grid */}
            {shotQueryResults.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {shotQueryResults.map((shot) => (
                  <ShotCard
                    key={shot.id}
                    shot={shot}
                    onClick={() => setSelectedShot(shot)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-10">
                <p className="text-sm">No shots loaded</p>
                <p className="text-xs mt-1">Select filters and click Search</p>
              </div>
            )}
          </>
        )}

        {activeView === 'scenes' && (
          <>
            {/* Scene List */}
            <div className="space-y-3">
              {AVAILABLE_SCENES.map((scene) => (
                <div
                  key={scene.id}
                  className="p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
                  onClick={() => handleLoadScene(scene.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{scene.name}</div>
                      <div className="text-sm text-zinc-400">{scene.director}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">{scene.shots} shots</div>
                      <div className="text-xs text-blue-400">Click to load</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Scene Display */}
            {activeScene && (
              <div className="mt-6 pt-4 border-t border-zinc-700">
                <SceneViewer scene={activeScene} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Shot Detail Modal */}
      {selectedShot && (
        <ShotDetailModal
          shot={selectedShot}
          onClose={() => setSelectedShot(null)}
        />
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface ShotCardProps {
  shot: DatabaseShot;
  onClick: () => void;
}

function ShotCard({ shot, onClick }: ShotCardProps) {
  return (
    <div
      className="bg-zinc-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
      onClick={onClick}
    >
      {/* Image Placeholder */}
      <div className="aspect-video bg-zinc-800 flex items-center justify-center">
        {shot.image ? (
          <img
            src={shot.image}
            alt={shot.id}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-4xl opacity-30">🎬</span>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <div className="text-xs font-medium truncate">{shot.film || shot.id}</div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {shot.director && (
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded">
              {shot.director}
            </span>
          )}
          {shot.emotion && (
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-900/50 text-blue-300 rounded">
              {shot.emotion}
            </span>
          )}
          {shot.shot && (
            <span className="text-[10px] px-1.5 py-0.5 bg-green-900/50 text-green-300 rounded">
              {shot.shot}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShotDetailModalProps {
  shot: DatabaseShot;
  onClose: () => void;
}

function ShotDetailModal({ shot, onClose }: ShotDetailModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-semibold">{shot.film || shot.id}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Image */}
          {shot.image && (
            <div className="aspect-video bg-zinc-800 rounded overflow-hidden">
              <img
                src={shot.image}
                alt={shot.id}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Director" value={shot.director} />
            <Detail label="Year" value={shot.year?.toString()} />
            <Detail label="Shot Type" value={shot.shot} />
            <Detail label="Camera Angle" value={shot.angle} />
            <Detail label="Movement" value={shot.movement} />
            <Detail label="Emotion" value={`${shot.emotion} (${shot.emotionIntensity})`} />
            <Detail label="Lighting" value={shot.lighting} />
            <Detail label="Environment" value={shot.environment} />
            <Detail label="Lens" value={shot.lens} />
            <Detail label="Genre" value={shot.genre?.join(', ')} />
          </div>

          {/* Tags */}
          {shot.tags && shot.tags.length > 0 && (
            <div>
              <div className="text-xs text-zinc-500 mb-2">Tags</div>
              <div className="flex gap-1 flex-wrap">
                {shot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-zinc-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prompt */}
          {shot.prompt && (
            <div>
              <div className="text-xs text-zinc-500 mb-2">Prompt</div>
              <div className="text-sm text-zinc-300 bg-zinc-800 p-3 rounded">
                {shot.prompt}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              Use as Reference
            </button>
            <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm">
              Copy Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-zinc-300">{value}</div>
    </div>
  );
}

interface SceneViewerProps {
  scene: ReverseEngineeredScene;
}

function SceneViewer({ scene }: SceneViewerProps) {
  return (
    <div className="space-y-4">
      {/* Scene Header */}
      <div>
        <h3 className="text-lg font-semibold">{scene.name}</h3>
        <div className="text-sm text-zinc-400">
          {scene.director} ({scene.year}) • {scene.shots.length} shots • {scene.extraction.totalDurationSec.toFixed(1)}s
        </div>
      </div>

      {/* Model Breakdown */}
      <div className="p-3 bg-zinc-800 rounded">
        <div className="text-xs text-zinc-500 mb-2">Model Breakdown</div>
        <div className="space-y-1">
          {Object.entries(scene.summary?.modelBreakdown || {}).map(([model, count]) => (
            <div key={model} className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-700 rounded h-4 overflow-hidden">
                <div
                  className={`h-full ${
                    model === 'kling-2.6' ? 'bg-green-600' :
                    model === 'seedance-1.5' ? 'bg-blue-600' : 'bg-orange-600'
                  }`}
                  style={{ width: `${((count as number) / scene.shots.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 w-24">
                {model}: {count as number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Techniques */}
      {scene.techniques && scene.techniques.length > 0 && (
        <div className="p-3 bg-zinc-800 rounded">
          <div className="text-xs text-zinc-500 mb-2">Techniques Detected</div>
          <ul className="text-sm text-zinc-300 space-y-1">
            {scene.techniques.map((tech, i) => (
              <li key={i}>• {tech}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Shot Timeline */}
      <div>
        <div className="text-xs text-zinc-500 mb-2">Shot Timeline</div>
        <div className="flex gap-0.5 flex-wrap">
          {scene.shots.map((shot, i) => (
            <div
              key={shot.shotId}
              className={`w-6 h-6 rounded text-[10px] flex items-center justify-center ${
                shot.model === 'kling-2.6' ? 'bg-green-900/50 text-green-300' :
                shot.model === 'seedance-1.5' ? 'bg-blue-900/50 text-blue-300' :
                'bg-orange-900/50 text-orange-300'
              }`}
              title={`Shot ${i + 1}: ${shot.model}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium">
        Apply Scene Structure to Current Project
      </button>
    </div>
  );
}
