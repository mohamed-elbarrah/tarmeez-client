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

interface Props {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  categories?: StoreCategory[];
  themeSlug?: string;
}

export default function CharityHomePage({
  theme,
  products,
  storeSlug,
  categories,
  themeSlug,
}: Props) {
  const featuredProduct = products?.[0] ?? null;
  return (
    <main className="container py-8 space-y-16">
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
      <ProductsSection
        theme={theme}
        products={products}
        storeSlug={storeSlug}
        themeSlug={themeSlug}
      />
    </main>
  );
}
