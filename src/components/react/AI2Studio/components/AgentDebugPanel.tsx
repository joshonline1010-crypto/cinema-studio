// AgentDebugPanel - View and control all Council agent prompts and settings
import { useState, useEffect } from 'react';

// Agent configuration
const AGENTS = [
  { id: 'narrative', name: 'NARRATIVE', icon: '📖', color: 'violet', role: 'Story structure, pacing, emotional arcs' },
  { id: 'visual', name: 'VISUAL', icon: '🎬', color: 'cyan', role: 'Director styles, cinematography, framing' },
  { id: 'technical', name: 'TECHNICAL', icon: '⚙️', color: 'emerald', role: 'Model selection, motion prompts, costs' },
  { id: 'production', name: 'PRODUCTION', icon: '🎞️', color: 'orange', role: 'Continuity, chaining, color locks' },
];

// Full agent prompts (exported from agent.ts for reference)
const AGENT_PROMPTS: Record<string, string> = {
  narrative: `You are the NARRATIVE AGENT in a multi-agent film production council.

YOUR ROLE: Analyze story structure, pacing, and emotional arcs for video production.

YOUR EXPERTISE:
- Save-the-Cat beat structure (Opening Image → Theme Stated → Setup → Catalyst → Debate → Break Into Two → B Story → Fun and Games → Midpoint → Bad Guys Close In → All Is Lost → Dark Night of Soul → Break Into Three → Finale → Final Image)
- Duration to shot count mappings
- Emotional intensity escalation (subtle → medium → strong → extreme)
- Genre-specific pacing rules
- Commercial structure (Hook 2-3s → Story 8-15s → Hero Shot 3-4s → Tagline 2-3s)

DURATION TO SHOT COUNT RULES:
- 10-15 seconds = 2-3 shots @ 5s each
- 30 seconds = 5-6 shots @ 5s each
- 60 seconds = 10-12 shots @ 5s each
- 90 seconds = 15-18 shots

EMOTIONAL ARC PATTERNS:
- ESCALATING: subtle → medium → strong → extreme (for building tension)
- CONTRAST: strong → calm → explosive (for surprise impact)
- WAVE: medium → strong → medium → extreme (for sustained engagement)`,

  visual: `You are the VISUAL AGENT in a multi-agent film production council.

YOUR ROLE: Apply director styles, cinematography rules, and visual storytelling principles.

YOUR EXPERTISE - THE 5 QUESTIONS (Director Decision Framework):
1. POWER: "Who has the power in this moment?" → Determines framing and composition
2. AUDIENCE EXPECT: "What does audience think will happen?" → Subvert or fulfill
3. INFORMATION HOLD: "What am I not showing — and how long?" → Creates tension
4. TIME MANIP: "Can I make this moment last longer/shorter?" → Pacing control
5. SIMPLICITY: "Simple or complex setup?" → Visual clarity

DIRECTOR STYLES (apply when relevant):
- KUBRICK: Centered symmetrical framing, sterile geometric sets, desaturated cold colors
- SPIELBERG: Rule of thirds, teal-orange grade, dynamic camera follows emotion
- FINCHER: Gritty decay sets, desaturated cold, methodical controlled movement
- NOLAN: Wide negative space, IMAX scale, practical effects, time manipulation
- VILLENEUVE: Vast landscapes dwarf humans, desaturated cold, slow deliberate pacing
- WES ANDERSON: Perfect centered symmetry, pastel colors, dollhouse whimsy
- TARANTINO: Low angle power shots, long dialogue takes, sudden violence
- EDGAR WRIGHT: Quick cuts on action, whip pans, visual comedy, match cuts`,

  technical: `You are the TECHNICAL AGENT in a multi-agent film production council.

YOUR ROLE: Select the optimal video generation model, validate motion prompts, calculate costs.

VIDEO MODEL SELECTION DECISION TREE:
1. Does character SPEAK on screen? → SEEDANCE 1.5
2. Is there camera movement WITH explicit end frame needed? → KLING O1
3. Is it a START → END state transition (zoom, morph, transform)? → KLING O1
4. Is it action/environment motion without dialogue? → KLING 2.6
5. DEFAULT → KLING 2.6

MODEL SPECIFICATIONS:
- SEEDANCE 1.5: fal-ai/bytedance/seedance - MAX 5s, for talking/dialogue
- KLING O1: fal-ai/kling-video/o1 - MAX 10s, for transitions with end frame
- KLING 2.6: fal-ai/kling-video/v2.6 - MAX 10s, general action

MOTION PROMPT RULES (CRITICAL):
1. VIDEO PROMPTS = MOTION ONLY - image has all visual info
2. ONE camera movement at a time - multiple = geometry warping
3. ALWAYS end with: "then settles", "then holds", "comes to rest"
4. Use POWER VERBS: STRIDE, BILLOW, CHARGE, SURGE, GLIDE, SOAR
5. Keep under 50 words

COST: Image $0.03 + 4K $0.05 + Video $0.35 = ~$0.43/shot`,

  production: `You are the PRODUCTION AGENT in a multi-agent film production council.

YOUR ROLE: Ensure visual continuity, manage shot chaining, enforce consistency rules.

FRAME CHAINING WORKFLOW:
1. Generate video for Shot N
2. Extract last frame: ffmpeg -sseof -0.1 -i video.mp4 -frames:v 1 last_frame.jpg
3. Compress to <10MB for Kling
4. Upload to Catbox for public URL
5. Use as start_image_url for Shot N+1
6. Apply color lock phrases

COLOR LOCK PHRASES:
- "THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE"
- "maintain exact color grading, same lighting direction"

DIRECTION LOCKS (CRITICAL for travel/motion):
- Track character facing (LEFT/RIGHT)
- Maintain screen direction
- For driving scenes: match interior/exterior direction
- Include "NO MIRRORING. NO DIRECTION FLIP."

CONTINUITY CHECKLIST:
□ Color grade matches  □ Character direction consistent
□ Travel direction consistent  □ Costume unchanged
□ Lighting direction same  □ Background elements present
□ Time of day consistent  □ Props correct state`
};

