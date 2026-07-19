import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { reference, name, email, room, amount } = data;

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'No reference provided' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_0eb77c7952b9c4b4c6fe9090a5eac72d4675c16c';

    // Verify payment reference with Paystack
    const verifyUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const paystackRes = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!paystackRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to verify transaction with Paystack' },
        { status: 400 }
      );
    }

    const paystackData = await paystackRes.json();

    if (!paystackData || !paystackData.data || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed with Paystack!', error: paystackData },
        { status: 400 }
      );
    }

    const status = paystackData.data.status;

    // Record the verified transaction in Supabase
    const { error: dbError } = await supabase.from('transactions').insert([
      {
        name: name || '',
        email: email || '',
        room: room || '',
        amount: parseFloat(amount) || 0,
        reference: reference,
        status: status,
      },
    ]);

    if (dbError) {
      console.error('Supabase transaction insert error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database insert failed: ' + dbError.message },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and stored successfully!',
    });
  } catch (error: any) {
    console.error('API Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error: ' + error.message },
      { status: 500 }
    );
  }
}
