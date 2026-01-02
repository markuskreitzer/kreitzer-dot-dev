'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  diagram: string;
  className?: string;
}

export function MermaidDiagram({ diagram, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerRef.current && diagram) {
      // Initialize mermaid with theme based on dark mode
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'neutral',
        // Use SVG text instead of foreignObject HTML labels (fixes text visibility issues)
        flowchart: {
          htmlLabels: false,
        },
        sequence: {
          useMaxWidth: true,
        },
        themeVariables: isDark ? {
          // Dark mode colors
          primaryColor: '#3b82f6',
          primaryTextColor: '#e5e7eb',
          primaryBorderColor: '#60a5fa',
          lineColor: '#9ca3af',
          secondaryColor: '#374151',
          tertiaryColor: '#1f2937',
          textColor: '#e5e7eb',
          nodeTextColor: '#e5e7eb',
          noteBkgColor: '#374151',
          noteTextColor: '#e5e7eb',
        } : {
          // Light mode colors
          primaryColor: '#dbeafe',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#3b82f6',
          lineColor: '#4b5563',
          secondaryColor: '#e5e7eb',
          tertiaryColor: '#f3f4f6',
          textColor: '#1f2937',
          nodeTextColor: '#1f2937',
          noteBkgColor: '#f3f4f6',
          noteTextColor: '#1f2937',
        }
      });

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
  }, [diagram, isDark]);

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-container ${className}`}
      style={{ minHeight: '200px' }}
    />
  );
}