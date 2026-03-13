import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import RegisterPage from '@/lib/themes/store/default/pages/RegisterPage'
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
  return <RegisterPage theme={theme} storeSlug={storeSlug} logo={store.logo} storeName={store.name} />
}
