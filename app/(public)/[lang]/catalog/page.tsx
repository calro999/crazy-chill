import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllProducts, formatPrice } from '@/lib/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'カタログ',
  description: 'CRAZY CHILL（クレチル）全商品カタログ。商品画像・詳細・価格を大判で確認できます。',
};

export default function CatalogPage() {
  const products = getAllProducts();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLabel}>CATALOG</div>
        <h1 className={styles.title}>全商品カタログ</h1>
        <p className={styles.subtitle}>スクロールして全アイテムをチェック</p>
      </div>

      {products.length > 0 ? (
        <div className={styles.catalogList}>
          {products.map((product, index) => (
            <article
              key={product.id}
              className={`${styles.catalogItem} ${index % 2 === 1 ? styles.reverse : ''}`}
              aria-label={product.nameJa || product.name}
            >
              {/* Number */}
              <div className={styles.itemNumber}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Image */}
              <div className={styles.imageArea}>
                <div className={styles.imageWrapper}>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.nameJa || product.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 50vw"
                      className={styles.image}
                      priority={index === 0}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <span>✦</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className={styles.infoArea}>
                <div className={styles.infoInner}>
                  <div className={styles.itemCategory}>{product.category}</div>
                  <h2 className={styles.itemName}>{product.nameJa || product.name}</h2>
                  <p className={styles.itemNameEn}>{product.name}</p>

                  <div className={styles.itemPrice}>{formatPrice(product.price)}</div>

                  <p className={styles.itemDesc}>{product.description}</p>

                  {product.tags.length > 0 && (
                    <div className={styles.itemTags}>
                      {product.tags.map(tag => (
                        <span key={tag} className={styles.itemTag}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <a
                    href={product.suzuriUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buyBtn}
                    id={`catalog-suzuri-${product.id}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    SUZURIで購入する
                  </a>
                </div>
              </div>

              {/* Separator */}
              <div className={styles.separator} />
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✦</span>
          <p>カタログを準備中です</p>
          <a
            href="https://suzuri.jp/CRAZYCHILL"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.emptyLink}
          >
            SUZURIで先行チェック →
          </a>
        </div>
      )}
    </div>
  );
}
