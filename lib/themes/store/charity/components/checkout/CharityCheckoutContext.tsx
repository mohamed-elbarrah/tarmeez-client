"use client";

import React, { createContext, useContext } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFieldConfig } from "@/lib/types/auth";
import type { CharityCheckoutFormValues } from "./useCharityCheckoutFlow";

// ─── Context shape ────────────────────────────────────────────────────────────

export interface CharityCheckoutContextValue {
  storeSlug: string;
  /** Ordered, fully-resolved field descriptors for building the form UI */
  checkoutFields: CheckoutFieldConfig[];
  subtotal: number;
  total: number;
  isLoading: boolean;
  // Form
  register: UseFormRegister<CharityCheckoutFormValues>;
  errors: FieldErrors<CharityCheckoutFormValues>;
  onSubmit: () => void;
  // Anonymous donation
  isAnonymous: boolean;
  setIsAnonymous: (v: boolean) => void;
}

const CharityCheckoutContext =
  createContext<CharityCheckoutContextValue | null>(null);

export function CharityCheckoutContextProvider({
  value,
  children,
}: {
  value: CharityCheckoutContextValue;
  children: React.ReactNode;
}) {
  return (
    <CharityCheckoutContext.Provider value={value}>
      {children}
    </CharityCheckoutContext.Provider>
  );
}

export function useCharityCheckoutContext(): CharityCheckoutContextValue {
  const ctx = useContext(CharityCheckoutContext);
  if (!ctx)
    throw new Error(
      "useCharityCheckoutContext must be used within <CharityCheckoutContextProvider>",
    );
  return ctx;
}
