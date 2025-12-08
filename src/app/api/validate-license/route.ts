'use client';

import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route để validate License Key
 * Được gọi từ extension khi người dùng nhập key
 * 
 * Endpoint: POST /api/validate-license
 * Body: { licenseKey: string, email?: string }
 * Response: { valid: boolean, message: string, expiry?: date }
 */

interface ValidateLicenseRequest {
  licenseKey: string;
  email?: string;
}

interface ValidateLicenseResponse {
  valid: boolean;
  message: string;
  expiry?: string;
  plan?: 'lifetime' | '1year' | '3month';
}

// Mock database - trong thực tế sẽ query từ PostgreSQL
const validLicenses = new Map<string, {
  email: string;
  activatedAt: Date;
  expiry?: Date;
  plan: 'lifetime' | '1year' | '3month';
}>();

export async function POST(request: NextRequest): Promise<NextResponse<ValidateLicenseResponse>> {
  try {
    const body: ValidateLicenseRequest = await request.json();
    const { licenseKey, email } = body;

    // Validation
    if (!licenseKey || licenseKey.trim().length === 0) {
      return NextResponse.json(
        { valid: false, message: 'License key không được để trống' },
        { status: 400 }
      );
    }

    // Check format
    if (!licenseKey.startsWith('ADBLOCK-PRO-')) {
      return NextResponse.json(
        { valid: false, message: 'License key không hợp lệ' },
        { status: 400 }
      );
    }

    // TODO: Query database
    // const license = await db.query('SELECT * FROM licenses WHERE key = ?', [licenseKey]);
    
    // Mock check
    const license = validLicenses.get(licenseKey);
    
    if (!license) {
      return NextResponse.json(
        { valid: false, message: 'License key không tồn tại hoặc đã hết hạn' },
        { status: 404 }
      );
    }

    // Check expiry
    if (license.expiry && new Date() > license.expiry) {
      return NextResponse.json(
        { valid: false, message: 'License key đã hết hạn' },
        { status: 401 }
      );
    }

    // Verify email if provided
    if (email && email !== license.email) {
      return NextResponse.json(
        { valid: false, message: 'Email không khớp với license key' },
        { status: 403 }
      );
    }

    // Success
    return NextResponse.json({
      valid: true,
      message: 'License key hợp lệ! Extension sẽ hoạt động ngay.',
      expiry: license.expiry?.toISOString(),
      plan: license.plan
    });

  } catch (error) {
    console.error('License validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
}

/**
 * Helper function để thêm license vào database (được gọi khi mua hàng)
 */
export function addLicense(
  licenseKey: string,
  email: string,
  plan: 'lifetime' | '1year' | '3month' = 'lifetime'
): void {
  const expiry = plan === 'lifetime' ? undefined : 
    plan === '1year' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) :
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  validLicenses.set(licenseKey, {
    email,
    activatedAt: new Date(),
    expiry,
    plan
  });
}
