"use client";

import React, { createContext, useContext } from "react";
import type { StoreProduct } from "@/lib/themes/types";

// ─── Contract ─────────────────────────────────────────────────────────────────

export interface ProductContextValue {
  /** The product being displayed on this page */
  product: StoreProduct;
  /** Slug of the owning store — used in API calls and navigation */
  storeSlug: string;
  /** All store products — used by RelatedProductsSection */
  allProducts: StoreProduct[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProductContext = createContext<ProductContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ProductProviderProps extends ProductContextValue {
  children: React.ReactNode;
}

export function ProductProvider({
  product,
  storeSlug,
  allProducts,
  children,
}: ProductProviderProps) {
  return (
    <ProductContext.Provider value={{ product, storeSlug, allProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * The only bridge between sub-components and product-page data.
 * Must be used within a <ProductProvider>.
 */
export function useProductContext(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error(
      "useProductContext must be used within a <ProductProvider>",
    );
  return ctx;
}
