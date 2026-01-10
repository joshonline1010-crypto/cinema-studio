import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../lib/cookies';
import { findSessionById } from '../../lib/db';

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

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get file bytes
    const bytes = await file.arrayBuffer();

    // Upload to Catbox (simple, reliable, no auth needed)
    const catboxFormData = new FormData();
    catboxFormData.append('reqtype', 'fileupload');
    catboxFormData.append('fileToUpload', new Blob([bytes], { type: file.type }), file.name);

    const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxFormData,
    });

    if (!catboxResponse.ok) {
      throw new Error('Catbox upload failed: ' + catboxResponse.statusText);
    }

    const catboxUrl = await catboxResponse.text();

    return new Response(JSON.stringify({
      success: true,
      url: catboxUrl.trim(),
      name: file.name
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
