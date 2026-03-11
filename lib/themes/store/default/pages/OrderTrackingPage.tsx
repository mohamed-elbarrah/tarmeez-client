"use client"

import React, { useState } from 'react'
import { useTrackOrderQuery } from '@/lib/services/ordersApi'
import { useSearchParams } from 'next/navigation'

export default function OrderTrackingPage({ storeData }: any) {
  const params = useSearchParams()
  const initialCode = params.get('code') || ''
  const [code, setCode] = useState(initialCode)
  const { data, isLoading, refetch } = useTrackOrderQuery({ orderCode: code, storeSlug: storeData.slug }, { skip: !code })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-black mb-6">تتبع الطلب</h1>
      <div className="flex gap-2 mb-6">
        <input value={code} onChange={(e) => setCode(e.target.value)} className="p-3 border rounded-lg flex-grow" placeholder="أدخل رمز الطلب" />
        <button onClick={() => refetch()} className="px-4 py-3 bg-[var(--p-color)] text-white rounded-lg">تتبع</button>
      </div>

      {isLoading && <div>جاري البحث...</div>}
      {data && (
        <div className="bg-white p-6 border rounded-lg">
          <div className="font-black text-lg">#{data.orderCode} — {data.status}</div>
          <div className="mt-4">العميل: {data.customerName} — {data.customerPhone}</div>
          <div className="mt-4">العنوان: {data.shippingAddress?.street}, {data.shippingAddress?.city}</div>
          <div className="mt-4">الإجمالي: {data.total} ر.س</div>
        </div>
      )}

      {(!isLoading && !data) && code && <div className="text-red-500">لم يتم العثور على الطلب، تحقق من الرمز</div>}
    </div>
  )
}
