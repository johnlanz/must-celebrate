'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutButton } from "@/components/products/CheckoutButton";
import { useRouter } from "next/navigation";

export interface CheckoutDrawerProps {
  cart: { product: any; sku: any }[];
  store_id: string;
}

type CartItem = { product: any; sku: any; qty: number };

export function CheckoutDrawer({ cart, store_id }: CheckoutDrawerProps) {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("paymaya");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const map: Record<string, CartItem> = {};
    cart.forEach(ci => {
      const key = `${ci.product.id}-${ci.sku.id}`;
      if (!map[key]) map[key] = { product: ci.product, sku: ci.sku, qty: 0 };
      map[key].qty += 1;
    });
    setCartItems(Object.values(map));
  }, [cart]);

  const total = cartItems.reduce((sum, { sku, qty }) => sum + sku.price * qty, 0);

  console.log("Cart Items:", cartItems);

  return (
    <div className="bg-white overflow-auto pb-[104px]">
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4"
        onClick={() => router.push(`/shops/${store_id}`)}
      >
        <ChevronLeft className="text-[#67a626]" />
      </Button>

      <h2 className="text-xl font-bold text-center mt-6 text-[#67a626]">Checkout</h2>

      <div className="p-4 space-y-4">
        {cartItems.map(({ product, sku, qty }) => (
          <Card key={`${product.id}-${sku.id}`}>  
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {product.cover && (
                  <img
                    src={product.cover}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-[#67a626]">{product.name}</p>
                    <p className="text-sm text-gray-600">{sku.attribute_value}</p>
                  </div>
                  <p className="text-sm">Qty: {qty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₱{(sku.price * qty).toFixed(2)}</p>
                <p className="text-xs text-gray-500">₱{sku.price.toFixed(2)} each</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Customer Information</h3>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="paymaya" id="paymaya" />
              <label htmlFor="paymaya" className="font-normal">PayMaya</label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="cash" id="cash" />
              <label htmlFor="cash" className="font-normal">Cash</label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 pl-4 pr-20 flex justify-between items-center">
        <p className="text-lg font-bold">Total: ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <CheckoutButton
          amount={total}
          buyer={{ firstName, lastName, email }}
          store_id={store_id}
          cartItems={cartItems}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
}