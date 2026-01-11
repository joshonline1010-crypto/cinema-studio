import type { APIRoute } from 'astro';
import { AI_SYSTEM_PROMPT } from '../../../components/react/CinemaStudio/aiPromptSystem';
import fs from 'fs';
import path from 'path';

// Ollama chat endpoint (supports message history)
const OLLAMA_CHAT_URL = 'http://localhost:11434/api/chat';

// Memory storage directory
const MEMORY_DIR = path.join(process.cwd(), 'ai-memory');

// Ensure memory directory exists
function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

// Get chat history file path
function getChatFilePath(sessionId: string): string {
  return path.join(MEMORY_DIR, `${sessionId}.txt`);
}

// Load chat history from file
function loadChatHistory(sessionId: string): Array<{ role: string; content: string }> {
  ensureMemoryDir();
  const filePath = getChatFilePath(sessionId);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const messages: Array<{ role: string; content: string }> = [];

    // Parse the txt file format: [ROLE]: content
    const lines = content.split('\n');
    let currentRole = '';
    let currentContent = '';

    for (const line of lines) {
      if (line.startsWith('[USER]: ')) {
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = 'user';
        currentContent = line.replace('[USER]: ', '');
      } else if (line.startsWith('[ASSISTANT]: ')) {
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = 'assistant';
        currentContent = line.replace('[ASSISTANT]: ', '');
      } else if (line.startsWith('---')) {
        // Separator between messages
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = '';
        currentContent = '';
      } else {
        currentContent += '\n' + line;
      }
    }

    // Don't forget the last message
    if (currentRole && currentContent) {
      messages.push({ role: currentRole, content: currentContent.trim() });
    }

    return messages;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

// Save chat history to file
function saveChatHistory(sessionId: string, messages: Array<{ role: string; content: string }>) {
  ensureMemoryDir();
  const filePath = getChatFilePath(sessionId);

  let content = `# AI Chat Memory - Session: ${sessionId}\n`;
  content += `# Created: ${new Date().toISOString()}\n\n`;

  for (const msg of messages) {
    const roleLabel = msg.role === 'user' ? '[USER]' : '[ASSISTANT]';
    content += `${roleLabel}: ${msg.content}\n---\n`;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

// Append a single exchange to file (more efficient for ongoing chats)
function appendToHistory(sessionId: string, userMessage: string, assistantMessage: string) {
  ensureMemoryDir();
  const filePath = getChatFilePath(sessionId);

  let content = '';
  if (!fs.existsSync(filePath)) {
    content = `# AI Chat Memory - Session: ${sessionId}\n`;
    content += `# Created: ${new Date().toISOString()}\n\n`;
  }

  content += `[USER]: ${userMessage}\n---\n`;
  content += `[ASSISTANT]: ${assistantMessage}\n---\n`;

  fs.appendFileSync(filePath, content, 'utf-8');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      message,
      sessionId = 'default',
      model = 'qwen3:8b',
      clearHistory = false
    } = body as {
      message: string;
      sessionId?: string;
      model?: string;
      clearHistory?: boolean;
    };

    if (!message) {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clear history if requested
    if (clearHistory) {
      const filePath = getChatFilePath(sessionId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Load existing chat history
    const history = loadChatHistory(sessionId);

    // Build messages array for Ollama
    const messages = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    console.log(`AI Chat [${sessionId}] (${history.length} previous messages):`, message.substring(0, 100));

    // Call Ollama chat API
    const ollamaResponse = await fetch(OLLAMA_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      })
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama chat error:', ollamaResponse.status, errorText);

      if (ollamaResponse.status === 0 || errorText.includes('ECONNREFUSED')) {
        return new Response(JSON.stringify({
          error: 'Ollama is not running. Start it with: ollama serve',
          details: errorText
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        error: `Ollama error: ${ollamaResponse.status}`,
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await ollamaResponse.json();
    const assistantMessage = data.message?.content?.trim() || '';

    // Save to chat history
    appendToHistory(sessionId, message, assistantMessage);

    console.log('AI Response:', assistantMessage.substring(0, 100) + '...');

    return new Response(JSON.stringify({
      response: assistantMessage,
      model: model,
      sessionId: sessionId,
      historyLength: history.length + 1
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Chat API error:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new Response(JSON.stringify({
        error: 'Cannot connect to Ollama. Make sure Ollama is running.',
        details: 'Run "ollama serve" in a terminal to start Ollama.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET endpoint to get chat history
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || 'default';

    const history = loadChatHistory(sessionId);

    // List all sessions
    ensureMemoryDir();
    const sessions = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.txt'))
      .map(f => f.replace('.txt', ''));

    return new Response(JSON.stringify({
      sessionId: sessionId,
      history: history,
      sessions: sessions
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load chat history',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE endpoint to clear history
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || 'default';

    const filePath = getChatFilePath(sessionId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Cleared history for session: ${sessionId}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to clear history',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
