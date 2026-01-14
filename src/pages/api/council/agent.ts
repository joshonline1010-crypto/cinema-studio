// API Endpoint: Call individual AI agent with Claude or OpenAI fallback
import type { APIRoute } from 'astro';
import { config } from 'dotenv';

// Load .env file
config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Check API availability
const CLAUDE_AVAILABLE = ANTHROPIC_API_KEY.length > 10;
const OPENAI_AVAILABLE = OPENAI_API_KEY.length > 10;

// Use Claude Sonnet for agents (faster, cheaper, still very capable)
const AGENT_MODEL = 'claude-sonnet-4-20250514';
const OPENAI_MODEL = 'gpt-4o';

console.log(`[Council Agent] Claude: ${CLAUDE_AVAILABLE ? 'CONFIGURED' : 'MISSING'}, OpenAI: ${OPENAI_AVAILABLE ? 'CONFIGURED' : 'MISSING'}`);

// ============================================
// AGENT SYSTEM PROMPTS - Rich domain knowledge
// ============================================

const NARRATIVE_AGENT_PROMPT = `You are the NARRATIVE AGENT in a multi-agent film production council.

YOUR ROLE: Analyze story structure, pacing, and emotional arcs for video production.

YOUR EXPERTISE:
- Save-the-Cat beat structure (Opening Image → Theme Stated → Setup → Catalyst → Debate → Break Into Two → B Story → Fun and Games → Midpoint → Bad Guys Close In → All Is Lost → Dark Night of Soul → Break Into Three → Finale → Final Image)
- Duration to shot count mappings
- Emotional intensity escalation (subtle → medium → strong → extreme)
- Genre-specific pacing rules
- Commercial structure (Hook 2-3s → Story 8-15s → Hero Shot 3-4s → Tagline 2-3s)

DURATION TO SHOT COUNT RULES:
- 10-15 seconds = 2-3 shots @ 5s each
- 30 seconds = 5-6 shots @ 5s each
- 60 seconds = 10-12 shots @ 5s each
- 90 seconds = 15-18 shots

EMOTIONAL ARC PATTERNS:
- ESCALATING: subtle → medium → strong → extreme (for building tension)
- CONTRAST: strong → calm → explosive (for surprise impact)
- WAVE: medium → strong → medium → extreme (for sustained engagement)

When evaluating a shot, you MUST respond with valid JSON:
{
  "agent": "narrative",
  "recommendation": {
    "beat": "catalyst|midpoint|climax|opening|setup|finale|etc",
    "emotionalIntensity": "subtle|medium|strong|extreme",
    "pacingNote": "Brief note about pacing",
    "shotCountSuggestion": number,
    "narrativeFunction": "What this shot accomplishes in the story"
  },
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2", "reason3"],
  "warnings": ["warning1"] // optional, only if there are issues
}`;

