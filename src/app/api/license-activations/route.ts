import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ZodError, z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

// Validation schema
const getActivationsSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
});

// Handle CORS preflight
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
    // Skip rate limiting for license operations
    // const rateLimitResult = await checkRateLimit(request, 'api');
    // if (!rateLimitResult.success) {
    //   return NextResponse.json(
    //     { success: false, error: rateLimitResult.error },
    //     { 
    //       status: 429,
    //       headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    //         'Access-Control-Allow-Headers': 'Content-Type',
    //       }
    //     }
    //   );
    // }

    const body = await request.json();
    
    // Validate input
    const validatedData = getActivationsSchema.parse(body);
    const { licenseKey } = validatedData;

    // Verify license exists
    const license = await db.getLicense(licenseKey);
    if (!license) {
      return NextResponse.json(
        { success: false, message: 'License not found' },
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

    // Get activations
    let activations: any[] = [];
    try {
      const result = await db.getLicenseActivations(licenseKey);
      activations = Array.isArray(result) ? result : [];
    } catch (dbError) {
      console.error('Database error fetching activations:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch device activations' },
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

    return NextResponse.json(
      {
        success: true,
        activations: activations.map(a => ({
          id: a.id,
          deviceName: a.deviceName || 'Unknown Device',
          activatedAt: a.activatedAt.toISOString(),
          lastUsedAt: a.lastUsedAt.toISOString(),
        })),
        activeDevices: activations.length,
        maxDevices: license.maxDevices || 3,
        canAddDevice: activations.length < (license.maxDevices || 3),
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
    console.error('Get activations error:', error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request data',
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
      { success: false, error: 'Internal server error' },
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
