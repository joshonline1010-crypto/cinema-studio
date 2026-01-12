/* empty css                                  */
import { e as createComponent, f as createAstro, p as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D9cEOE7x.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DmOU0m9k.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { create } from 'zustand';
export { renderers } from '../renderers.mjs';

const AVAILABLE_AGENTS = [
  { id: "visual-story-v2", name: "Visual Story v2 (Main)", endpoint: "/webhook/visual-story-agent/chat" },
  { id: "movieagent-standalone", name: "MovieAgent (Story to Shots)", endpoint: "/webhook/movieagent-standalone/chat" },
  { id: "visual-intake", name: "Story Intake (New!)", endpoint: "/webhook/visual-story-intake/chat" },
  { id: "visual-story", name: "Visual Story Agent", endpoint: "/webhook/visual-story-agent/chat" },
  { id: "universal-v5", name: "Universal v5 (Memory)", endpoint: "/webhook/universal-v5/chat" },
  { id: "chip-agent-v2", name: "CHIP Agent v2", endpoint: "/webhook/chip-agent-v2/chat" },
  { id: "universal-agent", name: "Universal Agent", endpoint: "/webhook/test-universal/chat" }
];
const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  chatSessionId: null,
  currentAgent: AVAILABLE_AGENTS[0],
  // Project state
  activeProject: null,
  projects: [],
  projectsLoading: false,
  sendMessage: async (content, userId) => {
    const { chatSessionId, messages, currentAgent, activeProject } = get();
    const sessionId = activeProject?.id || chatSessionId || `${userId}_${Date.now()}`;
    if (!chatSessionId) {
      set({ chatSessionId: sessionId });
    }
    const userMsg = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      timestamp: /* @__PURE__ */ new Date()
    };
    set({
      messages: [...messages, userMsg],
      isLoading: true,
      error: null
    });
    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: content,
          chatSessionId: sessionId,
          projectId: activeProject?.id,
          agentEndpoint: currentAgent.endpoint
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
      const data = await response.json();
      let responseText = data.response || data.output || "";
      if (typeof responseText === "object") {
        responseText = JSON.stringify(responseText, null, 2);
      }
      const toDisplayUrl = (urlOrPath) => {
        if (!urlOrPath) return "";
        if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
          return urlOrPath;
        }
        const userPathMatch = urlOrPath.match(/db\\\\users\\\\(.+)/) || urlOrPath.match(/db\/users\/(.+)/);
        if (userPathMatch) {
          return "/api/files/" + userPathMatch[1].replace(/\\\\/g, "/").replace(/\\/g, "/");
        }
        return urlOrPath;
      };
      const media = [];
      if (data.media && Array.isArray(data.media)) {
        for (const item of data.media) {
          media.push({
            type: item.type || "image",
            url: toDisplayUrl(item.url || item.path || item.localPath)
          });
        }
      }
      if (data.imageUrl || data.image_url) {
        media.push({ type: "image", url: toDisplayUrl(data.imageUrl || data.image_url) });
      }
      if (data.videoUrl || data.video_url) {
        media.push({ type: "video", url: toDisplayUrl(data.videoUrl || data.video_url) });
      }
      if (data.localPath || data.local_path) {
        const localPath = data.localPath || data.local_path;
        const ext = localPath.split(".").pop()?.toLowerCase();
        const type = ["mp4", "webm", "mov"].includes(ext) ? "video" : "image";
        media.push({ type, url: toDisplayUrl(localPath) });
      }
      if (data.urls) {
        if (data.urls.image) {
          media.push({ type: "image", url: toDisplayUrl(data.urls.image) });
        }
        if (data.urls.video) {
          media.push({ type: "video", url: toDisplayUrl(data.urls.video) });
        }
        if (data.urls.all && Array.isArray(data.urls.all)) {
          for (const url of data.urls.all) {
            if (!media.some((m) => m.url === url)) {
              const ext = url.split(".").pop()?.toLowerCase() || "";
              const type = ["mp4", "webm", "mov"].includes(ext) ? "video" : "image";
              media.push({ type, url: toDisplayUrl(url) });
            }
          }
        }
      }
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)/gi;
      const foundUrls = responseText.match(urlRegex) || [];
      for (const url of foundUrls) {
        const ext = url.split(".").pop()?.toLowerCase() || "";
        const type = ["mp4", "webm", "mov"].includes(ext) ? "video" : "image";
        if (!media.some((m) => m.url === url)) {
          media.push({ type, url });
        }
      }
      const assistantMsg = {
        id: `msg_${Date.now()}_resp`,
        role: "assistant",
        content: responseText || "Done!",
        timestamp: /* @__PURE__ */ new Date(),
        media: media.length > 0 ? media : void 0
      };
      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isLoading: false
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      const errorMsg = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to send message"}`,
        timestamp: /* @__PURE__ */ new Date()
      };
      set((state) => ({
        messages: [...state.messages, errorMsg]
      }));
    }
  },
  clearMessages: () => set({ messages: [], chatSessionId: null, error: null }),
  setSessionId: (id) => set({ chatSessionId: id }),
  setAgent: (agent) => set({ currentAgent: agent, messages: [], chatSessionId: null, error: null }),
  // Project actions
  fetchProjects: async () => {
    set({ projectsLoading: true });
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        set({ projects: data.projects || [], projectsLoading: false });
      } else {
        set({ projectsLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      set({ projectsLoading: false });
    }
  },
  createProject: async (name) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        const data = await response.json();
        const newProject = {
          id: data.projectId,
          name: data.name,
          thumbnail: null,
          modified: (/* @__PURE__ */ new Date()).toISOString(),
          outputCount: 0
        };
        set((state) => ({
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
      console.error("Failed to create project:", error);
      return null;
    }
  },
  selectProject: async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const project = data.project;
        const messages = (project.messages || []).map((msg, idx) => ({
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
      console.error("Failed to select project:", error);
    }
  },
  clearProject: () => set({
    activeProject: null,
    chatSessionId: null,
    messages: [],
    error: null
  })
}));

