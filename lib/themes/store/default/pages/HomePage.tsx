"use client";
import React from "react";
import { ThemeTokens, StoreProduct, StoreCategory } from "@/lib/themes/types";
import HeroBanner from "@/lib/themes/store/default/components/HeroBanner";
import CategoriesSlider from "@/lib/themes/store/default/components/CategoriesSlider";
import PromoGrid from "@/lib/themes/store/default/components/PromoGrid";
import ProductsSection from "@/lib/themes/store/default/components/ProductsSection";

export interface HomePageProps {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  categories?: StoreCategory[];
  /** Accepted but unused in the default theme — charity theme has its own HomePage */
  activityType?: "RETAIL" | "CHARITY";
}

export default function HomePage({
  theme,
  products,
  storeSlug,
  categories,
}: HomePageProps) {
  const featuredProduct = products?.[0] ?? null;
  return (
    <main className="container py-8 space-y-16">
      {products.length > 0 && (
        <HeroBanner
          theme={theme}
          featuredProduct={featuredProduct}
          storeSlug={storeSlug}
        />
      )}
      <CategoriesSlider
        theme={theme}
        storeSlug={storeSlug}
        categories={categories}
      />
      <PromoGrid theme={theme} products={products} storeSlug={storeSlug} />
      <ProductsSection
        theme={theme}
        products={products}
        storeSlug={storeSlug}
      />
    </main>
  );
}
