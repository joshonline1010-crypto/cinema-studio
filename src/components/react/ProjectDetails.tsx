import { useState, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';

type Tab = 'files' | 'workflows';

interface FileEntry {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  modified?: string;
  url?: string;
  children?: FileEntry[];
}

interface Workflow {
  id: string;
  name: string;
  count: number;
  lastRun: string;
}

interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: string;
  startedAt: string;
  duration?: number;
}

export default function ProjectDetails() {
  const { activeProject } = useChatStore();
  const [activeTab, setActiveTab] = useState<Tab>('files');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [fileStats, setFileStats] = useState<{ totalFiles: number; totalSizeFormatted: string } | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['outputs', 'refs', 'astrix', 'assets']));
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeProject) {
      if (activeTab === 'files') {
        fetchFiles();
      } else {
        fetchWorkflows();
      }
    }
  }, [activeProject, activeTab]);

  const fetchFiles = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setFileStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/workflows`);
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.workflows || []);
        setExecutions(data.executions || []);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) {
      return (
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (['mp4', 'webm', 'mov'].includes(ext || '')) {
      return (
        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
      return (
        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }
    if (ext === 'json') {
      return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const renderFileTree = (entries: FileEntry[], depth: number = 0) => {
    return entries.map(entry => (
      <div key={entry.path}>
        {entry.type === 'folder' ? (
          <>
            <button
              onClick={() => toggleFolder(entry.path)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded text-left cursor-pointer"
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
              <svg
                className={`w-3 h-3 text-white/50 transition-transform duration-200 ${expandedFolders.has(entry.path) ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg className={`w-4 h-4 ${entry.name === 'astrix' ? 'text-violet-400' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
              <span className="text-sm text-white/80 flex-1">{entry.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                entry.children && entry.children.length > 0
                  ? 'bg-white/10 text-white/50'
                  : 'text-white/30'
              }`}>
                {entry.children ? entry.children.length : 0}
              </span>
            </button>
            {expandedFolders.has(entry.path) && (
              <div>
                {entry.children && entry.children.length > 0 ? (
                  renderFileTree(entry.children, depth + 1)
                ) : (
                  <div
                    className="text-xs text-white/30 italic py-1"
                    style={{ paddingLeft: `${depth * 16 + 40}px` }}
                  >
                    (empty)
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded group"
            style={{ paddingLeft: `${depth * 16 + 24}px` }}
          >
            {getFileIcon(entry.name)}
            {entry.url ? (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-vs-accent truncate flex-1"
                title={entry.name}
              >
                {entry.name}
              </a>
            ) : (
              <span className="text-sm text-white/50 truncate flex-1" title={entry.name}>
                {entry.name}
              </span>
            )}
            {entry.size !== undefined && (
              <span className="text-xs text-white/30">
                {formatBytes(entry.size)}
              </span>
            )}
          </div>
        )}
      </div>
    ));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleRefUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeProject) return;

    setUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('refType', 'general');

      const res = await fetch(`/api/projects/${activeProject.id}/upload-ref`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadMessage(`Uploaded: ${data.filename}`);
        // Refresh files list
        fetchFiles();
      } else {
        setUploadMessage(`Error: ${data.error || 'Upload failed'}`);
      }
    } catch (error) {
      setUploadMessage(`Error: ${String(error)}`);
    } finally {
      setUploading(false);
      // Clear message after 3 seconds
      setTimeout(() => setUploadMessage(null), 3000);
      // Reset file input
      event.target.value = '';
    }
  };

  if (!activeProject) {
    return (
      <div className="h-full flex items-center justify-center text-white/40">
        <p>Select a project to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-vs-card border-l border-vs-border">
      {/* Header */}
      <div className="p-4 border-b border-vs-border">
        <h2 className="text-lg font-medium text-white truncate" title={activeProject.name}>
          {activeProject.name}
        </h2>
        <p className="text-xs text-white/40 mt-1 font-mono">{activeProject.id}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-vs-border">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'files'
              ? 'text-vs-accent border-b-2 border-vs-accent'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'workflows'
              ? 'text-vs-accent border-b-2 border-vs-accent'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Workflows
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-vs-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'files' ? (
          <div className="p-2">
            {/* Upload Reference Button */}
            <div className="mb-3 px-2">
              <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-vs-accent/20 hover:bg-vs-accent/30 border border-vs-accent/50 rounded-lg cursor-pointer transition-colors">
                <svg className="w-4 h-4 text-vs-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm text-vs-accent font-medium">
                  {uploading ? 'Uploading...' : 'Upload Reference'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRefUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploadMessage && (
                <p className={`mt-1 text-xs text-center ${uploadMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>

            {/* File stats and actions */}
            <div className="mb-2 px-2 py-1 flex items-center justify-between">
              <span className="text-xs text-white/40">
                {fileStats ? `${fileStats.totalFiles} files · ${fileStats.totalSizeFormatted}` : 'Loading...'}
              </span>
              <div className="flex items-center gap-1">
                {/* Open in Explorer button */}
                <button
                  onClick={() => {
                    // Call API to open folder
                    fetch(`/api/projects/${activeProject?.id}/open-folder`, { method: 'POST' });
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Open folder in Explorer"
                >
                  <svg className="w-3.5 h-3.5 text-white/40 hover:text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                {/* Refresh button */}
                <button
                  onClick={fetchFiles}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Refresh files"
                >
                  <svg className="w-3.5 h-3.5 text-white/40 hover:text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            {files.length > 0 ? (
              renderFileTree(files)
            ) : (
              <p className="text-white/40 text-sm text-center py-4">No files yet</p>
            )}

            {/* Project path footer */}
            {activeProject && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 px-2">
                  <span className="text-xs text-white/30 truncate flex-1 font-mono" title={`db/users/user_001/projects/${activeProject.id}`}>
                    .../{activeProject.id}
                  </span>
                  <button
                    onClick={() => {
                      const fullPath = `C:\\Users\\yodes\\Documents\\n8n\\db\\users\\user_001\\projects\\${activeProject.id}`;
                      navigator.clipboard.writeText(fullPath);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Copy full path"
                  >
                    <svg className="w-3 h-3 text-white/40 hover:text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Workflows Used */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Workflows Used</h3>
              {workflows.length > 0 ? (
                <div className="space-y-2">
                  {workflows.map(wf => (
                    <div
                      key={wf.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80 truncate">{wf.name}</span>
                        <span className="text-xs text-vs-accent bg-vs-accent/20 px-2 py-0.5 rounded">
                          {wf.count}x
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        Last: {formatDate(wf.lastRun)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">No workflows recorded</p>
              )}
            </div>

            {/* Recent Executions */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Recent Executions</h3>
              {executions.length > 0 ? (
                <div className="space-y-1">
                  {executions.slice(0, 10).map(exec => (
                    <div
                      key={exec.id}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          exec.status === 'success'
                            ? 'bg-green-500'
                            : exec.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span className="text-xs text-white/60 truncate flex-1">
                        {exec.workflowName}
                      </span>
                      <span className="text-xs text-white/30">
                        {formatDuration(exec.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">No executions recorded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
