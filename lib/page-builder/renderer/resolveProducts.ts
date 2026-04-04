import type { StoreProduct } from "@/lib/themes/types";

/**
 * resolvePageProducts - Scans the Page content (including nested zones)
 * for components that reference specific products and maps their IDs to live
 * product data.  The resolved map is then passed to PageRenderer so each
 * widget receives its data without re-fetching.
 *
 * Handled component types:
 *  • ProductBlock         — single product by explicit productId prop
 *  • ProductsSectionBlock — uses the full storeData.products list at render
 *    time (no specific IDs to pre-resolve here; PageRenderer injects the
 *    list directly from storeData).
 *
 * Adheres to Rule 5 and Rule 6.
 */
export function resolvePageProducts(
  content: any,
  products: StoreProduct[],
): Record<string, StoreProduct> {
  const resolved: Record<string, StoreProduct> = {};

  function scanComponents(components: any[]) {
    if (!components || !Array.isArray(components)) return;

    for (const component of components) {
      // ProductBlock — single product by explicit ID
      if (component.type === "ProductBlock") {
        const productId = component.props?.productId;
        if (productId) {
          const product = products.find(
            (p) => String(p.id) === String(productId),
          );
          if (product) {
            resolved[productId] = product;
          }
        }
      }

      // ProductsSectionBlock — no specific IDs to resolve; the full product
      // list is injected by PageRenderer from storeData.products at render time.
      // We intentionally skip it here to avoid duplicating data in the map.

      // Recursive scan for components nested inside DropZones
      if (component.props?.zones) {
        for (const zone of Object.values(component.props.zones) as any[]) {
          scanComponents(zone);
        }
      }
    }
  }

  const components = content?.puckData?.content ?? [];
  scanComponents(components);

  return resolved;
}
