/**
 * Scenario Controller
 * 
 * Handles HTTP requests for scenario generation.
 * Validates input and delegates to the workflow service.
 */

const workflowService = require('../services/workflowService');

/**
 * Generate a complete scenario breakdown
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function generateScenario(req, res) {
  try {
    // Extract and validate input
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide a valid scenario description'
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        error: 'Description too short',
        message: 'Please provide a more detailed scenario description (at least 10 characters)'
      });
    }

    // Generate the scenario using the workflow service
    const result = await workflowService.generateWorkflow(description.trim());

    // Return successful response
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error generating scenario:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: 'An error occurred while generating the scenario'
    });
  }
}

module.exports = {
  generateScenario
};
