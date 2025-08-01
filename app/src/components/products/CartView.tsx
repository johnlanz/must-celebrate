'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation'

interface CartItem {
  product: any;
  sku: any;
}

interface CartViewProps {
  storeId: string;
  cart: CartItem[];
  onUpdateItem: (product: any, sku: any, newQty: number) => void;
}

export function CartView({ storeId, cart, onUpdateItem }: CartViewProps) {
  const router = useRouter()
  // Group cart items by product+sku to get quantities
  const itemsMap = cart.reduce<Record<string, { product: any; sku: any; qty: number }>>((acc, item) => {
    const key = `${item.product.id}-${item.sku.id}`;
    if (!acc[key]) acc[key] = { product: item.product, sku: item.sku, qty: 0 };
    acc[key].qty += 1;
    return acc;
  }, {});

  const items = Object.values(itemsMap);
  const totalPrice = items.reduce((sum, { sku, qty }) => sum + sku.price * qty, 0);

  return (
    <div className="bg-white overflow-auto pb-[125px]">
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4"
        onClick={() => router.push(`/shops/${storeId}`)}
      >
        <ChevronLeft className="text-[#67a626]" />
      </Button>

      <h2 className="text-xl font-bold text-center mt-6 text-[#67a626]">Your Cart</h2>

      <div className="p-4 space-y-4">
        {items.map(({ product, sku, qty }) => (
          <Card key={`${product.id}-${sku.id}`}>  
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {product.cover && (
                  <img
                    src={product.cover}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-[#67a626]">
                    {product.name}
                    <span className="px-2 text-xs text-gray-600">
                        {sku.attribute_value}
                    </span>
                </p>
                  <p className="font-semibold text-[#67a626]">₱{sku.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={qty <= 0}
                  onClick={() => onUpdateItem(product, sku, qty - 1)}
                >
                  -
                </Button>
                <span>{qty}</span>
                <Button
                  size="sm"
                  className="bg-[#67a626] text-white rounded-full"
                  onClick={() => onUpdateItem(product, sku, qty + 1)}
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">₱
                {totalPrice.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </span>
        </div>
        <Button 
          disabled={totalPrice <= 0}
          className="w-full bg-[#67a626] text-white rounded-2xl py-6" 
          onClick={() => router.push(`/shops/${storeId}/checkout`)}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}