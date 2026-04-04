"use client";

import React from "react";
import Link from "next/link";
import { ThemeTokens } from "@/lib/themes/types";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
}

interface Props {
  theme: ThemeTokens;
  cart: CartItem[];
  storeSlug: string;
}

/**
 * Charity cart summary — no shipping fees row, no payment logos, Islamic branding.
 * All amounts use en-US locale for Western Arabic numerals.
 */
export default function CharityCartSummary({ cart, storeSlug }: Props) {
  const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 0), 0);

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6 sticky top-28">
      <h3 className="text-xl font-black border-b pb-4">سلة الخير</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-400 text-sm font-bold">
          <span>إجمالي المساهمات</span>
          <span className="text-gray-900">
            {subtotal.toLocaleString("en-US")} ر.س
          </span>
        </div>
        <div className="flex justify-between text-2xl font-black pt-4 border-t border-dashed">
          <span>الإجمالي</span>
          <span className="text-[var(--p-color)]">
            {subtotal.toLocaleString("en-US")} ر.س
          </span>
        </div>
      </div>
      <Link
        href={cart.length === 0 ? "#" : `/store/${storeSlug}/checkout`}
        className={`w-full bg-[var(--p-color)] text-white py-4 font-black text-lg text-center block ${
          cart.length === 0
            ? "opacity-30 pointer-events-none"
            : "hover:shadow-xl"
        } transition-all`}
        style={{ borderRadius: "var(--radius)" }}
      >
        إتمام التبرع
      </Link>
    </div>
  );
}
