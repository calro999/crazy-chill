import { MetadataRoute } from 'next';
import { getAllProducts, getAllPosts, getAllCategories } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crazy-chill-official.vercel.app';
  const locales = ['ja', 'en'];

  const products = getAllProducts();
  const posts = getAllPosts();
  const categories = getAllCategories();

  const staticPaths = [
    '',
    '/products',
    '/catalog',
    '/designs',
    '/blog',
    '/about',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  locales.forEach(lang => {
    // Static Pages
    staticPaths.forEach(path => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: path === '' ? 1 : 0.8,
      });
    });

    // Product Pages
    products.forEach(product => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/products/${product.id}`,
        lastModified: new Date(product.createdAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    // Blog Pages
    posts.forEach(post => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });

    // Category Pages
    categories.filter(c => c.slug !== 'all').forEach(cat => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  return sitemapEntries;
}
