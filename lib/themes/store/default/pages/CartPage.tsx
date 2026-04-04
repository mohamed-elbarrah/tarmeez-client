"use client";

import React from "react";
import { ThemeTokens } from "@/lib/themes/types";
import CartSummary from "../components/CartSummary";
import CartItemsList from "../components/cart/CartItemsList";
import { useCartActions } from "../components/cart/useCartActions";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
}

/**
 * Orchestrator — owns only layout.
 * All logic lives in useCartActions; UI is split into CartItemsList + CartSummary.
 */
export default function CartPage({ theme, storeSlug }: Props) {
  const { cartItems, updateQty, removeCartItem } = useCartActions(storeSlug);

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-black mb-10">سلة التسوق الخاصة بك</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <CartItemsList
            cartItems={cartItems}
            storeSlug={storeSlug}
            onUpdateQty={updateQty}
            onRemove={removeCartItem}
          />
        </div>
        <CartSummary theme={theme} cart={cartItems} storeSlug={storeSlug} />
      </div>
    </main>
  );
}
