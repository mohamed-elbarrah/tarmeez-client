"use client";

import React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { useCheckoutContext } from "./CheckoutContext";

/**
 * Order review / summary panel — cart items, coupon input, totals, submit button.
 * Logic-free: reads all state from CheckoutContext.
 */
export default function OrderReview() {
  const {
    storeSlug,
    subtotal,
    total,
    isLoading,
    isValidating,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCheckoutContext();

  const cartItems = useAppSelector((s) => s.cart.carts[storeSlug]?.items ?? []);

  const discount = appliedCoupon?.discount ?? 0;

  return (
    <div className="bg-white p-8 border rounded-lg sticky top-6">
      <h3 className="text-lg font-black mb-6 text-center">ملخص الطلب</h3>

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
                الكمية: {item.quantity}
              </div>
            </div>
            <div className="text-xs font-black whitespace-nowrap">
              {item.price.toLocaleString("en-US")} ر.س
            </div>
          </div>
        ))}
      </div>

      {/* Coupon + Totals */}
      <div className="space-y-3 border-t pt-4 mb-6">
        {/* Coupon */}
        <div className="space-y-2 pb-3 border-b border-dashed">
          <label className="text-xs font-bold text-slate-500">
            كوبون الخصم
          </label>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
              }}
              placeholder="أدخل كود الخصم"
              disabled={!!appliedCoupon}
              className="flex-1 p-2.5 bg-slate-50 border rounded-lg text-sm font-mono uppercase"
              dir="ltr"
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="px-2 py-2 text-sm font-bold border rounded-lg hover:bg-slate-50 transition-colors"
              >
                إزالة
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || isValidating}
                className="px-2 py-2 text-sm font-bold text-white rounded-lg bg-[var(--p-color)] hover:shadow-md transition-all disabled:opacity-50"
              >
                {isValidating ? "..." : "تطبيق"}
              </button>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-xs font-bold text-green-600 flex items-center gap-1">
              ✓ {appliedCoupon.message}
            </p>
          )}
          {couponError && (
            <p className="text-xs font-bold text-red-500">{couponError}</p>
          )}
        </div>

        {/* Price rows */}
        <div className="flex justify-between text-sm font-bold text-slate-400">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toLocaleString("en-US")} ر.س</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm font-bold text-green-500">
            <span>الخصم</span>
            <span>- {discount.toLocaleString("en-US")} ر.س</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-green-500">
          <span>رسوم الشحن</span>
          <span>مجاني</span>
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
        {isLoading ? "جاري المعالجة..." : "إتمام الطلب"}
      </button>
    </div>
  );
}
