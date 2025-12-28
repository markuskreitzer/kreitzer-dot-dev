import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogPosts = posts.map((post) => ({
    url: `${siteConfig.site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.site.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogPosts,
  ];
}
