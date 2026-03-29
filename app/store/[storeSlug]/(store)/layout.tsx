import { notFound } from "next/navigation";
import Script from "next/script";
import { getStoreBySlug } from "@/lib/api/stores";
import Header from "@/components/storefront/core/Header";
import Footer from "@/components/storefront/core/Footer";
import { ThemeEngine } from "@/lib/themes/engine";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  return {
    title: store?.name ?? storeSlug,
    icons: {
      icon: store?.favicon ?? "/favicon.ico",
    },
  };
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  const engine = new ThemeEngine(store, store.theme ?? null);
  const theme = engine.getComputedConfig();
  const cssVars = {
    ...engine.getStyleObject(),
    color: theme.textColor,
    backgroundColor: "#ffffff",
  } as React.CSSProperties;

  return (
    <div
      style={cssVars}
      dir="rtl"
      data-activity-type={store.activityType ?? "RETAIL"}
      className="store-root light min-h-screen flex flex-col"
    >
      <Script
        src="/tarmeez-tracker.js"
        strategy="afterInteractive"
        data-store-id={store.id}
        data-endpoint={`${process.env.NEXT_PUBLIC_API_URL}/analytics/collect`}
      />
      <Header
        storeSlug={storeSlug}
        storeName={store.name}
        logo={store.logo}
        theme={theme}
      />
      <main className="flex-grow">{children}</main>
      <Footer
        storeSlug={storeSlug}
        storeName={store.name}
        logo={store.logo}
        theme={theme}
      />
    </div>
  );
}
