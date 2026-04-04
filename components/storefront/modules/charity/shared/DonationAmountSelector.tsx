"use client";

import React from "react";

interface DonationAmountSelectorProps {
  donationPresets: number[];
  allowCustomAmount?: boolean;
  /** Currently selected amount. Pass 0 to indicate custom mode is active. */
  selectedAmount: number;
  /** Called with preset amount on selection, or 0 when custom mode toggled. */
  onAmountChange: (amount: number) => void;
}

export default function DonationAmountSelector({
  donationPresets,
  allowCustomAmount = true,
  selectedAmount,
  onAmountChange,
}: DonationAmountSelectorProps) {
  const isCustom = selectedAmount === 0;
  const presetsToShow = donationPresets.slice(0, allowCustomAmount ? 3 : 4);

  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      {presetsToShow.map((amt) => {
        const isActive = !isCustom && selectedAmount === amt;
        return (
          <button
            key={amt}
            onClick={() => onAmountChange(amt)}
            className={`waqf-option py-1 text-xs font-black transition-all border-2 flex flex-col items-center gap-0.5 ${
              isActive
                ? "bg-(--p-color) text-white border-(--p-color) shadow-md scale-[1.02]"
                : "bg-white text-gray-500 border-gray-300 hover:border-(--p-color)/20 hover:bg-(--p-color)/5"
            }`}
            style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
          >
            <span>{amt} ر.س</span>
          </button>
        );
      })}

      {allowCustomAmount ? (
        <button
          onClick={() => onAmountChange(0)}
          className={`waqf-option py-1 text-xs font-black transition-all border-2 ${
            isCustom
              ? "bg-(--p-color) text-white border-(--p-color) shadow-md "
              : "bg-white text-gray-500 border-gray-300 hover:border-(--p-color)/20 hover:bg-(--p-color)/5"
          }`}
          style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
        >
          مبلغ مخصص
        </button>
      ) : (
        donationPresets[3] && (
          <button
            onClick={() => onAmountChange(donationPresets[3])}
            className={`waqf-option py-3 text-xs font-black transition-all border-2 ${
              !isCustom && selectedAmount === donationPresets[3]
                ? "bg-(--p-color) text-white border-(--p-color) shadow-md "
                : "bg-white text-gray-500 border-gray-100 hover:border-(--p-color)/20 hover:bg-(--p-color)/5"
            }`}
            style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
          >
            {donationPresets[3]} ر.س
          </button>
        )
      )}
    </div>
  );
}
