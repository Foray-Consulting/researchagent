/**
 * Shared constants for both frontend and backend
 */

// Research stages
const RESEARCH_STAGES = {
  INITIAL_RESEARCH: 'initial-research',
  EXPANDED_RESEARCH: 'expanded-research',
  CRITICAL_ANALYSIS: 'critical-analysis',
  SUPPLEMENTARY_RESEARCH: 'supplementary-research',
  FINAL_REPORT: 'final-report'
};

// Stage descriptions for display
const STAGE_DESCRIPTIONS = {
  [RESEARCH_STAGES.INITIAL_RESEARCH]: 'Researching topic and identifying key subtopics',
  [RESEARCH_STAGES.EXPANDED_RESEARCH]: 'Exploring subtopics in depth',
  [RESEARCH_STAGES.CRITICAL_ANALYSIS]: 'Critically analyzing findings',
  [RESEARCH_STAGES.SUPPLEMENTARY_RESEARCH]: 'Gathering additional information',
  [RESEARCH_STAGES.FINAL_REPORT]: 'Generating comprehensive report'
};

// Research status
const RESEARCH_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// If in Node.js environment, export for module.exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RESEARCH_STAGES,
    STAGE_DESCRIPTIONS,
    RESEARCH_STATUS
  };
}
