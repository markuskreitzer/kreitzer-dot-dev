'use client';

import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { MathRenderer } from './MathRenderer';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const [processedContent, setProcessedContent] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    // Simple HTML parsing for mermaid and math
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const elements: React.ReactNode[] = [];
    
    // Find all mermaid placeholders and replace with components
    const mermaidPlaceholders = tempDiv.querySelectorAll('.mermaid-placeholder');
    mermaidPlaceholders.forEach((placeholder, index) => {
      const mermaidData = placeholder.getAttribute('data-mermaid');
      if (mermaidData) {
        const diagram = decodeURIComponent(mermaidData);
        elements.push(
          <MermaidDiagram 
            key={`mermaid-${index}`} 
            diagram={diagram} 
            className="my-6" 
          />
        );
        placeholder.replaceWith(document.createElement('div'));
      }
    });

    // Process the remaining content for math
    const remainingContent = tempDiv.innerHTML;
    
    // Simple regex-based math processing
    const processedMathContent = remainingContent
      .replace(/\$\$([^$]+)\$\$/g, (match, math) => {
        return `<div data-math-block="${encodeURIComponent(math)}" class="math-block-placeholder"></div>`;
      })
      .replace(/\$([^$]+)\$/g, (match, math) => {
        return `<span data-math-inline="${encodeURIComponent(math)}" class="math-inline-placeholder"></span>`;
      });

    // Set processed content with placeholders
    tempDiv.innerHTML = processedMathContent;

    // Extract and process math placeholders
    const mathBlockPlaceholders = tempDiv.querySelectorAll('.math-block-placeholder');
    mathBlockPlaceholders.forEach((placeholder, index) => {
      const mathData = placeholder.getAttribute('data-math-block');
      if (mathData) {
        const math = decodeURIComponent(mathData);
        elements.push(
          <MathRenderer 
            key={`math-block-${index}`} 
            math={math} 
            display="block" 
            className="my-6" 
          />
        );
        placeholder.replaceWith(document.createElement('div'));
      }
    });

    const mathInlinePlaceholders = tempDiv.querySelectorAll('.math-inline-placeholder');
    mathInlinePlaceholders.forEach((placeholder, index) => {
      const mathData = placeholder.getAttribute('data-math-inline');
      if (mathData) {
        const math = decodeURIComponent(mathData);
        elements.push(
          <MathRenderer 
            key={`math-inline-${index}`} 
            math={math} 
            display="inline" 
          />
        );
        placeholder.replaceWith(document.createElement('span'));
      }
    });

    // Get the final processed HTML content
    const finalContent = tempDiv.innerHTML;
    
    // Create a simple HTML parser for remaining content
    const parser = new DOMParser();
    const doc = parser.parseFromString(finalContent, 'text/html');
    const body = doc.body;

    const processNode = (node: Node, depth = 0): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        // Skip already processed placeholders
        if (element.classList.contains('mermaid-placeholder') || 
            element.classList.contains('math-block-placeholder') || 
            element.classList.contains('math-inline-placeholder')) {
          return null;
        }
        
        const props: any = {};
        Array.from(element.attributes).forEach(attr => {
          props[attr.name] = attr.value;
        });
        
        const children = Array.from(element.childNodes)
          .map(child => processNode(child, depth + 1))
          .filter(Boolean);
        
        return React.createElement(tagName, props, ...children);
      }
      
      return null;
    };

    const processedElements = Array.from(body.childNodes)
      .map(child => processNode(child))
      .filter(Boolean);

    setProcessedContent(processedElements);
  }, [content]);

  return <>{processedContent}</>;
}