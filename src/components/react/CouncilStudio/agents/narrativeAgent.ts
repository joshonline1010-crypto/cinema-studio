// Narrative Agent - Story Structure & Beat Specialist
import type { CouncilAgent, AgentDecision, AgentResponse, ShotContext } from './types';

const NARRATIVE_SYSTEM_PROMPT = `You are the NARRATIVE AGENT - a specialist in story structure, pacing, and emotional arcs.

YOUR EXPERTISE:
- Save-the-Cat beat structure (Opening Image, Theme Stated, Setup, Catalyst, Debate, Break Into Two, B Story, Fun and Games, Midpoint, Bad Guys Close In, All Is Lost, Dark Night of Soul, Break Into Three, Finale, Final Image)
- Duration to shot count mappings
- Emotional escalation patterns
- Genre-specific pacing rules
- Commercial structure (Hook → Story → Hero → Tagline)

YOUR ROLE IN THE COUNCIL:
1. Analyze the narrative beat of each shot
2. Recommend shot count based on duration
3. Suggest emotional intensity progression
4. Ensure story coherence across shots
5. Flag pacing issues

DURATION TO SHOT COUNT RULES:
- 10-15 seconds = 2-3 shots @ 5s each
- 30 seconds = 5-6 shots @ 5s each
- 60 seconds = 10-12 shots @ 5s each
- 90 seconds = 15-18 shots

EMOTIONAL ARC PATTERNS:
- ESCALATING: subtle → medium → strong → extreme
- CONTRAST: strong → calm → explosive
- WAVE: medium → strong → medium → extreme

OUTPUT FORMAT:
{
  "beat": "catalyst|midpoint|climax|etc",
  "emotionalIntensity": "subtle|medium|strong|extreme",
  "shotCountRecommendation": number,
  "pacingNote": "string",
  "emotionalArc": "string describing progression"
}`;

