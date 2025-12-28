import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import math from 'remark-math';
import gfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  content?: string;
  excerpt?: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  excerpt?: string;
}

// Get all blog posts metadata (for listing)
export function getAllPosts(): BlogPostMetadata[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title,
        description: matterResult.data.description,
        date: matterResult.data.date,
        tags: matterResult.data.tags || [],
        published: matterResult.data.published !== false, // Default to true
        excerpt: matterResult.data.description, // Use description as excerpt
      };
    })
    .filter(post => post.published) // Only return published posts
    .sort((a, b) => {
      // Sort by date, newest first
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allPostsData;
}

// Get a specific blog post with content
export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // Process mermaid code blocks to placeholders for client-side rendering
  const processMermaidBlocks = () => (tree: any) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') {
        node.type = 'html';
        node.value = `<div class="mermaid-placeholder" data-mermaid="${encodeURIComponent(node.value)}"></div>`;
      }
    });
  };

  // Process markdown content to HTML with math and mermaid support
  const processedContent = await remark()
    .use(gfm) // GitHub-flavored markdown
    .use(math) // LaTeX math support
    .use(processMermaidBlocks) // Custom mermaid processing
    .use(html, { sanitize: false })
    .process(matterResult.content);
  
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title,
    description: matterResult.data.description,
    date: matterResult.data.date,
    tags: matterResult.data.tags || [],
    published: matterResult.data.published !== false,
    content: contentHtml,
    excerpt: matterResult.data.description,
  };
}

// Get all available slugs for static generation
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}