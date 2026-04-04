"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import ProductImage from "@/lib/themes/store/default/components/ProductImage";
import { WidgetProductCardProps } from "@/lib/themes/types";
import DonationProgressBar from "@/components/storefront/modules/charity/shared/DonationProgressBar";
import DonationAmountSelector from "@/components/storefront/modules/charity/shared/DonationAmountSelector";
import "./donation-card.css";

export default function CharityProductCard({
  id,
  title,
  description,
  imageUrl,
  displayPrice,
  primaryActionText = "تبرع الآن",
  primaryActionIcon,
  productUrl,
  progressBarPercent = 0,
  progressMessage,
  goalDisplay,
  collectedDisplay,
  donationPresets = [10, 50, 100],
  allowCustomAmount = true,
  badgeText,
  onPrimaryAction,
}: WidgetProductCardProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(
    donationPresets[0],
  );
  const [customValue, setCustomValue] = useState("");
  const isCustom = selectedAmount === 0;

  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount);
    if (amount !== 0) setCustomValue("");
  };

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const finalAmount = isCustom ? parseFloat(customValue) : selectedAmount;
    onPrimaryAction({ amount: finalAmount || 0 });
  };

  return (
    <div
      className="donation-card group bg-white p-3 border border-gray-200 hover:shadow-2xl transition-all relative flex flex-col h-full"
      style={{ borderRadius: "var(--radius)" }}
    >
      <Link href={productUrl} className="flex flex-col flex-1">
        {/* Image — same as default */}
        <div
          className="aspect-square mb-4 overflow-hidden relative bg-gray-50 p-6"
          style={{ borderRadius: "calc(var(--radius) * 0.75)" }}
        >
          <ProductImage
            src={imageUrl}
            alt={title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-700"
          />
          {badgeText && (
            <span className="absolute top-3 right-3 bg-(--p-color) text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg z-10">
              {badgeText}
            </span>
          )}
        </div>

        {/* Title — same as default */}
        <h3
          className="text-sm font-black line-clamp-2 h-10 mb-1 leading-tight group-hover:text-(--p-color) transition-colors"
          style={{ color: "var(--h-color)" }}
        >
          {title}
        </h3>

        {/* ── Progress Bar (charity addition) ── */}
        <DonationProgressBar
          progressBarPercent={progressBarPercent}
          progressMessage={progressMessage}
          goalDisplay={goalDisplay}
          collectedDisplay={collectedDisplay}
        />

        {/* Description — same as default */}
        {/* {description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
            {description}
          </p>
        )} */}
      </Link>

      {/* ── Waqf Options (charity addition) ── */}
      <DonationAmountSelector
        donationPresets={donationPresets}
        allowCustomAmount={allowCustomAmount}
        selectedAmount={selectedAmount}
        onAmountChange={handleAmountChange}
      />

      {/* CTA row — same layout as default: button + price pill */}
      <div className="flex items-center gap-2 mt-auto pt-2">
        <button
          onClick={handleAction}
          className="donation-card__cta bg-(--p-color) text-white text-xs font-bold cursor-pointer px-4 py-2 hover:opacity-90 transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2"
          style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
        >
          {primaryActionText}
        </button>

        {/* Price pill — shows selected amount, or input when custom */}
        {isCustom ? (
          <div
            className="flex-1 min-w-0 h-full flex items-center justify-between gap-1 bg-gray-50 border border-gray-200 px-3 overflow-hidden"
            style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
          >
            <input
              type="number"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="المبلغ..."
              className="flex-1 min-w-0  bg-transparent outline-none text-base font-black text-(--p-color)"
              min={1}
            />
            <span className="text-[11px] font-semibold text-gray-400 tracking-wide shrink-0">
              ر.س
            </span>
          </div>
        ) : (
          <div
            className="flex-1 min-w-0 h-full flex items-center justify-between gap-1 bg-gray-50 border border-gray-200 px-3 cursor-pointer overflow-hidden"
            style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
            aria-label={`المبلغ: ${selectedAmount} ر.س`}
          >
            <span className="font-black text-base text-(--p-color) text-start flex-1">
              {selectedAmount}
            </span>
            <span className="text-[11px] font-semibold text-gray-400 tracking-wide shrink-0">
              ر.س
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
