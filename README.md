# kreitzer-dot-dev

A modern, responsive portfolio and blog website built with Next.js 15, React 19, and TypeScript.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with React 19 and TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Blog System**: Markdown-based blog with dynamic routing
- **Dark Mode**: System-aware theme switching
- **Animations**: Smooth transitions with Framer Motion
- **API Routes**: RESTful endpoints for blog content
- **Component Library**: shadcn/ui components for consistent design

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── blog/          # Blog API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx # Theme provider
├── content/              # Content files
│   └── blog/             # Markdown blog posts
├── docs/                 # Documentation
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── blog.ts           # Blog processing utilities
│   ├── blogClient.ts     # Client-side blog utilities
│   ├── config.ts         # Site configuration
│   └── utils.ts          # Helper functions
└── src/                  # Main application
    └── App.tsx           # Root React component
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Content**: Markdown with gray-matter
- **Deployment**: Vercel-ready

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kreitzer-dot-dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Blog System

The blog uses Markdown files stored in `content/blog/`. Each post includes:

- Frontmatter with metadata (title, description, date, tags)
- Full markdown content
- Automatic slug generation
- Tag-based categorization

### Adding a New Blog Post

1. Create a new `.md` file in `content/blog/`
2. Add frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   description: "Brief description"
   date: "2024-12-18"
   tags: ["tag1", "tag2"]
   published: true
   slug: "your-post-slug"
   ---
   ```
3. Write your markdown content below the frontmatter

## 🔧 Configuration

Site configuration is managed through environment variables in `.env.local`:

- `NEXT_PUBLIC_USER_NAME`: Your display name
- `NEXT_PUBLIC_USER_TITLE`: Your professional title
- `NEXT_PUBLIC_USER_DESCRIPTION`: Bio/description
- `NEXT_PUBLIC_GITHUB_URL`: GitHub profile URL
- `NEXT_PUBLIC_LINKEDIN_URL`: LinkedIn profile URL
- `NEXT_PUBLIC_EMAIL`: Contact email (optional)

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎨 Customization

### Styling
- Colors: Modify Tailwind config or CSS custom properties
- Components: Update shadcn/ui components in `components/ui/`
- Animations: Adjust Framer Motion settings

### Content
- Update personal information in `.env.local`
- Modify blog posts in `content/blog/`
- Customize component layouts in `src/App.tsx`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).