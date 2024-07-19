import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '~/utils/db';

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();
  const post = await createPost(title, content);
  return NextResponse.json(post, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const posts = await getPosts(offset, limit);
  return NextResponse.json(posts, { status: 200 });
}