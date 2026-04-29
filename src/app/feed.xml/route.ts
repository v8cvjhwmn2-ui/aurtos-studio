import { getAllPosts } from '@/lib/mdx';
import { site } from '@/data/site';

export const dynamic = 'force-static';
export const revalidate = 3600;

function escape(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const items = [...getAllPosts()]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
      <category>${escape(post.category)}</category>
      <author>noreply@aurtostechnologies.in (${escape(post.author || 'Aurtos Studio')})</author>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} — Blog</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escape(site.description)}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
