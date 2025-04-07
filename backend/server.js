const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const config = require('./utils/config');
const researchOrchestrator = require('./research/orchestrator');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend')));

/**
 * API Routes
 */

// Start a new research session
app.post('/api/research', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    const session = await researchOrchestrator.startResearch(topic);
    res.status(201).json(session);
  } catch (error) {
    console.error('Error starting research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get research status
app.get('/api/research/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const status = await researchOrchestrator.getResearchStatus(id);
    res.json(status);
  } catch (error) {
    console.error('Error getting research status:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Research session not found' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Get research results
app.get('/api/research/:id/result', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await researchOrchestrator.getResearchResults(id);
    res.json(result);
  } catch (error) {
    console.error('Error getting research results:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Research session not found' });
    }
    
    if (error.message.includes('not completed')) {
      return res.status(422).json({ error: 'Research not yet completed' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// List active research sessions
app.get('/api/research', async (req, res) => {
  try {
    const sessions = researchOrchestrator.listActiveSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clean up a completed research session
app.delete('/api/research/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await researchOrchestrator.cleanupSession(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error cleaning up session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const port = config.server.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Research app available at http://localhost:${port}`);
  
  // Create temp directory if it doesn't exist
  const tempDir = config.goose.tempDir;
  fs.mkdir(tempDir, { recursive: true })
    .then(() => console.log(`Temporary directory created: ${tempDir}`))
    .catch(err => console.error(`Error creating temp directory: ${err.message}`));
});
