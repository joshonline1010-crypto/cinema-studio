/**
 * REF VALIDATOR AGENT - Validates Refs Before Shot Compiler
 *
 * This agent runs AFTER Ref Generation, BEFORE Shot Compiler.
 * It's a quality gate that ensures:
 * 1. All required refs were actually generated
 * 2. Ref URLs are valid
 * 3. Refs match what shots need
 * 4. No shots are missing their refs
 *
 * If validation fails, it can:
 * - Flag missing refs for regeneration
 * - Suggest fallback refs
 * - Block pipeline if critical refs missing
 */

import type { RefRequirement, ShotRefStack, RefPlannerOutput } from './refPlannerAgent';
import type { MasterRef } from './specTypes';

// ============================================
// TYPES
// ============================================

export interface RefValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  ref_id: string;
  issue: string;
  affected_shots: number[];
  suggestion: string;
}

export interface ValidatedRefStack {
  shot_number: number;
  image_1: { ref_id: string; url: string | null; status: 'valid' | 'missing' | 'fallback' };
  image_2: { ref_id: string; url: string | null; status: 'valid' | 'missing' | 'fallback' } | null;
  image_3: { ref_id: string; url: string | null; status: 'valid' | 'missing' | 'fallback' } | null;
  chain_from_previous: boolean;
  validation_status: 'ready' | 'warning' | 'blocked';
  continuity_phrases: string[];
}

export interface RefValidatorInput {
  refPlan: RefPlannerOutput;
  generatedRefs: MasterRef[];
  previousFrameAvailable?: boolean;
}

export interface RefValidatorOutput {
  validated_stacks: ValidatedRefStack[];
  issues: RefValidationIssue[];
  missing_refs: string[];
  ready_to_compile: boolean;
  summary: {
    total_shots: number;
    shots_ready: number;
    shots_with_warnings: number;
    shots_blocked: number;
    refs_valid: number;
    refs_missing: number;
  };
}

// ============================================
// REF VALIDATOR AGENT
// ============================================

