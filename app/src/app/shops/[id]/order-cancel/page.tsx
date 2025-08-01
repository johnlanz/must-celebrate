"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderCancelledPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!ref) return;

    setLoading(true);
    fetch("/api/checkout/order-cancel", {
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
        console.log("Order status updated:", data);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
      });
  }, [ref]);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-green-600 bg-white">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Header */}
        <p className="text-xl text-gray-600 font-bold">Order Cancelled</p>
        <h2 className="text-base font-semibold text-left">
          Order #{order && order.id}
        </h2>

        {/* Show loading or error status */}
        {loading && <p className="text-sm text-gray-500">Updating...</p>}
        {error && (
          <p className="text-sm text-red-500">
            There was a problem updating your order: {error}
          </p>
        )}

        {/* Illustration */}
        <div className="flex justify-center">
          <img
            src="/images/order-cancelled.png"
            alt="Order Cancelled Illustration"
            className="w-100 object-contain"
          />
        </div>

        {/* Status Message */}
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <h3 className="font-bold mb-1">Your order has been cancelled</h3>
          <p className="text-sm text-gray-600">
            We're sorry for the inconvenience. If you have any questions,
            please contact our support team.
          </p>
        </div>

        {/* Order Summary */}
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
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white space-y-2">
        <Link href={`/shops/${id}`}>
          <Button className="w-full bg-[#67a626] hover:bg-green-700 text-white rounded-full py-6">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}