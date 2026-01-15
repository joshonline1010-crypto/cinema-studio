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
    currentSessionName,  // For chat memory persistence

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
      // Call AI endpoint with PERSISTENT session for memory
      const chatSessionId = currentSessionName || 'council_default';
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          model: 'claude-opus',
          sessionId: chatSessionId,  // Uses session name for persistent memory!
          systemPrompt: buildSystemPrompt()  // Send Council's system prompt for JSON output!
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
    return `You are an AI Film Director. Output CLEAN readable text, then JSON.

FORMAT RULES:
- NO markdown (no **, no ---, no | tables |, no \`\`\` for text)
- Write in clean paragraphs
- Use line breaks between sections
- Headers should just be CAPS on their own line
- Explain WHY choices work, not just what they are

YOUR RESPONSE STRUCTURE:

CREATIVE BRIEF

Write 2-3 sentences about the overall vision. What feeling are we creating? What story are we telling? Why will this work?

THE APPROACH

Explain the visual style in a paragraph. What director influences? Why those angles? Why that lighting? How does each choice serve the product/story?

REFS WE NEED

List the references we must generate first and why each matters for consistency. Explain how they lock the look.

WHY THIS SEQUENCE WORKS

Walk through the shot flow in prose. Shot 1 does X because Y. Shot 2 follows with Z because it builds on... etc. Explain the emotional journey.

Then output the JSON plan (this CAN be in code block):

CRITICAL: You MUST include "refs_needed" array with character/vehicle/location names that need reference images generated FIRST before shots can begin!

\`\`\`json
{
  "name": "Plan name",
  "refs_needed": ["character_name", "vehicle_name", "location_name"],
  "shots": [
    {
      "id": "shot_001",
      "shot_type": "Wide tracking",
      "prompt": "FULL 50-100 word photo prompt with subject, action, environment, lighting, angle, lens, style",
      "motion_prompt": "Camera movement, then settles",
      "duration": "5",
      "refs": ["character_name", "vehicle_name"],
      "camera": { "framing": "WS", "movement": "tracking" },
      "emotion": "awe",
      "lighting": "golden hour"
    }
  ]
}
\`\`\`

REFS_NEEDED EXAMPLES:
- For a car commercial: ["sports_car", "driver", "mountain_road"]
- For a character scene: ["main_character", "sidekick", "location"]
- For product shot: ["product", "model", "studio_setup"]

These refs get generated FIRST, then ALL shots use them for consistency!

PROMPT RULES:
- 50-100 words per prompt, highly detailed
- Start with subject, end with technical specs
- Include "THIS EXACT CHARACTER" for consistency
- Motion prompts end with "then settles" or "then holds"
- Duration: "5" or "10" only`;
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
  // INLINE SHOT GRID - Renders shots visually in chat
  // ============================================

  const [showRawOutput, setShowRawOutput] = useState<string | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState<any>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generatingStatus, setGeneratingStatus] = useState<Record<string, 'pending' | 'generating' | 'done' | 'error'>>({});
  const [generationStep, setGenerationStep] = useState<'idle' | 'refs' | 'shots' | 'done'>('idle');

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(2); // Default 2x speed
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Text-to-Speech function
  const speakText = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text - remove JSON, markdown, etc.
    const cleanText = text
      .replace(/```json[\s\S]*?```/g, 'Here is the shot plan.')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\{[\s\S]*\}/g, '')
      .replace(/[#*_`]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = ttsSpeed; // 1 = normal, 2 = 2x speed
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to get a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Generate a single image using /api/cinema/generate
  const generateImage = async (id: string, prompt: string, refUrls: string[] = []): Promise<string | null> => {
    setGeneratingStatus(prev => ({ ...prev, [id]: 'generating' }));

    try {
      const requestBody = {
        type: refUrls.length > 0 ? 'edit' : 'image',
        prompt: prompt,
        aspect_ratio: '21:9',
        resolution: '2K',
        image_urls: refUrls.length > 0 ? refUrls : undefined
      };

      console.log(`[Council] Generating ${id}:`, requestBody);

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      const imageUrl = data.image_url || data.images?.[0]?.url || data.url;

      if (imageUrl) {
        setGeneratedImages(prev => ({ ...prev, [id]: imageUrl }));
        setGeneratingStatus(prev => ({ ...prev, [id]: 'done' }));
        return imageUrl;
      } else {
        throw new Error('No image URL in response');
      }
    } catch (err) {
      console.error(`[Council] Failed to generate ${id}:`, err);
      setGeneratingStatus(prev => ({ ...prev, [id]: 'error' }));
      return null;
    }
  };

  // Build proper cinematic ref prompts (same as CinemaStudio)
  const buildRefPrompt = (refName: string): string => {
    const name = refName.toLowerCase();

    // Character refs - cinematic portrait
    if (name.includes('character') || name.includes('person') || name.includes('driver') ||
        name.includes('hero') || name.includes('actor') || name.includes('talent')) {
      return `Cinematic character portrait, ${refName}. Medium close-up, dramatic lighting from side, shallow depth of field, film grain, 85mm lens, professional photography, neutral expression looking at camera, studio quality, 8K, photorealistic`;
    }

    // Vehicle refs - beauty shot
    if (name.includes('car') || name.includes('vehicle') || name.includes('truck') ||
        name.includes('porsche') || name.includes('lambo') || name.includes('bike')) {
      return `Cinematic vehicle beauty shot, ${refName}. Three-quarter front angle, dramatic lighting, reflections on paint, shallow depth of field, automotive photography, professional studio quality, 8K, photorealistic`;
    }

    // Location refs - establishing shot
    if (name.includes('location') || name.includes('place') || name.includes('scene') ||
        name.includes('road') || name.includes('city') || name.includes('desert')) {
      return `Cinematic establishing shot, ${refName}. Wide angle, golden hour lighting, atmospheric depth, film grain, professional cinematography, no people, empty scene ready for action, 8K, photorealistic`;
    }

    // Default - product/object shot
    return `Cinematic product shot, ${refName}. Studio lighting, dramatic shadows, shallow depth of field, professional product photography, hero angle, 8K, photorealistic`;
  };

  // Generate all refs PARALLEL, then all shots PARALLEL with refs
  // Matches CinemaStudio: executeEntirePlan pattern
  const generateAllFromPlan = async (plan: any) => {
    setGeneratingPlan(plan);
    setGenerationStep('refs');

    // LOCAL storage for ref URLs (avoid stale React state!)
    const generatedRefUrls: Map<string, string> = new Map();

    // Extract refs from multiple possible field names
    const refsNeeded: string[] = plan.refs_needed || plan.refs || plan.references || [];
    console.log('[Council] Plan refs_needed:', plan.refs_needed);
    console.log('[Council] Plan refs:', plan.refs);
    console.log('[Council] Using refs:', refsNeeded);

    // ============================================
    // STEP 1: Generate ALL refs in PARALLEL first
    // ============================================
    if (refsNeeded.length > 0) {
      console.log(`[Council] 🔶 STEP 1: BLOCKING - Generating ${refsNeeded.length} refs FIRST...`);
      console.log('[Council] ⚠️ SHOTS WILL NOT START UNTIL REFS COMPLETE!');

      // Mark all as generating
      refsNeeded.forEach((ref: string) => {
        setGeneratingStatus(prev => ({ ...prev, [`ref_${ref}`]: 'generating' }));
      });

      // Fire all refs at once with proper cinematic prompts
      const refPromises = refsNeeded.map(async (ref: string) => {
        const refPrompt = buildRefPrompt(ref);
        console.log(`[Council] Generating ref: ${ref}`, refPrompt.substring(0, 80) + '...');

        try {
          const response = await fetch('/api/cinema/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'image',
              prompt: refPrompt,
              aspect_ratio: '16:9',
              resolution: '4K'
            })
          });

          const data = await response.json();
          const imageUrl = data.image_url || data.images?.[0]?.url || data.url;

          if (imageUrl) {
            // Store locally AND in React state
            generatedRefUrls.set(ref, imageUrl);
            setGeneratedImages(prev => ({ ...prev, [`ref_${ref}`]: imageUrl }));
            setGeneratingStatus(prev => ({ ...prev, [`ref_${ref}`]: 'done' }));
            console.log(`[Council] ✓ Ref done: ${ref}`);
            return imageUrl;
          } else {
            throw new Error('No image URL');
          }
        } catch (err) {
          console.error(`[Council] Ref failed: ${ref}`, err);
          setGeneratingStatus(prev => ({ ...prev, [`ref_${ref}`]: 'error' }));
          return null;
        }
      });

      // Wait for ALL refs to complete - BLOCKING!
      console.log('[Council] ⏳ WAITING for all refs to complete...');
      await Promise.all(refPromises);
      console.log(`[Council] ✅ All ${generatedRefUrls.size} refs DONE! Now can start shots.`);
    } else {
      console.log('[Council] ⚠️ No refs in plan - going straight to shots');
    }

    // Collect ALL ref URLs for shots
    const allRefUrls = Array.from(generatedRefUrls.values());
    console.log(`[Council] 📎 Ref URLs to attach to shots: ${allRefUrls.length}`);
    if (allRefUrls.length > 0) {
      console.log('[Council] Ref URLs:', allRefUrls.map(u => u.substring(0, 50) + '...'));
    }

    // ============================================
    // STEP 2: Generate ALL shots in PARALLEL with refs
    // ============================================
    setGenerationStep('shots');
    if (plan.shots && plan.shots.length > 0) {
      console.log(`[Council] 🔷 STEP 2: Generating ${plan.shots.length} shots WITH ${allRefUrls.length} refs...`);

      // Mark all as generating
      plan.shots.forEach((_: any, i: number) => {
        setGeneratingStatus(prev => ({ ...prev, [`shot_${i}`]: 'generating' }));
      });

      // Fire all shots at once - each gets ALL ref URLs for consistency!
      const shotPromises = plan.shots.map(async (shot: any, i: number) => {
        const shotPrompt = shot.prompt || shot.photo_prompt || `Shot ${i + 1}`;
        console.log(`[Council] PARALLEL: Shot ${i + 1} with ${allRefUrls.length} refs`);

        try {
          const response = await fetch('/api/cinema/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: allRefUrls.length > 0 ? 'edit' : 'image',
              prompt: shotPrompt,
              aspect_ratio: '21:9',
              resolution: '4K',
              image_urls: allRefUrls.length > 0 ? allRefUrls : undefined
            })
          });

          const data = await response.json();
          const imageUrl = data.image_url || data.images?.[0]?.url || data.url;

          if (imageUrl) {
            setGeneratedImages(prev => ({ ...prev, [`shot_${i}`]: imageUrl }));
            setGeneratingStatus(prev => ({ ...prev, [`shot_${i}`]: 'done' }));
            console.log(`[Council] ✓ Shot ${i + 1} done`);
            return { shot_id: i, image_url: imageUrl, success: true };
          } else {
            throw new Error('No image URL');
          }
        } catch (err) {
          console.error(`[Council] Shot ${i + 1} failed:`, err);
          setGeneratingStatus(prev => ({ ...prev, [`shot_${i}`]: 'error' }));
          return { shot_id: i, success: false };
        }
      });

      // Wait for ALL shots to complete
      const results = await Promise.all(shotPromises);
      const successCount = results.filter(r => r.success).length;
      console.log(`[Council] ✅ All shots done! ${successCount}/${plan.shots.length} successful`);
    }

    console.log('[Council] 🎬 GENERATION COMPLETE!');
    setGenerationStep('done');
    setGeneratingPlan(null);
  };

  const renderMessageContent = (content: string, msgId?: string) => {
    // Try to extract plan from message
    const plan = extractPlanFromResponse(content);

    if (plan && plan.shots && plan.shots.length > 0) {
      // Remove JSON block from text for cleaner display
      const textWithoutJson = content
        .replace(/```json[\s\S]*?```/g, '')
        .replace(/\{[\s\S]*"shots"[\s\S]*\}/g, '')
        .trim();

      return (
        <div className="space-y-4">
          {/* Text part of response */}
          {textWithoutJson && (
            <div className="whitespace-pre-wrap text-sm">{textWithoutJson}</div>
          )}

          {/* Visual Shot Grid */}
          <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                📋 Shot Plan ({plan.shots.length} shots)
              </div>
              <div className="flex items-center gap-2">
                {plan.name && (
                  <div className="text-xs text-zinc-500">{plan.name}</div>
                )}
                <button
                  onClick={() => setShowRawOutput(showRawOutput === msgId ? null : (msgId || content))}
                  className="px-2 py-0.5 bg-zinc-700 hover:bg-zinc-600 text-[9px] text-zinc-300 rounded transition-colors"
                >
                  {showRawOutput === msgId ? '📋 Hide Raw' : '📄 View Raw'}
                </button>
              </div>
            </div>

            {/* Raw Output Modal */}
            {showRawOutput === msgId && (
              <div className="mb-3 p-3 bg-zinc-950 rounded-lg border border-zinc-600 max-h-64 overflow-y-auto">
                <div className="text-[9px] text-zinc-500 mb-2 uppercase">Full Raw Output:</div>
                <pre className="text-[10px] text-zinc-300 whitespace-pre-wrap font-mono">{content}</pre>
              </div>
            )}

            {/* REFS NEEDED - Show what refs to generate first */}
            {plan.refs_needed && plan.refs_needed.length > 0 && (
              <div className="mb-4 p-3 bg-orange-950/30 rounded-lg border border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    📎 REFS TO GENERATE FIRST
                  </div>
                  <button
                    onClick={async () => {
                      for (const ref of plan.refs_needed) {
                        const refPrompt = `Reference image for ${ref}, front view, clean background, professional lighting, high detail, 8K`;
                        await generateImage(`ref_${ref}`, refPrompt);
                      }
                    }}
                    disabled={plan.refs_needed.some((r: string) => generatingStatus[`ref_${r}`] === 'generating')}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-wait text-white text-[10px] rounded transition-colors"
                  >
                    {plan.refs_needed.some((r: string) => generatingStatus[`ref_${r}`] === 'generating')
                      ? '⏳ Generating...'
                      : '🎨 Generate All Refs'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {plan.refs_needed.map((ref: string, idx: number) => {
                    const refId = `ref_${ref}`;
                    const status = generatingStatus[refId] || 'pending';
                    const imageUrl = generatedImages[refId];
                    return (
                      <div key={idx} className="bg-zinc-800 rounded-lg p-2 border border-zinc-700">
                        <div className="aspect-square bg-zinc-900 rounded mb-2 flex items-center justify-center border border-dashed border-orange-500/30 overflow-hidden">
                          {imageUrl ? (
                            <img src={imageUrl} alt={ref} className="w-full h-full object-cover" />
                          ) : status === 'generating' ? (
                            <div className="animate-pulse text-orange-400 text-2xl">⏳</div>
                          ) : status === 'error' ? (
                            <span className="text-red-500 text-2xl">❌</span>
                          ) : (
                            <span className="text-orange-500/50 text-2xl">📷</span>
                          )}
                        </div>
                        <div className="text-[10px] text-orange-300 font-medium truncate">{ref}</div>
                        <div className={`text-[9px] ${
                          status === 'done' ? 'text-green-400' :
                          status === 'generating' ? 'text-blue-400' :
                          status === 'error' ? 'text-red-400' : 'text-zinc-500'
                        }`}>{status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BASE PHOTO indicator */}
            <div className="mb-4 p-3 bg-blue-950/30 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-10 bg-zinc-900 rounded border border-dashed border-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-500/50 text-sm">BASE</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-blue-400">BASE PHOTO</div>
                    <div className="text-[9px] text-zinc-500">Locks lighting + environment for all shots</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 text-[9px] rounded">auto from shot 1</span>
              </div>
            </div>

            {/* THE STACK EXECUTION ORDER - How consistency is maintained */}
            <div className="mb-4 p-3 bg-gradient-to-r from-emerald-950/30 to-teal-950/30 rounded-lg border border-emerald-500/20">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                🔗 EXECUTION CHAIN (THE STACK)
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[10px]">
                {/* Layer 1: Refs */}
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded border border-orange-500/30">
                  <span className="text-orange-300">1️⃣ REFS</span>
                  <span className="text-orange-200/60">
                    {(() => {
                      const allRefs = new Set<string>();
                      plan.shots.forEach((s: any) => {
                        (s.refs || s.characters || s.ref_ids || []).forEach((r: string) => allRefs.add(r));
                      });
                      return allRefs.size > 0 ? `(${[...allRefs].join(', ')})` : '(auto-detect)';
                    })()}
                  </span>
                </div>
                <span className="text-zinc-500">→</span>

                {/* Layer 2: Base Photo */}
                <div className="px-2 py-1 bg-blue-500/20 rounded border border-blue-500/30">
                  <span className="text-blue-300">2️⃣ BASE PHOTO</span>
                  <span className="text-blue-200/60 ml-1">(locks lighting)</span>
                </div>
                <span className="text-zinc-500">→</span>

                {/* Layer 3: Shots */}
                <div className="px-2 py-1 bg-purple-500/20 rounded border border-purple-500/30">
                  <span className="text-purple-300">3️⃣ {plan.shots.length} SHOTS</span>
                  <span className="text-purple-200/60 ml-1">(all refs in each)</span>
                </div>
                <span className="text-zinc-500">→</span>

                {/* Layer 4: Chain */}
                <div className="px-2 py-1 bg-teal-500/20 rounded border border-teal-500/30">
                  <span className="text-teal-300">4️⃣ CHAIN</span>
                  <span className="text-teal-200/60 ml-1">(last frame → new base)</span>
                </div>
              </div>

              {/* Consistency guarantee */}
              <div className="mt-2 pt-2 border-t border-emerald-500/10 text-[9px] text-emerald-300/70">
                ✓ CONSISTENCY: All refs attached to every shot • Lighting locked from base • Last frame chains to next batch
              </div>
            </div>

            {/* Shot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {plan.shots.map((shot: any, idx: number) => {
                const shotId = `shot_${idx}`;
                const status = generatingStatus[shotId] || 'pending';
                const imageUrl = generatedImages[shotId];
                return (
                <div
                  key={idx}
                  className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                  {/* Shot Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                        status === 'done' ? 'bg-green-600' :
                        status === 'generating' ? 'bg-blue-600 animate-pulse' :
                        status === 'error' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {status === 'generating' ? '⏳' : idx + 1}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {shot.shot_type || shot.type || 'Shot'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {/* Type badges */}
                      <span className={`px-1.5 py-0.5 text-[9px] rounded ${
                        imageUrl ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {imageUrl ? '✓ 📷' : '📷'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[9px] rounded">
                        🎬
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail - show generated image or placeholder */}
                  <div className="aspect-video bg-zinc-900 rounded-lg mb-2 flex items-center justify-center border border-zinc-700 border-dashed overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={`Shot ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : status === 'generating' ? (
                      <div className="text-center">
                        <div className="animate-spin text-2xl mb-1">⏳</div>
                        <div className="text-[10px] text-zinc-400">Generating...</div>
                      </div>
                    ) : status === 'error' ? (
                      <div className="text-center">
                        <span className="text-red-500 text-2xl">❌</span>
                        <div className="text-[10px] text-red-400">Error</div>
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-2xl font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {shot.camera?.movement && (
                      <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-[9px] rounded">
                        🎥 {shot.camera.movement}
                      </span>
                    )}
                    {shot.camera?.framing && (
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] rounded">
                        📐 {shot.camera.framing}
                      </span>
                    )}
                    {shot.emotion && (
                      <span className="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 text-[9px] rounded">
                        💭 {shot.emotion}
                      </span>
                    )}
                    {shot.lighting && (
                      <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 text-[9px] rounded">
                        💡 {shot.lighting}
                      </span>
                    )}
                    {idx > 0 && (
                      <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-300 text-[9px] rounded">
                        🔗 chain
                      </span>
                    )}
                  </div>

                  {/* Refs needed */}
                  {(shot.refs || shot.characters || shot.ref_ids) && (
                    <div className="text-[10px] text-orange-400 mb-1">
                      📎 Refs: {(shot.refs || shot.characters || shot.ref_ids || []).join(', ') || 'none'}
                    </div>
                  )}

                  {/* FULL Prompt - no truncation */}
                  <div className="text-[10px] text-zinc-300 bg-zinc-900/50 p-2 rounded mt-1 max-h-24 overflow-y-auto">
                    <div className="text-[9px] text-blue-400 mb-1">📷 PROMPT:</div>
                    {shot.prompt || shot.photo_prompt || shot.image_prompt || shot.description || 'No prompt'}
                  </div>
                  {/* Motion prompt if exists */}
                  {(shot.motion_prompt || shot.video_prompt) && (
                    <div className="text-[10px] text-zinc-300 bg-purple-900/20 p-2 rounded mt-1 max-h-20 overflow-y-auto">
                      <div className="text-[9px] text-purple-400 mb-1">🎬 MOTION:</div>
                      {shot.motion_prompt || shot.video_prompt}
                    </div>
                  )}
                </div>
              )
              })}
            </div>

            {/* GENERATE BUTTONS */}
            <div className="mt-4 pt-4 border-t border-zinc-700 flex flex-col gap-2">
              {/* Status Banner */}
              {generationStep === 'refs' && (
                <div className="p-2 rounded-lg text-center text-sm font-bold bg-orange-600 text-white animate-pulse">
                  STEP 1: Generating REFS first... (shots waiting)
                </div>
              )}
              {generationStep === 'shots' && (
                <div className="p-2 rounded-lg text-center text-sm font-bold bg-blue-600 text-white animate-pulse">
                  STEP 2: Generating SHOTS with refs attached...
                </div>
              )}
              {generationStep === 'done' && (
                <div className="p-2 rounded-lg text-center text-sm font-bold bg-green-600 text-white">
                  COMPLETE! All refs and shots generated.
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => generateAllFromPlan(plan)}
                  disabled={generationStep === 'refs' || generationStep === 'shots'}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-zinc-600 disabled:to-zinc-600 disabled:cursor-wait text-white text-sm font-bold rounded-lg transition-all"
                >
                  {generationStep === 'refs' ? 'Step 1: Refs...' : generationStep === 'shots' ? 'Step 2: Shots...' : 'Generate All'}
                </button>
                <button
                  onClick={() => alert('Video generation coming next!')}
                  disabled={!plan.shots.every((_: any, i: number) => generatedImages[`shot_${i}`])}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all"
                >
                  Videos
                </button>
              </div>
            </div>

            {/* Generation Progress */}
            {Object.keys(generatingStatus).length > 0 && (
              <div className="mt-3 p-2 bg-zinc-950 rounded-lg">
                <div className="text-[10px] text-zinc-400 mb-1">Generation Progress:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(generatingStatus).map(([id, status]) => (
                    <span key={id} className={`px-2 py-0.5 rounded text-[9px] ${
                      status === 'done' ? 'bg-green-500/20 text-green-300' :
                      status === 'generating' ? 'bg-blue-500/20 text-blue-300' :
                      status === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {id}: {status}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // No plan found - render as plain text
    return <div className="whitespace-pre-wrap text-sm">{content}</div>;
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
                      {/* TTS Controls for AI messages */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-700">
                          <button
                            onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                              isSpeaking
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-green-600 hover:bg-green-500 text-white'
                            }`}
                          >
                            {isSpeaking ? '⏹️ Stop' : '🔊 Listen'}
                          </button>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-zinc-500">Speed:</span>
                            {[1, 1.5, 2, 2.5].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => setTtsSpeed(speed)}
                                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                                  ttsSpeed === speed
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {msg.role === 'agent' && msg.agentDomain && (
                        <div className="text-xs text-zinc-400 mb-1">
                          [{msg.agentDomain.toUpperCase()} AGENT]
                        </div>
                      )}
                      {/* Render with visual shot grid if plan detected */}
                      {renderMessageContent(msg.content, msg.id)}
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
