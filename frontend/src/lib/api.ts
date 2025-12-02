/**
 * API client for communicating with the backend
 */

import { ScenarioResponse, ApiError } from './types';

// Backend API URL - defaults to localhost in development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Generate a scenario from a description
 * 
 * @param description - User's scenario description
 * @returns Promise with scenario data or throws error
 */
export async function generateScenario(description: string): Promise<ScenarioResponse> {
  const response = await fetch(`${API_BASE_URL}/api/scenario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new Error(error.message || 'Failed to generate scenario');
  }

  return data as ScenarioResponse;
}

/**
 * Check if the backend is healthy
 * 
 * @returns Promise with health status
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error('Backend is not available');
  }

  return response.json();
}
