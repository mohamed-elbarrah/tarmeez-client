"use client";

import React, { useState } from "react";
import { ThemeEngine } from "@/lib/themes/engine";
import type { ThemeProps, StoreProduct } from "../../types";
// Shared layout components from storefront core
import { Header, Footer } from "@/components/storefront/core";
// Charity-specific pages
import CharityHomePage from "./pages/HomePage";
import CharityProductDetailPage from "./pages/ProductDetailPage";
import CharityCartPage from "./pages/CartPage";
import CharityCheckoutPage from "./pages/CharityCheckoutPage";
import CharityOrderSuccessPage from "./pages/CharityOrderSuccessPage";
import CharityAccountPage from "./components/account/CharityAccountPage";
// Default pages reused as-is (they're theme-token-driven, not hardcoded)
import ProductsPage from "@/lib/themes/store/default/pages/ProductsPage";
import OrderTrackingPage from "@/lib/themes/store/default/pages/OrderTrackingPage";

export default function CharityTheme({ storeData, initialView }: ThemeProps) {
  // Use ThemeEngine so store-level overrides still win over theme defaults
  const engine = new ThemeEngine(storeData, storeData.theme ?? null);
  const theme = engine.getComputedConfig();
  const themeSlug = engine.getThemeSlug();

  const [view, setView] = useState(initialView ?? "home");
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const allProducts = storeData.products?.length ? storeData.products : [];

  const navigate = (v: string, p: StoreProduct | null = null) => {
    if (p) setSelectedProduct(p);
    setView(v);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };
  void navigate; // used by child pages via props pattern in default theme

  return (
    <div
      style={
        {
          "--p-color": theme.primary,
          "--s-color": theme.secondary,
          "--a-color": theme.accent,
          "--b-color": theme.buttonColor,
          "--t-color": theme.textColor,
          "--h-color": theme.headingColor,
          "--radius": theme.borderRadius,
          fontFamily: theme.fontFamily,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[#f0fdf4] text-right text-gray-900"
      dir="rtl"
    >
      <Header
        storeSlug={storeData.slug}
        storeName={storeData.name}
        logo={storeData.logo}
        theme={theme}
      />

      {view === "home" && (
        <CharityHomePage
          theme={theme}
          products={allProducts}
          storeSlug={storeData.slug}
          categories={storeData.categories}
          themeSlug={themeSlug}
        />
      )}

      {view === "products" && (
        <ProductsPage
          theme={theme}
          products={allProducts}
          storeSlug={storeData.slug}
          categories={storeData.categories || []}
          initialSearch=""
          initialCategory={selectedCategory}
          themeSlug={themeSlug}
        />
      )}

      {view === "product" && selectedProduct && (
        <CharityProductDetailPage
          storeData={storeData}
          product={selectedProduct}
          themeSlug={themeSlug}
        />
      )}

      {view === "cart" && (
        <CharityCartPage theme={theme} storeSlug={storeData.slug} />
      )}

      {view === "checkout" && (
        <CharityCheckoutPage theme={theme} storeSlug={storeData.slug} />
      )}

      {view === "order-success" && (
        <CharityOrderSuccessPage storeSlug={storeData.slug} />
      )}

      {view === "track" && (
        <OrderTrackingPage theme={theme} storeSlug={storeData.slug} />
      )}

      {view === "account" && (
        <CharityAccountPage theme={theme} storeSlug={storeData.slug} />
      )}

      <Footer
        storeSlug={storeData.slug}
        storeName={storeData.name}
        logo={storeData.logo}
        theme={theme}
      />
    </div>
  );
}
