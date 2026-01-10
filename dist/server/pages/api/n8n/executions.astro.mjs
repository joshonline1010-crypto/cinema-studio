import { g as getSessionCookie, f as findSessionById } from '../../../chunks/db_CvyCu46H.mjs';
export { renderers } from '../../../renderers.mjs';

const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzhkMWI5Mi02MzliLTRjMTUtYTEwNi0zNTJkOTljODBhNzEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2NzYwNDAyLCJleHAiOjE3NjkzMTcyMDB9.XGZRCVc4n_Je2I5wdIXHXffgpgggEbej3CL3WUmPmLY";
const N8N_BASE_URL = "http://localhost:5678";
const GET = async ({ cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const response = await fetch(`${N8N_BASE_URL}/api/v1/executions?limit=20`, {
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY
      }
    });
    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status}`);
    }
    const data = await response.json();
    const workflowsResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY
      }
    });
    const workflowsData = workflowsResponse.ok ? await workflowsResponse.json() : { data: [] };
    const workflowNames = {};
    for (const wf of workflowsData.data || []) {
      workflowNames[wf.id] = wf.name;
    }
    const executions = (data.data || []).map((exec) => ({
      id: exec.id,
      workflowName: workflowNames[exec.workflowId] || `Workflow ${exec.workflowId}`,
      status: exec.status,
      startedAt: exec.startedAt,
      stoppedAt: exec.stoppedAt,
      mode: exec.mode
    }));
    return new Response(JSON.stringify({ executions }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Executions fetch error:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch executions",
      executions: []
    }), {
      status: 200,
      // Return 200 with empty array to not break UI
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
