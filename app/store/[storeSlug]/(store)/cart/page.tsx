import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import CartPage from '@/lib/themes/store/default/pages/CartPage'
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
  return <CartPage theme={theme} storeSlug={storeSlug} />
}
