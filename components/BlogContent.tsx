'use client';

import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const [processedContent, setProcessedContent] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    // Parse HTML and replace mermaid placeholders with React components
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const elements: React.ReactNode[] = [];
    let elementIndex = 0;

    // Elements that cannot have whitespace-only text nodes as children
    const noWhitespaceElements = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup'];

    // Process all child nodes, replacing mermaid placeholders with components
    const processNode = (node: Node, parentTagName?: string): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        // Filter out whitespace-only text nodes inside table elements
        if (parentTagName && noWhitespaceElements.includes(parentTagName) && !text.trim()) {
          return null;
        }
        return text;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        // Handle mermaid placeholders
        if (element.classList.contains('mermaid-placeholder')) {
          const mermaidData = element.getAttribute('data-mermaid');
          if (mermaidData) {
            const diagram = decodeURIComponent(mermaidData);
            return (
              <MermaidDiagram
                key={`mermaid-${elementIndex++}`}
                diagram={diagram}
                className="my-6"
              />
            );
          }
          return null;
        }

        // Build props from attributes
        const props: Record<string, unknown> = { key: `el-${elementIndex++}` };
        Array.from(element.attributes).forEach(attr => {
          // Convert HTML attributes to React props
          let propName = attr.name;
          if (propName === 'class') propName = 'className';
          if (propName === 'for') propName = 'htmlFor';

          // Convert style string to React style object
          if (propName === 'style') {
            const styleObj: Record<string, string> = {};
            attr.value.split(';').forEach(rule => {
              const [property, value] = rule.split(':').map(s => s.trim());
              if (property && value) {
                // Convert CSS property to camelCase (e.g., background-color -> backgroundColor)
                const camelCase = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                styleObj[camelCase] = value;
              }
            });
            props[propName] = styleObj;
          } else {
            props[propName] = attr.value;
          }
        });

        // Process children recursively, passing current tag name for whitespace filtering
        const children = Array.from(element.childNodes)
          .map(child => processNode(child, tagName))
          .filter(child => child !== null && child !== '');

        // Handle self-closing tags
        if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
          return React.createElement(tagName, props);
        }

        return React.createElement(tagName, props, children.length > 0 ? children : undefined);
      }

      return null;
    };

    const processedElements = Array.from(tempDiv.childNodes)
      .map(child => processNode(child))
      .filter(Boolean);

    setProcessedContent(processedElements);
  }, [content]);

  return <>{processedContent}</>;
}
