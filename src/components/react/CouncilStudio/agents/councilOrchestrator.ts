// Council Orchestrator - Manages agent communication and consensus building
// NOW WITH REAL CLAUDE AI CALLS FOR EACH AGENT
import type {
  ShotContext,
  AgentDecision,
  ConsensusResult,
  FinalDecision,
  Dissent,
  VideoModel,
  AgentDomain
} from './types';

import { narrativeAgent } from './narrativeAgent';
import { visualAgent } from './visualAgent';
import { technicalAgent } from './technicalAgent';
import { productionAgent } from './productionAgent';

// All council agents (local fallback versions)
const COUNCIL_AGENTS = [
  narrativeAgent,
  visualAgent,
  technicalAgent,
  productionAgent
];

// Weight each agent's opinion (can be adjusted)
const AGENT_WEIGHTS: Record<AgentDomain, number> = {
  narrative: 0.2,
  visual: 0.3,
  technical: 0.35,  // Technical gets highest weight for model selection
  production: 0.15
};

// Dissent severity thresholds
const DISSENT_THRESHOLD = {
  low: 0.7,      // Confidence below this = low dissent
  medium: 0.5,   // Confidence below this = medium dissent
  high: 0.3      // Confidence below this = high dissent
};

export interface CouncilOrchestrator {
  runMeeting(context: ShotContext): Promise<ConsensusResult>;
  runRealAIMeeting(context: ShotContext): Promise<ConsensusResult>;
  queryAgent(agent: AgentDomain, question: string, context: any): Promise<any>;
  getAgents(): typeof COUNCIL_AGENTS;
}

