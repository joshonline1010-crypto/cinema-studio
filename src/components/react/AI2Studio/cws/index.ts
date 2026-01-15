/**
 * CWS (Continuous World Storytelling) Module
 *
 * Export all CWS functionality from a single entry point.
 */

// Types
export * from './types';

// Store
export { useCWSStore, default as cwsStore } from './cwsStore';

// Prompt System
export {
  CWS_SYSTEM_PROMPT,
  buildCWSContext,
  buildCWSSystemPromptSection,
  generateLockPhrase,
  suggestRigsForBeat,
  formatEntityForPrompt,
  formatRigForPrompt,
  validateCameraTransition,
  validateEntityMovement,
  CWS_NARRATIVE_AGENT_ADDITION,
  CWS_VISUAL_AGENT_ADDITION,
  CWS_TECHNICAL_AGENT_ADDITION,
  CWS_PRODUCTION_AGENT_ADDITION
} from './cwsPromptSystem';
