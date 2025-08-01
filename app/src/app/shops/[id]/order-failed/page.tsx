import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-green-600 bg-white">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Header */}
        <p className="text-xl text-gray-600 font-bold">Order Failed</p>
        <h2 className="text-base font-semibold text-left">Reference # SMR-103</h2>

        {/* Illustration */}
        <div className="flex justify-center">
          <img
            src="/images/order-failed.png"
            alt="Order Failed Illustration"
            className="w-100 h-100 object-contain"
          />
        </div>

        {/* Status Message */}
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <h3 className="font-bold mb-1">Your order could not be completed</h3>
          <p className="text-sm text-gray-600">
            Something went wrong with your payment or connection. Please try again or contact support.
          </p>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs">SMR-103</span>
              <span className="text-xs text-green-600 font-medium">Failed</span>
            </div>
            <p className="text-sm font-medium">1x Afritada</p>
            <p className="text-sm font-medium">1x Pancit Bihon Guisado</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-white space-y-2">
          <Link href="/shops/1">
            <Button className="w-full bg-[#67a626] hover:bg-green-700 text-white rounded-full py-6">
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
