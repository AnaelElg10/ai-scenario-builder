/**
 * Workflow Service
 * 
 * Core business logic for generating workflows from scenario descriptions.
 * Currently uses a mock AI function that will be replaced with a real LLM.
 */

const { mockAIGenerate } = require('../utils/mockAI');
const { generateMermaidDiagram } = require('../utils/diagramGenerator');
const { generateDataModel } = require('../utils/schemaGenerator');

/**
 * Generate a complete workflow from a scenario description
 * 
 * @param {string} description - The user's scenario description
 * @returns {Object} Complete scenario breakdown
 */
async function generateWorkflow(description) {
  // Step 1: Use AI to analyze the scenario and generate workflow steps
  const aiResponse = await mockAIGenerate(description);

  // Step 2: Generate a Mermaid diagram from the workflow
  const mermaidDiagram = generateMermaidDiagram(aiResponse.workflow);

  // Step 3: Generate a data model based on the workflow
  const dataModel = generateDataModel(aiResponse.workflow, description);

  // Step 4: Compile and return the complete result
  return {
    workflow: aiResponse.workflow,
    mermaid_diagram: mermaidDiagram,
    data_model: dataModel,
    summary: aiResponse.summary
  };
}

module.exports = {
  generateWorkflow
};
