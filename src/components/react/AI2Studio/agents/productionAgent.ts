// Production Agent - Continuity & Chaining Specialist
import type { CouncilAgent, AgentDecision, AgentResponse, ShotContext, ChainStrategy } from './types';

const PRODUCTION_SYSTEM_PROMPT = `You are the PRODUCTION AGENT - a specialist in shot continuity, frame chaining, and production logistics.

YOUR EXPERTISE:
- Shot-to-shot color consistency
- Frame chaining workflows
- Direction locks (character facing)
- Environment consistency
- Character costume/appearance locks
- Compression and upload workflows

COLOR LOCK PHRASES (Always use for edit prompts):
- "THIS EXACT CHARACTER"
- "THIS EXACT LIGHTING"
- "THIS EXACT COLOR GRADE"
- "maintain color grading"
- "same costume, same lighting direction"

FRAME CHAINING WORKFLOW:
1. Generate video for Shot N
2. Extract last frame: ffmpeg -sseof -0.1 -i video.mp4 -frames:v 1 last_frame.jpg
3. Compress to <10MB for Kling
4. Upload to Catbox for URL
5. Use as start_image_url for Shot N+1
6. Apply color lock phrases to prompt

DIRECTION LOCKS:
- Track which way character is facing
- Maintain consistency: "Facing RIGHT - SAME DIRECTION as previous"
- Flag if direction would flip unexpectedly

ENVIRONMENT LOCKS:
- Room layout must be identical
- Lighting direction must match
- Background elements must persist

CONTINUITY CHECKLIST:
□ Color grade matches previous shot
□ Character direction consistent
□ Costume/appearance unchanged
□ Lighting direction same
□ Background elements present
□ Time of day consistent

OUTPUT FORMAT:
{
  "chainStrategy": "new_sequence|chain_from_previous|independent",
  "colorLockPhrase": "string",
  "directionLock": "string",
  "environmentLock": "string",
  "continuityIssues": ["issue1", "issue2"],
  "compressionRequired": boolean,
  "uploadRequired": boolean
}`;

// Color lock phrases for different scenarios
const COLOR_LOCK_PHRASES = {
  sameCharacter: 'THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE',
  sameScene: 'maintain exact color grading, same lighting direction',
  angleChange: 'Same character, same costume, same lighting, different angle',
  timeSkip: 'Same character, same costume, lighting may vary'
};

