import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeProductsPage, computeTheme } from "@/lib/themes/page-registry";
import { resolveThemeSlug } from "@/lib/helpers/activity";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const [{ storeSlug }, { search, category }] = await Promise.all([
    params,
    searchParams,
  ]);
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const themeSlug = resolveThemeSlug(store);
  const theme = computeTheme(store);
  const ProductsPage = getThemeProductsPage(themeSlug);

  return (
    <ProductsPage
      theme={theme}
      products={store.products ?? []}
      categories={store.categories ?? []}
      storeSlug={storeSlug}
      initialSearch={search}
      initialCategory={category}
      activityType={store.activityType}
      themeSlug={themeSlug}
    />
  );
}
