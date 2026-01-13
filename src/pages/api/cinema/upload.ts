import type { APIRoute } from 'astro';

// Proxy upload to Catbox to avoid CORS issues
export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[Upload] Received upload request');
    const formData = await request.formData();
    console.log('[Upload] FormData keys:', [...formData.keys()]);
    const file = formData.get('file') as File;

    if (!file) {
      console.log('[Upload] ERROR: No file in formData');
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[Upload] File received:', file.name, file.size, 'bytes, type:', file.type);
    console.log('[Upload] Uploading to Catbox...');

    // Create form data for Catbox
    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'fileupload');
    catboxForm.append('fileToUpload', file, file.name);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxForm
    });

    const url = await response.text();
    console.log('Catbox response:', url);

    if (url && url.startsWith('https://')) {
      return new Response(JSON.stringify({
        success: true,
        url: url.trim()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        error: 'Upload failed',
        details: url
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
