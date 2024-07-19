import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyUser } from '~/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const userId = await verifyUser(username, password);
    if (userId) {
      const token = generateToken(username);

      return NextResponse.json({ token, username, userId }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error processing login request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
