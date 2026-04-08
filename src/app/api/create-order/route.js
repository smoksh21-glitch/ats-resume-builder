import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
    });
    const body = await request.json();
    const { userId, email } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Detect if user is international based on email domain or explicit flag
    const isInternational = body.international || false;

    const amount = isInternational ? 150 : 12000; // 150 cents = $1.50 USD or 12000 paise = ₹120 INR
    const currency = isInternational ? 'USD' : 'INR';

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `resume_${userId}_${Date.now()}`,
      notes: {
        userId,
        email: email || '',
        product: '2_resume_edits',
        description: '2 AI-Powered Resume Edits',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
