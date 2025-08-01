import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  amount: number;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  store_id: string;
  cartItems: any
  paymentMethod: string;
}

export function CheckoutButton({ amount, buyer, store_id, cartItems, paymentMethod }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: amount, buyer, store_id, cartItems, paymentMethod }),
      });
      const { redirectUrl, error } = await res.json();
      if (redirectUrl) {
        window.location.assign(redirectUrl);
      } else {
        console.error('Checkout error:', error || 'No redirect URL returned');
      }
    } catch (err) {
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading || !buyer.email || amount <= 0} className="bg-[#67a626] text-white py-3">
      {loading
        ? 'Processing...'
        : `${paymentMethod == 'paymaya'? 'Pay with Maya' : "Place Order"} ₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
    </Button>
  );
}