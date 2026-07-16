import Link from 'next/link';
import ja from '@/dictionaries/ja.json';
import en from '@/dictionaries/en.json';
import styles from './Footer.module.css';

export default function Footer({ lang = 'ja' }: { lang?: 'ja' | 'en' }) {
  const year = new Date().getFullYear();
  const dict = lang === 'en' ? en : ja;

  return (
    <footer className={styles.footer}>
      <div className={styles.glowLine} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandName}>CRAZY CHILL</div>
            {lang === 'ja' && <div className={styles.brandKana}>クレチル</div>}
            <p className={styles.concept}>{dict.hero.concept}</p>
            <a
              href="https://suzuri.jp/CRAZYCHILL"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.suzuriLink}
              id="footer-suzuri-link"
            >
              {dict.sections.suzuriBtn} →
            </a>
          </div>

          {/* Shop */}
          <div className={styles.col}>
            <div className={styles.colTitle}>{dict.footer.categories}</div>
            <Link href={`/${lang}/products`} className={styles.colLink}>{dict.sections.allItems}</Link>
            <Link href={`/${lang}/catalog`} className={styles.colLink}>{dict.topbar.catalog}</Link>
            <Link href={`/${lang}/designs`} className={styles.colLink}>{dict.topbar.designs}</Link>
            <Link href={`/${lang}/category/t-shirts`} className={styles.colLink}>T-Shirts</Link>
            <Link href={`/${lang}/category/hoodies`} className={styles.colLink}>Hoodies</Link>
            <Link href={`/${lang}/category/caps`} className={styles.colLink}>Caps</Link>
            <Link href={`/${lang}/category/stickers`} className={styles.colLink}>Stickers</Link>
          </div>

          {/* Content */}
          <div className={styles.col}>
            <div className={styles.colTitle}>{dict.footer.links}</div>
            <Link href={`/${lang}/blog`} className={styles.colLink}>{dict.topbar.blog}</Link>
            <Link href={`/${lang}/about`} className={styles.colLink}>{dict.topbar.about}</Link>
            <a href="https://suzuri.jp/CRAZYCHILL" target="_blank" rel="noopener noreferrer" className={styles.colLink}>
              SUZURI
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {year} {dict.footer.copyright}
          </p>
          <p className={styles.poweredBy}>
            Powered by <a href="https://suzuri.jp" target="_blank" rel="noopener noreferrer">SUZURI</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
