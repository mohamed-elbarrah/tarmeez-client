"use client";

import React, { useState } from "react";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { ORDER_STATUS_MAP } from "./orderStatusMap";

interface Props {
  order: any;
  storeSlug: string;
  isCharity: boolean;
}

/**
 * Expandable order card — self-contained expand/collapse state.
 * Receives a single order as a plain serializable prop.
 */
export default function OrderCard({
  order,
  storeSlug: _storeSlug,
  isCharity,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = ORDER_STATUS_MAP[order.status] ?? ORDER_STATUS_MAP.PENDING;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="font-black text-sm">
            {isCharity ? "تبرع" : "طلب"} رقم #{order.orderCode}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-400">
            {order.items?.length ?? 0} {isCharity ? "مشاريع" : "منتجات"}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs font-black px-3 py-1 rounded-full ${status.bg} ${status.color}`}
          >
            {status.label}
          </span>
          <span className="text-sm font-black text-[var(--p-color)]">
            {order.total?.toLocaleString()} ر.س
          </span>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-[var(--p-color)] font-bold mt-3 hover:underline"
      >
        <Eye size={14} /> {expanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && order.items && (
        <div className="mt-4 space-y-3">
          {order.items.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
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
                <div className="text-xs text-gray-400">
                  الكمية: {item.quantity}
                </div>
              </div>
              <div className="font-black text-sm text-[var(--p-color)]">
                {item.total?.toLocaleString()} ر.س
              </div>
            </div>
          ))}
          {order.shippingAddress && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">
              <span className="font-bold text-gray-700">عنوان التوصيل: </span>
              {order.shippingAddress.street}، {order.shippingAddress.city}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
