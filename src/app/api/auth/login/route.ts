import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { emailSchema } from '@/lib/validation';
import { verifyPassword, signSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const emailParse = emailSchema.safeParse(body.email);
    if (!emailParse.success) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    const email = emailParse.data.toLowerCase();
    const password = (body.password || '').toString();

    const user = await db.getUserByEmail(email);
    if (!user || user.provider !== 'credentials' || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Sai email hoặc mật khẩu' }, { status: 401 });
    }

    const token = await signSession({ sub: user.id, email: user.email, name: user.name, provider: user.provider });
    const res = NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Đăng nhập thất bại' }, { status: 500 });
  }
}
