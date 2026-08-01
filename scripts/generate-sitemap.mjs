import fs from 'fs';
import path from 'path';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crazy-chill-official.vercel.app';
const locales = ['ja', 'en'];

const rootDir = process.cwd();
const productsFile = path.join(rootDir, 'data', 'products.json');
const categoriesFile = path.join(rootDir, 'data', 'categories.json');
const blogsDir = path.join(rootDir, 'data', 'blogs');
const publicDir = path.join(rootDir, 'public');

// Load Data
let products = [];
if (fs.existsSync(productsFile)) {
  const data = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
  products = (data.products || []).filter(p => p.published);
}

let categories = [];
if (fs.existsSync(categoriesFile)) {
  const data = JSON.parse(fs.readFileSync(categoriesFile, 'utf-8'));
  categories = (data.categories || []).filter(c => c.slug !== 'all');
}

let posts = [];
if (fs.existsSync(blogsDir)) {
  const files = fs.readdirSync(blogsDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
      const post = JSON.parse(content);
      if (post.published) {
        posts.push(post);
      }
    }
  }
}

const staticPaths = [
  '',
  '/products',
  '/catalog',
  '/designs',
  '/lookbook',
  '/blog',
  '/about',
  '/sitemap',
];

const urls = [];
const today = new Date().toISOString();

// 1. Generate Sitemap XML
locales.forEach(lang => {
  // Static Pages
  staticPaths.forEach(p => {
    urls.push(`  <url>
    <loc>${baseUrl}/${lang}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`);
  });

  // Categories
  categories.forEach(cat => {
    urls.push(`  <url>
    <loc>${baseUrl}/${lang}/category/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Products
  products.forEach(prod => {
    const lastMod = prod.createdAt ? new Date(prod.createdAt).toISOString() : today;
    urls.push(`  <url>
    <loc>${baseUrl}/${lang}/products/${prod.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Posts
  posts.forEach(post => {
    if (post.targetLanguage && post.targetLanguage !== 'all' && post.targetLanguage !== lang) {
      return;
    }
    const lastMod = post.publishedAt ? new Date(post.publishedAt).toISOString() : today;
    urls.push(`  <url>
    <loc>${baseUrl}/${lang}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`[sitemap] Successfully generated public/sitemap.xml with ${urls.length} URLs.`);

// 2. Generate llms.txt (Standard summary for AI search engines)
let llmsTxt = `# CRAZY CHILL - Official Brand & Content Summary for LLMs / AI Search Engine Index

> CRAZY CHILL (クレイジーチル) は、ダークパンク、サブカルチャー、ストリートファッションを融合させたオリジナルのアパレル・グラフィックTシャツ・グッズブランドです。SUZURIにて公式アイテムを展開中。

## Core Brand Information
- **Brand Name**: CRAZY CHILL (クレイジーチル)
- **Official Store**: https://suzuri.jp/CRAZYCHILL
- **Official Website**: https://crazy-chill-official.vercel.app
- **Concept**: Subculture streetwear, dark punk aesthetics, monotone styling, unique graphics.

## Key Categories
${categories.map(cat => `- **${cat.name?.ja || cat.name?.en || cat.slug}**: ${baseUrl}/ja/category/${cat.slug}`).join('\n')}

## All Blog Articles & Knowledge Guides
${posts.map(post => {
  const lang = post.targetLanguage === 'en' ? 'en' : 'ja';
  return `- **${post.title}**: ${baseUrl}/${lang}/blog/${post.slug}\n  Summary: ${post.excerpt || post.title}`;
}).join('\n')}

## Featured Products
${products.slice(0, 20).map(prod => `- **${prod.name || prod.nameJa || prod.id}**: ${baseUrl}/ja/products/${prod.id}`).join('\n')}
`;

fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf-8');
console.log(`[llms.txt] Successfully generated public/llms.txt with ${posts.length} blog posts and ${products.length} products.`);

// 3. Generate llms-full.txt (Full content index for Deep Research / LLM context injection)
let llmsFullTxt = `# CRAZY CHILL - Complete Knowledge & Article Database for AI Crawlers

> This document contains full text and structured knowledge of all published articles and products on CRAZY CHILL (https://crazy-chill-official.vercel.app).

---

# 1. BRAND OVERVIEW & NAVIGATION
- Website: https://crazy-chill-official.vercel.app
- SUZURI Shop: https://suzuri.jp/CRAZYCHILL
- Sitemap: https://crazy-chill-official.vercel.app/sitemap.xml

---

# 2. COMPLETE ARTICLES & GUIDES INDEX

${posts.map((post, idx) => {
  const lang = post.targetLanguage === 'en' ? 'en' : 'ja';
  return `## Article [${idx + 1}]: ${post.title}
- **URL**: ${baseUrl}/${lang}/blog/${post.slug}
- **Category**: ${post.category || 'General'}
- **Published**: ${post.publishedAt || '2026-08-01'}
- **Language**: ${lang}
- **Excerpt**: ${post.excerpt || ''}

### Content Body:
${post.content || post.excerpt || ''}

---`;
}).join('\n\n')}

# 3. PRODUCTS CATALOG INDEX

${products.map(prod => {
  return `- **Product**: ${prod.name || prod.nameJa || prod.id}
  - URL: ${baseUrl}/ja/products/${prod.id}
  - Price: ¥${prod.price || 'N/A'}
  - Category: ${prod.category || 'Apparel'}
  - Description: ${prod.description || prod.descriptionEn || ''}`;
}).join('\n')}
`;

fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullTxt, 'utf-8');
console.log(`[llms-full.txt] Successfully generated public/llms-full.txt with full article bodies.`);
