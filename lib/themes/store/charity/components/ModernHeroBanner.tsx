"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { ThemeTokens, StoreProduct } from "@/lib/themes/types";

interface Props {
  theme: ThemeTokens;
  featuredProduct?: StoreProduct | null;
  storeSlug: string;
}

/**
 * Modern theme Hero — a two-column split layout with a gradient accent bar
 * on the left, clearly distinguishable from the Default theme's full-bleed hero.
 */
export default function ModernHeroBanner({
  theme,
  featuredProduct,
  storeSlug,
}: Props) {
  if (!featuredProduct) return null;

  return (
    <section
      className="relative overflow-hidden rounded-3xl flex flex-col md:flex-row min-h-95"
      style={{ backgroundColor: "var(--s-color)" }}
    >
      {/* Left accent bar */}
      <div
        className="hidden md:block w-2 self-stretch rounded-r-none"
        style={{ background: "var(--p-color)" }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-14 space-y-5 text-white">
        <span
          className="inline-flex items-center gap-2 text-xs font-bold uppercase px-3 py-1 rounded-full w-fit"
          style={{ backgroundColor: "var(--p-color)" }}
        >
          ✦ جديد
        </span>
        <h2 className="text-3xl md:text-5xl font-black leading-snug">
          {featuredProduct.name}
        </h2>
        <p className="text-base opacity-75 leading-relaxed max-w-md">
          {featuredProduct.description ??
            "مجموعة متميزة من أحدث المنتجات — اكتشف عروضنا الحصرية اليوم."}
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/store/${storeSlug}/product/${encodeURIComponent(featuredProduct.slug ?? String(featuredProduct.id))}`}
            className="px-8 py-3 font-bold text-sm rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--p-color)", color: "#fff" }}
          >
            تبرع الآن
          </Link>
          <Link
            href={`/store/${storeSlug}/products`}
            className="px-8 py-3 font-bold text-sm rounded-full border border-white/30 hover:bg-white/10 transition-colors"
            style={{ color: "#fff" }}
          >
            جميع المشاريع الخيرية
          </Link>
        </div>
      </div>

      {/* Product image */}
      <div className="relative w-full md:w-2/5 min-h-50 md:min-h-0">
        {featuredProduct.image ? (
          <Image
            src={featuredProduct.image}
            alt={featuredProduct.name}
            fill
            className="object-contain object-center p-6"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20 text-white text-6xl">
            🛍
          </div>
        )}
      </div>
    </section>
  );
}
