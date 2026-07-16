import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsByCategory, getCategoryBySlug, getAllCategories } from '@/lib/data';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'カテゴリーが見つかりません' };

  return {
    title: `${category.name}一覧`,
    description: `CRAZY CHILL（クレチル）の${category.name}。${category.description}。SUZURIにて販売中。`,
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.filter(c => c.slug !== 'all').map(c => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.icon}>{category.icon}</span>
        <div>
          <h1 className={styles.title}>{category.name}</h1>
          <p className={styles.desc}>{category.description}</p>
        </div>
      </div>

      <p className={styles.count}>{products.length}件のアイテム</p>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>{category.icon}</span>
          <p>このカテゴリーのアイテムを準備中です。</p>
          <a
            href="https://suzuri.jp/CRAZYCHILL"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.emptyLink}
          >
            SUZURIで確認する →
          </a>
        </div>
      )}
    </div>
  );
}
