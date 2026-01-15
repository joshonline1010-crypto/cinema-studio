// API Endpoint: Run council meeting with REAL Claude AI agents
import type { APIRoute } from 'astro';

// Agent types
interface ShotContext {
  shot: any;
  refs: any[];
  previousShots: any[];
  plan?: any;
  userPrompt: string;
  director?: string;
}

interface AgentDecision {
  agent: string;
  recommendation: any;
  confidence: number;
  reasoning: string[];
  sources: string[];
  warnings?: string[];
}

interface ConsensusResult {
  finalDecision: any;
  agentDecisions: AgentDecision[];
  consensusScore: number;
  requiresReview: boolean;
  dissents: any[];
  timestamp: number;
}

// ============================================
// REAL AI AGENT CALLS - Each agent calls Claude
// ============================================

const AGENT_NAMES = ['narrative', 'visual', 'technical', 'production'];

async function callRealAgent(agentName: string, context: ShotContext, requestUrl?: string): Promise<AgentDecision> {
  // Extract port from the incoming request URL, or try common ports
  let baseUrl = process.env.SITE_URL || 'http://localhost:4321';

  // If we have the request URL, extract the port from it
  if (requestUrl) {
    try {
      const url = new URL(requestUrl);
      baseUrl = `${url.protocol}//${url.host}`;
    } catch (e) {
      // Fall back to default
    }
  }

  try {
    console.log(`[COUNCIL] Calling ${agentName.toUpperCase()} agent via Claude at ${baseUrl}...`);

    const response = await fetch(`${baseUrl}/api/council/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent: agentName,
        context: {
          userPrompt: context.userPrompt,
          shot: context.shot,
          previousShots: context.previousShots,
          refs: context.refs,
          director: context.director
        }
      })
    });

    if (!response.ok) {
      console.error(`[COUNCIL] ${agentName} agent failed:`, response.status);
      return getFallbackDecision(agentName, context);
    }

    const data = await response.json();

    if (data.success && data.decision) {
      console.log(`[COUNCIL] ${agentName.toUpperCase()} agent responded with confidence: ${data.decision.confidence}`);
      return {
        agent: data.decision.agent || agentName,
        recommendation: data.decision.recommendation,
        confidence: data.decision.confidence || 0.8,
        reasoning: data.decision.reasoning || [],
        sources: [`claude-${agentName}-agent`],
        warnings: data.decision.warnings
      };
    }

    return getFallbackDecision(agentName, context);
  } catch (error) {
    console.error(`[COUNCIL] ${agentName} agent error:`, error);
    return getFallbackDecision(agentName, context);
  }
}

// Fallback decisions if Claude call fails
function getFallbackDecision(agentName: string, context: ShotContext): AgentDecision {
  const { shot, previousShots = [], director } = context;
  const userPrompt = context.userPrompt || '';

  switch (agentName) {
    case 'narrative':
      return {
        agent: 'narrative',
        recommendation: {
          beat: previousShots.length <= 2 ? 'opening' : 'development',
          emotionalIntensity: 'medium',
          shotPosition: previousShots.length + 1
        },
        confidence: 0.6,
        reasoning: ['Fallback: Claude unavailable', 'Using basic beat detection'],
        sources: ['fallback-narrative'],
        warnings: ['Claude API unavailable - using fallback logic']
      };

    case 'visual':
      return {
        agent: 'visual',
        recommendation: {
          directorApproach: director || 'spielberg',
          shotType: 'MS',
          framing: 'rule_of_thirds',
          cameraMovement: 'static'
        },
        confidence: 0.6,
        reasoning: ['Fallback: Claude unavailable', 'Using default visual approach'],
        sources: ['fallback-visual'],
        warnings: ['Claude API unavailable - using fallback logic']
      };

    case 'technical':
      const hasDialog = userPrompt.toLowerCase().includes('speak') || userPrompt.toLowerCase().includes('talk');
      return {
        agent: 'technical',
        recommendation: {
          model: hasDialog ? 'seedance-1.5' : 'kling-2.6',
          duration: '5',
          estimatedCost: 0.43
        },
        confidence: 0.6,
        reasoning: ['Fallback: Claude unavailable', 'Using basic model selection'],
        sources: ['fallback-technical'],
        warnings: ['Claude API unavailable - using fallback logic']
      };

    case 'production':
      return {
        agent: 'production',
        recommendation: {
          chainStrategy: previousShots.length > 0 ? 'chain_from_previous' : 'new_sequence',
          colorLockPhrase: previousShots.length > 0 ? 'THIS EXACT CHARACTER, THIS EXACT LIGHTING' : '',
          compressionRequired: true
        },
        confidence: 0.6,
        reasoning: ['Fallback: Claude unavailable', 'Using basic chain logic'],
        sources: ['fallback-production'],
        warnings: ['Claude API unavailable - using fallback logic']
      };

    default:
      return {
        agent: agentName,
        recommendation: {},
        confidence: 0.5,
        reasoning: ['Unknown agent'],
        sources: ['fallback'],
        warnings: ['Unknown agent type']
      };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const context: ShotContext = body.context || body;

    // Validate context
    if (!context.shot && !context.userPrompt) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing shot or userPrompt in context'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure we have a shot object
    if (!context.shot) {
      context.shot = {
        id: `shot_${Date.now()}`,
        order: (context.previousShots?.length || 0) + 1,
        prompt: context.userPrompt,
        duration: '5',
        status: 'pending'
      };
    }

    // Ensure we have arrays
    context.refs = context.refs || [];
    context.previousShots = context.previousShots || [];

    // Get the request URL to determine correct port
    const requestUrl = request.url;
    console.log('[COUNCIL] Starting council meeting - calling 4 Claude agents in parallel...');
    const startTime = Date.now();

    // Run ALL 4 REAL AI agent evaluations in parallel
    const [narrativeDecision, visualDecision, technicalDecision, productionDecision] = await Promise.all([
      callRealAgent('narrative', context, requestUrl),
      callRealAgent('visual', context, requestUrl),
      callRealAgent('technical', context, requestUrl),
      callRealAgent('production', context, requestUrl)
    ]);

    const elapsed = Date.now() - startTime;
    console.log(`[COUNCIL] All 4 agents responded in ${elapsed}ms`);

    const decisions = [narrativeDecision, visualDecision, technicalDecision, productionDecision];

    // Build consensus
    const techRec = technicalDecision.recommendation;
    const prodRec = productionDecision.recommendation;

    // Calculate consensus score
    const avgConfidence = decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;

    // Collect warnings
    const allWarnings: string[] = [];
    decisions.forEach(d => {
      if (d.warnings) allWarnings.push(...d.warnings);
    });

    // Build dissents
    const dissents: any[] = [];
    if (technicalDecision.warnings?.length) {
      dissents.push({
        agent: 'technical',
        issue: technicalDecision.warnings[0],
        alternative: 'Add motion endpoint',
        severity: 'high'
      });
    }

    const requiresReview = dissents.some(d => d.severity === 'high') || avgConfidence < 0.7;

    const consensus: ConsensusResult = {
      finalDecision: {
        model: techRec.model,
        modelReason: techRec.modelReason,
        photoPrompt: prodRec.colorLockPhrase
          ? `${prodRec.colorLockPhrase}. ${context.userPrompt}`
          : context.userPrompt,
        motionPrompt: context.shot.motionPrompt || 'Subtle movement, then settles',
        duration: techRec.duration,
        chainStrategy: {
          chainFromPrevious: prodRec.chainStrategy === 'chain_from_previous',
          useLastFrame: prodRec.chainStrategy === 'chain_from_previous',
          colorLockPhrase: prodRec.colorLockPhrase || ''
        },
        estimatedCost: techRec.estimatedCost,
        warnings: allWarnings
      },
      agentDecisions: decisions,
      consensusScore: avgConfidence,
      requiresReview,
      dissents,
      timestamp: Date.now()
    };

    return new Response(JSON.stringify({
      success: true,
      consensus
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[API] Council meeting error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
