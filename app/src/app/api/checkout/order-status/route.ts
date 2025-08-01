// /app/api/order-status/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServiceClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const { orderid } = await req.json();

  if (!orderid) {
    return NextResponse.json(
      { error: 'order id is required' },
      { status: 400 }
    );
  }

  const { data: orderData, error: orderFetchError } = await supabase
    .from('order_details')
    .select('*')
    .eq('id', orderid)
    .single()

  if (!orderData || orderData.length === 0) {
    return NextResponse.json(
      { message: 'No order found' },
      { status: 404 }
    );
  }

  console.log('orderData:', orderData);

  return NextResponse.json({ orderData }, { status: 200 });
}