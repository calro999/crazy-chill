import Link from 'next/link';
import { getAllProducts, getAllPosts } from '@/lib/data';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const products = getAllProducts();
  const posts = getAllPosts();
  const newProducts = products.filter(p => p.isNew);
  const featuredProducts = products.filter(p => p.featured);

  const stats = [
    { label: '総商品数', value: products.length, icon: '◈', href: '/admin/products' },
    { label: '公開商品', value: products.filter(p => p.published).length, icon: '✓', href: '/admin/products' },
    { label: 'ブログ記事', value: posts.length, icon: '◇', href: '/admin/blog' },
    { label: 'NEWバッジ', value: newProducts.length, icon: '★', href: '/admin/products' },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>ダッシュボード</h1>

      <div className={styles.statsGrid}>
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>クイックアクション</h2>
        <div className={styles.actionGrid}>
          <Link href="/admin/products" className={styles.actionCard} id="dash-products-link">
            <div className={styles.actionIcon}>◈</div>
            <div>
              <div className={styles.actionTitle}>商品を管理する</div>
              <div className={styles.actionDesc}>商品の追加・編集・削除</div>
            </div>
          </Link>
          <Link href="/admin/blog" className={styles.actionCard} id="dash-blog-link">
            <div className={styles.actionIcon}>◇</div>
            <div>
              <div className={styles.actionTitle}>ブログ記事を管理</div>
              <div className={styles.actionDesc}>記事の作成・編集・削除</div>
            </div>
          </Link>
          <Link href="/admin/banners" className={styles.actionCard} id="dash-banners-link">
            <div className={styles.actionIcon}>◉</div>
            <div>
              <div className={styles.actionTitle}>バナーを管理</div>
              <div className={styles.actionDesc}>自作バナーの追加・管理</div>
            </div>
          </Link>
          <a href="https://suzuri.jp/CRAZYCHILL" target="_blank" rel="noopener noreferrer" className={styles.actionCard} id="dash-suzuri-link">
            <div className={styles.actionIcon}>⊹</div>
            <div>
              <div className={styles.actionTitle}>SUZURIショップ</div>
              <div className={styles.actionDesc}>新商品の確認・追加</div>
            </div>
          </a>
        </div>
      </div>

      <div className={styles.hint}>
        <h2 className={styles.sectionTitle}>使い方ヒント</h2>
        <ul className={styles.hintList}>
          <li>商品をSUZURIで販売したら、こちらの管理画面から商品を登録してください</li>
          <li>SUZURIからダウンロードした1024×1024の商品画像をそのままアップロードできます</li>
          <li>カタログページでは登録された商品が大型表示されます</li>
          <li>ブログ記事はSEO対策として定期的に更新することをおすすめします</li>
        </ul>
      </div>
    </div>
  );
}
