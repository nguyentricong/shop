import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { emailSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get orders for the email
    // Validate email
    const validatedEmail = emailSchema.parse(email);

    const orders = await db.getOrderByEmail(validatedEmail);

    if (orders.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'No orders found'
      });
    }

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        date: order.createdAt.toISOString().split('T')[0],
        product: 'AdBlock Pro - Lifetime',
        amount: `${order.amount.toString()}₫`,
        status: 'completed',
        licenseKey: order.licenseKey
      }))
    });

  } catch (error) {
    console.error('Get orders error:', error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Email không hợp lệ',
          details: error.issues.map((e) => e.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
