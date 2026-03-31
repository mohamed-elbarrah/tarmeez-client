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
import type { CheckoutFieldConfig } from "@/lib/types/auth";
import type { CheckoutContextValue, AppliedCoupon } from "./CheckoutContext";

// ─── Re-export for consumers ───────────────────────────────────────────────────
export type { CheckoutFieldConfig };

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CHECKOUT_FIELDS: CheckoutFieldConfig[] = [
  {
    id: "name",
    type: "text",
    label: "الاسم الكامل",
    placeholder: "أدخل اسمك الكامل",
    enabled: true,
    required: true,
    isCustom: false,
    sortOrder: 0,
  },
  {
    id: "phone",
    type: "phone",
    label: "رقم الجوال",
    placeholder: "9665xxxxxxxx",
    enabled: true,
    required: true,
    isCustom: false,
    sortOrder: 1,
  },
  {
    id: "email",
    type: "email",
    label: "البريد الإلكتروني",
    placeholder: "example@mail.com",
    enabled: true,
    required: false,
    isCustom: false,
    sortOrder: 2,
  },
  {
    id: "address",
    type: "address",
    label: "العنوان",
    placeholder: "",
    enabled: true,
    required: true,
    isCustom: false,
    sortOrder: 3,
  },
];

function normalizeConfig(
  raw?: CheckoutFieldConfig[] | null,
): CheckoutFieldConfig[] {
  if (!raw || !Array.isArray(raw) || raw.length === 0)
    return DEFAULT_CHECKOUT_FIELDS;
  return [...raw].sort((a, b) => a.sortOrder - b.sortOrder);
}

// ─── Form values ───────────────────────────────────────────────────────────────

export interface CheckoutFormValues {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city?: string;
  region?: string;
  street?: string;
  notes?: string;
  [key: string]: string | undefined;
}

// ─── Map field.id → core form key ─────────────────────────────────────────────

const FIELD_TO_FORM_KEY: Record<string, keyof CheckoutFormValues> = {
  name: "customerName",
  phone: "customerPhone",
  email: "customerEmail",
};

export function fieldToFormKey(fieldId: string): string {
  return (FIELD_TO_FORM_KEY[fieldId] as string) ?? fieldId;
}

// ─── Dynamic Zod schema builder ───────────────────────────────────────────────

function buildCheckoutSchema(fields: CheckoutFieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    customerName: z.string(),
    customerPhone: z.string(),
    customerEmail: z.string().optional().or(z.literal("")),
    city: z.string().optional(),
    region: z.string().optional(),
    street: z.string().optional(),
    notes: z.string().optional(),
  };

  for (const field of fields) {
    if (!field.enabled) continue;
    switch (field.id) {
      case "name":
        shape.customerName = field.required
          ? z.string().min(3, `${field.label} يجب أن يكون 3 أحرف على الأقل`)
          : z.string();
        break;
      case "phone":
        shape.customerPhone = field.required
          ? z.string().min(10, `${field.label} غير صحيح`)
          : z.string();
        break;
      case "email":
        shape.customerEmail = field.required
          ? z.string().email(`${field.label} غير صحيح`)
          : z
              .string()
              .email(`${field.label} غير صحيح`)
              .optional()
              .or(z.literal(""));
        break;
      case "address":
        // sub-fields enforced via setError in onFormSubmit
        break;
      default:
        shape[field.id] = field.required
          ? z.string().min(1, `${field.label} مطلوب`)
          : z.string().optional().or(z.literal(""));
    }
  }

  return z.object(shape);
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useCheckoutFlow(
  storeSlug: string,
  rawConfig?: CheckoutFieldConfig[] | null,
): CheckoutContextValue {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.carts[storeSlug]?.items ?? []);
  const isDonationOnly = cart.length > 0 && cart.every((i) => i.isDonation);

  const checkoutFields = normalizeConfig(rawConfig);
  const addrField = checkoutFields.find((f) => f.id === "address");
  const addrRequired =
    !isDonationOnly &&
    (addrField?.enabled ?? true) &&
    (addrField?.required ?? true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(buildCheckoutSchema(checkoutFields)) as any,
  });

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [validateCoupon, { isLoading: isValidating }] =
    useValidateCouponMutation();

  // ── Analytics ────────────────────────────────────────────────────────────
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

    if (addrRequired) {
      let valid = true;
      if (!data.city || data.city.length < 2) {
        setError("city", {
          message: `${addrField?.label ?? "العنوان"} — المدينة مطلوبة`,
        });
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

    // Build customFields map for merchant-defined custom fields
    const customFields: Record<string, string> = {};
    for (const f of checkoutFields) {
      if (!f.isCustom || !f.enabled) continue;
      const val = (data as Record<string, string | undefined>)[f.id];
      if (val?.trim()) customFields[f.id] = val.trim();
    }

    // Address field — only include when enabled
    const addrEnabled = addrField?.enabled ?? true;
    const shippingAddress = addrEnabled
      ? { city: data.city, region: data.region, street: data.street }
      : undefined;

    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      shippingAddress,
      paymentMethod: "cash_on_delivery",
      items: cart.map((i) => ({
        productId: String(i.id),
        quantity: i.quantity,
      })),
      notes: data.notes || undefined,
      storeSlug: String(storeSlug),
      ...(Object.keys(customFields).length > 0 ? { customFields } : {}),
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
    checkoutFields,
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
