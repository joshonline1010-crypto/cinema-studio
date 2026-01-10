import type { APIRoute } from 'astro';
import { deleteSession } from '../../../lib/db';
import { getSessionCookie, clearSessionCookie } from '../../../lib/cookies';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Get current session
    const sessionId = getSessionCookie(cookies);

    // Delete session from database
    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Clear cookie
    clearSessionCookie(cookies);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookie even if there's an error
    clearSessionCookie(cookies);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Also support GET for simple logout links
export const GET: APIRoute = async ({ cookies, redirect }) => {
  const sessionId = getSessionCookie(cookies);

  if (sessionId) {
    await deleteSession(sessionId);
  }

  clearSessionCookie(cookies);

  return redirect('/login');
};
