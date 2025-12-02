/**
 * Mock AI Generator
 * 
 * This module simulates an LLM's response for workflow generation.
 * In production, this would be replaced with calls to OpenAI, Claude, etc.
 * 
 * ============================================
 * HOW TO INTEGRATE A REAL LLM:
 * ============================================
 * 
 * 1. Install the OpenAI SDK: npm install openai
 * 
 * 2. Replace mockAIGenerate with:
 * 
 *    const OpenAI = require('openai');
 *    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * 
 *    async function generateWithLLM(description) {
 *      const response = await openai.chat.completions.create({
 *        model: "gpt-4",
 *        messages: [
 *          { role: "system", content: SYSTEM_PROMPT },
 *          { role: "user", content: description }
 *        ],
 *        response_format: { type: "json_object" }
 *      });
 *      return JSON.parse(response.choices[0].message.content);
 *    }
 * 
 * 3. The SYSTEM_PROMPT should instruct the LLM to return JSON with:
 *    - workflow: array of step objects
 *    - summary: string description
 * 
 * ============================================
 */

/**
 * Analyzes a description and extracts key entities and actions
 * @param {string} description - User's scenario description
 * @returns {Object} Extracted keywords and context
 */
function analyzeDescription(description) {
  const lowerDesc = description.toLowerCase();
  
  // Detect scenario type
  const types = {
    ecommerce: ['shop', 'cart', 'buy', 'purchase', 'order', 'payment', 'checkout', 'product'],
    auth: ['login', 'signup', 'register', 'password', 'authentication', 'user account'],
    booking: ['book', 'reserve', 'appointment', 'schedule', 'calendar'],
    support: ['ticket', 'support', 'help', 'issue', 'complaint', 'customer service'],
    content: ['post', 'blog', 'article', 'publish', 'content', 'write'],
    workflow: ['approval', 'review', 'process', 'workflow', 'task', 'assign'],
    data: ['import', 'export', 'sync', 'migrate', 'transfer', 'data'],
    notification: ['notify', 'alert', 'email', 'sms', 'notification', 'remind']
  };

  let detectedType = 'general';
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(kw => lowerDesc.includes(kw))) {
      detectedType = type;
      break;
    }
  }

  return { type: detectedType, description: lowerDesc };
}

/**
 * Generate workflow steps based on scenario type
 * @param {string} type - Detected scenario type
 * @param {string} description - Original description
 * @returns {Array} Array of workflow step objects
 */
