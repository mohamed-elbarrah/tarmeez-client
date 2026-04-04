import React from "react";
import { HeroBanner } from "../components/widgets/HeroBanner";
import { ProductBlock } from "../components/widgets/ProductBlock";
import { CountdownTimer } from "../components/widgets/CountdownTimer";
import { CategoriesSliderBlock } from "../components/widgets/CategoriesSliderBlock";
import { ProductsSectionBlock } from "../components/widgets/ProductsSectionBlock";
import { Section } from "../components/layout/Section";
import { TwoColumns } from "../components/layout/TwoColumns";
import { TextBlock } from "../components/basic/TextBlock";
import { ImageBanner } from "../components/basic/ImageBanner";
import { Button } from "../components/basic/Button";
import { Spacer } from "../components/basic/Spacer";
import { ensureVersion } from "../migrations";
import type { StoreProduct, StoreData } from "@/lib/themes/types";

interface PageRendererProps {
  page: {
    content: Record<string, any>;
    type: "LANDING" | "CUSTOM" | "POLICY";
    linkedProductId: string | null;
  };
  resolvedProducts: Record<string, StoreProduct>;
  storeSlug: string;
  storeData: StoreData;
}

/**
 * PageRenderer - Storefront component for rendering Puck JSON.
 * Implementation: Option B (Custom Mapper).
 * Zero imports from @puckeditor/core for maximum performance and bundle separation.
 */
export default function PageRenderer({
  page,
  resolvedProducts,
  storeSlug,
  storeData,
}: PageRendererProps) {
  const content = ensureVersion(page.content ?? {});
  const puckData = content.puckData ?? {
    content: [],
    root: { props: {} },
  };
  const components = Array.isArray(puckData.content) ? puckData.content : [];

  return (
    <div className="puck-renderer-custom">
      {components.map((component: any) =>
        renderComponent(
          component,
          resolvedProducts,
          storeSlug,
          page.type,
          storeData,
        ),
      )}
    </div>
  );
}

function renderZone(
  zone: any[],
  resolvedProducts: Record<string, StoreProduct>,
  storeSlug: string,
  pageType: string,
  storeData: StoreData,
) {
  if (!Array.isArray(zone)) return null;
  return zone.map((c) =>
    renderComponent(c, resolvedProducts, storeSlug, pageType, storeData),
  );
}

function renderComponent(
  component: any,
  resolvedProducts: Record<string, StoreProduct>,
  storeSlug: string,
  pageType: string,
  storeData: StoreData,
) {
  if (!component?.type || !component?.props) return null;
  const { type, props } = component;

  switch (type) {
    case "HeroBanner":
      return <HeroBanner key={props.id} {...props} />;

    case "ProductBlock":
      return (
        <ProductBlock
          key={props.id}
          {...props}
          resolvedProduct={resolvedProducts[props.productId]}
          storeSlug={storeSlug}
          pageType={pageType}
        />
      );

    case "CountdownTimer":
      return <CountdownTimer key={props.id} {...props} />;

    case "CategoriesSliderBlock":
      return (
        <CategoriesSliderBlock
          key={props.id}
          {...props}
          resolvedCategories={storeData.categories ?? []}
          storeSlug={storeSlug}
        />
      );

    case "ProductsSectionBlock":
      return (
        <ProductsSectionBlock
          key={props.id}
          {...props}
          resolvedProductsList={storeData.products ?? []}
          storeSlug={storeSlug}
        />
      );

    case "Section":
      return (
        <Section key={props.id} {...props}>
          {renderZone(
            props.zones?.content,
            resolvedProducts,
            storeSlug,
            pageType,
            storeData,
          )}
        </Section>
      );

    case "TwoColumns":
      return (
        <TwoColumns key={props.id} {...props}>
          {renderZone(
            props.zones?.left,
            resolvedProducts,
            storeSlug,
            pageType,
            storeData,
          )}
          {renderZone(
            props.zones?.right,
            resolvedProducts,
            storeSlug,
            pageType,
            storeData,
          )}
        </TwoColumns>
      );

    case "TextBlock":
      return <TextBlock key={props.id} {...props} />;

    case "ImageBanner":
      return <ImageBanner key={props.id} {...props} />;

    case "Button":
      return <Button key={props.id} {...props} />;

    case "Spacer":
      return <Spacer key={props.id} {...props} />;

    default:
      console.warn("Unknown component type:", type);
      return null;
  }
}