export const councilOrchestrator: CouncilOrchestrator = {
  /**
   * Run a REAL AI council meeting via API
   * Calls the server which fires 4 Claude Sonnet agents in parallel
   */
  async runRealAIMeeting(context: ShotContext): Promise<ConsensusResult> {
    console.log('[Council] Starting REAL AI meeting via API...');
    const startTime = Date.now();

    try {
      const response = await fetch('/api/council/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        console.error('[Council] API call failed:', response.status);
        // Fall back to local agents
        return this.runMeeting(context);
      }

      const data = await response.json();
      const elapsed = Date.now() - startTime;
      console.log(`[Council] REAL AI meeting completed in ${elapsed}ms`);

      if (data.success && data.consensus) {
        return data.consensus;
      }

      // Fallback to local
      return this.runMeeting(context);
    } catch (error) {
      console.error('[Council] API error:', error);
      return this.runMeeting(context);
    }
  },

  /**
   * Run a full council meeting to evaluate a shot (LOCAL FALLBACK)
   * All agents evaluate in parallel, then consensus is built
   */
  async runMeeting(context: ShotContext): Promise<ConsensusResult> {
    console.log('[Council] Starting LOCAL meeting for shot:', context.shot?.id || 'new shot');

    // 1. Dispatch to all agents in parallel
    const startTime = Date.now();
    const decisionsPromises = COUNCIL_AGENTS.map(agent =>
      agent.evaluate(context).catch(err => {
        console.error(`[Council] ${agent.name} failed:`, err);
        return {
          agent: agent.domain,
          recommendation: null,
          confidence: 0,
          reasoning: [`Error: ${err.message}`],
          sources: [],
          warnings: ['Agent evaluation failed']
        } as AgentDecision;
      })
    );

    const decisions = await Promise.all(decisionsPromises);
    const evalTime = Date.now() - startTime;
    console.log(`[Council] All local agents evaluated in ${evalTime}ms`);

    // 2. Build consensus
    const consensus = this.buildConsensus(decisions, context);

    // 3. Return result
    return {
      ...consensus,
      agentDecisions: decisions,
      timestamp: Date.now()
    };
  },

  /**
   * Query a specific agent directly
   */
  async queryAgent(agentDomain: AgentDomain, question: string, context: any): Promise<any> {
    const agent = COUNCIL_AGENTS.find(a => a.domain === agentDomain);
    if (!agent) {
      throw new Error(`Agent not found: ${agentDomain}`);
    }
    return agent.query(question, context);
  },

  /**
   * Get all available agents
   */
  getAgents() {
    return COUNCIL_AGENTS;
  },

  /**
   * Build consensus from all agent decisions
   */
  buildConsensus(decisions: AgentDecision[], context: ShotContext): Omit<ConsensusResult, 'agentDecisions' | 'timestamp'> {
    // Extract key decisions from each agent
    const narrativeDecision = decisions.find(d => d.agent === 'narrative');
    const visualDecision = decisions.find(d => d.agent === 'visual');
    const technicalDecision = decisions.find(d => d.agent === 'technical');
    const productionDecision = decisions.find(d => d.agent === 'production');

    // 1. Model selection (Technical agent is authoritative, but others can dissent)
    const modelSelection = technicalDecision?.recommendation || {};
    const model: VideoModel = modelSelection.model || 'kling-2.6';
    const modelReason = modelSelection.modelReason || 'Default selection';

    // 2. Duration (Technical agent decides)
    const duration = modelSelection.duration || '5';

    // 3. Build prompts from visual agent recommendations
    const visualRec = visualDecision?.recommendation || {};
    const promptElements = visualRec.suggestedPromptElements || [];

    // 4. Motion prompt from technical validation
    const motionPromptValid = modelSelection.motionPromptValid !== false;

    // 5. Chain strategy from production agent
    const productionRec = productionDecision?.recommendation || {};
    const chainStrategy = {
      chainFromPrevious: productionRec.chainStrategy === 'chain_from_previous',
      useLastFrame: productionRec.chainStrategy === 'chain_from_previous',
      colorLockPhrase: productionRec.colorLockPhrase || '',
      directionLock: productionRec.directionLock || undefined
    };

    // 6. Calculate overall consensus score
    const confidenceScores = decisions.map(d => d.confidence);
    const avgConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;

    // Weighted consensus score
    let consensusScore = 0;
    for (const decision of decisions) {
      const weight = AGENT_WEIGHTS[decision.agent];
      consensusScore += decision.confidence * weight;
    }

    // 7. Identify dissents
    const dissents: Dissent[] = [];

    // Check for model disagreement
    if (visualDecision?.warnings?.some(w => w.includes('not typical'))) {
      dissents.push({
        agent: 'visual',
        issue: 'Director style conflict',
        alternative: 'Consider alternative camera approach',
        severity: 'low'
      });
    }

    // Check for motion prompt issues
    if (technicalDecision?.warnings?.some(w => w.includes('endpoint'))) {
      dissents.push({
        agent: 'technical',
        issue: 'Motion prompt missing endpoint',
        alternative: 'Add "then settles" or similar',
        severity: 'high'
      });
    }

    // Check for continuity issues
    if (productionDecision?.warnings && productionDecision.warnings.length > 0) {
      dissents.push({
        agent: 'production',
        issue: productionDecision.warnings[0],
        alternative: 'Apply color/direction locks',
        severity: 'medium'
      });
    }

    // Check for pacing issues
    if (narrativeDecision?.warnings && narrativeDecision.warnings.length > 0) {
      dissents.push({
        agent: 'narrative',
        issue: narrativeDecision.warnings[0],
        alternative: 'Adjust pacing or emotional intensity',
        severity: 'low'
      });
    }

    // 8. Determine if human review is needed
    const hasHighSeverityDissent = dissents.some(d => d.severity === 'high');
    const hasMultipleDissents = dissents.length >= 2;
    const lowOverallConfidence = consensusScore < 0.6;
    const requiresReview = hasHighSeverityDissent || hasMultipleDissents || lowOverallConfidence;

    // 9. Collect all warnings
    const allWarnings: string[] = [];
    for (const decision of decisions) {
      if (decision.warnings) {
        allWarnings.push(...decision.warnings);
      }
    }

    // 10. Estimate cost
    const estimatedCost = modelSelection.estimatedCost || 0.43;

    // 11. Build photo prompt
    const photoPrompt = this.buildPhotoPrompt(context, visualRec, productionRec);

    // 12. Build motion prompt
    const motionPrompt = this.buildMotionPrompt(context, visualRec, technicalDecision);

    // Final decision
    const finalDecision: FinalDecision = {
      model,
      modelReason,
      photoPrompt,
      motionPrompt,
      duration,
      chainStrategy,
      estimatedCost,
      warnings: allWarnings
    };

    return {
      finalDecision,
      consensusScore,
      requiresReview,
      dissents
    };
  },

  /**
   * Build the photo prompt from agent recommendations
   */
  buildPhotoPrompt(context: ShotContext, visualRec: any, productionRec: any): string {
    const parts: string[] = [];

    // Add color lock if chaining
    if (productionRec.colorLockPhrase) {
      parts.push(productionRec.colorLockPhrase);
    }

    // Add user's base prompt
    if (context.userPrompt) {
      parts.push(context.userPrompt);
    }

    // Add visual recommendations
    if (visualRec.suggestedPromptElements) {
      parts.push(...visualRec.suggestedPromptElements);
    }

    // Add direction lock if specified
    if (productionRec.directionLock) {
      parts.push(productionRec.directionLock);
    }

    // Add environment lock if specified
    if (productionRec.environmentLock) {
      parts.push(productionRec.environmentLock);
    }

    return parts.join(', ');
  },

  /**
   * Build the motion prompt with proper structure
   */
  buildMotionPrompt(context: ShotContext, visualRec: any, technicalDecision: AgentDecision | undefined): string {
    let motionPrompt = context.shot?.motionPrompt || '';

    // If no motion prompt, build one from visual recommendations
    if (!motionPrompt && visualRec.cameraMovement && visualRec.cameraMovement !== 'static') {
      motionPrompt = `${visualRec.cameraMovement.replace(/_/g, ' ')} camera movement`;
    }

    // Check if endpoint is missing and add one
    const techRec = technicalDecision?.recommendation;
    if (techRec && !techRec.motionPromptValid) {
      // Check if endpoint is the issue
      if (techRec.motionPromptIssues?.some((i: string) => i.includes('endpoint'))) {
        if (!motionPrompt.includes('then') && !motionPrompt.includes('settles') && !motionPrompt.includes('holds')) {
          motionPrompt = motionPrompt.trim() + ', then settles';
        }
      }
    }

    return motionPrompt;
  }
};

// Export individual functions for direct use
export async function runCouncilMeeting(context: ShotContext): Promise<ConsensusResult> {
  // Use REAL AI by default now!
  return councilOrchestrator.runRealAIMeeting(context);
}

export async function runLocalCouncilMeeting(context: ShotContext): Promise<ConsensusResult> {
  // Use local agents (fallback)
  return councilOrchestrator.runMeeting(context);
}

export async function runRealAICouncilMeeting(context: ShotContext): Promise<ConsensusResult> {
  // Explicitly use real AI
  return councilOrchestrator.runRealAIMeeting(context);
}

export async function queryCouncilAgent(agent: AgentDomain, question: string, context: any): Promise<any> {
  return councilOrchestrator.queryAgent(agent, question, context);
}

export function getCouncilAgents() {
  return councilOrchestrator.getAgents();
}

export default councilOrchestrator;
