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
        '--p-color': theme.primary,
        '--s-color': theme.secondary,
        '--a-color': theme.accent,
        '--b-color': theme.buttonColor,
        '--t-color': theme.textColor,
        '--h-color': theme.headingColor,
        '--radius': theme.borderRadius,
        fontFamily: theme.fontFamily,
    } as React.CSSProperties

    return (
        <div style={cssVars} dir="rtl" className="min-h-screen bg-[#f8fafc] flex flex-col">
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
