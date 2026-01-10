import { g as getSessionCookie, f as findSessionById } from '../../../../chunks/db_CvyCu46H.mjs';
import * as fs from 'fs';
import * as path from 'path';
export { renderers } from '../../../../renderers.mjs';

const DB_PATH = "C:/Users/yodes/Documents/n8n/db/users";
const POST = async ({ request, cookies, params }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const refType = formData.get("refType") || "general";
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file type. Only images allowed." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const userId = session.userId;
    const refsDir = path.join(DB_PATH, userId, "projects", projectId, "refs");
    let targetDir = refsDir;
    if (refType !== "general") {
      targetDir = path.join(refsDir, refType);
    }
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const ext = path.extname(file.name) || ".png";
    const baseName = file.name.replace(ext, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
    const timestamp = Date.now();
    const filename = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);
    let catboxUrl = null;
    try {
      const catboxFormData = new FormData();
      catboxFormData.append("reqtype", "fileupload");
      catboxFormData.append("fileToUpload", new Blob([bytes], { type: file.type }), file.name);
      const catboxResponse = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: catboxFormData
      });
      if (catboxResponse.ok) {
        catboxUrl = (await catboxResponse.text()).trim();
      }
    } catch (e) {
      console.error("Catbox upload failed:", e);
    }
    return new Response(JSON.stringify({
      success: true,
      filename,
      localPath: filePath.replace(/\\/g, "/"),
      url: catboxUrl,
      refType,
      projectId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({
      error: "Upload failed",
      details: String(error)
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
