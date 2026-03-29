"use client";

import React, { createContext, useContext } from "react";

// ISO code → display symbol mapping for the most common currencies.
// Merchant can set any ISO code; this resolves to the human-friendly symbol.
const CURRENCY_SYMBOLS: Record<string, string> = {
  SAR: "ر.س",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  KWD: "د.ك",
  QAR: "ر.ق",
  BHD: "د.ب",
  OMR: "ر.ع",
  EGP: "ج.م",
  JOD: "د.أ",
  MAD: "د.م",
};

export interface StoreSettings {
  /** ISO currency code, e.g. "SAR" */
  systemCurrency: string;
  /** Resolved human-friendly symbol, e.g. "ر.س" */
  currencySymbol: string;
  /** Optional image URL for the currency icon (from merchant dashboard) */
  currencyIcon?: string | null;
}

const defaultSettings: StoreSettings = {
  systemCurrency: "SAR",
  currencySymbol: "ر.س",
  currencyIcon: null,
};

const StoreSettingsContext = createContext<StoreSettings>(defaultSettings);

interface StoreSettingsProviderProps {
  systemCurrency?: string | null;
  currencyIcon?: string | null;
  children: React.ReactNode;
}

export function StoreSettingsProvider({
  systemCurrency,
  currencyIcon,
  children,
}: StoreSettingsProviderProps) {
  const isoCode = systemCurrency?.trim().toUpperCase() || "SAR";
  const currencySymbol = CURRENCY_SYMBOLS[isoCode] ?? isoCode;

  return (
    <StoreSettingsContext.Provider
      value={{ systemCurrency: isoCode, currencySymbol, currencyIcon }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

/**
 * Hook — the only bridge between UI components and store currency settings.
 * Returns the resolved currency symbol for display (e.g. "ر.س" for "SAR").
 */
export function useStoreCurrency(): StoreSettings {
  return useContext(StoreSettingsContext);
}
