import Link from 'next/link';
import { getAllProducts, getRecentPosts, formatPrice, formatDate } from '@/lib/data';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';
import { getDictionary } from '@/dictionaries';

interface Props {
  params: Promise<{ lang: 'ja' | 'en' }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const products = getAllProducts();
  const recentPosts = getRecentPosts(3);
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const newProducts = products.filter(p => p.isNew).slice(0, 6);
  
  let displayProducts = [...newProducts];
  for (const p of featuredProducts) {
    if (!displayProducts.some(dp => dp.id === p.id)) {
      displayProducts.push(p);
    }
  }
  for (const p of products) {
    if (displayProducts.length >= 8) break;
    if (!displayProducts.some(dp => dp.id === p.id)) {
      displayProducts.push(p);
    }
  }

  return (
    <div className={styles.page}>
      {/* ===== HERO ===== */}
      <section className={styles.hero} aria-label="ヒーローセクション">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>✦</span> DARK PUNK APPAREL BRAND
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleMain}>CRAZY</span>
            <span className={styles.heroTitleSub}>CHILL</span>
          </h1>
          <p className={styles.heroConcept}>{dict.hero.concept}</p>
          <p className={styles.heroDesc}>
            {dict.hero.desc1}<br />
            {dict.hero.desc2}
          </p>
          <div className={styles.heroCtas}>
            <a
              href="https://suzuri.jp/CRAZYCHILL"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
              id="hero-suzuri-btn"
            >
              {dict.topbar.buy}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <Link href={`/${lang}/catalog`} className={styles.ctaSecondary} id="hero-catalog-btn">
              {dict.hero.catalogBtn}
            </Link>
          </div>
        </div>

        {/* Hero Visual (Right Side) */}
        {newProducts.length > 0 && (
          <div className={styles.heroVisual}>
            {newProducts.slice(0, 2).map((product, i) => (
              <Link href={`/products/${product.id}`} key={product.id} className={`${styles.heroVisualItem} ${styles[`heroVisualItem${i + 1}`]}`}>
                <div className={styles.heroVisualImageWrapper}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className={styles.heroVisualImage} />
                  ) : (
                    <div className={styles.heroVisualNoImage}>✦</div>
                  )}
                </div>
                <div className={styles.heroVisualLabel}>
                  <div className={styles.heroVisualName}>{product.name}</div>
                  <div className={styles.heroVisualPrice}>{formatPrice(product.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Decorative elements */}
        <div className={styles.heroDecor}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroOrb3} />
          <div className={styles.heroGrid} />
          <div className={styles.heroStars}>
            {['✦','✧','★','✦','✧','★','✦'].map((s, i) => (
              <span key={i} className={styles.heroStar} style={{ '--delay': `${i * 0.4}s` } as React.CSSProperties}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.glowDivider} />

      {/* ===== PRODUCTS ===== */}
      <section className={styles.section} aria-label="商品一覧">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>ITEMS</div>
          <h2 className={styles.sectionTitle}>
            {newProducts.length > 0 ? dict.sections.newItems : dict.sections.allItems}
          </h2>
          <Link href={`/${lang}/products`} className={styles.sectionMore}>
            {dict.sections.viewAll}
          </Link>
        </div>

        {displayProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {displayProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✦</div>
            <p className={styles.emptyText}>商品を準備中です</p>
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
      </section>

      {/* ===== BANNER / CTA ===== */}
      <section className={styles.bannerSection} aria-label="SUZURIへのリンク">
        <div className={styles.bannerInner}>
          <div className={styles.bannerText}>
            <div className={styles.bannerLabel}>SUZURI OFFICIAL SHOP</div>
            <h2 className={styles.bannerTitle}>{dict.sections.suzuriBannerTitle}</h2>
            <p className={styles.bannerDesc}>
              {dict.sections.suzuriBannerDesc}
            </p>
          </div>
          <a
            href="https://suzuri.jp/CRAZYCHILL"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bannerBtn}
            id="cta-section-suzuri-btn"
          >
            {dict.sections.suzuriBtn}
          </a>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      {recentPosts.length > 0 && (
        <section className={styles.section} aria-label="ブログ記事">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>BLOG</div>
            <h2 className={styles.sectionTitle}>最新記事</h2>
            <Link href={`/${lang}/blog`} className={styles.sectionMore}>
              すべての記事 →
            </Link>
          </div>

          <div className={styles.blogGrid}>
            {recentPosts.map(post => (
              <article key={post.id} className={styles.blogCard}>
                <div className={styles.blogCardBody}>
                  <div className={styles.blogTags}>
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className={styles.blogTag}>{tag}</span>
                    ))}
                  </div>
                  <Link href={`/${lang}/blog/${post.slug}`} className={styles.blogTitle}>
                    {post.title}
                  </Link>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  <div className={styles.blogFooter}>
                    <time className={styles.blogDate} dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <Link href={`/${lang}/blog/${post.slug}`} className={styles.blogReadMore}>
                      続きを読む →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
