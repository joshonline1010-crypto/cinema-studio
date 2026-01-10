import { g as getSessionCookie, f as findSessionById } from '../../chunks/db_CvyCu46H.mjs';
import fs from 'fs/promises';
export { renderers } from '../../renderers.mjs';

const PROMPT_DATABASE_PATH = "C:/Users/yodes/Documents/n8n/Astrix/prompts/PROMPT_DATABASE.json";
const CATEGORY_LABELS = {
  consistency: "Character Consistency",
  shot_type: "Shot Types",
  style: "Visual Styles",
  lighting: "Lighting",
  action: "Actions",
  emotion: "Emotions",
  environment: "Environments",
  effect: "Effects"
};
const GET = async ({ cookies }) => {
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
    const data = await fs.readFile(PROMPT_DATABASE_PATH, "utf-8");
    const database = JSON.parse(data);
    const categoryMap = /* @__PURE__ */ new Map();
    for (const prompt of database.prompts) {
      const category = prompt.category || "other";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push({
        id: prompt.id,
        name: prompt.name,
        category,
        description: prompt.chip_variant || prompt.template,
        tags: prompt.tags || []
      });
    }
    const categories = [];
    const categoryOrder = ["style", "lighting", "shot_type", "emotion", "environment", "effect", "action", "consistency"];
    for (const categoryId of categoryOrder) {
      const styles = categoryMap.get(categoryId);
      if (styles && styles.length > 0) {
        categories.push({
          id: categoryId,
          name: CATEGORY_LABELS[categoryId] || categoryId,
          description: database.categories[categoryId] || "",
          styles: styles.sort((a, b) => a.name.localeCompare(b.name))
        });
      }
    }
    for (const [categoryId, styles] of categoryMap) {
      if (!categoryOrder.includes(categoryId) && styles.length > 0) {
        categories.push({
          id: categoryId,
          name: CATEGORY_LABELS[categoryId] || categoryId,
          description: database.categories[categoryId] || "",
          styles: styles.sort((a, b) => a.name.localeCompare(b.name))
        });
      }
    }
    return new Response(JSON.stringify({
      categories,
      totalStyles: database.prompts.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error loading styles:", error);
    return new Response(JSON.stringify({ error: "Failed to load styles" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
