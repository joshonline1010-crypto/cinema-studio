// Visual Agent - Director Style & Cinematography Specialist
import type { CouncilAgent, AgentDecision, AgentResponse, ShotContext, DirectorDecisionSystem } from './types';

const VISUAL_SYSTEM_PROMPT = `You are the VISUAL AGENT - a specialist in cinematography, director styles, and visual storytelling.

YOUR EXPERTISE:
- Director decision frameworks (THE 5 QUESTIONS)
- Camera angles, movements, and framing
- Lens selection and focal lengths
- Lighting styles and color palettes
- Composition rules (rule of thirds, symmetry, etc.)

THE 5 QUESTIONS (Director Decision Framework):
1. POWER: "Who has the power in this moment?"
2. AUDIENCE EXPECT: "What does audience think will happen?"
3. INFORMATION HOLD: "What am I not showing - and how long?"
4. TIME MANIP: "Can I make this moment last longer/shorter?"
5. SIMPLICITY: "Simple or complex setup?"

DIRECTOR STYLES:
- KUBRICK: Centered symmetrical, sterile geometric, desaturated cold, holds shots 5-10s longer
- SPIELBERG: Rule of thirds, teal-orange, dynamic camera, emotional crescendos
- FINCHER: Gritty decay, desaturated, methodical movement, controlled lighting
- NOLAN: Wide negative space, IMAX scale, practical effects, time manipulation
- VILLENEUVE: Vast landscapes, desaturated cold, slow deliberate pacing
- WES ANDERSON: Perfect symmetry, pastel colors, dollhouse whimsy, flat staging
- TARANTINO: Low angles, long takes, sudden violence, pop culture references

CAMERA MOVEMENTS:
- DOLLY IN/OUT: Emotional intensity change
- PUSH-IN: Building tension, focus on subject
- ORBIT: Revealing space, following action
- PAN: Following horizontal action
- TILT: Revealing vertical scale
- TRACKING: Following character movement
- HANDHELD: Documentary feel, urgency
- STEADICAM: Smooth following, Kubrick style
- CRANE: Establishing, revealing scale
- STATIC: Tension through stillness

OUTPUT FORMAT:
{
  "director": "kubrick|spielberg|fincher|etc",
  "shotType": "ECU|CU|MCU|MS|WS|EWS",
  "framing": "centered|rule_of_thirds|wide_negative_space",
  "cameraMovement": "static|dolly_in|orbit|etc",
  "lighting": "natural|three_point|rembrandt|etc",
  "colorPalette": "desaturated_cold|teal_orange|etc",
  "directorReasoning": ["reason1", "reason2"]
}`;

// Director presets for quick lookup
const DIRECTOR_PRESETS: Record<string, Partial<DirectorDecisionSystem>> = {
  kubrick: {
    name: 'Stanley Kubrick',
    style: 'centered-symmetrical',
    colorPalette: 'desaturated-cold',
    framingStyle: 'centered-symmetrical',
    setDesign: 'sterile-geometric',
    neverDo: ['handheld unless intentional', 'warm colors', 'fast cuts during tension']
  },
  spielberg: {
    name: 'Steven Spielberg',
    style: 'dynamic-emotional',
    colorPalette: 'teal-orange',
    framingStyle: 'rule-of-thirds',
    setDesign: 'retro-americana',
    neverDo: ['static during action', 'cold detachment', 'symmetry without purpose']
  },
  fincher: {
    name: 'David Fincher',
    style: 'methodical-controlled',
    colorPalette: 'desaturated-cold',
    framingStyle: 'rule-of-thirds',
    setDesign: 'gritty-decay',
    neverDo: ['handheld', 'warm lighting', 'fast unmotivated cuts']
  },
  nolan: {
    name: 'Christopher Nolan',
    style: 'epic-scale',
    colorPalette: 'teal-orange',
    framingStyle: 'wide-negative-space',
    setDesign: 'sci-fi-industrial',
    neverDo: ['CGI when practical works', 'small scale', 'linear storytelling only']
  },
  villeneuve: {
    name: 'Denis Villeneuve',
    style: 'vast-contemplative',
    colorPalette: 'desaturated-cold',
    framingStyle: 'wide-negative-space',
    setDesign: 'vast-landscapes',
    neverDo: ['fast pacing', 'bright colors', 'constant dialogue']
  },
  wes_anderson: {
    name: 'Wes Anderson',
    style: 'symmetrical-whimsy',
    colorPalette: 'pastel-warm',
    framingStyle: 'centered-symmetrical',
    setDesign: 'dollhouse-whimsy',
    neverDo: ['handheld', 'desaturated colors', 'realistic chaos']
  },
  tarantino: {
    name: 'Quentin Tarantino',
    style: 'dialogue-violence',
    colorPalette: 'saturated-pop',
    framingStyle: 'low-angle-power',
    setDesign: 'retro-americana',
    neverDo: ['rush dialogue scenes', 'subtle violence', 'boring conversations']
  },
  edgar_wright: {
    name: 'Edgar Wright',
    style: 'kinetic-comedy',
    colorPalette: 'desaturated-british',
    framingStyle: 'quick-cuts',
    setDesign: 'everyday-british',
    neverDo: ['slow transitions', 'long static shots', 'serious tone only']
  }
};

