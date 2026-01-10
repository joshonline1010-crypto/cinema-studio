/* empty css                                     */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CozMHr2T.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_B7uO4DCz.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

function InsightsPanel({ userId }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchInsights();
  }, []);
  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" }) });
  }
  if (error || !insights) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-red-400", children: error || "No insights available" });
  }
  const sentimentColors = {
    love: "bg-green-500",
    like: "bg-green-400",
    ok: "bg-gray-400",
    meh: "bg-yellow-400",
    dislike: "bg-orange-400",
    hate: "bg-red-500"
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Astrix Insights" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchInsights,
          className: "px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm",
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-violet-400", children: insights.overview.total_messages }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-white/50", children: "Messages" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-yellow-400", children: insights.overview.total_likes }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-white/50", children: "Likes" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-orange-400", children: insights.overview.total_changes }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-white/50", children: "Change Requests" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-400", children: insights.overview.images_generated }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-white/50", children: "Images" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-green-400", children: insights.overview.videos_generated }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-white/50", children: "Videos" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Sentiment Distribution" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: Object.entries(insights.sentiment).map(([sentiment, count]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 text-sm capitalize", children: sentiment }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 bg-white/10 rounded-full h-4", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-full rounded-full ${sentimentColors[sentiment] || "bg-gray-500"}`,
              style: {
                width: `${Math.min(100, count / Math.max(1, insights.overview.total_messages) * 100)}%`
              }
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "w-12 text-sm text-right", children: count })
        ] }, sentiment)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Top Agents" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: insights.top_agents.length > 0 ? insights.top_agents.map((agent, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs", children: i + 1 }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 text-sm truncate", children: agent.agent }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-white/50", children: [
            agent.count,
            " uses"
          ] })
        ] }, agent.agent)) : /* @__PURE__ */ jsx("div", { className: "text-white/40 text-sm", children: "No agent data yet" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Common Change Patterns" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: insights.common_changes.length > 0 ? insights.common_changes.map((change) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium capitalize", children: change.pattern }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/40", children: change.keywords.slice(0, 3).join(", ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm", children: [
            change.count,
            "x"
          ] })
        ] }, change.pattern)) : /* @__PURE__ */ jsx("div", { className: "text-white/40 text-sm", children: "No change patterns detected yet" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Priority Summary (★)" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: [
          { key: "minor", label: "★", color: "bg-gray-500" },
          { key: "watching", label: "★★", color: "bg-blue-500" },
          { key: "should_fix", label: "★★★", color: "bg-yellow-500" },
          { key: "fix_now", label: "★★★★", color: "bg-orange-500" },
          { key: "human_needed", label: "★★★★★", color: "bg-red-500" }
        ].map((priority) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: `${priority.color} rounded-lg p-2 mb-1`, children: /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: insights.priority_summary[priority.key] || 0 }) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-white/50", children: priority.label })
        ] }, priority.key)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Top Rated Outputs" }),
      insights.top_rated.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4", children: insights.top_rated.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: item.mediaUrl,
            alt: "",
            className: "w-full aspect-square object-cover rounded-lg"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-yellow-400", children: "★" }),
          item.stars
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2 flex items-end", children: /* @__PURE__ */ jsx("p", { className: "text-xs line-clamp-3", children: item.prompt }) })
      ] }, i)) }) : /* @__PURE__ */ jsx("div", { className: "text-white/40 text-sm text-center py-8", children: "No rated outputs yet. Star your favorite images in chat!" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Recent Change Requests" }),
      insights.recent_changes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: insights.recent_changes.map((change, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-2 bg-white/5 rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap", children: change.patterns.map((p) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs capitalize", children: p }, p)) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 text-sm text-white/70 truncate", children: change.message }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-white/40", children: new Date(change.timestamp).toLocaleTimeString() })
      ] }, i)) }) : /* @__PURE__ */ jsx("div", { className: "text-white/40 text-sm text-center py-4", children: "No change requests recorded yet" })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Insights = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Insights;
  const user = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Insights" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="h-[calc(100vh-73px)] overflow-y-auto"> ${renderComponent($$result2, "InsightsPanel", InsightsPanel, { "client:load": true, "userId": user?.id || "anonymous", "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/InsightsPanel", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/insights.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/insights.astro";
const $$url = "/insights";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Insights,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
