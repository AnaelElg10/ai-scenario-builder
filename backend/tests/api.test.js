/**
 * API Integration Tests
 * 
 * Tests the REST API endpoints of the backend server.
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');

const app = require('../src/index');

let server;
let baseUrl;

/**
 * Helper function to make HTTP requests
 */
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

describe('API Endpoints', () => {
  before(() => {
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await makeRequest('GET', '/health');
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.status, 'healthy');
      assert.ok(response.body.timestamp);
    });
  });

  describe('POST /api/scenario', () => {
    it('should generate scenario from valid description', async () => {
      const response = await makeRequest('POST', '/api/scenario', {
        description: 'Build a user authentication flow with login and signup'
      });

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.success, true);
      assert.ok(response.body.data);
      assert.ok(response.body.data.workflow);
      assert.ok(response.body.data.mermaid_diagram);
      assert.ok(response.body.data.data_model);
      assert.ok(response.body.data.summary);
    });

    it('should return error for missing description', async () => {
      const response = await makeRequest('POST', '/api/scenario', {});

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.error);
    });

    it('should return error for empty description', async () => {
      const response = await makeRequest('POST', '/api/scenario', {
        description: ''
      });

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.error);
    });

    it('should return error for too short description', async () => {
      const response = await makeRequest('POST', '/api/scenario', {
        description: 'short'
      });

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.error);
    });

    it('should handle e-commerce scenario', async () => {
      const response = await makeRequest('POST', '/api/scenario', {
        description: 'Online store where customers browse products and checkout'
      });

      assert.strictEqual(response.status, 200);
      assert.ok(response.body.data.workflow.length > 0);
      assert.ok(response.body.data.summary.toLowerCase().includes('commerce') || 
                response.body.data.summary.toLowerCase().includes('purchase') ||
                response.body.data.summary.toLowerCase().includes('shopping'));
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await makeRequest('GET', '/unknown');
      assert.strictEqual(response.status, 404);
      assert.ok(response.body.error);
    });
  });
});