const ALL_CHECKPOINTS = [
  { id: "genre", label: "STYLE", icon: "🎨", description: "Genre & tone" },
  { id: "opening", label: "OPENING", icon: "🎬", description: "How it starts" },
  { id: "character", label: "CHARACTER", icon: "👤", description: "Character look" },
  { id: "environment", label: "LOCATION", icon: "🏰", description: "Where it happens" },
  { id: "scare", label: "TENSION", icon: "😱", description: "Scary moment" },
  { id: "reveal", label: "REVEAL", icon: "💡", description: "Truth revealed" },
  { id: "ending", label: "ENDING", icon: "🎭", description: "How it ends" }
];
function StoryboardProgress({ projectId, userId }) {
  const [state, setState] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!projectId) {
      setState(null);
      return;
    }
    const fetchState = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}/state`);
        if (response.ok) {
          const data = await response.json();
          setState(data);
        } else if (response.status === 404) {
          setState(null);
        } else {
          throw new Error("Failed to fetch state");
        }
      } catch (e) {
        console.error("Error fetching state:", e);
        setError("Failed to load story progress");
      } finally {
        setIsLoading(false);
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 3e3);
    return () => clearInterval(interval);
  }, [projectId]);
  if (isLoading && !state) {
    return /* @__PURE__ */ jsx("div", { className: "bg-white/5 border border-white/10 rounded-xl p-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-white/50", children: [
      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-violet-400 rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Loading story progress..." })
    ] }) });
  }
  if (!projectId || !state) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg", children: "📖" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Story Progress" }),
          /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded-full", children: "0/7 locked" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-white/40", children: "Start chatting to build your story" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2", children: ALL_CHECKPOINTS.map((checkpoint) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "p-3 rounded-lg border border-dashed border-white/20 bg-white/5",
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl mb-1 opacity-50", children: checkpoint.icon }),
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/50 truncate", children: checkpoint.label }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-white/30 mt-1", children: checkpoint.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border border-white/20 rounded-full" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-white/30", children: "Empty" })
            ] })
          ]
        },
        checkpoint.id
      )) }) })
    ] });
  }
  const lockedCount = state.checkpoints_completed?.length || 0;
  const totalNeeded = (state.gaps_to_fill?.length || 0) + lockedCount;
  const progressPercent = totalNeeded > 0 ? lockedCount / totalNeeded * 100 : 0;
  const relevantCheckpoints = ALL_CHECKPOINTS.filter(
    (cp) => state.checkpoints_completed?.includes(cp.id) || state.gaps_to_fill?.includes(cp.id)
  );
  if (relevantCheckpoints.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "bg-white/5 border border-white/10 rounded-xl p-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: "📖" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white/70", children: "Story Progress" }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full", children: state.current_phase?.replace("_", " ") })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-white/40", children: "Gathering story details..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsExpanded(!isExpanded),
        className: "w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg", children: "📖" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Story Progress" }),
            /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full", children: [
              lockedCount,
              "/",
              totalNeeded,
              " locked"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-1.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500",
                style: { width: `${progressPercent}%` }
              }
            ) }),
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: `w-4 h-4 text-white/50 transition-transform ${isExpanded ? "rotate-180" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
              }
            )
          ] })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 text-xs text-white/50", children: [
        /* @__PURE__ */ jsx("span", { children: "Phase:" }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-white/10 rounded text-white/70", children: state.current_phase?.replace("_", " ") }),
        state.status === "ALL_LOCKED" && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-green-500/20 text-green-400 rounded", children: "Ready for Storyboard!" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2", children: relevantCheckpoints.map((checkpoint) => {
        const isLocked = state.checkpoints_completed?.includes(checkpoint.id);
        const lockedData = state.locked?.[checkpoint.id];
        const refImage = state.reference_images?.[checkpoint.id];
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `relative p-3 rounded-lg border transition-all ${isLocked ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/30" : "bg-white/5 border-dashed border-white/20"}`,
            children: [
              refImage && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-violet-500", children: /* @__PURE__ */ jsx("img", { src: refImage, alt: "", className: "w-full h-full object-cover" }) }),
              /* @__PURE__ */ jsx("div", { className: "text-xl mb-1", children: checkpoint.icon }),
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/80 truncate", children: checkpoint.label }),
              isLocked ? /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-violet-300 truncate", title: lockedData?.type, children: lockedData?.type || "Locked" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-green-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-green-400", children: "Locked" })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-white/40", children: checkpoint.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border border-white/30 rounded-full" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-white/40", children: "Pending" })
                ] })
              ] })
            ]
          },
          checkpoint.id
        );
      }) }),
      state.beats && state.beats.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-white/10", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-white/50 mb-2", children: "Story Beats:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: state.beats.map((beat, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "px-2 py-1 bg-white/5 rounded text-xs text-white/70",
            title: beat.description,
            children: [
              beat.beat_number,
              ". ",
              beat.scene
            ]
          },
          i
        )) })
      ] }),
      Object.keys(state.locked || {}).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-white/10", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-white/50 mb-2", children: "Locked Decisions:" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: Object.entries(state.locked).map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-violet-400 font-medium uppercase min-w-[60px]", children: [
            key,
            ":"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-white/70 truncate", title: value.description, children: [
            value.type,
            " ",
            value.description ? `- ${value.description.substring(0, 50)}...` : ""
          ] })
        ] }, key)) })
      ] })
    ] })
  ] });
}

