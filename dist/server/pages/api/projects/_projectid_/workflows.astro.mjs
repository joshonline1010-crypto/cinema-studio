import { g as getSessionCookie, f as findSessionById } from '../../../../chunks/db_CvyCu46H.mjs';
export { renderers } from '../../../../renderers.mjs';

const N8N_BASE_URL = "http://localhost:5678";
const GET = async ({ params, cookies }) => {
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
  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const executionsRes = await fetch(`${N8N_BASE_URL}/api/v1/executions?limit=100`);
    if (!executionsRes.ok) {
      throw new Error(`n8n API error: ${executionsRes.status}`);
    }
    const executionsData = await executionsRes.json();
    const allExecutions = executionsData.data || [];
    const workflowsRes = await fetch(`${N8N_BASE_URL}/api/v1/workflows`);
    const workflowsData = await workflowsRes.json();
    const workflowMap = /* @__PURE__ */ new Map();
    for (const wf of workflowsData.data || []) {
      workflowMap.set(wf.id, wf.name);
    }
    const projectExecutions = [];
    const workflowsUsed = /* @__PURE__ */ new Map();
    for (const exec of allExecutions) {
      let isRelated = false;
      if (exec.data) {
        const dataStr = JSON.stringify(exec.data);
        if (dataStr.includes(projectId)) {
          isRelated = true;
        }
      }
      if (exec.mode === "webhook") {
        isRelated = true;
      }
      if (isRelated) {
        const workflowName = workflowMap.get(exec.workflowId) || "Unknown Workflow";
        projectExecutions.push({
          id: exec.id,
          workflowId: exec.workflowId,
          workflowName,
          status: exec.status,
          startedAt: exec.startedAt,
          stoppedAt: exec.stoppedAt,
          duration: exec.stoppedAt ? new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime() : void 0
        });
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
    projectExecutions.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    const workflows = Array.from(workflowsUsed.values()).sort((a, b) => b.count - a.count);
    return new Response(JSON.stringify({
      projectId,
      workflows,
      executions: projectExecutions.slice(0, 50),
      // Limit to 50 most recent
      stats: {
        totalExecutions: projectExecutions.length,
        uniqueWorkflows: workflows.length,
        successCount: projectExecutions.filter((e) => e.status === "success").length,
        errorCount: projectExecutions.filter((e) => e.status === "error").length
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch workflow data",
      details: String(error)
    }), {
      status: 500,
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
