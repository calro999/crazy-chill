import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, formatPrice } from '@/lib/data';
import styles from './ProductSidebar.module.css';

interface ProductSidebarProps {
  lang: string;
}

export default function ProductSidebar({ lang }: ProductSidebarProps) {
  // 商品サイドバー用
  const allProducts = getAllProducts();
  const rabbitProduct = allProducts.find(p => p.name.includes('肋骨が長いうさぎ') || p.nameJa?.includes('肋骨が長いうさぎ'));
  const otherProducts = allProducts.filter(p => p.id !== rabbitProduct?.id);
  const randomProduct = otherProducts.length > 0 ? otherProducts[Math.floor(Math.random() * otherProducts.length)] : null;
  
  const sidebarProducts = [rabbitProduct, randomProduct].filter(Boolean);

  if (sidebarProducts.length === 0) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>おすすめアイテム</h3>
      <div className={styles.sidebarGrid}>
        {sidebarProducts.map((p, i) => {
          if (!p) return null;
          return (
            <Link href={`/${lang}/products/${p.id}`} key={`${p.id}-${i}`} className={styles.sideCard}>
              <div className={styles.sideCardImg}>
                {p.image ? (
                  <Image src={p.image} alt={p.imageAlt || p.nameJa || p.name} fill sizes="300px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.noImg}>✦</div>
                )}
              </div>
              <div className={styles.sideCardInfo}>
                <div className={styles.sideCardName}>{p.nameJa || p.name}</div>
                <div className={styles.sideCardPrice}>{formatPrice(p.price)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
