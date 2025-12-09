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
    const body = await request.json();
    console.log('License activations request:', { licenseKey: body.licenseKey });
    
    // Validate input
    const validatedData = getActivationsSchema.parse(body);
    const { licenseKey } = validatedData;

    // Verify license exists
    console.log('Checking license:', licenseKey);
    const license = await db.getLicense(licenseKey);
    console.log('License result:', license ? 'Found' : 'Not found');
    
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
    console.log('Fetching activations for:', licenseKey);
    let activations: any[] = [];
    try {
      const result = await db.getLicenseActivations(licenseKey);
      console.log('Activations result:', result);
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error message:', errorMessage);
    console.error('Error stack:', error instanceof Error ? error.stack : 'N/A');
    
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
      { success: false, error: 'Internal server error', details: errorMessage },
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
