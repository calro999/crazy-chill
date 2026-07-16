import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { getAllPosts } from '@/lib/data';

const BLOGS_DIR = path.join(process.cwd(), 'data', 'blogs');

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const posts = getAllPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  const updatedPost = { ...post, ...body, id };
  const filePath = path.join(BLOGS_DIR, `${post.slug}.json`);
  await writeFile(filePath, JSON.stringify(updatedPost, null, 2), 'utf-8');
  return NextResponse.json(updatedPost);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const posts = getAllPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    const filePath = path.join(BLOGS_DIR, `${post.slug}.json`);
    await unlink(filePath).catch(() => {});
  }
  return NextResponse.json({ success: true });
}
