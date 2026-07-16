import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.glowLine} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandName}>CRAZY CHILL</div>
            <div className={styles.brandKana}>クレチル</div>
            <p className={styles.concept}>狂気的なまでに脱力</p>
            <a
              href="https://suzuri.jp/CRAZYCHILL"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.suzuriLink}
              id="footer-suzuri-link"
            >
              SUZURIショップを見る →
            </a>
          </div>

          {/* Shop */}
          <div className={styles.col}>
            <div className={styles.colTitle}>ショップ</div>
            <Link href="/products" className={styles.colLink}>商品一覧</Link>
            <Link href="/catalog" className={styles.colLink}>カタログ</Link>
            <Link href="/designs" className={styles.colLink}>デザインリスト</Link>
            <Link href="/category/t-shirts" className={styles.colLink}>Tシャツ</Link>
            <Link href="/category/hoodies" className={styles.colLink}>パーカー</Link>
            <Link href="/category/caps" className={styles.colLink}>キャップ</Link>
            <Link href="/category/stickers" className={styles.colLink}>ステッカー</Link>
          </div>

          {/* Content */}
          <div className={styles.col}>
            <div className={styles.colTitle}>コンテンツ</div>
            <Link href="/blog" className={styles.colLink}>ブログ</Link>
            <Link href="/about" className={styles.colLink}>運営者情報</Link>
            <a href="https://suzuri.jp/CRAZYCHILL" target="_blank" rel="noopener noreferrer" className={styles.colLink}>
              SUZURI公式ページ
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {year} CRAZY CHILL. All rights reserved.
          </p>
          <p className={styles.poweredBy}>
            Powered by <a href="https://suzuri.jp" target="_blank" rel="noopener noreferrer">SUZURI</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
