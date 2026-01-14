// Technical Agent - Model Routing & Cost Specialist
import type { CouncilAgent, AgentDecision, AgentResponse, ShotContext, VideoModel, ModelSelection, MODEL_SPECS } from './types';

const TECHNICAL_SYSTEM_PROMPT = `You are the TECHNICAL AGENT - a specialist in video model selection, cost optimization, and technical constraints.

YOUR EXPERTISE:
- Video model selection (Seedance 1.5, Kling O1, Kling 2.6)
- File size constraints (<10MB for Kling)
- Motion prompt validation (power verbs, endpoints)
- Cost calculations
- Duration constraints (5s or 10s only)
- Compression requirements

MODEL SELECTION DECISION TREE:
1. Does character SPEAK on screen?
   → YES: SEEDANCE 1.5 (supports dialog/lipsync)

2. Is there a camera movement with explicit end frame?
   → YES: KLING O1 (supports start + end frame)

3. Is it a START → END state transition?
   → YES: KLING O1

4. Is it action/environment motion without dialog?
   → YES: KLING 2.6 (best for general motion)

5. DEFAULT → KLING 2.6

MODEL SPECS:
- SEEDANCE 1.5: Dialog, lipsync, 5s max, image_url + end_image_url
- KLING O1: Transitions, zoom/orbit, 10s max, start_image_url + tail_image_url
- KLING 2.6: Action, environment, 10s max, image_url only (no end frame)

MOTION PROMPT RULES:
1. VIDEO PROMPTS = MOTION ONLY (image has visual info)
2. ONE camera movement at a time
3. ALWAYS add motion endpoints ("then settles", "then holds")
4. Use POWER VERBS: STRIDE, BILLOW, CHARGE, SURGE (not "walk", "move")
5. Maximum 50 words

COST BREAKDOWN:
- Image generation: $0.03
- 4K Upscale: $0.05
- Video 5s: $0.35
- Video 10s: $0.70
- Per shot total: ~$0.43-$0.78

OUTPUT FORMAT:
{
  "model": "seedance-1.5|kling-o1|kling-2.6",
  "modelReason": "string",
  "duration": "5"|"10",
  "needsCompression": boolean,
  "needsEndFrame": boolean,
  "motionPromptValid": boolean,
  "motionPromptIssues": ["issue1", "issue2"],
  "estimatedCost": number
}`;

// Cost constants
const COSTS = {
  image: 0.03,
  upscale: 0.05,
  video_5s: 0.35,
  video_10s: 0.70,
  compression: 0.00 // Free (local ImageMagick)
};

// Power verbs that work well with Kling
const POWER_VERBS = [
  'STRIDE', 'MARCH', 'CHARGE', 'SURGE', 'BILLOW', 'DRIFT', 'SWIRL',
  'CRASH', 'BURST', 'SWEEP', 'GLIDE', 'SOAR', 'PLUNGE', 'SPIN',
  'TURN', 'PIVOT', 'LEAN', 'REACH', 'GRASP', 'THRUST', 'SLAM'
];

// Motion endpoints that prevent hangs
const MOTION_ENDPOINTS = [
  'then settles',
  'then holds',
  'comes to rest',
  'settles into place',
  'stops and looks',
  'settles back',
  'then freezes',
  'and holds steady'
];

