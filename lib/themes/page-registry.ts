/**
 * page-registry.ts — Single source of truth for ALL storefront page components.
 *
 * Every store route resolves its component through this registry.
 * Themes only need to provide pages that differ from default;
 * missing entries fall back to the default theme automatically.
 *
 * To add a new theme variant for any page:
 *   1. Create the component in themes/store/<slug>/pages/
 *   2. Add an entry to THEME_PAGES[slug] below
 *   That's it — the route will pick it up automatically.
 */
import React from "react";
import type {
  StoreData,
  StoreProduct,
  StoreCategory,
  ThemeTokens,
} from "./types";
import { ThemeEngine } from "./engine";

// ─── Default theme pages ───────────────────────────────────────────
import DefaultHomePage from "./store/default/pages/HomePage";
import DefaultProductDetailPage from "./store/default/pages/ProductDetailPage";
import DefaultProductsPage from "./store/default/pages/ProductsPage";
import DefaultCartPage from "./store/default/pages/CartPage";
import DefaultCheckoutPage from "./store/default/pages/CheckoutPage";
import DefaultOrderSuccessPage from "./store/default/pages/OrderSuccessPage";
import DefaultOrderTrackingPage from "./store/default/pages/OrderTrackingPage";
import DefaultAccountPage from "./store/default/pages/AccountPage";
import DefaultLoginPage from "./store/default/pages/LoginPage";
import DefaultRegisterPage from "./store/default/pages/RegisterPage";

// ─── Charity theme pages (only those that differ) ──────────────────
import CharityHomePage from "./store/charity/pages/HomePage";
import CharityProductDetailPage from "./store/charity/pages/ProductDetailPage";

// ─── Prop types per page kind ──────────────────────────────────────
type HomePageProps = {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  categories?: StoreCategory[];
  activityType?: "RETAIL" | "CHARITY";
};

type ProductDetailProps = {
  storeData: StoreData;
  product: StoreProduct;
};

type ProductsPageProps = {
  theme: ThemeTokens;
  products: StoreProduct[];
  categories: StoreCategory[];
  storeSlug: string;
  initialSearch?: string;
  initialCategory?: string;
  activityType?: "RETAIL" | "CHARITY";
};

type SimpleThemeProps = {
  theme: ThemeTokens;
  storeSlug: string;
  activityType?: "RETAIL" | "CHARITY";
  checkoutFieldsConfig?:
    | import("@/lib/types/auth").CheckoutFieldConfig[]
    | null;
};

type AuthPageProps = {
  theme: ThemeTokens;
  storeSlug: string;
  logo?: string | null;
  storeName: string;
};

type OrderSuccessProps = {
  storeSlug: string;
};

// ─── Registry structure ────────────────────────────────────────────
interface ThemePages {
  HomePage: React.ComponentType<HomePageProps>;
  ProductDetailPage: React.ComponentType<ProductDetailProps>;
  ProductsPage: React.ComponentType<ProductsPageProps>;
  CartPage: React.ComponentType<SimpleThemeProps>;
  CheckoutPage: React.ComponentType<SimpleThemeProps>;
  OrderSuccessPage: React.ComponentType<OrderSuccessProps>;
  OrderTrackingPage: React.ComponentType<SimpleThemeProps>;
  AccountPage: React.ComponentType<SimpleThemeProps>;
  LoginPage: React.ComponentType<AuthPageProps>;
  RegisterPage: React.ComponentType<AuthPageProps>;
}

const DEFAULT_PAGES: ThemePages = {
  HomePage: DefaultHomePage,
  ProductDetailPage: DefaultProductDetailPage,
  ProductsPage: DefaultProductsPage,
  CartPage: DefaultCartPage,
  CheckoutPage: DefaultCheckoutPage,
  OrderSuccessPage: DefaultOrderSuccessPage,
  OrderTrackingPage: DefaultOrderTrackingPage,
  AccountPage: DefaultAccountPage,
  LoginPage: DefaultLoginPage,
  RegisterPage: DefaultRegisterPage,
};

/**
 * Theme-specific overrides. Only list pages that differ from default.
 * Missing entries automatically fall back to DEFAULT_PAGES.
 */
const THEME_OVERRIDES: Record<string, Partial<ThemePages>> = {
  charity: {
    HomePage: CharityHomePage,
    ProductDetailPage: CharityProductDetailPage,
  },
};

// ─── Public API ────────────────────────────────────────────────────

function resolve<K extends keyof ThemePages>(
  page: K,
  themeSlug: string | null | undefined,
): ThemePages[K] {
  const slug = themeSlug ?? "default";
  const override = THEME_OVERRIDES[slug]?.[page];
  return (override as ThemePages[K]) ?? DEFAULT_PAGES[page];
}

/**
 * Compute ThemeTokens using the proper 3-layer cascade (ThemeEngine).
 * Use this instead of resolveTokens() from default/config.ts.
 */
export function computeTheme(store: StoreData): ThemeTokens {
  const engine = new ThemeEngine(store, store.theme ?? null);
  return engine.getComputedConfig() as unknown as ThemeTokens;
}

// ─── Typed getters (one per page kind) ─────────────────────────────

export function getThemeHomePage(slug: string | null | undefined) {
  return resolve("HomePage", slug);
}

export function getThemeProductPage(slug: string | null | undefined) {
  return resolve("ProductDetailPage", slug);
}

export function getThemeProductsPage(slug: string | null | undefined) {
  return resolve("ProductsPage", slug);
}

export function getThemeCartPage(slug: string | null | undefined) {
  return resolve("CartPage", slug);
}

export function getThemeCheckoutPage(slug: string | null | undefined) {
  return resolve("CheckoutPage", slug);
}

export function getThemeOrderSuccessPage(slug: string | null | undefined) {
  return resolve("OrderSuccessPage", slug);
}

export function getThemeOrderTrackingPage(slug: string | null | undefined) {
  return resolve("OrderTrackingPage", slug);
}

export function getThemeAccountPage(slug: string | null | undefined) {
  return resolve("AccountPage", slug);
}

export function getThemeLoginPage(slug: string | null | undefined) {
  return resolve("LoginPage", slug);
}

export function getThemeRegisterPage(slug: string | null | undefined) {
  return resolve("RegisterPage", slug);
}
