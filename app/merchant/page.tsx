"use client"

import Link from 'next/link'
import React from 'react'
import { useGetMyStoreQuery } from '@/lib/services/merchantApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MerchantPage() {
  const { data, isLoading, isError } = useGetMyStoreQuery()

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return <div className="p-6 text-destructive">حدث خطأ أثناء جلب بيانات المتجر.</div>
  }

  const { merchant, store } = data

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>مرحباً {merchant.fullName} 👋</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">متجرك: <strong>{store.name}</strong></div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/merchant`}>إدارة المتجر</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/store/${store.slug}`}>عرض المتجر</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


// import Page from "@/components/pages/merchant/Dashboard";

// export default function RoutePage() {
//   return <Page />;
// }
