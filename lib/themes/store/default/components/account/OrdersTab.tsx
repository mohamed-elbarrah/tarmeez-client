"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAccountContext } from "./AccountContext";
import OrderCard from "./OrderCard";

/**
 * Dumb organism — reads from AccountContext, renders the orders list.
 */
export default function OrdersTab() {
  const { orders, storeSlug, isCharity } = useAccountContext();

  return (
    <div>
      <h2 className="text-3xl font-black mb-6">
        {isCharity ? "تبرعاتي" : "طلباتي الأخيرة"}
      </h2>
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        {!orders || orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ShoppingBag className="mx-auto mb-4" size={48} />
            <p className="font-bold text-lg">
              {isCharity ? "لا توجد تبرعات بعد" : "لا توجد طلبات بعد"}
            </p>
            <p className="text-sm mt-2">
              {isCharity
                ? "ساهم الآن في مشاريعنا الخيرية"
                : "ابدأ التسوق الآن واطلب منتجاتك المفضلة"}
            </p>
            <Link
              href={`/store/${storeSlug}/products`}
              className="inline-block mt-4 px-6 py-3 bg-[var(--p-color)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              {isCharity ? "تصفح المشاريع" : "تصفح المنتجات"}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                storeSlug={storeSlug}
                isCharity={isCharity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
