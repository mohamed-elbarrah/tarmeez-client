import type { StoreProduct } from '@/lib/themes/types';

/**
 * resolvePageProducts - Scans the Page content (including nested zones) 
 * for ProductBlock components and maps their product IDs to live product data.
 * Adheres to Rule 5 and Rule 6.
 */
export function resolvePageProducts(
  content: any,
  products: StoreProduct[]
): Record<string, StoreProduct> {
  const resolved: Record<string, StoreProduct> = {};
  
  function scanComponents(components: any[]) {
    if (!components || !Array.isArray(components)) return;
    
    for (const component of components) {
      // Direct ProductBlock
      if (component.type === 'ProductBlock') {
        const productId = component.props?.productId;
        if (productId) {
          const product = products.find(p => p.id === productId);
          if (product) {
            resolved[productId] = product;
          }
        }
      }
      
      // Recursive scan for components inside DropZones
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
