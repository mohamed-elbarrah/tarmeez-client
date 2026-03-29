import React from "react";
import Link from "next/link";
import { ThemeTokens, StoreProduct } from "@/lib/themes/types";
import ConnectedProductCard from "./ConnectedProductCard";
import { ComponentRegistry } from "@/lib/themes/engine/ComponentRegistry";

interface Props {
  theme: ThemeTokens;
  products: StoreProduct[];
  storeSlug: string;
  themeSlug?: string; // Optional: can be passed down from entry point
}

export default function ProductsSection({
  theme,
  products,
  storeSlug,
  themeSlug = "default",
}: Props) {
  // Resolve the ProductCard component for the current theme
  const ProductCardComponent = ComponentRegistry.get(themeSlug, "ProductCard");

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white p-2 rounded-lg animate-pulse">
            <span>⚡</span>
          </div>
          <h2 className="text-2xl font-black">عروض حصرية</h2>
        </div>
        <Link
          href={`/store/${storeSlug}/products`}
          className="text-sm font-bold text-[var(--p-color)]"
        >
          عرض المزيد
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {products.slice(0, 5).map((p) => (
          <ProductCardComponent
            key={p.id}
            product={p}
            storeSlug={storeSlug}
          />
        ))}
      </div>
    </section>
  );
}