function generateStepsForType(type, description) {
  const templates = {
    ecommerce: [
      { id: 1, name: 'Browse Products', description: 'User browses available products', type: 'user_action' },
      { id: 2, name: 'Add to Cart', description: 'User adds selected items to shopping cart', type: 'user_action' },
      { id: 3, name: 'Validate Cart', description: 'System validates cart items and availability', type: 'system_check' },
      { id: 4, name: 'Enter Shipping Info', description: 'User provides shipping address', type: 'user_input' },
      { id: 5, name: 'Select Payment Method', description: 'User chooses payment option', type: 'user_action' },
      { id: 6, name: 'Process Payment', description: 'System processes the payment transaction', type: 'system_action' },
      { id: 7, name: 'Payment Verification', description: 'Verify payment success or failure', type: 'decision' },
      { id: 8, name: 'Generate Order', description: 'System creates order record', type: 'system_action' },
      { id: 9, name: 'Send Confirmation', description: 'Email confirmation sent to user', type: 'notification' },
      { id: 10, name: 'Update Inventory', description: 'System updates product inventory', type: 'system_action' }
    ],
    auth: [
      { id: 1, name: 'Enter Credentials', description: 'User enters username/email and password', type: 'user_input' },
      { id: 2, name: 'Validate Input', description: 'System validates input format', type: 'system_check' },
      { id: 3, name: 'Check User Exists', description: 'Database lookup for user record', type: 'database_query' },
      { id: 4, name: 'Verify Password', description: 'Compare password hash', type: 'system_check' },
      { id: 5, name: 'Authentication Decision', description: 'Determine if credentials are valid', type: 'decision' },
      { id: 6, name: 'Generate Session', description: 'Create session token or JWT', type: 'system_action' },
      { id: 7, name: 'Log Authentication', description: 'Record login attempt for security', type: 'logging' },
      { id: 8, name: 'Redirect User', description: 'Send user to dashboard or home', type: 'navigation' }
    ],
    booking: [
      { id: 1, name: 'Select Service', description: 'User chooses the service to book', type: 'user_action' },
      { id: 2, name: 'Check Availability', description: 'System checks available time slots', type: 'system_check' },
      { id: 3, name: 'Display Slots', description: 'Show available dates and times', type: 'display' },
      { id: 4, name: 'Select Time Slot', description: 'User picks preferred date and time', type: 'user_action' },
      { id: 5, name: 'Enter Details', description: 'User provides contact and booking details', type: 'user_input' },
      { id: 6, name: 'Validate Booking', description: 'System validates the booking request', type: 'system_check' },
      { id: 7, name: 'Create Reservation', description: 'System creates the booking record', type: 'database_write' },
      { id: 8, name: 'Send Confirmation', description: 'Email/SMS confirmation sent', type: 'notification' },
      { id: 9, name: 'Add to Calendar', description: 'Optional calendar integration', type: 'integration' }
    ],
    support: [
      { id: 1, name: 'Open Ticket Form', description: 'User accesses support request form', type: 'navigation' },
      { id: 2, name: 'Select Category', description: 'User chooses issue category', type: 'user_action' },
      { id: 3, name: 'Describe Issue', description: 'User describes the problem in detail', type: 'user_input' },
      { id: 4, name: 'Attach Files', description: 'User uploads supporting documents', type: 'user_action' },
      { id: 5, name: 'Auto-Categorize', description: 'AI analyzes and tags the ticket', type: 'ai_process' },
      { id: 6, name: 'Priority Assignment', description: 'System assigns priority level', type: 'system_action' },
      { id: 7, name: 'Route to Agent', description: 'Ticket assigned to appropriate agent', type: 'system_action' },
      { id: 8, name: 'Notify User', description: 'Confirmation sent with ticket number', type: 'notification' },
      { id: 9, name: 'Notify Agent', description: 'Agent receives new ticket alert', type: 'notification' }
    ],
    content: [
      { id: 1, name: 'Create Draft', description: 'User starts new content draft', type: 'user_action' },
      { id: 2, name: 'Write Content', description: 'User writes the main content', type: 'user_input' },
      { id: 3, name: 'Add Media', description: 'User uploads images or videos', type: 'user_action' },
      { id: 4, name: 'Set Metadata', description: 'User adds title, tags, category', type: 'user_input' },
      { id: 5, name: 'Preview Content', description: 'System renders preview', type: 'display' },
      { id: 6, name: 'Content Validation', description: 'System checks for required fields', type: 'system_check' },
      { id: 7, name: 'Submit for Review', description: 'Content sent for approval', type: 'workflow_action' },
      { id: 8, name: 'Review Decision', description: 'Reviewer approves or requests changes', type: 'decision' },
      { id: 9, name: 'Publish Content', description: 'Content goes live', type: 'system_action' },
      { id: 10, name: 'Notify Subscribers', description: 'Followers notified of new content', type: 'notification' }
    ],
    workflow: [
      { id: 1, name: 'Task Creation', description: 'New task or request is created', type: 'trigger' },
      { id: 2, name: 'Initial Review', description: 'First level review of the request', type: 'review' },
      { id: 3, name: 'Completeness Check', description: 'Verify all required info is present', type: 'system_check' },
      { id: 4, name: 'Assign Reviewer', description: 'Route to appropriate reviewer', type: 'system_action' },
      { id: 5, name: 'Review Process', description: 'Reviewer examines the request', type: 'user_action' },
      { id: 6, name: 'Approval Decision', description: 'Approve, reject, or request changes', type: 'decision' },
      { id: 7, name: 'Handle Rejection', description: 'Process rejection with feedback', type: 'conditional' },
      { id: 8, name: 'Execute Approval', description: 'Perform the approved action', type: 'system_action' },
      { id: 9, name: 'Audit Log', description: 'Record the complete workflow trail', type: 'logging' },
      { id: 10, name: 'Notify Stakeholders', description: 'Inform all parties of outcome', type: 'notification' }
    ],
    data: [
      { id: 1, name: 'Select Source', description: 'Choose data source for operation', type: 'user_action' },
      { id: 2, name: 'Configure Mapping', description: 'Define field mappings', type: 'user_input' },
      { id: 3, name: 'Validate Configuration', description: 'System checks configuration validity', type: 'system_check' },
      { id: 4, name: 'Preview Data', description: 'Show sample of data to be processed', type: 'display' },
      { id: 5, name: 'Confirm Operation', description: 'User confirms to proceed', type: 'user_action' },
      { id: 6, name: 'Extract Data', description: 'Read data from source', type: 'data_operation' },
      { id: 7, name: 'Transform Data', description: 'Apply transformations and mappings', type: 'data_operation' },
      { id: 8, name: 'Validate Data', description: 'Check data integrity and format', type: 'system_check' },
      { id: 9, name: 'Load Data', description: 'Write data to destination', type: 'data_operation' },
      { id: 10, name: 'Generate Report', description: 'Create operation summary report', type: 'system_action' }
    ],
    notification: [
      { id: 1, name: 'Trigger Event', description: 'Event occurs that requires notification', type: 'trigger' },
      { id: 2, name: 'Fetch Recipients', description: 'Query notification preferences', type: 'database_query' },
      { id: 3, name: 'Filter Recipients', description: 'Apply opt-out and preferences', type: 'system_check' },
      { id: 4, name: 'Prepare Content', description: 'Generate notification content', type: 'system_action' },
      { id: 5, name: 'Channel Selection', description: 'Determine delivery channel', type: 'decision' },
      { id: 6, name: 'Queue Notification', description: 'Add to notification queue', type: 'system_action' },
      { id: 7, name: 'Send Notification', description: 'Dispatch via selected channel', type: 'integration' },
      { id: 8, name: 'Track Delivery', description: 'Monitor delivery status', type: 'logging' },
      { id: 9, name: 'Handle Failures', description: 'Retry or escalate failed sends', type: 'error_handling' }
    ],
    general: [
      { id: 1, name: 'Initialize Process', description: 'Start the workflow process', type: 'trigger' },
      { id: 2, name: 'Gather Input', description: 'Collect required information', type: 'user_input' },
      { id: 3, name: 'Validate Input', description: 'Check input completeness and format', type: 'system_check' },
      { id: 4, name: 'Process Request', description: 'Execute main business logic', type: 'system_action' },
      { id: 5, name: 'Decision Point', description: 'Evaluate conditions for next step', type: 'decision' },
      { id: 6, name: 'Execute Action', description: 'Perform the required action', type: 'system_action' },
      { id: 7, name: 'Store Results', description: 'Save outcome to database', type: 'database_write' },
      { id: 8, name: 'Generate Response', description: 'Prepare response for user', type: 'system_action' },
      { id: 9, name: 'Send Notifications', description: 'Alert relevant parties', type: 'notification' },
      { id: 10, name: 'Complete Process', description: 'Finalize and close the workflow', type: 'end' }
    ]
  };

  return templates[type] || templates.general;
}

