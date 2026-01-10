import { useState, useEffect } from 'react';
import { useChatStore, AVAILABLE_AGENTS, type Agent, type Project } from '../../stores/chatStore';

interface SidebarProps {
  userId: string;
}

export default function Sidebar({ userId }: SidebarProps) {
  const {
    currentAgent,
    setAgent,
    activeProject,
    projects,
    projectsLoading,
    fetchProjects,
    createProject,
    selectProject,
    clearProject
  } = useChatStore();

  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAgentSelect = (agent: Agent) => {
    if (agent.id !== currentAgent.id) {
      setAgent(agent);
    }
  };

  const handleNewProject = async () => {
    if (!newProjectName.trim()) return;

    setCreating(true);
    await createProject(newProjectName.trim());
    setCreating(false);
    setNewProjectName('');
    setShowNewProject(false);
  };

  const handleProjectSelect = (project: Project) => {
    if (activeProject?.id !== project.id) {
      selectProject(project.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside className="w-64 bg-vs-card border-r border-vs-border p-4 flex flex-col">
      {/* Agents Section */}
      <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Agents</h3>
      <div className="space-y-1">
        {AVAILABLE_AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleAgentSelect(agent)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
              currentAgent.id === agent.id
                ? 'bg-vs-accent/20 text-vs-accent border border-vs-accent/30'
                : 'hover:bg-white/5 text-white/70'
            }`}
          >
            {agent.name}
          </button>
        ))}
      </div>

      {/* Projects Section */}
      <div className="mt-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Projects</h3>
          <button
            onClick={() => setShowNewProject(true)}
            className="text-xs text-vs-accent hover:text-vs-accent/80 transition-colors"
            title="New Project"
          >
            + New
          </button>
        </div>

        {/* New Project Input */}
        {showNewProject && (
          <div className="mb-3 p-2 bg-white/5 rounded-lg border border-white/10">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              autoFocus
              className="w-full px-2 py-1 bg-transparent text-sm text-white placeholder-white/40 border-none outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNewProject();
                if (e.key === 'Escape') {
                  setShowNewProject(false);
                  setNewProjectName('');
                }
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleNewProject}
                disabled={!newProjectName.trim() || creating}
                className="flex-1 px-2 py-1 text-xs bg-vs-accent text-white rounded disabled:opacity-50"
              >
                {creating ? '...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProjectName('');
                }}
                className="px-2 py-1 text-xs text-white/50 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Start Fresh Button */}
        <button
          onClick={clearProject}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm mb-2 ${
            !activeProject
              ? 'bg-white/10 text-white border border-white/20'
              : 'hover:bg-white/5 text-white/50'
          }`}
        >
          + New Chat
        </button>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {projectsLoading ? (
            <div className="text-white/40 text-sm text-center py-4">
              <div className="w-4 h-4 border-2 border-vs-accent border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-4">No projects yet</p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className={`w-full text-left rounded-lg transition-colors ${
                  activeProject?.id === project.id
                    ? 'bg-vs-accent/20 border border-vs-accent/30'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex gap-2 p-2">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded bg-white/10 flex-shrink-0 overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${
                      activeProject?.id === project.id ? 'text-vs-accent' : 'text-white/80'
                    }`}>
                      {project.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {formatDate(project.modified)}
                      {project.outputCount ? ` · ${project.outputCount} outputs` : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-vs-border">
        <div className="text-xs text-white/40 space-y-1">
          <p>User: {userId}</p>
          <p>Agent: {currentAgent.name}</p>
          {activeProject && (
            <p className="text-vs-accent/70 truncate" title={activeProject.name}>
              Project: {activeProject.name}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
