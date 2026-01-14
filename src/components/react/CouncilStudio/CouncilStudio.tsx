// CouncilStudio - Main component for the multi-agent film production system
import React, { useState, useRef, useEffect } from 'react';
import { useCouncilStore } from './councilStore';
import CouncilPanel from './components/CouncilPanel';
import DatabaseExplorer from './components/DatabaseExplorer';
import type { ShotContext, Shot, RefImage } from './agents/types';

// ============================================
// SESSION MANAGER COMPONENT
// ============================================

function SessionManager() {
  const {
    currentSessionName,
    sessionList,
    hasUnsavedChanges,
    saveSession,
    loadSession,
    listSessions,
    deleteSession,
    newSession
  } = useCouncilStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Load sessions on mount
  useEffect(() => {
    listSessions();
  }, []);

  const handleSave = async () => {
    const name = saveName.trim() || currentSessionName || `session_${Date.now()}`;
    try {
      await saveSession(name);
      setShowSaveDialog(false);
      setSaveName('');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleLoad = async (name: string) => {
    try {
      await loadSession(name);
      setShowDropdown(false);
    } catch (err) {
      console.error('Load failed:', err);
    }
  };

  const handleDelete = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete session "${name}"?`)) {
      await deleteSession(name);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Session Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs transition-colors"
        >
          <span className="text-zinc-400">📁</span>
          <span className="text-zinc-300 max-w-[120px] truncate">
            {currentSessionName || 'No Session'}
          </span>
          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes" />
          )}
          <span className="text-zinc-500">▼</span>
        </button>

        {/* Quick Save */}
        <button
          onClick={() => currentSessionName ? saveSession(currentSessionName) : setShowSaveDialog(true)}
          className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-400 hover:text-white transition-colors"
          title="Save session"
        >
          💾
        </button>

        {/* New Session */}
        <button
          onClick={newSession}
          className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-400 hover:text-white transition-colors"
          title="New session"
        >
          ➕
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50">
          <div className="p-2 border-b border-zinc-800">
            <button
              onClick={() => { setShowSaveDialog(true); setShowDropdown(false); }}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium text-white transition-colors"
            >
              💾 Save Current Session
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {sessionList.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-xs">
                No saved sessions
              </div>
            ) : (
              sessionList.map((session) => (
                <div
                  key={session.name}
                  onClick={() => handleLoad(session.name)}
                  className={`flex items-center justify-between px-3 py-2 hover:bg-zinc-800 cursor-pointer transition-colors ${
                    currentSessionName === session.name ? 'bg-zinc-800' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-300 truncate">
                      {session.displayName || session.name}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {formatDate(session.updatedAt)} • {session.messageCount || 0} msgs
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(session.name, e)}
                    className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 w-80">
            <h3 className="text-sm font-bold mb-3">Save Session</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={currentSessionName || "Enter session name..."}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium"
              >
                Save
              </button>
              <button
                onClick={() => { setShowSaveDialog(false); setSaveName(''); }}
                className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

// ============================================
// TEST COUNCIL FORM - Direct council testing
// ============================================

function TestCouncilForm() {
  const [prompt, setPrompt] = useState('');
  const [director, setDirector] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { runMeeting, clearMeeting } = useCouncilStore();

  const directors = [
    { id: 'kubrick', name: 'Kubrick', style: 'Symmetry • Cold • Dread' },
    { id: 'spielberg', name: 'Spielberg', style: 'Wonder • Warmth • Emotion' },
    { id: 'fincher', name: 'Fincher', style: 'Grit • Control • Shadow' },
    { id: 'nolan', name: 'Nolan', style: 'Scale • Time • Practical' },
    { id: 'villeneuve', name: 'Villeneuve', style: 'Vast • Silence • Awe' },
    { id: 'tarantino', name: 'Tarantino', style: 'Dialogue • Violence • Pop' },
    { id: 'wes_anderson', name: 'Wes Anderson', style: 'Symmetry • Pastel • Whimsy' },
    { id: 'edgar_wright', name: 'Edgar Wright', style: 'Cuts • Comedy • Energy' },
  ];

  const examplePrompts = [
    { text: "CHIP walks through a haunted mansion, slow push-in on his face", icon: "👻" },
    { text: "A dramatic car chase through neon-lit Tokyo at night", icon: "🏎️" },
    { text: "Close-up of a hand reaching for a mysterious artifact, golden light", icon: "✋" },
    { text: "Two characters arguing in a diner, camera orbits around them", icon: "🍽️" },
    { text: "Hero speaks an emotional monologue while rain falls behind them", icon: "🌧️" },
  ];

  const handleRunCouncil = async () => {
    if (!prompt.trim()) return;

    setIsRunning(true);
    clearMeeting();

    const context = {
      shot: {
        id: `test_shot_${Date.now()}`,
        order: 1,
        prompt: prompt,
        motionPrompt: '',
        duration: '5',
        status: 'pending' as const
      },
      refs: [],
      previousShots: [],
      userPrompt: prompt,
      director: director || undefined
    };

    try {
      await runMeeting(context);
    } catch (err) {
      console.error('Council meeting failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/50">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-zinc-700'}`} />
        <h2 className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase">
          Mission Brief
        </h2>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Shot Description
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your shot..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
          rows={4}
          disabled={isRunning}
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.02) 23px, rgba(255,255,255,0.02) 24px)'
          }}
        />
        <div className="text-[9px] text-zinc-600 mt-1 uppercase tracking-wider">
          {prompt.length} characters
        </div>
      </div>

      {/* Director Selection - Grid */}
      <div>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
          Director Override <span className="text-zinc-600 font-normal">(optional)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {directors.map(d => (
            <button
              key={d.id}
              onClick={() => setDirector(director === d.id ? '' : d.id)}
              disabled={isRunning}
              className={`p-3 rounded-lg border text-left transition-all ${
                director === d.id
                  ? 'border-blue-500/50 bg-blue-950/30'
                  : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className={`text-xs font-bold ${director === d.id ? 'text-blue-400' : 'text-zinc-300'}`}>
                {d.name}
              </div>
              <div className="text-[9px] text-zinc-500 mt-0.5">
                {d.style}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleRunCouncil}
        disabled={!prompt.trim() || isRunning}
        className={`w-full py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
          isRunning
            ? 'bg-gradient-to-r from-red-600 to-orange-600 cursor-wait'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed'
        } shadow-lg ${isRunning ? 'shadow-red-500/20' : 'shadow-blue-500/20'}`}
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-3">
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            Agents Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-lg">⚡</span>
            Deploy Council
          </span>
        )}
      </button>

      {/* Example Prompts */}
      <div className="pt-6 border-t border-zinc-800/30">
        <div className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mb-3">
          Quick Deploy
        </div>
        <div className="space-y-2">
          {examplePrompts.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex.text)}
              disabled={isRunning}
              className="w-full flex items-center gap-3 p-3 bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/30 hover:border-zinc-700/50 rounded-lg transition-all text-left group"
            >
              <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">{ex.icon}</span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors line-clamp-1">
                {ex.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CouncilStudio() {
  const {
    // State
    messages,
    isLoading,
    currentPlan,
    refs,
    councilEnabled,
    currentMeeting,
    consensus,
    activeTab,
    showCouncilPanel,
    autoApprove,
    selectedDirector,
    pipelinePhase,
    generatedAssets,
    finalVideoUrl,

    // Actions
    addMessage,
    setLoading,
    setPlan,
    runMeeting,
    clearMeeting,
    setActiveTab,
    setShowCouncilPanel,
    setAutoApprove,
    setSelectedDirector,
    setPipelinePhase,
  } = useCouncilStore();

  // Local state
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message
    addMessage({ role: 'user', content: userMessage });
    setLoading(true);

    try {
      // Call AI endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          model: 'claude-opus',
          systemPrompt: buildSystemPrompt(),
          sessionId: `council_${Date.now()}`
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      const aiResponse = data.response || data.content || '';

      // Add AI response
      addMessage({ role: 'assistant', content: aiResponse });

      // Try to extract plan from response
      const plan = extractPlanFromResponse(aiResponse);
      if (plan) {
        setPlan(plan);

        // If council is enabled, run a meeting
        if (councilEnabled && plan.shots && plan.shots.length > 0) {
          await runCouncilForPlan(plan, userMessage);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      addMessage({
        role: 'system',
        content: `Error: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const runCouncilForPlan = async (plan: any, userPrompt: string) => {
    if (!plan.shots || plan.shots.length === 0) return;

    // Run council meeting for first shot
    const firstShot: Shot = {
      id: plan.shots[0].id || 'shot_001',
      order: 1,
      prompt: plan.shots[0].prompt || plan.shots[0].photo_prompt || '',
      motionPrompt: plan.shots[0].motion_prompt || '',
      duration: plan.shots[0].duration || '5',
      status: 'pending'
    };

    const context: ShotContext = {
      shot: firstShot,
      refs,
      previousShots: [],
      plan,
      userPrompt,
      director: selectedDirector || undefined
    };

    try {
      await runMeeting(context);
    } catch (err) {
      console.error('Council meeting failed:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const buildSystemPrompt = () => {
    return `You are an AI Film Director Assistant working with a Council of specialist agents.

When the user describes a video they want to create, you should:
1. Analyze their request
2. Create a shot-by-shot plan
3. Output a JSON plan that the Council can evaluate

OUTPUT FORMAT (include in your response):
\`\`\`json
{
  "name": "Plan name",
  "description": "Brief description",
  "shots": [
    {
      "id": "shot_001",
      "prompt": "Photo prompt for this shot",
      "motion_prompt": "Motion/video prompt",
      "duration": "5",
      "camera": {
        "framing": "MCU",
        "movement": "dolly_in"
      }
    }
  ]
}
\`\`\`

RULES:
- Duration must be "5" or "10" (Kling only allows these)
- Motion prompts should end with "then settles" or "then holds"
- Use power verbs: STRIDE, BILLOW, CHARGE, SURGE
- One camera movement per shot

The Council of agents will then evaluate your plan:
- NARRATIVE AGENT: Story beats and pacing
- VISUAL AGENT: Director style and cinematography
- TECHNICAL AGENT: Model selection and costs
- PRODUCTION AGENT: Continuity and chaining`;
  };

  const extractPlanFromResponse = (response: string): any => {
    // Try to find JSON in the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse plan JSON:', e);
      }
    }

    // Try to find raw JSON
    const rawJsonMatch = response.match(/\{[\s\S]*"shots"[\s\S]*\}/);
    if (rawJsonMatch) {
      try {
        return JSON.parse(rawJsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse raw plan JSON:', e);
      }
    }

    return null;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex-none h-14 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Council Studio</h1>
          <SessionManager />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {(['chat', 'council', 'database', 'pipeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab === 'chat' && '💬 '}
              {tab === 'council' && '👥 '}
              {tab === 'database' && '🎬 '}
              {tab === 'pipeline' && '⚡ '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Settings */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={councilEnabled}
              onChange={(e) => useCouncilStore.getState().setCouncilEnabled(e.target.checked)}
              className="rounded"
            />
            Council Enabled
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="rounded"
            />
            Auto-Approve
          </label>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat or Database */}
        <div className="flex-1 flex flex-col border-r border-zinc-800">
          {activeTab === 'chat' && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-zinc-500 mt-20">
                    <p className="text-lg mb-2">Welcome to Council Studio</p>
                    <p className="text-sm">Describe a video and the Council will help plan it.</p>
                    <p className="text-sm mt-4 text-zinc-600">
                      Try: "Create a 30-second commercial for a sports car"
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-blue-600'
                          : msg.role === 'system'
                          ? 'bg-red-900/50'
                          : 'bg-zinc-800'
                      }`}
                    >
                      {msg.role === 'agent' && msg.agentDomain && (
                        <div className="text-xs text-zinc-400 mb-1">
                          [{msg.agentDomain.toUpperCase()} AGENT]
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200" />
                        <span className="text-sm text-zinc-400 ml-2">
                          {currentMeeting?.status === 'deliberating'
                            ? 'Council deliberating...'
                            : 'Thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex-none p-4 border-t border-zinc-800">
                {error && (
                  <div className="mb-2 p-2 bg-red-900/50 rounded text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your video... (Enter to send, Shift+Enter for newline)"
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-blue-500"
                    rows={3}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'database' && <DatabaseExplorer />}

          {activeTab === 'council' && (
            <div className="flex-1 p-4">
              <h2 className="text-lg font-semibold mb-4">🧪 Test Council Meeting</h2>
              <p className="text-sm text-zinc-400 mb-4">
                Enter a shot description to see all 4 AI agents analyze it in parallel.
              </p>

              <TestCouncilForm />
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="flex-1 p-4">
              <h2 className="text-lg font-semibold mb-4">Pipeline Status</h2>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <div className="text-sm text-zinc-400 mb-2">Current Phase</div>
                  <div className="text-xl font-bold capitalize">{pipelinePhase}</div>
                </div>

                {generatedAssets.length > 0 && (
                  <div className="p-4 bg-zinc-900 rounded-lg">
                    <div className="text-sm text-zinc-400 mb-2">Generated Assets</div>
                    <div className="grid grid-cols-4 gap-2">
                      {generatedAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className={`p-2 rounded text-xs ${
                            asset.status === 'done'
                              ? 'bg-green-900/50'
                              : asset.status === 'error'
                              ? 'bg-red-900/50'
                              : asset.status === 'generating'
                              ? 'bg-blue-900/50'
                              : 'bg-zinc-800'
                          }`}
                        >
                          {asset.type} - {asset.status}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {finalVideoUrl && (
                  <div className="p-4 bg-zinc-900 rounded-lg">
                    <div className="text-sm text-zinc-400 mb-2">Final Video</div>
                    <a
                      href={finalVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Open Video
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Council (always shows on council tab, optional on chat) */}
        {(activeTab === 'council' || (activeTab === 'chat' && showCouncilPanel)) && (
          <div className={`flex-none overflow-y-auto bg-zinc-900/50 ${
            activeTab === 'council' ? 'w-[500px]' : 'w-[400px]'
          }`}>
            <CouncilPanel />
          </div>
        )}
      </main>

      {/* Footer Status */}
      <footer className="flex-none h-8 border-t border-zinc-800 flex items-center justify-between px-4 text-xs text-zinc-500">
        <div>
          {councilEnabled ? '👥 Council Active' : '👤 Solo Mode'}
          {currentMeeting && ` | Meeting: ${currentMeeting.status}`}
        </div>
        <div>
          {currentPlan && `Plan: ${currentPlan.name || 'Untitled'}`}
          {currentPlan?.shots && ` | ${currentPlan.shots.length} shots`}
        </div>
      </footer>
    </div>
  );
}
