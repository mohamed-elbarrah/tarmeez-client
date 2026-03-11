import React from 'react'
import { getStoreBySlug } from '@/lib/api/stores'
import LoginPage from '@/lib/themes/store/default/pages/LoginPage'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function LoginRoute({ params }: PageProps) {
  const resolvedParams = await params
  const storeSlug = resolvedParams.storeSlug

  // eslint-disable-next-line no-console
  console.log('login page - storeSlug:', storeSlug)

  const store = await getStoreBySlug(storeSlug)
  if (!store) return <div>Store not found</div>

  return <LoginPage storeData={store} storeSlug={storeSlug} />
}
