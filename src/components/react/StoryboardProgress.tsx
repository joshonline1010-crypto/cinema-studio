import { useState, useEffect } from 'react';

interface CheckpointData {
  type: string;
  description: string;
  cell_picked?: number;
  reference_image?: string;
}

interface IntakeState {
  current_phase: string;
  status: string;
  locked: Record<string, CheckpointData>;
  gaps_to_fill: string[];
  checkpoints_completed: string[];
  beats: Array<{
    beat_number: number;
    scene: string;
    description: string;
  }>;
  reference_images: Record<string, string>;
}

interface StoryboardProgressProps {
  projectId: string | null;
  userId: string;
}

// All possible checkpoints in story order
const ALL_CHECKPOINTS = [
  { id: 'genre', label: 'STYLE', icon: '🎨', description: 'Genre & tone' },
  { id: 'opening', label: 'OPENING', icon: '🎬', description: 'How it starts' },
  { id: 'character', label: 'CHARACTER', icon: '👤', description: 'Character look' },
  { id: 'environment', label: 'LOCATION', icon: '🏰', description: 'Where it happens' },
  { id: 'scare', label: 'TENSION', icon: '😱', description: 'Scary moment' },
  { id: 'reveal', label: 'REVEAL', icon: '💡', description: 'Truth revealed' },
  { id: 'ending', label: 'ENDING', icon: '🎭', description: 'How it ends' },
];

export default function StoryboardProgress({ projectId, userId }: StoryboardProgressProps) {
  const [state, setState] = useState<IntakeState | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch state when projectId changes
  useEffect(() => {
    if (!projectId) {
      setState(null);
      return;
    }

    const fetchState = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}/state`);
        if (response.ok) {
          const data = await response.json();
          setState(data);
        } else if (response.status === 404) {
          // No state yet - that's okay
          setState(null);
        } else {
          throw new Error('Failed to fetch state');
        }
      } catch (e) {
        console.error('Error fetching state:', e);
        setError('Failed to load story progress');
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();

    // Poll for updates every 3 seconds
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [projectId]);

  // Always show - even without project, show empty state

  // Show minimal state when loading initially
  if (isLoading && !state) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-white/50">
          <div className="w-4 h-4 border-2 border-white/30 border-t-violet-400 rounded-full animate-spin" />
          <span className="text-sm">Loading story progress...</span>
        </div>
      </div>
    );
  }

  // If no project or no state, show default storyboard template
  if (!projectId || !state) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">📖</span>
            <span className="text-sm font-medium">Story Progress</span>
            <span className="px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded-full">
              0/7 locked
            </span>
          </div>
          <span className="text-xs text-white/40">Start chatting to build your story</span>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {ALL_CHECKPOINTS.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className="p-3 rounded-lg border border-dashed border-white/20 bg-white/5"
              >
                <div className="text-xl mb-1 opacity-50">{checkpoint.icon}</div>
                <div className="text-xs font-medium text-white/50 truncate">{checkpoint.label}</div>
                <div className="text-[10px] text-white/30 mt-1">{checkpoint.description}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-3 h-3 border border-white/20 rounded-full" />
                  <span className="text-[10px] text-white/30">Empty</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const lockedCount = state.checkpoints_completed?.length || 0;
  const totalNeeded = (state.gaps_to_fill?.length || 0) + lockedCount;
  const progressPercent = totalNeeded > 0 ? (lockedCount / totalNeeded) * 100 : 0;

  // Get relevant checkpoints (completed + gaps)
  const relevantCheckpoints = ALL_CHECKPOINTS.filter(cp =>
    state.checkpoints_completed?.includes(cp.id) ||
    state.gaps_to_fill?.includes(cp.id)
  );

  // If no checkpoints identified yet, show the phase
  if (relevantCheckpoints.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <span className="text-sm font-medium text-white/70">Story Progress</span>
            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full">
              {state.current_phase?.replace('_', ' ')}
            </span>
          </div>
          <span className="text-xs text-white/40">Gathering story details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📖</span>
          <span className="text-sm font-medium">Story Progress</span>
          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full">
            {lockedCount}/{totalNeeded} locked
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini progress bar */}
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <svg
            className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {/* Phase indicator */}
          <div className="flex items-center gap-2 mb-4 text-xs text-white/50">
            <span>Phase:</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-white/70">
              {state.current_phase?.replace('_', ' ')}
            </span>
            {state.status === 'ALL_LOCKED' && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                Ready for Storyboard!
              </span>
            )}
          </div>

          {/* Checkpoint cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {relevantCheckpoints.map((checkpoint) => {
              const isLocked = state.checkpoints_completed?.includes(checkpoint.id);
              const lockedData = state.locked?.[checkpoint.id];
              const refImage = state.reference_images?.[checkpoint.id];

              return (
                <div
                  key={checkpoint.id}
                  className={`relative p-3 rounded-lg border transition-all ${
                    isLocked
                      ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/30'
                      : 'bg-white/5 border-dashed border-white/20'
                  }`}
                >
                  {/* Reference image thumbnail */}
                  {refImage && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-violet-500">
                      <img src={refImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-xl mb-1">{checkpoint.icon}</div>

                  {/* Label */}
                  <div className="text-xs font-medium text-white/80 truncate">
                    {checkpoint.label}
                  </div>

                  {/* Status */}
                  {isLocked ? (
                    <div className="mt-1">
                      <div className="text-[10px] text-violet-300 truncate" title={lockedData?.type}>
                        {lockedData?.type || 'Locked'}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] text-green-400">Locked</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <div className="text-[10px] text-white/40">{checkpoint.description}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-3 h-3 border border-white/30 rounded-full" />
                        <span className="text-[10px] text-white/40">Pending</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Story beats if any */}
          {state.beats && state.beats.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-white/50 mb-2">Story Beats:</div>
              <div className="flex flex-wrap gap-2">
                {state.beats.map((beat, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 bg-white/5 rounded text-xs text-white/70"
                    title={beat.description}
                  >
                    {beat.beat_number}. {beat.scene}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked elements summary */}
          {Object.keys(state.locked || {}).length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-white/50 mb-2">Locked Decisions:</div>
              <div className="space-y-1">
                {Object.entries(state.locked).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 text-xs">
                    <span className="text-violet-400 font-medium uppercase min-w-[60px]">{key}:</span>
                    <span className="text-white/70 truncate" title={value.description}>
                      {value.type} {value.description ? `- ${value.description.substring(0, 50)}...` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
