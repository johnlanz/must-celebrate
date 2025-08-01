'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { FullScreenLoader } from "@/components/layout/FullScreenLoader";
import { formatDate, formatDateString } from "@/utils/formatDate";
import { OrderProgress } from "@/components/products/OrderProgress";

export default function TrackMyOrderPage() {
  const { id, orderid } = useParams<{ id: string, orderid: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/checkout/order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderid: orderid
      }),
    })
      .then(async (res) => {
        setLoading(false);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch order");
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
  }, [orderid]);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-[#222] bg-white">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-700">Track my order</h1>

        {/* Status Box */}
        <div className="bg-[#67a626] text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Status</p>
              <h2 className="text-lg font-bold">Order {order && order.order_status}</h2>
            </div>
            <div className="text-right text-xs">
              <p>
                Order #<span className="font-semibold">{order && order.id}</span>
              </p>
              <p>Updated {order && formatDateString(order.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-green-600">💵</span>
          <p className="text-sm font-medium">Paid via {order && order.payment_method}</p>
        </div>

        {/* Order Progress */}
        {order && <OrderProgress status={order.order_status} />}
      </div>

      {/* Back to store */}
      <div className="p-4 border-t">
        <Link href={`/shops/${id}`}>
          <Button className="w-full bg-[#67a626] hover:bg-green-700 text-white rounded-full py-6">
            Back to Store
          </Button>
        </Link>
      </div>
    </div>
  );
}
