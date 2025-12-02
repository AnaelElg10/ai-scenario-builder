/**
 * Schema Generator
 * 
 * Generates data models based on workflow analysis.
 * Creates a JSON schema that represents the data structure behind the workflow.
 */

/**
 * Extract entities from workflow steps
 * @param {Array} workflow - Workflow steps
 * @returns {Set} Set of detected entities
 */
function extractEntities(workflow) {
  const entities = new Set();
  
  workflow.forEach(step => {
    // Extract potential entities from step names and descriptions
    const text = `${step.name} ${step.description}`.toLowerCase();
    
    if (text.includes('user') || text.includes('credential')) entities.add('User');
    if (text.includes('product') || text.includes('item')) entities.add('Product');
    if (text.includes('order') || text.includes('purchase')) entities.add('Order');
    if (text.includes('cart')) entities.add('Cart');
    if (text.includes('payment')) entities.add('Payment');
    if (text.includes('ticket') || text.includes('issue')) entities.add('Ticket');
    if (text.includes('booking') || text.includes('reservation') || text.includes('appointment')) entities.add('Booking');
    if (text.includes('content') || text.includes('post') || text.includes('article')) entities.add('Content');
    if (text.includes('notification') || text.includes('alert')) entities.add('Notification');
    if (text.includes('session') || text.includes('token')) entities.add('Session');
    if (text.includes('task') || text.includes('workflow')) entities.add('Task');
  });

  // Always include a base entity for the scenario
  if (entities.size === 0) {
    entities.add('Record');
  }

  return entities;
}

/**
 * Generate schema for a specific entity type
 * @param {string} entity - Entity name
 * @returns {Object} JSON schema object
 */
function generateEntitySchema(entity) {
  const schemas = {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
        email: { type: 'string', format: 'email', description: 'User email address' },
        name: { type: 'string', description: 'User full name' },
        role: { type: 'string', enum: ['user', 'admin', 'moderator'], description: 'User role' },
        created_at: { type: 'string', format: 'date-time', description: 'Account creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      },
      required: ['id', 'email']
    },
    Product: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Product identifier' },
        name: { type: 'string', description: 'Product name' },
        description: { type: 'string', description: 'Product description' },
        price: { type: 'number', minimum: 0, description: 'Product price' },
        inventory: { type: 'integer', minimum: 0, description: 'Available quantity' },
        category: { type: 'string', description: 'Product category' }
      },
      required: ['id', 'name', 'price']
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Order identifier' },
        user_id: { type: 'string', format: 'uuid', description: 'Customer reference' },
        items: { type: 'array', items: { type: 'object' }, description: 'Order items' },
        total: { type: 'number', minimum: 0, description: 'Order total' },
        status: { type: 'string', enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] },
        created_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'user_id', 'items', 'total', 'status']
    },
    Cart: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Cart identifier' },
        user_id: { type: 'string', format: 'uuid', description: 'User reference' },
        items: { type: 'array', items: { type: 'object' }, description: 'Cart items' },
        subtotal: { type: 'number', minimum: 0, description: 'Cart subtotal' },
        updated_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'items']
    },
    Payment: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Payment identifier' },
        order_id: { type: 'string', format: 'uuid', description: 'Order reference' },
        amount: { type: 'number', minimum: 0, description: 'Payment amount' },
        method: { type: 'string', enum: ['card', 'paypal', 'bank_transfer'] },
        status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
        processed_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'order_id', 'amount', 'status']
    },
    Ticket: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Ticket identifier' },
        user_id: { type: 'string', format: 'uuid', description: 'Submitter reference' },
        subject: { type: 'string', description: 'Ticket subject' },
        description: { type: 'string', description: 'Issue description' },
        category: { type: 'string', description: 'Issue category' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed'] },
        assigned_to: { type: 'string', format: 'uuid', description: 'Agent reference' },
        created_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'subject', 'status']
    },
    Booking: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Booking identifier' },
        user_id: { type: 'string', format: 'uuid', description: 'Customer reference' },
        service: { type: 'string', description: 'Service booked' },
        date: { type: 'string', format: 'date', description: 'Booking date' },
        time_slot: { type: 'string', description: 'Time slot' },
        status: { type: 'string', enum: ['confirmed', 'pending', 'cancelled', 'completed'] },
        notes: { type: 'string', description: 'Additional notes' }
      },
      required: ['id', 'user_id', 'service', 'date', 'status']
    },
    Content: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Content identifier' },
        author_id: { type: 'string', format: 'uuid', description: 'Author reference' },
        title: { type: 'string', description: 'Content title' },
        body: { type: 'string', description: 'Content body' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Content tags' },
        status: { type: 'string', enum: ['draft', 'review', 'published', 'archived'] },
        published_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'title', 'body', 'status']
    },
    Notification: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Notification identifier' },
        user_id: { type: 'string', format: 'uuid', description: 'Recipient reference' },
        type: { type: 'string', description: 'Notification type' },
        channel: { type: 'string', enum: ['email', 'sms', 'push', 'in_app'] },
        content: { type: 'string', description: 'Message content' },
        read: { type: 'boolean', default: false },
        sent_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'user_id', 'type', 'content']
    },
    Session: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Session identifier' },
        user_id: { type: 'string', format: 'uuid', description: 'User reference' },
        token: { type: 'string', description: 'Session token' },
        expires_at: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' },
        ip_address: { type: 'string', description: 'Client IP' }
      },
      required: ['id', 'user_id', 'token', 'expires_at']
    },
    Task: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Task identifier' },
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Task description' },
        assignee_id: { type: 'string', format: 'uuid', description: 'Assignee reference' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'review', 'completed'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        due_date: { type: 'string', format: 'date' }
      },
      required: ['id', 'title', 'status']
    },
    Record: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'Record identifier' },
        type: { type: 'string', description: 'Record type' },
        data: { type: 'object', description: 'Record data' },
        status: { type: 'string', description: 'Record status' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'type', 'data']
    }
  };

  return schemas[entity] || schemas.Record;
}

