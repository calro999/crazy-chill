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
      const nameJa = product.nameJa || product.name;
      const description = product.tags && product.tags.length > 0
        ? `【CRAZY CHILL】${nameJa} - ${product.tags.join(', ')}`
        : `【CRAZY CHILL】${nameJa} - 狂気的なまでに脱力するダークパンクアパレル`;

      // Truncate for Pinterest limits
      const safeId = product.id.substring(0, 127);
      const safeTitle = nameJa.substring(0, 500);

      // 着用画像（Lookbook用画像）のマッピング
      let additionalImages = '';
      const lowerName = nameJa.toLowerCase();
      
      if (lowerName.includes('bone rider')) {
        additionalImages += `\n      <g:additional_image_link><![CDATA[${baseUrl}/images/products/BONE%20RIDER.png]]></g:additional_image_link>`;
      }
      if (lowerName.includes('肋骨') || lowerName.includes('うさぎ')) {
        additionalImages += `\n      <g:additional_image_link><![CDATA[${baseUrl}/images/products/%E5%85%A8%E8%BA%AB%E8%82%8B%E9%AA%A8%E3%81%A1%E3%82%83%E3%82%93.jpg]]></g:additional_image_link>`;
        additionalImages += `\n      <g:additional_image_link><![CDATA[${baseUrl}/images/products/%E8%82%8B%E9%AA%A8%E3%81%A1%E3%82%83%E3%82%93.png]]></g:additional_image_link>`;
        additionalImages += `\n      <g:additional_image_link><![CDATA[${baseUrl}/images/products/%E5%88%A5%E3%83%9D%E3%83%BC%E3%82%BA2%E5%85%A8%E8%BA%AB%E8%82%8B%E9%AA%A8.jpg]]></g:additional_image_link>`;
      }

      const imageUrl = product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`;

      return `
    <item>
      <g:id>${safeId}</g:id>
      <g:title><![CDATA[${safeTitle}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${baseUrl}/ja/products/${product.id}</g:link>
      <g:image_link><![CDATA[${imageUrl}]]></g:image_link>${additionalImages}
      <g:price>${product.price} JPY</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>CRAZY CHILL</g:brand>
      <g:product_type><![CDATA[${product.category}]]></g:product_type>
      <g:google_product_category><![CDATA[Apparel & Accessories > Clothing]]></g:google_product_category>
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
