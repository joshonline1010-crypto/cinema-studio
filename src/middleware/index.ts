// Astro middleware for authentication
import { defineMiddleware } from 'astro:middleware';
import { getSessionCookie } from '../lib/cookies';
import { findSessionById, findUserById } from '../lib/db';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/settings', '/projects'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/register'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const sessionId = getSessionCookie(context.cookies);

  // Try to get user from session
  let user = null;
  if (sessionId) {
    const session = await findSessionById(sessionId);
    if (session) {
      user = await findUserById(session.userId);
    }
  }

  // Store user in locals for access in pages
  context.locals.user = user;

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !user) {
    return context.redirect('/login');
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route);
  if (isAuthRoute && user) {
    return context.redirect('/dashboard');
  }

  return next();
});
