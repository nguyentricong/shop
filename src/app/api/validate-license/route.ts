import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateLicenseSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { valid: false, error: rateLimitResult.error },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = validateLicenseSchema.parse(body);
    const { licenseKey, email } = validatedData;

    // Validate license from database
    const result = await db.validateLicense(licenseKey);
    
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, message: result.message },
        { status: 400 }
      );
    }

    // Get license details
    const license = await db.getLicense(licenseKey);
    
    if (!license) {
      return NextResponse.json(
        { valid: false, message: 'License không tồn tại' },
        { status: 404 }
      );
    }

    // Check if email matches (if provided)
    if (email && license.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { valid: false, message: 'Email không khớp với License Key' },
        { status: 403 }
      );
    }

    // Auto-activate if not activated yet
    if (!license.active) {
      await db.activateLicense(licenseKey);
    }

    return NextResponse.json({
      valid: true,
      message: 'License hợp lệ',
      plan: license.plan,
      expiry: license.expiryAt?.toISOString(),
      activatedAt: license.activatedAt?.toISOString()
    });

  } catch (error) {
    console.error('Validate license error:', error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Dữ liệu không hợp lệ',
          details: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: false, error: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
