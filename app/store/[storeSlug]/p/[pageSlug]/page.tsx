import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/api/stores";
import PageRenderer from "@/lib/page-builder/renderer/PageRenderer";
import { resolvePageProducts } from "@/lib/page-builder/renderer/resolveProducts";
import Header from "@/components/storefront/core/Header";
import Footer from "@/components/storefront/core/Footer";
import { computeTheme } from "@/lib/themes/page-registry";
import { Metadata } from "next";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string; pageSlug: string }>;
}): Promise<Metadata> {
  const { storeSlug, pageSlug } = await params;

  const store = await getStoreBySlug(storeSlug);
  if (!store) return {};

  const res = await fetch(`${API_URL}/stores/${storeSlug}/pages/${pageSlug}`, {
    cache: "no-store",
  });

  if (!res.ok) return { title: "Page Not Found" };
  const page = await res.json();

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || `مرحباً بكم في ${page.title}`,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || `مرحباً بكم في ${page.title}`,
      siteName: store.name,
    },
  };
}

export default async function PublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string; pageSlug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { storeSlug, pageSlug } = await params;
  const { preview } = await searchParams;

  // 1. Fetch store
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  let page = null;

  // 2. Fetch page (Handle Public vs Preview)
  const publicRes = await fetch(
    `${API_URL}/stores/${storeSlug}/pages/${pageSlug}`,
    { cache: "no-store" },
  );

  if (publicRes.ok) {
    page = await publicRes.json();
  } else if (preview === "true") {
    // Preview mode: try to fetch via merchant endpoint
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) {
      // Find page by slug from merchant list
      const merchantRes = await fetch(`${API_URL}/merchant/pages`, {
        headers: { Cookie: `access_token=${token}` },
        cache: "no-store",
      });
      if (merchantRes.ok) {
        const pages = await merchantRes.json();
        page = pages.find((p: any) => p.slug === pageSlug) ?? null;
      }
    }
  }

  if (!page) notFound();

  // 3. Resolve product data (Rule 6)
  const resolvedProducts = resolvePageProducts(
    page.content,
    (store.products as any[]) || [],
  );

  // 4. Branding & Styles
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
      className="store-root light min-h-screen flex flex-col"
    >
      {/* Preview Banner */}
      {preview === "true" && (
        <div className="bg-[var(--p-color)] text-white text-center py-2 px-2 text-sm font-bold sticky top-0 z-50">
          وضع المعاينة — هذه الصفحة غير منشورة للعملاء بعد
        </div>
      )}

      {/* Conditional Header (Rule 13) */}
      {page.showHeader && (
        <Header
          storeSlug={storeSlug}
          storeName={store.name}
          logo={store.logo}
          theme={theme}
        />
      )}

      <main className="flex-grow">
        <PageRenderer
          page={page}
          resolvedProducts={resolvedProducts}
          storeSlug={storeSlug}
          storeData={store}
        />
      </main>

      {/* Conditional Footer (Rule 13) */}
      {page.showFooter && (
        <Footer
          storeSlug={storeSlug}
          storeName={store.name}
          logo={store.logo}
          theme={theme}
        />
      )}
    </div>
  );
}
