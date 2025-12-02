'use client';

/**
 * Mermaid Diagram Component
 * 
 * Renders Mermaid diagrams dynamically on the client side.
 * Uses mermaid.js for rendering the diagram syntax.
 */

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  diagram: string;
}

export default function MermaidDiagram({ diagram }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !diagram) return;

      setIsLoading(true);
      setError(null);

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import('mermaid')).default;
        
        // Initialize mermaid with custom configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#1d4ed8',
            lineColor: '#64748b',
            secondaryColor: '#e2e8f0',
            tertiaryColor: '#f1f5f9',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
        });

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create unique ID for this diagram
        const id = `mermaid-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, diagram);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram. The diagram syntax may be invalid.');
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [diagram]);

  if (!diagram) {
    return (
      <div className="text-gray-500 text-center py-8">
        No diagram available
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
        <details className="mt-2">
          <summary className="text-red-500 text-sm cursor-pointer">
            View raw diagram code
          </summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
            {diagram}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="mermaid-container">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Rendering diagram...</span>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`flex justify-center ${isLoading ? 'hidden' : ''}`}
      />
    </div>
  );
}