/**
 * Generate a summary based on scenario type
 * @param {string} type - Detected scenario type
 * @param {string} description - Original description
 * @returns {string} Human-readable summary
 */
function generateSummary(type, description) {
  const summaries = {
    ecommerce: 'This e-commerce workflow handles the complete purchase journey from product browsing to order confirmation. It includes cart management, payment processing, and inventory updates to ensure a smooth shopping experience.',
    auth: 'This authentication workflow securely handles user login with input validation, credential verification, and session management. It includes security logging for audit purposes.',
    booking: 'This booking workflow manages appointment scheduling from service selection to confirmation. It includes availability checking, slot selection, and calendar integration capabilities.',
    support: 'This customer support workflow handles ticket creation and routing. It uses AI-powered categorization and priority assignment to ensure efficient issue resolution.',
    content: 'This content management workflow covers the complete publishing lifecycle from draft creation to publication. It includes review processes and subscriber notifications.',
    workflow: 'This approval workflow manages multi-level review processes with proper routing, decision handling, and audit logging for compliance.',
    data: 'This data operation workflow handles ETL (Extract, Transform, Load) processes with validation, preview, and comprehensive reporting.',
    notification: 'This notification workflow manages multi-channel message delivery with preference handling, delivery tracking, and failure recovery.',
    general: 'This workflow outlines a structured process to accomplish the described scenario. It includes input handling, processing logic, and appropriate notifications.'
  };

  return summaries[type] || summaries.general;
}

/**
 * Mock AI function that simulates LLM-based workflow generation
 * 
 * @param {string} description - The scenario description
 * @returns {Promise<Object>} Generated workflow and summary
 */
async function mockAIGenerate(description) {
  // Simulate AI processing delay (50-150ms)
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

  // Analyze the description to determine scenario type
  const analysis = analyzeDescription(description);

  // Generate appropriate workflow steps
  const workflow = generateStepsForType(analysis.type, description);

  // Generate contextual summary
  const summary = generateSummary(analysis.type, description);

  return {
    workflow,
    summary,
    metadata: {
      detectedType: analysis.type,
      generatedAt: new Date().toISOString(),
      aiProvider: 'mock'
    }
  };
}

module.exports = {
  mockAIGenerate,
  analyzeDescription,
  generateStepsForType,
  generateSummary
};
