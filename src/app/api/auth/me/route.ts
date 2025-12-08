import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = await verifySession(token);
    const user = await db.getUserByEmail(payload.email);
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({ user: { email: user.email, name: user.name, provider: user.provider } });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
