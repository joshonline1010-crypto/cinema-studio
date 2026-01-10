import type { APIRoute } from 'astro';
import { findUserByUsername, findUserByEmail, createUser, createSession } from '../../../lib/db';
import { hashPassword, generateSessionId, generateUserId } from '../../../lib/auth';
import { setSessionCookie } from '../../../lib/cookies';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return new Response(JSON.stringify({
        error: 'Username must be 3-20 characters, alphanumeric and underscores only'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if username exists
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return new Response(JSON.stringify({ error: 'Username already taken' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if email exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate user ID
    const userId = generateUserId();

    // Create user
    const newUser = {
      id: userId,
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        defaultAgent: 'chip-agent-v4'
      }
    };

    await createUser(newUser);

    // TODO: Create user folder structure using UserFolderManager
    // This would integrate with the Foundation System module

    // Create session and auto-login
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await createSession({
      sessionId,
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    });

    // Set cookie
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
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
