# AGENTS.md

This file provides guidance for coding agents working in this repository.

## Commands

- **Build**: `npm run build`
- **Dev Server**: `npm run dev`
- **Lint**: `npm run lint`
- **Test**: No test framework configured yet

## Project Architecture

Next.js 15 personal portfolio/blog with React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.

### Application Structure
- `/app/page.tsx` renders `/src/App.tsx` as client-side React SPA
- Two main pages: Home and Blog (tab-based navigation)
- Blog posts from `/content/blog/` Markdown files with frontmatter

### Code Style

#### Imports
- Use absolute imports with `@/` prefix
- Group imports: React, third-party libs, local components/utilities

#### Components
- Functional components with arrow functions
- PascalCase naming, explicit return types for complex components
- Destructure props inline

#### Hooks & State
- `useState` for local state, `useEffect` for side effects
- `useCallback` for stable references, prefer early returns

#### Error Handling
- Try/catch with console.error, graceful fallbacks, loading states

#### Types
- Strict TypeScript mode, interface definitions, optional chaining (`?.`)

#### Naming
- camelCase for variables/functions, PascalCase for components/types
- kebab-case for files, UPPER_CASE for constants

#### Styling
- Tailwind CSS with `cn()` utility for conditional classes
- Brand colors: `brand-primary` (#ea580c), `brand-secondary` (#dc2626)
- Theme-aware classes with dark/light mode support

### Patterns
- shadcn/ui components in `/components/ui/`
- Animated components using Framer Motion
- Environment variables via `/lib/config.ts`
- Markdown processing with gray-matter, remark-math, remark-gfm, and custom mermaid processing
- Math rendering with KaTeX for LaTeX expressions
- Mermaid diagram rendering with client-side components

## Enhanced Features (v0.2.2+)

### Math Support
- **Inline Math**: `$E = mc^2$` expressions render as inline math
- **Block Math**: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$` for display equations
- **KaTeX Rendering**: Fast server-side math processing with fallbacks
- **Math Macros**: Support for common notation like `\RR`, `\NN`, `\ZZ`

### Mermaid Diagrams
- **Code Blocks**: Use ```mermaid fenced code blocks in markdown
- **Diagram Types**: Flowcharts, sequence diagrams, Gantt charts, etc.
- **Interactive Rendering**: Client-side mermaid.js for interactive diagrams
- **Error Handling**: Graceful fallbacks for syntax errors

### Supported Markdown Extensions
- **GitHub Flavored**: Tables, strikethrough, task lists
- **Math Mode**: Automatic detection and rendering of LaTeX expressions
- **Diagram Mode**: Special handling for mermaid code blocks
- **Syntax Highlighting**: Enhanced code block rendering

## Deployment Instructions

### Standard Deployment Workflow
1. **Build**: `npm run build` - Ensure build completes successfully
2. **Version Management**: 
   - Bump version in `package.json` 
   - Commit changes: `git commit -m "Bump version to X.X.X"`
   - Tag version: `git tag vX.X.X`
3. **Push**: `git push origin master --follow-tags`
4. **Deploy**: `vercel --prod` (if Vercel CLI installed)
5. **Verify**: Check deployment status at `vercel.com`

### Math & Mermaid Testing
Before deployment, verify:
1. **Math Examples**: Create test posts with `$inline$` and `$$block$$` math
2. **Mermaid Examples**: Add flowcharts and sequence diagrams
3. **Build Verification**: Ensure no KaTeX or mermaid rendering errors
4. **Browser Testing**: Test math rendering across different browsers

### Dependencies for Enhanced Features
```json
{
  "dependencies": {
    "katex": "^0.16.0",
    "mermaid": "^10.0.0", 
    "remark-math": "^6.0.0",
    "remark-gfm": "^4.0.0",
    "unist-util-visit": "^5.0.0"
  }
}
```

### Performance Considerations
- **Bundle Size**: Math and mermaid libraries add ~200KB to bundle
- **Client-Side**: Mermaid renders in browser for interactivity
- **SSR Compatible**: Math processing works with Next.js SSG
- **Progressive Enhancement**: Content degrades gracefully without JS</content>
<parameter name="filePath">/Users/c/Library/CloudStorage/SynologyDrive-Home/technology/projects/kreitzer-dot-dev/AGENTS.md