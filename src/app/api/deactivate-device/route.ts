import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ZodError, z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

// Validation schema
const deactivateDeviceSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
  activationId: z.string().min(1, 'Activation ID is required'),
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
    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.error },
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
    const validatedData = deactivateDeviceSchema.parse(body);
    const { licenseKey, activationId } = validatedData;

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

    // Get activations to verify the activation belongs to this license
    const activations = await db.getLicenseActivations(licenseKey);
    const activationExists = activations.some(a => a.id === activationId);

    if (!activationExists) {
      return NextResponse.json(
        { success: false, message: 'Activation not found or does not belong to this license' },
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

    // Remove the device activation
    const removed = await db.removeDeviceActivation(activationId);

    if (!removed) {
      return NextResponse.json(
        { success: false, message: 'Failed to deactivate device' },
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

    // Get updated activations
    const updatedActivations = await db.getLicenseActivations(licenseKey);

    return NextResponse.json(
      {
        success: true,
        message: 'Device deactivated successfully',
        activeDevices: updatedActivations.length,
        maxDevices: license.maxDevices || 3
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
    console.error('Deactivate device error:', error);
    
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
