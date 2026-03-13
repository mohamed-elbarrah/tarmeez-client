import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import LoginPage from '@/lib/themes/store/default/pages/LoginPage'
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
  return <LoginPage theme={theme} storeSlug={storeSlug} logo={store.logo} storeName={store.name} />
}
