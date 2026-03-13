import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import OrderSuccessPage from '@/lib/themes/store/default/pages/OrderSuccessPage'
import { resolveTokens } from '@/lib/themes/store/default/config'

export default async function Page({
  params
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params
  const store = await getStoreBySlug(storeSlug)
  if (!store) notFound()
  // No token resolve needed? OrderSuccess might just use colors.
  // Actually we need to pass tokens for background etc if needed.
  return <OrderSuccessPage storeSlug={storeSlug} />
}
