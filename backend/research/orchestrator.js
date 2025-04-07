const gooseWrapper = require('./goose');
const { RESEARCH_STATUS, STAGE_DESCRIPTIONS } = require('../../shared/constants');

/**
 * Orchestrates the research process
 */
class ResearchOrchestrator {
  /**
   * Start a new research process
   * @param {string} topic - The research topic
   * @returns {object} - Research session details
   */
  async startResearch(topic) {
    try {
      // Validate topic
      if (!topic || typeof topic !== 'string' || topic.trim() === '') {
        throw new Error('Invalid research topic');
      }
      
      // Start the research session
      const sessionId = await gooseWrapper.startResearch(topic);
      
      return {
        id: sessionId,
        topic,
        status: RESEARCH_STATUS.IN_PROGRESS
      };
    } catch (error) {
      console.error(`Error starting research: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the status of a research session
   * @param {string} sessionId - The session ID
   * @returns {object} - Session status with human-readable descriptions
   */
  async getResearchStatus(sessionId) {
    try {
      const status = gooseWrapper.getSessionStatus(sessionId);
      
      // Add human-readable description of current stage
      return {
        ...status,
        currentStageDescription: STAGE_DESCRIPTIONS[status.currentStage] || 'Unknown stage',
        formattedProgress: `${Math.round(status.progress * 100)}%`
      };
    } catch (error) {
      console.error(`Error getting research status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the research results
   * @param {string} sessionId - The session ID
   * @returns {object} - Research results
   */
  async getResearchResults(sessionId) {
    try {
      const status = gooseWrapper.getSessionStatus(sessionId);
      
      if (status.status !== RESEARCH_STATUS.COMPLETED) {
        return {
          id: sessionId,
          status: status.status,
          progress: status.progress,
          message: 'Research is still in progress'
        };
      }
      
      const result = gooseWrapper.getResearchResult(sessionId);
      
      return {
        id: sessionId,
        status: RESEARCH_STATUS.COMPLETED,
        result,
        topic: status.topic
      };
    } catch (error) {
      console.error(`Error getting research results: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * List all active research sessions
   * @returns {Array} - List of active research sessions
   */
  listActiveSessions() {
    try {
      const sessions = [];
      
      // Convert the sessions object to an array
      for (const sessionId in gooseWrapper.sessions) {
        const session = gooseWrapper.sessions[sessionId];
        
        // Only include sessions that are still in progress
        if (session.status === RESEARCH_STATUS.IN_PROGRESS || 
            session.status === RESEARCH_STATUS.PENDING) {
          sessions.push({
            id: session.id,
            topic: session.topic,
            status: session.status,
            currentStage: session.currentStage,
            progress: session.progress,
            startTime: session.startTime
          });
        }
      }
      
      return sessions;
    } catch (error) {
      console.error(`Error listing active sessions: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Clean up resources for a session
   * @param {string} sessionId - The session ID
   */
  async cleanupSession(sessionId) {
    try {
      await gooseWrapper.cleanupSession(sessionId);
    } catch (error) {
      console.error(`Error cleaning up session: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ResearchOrchestrator();
