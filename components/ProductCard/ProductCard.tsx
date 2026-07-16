import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Product, formatPrice } from '@/lib/data';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className={styles.card} aria-label={product.name}>
      <div className={styles.imageWrapper}>
        {/* Product image — 1024×1024 square */}
        <div className={styles.imageContainer}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.nameJa || product.name}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 280px"
              className={styles.image}
              priority={priority}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span className={styles.placeholderIcon}>✦</span>
              <span className={styles.placeholderText}>NO IMAGE</span>
            </div>
          )}
        </div>

        {/* Overlay on hover */}
        <div className={styles.overlay}>
          <a
            href={product.suzuriUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.overlayBtn}
            id={`product-card-suzuri-${product.id}`}
            aria-label={`${product.name}をSUZURIで購入する`}
          >
            SUZURIで購入する
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          <Link
            href={`/products/${product.id}`}
            className={styles.overlaySecondaryBtn}
            aria-label={`${product.name}の詳細を見る`}
          >
            詳細を見る
          </Link>
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && <span className={styles.badgeNew}>NEW</span>}
          {product.featured && <span className={styles.badgeFeatured}>PICK UP</span>}
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.category}>{product.category}</div>
        <Link href={`/products/${product.id}`} className={styles.name}>
          {product.nameJa || product.name}
        </Link>
        <div className={styles.price}>{formatPrice(product.price)}</div>
      </div>
    </article>
  );
}
