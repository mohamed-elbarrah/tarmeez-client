"use client";

import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProductImage from "@/lib/themes/store/default/components/ProductImage";

export interface WidgetProductCardProps {
  id: string | number;
  title: string;
  imageUrl: string | null;
  displayPrice?: string;
  discountBadge?: string;

  primaryActionText: string;
  primaryActionIcon?: React.ReactNode;

  productUrl: string;

  onPrimaryAction: () => void;
}

export default function ProductCard({
  id,
  title,
  imageUrl,
  displayPrice,
  discountBadge,
  primaryActionText,
  primaryActionIcon,
  productUrl,
  onPrimaryAction,
}: WidgetProductCardProps) {

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPrimaryAction();
  };

  return (
    <div
      className="group bg-white p-2 border border-gray-200 hover:shadow-2xl transition-all relative flex flex-col h-full"
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
          className="text-sm font-black line-clamp-2 h-10 mb-2 leading-tight group-hover:text-[var(--p-color)] transition-colors"
          style={{ color: "var(--h-color)" }}
        >
          {title}
        </h3>
      </Link>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="font-black text-lg text-[var(--p-color)]">
            {displayPrice}
          </span>
        </div>
        <button
          onClick={handleAction}
          className="bg-gray-100 p-2.5 text-gray-600 hover:bg-[var(--p-color)] hover:text-white hover:rotate-90 transition-all duration-300 active:scale-90"
          style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
        >
          {primaryActionIcon || <Plus size={18} />}
        </button>
      </div>
    </div>
  );
}
