import React from 'react'
import { getStoreBySlug } from '@/lib/api/stores'
import RegisterPage from '@/lib/themes/store/default/pages/RegisterPage'

export default async function Page({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params
  const store = await getStoreBySlug(storeSlug)
  if (!store) return <div>Store not found</div>

  return <RegisterPage storeData={store} storeSlug={storeSlug} />
}
