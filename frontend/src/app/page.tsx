'use client';

/**
 * AI Scenario Builder - Main Page
 * 
 * This is the main application page where users can:
 * 1. Enter a scenario description
 * 2. View generated workflow steps
 * 3. See the Mermaid diagram
 * 4. Explore the data model
 * 5. Regenerate with different descriptions
 */

import { useState } from 'react';
import ScenarioInput from '@/components/ScenarioInput';
import WorkflowDisplay from '@/components/WorkflowDisplay';
import MermaidDiagram from '@/components/MermaidDiagram';
import DataModelDisplay from '@/components/DataModelDisplay';
import { generateScenario } from '@/lib/api';
import { ScenarioResponse } from '@/lib/types';

type TabType = 'workflow' | 'diagram' | 'dataModel';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScenarioResponse | null>(null);
  const [inputDescription, setInputDescription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('workflow');

  const handleGenerate = async (description: string) => {
    setIsLoading(true);
    setError(null);
    setInputDescription(description);

    try {
      const response = await generateScenario(description);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (inputDescription) {
      handleGenerate(inputDescription);
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'workflow', label: 'Workflow Steps', icon: '📋' },
    { id: 'diagram', label: 'Visual Diagram', icon: '📊' },
    { id: 'dataModel', label: 'Data Model', icon: '🗃️' },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Scenario Builder
            </span>
            <span className="ml-3 text-3xl">🤖</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform any scenario description into a structured workflow, visual diagram, 
            and data model — powered by AI.
          </p>
        </header>

        {/* Input Section */}
        <section className="mb-8">
          <ScenarioInput onSubmit={handleGenerate} isLoading={isLoading} />
        </section>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-xl">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
            <p className="text-red-600 text-sm mt-1">
              Make sure the backend server is running on port 3001.
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && result.data && (
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* User Input Display */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Your Scenario
                  </h3>
                  <p className="text-gray-600">{inputDescription}</p>
                </div>
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="flex-shrink-0 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <span>🔄</span>
                  Regenerate
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-blue-50 border-b border-gray-200">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-lg">✨</span>
                Summary
              </h3>
              <p className="text-blue-700">{result.data.summary}</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'workflow' && (
                <WorkflowDisplay workflow={result.data.workflow} />
              )}
              {activeTab === 'diagram' && (
                <MermaidDiagram diagram={result.data.mermaid_diagram} />
              )}
              {activeTab === 'dataModel' && (
                <DataModelDisplay dataModel={result.data.data_model} />
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Built with 💙 using Next.js, Express, and AI assistance
          </p>
          <p className="mt-1">
            The mock AI can be replaced with a real LLM (OpenAI, Claude, etc.)
          </p>
        </footer>
      </div>
    </main>
  );
}
