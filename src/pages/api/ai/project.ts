import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Memory storage directory (same as chat.ts)
const MEMORY_DIR = path.join(process.cwd(), 'ai-memory');

// Ensure memory directory exists
function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

// Get project state file path
function getProjectFilePath(sessionId: string): string {
  return path.join(MEMORY_DIR, `${sessionId}.project.json`);
}

// Project state interface
interface ProjectState {
  sessionId: string;
  savedAt: string;
  // Assets
  generatedAssets: Array<{
    id: string;
    type: string;
    prompt: string;
    motionPrompt?: string;
    status: string;
    url?: string;
    videoUrl?: string;
    approved?: boolean;
  }>;
  generatedRefs: Array<{
    id: string;
    name: string;
    type: string;
    url?: string;
    approved?: boolean;
  }>;
  // Refs
  characterRefs: Array<{ url: string; name: string }>;
  productRefs: Array<{ url: string; name: string }>;
  locationRefs: Array<{ url: string; name: string }>;
  refImages: Array<{ url: string; description: string }>;
  // Settings
  characterDNA: string;
  defaultDuration: string;
  videoModel: string;
  // Outputs
  finalVideoUrl?: string;
  voiceoverUrl?: string;
  voiceoverText?: string;
  // Plans
  accumulatedPlans: Array<{ id: string; name: string; shots: any[]; messageIndex: number }>;
}

// POST - Save project state
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { sessionId, projectState } = body as { sessionId: string; projectState: Partial<ProjectState> };

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    ensureMemoryDir();
    const filePath = getProjectFilePath(sessionId);

    const stateToSave: ProjectState = {
      sessionId,
      savedAt: new Date().toISOString(),
      generatedAssets: projectState.generatedAssets || [],
      generatedRefs: projectState.generatedRefs || [],
      characterRefs: projectState.characterRefs || [],
      productRefs: projectState.productRefs || [],
      locationRefs: projectState.locationRefs || [],
      refImages: projectState.refImages || [],
      characterDNA: projectState.characterDNA || '',
      defaultDuration: projectState.defaultDuration || '5',
      videoModel: projectState.videoModel || 'kling-2.6',
      finalVideoUrl: projectState.finalVideoUrl,
      voiceoverUrl: projectState.voiceoverUrl,
      voiceoverText: projectState.voiceoverText,
      accumulatedPlans: projectState.accumulatedPlans || []
    };

    fs.writeFileSync(filePath, JSON.stringify(stateToSave, null, 2), 'utf-8');
    console.log(`[Project] Saved state for session: ${sessionId}`);

    return new Response(JSON.stringify({
      success: true,
      sessionId,
      savedAt: stateToSave.savedAt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Project] Save error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to save project state',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET - Load project state
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    ensureMemoryDir();
    const filePath = getProjectFilePath(sessionId);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({
        success: true,
        sessionId,
        projectState: null,
        message: 'No saved project state'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const projectState = JSON.parse(content) as ProjectState;

    console.log(`[Project] Loaded state for session: ${sessionId}`);

    return new Response(JSON.stringify({
      success: true,
      sessionId,
      projectState
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Project] Load error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to load project state',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Delete project state
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filePath = getProjectFilePath(sessionId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Deleted project state for session: ${sessionId}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to delete project state',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
