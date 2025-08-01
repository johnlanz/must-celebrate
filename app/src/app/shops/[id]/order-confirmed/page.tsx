'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FullScreenLoader } from "@/components/layout/FullScreenLoader";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    if (!ref) return;

    setLoading(true);
    fetch("/api/checkout/order-confirm", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestReferenceNumber: ref
      }),
    })
      .then(async (res) => {
        setLoading(false);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to update order status");
        }
        return res.json();
      })
      .then((data) => {
        setOrder(data.orderData);
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify([]));
        }
        console.log("Order status updated:", data);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
      });
  }, [ref]);

  if (loading) return <FullScreenLoader />;
    
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-[#67a626] bg-white">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <p className="text-xl text-gray-600 font-bold">Order Confirmation</p>
        <h2 className="text-base font-semibold text-left">Order #{order && order.id}</h2>

        {/* Illustration */}
        <div className="flex justify-center">
          <img
            src="/images/order-confirmed.png"
            alt="Kitchen"
            className="h-50 object-contain"
          />
        </div>

        {/* Status Message */}
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <h3 className="font-bold mb-1">Shamrock has received your order</h3>
          <p className="text-sm text-gray-600">Please go to the cashier to confirm your order.</p>
        </div>

        {/* Payment Note */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-4 text-sm">
          <span className="text-green-600">💵</span>
          {order && order.payment_method === "cash" ? (
            <p className="text-sm font-medium">Your order is Pending via Cash Payment</p>
          ) : (
            <p className="text-sm font-medium">Your order is Paid via {order && order.payment_method}</p>
          )}
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {order && order.cart_items.map(({ product, sku, qty }) => (
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
          <p className="text-lg font-bold text-right">Total: ₱{order && order.total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

         
        </div>

        <div className=" pb-12 bg-white py-4 hadow-md space-y-2"></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center w-full">
        {order && (
          <Link href={`/shops/${id}/track-order/${order.id}`} className="w-full">
            <Button className="w-full bg-[#67a626] hover:bg-green-700 text-white rounded-full py-6">
                Track my Order
            </Button>
          </Link>
        )}
        
      </div>

    </div>
  );
}
