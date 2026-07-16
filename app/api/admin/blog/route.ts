import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getAllPosts } from '@/lib/data';

const BLOGS_DIR = path.join(process.cwd(), 'data', 'blogs');

export async function GET() {
  const posts = getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = body.slug || body.title
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36);

  const newPost = {
    id: `post-${Date.now().toString(36)}`,
    slug,
    ...body,
    publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
  };
  
  const filePath = path.join(BLOGS_DIR, `${slug}.json`);
  await writeFile(filePath, JSON.stringify(newPost, null, 2), 'utf-8');
  return NextResponse.json(newPost, { status: 201 });
}
