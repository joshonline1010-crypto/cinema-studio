/**
 * Camera Control for AI2 Studio
 * Generates angle/position prompts for consistent shot chaining
 */

import React, { useState, useMemo } from 'react';

// === ANGLE DESCRIPTORS ===

const AZIMUTH_RANGES = [
  { min: 337.5, max: 360, desc: 'front view' },
  { min: 0, max: 22.5, desc: 'front view' },
  { min: 22.5, max: 67.5, desc: 'three-quarter view from the right' },
  { min: 67.5, max: 112.5, desc: 'right side profile view' },
  { min: 112.5, max: 157.5, desc: 'back-right three-quarter view' },
  { min: 157.5, max: 202.5, desc: 'back view from behind' },
  { min: 202.5, max: 247.5, desc: 'back-left three-quarter view' },
  { min: 247.5, max: 292.5, desc: 'left side profile view' },
  { min: 292.5, max: 337.5, desc: 'three-quarter view from the left' },
];

const POSITION_ZONES = [
  { min: 0, max: 15, label: 'Far Left', text: 'far left of frame' },
  { min: 15, max: 33, label: 'Left Third', text: 'left third of frame' },
  { min: 33, max: 45, label: 'Center-Left', text: 'center-left of frame' },
  { min: 45, max: 55, label: 'Center', text: 'center of frame' },
  { min: 55, max: 67, label: 'Center-Right', text: 'center-right of frame' },
  { min: 67, max: 85, label: 'Right Third', text: 'right third of frame' },
  { min: 85, max: 100, label: 'Far Right', text: 'far right of frame' },
];

// Build angle description from camera values
export function buildAnglePrompt(azimuth: number, elevation: number, distance: number): string {
  // Map azimuth
  let azDesc = 'front view';
  for (const range of AZIMUTH_RANGES) {
    if (azimuth >= range.min && azimuth < range.max) {
      azDesc = range.desc;
      break;
    }
  }

  // Map elevation
  let elDesc = 'eye level';
  if (elevation <= -15) elDesc = 'low angle looking up';
  else if (elevation <= 15) elDesc = 'eye level';
  else if (elevation <= 45) elDesc = 'slightly elevated angle';
  else elDesc = 'high angle looking down';

  // Map distance
  let distDesc = 'medium shot';
  if (distance <= 0.75) distDesc = 'close-up shot';
  else if (distance <= 1.25) distDesc = 'medium shot';
  else distDesc = 'wide full body shot';

  return `${azDesc}, ${elDesc}, ${distDesc}`;
}

// Build position description
export function buildPositionPrompt(horizontal: number): string {
  for (const zone of POSITION_ZONES) {
    if (horizontal >= zone.min && horizontal < zone.max) {
      return zone.text;
    }
  }
  return 'far right of frame';
}

// Build full camera prompt for shot consistency
export function buildFullCameraPrompt(
  azimuth: number,
  elevation: number,
  distance: number,
  position: number,
  includeConsistency: boolean = true
): string {
  const angleText = buildAnglePrompt(azimuth, elevation, distance);
  const positionText = position !== 50 ? `, subject positioned ${buildPositionPrompt(position)}` : '';
  const consistency = includeConsistency
    ? ', THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE'
    : '';

  return `${angleText}${positionText}${consistency}`;
}

interface CameraControlProps {
  onCameraChange?: (prompt: string) => void;
  compact?: boolean;
}

