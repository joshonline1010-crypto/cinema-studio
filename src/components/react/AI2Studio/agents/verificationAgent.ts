/**
 * VERIFICATION AGENT - The Quality Controller
 *
 * This agent runs AFTER the unified pipeline to verify:
 * 1. COMPLETENESS - Is anything missing?
 * 2. CONSISTENCY - Do phases agree with each other?
 * 3. CORRECTNESS - Are values valid?
 * 4. COVERAGE - Are all story elements represented?
 *
 * If issues found → generates REPAIR INSTRUCTIONS
 * If critical issues → recommends RE-RUN of specific phases
 */

import type { UnifiedPipelineOutput } from './unifiedPipeline';
import type { StoryAnalysisOutput } from './storyAnalystAgent';
import type { DirectorOutput } from './directorAgent';
import type { ProductionManifest } from './producerAgent';
import type { ShotCard, MasterRef } from './specTypes';

// ============================================
// VERIFICATION TYPES
// ============================================

export type IssueSeverity = 'critical' | 'warning' | 'info';
export type IssuePhase = 'story_analysis' | 'world' | 'director' | 'council' | 'refs' | 'beats' | 'shots' | 'producer' | 'cross_phase';

export interface VerificationIssue {
  id: string;
  phase: IssuePhase;
  severity: IssueSeverity;
  category: string;
  message: string;
  expected?: string;
  actual?: string;
  fix?: string;
  autoFixable: boolean;
}

export interface RepairAction {
  phase: IssuePhase;
  action: 'rerun' | 'patch' | 'warn';
  details: string;
  priority: number;
}

export interface VerificationResult {
  passed: boolean;
  score: number;  // 0-100
  issues: VerificationIssue[];
  repairs: RepairAction[];
  summary: {
    critical: number;
    warnings: number;
    info: number;
    completeness: number;  // 0-100%
    consistency: number;   // 0-100%
  };
}

// ============================================
// VERIFICATION CHECKS
// ============================================

