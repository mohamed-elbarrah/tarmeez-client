import { getProductBySlug, getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeProductPage } from "@/lib/themes/page-registry";
import { resolveThemeSlug } from "@/lib/helpers/activity";

export default async function Page({
  params,
}: {
  params: Promise<{ storeSlug: string; productSlug: string }>;
}) {
  const { storeSlug, productSlug } = await params;
  const decodedProductSlug = decodeURIComponent(productSlug);

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const product = await getProductBySlug(store.id, decodedProductSlug);
  if (!product) notFound();

  const themeSlug = resolveThemeSlug(store);
  const ProductPage = getThemeProductPage(themeSlug);

  return <ProductPage storeData={store} product={product} />;
}
