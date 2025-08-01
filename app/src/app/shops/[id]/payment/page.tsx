import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    return (
        <div className="max-w-md mx-auto p-4 bg-white min-h-screen text-[#67a626]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <img src="/images/bihon-guisado-100x100.jpg" alt="6 box" className="w-12 h-12 rounded" />
                    <div>
                        <p className="text-sm font-medium">Bihon Guisado</p>
                        <p className="text-xs">Regular Drinks</p>
                        <Button variant="link" className="text-xs p-0 h-auto text-black">Edit</Button>
                    </div>
                </div>
                <div className="text-sm">₱520.00</div>
            </div>
            {/* Subtotal */}
            <div className="text-sm flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₱520.00</span>
            </div>
            <hr className="my-2" />
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold mb-24">
                <span>Total</span>
                <span>₱520.00</span>
            </div>
            <div className="mb-4">
                <div className="flex flex-col py-6">
                    <Link href="/store">
                        <Button className="flex w-full bg-[#67a626] hover:bg-green-700 text-white rounded-2xl py-6">Confirm Payment</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}