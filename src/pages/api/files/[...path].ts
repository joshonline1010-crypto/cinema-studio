import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../lib/cookies';
import { findSessionById } from '../../../lib/db';
import * as fs from 'fs';
import * as path from 'path';

const ALLOWED_BASE = 'C:\\Users\\yodes\\Documents\\n8n\\db\\users';

export const GET: APIRoute = async ({ params, cookies }) => {
  // Verify authentication
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response('Session expired', { status: 401 });
  }

  // Get file path from URL
  const filePath = params.path;
  if (!filePath) {
    return new Response('File path required', { status: 400 });
  }

  // Construct full path - only allow files under user folders
  const fullPath = path.join(ALLOWED_BASE, filePath);

  // Security: ensure path is within allowed directory
  const normalizedPath = path.normalize(fullPath);
  if (!normalizedPath.startsWith(ALLOWED_BASE)) {
    return new Response('Access denied', { status: 403 });
  }

  // Check file exists
  if (!fs.existsSync(normalizedPath)) {
    return new Response('File not found', { status: 404 });
  }

  // Get file extension for content type
  const ext = path.extname(normalizedPath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.json': 'application/json',
    '.txt': 'text/plain',
  };

  const contentType = contentTypes[ext] || 'application/octet-stream';

  // Read and return file
  const fileBuffer = fs.readFileSync(normalizedPath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
