import { useState, useEffect } from 'react';

interface Execution {
  id: string;
  workflowName: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  startedAt: string;
  stoppedAt?: string;
  mode: string;
}

export default function ExecutionsPanel() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExecutions = async () => {
    try {
      const response = await fetch('/api/n8n/executions');
      if (response.ok) {
        const data = await response.json();
        setExecutions(data.executions || []);
      }
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
    // Poll every 3 seconds
    const interval = setInterval(fetchExecutions, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-yellow-400 bg-yellow-400/20';
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'waiting': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-white/50 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        );
      case 'success':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <div className="w-3 h-3 rounded-full bg-current" />;
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString();
  };

  const runningCount = executions.filter(e => e.status === 'running').length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
          Executions
        </h3>
        {runningCount > 0 && (
          <span className="px-2 py-0.5 text-xs bg-yellow-400/20 text-yellow-400 rounded-full">
            {runningCount} running
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : executions.length === 0 ? (
        <div className="text-white/40 text-sm text-center py-8">
          No recent executions
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {executions.map((exec) => (
            <div
              key={exec.id}
              className="p-2 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`p-1 rounded ${getStatusColor(exec.status)}`}>
                  {getStatusIcon(exec.status)}
                </span>
                <span className="text-xs text-white/70 truncate flex-1">
                  {exec.workflowName || 'Unknown workflow'}
                </span>
              </div>
              <div className="text-xs text-white/40 flex justify-between">
                <span>{formatTime(exec.startedAt)}</span>
                <span className="capitalize">{exec.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href="http://localhost:5678/executions"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-violet-400 hover:text-violet-300 text-center block"
      >
        View all in n8n →
      </a>
    </div>
  );
}
