import { getTheme } from '@/lib/themes'
import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'

export default async function StorePage({
    params,
}: {
    params: Promise<{ storeSlug: string }>;
}) {
    const { storeSlug } = await params;
    const store = await getStoreBySlug(storeSlug);
    if (!store) notFound();

    const ThemeComponent = getTheme(store.themeId)

    return <ThemeComponent storeData={store} />
}
