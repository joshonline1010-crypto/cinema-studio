// @ts-nocheck
// DEPRECATED: CouncilPanel - replaced by V2 pipeline agents
// CouncilPanel - MISSION CONTROL DESIGN
// War Room aesthetic with agent "stations" and live telemetry
import React, { useState, useEffect } from 'react';
import { useCouncilStore } from '../../CouncilStudio/councilStore';
import type { AgentDecision, AgentDomain } from '../agents/types';

// Agent config with distinct visual identities
const AGENT_CONFIG: Record<AgentDomain, {
  icon: string;
  name: string;
  shortName: string;
  role: string;
  gradient: string;
  glow: string;
  ringColor: string;
}> = {
  narrative: {
    icon: '📖',
    name: 'NARRATIVE',
    shortName: 'NAR',
    role: 'Story • Beats • Emotion',
    gradient: 'from-violet-600 to-purple-900',
    glow: 'shadow-violet-500/50',
    ringColor: '#8b5cf6'
  },
  visual: {
    icon: '🎬',
    name: 'VISUAL',
    shortName: 'VIS',
    role: 'Director • Cinema • Frame',
    gradient: 'from-cyan-500 to-blue-900',
    glow: 'shadow-cyan-500/50',
    ringColor: '#06b6d4'
  },
  technical: {
    icon: '⚙️',
    name: 'TECHNICAL',
    shortName: 'TECH',
    role: 'Model • Motion • Cost',
    gradient: 'from-emerald-500 to-green-900',
    glow: 'shadow-emerald-500/50',
    ringColor: '#10b981'
  },
  production: {
    icon: '🎞️',
    name: 'PRODUCTION',
    shortName: 'PROD',
    role: 'Chain • Color • Continuity',
    gradient: 'from-orange-500 to-amber-900',
    glow: 'shadow-orange-500/50',
    ringColor: '#f97316'
  },
};

const AGENT_ORDER: AgentDomain[] = ['narrative', 'visual', 'technical', 'production'];

// Circular progress ring component
function ConfidenceRing({
  confidence,
  color,
  size = 48,
  status
}: {
  confidence: number;
  color: string;
  size?: number;
  status: 'idle' | 'calling' | 'received';
}) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (confidence * circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={status === 'received' ? color : 'rgba(255,255,255,0.2)'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={status === 'received' ? offset : circumference}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: status === 'received' ? `drop-shadow(0 0 6px ${color})` : 'none'
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {status === 'calling' ? (
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
        ) : status === 'received' ? (
          <span
            className="text-xs font-bold font-mono"
            style={{ color }}
          >
            {Math.round(confidence * 100)}
          </span>
        ) : (
          <span className="text-xs text-zinc-600">—</span>
        )}
      </div>
    </div>
  );
}

