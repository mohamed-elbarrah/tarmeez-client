"use client";

import React from "react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import ProductImage from "../ProductImage";
import type { CartItem } from "@/lib/store/slices/cartSlice";

interface CartItemsListProps {
  cartItems: CartItem[];
  storeSlug: string;
  onUpdateQty: (id: string | number, delta: number) => void;
  onRemove: (id: string | number) => void;
}

/**
 * Dumb widget — renders the list of cart items with qty controls and remove buttons.
 * Serializable: all props are primitives, stable function refs, or flat CartItem objects.
 */
export default function CartItemsList({
  cartItems,
  storeSlug,
  onUpdateQty,
  onRemove,
}: CartItemsListProps) {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-20 text-center rounded-3xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <ShoppingCart size={32} />
        </div>
        <h3 className="text-xl font-bold mb-4">سلتك لا تزال فارغة</h3>
        <p className="text-gray-400 text-sm mb-8">
          استكشف منتجاتنا وابدأ في ملء سلتك بأفضل العروض.
        </p>
        <Link
          href={`/store/${storeSlug}`}
          className="bg-[var(--p-color)] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-block"
        >
          ابدأ التسوق
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
          </div>

          <div className="flex items-center bg-gray-50 rounded-xl p-1 shrink-0">
            <button
              onClick={() => onUpdateQty(item.id, -1)}
              className="p-1.5 hover:bg-white rounded-lg"
              aria-label="تقليل الكمية"
            >
              <Minus size={14} />
            </button>
            <span className="px-2 font-black text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.id, 1)}
              className="p-1.5 hover:bg-white rounded-lg"
              aria-label="زيادة الكمية"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 hover:text-red-500 transition-colors"
            aria-label="حذف من السلة"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
