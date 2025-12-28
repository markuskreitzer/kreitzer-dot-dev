import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPost, getAllPosts } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BlogContent } from '@/components/BlogContent';
import { siteConfig } from '@/lib/config';

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

  const url = `${siteConfig.site.url}/blog/${slug}`;
  const authorName = siteConfig.user.name;

  return {
    title: `${post.title} | ${siteConfig.site.title}`,
    description: post.description,
    keywords: post.tags.join(', '),
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: authorName,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.site.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [authorName],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: siteConfig.contact.twitter || '@markuskreitzer',
      site: siteConfig.contact.twitter || '@markuskreitzer',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const url = `${siteConfig.site.url}/blog/${slug}`;
  const authorName = siteConfig.user.name;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteConfig.site.url,
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="py-4 bg-card border-b border-border">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold cursor-pointer">
            {siteConfig.user.name}
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
            &copy; {new Date().getFullYear()} {siteConfig.user.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}