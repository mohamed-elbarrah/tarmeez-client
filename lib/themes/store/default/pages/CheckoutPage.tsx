"use client";

import React from "react";
import { ThemeTokens } from "@/lib/themes/types";
import { useCheckoutFlow } from "../components/checkout/useCheckoutFlow";
import { CheckoutContextProvider } from "../components/checkout/CheckoutContext";
import ShippingAddressForm from "../components/checkout/ShippingAddressForm";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import OrderReview from "../components/checkout/OrderReview";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
}

/**
 * Orchestrator — bootstraps CheckoutContext and delegates layout to organisms.
 * Zero business logic: form flow, coupon, and order creation live in useCheckoutFlow.
 */
export default function CheckoutPage({ storeSlug }: Props) {
  const checkoutValue = useCheckoutFlow(storeSlug);

  return (
    <CheckoutContextProvider value={checkoutValue}>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-black mb-8">
          {checkoutValue.isDonationOnly ? "تأكيد التبرع" : "إتمام عملية الشراء"}
        </h1>
        <form
          onSubmit={checkoutValue.onSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddressForm />
            <PaymentMethodSelector />
          </div>
          <div className="w-full lg:w-96">
            <OrderReview />
          </div>
        </form>
      </div>
    </CheckoutContextProvider>
  );
}
