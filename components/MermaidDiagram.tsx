'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  diagram: string;
  className?: string;
}

export function MermaidDiagram({ diagram, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && diagram) {
      // Render the diagram
      try {
        const graphDefinition = decodeURIComponent(diagram);
        const id = 'mermaid-diagram-' + Math.random().toString(36).substring(2, 9);
        
        mermaid.render(id, graphDefinition).then((result: { svg: string }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg;
          }
        }).catch((error) => {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="mermaid-error text-red-500 p-2 border border-red-300 rounded">Error rendering diagram. Please check the syntax.</div>`;
          }
        });
      } catch (error) {
        console.error('Mermaid processing error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="mermaid-error text-red-500 p-2 border border-red-300 rounded">Error processing diagram.</div>`;
        }
      }
    }
  }, [diagram]);

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-container ${className}`}
      style={{ minHeight: '200px' }}
    />
  );
}