export const technicalAgent: CouncilAgent = {
  name: 'Technical Agent',
  domain: 'technical',
  icon: '⚙️',
  color: 'green',
  systemPrompt: TECHNICAL_SYSTEM_PROMPT,
  knowledgeBases: [
    'video-model-specs',
    'motion-prompt-rules',
    'cost-calculations'
  ],

  async evaluate(context: ShotContext): Promise<AgentDecision> {
    const { shot, userPrompt, refs, previousShots } = context;

    // Analyze prompt for model selection
    const hasDialog = this.detectDialog(userPrompt);
    const hasEndFrame = shot.camera?.movement && this.needsEndFrame(shot.camera.movement);
    const isTransition = this.detectTransition(userPrompt);
    const speakerOnScreen = this.detectSpeakerOnScreen(userPrompt);

    // Model selection
    const modelSelection = this.selectModel(hasDialog, speakerOnScreen, hasEndFrame, isTransition);

    // Duration selection
    const duration = this.selectDuration(userPrompt, modelSelection.model);

    // Motion prompt validation
    const motionPromptAnalysis = this.analyzeMotionPrompt(shot.motionPrompt || userPrompt);

    // Cost calculation
    const estimatedCost = this.calculateCost(duration, refs.length > 0);

    // Build reasoning
    const reasoning = [
      `Model: ${modelSelection.model} - ${modelSelection.reason}`,
      `Duration: ${duration}s`,
      `Dialog detected: ${hasDialog ? 'Yes' : 'No'}`,
      `Speaker on screen: ${speakerOnScreen ? 'Yes' : 'No'}`,
      `Needs end frame: ${hasEndFrame ? 'Yes' : 'No'}`,
      `Estimated cost: $${estimatedCost.toFixed(2)}`
    ];

    // Warnings
    const warnings: string[] = [];

    if (!motionPromptAnalysis.hasEndpoint) {
      warnings.push('Motion prompt missing endpoint - 99% hang risk. Add "then settles" or similar.');
    }

    if (motionPromptAnalysis.multipleCameraMoves) {
      warnings.push('Multiple camera movements detected - may cause geometry warping. Use ONE movement.');
    }

    if (!motionPromptAnalysis.hasPowerVerb) {
      warnings.push('No power verbs detected. Consider: ' + POWER_VERBS.slice(0, 5).join(', '));
    }

    if (motionPromptAnalysis.wordCount > 50) {
      warnings.push(`Motion prompt too long (${motionPromptAnalysis.wordCount} words). Keep under 50.`);
    }

    // Confidence based on warnings
    const confidence = warnings.length === 0 ? 0.95 :
                       warnings.length === 1 ? 0.8 :
                       warnings.length === 2 ? 0.65 : 0.5;

    return {
      agent: 'technical',
      recommendation: {
        model: modelSelection.model,
        modelReason: modelSelection.reason,
        duration,
        needsCompression: true, // Always compress for Kling
        needsEndFrame: hasEndFrame,
        endpoint: this.getEndpoint(modelSelection.model),
        imageParam: this.getImageParam(modelSelection.model),
        endImageParam: this.getEndImageParam(modelSelection.model),
        motionPromptValid: warnings.length === 0,
        motionPromptIssues: motionPromptAnalysis.issues,
        suggestedMotionFixes: this.suggestMotionFixes(motionPromptAnalysis),
        estimatedCost
      },
      confidence,
      reasoning,
      sources: ['video-model-specs', 'motion-prompt-rules', 'cost-database'],
      warnings: warnings.length > 0 ? warnings : undefined
    };
  },

  async query(question: string, context: any): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();

    // Model recommendation
    if (questionLower.includes('which model') || questionLower.includes('what model')) {
      const hasDialog = context.hasDialog || false;
      const hasEndFrame = context.hasEndFrame || false;
      const isTransition = context.isTransition || false;

      const selection = this.selectModel(hasDialog, hasDialog, hasEndFrame, isTransition);

      return {
        agent: 'technical',
        answer: selection,
        confidence: 0.95,
        sources: ['video-model-decision-tree']
      };
    }

    // Cost calculation
    if (questionLower.includes('cost') || questionLower.includes('price')) {
      const duration = context.duration || '5';
      const shotCount = context.shotCount || 1;
      const totalCost = this.calculateCost(duration, true) * shotCount;

      return {
        agent: 'technical',
        answer: {
          perShot: this.calculateCost(duration, true),
          total: totalCost,
          breakdown: {
            image: COSTS.image,
            video: duration === '5' ? COSTS.video_5s : COSTS.video_10s
          }
        },
        confidence: 0.95,
        sources: ['cost-database']
      };
    }

    // Motion prompt validation
    if (questionLower.includes('validate') || questionLower.includes('motion prompt')) {
      const analysis = this.analyzeMotionPrompt(context.motionPrompt || '');

      return {
        agent: 'technical',
        answer: {
          valid: analysis.issues.length === 0,
          issues: analysis.issues,
          suggestions: this.suggestMotionFixes(analysis)
        },
        confidence: 0.9,
        sources: ['motion-prompt-rules']
      };
    }

    return {
      agent: 'technical',
      answer: { message: 'Query not recognized. Try asking about models, costs, or motion prompts.' },
      confidence: 0.5,
      sources: []
    };
  },

  // Helper methods
  detectDialog(prompt: string): boolean {
    const dialogKeywords = ['speak', 'say', 'talk', 'dialog', 'dialogue', 'voice', 'says', 'speaks', 'talking'];
    const promptLower = prompt.toLowerCase();
    return dialogKeywords.some(keyword => promptLower.includes(keyword));
  },

  detectSpeakerOnScreen(prompt: string): boolean {
    const promptLower = prompt.toLowerCase();
    // If dialog is mentioned and no "voiceover" or "off-screen"
    if (this.detectDialog(prompt)) {
      if (promptLower.includes('voiceover') || promptLower.includes('off-screen') || promptLower.includes('offscreen')) {
        return false;
      }
      return true;
    }
    return false;
  },

  detectTransition(prompt: string): boolean {
    const transitionKeywords = ['transition', 'transform', 'change to', 'becomes', 'turns into', 'morph'];
    const promptLower = prompt.toLowerCase();
    return transitionKeywords.some(keyword => promptLower.includes(keyword));
  },

  needsEndFrame(movement: string): boolean {
    const endFrameMovements = ['zoom_in', 'zoom_out', 'dolly_in', 'dolly_out', 'orbit', 'push_in', 'pull_back'];
    return endFrameMovements.includes(movement);
  },

  selectModel(hasDialog: boolean, speakerOnScreen: boolean, hasEndFrame: boolean, isTransition: boolean): ModelSelection {
    // Decision tree
    if (hasDialog && speakerOnScreen) {
      return {
        model: 'seedance-1.5',
        reason: 'Character speaks ON SCREEN - Seedance required for lipsync',
        confidence: 0.95,
        parameters: {
          endpoint: 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video',
          imageParam: 'image_url',
          endImageParam: 'end_image_url',
          supportsDialog: true,
          supportsEndFrame: true,
          maxDuration: 5
        }
      };
    }

    if (hasEndFrame || isTransition) {
      return {
        model: 'kling-o1',
        reason: hasEndFrame ? 'Camera movement needs explicit end frame' : 'State transition requires start + end',
        confidence: 0.9,
        parameters: {
          endpoint: 'fal-ai/kling-video/o1/image-to-video',
          imageParam: 'start_image_url',
          endImageParam: 'tail_image_url',
          supportsDialog: false,
          supportsEndFrame: true,
          maxDuration: 10
        }
      };
    }

    // Default
    return {
      model: 'kling-2.6',
      reason: 'General motion/action - Kling 2.6 is most versatile',
      confidence: 0.85,
      parameters: {
        endpoint: 'fal-ai/kling-video/v2.6/pro/image-to-video',
        imageParam: 'image_url',
        endImageParam: undefined,
        supportsDialog: false,
        supportsEndFrame: false,
        maxDuration: 10
      }
    };
  },

  selectDuration(prompt: string, model: VideoModel): '5' | '10' {
    // Seedance max is 5s
    if (model === 'seedance-1.5') return '5';

    // Check for duration hints
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('quick') || promptLower.includes('short') || promptLower.includes('brief')) {
      return '5';
    }
    if (promptLower.includes('long') || promptLower.includes('extended') || promptLower.includes('slow')) {
      return '10';
    }

    // Default to 5s for cost efficiency
    return '5';
  },

  analyzeMotionPrompt(prompt: string): {
    hasEndpoint: boolean;
    hasPowerVerb: boolean;
    multipleCameraMoves: boolean;
    wordCount: number;
    issues: string[];
  } {
    const promptLower = prompt.toLowerCase();
    const words = prompt.split(/\s+/);
    const issues: string[] = [];

    // Check for endpoint
    const hasEndpoint = MOTION_ENDPOINTS.some(endpoint =>
      promptLower.includes(endpoint.toLowerCase())
    );
    if (!hasEndpoint) {
      issues.push('Missing motion endpoint (add "then settles", "then holds", etc.)');
    }

    // Check for power verbs
    const hasPowerVerb = POWER_VERBS.some(verb =>
      promptLower.includes(verb.toLowerCase())
    );
    if (!hasPowerVerb && words.length > 5) {
      issues.push('No power verbs detected - motion may be weak');
    }

    // Check for multiple camera movements
    const cameraMoves = ['dolly', 'pan', 'tilt', 'orbit', 'zoom', 'push', 'pull', 'track', 'crane'];
    const foundMoves = cameraMoves.filter(move => promptLower.includes(move));
    const multipleCameraMoves = foundMoves.length > 1;
    if (multipleCameraMoves) {
      issues.push(`Multiple camera movements (${foundMoves.join(', ')}) - use ONE at a time`);
    }

    // Check word count
    const wordCount = words.length;
    if (wordCount > 50) {
      issues.push(`Motion prompt too long (${wordCount} words) - keep under 50`);
    }

    return {
      hasEndpoint,
      hasPowerVerb,
      multipleCameraMoves,
      wordCount,
      issues
    };
  },

  suggestMotionFixes(analysis: any): string[] {
    const suggestions: string[] = [];

    if (!analysis.hasEndpoint) {
      suggestions.push('Add: ", then settles" at the end');
      suggestions.push('Or: ", then holds steady"');
    }

    if (!analysis.hasPowerVerb) {
      suggestions.push('Replace weak verbs with: STRIDE, BILLOW, SURGE, GLIDE');
    }

    if (analysis.multipleCameraMoves) {
      suggestions.push('Keep only the primary camera movement');
      suggestions.push('Remove secondary movements to prevent geometry issues');
    }

    return suggestions;
  },

  calculateCost(duration: '5' | '10', hasRefs: boolean): number {
    let cost = COSTS.image; // Base image
    cost += duration === '5' ? COSTS.video_5s : COSTS.video_10s;
    if (hasRefs) cost += COSTS.upscale; // Usually upscale when using refs
    return cost;
  },

  getEndpoint(model: VideoModel): string {
    const endpoints: Record<VideoModel, string> = {
      'seedance-1.5': 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video',
      'kling-o1': 'fal-ai/kling-video/o1/image-to-video',
      'kling-2.6': 'fal-ai/kling-video/v2.6/pro/image-to-video'
    };
    return endpoints[model];
  },

  getImageParam(model: VideoModel): string {
    if (model === 'kling-o1') return 'start_image_url';
    return 'image_url';
  },

  getEndImageParam(model: VideoModel): string | undefined {
    if (model === 'seedance-1.5') return 'end_image_url';
    if (model === 'kling-o1') return 'tail_image_url';
    return undefined;
  }
};

export default technicalAgent;
