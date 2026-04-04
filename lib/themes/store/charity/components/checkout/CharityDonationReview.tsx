"use client";

import React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { useCharityCheckoutContext } from "./CharityCheckoutContext";

/**
 * Charity donation review — no coupons, no shipping fees, pure totals.
 */
export default function CharityDonationReview() {
  const { storeSlug, subtotal, total, isLoading } = useCharityCheckoutContext();

  const cartItems = useAppSelector((s) => s.cart.carts[storeSlug]?.items ?? []);

  return (
    <div className="bg-white p-8 border rounded-lg sticky top-6">
      <h3 className="text-lg font-black mb-6 text-center">ملخص التبرع</h3>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div
            key={`${item.id}-${item.variantId ?? ""}`}
            className="flex gap-2 items-center"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border">
              <img
                src={item.image || "/placeholder-product.png"}
                className="w-full h-full object-contain"
                alt={item.name}
              />
            </div>
            <div className="flex-grow">
              <div className="text-xs font-black line-clamp-1">{item.name}</div>
              <div className="text-[10px] text-slate-400">
                {item.price.toLocaleString("en-US")} ر.س
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals — no coupon, no shipping */}
      <div className="space-y-3 border-t pt-4 mb-6">
        <div className="flex justify-between text-sm font-bold text-slate-400">
          <span>إجمالي المساهمات</span>
          <span>{subtotal.toLocaleString("en-US")} ر.س</span>
        </div>
        <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-dashed">
          <span>الإجمالي</span>
          <span className="text-[var(--p-color)]">
            {total.toLocaleString("en-US")} ر.س
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        disabled={isLoading}
        type="submit"
        className="w-full py-4 text-white font-black rounded-xl bg-[var(--p-color)] hover:shadow-lg transition-all disabled:opacity-50"
      >
        {isLoading ? "جاري المعالجة..." : "تأكيد التبرع 💚"}
      </button>
    </div>
  );
}
