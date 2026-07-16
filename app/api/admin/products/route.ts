import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function readProducts() {
  const raw = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function saveProducts(data: unknown) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET all products (including unpublished for admin)
export async function GET() {
  try {
    const data = await readProducts();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readProducts();

    const newProduct = {
      id: body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        + '-' + Date.now().toString(36),
      ...body,
      createdAt: new Date().toISOString().split('T')[0],
      sortOrder: (data.products?.length || 0) + 1,
    };

    data.products = [...(data.products || []), newProduct];
    await saveProducts(data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
