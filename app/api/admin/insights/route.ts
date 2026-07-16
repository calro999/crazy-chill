import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const DATA_FILE = path.join(process.cwd(), 'data', 'insights.json');

export async function GET() {
  try {
    // Use KV if available (production)
    if (process.env.KV_REST_API_URL) {
      const clicks = await kv.hgetall('insights:clicks') || {};
      return NextResponse.json({ clicks });
    }

    // Fallback to local FS (development)
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ clicks: {} });
    }
    const raw = await readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to read insights' }, { status: 500 });
  }
}
