import type { Metadata } from 'next';
import LightboxGallery from '@/components/LightboxGallery/LightboxGallery';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'ルックブック（Lookbook）',
  description: 'CRAZY CHILL（クレチル）が提案するダークパンク×ストリートの着用コーディネートギャラリー。',
};

// 実際の画像ファイルパスと、クリック時に遷移させるリンク先の定義
const LOOKBOOK_IMAGES = [
  {
    src: '/images/products/BONE%20RIDER.png',
    alt: 'BONE RIDER セットアップ着用',
    linkHref: '/designs',
    linkLabel: 'BONE RIDERシリーズを見る →'
  },
  {
    src: '/images/products/全身肋骨ちゃん.jpg',
    alt: '全身肋骨ちゃん 着用イメージ',
    linkHref: '/products',
    linkLabel: 'このアイテムを探す →'
  },
  {
    src: '/images/products/別ポーズ2全身肋骨.jpg',
    alt: '全身肋骨ちゃん ストリートコーデ',
    linkHref: '/products',
    linkLabel: 'アイテム一覧へ →'
  },
  {
    src: '/images/products/別ポーズ全身肋骨.jpg',
    alt: '全身肋骨ちゃん ダークパンクスタイル',
    linkHref: '/products',
    linkLabel: 'アイテム一覧へ →'
  },
  {
    src: '/images/products/肋骨ちゃん.png',
    alt: '肋骨ちゃん グラフィック着用',
    linkHref: '/products',
    linkLabel: 'アイテム一覧へ →'
  },
  {
    src: '/images/products/肋骨全身.jpg',
    alt: '肋骨全身 ルーズシルエットコーデ',
    linkHref: '/products',
    linkLabel: 'アイテム一覧へ →'
  }
];

export default function LookbookPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.label}>LOOKBOOK</div>
        <h1 className={styles.title}>ルックブック・着用ギャラリー</h1>
        <p className={styles.subtitle}>CRAZY CHILLのダークパンク×ストリートスタイル</p>
      </div>

      <section className={styles.seoContent}>
        <h2>「狂気的なまでに脱力」するストリートコーディネート</h2>
        <p>
          CRAZY CHILL（クレチル）が提案するのは、ただダークでハードなだけではない、特有の「ゆるさ（脱力感）」をミックスした全く新しいストリートファッションです。
          オーバーサイズのTシャツやパーカーをベースに、ルーズなシルエットのボトムスを合わせることで、気張らないチルな姿勢を表現しています。
        </p>
        <p>
          このルックブック（ギャラリー）では、実際の着用サイズ感や、アイテム同士の組み合わせ（セットアップ風コーデ、モノトーンコーデなど）のリアルなスタイリングをご紹介します。
          お気に入りの着こなしを見つけて、あなただけのダークパンクスタイルを完成させてください。
        </p>
      </section>

      <div className={styles.galleryWrapper}>
        <LightboxGallery images={LOOKBOOK_IMAGES} />
      </div>

      <section className={styles.seoContentBottom}>
        <h2>スタイリングのポイントと着こなし術</h2>
        <h3>1. モノトーンを基調に「1点ダーク」を際立たせる</h3>
        <p>
          クレチルのグラフィックは非常にシュールでインパクトがあります。そのため、全身を派手なカラーでまとめるのではなく、ブラックやホワイトを基調としたモノトーンで統一するのがおすすめです。これにより、デザインの毒々しさが際立ち、洗練された大人のストリートスタイルが完成します。
        </p>
        <h3>2. サイズ感は「オーバーサイズ」が基本</h3>
        <p>
          「脱力感」を体現するためには、体にフィットするジャストサイズよりも、ワンサイズ〜ツーサイズアップしたビッグシルエットを選ぶのが正解です。風に揺れるルーズなドレープ感が、気怠さとクールさを同時に演出します。
        </p>
      </section>
    </div>
  );
}