const verificationChecks = {
  /**
   * Check Story Analyst output completeness
   */
  checkStoryAnalysis(analysis: StoryAnalysisOutput | null): VerificationIssue[] {
    const issues: VerificationIssue[] = [];

    if (!analysis) {
      issues.push({
        id: 'story_missing',
        phase: 'story_analysis',
        severity: 'critical',
        category: 'completeness',
        message: 'Story analysis is completely missing',
        autoFixable: true,
        fix: 'Re-run Story Analyst phase'
      });
      return issues;
    }

    // Check concept analysis
    if (!analysis.concept_analysis?.story_type) {
      issues.push({
        id: 'story_type_missing',
        phase: 'story_analysis',
        severity: 'warning',
        category: 'completeness',
        message: 'Story type not determined',
        autoFixable: false
      });
    }

    if (!analysis.concept_analysis?.core_emotion) {
      issues.push({
        id: 'core_emotion_missing',
        phase: 'story_analysis',
        severity: 'warning',
        category: 'completeness',
        message: 'Core emotion not identified',
        autoFixable: false
      });
    }

    // Check emotional journey
    if (!analysis.emotional_journey?.arc_description) {
      issues.push({
        id: 'emotional_arc_missing',
        phase: 'story_analysis',
        severity: 'warning',
        category: 'completeness',
        message: 'Emotional arc description missing',
        autoFixable: false
      });
    }

    // Check director recommendation
    if (!analysis.director_recommendation?.director) {
      issues.push({
        id: 'director_missing',
        phase: 'story_analysis',
        severity: 'info',
        category: 'completeness',
        message: 'No director style recommended',
        autoFixable: false
      });
    }

    // Check audio plan
    if (!analysis.audio_narrative_plan) {
      issues.push({
        id: 'audio_plan_missing',
        phase: 'story_analysis',
        severity: 'warning',
        category: 'completeness',
        message: 'Audio narrative plan missing - dialogue/voiceover decisions not made',
        autoFixable: false
      });
    }

    return issues;
  },

  /**
   * Check Director output
   */
  checkDirector(direction: DirectorOutput | null, targetDuration: number): VerificationIssue[] {
    const issues: VerificationIssue[] = [];

    if (!direction) {
      issues.push({
        id: 'direction_missing',
        phase: 'director',
        severity: 'critical',
        category: 'completeness',
        message: 'Director output is completely missing',
        autoFixable: true,
        fix: 'Re-run Director phase'
      });
      return issues;
    }

    // Check shot sequence exists
    if (!direction.shot_sequence || direction.shot_sequence.length === 0) {
      issues.push({
        id: 'shots_missing',
        phase: 'director',
        severity: 'critical',
        category: 'completeness',
        message: 'No shots planned by Director',
        autoFixable: true,
        fix: 'Re-run Director phase'
      });
      return issues;
    }

    // Check shot count vs duration
    const shotCount = direction.shot_sequence.length;
    const expectedMinShots = Math.floor(targetDuration / 10);  // At least 1 shot per 10s
    const expectedMaxShots = Math.ceil(targetDuration / 3);    // At most 1 shot per 3s

    if (shotCount < expectedMinShots) {
      issues.push({
        id: 'too_few_shots',
        phase: 'director',
        severity: 'warning',
        category: 'correctness',
        message: `Too few shots for ${targetDuration}s video`,
        expected: `At least ${expectedMinShots} shots`,
        actual: `${shotCount} shots`,
        autoFixable: false
      });
    }

    if (shotCount > expectedMaxShots) {
      issues.push({
        id: 'too_many_shots',
        phase: 'director',
        severity: 'warning',
        category: 'correctness',
        message: `Too many shots for ${targetDuration}s video - may feel rushed`,
        expected: `At most ${expectedMaxShots} shots`,
        actual: `${shotCount} shots`,
        autoFixable: false
      });
    }

    // Check ref assignments
    if (!direction.ref_assignments || direction.ref_assignments.length !== shotCount) {
      issues.push({
        id: 'ref_assignments_mismatch',
        phase: 'director',
        severity: 'critical',
        category: 'consistency',
        message: 'Ref assignments count does not match shot count',
        expected: `${shotCount} ref assignments`,
        actual: `${direction.ref_assignments?.length || 0} ref assignments`,
        autoFixable: true,
        fix: 'Re-run Director to fix ref assignments'
      });
    }

    // Check continuity locks
    if (!direction.continuity_locks) {
      issues.push({
        id: 'continuity_locks_missing',
        phase: 'director',
        severity: 'warning',
        category: 'completeness',
        message: 'No continuity locks defined - may cause visual inconsistency',
        autoFixable: false
      });
    }

    // Check new fields: sora_candidate, edit_intent, target_duration_ms
    for (const shot of direction.shot_sequence) {
      // sora_candidate should be defined (true or false)
      if (shot.sora_candidate === undefined) {
        issues.push({
          id: `shot_${shot.shot_number}_sora_missing`,
          phase: 'director',
          severity: 'info',
          category: 'completeness',
          message: `Shot ${shot.shot_number} missing sora_candidate flag`,
          autoFixable: true,
          fix: 'Default to sora_candidate: false'
        });
      }

      // If sora_candidate is true, validate sora_ref_type
      if (shot.sora_candidate === true && !shot.sora_ref_type) {
        issues.push({
          id: `shot_${shot.shot_number}_sora_ref_type_missing`,
          phase: 'director',
          severity: 'warning',
          category: 'correctness',
          message: `Shot ${shot.shot_number} is Sora candidate but missing sora_ref_type`,
          expected: 'location_only | character_only | character_in_location | collage',
          autoFixable: false
        });
      }

      // If target_duration_ms is set, validate it makes sense
      if (shot.target_duration_ms !== undefined) {
        const modelDuration = shot.duration_seconds * 1000;
        if (shot.target_duration_ms > modelDuration) {
          issues.push({
            id: `shot_${shot.shot_number}_target_too_long`,
            phase: 'director',
            severity: 'warning',
            category: 'correctness',
            message: `Shot ${shot.shot_number} target duration (${shot.target_duration_ms}ms) exceeds model output (${modelDuration}ms)`,
            expected: `<= ${modelDuration}ms`,
            actual: `${shot.target_duration_ms}ms`,
            autoFixable: true,
            fix: 'Clamp to model duration'
          });
        }

        // Very short shots (< 1s) should have tight pacing
        if (shot.target_duration_ms < 1000 && shot.edit_intent?.pacing !== 'tight') {
          issues.push({
            id: `shot_${shot.shot_number}_short_not_tight`,
            phase: 'director',
            severity: 'info',
            category: 'consistency',
            message: `Shot ${shot.shot_number} is very short (${shot.target_duration_ms}ms) but pacing is not 'tight'`,
            autoFixable: true,
            fix: 'Set edit_intent.pacing to tight'
          });
        }
      }

      // If edit_intent has speed > x1, check it's not dialogue
      if (shot.edit_intent?.max_speed && shot.edit_intent.max_speed !== 'x1') {
        // We'd need to check if shot has dialogue - for now just info
        if (shot.subject_focus?.includes('character') && shot.camera_movement === 'static') {
          issues.push({
            id: `shot_${shot.shot_number}_speed_character_warning`,
            phase: 'director',
            severity: 'info',
            category: 'correctness',
            message: `Shot ${shot.shot_number} has speed ${shot.edit_intent.max_speed} on character - ensure no dialogue`,
            autoFixable: false
          });
        }
      }
    }

    return issues;
  },

  /**
   * Check Producer manifest
   */
  checkProducer(manifest: ProductionManifest | null, shotCount: number): VerificationIssue[] {
    const issues: VerificationIssue[] = [];

    if (!manifest) {
      issues.push({
        id: 'manifest_missing',
        phase: 'producer',
        severity: 'critical',
        category: 'completeness',
        message: 'Production manifest is missing',
        autoFixable: true,
        fix: 'Re-run Producer phase'
      });
      return issues;
    }

    // Check assets exist
    if (!manifest.assets || manifest.assets.length === 0) {
      issues.push({
        id: 'no_assets',
        phase: 'producer',
        severity: 'critical',
        category: 'completeness',
        message: 'No production assets defined',
        autoFixable: true,
        fix: 'Re-run Producer phase'
      });
      return issues;
    }

    // Check photo count matches shot count
    const photoCount = manifest.assets.filter(a => a.type === 'PHOTO').length;
    if (photoCount !== shotCount) {
      issues.push({
        id: 'photo_count_mismatch',
        phase: 'producer',
        severity: 'critical',
        category: 'consistency',
        message: 'Photo asset count does not match shot count',
        expected: `${shotCount} photos`,
        actual: `${photoCount} photos`,
        autoFixable: true,
        fix: 'Re-run Producer phase'
      });
    }

    // Check video count matches shot count
    const videoCount = manifest.assets.filter(a => a.type === 'VIDEO').length;
    if (videoCount !== shotCount) {
      issues.push({
        id: 'video_count_mismatch',
        phase: 'producer',
        severity: 'critical',
        category: 'consistency',
        message: 'Video asset count does not match shot count',
        expected: `${shotCount} videos`,
        actual: `${videoCount} videos`,
        autoFixable: true,
        fix: 'Re-run Producer phase'
      });
    }

    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCycle(assetId: string): boolean {
      if (recursionStack.has(assetId)) return true;
      if (visited.has(assetId)) return false;

      visited.add(assetId);
      recursionStack.add(assetId);

      const deps = manifest!.dependencyGraph[assetId] || [];
      for (const dep of deps) {
        if (hasCycle(dep)) return true;
      }

      recursionStack.delete(assetId);
      return false;
    }

    for (const asset of manifest.assets) {
      if (hasCycle(asset.id)) {
        issues.push({
          id: 'circular_dependency',
          phase: 'producer',
          severity: 'critical',
          category: 'correctness',
          message: `Circular dependency detected involving ${asset.id}`,
          autoFixable: false
        });
        break;
      }
    }

    // Check phases exist
    if (!manifest.phases || manifest.phases.length === 0) {
      issues.push({
        id: 'no_phases',
        phase: 'producer',
        severity: 'critical',
        category: 'completeness',
        message: 'No execution phases defined',
        autoFixable: true,
        fix: 'Re-run Producer phase'
      });
    }

    return issues;
  },

  /**
   * Check Shot Cards
   */
  checkShotCards(shots: ShotCard[] | null): VerificationIssue[] {
    const issues: VerificationIssue[] = [];

    if (!shots || shots.length === 0) {
      issues.push({
        id: 'shots_missing',
        phase: 'shots',
        severity: 'critical',
        category: 'completeness',
        message: 'No shot cards generated',
        autoFixable: true,
        fix: 'Re-run Shot Compiler phase'
      });
      return issues;
    }

    shots.forEach((shot, i) => {
      // Check photo prompt
      if (!shot.photo_prompt || shot.photo_prompt.length < 50) {
        issues.push({
          id: `shot_${i}_prompt_short`,
          phase: 'shots',
          severity: 'warning',
          category: 'completeness',
          message: `Shot ${i + 1} has no photo prompt or it's too short`,
          expected: 'Detailed photo prompt (50+ chars)',
          actual: `${shot.photo_prompt?.length || 0} chars`,
          autoFixable: false
        });
      }

      // Check video prompt has endpoint
      if (shot.video_motion_prompt && !shot.video_motion_prompt.match(/then|settles|stops|holds|ends/i)) {
        issues.push({
          id: `shot_${i}_no_endpoint`,
          phase: 'shots',
          severity: 'warning',
          category: 'correctness',
          message: `Shot ${i + 1} video prompt missing motion endpoint`,
          expected: 'Prompt with endpoint like "then settles" or "then holds"',
          actual: shot.video_motion_prompt?.substring(0, 50) + '...',
          fix: 'Add motion endpoint to prevent video generation hang',
          autoFixable: false
        });
      }

      // Check refs assigned
      if (!shot.refs?.image_1 && !shot.refs?.image_2) {
        issues.push({
          id: `shot_${i}_no_refs`,
          phase: 'shots',
          severity: 'warning',
          category: 'completeness',
          message: `Shot ${i + 1} has no reference images assigned`,
          autoFixable: false
        });
      }

      // Check video model
      if (!shot.video_model) {
        issues.push({
          id: `shot_${i}_no_model`,
          phase: 'shots',
          severity: 'warning',
          category: 'completeness',
          message: `Shot ${i + 1} has no video model selected`,
          autoFixable: false
        });
      }
    });

    return issues;
  },

  /**
   * Cross-phase consistency checks
   */
  checkCrossPhaseConsistency(output: UnifiedPipelineOutput): VerificationIssue[] {
    const issues: VerificationIssue[] = [];

    // Check Story → Director consistency
    if (output.storyAnalysis?.audio_narrative_plan?.needs_dialogue) {
      // If dialogue needed, check that Director planned for it
      const hasDialogShots = output.direction?.shot_sequence?.some(s =>
        s.shot_type?.toLowerCase().includes('dialog') ||
        s.shot_type?.toLowerCase().includes('ots') ||
        s.shot_type?.toLowerCase().includes('close')
      );

      if (!hasDialogShots) {
        issues.push({
          id: 'dialogue_no_shots',
          phase: 'cross_phase',
          severity: 'warning',
          category: 'consistency',
          message: 'Story Analyst says dialogue needed, but Director has no dialogue shots planned',
          expected: 'OTS or CU shots for dialogue',
          actual: 'No dialogue-appropriate shots found',
          autoFixable: false
        });
      }
    }

    // Check Director → Producer consistency
    if (output.direction?.shot_sequence && output.productionManifest?.assets) {
      const directorShotCount = output.direction.shot_sequence.length;
      const producerPhotoCount = output.productionManifest.assets.filter(a => a.type === 'PHOTO').length;

      if (directorShotCount !== producerPhotoCount) {
        issues.push({
          id: 'shot_photo_mismatch',
          phase: 'cross_phase',
          severity: 'critical',
          category: 'consistency',
          message: 'Director shot count does not match Producer photo count',
          expected: `${directorShotCount} photos from Director`,
          actual: `${producerPhotoCount} photos from Producer`,
          autoFixable: true,
          fix: 'Re-run Producer phase'
        });
      }
    }

    // Check World → Shots consistency (characters present)
    if (output.world?.entities && output.shots?.shotCards) {
      const worldCharacters = output.world.entities
        .filter(e => e.entity_type === 'character')
        .map(e => e.entity_id.toLowerCase());

      // Check if any shot mentions characters not in world
      // (This is a soft check - characters might be described differently)
    }

    // Check Refs → Shots consistency
    if (output.masterRefs && output.shots?.shotCards) {
      const refIds = new Set(output.masterRefs.map(r => r.id));

      output.shots.shotCards.forEach((shot, i) => {
        // Check if referenced images exist
        if (shot.refs?.image_2 && !refIds.has(shot.refs.image_2) && shot.refs.image_2 !== 'BASE_WORLD') {
          issues.push({
            id: `shot_${i}_invalid_ref`,
            phase: 'cross_phase',
            severity: 'warning',
            category: 'consistency',
            message: `Shot ${i + 1} references non-existent ref: ${shot.refs.image_2}`,
            autoFixable: false
          });
        }
      });
    }

    return issues;
  }
};

