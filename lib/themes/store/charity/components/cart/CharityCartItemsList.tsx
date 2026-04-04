"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { CartItem } from "@/lib/store/slices/cartSlice";
import ProductImage from "@/lib/themes/store/default/components/ProductImage";
import { Trash2 } from "lucide-react";

interface CharityCartItemsListProps {
  cartItems: CartItem[];
  storeSlug: string;
  onRemove: (id: string | number) => void;
}

/**
 * Charity cart items list — no quantity selectors (donations are amount-based).
 * Displays each donation project with its amount and a remove button.
 */
export default function CharityCartItemsList({
  cartItems,
  storeSlug,
  onRemove,
}: CharityCartItemsListProps) {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-20 text-center rounded-3xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <ShoppingCart size={32} />
        </div>
        <h3 className="text-xl font-bold mb-4">لم تقم بأي مساهمة بعد</h3>
        <p className="text-gray-400 text-sm mb-8">
          انضم إلينا في دعم المشاريع الخيرية واترك أثراً طيباً.
        </p>
        <Link
          href={`/store/${storeSlug}`}
          className="bg-[var(--p-color)] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-block"
        >
          استعرض المشاريع
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div
          key={`${item.id}-${item.variantId ?? ""}`}
          className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-6 items-center shadow-sm"
        >
          <div className="w-20 h-20 relative shrink-0 rounded-xl overflow-hidden bg-gray-50 border">
            <ProductImage
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-2"
              sizes="80px"
            />
          </div>

          <div className="flex-grow">
            <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
            <p className="text-[var(--p-color)] font-black mt-1">
              {item.price.toLocaleString("en-US")} ر.س
            </p>
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full inline-block mt-1">
              تبرع
            </span>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
            aria-label="حذف من السلة"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