export const productionAgent: CouncilAgent = {
  name: 'Production Agent',
  domain: 'production',
  icon: '🎞️',
  color: 'orange',
  systemPrompt: PRODUCTION_SYSTEM_PROMPT,
  knowledgeBases: [
    'frame-chaining-workflow',
    'continuity-rules',
    'color-lock-phrases'
  ],

  async evaluate(context: ShotContext): Promise<AgentDecision> {
    const { shot, previousShots, refs, plan } = context;

    // Determine chain strategy
    const chainStrategy = this.determineChainStrategy(shot, previousShots);

    // Check continuity
    const continuityAnalysis = this.analyzeContinuity(shot, previousShots);

    // Determine locks
    const directionLock = this.determineDirectionLock(shot, previousShots);
    const environmentLock = this.determineEnvironmentLock(shot, previousShots);

    // Select appropriate color lock phrase
    const colorLockPhrase = this.selectColorLockPhrase(shot, previousShots);

    // Build reasoning
    const reasoning = [
      `Chain strategy: ${chainStrategy.strategy}`,
      `Color lock: ${colorLockPhrase ? 'Applied' : 'Not needed (first shot)'}`,
      `Direction lock: ${directionLock || 'None'}`,
      `Environment lock: ${environmentLock || 'None'}`,
      `Continuity score: ${continuityAnalysis.score}/10`
    ];

    // Warnings
    const warnings: string[] = [];

    if (continuityAnalysis.issues.length > 0) {
      warnings.push(...continuityAnalysis.issues);
    }

    if (chainStrategy.strategy === 'chain_from_previous' && !previousShots[previousShots.length - 1]?.videoUrl) {
      warnings.push('Previous shot has no video yet - chaining may fail');
    }

    // Check for direction flip
    if (this.detectDirectionFlip(shot, previousShots)) {
      warnings.push('Character direction may flip - add explicit direction lock');
    }

    const confidence = continuityAnalysis.score >= 8 ? 0.92 :
                       continuityAnalysis.score >= 6 ? 0.8 :
                       continuityAnalysis.score >= 4 ? 0.65 : 0.5;

    return {
      agent: 'production',
      recommendation: {
        chainStrategy: chainStrategy.strategy,
        chainFromShot: chainStrategy.fromShot,
        useFrame: chainStrategy.useFrame,
        colorLockPhrase,
        directionLock,
        environmentLock,
        continuityChecklist: continuityAnalysis.checklist,
        compressionRequired: true, // Always for Kling
        uploadRequired: chainStrategy.strategy === 'chain_from_previous',
        frameExtractionCommand: this.getFrameExtractionCommand(chainStrategy.fromShot),
        promptModifications: this.getPromptModifications(colorLockPhrase, directionLock, environmentLock)
      },
      confidence,
      reasoning,
      sources: ['frame-chaining-workflow', 'continuity-rules'],
      warnings: warnings.length > 0 ? warnings : undefined
    };
  },

  async query(question: string, context: any): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();

    // Chaining query
    if (questionLower.includes('chain') || questionLower.includes('frame')) {
      return {
        agent: 'production',
        answer: {
          workflow: [
            '1. Generate video for current shot',
            '2. Extract last frame: ffmpeg -sseof -0.1 -i video.mp4 -frames:v 1 last_frame.jpg',
            '3. Compress to <10MB: magick convert -resize 2048x -quality 85 last_frame.jpg compressed.jpg',
            '4. Upload to Catbox for URL',
            '5. Use URL as start_image_url for next shot',
            '6. Apply color lock phrase to prompt'
          ],
          colorLockPhrase: COLOR_LOCK_PHRASES.sameCharacter
        },
        confidence: 0.95,
        sources: ['frame-chaining-workflow']
      };
    }

    // Color lock query
    if (questionLower.includes('color') || questionLower.includes('consistency')) {
      return {
        agent: 'production',
        answer: {
          phrases: COLOR_LOCK_PHRASES,
          usage: 'Add to beginning of edit prompts to maintain visual consistency'
        },
        confidence: 0.95,
        sources: ['color-lock-phrases']
      };
    }

    // Continuity query
    if (questionLower.includes('continuity') || questionLower.includes('check')) {
      return {
        agent: 'production',
        answer: {
          checklist: [
            'Color grade matches previous shot',
            'Character direction consistent',
            'Costume/appearance unchanged',
            'Lighting direction same',
            'Background elements present',
            'Time of day consistent'
          ]
        },
        confidence: 0.95,
        sources: ['continuity-rules']
      };
    }

    return {
      agent: 'production',
      answer: { message: 'Query not recognized. Try asking about chaining, color consistency, or continuity.' },
      confidence: 0.5,
      sources: []
    };
  },

  // Helper methods
  determineChainStrategy(shot: any, previousShots: any[]): {
    strategy: 'new_sequence' | 'chain_from_previous' | 'independent';
    fromShot?: string;
    useFrame?: number;
  } {
    // First shot or explicit new sequence
    if (previousShots.length === 0) {
      return { strategy: 'new_sequence' };
    }

    // Check if shot indicates new scene
    if (shot.environment?.location !== previousShots[previousShots.length - 1]?.environment?.location) {
      return { strategy: 'new_sequence' };
    }

    // Check for explicit chain reference
    if (shot.chainRef) {
      return {
        strategy: 'chain_from_previous',
        fromShot: shot.chainRef.fromShot,
        useFrame: shot.chainRef.useFrame
      };
    }

    // Default: chain from previous
    const prevShot = previousShots[previousShots.length - 1];
    return {
      strategy: 'chain_from_previous',
      fromShot: prevShot.id,
      useFrame: -1 // Last frame
    };
  },

  analyzeContinuity(shot: any, previousShots: any[]): {
    score: number;
    issues: string[];
    checklist: { item: string; passed: boolean }[];
  } {
    if (previousShots.length === 0) {
      return {
        score: 10,
        issues: [],
        checklist: [
          { item: 'First shot - no continuity requirements', passed: true }
        ]
      };
    }

    const prevShot = previousShots[previousShots.length - 1];
    const issues: string[] = [];
    const checklist: { item: string; passed: boolean }[] = [];
    let score = 10;

    // Check location
    const locationMatch = shot.environment?.location === prevShot.environment?.location;
    checklist.push({ item: 'Location matches', passed: locationMatch });
    if (!locationMatch) {
      issues.push('Location changed - may need transition');
      score -= 2;
    }

    // Check lighting (if specified)
    if (shot.environment?.lighting && prevShot.environment?.lighting) {
      const lightingMatch = shot.environment.lighting === prevShot.environment.lighting;
      checklist.push({ item: 'Lighting matches', passed: lightingMatch });
      if (!lightingMatch) {
        issues.push('Lighting direction changed - add explicit lighting lock');
        score -= 1;
      }
    }

    // Check character (if same character)
    if (shot.subject?.who === prevShot.subject?.who) {
      checklist.push({ item: 'Same character', passed: true });
    }

    // Check time of day
    if (shot.environment?.timeOfDay && prevShot.environment?.timeOfDay) {
      const timeMatch = shot.environment.timeOfDay === prevShot.environment.timeOfDay;
      checklist.push({ item: 'Time of day matches', passed: timeMatch });
      if (!timeMatch) {
        issues.push('Time of day changed within scene');
        score -= 2;
      }
    }

    return { score: Math.max(0, score), issues, checklist };
  },

  determineDirectionLock(shot: any, previousShots: any[]): string | null {
    if (previousShots.length === 0) return null;

    const prevShot = previousShots[previousShots.length - 1];

    // If same character in both shots
    if (shot.subject?.who === prevShot.subject?.who) {
      // Check if we have direction info
      if (prevShot.subject?.bodyAction?.includes('right') || prevShot.subject?.bodyAction?.includes('left')) {
        const direction = prevShot.subject.bodyAction.includes('right') ? 'RIGHT' : 'LEFT';
        return `Character facing ${direction} - maintain same direction`;
      }
    }

    return null;
  },

  determineEnvironmentLock(shot: any, previousShots: any[]): string | null {
    if (previousShots.length === 0) return null;

    const prevShot = previousShots[previousShots.length - 1];

    // If same location
    if (shot.environment?.location === prevShot.environment?.location) {
      const elements = prevShot.environment?.visibleElements || [];
      if (elements.length > 0) {
        return `Maintain environment: ${elements.slice(0, 3).join(', ')}`;
      }
    }

    return null;
  },

  selectColorLockPhrase(shot: any, previousShots: any[]): string {
    if (previousShots.length === 0) return '';

    const prevShot = previousShots[previousShots.length - 1];

    // Same character in same scene
    if (shot.subject?.who === prevShot.subject?.who &&
        shot.environment?.location === prevShot.environment?.location) {
      return COLOR_LOCK_PHRASES.sameCharacter;
    }

    // Same scene, different character or angle
    if (shot.environment?.location === prevShot.environment?.location) {
      return COLOR_LOCK_PHRASES.sameScene;
    }

    // Different scene
    return '';
  },

  detectDirectionFlip(shot: any, previousShots: any[]): boolean {
    if (previousShots.length === 0) return false;

    // Check camera angle changes that might flip direction
    const prevShot = previousShots[previousShots.length - 1];

    if (shot.camera?.movement === 'orbit' ||
        shot.camera?.framing?.includes('reverse') ||
        shot.camera?.angle?.includes('over_shoulder')) {
      return true;
    }

    return false;
  },

  getFrameExtractionCommand(fromShot?: string): string {
    if (!fromShot) return '';
    return `ffmpeg -sseof -0.1 -i ${fromShot}.mp4 -frames:v 1 -q:v 2 ${fromShot}_last_frame.jpg`;
  },

  getPromptModifications(
    colorLock: string,
    directionLock: string | null,
    environmentLock: string | null
  ): string[] {
    const modifications: string[] = [];

    if (colorLock) {
      modifications.push(`Prepend: "${colorLock}"`);
    }

    if (directionLock) {
      modifications.push(`Add: "${directionLock}"`);
    }

    if (environmentLock) {
      modifications.push(`Include: "${environmentLock}"`);
    }

    return modifications;
  }
};

export default productionAgent;
