"use client";

import React from "react";
import Link from "next/link";
import ProductImage from "@/lib/themes/store/default/components/ProductImage";

export interface WidgetProductCardProps {
  id: string | number;
  title: string;
  description?: string;
  imageUrl: string | null;
  /** Legacy combined string – prefer priceAmount + currency */
  displayPrice?: string;
  /** Numeric/formatted amount only, e.g. "199" */
  priceAmount?: string;
  /** Currency symbol/code, e.g. "ر.س" */
  currency?: string;
  discountBadge?: string;

  primaryActionText?: string;

  productUrl: string;

  onPrimaryAction: () => void;
}

export default function ProductCard({
  id,
  title,
  description,
  imageUrl,
  displayPrice,
  priceAmount,
  currency,
  discountBadge,
  primaryActionText = "اضف الى السلة",
  productUrl,
  onPrimaryAction,
}: WidgetProductCardProps) {
  // Resolve display values: prefer split props, fall back to combined displayPrice
  const resolvedAmount = priceAmount ?? displayPrice ?? "";
  const resolvedCurrency = currency ?? "";
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPrimaryAction();
  };

  return (
    <div
      className="group bg-white p-3 border border-gray-200 hover:shadow-2xl transition-all relative flex flex-col h-full"
      style={{ borderRadius: "var(--radius)" }}
    >
      <Link href={productUrl} className="flex flex-col h-full">
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
          {discountBadge && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg z-10">
              {discountBadge}
            </span>
          )}
        </div>

        <h3
          className="text-sm font-black line-clamp-2 h-10 mb-1 leading-tight group-hover:text-(--p-color) transition-colors"
          style={{ color: "var(--h-color)" }}
        >
          {title}
        </h3>

        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
            {description}
          </p>
        )}
      </Link>

      <div className="flex items-center gap-2 mt-auto pt-2">
        <button
          onClick={handleAction}
          className="bg-(--p-color) text-white text-xs font-bold cursor-pointer px-2 py-2 hover:opacity-90 transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0"
          style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
        >
          {primaryActionText}
        </button>
        {/* Price display — non-interactive, modern pill */}
        <div
          className="flex-1 min-w-0 h-full flex items-center justify-between gap-1 bg-gray-50 border border-gray-200 px-3 cursor-pointer overflow-hidden"
          style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
          aria-label={`السعر: ${resolvedAmount} ${resolvedCurrency}`}
        >
          <span className="font-black text-base text-(--p-color)  text-start flex-1">
            {resolvedAmount}
          </span>
          {resolvedCurrency && (
            <span className="text-[11px] font-semibold text-gray-400 tracking-wide shrink-0">
              {resolvedCurrency}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
