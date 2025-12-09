import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

// Generate device fingerprint from user-agent and language
function generateDeviceFingerprint(userAgent: string, language: string): string {
  const combined = `${userAgent}|${language}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAgent, language } = body;

    if (!userAgent || !language) {
      return NextResponse.json(
        { success: false, message: 'Missing userAgent or language' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Generate device fingerprint
    const deviceFingerprint = generateDeviceFingerprint(userAgent, language);

    // Check if this device has already used trial
    const hasUsedTrial = await db.hasUsedTrial(deviceFingerprint);

    if (hasUsedTrial) {
      return NextResponse.json(
        { success: false, message: 'This device has already used the trial period' },
        {
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Create trial user record
    await db.createTrialUser(deviceFingerprint);

    return NextResponse.json(
      {
        success: true,
        message: 'Trial activated',
        valid: true,
        trial: true,
        daysLeft: 30
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Create trial error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
