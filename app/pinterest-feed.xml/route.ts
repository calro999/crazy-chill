import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export async function GET() {
  const products = getAllProducts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crazy-chill-official.vercel.app';

  // RSS 2.0 with Google base namespace format for Pinterest Catalogs
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>CRAZY CHILL Products</title>
    <link>${baseUrl}</link>
    <description>CRAZY CHILL (クレチル) の公式プロダクトカタログ</description>
    ${products.map(product => {
      // Create a description from tags or use a default one
      const description = product.tags && product.tags.length > 0
        ? `【CRAZY CHILL】${product.nameJa} - ${product.tags.join(', ')}`
        : `【CRAZY CHILL】${product.nameJa} - 狂気的なまでに脱力するダークパンクアパレル`;

      return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.nameJa}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${baseUrl}/ja/products/${product.id}</g:link>
      <g:image_link>${baseUrl}${product.image}</g:image_link>
      <g:price>${product.price} JPY</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>CRAZY CHILL</g:brand>
      <g:product_type><![CDATA[${product.category}]]></g:product_type>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
