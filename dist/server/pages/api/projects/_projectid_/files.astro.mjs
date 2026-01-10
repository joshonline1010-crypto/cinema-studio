import * as fs from 'fs';
import * as path from 'path';
import { g as getSessionCookie, f as findSessionById } from '../../../../chunks/db_CvyCu46H.mjs';
export { renderers } from '../../../../renderers.mjs';

const DB_PATH = path.join(process.cwd(), "..", "db", "users");
function scanDirectory(dirPath, userId, projectId, relativePath = "") {
  const entries = [];
  if (!fs.existsSync(dirPath)) {
    return entries;
  }
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;
      if (item.isDirectory()) {
        if (["node_modules", ".git", "__pycache__"].includes(item.name)) continue;
        entries.push({
          name: item.name,
          type: "folder",
          path: itemRelativePath,
          children: scanDirectory(itemPath, userId, projectId, itemRelativePath)
        });
      } else {
        const stats = fs.statSync(itemPath);
        const ext = path.extname(item.name).toLowerCase();
        const isMedia = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".webm", ".mov", ".mp3", ".wav"].includes(ext);
        entries.push({
          name: item.name,
          type: "file",
          path: itemRelativePath,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          url: isMedia ? `/api/files/${userId}/projects/${projectId}/${itemRelativePath}` : void 0
        });
      }
    }
    entries.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error scanning directory:", error);
  }
  return entries;
}
const GET = async ({ params, cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const projectPath = path.join(DB_PATH, session.userId, "projects", projectId);
  if (!fs.existsSync(projectPath)) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  const files = scanDirectory(projectPath, session.userId, projectId);
  let totalSize = 0;
  let fileCount = 0;
  const countFiles = (entries) => {
    for (const entry of entries) {
      if (entry.type === "file") {
        fileCount++;
        totalSize += entry.size || 0;
      } else if (entry.children) {
        countFiles(entry.children);
      }
    }
  };
  countFiles(files);
  return new Response(JSON.stringify({
    projectId,
    path: projectPath,
    files,
    stats: {
      totalFiles: fileCount,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize)
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
