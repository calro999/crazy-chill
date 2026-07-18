import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { updateGitHubFile } from '@/lib/github';

const DATA_FILE = path.join(process.cwd(), 'data', 'categories.json');

async function readCategories() {
  if (process.env.GITHUB_TOKEN) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/data/categories.json?ref=${branch}`;
    
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

async function saveCategories(data: unknown) {
  const jsonContent = JSON.stringify(data, null, 2);
  
  if (process.env.GITHUB_TOKEN) {
    await updateGitHubFile('data/categories.json', jsonContent, 'Update categories via Admin Panel');
  } else {
    await writeFile(DATA_FILE, jsonContent, 'utf-8');
  }
}

export async function GET() {
  try {
    const data = await readCategories();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ categories: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newCategory = await req.json();
    const data = await readCategories();
    
    if (!data.categories) {
      data.categories = [];
    }
    
    // Check if category exists
    if (!data.categories.find((c: any) => c.id === newCategory.id)) {
      data.categories.push(newCategory);
      await saveCategories(data);
    }
    
    return NextResponse.json({ success: true, categories: data.categories });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}
