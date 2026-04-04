"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StoreProduct } from "@/lib/themes/types";
import ConnectedProductCard from "@/lib/themes/store/default/components/ConnectedProductCard";
import { usePageBuilderStoreData } from "@/lib/page-builder/context/StoreDataContext";

// ---------------------------------------------------------------------------
// Static lookup tables — complete Tailwind class strings, never interpolated.
// ---------------------------------------------------------------------------

/** Mobile breakpoint grid columns */
const GRID_COLS_MOBILE: Record<
  ProductsSectionBlockProps["colsMobile"],
  string
> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
};

/** Tablet breakpoint (md:) grid columns */
const GRID_COLS_TABLET: Record<
  ProductsSectionBlockProps["colsTablet"],
  string
> = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-4",
};

/** Desktop breakpoint (lg:) grid columns */
const GRID_COLS_DESKTOP: Record<
  ProductsSectionBlockProps["colsDesktop"],
  string
> = {
  "3": "lg:grid-cols-3",
  "4": "lg:grid-cols-4",
  "5": "lg:grid-cols-5",
  "6": "lg:grid-cols-6",
};

const GAP_CLASS: Record<ProductsSectionBlockProps["gap"], string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const ICON_BG_CLASS: Record<ProductsSectionBlockProps["iconBgColor"], string> =
  {
    red: "bg-red-500 text-white animate-pulse",
    primary: "bg-[var(--p-color)] text-white",
    accent: "bg-[var(--a-color)] text-white",
    none: "hidden",
  };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sortProducts(
  products: StoreProduct[],
  sortBy: ProductsSectionBlockProps["sortBy"],
): StoreProduct[] {
  const copy = [...products];
  switch (sortBy) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "popular":
      return copy.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    default:
      // 'newest' — preserve insertion order from API
      return copy;
  }
}

// ---------------------------------------------------------------------------
// Prop contract
// ---------------------------------------------------------------------------
export interface ProductsSectionBlockProps {
  /** Section heading */
  title: string;
  /** Alignment of the title */
  titleAlign: "right" | "center" | "left";
  /** Title font size */
  titleSize: "lg" | "xl" | "2xl" | "3xl";
  /** Whether to render the heading row */
  showTitle: boolean;
  /** Whether to render the "view all" link */
  showViewAll: boolean;
  /** Label for the "view all" link */
  viewAllLabel: string;
  /** Icon displayed beside the heading (emoji string) */
  icon: "⚡" | "🔥" | "⭐" | "🎁" | "🛍️" | "none";
  /** Background colour token for the icon badge */
  iconBgColor: "red" | "primary" | "accent" | "none";
  /** Maximum number of products to display (2–20) */
  limit: number;
  /** Grid columns on mobile screens */
  colsMobile: "1" | "2";
  /** Grid columns on tablet screens (md:) */
  colsTablet: "2" | "3" | "4";
  /** Grid columns on desktop screens (lg:) */
  colsDesktop: "3" | "4" | "5" | "6";
  /** Grid gap between cards */
  gap: "sm" | "md" | "lg";
  /** Sort direction applied client-side to the resolved product list */
  sortBy: "newest" | "popular" | "price_asc" | "price_desc";
  /** Filter by category slug — empty string means show all */
  filterByCategory: string;
  /** Padding top in px (0 = default) */
  paddingTop: number;
  /** Padding bottom in px (0 = default) */
  paddingBottom: number;
  /** Horizontal padding in px (0 = default) */
  paddingX: number;
  /** Margin top in px */
  marginTop: number;
  /** Margin bottom in px */
  marginBottom: number;
  /**
   * Injected by PageRenderer from storeData.products.
   * NOT a Puck editor field — never stored in JSON.
   */
  resolvedProductsList?: StoreProduct[];
  /**
   * Injected by PageRenderer.
   */
  storeSlug?: string;
}