function StarRating({ mediaUrl, mediaType, prompt, userId, projectId }) {
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [saved, setSaved] = useState(false);
  const handleRate = async (rating) => {
    setStars(rating);
    setSaved(true);
    try {
      await fetch("/api/feedback/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "star",
          userId,
          projectId,
          mediaUrl,
          mediaType,
          stars: rating,
          prompt
        })
      });
    } catch (e) {
      console.error("Failed to save rating:", e);
    }
    setTimeout(() => setSaved(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
    [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleRate(star),
        onMouseEnter: () => setHoveredStars(star),
        onMouseLeave: () => setHoveredStars(0),
        className: "p-0.5 transition-transform hover:scale-110",
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: `w-4 h-4 ${star <= (hoveredStars || stars) ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`,
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              }
            )
          }
        )
      },
      star
    )),
    saved && /* @__PURE__ */ jsx("span", { className: "text-xs text-green-400 ml-2", children: "Saved!" })
  ] });
}
function ImageLightbox({ src, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4",
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors",
            children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: src,
            download: true,
            onClick: (e) => e.stopPropagation(),
            className: "absolute top-4 right-16 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors",
            title: "Download image",
            children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: src,
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: (e) => e.stopPropagation(),
            className: "absolute top-4 right-28 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors",
            title: "Open in new tab",
            children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src,
            alt: "",
            className: "max-w-full max-h-full object-contain rounded-lg shadow-2xl",
            onClick: (e) => e.stopPropagation()
          }
        )
      ]
    }
  );
}
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
    /* @__PURE__ */ jsx(
      "video",
      {
        ref: videoRef,
        src,
        controls: true,
        className: "rounded-lg max-w-full",
        style: { maxHeight: "70vh" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleFullscreen,
          className: "p-1.5 bg-black/60 hover:bg-black/80 rounded transition-colors",
          title: "Fullscreen",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: src,
          download: true,
          className: "p-1.5 bg-black/60 hover:bg-black/80 rounded transition-colors",
          title: "Download video",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "p-1.5 bg-black/60 hover:bg-black/80 rounded transition-colors",
          title: "Open in new tab",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
        }
      )
    ] })
  ] });
}
function ChatPanel({ userId }) {
  const { messages, isLoading, sendMessage, activeProject, createProject } = useChatStore();
  const [input, setInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setUploadedFile({ url: data.url, name: file.name });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!activeProject) {
      const words = input.trim().split(/\s+/).slice(0, 4).join(" ");
      const projectName = words.length > 20 ? words.substring(0, 20) + "..." : words;
      await createProject(projectName || "New Project");
    }
    let message = input;
    if (uploadedFile) {
      message = `[Uploaded file: ${uploadedFile.name}]
URL: ${uploadedFile.url}

${input}`;
    }
    setInput("");
    setUploadedFile(null);
    await sendMessage(message, userId);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 pt-4", children: /* @__PURE__ */ jsx(StoryboardProgress, { projectId: activeProject?.id || null, userId }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6 pt-2", children: messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-violet-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium mb-2", children: "CHIP Video Studio" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm max-w-md", children: 'Describe what you want to create. Try: "CHIP in a haunted house looking scared"' })
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4 max-w-3xl mx-auto", children: [
      messages.map((msg) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: `max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === "user" ? "bg-violet-600 text-white" : "bg-white/10 text-white/90"}`,
              children: [
                msg.role === "user" ? /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap text-sm leading-relaxed", children: msg.content }) : /* @__PURE__ */ jsx("div", { className: "prose prose-invert prose-sm max-w-none", children: /* @__PURE__ */ jsx(
                  ReactMarkdown,
                  {
                    components: {
                      p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "mb-3 last:mb-0 leading-relaxed", children }),
                      strong: ({ children }) => /* @__PURE__ */ jsx("strong", { className: "font-bold text-violet-300", children }),
                      em: ({ children }) => /* @__PURE__ */ jsx("em", { className: "italic text-white/80", children }),
                      ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside mb-3 space-y-1", children }),
                      ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "list-decimal list-inside mb-3 space-y-1", children }),
                      li: ({ children }) => /* @__PURE__ */ jsx("li", { className: "text-white/90", children }),
                      h1: ({ children }) => /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold mb-2 text-violet-300", children }),
                      h2: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "text-base font-bold mb-2 text-violet-300", children }),
                      h3: ({ children }) => /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold mb-1 text-violet-300", children }),
                      code: ({ children }) => /* @__PURE__ */ jsx("code", { className: "px-1 py-0.5 bg-white/10 rounded text-xs font-mono", children }),
                      hr: () => /* @__PURE__ */ jsx("hr", { className: "my-4 border-white/10" })
                    },
                    children: msg.content
                  }
                ) }),
                msg.media && msg.media.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-3", children: msg.media.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  item.type === "video" ? /* @__PURE__ */ jsx(VideoPlayer, { src: item.url }) : /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: item.url,
                        alt: "",
                        className: "rounded-lg hover:opacity-95 transition-opacity cursor-zoom-in",
                        style: { maxHeight: "70vh" },
                        onClick: () => setLightboxImage(item.url)
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setLightboxImage(item.url),
                          className: "p-1.5 bg-black/60 hover:bg-black/80 rounded transition-colors",
                          title: "View fullscreen",
                          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" }) })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: item.url,
                          download: true,
                          className: "p-1.5 bg-black/60 hover:bg-black/80 rounded transition-colors",
                          title: "Download image",
                          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: item.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "p-1.5 bg-black/60 hover:bg-black/80 rounded transition-colors",
                          title: "Open in new tab",
                          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    StarRating,
                    {
                      mediaUrl: item.url,
                      mediaType: item.type === "video" ? "video" : "image",
                      prompt: msg.content,
                      userId,
                      projectId: activeProject?.id
                    }
                  )
                ] }, i)) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs opacity-50 mt-2 block", children: msg.timestamp.toLocaleTimeString() })
              ]
            }
          )
        },
        msg.id
      )),
      isLoading && /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx("div", { className: "bg-white/10 px-4 py-3 rounded-2xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-violet-400 rounded-full animate-bounce", style: { animationDelay: "0ms" } }),
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-violet-400 rounded-full animate-bounce", style: { animationDelay: "150ms" } }),
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-violet-400 rounded-full animate-bounce", style: { animationDelay: "300ms" } })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-white/10 p-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "max-w-3xl mx-auto", children: [
      uploadedFile && /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 px-3 py-2 bg-violet-500/20 border border-violet-500/30 rounded-lg", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-violet-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-violet-300 flex-1 truncate", children: uploadedFile.name }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setUploadedFile(null),
            className: "text-violet-400 hover:text-white",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*,video/*",
            onChange: handleFileUpload,
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            disabled: isLoading || isUploading,
            className: "px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors disabled:opacity-50",
            title: "Upload image or video",
            children: isUploading ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: input,
              onChange: (e) => setInput(e.target.value),
              placeholder: uploadedFile ? "What do you want to do with this file?" : "Describe what you want to create...",
              disabled: isLoading,
              className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 disabled:opacity-50 pr-12"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: !input.trim() || isLoading,
              className: "absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg transition-colors",
              children: isLoading ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 12h14M12 5l7 7-7 7" }) })
            }
          )
        ] })
      ] })
    ] }) }),
    lightboxImage && /* @__PURE__ */ jsx(
      ImageLightbox,
      {
        src: lightboxImage,
        onClose: () => setLightboxImage(null)
      }
    )
  ] });
}

