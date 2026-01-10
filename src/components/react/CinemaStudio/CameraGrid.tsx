import { useState } from 'react';
import { CAMERA_PRESETS, PRESET_CATEGORIES, type CameraPreset } from './cameraPresets';
import { useCinemaStore } from './cinemaStore';

export default function CameraGrid() {
  const { selectedPresets, togglePreset, clearPresets } = useCinemaStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  const filteredPresets = activeCategory
    ? CAMERA_PRESETS.filter(p => p.category === activeCategory)
    : CAMERA_PRESETS;

  const isSelected = (preset: CameraPreset) =>
    selectedPresets.some(p => p.id === preset.id);

  const getSelectionIndex = (preset: CameraPreset) => {
    const index = selectedPresets.findIndex(p => p.id === preset.id);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="camera-grid-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-mono text-teal-400 uppercase tracking-wider">
          Camera Movement
        </h3>
        {selectedPresets.length > 0 && (
          <button
            onClick={clearPresets}
            className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
          >
            Clear ({selectedPresets.length}/3)
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-2 py-1 text-xs rounded transition-all ${
            activeCategory === null
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
              : 'bg-gray-800 text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          All
        </button>
        {PRESET_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeCategory === cat.id
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-transparent'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filteredPresets.map(preset => {
          const selected = isSelected(preset);
          const selectionIndex = getSelectionIndex(preset);
          const hovered = hoveredPreset === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => togglePreset(preset)}
              onMouseEnter={() => setHoveredPreset(preset.id)}
              onMouseLeave={() => setHoveredPreset(null)}
              className={`
                relative p-3 rounded-lg border transition-all duration-200
                flex flex-col items-center justify-center gap-1
                ${selected
                  ? 'bg-teal-500/10 border-teal-500 shadow-lg shadow-teal-500/20'
                  : 'bg-gray-900/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                }
                ${hovered ? 'transform scale-105' : ''}
              `}
            >
              {/* Selection Badge */}
              {selectionIndex && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {selectionIndex}
                </span>
              )}

              {/* Icon */}
              <span className={`text-2xl transition-transform ${hovered ? 'animate-pulse' : ''}`}>
                {preset.icon}
              </span>

              {/* Name */}
              <span className={`text-xs font-medium ${selected ? 'text-teal-400' : 'text-gray-300'}`}>
                {preset.name}
              </span>

              {/* Hover Preview Animation */}
              {hovered && (
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <div className={`absolute inset-0 opacity-20 ${getAnimationClass(preset.category)}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Presets Summary */}
      {selectedPresets.length > 0 && (
        <div className="mt-4 p-3 bg-gray-900/80 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Combined Movement:</div>
          <div className="flex flex-wrap gap-2">
            {selectedPresets.map((preset, i) => (
              <span
                key={preset.id}
                className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs flex items-center gap-1"
              >
                <span className="w-4 h-4 bg-teal-500 text-black rounded-full text-[10px] flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {preset.name}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 font-mono">
            {selectedPresets.map(p => p.prompt.split(',')[0]).join(' + ')}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredPreset && (
        <div className="mt-2 text-xs text-gray-400">
          {CAMERA_PRESETS.find(p => p.id === hoveredPreset)?.description}
        </div>
      )}
    </div>
  );
}

// Helper for hover animations
function getAnimationClass(category: string): string {
  switch (category) {
    case 'dolly':
      return 'bg-gradient-to-t from-teal-500 to-transparent animate-pulse';
    case 'pan':
      return 'bg-gradient-to-r from-teal-500 to-transparent animate-pulse';
    case 'tilt':
      return 'bg-gradient-to-b from-teal-500 to-transparent animate-pulse';
    case 'orbit':
      return 'bg-gradient-radial from-teal-500 to-transparent animate-spin';
    case 'zoom':
      return 'bg-radial-gradient from-teal-500 to-transparent animate-ping';
    default:
      return 'bg-teal-500/20';
  }
}
