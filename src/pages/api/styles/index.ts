import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../lib/cookies';
import { findSessionById } from '../../../lib/db';
import fs from 'fs/promises';

const PROMPT_DATABASE_PATH = 'C:/Users/yodes/Documents/n8n/Astrix/prompts/PROMPT_DATABASE.json';

export interface StylePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
}

export interface StyleCategory {
  id: string;
  name: string;
  description: string;
  styles: StylePreset[];
}

// Category display names
const CATEGORY_LABELS: Record<string, string> = {
  consistency: 'Character Consistency',
  shot_type: 'Shot Types',
  style: 'Visual Styles',
  lighting: 'Lighting',
  action: 'Actions',
  emotion: 'Emotions',
  environment: 'Environments',
  effect: 'Effects'
};

// GET /api/styles - Get all style presets grouped by category
export const GET: APIRoute = async ({ cookies }) => {
  const sessionId = getSessionCookie(cookies);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const session = await findSessionById(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session expired' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Load PROMPT_DATABASE
    const data = await fs.readFile(PROMPT_DATABASE_PATH, 'utf-8');
    const database = JSON.parse(data);

    // Group prompts by category
    const categoryMap = new Map<string, StylePreset[]>();

    for (const prompt of database.prompts) {
      const category = prompt.category || 'other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }

      categoryMap.get(category)!.push({
        id: prompt.id,
        name: prompt.name,
        category: category,
        description: prompt.chip_variant || prompt.template,
        tags: prompt.tags || []
      });
    }

    // Convert to array sorted by category
    const categories: StyleCategory[] = [];
    const categoryOrder = ['style', 'lighting', 'shot_type', 'emotion', 'environment', 'effect', 'action', 'consistency'];

    for (const categoryId of categoryOrder) {
      const styles = categoryMap.get(categoryId);
      if (styles && styles.length > 0) {
        categories.push({
          id: categoryId,
          name: CATEGORY_LABELS[categoryId] || categoryId,
          description: database.categories[categoryId] || '',
          styles: styles.sort((a, b) => a.name.localeCompare(b.name))
        });
      }
    }

    // Add any remaining categories
    for (const [categoryId, styles] of categoryMap) {
      if (!categoryOrder.includes(categoryId) && styles.length > 0) {
        categories.push({
          id: categoryId,
          name: CATEGORY_LABELS[categoryId] || categoryId,
          description: database.categories[categoryId] || '',
          styles: styles.sort((a, b) => a.name.localeCompare(b.name))
        });
      }
    }

    return new Response(JSON.stringify({
      categories,
      totalStyles: database.prompts.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error loading styles:', error);
    return new Response(JSON.stringify({ error: 'Failed to load styles' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
