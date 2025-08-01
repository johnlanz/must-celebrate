// src/components/OrderProgress.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

type OrderStatus = "confirmed" | "preparing" | "ready" | "complete";

interface Step {
  key: OrderStatus;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  {
    key: "confirmed",
    label: "Order confirmed",
    description: "We have received your order.",
  },
  {
    key: "preparing",
    label: "Preparing",
    description: "Kitchen is preparing your order.",
  },
  {
    key: "ready",
    label: "Ready for pick-up",
    description: "Your order is now ready for pick-up at the counter.",
  },
  {
    key: "complete",
    label: "Completed",
    description: "Enjoy your meal!",
  },
];

interface OrderProgressProps {
  status: OrderStatus;
}

export function OrderProgress({ status }: OrderProgressProps) {
  // Find which step we're on
  const currentStepIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="relative pl-6 pt-2">
      {/* vertical line */}
      <div className="absolute top-3 left-2 w-0.5 h-full bg-gray-300" />

      {STEPS.map((step, idx) => {
        const isDone = idx < currentStepIndex;
        const isActive = idx === currentStepIndex;

        return (
          <div key={step.key} className={`relative mb-8`}>
            {/* dot or check */}
            <div
              className={[
                "absolute -left-5 top-0 flex items-center justify-center rounded-full",
                isDone || isActive
                  ? "bg-[#67a626] w-5 h-5"
                  : "bg-gray-300 w-3 h-3",
              ].join(" ")}
            >
              {(isDone || isActive) && (
                <Check size={isActive ? 14 : 12} className="text-white" />
              )}
            </div>

            <h3
              className={[
                "px-2 text-sm",
                isActive
                  ? "font-bold text-black"
                  : "font-semibold text-gray-400",
              ].join(" ")}
            >
              {step.label}
            </h3>
            <p
              className={[
                "px-2 mt-1 text-sm",
                isDone || isActive ? "text-gray-600" : "text-gray-400",
              ].join(" ")}
            >
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
