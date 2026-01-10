// JSON file database operations
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db');

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLogin: string | null;
  preferences: {
    theme: string;
    defaultAgent: string;
  };
}

export interface Session {
  sessionId: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Read all users from the database
 */
export async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(path.join(DB_PATH, 'users.json'), 'utf-8');
    return JSON.parse(data).users;
  } catch {
    return [];
  }
}

/**
 * Write users to the database
 */
export async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(
    path.join(DB_PATH, 'users.json'),
    JSON.stringify({ users }, null, 2)
  );
}

/**
 * Find a user by username (case-insensitive)
 */
export async function findUserByUsername(username: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find(u => u.id === id);
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Create a new user
 */
export async function createUser(user: User): Promise<void> {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
}

/**
 * Update a user's last login timestamp
 */
export async function updateUserLastLogin(userId: string): Promise<void> {
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex >= 0) {
    users[userIndex].lastLogin = new Date().toISOString();
    await writeUsers(users);
  }
}

// ============================================
// SESSION OPERATIONS
// ============================================

/**
 * Read all sessions from the database
 */
export async function readSessions(): Promise<Session[]> {
  try {
    const data = await fs.readFile(path.join(DB_PATH, 'sessions.json'), 'utf-8');
    return JSON.parse(data).sessions;
  } catch {
    return [];
  }
}

/**
 * Write sessions to the database
 */
export async function writeSessions(sessions: Session[]): Promise<void> {
  await fs.writeFile(
    path.join(DB_PATH, 'sessions.json'),
    JSON.stringify({ sessions }, null, 2)
  );
}

/**
 * Find a valid (non-expired) session by ID
 */
export async function findSessionById(sessionId: string): Promise<Session | undefined> {
  const sessions = await readSessions();
  const session = sessions.find(s => s.sessionId === sessionId);

  if (session && new Date(session.expiresAt) > new Date()) {
    return session;
  }

  return undefined;
}

/**
 * Create a new session
 */
export async function createSession(session: Session): Promise<void> {
  const sessions = await readSessions();
  sessions.push(session);
  await writeSessions(sessions);
}

/**
 * Delete a session by ID
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await readSessions();
  const filtered = sessions.filter(s => s.sessionId !== sessionId);
  await writeSessions(filtered);
}

/**
 * Clean up expired sessions
 */
export async function cleanExpiredSessions(): Promise<number> {
  const sessions = await readSessions();
  const now = new Date();
  const valid = sessions.filter(s => new Date(s.expiresAt) > now);
  const removed = sessions.length - valid.length;

  if (removed > 0) {
    await writeSessions(valid);
  }

  return removed;
}

/**
 * Delete all sessions for a user
 */
export async function deleteUserSessions(userId: string): Promise<void> {
  const sessions = await readSessions();
  const filtered = sessions.filter(s => s.userId !== userId);
  await writeSessions(filtered);
}