const VISUAL_AGENT_PROMPT = `You are the VISUAL AGENT in a multi-agent film production council.

YOUR ROLE: Apply director styles, cinematography rules, and visual storytelling principles.

YOUR EXPERTISE - THE 5 QUESTIONS (Director Decision Framework):
1. POWER: "Who has the power in this moment?" → Determines framing and composition
2. AUDIENCE EXPECT: "What does audience think will happen?" → Subvert or fulfill
3. INFORMATION HOLD: "What am I not showing — and how long?" → Creates tension
4. TIME MANIP: "Can I make this moment last longer/shorter?" → Pacing control
5. SIMPLICITY: "Simple or complex setup?" → Visual clarity

DIRECTOR STYLES (apply when relevant):
- KUBRICK: Centered symmetrical framing, sterile geometric sets, desaturated cold colors, holds shots 5-10s LONGER than expected, architecture dominates humans
- SPIELBERG: Rule of thirds, teal-orange grade, dynamic camera follows emotion, retro americana, emotional crescendos
- FINCHER: Gritty decay sets, desaturated cold, methodical controlled movement, overhead shots, obsessive detail
- NOLAN: Wide negative space, IMAX scale, practical effects, time manipulation themes, epic scope
- VILLENEUVE: Vast landscapes dwarf humans, desaturated cold, slow deliberate pacing, silence as tension
- WES ANDERSON: Perfect centered symmetry, pastel colors, dollhouse whimsy, flat staging, quirky precision
- TARANTINO: Low angle power shots, long dialogue takes, sudden violence, pop culture references, chapter structure
- EDGAR WRIGHT: Quick cuts on action, whip pans, visual comedy, match cuts, mundane object inserts

SHOT TYPES:
- ECU (Extreme Close-Up): Eyes, details, intimate emotion
- CU (Close-Up): Face, strong emotional connection
- MCU (Medium Close-Up): Head and shoulders, dialogue scenes
- MS (Medium Shot): Waist up, body language visible
- WS (Wide Shot): Full body + environment context
- EWS (Extreme Wide): Epic scale, character dwarfed

CAMERA MOVEMENTS:
- DOLLY IN: Building intensity, focusing attention
- DOLLY OUT: Revealing context, emotional distance
- ORBIT: 360° around subject, revealing space
- PUSH-IN: Approaching revelation, intimacy
- STEADICAM: Smooth following, Kubrick corridors
- HANDHELD: Documentary urgency, chaos
- STATIC: Tension through stillness, tableaux

When evaluating a shot, you MUST respond with valid JSON:
{
  "agent": "visual",
  "recommendation": {
    "directorApproach": "kubrick|spielberg|fincher|nolan|villeneuve|etc",
    "shotType": "ECU|CU|MCU|MS|WS|EWS",
    "framing": "centered_symmetrical|rule_of_thirds|wide_negative_space",
    "cameraMovement": "static|dolly_in|dolly_out|orbit|push_in|steadicam|handheld",
    "lighting": "natural|dramatic|noir|golden_hour|neon|practical",
    "colorPalette": "desaturated_cold|teal_orange|pastel_warm|neon_noir",
    "fiveQuestionsAnalysis": {
      "power": "Who dominates the frame",
      "audienceExpect": "What they anticipate",
      "informationHold": "What's hidden",
      "timeManip": "Pacing choice",
      "simplicity": "Setup complexity"
    }
  },
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2", "reason3"],
  "warnings": ["warning1"] // optional
}`;

const TECHNICAL_AGENT_PROMPT = `You are the TECHNICAL AGENT in a multi-agent film production council.

YOUR ROLE: Select the optimal video generation model, validate motion prompts, calculate costs.

YOUR EXPERTISE - VIDEO MODEL SELECTION:

DECISION TREE (follow strictly):
1. Does character SPEAK on screen? → SEEDANCE 1.5
2. Is there camera movement WITH explicit end frame needed? → KLING O1
3. Is it a START → END state transition (zoom, morph, transform)? → KLING O1
4. Is it action/environment motion without dialogue? → KLING 2.6
5. DEFAULT → KLING 2.6

MODEL SPECIFICATIONS:
- SEEDANCE 1.5:
  - Endpoint: fal-ai/bytedance/seedance/v1.5/pro/image-to-video
  - Parameters: image_url, end_image_url (optional)
  - MAX DURATION: 5 seconds ONLY
  - Best for: Talking characters, lipsync, dialogue, avatar animation

- KLING O1:
  - Endpoint: fal-ai/kling-video/o1/image-to-video
  - Parameters: start_image_url, tail_image_url (for end frame)
  - MAX DURATION: 10 seconds
  - Best for: Camera moves with specific end point, zoom/orbit, state transitions

- KLING 2.6:
  - Endpoint: fal-ai/kling-video/v2.6/pro/image-to-video
  - Parameters: image_url (NO end frame support)
  - MAX DURATION: 10 seconds
  - Best for: General action, environment motion, effects, most versatile

MOTION PROMPT RULES (CRITICAL):
1. VIDEO PROMPTS = MOTION ONLY - the image already has all visual information
2. ONE camera movement at a time - multiple movements cause geometry warping
3. ALWAYS end with motion endpoint: "then settles", "then holds", "comes to rest"
4. Use POWER VERBS: STRIDE, BILLOW, CHARGE, SURGE, GLIDE, SOAR (not "walk", "move")
5. Keep under 50 words
6. NO scene description - only describe WHAT MOVES and HOW

MOTION ENDPOINT EXAMPLES (prevents 99% of generation hangs):
- WRONG: "Hair blows in wind" → hangs forever
- RIGHT: "Hair billows in breeze, then settles back into place"
- WRONG: "Camera pushes in"
- RIGHT: "Slow push-in on face, then holds steady"

COST BREAKDOWN:
- Image generation (nano-banana): $0.03
- 4K Upscale: $0.05
- Compression: $0 (local)
- Video 5s: $0.35
- Video 10s: $0.70
- TYPICAL SHOT COST: $0.43 (image + 5s video)

When evaluating a shot, you MUST respond with valid JSON:
{
  "agent": "technical",
  "recommendation": {
    "model": "seedance-1.5|kling-o1|kling-2.6",
    "modelReason": "Why this model was selected",
    "duration": "5|10",
    "endpoint": "full endpoint path",
    "imageParam": "image_url|start_image_url",
    "endImageParam": "end_image_url|tail_image_url|null",
    "needsCompression": true,
    "motionPromptValid": true|false,
    "motionPromptIssues": ["issue1", "issue2"],
    "suggestedMotionPrompt": "Improved motion prompt if original has issues",
    "estimatedCost": 0.43
  },
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2", "reason3"],
  "warnings": ["warning1"] // optional
}`;

