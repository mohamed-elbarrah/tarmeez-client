import React from 'react'
import { getStoreBySlug } from '@/lib/api/stores'
import RegisterPage from '@/lib/themes/store/default/pages/RegisterPage'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function RegisterRoute({ params }: PageProps) {
  const resolvedParams = await params
  const storeSlug = resolvedParams.storeSlug

  // eslint-disable-next-line no-console
  console.log('register page - storeSlug:', storeSlug)

  const store = await getStoreBySlug(storeSlug)
  if (!store) return <div>Store not found</div>

  return <RegisterPage storeData={store} storeSlug={storeSlug} />
}
