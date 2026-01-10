import { g as getSessionCookie, d as deleteSession, e as clearSessionCookie } from '../../../chunks/db_CvyCu46H.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ cookies }) => {
  try {
    const sessionId = getSessionCookie(cookies);
    if (sessionId) {
      await deleteSession(sessionId);
    }
    clearSessionCookie(cookies);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Logout error:", error);
    clearSessionCookie(cookies);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ cookies, redirect }) => {
  const sessionId = getSessionCookie(cookies);
  if (sessionId) {
    await deleteSession(sessionId);
  }
  clearSessionCookie(cookies);
  return redirect("/login");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
