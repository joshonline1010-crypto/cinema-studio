import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  createdAt: Date;
  messageCount: number;
}

type Mode = 'auto' | 'planning' | 'prompts' | 'chat';
type Model = 'claude-opus' | 'claude-sonnet' | 'gpt-5.2' | 'gpt-4o' | 'qwen' | 'mistral';

interface AI2StudioState {
  // Messages
  messages: Message[];
  isGenerating: boolean;

  // Mode & Model
  mode: Mode;
  model: Model;

  // Sessions
  sessions: ChatSession[];
  currentSessionId: string;

  // UI State
  showHistory: boolean;
  showSettings: boolean;

  // Actions
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  setGenerating: (generating: boolean) => void;
  setMode: (mode: Mode) => void;
  setModel: (model: Model) => void;
  setShowHistory: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  loadSessions: () => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export const useAI2Store = create<AI2StudioState>((set, get) => ({
  // Initial state
  messages: [],
  isGenerating: false,
  mode: 'auto',
  model: 'claude-opus',
  sessions: [],
  currentSessionId: `session-${Date.now()}`,
  showHistory: false,
  showSettings: false,

  // Actions
  addMessage: (role, content) => set(state => ({
    messages: [...state.messages, {
      id: generateId(),
      role,
      content,
      timestamp: new Date()
    }]
  })),

  clearMessages: () => set({ messages: [] }),

  setGenerating: (generating) => set({ isGenerating: generating }),

  setMode: (mode) => set({ mode }),

  setModel: (model) => set({ model }),

  setShowHistory: (show) => set({ showHistory: show }),

  setShowSettings: (show) => set({ showSettings: show }),

  createNewSession: () => {
    const newSessionId = `session-${Date.now()}`;
    set({
      currentSessionId: newSessionId,
      messages: []
    });
  },

  loadSession: async (sessionId) => {
    try {
      const response = await fetch(`/api/ai/chat?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.history) {
        set({
          currentSessionId: sessionId,
          messages: data.history.map((msg: any, i: number) => ({
            id: `${sessionId}-${i}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date()
          }))
        });
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  },

  loadSessions: async () => {
    try {
      const response = await fetch('/api/ai/chat?sessionId=default');
      const data = await response.json();

      // Use sessionsWithInfo if available (includes timestamps), fall back to sessions array
      if (data.sessionsWithInfo) {
        set({
          sessions: data.sessionsWithInfo.map((s: any) => {
            // Format the date nicely
            const date = new Date(s.timestamp);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const displayName = isToday
              ? `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            return {
              id: s.id,
              name: displayName,
              createdAt: date,
              messageCount: 0
            };
          })
        });
      } else if (data.sessions) {
        set({
          sessions: data.sessions.map((id: string) => ({
            id,
            name: id,
            createdAt: new Date(),
            messageCount: 0
          }))
        });
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }
}));
