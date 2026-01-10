// Cookie management utilities
import type { AstroCookies } from 'astro';

const SESSION_COOKIE_NAME = 'video_studio_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * Set the session cookie
 */
export function setSessionCookie(cookies: AstroCookies, sessionId: string): void {
  cookies.set(SESSION_COOKIE_NAME, sessionId, {
    path: '/',
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE
  });
}

/**
 * Get the session cookie value
 */
export function getSessionCookie(cookies: AstroCookies): string | undefined {
  return cookies.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Clear the session cookie
 */
export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
