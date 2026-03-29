import React from "react";
// Default Retail Components
import DefaultProductCard from "@/lib/themes/store/default/components/ConnectedProductCard";
import DefaultHeroBanner from "@/lib/themes/store/default/components/HeroBanner";
import DefaultProductsSection from "@/lib/themes/store/default/components/ProductsSection";

// Charity Specialized Components
import CharityProductCard from "@/lib/themes/store/charity/components/ConnectedCharityProductCard";
import CharityHeroBanner from "@/lib/themes/store/charity/components/ModernHeroBanner";

/**
 * The Component Registry
 * Implements a prioritized resolution: [ThemeSlug] -> [Default]
 * 
 * Future: We can switch these to dynamic imports with React.lazy if bundle size becomes an issue.
 */

const REGISTRY: Record<string, Record<string, React.ComponentType<any>>> = {
  default: {
    ProductCard: DefaultProductCard,
    HeroBanner: DefaultHeroBanner,
    ProductsSection: DefaultProductsSection,
  },
  charity: {
    ProductCard: CharityProductCard,
    HeroBanner: CharityHeroBanner,
    // ProductsSection falls back to default
  },
};

export class ComponentRegistry {
  /**
   * Resolves the correct component based on theme slug.
   * If the theme doesn't provide an override, it falls back to 'default'.
   */
  static get<T = any>(themeSlug: string, componentKey: string): React.ComponentType<T> {
    const themeComponents = REGISTRY[themeSlug] || {};
    const component = themeComponents[componentKey] || REGISTRY.default[componentKey];

    if (!component) {
      throw new Error(`ComponentRegistry: Could not resolve component '${componentKey}' for theme '${themeSlug}' (fallback failed).`);
    }

    return component as React.ComponentType<T>;
  }
}