const TITLE_SIZE_PSB: Record<ProductsSectionBlockProps["titleSize"], string> = {
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

const TITLE_ALIGN_PSB: Record<ProductsSectionBlockProps["titleAlign"], string> =
  {
    right: "text-right",
    center: "text-center",
    left: "text-left",
  };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const ProductsSectionBlock = ({
  title,
  titleAlign,
  titleSize,
  showTitle,
  showViewAll,
  viewAllLabel,
  icon,
  iconBgColor,
  limit,
  colsMobile,
  colsTablet,
  colsDesktop,
  gap,
  sortBy,
  filterByCategory,
  paddingTop,
  paddingBottom,
  paddingX,
  marginTop,
  marginBottom,
  resolvedProductsList,
  storeSlug,
}: ProductsSectionBlockProps) => {
  // Fall back to live store data from context when not injected as props.
  // In PageEditor (Puck canvas): context provides real merchant products.
  // In PageRenderer (storefront): props are always provided, context is unused.
  const storeData = usePageBuilderStoreData();
  const productsList = resolvedProductsList ?? storeData.products;
  const slug = storeSlug ?? storeData.storeSlug;
  const gridClass = cn(
    "grid",
    GRID_COLS_MOBILE[colsMobile] ?? GRID_COLS_MOBILE["2"],
    GRID_COLS_TABLET[colsTablet] ?? GRID_COLS_TABLET["3"],
    GRID_COLS_DESKTOP[colsDesktop] ?? GRID_COLS_DESKTOP["5"],
    GAP_CLASS[gap] ?? GAP_CLASS.sm,
  );

  const iconBgCls = ICON_BG_CLASS[iconBgColor] ?? "";

  // ── Empty-state placeholder (no data available at all) ────────────────────
  if (!productsList || productsList.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-[var(--p-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--p-color)] bg-[var(--p-color)]/5 min-h-40">
        <span className="text-xl font-bold">🛍️ قسم المنتجات</span>
        <span className="text-sm opacity-70 mt-2">
          سيتم عرض {limit} منتج هنا تلقائياً
        </span>
      </div>
    );
  }

  // ── Data processing ────────────────────────────────────────────────────────
  const filtered =
    filterByCategory && filterByCategory.trim().length > 0
      ? productsList.filter(
          (p) =>
            p.category?.toLowerCase() === filterByCategory.trim().toLowerCase(),
        )
      : productsList;

  const safeLimit = Math.min(Math.max(limit, 2), 20);
  const displayProducts = sortProducts(filtered, sortBy).slice(0, safeLimit);

  const sectionStyle: React.CSSProperties = {
    paddingTop: paddingTop > 0 ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom > 0 ? `${paddingBottom}px` : undefined,
    paddingLeft: paddingX > 0 ? `${paddingX}px` : undefined,
    paddingRight: paddingX > 0 ? `${paddingX}px` : undefined,
    marginTop: marginTop > 0 ? `${marginTop}px` : undefined,
    marginBottom: marginBottom > 0 ? `${marginBottom}px` : undefined,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section dir="rtl" style={sectionStyle}>
      {/* Header row */}
      {showTitle && (
        <div
          className={cn(
            "flex items-center mb-8",
            titleAlign === "center" ? "justify-center" : "justify-between",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              titleAlign === "center" && "flex-col",
            )}
          >
            {icon !== "none" && (
              <div className={cn("p-2 rounded-lg", iconBgCls)}>
                <span role="img" aria-hidden="true">
                  {icon}
                </span>
              </div>
            )}
            <h2
              className={cn(
                "font-black text-[var(--h-color)]",
                TITLE_SIZE_PSB[titleSize] ?? TITLE_SIZE_PSB["2xl"],
                TITLE_ALIGN_PSB[titleAlign],
              )}
            >
              {title}
            </h2>
          </div>
          {showViewAll && slug && titleAlign !== "center" && (
            <Link
              href={`/store/${slug}/products`}
              className="text-sm font-bold text-[var(--p-color)]"
            >
              {viewAllLabel}
            </Link>
          )}
        </div>
      )}
      {showTitle && showViewAll && slug && titleAlign === "center" && (
        <div className="text-center mb-4">
          <Link
            href={`/store/${slug}/products`}
            className="text-sm font-bold text-[var(--p-color)]"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}

      {/* Product grid */}
      <div className={gridClass}>
        {displayProducts.map((product) => (
          <ConnectedProductCard
            key={product.id}
            product={product}
            storeSlug={slug ?? ""}
          />
        ))}
      </div>
    </section>
  );
};

ProductsSectionBlock.defaultProps = {
  title: "عروض حصرية",
  titleAlign: "right",
  titleSize: "2xl",
  showTitle: true,
  showViewAll: true,
  viewAllLabel: "عرض المزيد",
  icon: "⚡",
  iconBgColor: "red",
  limit: 5,
  colsMobile: "2",
  colsTablet: "3",
  colsDesktop: "5",
  gap: "sm",
  sortBy: "newest",
  filterByCategory: "",
  paddingTop: 0,
  paddingBottom: 0,
  paddingX: 0,
  marginTop: 0,
  marginBottom: 0,
};
