import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), "..", "db", "users");
function getUserProjectsPath(userId) {
  return path.join(DB_PATH, userId, "projects");
}
async function listProjects(userId) {
  const projectsPath = getUserProjectsPath(userId);
  if (!fs.existsSync(projectsPath)) {
    return [];
  }
  const entries = fs.readdirSync(projectsPath, { withFileTypes: true });
  const projects = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const projectPath = path.join(projectsPath, entry.name);
    const manifestPath = path.join(projectPath, "manifest.json");
    let manifest = {};
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      } catch (e) {
      }
    }
    const stats = fs.statSync(projectPath);
    let outputCount = manifest.outputCount || 0;
    const outputsPath = path.join(projectPath, "outputs");
    if (outputCount === 0 && fs.existsSync(outputsPath)) {
      try {
        const files = fs.readdirSync(outputsPath);
        outputCount = files.filter((f) => /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i.test(f)).length;
      } catch (e) {
      }
    }
    let thumbnail = null;
    if (manifest.thumbnail) {
      const thumbPath = path.join(projectPath, manifest.thumbnail);
      if (fs.existsSync(thumbPath)) {
        thumbnail = `/api/files/${userId}/projects/${entry.name}/${manifest.thumbnail}`;
      }
    }
    if (!thumbnail && fs.existsSync(outputsPath)) {
      try {
        const files = fs.readdirSync(outputsPath).filter((f) => /\.(png|jpg|jpeg|gif|webp)$/i.test(f)).map((f) => ({
          name: f,
          time: fs.statSync(path.join(outputsPath, f)).mtime.getTime()
        })).sort((a, b) => b.time - a.time);
        if (files.length > 0) {
          thumbnail = `/api/files/${userId}/projects/${entry.name}/outputs/${files[0].name}`;
        }
      } catch (e) {
      }
    }
    projects.push({
      id: entry.name,
      name: manifest.name || formatProjectName(entry.name),
      thumbnail,
      modified: manifest.modified || stats.mtime.toISOString(),
      outputCount
    });
  }
  projects.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
  return projects;
}
async function getProjectDetails(userId, projectId) {
  const projectPath = path.join(getUserProjectsPath(userId), projectId);
  if (!fs.existsSync(projectPath)) {
    return null;
  }
  const projects = await listProjects(userId);
  const summary = projects.find((p) => p.id === projectId);
  if (!summary) {
    return null;
  }
  const manifestPath = path.join(projectPath, "manifest.json");
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch (e) {
    }
  }
  const messages = await loadChatHistory(projectPath);
  const outputs = await loadOutputs(userId, projectId, projectPath);
  const stats = fs.statSync(projectPath);
  return {
    ...summary,
    created: manifest.created || stats.birthtime.toISOString(),
    agent: manifest.agent,
    messageCount: messages.length,
    messages,
    outputs
  };
}
async function createProject(userId, name) {
  const projectsPath = getUserProjectsPath(userId);
  if (!fs.existsSync(projectsPath)) {
    fs.mkdirSync(projectsPath, { recursive: true });
  }
  const projectId = `project-${Date.now()}`;
  const projectPath = path.join(projectsPath, projectId);
  fs.mkdirSync(projectPath);
  fs.mkdirSync(path.join(projectPath, "chats"));
  fs.mkdirSync(path.join(projectPath, "outputs"));
  fs.mkdirSync(path.join(projectPath, "savepoints"));
  const manifest = {
    id: projectId,
    name,
    created: (/* @__PURE__ */ new Date()).toISOString(),
    modified: (/* @__PURE__ */ new Date()).toISOString(),
    messageCount: 0,
    outputCount: 0
  };
  fs.writeFileSync(
    path.join(projectPath, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  return projectId;
}
async function renameProject(userId, projectId, name) {
  const projectPath = path.join(getUserProjectsPath(userId), projectId);
  const manifestPath = path.join(projectPath, "manifest.json");
  if (!fs.existsSync(projectPath)) {
    return false;
  }
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch (e) {
    }
  }
  manifest.name = name;
  manifest.modified = (/* @__PURE__ */ new Date()).toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return true;
}
async function loadChatHistory(projectPath) {
  const messages = [];
  const astrixPath = path.join(projectPath, "astrix", "messages.json");
  if (fs.existsSync(astrixPath)) {
    try {
      const astrixData = JSON.parse(fs.readFileSync(astrixPath, "utf-8"));
      if (astrixData.messages && Array.isArray(astrixData.messages)) {
        for (const msg of astrixData.messages) {
          messages.push({
            role: msg.role || "assistant",
            content: msg.content || "",
            timestamp: msg.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
            media: msg.mediaUrls ? msg.mediaUrls.map((url) => ({
              type: url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
              url
            })) : void 0
          });
        }
      }
    } catch (e) {
    }
  }
  if (messages.length > 0) {
    return messages;
  }
  const savepointsPath = path.join(projectPath, "savepoints");
  if (fs.existsSync(savepointsPath)) {
    try {
      const files = fs.readdirSync(savepointsPath).filter((f) => f.endsWith(".json")).sort();
      for (const file of files) {
        try {
          const savepoint = JSON.parse(
            fs.readFileSync(path.join(savepointsPath, file), "utf-8")
          );
          if (savepoint.messages && Array.isArray(savepoint.messages)) {
            for (const msg of savepoint.messages) {
              messages.push({
                role: msg.role || (msg.type === "human" ? "user" : "assistant"),
                content: msg.content || msg.text || "",
                timestamp: msg.timestamp || savepoint.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
                media: msg.media
              });
            }
          }
          if (savepoint.downloads && Array.isArray(savepoint.downloads)) {
            const lastAssistant = messages.filter((m) => m.role === "assistant").pop();
            if (lastAssistant) {
              lastAssistant.media = savepoint.downloads.map((d) => ({
                type: d.type || (d.url?.match(/\.(mp4|webm|mov)$/i) ? "video" : "image"),
                url: d.url || d.path
              }));
            }
          }
        } catch (e) {
        }
      }
    } catch (e) {
    }
  }
  if (messages.length === 0) {
    const chatPath = path.join(projectPath, "chats", "conversation.txt");
    if (fs.existsSync(chatPath)) {
      try {
        const content = fs.readFileSync(chatPath, "utf-8");
        const lines = content.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          const match = line.match(/^\[([^\]]+)\]\s*(User|Assistant|AI|CHIP):\s*(.+)$/i);
          if (match) {
            messages.push({
              role: match[2].toLowerCase() === "user" ? "user" : "assistant",
              content: match[3],
              timestamp: new Date(match[1]).toISOString()
            });
          }
        }
      } catch (e) {
      }
    }
  }
  return messages;
}
async function loadOutputs(userId, projectId, projectPath) {
  const outputs = [];
  const outputsPath = path.join(projectPath, "outputs");
  if (!fs.existsSync(outputsPath)) {
    return outputs;
  }
  try {
    const files = fs.readdirSync(outputsPath).filter((f) => /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i.test(f));
    for (const file of files) {
      const filePath = path.join(outputsPath, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      outputs.push({
        type: [".mp4", ".webm", ".mov"].includes(ext) ? "video" : "image",
        filename: file,
        url: `/api/files/${userId}/projects/${projectId}/outputs/${file}`,
        created: stats.mtime.toISOString()
      });
    }
    outputs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  } catch (e) {
  }
  return outputs;
}
function formatProjectName(projectId) {
  const match = projectId.match(/(\d{13})/);
  if (match) {
    const date = new Date(parseInt(match[1]));
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    if (projectId.startsWith("mcp-session")) {
      return `Session ${month} ${day}`;
    }
    return `Project ${month} ${day}`;
  }
  return projectId.replace(/^(mcp-session-|project-)/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export { createProject as c, getProjectDetails as g, listProjects as l, renameProject as r };
