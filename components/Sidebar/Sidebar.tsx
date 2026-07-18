'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './Sidebar.module.css';
import { Category } from '@/lib/data';
import ja from '@/dictionaries/ja.json';
import en from '@/dictionaries/en.json';

const NAV_ITEMS = [
  { key: 'products', href: '/products', icon: '◈' },
  { key: 'catalog', href: '/catalog', icon: '◉' },
  { key: 'designs', href: '/designs', icon: '◆' },
  { key: 'lookbook', href: '/lookbook', icon: '📸' },
  { key: 'blog', href: '/blog', icon: '◇' },
  { key: 'about', href: '/about', icon: '◎' },
];

interface SidebarProps {
  categories: Category[];
  lang?: 'ja' | 'en';
}

function SidebarInner({ categories, lang = 'ja' }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get('category') || 'all';
  const dict = lang === 'en' ? en : ja;

  return (
    <aside className={styles.sidebar} aria-label="サイドバーナビゲーション">
      {/* Brand badge */}
      <div className={styles.brand}>
        <div className={styles.brandConcept}>{dict.hero.concept}</div>
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
          {dict.topbar.buy}
        </a>
      </div>

      <div className={styles.glowLine} />

      {/* Main nav */}
      <nav className={styles.section}>
        <div className={styles.sectionTitle}>Menu</div>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={`/${lang}${item.href}`}
            className={`${styles.navItem} ${pathname === `/${lang}${item.href}` || pathname?.startsWith(`/${lang}${item.href}/`) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {dict.topbar[item.key as keyof typeof dict.topbar]}
          </Link>
        ))}
      </nav>

      <div className={styles.divider} />

      {/* Categories */}
      <nav className={styles.section}>
        <div className={styles.sectionTitle}>{dict.footer.categories}</div>
        {categories.map(cat => {
          const isActive = cat.slug === 'all'
            ? pathname === `/${lang}/products` && currentCategory === 'all'
            : currentCategory === cat.slug || pathname === `/${lang}/category/${cat.slug}`;
          const href = cat.slug === 'all'
            ? `/${lang}/products`
            : `/${lang}/category/${cat.slug}`;

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
        <Link href={`/${lang}/about`} className={styles.footerLink}>{dict.topbar.about}</Link>
        <Link href={`/${lang}/blog`} className={styles.footerLink}>{dict.topbar.blog}</Link>
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

export default function Sidebar({ categories, lang = 'ja' }: SidebarProps) {
  return (
    <Suspense fallback={<aside className={styles.sidebar} />}>
      <SidebarInner categories={categories} lang={lang} />
    </Suspense>
  );
}
