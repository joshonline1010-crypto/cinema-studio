import type { APIRoute } from 'astro';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

// Get Downloads folder path
function getDownloadsFolder(): string {
  const home = os.homedir();
  return path.join(home, 'Downloads');
}

// Upload to Catbox (optional, for sharing)
async function uploadToCatbox(filePath: string): Promise<string> {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'video/mp4' });
  formData.append('fileToUpload', blob, path.basename(filePath));

  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData
  });

  const url = await response.text();
  if (!url.startsWith('https://')) {
    throw new Error('Catbox upload failed: ' + url);
  }

  return url.trim();
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      videos,
      voiceover_url,           // Optional voiceover audio URL
      voiceover_volume = 1.0,  // Voiceover volume (1.0 = normal, 1.5 = 50% louder)
      video_volume = 0.3,      // Video audio volume (0.3 = 30% = quieter background)
      uploadToCloud = true
    } = body;

    if (!videos || !Array.isArray(videos) || videos.length < 2) {
      return new Response(JSON.stringify({ error: 'At least 2 video URLs required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Stitching videos:', videos);
    console.log('Voiceover:', voiceover_url ? 'YES' : 'NO');

    // Create temp directory
    const tempDir = path.join(os.tmpdir(), 'cinema-stitch');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const videoPaths: string[] = [];

    // Download all videos
    for (let i = 0; i < videos.length; i++) {
      const videoUrl = videos[i];
      console.log(`Downloading video ${i + 1}/${videos.length}: ${videoUrl}`);

      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video ${i + 1}`);
      }

      const videoBuffer = Buffer.from(await response.arrayBuffer());
      const videoPath = path.join(tempDir, `video_${timestamp}_${i}.mp4`);
      fs.writeFileSync(videoPath, videoBuffer);
      videoPaths.push(videoPath);
    }

    // Create concat file for ffmpeg
    const concatFilePath = path.join(tempDir, `concat_${timestamp}.txt`);
    const concatContent = videoPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(concatFilePath, concatContent);

    // Temp output path for concat
    const concatOutputPath = path.join(tempDir, `concat_${timestamp}.mp4`);

    // STEP 1: Concat all videos (fast, just copy streams)
    const concatCommand = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy "${concatOutputPath}" -y`;
    console.log('Running ffmpeg concat:', concatCommand);
    await execAsync(concatCommand);

    if (!fs.existsSync(concatOutputPath)) {
      throw new Error('FFmpeg concat failed');
    }

    // STEP 2: Re-encode to 1080p 60fps (with optional voiceover mixing)
    // Save directly to Downloads folder
    const downloadsFolder = getDownloadsFolder();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
    const finalFileName = `CinemaStudio_${dateStr}_${timeStr}.mp4`;
    const finalOutputPath = path.join(downloadsFolder, finalFileName);

    let encodeCommand: string;

    if (voiceover_url) {
      // Download voiceover audio
      console.log('Downloading voiceover audio...');
      const voiceoverPath = path.join(tempDir, `voiceover_${timestamp}.mp3`);
      const voiceResponse = await fetch(voiceover_url);
      if (!voiceResponse.ok) {
        throw new Error('Failed to download voiceover audio');
      }
      const voiceBuffer = Buffer.from(await voiceResponse.arrayBuffer());
      fs.writeFileSync(voiceoverPath, voiceBuffer);

      // Re-encode with audio mixing: voiceover LOUDER, video audio QUIETER
      // Uses amix filter: [video_audio * video_volume] + [voiceover * voiceover_volume]
      encodeCommand = `ffmpeg -i "${concatOutputPath}" -i "${voiceoverPath}" -filter_complex "[0:a]volume=${video_volume}[va];[1:a]volume=${voiceover_volume}[voa];[va][voa]amix=inputs=2:duration=longest[aout]" -map 0:v -map "[aout]" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -r 60 -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k "${finalOutputPath}" -y`;
      console.log('Running ffmpeg encode with voiceover mixing (1080p 60fps)...');
    } else {
      // Re-encode without voiceover: just video with original audio
      encodeCommand = `ffmpeg -i "${concatOutputPath}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -r 60 -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k "${finalOutputPath}" -y`;
      console.log('Running ffmpeg encode (1080p 60fps)...');
    }

    await execAsync(encodeCommand);

    if (!fs.existsSync(finalOutputPath)) {
      throw new Error('FFmpeg encode failed');
    }

    const outputSize = fs.statSync(finalOutputPath).size;
    console.log(`Final video: ${finalOutputPath}`);
    console.log(`Size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);

    // Upload to Catbox (optional)
    let uploadUrl: string | null = null;
    if (uploadToCloud) {
      console.log('Uploading to Catbox...');
      try {
        uploadUrl = await uploadToCatbox(finalOutputPath);
        console.log('Uploaded:', uploadUrl);
      } catch (err) {
        console.error('Catbox upload failed (video saved locally):', err);
      }
    }

    // Cleanup temp files (keep the final output in Downloads!)
    for (const videoPath of videoPaths) {
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }
    if (fs.existsSync(concatFilePath)) fs.unlinkSync(concatFilePath);
    if (fs.existsSync(concatOutputPath)) fs.unlinkSync(concatOutputPath);

    return new Response(JSON.stringify({
      success: true,
      video_url: uploadUrl,
      local_path: finalOutputPath,
      file_name: finalFileName,
      video_count: videos.length,
      resolution: '1920x1080',
      fps: 60,
      has_voiceover: !!voiceover_url,
      audio_mix: voiceover_url ? `voiceover: ${voiceover_volume}x, video: ${video_volume}x` : 'video audio only'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Stitch error:', error);
    return new Response(JSON.stringify({
      error: 'Video stitch failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
