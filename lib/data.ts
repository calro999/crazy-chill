import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import blogData from '@/data/blog.json';
import bannersData from '@/data/banners.json';

export interface Product {
  id: string;
  name: string;
  nameJa?: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  image: string;
  suzuriUrl: string;
  description: string;
  descriptionEn?: string;
  featured?: boolean;
  isNew?: boolean;
  published: boolean;
  createdAt: string;
  sortOrder?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  author: string;
  publishedAt: string;
  published: boolean;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  position: string;
  published: boolean;
}

// Products
export function getAllProducts(): Product[] {
  return (productsData.products as Product[]).filter(p => p.published);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter(p => p.featured).slice(0, 6);
}

export function getProductById(id: string): Product | undefined {
  return (productsData.products as Product[]).find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'all') return getAllProducts();
  return getAllProducts().filter(p => p.category === categorySlug);
}

export function getNewProducts(): Product[] {
  return getAllProducts().filter(p => p.isNew).slice(0, 6);
}

// Categories
export function getAllCategories(): Category[] {
  return categoriesData.categories as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData.categories as Category[]).find(c => c.slug === slug);
}

// Blog
import fs from 'fs';
import path from 'path';

export function getAllPosts(): BlogPost[] {
  try {
    const blogsDir = path.join(process.cwd(), 'data', 'blogs');
    if (!fs.existsSync(blogsDir)) return [];
    const files = fs.readdirSync(blogsDir);
    const posts: BlogPost[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
        posts.push(JSON.parse(content));
      }
    }
    
    return posts
      .filter(p => p.published)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (err) {
    console.error('Failed to read blog posts:', err);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blogs', `${slug}.json`);
    if (!fs.existsSync(filePath)) return undefined;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read blog post:', err);
    return undefined;
  }
}

export function getRecentPosts(limit = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}

// Banners
export function getBannersByPosition(position: string): Banner[] {
  return (bannersData.banners as Banner[]).filter(b => b.position === position && b.published);
}

// Formatting
export function formatPrice(price: number, currency = 'JPY'): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}
