# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Architecture

This is a Next.js 15 personal portfolio/blog website with the following key architectural decisions:

### Framework Stack
- **Next.js 15** with React 19 for the main framework
- **TypeScript** for type safety
- **Tailwind CSS** with shadcn/ui components for styling
- **Framer Motion** for animations
- **js-yaml** for configuration loading

### Application Structure

The project uses a hybrid Next.js/React approach:
- `/app/page.tsx` acts as a thin wrapper that renders `/src/App.tsx`
- Main application logic is in `/src/App.tsx` as a client-side React SPA
- The app has two main pages: Home and Blog (tab-based navigation)

### Blog System
- **Static Site Generator**: Blog posts are written in Markdown files in `/content/blog/`
- **Frontmatter Support**: Uses standard Jekyll/Hugo-style frontmatter with fields:
  - `title`: Post title
  - `description`: Post description/excerpt
  - `date`: Publication date (YYYY-MM-DD format)
  - `tags`: Array of tags
  - `published`: Boolean to control visibility
  - `slug`: URL slug for the post
- **Markdown Processing**: Uses `gray-matter` for frontmatter parsing and `remark` for HTML conversion
- **Dynamic Loading**: Blog posts are loaded dynamically on the client side

### Configuration System
- User data is loaded from environment variables via `/lib/config.ts`
- Configuration includes personal info, contact details, and site metadata
- Uses Next.js environment variables with `NEXT_PUBLIC_` prefix for client-side access
- `.env.local` file for personal configuration (gitignored)
- `.env.example` file shows available configuration options
- **Conditional Social Links**: Twitter and email links only appear if configured in environment variables

### UI Component System
- Uses shadcn/ui components located in `/components/ui/`
- Custom utility function `cn()` in `/lib/utils.ts` combines clsx and tailwind-merge
- Comprehensive set of pre-built components (buttons, cards, forms, etc.)

### Styling Architecture
- Tailwind CSS with CSS variables for theming
- Dark/light mode support with localStorage persistence
- Custom color palette with beige, brass, and blue theme colors
- Uses CSS-in-JS style custom properties for theme colors

### State Management
- React hooks for local state management
- `useState` for tab navigation, dark mode, and user data
- `useEffect` for loading configuration and handling localStorage

### Animation System
- Framer Motion for page transitions and component animations
- Custom reusable animated components (AnimatedHeading, AnimatedParagraph, etc.)
- Staggered animations for lists and cards

### Design System and Branding
- **Brand Colors**: Uses consistent orange/red color scheme matching chat.kreitzer.dev
  - Primary: `#ea580c` (orange-600) 
  - Secondary: `#dc2626` (red-600)
- **CSS Variables**: Implements proper shadcn/ui design system with HSL color variables
- **Theme Support**: Dark/light mode with automatic system preference detection
- **Color Classes**: Use `brand-primary`, `brand-secondary` for consistent branding across components

### Configuration Options
Available environment variables (see `.env.example`):
- `NEXT_PUBLIC_USER_NAME` - Your full name
- `NEXT_PUBLIC_USER_TITLE` - Your professional title
- `NEXT_PUBLIC_USER_DESCRIPTION` - Your bio/description
- `NEXT_PUBLIC_GITHUB_URL` - GitHub profile URL
- `NEXT_PUBLIC_LINKEDIN_URL` - LinkedIn profile URL
- `NEXT_PUBLIC_TWITTER_URL` - Twitter profile URL (optional - only shows if configured)
- `NEXT_PUBLIC_EMAIL` - Contact email address (optional - only shows if configured)
- `NEXT_PUBLIC_SITE_TITLE` - Browser tab title
- `NEXT_PUBLIC_SITE_DESCRIPTION` - SEO description

### Development Notes
- ESLint and TypeScript errors are ignored during builds (see next.config.mjs)
- Images are unoptimized for deployment flexibility
- Uses absolute imports with `@/` prefix for clean import paths
- The app is designed to work as both a Next.js app and a standalone React SPA
- Brand colors are defined in CSS variables and available as Tailwind classes
- Restart dev server after changing `.env.local` to pick up new environment variables