// /app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient, createServiceClient } from '@/utils/supabase/server'
import { sendOrderEmail, OrderEmailProps } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  // Extract total and buyer from request
  const { totalAmount, buyer, store_id, cartItems, paymentMethod } = await req.json();

  // Generate a unique reference for this request
  const requestReferenceNumber = crypto.randomUUID();

  // Build payload according to PayMaya Checkout API
  const payload: any = {
    totalAmount: {
      value: Number(totalAmount).toFixed(2),
      currency: 'PHP',
    },
    buyer: {
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      contact: {
        email: buyer.email,
      },
    },
    redirectUrl: {
      success: `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${store_id}/order-confirmed?ref=${requestReferenceNumber}`,
      failure: `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${store_id}/order-cancel?ref=${requestReferenceNumber}`,
      cancel: `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${store_id}/order-cancel?ref=${requestReferenceNumber}`,
    },
    requestReferenceNumber,
  };

  console.log('PayMaya Checkout Payload:', JSON.stringify(payload, null, 2));
  console.log('store_id:', store_id, 'paymentMethod: ', paymentMethod);
  console.log('cartItems:', cartItems);

  let payment_id = null;
  let redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${store_id}/order-confirmed?ref=${requestReferenceNumber}`;

  if (paymentMethod === 'paymaya') {
    // Prepare Basic Auth header
    const publicKey = process.env.PAYMAYA_PUBLIC_KEY!;
    const secretKey = process.env.PAYMAYA_SECRET_KEY!;
    //const basicAuth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    const credentials = `${publicKey}:${secretKey}`;
    const basicAuth = btoa(credentials);

      console.log({
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
          Accept: 'application/json',
      })

    const response = await fetch(
      'https://pg-sandbox.paymaya.com/checkout/v1/checkouts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }
    payment_id = data.paymentId;
    redirectUrl = data.redirectUrl;
  }

  // Insert order into Supabase
  const { data: orderData, error: insertError } = await supabase
    .from('order_details')
    .insert({
      store_id:         store_id,
      payment_id:       payment_id ? payment_id : requestReferenceNumber,
      total:            totalAmount,
      first_name:       buyer.firstName,
      last_name:        buyer.lastName,
      email:            buyer.email,
      reference_number: requestReferenceNumber,
      payment_method:   paymentMethod,
      cart_items:       cartItems,
      order_status:     'pending',
      payment_status:   'pending',
    }).select()

  if (insertError) {
    console.error('Failed to insert order:', insertError)
    return NextResponse.json({ error: insertError }, { status: 500 })
  }

  console.log('Order inserted successfully:', orderData);

  if (paymentMethod == "cash") {
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', store_id)
        .single()

      if (storeError || !storeData?.id) {
          console.error('Error fetching store:', storeError)
          return NextResponse.json({ error: storeError }, { status: 500 })
      }

      const orderId = orderData[0].id;

      // Send the email (don’t forget to await it)
      const emailProps: OrderEmailProps = {
        orderNumber: orderId,
        buyer: { firstName: buyer.firstName, lastName: buyer.lastName, email: buyer.email },
        items: cartItems.map((item: any) => ({
          name: `${item.product.name} ${item.sku.attribute_value? `- ${item.sku.attribute_value}` : ''}`,
          quantity: item.qty,
          price: (Number(item.sku.price) * Number(item.qty)),
        })),
        total: Number(totalAmount),
        store: storeData
      };

      console.log('emailProps.items:', emailProps.items);

      try {
        console.log('Sending confirmation email to:', buyer.email);
        await sendOrderEmail(buyer.email, emailProps);
      } catch (err) {
        console.error('Error sending confirmation email:', err);
        // you can choose to continue or return an error here
      }
  }

  return NextResponse.json({
    paymentId: payment_id,
    redirectUrl: redirectUrl,
  });
}