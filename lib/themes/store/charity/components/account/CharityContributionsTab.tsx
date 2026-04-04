"use client";

import React from "react";
import Link from "next/link";
import { useAccountContext } from "@/lib/themes/store/default/components/account/AccountContext";
import CharityContributionCard from "./CharityContributionCard";

/**
 * Charity-specific contributions tab — replaces commercial "طلباتي" language
 * with donation-centric copy ("تبرعاتي", "مساهمات", etc.).
 */
export default function CharityContributionsTab() {
  const { orders, storeSlug } = useAccountContext();

  return (
    <div>
      <h2 className="text-3xl font-black mb-6">سجل المساهمات</h2>
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        {!orders || orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-300">
              <span className="text-3xl">🤲</span>
            </div>
            <p className="font-bold text-lg">لا توجد تبرعات بعد</p>
            <p className="text-sm mt-2">ساهم الآن في مشاريعنا الخيرية</p>
            <Link
              href={`/store/${storeSlug}`}
              className="inline-block mt-4 px-6 py-3 bg-[var(--p-color)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              تصفح المشاريع
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <CharityContributionCard
                key={order.id}
                order={order}
                storeSlug={storeSlug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
