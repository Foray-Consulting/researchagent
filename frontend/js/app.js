/**
 * Deep Research App
 * Main application script
 */

// Load shared constants from server
let RESEARCH_STAGES = {
  INITIAL_RESEARCH: 'initial-research',
  EXPANDED_RESEARCH: 'expanded-research',
  CRITICAL_ANALYSIS: 'critical-analysis',
  SUPPLEMENTARY_RESEARCH: 'supplementary-research',
  FINAL_REPORT: 'final-report'
};

let RESEARCH_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// State
let currentResearch = null;
let statusCheckInterval = null;

// DOM Elements
const elements = {
  topicForm: document.getElementById('topic-form'),
  topicInput: document.getElementById('topic'),
  submitBtn: document.getElementById('submit-btn'),
  researchForm: document.getElementById('research-form'),
  researchProgress: document.getElementById('research-progress'),
  researchResult: document.getElementById('research-result'),
  progressTopic: document.getElementById('progress-topic'),
  currentStage: document.getElementById('current-stage'),
  progressFill: document.getElementById('progress-fill'),
  progressPercentage: document.getElementById('progress-percentage'),
  stages: document.querySelectorAll('.stage'),
  resultTopic: document.getElementById('result-topic'),
  markdownContent: document.getElementById('markdown-content'),
  newResearchBtn: document.getElementById('new-research-btn')
};

/**
 * Initialize the application
 */
function init() {
  // Add event listeners
  elements.topicForm.addEventListener('submit', handleSubmit);
  elements.newResearchBtn.addEventListener('click', resetForm);
  
  // Check for existing research in progress (in case of page refresh)
  const savedResearch = localStorage.getItem('currentResearch');
  if (savedResearch) {
    try {
      currentResearch = JSON.parse(savedResearch);
      startStatusCheck();
      showProgressView();
    } catch (error) {
      console.error('Error parsing saved research:', error);
      localStorage.removeItem('currentResearch');
    }
  }
}

/**
 * Handle form submission
 * @param {Event} event - Form submission event
 */
async function handleSubmit(event) {
  event.preventDefault();
  
  const topic = elements.topicInput.value.trim();
  if (!topic) return;
  
  // Disable form
  elements.submitBtn.disabled = true;
  elements.submitBtn.textContent = 'Starting Research...';
  
  try {
    // Start research
    const research = await startResearch(topic);
    
    // Save research ID
    currentResearch = research;
    localStorage.setItem('currentResearch', JSON.stringify(research));
    
    // Start status check
    startStatusCheck();
    
    // Show progress view
    showProgressView();
  } catch (error) {
    console.error('Error starting research:', error);
    alert(`Error starting research: ${error.message}`);
    
    // Re-enable form
    elements.submitBtn.disabled = false;
    elements.submitBtn.textContent = 'Begin Research';
  }
}

/**
 * Start a new research process
 * @param {string} topic - The research topic
 * @returns {Promise<object>} - Research session
 */
async function startResearch(topic) {
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start research');
  }
  
  return response.json();
}

/**
 * Start checking research status periodically
 */
function startStatusCheck() {
  if (!currentResearch) return;
  
  // Update immediately
  checkResearchStatus();
  
  // Then check every 5 seconds
  statusCheckInterval = setInterval(checkResearchStatus, 5000);
}

/**
 * Check research status
 */
async function checkResearchStatus() {
  if (!currentResearch) return;
  
  try {
    const status = await fetchResearchStatus(currentResearch.id);
    
    // Update progress UI
    updateProgressUI(status);
    
    // If completed or failed, stop checking
    if (status.status === RESEARCH_STATUS.COMPLETED) {
      stopStatusCheck();
      fetchAndShowResults(currentResearch.id);
    } else if (status.status === RESEARCH_STATUS.FAILED) {
      stopStatusCheck();
      alert('Research failed. Please try again.');
      resetForm();
    }
  } catch (error) {
    console.error('Error checking research status:', error);
  }
}

/**
 * Fetch research status
 * @param {string} id - Research ID
 * @returns {Promise<object>} - Research status
 */
async function fetchResearchStatus(id) {
  const response = await fetch(`/api/research/${id}/status`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch research status');
  }
  
  return response.json();
}

/**
 * Fetch research results and show them
 * @param {string} id - Research ID
 */
async function fetchAndShowResults(id) {
  try {
    const result = await fetchResearchResult(id);
    
    // Set result topic
    elements.resultTopic.textContent = result.topic;
    
    // Render markdown
    window.markdownRenderer.renderToElement(result.result, elements.markdownContent);
    
    // Show result view
    showResultView();
    
    // Clean up
    localStorage.removeItem('currentResearch');
    currentResearch = null;
  } catch (error) {
    console.error('Error fetching research result:', error);
    alert(`Error fetching results: ${error.message}`);
  }
}

/**
 * Fetch research result
 * @param {string} id - Research ID
 * @returns {Promise<object>} - Research result
 */
async function fetchResearchResult(id) {
  const response = await fetch(`/api/research/${id}/result`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch research result');
  }
  
  return response.json();
}

/**
 * Update progress UI
 * @param {object} status - Research status
 */
function updateProgressUI(status) {
  // Update topic
  elements.progressTopic.textContent = status.topic;
  
  // Update current stage
  elements.currentStage.textContent = status.currentStageDescription;
  
  // Update progress fill
  const percent = Math.round(status.progress * 100);
  elements.progressFill.style.width = `${percent}%`;
  elements.progressPercentage.textContent = `${percent}%`;
  
  // Update stage dots
  const stagesList = Object.values(RESEARCH_STAGES);
  const currentStageIndex = stagesList.indexOf(status.currentStage);
  
  elements.stages.forEach((stage, index) => {
    // Reset classes
    stage.classList.remove('active', 'completed');
    
    // Add appropriate class
    if (index < currentStageIndex) {
      stage.classList.add('completed');
    } else if (index === currentStageIndex) {
      stage.classList.add('active');
    }
  });
}

/**
 * Show progress view
 */
function showProgressView() {
  elements.researchForm.classList.add('hidden');
  elements.researchResult.classList.add('hidden');
  elements.researchProgress.classList.remove('hidden');
}

/**
 * Show result view
 */
function showResultView() {
  elements.researchForm.classList.add('hidden');
  elements.researchProgress.classList.add('hidden');
  elements.researchResult.classList.remove('hidden');
}

/**
 * Reset form to start new research
 */
function resetForm() {
  // Stop status check
  stopStatusCheck();
  
  // Clear form
  elements.topicInput.value = '';
  
  // Reset UI
  elements.submitBtn.disabled = false;
  elements.submitBtn.textContent = 'Begin Research';
  
  // Clear progress indicators
  elements.progressFill.style.width = '0%';
  elements.progressPercentage.textContent = '0%';
  elements.stages.forEach(stage => stage.classList.remove('active', 'completed'));
  
  // Show form view
  elements.researchProgress.classList.add('hidden');
  elements.researchResult.classList.add('hidden');
  elements.researchForm.classList.remove('hidden');
  
  // Clear storage
  localStorage.removeItem('currentResearch');
  currentResearch = null;
}

/**
 * Stop status check interval
 */
function stopStatusCheck() {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
    statusCheckInterval = null;
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