export const refValidatorAgent = {
  role: 'ref_validator',
  name: 'Ref Validator Agent',
  icon: '✅',
  color: 'teal',

  /**
   * Validate all refs before Shot Compiler runs
   */
  execute(input: RefValidatorInput): RefValidatorOutput {
    console.log('[RefValidator] ✅ Validating refs...');

    const { refPlan, generatedRefs } = input;
    const issues: RefValidationIssue[] = [];
    const missingRefs: string[] = [];
    const validatedStacks: ValidatedRefStack[] = [];

    // Build a map of generated refs for quick lookup
    const refMap = new Map<string, MasterRef>();
    for (const ref of generatedRefs) {
      // Map by both id and name for flexibility
      refMap.set(ref.id, ref);
      refMap.set(ref.name, ref);
      // Also map by type prefix
      if (ref.type === 'CHARACTER_MASTER') {
        refMap.set(`char_${ref.name}`, ref);
      } else if (ref.type === 'ENVIRONMENT_MASTER') {
        refMap.set(`env_${ref.name}`, ref);
        refMap.set('env_main', ref);
      }
    }

    console.log('[RefValidator] Generated refs available:', generatedRefs.length);
    console.log('[RefValidator] Shot stacks to validate:', refPlan.shot_ref_stacks.length);

    // Check each required ref exists
    for (const req of refPlan.ref_requirements) {
      const ref = refMap.get(req.ref_id);

      if (!ref) {
        // Ref not found
        if (req.priority === 'required') {
          issues.push({
            severity: 'critical',
            ref_id: req.ref_id,
            issue: `Required ref "${req.name}" was not generated`,
            affected_shots: req.used_in_shots,
            suggestion: `Generate ${req.ref_type} for ${req.name}`
          });
          missingRefs.push(req.ref_id);
        } else if (req.priority === 'recommended') {
          issues.push({
            severity: 'warning',
            ref_id: req.ref_id,
            issue: `Recommended ref "${req.name}" was not generated`,
            affected_shots: req.used_in_shots,
            suggestion: `Consider generating ${req.ref_type} for better consistency`
          });
        }
      } else if (!ref.url) {
        // Ref exists but has no URL
        issues.push({
          severity: req.priority === 'required' ? 'critical' : 'warning',
          ref_id: req.ref_id,
          issue: `Ref "${req.name}" has no URL`,
          affected_shots: req.used_in_shots,
          suggestion: 'Regenerate this ref or provide URL'
        });
        if (req.priority === 'required') {
          missingRefs.push(req.ref_id);
        }
      }
    }

    // Validate each shot's ref stack
    for (const stack of refPlan.shot_ref_stacks) {
      const validated = this.validateShotStack(stack, refMap, input.previousFrameAvailable);
      validatedStacks.push(validated);

      // Check for issues
      if (validated.validation_status === 'blocked') {
        issues.push({
          severity: 'critical',
          ref_id: stack.image_1 as string,
          issue: `Shot ${stack.shot_number} is blocked - primary ref missing`,
          affected_shots: [stack.shot_number],
          suggestion: 'Generate required ref before proceeding'
        });
      } else if (validated.validation_status === 'warning') {
        issues.push({
          severity: 'warning',
          ref_id: 'multiple',
          issue: `Shot ${stack.shot_number} has missing secondary refs`,
          affected_shots: [stack.shot_number],
          suggestion: 'Shot can proceed but may have reduced quality'
        });
      }
    }

    // Calculate summary
    const shotsReady = validatedStacks.filter(s => s.validation_status === 'ready').length;
    const shotsWithWarnings = validatedStacks.filter(s => s.validation_status === 'warning').length;
    const shotsBlocked = validatedStacks.filter(s => s.validation_status === 'blocked').length;

    const refsValid = refPlan.ref_requirements.filter(req => {
      const ref = refMap.get(req.ref_id);
      return ref && ref.url;
    }).length;

    const readyToCompile = shotsBlocked === 0;

    console.log('[RefValidator] ✅ Validation complete');
    console.log(`[RefValidator] Ready: ${shotsReady}, Warnings: ${shotsWithWarnings}, Blocked: ${shotsBlocked}`);
    console.log(`[RefValidator] Ready to compile: ${readyToCompile}`);

    return {
      validated_stacks: validatedStacks,
      issues,
      missing_refs: missingRefs,
      ready_to_compile: readyToCompile,
      summary: {
        total_shots: validatedStacks.length,
        shots_ready: shotsReady,
        shots_with_warnings: shotsWithWarnings,
        shots_blocked: shotsBlocked,
        refs_valid: refsValid,
        refs_missing: missingRefs.length
      }
    };
  },

  /**
   * Validate a single shot's ref stack
   */
  validateShotStack(
    stack: ShotRefStack,
    refMap: Map<string, MasterRef>,
    previousFrameAvailable?: boolean
  ): ValidatedRefStack {
    const validated: ValidatedRefStack = {
      shot_number: stack.shot_number,
      image_1: { ref_id: '', url: null, status: 'missing' },
      image_2: null,
      image_3: null,
      chain_from_previous: stack.chain_from_previous,
      validation_status: 'ready',
      continuity_phrases: stack.continuity_phrases
    };

    // Validate Image 1
    if (stack.image_1 === 'PREVIOUS_FRAME') {
      validated.image_1 = {
        ref_id: 'PREVIOUS_FRAME',
        url: previousFrameAvailable ? 'RUNTIME' : null,
        status: 'valid' // Previous frame is always "valid" - it's extracted at runtime
      };
    } else if (stack.image_1 === 'BASE_WORLD') {
      validated.image_1 = {
        ref_id: 'BASE_WORLD',
        url: null,
        status: 'fallback'
      };
    } else {
      const ref = refMap.get(stack.image_1);
      validated.image_1 = {
        ref_id: stack.image_1,
        url: ref?.url || null,
        status: ref?.url ? 'valid' : 'missing'
      };
    }

    // Validate Image 2
    if (stack.image_2) {
      const ref = refMap.get(stack.image_2);
      validated.image_2 = {
        ref_id: stack.image_2,
        url: ref?.url || null,
        status: ref?.url ? 'valid' : 'missing'
      };
    }

    // Validate Image 3
    if (stack.image_3) {
      const ref = refMap.get(stack.image_3);
      validated.image_3 = {
        ref_id: stack.image_3,
        url: ref?.url || null,
        status: ref?.url ? 'valid' : 'missing'
      };
    }

    // Determine overall status
    if (validated.image_1.status === 'missing' && stack.image_1 !== 'BASE_WORLD') {
      validated.validation_status = 'blocked';
    } else if (
      (validated.image_2?.status === 'missing') ||
      (validated.image_3?.status === 'missing')
    ) {
      validated.validation_status = 'warning';
    } else {
      validated.validation_status = 'ready';
    }

    return validated;
  },

  /**
   * Get refs that need to be regenerated
   */
  getRefsToRegenerate(output: RefValidatorOutput): string[] {
    return output.issues
      .filter(i => i.severity === 'critical')
      .map(i => i.ref_id)
      .filter((id, index, self) => self.indexOf(id) === index);
  }
};

export default refValidatorAgent;
