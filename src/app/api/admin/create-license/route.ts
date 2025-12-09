import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { sendLicenseEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, licenseKey } = await req.json();

    if (!email || !licenseKey) {
      return NextResponse.json(
        { error: 'Email và license key là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 500 }
      );
    }

    const client = await pool.connect();

    try {
      // Check if license key already exists
      const existingKey = await client.query(
        'SELECT key FROM licenses WHERE key = $1',
        [licenseKey]
      );

      if (existingKey.rows.length > 0) {
        return NextResponse.json(
          { error: 'License key đã tồn tại' },
          { status: 400 }
        );
      }

      // Create license
      await client.query(
        `INSERT INTO licenses (key, email, created_at, expires_at, status)
         VALUES ($1, $2, NOW(), NOW() + INTERVAL '1 year', 'active')`,
        [licenseKey, email]
      );

      // Send email with license key and download link
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ablockyoutube.vercel.app';
      await sendLicenseEmail({
        to: email,
        name: email.split('@')[0],
        licenseKey,
        downloadUrl: `${baseUrl}/api/download/extension`,
        baseUrl
      });

      return NextResponse.json({
        success: true,
        message: 'Đã tạo license và gửi email thành công'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Admin create license error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
