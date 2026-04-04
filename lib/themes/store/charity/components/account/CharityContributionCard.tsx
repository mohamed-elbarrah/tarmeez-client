"use client";

import React, { useState } from "react";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { ORDER_STATUS_MAP } from "@/lib/themes/store/default/components/account/orderStatusMap";

interface Props {
  order: any;
  storeSlug: string;
}

/**
 * Charity contribution card — no commercial invoice language.
 * No shipping address display. Uses donation-centric labels.
 * Amounts formatted with en-US locale (Western Arabic numerals).
 */
export default function CharityContributionCard({ order }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = ORDER_STATUS_MAP[order.status] ?? ORDER_STATUS_MAP.PENDING;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="font-black text-sm">تبرع رقم #{order.orderCode}</div>
          <div className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("ar-SA-u-nu-latn", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-400">
            {order.items?.length ?? 0} مشاريع
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs font-black px-3 py-1 rounded-full ${status.bg} ${status.color}`}
          >
            {status.label}
          </span>
          <span className="text-sm font-black text-[var(--p-color)]">
            {order.total?.toLocaleString("en-US")} ر.س
          </span>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-[var(--p-color)] font-bold mt-3 hover:underline"
      >
        <Eye size={14} /> {expanded ? "إخفاء التفاصيل" : "عرض تفاصيل المساهمة"}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && order.items && (
        <div className="mt-4 space-y-3">
          {order.items.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-green-50 rounded-xl p-3"
            >
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-14 h-14 object-cover rounded-lg"
                />
              )}
              <div className="flex-grow">
                <div className="font-bold text-sm">{item.productName}</div>
                <span className="text-xs text-green-600 font-bold">
                  مشروع خيري
                </span>
              </div>
              <div className="font-black text-sm text-[var(--p-color)]">
                {item.total?.toLocaleString("en-US")} ر.س
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
