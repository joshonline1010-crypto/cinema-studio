import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../../lib/cookies';
import { findSessionById } from '../../../../lib/db';

const N8N_BASE_URL = 'http://localhost:5678';

interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: string;
  startedAt: string;
  stoppedAt?: string;
  duration?: number;
}

// GET /api/projects/:projectId/workflows - Get workflows/executions for project
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

  try {
    // Fetch recent executions from n8n
    const executionsRes = await fetch(`${N8N_BASE_URL}/api/v1/executions?limit=100`);

    if (!executionsRes.ok) {
      throw new Error(`n8n API error: ${executionsRes.status}`);
    }

    const executionsData = await executionsRes.json();
    const allExecutions = executionsData.data || [];

    // Fetch workflow names
    const workflowsRes = await fetch(`${N8N_BASE_URL}/api/v1/workflows`);
    const workflowsData = await workflowsRes.json();
    const workflowMap = new Map<string, string>();
    for (const wf of workflowsData.data || []) {
      workflowMap.set(wf.id, wf.name);
    }

    // Filter executions that match this project's sessionId
    // The sessionId is passed in the webhook body and stored in execution data
    const projectExecutions: Execution[] = [];
    const workflowsUsed = new Map<string, { id: string; name: string; count: number; lastRun: string }>();

    for (const exec of allExecutions) {
      // Check if this execution is related to our project
      // We look for the projectId or sessionId in the execution
      let isRelated = false;

      // Check in the execution data if available
      if (exec.data) {
        const dataStr = JSON.stringify(exec.data);
        if (dataStr.includes(projectId)) {
          isRelated = true;
        }
      }

      // Also check mode - if it's a webhook execution around the project time
      if (exec.mode === 'webhook') {
        // For now, include all webhook executions as potential matches
        // In production, we'd check the actual request body
        isRelated = true;
      }

      if (isRelated) {
        const workflowName = workflowMap.get(exec.workflowId) || 'Unknown Workflow';

        projectExecutions.push({
          id: exec.id,
          workflowId: exec.workflowId,
          workflowName,
          status: exec.status,
          startedAt: exec.startedAt,
          stoppedAt: exec.stoppedAt,
          duration: exec.stoppedAt
            ? new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime()
            : undefined
        });

        // Track unique workflows
        const existing = workflowsUsed.get(exec.workflowId);
        if (existing) {
          existing.count++;
          if (exec.startedAt > existing.lastRun) {
            existing.lastRun = exec.startedAt;
          }
        } else {
          workflowsUsed.set(exec.workflowId, {
            id: exec.workflowId,
            name: workflowName,
            count: 1,
            lastRun: exec.startedAt
          });
        }
      }
    }

    // Sort by most recent first
    projectExecutions.sort((a, b) =>
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    // Get unique workflows sorted by usage
    const workflows = Array.from(workflowsUsed.values())
      .sort((a, b) => b.count - a.count);

    return new Response(JSON.stringify({
      projectId,
      workflows,
      executions: projectExecutions.slice(0, 50), // Limit to 50 most recent
      stats: {
        totalExecutions: projectExecutions.length,
        uniqueWorkflows: workflows.length,
        successCount: projectExecutions.filter(e => e.status === 'success').length,
        errorCount: projectExecutions.filter(e => e.status === 'error').length
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching workflows:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch workflow data',
      details: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
