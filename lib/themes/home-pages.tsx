/**
 * home-pages.tsx
 *
 * Provides lightweight adapter components that map `{ storeData }` to each
 * theme's HomePage component.  The full SPA entry-points (DefaultTheme,
 * ModernTheme) include an internal view router that conflicts with Next.js
 * App Router.  These adapters skip that router and render only the homepage
 * content — Header and Footer are provided by the store layout.tsx.
 */
import React from "react";
import type {
  StoreData,
  ThemeTokens,
  StoreProduct,
  StoreCategory,
} from "./types";
import { ThemeEngine } from "./engine";
import DefaultHomePage from "./store/default/pages/HomePage";
import ModernHomePage from "./store/modern/pages/HomePage";

type HomePageProps = {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  categories?: StoreCategory[];
};

/**
 * Higher-order function that wraps a theme's HomePage component so it only
 * needs `{ storeData }` as input.  ThemeEngine resolves the 3-layer cascade
 * (fallback → theme defaults → store overrides) just like layout.tsx does.
 *
 * NOTE: ThemeConfig and ThemeTokens are identical in shape; the cast is safe.
 */
function makeAdapter(Page: React.ComponentType<HomePageProps>) {
  function ThemeHomePageAdapter({ storeData }: { storeData: StoreData }) {
    const engine = new ThemeEngine(storeData, storeData.theme ?? null);
    const theme = engine.getComputedConfig() as unknown as ThemeTokens;
    return (
      <Page
        theme={theme}
        products={storeData.products ?? []}
        storeSlug={storeData.slug}
        categories={storeData.categories}
      />
    );
  }
  return ThemeHomePageAdapter;
}

export const THEME_HOME_PAGES: Record<
  string,
  React.ComponentType<{ storeData: StoreData }>
> = {
  default: makeAdapter(DefaultHomePage),
  modern: makeAdapter(ModernHomePage),
};

/**
 * Returns the appropriate HomePage adapter for the given theme slug.
 * Falls back to the default theme if the slug is unknown.
 */
export function getThemeHomePage(
  themeKey: string | null | undefined,
): React.ComponentType<{ storeData: StoreData }> {
  return THEME_HOME_PAGES[themeKey ?? "default"] ?? THEME_HOME_PAGES["default"];
}
