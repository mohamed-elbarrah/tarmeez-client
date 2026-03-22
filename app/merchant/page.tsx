"use client";

import Link from "next/link";
import React from "react";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewTab } from "@/components/pages/merchant/analytics/tabs/OverviewTab";
import { Store, ExternalLink, Settings } from "lucide-react";

export default function MerchantPage() {
  const { data, isLoading, isError } = useGetMyStoreQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-destructive font-medium">
          حدث خطأ أثناء جلب بيانات المتجر.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const { merchant, store } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مرحباً {merchant.fullName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          إليك نظرة عامة على أداء متجرك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">{store.name}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {store.slug}.tarmeez.com
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex gap-2 pt-2">
            <Button size="sm" className="gap-2" asChild>
              <Link href={`/store/${store.slug}`} target="_blank">
                عرض المتجر <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href="/merchant/settings">
                الإعدادات <Settings className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <OverviewTab period={"7d"} />
    </div>
  );
}
