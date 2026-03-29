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
 * Priority: store.theme.slug → store.themeId → activityType fallback → "default"
 */
export function resolveThemeSlug(
  store: Pick<StoreData, "theme" | "themeId" | "activityType">,
): string {
  const explicit = store.theme?.slug ?? store.themeId;
  if (explicit) return explicit;
  return isCharity(store) ? "charity" : "default";
}
