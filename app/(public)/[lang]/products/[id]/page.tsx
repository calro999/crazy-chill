import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, getAllProducts, formatPrice } from '@/lib/data';
import { getDictionary } from '@/dictionaries';
import SuzuriButton from '@/components/SuzuriButton/SuzuriButton';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string; lang: 'ja' | 'en' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;
  const product = getProductById(id);
  const dict = await getDictionary(lang);
  if (!product) return { title: 'Not Found' };

  const name = lang === 'en' ? product.name : (product.nameJa || product.name);
  const description = lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description;

  return {
    title: name,
    description: description,
    openGraph: {
      title: `${name} | CRAZY CHILL`,
      description: description,
      images: product.image ? [{ url: product.image, alt: product.imageAlt || name, width: 1024, height: 1024 }] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map(p => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang);
  const product = getProductById(id);
  if (!product) notFound();

  const allProducts = getAllProducts();
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const name = lang === 'en' ? product.name : (product.nameJa || product.name);
  const description = lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
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
          <Link href={`/${lang}`} className={styles.breadcrumbLink}>{dict.topbar.home}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href={`/${lang}/products`} className={styles.breadcrumbLink}>{dict.sections.allItems}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{name}</span>
        </nav>

        <div className={styles.detail}>
          {/* Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.imageAlt || (product.nameJa || product.name)}
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
            <h1 className={styles.name}>{name}</h1>
            {lang === 'ja' && <p className={styles.nameEn}>{product.name}</p>}
            <div className={styles.price}>{formatPrice(product.price)}</div>

            <div className={styles.tags}>
              {product.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>

            <div className={styles.description}>
              <h2 className={styles.descTitle}>Description</h2>
              <p className={styles.descText}>{description}</p>
            </div>

            {product.series === 'ムダに肋骨が長いうさぎ' && (
              <div className={styles.blogLinkCard}>
                <Link href={`/${lang}/blog/rabbit-ribs-styling`} className={styles.blogLinkAnchor}>
                  📸 着用写真・コーディネート例はこちらのブログをチェック！
                </Link>
              </div>
            )}

            <div className={styles.ctas}>
              <SuzuriButton
                productId={product.id}
                suzuriUrl={product.suzuriUrl}
                className={styles.ctaPrimary}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {dict.topbar.buy}
              </SuzuriButton>
              <Link href={`/${lang}/catalog`} className={styles.ctaSecondary}>
                {dict.hero.catalogBtn}
              </Link>
            </div>

            <p className={styles.notice}>
              ※ 購入はSUZURIのショップにて承っております。<br />
              ブランドサイトでは販売を行っておりません。
            </p>

            {lang === 'en' && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--color-accent-2)' }}>🌍 Available for Worldwide Shipping!</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginBottom: '12px', lineHeight: 1.5 }}>
                  You can purchase our items from anywhere in the world using the integrated WorldShopping service on SUZURI.
                </p>
                <Link href="/en/blog/overseas-shipping-guide" style={{ fontSize: '13px', color: 'var(--color-text)', textDecoration: 'underline' }}>
                  Read the Overseas Purchase Guide →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Related Items</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.id} href={`/${lang}/products/${p.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedImage}>
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={lang === 'en' ? p.name : (p.nameJa || p.name)}
                        fill
                        sizes="200px"
                        className={styles.image}
                      />
                    )}
                  </div>
                  <div className={styles.relatedInfo}>
                    <p className={styles.relatedName}>{lang === 'en' ? p.name : (p.nameJa || p.name)}</p>
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
