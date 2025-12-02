/**
 * Tests for Workflow Generation
 * 
 * Tests the core workflow generation logic including:
 * - Mock AI generation
 * - Diagram generation
 * - Schema generation
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const { mockAIGenerate, analyzeDescription, generateStepsForType } = require('../src/utils/mockAI');
const { generateMermaidDiagram, escapeLabel } = require('../src/utils/diagramGenerator');
const { generateDataModel, extractEntities } = require('../src/utils/schemaGenerator');
const { generateWorkflow } = require('../src/services/workflowService');

// ============================================
// Mock AI Tests
// ============================================

describe('Mock AI Generator', () => {
  it('should analyze e-commerce scenario correctly', () => {
    const analysis = analyzeDescription('I want to build an online shop where users can buy products');
    assert.strictEqual(analysis.type, 'ecommerce');
  });

  it('should analyze authentication scenario correctly', () => {
    const analysis = analyzeDescription('User login and signup flow with password reset');
    assert.strictEqual(analysis.type, 'auth');
  });

  it('should analyze booking scenario correctly', () => {
    const analysis = analyzeDescription('Book an appointment with a doctor');
    assert.strictEqual(analysis.type, 'booking');
  });

  it('should analyze support scenario correctly', () => {
    const analysis = analyzeDescription('Create a customer support ticket system');
    assert.strictEqual(analysis.type, 'support');
  });

  it('should fall back to general for unknown scenarios', () => {
    const analysis = analyzeDescription('Something completely random and unique');
    assert.strictEqual(analysis.type, 'general');
  });

  it('should generate workflow steps', () => {
    const steps = generateStepsForType('ecommerce', 'buy products');
    assert.ok(Array.isArray(steps));
    assert.ok(steps.length > 0);
    assert.ok(steps[0].id);
    assert.ok(steps[0].name);
    assert.ok(steps[0].type);
  });

  it('should generate async response with mockAIGenerate', async () => {
    const result = await mockAIGenerate('online shopping checkout');
    assert.ok(result.workflow);
    assert.ok(result.summary);
    assert.ok(Array.isArray(result.workflow));
  });
});

// ============================================
// Diagram Generator Tests
// ============================================

describe('Diagram Generator', () => {
  it('should generate valid Mermaid syntax', () => {
    const workflow = [
      { id: 1, name: 'Start', type: 'trigger' },
      { id: 2, name: 'Process', type: 'system_action' },
      { id: 3, name: 'End', type: 'end' }
    ];
    const diagram = generateMermaidDiagram(workflow);
    
    assert.ok(diagram.startsWith('graph TD'));
    assert.ok(diagram.includes('step1'));
    assert.ok(diagram.includes('step2'));
    assert.ok(diagram.includes('step3'));
    assert.ok(diagram.includes('-->'));
  });

  it('should handle empty workflow', () => {
    const diagram = generateMermaidDiagram([]);
    assert.ok(diagram.includes('No workflow steps'));
  });

  it('should escape special characters', () => {
    assert.strictEqual(escapeLabel('test "quoted"'), "test 'quoted'");
    assert.strictEqual(escapeLabel('test [brackets]'), 'test brackets');
  });

  it('should handle decision nodes with multiple paths', () => {
    const workflow = [
      { id: 1, name: 'Start', type: 'trigger' },
      { id: 2, name: 'Decision', type: 'decision' },
      { id: 3, name: 'Yes Path', type: 'system_action' },
      { id: 4, name: 'End', type: 'end' }
    ];
    const diagram = generateMermaidDiagram(workflow);
    
    assert.ok(diagram.includes('Yes'));
    assert.ok(diagram.includes('No'));
  });
});

// ============================================
// Schema Generator Tests
// ============================================

describe('Schema Generator', () => {
  it('should extract User entity from auth workflow', () => {
    const workflow = [
      { id: 1, name: 'Enter Credentials', description: 'User enters password' }
    ];
    const entities = extractEntities(workflow);
    assert.ok(entities.has('User'));
  });

  it('should extract Product and Order entities from e-commerce workflow', () => {
    const workflow = [
      { id: 1, name: 'Browse', description: 'Browse products' },
      { id: 2, name: 'Order', description: 'Place order' }
    ];
    const entities = extractEntities(workflow);
    assert.ok(entities.has('Product'));
    assert.ok(entities.has('Order'));
  });

  it('should generate valid data model', () => {
    const workflow = [
      { id: 1, name: 'Login', description: 'User authentication' }
    ];
    const model = generateDataModel(workflow, 'User login flow');
    
    assert.ok(model.$schema);
    assert.ok(model.entities);
    assert.ok(model.relationships);
    assert.ok(model.entities.User);
  });

  it('should include entity properties', () => {
    const workflow = [
      { id: 1, name: 'Checkout', description: 'User pays for order' }
    ];
    const model = generateDataModel(workflow, 'Checkout flow');
    
    // Should have User and Order entities
    assert.ok(model.entities.User);
    assert.ok(model.entities.Order);
    assert.ok(model.entities.User.properties.id);
    assert.ok(model.entities.Order.properties.status);
  });
});

// ============================================
// Workflow Service Integration Tests
// ============================================

describe('Workflow Service', () => {
  it('should generate complete workflow result', async () => {
    const result = await generateWorkflow('Build an e-commerce checkout flow');
    
    assert.ok(result.workflow);
    assert.ok(result.mermaid_diagram);
    assert.ok(result.data_model);
    assert.ok(result.summary);
    
    assert.ok(Array.isArray(result.workflow));
    assert.ok(result.mermaid_diagram.includes('graph TD'));
    assert.ok(typeof result.summary === 'string');
  });

  it('should generate different workflows for different scenarios', async () => {
    const ecommerce = await generateWorkflow('online shopping cart');
    const auth = await generateWorkflow('user login with password');
    
    assert.notDeepStrictEqual(ecommerce.workflow, auth.workflow);
    assert.notStrictEqual(ecommerce.summary, auth.summary);
  });
});
