import { A as AI_SYSTEM_PROMPT } from '../../../chunks/aiPromptSystem_DUfgpd9k.mjs';
import fs__default from 'fs';
import path__default from 'path';
export { renderers } from '../../../renderers.mjs';

const OLLAMA_CHAT_URL = "http://localhost:11434/api/chat";
const MEMORY_DIR = path__default.join(process.cwd(), "ai-memory");
function ensureMemoryDir() {
  if (!fs__default.existsSync(MEMORY_DIR)) {
    fs__default.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}
function getChatFilePath(sessionId) {
  return path__default.join(MEMORY_DIR, `${sessionId}.txt`);
}
function loadChatHistory(sessionId) {
  ensureMemoryDir();
  const filePath = getChatFilePath(sessionId);
  if (!fs__default.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs__default.readFileSync(filePath, "utf-8");
    const messages = [];
    const lines = content.split("\n");
    let currentRole = "";
    let currentContent = "";
    for (const line of lines) {
      if (line.startsWith("[USER]: ")) {
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = "user";
        currentContent = line.replace("[USER]: ", "");
      } else if (line.startsWith("[ASSISTANT]: ")) {
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = "assistant";
        currentContent = line.replace("[ASSISTANT]: ", "");
      } else if (line.startsWith("---")) {
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = "";
        currentContent = "";
      } else {
        currentContent += "\n" + line;
      }
    }
    if (currentRole && currentContent) {
      messages.push({ role: currentRole, content: currentContent.trim() });
    }
    return messages;
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
}
function appendToHistory(sessionId, userMessage, assistantMessage) {
  ensureMemoryDir();
  const filePath = getChatFilePath(sessionId);
  let content = "";
  if (!fs__default.existsSync(filePath)) {
    content = `# AI Chat Memory - Session: ${sessionId}
`;
    content += `# Created: ${(/* @__PURE__ */ new Date()).toISOString()}

`;
  }
  content += `[USER]: ${userMessage}
---
`;
  content += `[ASSISTANT]: ${assistantMessage}
---
`;
  fs__default.appendFileSync(filePath, content, "utf-8");
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      message,
      sessionId = "default",
      model = "qwen3:8b",
      clearHistory = false
    } = body;
    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (clearHistory) {
      const filePath = getChatFilePath(sessionId);
      if (fs__default.existsSync(filePath)) {
        fs__default.unlinkSync(filePath);
      }
    }
    const history = loadChatHistory(sessionId);
    const messages = [
      { role: "system", content: AI_SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message }
    ];
    console.log(`AI Chat [${sessionId}] (${history.length} previous messages):`, message.substring(0, 100));
    const ollamaResponse = await fetch(OLLAMA_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });
    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama chat error:", ollamaResponse.status, errorText);
      if (ollamaResponse.status === 0 || errorText.includes("ECONNREFUSED")) {
        return new Response(JSON.stringify({
          error: "Ollama is not running. Start it with: ollama serve",
          details: errorText
        }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        error: `Ollama error: ${ollamaResponse.status}`,
        details: errorText
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await ollamaResponse.json();
    const assistantMessage = data.message?.content?.trim() || "";
    appendToHistory(sessionId, message, assistantMessage);
    console.log("AI Response:", assistantMessage.substring(0, 100) + "...");
    return new Response(JSON.stringify({
      response: assistantMessage,
      model,
      sessionId,
      historyLength: history.length + 1
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("AI Chat API error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return new Response(JSON.stringify({
        error: "Cannot connect to Ollama. Make sure Ollama is running.",
        details: 'Run "ollama serve" in a terminal to start Ollama.'
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId") || "default";
    const history = loadChatHistory(sessionId);
    ensureMemoryDir();
    const sessions = fs__default.readdirSync(MEMORY_DIR).filter((f) => f.endsWith(".txt")).map((f) => f.replace(".txt", ""));
    return new Response(JSON.stringify({
      sessionId,
      history,
      sessions
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to load chat history",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId") || "default";
    const filePath = getChatFilePath(sessionId);
    if (fs__default.existsSync(filePath)) {
      fs__default.unlinkSync(filePath);
    }
    return new Response(JSON.stringify({
      success: true,
      message: `Cleared history for session: ${sessionId}`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to clear history",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
