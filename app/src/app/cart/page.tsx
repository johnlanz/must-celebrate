import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { X, Share2 } from "lucide-react";
import Link from "next/link";

export default function AddToBasketPage() {
    return (
        <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col text-[#67a626]">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {/* Header Image and Info */}
                <div className="relative">
                    <img
                        src="/images/afritada-100x100.png"
                        alt="Box of 6"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-white rounded-full p-2">
                        <X className="w-6 h-6 text-[#67a626]" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white rounded-full p-2">
                        <Share2 className="w-6 h-6 text-[#67a626]" />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold">Afritada</h2>
                        <span className="text-sm">₱285.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold">Bihon Guisado</h2>
                        <span className="text-sm">₱285.00</span>
                    </div>
                </div>

                {/* Add-on Section */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">Choose A:</p>
                        <span className="text-xs bg-gray-100 rounded px-2 py-2">Optional, max 1</span>
                    </div>
                    {["Regular Drinks", "Medium Drinks", "Large Drinks"].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 py-2">
                            <Checkbox id={`a-${idx}`} />
                            <label htmlFor={`a-${idx}`} className="text-sm flex-1">{item}</label>
                            <span className="text-sm font-medium">+₱{idx === 1 ? 55 : 35}.00</span>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">Choose B:</p>
                        <span className="text-xs bg-gray-100 rounded px-2 py-2">Optional, max 1</span>
                    </div>
                    {["Otap", "Pandesal", "Bihon Guisado"].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 py-2">
                            <Checkbox id={`b-${idx}`} />
                            <label htmlFor={`b-${idx}`} className="text-sm flex-1">{item}</label>
                            <span className="text-sm font-medium">+₱{idx === 1 ? 55 : 35}.00</span>
                        </div>
                    ))}
                </div>

                {/* Add more items */}
                <div className="pt-4">
                    <Link href="/store">
                        <Button className="w-full bg-[#67a626] hover:bg-green-700 text-white rounded-full py-6">
                            Add more items
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md">
                <Link href="/checkout">
                    <Button className="w-full bg-[#67a626] hover:bg-green-700 text-white rounded-full py-6">
                        Add to Basket - ₱285.00
                    </Button>
                </Link>
            </div>
        </div>
    );
}

