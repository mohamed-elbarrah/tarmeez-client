import React from "react";
import Link from "next/link";
// import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden" dir="rtl">
            {/* Subtle background pattern/gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            {/* <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div> */}

            <div className="w-full max-w-md px-4 z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                            ت
                        </div>
                        <span className="text-2xl font-bold tracking-tight">ترميز</span>
                    </Link>
                    <p className="text-muted-foreground text-sm">إدارة المنصة</p>
                </div>

                {children}
            </div>
        </div>
    );
}
