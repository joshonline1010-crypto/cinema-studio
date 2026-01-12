export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Uploading to Catbox:", file.name, file.size, "bytes");
    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", file, file.name);
    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxForm
    });
    const url = await response.text();
    console.log("Catbox response:", url);
    if (url && url.startsWith("https://")) {
      return new Response(JSON.stringify({
        success: true,
        url: url.trim()
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({
        error: "Upload failed",
        details: url
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({
      error: "Upload failed",
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
