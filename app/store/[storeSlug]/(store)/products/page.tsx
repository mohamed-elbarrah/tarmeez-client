import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import ProductsPage from '@/lib/themes/store/default/pages/ProductsPage'
import { resolveTokens } from '@/lib/themes/store/default/config'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const [{ storeSlug }, { search, category }] = await Promise.all([params, searchParams]);
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();
  const theme = resolveTokens(store);
  const products = store.products ?? [];
  const categories = store.categories ?? [];

  return (
    <ProductsPage
      theme={theme}
      products={products}
      categories={categories}
      storeSlug={storeSlug}
      initialSearch={search}
      initialCategory={category}
    />
  );
}
