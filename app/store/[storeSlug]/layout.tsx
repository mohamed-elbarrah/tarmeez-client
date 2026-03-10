import { notFound } from "next/navigation";
import StorefrontLayout from "@/components/pages/storefront/StorefrontLayout";

async function getStoreData(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/stores/${slug}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function StoreLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ storeSlug: string }>;
}) {
    const { storeSlug } = await params;
    const store = await getStoreData(storeSlug);

    if (!store) {
        notFound();
    }

    return (
        <div
            style={{
                // @ts-ignore
                "--primary": store.primaryColor || "#000000",
                "--accent": store.primaryColor || "#000000",
                "--secondary": store.secondaryColor || "#f4f4f5",
                "--font-family": store.fontFamily || "Inter",
            }}
            className="store-custom-theme font-[family-name:var(--font-family)]"
        >
            <StorefrontLayout store={store}>{children}</StorefrontLayout>
        </div>
    );
}
