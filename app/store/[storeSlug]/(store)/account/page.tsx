import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import AccountPage from '@/lib/themes/store/default/pages/AccountPage'
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
  return <AccountPage theme={theme} storeSlug={storeSlug} />
}
