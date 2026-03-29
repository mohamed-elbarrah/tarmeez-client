"use client";

import React, { useMemo } from "react";
import { useProductContext } from "./ProductContext";
import ConnectedProductCard from "../ConnectedProductCard";
import { getRelatedProducts } from "@/lib/helpers/productUtils";

/**
 * Renders a grid of related products in the same category.
 * Product filtering is delegated to the pure helper (getRelatedProducts),
 * keeping the UI layer free of business logic.
 */
export default function RelatedProductsSection() {
  const { product, storeSlug, allProducts } = useProductContext();

  const relatedProducts = useMemo(
    () => getRelatedProducts(allProducts, product, 4),
    [allProducts, product],
  );

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-16 space-y-8">
      <h2 className="text-2xl font-black">منتجات مشابهة</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {relatedProducts.map((p) => (
          <ConnectedProductCard key={p.id} product={p} storeSlug={storeSlug} />
        ))}
      </div>
    </section>
  );
}
