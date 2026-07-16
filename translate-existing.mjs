import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function translate(text) {
  if (!text) return '';
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`);
    const data = await res.json();
    return data.responseData.translatedText || text;
  } catch (err) {
    console.error('Translation failed:', err);
    return text;
  }
}

async function run() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  let updated = false;

  for (const product of data.products) {
    if (!product.nameJa) {
      product.nameJa = product.name;
    }
    if (!product.descriptionEn && product.description) {
      console.log(`Translating description for ${product.nameJa}...`);
      product.descriptionEn = await translate(product.description);
      
      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Finished translating existing products.');
  } else {
    console.log('No products needed translation.');
  }
}

run();
