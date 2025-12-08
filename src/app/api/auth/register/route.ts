import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { emailSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const emailParse = emailSchema.safeParse(body.email);
    if (!emailParse.success) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    const email = emailParse.data.toLowerCase();
    const name = (body.name || '').toString().trim();
    const password = (body.password || '').toString();

    if (name.length < 2) return NextResponse.json({ error: 'Tên quá ngắn' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, { status: 400 });

    const existing = await db.getUserByEmail(email);
    if (existing) return NextResponse.json({ error: 'Email đã được đăng ký' }, { status: 400 });

    const passwordHash = await hashPassword(password);
    await db.createUser({ email, name, passwordHash, provider: 'credentials' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Đăng ký thất bại' }, { status: 500 });
  }
}
