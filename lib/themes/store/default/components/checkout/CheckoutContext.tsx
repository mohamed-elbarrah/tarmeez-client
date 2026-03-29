"use client";

import React, { createContext, useContext } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormValues } from "./useCheckoutFlow";

// ─── Applied coupon shape ─────────────────────────────────────────────────────

export interface AppliedCoupon {
  code: string;
  discount: number;
  message: string;
  freeProduct?: { id: string; name: string; qty: number };
}

// ─── Context shape ────────────────────────────────────────────────────────────

export interface CheckoutContextValue {
  storeSlug: string;
  isDonationOnly: boolean;
  /** Formatted subtotal (already computed, ready to display) */
  subtotal: number;
  /** Final total after discount */
  total: number;
  isLoading: boolean;
  isValidating: boolean;
  // Form
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  onSubmit: () => void;
  // Coupon
  couponCode: string;
  setCouponCode: (v: string) => void;
  appliedCoupon: AppliedCoupon | null;
  couponError: string | null;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutContextProvider({
  value,
  children,
}: {
  value: CheckoutContextValue;
  children: React.ReactNode;
}) {
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx)
    throw new Error(
      "useCheckoutContext must be used within <CheckoutContextProvider>",
    );
  return ctx;
}
