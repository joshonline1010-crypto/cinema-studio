import type { APIRoute } from 'astro';
import { decomposeStory, quickDecompose } from '../../../components/react/AI2Studio/agents/storyAgent';

/**
 * Story Decomposition API
 *
 * POST /api/ai2/decompose
 * Body: { concept, duration, character_dna?, quick? }
 *
 * Uses 15/35/50 escalation formula to break concept into segments
 */

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      concept,
      duration = 60,
      character_dna,
      quick = false  // Use quick mode for template-based decomposition
    } = body;

    if (!concept) {
      return new Response(JSON.stringify({
        error: 'concept required'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('[API] Decomposing story:', {
      concept: concept.substring(0, 50) + '...',
      duration,
      quick
    });

    let storyPlan;

    if (quick) {
      // Fast template-based decomposition
      storyPlan = quickDecompose(concept, duration);
    } else {
      // Full AI-powered decomposition
      storyPlan = await decomposeStory(concept, duration, character_dna);
    }

    return new Response(JSON.stringify({
      success: true,
      story_plan: storyPlan
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API] Decompose error:', error);
    return new Response(JSON.stringify({
      error: 'Story decomposition failed',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
