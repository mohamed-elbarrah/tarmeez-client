export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "قيد الانتظار",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  CONFIRMED: { label: "تم التأكيد", color: "text-blue-600", bg: "bg-blue-50" },
  PROCESSING: {
    label: "قيد التجهيز",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  SHIPPED: { label: "تم الشحن", color: "text-purple-600", bg: "bg-purple-50" },
  DELIVERED: {
    label: "تم التوصيل",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  CANCELLED: { label: "ملغي", color: "text-red-600", bg: "bg-red-50" },
  REFUNDED: { label: "مسترجع", color: "text-gray-600", bg: "bg-gray-50" },
};

export const TRACKING_STEPS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];
