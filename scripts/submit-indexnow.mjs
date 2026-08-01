import fs from 'fs';
import path from 'path';

const host = 'crazy-chill-official.vercel.app';
const key = '4b9f2c8d7e1a3f5b8c9d0e1f2a3b4c5d';
const keyLocation = `https://${host}/${key}.txt`;
const sitemapUrl = `https://${host}/sitemap.xml`;

const publicDir = path.join(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('[IndexNow Error] sitemap.xml not found! Run generate-sitemap.mjs first.');
  process.exit(1);
}

// Extract all <loc> URLs from sitemap.xml
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
const urlMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)];
const urlList = urlMatches.map(m => m[1]);

console.log(`[IndexNow] Found ${urlList.length} unique URLs in sitemap.xml.`);

const indexNowEndpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://search.naver.com/indexnow'
];

async function submitIndexNow() {
  const payload = {
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList
  };

  console.log(`\n========================================`);
  console.log(`🚀 Starting IndexNow & Crawler Signal Push`);
  console.log(`========================================\n`);

  for (const endpoint of indexNowEndpoints) {
    try {
      console.log(`[Pushing] Sending ${urlList.length} URLs to IndexNow endpoint: ${endpoint}`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      console.log(`  -> Status: ${res.status} ${res.statusText}`);
      if (res.status === 200 || res.status === 202) {
        console.log(`  ✅ Successfully accepted by ${endpoint}`);
      } else {
        const text = await res.text();
        console.log(`  ⚠️ Response body: ${text.substring(0, 200)}`);
      }
    } catch (err) {
      console.error(`  ❌ Error sending to ${endpoint}:`, err.message);
    }
  }

  // Ping Search Engine Sitemaps
  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  ];

  console.log(`\n----------------------------------------`);
  console.log(`📡 Sending Sitemap Ping Signals`);
  console.log(`----------------------------------------\n`);

  for (const pingUrl of pingUrls) {
    try {
      console.log(`[Ping] Sending signal to: ${pingUrl}`);
      const res = await fetch(pingUrl);
      console.log(`  -> Status: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.error(`  ❌ Error pinging ${pingUrl}:`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`🎉 All indexing signals successfully broadcasted!`);
  console.log(`========================================\n`);
}

submitIndexNow();
