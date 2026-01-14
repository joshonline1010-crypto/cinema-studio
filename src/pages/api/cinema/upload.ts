import type { APIRoute } from 'astro';

// IMGBB API key (free tier - get one at https://api.imgbb.com/)
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '5c0b9d9e7c5d4f8e9a1b2c3d4e5f6789'; // Placeholder - replace with real key

// Convert File to base64
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Try Catbox upload
async function uploadToCatbox(file: File): Promise<string | null> {
  try {
    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'fileupload');
    catboxForm.append('fileToUpload', file, file.name);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxForm,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const url = await response.text();
    if (url && url.startsWith('https://')) {
      console.log('[Upload] Catbox SUCCESS:', url.trim());
      return url.trim();
    }
    return null;
  } catch (error) {
    console.log('[Upload] Catbox FAILED:', error instanceof Error ? error.message : 'timeout');
    return null;
  }
}

// Try 0x0.st upload (NO API KEY REQUIRED - completely free)
async function uploadTo0x0(file: File): Promise<string | null> {
  try {
    console.log('[Upload] Trying 0x0.st (free, no key)...');
    const formData = new FormData();
    formData.append('file', file, file.name);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch('https://0x0.st', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const url = await response.text();
    if (url && url.trim().startsWith('http')) {
      console.log('[Upload] 0x0.st SUCCESS:', url.trim());
      return url.trim();
    }
    console.log('[Upload] 0x0.st response:', url);
    return null;
  } catch (error) {
    console.log('[Upload] 0x0.st FAILED:', error instanceof Error ? error.message : 'timeout');
    return null;
  }
}

// Try imgbb upload (fallback - needs API key)
async function uploadToImgbb(file: File): Promise<string | null> {
  // Skip if no real API key
  if (!IMGBB_API_KEY || IMGBB_API_KEY.includes('placeholder') || IMGBB_API_KEY === 'YOUR_KEY_HERE') {
    console.log('[Upload] imgbb skipped - no API key configured');
    return null;
  }

  try {
    console.log('[Upload] Trying imgbb fallback...');
    const base64 = await fileToBase64(file);

    const formData = new FormData();
    formData.append('image', base64);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success && data.data?.url) {
      console.log('[Upload] imgbb SUCCESS:', data.data.url);
      return data.data.url;
    }
    console.log('[Upload] imgbb response:', data);
    return null;
  } catch (error) {
    console.log('[Upload] imgbb FAILED:', error instanceof Error ? error.message : 'unknown');
    return null;
  }
}

// Proxy upload - tries multiple hosts until one works
// Order: Catbox → 0x0.st (free) → imgbb (if key configured)
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

    // Try Catbox first
    console.log('[Upload] Trying Catbox...');
    let url = await uploadToCatbox(file);

    // If Catbox fails, try 0x0.st (free, no key needed)
    if (!url) {
      console.log('[Upload] Catbox failed, trying 0x0.st...');
      url = await uploadTo0x0(file);
    }

    // If 0x0.st fails too, try imgbb (needs API key)
    if (!url) {
      console.log('[Upload] 0x0.st failed, trying imgbb...');
      url = await uploadToImgbb(file);
    }

    if (url) {
      return new Response(JSON.stringify({
        success: true,
        url: url
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        error: 'All upload methods failed',
        details: 'Catbox, 0x0.st, and imgbb all failed. Check network connection.'
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
