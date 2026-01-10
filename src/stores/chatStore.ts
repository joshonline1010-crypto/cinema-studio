// Chat state management with Zustand
import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  media?: { type: 'image' | 'video'; url: string }[];
}

export interface Agent {
  id: string;
  name: string;
  endpoint: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string | null;
  modified: string;
  outputCount?: number;
}

export const AVAILABLE_AGENTS: Agent[] = [
  { id: 'visual-story-v2', name: 'Visual Story v2 (Main)', endpoint: '/webhook/visual-story-agent/chat' },
  { id: 'movieagent-standalone', name: 'MovieAgent (Story to Shots)', endpoint: '/webhook/movieagent-standalone/chat' },
  { id: 'visual-intake', name: 'Story Intake (New!)', endpoint: '/webhook/visual-story-intake/chat' },
  { id: 'visual-story', name: 'Visual Story Agent', endpoint: '/webhook/visual-story-agent/chat' },
  { id: 'universal-v5', name: 'Universal v5 (Memory)', endpoint: '/webhook/universal-v5/chat' },
  { id: 'chip-agent-v2', name: 'CHIP Agent v2', endpoint: '/webhook/chip-agent-v2/chat' },
  { id: 'universal-agent', name: 'Universal Agent', endpoint: '/webhook/test-universal/chat' },
];

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  chatSessionId: string | null;
  currentAgent: Agent;

  // Project state
  activeProject: Project | null;
  projects: Project[];
  projectsLoading: boolean;

  sendMessage: (content: string, userId: string) => Promise<void>;
  clearMessages: () => void;
  setSessionId: (id: string) => void;
  setAgent: (agent: Agent) => void;

  // Project actions
  fetchProjects: () => Promise<void>;
  createProject: (name: string) => Promise<string | null>;
  selectProject: (projectId: string) => Promise<void>;
  clearProject: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  chatSessionId: null,
  currentAgent: AVAILABLE_AGENTS[0],

  // Project state
  activeProject: null,
  projects: [],
  projectsLoading: false,

  sendMessage: async (content: string, userId: string) => {
    const { chatSessionId, messages, currentAgent, activeProject } = get();

    // Use project ID as session ID if we have an active project
    const sessionId = activeProject?.id || chatSessionId || `${userId}_${Date.now()}`;
    if (!chatSessionId) {
      set({ chatSessionId: sessionId });
    }

    // Add user message immediately
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    set({
      messages: [...messages, userMsg],
      isLoading: true,
      error: null
    });

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: content,
          chatSessionId: sessionId,
          projectId: activeProject?.id,
          agentEndpoint: currentAgent.endpoint
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Extract response text
      let responseText = data.response || data.output || '';

      // If response is an object, try to extract meaningful text
      if (typeof responseText === 'object') {
        responseText = JSON.stringify(responseText, null, 2);
      }

      // Helper to convert local paths to API URLs
      const toDisplayUrl = (urlOrPath: string): string => {
        if (!urlOrPath) return '';
        // If it's already a URL, use it directly
        if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
          return urlOrPath;
        }
        // If it's a local path under db/users, convert to API URL
        const userPathMatch = urlOrPath.match(/db\\\\users\\\\(.+)/) || urlOrPath.match(/db\/users\/(.+)/);
        if (userPathMatch) {
          return '/api/files/' + userPathMatch[1].replace(/\\\\/g, '/').replace(/\\/g, '/');
        }
        return urlOrPath;
      };

      // Extract media if present
      const media: Message['media'] = [];
      if (data.media && Array.isArray(data.media)) {
        for (const item of data.media) {
          media.push({
            type: item.type || 'image',
            url: toDisplayUrl(item.url || item.path || item.localPath)
          });
        }
      }

      // Check for image/video URLs in response
      if (data.imageUrl || data.image_url) {
        media.push({ type: 'image', url: toDisplayUrl(data.imageUrl || data.image_url) });
      }
      if (data.videoUrl || data.video_url) {
        media.push({ type: 'video', url: toDisplayUrl(data.videoUrl || data.video_url) });
      }
      if (data.localPath || data.local_path) {
        const localPath = data.localPath || data.local_path;
        const ext = localPath.split('.').pop()?.toLowerCase();
        const type = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image';
        media.push({ type, url: toDisplayUrl(localPath) });
      }

      // Handle Universal API response format with urls object
      if (data.urls) {
        if (data.urls.image) {
          media.push({ type: 'image', url: toDisplayUrl(data.urls.image) });
        }
        if (data.urls.video) {
          media.push({ type: 'video', url: toDisplayUrl(data.urls.video) });
        }
        // Also check 'all' array for any additional URLs
        if (data.urls.all && Array.isArray(data.urls.all)) {
          for (const url of data.urls.all) {
            if (!media.some(m => m.url === url)) {
              const ext = url.split('.').pop()?.toLowerCase() || '';
              const type = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image';
              media.push({ type, url: toDisplayUrl(url) });
            }
          }
        }
      }

      // Extract URLs from response text (FAL AI, etc.)
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)/gi;
      const foundUrls = responseText.match(urlRegex) || [];
      for (const url of foundUrls) {
        const ext = url.split('.').pop()?.toLowerCase() || '';
        const type = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image';
        // Avoid duplicates
        if (!media.some(m => m.url === url)) {
          media.push({ type, url });
        }
      }

      // Add assistant response
      const assistantMsg: Message = {
        id: `msg_${Date.now()}_resp`,
        role: 'assistant',
        content: responseText || 'Done!',
        timestamp: new Date(),
        media: media.length > 0 ? media : undefined
      };

      set(state => ({
        messages: [...state.messages, assistantMsg],
        isLoading: false
      }));

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Add error message
      const errorMsg: Message = {
        id: `msg_${Date.now()}_err`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date()
      };

      set(state => ({
        messages: [...state.messages, errorMsg]
      }));
    }
  },

  clearMessages: () => set({ messages: [], chatSessionId: null, error: null }),

  setSessionId: (id: string) => set({ chatSessionId: id }),

  setAgent: (agent: Agent) => set({ currentAgent: agent, messages: [], chatSessionId: null, error: null }),

  // Project actions
  fetchProjects: async () => {
    set({ projectsLoading: true });
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        set({ projects: data.projects || [], projectsLoading: false });
      } else {
        set({ projectsLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ projectsLoading: false });
    }
  },

  createProject: async (name: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const data = await response.json();
        const newProject: Project = {
          id: data.projectId,
          name: data.name,
          thumbnail: null,
          modified: new Date().toISOString(),
          outputCount: 0
        };

        set(state => ({
          projects: [newProject, ...state.projects],
          activeProject: newProject,
          chatSessionId: data.projectId,
          messages: [],
          error: null
        }));

        return data.projectId;
      }
      return null;
    } catch (error) {
      console.error('Failed to create project:', error);
      return null;
    }
  },

  selectProject: async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const project = data.project;

        // Convert API messages to store format
        const messages: Message[] = (project.messages || []).map((msg: any, idx: number) => ({
          id: `loaded_${idx}_${Date.now()}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          media: msg.media
        }));

        set({
          activeProject: {
            id: project.id,
            name: project.name,
            thumbnail: project.thumbnail,
            modified: project.modified,
            outputCount: project.outputCount
          },
          chatSessionId: project.id,
          messages,
          error: null
        });
      }
    } catch (error) {
      console.error('Failed to select project:', error);
    }
  },

  clearProject: () => set({
    activeProject: null,
    chatSessionId: null,
    messages: [],
    error: null
  })
}));
