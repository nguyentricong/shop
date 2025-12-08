import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover' as any,
    })
  : null;

interface StripePaymentParams {
  orderId: string;
  amount: number;
  email: string;
  name: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckout(params: StripePaymentParams) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AdBlock Pro - Lifetime License',
              description: 'Block 100% YouTube & Facebook Ads Forever',
              images: ['https://yourdomain.com/product-image.jpg'],
            },
            unit_amount: Math.round(params.amount / 23000 * 100), // VND to USD conversion
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.email,
      client_reference_id: params.orderId,
      metadata: {
        orderId: params.orderId,
        name: params.name,
      },
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function verifyStripeWebhook(payload: string, signature: string) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook not configured');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    return { success: true, event };
  } catch (error: any) {
    console.error('Webhook verification failed:', error);
    return { success: false, error: error.message };
  }
}
