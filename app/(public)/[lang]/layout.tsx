import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import TopBar from '@/components/TopBar/TopBar';
import Footer from '@/components/Footer/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';
import { getAllCategories } from '@/lib/data';
import styles from './layout.module.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://crazy-chill-official.vercel.app'),
  alternates: {
    canonical: './',
    languages: {
      'ja': '/ja',
      'en': '/en',
    },
  },
  title: {
    default: 'CRAZY CHILL（クレチル）| 狂気的なまでに脱力するダークパンクブランド',
    template: '%s | CRAZY CHILL',
  },
  description:
    '「狂気的なまでに脱力」をコンセプトに掲げるダークパンクアパレルブランドCRAZY CHILL（クレチル）。オリジナルTシャツ、パーカー、キャップ、ステッカーなどをSUZURIにて販売中。',
  keywords: ['CRAZY CHILL', 'クレチル', 'ダークパンク', 'オリジナルTシャツ', 'SUZURI', 'アパレル', 'ストリートファッション'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://crazy-chill.vercel.app',
    siteName: 'CRAZY CHILL',
    title: 'CRAZY CHILL（クレチル）| 狂気的なまでに脱力',
    description: '狂気的なまでに脱力するダークパンクアパレルブランド。SUZURIにてオリジナルアイテム販売中。',
    images: [
      {
        url: '/images/products/BONE%20RIDER.png',
        width: 1200,
        height: 630,
        alt: 'CRAZY CHILL - 狂気的なまでに脱力するダークパンクブランド',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRAZY CHILL（クレチル）| 狂気的なまでに脱力',
    description: '狂気的なまでに脱力するダークパンクアパレルブランド。',
    images: ['/images/products/BONE%20RIDER.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const categories = getAllCategories();

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-169NPXFLT3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-169NPXFLT3');
          `}
        </Script>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'CRAZY CHILL',
              url: 'https://crazy-chill.vercel.app',
              description: '狂気的なまでに脱力するダークパンクアパレルブランド',
              publisher: {
                '@type': 'Organization',
                name: 'CRAZY CHILL',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://crazy-chill.vercel.app/images/logo.png'
                }
              }
            })
          }}
        />
        <TopBar lang={lang as 'ja' | 'en'} />
        <div className={styles.appShell}>
          <Sidebar categories={categories} lang={lang as 'ja' | 'en'} />
          <div className={styles.mainWrapper}>
            <main className={styles.main} id="main-content">
              {children}
            </main>
            <Footer lang={lang as 'ja' | 'en'} />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
