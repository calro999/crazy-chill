import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/data';
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const siteUrl = 'https://crazy-chill-official.vercel.app';

  const title = isEn ? 'Blog' : 'ブログ';
  const description = isEn
    ? 'CRAZY CHILL Official Blog. Discover Japanese subculture fashion, Gothic Lolita, Gyaru culture, and styling guides.'
    : 'CRAZY CHILL（クレチル）公式ブログ。ダークパンクファッション、コーデ術、SUZURIアイテムレビューなどを発信中。';

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/blog`,
      languages: {
        ja: `${siteUrl}/ja/blog`,
        en: `${siteUrl}/en/blog`,
      },
    },
    openGraph: {
      title: `${title} | CRAZY CHILL`,
      description,
      url: `${siteUrl}/${lang}/blog`,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const posts = getAllPosts(lang);
  const siteUrl = 'https://crazy-chill-official.vercel.app';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/${lang}/blog/${post.slug}`,
          name: post.title,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'HOME',
            item: `${siteUrl}/${lang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'en' ? 'Blog' : 'ブログ',
            item: `${siteUrl}/${lang}/blog`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.page}>
      <div className={styles.layoutWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.headerLabel}>BLOG</div>
            <h1 className={styles.title}>ブログ</h1>
            <p className={styles.subtitle}>
              ダークパンクファッション情報・コーデ術・ブランド裏話
            </p>
          </div>

          {posts.length > 0 ? (
            <div className={styles.list}>
              {posts.map((post, i) => (
                <article key={post.id} className={styles.postCard}>
                  <div className={styles.postIndex}>{String(i + 1).padStart(2, '0')}</div>
                  <div className={styles.postBody}>
                    <div className={styles.postMeta}>
                      <time dateTime={post.publishedAt} className={styles.postDate}>
                        {formatDate(post.publishedAt)}
                      </time>
                      <div className={styles.postTags}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.postTag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <Link href={`/${lang}/blog/${post.slug}`} className={styles.postTitle}>
                      {post.title}
                    </Link>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <Link href={`/${lang}/blog/${post.slug}`} className={styles.readMore}>
                      続きを読む →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◇</span>
              <p>記事を準備中です</p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <ProductSidebar lang={lang} />
      </div>
    </div>
    </>
  );
}
