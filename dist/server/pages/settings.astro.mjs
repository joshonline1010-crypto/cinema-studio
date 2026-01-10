/* empty css                                     */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CozMHr2T.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_B7uO4DCz.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

function PreferencesPanel({ userId }) {
  const [preferences, setPreferences] = useState({});
  const [styleCategories, setStyleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(null);
  const charInputRef = useRef(null);
  const bgInputRef = useRef(null);
  useEffect(() => {
    fetchPreferences();
    fetchStyles();
  }, []);
  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/preferences");
      const data = await res.json();
      setPreferences(data.preferences || {});
    } catch (e) {
      console.error("Failed to load preferences:", e);
    } finally {
      setLoading(false);
    }
  };
  const fetchStyles = async () => {
    try {
      const res = await fetch("/api/styles");
      const data = await res.json();
      setStyleCategories(data.categories || []);
    } catch (e) {
      console.error("Failed to load styles:", e);
    }
  };
  const savePreferences = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences)
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Preferences saved!" });
        setTimeout(() => setMessage(null), 3e3);
      } else {
        throw new Error("Failed to save");
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save preferences" });
    } finally {
      setSaving(false);
    }
  };
  const handleUpload = async (type, file) => {
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("refType", type);
      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));
      const res = await fetch("/api/preferences/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences((prev) => ({
          ...prev,
          [type === "character" ? "character_ref" : "background_ref"]: data.ref
        }));
        setMessage({ type: "success", text: `${type === "character" ? "Character" : "Background"} updated!` });
        setTimeout(() => setMessage(null), 3e3);
      } else {
        throw new Error("Upload failed");
      }
    } catch (e) {
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setUploading(null);
    }
  };
  const handleStyleChange = (styleId) => {
    for (const category of styleCategories) {
      const style = category.styles.find((s) => s.id === styleId);
      if (style) {
        setPreferences((prev) => ({
          ...prev,
          style_preset: {
            id: style.id,
            name: style.name,
            category: style.category,
            description: style.description
          }
        }));
        break;
      }
    }
  };
  const removeRef = (type) => {
    setPreferences((prev) => {
      const updated = { ...prev };
      if (type === "character") {
        delete updated.character_ref;
      } else {
        delete updated.background_ref;
      }
      return updated;
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "bg-vs-card border border-vs-border rounded-xl p-6", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-vs-card border border-vs-border rounded-xl p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium", children: "Creative Preferences" }),
      message && /* @__PURE__ */ jsx("span", { className: `text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`, children: message.text })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm text-white/70 mb-3", children: "Character Reference" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "w-24 h-24 bg-vs-dark border border-vs-border rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:border-violet-500 transition-colors relative group",
              onClick: () => charInputRef.current?.click(),
              children: [
                preferences.character_ref?.url ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: preferences.character_ref.url,
                      alt: "Character",
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Change" }) })
                ] }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white/40", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }),
                uploading === "character" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/70 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: charInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload("character", file);
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: preferences.character_ref?.name || "No character set" }),
            preferences.character_ref?.url && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 truncate mt-1", children: preferences.character_ref.url.length > 40 ? "..." + preferences.character_ref.url.slice(-37) : preferences.character_ref.url }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removeRef("character"),
                  className: "text-xs text-red-400 hover:text-red-300 mt-2",
                  children: "Remove"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm text-white/70 mb-3", children: "Background Reference" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "w-32 h-20 bg-vs-dark border border-vs-border rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:border-violet-500 transition-colors relative group",
              onClick: () => bgInputRef.current?.click(),
              children: [
                preferences.background_ref?.url ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: preferences.background_ref.url,
                      alt: "Background",
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Change" }) })
                ] }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white/40", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }),
                uploading === "background" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/70 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: bgInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload("background", file);
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: preferences.background_ref?.name || "No background set" }),
            preferences.background_ref?.url && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 truncate mt-1", children: preferences.background_ref.url.length > 40 ? "..." + preferences.background_ref.url.slice(-37) : preferences.background_ref.url }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removeRef("background"),
                  className: "text-xs text-red-400 hover:text-red-300 mt-2",
                  children: "Remove"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm text-white/70 mb-3", children: "Prompt Style" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: preferences.style_preset?.id || "",
            onChange: (e) => handleStyleChange(e.target.value),
            className: "w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white focus:border-violet-500 focus:outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a style..." }),
              styleCategories.map((category) => /* @__PURE__ */ jsx("optgroup", { label: category.name, children: category.styles.map((style) => /* @__PURE__ */ jsx("option", { value: style.id, children: style.name }, style.id)) }, category.id))
            ]
          }
        ),
        preferences.style_preset && /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 bg-vs-dark rounded-lg", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-violet-400", children: preferences.style_preset.name }),
          preferences.style_preset.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-white/60 mt-1 line-clamp-2", children: preferences.style_preset.description })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-vs-border", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: savePreferences,
            disabled: saving,
            className: "w-full px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
            children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
              "Saving..."
            ] }) : "Save Preferences"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 text-center mt-3", children: "These preferences will be automatically applied to all your generations" })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Settings = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Settings;
  const user = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Settings" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto p-8"> <h1 class="text-2xl font-bold mb-8">Settings</h1> <!-- Creative Preferences (React Island) --> <div class="mb-6"> ${renderComponent($$result2, "PreferencesPanel", PreferencesPanel, { "client:load": true, "userId": user?.id || "", "client:component-hydration": "load", "client:component-path": "C:/Users/yodes/Documents/n8n/video-studio/src/components/react/PreferencesPanel.tsx", "client:component-export": "default" })} </div> <!-- Profile Section --> <div class="bg-vs-card border border-vs-border rounded-xl p-6 mb-6"> <h2 class="text-lg font-medium mb-4">Profile</h2> <div class="space-y-4"> <div> <label class="block text-sm text-white/70 mb-2">User ID</label> <input type="text"${addAttribute(user?.id, "value")} disabled class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white/50"> </div> <div> <label class="block text-sm text-white/70 mb-2">Username</label> <input type="text"${addAttribute(user?.username, "value")} disabled class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white/50"> </div> <div> <label class="block text-sm text-white/70 mb-2">Email</label> <input type="email"${addAttribute(user?.email, "value")} disabled class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white/50"> </div> </div> </div> <!-- Preferences Section --> <div class="bg-vs-card border border-vs-border rounded-xl p-6 mb-6"> <h2 class="text-lg font-medium mb-4">Preferences</h2> <div class="space-y-4"> <div> <label class="block text-sm text-white/70 mb-2">Default Agent</label> <select class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white"> <option value="chip-agent-v4">CHIP Agent v4</option> <option value="universal-agent">Universal Agent</option> </select> </div> <div> <label class="block text-sm text-white/70 mb-2">Theme</label> <select class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white"> <option value="dark">Dark</option> <option value="light" disabled>Light (coming soon)</option> </select> </div> </div> </div> <!-- n8n Connection --> <div class="bg-vs-card border border-vs-border rounded-xl p-6"> <h2 class="text-lg font-medium mb-4">n8n Connection</h2> <div class="flex items-center gap-3"> <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> <span class="text-white/70">Connected to localhost:5678</span> </div> <p class="text-white/40 text-sm mt-4">
n8n must be running for the chat to work.
        Start it with: <code class="bg-vs-dark px-2 py-1 rounded">start-n8n.bat</code> </p> </div> <!-- Back link --> <div class="mt-8"> <a href="/dashboard" class="text-vs-accent hover:underline">
&larr; Back to Dashboard
</a> </div> </div> ` })}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/settings.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/settings.astro";
const $$url = "/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
