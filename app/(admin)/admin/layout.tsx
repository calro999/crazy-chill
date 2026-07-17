import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts, getAllPosts } from '@/lib/data';
import '@/app/globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: '管理画面 | CRAZY CHILL',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const products = getAllProducts();
  const posts = getAllPosts();

  return (
    <html lang="ja">
      <body>
        <div className={styles.adminShell}>
          {/* Admin sidebar */}
          <aside className={styles.adminSidebar}>
            <div className={styles.sidebarHeader}>
              <Link href="/admin/dashboard" className={styles.sidebarLogo}>
                CRAZY CHILL
              </Link>
              <div className={styles.sidebarSub}>管理画面</div>
            </div>

            <nav className={styles.sidebarNav}>
              <Link href="/admin/dashboard" className={styles.navItem} id="admin-nav-dashboard">
                <span>⊞</span> ダッシュボード
              </Link>
              <Link href="/admin/products" className={styles.navItem} id="admin-nav-products">
                <span>◈</span> 商品管理
                <span className={styles.navCount}>{products.length}</span>
              </Link>
              <Link href="/admin/blog" className={styles.navItem} id="admin-nav-blog">
                <span>◇</span> ブログ管理
                <span className={styles.navCount}>{posts.length}</span>
              </Link>
              <Link href="/admin/banners" className={styles.navItem} id="admin-nav-banners">
                <span>◉</span> バナー管理
              </Link>
            </nav>

            <div className={styles.sidebarFooter}>
              <Link href="/" target="_blank" className={styles.viewSiteBtn}>
                サイトを見る →
              </Link>
              <form action="/api/admin/logout" method="POST">
                <button type="submit" className={styles.logoutBtn} id="admin-logout-btn">
                  ログアウト
                </button>
              </form>
            </div>
          </aside>

          {/* Admin content */}
          <main className={styles.adminMain}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
