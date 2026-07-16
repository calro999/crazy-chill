import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'デザインリスト',
  description: 'CRAZY CHILL（クレチル）のオリジナルデザイン一覧。全グラフィックデザインを確認できます。',
};

export default function DesignsPage() {
  const products = getAllProducts();

  // デザインリスト = 商品画像のみ大きく並べる
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.label}>DESIGNS</div>
        <h1 className={styles.title}>デザインリスト</h1>
        <p className={styles.subtitle}>CRAZY CHILLのオリジナルグラフィック全作品</p>
      </div>

      {products.length > 0 ? (
        <div className={styles.seriesContainer}>
          {Object.entries(
            products.reduce((acc, p) => {
              const s = p.series || 'SINGLE';
              if (!acc[s]) acc[s] = [];
              acc[s].push(p);
              return acc;
            }, {} as Record<string, typeof products>)
          ).sort(([a], [b]) => a.localeCompare(b))
          .map(([seriesName, seriesProducts]) => (
            <div key={seriesName} className={styles.seriesGroup}>
              <h2 className={styles.seriesTitle}>{seriesName === 'SINGLE' ? 'その他 / 単独デザイン' : `${seriesName} SERIES`}</h2>
              <div className={styles.grid}>
                {seriesProducts.map((product, i) => (
                  <div key={product.id} className={styles.designItem}>
                    <Link href={`/products/${product.id}`} className={styles.imageLink}>
                      <div className={styles.imageWrapper}>
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.nameJa || product.name}
                            fill
                            sizes="(max-width: 480px) 45vw, (max-width: 900px) 30vw, 200px"
                            className={styles.image}
                            priority={i < 6}
                          />
                        ) : (
                          <div className={styles.noImage}>✦</div>
                        )}
                      </div>
                    </Link>
                    <div className={styles.designInfo}>
                      <Link href={`/products/${product.id}`} className={styles.designName}>
                        {product.name}
                      </Link>
                      <a
                        href={product.suzuriUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.designBuyLink}
                        id={`designs-suzuri-${product.id}`}
                      >
                        購入する →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>✦</span>
          <p>デザインを準備中です</p>
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
