import { notFound } from "next/navigation";
import StorefrontHome from "@/components/pages/storefront/Home";

async function getStoreData(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/stores/${slug}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function StorePage({
    params,
}: {
    params: Promise<{ storeSlug: string }>;
}) {
    const { storeSlug } = await params;
    const store = await getStoreData(storeSlug);

    if (!store) {
        notFound();
    }

    return <StorefrontHome store={store} />;
}