export default function CouncilPanel() {
  const {
    currentMeeting,
    agentDecisions,
    consensus,
    isLoading,
    clearMeeting,
    autoApprove,
    setAutoApprove,
    approveConsensus,
    pipelinePhase
  } = useCouncilStore();

  const [agentTiming, setAgentTiming] = useState<Record<string, number>>({});
  const [meetingStartTime, setMeetingStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Live timer during meeting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentMeeting?.status === 'deliberating' && meetingStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - meetingStartTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [currentMeeting?.status, meetingStartTime]);

  useEffect(() => {
    if (currentMeeting?.status === 'deliberating' && !meetingStartTime) {
      setMeetingStartTime(Date.now());
      setAgentTiming({});
      setElapsedTime(0);
    }
    if (currentMeeting?.status === 'complete' || !currentMeeting) {
      setMeetingStartTime(null);
    }
  }, [currentMeeting?.status]);

  useEffect(() => {
    if (meetingStartTime && agentDecisions.length > 0) {
      const newTiming: Record<string, number> = {};
      agentDecisions.forEach(d => {
        if (!agentTiming[d.agent]) {
          newTiming[d.agent] = Date.now() - meetingStartTime;
        }
      });
      if (Object.keys(newTiming).length > 0) {
        setAgentTiming(prev => ({ ...prev, ...newTiming }));
      }
    }
  }, [agentDecisions, meetingStartTime]);

  const getAgentDecision = (domain: AgentDomain) => agentDecisions.find(d => d.agent === domain);
  const getAgentStatus = (domain: AgentDomain): 'idle' | 'calling' | 'received' => {
    if (!currentMeeting || currentMeeting.status === 'idle') return 'idle';
    if (getAgentDecision(domain)) return 'received';
    if (currentMeeting.status === 'deliberating') return 'calling';
    return 'idle';
  };

  const completedCount = agentDecisions.length;
  const avgConfidence = agentDecisions.length > 0
    ? agentDecisions.reduce((sum, d) => sum + d.confidence, 0) / agentDecisions.length
    : 0;

  return (
    <div className="h-full flex flex-col bg-zinc-950 relative overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />

      {/* Header - Mission Control Style */}
      <div className="flex-none border-b border-zinc-800/50 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className={`w-2 h-2 rounded-full ${
                currentMeeting?.status === 'deliberating'
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                  : currentMeeting?.status === 'complete'
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : 'bg-zinc-600'
              }`} />
              <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-300 uppercase">
                Council
              </h2>
              {currentMeeting?.status === 'deliberating' && (
                <span className="text-[10px] font-mono text-red-400 animate-pulse tracking-wider">
                  LIVE
                </span>
              )}
            </div>

            {currentMeeting && (
              <button
                onClick={clearMeeting}
                className="text-[10px] text-zinc-500 hover:text-white px-2 py-1 border border-zinc-800 hover:border-zinc-600 rounded transition-colors uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-6 mt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">Agents:</span>
              <span className={completedCount === 4 ? 'text-green-400' : 'text-zinc-400'}>
                {completedCount}/4
              </span>
            </div>
            {currentMeeting?.status === 'deliberating' && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">Time:</span>
                <span className="text-blue-400 tabular-nums">
                  {(elapsedTime / 1000).toFixed(1)}s
                </span>
              </div>
            )}
            {consensus && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">Consensus:</span>
                <span className={avgConfidence >= 0.85 ? 'text-green-400' : avgConfidence >= 0.7 ? 'text-yellow-400' : 'text-orange-400'}>
                  {(consensus.consensusScore * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Empty State */}
        {!currentMeeting && !isLoading && agentDecisions.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {AGENT_ORDER.map(domain => {
                const config = AGENT_CONFIG[domain];
                return (
                  <div
                    key={domain}
                    className="w-16 h-16 rounded-lg bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center"
                  >
                    <span className="text-2xl opacity-30">{config.icon}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
              Awaiting Input
            </p>
          </div>
        )}

        {/* Agent Stations */}
        {(currentMeeting || agentDecisions.length > 0) && (
          <div className="space-y-3">
            {AGENT_ORDER.map((domain, index) => {
              const config = AGENT_CONFIG[domain];
              const decision = getAgentDecision(domain);
              const status = getAgentStatus(domain);

              return (
                <AgentStation
                  key={domain}
                  domain={domain}
                  config={config}
                  decision={decision}
                  status={status}
                  timing={agentTiming[domain]}
                  index={index}
                />
              );
            })}
          </div>
        )}

        {/* Consensus Panel */}
        {consensus && (
          <div className="mt-6 relative">
            {/* Connector line */}
            <div className="absolute -top-3 left-1/2 w-px h-3 bg-gradient-to-b from-transparent to-green-500/50" />

            <div className="border border-green-500/30 rounded-lg bg-gradient-to-b from-green-950/20 to-transparent p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                <h3 className="text-[10px] font-bold tracking-[0.3em] text-green-400 uppercase">
                  Consensus Reached
                </h3>
                {consensus.requiresReview && (
                  <span className="text-[9px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full uppercase tracking-wider">
                    Review
                  </span>
                )}
              </div>

              {/* Model Selection - Hero */}
              <div className="bg-zinc-900/50 rounded-lg p-4 mb-3 border border-zinc-800/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Selected Model</div>
                    <div className="text-xl font-bold text-white tracking-tight">
                      {consensus.finalDecision.model}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 max-w-[200px]">
                      {consensus.finalDecision.modelReason?.slice(0, 80)}...
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Duration</div>
                    <div className="text-2xl font-bold text-white tabular-nums">
                      {consensus.finalDecision.duration}<span className="text-sm text-zinc-500">s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-zinc-900/30 rounded px-3 py-2 border border-zinc-800/30">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Cost</div>
                  <div className="text-sm font-mono text-green-400">
                    ${consensus.finalDecision.estimatedCost?.toFixed(2) || '0.43'}
                  </div>
                </div>
                <div className="bg-zinc-900/30 rounded px-3 py-2 border border-zinc-800/30">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Chain</div>
                  <div className="text-sm font-mono text-zinc-300">
                    {consensus.finalDecision.chainStrategy?.chainFromPrevious ? '🔗 Linked' : '🆕 New'}
                  </div>
                </div>
              </div>

              {/* Suggested Motion Prompt */}
              {agentDecisions.find(d => d.agent === 'technical')?.recommendation?.suggestedMotionPrompt && (
                <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-500/20 mb-3">
                  <div className="text-[9px] text-emerald-400 uppercase tracking-wider mb-1">
                    Suggested Motion
                  </div>
                  <div className="text-xs text-emerald-200 italic leading-relaxed">
                    "{agentDecisions.find(d => d.agent === 'technical')?.recommendation?.suggestedMotionPrompt}"
                  </div>
                </div>
              )}

              {/* Warnings */}
              {consensus.finalDecision.warnings && consensus.finalDecision.warnings.length > 0 && (
                <div className="bg-yellow-950/20 rounded-lg p-3 border border-yellow-500/20 mb-3">
                  <div className="text-[9px] text-yellow-400 uppercase tracking-wider mb-2">
                    ⚠ Warnings ({consensus.finalDecision.warnings.length})
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {consensus.finalDecision.warnings.slice(0, 4).map((warning, i) => (
                      <div key={i} className="text-[10px] text-yellow-300/80 leading-relaxed">
                        • {warning}
                      </div>
                    ))}
                    {consensus.finalDecision.warnings.length > 4 && (
                      <div className="text-[10px] text-yellow-500">
                        +{consensus.finalDecision.warnings.length - 4} more...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={approveConsensus}
                  disabled={pipelinePhase === 'generating'}
                  className={`flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                    pipelinePhase === 'generating'
                      ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                      : pipelinePhase === 'complete'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/20'
                  }`}
                >
                  {pipelinePhase === 'generating' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </span>
                  ) : pipelinePhase === 'complete' ? (
                    '✓ Complete'
                  ) : (
                    '✓ Approve & Generate'
                  )}
                </button>
                <button className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs font-medium uppercase tracking-wider transition-colors">
                  Override
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none px-4 py-2 border-t border-zinc-800/50 bg-zinc-900/50">
        <label className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider cursor-pointer">
          <input
            type="checkbox"
            checked={autoApprove}
            onChange={(e) => setAutoApprove(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500/20"
          />
          Auto-approve &gt;80%
        </label>
      </div>
    </div>
  );
}

// ============================================
// AGENT STATION - Individual agent display
// ============================================

interface AgentStationProps {
  domain: AgentDomain;
  config: typeof AGENT_CONFIG[AgentDomain];
  decision: AgentDecision | undefined;
  status: 'idle' | 'calling' | 'received';
  timing?: number;
  index: number;
}

function AgentStation({ domain, config, decision, status, timing, index }: AgentStationProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`rounded-lg border transition-all duration-500 overflow-hidden ${
        status === 'calling'
          ? 'border-blue-500/50 bg-blue-950/10'
          : status === 'received'
          ? 'border-zinc-700/50 bg-zinc-900/30'
          : 'border-zinc-800/30 bg-zinc-900/10'
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: status === 'received' ? `0 0 20px -5px ${config.ringColor}20` : 'none'
      }}
    >
      {/* Header */}
      <div
        className="p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {/* Confidence Ring */}
          <ConfidenceRing
            confidence={decision?.confidence || 0}
            color={config.ringColor}
            status={status}
            size={44}
          />

          {/* Agent Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.icon}</span>
              <span
                className="text-xs font-bold tracking-[0.15em] uppercase"
                style={{ color: status === 'received' ? config.ringColor : '#71717a' }}
              >
                {config.name}
              </span>
              {status === 'calling' && (
                <span className="text-[9px] text-blue-400 animate-pulse uppercase tracking-wider">
                  Processing...
                </span>
              )}
            </div>
            <div className="text-[10px] text-zinc-600 tracking-wide mt-0.5">
              {config.role}
            </div>
          </div>

          {/* Timing & Expand */}
          <div className="flex items-center gap-3">
            {timing && (
              <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                {(timing / 1000).toFixed(1)}s
              </span>
            )}
            <span className="text-zinc-600 text-[10px]">
              {expanded ? '▼' : '▶'}
            </span>
          </div>
        </div>

        {/* Quick summary - always visible when received */}
        {status === 'received' && decision && decision.reasoning[0] && (
          <div className="mt-2 ml-[56px] text-[11px] text-zinc-400 leading-relaxed">
            {decision.reasoning[0]}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && status === 'received' && decision && (
        <div className="px-3 pb-3 ml-[56px] space-y-3 border-t border-zinc-800/30 pt-3">
          {/* Reasoning */}
          <div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5">Reasoning</div>
            <div className="space-y-1">
              {decision.reasoning.slice(1).map((reason, i) => (
                <div key={i} className="text-[10px] text-zinc-400 leading-relaxed flex gap-2">
                  <span className="text-zinc-600">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {decision.warnings && decision.warnings.length > 0 && (
            <div className="bg-yellow-950/20 rounded p-2 border border-yellow-500/10">
              <div className="text-[9px] text-yellow-500 uppercase tracking-wider mb-1">Warnings</div>
              {decision.warnings.map((warning, i) => (
                <div key={i} className="text-[10px] text-yellow-400/80 leading-relaxed">
                  ⚠ {warning}
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {decision.recommendation && (
            <div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5">Recommendation</div>
              <pre className="text-[9px] text-zinc-400 bg-zinc-950/50 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto font-mono border border-zinc-800/30">
                {JSON.stringify(decision.recommendation, null, 2)}
              </pre>
            </div>
          )}

          {/* Source */}
          <div className="text-[9px] text-zinc-600">
            Source: {decision.sources?.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