/**
 * Generate a complete data model from workflow steps
 * 
 * @param {Array} workflow - Workflow steps array
 * @param {string} description - Original scenario description
 * @returns {Object} Complete data model with entities and relationships
 */
function generateDataModel(workflow, description) {
  const entities = extractEntities(workflow);
  const entityArray = Array.from(entities);

  // Build the data model
  const dataModel = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Scenario Data Model',
    description: `Data model generated for: ${description.substring(0, 100)}...`,
    entities: {},
    relationships: []
  };

  // Add entity schemas
  entityArray.forEach(entity => {
    dataModel.entities[entity] = generateEntitySchema(entity);
  });

  // Generate relationships between entities
  const relationshipMap = {
    'User-Order': { from: 'User', to: 'Order', type: 'one-to-many', description: 'User places orders' },
    'User-Cart': { from: 'User', to: 'Cart', type: 'one-to-one', description: 'User has a cart' },
    'User-Ticket': { from: 'User', to: 'Ticket', type: 'one-to-many', description: 'User creates tickets' },
    'User-Booking': { from: 'User', to: 'Booking', type: 'one-to-many', description: 'User makes bookings' },
    'User-Content': { from: 'User', to: 'Content', type: 'one-to-many', description: 'User creates content' },
    'User-Session': { from: 'User', to: 'Session', type: 'one-to-many', description: 'User has sessions' },
    'User-Notification': { from: 'User', to: 'Notification', type: 'one-to-many', description: 'User receives notifications' },
    'Order-Payment': { from: 'Order', to: 'Payment', type: 'one-to-one', description: 'Order has payment' },
    'Order-Product': { from: 'Order', to: 'Product', type: 'many-to-many', description: 'Order contains products' },
    'Cart-Product': { from: 'Cart', to: 'Product', type: 'many-to-many', description: 'Cart contains products' }
  };

  // Add relevant relationships
  for (let i = 0; i < entityArray.length; i++) {
    for (let j = i + 1; j < entityArray.length; j++) {
      const key1 = `${entityArray[i]}-${entityArray[j]}`;
      const key2 = `${entityArray[j]}-${entityArray[i]}`;
      
      if (relationshipMap[key1]) {
        dataModel.relationships.push(relationshipMap[key1]);
      } else if (relationshipMap[key2]) {
        dataModel.relationships.push(relationshipMap[key2]);
      }
    }
  }

  return dataModel;
}

module.exports = {
  generateDataModel,
  extractEntities,
  generateEntitySchema
};
