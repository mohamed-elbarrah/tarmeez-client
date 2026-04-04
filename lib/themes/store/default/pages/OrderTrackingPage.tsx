"use client";

import React, { useState } from "react";
import { useTrackOrderQuery } from "@/lib/services/ordersApi";
import { useSearchParams } from "next/navigation";
import { ThemeTokens } from "@/lib/themes/types";

interface Props {
  theme: ThemeTokens;
  storeSlug: string;
}

export default function OrderTrackingPage({ theme, storeSlug }: Props) {
  const params = useSearchParams();
  const initialCode = params.get("code") || "";
  const [code, setCode] = useState(initialCode);
  const { data, isLoading, refetch } = useTrackOrderQuery(
    { orderCode: code, storeSlug },
    { skip: !code },
  );

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-black mb-6">تتبع الطلب</h1>
      <div className="flex gap-2 mb-6">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="p-4 border rounded-2xl flex-grow bg-white shadow-sm outline-none focus:ring-2 focus:ring-[var(--p-color)]"
          placeholder="أدخل رمز الطلب (مثال: #12345)"
        />
        <button
          onClick={() => refetch()}
          className="px-8 py-4 bg-[var(--p-color)] text-white rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          تتبع
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-10 text-gray-400 font-bold">
          جاري البحث...
        </div>
      )}

      {data && (
        <div className="bg-white p-8 border rounded-3xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-6">
            <div className="font-black text-xl">طلب رقم #{data.orderCode}</div>
            <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-black text-sm">
              {data.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                تفاصيل العميل
              </h4>
              <div className="font-bold">{data.customerName}</div>
              <div className="text-gray-500">{data.customerPhone}</div>
            </div>
            <div className="space-y-4">
              <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                عنوان التوصيل
              </h4>
              <div className="font-medium text-gray-600">
                {data.shippingAddress?.street}, {data.shippingAddress?.city}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-between items-center">
            <span className="font-bold text-gray-400">إجمالي الطلب:</span>
            <span className="text-2xl font-black text-[var(--p-color)]">
              {data.total.toLocaleString()} ر.س
            </span>
          </div>
        </div>
      )}

      {!isLoading && !data && code && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">
          لم يتم العثور على الطلب، تحقق من الرمز المكتوب.
        </div>
      )}
    </div>
  );
}
