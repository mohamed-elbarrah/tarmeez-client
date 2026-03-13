import { getStoreBySlug } from '@/lib/api/stores'
import { notFound } from 'next/navigation'
import HomePage from '@/lib/themes/store/default/pages/HomePage'
import { resolveTokens } from '@/lib/themes/store/default/config'

export default async function StorePage({
    params,
}: {
    params: Promise<{ storeSlug: string }>;
}) {
    const { storeSlug } = await params;
    const store = await getStoreBySlug(storeSlug);
    if (!store) notFound();

    const theme = resolveTokens(store);
    const products = store.products ?? [];
    const categories = store.categories ?? [];

    return <HomePage theme={theme} products={products} storeSlug={storeSlug} categories={categories} />
}
