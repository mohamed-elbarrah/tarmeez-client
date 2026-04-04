"use client";

import React from "react";
import { ThemeTokens } from "@/lib/themes/types";
import { useCharityCheckoutFlow } from "../components/checkout/useCharityCheckoutFlow";
import { CharityCheckoutContextProvider } from "../components/checkout/CharityCheckoutContext";
import CharityDonorForm from "../components/checkout/CharityDonorForm";
import CharityDonationReview from "../components/checkout/CharityDonationReview";
import type { CheckoutFieldConfig } from "@/lib/types/auth";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
  checkoutFieldsConfig?: CheckoutFieldConfig[] | null;
}

/**
 * Charity checkout — no shipping address, no coupons, no quantity.
 * Only donor contact fields + anonymous toggle + donation review.
 */
export default function CharityCheckoutPage({
  storeSlug,
  checkoutFieldsConfig,
}: Props) {
  const checkoutValue = useCharityCheckoutFlow(storeSlug, checkoutFieldsConfig);

  return (
    <CharityCheckoutContextProvider value={checkoutValue}>
      <div className="container py-10">
        <h1 className="text-2xl font-black mb-8">تأكيد التبرع</h1>
        <form
          onSubmit={checkoutValue.onSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <CharityDonorForm />
          </div>
          <div className="w-full lg:w-96">
            <CharityDonationReview />
          </div>
        </form>
      </div>
    </CharityCheckoutContextProvider>
  );
}