function Sidebar({ userId }) {
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
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  const handleAgentSelect = (agent) => {
    if (agent.id !== currentAgent.id) {
      setAgent(agent);
    }
  };
  const handleNewProject = async () => {
    if (!newProjectName.trim()) return;
    setCreating(true);
    await createProject(newProjectName.trim());
    setCreating(false);
    setNewProjectName("");
    setShowNewProject(false);
  };
  const handleProjectSelect = (project) => {
    if (activeProject?.id !== project.id) {
      selectProject(project.id);
    }
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  return /* @__PURE__ */ jsxs("aside", { className: "w-64 bg-vs-card border-r border-vs-border p-4 flex flex-col", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white/50 uppercase tracking-wider mb-3", children: "Agents" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-1", children: AVAILABLE_AGENTS.map((agent) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleAgentSelect(agent),
        className: `w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${currentAgent.id === agent.id ? "bg-vs-accent/20 text-vs-accent border border-vs-accent/30" : "hover:bg-white/5 text-white/70"}`,
        children: agent.name
      },
      agent.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white/50 uppercase tracking-wider", children: "Projects" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowNewProject(true),
            className: "text-xs text-vs-accent hover:text-vs-accent/80 transition-colors",
            title: "New Project",
            children: "+ New"
          }
        )
      ] }),
      showNewProject && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-2 bg-white/5 rounded-lg border border-white/10", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: newProjectName,
            onChange: (e) => setNewProjectName(e.target.value),
            placeholder: "Project name...",
            autoFocus: true,
            className: "w-full px-2 py-1 bg-transparent text-sm text-white placeholder-white/40 border-none outline-none",
            onKeyDown: (e) => {
              if (e.key === "Enter") handleNewProject();
              if (e.key === "Escape") {
                setShowNewProject(false);
                setNewProjectName("");
              }
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleNewProject,
              disabled: !newProjectName.trim() || creating,
              className: "flex-1 px-2 py-1 text-xs bg-vs-accent text-white rounded disabled:opacity-50",
              children: creating ? "..." : "Create"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setShowNewProject(false);
                setNewProjectName("");
              },
              className: "px-2 py-1 text-xs text-white/50 hover:text-white",
              children: "Cancel"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: clearProject,
          className: `w-full text-left px-3 py-2 rounded-lg transition-colors text-sm mb-2 ${!activeProject ? "bg-white/10 text-white border border-white/20" : "hover:bg-white/5 text-white/50"}`,
          children: "+ New Chat"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-1", children: projectsLoading ? /* @__PURE__ */ jsx("div", { className: "text-white/40 text-sm text-center py-4", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-vs-accent border-t-transparent rounded-full animate-spin mx-auto" }) }) : projects.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm text-center py-4", children: "No projects yet" }) : projects.map((project) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleProjectSelect(project),
          className: `w-full text-left rounded-lg transition-colors ${activeProject?.id === project.id ? "bg-vs-accent/20 border border-vs-accent/30" : "hover:bg-white/5 border border-transparent"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded bg-white/10 flex-shrink-0 overflow-hidden", children: project.thumbnail ? /* @__PURE__ */ jsx(
              "img",
              {
                src: project.thumbnail,
                alt: "",
                className: "w-full h-full object-cover",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white/20", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: `text-sm truncate ${activeProject?.id === project.id ? "text-vs-accent" : "text-white/80"}`, children: project.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/40", children: [
                formatDate(project.modified),
                project.outputCount ? ` · ${project.outputCount} outputs` : ""
              ] })
            ] })
          ] })
        },
        project.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-auto pt-4 border-t border-vs-border", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-white/40 space-y-1", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "User: ",
        userId
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Agent: ",
        currentAgent.name
      ] }),
      activeProject && /* @__PURE__ */ jsxs("p", { className: "text-vs-accent/70 truncate", title: activeProject.name, children: [
        "Project: ",
        activeProject.name
      ] })
    ] }) })
  ] });
}

function ExecutionsPanel() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchExecutions = async () => {
    try {
      const response = await fetch("/api/n8n/executions");
      if (response.ok) {
        const data = await response.json();
        setExecutions(data.executions || []);
      }
    } catch (error) {
      console.error("Failed to fetch executions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExecutions();
    const interval = setInterval(fetchExecutions, 3e3);
    return () => clearInterval(interval);
  }, []);
  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "text-yellow-400 bg-yellow-400/20";
      case "success":
        return "text-green-400 bg-green-400/20";
      case "error":
        return "text-red-400 bg-red-400/20";
      case "waiting":
        return "text-blue-400 bg-blue-400/20";
      default:
        return "text-white/50 bg-white/10";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" });
      case "success":
        return /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) });
      case "error":
        return /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) });
      default:
        return /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-current" });
    }
  };
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString();
  };
  const runningCount = executions.filter((e) => e.status === "running").length;
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white/50 uppercase tracking-wider", children: "Executions" }),
      runningCount > 0 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 text-xs bg-yellow-400/20 text-yellow-400 rounded-full", children: [
        runningCount,
        " running"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" }) }) : executions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-white/40 text-sm text-center py-8", children: "No recent executions" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2 overflow-y-auto flex-1", children: executions.map((exec) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "p-2 bg-white/5 rounded-lg border border-white/10",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("span", { className: `p-1 rounded ${getStatusColor(exec.status)}`, children: getStatusIcon(exec.status) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-white/70 truncate flex-1", children: exec.workflowName || "Unknown workflow" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-white/40 flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: formatTime(exec.startedAt) }),
            /* @__PURE__ */ jsx("span", { className: "capitalize", children: exec.status })
          ] })
        ]
      },
      exec.id
    )) }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "http://localhost:5678/executions",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "mt-4 text-xs text-violet-400 hover:text-violet-300 text-center block",
        children: "View all in n8n →"
      }
    )
  ] });
}

function ProjectDetails() {
  const { activeProject } = useChatStore();
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState([]);
  const [fileStats, setFileStats] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(/* @__PURE__ */ new Set(["outputs", "refs", "astrix", "assets"]));
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  useEffect(() => {
    if (activeProject) {
      if (activeTab === "files") {
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
      console.error("Error fetching files:", error);
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
      console.error("Error fetching workflows:", error);
    } finally {
      setLoading(false);
    }
  };
  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  const formatDuration = (ms) => {
    if (!ms) return "-";
    if (ms < 1e3) return `${ms}ms`;
    if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
    return `${(ms / 6e4).toFixed(1)}m`;
  };
  const getFileIcon = (name) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) {
      return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) });
    }
    if (["mp4", "webm", "mov"].includes(ext || "")) {
      return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-purple-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) });
    }
    if (["mp3", "wav", "ogg"].includes(ext || "")) {
      return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" }) });
    }
    if (ext === "json") {
      return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) });
    }
    return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-white/40", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) });
  };
  const renderFileTree = (entries, depth = 0) => {
    return entries.map((entry) => /* @__PURE__ */ jsx("div", { children: entry.type === "folder" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleFolder(entry.path),
          className: "w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded text-left cursor-pointer",
          style: { paddingLeft: `${depth * 16 + 8}px` },
          children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: `w-3 h-3 text-white/50 transition-transform duration-200 ${expandedFolders.has(entry.path) ? "rotate-90" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
              }
            ),
            /* @__PURE__ */ jsx("svg", { className: `w-4 h-4 ${entry.name === "astrix" ? "text-violet-400" : "text-yellow-500"}`, fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-white/80 flex-1", children: entry.name }),
            /* @__PURE__ */ jsx("span", { className: `text-xs px-1.5 py-0.5 rounded ${entry.children && entry.children.length > 0 ? "bg-white/10 text-white/50" : "text-white/30"}`, children: entry.children ? entry.children.length : 0 })
          ]
        }
      ),
      expandedFolders.has(entry.path) && /* @__PURE__ */ jsx("div", { children: entry.children && entry.children.length > 0 ? renderFileTree(entry.children, depth + 1) : /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-xs text-white/30 italic py-1",
          style: { paddingLeft: `${depth * 16 + 40}px` },
          children: "(empty)"
        }
      ) })
    ] }) : /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded group",
        style: { paddingLeft: `${depth * 16 + 24}px` },
        children: [
          getFileIcon(entry.name),
          entry.url ? /* @__PURE__ */ jsx(
            "a",
            {
              href: entry.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-sm text-white/70 hover:text-vs-accent truncate flex-1",
              title: entry.name,
              children: entry.name
            }
          ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-white/50 truncate flex-1", title: entry.name, children: entry.name }),
          entry.size !== void 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-white/30", children: formatBytes(entry.size) })
        ]
      }
    ) }, entry.path));
  };
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };
  const handleRefUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeProject) return;
    setUploading(true);
    setUploadMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("refType", "general");
      const res = await fetch(`/api/projects/${activeProject.id}/upload-ref`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadMessage(`Uploaded: ${data.filename}`);
        fetchFiles();
      } else {
        setUploadMessage(`Error: ${data.error || "Upload failed"}`);
      }
    } catch (error) {
      setUploadMessage(`Error: ${String(error)}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMessage(null), 3e3);
      event.target.value = "";
    }
  };
  if (!activeProject) {
    return /* @__PURE__ */ jsx("div", { className: "h-full flex items-center justify-center text-white/40", children: /* @__PURE__ */ jsx("p", { children: "Select a project to view details" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-vs-card border-l border-vs-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-vs-border", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-white truncate", title: activeProject.name, children: activeProject.name }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 mt-1 font-mono", children: activeProject.id })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-vs-border", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("files"),
          className: `flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "files" ? "text-vs-accent border-b-2 border-vs-accent" : "text-white/50 hover:text-white/70"}`,
          children: "Files"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("workflows"),
          className: `flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "workflows" ? "text-vs-accent border-b-2 border-vs-accent" : "text-white/50 hover:text-white/70"}`,
          children: "Workflows"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-vs-accent border-t-transparent rounded-full animate-spin" }) }) : activeTab === "files" ? /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 px-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-center gap-2 w-full px-3 py-2 bg-vs-accent/20 hover:bg-vs-accent/30 border border-vs-accent/50 rounded-lg cursor-pointer transition-colors", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-vs-accent", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-vs-accent font-medium", children: uploading ? "Uploading..." : "Upload Reference" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              onChange: handleRefUpload,
              disabled: uploading,
              className: "hidden"
            }
          )
        ] }),
        uploadMessage && /* @__PURE__ */ jsx("p", { className: `mt-1 text-xs text-center ${uploadMessage.startsWith("Error") ? "text-red-400" : "text-green-400"}`, children: uploadMessage })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-2 px-2 py-1 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-white/40", children: fileStats ? `${fileStats.totalFiles} files · ${fileStats.totalSizeFormatted}` : "Loading..." }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                fetch(`/api/projects/${activeProject?.id}/open-folder`, { method: "POST" });
              },
              className: "p-1 hover:bg-white/10 rounded transition-colors",
              title: "Open folder in Explorer",
              children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-white/40 hover:text-white/70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: fetchFiles,
              className: "p-1 hover:bg-white/10 rounded transition-colors",
              title: "Refresh files",
              children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-white/40 hover:text-white/70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) })
            }
          )
        ] })
      ] }),
      files.length > 0 ? renderFileTree(files) : /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm text-center py-4", children: "No files yet" }),
      activeProject && /* @__PURE__ */ jsx("div", { className: "mt-3 pt-2 border-t border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-white/30 truncate flex-1 font-mono", title: `db/users/user_001/projects/${activeProject.id}`, children: [
          ".../",
          activeProject.id
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const fullPath = `C:\\Users\\yodes\\Documents\\n8n\\db\\users\\user_001\\projects\\${activeProject.id}`;
              navigator.clipboard.writeText(fullPath);
            },
            className: "p-1 hover:bg-white/10 rounded transition-colors",
            title: "Copy full path",
            children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white/40 hover:text-white/70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) })
          }
        )
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white/70 mb-2", children: "Workflows Used" }),
        workflows.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: workflows.map((wf) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "p-3 bg-white/5 rounded-lg border border-white/10",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white/80 truncate", children: wf.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-vs-accent bg-vs-accent/20 px-2 py-0.5 rounded", children: [
                  wf.count,
                  "x"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/40 mt-1", children: [
                "Last: ",
                formatDate(wf.lastRun)
              ] })
            ]
          },
          wf.id
        )) }) : /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm", children: "No workflows recorded" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white/70 mb-2", children: "Recent Executions" }),
        executions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-1", children: executions.slice(0, 10).map((exec) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-2 h-2 rounded-full ${exec.status === "success" ? "bg-green-500" : exec.status === "error" ? "bg-red-500" : "bg-yellow-500"}`
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-white/60 truncate flex-1", children: exec.workflowName }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-white/30", children: formatDuration(exec.duration) })
            ]
          },
          exec.id
        )) }) : /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm", children: "No executions recorded" })
      ] })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="h-[calc(100vh-73px)] flex"> <!-- Sidebar (Projects/Agents) --> ${renderComponent($$result2, "Sidebar", Sidebar, { "client:load": true, "userId": user?.id || "anonymous", "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/Sidebar", "client:component-export": "default" })} <!-- Main Chat Area --> <div class="flex-1 flex flex-col"> ${renderComponent($$result2, "ChatPanel", ChatPanel, { "client:load": true, "userId": user?.id || "anonymous", "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/ChatPanel", "client:component-export": "default" })} </div> <!-- Right Panel - Project Details + Executions --> <aside class="w-80 flex flex-col border-l border-vs-border"> <!-- Project Details (top half) --> <div class="h-1/2 overflow-hidden"> ${renderComponent($$result2, "ProjectDetails", ProjectDetails, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/ProjectDetails", "client:component-export": "default" })} </div> <!-- Executions (bottom half) --> <div class="h-1/2 border-t border-vs-border bg-vs-card p-4 flex flex-col overflow-hidden"> ${renderComponent($$result2, "ExecutionsPanel", ExecutionsPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/ExecutionsPanel", "client:component-export": "default" })} </div> </aside> </div> ` })}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
