import type { APIRoute } from 'astro';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

// Upload to Catbox
async function uploadToCatbox(filePath: string): Promise<string> {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  formData.append('fileToUpload', blob, path.basename(filePath));

  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData
  });

  const url = await response.text();
  if (!url.startsWith('https://')) {
    throw new Error('Catbox upload failed: ' + url);
  }

  return url;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { video_url, position = 'last' } = body;

    if (!video_url) {
      return new Response(JSON.stringify({ error: 'video_url required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Extracting frame from:', video_url, 'position:', position);

    // Create temp directory
    const tempDir = path.join(os.tmpdir(), 'cinema-frames');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download video
    const videoResponse = await fetch(video_url);
    if (!videoResponse.ok) {
      throw new Error('Failed to download video');
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    const videoPath = path.join(tempDir, `video_${Date.now()}.mp4`);
    const framePath = path.join(tempDir, `frame_${Date.now()}.jpg`);

    fs.writeFileSync(videoPath, videoBuffer);

    // Extract frame using ffmpeg
    // -sseof -0.1 = seek to 0.1 seconds before end (last frame)
    // -sseof -0.5 = seek to 0.5 seconds before end (more reliable)
    const ffmpegCommand = position === 'last'
      ? `ffmpeg -sseof -0.1 -i "${videoPath}" -frames:v 1 -q:v 2 "${framePath}" -y`
      : `ffmpeg -ss 0 -i "${videoPath}" -frames:v 1 -q:v 2 "${framePath}" -y`;

    await execAsync(ffmpegCommand);

    if (!fs.existsSync(framePath)) {
      throw new Error('Frame extraction failed');
    }

    // Upload to catbox
    const frameUrl = await uploadToCatbox(framePath);

    // Cleanup
    fs.unlinkSync(videoPath);
    fs.unlinkSync(framePath);

    console.log('Extracted frame:', frameUrl);

    return new Response(JSON.stringify({
      success: true,
      frame_url: frameUrl,
      position
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Frame extraction error:', error);
    return new Response(JSON.stringify({
      error: 'Frame extraction failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
