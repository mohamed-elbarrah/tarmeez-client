"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";

export default function StorefrontLayout({
  children,
  store
}: {
  children: React.ReactNode;
  store?: any;
}) {
  const storeUrl = store ? `/store/${store.slug}` : "/store";
  const storeName = store?.name || "متجري";

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Main Content */}
      <main>
        {children}
      </main>

    </div>
  );
}
