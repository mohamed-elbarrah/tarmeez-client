"use client";

import React from "react";
import { Truck } from "lucide-react";
import { useAccountContext } from "./AccountContext";
import { ORDER_STATUS_MAP, TRACKING_STEPS } from "./orderStatusMap";

/**
 * Dumb organism — reads from AccountContext, renders per-order tracking bars.
 */
export default function TrackingTab() {
  const { orders } = useAccountContext();

  return (
    <div>
      <h2 className="text-3xl font-black mb-6">تتبع حالة طلبي</h2>
      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <Truck className="mx-auto mb-4" size={48} />
          <p className="font-bold text-lg">لا توجد طلبات للتتبع</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const status =
              ORDER_STATUS_MAP[order.status] ?? ORDER_STATUS_MAP.PENDING;
            const isCancelled =
              order.status === "CANCELLED" || order.status === "REFUNDED";
            const currentStepIndex = TRACKING_STEPS.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="font-black text-lg">
                      طلب رقم #{order.orderCode}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-left">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${status.bg} ${status.color}`}
                    >
                      {status.label}
                    </span>
                    <div className="text-sm font-black text-[var(--p-color)] mt-1">
                      {order.total?.toLocaleString()} ر.س
                    </div>
                  </div>
                </div>

                {!isCancelled && (
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      {TRACKING_STEPS.map((step, i) => {
                        const stepInfo = ORDER_STATUS_MAP[step];
                        const isActive = i <= currentStepIndex;
                        const isCurrent = i === currentStepIndex;
                        return (
                          <div
                            key={step}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isCurrent
                                  ? "bg-[var(--p-color)] text-white shadow-lg scale-110"
                                  : isActive
                                    ? "bg-[var(--p-color)] text-white"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {i + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold mt-2 text-center ${isActive ? "text-[var(--p-color)]" : "text-gray-400"}`}
                            >
                              {stepInfo.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-4 right-8 left-8 h-0.5 bg-gray-100 -z-0">
                      <div
                        className="h-full bg-[var(--p-color)] transition-all"
                        style={{
                          width: `${Math.max(0, (currentStepIndex / (TRACKING_STEPS.length - 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div
                    className={`p-4 rounded-xl text-sm font-bold text-center ${status.bg} ${status.color}`}
                  >
                    {order.status === "CANCELLED"
                      ? "تم إلغاء هذا الطلب"
                      : "تم استرجاع هذا الطلب"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
