import type { StoreProduct } from "@/lib/themes/types";

/**
 * Returns products in the same category as `current`, excluding `current` itself.
 * Pure utility — no side effects, safe for use in any layer.
 */
export function getRelatedProducts(
  products: StoreProduct[],
  current: StoreProduct,
  limit = 4,
): StoreProduct[] {
  return products
    .filter((p) => p.category === current.category && p.id !== current.id)
    .slice(0, limit);
}
