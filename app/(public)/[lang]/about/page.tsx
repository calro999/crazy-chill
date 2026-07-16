import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '運営者情報',
  description: 'CRAZY CHILL（クレチル）の運営者情報・ブランドについて。',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.label}>ABOUT</div>
        <h1 className={styles.title}>運営者情報</h1>
      </div>

      <div className={styles.content}>
        {/* Brand info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ブランドについて</h2>
          <div className={styles.card}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th>ブランド名</th>
                  <td>CRAZY CHILL（クレチル）</td>
                </tr>
                <tr>
                  <th>コンセプト</th>
                  <td>狂気的なまでに脱力</td>
                </tr>
                <tr>
                  <th>テイスト</th>
                  <td>ダークパンク / オルタナティブ / ストリート</td>
                </tr>
                <tr>
                  <th>販売プラットフォーム</th>
                  <td>
                    <a
                      href="https://suzuri.jp/CRAZYCHILL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                      id="about-suzuri-link"
                    >
                      SUZURI（suzuri.jp/CRAZYCHILL）
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>取扱商品</th>
                  <td>Tシャツ・パーカー・キャップ・ステッカー・グラス・アクセサリーなど</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Concept */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ブランドコンセプト</h2>
          <div className={styles.conceptCard}>
            <blockquote className={styles.quote}>
              「狂気的なまでに脱力」
            </blockquote>
            <p>
              現代はなにかと全力を求められる時代です。SNS、仕事、人間関係——あらゆる場面で力むことを強いられる。
            </p>
            <p>
              CRAZY CHILLは、そこから一歩引いた「狂気的なほどゆるい立ち位置」を美学として打ち出しています。
              ダークなビジュアルでありながら、どこか力が抜けている。スカルがあるのに怖くない。
              そんな矛盾した美学こそが、クレチルのアイデンティティです。
            </p>
          </div>
        </section>

        {/* Note */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ご購入について</h2>
          <div className={styles.noteCard}>
            <p>
              当サイトはCRAZY CHILLのブランドサイトです。<strong>商品の購入はSUZURIにて行っていただく形となります。</strong>
              下記リンクよりSUZURIの公式ショップページへアクセスしてください。
            </p>
            <a
              href="https://suzuri.jp/CRAZYCHILL"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.suzuriBtn}
              id="about-suzuri-btn"
            >
              SUZURIショップへ →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
