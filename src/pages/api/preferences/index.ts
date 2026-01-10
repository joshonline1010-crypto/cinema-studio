import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../lib/cookies';
import { findSessionById } from '../../../lib/db';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = 'C:/Users/yodes/Documents/n8n/db/users';

export interface CreativePreferences {
  character_ref?: {
    url: string;
    name: string;
    uploaded: string;
  };
  background_ref?: {
    url: string;
    name: string;
    uploaded: string;
  };
  style_preset?: {
    id: string;
    name: string;
    category: string;
    description?: string;
  };
}

async function getPreferencesPath(userId: string): Promise<string> {
  const userDir = path.join(DB_PATH, userId);
  await fs.mkdir(userDir, { recursive: true });
  return path.join(userDir, 'creative_preferences.json');
}

async function loadPreferences(userId: string): Promise<CreativePreferences> {
  try {
    const prefsPath = await getPreferencesPath(userId);
    const data = await fs.readFile(prefsPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return defaults if file doesn't exist
    return {
      character_ref: {
        url: 'https://files.catbox.moe/pfpk1l.png',
        name: 'CHIP (Default)',
        uploaded: '2025-01-01'
      }
    };
  }
}

async function savePreferences(userId: string, prefs: CreativePreferences): Promise<void> {
  const prefsPath = await getPreferencesPath(userId);
  await fs.writeFile(prefsPath, JSON.stringify(prefs, null, 2));
}

// GET /api/preferences - Load user's creative preferences
export const GET: APIRoute = async ({ cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session expired' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const preferences = await loadPreferences(session.userId);

    return new Response(JSON.stringify({ preferences }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error loading preferences:', error);
    return new Response(JSON.stringify({ error: 'Failed to load preferences' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST /api/preferences - Save user's creative preferences
export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session expired' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { character_ref, background_ref, style_preset } = body;

    // Load existing preferences and merge
    const existing = await loadPreferences(session.userId);

    const updated: CreativePreferences = {
      ...existing,
      ...(character_ref !== undefined && { character_ref }),
      ...(background_ref !== undefined && { background_ref }),
      ...(style_preset !== undefined && { style_preset })
    };

    await savePreferences(session.userId, updated);

    return new Response(JSON.stringify({
      success: true,
      preferences: updated
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return new Response(JSON.stringify({ error: 'Failed to save preferences' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Export for use in other files
export { loadPreferences, savePreferences };
