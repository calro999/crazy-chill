import type { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/data';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '商品一覧',
  description: 'CRAZY CHILL（クレチル）のオリジナルTシャツ、パーカー、キャップ、ステッカーなど全商品一覧。SUZURIで購入可能。',
};

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>商品一覧</h1>
        <p className={styles.count}>{products.length}件の商品</p>
      </div>

      {/* Category filter (desktop supplement) */}
      <div className={styles.filterBar} role="navigation" aria-label="カテゴリーフィルター">
        {categories.map(cat => (
          <a
            key={cat.id}
            href={cat.slug === 'all' ? '/products' : `/category/${cat.slug}`}
            className={styles.filterChip}
            id={`filter-chip-${cat.slug}`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </a>
        ))}
      </div>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✦</div>
          <p>商品を準備中です。SUZURIのショップをご確認ください。</p>
          <a
            href="https://suzuri.jp/CRAZYCHILL"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.emptyLink}
          >
            SUZURIショップへ →
          </a>
        </div>
      )}
    </div>
  );
}
