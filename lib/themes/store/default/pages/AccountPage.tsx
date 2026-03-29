"use client";

import React from "react";
import { Package, Truck, Heart, Settings, LogOut } from "lucide-react";
import { ThemeTokens } from "@/lib/themes/types";
import { useAccountPage } from "../components/account/useAccountPage";
import { AccountContextProvider, AccountTab } from "../components/account/AccountContext";
import OrdersTab from "../components/account/OrdersTab";
import TrackingTab from "../components/account/TrackingTab";
import WishlistTab from "../components/account/WishlistTab";
import ProfileSettingsForm from "../components/account/ProfileSettingsForm";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
  activityType?: "RETAIL" | "CHARITY";
}

const TABS: { id: AccountTab; labelRetail: string; labelCharity: string; icon: React.ReactNode }[] = [
  { id: "orders",   labelRetail: "طلباتي الأخيرة",    labelCharity: "تبرعاتي",              icon: <Package size={18} /> },
  { id: "tracking", labelRetail: "تتبع حالة طلبي",    labelCharity: "تتبع حالة تبرعي",     icon: <Truck   size={18} /> },
  { id: "wishlist", labelRetail: "منتجاتي المفضلة",   labelCharity: "منتجاتي المفضلة",     icon: <Heart   size={18} /> },
  { id: "settings", labelRetail: "إعدادات الحساب",    labelCharity: "إعدادات الحساب",      icon: <Settings size={18} /> },
];

/**
 * Orchestrator — bootstraps AccountContext and delegates render to tab organisms.
 * Zero business logic: all API calls, auth redirect, and side-effects live in useAccountPage.
 */
export default function AccountPage({ storeSlug, activityType }: Props) {
  const isCharity = activityType === "CHARITY";
  const { profileLoading, profileError, ...accountValue } = useAccountPage(storeSlug, isCharity);

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
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--p-color)] to-blue-400 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-lg">
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
              {tab.icon} {isCharity ? tab.labelCharity : tab.labelRetail}
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
          {activeTab === "orders"   && <OrdersTab />}
          {activeTab === "tracking" && <TrackingTab />}
          {activeTab === "wishlist" && <WishlistTab />}
          {activeTab === "settings" && <ProfileSettingsForm />}
        </div>
      </main>
    </AccountContextProvider>
  );
}
