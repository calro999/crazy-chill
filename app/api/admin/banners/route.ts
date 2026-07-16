import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'banners.json');

async function readBanners() {
  const raw = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function saveBanners(data: unknown) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const data = await readBanners();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = await readBanners();
  const newBanner = { id: `banner-${Date.now()}`, ...body };
  data.banners = [...(data.banners || []), newBanner];
  await saveBanners(data);
  return NextResponse.json(newBanner, { status: 201 });
}
