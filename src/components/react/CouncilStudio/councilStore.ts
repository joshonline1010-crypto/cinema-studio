// @ts-nocheck
// DEPRECATED: Council Store - replaced by V2 pipeline
// Council Store - Zustand state management for the Council system
import { create } from 'zustand';
import type {
  Shot,
  Plan,
  RefImage,
  ChatMessage,
  AgentDecision,
  ConsensusResult,
  CouncilMeeting,
  PipelinePhase,
  GeneratedAsset,
  ShotContext,
  DatabaseShot,
  ReverseEngineeredScene,
  ShotFilters
} from './agents/types';
import { runCouncilMeeting } from './agents/councilOrchestrator';

// ============================================
// STORE STATE INTERFACE
// ============================================

// Session metadata type
interface SessionMeta {
  name: string;
  displayName?: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  planCount: number;
  meetingCount: number;
}

interface CouncilState {
  // Session Management
  currentSessionName: string | null;
  sessionList: SessionMeta[];
  sessionCreatedAt: number | null;
  hasUnsavedChanges: boolean;

  // Chat & Messages
  messages: ChatMessage[];
  isLoading: boolean;
  currentSessionId: string | null;

  // Plan Management
  currentPlan: Plan | null;
  accumulatedPlans: Plan[];

  // Reference Images
  refs: RefImage[];
  characterRefs: RefImage[];
  locationRefs: RefImage[];
  productRefs: RefImage[];

  // Council State
  councilEnabled: boolean;
  currentMeeting: CouncilMeeting | null;
  meetingHistory: CouncilMeeting[];
  agentDecisions: AgentDecision[];
  consensus: ConsensusResult | null;

  // Database State
  databaseConnected: boolean;
  shotQueryResults: DatabaseShot[];
  activeScene: ReverseEngineeredScene | null;
  shotFilters: ShotFilters;

  // Pipeline State
  pipelinePhase: PipelinePhase;
  generatedAssets: GeneratedAsset[];
  generationProgress: { current: number; total: number };
  finalVideoUrl: string | null;

  // UI State
  activeTab: 'chat' | 'council' | 'database' | 'pipeline';
  showCouncilPanel: boolean;
  autoApprove: boolean;
  selectedDirector: string | null;

  // Settings
  videoModel: 'kling-2.6' | 'kling-o1' | 'seedance-1.5' | 'auto';
  defaultDuration: '5' | '10';

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;

  setPlan: (plan: Plan | null) => void;
  addPlan: (plan: Plan) => void;
  clearPlans: () => void;

  addRef: (ref: RefImage) => void;
  removeRef: (id: string) => void;
  clearRefs: () => void;

  setCouncilEnabled: (enabled: boolean) => void;
  runMeeting: (context: ShotContext) => Promise<ConsensusResult>;
  clearMeeting: () => void;
  overrideDecision: (agent: string, newDecision: any) => void;
  approveConsensus: () => Promise<void>;

  setDatabaseConnected: (connected: boolean) => void;
  setShotQueryResults: (shots: DatabaseShot[]) => void;
  setActiveScene: (scene: ReverseEngineeredScene | null) => void;
  setShotFilters: (filters: Partial<ShotFilters>) => void;
  queryShots: (filters: ShotFilters) => Promise<void>;
  loadScene: (sceneId: string) => Promise<void>;

  setPipelinePhase: (phase: PipelinePhase) => void;
  addGeneratedAsset: (asset: GeneratedAsset) => void;
  updateAssetStatus: (id: string, status: GeneratedAsset['status']) => void;
  setFinalVideoUrl: (url: string | null) => void;

  setActiveTab: (tab: CouncilState['activeTab']) => void;
  setShowCouncilPanel: (show: boolean) => void;
  setAutoApprove: (auto: boolean) => void;
  setSelectedDirector: (director: string | null) => void;
  setVideoModel: (model: CouncilState['videoModel']) => void;
  setDefaultDuration: (duration: '5' | '10') => void;

  // Session Actions
  saveSession: (name: string) => Promise<void>;
  loadSession: (name: string) => Promise<void>;
  listSessions: () => Promise<void>;
  deleteSession: (name: string) => Promise<void>;
  newSession: () => void;
  setCurrentSessionName: (name: string | null) => void;

  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // Session Management
  currentSessionName: null as string | null,
  sessionList: [] as SessionMeta[],
  sessionCreatedAt: null as number | null,
  hasUnsavedChanges: false,

