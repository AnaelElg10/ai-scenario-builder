/**
 * AI Scenario Builder - Backend Entry Point
 * 
 * This is the main entry point for the Express server.
 * It sets up middleware, routes, and starts the server.
 */

const express = require('express');
const cors = require('cors');
const scenarioRoutes = require('./routes/scenarioRoutes');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON request bodies
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Scenario API routes
app.use('/api', scenarioRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// SERVER STARTUP
// ============================================

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║     AI SCENARIO BUILDER - BACKEND          ║
    ╠════════════════════════════════════════════╣
    ║  Server running on: http://localhost:${PORT}  ║
    ║  Health check:      /health                ║
    ║  API endpoint:      POST /api/scenario     ║
    ╚════════════════════════════════════════════╝
    `);
  });
}

// Export app for testing
module.exports = app;
