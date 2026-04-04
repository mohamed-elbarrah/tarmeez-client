"use client";

import React, { useMemo } from "react";
import { StoreProduct } from "@/lib/themes/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cartSlice";
import { ActivityContextManager } from "@/lib/core/ActivityContextManager";
import CharityProductCard from "./CharityProductCard";
import { Heart } from "lucide-react";

interface ConnectedCharityProductCardProps {
  product: StoreProduct;
  storeSlug: string;
}

export default function ConnectedCharityProductCard({
  product,
  storeSlug,
}: ConnectedCharityProductCardProps) {
  const dispatch = useAppDispatch();

  const contextManager = useMemo(
    () => new ActivityContextManager("CHARITY"),
    [],
  );

  const displayImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : null);

  const handlePrimaryAction = (payload?: { amount?: number }) => {
    const amount = payload?.amount;
    // If it's a charity donation, the price is the amount donated
    const finalPrice = amount !== undefined ? amount : product.price;

    dispatch(
      addItem({
        storeSlug,
        item: {
          id: product.id,
          name: product.name,
          price: finalPrice,
          image: displayImage || "",
          quantity: 1,
          isDonation: true,
        },
      }),
    );
  };

  const primaryActionIcon = (
    <Heart size={18} fill="currentColor" className="animate-pulse" />
  );

  return (
    <CharityProductCard
      id={product.id}
      title={product.name}
      description={product.description}
      imageUrl={displayImage}
      displayPrice={contextManager.getPricingDisplay(product)}
      primaryActionText={contextManager.getPrimaryActionLabel()}
      primaryActionIcon={primaryActionIcon}
      productUrl={contextManager.formatProductUrl(storeSlug, product)}
      progressBarPercent={contextManager.getProgressBarPercent(product)}
      progressMessage={contextManager.getProgressMessage(product)}
      goalDisplay={contextManager.getGoalDisplay(product)}
      collectedDisplay={contextManager.getCollectedDisplay(product)}
      donationPresets={contextManager.getDonationPresets(product)}
      allowCustomAmount={contextManager.getAllowCustomAmount(product)}
      badgeText={contextManager.getBadgeText(product)}
      onPrimaryAction={handlePrimaryAction}
    />
  );
}