  // Chat & Messages
  messages: [] as ChatMessage[],
  isLoading: false,
  currentSessionId: null as string | null,

  // Plan Management
  currentPlan: null,
  accumulatedPlans: [],

  // Reference Images
  refs: [],
  characterRefs: [],
  locationRefs: [],
  productRefs: [],

  // Council State
  councilEnabled: true,
  currentMeeting: null,
  meetingHistory: [],
  agentDecisions: [],
  consensus: null,

  // Database State
  databaseConnected: false,
  shotQueryResults: [],
  activeScene: null,
  shotFilters: {},

  // Pipeline State
  pipelinePhase: 'idle' as PipelinePhase,
  generatedAssets: [],
  generationProgress: { current: 0, total: 0 },
  finalVideoUrl: null,

  // UI State
  activeTab: 'chat' as const,
  showCouncilPanel: true,
  autoApprove: false, // Default to showing council decisions for review
  selectedDirector: null,

  // Settings
  videoModel: 'auto' as const,
  defaultDuration: '5' as const,
};

// ============================================
// CREATE STORE
// ============================================

export const useCouncilStore = create<CouncilState>((set, get) => ({
  ...initialState,

  // ============================================
  // MESSAGE ACTIONS
  // ============================================

  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      }
    ]
  })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  // ============================================
  // PLAN ACTIONS
  // ============================================

  setPlan: (plan) => set({ currentPlan: plan }),

  addPlan: (plan) => set((state) => ({
    accumulatedPlans: [...state.accumulatedPlans, plan],
    currentPlan: plan
  })),

  clearPlans: () => set({ currentPlan: null, accumulatedPlans: [] }),

  // ============================================
  // REF ACTIONS
  // ============================================

  addRef: (ref) => set((state) => {
    const newRefs = [...state.refs, ref];

    // Also add to typed ref arrays
    const updates: Partial<CouncilState> = { refs: newRefs };

    if (ref.type === 'character') {
      updates.characterRefs = [...state.characterRefs, ref];
    } else if (ref.type === 'location') {
      updates.locationRefs = [...state.locationRefs, ref];
    } else if (ref.type === 'product') {
      updates.productRefs = [...state.productRefs, ref];
    }

    return updates;
  }),

  removeRef: (id) => set((state) => ({
    refs: state.refs.filter(r => r.id !== id),
    characterRefs: state.characterRefs.filter(r => r.id !== id),
    locationRefs: state.locationRefs.filter(r => r.id !== id),
    productRefs: state.productRefs.filter(r => r.id !== id),
  })),

  clearRefs: () => set({
    refs: [],
    characterRefs: [],
    locationRefs: [],
    productRefs: []
  }),

  // ============================================
  // COUNCIL ACTIONS
  // ============================================

  setCouncilEnabled: (enabled) => set({ councilEnabled: enabled }),

  runMeeting: async (context) => {
    const meeting: CouncilMeeting = {
      id: `meeting_${Date.now()}`,
      context,
      decisions: [],
      consensus: null,
      status: 'deliberating',
      timestamp: Date.now()
    };

    set({ currentMeeting: meeting, isLoading: true });

    try {
      // Run the actual council meeting
      const consensus = await runCouncilMeeting(context);

      // Update meeting with results
      const completedMeeting: CouncilMeeting = {
        ...meeting,
        decisions: consensus.agentDecisions,
        consensus,
        status: consensus.requiresReview ? 'review' : 'consensus'
      };

      set((state) => ({
        currentMeeting: completedMeeting,
        meetingHistory: [...state.meetingHistory, completedMeeting],
        agentDecisions: consensus.agentDecisions,
        consensus,
        isLoading: false
      }));

      return consensus;
    } catch (error) {
      console.error('[Council Store] Meeting failed:', error);

      set({
        currentMeeting: { ...meeting, status: 'review' },
        isLoading: false
      });

      throw error;
    }
  },

  clearMeeting: () => set({
    currentMeeting: null,
    agentDecisions: [],
    consensus: null
  }),

  overrideDecision: (agent, newDecision) => set((state) => {
    const updatedDecisions = state.agentDecisions.map(d =>
      d.agent === agent ? { ...d, recommendation: newDecision } : d
    );
    return { agentDecisions: updatedDecisions };
  }),

  approveConsensus: async () => {
    const state = get();
    const { consensus, currentMeeting, agentDecisions, refs } = state;

    if (!consensus || !currentMeeting) {
      console.error('[Council Store] No consensus to approve');
      return;
    }

    console.log('[Council Store] Approving consensus:', consensus.finalDecision);

    // Update meeting status to approved
    set({
      currentMeeting: { ...currentMeeting, status: 'approved' as any },
      pipelinePhase: 'generating',
      generationProgress: { current: 0, total: 1 }
    });

    try {
      // Get the context from the meeting
      const context = currentMeeting.context;

      // Build generation request from consensus
      const generationRequest = {
        prompt: context.prompt,
        model: consensus.finalDecision.model,
        duration: consensus.finalDecision.duration,
        motionPrompt: agentDecisions.find(d => d.agent === 'technical')?.recommendation?.suggestedMotionPrompt,
        director: context.director,
        refs: refs,
        chainStrategy: consensus.finalDecision.chainStrategy,
        // Include agent reasoning for logging
        councilDecision: {
          agentDecisions,
          consensus
        }
      };

      // Add user message about approval
      get().addMessage({
        role: 'user',
        content: `[APPROVED] Council decision: ${consensus.finalDecision.model} @ ${consensus.finalDecision.duration}s`,
        type: 'action'
      });

      // Call generation API
      const response = await fetch('/api/council/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationRequest)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Generation failed');
      }

      const result = await response.json();

      // Add generated asset
      const asset: GeneratedAsset = {
        id: `asset_${Date.now()}`,
        type: 'video',
        url: result.videoUrl || result.imageUrl,
        prompt: context.prompt,
        model: consensus.finalDecision.model,
        status: 'complete',
        timestamp: Date.now(),
        metadata: {
          duration: consensus.finalDecision.duration,
          cost: consensus.finalDecision.estimatedCost,
          councilDecision: consensus
        }
      };

      set((state) => ({
        generatedAssets: [...state.generatedAssets, asset],
        pipelinePhase: 'complete',
        generationProgress: { current: 1, total: 1 },
        hasUnsavedChanges: true
      }));

      // Add success message
      get().addMessage({
        role: 'assistant',
        content: `Generation complete! Created ${asset.type} using ${consensus.finalDecision.model}.`,
        type: 'success',
        metadata: { assetId: asset.id, url: asset.url }
      });

      console.log('[Council Store] Generation complete:', asset);

    } catch (error: any) {
      console.error('[Council Store] Generation failed:', error);

      set({
        pipelinePhase: 'error',
        currentMeeting: { ...currentMeeting, status: 'review' as any }
      });

      // Add error message
      get().addMessage({
        role: 'assistant',
        content: `Generation failed: ${error.message}`,
        type: 'error'
      });
    }
  },

  // ============================================
  // DATABASE ACTIONS
  // ============================================

  setDatabaseConnected: (connected) => set({ databaseConnected: connected }),

  setShotQueryResults: (shots) => set({ shotQueryResults: shots }),

  setActiveScene: (scene) => set({ activeScene: scene }),

  setShotFilters: (filters) => set((state) => ({
    shotFilters: { ...state.shotFilters, ...filters }
  })),

  queryShots: async (filters) => {
    set({ isLoading: true });

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/council/database/shots?${params}`);
      if (!response.ok) throw new Error('Failed to query shots');

      const data = await response.json();
      set({
        shotQueryResults: data.shots || [],
        databaseConnected: true,
        isLoading: false
      });
    } catch (error) {
      console.error('[Council Store] Shot query failed:', error);
      set({ isLoading: false });
    }
  },

  loadScene: async (sceneId) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`/api/council/database/scenes?id=${sceneId}`);
      if (!response.ok) throw new Error('Failed to load scene');

      const data = await response.json();
      set({
        activeScene: data.scene || null,
        isLoading: false
      });
    } catch (error) {
      console.error('[Council Store] Scene load failed:', error);
      set({ isLoading: false });
    }
  },

  // ============================================
  // PIPELINE ACTIONS
  // ============================================

  setPipelinePhase: (phase) => set({ pipelinePhase: phase }),

  addGeneratedAsset: (asset) => set((state) => ({
    generatedAssets: [...state.generatedAssets, asset]
  })),

  updateAssetStatus: (id, status) => set((state) => ({
    generatedAssets: state.generatedAssets.map(a =>
      a.id === id ? { ...a, status } : a
    )
  })),

  setFinalVideoUrl: (url) => set({ finalVideoUrl: url }),

  // ============================================
  // UI ACTIONS
  // ============================================

  setActiveTab: (tab) => set({ activeTab: tab }),

  setShowCouncilPanel: (show) => set({ showCouncilPanel: show }),

  setAutoApprove: (auto) => set({ autoApprove: auto }),

  setSelectedDirector: (director) => set({ selectedDirector: director }),

  setVideoModel: (model) => set({ videoModel: model }),

  setDefaultDuration: (duration) => set({ defaultDuration: duration }),

  // ============================================
  // SESSION ACTIONS
  // ============================================

  setCurrentSessionName: (name) => set({ currentSessionName: name }),

  saveSession: async (name) => {
    const state = get();
    set({ isLoading: true });

    try {
      const response = await fetch('/api/council/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          data: {
            messages: state.messages,
            currentPlan: state.currentPlan,
            plans: state.accumulatedPlans,
            refs: state.refs,
            meetingHistory: state.meetingHistory,
            generatedAssets: state.generatedAssets,
            councilEnabled: state.councilEnabled,
            autoApprove: state.autoApprove,
            selectedDirector: state.selectedDirector,
            videoModel: state.videoModel,
            defaultDuration: state.defaultDuration,
            createdAt: state.sessionCreatedAt || Date.now()
          }
        })
      });

      if (!response.ok) throw new Error('Failed to save session');

      const data = await response.json();
      console.log('[Council Store] Session saved:', data.sessionName);

      set({
        currentSessionName: data.sessionName,
        hasUnsavedChanges: false,
        isLoading: false
      });

      // Refresh session list
      get().listSessions();
    } catch (error) {
      console.error('[Council Store] Save session failed:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadSession: async (name) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`/api/council/session?name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Failed to load session');

      const data = await response.json();
      const session = data.session;

      console.log('[Council Store] Loading session:', name, session);

      set({
        currentSessionName: name,
        sessionCreatedAt: session.meta?.createdAt || Date.now(),
        messages: session.messages || [],
        accumulatedPlans: session.plans || [],
        currentPlan: session.plans?.[session.plans.length - 1] || null,
        refs: session.refs || [],
        characterRefs: session.refs?.filter((r: any) => r.type === 'character') || [],
        locationRefs: session.refs?.filter((r: any) => r.type === 'location') || [],
        productRefs: session.refs?.filter((r: any) => r.type === 'product') || [],
        meetingHistory: session.meetingHistory || [],
        generatedAssets: session.generatedAssets || [],
        councilEnabled: session.settings?.councilEnabled ?? true,
        autoApprove: session.settings?.autoApprove ?? false,
        selectedDirector: session.settings?.selectedDirector || null,
        videoModel: session.settings?.videoModel || 'auto',
        defaultDuration: session.settings?.defaultDuration || '5',
        hasUnsavedChanges: false,
        isLoading: false
      });

    } catch (error) {
      console.error('[Council Store] Load session failed:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  listSessions: async () => {
    try {
      const response = await fetch('/api/council/session');
      if (!response.ok) throw new Error('Failed to list sessions');

      const data = await response.json();
      set({ sessionList: data.sessions || [] });
    } catch (error) {
      console.error('[Council Store] List sessions failed:', error);
    }
  },

  deleteSession: async (name) => {
    try {
      const response = await fetch(`/api/council/session?name=${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete session');

      console.log('[Council Store] Session deleted:', name);

      // If deleting current session, clear it
      const state = get();
      if (state.currentSessionName === name) {
        set({ currentSessionName: null });
      }

      // Refresh session list
      get().listSessions();
    } catch (error) {
      console.error('[Council Store] Delete session failed:', error);
      throw error;
    }
  },

  newSession: () => {
    set({
      ...initialState,
      sessionCreatedAt: Date.now(),
      hasUnsavedChanges: false
    });
  },

  // ============================================
  // RESET
  // ============================================

  reset: () => set(initialState),
}));

// Export type for external use
export type { CouncilState };
