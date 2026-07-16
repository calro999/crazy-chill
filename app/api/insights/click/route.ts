import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const DATA_FILE = path.join(process.cwd(), 'data', 'insights.json');

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // Use KV if available (production)
    if (process.env.KV_REST_API_URL) {
      const currentCount = await kv.hincrby('insights:clicks', productId, 1);
      return NextResponse.json({ success: true, count: currentCount });
    }

    // Fallback to local FS (development)
    if (!fs.existsSync(DATA_FILE)) {
      await writeFile(DATA_FILE, JSON.stringify({ clicks: {} }, null, 2), 'utf-8');
    }

    const raw = await readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);

    if (!data.clicks) data.clicks = {};
    data.clicks[productId] = (data.clicks[productId] || 0) + 1;
    
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true, count: data.clicks[productId] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to record click' }, { status: 500 });
  }
}
