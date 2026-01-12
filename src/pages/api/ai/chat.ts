import type { APIRoute } from 'astro';
import { AI_SYSTEM_PROMPT } from '../../../components/react/CinemaStudio/aiPromptSystem';
import fs from 'fs';
import path from 'path';

// API Configuration - Use environment variable or fallback
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const OLLAMA_CHAT_URL = 'http://localhost:11434/api/chat';

// Check if Claude API is available
const CLAUDE_AVAILABLE = ANTHROPIC_API_KEY.length > 10;

// Model options
type ModelOption = 'claude-sonnet' | 'claude-opus' | 'qwen' | 'mistral';

const MODEL_MAP: Record<ModelOption, { provider: 'anthropic' | 'ollama'; model: string }> = {
  'claude-sonnet': { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  'claude-opus': { provider: 'anthropic', model: 'claude-opus-4-5-20251101' },
  'qwen': { provider: 'ollama', model: 'qwen3:8b' },
  'mistral': { provider: 'ollama', model: 'mistral' }
};

// Log API availability at startup
console.log(`[AI Chat] Claude API key: ${CLAUDE_AVAILABLE ? 'CONFIGURED' : 'MISSING - will use Ollama fallback'}`);

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

// Call Claude API with extended thinking
async function callClaude(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  model: string,
  useExtendedThinking: boolean = true
): Promise<string> {
  // Convert messages to Claude format
  const claudeMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));

  const requestBody: any = {
    model: model,
    max_tokens: 16000,
    system: systemPrompt,
    messages: claudeMessages
  };

  // Add extended thinking for better reasoning (Sonnet/Opus support this)
  if (useExtendedThinking) {
    requestBody.thinking = {
      type: 'enabled',
      budget_tokens: 10000  // Allow up to 10k tokens for thinking
    };
  }

  console.log(`[Claude API] Calling ${model} with extended_thinking=${useExtendedThinking}`);
  console.log(`[Claude API] System prompt length: ${systemPrompt.length}, Messages: ${claudeMessages.length}`);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Claude API] Error:', response.status, errorText);
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Extract response - handle both thinking and regular responses
  let responseText = '';
  let thinkingText = '';

  if (data.content && Array.isArray(data.content)) {
    for (const block of data.content) {
      if (block.type === 'thinking') {
        thinkingText = block.thinking;
        console.log('[Claude API] Thinking:', thinkingText.substring(0, 200) + '...');
      } else if (block.type === 'text') {
        responseText = block.text;
      }
    }
  }

  console.log(`[Claude API] Response length: ${responseText.length}, Thinking length: ${thinkingText.length}`);

  return responseText;
}

// Call Ollama API (fallback)
async function callOllama(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  model: string
): Promise<string> {
  const ollamaMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch(OLLAMA_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      messages: ollamaMessages,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.message?.content?.trim() || '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      message,
      sessionId = 'default',
      model = 'claude-opus',  // Default to Claude Opus 4.5 - BEST model!
      clearHistory = false,
      extendedThinking = true   // Enable by default
    } = body as {
      message: string;
      sessionId?: string;
      model?: string;
      clearHistory?: boolean;
      extendedThinking?: boolean;
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

    // Build messages array
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    console.log(`\n========================================`);
    console.log(`AI Chat [${sessionId}] using model: ${model}`);
    console.log(`History: ${history.length} messages, Extended thinking: ${extendedThinking}`);
    console.log(`User message: ${message.substring(0, 150)}...`);
    console.log(`========================================\n`);

    let assistantMessage = '';
    let actualModel = model;
    let actualProvider = '';

    // Determine provider and model - AUTO FALLBACK to Ollama if Claude unavailable
    let modelConfig = MODEL_MAP[model as ModelOption] || MODEL_MAP['qwen'];

    // If Claude requested but API key missing, fallback to Ollama
    if (modelConfig.provider === 'anthropic' && !CLAUDE_AVAILABLE) {
      console.log(`[AI Chat] Claude requested but API key missing - falling back to Ollama qwen3:8b`);
      modelConfig = MODEL_MAP['qwen'];
      actualModel = 'qwen';
    }

    if (modelConfig.provider === 'anthropic') {
      // Use Claude
      try {
        assistantMessage = await callClaude(
          AI_SYSTEM_PROMPT,
          messages,
          modelConfig.model,
          extendedThinking
        );
        actualProvider = 'anthropic';
      } catch (claudeError) {
        // Claude failed - try Ollama as fallback
        console.log(`[AI Chat] Claude failed, falling back to Ollama:`, claudeError);
        try {
          assistantMessage = await callOllama(
            AI_SYSTEM_PROMPT,
            messages,
            'qwen3:8b'
          );
          actualProvider = 'ollama (fallback)';
          actualModel = 'qwen';
        } catch (ollamaError) {
          throw new Error(`Both Claude and Ollama failed. Claude: ${claudeError}. Ollama: ${ollamaError}`);
        }
      }
    } else {
      // Use Ollama
      assistantMessage = await callOllama(
        AI_SYSTEM_PROMPT,
        messages,
        modelConfig.model
      );
      actualProvider = 'ollama';
    }

    // Save to chat history
    appendToHistory(sessionId, message, assistantMessage);

    console.log('\n[AI Response Preview]:', assistantMessage.substring(0, 200) + '...\n');

    return new Response(JSON.stringify({
      response: assistantMessage,
      model: actualModel,
      provider: actualProvider || modelConfig.provider,
      sessionId: sessionId,
      historyLength: history.length + 1,
      extendedThinking: extendedThinking,
      note: actualProvider === 'ollama (fallback)' ? 'Claude unavailable, using Ollama' : undefined
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Chat API error:', error);

    // Check for specific errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Claude API error')) {
      return new Response(JSON.stringify({
        error: 'Claude API error',
        details: errorMessage,
        suggestion: 'Check API key and credits at console.anthropic.com'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (errorMessage.includes('Ollama') || errorMessage.includes('ECONNREFUSED')) {
      return new Response(JSON.stringify({
        error: 'Ollama is not running',
        details: 'Run "ollama serve" in a terminal to start Ollama.',
        suggestion: 'Or switch to Claude model which uses API'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: errorMessage
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
      sessions: sessions,
      availableModels: Object.keys(MODEL_MAP)
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
