import { notFound } from 'next/navigation'
import { getStoreBySlug } from '@/lib/api/stores'
import { getTheme } from '@/lib/themes'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function TrackRoute({ params }: PageProps) {
  const resolvedParams = await params
  const storeSlug = resolvedParams.storeSlug

  // eslint-disable-next-line no-console
  console.log('track page - storeSlug:', storeSlug)

  const store = await getStoreBySlug(storeSlug)

  // eslint-disable-next-line no-console
  console.log('track page - store:', store?.slug)

  if (!store) notFound()

  const ThemeComponent = getTheme(store.themeId)
  return <ThemeComponent storeData={store} initialView="track" />
}
