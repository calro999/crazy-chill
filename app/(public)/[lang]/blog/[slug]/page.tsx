import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, formatDate } from '@/lib/data';
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar';
import styles from './page.module.css';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: '記事が見つかりません' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | CRAZY CHILL ブログ`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || '/images/products/BONE%20RIDER.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="blogImage" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^→ (.+)$/gm, '<p class="arrow-link">→ $1</p>')
    .replace(/\n\n/g, '</p><p>')
    .trim();
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts(lang);
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        author: {
          '@type': 'Organization',
          name: post.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'CRAZY CHILL',
        },
        keywords: post.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'HOME',
            'item': `https://crazy-chill-official.vercel.app/${lang}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'ブログ',
            'item': `https://crazy-chill-official.vercel.app/${lang}/blog`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': post.title
          }
        ]
      }
    ]
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
          <Link href={`/${lang}`} className={styles.breadLink}>HOME</Link>
          <span>›</span>
          <Link href={`/${lang}/blog`} className={styles.breadLink}>ブログ</Link>
          <span>›</span>
          <span className={styles.breadCurrent}>{post.title}</span>
        </nav>

        <div className={styles.layoutWrapper}>
          <div className={styles.mainContent}>
            <article className={styles.article}>
              {/* Header */}
              <header className={styles.articleHeader}>
                <div className={styles.tags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                <div className={styles.meta}>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span className={styles.author}>{post.author}</span>
                </div>
              </header>

              <div className={styles.glowLine} />

              {/* Content */}
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(post.content)}</p>` }}
              />

              {/* CTA */}
              <div className={styles.articleCta}>
                <p>CRAZY CHILLのアイテムはSUZURIで購入できます</p>
                <a
                  href="https://suzuri.jp/CRAZYCHILL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaBtn}
                  id={`blog-post-suzuri-${post.id}`}
                >
                  SUZURIショップを見る →
                </a>
              </div>
            </article>

            {/* Post navigation */}
            <nav className={styles.postNav} aria-label="記事ナビゲーション">
              {prevPost && (
                <Link href={`/${lang}/blog/${prevPost.slug}`} className={styles.navPrev}>
                  <span className={styles.navLabel}>← 前の記事</span>
                  <span className={styles.navTitle}>{prevPost.title}</span>
                </Link>
              )}
              {nextPost && (
                <Link href={`/${lang}/blog/${nextPost.slug}`} className={`${styles.navNext} ${!prevPost ? styles.navFull : ''}`}>
                  <span className={styles.navLabel}>次の記事 →</span>
                  <span className={styles.navTitle}>{nextPost.title}</span>
                </Link>
              )}
            </nav>

            <Link href={`/${lang}/blog`} className={styles.backLink}>
              ← ブログ一覧へ戻る
            </Link>
          </div>

          {/* Sidebar */}
          <ProductSidebar lang={lang} />
        </div>
      </div>
    </>
  );
}
