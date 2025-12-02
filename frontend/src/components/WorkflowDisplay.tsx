'use client';

/**
 * Workflow Display Component
 * 
 * Displays workflow steps in a visually appealing list format
 * with icons and color coding based on step type.
 */

import { WorkflowStep } from '@/lib/types';

interface WorkflowDisplayProps {
  workflow: WorkflowStep[];
}

// Icon mapping for different step types
function getStepIcon(type: string): string {
  const icons: Record<string, string> = {
    trigger: '🚀',
    end: '🏁',
    user_action: '👆',
    user_input: '📝',
    system_action: '⚙️',
    system_check: '✅',
    database_query: '🔍',
    database_write: '💾',
    decision: '🔀',
    conditional: '❓',
    notification: '📢',
    navigation: '🧭',
    display: '📺',
    logging: '📋',
    integration: '🔗',
    review: '👀',
    workflow_action: '📊',
    ai_process: '🤖',
    data_operation: '📦',
    error_handling: '⚠️',
  };
  return icons[type] || '📌';
}

// Color mapping for different step types
function getStepColor(type: string): string {
  const colors: Record<string, string> = {
    trigger: 'bg-green-100 border-green-300 text-green-800',
    end: 'bg-green-100 border-green-300 text-green-800',
    user_action: 'bg-blue-100 border-blue-300 text-blue-800',
    user_input: 'bg-blue-100 border-blue-300 text-blue-800',
    system_action: 'bg-purple-100 border-purple-300 text-purple-800',
    system_check: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    database_query: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    database_write: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    decision: 'bg-orange-100 border-orange-300 text-orange-800',
    conditional: 'bg-orange-100 border-orange-300 text-orange-800',
    notification: 'bg-pink-100 border-pink-300 text-pink-800',
    navigation: 'bg-teal-100 border-teal-300 text-teal-800',
    display: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    logging: 'bg-gray-100 border-gray-300 text-gray-800',
    integration: 'bg-violet-100 border-violet-300 text-violet-800',
    review: 'bg-amber-100 border-amber-300 text-amber-800',
    workflow_action: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    ai_process: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800',
    data_operation: 'bg-lime-100 border-lime-300 text-lime-800',
    error_handling: 'bg-red-100 border-red-300 text-red-800',
  };
  return colors[type] || 'bg-gray-100 border-gray-300 text-gray-800';
}

export default function WorkflowDisplay({ workflow }: WorkflowDisplayProps) {
  if (!workflow || workflow.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No workflow steps available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workflow.map((step, index) => (
        <div
          key={step.id}
          className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          {/* Step number circle */}
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {index + 1}
          </div>
          
          {/* Step content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl" role="img" aria-label={step.type}>
                {getStepIcon(step.type)}
              </span>
              <h4 className="font-semibold text-gray-900 truncate">
                {step.name}
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              {step.description}
            </p>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded border ${getStepColor(step.type)}`}>
              {step.type.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Connector line (except for last item) */}
          {index < workflow.length - 1 && (
            <div className="absolute left-9 mt-14 w-0.5 h-6 bg-blue-200" />
          )}
        </div>
      ))}
    </div>
  );
}
