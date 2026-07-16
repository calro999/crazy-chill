'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './TopBar.module.css';

export default function TopBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            <Link href="/products" className={`${styles.navLink} ${pathname?.startsWith('/products') ? styles.active : ''}`}>
              商品一覧
            </Link>
            <Link href="/catalog" className={`${styles.navLink} ${pathname?.startsWith('/catalog') ? styles.active : ''}`}>
              カタログ
            </Link>
            <Link href="/designs" className={`${styles.navLink} ${pathname?.startsWith('/designs') ? styles.active : ''}`}>
              デザイン
            </Link>
            <Link href="/blog" className={`${styles.navLink} ${pathname?.startsWith('/blog') ? styles.active : ''}`}>
              ブログ
            </Link>
            <Link href="/about" className={`${styles.navLink} ${pathname?.startsWith('/about') ? styles.active : ''}`}>
              運営者情報
            </Link>
          </nav>

          {/* CTA */}
          <div className={styles.actions}>
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
              <Link href="/" className={styles.mobileLink}>ホーム</Link>
              <Link href="/products" className={styles.mobileLink}>商品一覧</Link>
              <Link href="/catalog" className={styles.mobileLink}>カタログ</Link>
              <Link href="/category/t-shirts" className={styles.mobileLink}>Tシャツ</Link>
              <Link href="/category/hoodies" className={styles.mobileLink}>パーカー</Link>
              <Link href="/category/caps" className={styles.mobileLink}>キャップ</Link>
              <Link href="/category/stickers" className={styles.mobileLink}>ステッカー</Link>
              <Link href="/designs" className={styles.mobileLink}>デザインリスト</Link>
              <Link href="/blog" className={styles.mobileLink}>ブログ</Link>
              <Link href="/about" className={styles.mobileLink}>運営者情報</Link>
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