export default function CameraControl({ onCameraChange, compact = false }: CameraControlProps) {
  const [azimuth, setAzimuth] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [distance, setDistance] = useState(1.0);
  const [position, setPosition] = useState(50);
  const [enabled, setEnabled] = useState(false);

  // Build prompt text
  const cameraPrompt = useMemo(() => {
    if (!enabled) return '';
    return buildFullCameraPrompt(azimuth, elevation, distance, position);
  }, [azimuth, elevation, distance, position, enabled]);

  // Notify parent when camera changes
  React.useEffect(() => {
    if (onCameraChange) {
      onCameraChange(enabled ? cameraPrompt : '');
    }
  }, [cameraPrompt, enabled, onCameraChange]);

  const getAzimuthLabel = (val: number) => {
    if (val >= 337.5 || val < 22.5) return 'Front';
    if (val < 67.5) return 'Front-Right';
    if (val < 112.5) return 'Right';
    if (val < 157.5) return 'Back-Right';
    if (val < 202.5) return 'Back';
    if (val < 247.5) return 'Back-Left';
    if (val < 292.5) return 'Left';
    return 'Front-Left';
  };

  const getElevationLabel = (val: number) => {
    if (val <= -15) return 'Low Angle';
    if (val <= 15) return 'Eye Level';
    if (val <= 45) return 'Elevated';
    return 'High Angle';
  };

  const getDistanceLabel = (val: number) => {
    if (val <= 0.75) return 'Close-up';
    if (val <= 1.25) return 'Medium';
    return 'Wide';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-vs-darker rounded-lg">
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            enabled
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-vs-lighter text-vs-muted hover:text-vs-text'
          }`}
        >
          3D Camera {enabled ? 'ON' : 'OFF'}
        </button>
        {enabled && (
          <span className="text-xs text-vs-muted truncate max-w-[300px]">
            {buildAnglePrompt(azimuth, elevation, distance)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-vs-darker rounded-lg p-4 border border-vs-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎬</span>
          <h3 className="font-medium text-vs-text">3D Camera Control</h3>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            enabled
              ? 'bg-cyan-500 text-white'
              : 'bg-vs-lighter text-vs-muted hover:text-vs-text'
          }`}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Azimuth - Camera rotation around subject */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyan-400">Azimuth</span>
                <span className="text-vs-muted">{getAzimuthLabel(azimuth)} ({azimuth}°)</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={azimuth}
                onChange={(e) => setAzimuth(Number(e.target.value))}
                className="w-full h-2 bg-vs-lighter rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Elevation - Camera height */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-pink-400">Elevation</span>
                <span className="text-vs-muted">{getElevationLabel(elevation)} ({elevation}°)</span>
              </div>
              <input
                type="range"
                min="-30"
                max="60"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full h-2 bg-vs-lighter rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Distance - Close to Wide */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400">Distance</span>
                <span className="text-vs-muted">{getDistanceLabel(distance)} ({distance.toFixed(1)})</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-vs-lighter rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>

            {/* Position - Subject left/right in frame */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-purple-400">Subject Position</span>
                <span className="text-vs-muted">{buildPositionPrompt(position)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="w-full h-2 bg-vs-lighter rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { setAzimuth(0); setElevation(0); setDistance(1.0); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              Front Medium
            </button>
            <button
              onClick={() => { setAzimuth(0); setElevation(0); setDistance(0.6); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              Front Close-up
            </button>
            <button
              onClick={() => { setAzimuth(45); setElevation(0); setDistance(1.0); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              3/4 Right
            </button>
            <button
              onClick={() => { setAzimuth(315); setElevation(0); setDistance(1.0); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              3/4 Left
            </button>
            <button
              onClick={() => { setAzimuth(0); setElevation(-20); setDistance(1.0); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              Low Hero
            </button>
            <button
              onClick={() => { setAzimuth(0); setElevation(45); setDistance(1.5); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              High Wide
            </button>
            <button
              onClick={() => { setAzimuth(90); setElevation(0); setDistance(1.0); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              Right Profile
            </button>
            <button
              onClick={() => { setAzimuth(270); setElevation(0); setDistance(1.0); setPosition(50); }}
              className="px-2 py-1 text-xs bg-vs-lighter rounded hover:bg-vs-light"
            >
              Left Profile
            </button>
          </div>

          {/* Output Preview */}
          <div className="p-3 bg-vs-dark rounded-lg border border-vs-border">
            <div className="text-xs text-vs-muted mb-1">Camera Prompt Output:</div>
            <code className="text-sm text-cyan-400 break-words">
              {cameraPrompt}
            </code>
          </div>
        </>
      )}
    </div>
  );
}
