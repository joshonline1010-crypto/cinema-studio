import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../lib/cookies';
import { findSessionById } from '../../../lib/db';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = 'C:/Users/yodes/Documents/n8n/db/users';

interface CreativePreferences {
  character_ref?: {
    url: string;
    name: string;
    uploaded: string;
  };
  background_ref?: {
    url: string;
    name: string;
    uploaded: string;
  };
  style_preset?: {
    id: string;
    name: string;
    category: string;
    description?: string;
  };
}

async function loadPreferences(userId: string): Promise<CreativePreferences> {
  try {
    const prefsPath = path.join(DB_PATH, userId, 'creative_preferences.json');
    const data = fs.readFileSync(prefsPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function savePreferences(userId: string, prefs: CreativePreferences): Promise<void> {
  const prefsPath = path.join(DB_PATH, userId, 'creative_preferences.json');
  fs.writeFileSync(prefsPath, JSON.stringify(prefs, null, 2));
}

export const POST: APIRoute = async ({ request, cookies }) => {
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

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const refType = formData.get('refType') as string; // 'character' or 'background'
    const refName = formData.get('name') as string || 'Unnamed';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!refType || !['character', 'background'].includes(refType)) {
      return new Response(JSON.stringify({ error: 'refType must be "character" or "background"' }), {
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

    // Create refs folder for user
    const userId = session.userId;
    const refsDir = path.join(DB_PATH, userId, 'refs', refType);

    if (!fs.existsSync(refsDir)) {
      fs.mkdirSync(refsDir, { recursive: true });
    }

    // Generate safe filename
    const ext = path.extname(file.name) || '.png';
    const baseName = refName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    const timestamp = Date.now();
    const filename = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(refsDir, filename);

    // Save file locally
    fs.writeFileSync(filePath, buffer);

    // Upload to Catbox for URL access
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
    }

    // Use catbox URL if available, otherwise create local API URL
    const finalUrl = catboxUrl || `/api/files/${userId}/refs/${refType}/${filename}`;
    const uploadDate = new Date().toISOString().split('T')[0];

    // Update preferences with new ref
    const prefs = await loadPreferences(userId);

    if (refType === 'character') {
      prefs.character_ref = {
        url: finalUrl,
        name: refName,
        uploaded: uploadDate
      };
    } else if (refType === 'background') {
      prefs.background_ref = {
        url: finalUrl,
        name: refName,
        uploaded: uploadDate
      };
    }

    await savePreferences(userId, prefs);

    return new Response(JSON.stringify({
      success: true,
      refType,
      ref: refType === 'character' ? prefs.character_ref : prefs.background_ref,
      localPath: filePath.replace(/\\/g, '/'),
      catboxUrl
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
