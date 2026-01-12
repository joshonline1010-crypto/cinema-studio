import type { APIRoute } from 'astro';
import { AI_SYSTEM_PROMPT, buildContextString, type AIPromptContext } from '../../../components/react/CinemaStudio/aiPromptSystem';

// API Configuration - Use environment variable or fallback
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const OLLAMA_URL = 'http://localhost:11434/api/generate';

// Check if Claude API is available
const CLAUDE_AVAILABLE = ANTHROPIC_API_KEY.length > 10;

// Model options
type ModelOption = 'claude-sonnet' | 'claude-opus' | 'mistral' | 'qwen';

const MODEL_CONFIG: Record<ModelOption, { provider: 'anthropic' | 'ollama'; model: string }> = {
  'claude-sonnet': { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  'claude-opus': { provider: 'anthropic', model: 'claude-opus-4-5-20251101' },
  'mistral': { provider: 'ollama', model: 'mistral' },
  'qwen': { provider: 'ollama', model: 'qwen3:8b' }
};

// Log API availability at startup
console.log(`[AI Prompt] Claude API key: ${CLAUDE_AVAILABLE ? 'CONFIGURED' : 'MISSING - will use Ollama fallback'}`);

// Call Claude API
async function callClaude(systemPrompt: string, userPrompt: string, model: string): Promise<string> {
  console.log(`[Claude Prompt] Calling ${model}`);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Claude Prompt] Error:', response.status, errorText);
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  console.log('[Claude Prompt] Response:', text.substring(0, 100) + '...');
  return text;
}

// Call Ollama API (fallback)
async function callOllama(systemPrompt: string, userPrompt: string, model: string): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      prompt: userPrompt,
      system: systemPrompt,
      stream: false,
      options: { temperature: 0.7, top_p: 0.9 }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.response?.trim() || '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      userInput,
      context,
      model = 'claude-opus'  // Default to Claude Opus 4.5 - BEST model!
    } = body as {
      userInput: string;
      context: AIPromptContext;
      model?: string;
    };

    if (!userInput) {
      return new Response(JSON.stringify({ error: 'userInput is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the full prompt with context
    const contextString = buildContextString(context || { mode: 'image' });

    const fullPrompt = `${contextString}

USER REQUEST: ${userInput}

Output ONLY the ${context?.mode || 'image'} prompt, nothing else:`;

    console.log('AI Prompt Request:', { userInput, model, mode: context?.mode });

    // Determine provider - AUTO FALLBACK to Ollama if Claude unavailable
    let config = MODEL_CONFIG[model as ModelOption] || MODEL_CONFIG['mistral'];
    let generatedPrompt = '';
    let actualModel = model;
    let actualProvider = '';

    // If Claude requested but API key missing, fallback to Ollama
    if (config.provider === 'anthropic' && !CLAUDE_AVAILABLE) {
      console.log(`[AI Prompt] Claude requested but API key missing - falling back to Ollama mistral`);
      config = MODEL_CONFIG['mistral'];
      actualModel = 'mistral';
    }

    if (config.provider === 'anthropic') {
      try {
        generatedPrompt = await callClaude(AI_SYSTEM_PROMPT, fullPrompt, config.model);
        actualProvider = 'anthropic';
      } catch (claudeError) {
        // Claude failed - try Ollama as fallback
        console.log(`[AI Prompt] Claude failed, falling back to Ollama:`, claudeError);
        try {
          generatedPrompt = await callOllama(AI_SYSTEM_PROMPT, fullPrompt, 'mistral');
          actualProvider = 'ollama (fallback)';
          actualModel = 'mistral';
        } catch (ollamaError) {
          throw new Error(`Both Claude and Ollama failed. Start Ollama with: ollama serve`);
        }
      }
    } else {
      generatedPrompt = await callOllama(AI_SYSTEM_PROMPT, fullPrompt, config.model);
      actualProvider = 'ollama';
    }

    console.log('AI Generated Prompt:', generatedPrompt.substring(0, 150) + '...');

    return new Response(JSON.stringify({
      prompt: generatedPrompt.trim(),
      model: actualModel,
      provider: actualProvider || config.provider,
      mode: context?.mode || 'image',
      note: actualProvider === 'ollama (fallback)' ? 'Claude unavailable, using Ollama' : undefined
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Prompt API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Claude')) {
      return new Response(JSON.stringify({
        error: 'Claude API error',
        details: errorMessage,
        suggestion: 'Check API key and credits'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (errorMessage.includes('Ollama') || errorMessage.includes('ECONNREFUSED')) {
      return new Response(JSON.stringify({
        error: 'Ollama not running',
        details: 'Start with: ollama serve',
        suggestion: 'Or use claude-sonnet model instead'
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

// GET endpoint to check status
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'ok',
    availableModels: Object.keys(MODEL_CONFIG),
    defaultModel: 'claude-sonnet'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
