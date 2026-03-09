"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useStoreAuth } from "@/hooks/use-store-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Package, Settings, ChevronLeft, Home } from "lucide-react";

export default function StoreAccountPage() {
    const params = useParams();
    const storeSlug = params.storeSlug as string;
    const { customer, logout, isLoading } = useStoreAuth(storeSlug);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !customer) {
            router.push(`/store/${storeSlug}/login`);
        }
    }, [customer, isLoading, router, storeSlug]);

    if (isLoading || !customer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
            <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <Button variant="outline" onClick={() => logout()} className="text-destructive hover:text-destructive font-bold">
                    تسجيل الخروج <LogOut className="ml-2 h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">حسابي</h1>
                    <p className="text-muted-foreground">أهلاً بك مجدداً، {customer.name}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">بيانات الملف الشخصي</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 flex-row-reverse">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User size={20} />
                            </div>
                            <div className="grow">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">الاسم الكامل</p>
                                <p className="font-medium">{customer.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-row-reverse">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Package size={20} />
                            </div>
                            <div className="grow">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">البريد الإلكتروني</p>
                                <p className="font-medium text-sm truncate" dir="ltr">{customer.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">روابط سريعة</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Link href="#" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors flex-row-reverse">
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <Package className="text-muted-foreground" size={20} />
                                    <span>سجل الطلبات</span>
                                </div>
                                <ChevronLeft className="text-muted-foreground" size={16} />
                            </Link>
                            <Link href="#" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors flex-row-reverse">
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <Settings className="text-muted-foreground" size={20} />
                                    <span>إعدادات الحساب</span>
                                </div>
                                <ChevronLeft className="text-muted-foreground" size={16} />
                            </Link>
                            <Link href="/" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors flex-row-reverse">
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <Home className="text-muted-foreground" size={20} />
                                    <span>العودة للمتجر</span>
                                </div>
                                <ChevronLeft className="text-muted-foreground" size={16} />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
