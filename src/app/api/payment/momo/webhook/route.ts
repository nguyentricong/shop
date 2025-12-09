import { NextRequest, NextResponse } from 'next/server';
import { verifyMoMoSignature } from '@/lib/payment/momo';
import { db } from '@/lib/db';
import { sendLicenseEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify MoMo signature
    if (!verifyMoMoSignature(body)) {
      console.error('Invalid MoMo signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { orderId, resultCode, transId } = body;

    // resultCode = 0 means success
    if (resultCode === 0) {
      const order = await db.getOrder(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Activate license
      await db.activateLicense(order.licenseKey);

      // Send email with license key and download links
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ablockyoutube.vercel.app';
      await sendLicenseEmail({
        to: order.email,
        name: order.name,
        licenseKey: order.licenseKey,
        baseUrl,
        downloadUrl: `${baseUrl}/api/download/extension`
      });

      console.log(`✅ MoMo payment success: ${orderId}, TransID: ${transId}`);
    } else {
      console.log(`❌ MoMo payment failed: ${orderId}, ResultCode: ${resultCode}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MoMo webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
