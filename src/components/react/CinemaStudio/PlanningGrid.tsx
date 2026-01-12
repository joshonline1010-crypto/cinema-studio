// Planning Grid - Visual storyboard matching tracker.html layout
import React, { useState } from 'react';
import { useSceneStore, getModelDisplayName, type SceneShot } from './sceneStore';

interface Segment {
  id: string;
  name: string;
  shots: SceneShot[];
  duration: number;
  shipDamage?: number;
  distance?: number;
}

interface PlanningGridProps {
  onShotSelect?: (shot: SceneShot) => void;
  onGenerateShot?: (shot: SceneShot) => void;
}

export function PlanningGrid({ onShotSelect, onGenerateShot }: PlanningGridProps) {
  const { currentScene, selectedShotId, selectShot, getStats } = useSceneStore();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set(['all']));

  const stats = getStats();

  // Group shots into segments based on narrative_beat or shot_id prefix
  const getSegments = (): Segment[] => {
    if (!currentScene) return [];

    const segmentMap = new Map<string, SceneShot[]>();

    currentScene.shots.forEach(shot => {
      // Extract segment from shot_id (e.g., "B01_C01" -> "B01") or narrative_beat
      let segmentId = 'MAIN';

      if (shot.shot_id.includes('_')) {
        // Format: B01_C01, S01_B01_C01, etc.
        const parts = shot.shot_id.split('_');
        if (parts.length >= 2) {
          segmentId = parts.slice(0, -1).join('_'); // Everything except last part
        }
      } else if (shot.narrative_beat) {
        // Use narrative beat as segment
        segmentId = shot.narrative_beat.split('_')[0].toUpperCase();
      }

      if (!segmentMap.has(segmentId)) {
        segmentMap.set(segmentId, []);
      }
      segmentMap.get(segmentId)!.push(shot);
    });

    // Convert to array and calculate totals
    return Array.from(segmentMap.entries()).map(([id, shots]) => ({
      id,
      name: formatSegmentName(id),
      shots: shots.sort((a, b) => a.order - b.order),
      duration: shots.reduce((sum, s) => sum + s.duration, 0),
    }));
  };

  const formatSegmentName = (id: string): string => {
    // Convert segment IDs to readable names
    const nameMap: Record<string, string> = {
      'INTRO': 'Intro',
      'S01': 'Smooth Sailing',
      'S02': 'Toilets Explode',
      'S03': 'Seagull Attack',
      'S04': 'Giant Waves',
      'S05': 'Super Speed',
      'B01': 'Beat 1',
      'B02': 'Beat 2',
      'MAIN': 'Main Scene',
    };
    return nameMap[id] || id;
  };

  const toggleSegment = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId);
    } else {
      newExpanded.add(segmentId);
    }
    setExpandedSegments(newExpanded);
  };

  const expandAll = () => {
    const allIds = segments.map(s => s.id);
    setExpandedSegments(new Set(allIds));
  };

  const handleShotClick = (shot: SceneShot) => {
    selectShot(shot.shot_id);
    onShotSelect?.(shot);
  };

  // Get model badge color
  const getModelBadge = (model: string) => {
    switch (model) {
      case 'seedance-1.5':
        return { bg: '#a855f7', text: 'SEEDANCE' };
      case 'kling-o1':
        return { bg: '#3b82f6', text: 'KLING O1' };
      case 'kling-2.6':
        return { bg: '#6b7280', text: 'KLING 2.6' };
      default:
        return { bg: '#666', text: model.toUpperCase() };
    }
  };

  const segments = getSegments();

  // Calculate costs
  const costPerShot = 0.43; // From CLAUDE.md
  const totalCost = stats.total * costPerShot;
  const spentCost = stats.done * costPerShot;
  const totalDuration = currentScene?.duration_estimate || segments.reduce((sum, s) => sum + s.duration, 0);

  // Filter segments
  const filteredSegments = activeFilter === 'all'
    ? segments
    : activeFilter === 'done'
      ? segments.map(s => ({ ...s, shots: s.shots.filter(shot => shot.status === 'done') })).filter(s => s.shots.length > 0)
      : segments.filter(s => s.id.toLowerCase().includes(activeFilter.toLowerCase()));

  if (!currentScene) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        color: '#666',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🎬</div>
          <p>Generate a plan to see the storyboard grid</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      overflow: 'hidden',
    }}>
      {/* Header with stats - matching tracker.html */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: Title and tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111' }}>
            {currentScene.name}
          </h2>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#f0f0f0', borderRadius: '6px', padding: '2px' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: activeFilter === 'all' ? '#fff' : 'transparent',
                color: activeFilter === 'all' ? '#111' : '#666',
                boxShadow: activeFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              All <span style={{ color: '#22c55e' }}>{Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}</span>
            </button>
            {segments.slice(0, 4).map(seg => (
              <button
                key={seg.id}
                onClick={() => setActiveFilter(seg.id)}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeFilter === seg.id ? '#fff' : 'transparent',
                  color: activeFilter === seg.id ? '#111' : '#666',
                  boxShadow: activeFilter === seg.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {seg.id} <span style={{ color: '#888' }}>{Math.floor(seg.duration / 60)}:{String(seg.duration % 60).padStart(2, '0')}</span>
              </button>
            ))}
            <button
              onClick={() => setActiveFilter('done')}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: activeFilter === 'done' ? '#fff' : 'transparent',
                color: activeFilter === 'done' ? '#111' : '#666',
                boxShadow: activeFilter === 'done' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Done
            </button>
          </div>
        </div>

        {/* Right: Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
              {stats.done}/{stats.total}
            </div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>SHOTS</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>
              {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>DURATION</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>
              ${spentCost.toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>SPENT</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>
              ${totalCost.toFixed(0)}
            </div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>EST TOTAL</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#e0e0e0' }}>
        <div style={{
          height: '100%',
          width: `${(stats.done / stats.total) * 100}%`,
          backgroundColor: '#22c55e',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Filter bar */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={expandAll}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#333',
          }}
        >
          Expand All
        </button>
      </div>

      {/* Segments Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        {filteredSegments.map(segment => {
          const segmentDone = segment.shots.filter(s => s.status === 'done').length;
          const isExpanded = expandedSegments.has(segment.id) || expandedSegments.has('all');

          return (
            <div
              key={segment.id}
              style={{
                marginBottom: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
              }}
            >
              {/* Segment Header */}
              <div
                onClick={() => toggleSegment(segment.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: '#fafafa',
                  borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 600, color: '#111' }}>{segment.id}</span>
                  <span style={{ color: '#666' }}>{segment.name}</span>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: '#e8ff00',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#000',
                  }}>
                    {Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')}
                  </span>
                  <span style={{ color: '#888', fontSize: '13px' }}>
                    {segmentDone}/{segment.shots.length}
                  </span>
                  {/* Progress bar */}
                  <div style={{
                    width: '100px',
                    height: '4px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(segmentDone / segment.shots.length) * 100}%`,
                      backgroundColor: '#22c55e',
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {/* Shots Grid */}
              {isExpanded && (
                <div style={{
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '12px',
                }}>
                  {segment.shots.map(shot => {
                    const badge = getModelBadge(shot.model);
                    const isSelected = selectedShotId === shot.shot_id;

                    return (
                      <div
                        key={shot.shot_id}
                        onClick={() => handleShotClick(shot)}
                        style={{
                          backgroundColor: isSelected ? '#f0f7ff' : '#fafafa',
                          border: `2px solid ${isSelected ? '#3b82f6' : shot.status === 'done' ? '#22c55e' : '#e0e0e0'}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          aspectRatio: '16/9',
                          backgroundColor: shot.status === 'done' ? '#e8ffe8' : '#f0f0f0',
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          {shot.image_url ? (
                            <img
                              src={shot.image_url}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#999',
                              fontSize: '11px',
                            }}>
                              {shot.status === 'generating' ? '◐' : ''}
                            </div>
                          )}
                        </div>

                        {/* Shot Info */}
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                          }}>
                            <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
                              {shot.shot_id.split('_').pop()}
                            </span>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: '3px',
                              backgroundColor: badge.bg,
                              color: '#fff',
                            }}>
                              {badge.text}
                            </span>
                          </div>
                          {shot.dialog && (
                            <span style={{
                              fontSize: '9px',
                              color: '#f59e0b',
                            }}>
                              🗣 Dialog
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
