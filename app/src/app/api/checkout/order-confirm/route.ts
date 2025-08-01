// /app/api/order-status/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServiceClient } from '@/utils/supabase/server';
import { sendOrderEmail, OrderEmailProps } from '@/lib/mailer';

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
  if (orderData.order_status == "pending" && orderData.payment_method == "paymaya") {
    const { data, error } = await supabase
      .from('order_details')
      .update({ order_status: 'confirmed', 'payment_status': 'paid' })
      .eq('reference_number', requestReferenceNumber)
      .select();

    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', orderData.store_id)
      .single()

    // Send the email (don’t forget to await it)
    const emailProps: OrderEmailProps = {
      orderNumber: orderData.id,
      buyer: { firstName: orderData.first_name, lastName: orderData.last_name, email: orderData.email },
      items: orderData.cart_items.map((item: any) => ({
        name: `${item.product.name} ${item.sku.attribute_value? `- ${item.sku.attribute_value}` : ''}`,
        quantity: item.qty,
        price: (Number(item.sku.price) * Number(item.qty)),
      })),
      total: Number(orderData.total),
      store: storeData
    };

    console.log('emailProps.items:', emailProps.items);

    try {
      console.log('Sending confirmation email to:', orderData.email);
      await sendOrderEmail(orderData.email, emailProps);
    } catch (err) {
      console.error('Error sending confirmation email:', err);
      // you can choose to continue or return an error here
    }

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ orderData }, { status: 200 });
}