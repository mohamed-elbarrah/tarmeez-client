"use client";

import React from "react";
import { Package, Settings, LogOut } from "lucide-react";
import { ThemeTokens } from "@/lib/themes/types";
import { useAccountPage } from "@/lib/themes/store/default/components/account/useAccountPage";
import { AccountContextProvider } from "@/lib/themes/store/default/components/account/AccountContext";
import type { AccountTab } from "@/lib/themes/store/default/components/account/AccountContext";
import CharityContributionsTab from "./CharityContributionsTab";
import WishlistTab from "@/lib/themes/store/default/components/account/WishlistTab";
import ProfileSettingsForm from "@/lib/themes/store/default/components/account/ProfileSettingsForm";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
}

const TABS: { id: AccountTab; label: string; icon: React.ReactNode }[] = [
  { id: "orders", label: "سجل المساهمات", icon: <Package size={18} /> },
  { id: "wishlist", label: "المفضلة", icon: <Package size={18} /> },
  { id: "settings", label: "إعدادات الحساب", icon: <Settings size={18} /> },
];

/**
 * Charity account page — "Orders" tab replaced with "Contributions" (سجل المساهمات).
 * No shipping/tracking tab — irrelevant for charity.
 */
export default function CharityAccountPage({ storeSlug }: Props) {
  const { profileLoading, profileError, ...accountValue } = useAccountPage(
    storeSlug,
    true,
  );

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--p-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileError) return null;

  const { activeTab, setActiveTab, handleLogout, profile } = accountValue;

  return (
    <AccountContextProvider value={accountValue}>
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-3">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center mb-6 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--p-color)] to-green-400 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-lg">
              {(profile?.fullName || " ")[0] ?? "؟"}
            </div>
            <h3 className="font-black text-lg">{profile?.fullName ?? "---"}</h3>
            <p className="text-xs text-gray-400">{profile?.email ?? ""}</p>
          </div>

          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--p-color)] text-white shadow-lg"
                  : "bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-grow space-y-8">
          {activeTab === "orders" && <CharityContributionsTab />}
          {activeTab === "wishlist" && <WishlistTab />}
          {activeTab === "settings" && <ProfileSettingsForm />}
        </div>
      </main>
    </AccountContextProvider>
  );
}
