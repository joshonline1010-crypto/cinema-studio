import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../lib/cookies';
import { findSessionById } from '../../../lib/db';

const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzhkMWI5Mi02MzliLTRjMTUtYTEwNi0zNTJkOTljODBhNzEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2NzYwNDAyLCJleHAiOjE3NjkzMTcyMDB9.XGZRCVc4n_Je2I5wdIXHXffgpgggEbej3CL3WUmPmLY';
const N8N_BASE_URL = 'http://localhost:5678';

export const GET: APIRoute = async ({ cookies }) => {
  // Verify authentication
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
    // Fetch recent executions from n8n
    const response = await fetch(`${N8N_BASE_URL}/api/v1/executions?limit=20`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status}`);
    }

    const data = await response.json();

    // Also fetch workflow names
    const workflowsResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });

    const workflowsData = workflowsResponse.ok ? await workflowsResponse.json() : { data: [] };
    const workflowNames: Record<string, string> = {};
    for (const wf of workflowsData.data || []) {
      workflowNames[wf.id] = wf.name;
    }

    // Transform to simpler format
    const executions = (data.data || []).map((exec: any) => ({
      id: exec.id,
      workflowName: workflowNames[exec.workflowId] || `Workflow ${exec.workflowId}`,
      status: exec.status,
      startedAt: exec.startedAt,
      stoppedAt: exec.stoppedAt,
      mode: exec.mode,
    }));

    return new Response(JSON.stringify({ executions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Executions fetch error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch executions',
      executions: []
    }), {
      status: 200, // Return 200 with empty array to not break UI
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
