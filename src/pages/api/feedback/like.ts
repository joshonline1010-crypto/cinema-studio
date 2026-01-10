import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const {
      type = 'like',
      userId = 'user_001',
      projectId,
      mediaUrl,
      mediaType = 'image',
      stars = 1,
      prompt,
      issue,
      sentiment = 'like'
    } = body;

    const feedbackData = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
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

    // Paths
    const astrixPath = 'C:/Users/yodes/Documents/n8n/Astrix/sync';
    const userPath = `C:/Users/yodes/Documents/n8n/db/users/${userId}/feedback`;

    // Ensure user feedback folder exists
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true });
    }

    if (type === 'like' || type === 'star') {
      const now = new Date().toISOString();

      // Helper to update likes file (works for both global and project)
      const updateLikesFile = (likesPath: string) => {
        let likesData = { likes: [], total_likes: 0, top_rated: [], last_updated: '' };

        if (fs.existsSync(likesPath)) {
          likesData = JSON.parse(fs.readFileSync(likesPath, 'utf-8'));
        }

        likesData.likes.push(feedbackData);
        likesData.total_likes++;

        // Update top_rated (keep top 20 by stars)
        likesData.likes.sort((a: any, b: any) => (b.stars || 1) - (a.stars || 1));
        likesData.top_rated = likesData.likes.slice(0, 20).map((l: any) => ({
          mediaUrl: l.mediaUrl,
          stars: l.stars,
          prompt: l.prompt,
          timestamp: l.timestamp
        }));

        likesData.last_updated = now;
        fs.writeFileSync(likesPath, JSON.stringify(likesData, null, 2));
      };

      // Helper to update stats file
      const updateStatsFile = (statsPath: string) => {
        if (fs.existsSync(statsPath)) {
          const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
          statsData.totals.likes++;
          statsData.last_updated = now;
          fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2));
        }
      };

      // 1. GLOBAL ASTRIX (see ALL likes at once)
      try {
        updateLikesFile(path.join(astrixPath, 'likes.json'));
        updateStatsFile(path.join(astrixPath, 'stats.json'));
      } catch (e) {
        console.error('Failed to update global Astrix likes:', e);
      }

      // 2. PER-PROJECT ASTRIX (see just this project's likes)
      if (projectId && userId) {
        try {
          const projectAstrixPath = `C:/Users/yodes/Documents/n8n/db/users/${userId}/projects/${projectId}/astrix`;

          // Create project astrix folder if it doesn't exist
          if (!fs.existsSync(projectAstrixPath)) {
            fs.mkdirSync(projectAstrixPath, { recursive: true });
          }

          updateLikesFile(path.join(projectAstrixPath, 'likes.json'));
          updateStatsFile(path.join(projectAstrixPath, 'stats.json'));
        } catch (e) {
          console.error('Failed to update project Astrix likes:', e);
        }
      }

      // 3. USER-LEVEL FEEDBACK (all user's likes across all projects)
      try {
        const userLikesPath = path.join(userPath, 'likes.json');
        let userLikes = { likes: [], total_likes: 0, last_updated: '' };

        if (fs.existsSync(userLikesPath)) {
          userLikes = JSON.parse(fs.readFileSync(userLikesPath, 'utf-8'));
        }

        userLikes.likes.push(feedbackData);
        userLikes.total_likes++;
        userLikes.last_updated = now;
        fs.writeFileSync(userLikesPath, JSON.stringify(userLikes, null, 2));
      } catch (e) {
        console.error('Failed to update user likes:', e);
      }

    } else if (type === 'complaint') {
      // Update user complaints.json
      try {
        const complaintsPath = path.join(userPath, 'complaints.json');
        let complaints = { complaints: [], total_complaints: 0, last_updated: '' };

        if (fs.existsSync(complaintsPath)) {
          complaints = JSON.parse(fs.readFileSync(complaintsPath, 'utf-8'));
        }

        complaints.complaints.push(feedbackData);
        complaints.total_complaints++;
        complaints.last_updated = new Date().toISOString();
        fs.writeFileSync(complaintsPath, JSON.stringify(complaints, null, 2));
      } catch (e) {
        console.error('Failed to update complaints:', e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      feedbackId: feedbackData.id,
      type
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save feedback'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
