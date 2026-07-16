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

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const data = await readBanners();
  const idx = data.banners.findIndex((b: { id: string }) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.banners[idx] = { ...data.banners[idx], ...body, id };
  await saveBanners(data);
  return NextResponse.json(data.banners[idx]);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await readBanners();
  data.banners = data.banners.filter((b: { id: string }) => b.id !== id);
  await saveBanners(data);
  return NextResponse.json({ success: true });
}
