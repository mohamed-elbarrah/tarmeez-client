"use client";

import React from "react";
import { useCheckoutContext } from "./CheckoutContext";

/**
 * Dumb widget — renders customer info + shipping address fields.
 * Reads form state from CheckoutContext; owns zero local state.
 */
export default function ShippingAddressForm() {
  const { register, errors, isDonationOnly } = useCheckoutContext();

  return (
    <div className="bg-white p-8 border rounded-lg">
      <h2 className="text-lg font-black mb-4">
        {isDonationOnly ? "بيانات المتبرع" : "عنوان الشحن"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Name */}
        <div className="space-y-1">
          <input
            {...register("customerName")}
            placeholder={isDonationOnly ? "اسم المتبرع" : "الاسم الكامل"}
            className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.customerName ? "border-red-500" : ""}`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-[10px] pr-2">
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <input
            {...register("customerPhone")}
            placeholder="رقم الجوال"
            className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.customerPhone ? "border-red-500" : ""}`}
          />
          {errors.customerPhone && (
            <p className="text-red-500 text-[10px] pr-2">
              {errors.customerPhone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <input
            {...register("customerEmail")}
            placeholder="البريد الإلكتروني (اختياري)"
            className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.customerEmail ? "border-red-500" : ""}`}
          />
          {errors.customerEmail && (
            <p className="text-red-500 text-[10px] pr-2">
              {errors.customerEmail.message}
            </p>
          )}
        </div>

        {/* Address fields — hidden for donation-only carts */}
        {!isDonationOnly && (
          <>
            <div className="space-y-1">
              <input
                {...register("city")}
                placeholder="المدينة"
                className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="text-red-500 text-[10px] pr-2">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <input
                {...register("region")}
                placeholder="المنطقة"
                className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.region ? "border-red-500" : ""}`}
              />
              {errors.region && (
                <p className="text-red-500 text-[10px] pr-2">
                  {errors.region.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <input
                {...register("street")}
                placeholder="الشارع"
                className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.street ? "border-red-500" : ""}`}
              />
              {errors.street && (
                <p className="text-red-500 text-[10px] pr-2">
                  {errors.street.message}
                </p>
              )}
            </div>
          </>
        )}

        {/* Notes */}
        <div className="md:col-span-2 space-y-1">
          <textarea
            {...register("notes")}
            placeholder="ملاحظات (اختياري)"
            className="w-full p-3 bg-slate-50 border rounded-lg h-24"
          />
        </div>
      </div>
    </div>
  );
}
