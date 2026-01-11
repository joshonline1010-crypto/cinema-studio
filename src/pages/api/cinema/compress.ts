import type { APIRoute } from 'astro';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

// Catbox upload for compressed images with retry
async function uploadToCatbox(filePath: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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

      // Check for valid URL
      if (url && url.startsWith('https://')) {
        return url.trim();
      }

      // Log the actual response for debugging
      console.log(`Catbox attempt ${attempt} response:`, url);

      if (attempt < retries) {
        console.log(`Retrying catbox upload... (${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, 1000 * attempt)); // Wait longer each retry
      }
    } catch (err) {
      console.error(`Catbox attempt ${attempt} error:`, err);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error('Catbox upload failed after ' + retries + ' attempts');
}

// Litterbox upload (temporary, 1 hour expiry) - MORE RELIABLE than Catbox
async function uploadToLitterbox(filePath: string): Promise<string> {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('time', '1h');

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  formData.append('fileToUpload', blob, path.basename(filePath));

  const response = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
    method: 'POST',
    body: formData
  });

  const url = await response.text();
  console.log('Litterbox response:', url);

  if (!url || !url.startsWith('https://')) {
    throw new Error('Litterbox upload failed: ' + url);
  }

  return url.trim();
}

// Smart upload - tries Litterbox first (more reliable), then Catbox
async function uploadCompressedImage(filePath: string): Promise<string> {
  // Try Litterbox first (temporary but more reliable)
  try {
    console.log('Trying Litterbox upload...');
    const url = await uploadToLitterbox(filePath);
    console.log('Litterbox upload success:', url);
    return url;
  } catch (err) {
    console.log('Litterbox failed, trying Catbox:', err);
  }

  // Fallback to Catbox
  try {
    console.log('Trying Catbox upload...');
    const url = await uploadToCatbox(filePath, 2);
    console.log('Catbox upload success:', url);
    return url;
  } catch (err) {
    console.log('Catbox also failed:', err);
    throw new Error('All upload methods failed');
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      return new Response(JSON.stringify({ error: 'image_url required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Compressing image:', image_url);

    // Create temp directory
    const tempDir = path.join(os.tmpdir(), 'kling-compress');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download image
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image');
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const ext = image_url.includes('.png') ? '.png' : image_url.includes('.webp') ? '.webp' : '.jpg';
    const inputPath = path.join(tempDir, `input_${Date.now()}${ext}`);
    const outputPath = path.join(tempDir, `output_${Date.now()}_kling.jpg`);

    fs.writeFileSync(inputPath, imageBuffer);
    const inputSize = fs.statSync(inputPath).size;

    console.log(`Input size: ${(inputSize / 1024 / 1024).toFixed(2)} MB`);

    // Try Python script first (more reliable)
    try {
      const pythonScript = 'C:\\Users\\yodes\\scripts\\compress_for_kling.py';
      await execAsync(`python "${pythonScript}" "${inputPath}"`);

      // Find output file
      const expectedOutput = inputPath.replace(ext, '_kling.jpg');
      if (fs.existsSync(expectedOutput)) {
        const outputSize = fs.statSync(expectedOutput).size;
        console.log(`Output size: ${(outputSize / 1024).toFixed(0)} KB`);

        // Smart upload (Litterbox first, then Catbox)
        const uploadUrl = await uploadCompressedImage(expectedOutput);

        // Cleanup
        fs.unlinkSync(inputPath);
        fs.unlinkSync(expectedOutput);

        return new Response(JSON.stringify({
          success: true,
          image_url: uploadUrl,
          original_size: inputSize,
          compressed_size: outputSize
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (pythonErr) {
      console.log('Python compression failed, trying ImageMagick:', pythonErr);
    }

    // Fallback to ImageMagick
    const magickPath = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';
    await execAsync(`"${magickPath}" "${inputPath}" -resize "3840x2160>" -quality 85 "${outputPath}"`);

    if (!fs.existsSync(outputPath)) {
      throw new Error('ImageMagick compression failed');
    }

    const outputSize = fs.statSync(outputPath).size;
    console.log(`Output size: ${(outputSize / 1024).toFixed(0)} KB`);

    // If still over 10MB, reduce quality
    if (outputSize > 10 * 1024 * 1024) {
      await execAsync(`"${magickPath}" "${inputPath}" -resize "3840x2160>" -quality 70 "${outputPath}"`);
    }

    // Smart upload (Litterbox first, then Catbox)
    const catboxUrl = await uploadCompressedImage(outputPath);

    // Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return new Response(JSON.stringify({
      success: true,
      image_url: catboxUrl,
      original_size: inputSize,
      compressed_size: fs.existsSync(outputPath) ? fs.statSync(outputPath).size : outputSize
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Compression error:', error);
    return new Response(JSON.stringify({
      error: 'Compression failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
