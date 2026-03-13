import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import ProductsPage from '@/lib/themes/store/default/pages/ProductsPage'
import { resolveTokens } from '@/lib/themes/store/default/config'

export default async function Page({
  params
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params
  const store = await getStoreBySlug(storeSlug)
  if (!store) notFound()
  const theme = resolveTokens(store)
  return <ProductsPage theme={theme} products={store.products ?? []} storeSlug={storeSlug} />
}
