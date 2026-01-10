import { g as getSessionCookie, f as findSessionById, a as findUserById } from '../../../chunks/db_CvyCu46H.mjs';
import * as fs from 'fs';
import * as path from 'path';
import { Agent } from 'undici';
export { renderers } from '../../../renderers.mjs';

const N8N_BASE_URL = "http://localhost:5678";
const DB_PATH = "C:/Users/yodes/Documents/n8n/db/users";
function loadUserPreferences(userId) {
  try {
    const prefsPath = path.join(DB_PATH, userId, "creative_preferences.json");
    if (fs.existsSync(prefsPath)) {
      return JSON.parse(fs.readFileSync(prefsPath, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to load user preferences:", e);
  }
  return {
    character_ref: {
      url: "https://files.catbox.moe/pfpk1l.png",
      name: "CHIP (Default)",
      uploaded: "2025-01-01"
    }
  };
}
const longRunningAgent = new Agent({
  headersTimeout: 6e5,
  // 10 minutes
  bodyTimeout: 6e5,
  // 10 minutes
  keepAliveTimeout: 6e5,
  // 10 minutes
  connectTimeout: 6e4
  // 60 seconds to connect
});
async function syncToAstrix(messageData) {
  try {
    const sentimentKeywords = {
      love: ["love", "amazing", "perfect", "incredible", "awesome"],
      like: ["good", "nice", "great", "cool", "thanks"],
      ok: ["ok", "fine", "alright"],
      meh: ["meh", "whatever"],
      dislike: ["bad", "annoying", "wrong", "issue"],
      hate: ["hate", "terrible", "awful", "broken"]
    };
    const contentLower = messageData.content.toLowerCase();
    let detectedSentiment = "ok";
    for (const [sentiment, keywords] of Object.entries(sentimentKeywords)) {
      if (keywords.some((kw) => contentLower.includes(kw))) {
        detectedSentiment = sentiment;
        break;
      }
    }
    const msgEntry = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...messageData,
      sentiment: detectedSentiment
    };
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updateMessages = (messagesPath) => {
      let messagesData;
      if (fs.existsSync(messagesPath)) {
        messagesData = JSON.parse(fs.readFileSync(messagesPath, "utf-8"));
      } else {
        messagesData = {
          schema_version: "1.0",
          total_messages: 0,
          messages: [],
          last_updated: now
        };
      }
      messagesData.messages.push(msgEntry);
      if (messagesData.messages.length > 1e3) {
        messagesData.messages = messagesData.messages.slice(-1e3);
      }
      messagesData.total_messages++;
      messagesData.last_updated = now;
      fs.writeFileSync(messagesPath, JSON.stringify(messagesData, null, 2));
    };
    const updateStats = (statsPath) => {
      let statsData;
      if (fs.existsSync(statsPath)) {
        statsData = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
      } else {
        statsData = {
          schema_version: "1.0",
          created: today,
          last_updated: now,
          totals: { messages: 0, likes: 0, sessions: 0, projects: 0, images_generated: 0, videos_generated: 0, changes_requested: 0 },
          sentiment: { love: 0, like: 0, ok: 0, meh: 0, dislike: 0, hate: 0 },
          top_agents: {},
          top_tools: {},
          top_prompts: [],
          activity_by_day: {},
          priority_summary: { minor: 0, watching: 0, should_fix: 0, fix_now: 0, human_needed: 0 }
        };
      }
      statsData.totals.messages++;
      statsData.sentiment[detectedSentiment] = (statsData.sentiment[detectedSentiment] || 0) + 1;
      statsData.top_agents[messageData.agent] = (statsData.top_agents[messageData.agent] || 0) + 1;
      statsData.activity_by_day[today] = (statsData.activity_by_day[today] || 0) + 1;
      statsData.last_updated = now;
      fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2));
    };
    const globalAstrixPath = "C:/Users/yodes/Documents/n8n/Astrix/sync";
    updateMessages(path.join(globalAstrixPath, "messages.json"));
    updateStats(path.join(globalAstrixPath, "stats.json"));
    if (messageData.projectId && messageData.userId) {
      const projectAstrixPath = `C:/Users/yodes/Documents/n8n/db/users/${messageData.userId}/projects/${messageData.projectId}/astrix`;
      if (!fs.existsSync(projectAstrixPath)) {
        fs.mkdirSync(projectAstrixPath, { recursive: true });
      }
      updateMessages(path.join(projectAstrixPath, "messages.json"));
      updateStats(path.join(projectAstrixPath, "stats.json"));
    }
  } catch (e) {
    console.error("Failed to sync to Astrix:", e);
  }
}
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
  const user = await findUserById(session.userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const { chatInput, agentPath, agentEndpoint, chatSessionId, projectId } = body;
    if (!chatInput) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const webhookPath = agentEndpoint || agentPath || "/webhook/chip-agent-v2/chat";
    const isUniversalApi = webhookPath.includes("universal-api");
    const isFormTrigger = webhookPath.startsWith("/form/");
    const userPrefs = loadUserPreferences(user.id);
    let requestBody;
    if (isUniversalApi) {
      const fileUrlMatch = chatInput.match(/URL:\s*(https?:\/\/[^\s\n]+)/);
      const fileUrl = fileUrlMatch ? fileUrlMatch[1] : null;
      const cleanMessage = chatInput.replace(/\[Uploaded file:.*?\]\nURL:\s*https?:\/\/[^\s\n]+\n\n?/g, "").trim();
      requestBody = {
        message: cleanMessage,
        file_url: fileUrl,
        userId: user.id,
        sessionId: chatSessionId || projectId || `${user.id}_${Date.now()}`,
        projectId,
        // Include user preferences
        character_ref: userPrefs.character_ref?.url,
        background_ref: userPrefs.background_ref?.url,
        style_preset: userPrefs.style_preset?.id,
        style_name: userPrefs.style_preset?.name
      };
    } else if (isFormTrigger) {
      requestBody = {
        Message: chatInput,
        sessionId: chatSessionId || projectId || `${user.id}_${Date.now()}`,
        userId: user.id,
        projectId,
        // Include user preferences
        character_ref: userPrefs.character_ref?.url,
        background_ref: userPrefs.background_ref?.url,
        style_preset: userPrefs.style_preset?.id,
        style_name: userPrefs.style_preset?.name
      };
    } else {
      requestBody = {
        chatInput,
        sessionId: chatSessionId || projectId || `${user.id}_${Date.now()}`,
        userId: user.id,
        username: user.username,
        projectId,
        // Include user preferences
        character_ref: userPrefs.character_ref?.url,
        background_ref: userPrefs.background_ref?.url,
        style_preset: userPrefs.style_preset?.id,
        style_name: userPrefs.style_preset?.name
      };
    }
    const response = await fetch(`${N8N_BASE_URL}${webhookPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      // @ts-ignore - undici dispatcher for infinite timeouts
      dispatcher: longRunningAgent
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n error:", response.status, errorText);
      throw new Error(`n8n error: ${response.status}`);
    }
    const data = await response.json();
    const agentName = webhookPath.split("/").pop()?.replace("/chat", "") || "unknown";
    await syncToAstrix({
      userId: user.id,
      sessionId: chatSessionId || projectId || `${user.id}_${Date.now()}`,
      projectId,
      agent: agentName,
      role: "user",
      content: chatInput
    });
    const assistantContent = data.output || data.message || data.text || JSON.stringify(data);
    const mediaUrls = [];
    if (data.urls) {
      if (data.urls.image) mediaUrls.push(data.urls.image);
      if (data.urls.video) mediaUrls.push(data.urls.video);
      if (data.urls.all) mediaUrls.push(...data.urls.all);
    }
    await syncToAstrix({
      userId: user.id,
      sessionId: chatSessionId || projectId || `${user.id}_${Date.now()}`,
      projectId,
      agent: agentName,
      role: "assistant",
      content: assistantContent,
      mediaUrls
    });
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({
      error: "Failed to communicate with n8n",
      details: String(error)
    }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
