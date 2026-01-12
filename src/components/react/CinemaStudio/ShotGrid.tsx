// Shot Grid - Visual storyboard view
import React, { useState } from 'react';
import { useSceneStore, getModelDisplayName, getTransitionIcon, type SceneShot } from './sceneStore';

interface ShotGridProps {
  onShotSelect?: (shot: SceneShot) => void;
  onGenerateShot?: (shot: SceneShot) => void;
  onGenerateVideo?: (shot: SceneShot) => void;
}

export function ShotGrid({ onShotSelect, onGenerateShot, onGenerateVideo }: ShotGridProps) {
  const {
    currentScene,
    selectedShotId,
    selectShot,
    getStats,
  } = useSceneStore();

  const [selectedShots, setSelectedShots] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = getStats();

  // Toggle multi-select
  const toggleSelectShot = (shotId: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      const newSelection = new Set(selectedShots);
      if (newSelection.has(shotId)) {
        newSelection.delete(shotId);
      } else {
        newSelection.add(shotId);
      }
      setSelectedShots(newSelection);
    } else {
      // Single select
      setSelectedShots(new Set([shotId]));
      selectShot(shotId);
      const shot = currentScene?.shots.find(s => s.shot_id === shotId);
      if (shot) onShotSelect?.(shot);
    }
  };

  // Get model color
  const getModelColor = (model: string) => {
    switch (model) {
      case 'seedance-1.5': return '#a855f7';  // Purple
      case 'kling-o1': return '#3b82f6';       // Blue
      case 'kling-2.6': return '#6b7280';      // Gray
      default: return '#6b7280';
    }
  };

  // Get status background
  const getStatusBg = (status: SceneShot['status']) => {
    switch (status) {
      case 'done': return '#22c55e22';
      case 'generating': return '#f59e0b22';
      case 'pending': return 'transparent';
      default: return 'transparent';
    }
  };

  if (!currentScene) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>🎬</div>
          <p>Import a scene to see the storyboard</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f0f1a',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#16162a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff', fontWeight: 500 }}>{currentScene.name}</span>
          <span style={{ color: '#666', fontSize: '12px' }}>
            {currentScene.mood} | {currentScene.aspect_ratio}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#333',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? '#4f46e5' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#4f46e5' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              List
            </button>
          </div>

          {/* Stats */}
          <span style={{ color: '#888', fontSize: '12px' }}>
            {stats.done}/{stats.total} done
          </span>
        </div>
      </div>

      {/* Grid view */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gap: '12px',
        }}>
          {currentScene.shots.map((shot, index) => (
            <div
              key={shot.shot_id}
              onClick={(e) => toggleSelectShot(shot.shot_id, e)}
              style={{
                backgroundColor: selectedShots.has(shot.shot_id) || selectedShotId === shot.shot_id
                  ? '#4f46e533'
                  : '#1a1a2e',
                border: `1px solid ${
                  selectedShots.has(shot.shot_id) || selectedShotId === shot.shot_id
                    ? '#4f46e5'
                    : '#333'
                }`,
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                aspectRatio: currentScene.aspect_ratio === '2.35:1' ? '2.35/1' :
                             currentScene.aspect_ratio === '21:9' ? '21/9' : '16/9',
                backgroundColor: getStatusBg(shot.status),
                position: 'relative',
                overflow: 'hidden',
              }}>
                {shot.image_url ? (
                  <img
                    src={shot.image_url}
                    alt={shot.subject}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#222',
                    color: '#444',
                    fontSize: '24px',
                  }}>
                    {shot.status === 'generating' ? '◐' : index + 1}
                  </div>
                )}

                {/* Status badge */}
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  backgroundColor: shot.status === 'done' ? '#22c55e' :
                                   shot.status === 'generating' ? '#f59e0b' : '#333',
                  color: '#fff',
                }}>
                  {shot.shot_id.replace('shot_', '')}
                </div>

                {/* Model badge */}
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  padding: '2px 6px',
                  fontSize: '9px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  backgroundColor: getModelColor(shot.model),
                  color: '#fff',
                }}>
                  {getModelDisplayName(shot.model).split(' ')[0]}
                </div>

                {/* Dialog indicator */}
                {shot.dialog && (
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    borderRadius: '4px',
                    backgroundColor: '#f59e0b',
                    color: '#000',
                  }}>
                    🗣 Dialog
                  </div>
                )}

                {/* Transition indicator */}
                {shot.transition_out && shot.transition_out !== 'cut' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    right: '6px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    borderRadius: '4px',
                    backgroundColor: '#666',
                    color: '#fff',
                  }}>
                    {getTransitionIcon(shot.transition_out)} {shot.transition_out}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '10px' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#fff',
                  fontWeight: 500,
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {shot.subject}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  display: 'flex',
                  gap: '8px',
                }}>
                  <span>{shot.shot_type}</span>
                  <span>{shot.duration}s</span>
                </div>
                {shot.narrative_beat && (
                  <div style={{
                    fontSize: '10px',
                    color: '#4f46e5',
                    marginTop: '4px',
                  }}>
                    {shot.narrative_beat.replace(/_/g, ' ')}
                  </div>
                )}
              </div>

              {/* Actions (shown on hover/select) */}
              {(selectedShots.has(shot.shot_id) || selectedShotId === shot.shot_id) && (
                <div style={{
                  padding: '8px 10px',
                  borderTop: '1px solid #333',
                  display: 'flex',
                  gap: '6px',
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateShot?.(shot);
                    }}
                    disabled={shot.status === 'generating'}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '10px',
                      backgroundColor: '#4f46e5',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: shot.status === 'generating' ? 'not-allowed' : 'pointer',
                      opacity: shot.status === 'generating' ? 0.5 : 1,
                    }}
                  >
                    {shot.image_url ? 'Regen' : 'Generate'}
                  </button>
                  {shot.image_url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateVideo?.(shot);
                      }}
                      disabled={shot.status === 'generating'}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '10px',
                        backgroundColor: '#333',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: shot.status === 'generating' ? 'not-allowed' : 'pointer',
                        opacity: shot.status === 'generating' ? 0.5 : 1,
                      }}
                    >
                      Video
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar - batch actions */}
      {selectedShots.size > 1 && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #333',
          backgroundColor: '#16162a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: '#888', fontSize: '12px' }}>
            {selectedShots.size} shots selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedShots(new Set())}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Clear Selection
            </button>
            <button
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                backgroundColor: '#4f46e5',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Generate Selected ({selectedShots.size})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
