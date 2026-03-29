"use client";

import React, { createContext, useContext } from "react";

export type AccountTab = "orders" | "tracking" | "wishlist" | "settings";

export interface AccountContextValue {
  storeSlug: string;
  isCharity: boolean;
  profile: any;
  orders: any[] | undefined;
  wishlistItems: any[] | undefined;
  activeTab: AccountTab;
  setActiveTab: (tab: AccountTab) => void;
  handleLogout: () => void;
  handleRemoveWishlist: (productId: string) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountContextProvider({
  value,
  children,
}: {
  value: AccountContextValue;
  children: React.ReactNode;
}) {
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccountContext(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx)
    throw new Error(
      "useAccountContext must be used within AccountContextProvider",
    );
  return ctx;
}
