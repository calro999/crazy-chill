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
