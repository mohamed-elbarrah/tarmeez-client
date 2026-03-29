"use client";

import React from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Tag,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useProductContext } from "./ProductContext";
import { useProductActions } from "./useProductActions";
import ProductImage from "../ProductImage";
import VariantSelector from "../VariantSelector";
import AuthPromptModal from "./AuthPromptModal";

/**
 * The "top card" organism: image gallery, product meta, pricing,
 * variant selector, offers, feature checklist, and the add-to-cart CTA.
 *
 * Logic-free — delegates entirely to useProductActions.
 * Theme tokens consumed via CSS variables (var(--p-color), etc.).
 */
export default function ProductInfoSection() {
  const { product } = useProductContext();

  const {
    hasVariants,
    selectedOptions,
    activeVariant,
    handleOptionSelect,
    displayPrice,
    displayComparePrice,
    savings,
    discountPercent,
    isOutOfStock,
    selectedOffer,
    setSelectedOffer,
    productImages,
    selectedImage,
    setSelectedImage,
    isWishlisted,
    handleWishlist,
    showAuthModal,
    closeAuthModal,
    navigateToLogin,
    navigateToRegister,
    handleAddToCart,
  } = useProductActions();

  return (
    <>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white p-6 border border-slate-300 shadow-sm transition-all hover:shadow-md"
        style={{ borderRadius: "calc(var(--radius) * 1.5)" }}
      >
        {/* ── Image Gallery ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div
            className="aspect-square bg-slate-50 border border-slate-300 flex items-center justify-center relative overflow-hidden group"
            style={{ borderRadius: "var(--radius)" }}
          >
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full z-10 shadow-lg">
                خصم {discountPercent}%
              </span>
            )}
            {productImages[selectedImage] ? (
              <ProductImage
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="text-slate-300 font-black text-xl uppercase tracking-widest">
                Product Image
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square border-2 rounded-xl cursor-pointer transition-all overflow-hidden relative ${
                    selectedImage === i
                      ? "border-(--p-color) bg-blue-50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Category badge + wishlist */}
          <div className="flex justify-between items-start mb-2">
            {product.category && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1"
                style={{
                  color: "var(--p-color)",
                  backgroundColor:
                    "color-mix(in srgb, var(--p-color) 10%, transparent)",
                  borderRadius: "calc(var(--radius) * 0.5)",
                }}
              >
                {product.category}
              </span>
            )}
            <button
              onClick={handleWishlist}
              className={`transition-colors p-2 ${
                isWishlisted
                  ? "text-red-500"
                  : "text-slate-300 hover:text-red-500"
              }`}
              aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-black mb-4 leading-tight"
            style={{ color: "var(--h-color)" }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <Star size={16} className="text-amber-400" fill="currentColor" />
              <span className="font-black text-sm text-amber-700">
                {(product.averageRating ?? product.rating ?? 0).toFixed(1)}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400 border-r pr-4 border-slate-200">
              ({product.reviewCount ?? 0} تقييم من العملاء)
            </span>
            <span className="text-green-600 font-black text-[10px] bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />{" "}
              متوفر الآن
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 border-r-4 border-slate-300 pr-4">
              {product.description}
            </p>
          )}

          {/* Price Section */}
          <div
            className="p-6 mb-6 border border-slate-300 flex items-center justify-between bg-slate-50"
            style={{ borderRadius: "var(--radius)" }}
          >
            <div className="space-y-1">
              <span
                className="text-4xl font-black transition-all duration-300"
                style={{ color: "var(--p-color)" }}
              >
                {displayPrice.toLocaleString()} ر.س
              </span>
              {savings > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 font-bold line-through">
                    {displayComparePrice!.toLocaleString()} ر.س
                  </span>
                  <span className="text-[10px] font-black text-red-500">
                    وفرت {savings.toLocaleString()} ر.س
                  </span>
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                السعر شامل الضريبة
              </div>
            </div>
          </div>

          {/* Variant Selector */}
          {hasVariants && product.options && product.variants && (
            <VariantSelector
              options={product.options}
              variants={product.variants}
              selectedOptions={selectedOptions}
              onSelect={handleOptionSelect}
            />
          )}

          {/* Offers */}
          {product.offers && product.offers.length > 0 && (
            <div className="mb-8 space-y-4">
              <h4 className="text-sm font-black flex items-center gap-2">
                <Tag size={18} style={{ color: "var(--p-color)" }} />
                عروض التوفير الحصرية:
              </h4>
              <div className="grid gap-3">
                {product.offers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOffer(offer.id)}
                    className={`relative p-4 border-2 cursor-pointer transition-all flex items-center justify-between overflow-hidden ${
                      selectedOffer === offer.id
                        ? "border-(--p-color) bg-blue-50/50"
                        : "border-slate-300 hover:border-slate-200 bg-white"
                    }`}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {offer.badge && (
                      <div className="absolute -left-8 top-2 bg-amber-500 text-white text-[8px] font-black py-1 px-10 -rotate-45">
                        {offer.badge}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOffer === offer.id
                            ? "border-(--p-color)"
                            : "border-slate-200"
                        }`}
                      >
                        {selectedOffer === offer.id && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: "var(--p-color)" }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black">{offer.title}</div>
                        {offer.description && (
                          <div className="text-[10px] font-bold text-slate-400">
                            {offer.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-md font-black">
                      {Number(offer.price)} ر.س
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature checklist */}
          <div className="space-y-4 pt-4 border-t mb-8">
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-500" />
                شحن سريع وتوصيل آمن لباب منزلك.
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-500" />
                ضمان جودة أصلي 100% من الوكيل.
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-500" />
                إمكانية الاستبدال والاسترجاع السهل.
              </li>
            </ul>
          </div>

          {/* Add to cart CTA */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={
                isOutOfStock ||
                (hasVariants &&
                  Object.keys(selectedOptions).length <
                    (product.options?.length ?? 0))
              }
              className="grow py-5 text-white font-black text-lg shadow-xl transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
              style={{
                backgroundColor: isOutOfStock ? "#94a3b8" : "var(--p-color)",
                borderRadius: "var(--radius)",
              }}
            >
              {isOutOfStock ? (
                <>
                  <AlertCircle size={22} />
                  نفد المخزون
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={22}
                    className="group-hover:animate-bounce"
                  />
                  إضافة للسلة
                </>
              )}
            </button>
          </div>

          {selectedOffer && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase">
              <Zap size={12} className="text-amber-500" /> ينتهي هذا العرض
              قريباً
            </div>
          )}
        </div>
      </div>

      {/* Auth modal — wishlist path */}
      {showAuthModal && (
        <AuthPromptModal
          type="wishlist"
          onLogin={navigateToLogin}
          onRegister={navigateToRegister}
          onClose={closeAuthModal}
        />
      )}
    </>
  );
}
