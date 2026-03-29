import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeHomePage, computeTheme } from "@/lib/themes/page-registry";
import { resolveThemeSlug } from "@/lib/helpers/activity";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const themeSlug = resolveThemeSlug(store);
  const theme = computeTheme(store);
  const HomePage = getThemeHomePage(themeSlug);

  return (
    <HomePage
      theme={theme}
      products={store.products ?? []}
      storeSlug={storeSlug}
      categories={store.categories}
      activityType={store.activityType}
    />
  );
}
