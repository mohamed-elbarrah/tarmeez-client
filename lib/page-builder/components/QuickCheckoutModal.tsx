"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateOrderMutation } from "@/lib/services/ordersApi";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  customerPhone: z.string().min(8, "رقم الهاتف غير صحيح"),
  city: z.string().min(2, "المدينة مطلوبة"),
  street: z.string().min(5, "العنوان مطلوب"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  storeSlug: string;
}

export const QuickCheckoutModal = ({
  isOpen,
  onClose,
  product,
  storeSlug,
}: QuickCheckoutModalProps) => {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const result = await createOrder({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        shippingAddress: {
          city: data.city,
          street: data.street,
          region: "-",
        },
        paymentMethod: "cash_on_delivery",
        items: [{ productId: product.id, quantity: 1 }],
        storeSlug,
      }).unwrap();

      setOrderCode(result.orderCode || result.id);
      toast.success("تم إرسال طلبك بنجاح!");
      reset();
    } catch (error) {
      toast.error("حدث خطأ أثناء إتمام الطلب، يرجى المحاولة لاحقاً");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl  ">
        {orderCode ? (
          <div className="flex flex-col items-center gap-6 p-10 text-center bg-white">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl">
              ✅
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-[var(--h-color)]">
                شكراً لك! تم استلام طلبك
              </h2>
              <p className="text-[var(--t-color)] opacity-70">
                رقم الطلب الخاص بك هو:
              </p>
              <span className="text-2xl font-mono font-bold text-[var(--p-color)]">
                {orderCode}
              </span>
            </div>
            <p className="text-sm text-[var(--t-color)] opacity-60">
              سيقوم فريقنا بالتواصل معك قريباً لتأكيد الطلب
            </p>
            <button
              onClick={() => {
                setOrderCode(null);
                onClose();
              }}
              className="w-full py-3 bg-[var(--b-color)] text-white font-bold rounded-xl"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-8 bg-white">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold text-[var(--h-color)]">
                إتمام الطلب السريع
              </DialogTitle>
            </DialogHeader>

            {/* Product Summary */}
            <div className="flex items-center gap-4 p-4 bg-[var(--color-bg,#f8fafc)] rounded-2xl">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex flex-col text-right">
                <span className="font-bold text-[var(--h-color)]">
                  {product.name}
                </span>
                <span className="text-[var(--p-color)] font-bold">
                  {new Intl.NumberFormat("ar-SA", {
                    style: "currency",
                    currency: "SAR",
                  }).format(product.price)}
                </span>
              </div>
            </div>

            {/* Checkout Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 text-right"
              dir="rtl"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--h-color)]">
                  الاسم الكامل
                </label>
                <input
                  {...register("customerName")}
                  className={cn(
                    "p-3 rounded-xl bg-white border border-[var(--p-color)]/20 focus:outline-none focus:border-[var(--p-color)]",
                    errors.customerName && "border-red-500",
                  )}
                  placeholder="أدخل اسمك بالكامل"
                />
                {errors.customerName && (
                  <span className="text-xs text-red-500">
                    {errors.customerName.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--h-color)]">
                  رقم الهاتف
                </label>
                <input
                  {...register("customerPhone")}
                  className={cn(
                    "p-3 rounded-xl bg-white border border-[var(--p-color)]/20 focus:outline-none focus:border-[var(--p-color)]",
                    errors.customerPhone && "border-red-500",
                  )}
                  placeholder="مثال: 05XXXXXXXX"
                />
                {errors.customerPhone && (
                  <span className="text-xs text-red-500">
                    {errors.customerPhone.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--h-color)]">
                    المدينة
                  </label>
                  <input
                    {...register("city")}
                    className={cn(
                      "p-3 rounded-xl bg-white border border-[var(--p-color)]/20 focus:outline-none focus:border-[var(--p-color)]",
                      errors.city && "border-red-500",
                    )}
                    placeholder="المدينة"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--h-color)]">
                    الحي / الشارع
                  </label>
                  <input
                    {...register("street")}
                    className={cn(
                      "p-3 rounded-xl bg-white border border-[var(--p-color)]/20 focus:outline-none focus:border-[var(--p-color)]",
                      errors.street && "border-red-500",
                    )}
                    placeholder="اسم الحي والشارع"
                  />
                </div>
              </div>
              {(errors.city || errors.street) && (
                <span className="text-xs text-red-500">
                  يرجى إكمال تفاصيل العنوان
                </span>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full py-4 bg-[var(--b-color)] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "جاري إتمام الطلب..." : "تأكيد الطلب الآن"}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickCheckoutModal;
