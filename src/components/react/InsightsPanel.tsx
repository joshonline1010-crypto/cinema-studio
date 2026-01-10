import { useState, useEffect } from 'react';

interface InsightsPanelProps {
  userId: string;
}

interface Insights {
  overview: {
    total_messages: number;
    total_likes: number;
    total_changes: number;
    images_generated: number;
    videos_generated: number;
  };
  sentiment: Record<string, number>;
  top_rated: Array<{
    mediaUrl: string;
    stars: number;
    prompt: string;
    timestamp: string;
  }>;
  common_changes: Array<{
    pattern: string;
    count: number;
    keywords: string[];
  }>;
  recent_changes: Array<{
    patterns: string[];
    message: string;
    timestamp: string;
  }>;
  top_agents: Array<{
    agent: string;
    count: number;
  }>;
  priority_summary: Record<string, number>;
}

export default function InsightsPanel({ userId }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/insights');
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      setError('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        {error || 'No insights available'}
      </div>
    );
  }

  const sentimentColors: Record<string, string> = {
    love: 'bg-green-500',
    like: 'bg-green-400',
    ok: 'bg-gray-400',
    meh: 'bg-yellow-400',
    dislike: 'bg-orange-400',
    hate: 'bg-red-500'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Astrix Insights</h1>
        <button
          onClick={fetchInsights}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <div className="text-3xl font-bold text-violet-400">{insights.overview.total_messages}</div>
          <div className="text-sm text-white/50">Messages</div>
        </div>
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <div className="text-3xl font-bold text-yellow-400">{insights.overview.total_likes}</div>
          <div className="text-sm text-white/50">Likes</div>
        </div>
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <div className="text-3xl font-bold text-orange-400">{insights.overview.total_changes}</div>
          <div className="text-sm text-white/50">Change Requests</div>
        </div>
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-400">{insights.overview.images_generated}</div>
          <div className="text-sm text-white/50">Images</div>
        </div>
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <div className="text-3xl font-bold text-green-400">{insights.overview.videos_generated}</div>
          <div className="text-sm text-white/50">Videos</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Sentiment Distribution</h2>
          <div className="space-y-2">
            {Object.entries(insights.sentiment).map(([sentiment, count]) => (
              <div key={sentiment} className="flex items-center gap-3">
                <div className="w-20 text-sm capitalize">{sentiment}</div>
                <div className="flex-1 bg-white/10 rounded-full h-4">
                  <div
                    className={`h-full rounded-full ${sentimentColors[sentiment] || 'bg-gray-500'}`}
                    style={{
                      width: `${Math.min(100, (count / Math.max(1, insights.overview.total_messages)) * 100)}%`
                    }}
                  />
                </div>
                <div className="w-12 text-sm text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Top Agents</h2>
          <div className="space-y-2">
            {insights.top_agents.length > 0 ? (
              insights.top_agents.map((agent, i) => (
                <div key={agent.agent} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1 text-sm truncate">{agent.agent}</div>
                  <div className="text-sm text-white/50">{agent.count} uses</div>
                </div>
              ))
            ) : (
              <div className="text-white/40 text-sm">No agent data yet</div>
            )}
          </div>
        </div>

        {/* Common Changes */}
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Common Change Patterns</h2>
          <div className="space-y-3">
            {insights.common_changes.length > 0 ? (
              insights.common_changes.map((change) => (
                <div key={change.pattern} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium capitalize">{change.pattern}</div>
                    <div className="text-xs text-white/40">
                      {change.keywords.slice(0, 3).join(', ')}
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm">
                    {change.count}x
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/40 text-sm">No change patterns detected yet</div>
            )}
          </div>
        </div>

        {/* Priority Summary */}
        <div className="bg-vs-card border border-vs-border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Priority Summary (★)</h2>
          <div className="grid grid-cols-5 gap-2">
            {[
              { key: 'minor', label: '★', color: 'bg-gray-500' },
              { key: 'watching', label: '★★', color: 'bg-blue-500' },
              { key: 'should_fix', label: '★★★', color: 'bg-yellow-500' },
              { key: 'fix_now', label: '★★★★', color: 'bg-orange-500' },
              { key: 'human_needed', label: '★★★★★', color: 'bg-red-500' }
            ].map((priority) => (
              <div key={priority.key} className="text-center">
                <div className={`${priority.color} rounded-lg p-2 mb-1`}>
                  <div className="text-xl font-bold">
                    {insights.priority_summary[priority.key] || 0}
                  </div>
                </div>
                <div className="text-xs text-white/50">{priority.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated Outputs */}
      <div className="bg-vs-card border border-vs-border rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Top Rated Outputs</h2>
        {insights.top_rated.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {insights.top_rated.map((item, i) => (
              <div key={i} className="relative group">
                <img
                  src={item.mediaUrl}
                  alt=""
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {item.stars}
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2 flex items-end">
                  <p className="text-xs line-clamp-3">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/40 text-sm text-center py-8">
            No rated outputs yet. Star your favorite images in chat!
          </div>
        )}
      </div>

      {/* Recent Changes */}
      <div className="bg-vs-card border border-vs-border rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Change Requests</h2>
        {insights.recent_changes.length > 0 ? (
          <div className="space-y-2">
            {insights.recent_changes.map((change, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-white/5 rounded-lg">
                <div className="flex gap-1 flex-wrap">
                  {change.patterns.map((p) => (
                    <span key={p} className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs capitalize">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="flex-1 text-sm text-white/70 truncate">{change.message}</div>
                <div className="text-xs text-white/40">
                  {new Date(change.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/40 text-sm text-center py-4">
            No change requests recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
