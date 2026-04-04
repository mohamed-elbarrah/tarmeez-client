"use client";

import { createContext, useContext } from "react";
import type { StoreCategory, StoreProduct } from "@/lib/themes/types";

/**
 * PageBuilderStoreContext
 *
 * Holds live merchant store data (categories + products) that is injected by
 * PageEditor into the Puck render tree.
 *
 * Why this exists:
 *  - Puck's `render()` functions only receive the props stored in the JSON.
 *  - `resolvedCategories` / `resolvedProductsList` are NOT stored in JSON.
 *  - PageRenderer (storefront) injects them directly as props on render.
 *  - PageEditor (merchant dashboard) cannot do that, so widgets fall back to
 *    reading this context, giving the merchant a live preview with real data.
 */
export interface PageBuilderStoreData {
  categories: StoreCategory[];
  products: StoreProduct[];
  storeSlug: string;
}

const defaultContextValue: PageBuilderStoreData = {
  categories: [],
  products: [],
  storeSlug: "",
};

export const PageBuilderStoreContext =
  createContext<PageBuilderStoreData>(defaultContextValue);

export function usePageBuilderStoreData(): PageBuilderStoreData {
  return useContext(PageBuilderStoreContext);
}
