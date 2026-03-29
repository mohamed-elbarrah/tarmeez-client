"use client";

import React from "react";

/**
 * Dumb widget — renders the payment method options.
 * Currently only "Cash on Delivery" is supported; more methods can be composed here.
 */
export default function PaymentMethodSelector() {
  return (
    <div className="bg-white p-8 border rounded-lg">
      <h2 className="text-lg font-black mb-4">طريقة الدفع</h2>
      <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer">
        <div className="flex items-center gap-3 font-bold">
          الدفع عند الاستلام
        </div>
        <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
      </label>
    </div>
  );
}
