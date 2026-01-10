import { g as getSessionCookie, f as findSessionById } from '../../chunks/db_CvyCu46H.mjs';
import fs from 'fs/promises';
import path__default from 'path';
export { renderers } from '../../renderers.mjs';

const DB_PATH = "C:/Users/yodes/Documents/n8n/db/users";
async function getPreferencesPath(userId) {
  const userDir = path__default.join(DB_PATH, userId);
  await fs.mkdir(userDir, { recursive: true });
  return path__default.join(userDir, "creative_preferences.json");
}
async function loadPreferences(userId) {
  try {
    const prefsPath = await getPreferencesPath(userId);
    const data = await fs.readFile(prefsPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      character_ref: {
        url: "https://files.catbox.moe/pfpk1l.png",
        name: "CHIP (Default)",
        uploaded: "2025-01-01"
      }
    };
  }
}
async function savePreferences(userId, prefs) {
  const prefsPath = await getPreferencesPath(userId);
  await fs.writeFile(prefsPath, JSON.stringify(prefs, null, 2));
}
const GET = async ({ cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const preferences = await loadPreferences(session.userId);
    return new Response(JSON.stringify({ preferences }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error loading preferences:", error);
    return new Response(JSON.stringify({ error: "Failed to load preferences" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const { character_ref, background_ref, style_preset } = body;
    const existing = await loadPreferences(session.userId);
    const updated = {
      ...existing,
      ...character_ref !== void 0 && { character_ref },
      ...background_ref !== void 0 && { background_ref },
      ...style_preset !== void 0 && { style_preset }
    };
    await savePreferences(session.userId, updated);
    return new Response(JSON.stringify({
      success: true,
      preferences: updated
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return new Response(JSON.stringify({ error: "Failed to save preferences" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  loadPreferences,
  savePreferences
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
