"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cartSlice";
import { useToggleWishlistMutation } from "@/lib/services/wishlistApi";
import { useGetCustomerMeQuery } from "@/lib/services/customerApi";
import type { ProductVariant, StoreProduct } from "@/lib/themes/types";
import { useProductContext } from "./ProductContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthModalType = "wishlist" | "review";

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Encapsulates all interactive logic for the product-info section:
 * variant selection, add-to-cart, wishlist, offer selection, and image gallery.
 *
 * Zero JSX — pure logic / RTK bridge.
 */
export function useProductActions() {
  const { product, storeSlug } = useProductContext();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: customerProfile } = useGetCustomerMeQuery();
  const customer = customerProfile ?? null;

  // ── Variant selection ──────────────────────────────────────────────────────

  const hasVariants = !!(product.options?.length && product.variants?.length);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    if (!product.options?.length) return {};
    const initial: Record<string, string> = {};
    for (const opt of product.options) {
      if (opt.values.length > 0) {
        initial[opt.name] = opt.values[0].value;
      }
    }
    return initial;
  });

  const activeVariant = useMemo<ProductVariant | null>(() => {
    if (!hasVariants || !product.variants) return null;
    const selectionCount = Object.keys(selectedOptions).length;
    if (selectionCount === 0) return null;
    return (
      product.variants.find(
        (v) =>
          v.isActive &&
          v.optionValues.length === selectionCount &&
          Object.values(selectedOptions).every((val) =>
            v.optionValues.some((ov) => ov.optionValue.value === val),
          ),
      ) ?? null
    );
  }, [selectedOptions, product.variants, hasVariants]);

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  // ── Resolved prices ────────────────────────────────────────────────────────

  const displayPrice = activeVariant?.price ?? product.price;

  // When a variant is active, ONLY use that variant's own comparePrice.
  // Falling back to the base product price would show a misleading "was X" badge.
  const displayComparePrice = activeVariant
    ? (activeVariant.comparePrice ?? null)
    : (product.comparePrice ?? product.oldPrice ?? null);

  const savings =
    displayComparePrice && displayComparePrice > displayPrice
      ? displayComparePrice - displayPrice
      : 0;

  const discountPercent =
    savings > 0 ? Math.round((savings / displayComparePrice!) * 100) : 0;

  // ── Stock ──────────────────────────────────────────────────────────────────

  const isOutOfStock =
    hasVariants && activeVariant !== null
      ? activeVariant.quantity <= 0
      : !hasVariants && product.quantity !== undefined
        ? product.quantity <= 0
        : false;

  // ── Offers ─────────────────────────────────────────────────────────────────

  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  // ── Image gallery ──────────────────────────────────────────────────────────

  const productImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (activeVariant?.image) {
      const idx = productImages.indexOf(activeVariant.image);
      setSelectedImage(idx >= 0 ? idx : 0);
    }
    // productImages is derived from product.images/image which is stable — intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVariant?.image]);

  // ── Wishlist ───────────────────────────────────────────────────────────────

  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted ?? false,
  );
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleWishlist = async () => {
    if (!customer) {
      setShowAuthModal(true);
      return;
    }
    try {
      const result = await toggleWishlist({
        productId: String(product.id),
        storeSlug,
      }).unwrap();
      setIsWishlisted(result.wishlisted);
      toast.success(
        result.wishlisted ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة",
      );
    } catch {
      toast.error("حدث خطأ");
    }
  };

  // ── Auth modal (wishlist auth only) ────────────────────────────────────────

  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigateToLogin = () => {
    router.push(
      `/store/${storeSlug}/login?redirect=/store/${storeSlug}/product/${encodeURIComponent(
        product.slug || String(product.id),
      )}`,
    );
  };

  const navigateToRegister = () => {
    router.push(`/store/${storeSlug}/register`);
  };

  // ── Add to cart ────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    if (hasVariants && !activeVariant) {
      toast.error("يرجى اختيار المواصفات أولاً");
      return;
    }
    if (isOutOfStock) {
      toast.error("هذا المنتج غير متوفر في المخزن حالياً");
      return;
    }
    const selectedOptionsLabel = Object.entries(selectedOptions)
      .map(([, v]) => v)
      .join(" / ");

    dispatch(
      addItem({
        storeSlug,
        item: {
          id: product.id,
          name: selectedOptionsLabel
            ? `${product.name} — ${selectedOptionsLabel}`
            : product.name,
          price: displayPrice,
          image: activeVariant?.image || productImages[0] || "",
          quantity: 1,
          variantId: activeVariant?.id,
          selectedOptions: Object.keys(selectedOptions).length
            ? selectedOptions
            : undefined,
        },
      }),
    );
    toast.success("تمت الإضافة للسلة");
  };

  // ── Exposed API ────────────────────────────────────────────────────────────

  return {
    // Variant
    hasVariants,
    selectedOptions,
    activeVariant,
    handleOptionSelect,
    // Prices
    displayPrice,
    displayComparePrice,
    savings,
    discountPercent,
    // Stock
    isOutOfStock,
    // Offers
    selectedOffer,
    setSelectedOffer,
    // Gallery
    productImages,
    selectedImage,
    setSelectedImage,
    // Wishlist
    isWishlisted,
    handleWishlist,
    // Auth modal
    showAuthModal,
    closeAuthModal: () => setShowAuthModal(false),
    navigateToLogin,
    navigateToRegister,
    // Cart
    handleAddToCart,
    // Customer
    customer,
  } as const;
}
