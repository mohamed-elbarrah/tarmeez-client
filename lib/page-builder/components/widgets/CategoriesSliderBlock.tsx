"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { StoreCategory } from "@/lib/themes/types";
import { usePageBuilderStoreData } from "@/lib/page-builder/context/StoreDataContext";

// ---------------------------------------------------------------------------
// Static lookup tables — Tailwind class strings must be complete, never
// interpolated at runtime (JIT purger requires static strings).
// ---------------------------------------------------------------------------
const IMAGE_RADIUS: Record<CategoriesSliderBlockProps["imageRadius"], string> =
  {
    full: "rounded-full",
    lg: "rounded-2xl",
    md: "rounded-lg",
    none: "rounded-none",
  };

/**
 * Carousel item flex-basis per desired visible items.
 * Combines mobile / tablet / desktop breakpoints into a single class string.
 */
const ITEMS_BASIS: Record<CategoriesSliderBlockProps["itemsPerRow"], string> = {
  "4": "basis-1/2 sm:basis-1/3 md:basis-1/4",
  "5": "basis-1/2 sm:basis-1/4 md:basis-1/5",
  "6": "basis-1/3 sm:basis-1/5 md:basis-1/6",
  "8": "basis-1/4 sm:basis-1/6 lg:basis-1/8",
};

// ---------------------------------------------------------------------------
// Prop contract
// ---------------------------------------------------------------------------
export interface CategoriesSliderBlockProps {
  /** Section heading shown above the carousel */
  title: string;
  /** Alignment of the title */
  titleAlign: "right" | "center" | "left";
  /** Title font size */
  titleSize: "lg" | "xl" | "2xl" | "3xl";
  /** Whether to render the "view all" link */
  showViewAll: boolean;
  /** Label text for the "view all" link */
  viewAllLabel: string;
  /** Border-radius applied to each category image circle/shape */
  imageRadius: "full" | "lg" | "md" | "none";
  /** How many items should be visible at once on larger screens */
  itemsPerRow: "4" | "5" | "6" | "8";
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
   * Injected by PageRenderer at render-time from storeData.categories.
   * NOT a Puck editor field — never stored in JSON.
   * When undefined the component renders an editor placeholder.
   */
  resolvedCategories?: StoreCategory[];
  /**
   * Injected by PageRenderer.
   * Required to build correct <Link> hrefs in the storefront.
   */
  storeSlug?: string;
}

const TITLE_SIZE: Record<CategoriesSliderBlockProps["titleSize"], string> = {
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

const TITLE_ALIGN: Record<CategoriesSliderBlockProps["titleAlign"], string> = {
  right: "text-right",
  center: "text-center",
  left: "text-left",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const CategoriesSliderBlock = ({
  title,
  titleAlign,
  titleSize,
  showViewAll,
  viewAllLabel,
  imageRadius,
  itemsPerRow,
  paddingTop,
  paddingBottom,
  paddingX,
  marginTop,
  marginBottom,
  resolvedCategories,
  storeSlug,
}: CategoriesSliderBlockProps) => {
  // Fall back to live store data from context when not injected as props.
  // In PageEditor (Puck canvas): context provides real merchant categories.
  // In PageRenderer (storefront): props are always provided, context is unused.
  const storeData = usePageBuilderStoreData();
  const categories = resolvedCategories ?? storeData.categories;
  const slug = storeSlug ?? storeData.storeSlug;

  const radiusClass = IMAGE_RADIUS[imageRadius] ?? IMAGE_RADIUS.full;
  const basisClass = ITEMS_BASIS[itemsPerRow] ?? ITEMS_BASIS["6"];

  // ── Empty-state placeholder (no data available at all) ────────────────────
  if (!categories || categories.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-[var(--p-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--p-color)] bg-[var(--p-color)]/5 min-h-32">
        <span className="text-xl font-bold">🗂️ شريط الفئات</span>
        <span className="text-sm opacity-70 mt-2">
          سيتم عرض فئات المتجر هنا تلقائياً
        </span>
      </div>
    );
  }

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
    <section
      className={cn(
        "relative",
        paddingTop === 0 && paddingBottom === 0 && "py-4",
        paddingX === 0 && "px-2",
      )}
      style={sectionStyle}
      dir="rtl"
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center mb-8",
          titleAlign === "center" ? "justify-center" : "justify-between",
        )}
      >
        <h2
          className={cn(
            "font-black text-[var(--h-color)]",
            TITLE_SIZE[titleSize] ?? TITLE_SIZE["2xl"],
            TITLE_ALIGN[titleAlign],
          )}
        >
          {title}
        </h2>
        {showViewAll && slug && titleAlign !== "center" && (
          <Link
            href={`/store/${slug}/products`}
            className="text-sm font-bold text-[var(--p-color)]"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>
      {showViewAll && slug && titleAlign === "center" && (
        <div className="text-center mb-4">
          <Link
            href={`/store/${slug}/products`}
            className="text-sm font-bold text-[var(--p-color)]"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}

      {/* Carousel */}
      <Carousel opts={{ align: "start", direction: "rtl" }} className="w-auto">
        <CarouselContent className="-ml-4 gap-2">
          {categories.map((cat) => (
            <CarouselItem key={cat.id} className={cn("pl-4", basisClass)}>
              <Link
                href={`/store/${slug}/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div
                  className={cn(
                    "w-24 h-24 bg-white border flex items-center justify-center",
                    "group-hover:border-[var(--p-color)] group-hover:shadow-md transition-all",
                    "relative overflow-hidden",
                    radiusClass,
                  )}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain"
                      unoptimized={cat.image.startsWith("https://placehold.co")}
                      sizes="96px"
                    />
                  ) : (
                    <span
                      className="text-3xl select-none"
                      role="img"
                      aria-label={cat.name}
                    >
                      🗂️
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-center whitespace-nowrap text-[var(--h-color)]">
                  {cat.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <div className="hidden md:block">
          <CarouselPrevious className="-right-12" />
          <CarouselNext className="-left-12" />
        </div> */}
      </Carousel>
    </section>
  );
};

CategoriesSliderBlock.defaultProps = {
  title: "تسوق حسب الفئة",
  titleAlign: "right",
  titleSize: "2xl",
  showViewAll: true,
  viewAllLabel: "عرض الكل",
  imageRadius: "full",
  itemsPerRow: "6",
  paddingTop: 0,
  paddingBottom: 0,
  paddingX: 0,
  marginTop: 0,
  marginBottom: 0,
};
