'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './Sidebar.module.css';
import { Category } from '@/lib/data';

const NAV_ITEMS = [
  { href: '/products', label: '商品一覧', icon: '◈' },
  { href: '/catalog', label: 'カタログ', icon: '◉' },
  { href: '/designs', label: 'デザインリスト', icon: '◆' },
  { href: '/blog', label: 'ブログ', icon: '◇' },
  { href: '/about', label: '運営者情報', icon: '◎' },
];

interface SidebarProps {
  categories: Category[];
}

function SidebarInner({ categories }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get('category') || 'all';

  return (
    <aside className={styles.sidebar} aria-label="サイドバーナビゲーション">
      {/* Brand badge */}
      <div className={styles.brand}>
        <div className={styles.brandConcept}>狂気的なまでに脱力</div>
        <a
          href="https://suzuri.jp/CRAZYCHILL"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.suzuriBtn}
          id="sidebar-suzuri-link"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          SUZURIで購入する
        </a>
      </div>

      <div className={styles.glowLine} />

      {/* Main nav */}
      <nav className={styles.section}>
        <div className={styles.sectionTitle}>メニュー</div>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href || pathname?.startsWith(item.href + '/') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.divider} />

      {/* Categories */}
      <nav className={styles.section}>
        <div className={styles.sectionTitle}>カテゴリー</div>
        {categories.map(cat => {
          const isActive = cat.slug === 'all'
            ? pathname === '/products' && currentCategory === 'all'
            : currentCategory === cat.slug || pathname === `/category/${cat.slug}`;
          const href = cat.slug === 'all'
            ? '/products'
            : `/category/${cat.slug}`;

          return (
            <Link
              key={cat.id}
              href={href}
              className={`${styles.categoryItem} ${isActive ? styles.active : ''}`}
              title={cat.description}
            >
              <span className={styles.catIcon}>{cat.icon}</span>
              <span className={styles.catName}>{cat.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.divider} />

      {/* Footer links */}
      <div className={styles.footer}>
        <Link href="/about" className={styles.footerLink}>運営者情報</Link>
        <Link href="/blog" className={styles.footerLink}>ブログ</Link>
        <a
          href="https://suzuri.jp/CRAZYCHILL"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          SUZURI公式
        </a>
      </div>
    </aside>
  );
}

export default function Sidebar({ categories }: SidebarProps) {
  return (
    <Suspense fallback={<aside className={styles.sidebar} />}>
      <SidebarInner categories={categories} />
    </Suspense>
  );
}
