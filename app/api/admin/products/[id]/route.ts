import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { updateGitHubFile } from '@/lib/github';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function readProducts() {
  if (process.env.GITHUB_TOKEN) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/data/products.json?ref=${branch}`;
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(content);
    }
  }

  const raw = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function saveProducts(data: unknown) {
  const jsonContent = JSON.stringify(data, null, 2);
  
  if (process.env.GITHUB_TOKEN) {
    await updateGitHubFile('data/products.json', jsonContent, 'Update products via Admin Panel');
  } else {
    await writeFile(DATA_FILE, jsonContent, 'utf-8');
  }
}

interface Params {
  params: Promise<{ id: string }>;
}

// PUT update product
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await readProducts();

    const index = data.products.findIndex((p: { id: string }) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    data.products[index] = { ...data.products[index], ...body, id };
    await saveProducts(data);

    return NextResponse.json(data.products[index]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const data = await readProducts();

    const before = data.products.length;
    data.products = data.products.filter((p: { id: string }) => p.id !== id);

    if (data.products.length === before) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await saveProducts(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
