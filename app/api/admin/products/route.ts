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
