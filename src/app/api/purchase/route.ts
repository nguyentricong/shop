import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { purchaseSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendLicenseEmail } from '@/lib/email';
import { createMoMoPayment } from '@/lib/payment/momo';
import { createVNPayPaymentUrl } from '@/lib/payment/vnpay';
import { createStripeCheckout } from '@/lib/payment/stripe';
import { ZodError } from 'zod';

function generateLicenseKey(): string {
  const prefix = 'ADBLOCK-PRO-';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return prefix + timestamp + '-' + random;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         request.headers.get('cf-connecting-ip') ||
         '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting - Chống spam/abuse
    const rateLimitResult = await checkRateLimit(request, 'purchase');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // 2. Parse và validate input
    const body = await request.json();
    const validatedData = purchaseSchema.parse(body);
    const { email, name, paymentMethod } = validatedData;

    // 3. Generate License Key
    const licenseKey = generateLicenseKey();
    const orderId = `ORD-${Date.now()}`;
    const amount = 49000; // VND
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 4. Tạo order trong database với status pending
    const order = await db.createOrder({
      email,
      name,
      paymentMethod,
      licenseKey,
      amount,
      currency: 'VND',
      status: 'pending' // Sẽ update sau khi payment thành công
    });

    // 5. Tạo license (inactive - sẽ active sau khi payment)
    await db.createLicense({
      key: licenseKey,
      email,
      orderId: order.id,
      plan: 'lifetime',
      active: false
    });

    // 6. Xử lý thanh toán theo phương thức
    let paymentResult: any = { success: true };

    switch (paymentMethod) {
      case 'momo':
        paymentResult = await createMoMoPayment({
          orderId: order.id,
          amount,
          orderInfo: `Mua AdBlock Pro - ${name}`,
          returnUrl: `${baseUrl}/payment/callback?gateway=momo`,
          notifyUrl: `${baseUrl}/api/payment/momo/webhook`,
          email,
          name
        });

        if (paymentResult.payUrl) {
          return NextResponse.json({
            success: true,
            paymentRequired: true,
            paymentUrl: paymentResult.payUrl,
            qrCodeUrl: paymentResult.qrCodeUrl,
            orderId: order.id,
            message: 'Vui lòng thanh toán để nhận License Key'
          });
        }
        break;

      case 'vnpay':
        const clientIp = getClientIp(request);
        const vnpayUrl = createVNPayPaymentUrl({
          orderId: order.id,
          amount,
          orderInfo: `Mua AdBlock Pro - ${name}`,
          returnUrl: `${baseUrl}/payment/callback?gateway=vnpay`,
          ipAddr: clientIp
        });

        return NextResponse.json({
          success: true,
          paymentRequired: true,
          paymentUrl: vnpayUrl,
          orderId: order.id,
          message: 'Vui lòng thanh toán để nhận License Key'
        });

      case 'stripe':
        const stripeResult = await createStripeCheckout({
          orderId: order.id,
          amount,
          email,
          name,
          successUrl: `${baseUrl}/payment/success?orderId=${order.id}`,
          cancelUrl: `${baseUrl}/buy?error=payment_cancelled`
        });

        if (stripeResult.success && stripeResult.url) {
          return NextResponse.json({
            success: true,
            paymentRequired: true,
            paymentUrl: stripeResult.url,
            orderId: order.id,
            message: 'Redirecting to Stripe...'
          });
        }
        break;

      case 'bank':
        // Chuyển khoản ngân hàng - trả về thông tin tài khoản
        return NextResponse.json({
          success: true,
          paymentRequired: true,
          paymentMethod: 'bank',
          orderId: order.id,
          bankInfo: {
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountName: 'CONG TY ADBLOCK PRO',
            amount: amount,
            content: `ADBLOCK ${order.id} ${email}`
          },
          message: 'Vui lòng chuyển khoản theo thông tin trên. License Key sẽ được gửi sau khi xác nhận thanh toán (trong 5 phút).'
        });

      default:
        // Fallback: Thanh toán test mode (development only)
        if (process.env.NODE_ENV === 'development') {
          // Auto-complete payment in dev mode
          await completePayment(order.id, licenseKey, email, name);
          
          return NextResponse.json({
            success: true,
            licenseKey,
            orderId: order.id,
            message: 'TEST MODE: Payment completed automatically',
            downloadUrl: 'https://chrome.google.com/webstore'
          });
        }
    }

    // Nếu payment gateway không khả dụng
    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.message || 'Lỗi cổng thanh toán' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Purchase error:', error);

    // Xử lý validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Dữ liệu không hợp lệ',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

// Helper function để hoàn tất thanh toán
async function completePayment(orderId: string, licenseKey: string, email: string, name: string) {
  // Update order status
  const order = await db.getOrder(orderId);
  if (!order) return;

  // Activate license
  await db.activateLicense(licenseKey);

  // Send email với license key
  await sendLicenseEmail({
    to: email,
    name,
    licenseKey,
    downloadUrl: 'https://chrome.google.com/webstore/detail/adblock-pro'
  });

  console.log(`✅ Payment completed for order ${orderId}`);
}
