require('dotenv').config();
const path = require('path');
const os = require('os');

// Default temp directory based on OS
const DEFAULT_TEMP_DIR = path.join(os.tmpdir(), 'deep-research');

/**
 * Server configuration
 */
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Goose CLI configuration
 */
const GOOSE_PATH = process.env.GOOSE_PATH || 'goose';
const TEMP_DIR = process.env.TEMP_DIR || DEFAULT_TEMP_DIR;
const RESEARCH_SESSION_PREFIX = process.env.RESEARCH_SESSION_PREFIX || 'deep-research';
const GOOSE_EXTENSIONS = process.env.GOOSE_EXTENSIONS || 'uvx mcp-server-fetch';

module.exports = {
  server: {
    port: PORT,
    nodeEnv: NODE_ENV
  },
  goose: {
    path: GOOSE_PATH,
    tempDir: TEMP_DIR,
    sessionPrefix: RESEARCH_SESSION_PREFIX,
    extensions: GOOSE_EXTENSIONS
  },
  researchStages: {
    INITIAL_RESEARCH: 'initial-research',
    EXPANDED_RESEARCH: 'expanded-research',
    CRITICAL_ANALYSIS: 'critical-analysis',
    SUPPLEMENTARY_RESEARCH: 'supplementary-research',
    FINAL_REPORT: 'final-report'
  }
};
