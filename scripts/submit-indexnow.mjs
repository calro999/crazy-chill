import fs from 'fs';
import path from 'path';

const host = 'crazy-chill-official.vercel.app';
const key = '4b9f2c8d7e1a3f5b8c9d0e1f2a3b4c5d';
const keyLocation = `https://${host}/${key}.txt`;

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

// Official IndexNow Endpoints (api.indexnow.org shares signals automatically to Bing, Yandex, Seznam, Naver, and AI LLM search engines)
const indexNowEndpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow'
];

function chunkArray(arr, chunkSize) {
  const results = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    results.push(arr.slice(i, i + chunkSize));
  }
  return results;
}

async function submitIndexNow() {
  console.log(`\n========================================`);
  console.log(`🚀 Starting IndexNow & Crawler Signal Push`);
  console.log(`========================================\n`);

  const urlChunks = chunkArray(urlList, 50);

  for (const endpoint of indexNowEndpoints) {
    console.log(`[Pushing] Sending URLs to IndexNow endpoint: ${endpoint}`);
    let successCount = 0;
    
    for (const chunk of urlChunks) {
      const payload = {
        host: host,
        key: key,
        keyLocation: keyLocation,
        urlList: chunk
      };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        if (res.status === 200 || res.status === 202) {
          successCount += chunk.length;
        } else {
          const text = await res.text();
          console.log(`  ⚠️ Chunk error (${res.status} ${res.statusText}): ${text.substring(0, 100)}`);
        }
      } catch (err) {
        console.error(`  ❌ Error sending chunk to ${endpoint}:`, err.message);
      }
    }

    console.log(`  ✅ Successfully accepted ${successCount}/${urlList.length} URLs by ${endpoint}`);
  }

  console.log(`\n========================================`);
  console.log(`🎉 All indexing signals successfully broadcasted to AI, GEO & Search Engines!`);
  console.log(`========================================\n`);
}

submitIndexNow();
