import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/payment/stripe';
import { db } from '@/lib/db';
import { sendLicenseEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const result = await verifyStripeWebhook(body, signature);
    
    if (!result.success || !result.event) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = result.event;

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderId = session.client_reference_id;

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

      console.log(`✅ Stripe payment success: ${orderId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
