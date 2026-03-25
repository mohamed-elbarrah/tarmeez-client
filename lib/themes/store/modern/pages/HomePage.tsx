"use client";
import React from "react";
import type {
  ThemeTokens,
  StoreProduct,
  StoreCategory,
} from "@/lib/themes/types";
import ModernHeroBanner from "../components/ModernHeroBanner";
// Reuse stateless presentational components from the default theme
import CategoriesSlider from "@/lib/themes/store/default/components/CategoriesSlider";
import ProductsSection from "@/lib/themes/store/default/components/ProductsSection";
import PromoGrid from "@/lib/themes/store/default/components/PromoGrid";

interface Props {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  categories?: StoreCategory[];
}

export default function ModernHomePage({
  theme,
  products,
  storeSlug,
  categories,
}: Props) {
  const featuredProduct = products?.[0] ?? null;
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-16">
      {products.length > 0 && (
        <ModernHeroBanner
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
