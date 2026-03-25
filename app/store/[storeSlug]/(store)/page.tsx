import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeHomePage } from "@/lib/themes/home-pages";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  // Resolve the active theme slug and render ONLY the theme's HomePage.
  // The layout.tsx already wraps children with Header, Footer and CSS vars,
  // so we must not render the full SPA entry-point (which would duplicate them).
  const themeSlug = store.theme?.slug ?? store.themeId ?? "default";
  const HomePageComponent = getThemeHomePage(themeSlug);

  return <HomePageComponent storeData={store} />;
}
