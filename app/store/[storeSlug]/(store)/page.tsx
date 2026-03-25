import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { ThemeEngine, getTheme } from "@/lib/themes";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  // Resolve the active theme slug: prefer the linked theme record, then themeId
  // string as a bare slug fallback, then 'default'
  const themeSlug = store.theme?.slug ?? store.themeId ?? "default";
  const ThemeComponent = getTheme(themeSlug);

  // ThemeComponent is the full theme entry-point (DefaultTheme or ModernTheme).
  // We pass storeData directly; the component calls ThemeEngine internally.
  return <ThemeComponent storeData={store} />;
}
