import { notFound } from "next/navigation";
import { getStoreBySlug } from '@/lib/api/stores'
import Header from "@/lib/themes/store/default/components/Header";
import Footer from "@/lib/themes/store/default/components/Footer";
import { resolveTokens } from "@/lib/themes/store/default/config";

export async function generateMetadata({ params }: { params: Promise<{ storeSlug: string }> }) {
    const { storeSlug } = await params
    const store = await getStoreBySlug(storeSlug)
    return {
        title: store?.name ?? storeSlug,
        icons: {
            icon: store?.favicon ?? '/favicon.ico',
        },
    }
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

    const theme = resolveTokens(store);

    const cssVars = {
        '--p-color': store.primaryColor ?? '#2563eb',
        '--s-color': store.secondaryColor ?? '#0f172a',
        '--a-color': store.accentColor ?? '#f59e0b',
        '--b-color': store.buttonColor ?? '#2563eb',
        '--t-color': store.textColor ?? '#1e293b',
        '--h-color': store.headingColor ?? '#000000',
        '--radius': store.borderRadius ?? '20px',
        fontFamily: store.fontFamily ?? "'Cairo', sans-serif",
    } as React.CSSProperties

    return (
        <div style={cssVars} dir="rtl" className="min-h-screen bg-[#f8fafc]">
            <Header 
                storeSlug={storeSlug}
                storeName={store.name}
                logo={store.logo}
                theme={theme}
                cartCount={0} // We'll connect this to Redux later
            />
            <main>{children}</main>
            <Footer 
                storeSlug={storeSlug}
                storeName={store.name}
                logo={store.logo}
                theme={theme}
            />
        </div>
    );
}
