import * as fs from 'fs';
import * as path from 'path';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      type = "like",
      userId = "user_001",
      projectId,
      mediaUrl,
      mediaType = "image",
      stars = 1,
      prompt,
      issue,
      sentiment = "like"
    } = body;
    const feedbackData = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type,
      userId,
      projectId,
      mediaUrl,
      mediaType,
      stars,
      prompt,
      issue,
      sentiment
    };
    const astrixPath = "C:/Users/yodes/Documents/n8n/Astrix/sync";
    const userPath = `C:/Users/yodes/Documents/n8n/db/users/${userId}/feedback`;
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true });
    }
    if (type === "like" || type === "star") {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const updateLikesFile = (likesPath) => {
        let likesData = { likes: [], total_likes: 0, top_rated: [], last_updated: "" };
        if (fs.existsSync(likesPath)) {
          likesData = JSON.parse(fs.readFileSync(likesPath, "utf-8"));
        }
        likesData.likes.push(feedbackData);
        likesData.total_likes++;
        likesData.likes.sort((a, b) => (b.stars || 1) - (a.stars || 1));
        likesData.top_rated = likesData.likes.slice(0, 20).map((l) => ({
          mediaUrl: l.mediaUrl,
          stars: l.stars,
          prompt: l.prompt,
          timestamp: l.timestamp
        }));
        likesData.last_updated = now;
        fs.writeFileSync(likesPath, JSON.stringify(likesData, null, 2));
      };
      const updateStatsFile = (statsPath) => {
        if (fs.existsSync(statsPath)) {
          const statsData = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
          statsData.totals.likes++;
          statsData.last_updated = now;
          fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2));
        }
      };
      try {
        updateLikesFile(path.join(astrixPath, "likes.json"));
        updateStatsFile(path.join(astrixPath, "stats.json"));
      } catch (e) {
        console.error("Failed to update global Astrix likes:", e);
      }
      if (projectId && userId) {
        try {
          const projectAstrixPath = `C:/Users/yodes/Documents/n8n/db/users/${userId}/projects/${projectId}/astrix`;
          if (!fs.existsSync(projectAstrixPath)) {
            fs.mkdirSync(projectAstrixPath, { recursive: true });
          }
          updateLikesFile(path.join(projectAstrixPath, "likes.json"));
          updateStatsFile(path.join(projectAstrixPath, "stats.json"));
        } catch (e) {
          console.error("Failed to update project Astrix likes:", e);
        }
      }
      try {
        const userLikesPath = path.join(userPath, "likes.json");
        let userLikes = { likes: [], total_likes: 0, last_updated: "" };
        if (fs.existsSync(userLikesPath)) {
          userLikes = JSON.parse(fs.readFileSync(userLikesPath, "utf-8"));
        }
        userLikes.likes.push(feedbackData);
        userLikes.total_likes++;
        userLikes.last_updated = now;
        fs.writeFileSync(userLikesPath, JSON.stringify(userLikes, null, 2));
      } catch (e) {
        console.error("Failed to update user likes:", e);
      }
    } else if (type === "complaint") {
      try {
        const complaintsPath = path.join(userPath, "complaints.json");
        let complaints = { complaints: [], total_complaints: 0, last_updated: "" };
        if (fs.existsSync(complaintsPath)) {
          complaints = JSON.parse(fs.readFileSync(complaintsPath, "utf-8"));
        }
        complaints.complaints.push(feedbackData);
        complaints.total_complaints++;
        complaints.last_updated = (/* @__PURE__ */ new Date()).toISOString();
        fs.writeFileSync(complaintsPath, JSON.stringify(complaints, null, 2));
      } catch (e) {
        console.error("Failed to update complaints:", e);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      feedbackId: feedbackData.id,
      type
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to save feedback"
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
