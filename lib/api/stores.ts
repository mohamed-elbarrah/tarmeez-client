import type { CheckoutFieldConfig } from "@/lib/types/auth";

const DEFAULT_CHECKOUT_FIELDS: CheckoutFieldConfig[] = [
  { id: 'name', type: 'text', label: 'الاسم الكامل', placeholder: 'أدخل اسمك الكامل', enabled: true, required: true, isCustom: false, sortOrder: 0 },
  { id: 'phone', type: 'phone', label: 'رقم الجوال', placeholder: '9665xxxxxxxx', enabled: true, required: true, isCustom: false, sortOrder: 1 },
  { id: 'email', type: 'email', label: 'البريد الإلكتروني', placeholder: 'example@mail.com', enabled: true, required: false, isCustom: false, sortOrder: 2 },
  { id: 'address', type: 'address', label: 'العنوان', placeholder: '', enabled: true, required: true, isCustom: false, sortOrder: 3 },
];

/**
 * Normalises raw checkoutFieldsConfig from the API regardless of format:
 * - empty / null / undefined → DEFAULT_CHECKOUT_FIELDS
 * - new array format            → returned as-is
 * - old object format { name: { enabled, required } } → migrated to array
 */
function normalizeCheckoutFieldsConfig(raw: unknown): CheckoutFieldConfig[] {
  if (!raw) return DEFAULT_CHECKOUT_FIELDS;
  if (Array.isArray(raw) && raw.length > 0) return raw as CheckoutFieldConfig[];
  if (Array.isArray(raw) && raw.length === 0) return DEFAULT_CHECKOUT_FIELDS;
  // Old object format migration
  const obj = raw as Record<string, { enabled?: boolean; required?: boolean }>;
  return DEFAULT_CHECKOUT_FIELDS.map(field => ({
    ...field,
    enabled: obj[field.id]?.enabled ?? field.enabled,
    required: obj[field.id]?.required ?? field.required,
  }));
}

export async function getStoreBySlug(slug: string) {
  // API_URL is server-side only (SSR inside Docker uses container hostname).
  // Falls back to NEXT_PUBLIC_API_URL for dev.
  const apiUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api";
  const res = await fetch(`${apiUrl}/stores/${slug}`, { cache: "no-store" });
  let data: any;
  try {
    data = await res.json();
  } catch {
    return null;
  }

  if (!data) return null;

  // Support both shapes: { store: {...} } and flat {...}
  const s = data.store ?? data;

  if (!s || !s.id) return null;

  const storeData = {
    id: s.id,
    slug: s.slug ?? slug,
    name: s.storeName ?? s.name,
    customDomain: s.customDomain ?? null,
    domainStatus: s.domainStatus ?? null,
    themeId: s.themeId ?? null,
    theme: s.theme ?? null,
    isOnboarded: s.isOnboarded ?? false,
    activityType: s.activityType ?? "RETAIL",
    logo: s.logo ?? null,
    logoWidth: s.logoWidth ?? null,
    logoHeight: s.logoHeight ?? null,
    showStoreName: s.showStoreName ?? true,
    favicon: s.favicon ?? null,
    primaryColor: s.primaryColor ?? null,
    secondaryColor: s.secondaryColor ?? null,
    accentColor: s.accentColor ?? null,
    textColor: s.textColor ?? null,
    headingColor: s.headingColor ?? null,
    buttonColor: s.buttonColor ?? null,
    fontFamily: s.fontFamily ?? null,
    borderRadius: s.borderRadius ?? null,
    merchant: s.merchant ?? null,
    systemCurrency: s.systemCurrency ?? "SAR",
    currencyIcon: s.currencyIcon ?? null,
    checkoutFieldsConfig: normalizeCheckoutFieldsConfig(s.checkoutFieldsConfig),
    products: s.products ?? [],
    categories: s.categories ?? [],
  };

  if (!storeData.slug) {
    throw new Error(`Store with id ${s.id} is missing a slug.`);
  }

  return storeData;
}

export async function getProductBySlug(
  storeId: string,
  productIdOrSlug: string,
) {
  const apiUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api";
  const encodedSlug = encodeURIComponent(productIdOrSlug);
  const res = await fetch(
    `${apiUrl}/stores/${storeId}/products/${encodedSlug}`,
    { cache: "no-store" },
  );

  if (!res.ok) return null;

  try {
    return await res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("getProductBySlug: failed to parse json", err);
    return null;
  }
}
