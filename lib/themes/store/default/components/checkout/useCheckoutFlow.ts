"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "@/lib/services/ordersApi";
import { useValidateCouponMutation } from "@/lib/services/couponsApi";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { checkoutStarted } from "@/lib/store/analytics-listener";
import type { CheckoutContextValue, AppliedCoupon } from "./CheckoutContext";

// ─── Schema ────────────────────────────────────────────────────────────────────
// A single permissive schema — address fields are always optional at the schema
// level. Required-field enforcement for non-donation orders happens in onSubmit
// via setError, keeping useForm typed with one concrete value type throughout.

const checkoutFormSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  customerPhone: z.string().min(10, "رقم الجوال غير صحيح"),
  customerEmail: z
    .string()
    .email("بريد إلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  city: z.string().optional(),
  region: z.string().optional(),
  street: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Owns ALL checkout logic: form validation, coupon application, order creation.
 * Returns a CheckoutContextValue ready to be passed into CheckoutContextProvider.
 *
 * Zero JSX — pure logic / RTK bridge.
 */
export function useCheckoutFlow(storeSlug: string): CheckoutContextValue {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.carts[storeSlug]?.items ?? []);
  const isDonationOnly = cart.length > 0 && cart.every((i) => i.isDonation);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [validateCoupon, { isLoading: isValidating }] =
    useValidateCouponMutation();

  // ── Analytics: fire checkout_start once ──────────────────────────────────
  const cartRef = useRef(cart);
  useEffect(() => {
    const subtotal = cartRef.current.reduce(
      (s, i) => s + i.price * i.quantity,
      0,
    );
    dispatch(checkoutStarted({ storeRef: storeSlug, cartTotal: subtotal }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Coupon ────────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    try {
      const result = await validateCoupon({
        code: couponCode.trim(),
        storeSlug,
        orderTotal: subtotal,
        productIds: cart.map((i) => String(i.id)),
      }).unwrap();
      if (result.valid) {
        setAppliedCoupon({
          discount: result.discount,
          message: result.message ?? "تم تطبيق الكوبون",
          code: couponCode.trim().toUpperCase(),
          freeProduct: result.freeProduct,
        });
      } else {
        setCouponError(result.message ?? "كود الخصم غير صالح");
      }
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setCouponError(apiErr?.data?.message ?? "حدث خطأ أثناء التحقق");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  // ── Prices ────────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedCoupon?.discount ?? 0;
  const total = subtotal - discount;

  // ── Submit ────────────────────────────────────────────────────────────────
  const onFormSubmit = async (data: CheckoutFormValues) => {
    if (cart.length === 0) {
      alert("سلة الشراء فارغة");
      return;
    }

    // Required-field enforcement for non-donation orders
    if (!isDonationOnly) {
      let valid = true;
      if (!data.city || data.city.length < 2) {
        setError("city", { message: "المدينة مطلوبة" });
        valid = false;
      }
      if (!data.region || data.region.length < 2) {
        setError("region", { message: "المنطقة مطلوبة" });
        valid = false;
      }
      if (!data.street || data.street.length < 5) {
        setError("street", { message: "يرجى إدخال اسم الشارع بشكل مفصل" });
        valid = false;
      }
      if (!valid) return;
    }

    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      shippingAddress: {
        city: data.city,
        region: data.region,
        street: data.street,
      },
      paymentMethod: "cash_on_delivery",
      items: cart.map((i) => ({
        productId: String(i.id),
        quantity: i.quantity,
      })),
      notes: data.notes,
      storeSlug: String(storeSlug),
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
    };

    try {
      const res: { orderCode: string } = await createOrder(payload).unwrap();
      dispatch(clearCart(storeSlug));
      const successUrl = isDonationOnly
        ? `/store/${storeSlug}/order-success?code=${res.orderCode}&type=donation`
        : `/store/${storeSlug}/order-success?code=${res.orderCode}`;
      router.push(successUrl);
    } catch (err: unknown) {
      const apiErr = err as {
        data?: { message?: string | string[] };
        message?: string;
      };
      const raw = apiErr?.data?.message;
      const errorMessage = Array.isArray(raw)
        ? raw
            .map((m) => (typeof m === "object" ? JSON.stringify(m) : m))
            .join("\n")
        : (raw ?? apiErr?.message ?? "خطأ أثناء إنشاء الطلب");
      alert(errorMessage);
    }
  };

  return {
    storeSlug,
    isDonationOnly,
    subtotal,
    total,
    isLoading,
    isValidating,
    register,
    errors,
    onSubmit: handleSubmit(onFormSubmit),
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
  };
}
