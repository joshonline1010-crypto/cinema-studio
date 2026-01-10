// Authentication utilities
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a new session ID
 */
export function generateSessionId(): string {
  return `sess_${randomUUID().replace(/-/g, '')}`;
}

/**
 * Generate a new user ID
 */
export function generateUserId(): string {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Check if a session has expired (24 hours)
 */
export function isSessionExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
