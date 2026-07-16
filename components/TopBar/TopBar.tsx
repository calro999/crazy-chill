'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ja from '@/dictionaries/ja.json';
import en from '@/dictionaries/en.json';
import styles from './TopBar.module.css';

export default function TopBar({ lang = 'ja' }: { lang?: 'ja' | 'en' }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dict = lang === 'en' ? en : ja;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <div className={styles.logoGroup}>
            <Link href="/" className={styles.logo} aria-label="CRAZY CHILL ホームへ">
              <span className={styles.logoText}>CRAZY CHILL</span>
              <span className={styles.logoBadge}>クレチル</span>
            </Link>
            <span className={styles.tagline}>DARK PUNK & CHILL DESIGN</span>
          </div>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="メインナビゲーション">
            <Link href={`/${lang}/products`} className={`${styles.navLink} ${pathname?.includes('/products') ? styles.active : ''}`}>
              {dict.topbar.catalog}
            </Link>
            <Link href={`/${lang}/catalog`} className={`${styles.navLink} ${pathname?.includes('/catalog') ? styles.active : ''}`}>
              {dict.topbar.catalog}
            </Link>
            <Link href={`/${lang}/designs`} className={`${styles.navLink} ${pathname?.includes('/designs') ? styles.active : ''}`}>
              {dict.topbar.designs}
            </Link>
            <Link href={`/${lang}/blog`} className={`${styles.navLink} ${pathname?.includes('/blog') ? styles.active : ''}`}>
              {dict.topbar.blog}
            </Link>
            <Link href={`/${lang}/about`} className={`${styles.navLink} ${pathname?.includes('/about') ? styles.active : ''}`}>
              {dict.topbar.about}
            </Link>
          </nav>

          {/* CTA */}
          <div className={styles.actions}>
            <div className={styles.langSwitch}>
              <Link href={`/ja${pathname.replace(/^\/(ja|en)/, '') || '/'}`} className={lang === 'ja' ? styles.activeLang : ''}>JP</Link>
              <span className={styles.langDivider}>/</span>
              <Link href={`/en${pathname.replace(/^\/(ja|en)/, '') || '/'}`} className={lang === 'en' ? styles.activeLang : ''}>EN</Link>
            </div>
            
            <a
              href="https://suzuri.jp/CRAZYCHILL"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
              id="topbar-suzuri-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              SUZURIで購入
            </a>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={menuOpen}
              id="hamburger-button"
            >
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
            </button>
          </div>
        </div>

        {/* Glow line */}
        <div className={styles.glowLine} />
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)}>
          <nav className={styles.mobileMenu} onClick={e => e.stopPropagation()} aria-label="モバイルナビゲーション">
            <div className={styles.mobileLogo}>
              <span>CRAZY CHILL</span>
            </div>
            <div className={styles.mobileLinks}>
              <Link href={`/${lang}`} className={styles.mobileLink}>{dict.topbar.home}</Link>
              <Link href={`/${lang}/products`} className={styles.mobileLink}>{dict.topbar.catalog}</Link>
              <Link href={`/${lang}/catalog`} className={styles.mobileLink}>{dict.topbar.catalog}</Link>
              <Link href={`/${lang}/category/t-shirts`} className={styles.mobileLink}>T-Shirts</Link>
              <Link href={`/${lang}/category/hoodies`} className={styles.mobileLink}>Hoodies</Link>
              <Link href={`/${lang}/category/caps`} className={styles.mobileLink}>Caps</Link>
              <Link href={`/${lang}/category/stickers`} className={styles.mobileLink}>Stickers</Link>
              <Link href={`/${lang}/designs`} className={styles.mobileLink}>{dict.topbar.designs}</Link>
              <Link href={`/${lang}/blog`} className={styles.mobileLink}>{dict.topbar.blog}</Link>
              <Link href={`/${lang}/about`} className={styles.mobileLink}>{dict.topbar.about}</Link>
            </div>
            <a
              href="https://suzuri.jp/CRAZYCHILL"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileCta}
            >
              SUZURIショップへ →
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
