import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import TopBar from '@/components/TopBar/TopBar';
import Footer from '@/components/Footer/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';
import { getAllCategories } from '@/lib/data';
import styles from './layout.module.css';
import { Analytics } from '@vercel/analytics/react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const title = isEn
    ? 'CRAZY CHILL | Dark Punk & Japanese Subculture Apparel'
    : 'CRAZY CHILL（クレチル）| 狂気的なまでに脱力するダークパンクブランド';

  const description = isEn
    ? 'Official store for CRAZY CHILL. Japanese dark punk fashion, streetwear t-shirts, hoodies, and subculture graphic apparel available on SUZURI.'
    : '「狂気的なまでに脱力」をコンセプトに掲げるダークパンクアパレルブランドCRAZY CHILL（クレチル）。オリジナルTシャツ、パーカー、キャップ、ステッカーなどをSUZURIにて絶賛販売中。';

  const keywords = isEn
    ? ['CRAZY CHILL', 'Japanese Fashion', 'Dark Punk', 'Streetwear', 'Anime T-shirts', 'SUZURI', 'Gothic Apparel', 'Subculture']
    : ['CRAZY CHILL', 'クレチル', 'ダークパンク', 'オリジナルTシャツ', 'SUZURI', 'アパレル', 'ストリートファッション', 'サブカル 服', 'ゴスロリ', 'ギャル 服'];

  const siteUrl = 'https://crazy-chill-official.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'ja': `${siteUrl}/ja`,
        'en': `${siteUrl}/en`,
      },
    },
    title: {
      default: title,
      template: isEn ? '%s | CRAZY CHILL' : '%s | CRAZY CHILL（クレチル）',
    },
    description: description,
    keywords: keywords,
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'ja_JP',
      url: `${siteUrl}/${lang}`,
      siteName: 'CRAZY CHILL',
      title: title,
      description: description,
      images: [
        {
          url: `${siteUrl}/images/products/BONE%20RIDER.png`,
          width: 1200,
          height: 630,
          alt: 'CRAZY CHILL - Dark Punk Apparel',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${siteUrl}/images/products/BONE%20RIDER.png`],
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
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const categories = getAllCategories();
  const siteUrl = 'https://crazy-chill-official.vercel.app';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'CRAZY CHILL',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/products/BONE%20RIDER.png`,
        },
        sameAs: [
          'https://suzuri.jp/CRAZYCHILL',
          'https://pinterest.com/CRAZYCHILL',
        ],
        description: '狂気的なまでに脱力するダークパンクアパレルブランド CRAZY CHILL（クレチル）',
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'CRAZY CHILL',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        inLanguage: [
          { '@type': 'Language', name: 'Japanese', alternateName: 'ja' },
          { '@type': 'Language', name: 'English', alternateName: 'en' },
        ],
      },
      {
        '@type': 'Brand',
        '@id': `${siteUrl}/#brand`,
        name: 'CRAZY CHILL',
        url: siteUrl,
        logo: `${siteUrl}/images/products/BONE%20RIDER.png`,
      },
    ],
  };

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
            __html: JSON.stringify(jsonLd),
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
