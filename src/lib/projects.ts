import * as fs from 'fs';
import * as path from 'path';

// Point to n8n's db folder (one level up from video-studio)
const DB_PATH = path.join(process.cwd(), '..', 'db', 'users');

export interface ProjectManifest {
  id: string;
  name: string;
  created: string;
  modified: string;
  agent?: string;
  thumbnail?: string;
  messageCount: number;
  outputCount: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  thumbnail: string | null;
  modified: string;
  outputCount: number;
}

export interface ProjectDetails extends ProjectSummary {
  created: string;
  agent?: string;
  messageCount: number;
  messages: ChatMessage[];
  outputs: ProjectOutput[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  media?: { type: 'image' | 'video'; url: string }[];
}

export interface ProjectOutput {
  type: 'image' | 'video';
  filename: string;
  url: string;
  created: string;
}

// Get user's projects directory path
function getUserProjectsPath(userId: string): string {
  return path.join(DB_PATH, userId, 'projects');
}

// List all projects for a user
export async function listProjects(userId: string): Promise<ProjectSummary[]> {
  const projectsPath = getUserProjectsPath(userId);

  if (!fs.existsSync(projectsPath)) {
    return [];
  }

  const entries = fs.readdirSync(projectsPath, { withFileTypes: true });
  const projects: ProjectSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const projectPath = path.join(projectsPath, entry.name);
    const manifestPath = path.join(projectPath, 'manifest.json');

    let manifest: Partial<ProjectManifest> = {};

    // Try to read manifest
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      } catch (e) {
        // Invalid manifest, will use defaults
      }
    }

    // Get folder stats for fallback modified time
    const stats = fs.statSync(projectPath);

    // Count outputs if not in manifest
    let outputCount = manifest.outputCount || 0;
    const outputsPath = path.join(projectPath, 'outputs');
    if (outputCount === 0 && fs.existsSync(outputsPath)) {
      try {
        const files = fs.readdirSync(outputsPath);
        outputCount = files.filter(f => /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i.test(f)).length;
      } catch (e) {
        // Ignore errors
      }
    }

    // Find thumbnail
    let thumbnail: string | null = null;
    if (manifest.thumbnail) {
      const thumbPath = path.join(projectPath, manifest.thumbnail);
      if (fs.existsSync(thumbPath)) {
        thumbnail = `/api/files/${userId}/projects/${entry.name}/${manifest.thumbnail}`;
      }
    }

    // If no thumbnail in manifest, try to find latest image
    if (!thumbnail && fs.existsSync(outputsPath)) {
      try {
        const files = fs.readdirSync(outputsPath)
          .filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f))
          .map(f => ({
            name: f,
            time: fs.statSync(path.join(outputsPath, f)).mtime.getTime()
          }))
          .sort((a, b) => b.time - a.time);

        if (files.length > 0) {
          thumbnail = `/api/files/${userId}/projects/${entry.name}/outputs/${files[0].name}`;
        }
      } catch (e) {
        // Ignore errors
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

  // Sort by modified date, newest first
  projects.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

  return projects;
}

// Get project details including chat history
export async function getProjectDetails(userId: string, projectId: string): Promise<ProjectDetails | null> {
  const projectPath = path.join(getUserProjectsPath(userId), projectId);

  if (!fs.existsSync(projectPath)) {
    return null;
  }

  // Get summary first
  const projects = await listProjects(userId);
  const summary = projects.find(p => p.id === projectId);

  if (!summary) {
    return null;
  }

  // Read manifest for additional details
  const manifestPath = path.join(projectPath, 'manifest.json');
  let manifest: Partial<ProjectManifest> = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (e) {
      // Ignore
    }
  }

  // Load chat history from savepoints
  const messages = await loadChatHistory(projectPath);

  // Load outputs
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

// Create a new project
export async function createProject(userId: string, name: string): Promise<string> {
  const projectsPath = getUserProjectsPath(userId);

  // Ensure projects directory exists
  if (!fs.existsSync(projectsPath)) {
    fs.mkdirSync(projectsPath, { recursive: true });
  }

  // Generate project ID
  const projectId = `project-${Date.now()}`;
  const projectPath = path.join(projectsPath, projectId);

  // Create project folder structure
  fs.mkdirSync(projectPath);
  fs.mkdirSync(path.join(projectPath, 'chats'));
  fs.mkdirSync(path.join(projectPath, 'outputs'));
  fs.mkdirSync(path.join(projectPath, 'savepoints'));

  // Create manifest
  const manifest: ProjectManifest = {
    id: projectId,
    name,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    messageCount: 0,
    outputCount: 0
  };

  fs.writeFileSync(
    path.join(projectPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  return projectId;
}

// Rename a project
export async function renameProject(userId: string, projectId: string, name: string): Promise<boolean> {
  const projectPath = path.join(getUserProjectsPath(userId), projectId);
  const manifestPath = path.join(projectPath, 'manifest.json');

  if (!fs.existsSync(projectPath)) {
    return false;
  }

  let manifest: Partial<ProjectManifest> = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (e) {
      // Start fresh
    }
  }

  manifest.name = name;
  manifest.modified = new Date().toISOString();

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  return true;
}

// Update project manifest (called after n8n generates output)
export async function updateProjectManifest(
  userId: string,
  projectId: string,
  updates: Partial<ProjectManifest>
): Promise<boolean> {
  const projectPath = path.join(getUserProjectsPath(userId), projectId);
  const manifestPath = path.join(projectPath, 'manifest.json');

  if (!fs.existsSync(projectPath)) {
    return false;
  }

  let manifest: Partial<ProjectManifest> = { id: projectId };
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (e) {
      // Start fresh
    }
  }

  // Merge updates
  manifest = { ...manifest, ...updates, modified: new Date().toISOString() };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  return true;
}

