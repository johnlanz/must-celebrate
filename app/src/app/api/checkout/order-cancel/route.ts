// /app/api/order-status/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServiceClient } from '@/utils/supabase/server';

export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const { requestReferenceNumber } = await req.json();

  if (!requestReferenceNumber) {
    return NextResponse.json(
      { error: 'Both requestReferenceNumber and orderStatus are required' },
      { status: 400 }
    );
  }

  const { data: orderData, error: orderFetchError } = await supabase
    .from('order_details')
    .select('*')
    .eq('reference_number', requestReferenceNumber)
    .single()

  if (!orderData || orderData.length === 0) {
    return NextResponse.json(
      { message: 'No order found with that reference number' },
      { status: 404 }
    );
  }

  console.log('orderData:', orderData);
  if (orderData.order_status == "pending") {
    const { data, error } = await supabase
      .from('order_details')
      .update({ order_status: 'cancelled' })
      .eq('reference_number', requestReferenceNumber)
      .select();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ orderData }, { status: 200 });
}