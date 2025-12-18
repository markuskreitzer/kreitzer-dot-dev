import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPost } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BlogContent } from '@/components/BlogContent';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  // This would generate static paths for all published posts
  // For now, we'll handle this dynamically
  return [];
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="py-4 bg-card border-b border-border">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold cursor-pointer">
            Markus Kreitzer
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/">
              <Button variant="ghost" className="transition-colors duration-300">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Blog Post Content */}
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {post.description && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}
        </header>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <BlogContent content={post.content || ''} />
        </div>
      </article>

      {/* Footer */}
      <footer className="py-6 mt-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Markus Kreitzer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}