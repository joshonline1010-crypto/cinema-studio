import { b as findUserByUsername, h as findUserByEmail, i as createUser, c as createSession, s as setSessionCookie } from '../../../chunks/db_CvyCu46H.mjs';
import { h as hashPassword, a as generateUserId, g as generateSessionId } from '../../../chunks/auth_BoDkdP_s.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return new Response(JSON.stringify({
        error: "Username must be 3-20 characters, alphanumeric and underscores only"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return new Response(JSON.stringify({ error: "Username already taken" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const passwordHash = await hashPassword(password);
    const userId = generateUserId();
    const newUser = {
      id: userId,
      username,
      email,
      passwordHash,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
      preferences: {
        theme: "dark",
        defaultAgent: "chip-agent-v4"
      }
    };
    await createUser(newUser);
    const sessionId = generateSessionId();
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1e3);
    await createSession({
      sessionId,
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    });
    setSessionCookie(cookies, sessionId);
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: userId,
        username,
        email
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
