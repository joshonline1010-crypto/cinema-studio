import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { g as getSessionCookie, f as findSessionById } from '../../../../chunks/db_CvyCu46H.mjs';
export { renderers } from '../../../../renderers.mjs';

const DB_PATH = path.join(process.cwd(), "..", "db", "users");
const POST = async ({ params, cookies }) => {
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
  const normalizedPath = projectPath.replace(/\//g, "\\");
  exec(`explorer "${normalizedPath}"`, (error) => {
    if (error) {
      console.error("Failed to open folder:", error);
    }
  });
  return new Response(JSON.stringify({
    success: true,
    path: projectPath
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
