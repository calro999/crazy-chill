import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts, getAllPosts, getAllCategories } from '@/lib/data';
import ja from '@/dictionaries/ja.json';
import en from '@/dictionaries/en.json';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? 'Sitemap | CRAZY CHILL' : 'サイトマップ | CRAZY CHILL',
    description: isEn
      ? 'HTML Sitemap for CRAZY CHILL official website. Complete link directory of products, categories, blogs, and pages.'
      : 'CRAZY CHILL公式ウェブサイトのHTMLサイトマップ。全商品、カテゴリー、ブログ記事、メインページへのリンク一覧。',
  };
}

export default async function SitemapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = lang === 'en' ? en : ja;
  const isEn = lang === 'en';

  const products = getAllProducts();
  const posts = getAllPosts(lang);
  const categories = getAllCategories().filter(c => c.slug !== 'all');

  const mainPages = [
    { title: dict.topbar.home, path: '' },
    { title: dict.topbar.products, path: '/products' },
    { title: dict.topbar.catalog, path: '/catalog' },
    { title: dict.topbar.designs, path: '/designs' },
    { title: dict.topbar.lookbook, path: '/lookbook' },
    { title: dict.topbar.blog, path: '/blog' },
    { title: dict.topbar.about, path: '/about' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.label}>SITEMAP</div>
        <h1 className={styles.title}>{dict.footer.sitemap}</h1>
        <p className={styles.description}>
          {isEn
            ? 'Explore all pages, products, categories, and articles on CRAZY CHILL.'
            : 'CRAZY CHILLのすべてのページ、カテゴリー、全アイテム、ブログ記事へのインデックスです。'}
        </p>
      </div>

      <div className={styles.grid}>
        {/* Main Navigation */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {isEn ? 'Main Pages' : 'メインページ'}
            <span className={styles.badge}>{mainPages.length}</span>
          </h2>
          <ul className={styles.linksList}>
            {mainPages.map((item, idx) => (
              <li key={idx}>
                <Link href={`/${lang}${item.path}`} className={styles.linkCard}>
                  <span className={styles.linkIcon}>✦</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://suzuri.jp/CRAZYCHILL"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkCard}
              >
                <span className={styles.linkIcon}>↗</span>
                <span>SUZURI Official Shop</span>
              </a>
            </li>
          </ul>
        </section>

        {/* Categories */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {isEn ? 'Categories' : 'カテゴリー'}
            <span className={styles.badge}>{categories.length}</span>
          </h2>
          <ul className={styles.linksList}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/${lang}/category/${cat.slug}`} className={styles.linkCard}>
                  <span className={styles.linkIcon}>✦</span>
                  <span>{isEn ? cat.nameEn : cat.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Blog Posts */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {isEn ? 'Blog Articles' : 'ブログ記事'}
            <span className={styles.badge}>{posts.length}</span>
          </h2>
          <ul className={styles.blogList}>
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/${lang}/blog/${post.slug}`} className={styles.blogCard}>
                  <div className={styles.blogTitle}>{post.title}</div>
                  <div className={styles.blogDate}>{post.publishedAt}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* All Products */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {isEn ? 'All Products' : '全商品アイテム'}
            <span className={styles.badge}>{products.length}</span>
          </h2>
          <ul className={styles.productGrid}>
            {products.map((prod) => (
              <li key={prod.id}>
                <Link href={`/${lang}/products/${prod.id}`} className={styles.productCard}>
                  <div className={styles.productName}>
                    {isEn && prod.name ? prod.name : prod.nameJa || prod.name}
                  </div>
                  <div className={styles.productPrice}>¥{prod.price.toLocaleString()}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
