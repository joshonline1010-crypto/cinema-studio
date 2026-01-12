// Scene Sidebar - AI Chat with memory → Full Plan → Approve → Generate
import React, { useState, useRef, useEffect } from 'react';
import { useSceneStore, getModelDisplayName, type SceneShot, type CharacterRef, type Scene } from './sceneStore';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<Scene | null>(null);
  const [sessionId] = useState(() => `plan-${Date.now()}`);

  const [isExpanded, setIsExpanded] = useState(true);
  const [showCharacters, setShowCharacters] = useState(true);
  const [dragOverShotId, setDragOverShotId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const stats = getStats();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message to AI
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setError(null);

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/cinema/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant message to UI
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      // Check if a plan was generated
      if (data.plan) {
        setPendingPlan(data.plan);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Start new chat
  const handleNewChat = async () => {
    try {
      await fetch(`/api/cinema/plan?sessionId=${sessionId}`, { method: 'DELETE' });
    } catch (e) {
      // Ignore errors
    }
    setMessages([]);
    setPendingPlan(null);
    setError(null);
  };

  // Approve and load the plan
  const handleApprovePlan = () => {
    if (pendingPlan) {
      loadScene(pendingPlan);
      setPendingPlan(null);
      setMessages([]);
    }
  };

  // Reject plan and continue chatting
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
            Plan Ready!
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
            Review and approve to load into the grid.
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
            <span>{pendingPlan.shots.length} shots</span>
            <span>~{pendingPlan.duration_estimate}s</span>
            <span>{pendingPlan.mood}</span>
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
                {shot.dialog && <span style={{ color: '#f59e0b' }}> | Dialog</span>}
              </div>
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
            Keep Chatting
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
            Approve & Load
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // NO SCENE - AI CHAT INTERFACE
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
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #333',
          backgroundColor: '#16162a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ margin: '0 0 2px', color: '#fff', fontSize: '14px' }}>Scene Planner</h3>
            <p style={{ margin: 0, fontSize: '10px', color: '#666' }}>
              Chat with AI to plan your video
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#888',
                cursor: 'pointer',
              }}
            >
              New Chat
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '12px',
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>💬</div>
              <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
                Describe the video you want to make.<br />
                I'll help you plan all the shots.
              </p>
              <div style={{ marginTop: '16px', fontSize: '11px', color: '#555', textAlign: 'left' }}>
                <div style={{ marginBottom: '8px', fontWeight: 600, color: '#888' }}>Try:</div>
                <div style={{ marginBottom: '4px' }}>• "2 min video of a ship sinking"</div>
                <div style={{ marginBottom: '4px' }}>• "CHIP discovers a haunted house"</div>
                <div style={{ marginBottom: '4px' }}>• "Dramatic cooking competition"</div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: msg.role === 'user' ? '#4f46e533' : '#333',
                  borderLeft: msg.role === 'user' ? '3px solid #4f46e5' : '3px solid #666',
                }}
              >
                <div style={{
                  fontSize: '10px',
                  color: '#888',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}>
                  {msg.role === 'user' ? 'You' : 'AI Director'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#fff',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div style={{
              marginBottom: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#333',
              borderLeft: '3px solid #666',
            }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>AI DIRECTOR</div>
              <div style={{ fontSize: '12px', color: '#888' }}>Thinking...</div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            margin: '0 12px 12px',
            padding: '10px',
            fontSize: '11px',
            backgroundColor: '#ef444433',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            color: '#ef4444',
          }}>
            {error}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid #333',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your video..."
              disabled={isLoading}
              style={{
                flex: 1,
                minHeight: '60px',
                maxHeight: '120px',
                padding: '10px',
                fontSize: '13px',
                backgroundColor: '#222',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '10px 16px',
                fontSize: '12px',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#888',
                cursor: 'pointer',
              }}
            >
              Import
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !chatInput.trim()}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: isLoading || !chatInput.trim() ? '#333' : '#e8ff00',
                border: 'none',
                borderRadius: '6px',
                color: isLoading || !chatInput.trim() ? '#666' : '#000',
                cursor: isLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
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
            <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
            Generate All ({stats.pending} pending)
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

        {currentScene.shots.map((shot) => (
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
