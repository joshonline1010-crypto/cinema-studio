/**
 * BatchGenerator - Generate multiple camera angles at once
 * Ported from Multi-Angle Studio
 */
import { useState, useCallback } from 'react';
import { BATCH_PRESETS, buildQwenPromptContinuous, type BatchAngle } from './promptVocabulary';

interface BatchResult {
  angle: BatchAngle;
  status: 'pending' | 'generating' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface BatchGeneratorProps {
  sourceImage: string | null;
  onBatchComplete?: (results: BatchResult[]) => void;
  onImageGenerated?: (result: BatchResult) => void;
  generateAngleImage: (angle: BatchAngle, sourceImage: string) => Promise<string>;
}

const PRESET_OPTIONS = [
  { value: 'turnaround', label: 'Full Turnaround (8 angles)', count: 8 },
  { value: 'cardinal', label: 'Cardinal (4 angles)', count: 4 },
  { value: 'angles', label: 'Elevation (3 angles)', count: 3 },
  { value: 'distances', label: 'Distances (3 shots)', count: 3 }
] as const;

export default function BatchGenerator({
  sourceImage,
  onBatchComplete,
  onImageGenerated,
  generateAngleImage
}: BatchGeneratorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('cardinal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<BatchResult[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!sourceImage) {
      alert('Please upload a source image first');
      return;
    }

    const angles = BATCH_PRESETS[selectedPreset as keyof typeof BATCH_PRESETS];
    if (!angles) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: angles.length });
    setResults([]);

    const batchResults: BatchResult[] = [];

    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      setProgress({ current: i + 1, total: angles.length });

      try {
        // Generate image for this angle
        const url = await generateAngleImage(angle, sourceImage);

        const generated: BatchResult = {
          angle,
          status: 'success',
          url
        };

        batchResults.push(generated);
        setResults([...batchResults]);

        // Notify parent of each generated image
        if (onImageGenerated) {
          onImageGenerated(generated);
        }
      } catch (error) {
        const errorResult: BatchResult = {
          angle,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        batchResults.push(errorResult);
        setResults([...batchResults]);
      }
    }

    setIsGenerating(false);
    onBatchComplete?.(batchResults);
  }, [sourceImage, selectedPreset, onBatchComplete, onImageGenerated, generateAngleImage]);

  const getAnglePreview = (preset: string) => {
    const angles = BATCH_PRESETS[preset as keyof typeof BATCH_PRESETS];
    if (!angles) return '';
    return angles.map(a => a.label).join(', ');
  };

  const currentPresetAngles = BATCH_PRESETS[selectedPreset as keyof typeof BATCH_PRESETS] || [];

  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🔄</span>
        <h3 className="text-sm font-semibold text-white">Batch Generator</h3>
      </div>

      {/* Preset Selection */}
      <div className="space-y-3">
        <p className="text-xs text-zinc-500">Select Preset</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_OPTIONS.map(preset => (
            <button
              key={preset.value}
              onClick={() => setSelectedPreset(preset.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedPreset === preset.value
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <div className="font-medium text-sm text-white">{preset.label}</div>
              <div className="text-xs text-zinc-400 mt-1">
                {getAnglePreview(preset.value)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Angle Preview */}
      <div className="bg-zinc-800/50 rounded-lg p-4">
        <p className="text-xs text-zinc-500 mb-2">Angles to Generate:</p>
        <div className="flex flex-wrap gap-2">
          {currentPresetAngles.map((angle, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-300"
              title={buildQwenPromptContinuous(angle.azimuth, angle.elevation, angle.distance)}
            >
              {angle.label}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Generating...</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Preview */}
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">
            Generated ({results.filter(r => r.status === 'success').length} / {results.length})
          </p>
          <div className="grid grid-cols-4 gap-2">
            {results.map((result, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg border overflow-hidden ${
                  result.status === 'success'
                    ? 'border-green-500/50'
                    : result.status === 'error'
                    ? 'border-red-500/50'
                    : 'border-zinc-700'
                }`}
              >
                {result.status === 'success' && result.url ? (
                  <img src={result.url} alt={result.angle?.label} className="w-full h-full object-cover" />
                ) : result.status === 'error' ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-500/10 text-red-400 text-xs">
                    Error
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <span className="animate-pulse text-zinc-400">...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !sourceImage}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/25"
      >
        {isGenerating
          ? `Generating ${progress.current}/${progress.total}...`
          : `Generate ${currentPresetAngles.length} Angles`
        }
      </button>

      {/* Cost Estimate */}
      <p className="text-xs text-center text-zinc-500">
        Estimated cost: ~${(currentPresetAngles.length * 0.03).toFixed(2)} ({currentPresetAngles.length} x $0.03)
      </p>
    </div>
  );
}
