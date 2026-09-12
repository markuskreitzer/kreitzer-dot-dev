import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/config';

const escapeXml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export async function GET() {
  const posts = getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.site.title)}</title>
    <link>${escapeXml(siteConfig.site.url)}</link>
    <description>${escapeXml(siteConfig.site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteConfig.site.url)}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${escapeXml(siteConfig.site.url)}/blog/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${escapeXml(siteConfig.site.url)}/blog/${escapeXml(post.slug)}</guid>
      <description><![CDATA[${post.description}]]></description>
      ${/^\d{4}-\d{2}-\d{2}$/.test(post.date) ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ''}
      <author>${escapeXml(siteConfig.user.name)}</author>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
