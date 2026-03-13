"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface Props {
  storeSlug: string
  orderCode?: string
}

export default function OrderSuccessPage({ storeSlug, orderCode }: Props) {
  const params = useSearchParams()
  const code = orderCode || params.get('code') || ''

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-12 text-center border rounded-2xl shadow-sm">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <CheckCircle size={48} />
          </div>
        </div>
        <h1 className="text-3xl font-black mb-4">شكراً لطلبك!</h1>
        <p className="text-slate-500 font-bold mb-6">تم استلام طلبك بنجاح.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-right">
          <div className="p-4 bg-slate-50 rounded-2xl border">رقم الطلب: <div className="font-black text-lg">#{code}</div></div>
          <div className="p-4 bg-slate-50 rounded-2xl border">التاريخ: <div className="font-black text-lg">{new Date().toLocaleDateString('ar-EG')}</div></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/store/${storeSlug}/track?code=${code}`} className="px-8 py-4 bg-[var(--p-color)] text-white rounded-xl font-bold flex-1 text-center hover:shadow-lg transition-all">تتبع الطلب</Link>
          <Link href={`/store/${storeSlug}`} className="px-8 py-4 bg-slate-100 rounded-xl font-black flex-1 text-center hover:bg-slate-200 transition-colors">العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  )
}
