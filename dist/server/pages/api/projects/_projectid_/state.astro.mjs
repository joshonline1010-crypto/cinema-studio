import * as fs from 'fs';
import * as path from 'path';
import { g as getSessionCookie, f as findSessionById } from '../../../../chunks/db_CvyCu46H.mjs';
export { renderers } from '../../../../renderers.mjs';

const DB_PATH = path.join(process.cwd(), "..", "db", "users");
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
  const projectPath = path.join(DB_PATH, session.userId, "projects", projectId);
  if (!fs.existsSync(projectPath)) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  const statePath = path.join(projectPath, "intake_state.json");
  if (!fs.existsSync(statePath)) {
    return new Response(JSON.stringify({
      current_phase: "NOT_STARTED",
      status: "PENDING",
      locked: {},
      gaps_to_fill: [],
      checkpoints_completed: [],
      beats: [],
      reference_images: {},
      user_decisions: []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const stateData = fs.readFileSync(statePath, "utf8");
    const state = JSON.parse(stateData);
    return new Response(JSON.stringify(state), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error reading state file:", error);
    return new Response(JSON.stringify({ error: "Failed to read state" }), {
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
