import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
export { renderers } from '../../../renderers.mjs';

const execAsync = promisify(exec);
async function uploadToCatbox(filePath) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: "video/mp4" });
  formData.append("fileToUpload", blob, path.basename(filePath));
  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData
  });
  const url = await response.text();
  if (!url.startsWith("https://")) {
    throw new Error("Catbox upload failed: " + url);
  }
  return url.trim();
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { videos } = body;
    if (!videos || !Array.isArray(videos) || videos.length < 2) {
      return new Response(JSON.stringify({ error: "At least 2 video URLs required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Stitching videos:", videos);
    const tempDir = path.join(os.tmpdir(), "cinema-stitch");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const timestamp = Date.now();
    const videoPaths = [];
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
    const concatFilePath = path.join(tempDir, `concat_${timestamp}.txt`);
    const concatContent = videoPaths.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n");
    fs.writeFileSync(concatFilePath, concatContent);
    const outputPath = path.join(tempDir, `stitched_${timestamp}.mp4`);
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputPath}" -y`;
    console.log("Running ffmpeg:", ffmpegCommand);
    await execAsync(ffmpegCommand);
    if (!fs.existsSync(outputPath)) {
      throw new Error("FFmpeg concat failed");
    }
    const outputSize = fs.statSync(outputPath).size;
    console.log(`Stitched video size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log("Uploading stitched video...");
    const uploadUrl = await uploadToCatbox(outputPath);
    console.log("Uploaded:", uploadUrl);
    for (const videoPath of videoPaths) {
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }
    if (fs.existsSync(concatFilePath)) fs.unlinkSync(concatFilePath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    return new Response(JSON.stringify({
      success: true,
      video_url: uploadUrl,
      video_count: videos.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Stitch error:", error);
    return new Response(JSON.stringify({
      error: "Video stitch failed",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
