"use client";

import React, { useState } from "react";
import { ThemeTokens, StoreProduct, StoreCategory } from "@/lib/themes/types";
import FiltersSection from "@/lib/themes/store/default/components/FiltersSection";

export interface ProductsPageProps {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  categories: StoreCategory[];
  initialSearch?: string;
  initialCategory?: string;
  themeSlug?: string;
  /** Accepted but unused in the default theme */
  activityType?: "RETAIL" | "CHARITY";
}

export default function ProductsPage({
  theme,
  products,
  storeSlug,
  categories,
  initialSearch = "",
  initialCategory = "الكل",
  themeSlug,
}: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(10000);

  return (
    <FiltersSection
      theme={theme}
      products={products}
      categories={categories}
      storeSlug={storeSlug}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
      priceRange={priceRange}
      onSearchChange={(q) => setSearchQuery(q)}
      onCategoryChange={(c) => setSelectedCategory(c)}
      onPriceChange={(p) => setPriceRange(p)}
      onReset={() => {
        setSelectedCategory("الكل");
        setPriceRange(10000);
        setSearchQuery("");
      }}
      themeSlug={themeSlug}
    />
  );
}
