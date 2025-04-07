const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const config = require('../utils/config');
const { RESEARCH_STAGES } = require('../../shared/constants');

/**
 * Handles interactions with the Goose CLI
 */
class GooseWrapper {
  constructor() {
    this.sessions = {};
    this.initTempDir();
  }

  /**
   * Initialize the temporary directory
   */
  async initTempDir() {
    try {
      await fs.mkdir(config.goose.tempDir, { recursive: true });
      console.log(`Temporary directory created: ${config.goose.tempDir}`);
    } catch (error) {
      console.error(`Error creating temporary directory: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start a new research session
   * @param {string} topic - The research topic
   * @returns {string} - The session ID
   */
  async startResearch(topic) {
    const sessionId = uuidv4();
    const sessionName = `${config.goose.sessionPrefix}-${sessionId.slice(0, 8)}`;
    
    this.sessions[sessionId] = {
      id: sessionId,
      name: sessionName,
      topic,
      currentStage: RESEARCH_STAGES.INITIAL_RESEARCH,
      status: 'pending',
      progress: 0,
      result: null,
      stages: {
        [RESEARCH_STAGES.INITIAL_RESEARCH]: { completed: false },
        [RESEARCH_STAGES.EXPANDED_RESEARCH]: { completed: false },
        [RESEARCH_STAGES.CRITICAL_ANALYSIS]: { completed: false },
        [RESEARCH_STAGES.SUPPLEMENTARY_RESEARCH]: { completed: false },
        [RESEARCH_STAGES.FINAL_REPORT]: { completed: false }
      },
      startTime: new Date(),
      endTime: null
    };

    // Queue up the initial research stage
    setImmediate(() => this.executeResearchStage(sessionId, RESEARCH_STAGES.INITIAL_RESEARCH));

    return sessionId;
  }

  /**
   * Get the current status of a research session
   * @param {string} sessionId - The session ID
   * @returns {object} - The session status
   */
  getSessionStatus(sessionId) {
    const session = this.sessions[sessionId];
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    return {
      id: session.id,
      topic: session.topic,
      status: session.status,
      currentStage: session.currentStage,
      progress: session.progress,
      stages: session.stages,
      startTime: session.startTime,
      endTime: session.endTime
    };
  }

  /**
   * Get the research result for a completed session
   * @param {string} sessionId - The session ID
   * @returns {string} - The research result in markdown format
   */
  getResearchResult(sessionId) {
    const session = this.sessions[sessionId];
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (session.status !== 'completed') {
      throw new Error(`Research not completed for session: ${sessionId}`);
    }

    return session.result;
  }

  /**
   * Execute a research stage for a session
   * @param {string} sessionId - The session ID
   * @param {string} stage - The research stage to execute
   */
  async executeResearchStage(sessionId, stage) {
    const session = this.sessions[sessionId];
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'in-progress';
    session.currentStage = stage;
    
    try {
      // Create the instruction file for this stage
      const instructionFilePath = await this.createInstructionFile(sessionId, stage);
      
      // Execute the Goose command
      const result = await this.executeGooseCommand(sessionId, instructionFilePath, stage);
      
      // Mark this stage as completed
      session.stages[stage].completed = true;
      session.stages[stage].result = result;
      
      // Move to the next stage or complete the research
      this.moveToNextStage(sessionId);
    } catch (error) {
      console.error(`Error executing research stage ${stage} for session ${sessionId}: ${error.message}`);
      session.status = 'failed';
      session.error = error.message;
    }
  }

  /**
   * Move to the next research stage or complete the research
   * @param {string} sessionId - The session ID
   */
  moveToNextStage(sessionId) {
    const session = this.sessions[sessionId];
    const stages = Object.values(RESEARCH_STAGES);
    const currentIndex = stages.indexOf(session.currentStage);
    
    // Update progress
    session.progress = (currentIndex + 1) / stages.length;
    
    // Check if we have completed all stages
    if (currentIndex === stages.length - 1) {
      // We've completed the final stage
      session.status = 'completed';
      session.endTime = new Date();
      
      // Get the final result from the last stage
      session.result = session.stages[RESEARCH_STAGES.FINAL_REPORT].result;
    } else {
      // Move to the next stage
      const nextStage = stages[currentIndex + 1];
      setImmediate(() => this.executeResearchStage(sessionId, nextStage));
    }
  }

  /**
   * Create an instruction file for a research stage
   * @param {string} sessionId - The session ID
   * @param {string} stage - The research stage
   * @returns {string} - The path to the instruction file
   */
  async createInstructionFile(sessionId, stage) {
    const session = this.sessions[sessionId];
    const templatePath = path.join(__dirname, 'templates', `${stage}.txt`);
    
    try {
      // Read the template
      let templateContent = await fs.readFile(templatePath, 'utf8');
      
      // Replace placeholders
      templateContent = templateContent.replace('{{TOPIC}}', session.topic);
      
      // Create a unique file for this session and stage
      const instructionFilePath = path.join(
        config.goose.tempDir, 
        `${session.name}-${stage}.txt`
      );
      
      // Write the instruction file
      await fs.writeFile(instructionFilePath, templateContent);
      
      return instructionFilePath;
    } catch (error) {
      console.error(`Error creating instruction file for stage ${stage}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a Goose CLI command
   * @param {string} sessionId - The session ID
   * @param {string} instructionFilePath - Path to the instruction file
   * @param {string} stage - The research stage
   * @returns {string} - The command output (the research result for this stage)
   */
  executeGooseCommand(sessionId, instructionFilePath, stage) {
    const session = this.sessions[sessionId];
    const isFirstStage = stage === RESEARCH_STAGES.INITIAL_RESEARCH;
    
    // Construct the command
    let command = `${config.goose.path} run`;
    
    // Add input file flag
    command += ` -i ${instructionFilePath}`;
    
    // Add session name
    command += ` --name ${session.name}`;
    
    // Add extensions
    if (config.goose.extensions) {
      command += ` --with-extension "${config.goose.extensions}"`;
    }
    
    // If not the first stage, add the resume flag
    if (!isFirstStage) {
      command += ' --resume';
    }
    
    console.log(`Executing command: ${command}`);
    
    return new Promise((resolve, reject) => {
      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Goose command: ${error.message}`);
          reject(error);
          return;
        }
        
        if (stderr) {
          console.warn(`Command warning: ${stderr}`);
        }
        
        // Extract the actual result from the output
        const result = this.extractResult(stdout);
        resolve(result);
      });
    });
  }

  /**
   * Strip ANSI color codes from text
   * @param {string} text - Text with potential ANSI codes
   * @returns {string} - Clean text
   */
  stripAnsiCodes(text) {
    // Regex pattern to match ANSI escape sequences
    const pattern = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
    ].join('|');
    
    return text.replace(new RegExp(pattern, 'g'), '');
  }

  /**
   * Extract the research result from the command output
   * @param {string} output - The command output
   * @returns {string} - The extracted result
   */
  extractResult(output) {
    // This is a simplistic extraction - might need refinement based on actual output format
    // Assuming the actual result starts after all the "fetch" lines and command details
    
    const lines = output.split('\n');
    let resultLines = [];
    let startCapturing = false;
    
    for (const line of lines) {
      // Skip lines that indicate the Goose command details or fetch operations
      if (line.includes('starting session') || 
          line.includes('resuming session') || 
          line.includes('─── fetch |') ||
          line.includes('logging to')) {
        continue;
      }
      
      // Once we find non-command output, start capturing
      if (!startCapturing && line.trim() && !line.startsWith('You have mail.')) {
        startCapturing = true;
      }
      
      if (startCapturing) {
        resultLines.push(line);
      }
    }
    
    const rawResult = resultLines.join('\n').trim();
    
    // Strip ANSI color codes from the result
    return this.stripAnsiCodes(rawResult);
  }

  /**
   * Clean up resources for a session
   * @param {string} sessionId - The session ID
   */
  async cleanupSession(sessionId) {
    const session = this.sessions[sessionId];
    if (!session) return;
    
    try {
      // Clean up temporary files
      const sessionFilePrefix = path.join(config.goose.tempDir, `${session.name}`);
      const files = await fs.readdir(config.goose.tempDir);
      
      for (const file of files) {
        const filePath = path.join(config.goose.tempDir, file);
        if (filePath.startsWith(sessionFilePrefix)) {
          await fs.unlink(filePath);
        }
      }
      
      // Remove session from memory after some time
      // (keeping it for a while allows for result retrieval)
      setTimeout(() => {
        delete this.sessions[sessionId];
      }, 60 * 60 * 1000); // 1 hour
      
    } catch (error) {
      console.error(`Error cleaning up session ${sessionId}: ${error.message}`);
    }
  }
}

module.exports = new GooseWrapper();
