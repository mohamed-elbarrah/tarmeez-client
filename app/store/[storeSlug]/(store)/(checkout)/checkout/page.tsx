import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeCheckoutPage, computeTheme } from "@/lib/themes/page-registry";
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
  const CheckoutPage = getThemeCheckoutPage(themeSlug);
  return (
    <CheckoutPage
      theme={theme}
      storeSlug={storeSlug}
      checkoutFieldsConfig={store.checkoutFieldsConfig}
    />
  );
}
