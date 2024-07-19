import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '~/utils/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (await createUser(username, password)) {
    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } else {
    return NextResponse.json({ message: 'User creation failed' }, { status: 400 });
  }
}