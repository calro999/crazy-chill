import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, getAllProducts, formatPrice } from '@/lib/data';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: '商品が見つかりません' };

  return {
    title: product.nameJa || product.name,
    description: product.description,
    openGraph: {
      title: `${product.nameJa || product.name} | CRAZY CHILL`,
      description: product.description,
      images: product.image ? [{ url: product.image, width: 1024, height: 1024 }] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map(p => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const allProducts = getAllProducts();
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameJa || product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      url: product.suzuriUrl,
    },
    brand: {
      '@type': 'Brand',
      name: 'CRAZY CHILL',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.page}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="パンくずリスト">
          <Link href="/" className={styles.breadcrumbLink}>HOME</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href="/products" className={styles.breadcrumbLink}>商品一覧</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className={styles.detail}>
          {/* Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.nameJa || product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.noImage}>
                  <span>✦</span>
                  <p>NO IMAGE</p>
                </div>
              )}
              {product.isNew && <span className={styles.badge}>NEW</span>}
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoSection}>
            <div className={styles.category}>{product.category}</div>
            <h1 className={styles.name}>{product.nameJa || product.name}</h1>
            <p className={styles.nameEn}>{product.name}</p>
            <div className={styles.price}>{formatPrice(product.price)}</div>

            <div className={styles.tags}>
              {product.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>

            <div className={styles.description}>
              <h2 className={styles.descTitle}>商品説明</h2>
              <p className={styles.descText}>{product.description}</p>
            </div>

            <div className={styles.ctas}>
              <a
                href={product.suzuriUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaPrimary}
                id={`product-detail-suzuri-${product.id}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                SUZURIで購入する
              </a>
              <Link href="/catalog" className={styles.ctaSecondary}>
                カタログで見る
              </Link>
            </div>

            <p className={styles.notice}>
              ※ 購入はSUZURIのショップにて承っております。
              ブランドサイトでは販売を行っておりません。
            </p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>関連アイテム</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedImage}>
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.nameJa || p.name}
                        fill
                        sizes="200px"
                        className={styles.image}
                      />
                    )}
                  </div>
                  <div className={styles.relatedInfo}>
                    <p className={styles.relatedName}>{p.nameJa || p.name}</p>
                    <p className={styles.relatedPrice}>{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
