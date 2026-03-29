"use client";

import React from "react";
import { getDonationProgress } from "@/lib/helpers/donation";

interface Props {
  targetAmount: number;
  currentAmount: number;
  /** Raw progressMessages map — the component picks the right message */
  progressMessages?: Record<string, string> | null;
  /** Currency symbol */
  currency?: string;
}

export default function DonationProgressBar({
  targetAmount,
  currentAmount,
  progressMessages,
  currency = "ر.س",
}: Props) {
  const { percentage, message } = getDonationProgress(
    currentAmount,
    targetAmount,
    progressMessages,
  );

  const formattedCurrent = currentAmount.toLocaleString("ar-SA");
  const formattedTarget = targetAmount.toLocaleString("ar-SA");

  return (
    <div className="space-y-3">
      {/* Collected / Target line */}
      <div className="text-sm font-black text-center">
        <span style={{ color: "var(--p-color)" }}>{formattedCurrent}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-600">{formattedTarget}</span>
        <span className="text-gray-400 mr-1">{currency}</span>
      </div>

      {/* Progress bar with message inside */}
      <div
        className="w-full h-7 bg-gray-200 overflow-hidden relative"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: "var(--p-color)",
            borderRadius: "var(--radius)",
          }}
        />
        {/* Message rendered inside the bar container */}
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white drop-shadow-sm">
          {message || `${percentage}%`}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">{percentage}% تم جمعه</span>
      </div>
    </div>
  );
}
