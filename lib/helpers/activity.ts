import type { StoreData } from "@/lib/themes/types";

/**
 * Activity-type helpers for global feature toggling.
 * Use these instead of raw string comparisons across the codebase.
 */
export function isCharity(store: Pick<StoreData, "activityType">): boolean {
  return store.activityType === "CHARITY";
}

export function isRetail(store: Pick<StoreData, "activityType">): boolean {
  return store.activityType === "RETAIL" || !store.activityType;
}

/**
 * Resolves the active theme slug from a store's data.
 * Priority: store.theme.slug → activityType fallback → "default"
 * Note: store.themeId is a UUID (not a slug) — we only use theme.slug.
 */
export function resolveThemeSlug(
  store: Pick<StoreData, "theme" | "themeId" | "activityType">,
): string {
  const slug = store.theme?.slug;
  if (slug) return slug;
  return isCharity(store) ? "charity" : "default";
}
