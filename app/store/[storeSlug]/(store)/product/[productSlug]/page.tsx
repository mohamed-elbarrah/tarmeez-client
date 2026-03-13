import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import ProductDetailPage from '@/lib/themes/store/default/pages/ProductDetailPage'
import { resolveTokens } from '@/lib/themes/store/default/config'

export default async function Page({
  params
}: {
  params: Promise<{ storeSlug: string, productSlug: string }>
}) {
  const { storeSlug, productSlug } = await params
  const store = await getStoreBySlug(storeSlug)
  if (!store) notFound()
  
  const product = store.products?.find(p => p.slug === productSlug || p.id === productSlug)
  if (!product) notFound()

  const theme = resolveTokens(store)
  return <ProductDetailPage theme={theme} product={product} storeSlug={storeSlug} products={store.products || []} />
}
