import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';
import { getSessionCookie } from '../../../../lib/cookies';
import { findSessionById } from '../../../../lib/db';

const DB_PATH = path.join(process.cwd(), '..', 'db', 'users');

// GET /api/projects/:projectId/state - Get intake state for storyboard progress
export const GET: APIRoute = async ({ params, cookies }) => {
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

  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: 'Project ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check project folder
  const projectPath = path.join(DB_PATH, session.userId, 'projects', projectId);
  if (!fs.existsSync(projectPath)) {
    return new Response(JSON.stringify({ error: 'Project not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Look for intake_state.json
  const statePath = path.join(projectPath, 'intake_state.json');

  if (!fs.existsSync(statePath)) {
    // No state file yet - return empty state
    return new Response(JSON.stringify({
      current_phase: 'NOT_STARTED',
      status: 'PENDING',
      locked: {},
      gaps_to_fill: [],
      checkpoints_completed: [],
      beats: [],
      reference_images: {},
      user_decisions: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const stateData = fs.readFileSync(statePath, 'utf8');
    const state = JSON.parse(stateData);

    return new Response(JSON.stringify(state), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading state file:', error);
    return new Response(JSON.stringify({ error: 'Failed to read state' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
