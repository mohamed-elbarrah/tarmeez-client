import { notFound } from "next/navigation";
import { getStoreBySlug } from '@/lib/api/stores'
import { ShieldCheck } from 'lucide-react'

export default async function CheckoutLayout({
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
        <div style={cssVars} dir="rtl" className="min-h-screen bg-gray-50">
            <main>{children}</main>
        </div>
    );
}