export const visualAgent: CouncilAgent = {
  name: 'Visual Agent',
  domain: 'visual',
  icon: '🎬',
  color: 'blue',
  systemPrompt: VISUAL_SYSTEM_PROMPT,
  knowledgeBases: [
    'director-decision-systems',
    'cinematography-vocabulary',
    'movie-shots-database'
  ],

  async evaluate(context: ShotContext): Promise<AgentDecision> {
    const { shot, previousShots, plan, userPrompt, director } = context;

    // Determine director style
    const detectedDirector = director || this.detectDirectorFromPrompt(userPrompt);
    const directorPreset = DIRECTOR_PRESETS[detectedDirector] || DIRECTOR_PRESETS.spielberg;

    // Apply THE 5 QUESTIONS
    const fiveQuestions = this.applyFiveQuestions(context, directorPreset);

    // Determine shot type based on emotional intensity and beat
    const shotType = this.determineShotType(context);

    // Determine camera movement
    const cameraMovement = this.determineCameraMovement(context, directorPreset);

    // Determine framing
    const framing = directorPreset.framingStyle || 'rule-of-thirds';

    // Determine lighting
    const lighting = this.determineLighting(context);

    // Build reasoning
    const reasoning = [
      `Director approach: ${directorPreset.name}`,
      `Shot type: ${shotType} (${this.shotTypeExplanation(shotType)})`,
      `Camera movement: ${cameraMovement}`,
      `Framing: ${framing}`,
      `Color palette: ${directorPreset.colorPalette}`,
      ...fiveQuestions.reasoning
    ];

    // Check for warnings (things director would never do)
    const warnings: string[] = [];
    if (directorPreset.neverDo) {
      for (const neverDo of directorPreset.neverDo) {
        if (this.checkViolation(context, neverDo)) {
          warnings.push(`Warning: ${neverDo} - not typical for ${directorPreset.name}`);
        }
      }
    }

    return {
      agent: 'visual',
      recommendation: {
        director: detectedDirector,
        shotType,
        framing,
        cameraMovement,
        lighting,
        colorPalette: directorPreset.colorPalette,
        fiveQuestionsAnalysis: fiveQuestions,
        suggestedPromptElements: this.buildPromptElements(shotType, framing, cameraMovement, lighting, directorPreset)
      },
      confidence: warnings.length > 0 ? 0.75 : 0.88,
      reasoning,
      sources: ['director-decision-systems', 'cinematography-rules'],
      warnings: warnings.length > 0 ? warnings : undefined
    };
  },

  async query(question: string, context: any): Promise<AgentResponse> {
    const questionLower = question.toLowerCase();

    // Director lookup
    if (questionLower.includes('director') || questionLower.includes('style')) {
      const directorName = this.extractDirectorName(question);
      if (directorName && DIRECTOR_PRESETS[directorName]) {
        return {
          agent: 'visual',
          answer: DIRECTOR_PRESETS[directorName],
          confidence: 0.95,
          sources: ['director-presets-database']
        };
      }
    }

    // Shot type recommendation
    if (questionLower.includes('shot') && questionLower.includes('emotion')) {
      const emotion = context.emotion || 'neutral';
      const shotType = this.shotTypeForEmotion(emotion);
      return {
        agent: 'visual',
        answer: { shotType, explanation: `For ${emotion}, use ${shotType}` },
        confidence: 0.85,
        sources: ['cinematography-emotion-rules']
      };
    }

    return {
      agent: 'visual',
      answer: { message: 'Query not recognized. Try asking about director styles or shot types.' },
      confidence: 0.5,
      sources: []
    };
  },

  // Helper methods
  detectDirectorFromPrompt(prompt: string): string {
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('symmetr') || promptLower.includes('kubrick')) return 'kubrick';
    if (promptLower.includes('epic') || promptLower.includes('nolan') || promptLower.includes('imax')) return 'nolan';
    if (promptLower.includes('whimsy') || promptLower.includes('wes anderson') || promptLower.includes('pastel')) return 'wes_anderson';
    if (promptLower.includes('gritty') || promptLower.includes('fincher') || promptLower.includes('dark')) return 'fincher';
    if (promptLower.includes('vast') || promptLower.includes('villeneuve') || promptLower.includes('dune')) return 'villeneuve';
    if (promptLower.includes('dialogue') || promptLower.includes('tarantino')) return 'tarantino';
    if (promptLower.includes('quick cut') || promptLower.includes('edgar wright') || promptLower.includes('comedy')) return 'edgar_wright';

    return 'spielberg'; // Default
  },

  applyFiveQuestions(context: ShotContext, directorPreset: any): { reasoning: string[], decisions: any } {
    const { shot, userPrompt } = context;
    const reasoning: string[] = [];
    const decisions: any = {};

    // 1. POWER
    if (userPrompt.toLowerCase().includes('hero') || userPrompt.toLowerCase().includes('protagonist')) {
      decisions.power = 'character';
      reasoning.push('Power: Character dominates the frame');
    } else if (userPrompt.toLowerCase().includes('building') || userPrompt.toLowerCase().includes('landscape')) {
      decisions.power = 'environment';
      reasoning.push('Power: Environment/architecture dominates');
    } else {
      decisions.power = 'balanced';
      reasoning.push('Power: Balanced between subject and environment');
    }

    // 2. AUDIENCE EXPECT
    decisions.audienceExpect = 'standard';
    reasoning.push('Audience: Fulfilling genre expectations');

    // 3. INFORMATION HOLD
    decisions.informationHold = 'reveal';
    reasoning.push('Information: Revealing key visual information');

    // 4. TIME MANIP
    if (directorPreset.name === 'Stanley Kubrick') {
      decisions.timeManip = 'extend';
      reasoning.push('Time: Hold shot longer than expected (Kubrick style)');
    } else {
      decisions.timeManip = 'standard';
      reasoning.push('Time: Standard pacing for beat');
    }

    // 5. SIMPLICITY
    decisions.simplicity = 'moderate';
    reasoning.push('Simplicity: Moderate complexity - clear subject with supporting elements');

    return { reasoning, decisions };
  },

  determineShotType(context: ShotContext): string {
    const { userPrompt, previousShots } = context;
    const promptLower = userPrompt.toLowerCase();

    // Keyword detection
    if (promptLower.includes('closeup') || promptLower.includes('face') || promptLower.includes('emotion')) {
      return 'CU';
    }
    if (promptLower.includes('extreme close') || promptLower.includes('detail') || promptLower.includes('eyes')) {
      return 'ECU';
    }
    if (promptLower.includes('wide') || promptLower.includes('establishing') || promptLower.includes('landscape')) {
      return 'WS';
    }
    if (promptLower.includes('extreme wide') || promptLower.includes('epic') || promptLower.includes('vast')) {
      return 'EWS';
    }

    // Position-based default
    if (previousShots.length === 0) return 'WS'; // Start wide
    if (previousShots.length === 1) return 'MS'; // Then medium

    return 'MCU'; // Default to medium close-up
  },

  determineCameraMovement(context: ShotContext, directorPreset: any): string {
    const { userPrompt } = context;
    const promptLower = userPrompt.toLowerCase();

    // Keyword detection
    if (promptLower.includes('dolly') || promptLower.includes('push in') || promptLower.includes('approach')) {
      return 'dolly_in';
    }
    if (promptLower.includes('pull') || promptLower.includes('reveal') || promptLower.includes('zoom out')) {
      return 'dolly_out';
    }
    if (promptLower.includes('orbit') || promptLower.includes('around')) {
      return 'orbit';
    }
    if (promptLower.includes('pan') || promptLower.includes('follow')) {
      return 'pan';
    }
    if (promptLower.includes('handheld') || promptLower.includes('documentary')) {
      return 'handheld';
    }
    if (promptLower.includes('steadicam') || promptLower.includes('smooth follow')) {
      return 'steadicam';
    }

    // Director-based default
    if (directorPreset.name === 'Stanley Kubrick') return 'steadicam';
    if (directorPreset.name === 'Edgar Wright') return 'whip_pan';

    return 'static';
  },

  determineLighting(context: ShotContext): string {
    const { userPrompt } = context;
    const promptLower = userPrompt.toLowerCase();

    if (promptLower.includes('noir') || promptLower.includes('shadow')) return 'film_noir';
    if (promptLower.includes('sunset') || promptLower.includes('golden')) return 'golden_hour';
    if (promptLower.includes('neon') || promptLower.includes('cyberpunk')) return 'neon';
    if (promptLower.includes('natural') || promptLower.includes('daylight')) return 'natural';
    if (promptLower.includes('dramatic') || promptLower.includes('spotlight')) return 'dramatic';

    return 'three_point'; // Default
  },

  shotTypeExplanation(shotType: string): string {
    const explanations: Record<string, string> = {
      'ECU': 'Extreme close-up for intimate detail',
      'CU': 'Close-up for emotional connection',
      'MCU': 'Medium close-up for dialogue/reaction',
      'MS': 'Medium shot for body language',
      'WS': 'Wide shot for context/establishing',
      'EWS': 'Extreme wide for epic scale'
    };
    return explanations[shotType] || 'Standard framing';
  },

  shotTypeForEmotion(emotion: string): string {
    const emotionToShot: Record<string, string> = {
      'intimate': 'ECU',
      'emotional': 'CU',
      'conversational': 'MCU',
      'active': 'MS',
      'establishing': 'WS',
      'epic': 'EWS',
      'menacing': 'CU',
      'awe': 'EWS'
    };
    return emotionToShot[emotion] || 'MS';
  },

  buildPromptElements(shotType: string, framing: string, movement: string, lighting: string, directorPreset: any): string[] {
    const elements: string[] = [];

    elements.push(`${shotType} shot`);
    elements.push(`${framing.replace(/_/g, ' ')} composition`);
    if (movement !== 'static') elements.push(`${movement.replace(/_/g, ' ')} camera movement`);
    elements.push(`${lighting.replace(/_/g, ' ')} lighting`);
    if (directorPreset.colorPalette) elements.push(`${directorPreset.colorPalette.replace(/_/g, ' ')} color grade`);

    return elements;
  },

  extractDirectorName(question: string): string | null {
    const directors = Object.keys(DIRECTOR_PRESETS);
    const questionLower = question.toLowerCase();

    for (const director of directors) {
      if (questionLower.includes(director.replace('_', ' '))) {
        return director;
      }
    }
    return null;
  },

  checkViolation(context: ShotContext, neverDo: string): boolean {
    const { userPrompt } = context;
    const promptLower = userPrompt.toLowerCase();
    const neverDoLower = neverDo.toLowerCase();

    // Simple keyword matching
    if (neverDoLower.includes('handheld') && promptLower.includes('handheld')) return true;
    if (neverDoLower.includes('warm') && promptLower.includes('warm')) return true;
    if (neverDoLower.includes('fast') && promptLower.includes('fast')) return true;

    return false;
  }
};

export default visualAgent;
