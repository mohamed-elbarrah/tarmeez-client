import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeLoginPage, computeTheme } from "@/lib/themes/page-registry";
import { resolveThemeSlug } from "@/lib/helpers/activity";

export default async function Page({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();
  const themeSlug = resolveThemeSlug(store);
  const theme = computeTheme(store);
  const LoginPage = getThemeLoginPage(themeSlug);
  return (
    <LoginPage
      theme={theme}
      storeSlug={storeSlug}
      logo={store.logo}
      storeName={store.name}
    />
  );
}
