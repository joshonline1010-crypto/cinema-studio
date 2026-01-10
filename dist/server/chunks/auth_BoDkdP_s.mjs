import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateSessionId() {
  return `sess_${randomUUID().replace(/-/g, "")}`;
}
function generateUserId() {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export { generateUserId as a, generateSessionId as g, hashPassword as h, verifyPassword as v };