// ============================================
// VERIFICATION AGENT
// ============================================

export const verificationAgent = {
  role: 'verification',
  name: 'Verification Agent',
  icon: '✅',
  color: 'green',

  /**
   * Verify complete pipeline output
   */
  verify(output: UnifiedPipelineOutput, targetDuration: number): VerificationResult {
    console.log('[Verification] ✅ Starting pipeline verification...');

    const allIssues: VerificationIssue[] = [];

    // Phase-by-phase checks
    allIssues.push(...verificationChecks.checkStoryAnalysis(output.storyAnalysis));
    allIssues.push(...verificationChecks.checkDirector(output.direction, targetDuration));
    allIssues.push(...verificationChecks.checkShotCards(output.shots?.shotCards || null));
    allIssues.push(...verificationChecks.checkProducer(
      output.productionManifest,
      output.shots?.shotCards?.length || 0
    ));

    // Cross-phase checks
    allIssues.push(...verificationChecks.checkCrossPhaseConsistency(output));

    // Calculate score
    const critical = allIssues.filter(i => i.severity === 'critical').length;
    const warnings = allIssues.filter(i => i.severity === 'warning').length;
    const info = allIssues.filter(i => i.severity === 'info').length;

    // Score: Start at 100, -20 per critical, -5 per warning, -1 per info
    const score = Math.max(0, 100 - (critical * 20) - (warnings * 5) - (info * 1));

    // Generate repair actions
    const repairs: RepairAction[] = [];

    // Group critical issues by phase for rerun recommendations
    const criticalByPhase = new Map<IssuePhase, VerificationIssue[]>();
    allIssues.filter(i => i.severity === 'critical').forEach(issue => {
      if (!criticalByPhase.has(issue.phase)) {
        criticalByPhase.set(issue.phase, []);
      }
      criticalByPhase.get(issue.phase)!.push(issue);
    });

    criticalByPhase.forEach((issues, phase) => {
      repairs.push({
        phase,
        action: 'rerun',
        details: `${issues.length} critical issues found: ${issues.map(i => i.message).join(', ')}`,
        priority: issues.length
      });
    });

    // Sort repairs by priority
    repairs.sort((a, b) => b.priority - a.priority);

    // Calculate completeness
    const expectedFields = 8; // story, world, direction, council, refs, beats, shots, producer
    const presentFields = [
      output.storyAnalysis,
      output.world,
      output.direction,
      output.councilAdvice,
      output.masterRefs?.length > 0,
      output.beats,
      output.shots?.shotCards?.length > 0,
      output.productionManifest
    ].filter(Boolean).length;
    const completeness = Math.round((presentFields / expectedFields) * 100);

    // Calculate consistency (based on cross-phase issues)
    const crossPhaseIssues = allIssues.filter(i => i.phase === 'cross_phase');
    const consistency = Math.max(0, 100 - (crossPhaseIssues.length * 15));

    const result: VerificationResult = {
      passed: critical === 0 && score >= 70,
      score,
      issues: allIssues,
      repairs,
      summary: {
        critical,
        warnings,
        info,
        completeness,
        consistency
      }
    };

    console.log('[Verification] Score:', score);
    console.log('[Verification] Critical:', critical, 'Warnings:', warnings, 'Info:', info);
    console.log('[Verification] Completeness:', completeness + '%', 'Consistency:', consistency + '%');
    console.log('[Verification] Passed:', result.passed);

    return result;
  },

  /**
   * Print verification report
   */
  printReport(result: VerificationResult): string {
    let report = '# PIPELINE VERIFICATION REPORT\n\n';

    report += `## Summary\n`;
    report += `- **Score:** ${result.score}/100 ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `- **Completeness:** ${result.summary.completeness}%\n`;
    report += `- **Consistency:** ${result.summary.consistency}%\n`;
    report += `- **Critical Issues:** ${result.summary.critical}\n`;
    report += `- **Warnings:** ${result.summary.warnings}\n`;
    report += `- **Info:** ${result.summary.info}\n\n`;

    if (result.issues.length > 0) {
      report += `## Issues Found\n\n`;

      // Group by severity
      const criticals = result.issues.filter(i => i.severity === 'critical');
      const warnings = result.issues.filter(i => i.severity === 'warning');
      const infos = result.issues.filter(i => i.severity === 'info');

      if (criticals.length > 0) {
        report += `### ❌ Critical (Must Fix)\n`;
        criticals.forEach(issue => {
          report += `- **[${issue.phase}]** ${issue.message}\n`;
          if (issue.expected) report += `  - Expected: ${issue.expected}\n`;
          if (issue.actual) report += `  - Actual: ${issue.actual}\n`;
          if (issue.fix) report += `  - Fix: ${issue.fix}\n`;
        });
        report += '\n';
      }

      if (warnings.length > 0) {
        report += `### ⚠️ Warnings (Should Fix)\n`;
        warnings.forEach(issue => {
          report += `- **[${issue.phase}]** ${issue.message}\n`;
          if (issue.fix) report += `  - Fix: ${issue.fix}\n`;
        });
        report += '\n';
      }

      if (infos.length > 0) {
        report += `### ℹ️ Info (Consider)\n`;
        infos.forEach(issue => {
          report += `- **[${issue.phase}]** ${issue.message}\n`;
        });
        report += '\n';
      }
    }

    if (result.repairs.length > 0) {
      report += `## Recommended Repairs\n\n`;
      result.repairs.forEach((repair, i) => {
        report += `${i + 1}. **${repair.action.toUpperCase()} ${repair.phase}** - ${repair.details}\n`;
      });
    }

    return report;
  }
};

export default verificationAgent;
