import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const GET: APIRoute = async () => {
  try {
    const astrixPath = 'C:/Users/yodes/Documents/n8n/Astrix/sync';

    // Read all sync files
    const statsPath = path.join(astrixPath, 'stats.json');
    const likesPath = path.join(astrixPath, 'likes.json');
    const changesPath = path.join(astrixPath, 'common_changes.json');
    const messagesPath = path.join(astrixPath, 'messages.json');

    let stats = { totals: {}, sentiment: {}, top_agents: {}, activity_by_day: {}, priority_summary: {} };
    let likes = { top_rated: [], total_likes: 0 };
    let changes = { patterns: {}, total_changes: 0, recent_changes: [] };
    let messages = { total_messages: 0, messages: [] };

    if (fs.existsSync(statsPath)) {
      stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
    }

    if (fs.existsSync(likesPath)) {
      likes = JSON.parse(fs.readFileSync(likesPath, 'utf-8'));
    }

    if (fs.existsSync(changesPath)) {
      changes = JSON.parse(fs.readFileSync(changesPath, 'utf-8'));
    }

    if (fs.existsSync(messagesPath)) {
      messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
    }

    // Build insights response
    const insights = {
      overview: {
        total_messages: stats.totals?.messages || messages.total_messages || 0,
        total_likes: stats.totals?.likes || likes.total_likes || 0,
        total_changes: changes.total_changes || 0,
        images_generated: stats.totals?.images_generated || 0,
        videos_generated: stats.totals?.videos_generated || 0
      },
      sentiment: stats.sentiment || {},
      top_rated: likes.top_rated?.slice(0, 10) || [],
      common_changes: Object.entries(changes.patterns || {})
        .map(([pattern, data]: [string, any]) => ({
          pattern,
          count: data.count || 0,
          keywords: data.keywords || []
        }))
        .filter(p => p.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      recent_changes: changes.recent_changes?.slice(-10).reverse() || [],
      top_agents: Object.entries(stats.top_agents || {})
        .map(([agent, count]) => ({ agent, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5),
      activity_by_day: stats.activity_by_day || {},
      priority_summary: stats.priority_summary || {},
      recent_messages: messages.messages?.slice(-20).reverse() || []
    };

    return new Response(JSON.stringify(insights), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Insights API error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to load insights',
      overview: { total_messages: 0, total_likes: 0, total_changes: 0 },
      sentiment: {},
      top_rated: [],
      common_changes: [],
      recent_changes: [],
      top_agents: [],
      activity_by_day: {},
      priority_summary: {},
      recent_messages: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