export const narrativeAgent: CouncilAgent = {
  name: 'Narrative Agent',
  domain: 'narrative',
  icon: '📖',
  color: 'purple',
  systemPrompt: NARRATIVE_SYSTEM_PROMPT,
  knowledgeBases: [
    'save-the-cat-beats',
    'genre-pacing-rules',
    'emotional-escalation-patterns'
  ],

  async evaluate(context: ShotContext): Promise<AgentDecision> {
    const { shot, previousShots = [], plan } = context;
    const userPrompt = context.userPrompt || '';

    // Analyze narrative position
    const shotPosition = previousShots.length + 1;
    const totalShots = plan?.shots?.length || shotPosition;
    const progressPercent = (shotPosition / totalShots) * 100;

    // Determine narrative beat based on position
    let beat = 'setup';
    let emotionalIntensity: 'subtle' | 'medium' | 'strong' | 'extreme' = 'medium';

    if (progressPercent <= 10) {
      beat = 'opening_image';
      emotionalIntensity = 'subtle';
    } else if (progressPercent <= 15) {
      beat = 'theme_stated';
      emotionalIntensity = 'subtle';
    } else if (progressPercent <= 25) {
      beat = 'catalyst';
      emotionalIntensity = 'medium';
    } else if (progressPercent <= 50) {
      beat = 'fun_and_games';
      emotionalIntensity = 'medium';
    } else if (progressPercent <= 55) {
      beat = 'midpoint';
      emotionalIntensity = 'strong';
    } else if (progressPercent <= 75) {
      beat = 'bad_guys_close_in';
      emotionalIntensity = 'strong';
    } else if (progressPercent <= 80) {
      beat = 'all_is_lost';
      emotionalIntensity = 'extreme';
    } else if (progressPercent <= 90) {
      beat = 'break_into_three';
      emotionalIntensity = 'strong';
    } else {
      beat = 'finale';
      emotionalIntensity = 'extreme';
    }

    // Check for keywords that override beat detection
    const promptLower = userPrompt.toLowerCase();
    if (promptLower.includes('explosion') || promptLower.includes('climax') || promptLower.includes('final')) {
      beat = 'finale';
      emotionalIntensity = 'extreme';
    } else if (promptLower.includes('reveal') || promptLower.includes('twist')) {
      beat = 'midpoint';
      emotionalIntensity = 'strong';
    } else if (promptLower.includes('calm') || promptLower.includes('peaceful')) {
      emotionalIntensity = 'subtle';
    }

    // Analyze previous shots for emotional arc
    const emotionalArc = this.analyzeEmotionalArc(previousShots, emotionalIntensity);

    // Check pacing
    const pacingIssues = this.checkPacing(previousShots, shot);

    const reasoning = [
      `Shot ${shotPosition}/${totalShots} (${Math.round(progressPercent)}% through story)`,
      `Narrative beat: ${beat.replace(/_/g, ' ').toUpperCase()}`,
      `Emotional intensity: ${emotionalIntensity}`,
      `Emotional arc: ${emotionalArc}`
    ];

    if (pacingIssues.length > 0) {
      reasoning.push(`Pacing concerns: ${pacingIssues.join(', ')}`);
    }

    return {
      agent: 'narrative',
      recommendation: {
        beat,
        emotionalIntensity,
        shotPosition,
        totalShots,
        emotionalArc,
        pacingNote: pacingIssues.length > 0 ? pacingIssues[0] : 'Pacing looks good'
      },
      confidence: pacingIssues.length > 0 ? 0.7 : 0.9,
      reasoning,
      sources: ['save-the-cat-structure', 'emotional-arc-analysis'],
      warnings: pacingIssues.length > 0 ? pacingIssues : undefined
    };
  },

  async query(question: string, context: any): Promise<AgentResponse> {
    // Simple query handling for specific narrative questions
    const questionLower = question.toLowerCase();

    if (questionLower.includes('beat') && questionLower.includes('after')) {
      const beats = ['opening_image', 'theme_stated', 'setup', 'catalyst', 'debate',
                     'break_into_two', 'fun_and_games', 'midpoint', 'bad_guys_close_in',
                     'all_is_lost', 'dark_night', 'break_into_three', 'finale', 'final_image'];

      const currentBeat = context.currentBeat || 'setup';
      const currentIndex = beats.indexOf(currentBeat);
      const nextBeat = currentIndex < beats.length - 1 ? beats[currentIndex + 1] : 'final_image';

      return {
        agent: 'narrative',
        answer: { nextBeat, explanation: `After ${currentBeat}, the story moves to ${nextBeat}` },
        confidence: 0.95,
        sources: ['save-the-cat-structure']
      };
    }

    if (questionLower.includes('shot count') || questionLower.includes('how many shots')) {
      const duration = context.duration || 30;
      const shotCount = Math.ceil(duration / 5);

      return {
        agent: 'narrative',
        answer: {
          shotCount,
          explanation: `For ${duration}s duration, recommend ${shotCount} shots @ 5s each`
        },
        confidence: 0.9,
        sources: ['duration-mapping-rules']
      };
    }

    return {
      agent: 'narrative',
      answer: { message: 'Query not recognized. Try asking about beats or shot counts.' },
      confidence: 0.5,
      sources: []
    };
  },

  // Helper methods
  analyzeEmotionalArc(previousShots: any[], currentIntensity: string): string {
    if (previousShots.length === 0) return 'Starting fresh';

    // Simple arc description
    const intensityLevels = ['subtle', 'medium', 'strong', 'extreme'];
    const currentLevel = intensityLevels.indexOf(currentIntensity);

    if (currentLevel <= 1) return 'Building tension slowly';
    if (currentLevel === 2) return 'Approaching peak intensity';
    return 'At maximum intensity - climax moment';
  },

  checkPacing(previousShots: any[], currentShot: any): string[] {
    const issues: string[] = [];

    // Check if too many similar shots in a row
    if (previousShots.length >= 3) {
      const recentDurations = previousShots.slice(-3).map(s => s.duration);
      if (recentDurations.every(d => d === currentShot.duration)) {
        issues.push('Consider varying shot duration for better rhythm');
      }
    }

    // Check for extreme intensity too early
    const shotPosition = previousShots.length + 1;
    if (shotPosition <= 3 && currentShot.emotionalIntensity === 'extreme') {
      issues.push('Extreme intensity too early - save for climax');
    }

    return issues;
  }
};

export default narrativeAgent;