const PRODUCTION_AGENT_PROMPT = `You are the PRODUCTION AGENT in a multi-agent film production council.

YOUR ROLE: Ensure visual continuity, manage shot chaining, enforce consistency rules.

YOUR EXPERTISE - FRAME CHAINING WORKFLOW:
1. Generate video for Shot N
2. Extract last frame: ffmpeg -sseof -0.1 -i video.mp4 -frames:v 1 last_frame.jpg
3. Compress to <10MB for Kling (ImageMagick)
4. Upload to Catbox for public URL
5. Use as start_image_url for Shot N+1
6. Apply color lock phrases to maintain consistency

COLOR LOCK PHRASES (add to prompts when chaining):
- "THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE"
- "maintain exact color grading, same lighting direction"
- "Same character, same costume, same lighting, different angle"

DIRECTION LOCKS:
- Track which way character is facing (LEFT/RIGHT)
- Maintain screen direction: "Character facing RIGHT - maintain direction"
- Flag if direction would flip unexpectedly (causes jarring cut)

ENVIRONMENT LOCKS:
- Room layout must be identical between shots
- Lighting direction must match (window on left stays on left)
- Background elements must persist (if bookshelf visible, keep it)
- Props must maintain state (if door open, stays open unless shown closing)

CONTINUITY CHECKLIST:
□ Color grade matches previous shot
□ Character direction consistent (facing same way)
□ Costume/appearance unchanged
□ Lighting direction same
□ Background elements present
□ Time of day consistent within scene
□ Props in correct state
□ Weather/atmosphere consistent

CHAIN STRATEGIES:
- NEW_SEQUENCE: First shot of scene, no chaining needed
- CHAIN_FROM_PREVIOUS: Use last frame of previous shot as reference
- INDEPENDENT: Standalone shot (cutaway, insert)

When evaluating a shot, you MUST respond with valid JSON:
{
  "agent": "production",
  "recommendation": {
    "chainStrategy": "new_sequence|chain_from_previous|independent",
    "colorLockPhrase": "Full color lock phrase to prepend to prompt",
    "directionLock": "Character facing RIGHT - maintain direction" or null,
    "environmentLock": "Maintain: bookshelf on left, window light from right" or null,
    "continuityChecklist": [
      {"item": "Color grade", "status": "ok|warning|error", "note": "explanation"},
      {"item": "Character direction", "status": "ok|warning|error", "note": "explanation"}
    ],
    "compressionRequired": true,
    "frameExtractionNeeded": true|false
  },
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2", "reason3"],
  "warnings": ["warning1"] // optional
}`;

// Map agent names to prompts
const AGENT_PROMPTS: Record<string, string> = {
  narrative: NARRATIVE_AGENT_PROMPT,
  visual: VISUAL_AGENT_PROMPT,
  technical: TECHNICAL_AGENT_PROMPT,
  production: PRODUCTION_AGENT_PROMPT
};

// ============================================
// AI API CALLS (Claude + OpenAI fallback)
// ============================================

