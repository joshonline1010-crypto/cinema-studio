import { g as getSessionCookie, f as findSessionById } from '../../../chunks/db_CvyCu46H.mjs';
import * as fs from 'fs';
import * as path from 'path';
export { renderers } from '../../../renderers.mjs';

const ALLOWED_BASE = "C:\\Users\\yodes\\Documents\\n8n\\db\\users";
const GET = async ({ params, cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response("Session expired", { status: 401 });
  }
  const filePath = params.path;
  if (!filePath) {
    return new Response("File path required", { status: 400 });
  }
  const fullPath = path.join(ALLOWED_BASE, filePath);
  const normalizedPath = path.normalize(fullPath);
  if (!normalizedPath.startsWith(ALLOWED_BASE)) {
    return new Response("Access denied", { status: 403 });
  }
  if (!fs.existsSync(normalizedPath)) {
    return new Response("File not found", { status: 404 });
  }
  const ext = path.extname(normalizedPath).toLowerCase();
  const contentTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".json": "application/json",
    ".txt": "text/plain"
  };
  const contentType = contentTypes[ext] || "application/octet-stream";
  const fileBuffer = fs.readFileSync(normalizedPath);
  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
