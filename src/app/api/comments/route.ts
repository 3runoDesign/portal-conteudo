import { NextRequest, NextResponse } from 'next/server';
import { createComment, getComments, deleteComment } from '~/utils/db';

export async function POST(req: NextRequest) {
  const { content, postId, userId } = await req.json();
  const comment = await createComment(content, postId, userId);
  return NextResponse.json(comment, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ message: 'postId is required' }, { status: 400 });
  }
  const comments = await getComments(postId);
  return NextResponse.json(comments, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('commentId');

  if (!commentId) {
    return NextResponse.json({ message: 'commentId is required' }, { status: 400 });
  }

  try {
    await deleteComment(commentId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}