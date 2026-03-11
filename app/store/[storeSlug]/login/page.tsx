import React from 'react'
import { getStoreBySlug } from '@/lib/api/stores'
import LoginPage from '@/lib/themes/store/default/pages/LoginPage'

export default async function Page({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params
  const store = await getStoreBySlug(storeSlug)
  if (!store) return <div>Store not found</div>

  return <LoginPage storeData={store} storeSlug={storeSlug} />
}
