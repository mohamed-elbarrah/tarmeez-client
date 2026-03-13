import { getProductBySlug, getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import ProductDetailPage from '@/lib/themes/store/default/pages/ProductDetailPage'

export default async function Page({
  params
}: {
  params: Promise<{ storeSlug: string, productSlug: string }>
}) {
  const { storeSlug, productSlug } = await params
  const decodedProductSlug = decodeURIComponent(productSlug)
  
  const store = await getStoreBySlug(storeSlug)
  if (!store) notFound()
  
  const product = await getProductBySlug(store.id, decodedProductSlug)
  if (!product) notFound()

  return <ProductDetailPage storeData={store} product={product} />
}
