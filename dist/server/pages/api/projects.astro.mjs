import { g as getSessionCookie, f as findSessionById } from '../../chunks/db_CvyCu46H.mjs';
import { l as listProjects, c as createProject } from '../../chunks/projects_DoJQnlse.mjs';
export { renderers } from '../../renderers.mjs';

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
    const projects = await listProjects(session.userId);
    return new Response(JSON.stringify({ projects }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error listing projects:", error);
    return new Response(JSON.stringify({ error: "Failed to list projects" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, cookies }) => {
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
    const body = await request.json();
    const { name } = body;
    if (!name || typeof name !== "string") {
      return new Response(JSON.stringify({ error: "Project name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const projectId = await createProject(session.userId, name.trim());
    return new Response(JSON.stringify({
      success: true,
      projectId,
      name: name.trim()
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return new Response(JSON.stringify({ error: "Failed to create project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
