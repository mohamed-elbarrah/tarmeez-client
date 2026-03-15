import React from 'react';
import { Render } from '@puckeditor/core/rsc';
import { puckConfig } from '../puck.config';
import type { StoreProduct } from '@/lib/themes/types';

interface PageRendererProps {
  page: {
    content: Record<string, any>;
    type: 'LANDING' | 'CUSTOM' | 'POLICY';
    linkedProductId: string | null;
  };
  resolvedProducts: Record<string, StoreProduct>;
  storeSlug: string;
  storeData: any; // Using any for now to avoid deep type issues, should match StoreData
}

/**
 * PageRenderer - Storefront component for rendering Puck JSON.
 * Uses @puckeditor/core/rsc for optimized, render-only execution without editor UI.
 */
export default function PageRenderer({ 
  page, 
  resolvedProducts, 
  storeSlug, 
  storeData 
}: PageRendererProps) {
  const content = page.content || {};
  const puckData = content.puckData || { content: [], root: { props: {} } };

  // Note: Since we are in RSC, we pass the resolved data down.
  // The components (HeroBanner, ProductBlock, etc.) should be able to receive
  // their props directly. ProductBlock specifically needs the resolvedProduct.
  
  // We need to inject resolved products into the puckData content before rendering
  // to satisfy Rule 6 (Data resolution at renderer wrapper level).
  
  const injectResolvedData = (components: any[]) => {
    return components.map(component => {
      const newComponent = { ...component };
      if (newComponent.type === 'ProductBlock' && newComponent.props?.productId) {
        newComponent.props = {
          ...newComponent.props,
          resolvedProduct: resolvedProducts[newComponent.props.productId],
          storeSlug,
          pageType: page.type
        };
      }
      
      if (newComponent.props?.zones) {
        const newZones: Record<string, any[]> = {};
        for (const [key, zone] of Object.entries(newComponent.props.zones)) {
          newZones[key] = injectResolvedData(zone as any[]);
        }
        newComponent.props.zones = newZones;
      }
      
      return newComponent;
    });
  };

  const resolvedPuckData = {
    ...puckData,
    content: injectResolvedData(puckData.content || [])
  };

  return (
    <div className="puck-renderer">
      <Render config={puckConfig as any} data={resolvedPuckData} />
    </div>
  );
}
