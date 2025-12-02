'use client';

/**
 * Scenario Input Component
 * 
 * A form component for entering scenario descriptions
 * with example scenarios to help users get started.
 */

import { useState } from 'react';

interface ScenarioInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

// Example scenarios to help users get started
const exampleScenarios = [
  'Build an e-commerce checkout flow where users can browse products, add items to cart, and complete purchase with payment',
  'User authentication system with login, signup, password reset, and session management',
  'Customer support ticket system where users submit issues and agents resolve them',
  'Appointment booking platform for a medical clinic with calendar and notifications',
  'Content management workflow for blog posts with drafts, reviews, and publishing',
];

export default function ScenarioInput({ onSubmit, isLoading }: ScenarioInputProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length >= 10) {
      onSubmit(description);
    }
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">💡</span>
        Describe Your Scenario
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        Enter a description of any business, technical, or personal scenario and we&apos;ll generate
        a complete workflow, diagram, and data model for you.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: Build a user registration flow where users sign up with email, verify their account, and set up their profile..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-800 placeholder-gray-400"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between mt-4">
          <span className={`text-sm ${description.length < 10 ? 'text-gray-400' : 'text-green-600'}`}>
            {description.length} characters {description.length < 10 && '(minimum 10)'}
          </span>
          
          <button
            type="submit"
            disabled={isLoading || description.trim().length < 10}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span>🚀</span>
                Generate Scenario
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example scenarios */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-3">Try one of these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleScenarios.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 disabled:opacity-50"
            >
              {example.substring(0, 30)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
