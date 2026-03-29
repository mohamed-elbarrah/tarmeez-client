"use client";

import React, { useEffect } from "react";
import type { StoreData, StoreProduct } from "@/lib/themes/types";
import { resolveTokens } from "@/lib/themes/store/default/config";
import { useAppDispatch } from "@/lib/store/hooks";
import { productViewed } from "@/lib/store/analytics-listener";
import { ProductProvider } from "../components/product-detail/ProductContext";
import ProductInfoSection from "../components/product-detail/ProductInfoSection";
import ProductReviewsSection from "../components/product-detail/ProductReviewsSection";
import RelatedProductsSection from "../components/product-detail/RelatedProductsSection";

interface Props {
  storeData: StoreData;
  product: StoreProduct;
}

/**
 * Orchestrator — owns only layout, theme token injection, and page-level analytics.
 * All business logic lives in dedicated hooks inside each section.
 */
export default function ProductDetailPage({ storeData, product }: Props) {
  const dispatch = useAppDispatch();
  const theme = resolveTokens(storeData);

  // Page-level analytics: fire once per product view (ANALYTICS-RULE 4)
  useEffect(() => {
    dispatch(
      productViewed({
        productId: String(product.id),
        storeRef: storeData.slug,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  if (!product) return null;

  const themeStyles = {
    "--p-color": theme.primary,
    "--s-color": theme.secondary,
    "--a-color": theme.accent,
    "--b-color": theme.buttonColor,
    "--t-color": theme.textColor,
    "--h-color": theme.headingColor,
    "--radius": theme.borderRadius,
    "--font-family": theme.fontFamily,
  } as React.CSSProperties;

  return (
    <ProductProvider
      product={product}
      storeSlug={storeData.slug}
      allProducts={storeData.products ?? []}
    >
      <div
        className="max-w-6xl mx-auto p-4 md:p-8"
        dir="rtl"
        style={{ ...themeStyles, fontFamily: "var(--font-family)" }}
      >
        <ProductInfoSection />
        <ProductReviewsSection />
        <RelatedProductsSection />
      </div>
    </ProductProvider>
  );
}
