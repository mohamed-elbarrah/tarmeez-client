"use client";

import React from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAccountContext } from "./AccountContext";

/**
 * Dumb organism — reads from AccountContext, renders the wishlist grid.
 */
export default function WishlistTab() {
  const { wishlistItems, storeSlug, handleRemoveWishlist } =
    useAccountContext();

  return (
    <div>
      <h2 className="text-3xl font-black mb-6">منتجاتي المفضلة</h2>
      {!wishlistItems || wishlistItems.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <Heart className="mx-auto mb-4" size={48} />
          <p className="font-bold text-lg">لا توجد منتجات مفضلة بعد</p>
          <p className="text-sm mt-2">اضغط على ♥ في أي منتج لإضافته هنا</p>
          <Link
            href={`/store/${storeSlug}/products`}
            className="inline-block mt-4 px-6 py-3 bg-[var(--p-color)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item: any) => {
            const product = item.product;
            const imageUrl = product.images?.[0] || "";
            const hasDiscount =
              product.comparePrice && product.comparePrice > product.price;
            const discountPercent = hasDiscount
              ? Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100,
                )
              : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="relative">
                  <Link
                    href={`/store/${storeSlug}/product/${encodeURIComponent(product.slug || product.id)}`}
                  >
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                    </div>
                  </Link>
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveWishlist(product.id)}
                    className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all shadow-sm"
                    title="إزالة من المفضلة"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {product.category && (
                    <span className="text-[10px] font-bold text-[var(--p-color)] bg-[var(--p-color)]/5 px-2 py-0.5 rounded-full">
                      {typeof product.category === "object"
                        ? product.category.name
                        : product.category}
                    </span>
                  )}
                  <Link
                    href={`/store/${storeSlug}/product/${encodeURIComponent(product.slug || product.id)}`}
                  >
                    <h3 className="font-bold text-sm line-clamp-2 hover:text-[var(--p-color)] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[var(--p-color)]">
                      {product.price?.toLocaleString()} ر.س
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        {product.comparePrice?.toLocaleString()} ر.س
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
