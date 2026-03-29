"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCustomerMeQuery,
  useGetOrdersQuery,
  useCustomerLogoutMutation,
} from "@/lib/services/customerApi";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/lib/services/wishlistApi";
import { AccountContextValue, AccountTab } from "./AccountContext";

export type UseAccountPageReturn = AccountContextValue & {
  profileLoading: boolean;
  profileError: boolean;
};

/**
 * All account-page logic: auth redirect, profile/orders/wishlist fetching,
 * logout, wishlist removal, and tab switching.
 * Returns AccountContextValue plus lifecycle flags for the orchestrator.
 */
export function useAccountPage(
  storeSlug: string,
  isCharity: boolean,
): UseAccountPageReturn {
  const [activeTab, setActiveTab] = useState<AccountTab>("orders");
  const router = useRouter();
  const storeBase = `/store/${storeSlug}`;

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetCustomerMeQuery();
  const { data: orders } = useGetOrdersQuery();
  const { data: wishlistItems } = useGetWishlistQuery(storeSlug);
  const [toggleWishlist] = useToggleWishlistMutation();
  const [logoutMutation] = useCustomerLogoutMutation();

  useEffect(() => {
    if (!profileLoading && profileError) {
      router.push(`${storeBase}/login?redirect=${storeBase}/account`);
    }
  }, [profileLoading, profileError, router, storeBase]);

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } catch {
      // ignore — always redirect
    }
    router.push(storeBase);
  };

  const handleRemoveWishlist = async (productId: string) => {
    await toggleWishlist({ productId, storeSlug });
  };

  return {
    storeSlug,
    isCharity,
    profile,
    orders,
    wishlistItems,
    activeTab,
    setActiveTab,
    handleLogout,
    handleRemoveWishlist,
    profileLoading,
    profileError,
  };
}
