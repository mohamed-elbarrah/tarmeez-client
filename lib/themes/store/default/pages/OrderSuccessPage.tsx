"use client"

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function OrderSuccessPage({ storeData, orderCode }: any) {
  const params = useSearchParams()
  const code = orderCode || params.get('code') || ''
  const router = useRouter()

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-12 text-center border rounded-2xl">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            ✓
          </div>
        </div>
        <h1 className="text-3xl font-black mb-4">شكراً لطلبك!</h1>
        <p className="text-slate-500 font-bold mb-6">تم استلام طلبك بنجاح.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-right">
          <div className="p-4 bg-slate-50 rounded-2xl border">رقم الطلب: <div className="font-black">#{code}</div></div>
          <div className="p-4 bg-slate-50 rounded-2xl border">التاريخ: <div className="font-black">{new Date().toLocaleDateString()}</div></div>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push(`/store/${storeData.slug}/track?code=${code}`)} className="px-8 py-3 bg-[var(--p-color)] text-white rounded-xl font-bold">تتبع الطلب</button>
          <button onClick={() => router.push(`/store/${storeData.slug}`)} className="px-8 py-3 bg-slate-100 rounded-xl font-black">العودة للرئيسية</button>
        </div>
      </div>
    </div>
  )
}
