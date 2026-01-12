// Scene Sidebar - AI Chat → Full Plan → Approve → Generate
import React, { useState, useRef } from 'react';
import { useSceneStore, getModelDisplayName, type SceneShot, type CharacterRef, type Scene } from './sceneStore';

interface SceneSidebarProps {
  onShotSelect?: (shot: SceneShot) => void;
  onCharacterSelect?: (char: CharacterRef) => void;
  onGenerateAll?: () => void;
}

export function SceneSidebar({ onShotSelect, onCharacterSelect, onGenerateAll }: SceneSidebarProps) {
  const {
    currentScene,
    selectedShotId,
    selectShot,
    loadScene,
    importSceneJSON,
    exportSceneJSON,
    getStats,
    clearScene,
  } = useSceneStore();

  // AI Planning State
  const [chatInput, setChatInput] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<Scene | null>(null); // Plan awaiting approval

  const [isExpanded, setIsExpanded] = useState(true);
  const [showCharacters, setShowCharacters] = useState(true);
  const [dragOverShotId, setDragOverShotId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = getStats();

  // Generate plan from AI
  const handleGeneratePlan = async () => {
    if (!chatInput.trim()) return;

    setIsPlanning(true);
    setPlanError(null);

    try {
      const response = await fetch('/api/cinema/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: chatInput,
          style: 'cinematic', // Could be user-selectable
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const plan = await response.json();

      if (plan.error) {
        throw new Error(plan.error);
      }

      // Show plan for approval (don't load yet)
      setPendingPlan(plan);

    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsPlanning(false);
    }
  };

  // Approve and load the plan
  const handleApprovePlan = () => {
    if (pendingPlan) {
      loadScene(pendingPlan);
      setPendingPlan(null);
      setChatInput('');
    }
  };

  // Reject plan and try again
  const handleRejectPlan = () => {
    setPendingPlan(null);
  };

  // Handle file import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = importSceneJSON(json);
      if (!success) {
        alert('Failed to import scene JSON. Check console for errors.');
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle export
  const handleExport = () => {
    const json = exportSceneJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentScene?.scene_id || 'scene'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle shot click
  const handleShotClick = (shot: SceneShot) => {
    selectShot(shot.shot_id);
    onShotSelect?.(shot);
  };

  // Handle character click
  const handleCharacterClick = (char: CharacterRef) => {
    onCharacterSelect?.(char);
  };

  // Get status icon
  const getStatusIcon = (status: SceneShot['status']) => {
    switch (status) {
      case 'done': return '✓';
      case 'generating': return '◐';
      case 'pending': return '○';
      default: return '○';
    }
  };

  // Get status color
  const getStatusColor = (status: SceneShot['status']) => {
    switch (status) {
      case 'done': return '#22c55e';
      case 'generating': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // ============================================
  // PENDING PLAN APPROVAL VIEW
  // ============================================
  if (pendingPlan) {
    return (
      <div style={{
        width: '320px',
        minWidth: '320px',
        backgroundColor: '#1a1a2e',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #333',
          backgroundColor: '#16162a',
        }}>
          <h3 style={{ margin: '0 0 8px', color: '#e8ff00', fontSize: '14px' }}>
            📋 Review Your Plan
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
            AI generated this plan. Review and approve to start generating.
          </p>
        </div>

        {/* Plan Summary */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #333',
          backgroundColor: '#222',
        }}>
          <div style={{ fontSize: '16px', color: '#fff', fontWeight: 600, marginBottom: '8px' }}>
            {pendingPlan.name}
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
            {pendingPlan.description}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#666' }}>
            <span>🎬 {pendingPlan.shots.length} shots</span>
            <span>⏱ ~{pendingPlan.duration_estimate}s</span>
            <span>🎨 {pendingPlan.mood}</span>
          </div>
        </div>

        {/* Characters */}
        {Object.keys(pendingPlan.character_references).length > 0 && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>CHARACTERS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Object.values(pendingPlan.character_references).map(char => (
                <span
                  key={char.id}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: '#333',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                >
                  {char.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Shot List Preview */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{
            padding: '8px 16px',
            fontSize: '11px',
            color: '#888',
            borderBottom: '1px solid #222',
            position: 'sticky',
            top: 0,
            backgroundColor: '#1a1a2e',
          }}>
            SHOTS ({pendingPlan.shots.length})
          </div>

          {pendingPlan.shots.map((shot, idx) => (
            <div
              key={shot.shot_id}
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid #222',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>
                  {idx + 1}. {shot.subject}
                </span>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: shot.model === 'seedance-1.5' ? '#a855f7' :
                                   shot.model === 'kling-o1' ? '#3b82f6' : '#666',
                  color: '#fff',
                }}>
                  {getModelDisplayName(shot.model).split(' ')[0]}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {shot.shot_type} | {shot.duration}s
                {shot.dialog && <span style={{ color: '#f59e0b' }}> | 🗣 Dialog</span>}
              </div>
              {shot.narrative_beat && (
                <div style={{ fontSize: '10px', color: '#4f46e5', marginTop: '4px' }}>
                  Beat: {shot.narrative_beat.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Approval Actions */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #333',
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={handleRejectPlan}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13px',
              backgroundColor: '#333',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ✕ Try Again
          </button>
          <button
            onClick={handleApprovePlan}
            style={{
              flex: 2,
              padding: '12px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#22c55e',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            ✓ Approve & Load
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // NO SCENE - AI CHAT INPUT
  // ============================================
  if (!currentScene) {
    return (
      <div style={{
        width: '320px',
        minWidth: '320px',
        backgroundColor: '#1a1a2e',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #333',
          backgroundColor: '#16162a',
        }}>
          <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '14px' }}>Scene Planner</h3>
          <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>
            Describe your video and AI will plan all the shots
          </p>
        </div>

        {/* AI Chat Input */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Describe your video...

Example:
• 2 minute video of Yode discovering the ship is sinking
• Opening shot of calm ocean, then chaos erupts
• Include Peely and Fishstick as side characters
• Dramatic climax with ship tilting"
            style={{
              flex: 1,
              minHeight: '200px',
              padding: '12px',
              fontSize: '13px',
              backgroundColor: '#222',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />

          {planError && (
            <div style={{
              marginTop: '12px',
              padding: '10px',
              fontSize: '12px',
              backgroundColor: '#ef444433',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              color: '#ef4444',
            }}>
              {planError}
            </div>
          )}

          <button
            onClick={handleGeneratePlan}
            disabled={isPlanning || !chatInput.trim()}
            style={{
              marginTop: '16px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: isPlanning ? '#333' : '#e8ff00',
              border: 'none',
              borderRadius: '8px',
              color: isPlanning ? '#666' : '#000',
              cursor: isPlanning || !chatInput.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isPlanning ? (
              <>
                <span className="animate-spin" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #666',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                }} />
                Planning...
              </>
            ) : (
              <>🎬 Generate Plan</>
            )}
          </button>
        </div>

        {/* Or Import */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #333',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
            Or import an existing plan
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '10px 20px',
              fontSize: '12px',
              backgroundColor: '#333',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#888',
              cursor: 'pointer',
            }}
          >
            Import JSON
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // SCENE LOADED - SHOT LIST VIEW
  // ============================================
  const characters = Object.values(currentScene.character_references);

  return (
    <div style={{
      width: '320px',
      minWidth: '320px',
      backgroundColor: '#1a1a2e',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #333',
        backgroundColor: '#16162a',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <h3 style={{
            margin: 0,
            color: '#fff',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>🎬</span>
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentScene.name}
            </span>
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {isExpanded && (
          <div style={{ fontSize: '11px', color: '#888' }}>
            <div>{stats.total} shots | ~{currentScene.duration_estimate}s</div>
            <div>Mood: {currentScene.mood}</div>
            {currentScene.director && <div>Director: {currentScene.director}</div>}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid #333',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#888',
          marginBottom: '4px',
        }}>
          <span>Progress</span>
          <span>{stats.done}/{stats.total} ({Math.round((stats.done / stats.total) * 100 || 0)}%)</span>
        </div>
        <div style={{
          height: '4px',
          backgroundColor: '#333',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(stats.done / stats.total) * 100 || 0}%`,
            backgroundColor: '#22c55e',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* Generate All Button */}
      {stats.pending > 0 && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
          <button
            onClick={onGenerateAll}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#e8ff00',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            ⚡ Generate All ({stats.pending} pending)
          </button>
        </div>
      )}

      {/* Characters section */}
      {characters.length > 0 && (
        <div style={{ borderBottom: '1px solid #333' }}>
          <div
            onClick={() => setShowCharacters(!showCharacters)}
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#888',
            }}
          >
            <span>CHARACTERS ({characters.length})</span>
            <span>{showCharacters ? '▼' : '▶'}</span>
          </div>

          {showCharacters && (
            <div style={{
              padding: '0 16px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}>
              {characters.map(char => (
                <button
                  key={char.id}
                  onClick={() => handleCharacterClick(char)}
                  title={`${char.description}\nCostume: ${char.costume}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: char.ref_url ? '#22c55e33' : '#333',
                    border: `1px solid ${char.ref_url ? '#22c55e' : '#444'}`,
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {char.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shots list */}
      <div style={{
        flex: 1,
        overflow: 'auto',
      }}>
        <div style={{
          padding: '8px 16px',
          fontSize: '12px',
          color: '#888',
          borderBottom: '1px solid #222',
          position: 'sticky',
          top: 0,
          backgroundColor: '#1a1a2e',
          zIndex: 1,
        }}>
          SHOTS ({stats.done}/{stats.total} done)
        </div>

        {currentScene.shots.map((shot, index) => (
          <div
            key={shot.shot_id}
            onClick={() => handleShotClick(shot)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverShotId(shot.shot_id);
            }}
            onDragLeave={() => setDragOverShotId(null)}
            onDrop={() => setDragOverShotId(null)}
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              backgroundColor: selectedShotId === shot.shot_id
                ? '#4f46e533'
                : dragOverShotId === shot.shot_id
                  ? '#ffffff11'
                  : 'transparent',
              borderLeft: selectedShotId === shot.shot_id
                ? '3px solid #4f46e5'
                : '3px solid transparent',
              borderBottom: '1px solid #222',
              transition: 'background-color 0.15s',
            }}
          >
            {/* Status icon */}
            <span style={{
              color: getStatusColor(shot.status),
              fontSize: '12px',
              width: '14px',
            }}>
              {getStatusIcon(shot.status)}
            </span>

            {/* Thumbnail or placeholder */}
            <div style={{
              width: '40px',
              height: '24px',
              backgroundColor: '#333',
              borderRadius: '3px',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              {shot.image_url && (
                <img
                  src={shot.image_url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Shot info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '12px',
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {shot.shot_id.replace('shot_', '')} {shot.subject}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#666',
                display: 'flex',
                gap: '8px',
              }}>
                <span>{shot.shot_type}</span>
                <span style={{
                  color: shot.model === 'seedance-1.5' ? '#a855f7' :
                         shot.model === 'kling-o1' ? '#3b82f6' : '#6b7280',
                }}>
                  {getModelDisplayName(shot.model).split(' ')[0]}
                </span>
                {shot.dialog && <span style={{ color: '#f59e0b' }}>🗣</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #333',
        display: 'flex',
        gap: '8px',
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '11px',
            backgroundColor: '#333',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Import
        </button>

        <button
          onClick={handleExport}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '11px',
            backgroundColor: '#333',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Export
        </button>

        <button
          onClick={clearScene}
          title="Clear scene"
          style={{
            padding: '8px 12px',
            fontSize: '11px',
            backgroundColor: '#333',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#888',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
