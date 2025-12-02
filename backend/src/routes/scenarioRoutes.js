/**
 * Scenario Routes
 * 
 * Defines all API routes related to scenario generation.
 */

const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');

/**
 * POST /api/scenario
 * 
 * Generates a complete scenario breakdown including:
 * - Workflow steps
 * - Mermaid diagram
 * - Data model
 * - Summary
 * 
 * @body {string} description - The scenario description from the user
 */
router.post('/scenario', scenarioController.generateScenario);

module.exports = router;
