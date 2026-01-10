import fs from 'fs/promises';
import path__default from 'path';

const SESSION_COOKIE_NAME = "video_studio_session";
const SESSION_MAX_AGE = 60 * 60 * 24;
function setSessionCookie(cookies, sessionId) {
  cookies.set(SESSION_COOKIE_NAME, sessionId, {
    path: "/",
    httpOnly: true,
    secure: false,
    // Set to true in production with HTTPS
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE
  });
}
function getSessionCookie(cookies) {
  return cookies.get(SESSION_COOKIE_NAME)?.value;
}
function clearSessionCookie(cookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
}

const DB_PATH = path__default.join(process.cwd(), "db");
async function readUsers() {
  try {
    const data = await fs.readFile(path__default.join(DB_PATH, "users.json"), "utf-8");
    return JSON.parse(data).users;
  } catch {
    return [];
  }
}
async function writeUsers(users) {
  await fs.writeFile(
    path__default.join(DB_PATH, "users.json"),
    JSON.stringify({ users }, null, 2)
  );
}
async function findUserByUsername(username) {
  const users = await readUsers();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}
async function findUserById(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}
async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
async function createUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
}
async function updateUserLastLogin(userId) {
  const users = await readUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex >= 0) {
    users[userIndex].lastLogin = (/* @__PURE__ */ new Date()).toISOString();
    await writeUsers(users);
  }
}
async function readSessions() {
  try {
    const data = await fs.readFile(path__default.join(DB_PATH, "sessions.json"), "utf-8");
    return JSON.parse(data).sessions;
  } catch {
    return [];
  }
}
async function writeSessions(sessions) {
  await fs.writeFile(
    path__default.join(DB_PATH, "sessions.json"),
    JSON.stringify({ sessions }, null, 2)
  );
}
async function findSessionById(sessionId) {
  const sessions = await readSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (session && new Date(session.expiresAt) > /* @__PURE__ */ new Date()) {
    return session;
  }
  return void 0;
}
async function createSession(session) {
  const sessions = await readSessions();
  sessions.push(session);
  await writeSessions(sessions);
}
async function deleteSession(sessionId) {
  const sessions = await readSessions();
  const filtered = sessions.filter((s) => s.sessionId !== sessionId);
  await writeSessions(filtered);
}

export { findUserById as a, findUserByUsername as b, createSession as c, deleteSession as d, clearSessionCookie as e, findSessionById as f, getSessionCookie as g, findUserByEmail as h, createUser as i, setSessionCookie as s, updateUserLastLogin as u };