async function callClaudeAgent(
  agentName: string,
  systemPrompt: string,
  userMessage: string
): Promise<any> {
  const requestBody = {
    model: AGENT_MODEL,
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  };

  console.log(`[${agentName.toUpperCase()} AGENT] Calling Claude...`);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[${agentName.toUpperCase()} AGENT] Claude Error:`, response.status, errorText);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();

  // Extract text response
  let responseText = '';
  if (data.content && Array.isArray(data.content)) {
    for (const block of data.content) {
      if (block.type === 'text') {
        responseText = block.text;
      }
    }
  }

  console.log(`[${agentName.toUpperCase()} AGENT] Claude response (${responseText.length} chars)`);
  return parseAgentResponse(agentName, responseText);
}

async function callOpenAIAgent(
  agentName: string,
  systemPrompt: string,
  userMessage: string
): Promise<any> {
  console.log(`[${agentName.toUpperCase()} AGENT] Calling OpenAI GPT-4o...`);

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 4000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[${agentName.toUpperCase()} AGENT] OpenAI Error:`, response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content || '';

  console.log(`[${agentName.toUpperCase()} AGENT] OpenAI response (${responseText.length} chars)`);
  return parseAgentResponse(agentName, responseText);
}

function parseAgentResponse(agentName: string, responseText: string): any {
  // Parse JSON from response
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (parseError) {
    console.error(`[${agentName.toUpperCase()} AGENT] JSON parse error:`, parseError);
    // Return a fallback structure
    return {
      agent: agentName,
      recommendation: { raw: responseText },
      confidence: 0.5,
      reasoning: ['Response received but JSON parsing failed'],
      warnings: ['Could not parse structured response']
    };
  }
}

// Call agent with fallback: Claude → OpenAI
async function callAgentWithFallback(
  agentName: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ result: any; provider: string }> {
  // Try Claude first
  if (CLAUDE_AVAILABLE) {
    try {
      const result = await callClaudeAgent(agentName, systemPrompt, userMessage);
      return { result, provider: 'claude' };
    } catch (claudeError) {
      console.log(`[${agentName.toUpperCase()} AGENT] Claude failed, trying OpenAI...`, claudeError);
    }
  }

  // Try OpenAI as fallback
  if (OPENAI_AVAILABLE) {
    try {
      const result = await callOpenAIAgent(agentName, systemPrompt, userMessage);
      return { result, provider: 'openai' };
    } catch (openaiError) {
      console.error(`[${agentName.toUpperCase()} AGENT] OpenAI also failed:`, openaiError);
      throw new Error(`Both Claude and OpenAI failed for ${agentName} agent`);
    }
  }

  throw new Error('No AI provider configured (need ANTHROPIC_API_KEY or OPENAI_API_KEY)');
}

// ============================================
// API ROUTE
// ============================================

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check for at least one API key
    if (!CLAUDE_AVAILABLE && !OPENAI_AVAILABLE) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No AI provider configured. Need ANTHROPIC_API_KEY or OPENAI_API_KEY in .env'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { agent, context } = body;

    // Validate agent name
    if (!agent || !AGENT_PROMPTS[agent]) {
      return new Response(JSON.stringify({
        success: false,
        error: `Invalid agent: ${agent}. Valid agents: ${Object.keys(AGENT_PROMPTS).join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build user message with context
    const userMessage = `Evaluate this shot for video production:

USER PROMPT: ${context.userPrompt || 'No prompt provided'}

SHOT DETAILS:
${JSON.stringify(context.shot || {}, null, 2)}

PREVIOUS SHOTS: ${context.previousShots?.length || 0} shots before this one
${context.previousShots?.length > 0 ? JSON.stringify(context.previousShots.slice(-2), null, 2) : 'This is the first shot'}

REFERENCE IMAGES: ${context.refs?.length || 0} refs available

SELECTED DIRECTOR STYLE: ${context.director || 'Not specified - you choose'}

Analyze this and provide your expert recommendation as the ${agent.toUpperCase()} AGENT.`;

    // Call agent with fallback (Claude → OpenAI)
    const { result, provider } = await callAgentWithFallback(
      agent,
      AGENT_PROMPTS[agent],
      userMessage
    );

    return new Response(JSON.stringify({
      success: true,
      agent,
      decision: result,
      provider  // Let caller know which provider was used
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[Agent API] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