// Helper: Load chat history from multiple sources
async function loadChatHistory(projectPath: string): Promise<ChatMessage[]> {
  const messages: ChatMessage[] = [];

  // 1. FIRST: Try Astrix sync (most reliable - auto-synced from chat)
  const astrixPath = path.join(projectPath, 'astrix', 'messages.json');
  if (fs.existsSync(astrixPath)) {
    try {
      const astrixData = JSON.parse(fs.readFileSync(astrixPath, 'utf-8'));
      if (astrixData.messages && Array.isArray(astrixData.messages)) {
        for (const msg of astrixData.messages) {
          messages.push({
            role: msg.role || 'assistant',
            content: msg.content || '',
            timestamp: msg.timestamp || new Date().toISOString(),
            media: msg.mediaUrls ? msg.mediaUrls.map((url: string) => ({
              type: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
              url
            })) : undefined
          });
        }
      }
    } catch (e) {
      // Continue to fallbacks
    }
  }

  // If astrix has messages, use those
  if (messages.length > 0) {
    return messages;
  }

  // 2. FALLBACK: Try savepoints
  const savepointsPath = path.join(projectPath, 'savepoints');
  if (fs.existsSync(savepointsPath)) {
    try {
      const files = fs.readdirSync(savepointsPath)
        .filter(f => f.endsWith('.json'))
        .sort();

      for (const file of files) {
        try {
          const savepoint = JSON.parse(
            fs.readFileSync(path.join(savepointsPath, file), 'utf-8')
          );

          if (savepoint.messages && Array.isArray(savepoint.messages)) {
            for (const msg of savepoint.messages) {
              messages.push({
                role: msg.role || (msg.type === 'human' ? 'user' : 'assistant'),
                content: msg.content || msg.text || '',
                timestamp: msg.timestamp || savepoint.timestamp || new Date().toISOString(),
                media: msg.media
              });
            }
          }

          if (savepoint.downloads && Array.isArray(savepoint.downloads)) {
            const lastAssistant = messages.filter(m => m.role === 'assistant').pop();
            if (lastAssistant) {
              lastAssistant.media = savepoint.downloads.map((d: any) => ({
                type: d.type || (d.url?.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'),
                url: d.url || d.path
              }));
            }
          }
        } catch (e) {
          // Skip invalid savepoint
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }

  // 3. FALLBACK: Try conversation.txt
  if (messages.length === 0) {
    const chatPath = path.join(projectPath, 'chats', 'conversation.txt');
    if (fs.existsSync(chatPath)) {
      try {
        const content = fs.readFileSync(chatPath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim());

        for (const line of lines) {
          const match = line.match(/^\[([^\]]+)\]\s*(User|Assistant|AI|CHIP):\s*(.+)$/i);
          if (match) {
            messages.push({
              role: match[2].toLowerCase() === 'user' ? 'user' : 'assistant',
              content: match[3],
              timestamp: new Date(match[1]).toISOString()
            });
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }

  return messages;
}

// Helper: Load outputs from project folder
async function loadOutputs(userId: string, projectId: string, projectPath: string): Promise<ProjectOutput[]> {
  const outputs: ProjectOutput[] = [];
  const outputsPath = path.join(projectPath, 'outputs');

  if (!fs.existsSync(outputsPath)) {
    return outputs;
  }

  try {
    const files = fs.readdirSync(outputsPath)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i.test(f));

    for (const file of files) {
      const filePath = path.join(outputsPath, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();

      outputs.push({
        type: ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'image',
        filename: file,
        url: `/api/files/${userId}/projects/${projectId}/outputs/${file}`,
        created: stats.mtime.toISOString()
      });
    }

    // Sort by created date, newest first
    outputs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  } catch (e) {
    // Ignore errors
  }

  return outputs;
}

// Helper: Format project ID into readable name
function formatProjectName(projectId: string): string {
  // "mcp-session-1766824235215" -> "Session Dec 28"
  // "project-1766824235215" -> "Project Dec 28"

  const match = projectId.match(/(\d{13})/);
  if (match) {
    const date = new Date(parseInt(match[1]));
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();

    if (projectId.startsWith('mcp-session')) {
      return `Session ${month} ${day}`;
    }
    return `Project ${month} ${day}`;
  }

  // Clean up the ID for display
  return projectId
    .replace(/^(mcp-session-|project-)/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}
