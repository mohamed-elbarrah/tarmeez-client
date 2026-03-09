"use client";

import React from "react";
import { useParams } from "next/navigation";
// import { ThemeToggle } from "@/components/theme-toggle"; // Commented out as per user's preference in platform layout

export default function StoreAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const storeSlug = params.storeSlug as string;

    // Format slug: "my-awesome-store" -> "My Awesome Store" (Keep English slug name or translate if possible, but usually store names are specific)
    const storeName = storeSlug
        ? storeSlug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "متجر";

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative" dir="rtl">
            {/* <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div> */}

            <div className="w-full max-w-md px-4 z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-xl mb-3 border shadow-sm">
                        {storeName.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{storeName}</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">
                        بوابة العملاء
                    </p>
                </div>

                {children}
            </div>
        </div>
    );
}
