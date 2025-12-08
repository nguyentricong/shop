import { NextRequest, NextResponse } from 'next/server';

// Simulate database (trong thực tế dùng PostgreSQL)
const purchases: any[] = [];

function generateLicenseKey(): string {
  const prefix = 'ADBLOCK-PRO-';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return prefix + timestamp + '-' + random;
}

async function sendEmailWithLicenseKey(email: string, name: string, licenseKey: string) {
  // TODO: Implement email sending using services like SendGrid, Resend, etc.
  // For now, just log it
  console.log(`Email sent to ${email}: License Key ${licenseKey}`);
  
  // In production, use:
  // const response = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'sales@adblocker.vn',
  //     to: email,
  //     subject: 'Your AdBlock Pro License Key',
  //     html: `<h1>Welcome, ${name}!</h1><p>Your license key: ${licenseKey}</p>`
  //   })
  // });
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, paymentMethod } = body;

    // Validation
    if (!email || !name || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate License Key
    const licenseKey = generateLicenseKey();
    
    // TODO: Process payment with Stripe/MoMo/PayPal
    // For now, assume payment is successful
    
    // Save to database
    purchases.push({
      id: Date.now(),
      email,
      name,
      paymentMethod,
      licenseKey,
      createdAt: new Date(),
      amount: 49000,
      currency: 'VND',
      status: 'completed'
    });

    // Send email
    await sendEmailWithLicenseKey(email, name, licenseKey);

    return NextResponse.json({
      success: true,
      message: 'Purchase successful',
      licenseKey,
      downloadUrl: 'https://chrome.google.com/webstore'
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
