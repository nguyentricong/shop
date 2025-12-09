import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateLicenseSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { ZodError } from 'zod';
import crypto from 'crypto';

// Generate device fingerprint based on headers
function generateDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLanguage = request.headers.get('accept-language') || 'unknown';
  
  // Combine user agent and language for a simple device ID
  // In production, you'd use more sophisticated fingerprinting
  const combined = `${userAgent}|${acceptLanguage}`;
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

// Handle CORS preflight request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { valid: false, error: rateLimitResult.error },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
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
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Get license details
    const license = await db.getLicense(licenseKey);
    
    if (!license) {
      return NextResponse.json(
        { valid: false, message: 'License không tồn tại' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Check if email matches (if provided)
    if (email && license.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { valid: false, message: 'Email không khớp với License Key' },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Auto-activate if not activated yet
    if (!license.active) {
      await db.activateLicense(licenseKey);
    }

    // Device-based activation (limit 3 devices per license)
    const deviceId = generateDeviceFingerprint(request);
    const deviceActivation = await db.activateLicenseDevice(licenseKey, deviceId, 'Browser Extension');

    if (!deviceActivation.allowed) {
      return NextResponse.json(
        { 
          valid: false, 
          message: deviceActivation.message,
          activeDevices: deviceActivation.activeDevices,
          maxDevices: license.maxDevices || 3
        },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        message: 'License hợp lệ',
        plan: license.plan,
        expiry: license.expiryAt?.toISOString(),
        activatedAt: license.activatedAt?.toISOString(),
        activeDevices: deviceActivation.activeDevices,
        maxDevices: license.maxDevices || 3,
        activationId: deviceActivation.activationId
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

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
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return NextResponse.json(
      { valid: false, error: 'Lỗi hệ thống' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}
