/**
 * Diagram Generator
 * 
 * Converts workflow steps into Mermaid diagram syntax.
 * Creates visual flowcharts that can be rendered in the frontend.
 */

/**
 * Get node shape based on step type
 * Mermaid syntax: [] = rectangle, {} = rhombus (diamond), () = rounded, (()) = circle
 * 
 * @param {string} type - The step type
 * @returns {Object} Opening and closing brackets for the shape
 */
function getNodeShape(type) {
  const shapes = {
    trigger: { open: '([', close: '])' },           // Stadium shape for start
    end: { open: '([', close: '])' },               // Stadium shape for end
    decision: { open: '{', close: '}' },            // Diamond for decisions
    user_action: { open: '[', close: ']' },         // Rectangle for user actions
    user_input: { open: '[/', close: '/]' },        // Parallelogram for input
    system_action: { open: '[[', close: ']]' },     // Subroutine box
    system_check: { open: '{{', close: '}}' },      // Hexagon for validation
    database_query: { open: '[(', close: ')]' },    // Cylinder for DB
    database_write: { open: '[(', close: ')]' },    // Cylinder for DB
    notification: { open: '>', close: ']' },        // Asymmetric for notifications
    navigation: { open: '[', close: ']' },          // Rectangle
    display: { open: '[', close: ']' },             // Rectangle
    logging: { open: '[(', close: ')]' },           // Cylinder for logging
    integration: { open: '[[', close: ']]' },       // Subroutine
    review: { open: '[', close: ']' },              // Rectangle
    workflow_action: { open: '[[', close: ']]' },   // Subroutine
    conditional: { open: '{', close: '}' },         // Diamond
    ai_process: { open: '[[', close: ']]' },        // Subroutine
    data_operation: { open: '[[', close: ']]' },    // Subroutine
    error_handling: { open: '{', close: '}' }       // Diamond
  };

  return shapes[type] || { open: '[', close: ']' };
}

/**
 * Generate a node ID from step id
 * @param {number} id - Step ID
 * @returns {string} Node identifier
 */
function nodeId(id) {
  return `step${id}`;
}

/**
 * Escape special characters for Mermaid labels
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeLabel(text) {
  return text
    .replace(/"/g, "'")
    .replace(/[[\]{}()]/g, '')
    .replace(/>/g, '->')
    .replace(/</g, '<-');
}

/**
 * Generate Mermaid diagram from workflow steps
 * 
 * @param {Array} workflow - Array of workflow step objects
 * @returns {string} Mermaid diagram syntax
 */
function generateMermaidDiagram(workflow) {
  if (!workflow || workflow.length === 0) {
    return 'graph TD\n  empty[No workflow steps]';
  }

  const lines = ['graph TD'];
  
  // Add style definitions
  lines.push('  %% Style definitions');
  lines.push('  classDef trigger fill:#e1f5fe,stroke:#01579b');
  lines.push('  classDef decision fill:#fff3e0,stroke:#e65100');
  lines.push('  classDef action fill:#e8f5e9,stroke:#1b5e20');
  lines.push('  classDef notification fill:#fce4ec,stroke:#880e4f');
  lines.push('  classDef database fill:#f3e5f5,stroke:#4a148c');
  lines.push('  classDef system fill:#e3f2fd,stroke:#0d47a1');
  lines.push('');

  // Generate nodes
  lines.push('  %% Nodes');
  workflow.forEach(step => {
    const shape = getNodeShape(step.type);
    const label = escapeLabel(step.name);
    lines.push(`  ${nodeId(step.id)}${shape.open}"${label}"${shape.close}`);
  });

  lines.push('');
  lines.push('  %% Connections');

  // Generate connections
  for (let i = 0; i < workflow.length - 1; i++) {
    const current = workflow[i];
    const next = workflow[i + 1];
    
    // Add special handling for decision nodes
    if (current.type === 'decision' || current.type === 'conditional') {
      lines.push(`  ${nodeId(current.id)} -->|Yes| ${nodeId(next.id)}`);
      // If there's a step after next, add a "No" path that skips
      if (i + 2 < workflow.length) {
        lines.push(`  ${nodeId(current.id)} -.->|No| ${nodeId(workflow[i + 2].id)}`);
      }
    } else {
      lines.push(`  ${nodeId(current.id)} --> ${nodeId(next.id)}`);
    }
  }

  lines.push('');
  lines.push('  %% Apply styles');
  
  // Apply styles based on step types
  workflow.forEach(step => {
    let styleClass = 'action';
    if (step.type === 'trigger' || step.type === 'end') styleClass = 'trigger';
    else if (step.type === 'decision' || step.type === 'conditional') styleClass = 'decision';
    else if (step.type === 'notification') styleClass = 'notification';
    else if (step.type.includes('database')) styleClass = 'database';
    else if (step.type.includes('system')) styleClass = 'system';
    
    lines.push(`  class ${nodeId(step.id)} ${styleClass}`);
  });

  return lines.join('\n');
}

module.exports = {
  generateMermaidDiagram,
  getNodeShape,
  escapeLabel
};
