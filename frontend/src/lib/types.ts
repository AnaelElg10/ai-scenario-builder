/**
 * TypeScript type definitions for the AI Scenario Builder
 */

// Workflow step definition
export interface WorkflowStep {
  id: number;
  name: string;
  description: string;
  type: string;
}

// Data model entity
export interface EntitySchema {
  type: string;
  properties: Record<string, {
    type: string;
    description?: string;
    format?: string;
    enum?: string[];
    items?: { type: string };
    minimum?: number;
    default?: boolean;
  }>;
  required?: string[];
}

// Relationship between entities
export interface Relationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description: string;
}

// Complete data model
export interface DataModel {
  $schema: string;
  title: string;
  description: string;
  entities: Record<string, EntitySchema>;
  relationships: Relationship[];
}

// Complete scenario response from API
export interface ScenarioResponse {
  success: boolean;
  data: {
    workflow: WorkflowStep[];
    mermaid_diagram: string;
    data_model: DataModel;
    summary: string;
  };
}

// API error response
export interface ApiError {
  error: string;
  message: string;
}
