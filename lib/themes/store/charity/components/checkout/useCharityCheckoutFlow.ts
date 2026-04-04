"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "@/lib/services/ordersApi";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { checkoutStarted } from "@/lib/store/analytics-listener";
import type { CheckoutFieldConfig } from "@/lib/types/auth";
import type { CharityCheckoutContextValue } from "./CharityCheckoutContext";

// ─── Re-export for consumers ─────────────────────────────────────────────────
export type { CheckoutFieldConfig };

// ─── Defaults ─────────────────────────────────────────────────────────────────
// Charity default fields: name + phone only — no address, no shipping
export const CHARITY_DEFAULT_FIELDS: CheckoutFieldConfig[] = [
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
];

function normalizeCharityFields(
  raw?: CheckoutFieldConfig[] | null,
): CheckoutFieldConfig[] {
  if (!raw || !Array.isArray(raw) || raw.length === 0)
    return CHARITY_DEFAULT_FIELDS;
  // Strip address & shipping fields — irrelevant for donations
  return [...raw]
    .filter((f) => f.id !== "address" && f.id !== "shipping")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ─── Form values ──────────────────────────────────────────────────────────────

export interface CharityCheckoutFormValues {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  [key: string]: string | undefined;
}

// ─── Map field.id → form key ──────────────────────────────────────────────────

const FIELD_TO_FORM_KEY: Record<string, string> = {
  name: "customerName",
  phone: "customerPhone",
  email: "customerEmail",
};

export function charityFieldToFormKey(fieldId: string): string {
  return FIELD_TO_FORM_KEY[fieldId] ?? fieldId;
}

// ─── Dynamic Zod schema ───────────────────────────────────────────────────────

function buildCharitySchema(fields: CheckoutFieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    customerName: z.string(),
    customerPhone: z.string(),
    customerEmail: z.string().optional().or(z.literal("")),
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
      default:
        shape[field.id] = field.required
          ? z.string().min(1, `${field.label} مطلوب`)
          : z.string().optional().or(z.literal(""));
    }
  }

  return z.object(shape);
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useCharityCheckoutFlow(
  storeSlug: string,
  rawConfig?: CheckoutFieldConfig[] | null,
): CharityCheckoutContextValue {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.carts[storeSlug]?.items ?? []);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const checkoutFields = normalizeCharityFields(rawConfig);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CharityCheckoutFormValues>({
    resolver: zodResolver(buildCharitySchema(checkoutFields)) as any,
  });

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // ── Analytics ─────────────────────────────────────────────────────────────
  const cartRef = useRef(cart);
  useEffect(() => {
    const subtotal = cartRef.current.reduce(
      (s, i) => s + i.price * i.quantity,
      0,
    );
    dispatch(checkoutStarted({ storeRef: storeSlug, cartTotal: subtotal }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Prices ────────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal; // no coupons, no shipping in charity

  // ── Submit ────────────────────────────────────────────────────────────────
  const onFormSubmit = async (data: CharityCheckoutFormValues) => {
    if (cart.length === 0) {
      alert("سلة التبرعات فارغة");
      return;
    }

    // Build customFields map for merchant-defined custom fields
    const customFields: Record<string, string> = {};
    for (const f of checkoutFields) {
      if (!f.isCustom || !f.enabled) continue;
      const val = (data as Record<string, string | undefined>)[f.id];
      if (val?.trim()) customFields[f.id] = val.trim();
    }

    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      // No shippingAddress for donations
      paymentMethod: "cash_on_delivery" as const,
      items: cart.map((i) => ({
        productId: String(i.id),
        quantity: i.quantity,
      })),
      notes: data.notes || undefined,
      storeSlug: String(storeSlug),
      ...(Object.keys(customFields).length > 0 ? { customFields } : {}),
      ...(isAnonymous ? { isAnonymous: true } : {}),
    };

    try {
      const res: { orderCode: string } = await createOrder(payload).unwrap();
      dispatch(clearCart(storeSlug));
      router.push(
        `/store/${storeSlug}/order-success?code=${res.orderCode}&type=donation`,
      );
    } catch (err: unknown) {
      const apiErr = err as {
        data?: { message?: string | string[] };
        message?: string;
      };
      const raw = apiErr?.data?.message ?? apiErr?.message ?? "حدث خطأ";
      alert(Array.isArray(raw) ? raw.join("\n") : raw);
    }
  };

  return {
    storeSlug,
    checkoutFields,
    subtotal,
    total,
    isLoading,
    register,
    errors,
    onSubmit: handleSubmit(onFormSubmit) as unknown as () => void,
    isAnonymous,
    setIsAnonymous,
  };
}
