"use client";

import React, { useState } from "react";

interface Props {
  /** Preset donation amounts to show as quick-select buttons */
  donationOptions: number[];
  /** Labels keyed by index (e.g. { "0": "سهم الخير", "1": "سهم البركة" }) */
  donationLabels?: Record<string, string>;
  /** Whether to allow free-form custom amount input */
  allowCustomAmount?: boolean;
  /** Currency symbol */
  currency?: string;
  /** Called when user selects/enters an amount */
  onSelect: (amount: number) => void;
  /** The currently selected amount (controlled) */
  selectedAmount?: number | null;
}

export default function DonationAmountSelector({
  donationOptions,
  donationLabels,
  allowCustomAmount = true,
  currency = "ر.س",
  onSelect,
  selectedAmount,
}: Props) {
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetSelect = (amount: number) => {
    setIsCustom(false);
    setCustomAmount("");
    onSelect(amount);
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseFloat(value);
    if (parsed > 0) {
      onSelect(parsed);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: "var(--h-color)" }}>
        اختر مبلغ التبرع
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {donationOptions.map((amount, idx) => {
          const label = donationLabels?.[String(idx)];
          const isActive = selectedAmount === amount && !isCustom;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(amount)}
              className="py-3 px-4 font-bold text-sm transition-all cursor-pointer border-2 flex flex-col items-center gap-1"
              style={{
                borderRadius: "var(--radius)",
                borderColor: isActive ? "var(--p-color)" : "#e5e7eb",
                backgroundColor: isActive ? "var(--p-color)" : "transparent",
                color: isActive ? "#fff" : "var(--t-color)",
              }}
            >
              {label && (
                <span
                  className="text-[11px] font-medium"
                  style={{ opacity: isActive ? 1 : 0.6 }}
                >
                  {label}
                </span>
              )}
              <span>
                {amount} {currency}
              </span>
            </button>
          );
        })}
      </div>

      {allowCustomAmount && (
        <div className="space-y-2">
          {!isCustom ? (
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                onSelect(0);
              }}
              className="text-sm font-bold underline cursor-pointer"
              style={{ color: "var(--p-color)" }}
            >
              أو أدخل مبلغ آخر
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="أدخل المبلغ"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="flex-1 border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-(--p-color)"
                style={{ borderRadius: "var(--radius)" }}
                dir="rtl"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustom(false);
                  setCustomAmount("");
                  onSelect(0);
                }}
                className="px-4 py-2.5 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ borderRadius: "var(--radius)" }}
              >
                إلغاء
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
