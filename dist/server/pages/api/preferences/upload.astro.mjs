import { g as getSessionCookie, f as findSessionById } from '../../../chunks/db_CvyCu46H.mjs';
import * as fs from 'fs';
import * as path from 'path';
export { renderers } from '../../../renderers.mjs';

const DB_PATH = "C:/Users/yodes/Documents/n8n/db/users";
async function loadPreferences(userId) {
  try {
    const prefsPath = path.join(DB_PATH, userId, "creative_preferences.json");
    const data = fs.readFileSync(prefsPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}
async function savePreferences(userId, prefs) {
  const prefsPath = path.join(DB_PATH, userId, "creative_preferences.json");
  fs.writeFileSync(prefsPath, JSON.stringify(prefs, null, 2));
}
const POST = async ({ request, cookies }) => {
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
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const refType = formData.get("refType");
    const refName = formData.get("name") || "Unnamed";
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!refType || !["character", "background"].includes(refType)) {
      return new Response(JSON.stringify({ error: 'refType must be "character" or "background"' }), {
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
    const refsDir = path.join(DB_PATH, userId, "refs", refType);
    if (!fs.existsSync(refsDir)) {
      fs.mkdirSync(refsDir, { recursive: true });
    }
    const ext = path.extname(file.name) || ".png";
    const baseName = refName.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
    const timestamp = Date.now();
    const filename = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(refsDir, filename);
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
    const finalUrl = catboxUrl || `/api/files/${userId}/refs/${refType}/${filename}`;
    const uploadDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const prefs = await loadPreferences(userId);
    if (refType === "character") {
      prefs.character_ref = {
        url: finalUrl,
        name: refName,
        uploaded: uploadDate
      };
    } else if (refType === "background") {
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
      ref: refType === "character" ? prefs.character_ref : prefs.background_ref,
      localPath: filePath.replace(/\\/g, "/"),
      catboxUrl
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
