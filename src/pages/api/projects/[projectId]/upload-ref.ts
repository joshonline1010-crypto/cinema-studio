import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../../lib/cookies';
import { findSessionById } from '../../../../lib/db';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = 'C:/Users/yodes/Documents/n8n/db/users';

export const POST: APIRoute = async ({ request, cookies, params }) => {
  // Verify authentication
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session expired' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: 'Project ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const refType = formData.get('refType') as string || 'general';  // character, background, prop, general

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Only images allowed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine refs folder path
    const userId = session.userId;
    const refsDir = path.join(DB_PATH, userId, 'projects', projectId, 'refs');

    // Create refs subfolder based on type
    let targetDir = refsDir;
    if (refType !== 'general') {
      targetDir = path.join(refsDir, refType);
    }

    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Generate safe filename
    const ext = path.extname(file.name) || '.png';
    const baseName = file.name.replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const timestamp = Date.now();
    const filename = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(targetDir, filename);

    // Save file locally
    fs.writeFileSync(filePath, buffer);

    // Also upload to Catbox for URL access
    let catboxUrl = null;
    try {
      const catboxFormData = new FormData();
      catboxFormData.append('reqtype', 'fileupload');
      catboxFormData.append('fileToUpload', new Blob([bytes], { type: file.type }), file.name);

      const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catboxFormData,
      });

      if (catboxResponse.ok) {
        catboxUrl = (await catboxResponse.text()).trim();
      }
    } catch (e) {
      console.error('Catbox upload failed:', e);
      // Continue without catbox URL
    }

    return new Response(JSON.stringify({
      success: true,
      filename: filename,
      localPath: filePath.replace(/\\/g, '/'),
      url: catboxUrl,
      refType: refType,
      projectId: projectId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      details: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
