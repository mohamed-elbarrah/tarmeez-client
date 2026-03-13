"use client"

import React from 'react'
import Link from 'next/link'
import { ThemeTokens, StoreProduct } from '@/lib/themes/types'

interface CartItem extends StoreProduct { quantity: number }

interface Props {
  theme: ThemeTokens
  cart: CartItem[]
  storeSlug: string
}

export default function CartSummary({ theme, cart, storeSlug }: Props) {
  const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 0), 0)
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6 sticky top-28">
      <h3 className="text-xl font-black border-b pb-4">ملخص الطلب</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-400 text-sm font-bold"><span>المجموع الفرعي</span><span className="text-gray-900">{subtotal.toLocaleString()} ر.س</span></div>
        <div className="flex justify-between text-gray-400 text-sm font-bold"><span>رسوم الشحن</span><span className="text-green-500">مجاني</span></div>
        <div className="flex justify-between text-2xl font-black pt-4 border-t border-dashed">
          <span>الإجمالي</span>
          <span className="text-[var(--p-color)]">{subtotal.toLocaleString()} ر.س</span>
        </div>
      </div>
      <Link 
        href={cart.length === 0 ? '#' : `/store/${storeSlug}/checkout`} 
        className={`w-full bg-[var(--s-color)] text-white py-4 rounded-2xl font-black text-lg text-center block ${cart.length === 0 ? 'opacity-30 pointer-events-none' : 'hover:shadow-xl'} transition-all`}
      >
        إتمام عملية الشراء
      </Link>
      <div className="flex items-center justify-center gap-4 pt-2 opacity-50 grayscale">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
      </div>
    </div>
  )
}
