import * as fs from 'fs';
import * as path from 'path';
export { renderers } from '../../../renderers.mjs';

const DB_PATH = path.join(process.cwd(), "..", "db", "users");
const POST = async () => {
  const results = [];
  try {
    if (!fs.existsSync(DB_PATH)) {
      return new Response(JSON.stringify({
        message: "No users directory found",
        results: []
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const users = fs.readdirSync(DB_PATH, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    for (const userId of users) {
      const projectsPath = path.join(DB_PATH, userId, "projects");
      if (!fs.existsSync(projectsPath)) continue;
      const projects = fs.readdirSync(projectsPath, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
      for (const projectId of projects) {
        const projectPath = path.join(projectsPath, projectId);
        const manifestPath = path.join(projectPath, "manifest.json");
        if (fs.existsSync(manifestPath)) {
          results.push({ projectId, status: "already_has_manifest" });
          continue;
        }
        try {
          const stats = fs.statSync(projectPath);
          let outputCount = 0;
          let thumbnail = null;
          const outputsPath = path.join(projectPath, "outputs");
          if (fs.existsSync(outputsPath)) {
            const files = fs.readdirSync(outputsPath).filter((f) => /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i.test(f)).map((f) => ({
              name: f,
              time: fs.statSync(path.join(outputsPath, f)).mtime.getTime()
            })).sort((a, b) => b.time - a.time);
            outputCount = files.length;
            const latestImage = files.find((f) => /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name));
            if (latestImage) {
              thumbnail = `outputs/${latestImage.name}`;
            }
          }
          let messageCount = 0;
          const chatsPath = path.join(projectPath, "chats");
          if (fs.existsSync(chatsPath)) {
            const chatFiles = fs.readdirSync(chatsPath).filter((f) => f.endsWith(".json"));
            messageCount = chatFiles.length;
          }
          let name = "Unnamed Project";
          const match = projectId.match(/(\d{13})/);
          if (match) {
            const date = new Date(parseInt(match[1]));
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const day = date.getDate();
            name = projectId.startsWith("mcp-session") ? `Session ${month} ${day}` : `Project ${month} ${day}`;
          }
          const manifest = {
            id: projectId,
            name,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            agent: "chip-agent-v2",
            thumbnail,
            messageCount,
            outputCount
          };
          fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
          results.push({ projectId, status: "created" });
        } catch (error) {
          results.push({ projectId, status: `error: ${String(error)}` });
        }
      }
    }
    const created = results.filter((r) => r.status === "created").length;
    const existing = results.filter((r) => r.status === "already_has_manifest").length;
    const errors = results.filter((r) => r.status.startsWith("error")).length;
    return new Response(JSON.stringify({
      message: `Migration complete: ${created} created, ${existing} already had manifests, ${errors} errors`,
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(JSON.stringify({
      error: "Migration failed",
      details: String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
