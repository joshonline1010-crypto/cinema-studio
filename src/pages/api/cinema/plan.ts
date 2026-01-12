import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Scene planning chat - uses local Qwen via Ollama with memory
const OLLAMA_URL = 'http://localhost:11434/api/chat';

// Memory storage directory
const MEMORY_DIR = path.join(process.cwd(), 'ai-memory');

// System prompt for scene planning
const PLANNING_SYSTEM_PROMPT = `You are a professional film director and cinematographer helping plan video productions.

You help users plan their videos through conversation. Ask clarifying questions about:
- What's the story/concept?
- Who are the main characters?
- What's the mood/tone?
- How long should it be?
- Any specific shots or moments they want?

When the user is ready for a full plan, generate JSON in this format:

{
  "scene_id": "snake_case_id",
  "name": "Scene Name",
  "description": "What happens",
  "duration_estimate": 60,
  "location": "Location",
  "time_of_day": "day",
  "mood": "cinematic",
  "color_palette": "vibrant",
  "aspect_ratio": "16:9",
  "director": "Director Style",
  "character_references": {
    "char_id": {
      "id": "char_id",
      "name": "Name",
      "description": "Physical description",
      "costume": "What they wear",
      "generate_prompt": "Full prompt to generate character"
    }
  },
  "shots": [
    {
      "shot_id": "S01_B01_C01",
      "order": 1,
      "shot_type": "wide|medium|close-up",
      "subject": "Who/what in frame",
      "location": "specific location",
      "duration": 3,
      "model": "kling-2.6",
      "dialog": "Only if character speaks",
      "photo_prompt": "Full image generation prompt, 8K",
      "motion_prompt": "Camera movement, then settles",
      "transition_out": "cut",
      "narrative_beat": "story_moment"
    }
  ]
}

MODEL RULES:
- "seedance-1.5": Character SPEAKS dialog (lip-sync)
- "kling-o1": START→END transitions, zoom/orbit
- "kling-2.6": Action, environment, no dialog

When outputting a plan, wrap it in \`\`\`json ... \`\`\` code blocks.
Generate 6-15 shots depending on video length.`;

// Ensure memory directory exists
function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

// Get chat history file path
function getChatFilePath(sessionId: string): string {
  return path.join(MEMORY_DIR, `plan-${sessionId}.txt`);
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
        if (currentRole && currentContent) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = '';
        currentContent = '';
      } else {
        currentContent += '\n' + line;
      }
    }

    if (currentRole && currentContent) {
      messages.push({ role: currentRole, content: currentContent.trim() });
    }

    return messages;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

// Append to history
function appendToHistory(sessionId: string, userMessage: string, assistantMessage: string) {
  ensureMemoryDir();
  const filePath = getChatFilePath(sessionId);

  let content = '';
  if (!fs.existsSync(filePath)) {
    content = `# Scene Planning Chat - Session: ${sessionId}\n`;
    content += `# Created: ${new Date().toISOString()}\n\n`;
  }

  content += `[USER]: ${userMessage}\n---\n`;
  content += `[ASSISTANT]: ${assistantMessage}\n---\n`;

  fs.appendFileSync(filePath, content, 'utf-8');
}

// Try to extract a scene plan from the response
function extractPlan(content: string): any | null {
  try {
    // Look for JSON in code blocks
    const jsonBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
      const jsonStr = jsonBlockMatch[1];
      const plan = JSON.parse(jsonStr);

      // Check if it looks like a valid plan
      if (plan.shots && Array.isArray(plan.shots) && plan.shots.length > 0) {
        return plan;
      }
    }

    // Try finding raw JSON
    const jsonMatch = content.match(/\{[\s\S]*"shots"[\s\S]*\}/);
    if (jsonMatch) {
      const plan = JSON.parse(jsonMatch[0]);
      if (plan.shots && Array.isArray(plan.shots)) {
        return plan;
      }
    }
  } catch (e) {
    // Not valid JSON
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      message,
      sessionId = 'default',
      clearHistory = false
    } = body as {
      message: string;
      sessionId?: string;
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

    // Build messages array
    const messages = [
      { role: 'system', content: PLANNING_SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    console.log(`Plan Chat [${sessionId}] (${history.length} previous):`, message.substring(0, 100));

    // Call Ollama with Qwen
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 4096
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', response.status, errorText);

      return new Response(JSON.stringify({
        error: 'Ollama not available',
        details: 'Make sure Ollama is running with: ollama serve'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const assistantMessage = data.message?.content?.trim() || '';

    // Save to history
    appendToHistory(sessionId, message, assistantMessage);

    // Check if response contains a plan
    const plan = extractPlan(assistantMessage);

    if (plan) {
      // Add metadata to plan
      plan.created_at = new Date().toISOString();
      plan.updated_at = new Date().toISOString();

      // Add status to shots
      if (plan.shots) {
        plan.shots = plan.shots.map((shot: any, index: number) => ({
          ...shot,
          order: shot.order || index + 1,
          status: 'pending'
        }));
      }

      console.log(`Plan generated: ${plan.name} with ${plan.shots?.length || 0} shots`);

      return new Response(JSON.stringify({
        response: assistantMessage,
        plan: plan,
        sessionId: sessionId,
        historyLength: history.length + 1
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Just a chat response, no plan yet
    return new Response(JSON.stringify({
      response: assistantMessage,
      plan: null,
      sessionId: sessionId,
      historyLength: history.length + 1
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Plan API error:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new Response(JSON.stringify({
        error: 'Cannot connect to Ollama',
        details: 'Run "ollama serve" to start Ollama'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to generate plan',
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

    // List all planning sessions
    ensureMemoryDir();
    const sessions = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.startsWith('plan-') && f.endsWith('.txt'))
      .map(f => f.replace('plan-', '').replace('.txt', ''));

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
      error: 'Failed to load history',
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
      message: `Cleared planning session: ${sessionId}`
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
