import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

// Point to n8n's db folder (one level up from video-studio)
const DB_PATH = path.join(process.cwd(), '..', 'db', 'users');

// POST /api/projects/migrate - Add manifests to existing projects
export const POST: APIRoute = async () => {
  const results: { projectId: string; status: string }[] = [];

  try {
    // Get all user directories
    if (!fs.existsSync(DB_PATH)) {
      return new Response(JSON.stringify({
        message: 'No users directory found',
        results: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const users = fs.readdirSync(DB_PATH, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const userId of users) {
      const projectsPath = path.join(DB_PATH, userId, 'projects');

      if (!fs.existsSync(projectsPath)) continue;

      const projects = fs.readdirSync(projectsPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const projectId of projects) {
        const projectPath = path.join(projectsPath, projectId);
        const manifestPath = path.join(projectPath, 'manifest.json');

        // Skip if manifest already exists
        if (fs.existsSync(manifestPath)) {
          results.push({ projectId, status: 'already_has_manifest' });
          continue;
        }

        try {
          // Get folder stats
          const stats = fs.statSync(projectPath);

          // Count outputs
          let outputCount = 0;
          let thumbnail: string | null = null;
          const outputsPath = path.join(projectPath, 'outputs');

          if (fs.existsSync(outputsPath)) {
            const files = fs.readdirSync(outputsPath)
              .filter(f => /\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i.test(f))
              .map(f => ({
                name: f,
                time: fs.statSync(path.join(outputsPath, f)).mtime.getTime()
              }))
              .sort((a, b) => b.time - a.time);

            outputCount = files.length;

            // Find latest image for thumbnail
            const latestImage = files.find(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name));
            if (latestImage) {
              thumbnail = `outputs/${latestImage.name}`;
            }
          }

          // Count messages
          let messageCount = 0;
          const chatsPath = path.join(projectPath, 'chats');
          if (fs.existsSync(chatsPath)) {
            const chatFiles = fs.readdirSync(chatsPath).filter(f => f.endsWith('.json'));
            messageCount = chatFiles.length;
          }

          // Generate name from project ID
          let name = 'Unnamed Project';
          const match = projectId.match(/(\d{13})/);
          if (match) {
            const date = new Date(parseInt(match[1]));
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            name = projectId.startsWith('mcp-session') ? `Session ${month} ${day}` : `Project ${month} ${day}`;
          }

          // Create manifest
          const manifest = {
            id: projectId,
            name,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            agent: 'chip-agent-v2',
            thumbnail,
            messageCount,
            outputCount
          };

          fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
          results.push({ projectId, status: 'created' });

        } catch (error) {
          results.push({ projectId, status: `error: ${String(error)}` });
        }
      }
    }

    const created = results.filter(r => r.status === 'created').length;
    const existing = results.filter(r => r.status === 'already_has_manifest').length;
    const errors = results.filter(r => r.status.startsWith('error')).length;

    return new Response(JSON.stringify({
      message: `Migration complete: ${created} created, ${existing} already had manifests, ${errors} errors`,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Migration error:', error);
    return new Response(JSON.stringify({
      error: 'Migration failed',
      details: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
