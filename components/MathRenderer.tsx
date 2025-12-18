'use client';

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  math: string;
  display?: 'block' | 'inline';
  className?: string;
}

export function MathRenderer({ math, display = 'inline', className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        // Use dynamic import to avoid SSR issues
        import('katex').then((katex) => {
          const katexInstance = katex.default;
          const renderedMath = katexInstance.renderToString(math, {
            displayMode: display === 'block',
            throwOnError: false,
            errorColor: '#ef4444',
            strict: false,
            trust: false,
            macros: {
              "\\RR": "\\mathbb{R}",
              "\\NN": "\\mathbb{N}",
              "\\ZZ": "\\mathbb{Z}"
            }
          });
          
          if (containerRef.current) {
            containerRef.current.innerHTML = renderedMath;
          }
        }).catch((error) => {
          console.error('KaTeX rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<span class="math-error text-red-500">${math}</span>`;
          }
        });
      } catch (error) {
        console.error('Math rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span class="math-error text-red-500">${math}</span>`;
        }
      }
    }
  }, [math, display]);

  const classes = display === 'block' 
    ? `math-display block my-4 ${className}`
    : `math-inline ${className}`;

  return <div ref={containerRef} className={classes} />;
}