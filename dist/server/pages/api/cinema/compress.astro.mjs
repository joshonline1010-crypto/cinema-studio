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
  const blob = new Blob([fileBuffer], { type: "image/jpeg" });
  formData.append("fileToUpload", blob, path.basename(filePath));
  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData
  });
  const url = await response.text();
  if (!url.startsWith("https://")) {
    throw new Error("Catbox upload failed: " + url);
  }
  return url;
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { image_url } = body;
    if (!image_url) {
      return new Response(JSON.stringify({ error: "image_url required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Compressing image:", image_url);
    const tempDir = path.join(os.tmpdir(), "kling-compress");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error("Failed to download image");
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const ext = image_url.includes(".png") ? ".png" : image_url.includes(".webp") ? ".webp" : ".jpg";
    const inputPath = path.join(tempDir, `input_${Date.now()}${ext}`);
    const outputPath = path.join(tempDir, `output_${Date.now()}_kling.jpg`);
    fs.writeFileSync(inputPath, imageBuffer);
    const inputSize = fs.statSync(inputPath).size;
    console.log(`Input size: ${(inputSize / 1024 / 1024).toFixed(2)} MB`);
    try {
      const pythonScript = "C:\\Users\\yodes\\scripts\\compress_for_kling.py";
      await execAsync(`python "${pythonScript}" "${inputPath}"`);
      const expectedOutput = inputPath.replace(ext, "_kling.jpg");
      if (fs.existsSync(expectedOutput)) {
        const outputSize2 = fs.statSync(expectedOutput).size;
        console.log(`Output size: ${(outputSize2 / 1024).toFixed(0)} KB`);
        const catboxUrl2 = await uploadToCatbox(expectedOutput);
        fs.unlinkSync(inputPath);
        fs.unlinkSync(expectedOutput);
        return new Response(JSON.stringify({
          success: true,
          image_url: catboxUrl2,
          original_size: inputSize,
          compressed_size: outputSize2
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (pythonErr) {
      console.log("Python compression failed, trying ImageMagick:", pythonErr);
    }
    const magickPath = "C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe";
    await execAsync(`"${magickPath}" "${inputPath}" -resize "3840x2160>" -quality 85 "${outputPath}"`);
    if (!fs.existsSync(outputPath)) {
      throw new Error("ImageMagick compression failed");
    }
    const outputSize = fs.statSync(outputPath).size;
    console.log(`Output size: ${(outputSize / 1024).toFixed(0)} KB`);
    if (outputSize > 10 * 1024 * 1024) {
      await execAsync(`"${magickPath}" "${inputPath}" -resize "3840x2160>" -quality 70 "${outputPath}"`);
    }
    const catboxUrl = await uploadToCatbox(outputPath);
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    return new Response(JSON.stringify({
      success: true,
      image_url: catboxUrl,
      original_size: inputSize,
      compressed_size: fs.existsSync(outputPath) ? fs.statSync(outputPath).size : outputSize
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Compression error:", error);
    return new Response(JSON.stringify({
      error: "Compression failed",
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
