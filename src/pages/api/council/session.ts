// API Endpoint: Session management - save/load council sessions to disk
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// Sessions folder path
const SESSIONS_PATH = 'C:\\Users\\yodes\\Documents\\n8n\\video-studio\\council-sessions';

// Ensure sessions directory exists
async function ensureSessionsDir() {
  try {
    await fs.mkdir(SESSIONS_PATH, { recursive: true });
  } catch (err) {
    // Already exists
  }
}

// ============================================
// GET - List sessions or load specific session
// ============================================

export const GET: APIRoute = async ({ request }) => {
  await ensureSessionsDir();

  const url = new URL(request.url);
  const sessionName = url.searchParams.get('name');

  try {
    if (!sessionName) {
      // List all sessions
      const entries = await fs.readdir(SESSIONS_PATH, { withFileTypes: true });
      const sessions = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const sessionPath = path.join(SESSIONS_PATH, entry.name);
          const metaPath = path.join(sessionPath, 'meta.txt');

          try {
            const metaContent = await fs.readFile(metaPath, 'utf-8');
            const meta = JSON.parse(metaContent);
            sessions.push({
              name: entry.name,
              ...meta
            });
          } catch {
            // No meta file, just add name
            sessions.push({
              name: entry.name,
              createdAt: 0,
              updatedAt: 0
            });
          }
        }
      }

      // Sort by most recent
      sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      return new Response(JSON.stringify({
        success: true,
        sessions
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load specific session
    const sessionPath = path.join(SESSIONS_PATH, sessionName);

    // Check if session exists
    try {
      await fs.access(sessionPath);
    } catch {
      return new Response(JSON.stringify({
        success: false,
        error: `Session not found: ${sessionName}`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load all session files
    const sessionData: any = { name: sessionName };

    // Load meta
    try {
      const metaContent = await fs.readFile(path.join(sessionPath, 'meta.txt'), 'utf-8');
      sessionData.meta = JSON.parse(metaContent);
    } catch {}

    // Load messages
    try {
      const messagesContent = await fs.readFile(path.join(sessionPath, 'messages.txt'), 'utf-8');
      sessionData.messages = JSON.parse(messagesContent);
    } catch {
      sessionData.messages = [];
    }

    // Load plans
    try {
      const plansContent = await fs.readFile(path.join(sessionPath, 'plans.txt'), 'utf-8');
      sessionData.plans = JSON.parse(plansContent);
    } catch {
      sessionData.plans = [];
    }

    // Load refs
    try {
      const refsContent = await fs.readFile(path.join(sessionPath, 'refs.txt'), 'utf-8');
      sessionData.refs = JSON.parse(refsContent);
    } catch {
      sessionData.refs = [];
    }

    // Load meeting history
    try {
      const meetingsContent = await fs.readFile(path.join(sessionPath, 'meetings.txt'), 'utf-8');
      sessionData.meetingHistory = JSON.parse(meetingsContent);
    } catch {
      sessionData.meetingHistory = [];
    }

    // Load settings
    try {
      const settingsContent = await fs.readFile(path.join(sessionPath, 'settings.txt'), 'utf-8');
      sessionData.settings = JSON.parse(settingsContent);
    } catch {
      sessionData.settings = {};
    }

    // Load generated assets
    try {
      const assetsContent = await fs.readFile(path.join(sessionPath, 'assets.txt'), 'utf-8');
      sessionData.generatedAssets = JSON.parse(assetsContent);
    } catch {
      sessionData.generatedAssets = [];
    }

    return new Response(JSON.stringify({
      success: true,
      session: sessionData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[Session API] GET error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ============================================
// POST - Save session
// ============================================

export const POST: APIRoute = async ({ request }) => {
  await ensureSessionsDir();

  try {
    const body = await request.json();
    const { name, data } = body;

    if (!name) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session name is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize name (remove special characters)
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const sessionPath = path.join(SESSIONS_PATH, safeName);

    // Create session directory
    await fs.mkdir(sessionPath, { recursive: true });

    const now = Date.now();

    // Save meta
    const meta = {
      name: safeName,
      displayName: name,
      createdAt: data.createdAt || now,
      updatedAt: now,
      messageCount: data.messages?.length || 0,
      planCount: data.plans?.length || 0,
      meetingCount: data.meetingHistory?.length || 0
    };
    await fs.writeFile(
      path.join(sessionPath, 'meta.txt'),
      JSON.stringify(meta, null, 2),
      'utf-8'
    );

    // Save messages
    if (data.messages) {
      await fs.writeFile(
        path.join(sessionPath, 'messages.txt'),
        JSON.stringify(data.messages, null, 2),
        'utf-8'
      );
    }

    // Save plans
    if (data.plans || data.currentPlan) {
      const plans = data.plans || [];
      if (data.currentPlan && !plans.find((p: any) => p.id === data.currentPlan.id)) {
        plans.push(data.currentPlan);
      }
      await fs.writeFile(
        path.join(sessionPath, 'plans.txt'),
        JSON.stringify(plans, null, 2),
        'utf-8'
      );
    }

    // Save refs
    if (data.refs) {
      await fs.writeFile(
        path.join(sessionPath, 'refs.txt'),
        JSON.stringify(data.refs, null, 2),
        'utf-8'
      );
    }

    // Save meeting history
    if (data.meetingHistory) {
      await fs.writeFile(
        path.join(sessionPath, 'meetings.txt'),
        JSON.stringify(data.meetingHistory, null, 2),
        'utf-8'
      );
    }

    // Save settings
    const settings = {
      councilEnabled: data.councilEnabled,
      autoApprove: data.autoApprove,
      selectedDirector: data.selectedDirector,
      videoModel: data.videoModel,
      defaultDuration: data.defaultDuration
    };
    await fs.writeFile(
      path.join(sessionPath, 'settings.txt'),
      JSON.stringify(settings, null, 2),
      'utf-8'
    );

    // Save generated assets
    if (data.generatedAssets) {
      await fs.writeFile(
        path.join(sessionPath, 'assets.txt'),
        JSON.stringify(data.generatedAssets, null, 2),
        'utf-8'
      );
    }

    console.log(`[Session API] Saved session: ${safeName}`);

    return new Response(JSON.stringify({
      success: true,
      sessionName: safeName,
      path: sessionPath,
      meta
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[Session API] POST error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ============================================
// DELETE - Delete session
// ============================================

export const DELETE: APIRoute = async ({ request }) => {
  await ensureSessionsDir();

  try {
    const url = new URL(request.url);
    const sessionName = url.searchParams.get('name');

    if (!sessionName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session name is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionPath = path.join(SESSIONS_PATH, sessionName);

    // Check if session exists
    try {
      await fs.access(sessionPath);
    } catch {
      return new Response(JSON.stringify({
        success: false,
        error: `Session not found: ${sessionName}`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete session folder
    await fs.rm(sessionPath, { recursive: true });

    console.log(`[Session API] Deleted session: ${sessionName}`);

    return new Response(JSON.stringify({
      success: true,
      deleted: sessionName
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[Session API] DELETE error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