interface AgentDebugPanelProps {
  onClose?: () => void;
}

export default function AgentDebugPanel({ onClose }: AgentDebugPanelProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [agentToggles, setAgentToggles] = useState<Record<string, boolean>>({
    narrative: true,
    visual: true,
    technical: true,
    production: true
  });
  const [apiStatus, setApiStatus] = useState<{ claude: boolean; openai: boolean; loading: boolean }>({
    claude: false,
    openai: false,
    loading: true
  });
  const [lastRequest, setLastRequest] = useState<any>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);

  // Check API status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setApiStatus(prev => ({ ...prev, loading: true }));
    try {
      // Test with a minimal request
      const res = await fetch('/api/council/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'technical', context: { userPrompt: 'test', shot: { id: 'test' } } })
      });
      const data = await res.json();

      setApiStatus({
        claude: data.provider === 'claude',
        openai: data.provider === 'openai',
        loading: false
      });

      if (data.decision) {
        setLastResponse(data);
      }
    } catch (err) {
      setApiStatus({ claude: false, openai: false, loading: false });
    }
  };

  const testAgent = async (agentId: string) => {
    const testContext = {
      userPrompt: 'A character walks through a dark corridor, tension building',
      shot: { id: 'test-shot', order: 1 },
      previousShots: [],
      refs: [],
      director: 'kubrick'
    };

    setLastRequest({ agent: agentId, context: testContext });

    try {
      const res = await fetch('/api/council/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: agentId, context: testContext })
      });
      const data = await res.json();
      setLastResponse(data);
    } catch (err: any) {
      setLastResponse({ error: err.message });
    }
  };

  const toggleAgent = (agentId: string) => {
    setAgentToggles(prev => ({ ...prev, [agentId]: !prev[agentId] }));
  };

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
      cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    };
    return colors[color]?.[type] || '';
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h2 className="font-bold text-sm tracking-wide">COUNCIL AGENTS DEBUG</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">&times;</button>
        )}
      </div>

      {/* API Status */}
      <div className="flex-none px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">API STATUS</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.loading ? 'bg-yellow-500 animate-pulse' : apiStatus.claude ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs">Claude Sonnet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.loading ? 'bg-yellow-500 animate-pulse' : apiStatus.openai ? 'bg-green-500' : 'bg-zinc-600'}`} />
            <span className="text-xs">OpenAI (fallback)</span>
          </div>
          <button
            onClick={checkApiStatus}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 ml-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Agent Cards */}
        <div className="p-4 space-y-3">
          {AGENTS.map(agent => (
            <div
              key={agent.id}
              className={`rounded-lg border ${getColorClass(agent.color, 'border')} ${agentToggles[agent.id] ? 'bg-zinc-900/50' : 'bg-zinc-900/20 opacity-50'}`}
            >
              {/* Agent Header */}
              <div className="p-3 flex items-center gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${agentToggles[agent.id] ? 'bg-green-500' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${agentToggles[agent.id] ? 'left-5' : 'left-0.5'}`} />
                </button>

                {/* Icon & Name */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl">{agent.icon}</span>
                  <div>
                    <div className={`text-xs font-bold tracking-wider ${getColorClass(agent.color, 'text')}`}>
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-zinc-500">{agent.role}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => testAgent(agent.id)}
                    className={`px-2 py-1 text-[10px] rounded ${getColorClass(agent.color, 'bg')} ${getColorClass(agent.color, 'text')} hover:opacity-80`}
                  >
                    Test
                  </button>
                  <button
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    className="px-2 py-1 text-[10px] rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  >
                    {expandedAgent === agent.id ? 'Hide' : 'View'} Prompt
                  </button>
                </div>
              </div>

              {/* Expanded Prompt */}
              {expandedAgent === agent.id && (
                <div className="border-t border-zinc-800 p-3">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">FULL SYSTEM PROMPT</div>
                  <pre className="text-[10px] text-zinc-300 bg-zinc-950 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto font-mono leading-relaxed">
                    {AGENT_PROMPTS[agent.id]}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Last Request/Response */}
        {(lastRequest || lastResponse) && (
          <div className="p-4 border-t border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">LAST API CALL</div>

            {lastRequest && (
              <div className="mb-3">
                <div className="text-[10px] text-cyan-400 mb-1">REQUEST:</div>
                <pre className="text-[9px] text-zinc-400 bg-zinc-950 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto font-mono">
                  {JSON.stringify(lastRequest, null, 2)}
                </pre>
              </div>
            )}

            {lastResponse && (
              <div>
                <div className="text-[10px] text-green-400 mb-1">RESPONSE:</div>
                <pre className="text-[9px] text-zinc-400 bg-zinc-950 p-2 rounded overflow-x-auto max-h-48 overflow-y-auto font-mono">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Data Flow Diagram */}
        <div className="p-4 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">DATA FLOW</div>
          <div className="bg-zinc-900 rounded-lg p-4 text-[10px] font-mono">
            <div className="text-cyan-400 mb-2">USER INPUT</div>
            <div className="text-zinc-500 pl-4 mb-2">↓ prompt + refs + previous shots</div>

            <div className="text-violet-400 mb-1">┌─ NARRATIVE AGENT → beat, emotion, pacing</div>
            <div className="text-cyan-400 mb-1">├─ VISUAL AGENT → director, framing, camera</div>
            <div className="text-emerald-400 mb-1">├─ TECHNICAL AGENT → model, duration, cost</div>
            <div className="text-orange-400 mb-1">└─ PRODUCTION AGENT → chain, continuity</div>

            <div className="text-zinc-500 pl-4 my-2">↓ all run in PARALLEL</div>

            <div className="text-yellow-400 mb-2">CONSENSUS ENGINE</div>
            <div className="text-zinc-500 pl-4 mb-2">↓ weighted voting + dissent detection</div>

            <div className="text-green-400">FINAL DECISION → model, prompt, refs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
