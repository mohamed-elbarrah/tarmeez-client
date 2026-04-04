import { getStoreBySlug } from "@/lib/api/stores";
import { notFound } from "next/navigation";
import { getThemeHomePage, computeTheme } from "@/lib/themes/page-registry";
import { resolveThemeSlug } from "@/lib/helpers/activity";
import PageRenderer from "@/lib/page-builder/renderer/PageRenderer";
import { resolvePageProducts } from "@/lib/page-builder/renderer/resolveProducts";
import { ensureVersion } from "@/lib/page-builder/migrations";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  // ── Try the published "home" page from the Page Builder ──────────────────
  const homePageRes = await fetch(`${API_URL}/stores/${storeSlug}/pages/home`, {
    cache: "no-store",
  });

  if (homePageRes.ok) {
    const homePage = await homePageRes.json();

    // Ensure content is migrated to the current schema version
    const content = ensureVersion(homePage.content ?? {});
    const resolvedProducts = resolvePageProducts(
      content,
      (store.products as any[]) || [],
    );

    const theme = computeTheme(store);
    const cssVars = {
      "--p-color": theme.primary,
      "--s-color": theme.secondary,
      "--a-color": theme.accent,
      "--b-color": theme.buttonColor,
      "--t-color": theme.textColor,
      "--h-color": theme.headingColor,
      "--radius": theme.borderRadius,
      fontFamily: theme.fontFamily,
      color: theme.textColor,
      backgroundColor: "#ffffff",
    } as React.CSSProperties;

    return (
      <div
        style={cssVars}
        dir="rtl"
        className="store-root container mt-8 light min-h-screen flex flex-col"
      >
        <main className="flex-grow">
          <PageRenderer
            page={{ ...homePage, content }}
            resolvedProducts={resolvedProducts}
            storeSlug={storeSlug}
            storeData={store}
          />
        </main>
      </div>
    );
  }

  // ── Fallback: legacy theme homepage ──────────────────────────────────────
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
      themeSlug={themeSlug}
    />
  );
}
