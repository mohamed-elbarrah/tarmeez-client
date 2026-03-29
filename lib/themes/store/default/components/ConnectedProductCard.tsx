"use client";

import React, { useMemo } from "react";
import { StoreProduct } from "@/lib/themes/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cartSlice";
import { ActivityContextManager } from "@/lib/core/ActivityContextManager";
import { useStoreCurrency } from "@/lib/themes/store/default/context/StoreSettingsContext";
import ProductCard from "./ProductCard";

interface ConnectedProductCardProps {
  product: StoreProduct;
  storeSlug: string;
}

export default function ConnectedProductCard({
  product,
  storeSlug,
}: ConnectedProductCardProps) {
  const dispatch = useAppDispatch();
  const { currencySymbol } = useStoreCurrency();

  const contextManager = useMemo(
    () => new ActivityContextManager("RETAIL"),
    [],
  );

  const displayImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : null);

  const handlePrimaryAction = () => {
    dispatch(
      addItem({
        storeSlug,
        item: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: displayImage || "",
          quantity: 1,
        },
      }),
    );
  };

  return (
    <ProductCard
      id={product.id}
      title={product.name}
      description={product.description ?? undefined}
      imageUrl={displayImage}
      priceAmount={product.price.toLocaleString()}
      currency={currencySymbol}
      discountBadge={product.discount ? `خصم ${product.discount}` : undefined}
      primaryActionText={contextManager.getPrimaryActionLabel()}
      productUrl={contextManager.formatProductUrl(storeSlug, product)}
      onPrimaryAction={handlePrimaryAction}
    />
  );
}
