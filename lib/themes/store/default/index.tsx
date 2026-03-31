"use client";

import React, { useState, useEffect } from "react";
import { resolveTokens } from "./config";
import { ThemeProps, StoreProduct } from "../../types";
import Header from "./components/Header";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addItem as addCartItem,
  removeItem as removeCartItem,
  updateQuantity as updateCartQuantity,
  clearCart as clearCartAction,
} from "@/lib/store/slices/cartSlice";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";

// Cart stored in Redux uses `quantity` per item

const MOCK_PRODUCTS: StoreProduct[] = [];

export default function DefaultTheme({ storeData, initialView }: ThemeProps) {
  const theme = resolveTokens(storeData);

  const [view, setView] = useState(initialView ?? "home");
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const allProducts = storeData.products?.length
    ? storeData.products
    : MOCK_PRODUCTS;

  const navigate = (v: string, p: StoreProduct | null = null) => {
    if (p) setSelectedProduct(p);
    setView(v);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <StoreSettingsProvider
      systemCurrency={storeData.systemCurrency}
      currencyIcon={storeData.currencyIcon}
    >
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
        className="min-h-screen bg-[#f8fafc] text-right text-gray-900"
        dir="rtl"
      >
        {/* <Header
        storeSlug={storeData.slug}
        storeName={storeData.name}
        logo={storeData.logo}
        theme={theme}
      /> */}

        {view === "home" && (
          <HomePage
            theme={theme}
            products={allProducts}
            storeSlug={storeData.slug}
            categories={storeData.categories}
          />
        )}

        {view === "products" && (
          <ProductsPage
            theme={theme}
            products={allProducts}
            storeSlug={storeData.slug}
            categories={storeData.categories || []}
            initialSearch={""}
            initialCategory={selectedCategory}
          />
        )}

        {view === "product" && selectedProduct && (
          <ProductDetailPage storeData={storeData} product={selectedProduct} />
        )}

        {view === "cart" && (
          <CartPage theme={theme} storeSlug={storeData.slug} />
        )}

        {view === "checkout" && (
          <CheckoutPage theme={theme} storeSlug={storeData.slug} checkoutFieldsConfig={storeData.checkoutFieldsConfig} />
        )}

        {view === "order-success" && (
          <OrderSuccessPage storeSlug={storeData.slug} />
        )}

        {view === "track" && (
          <OrderTrackingPage theme={theme} storeSlug={storeData.slug} />
        )}

        {view === "account" && (
          <AccountPage theme={theme} storeSlug={storeData.slug} />
        )}

        {/* <Footer
        storeSlug={storeData.slug}
        storeName={storeData.name}
        logo={storeData.logo}
        theme={theme}
      /> */}
      </div>
    </StoreSettingsProvider>
  );
}
