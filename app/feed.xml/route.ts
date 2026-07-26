import { getAllPosts } from '@/lib/data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crazy-chill-official.vercel.app';
  const posts = getAllPosts('ja');

  const itemsXml = posts
    .map(post => {
      const url = `${baseUrl}/ja/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>CRAZY CHILL</author>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CRAZY CHILL Official Blog &amp; Subculture Journal</title>
    <link>${baseUrl}</link>
    <description>狂気的なまでに脱力するダークパンクアパレルブランド CRAZY CHILL の公式ジャーナル＆SEO・ファッションガイド</description>
    <language>ja</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
