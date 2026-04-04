"use client";

import React from "react";
import { ThemeTokens } from "@/lib/themes/types";
import CharityCartSummary from "../components/cart/CharityCartSummary";
import CharityCartItemsList from "../components/cart/CharityCartItemsList";
import { useCartActions } from "@/lib/themes/store/default/components/cart/useCartActions";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
}

export default function CharityCartPage({ theme, storeSlug }: Props) {
  const { cartItems, removeCartItem } = useCartActions(storeSlug);

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-black mb-10">سلة الخير</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <CharityCartItemsList
            cartItems={cartItems}
            storeSlug={storeSlug}
            onRemove={removeCartItem}
          />
        </div>
        <CharityCartSummary
          theme={theme}
          cart={cartItems}
          storeSlug={storeSlug}
        />
      </div>
    </main>
  );
}
