import { NextRequest, NextResponse } from 'next/server';
import { verifyVNPaySignature } from '@/lib/payment/vnpay';
import { db } from '@/lib/db';
import { sendLicenseEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vnpParams: any = {};
    
    searchParams.forEach((value, key) => {
      vnpParams[key] = value;
    });

    // Verify signature
    if (!verifyVNPaySignature(vnpParams)) {
      console.error('Invalid VNPay signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const orderId = vnpParams['vnp_TxnRef'];
    const responseCode = vnpParams['vnp_ResponseCode'];

    // ResponseCode = '00' means success
    if (responseCode === '00') {
      const order = db.getOrder(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Activate license
      db.activateLicense(order.licenseKey);

      // Send email
      await sendLicenseEmail({
        to: order.email,
        name: order.name,
        licenseKey: order.licenseKey,
        downloadUrl: 'https://chrome.google.com/webstore/detail/adblock-pro'
      });

      console.log(`✅ VNPay payment success: ${orderId}`);
    } else {
      console.log(`❌ VNPay payment failed: ${orderId}, ResponseCode: ${responseCode}`);
    }

    return NextResponse.json({ RspCode: '00', Message: 'success' });
  } catch (error) {
    console.error('VNPay webhook error:', error);
    return NextResponse.json({ RspCode: '99', Message: 'error' }, { status: 500 });
  }
}
