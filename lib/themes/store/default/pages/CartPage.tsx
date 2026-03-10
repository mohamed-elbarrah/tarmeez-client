"use client"

import React from 'react'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { ThemeTokens, StoreProduct } from '../../types'
import CartSummary from '../components/CartSummary'

interface CartItem extends StoreProduct { qty: number }

interface Props {
  theme: ThemeTokens
  cart: CartItem[]
  onUpdateQty: (id: number | string, delta: number) => void
  onRemove: (id: number | string) => void
  onContinueShopping: () => void
}

export default function CartPage({ theme, cart, onUpdateQty, onRemove, onContinueShopping }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl font-black mb-10">سلة التسوق الخاصة بك</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300"><ShoppingCart size={32}/></div>
              <h3 className="text-xl font-bold mb-4">سلتك لا تزال فارغة</h3>
              <p className="text-gray-400 text-sm mb-8">استكشف منتجاتنا وابدأ في ملء سلتك بأفضل العروض.</p>
              <button onClick={onContinueShopping} className="bg-[var(--p-color)] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">ابدأ التسوق</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-6 items-center shadow-sm">
                <img src={item.image} className="w-20 h-20 object-contain shrink-0 rounded-xl bg-gray-50 p-2 border" alt={item.name} />
                <div className="flex-grow">
                  <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-[var(--p-color)] font-black mt-1">{item.price} ر.س</p>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-1 shrink-0">
                  <button onClick={() => onUpdateQty(item.id, -1)} className="p-1.5 hover:bg-white rounded-lg"><Minus size={14}/></button>
                  <span className="px-4 font-black text-sm">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, 1)} className="p-1.5 hover:bg-white rounded-lg"><Plus size={14}/></button>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            ))
          )}
        </div>
        <CartSummary theme={theme} cart={cart} onCheckout={() => {}} />
      </div>
    </main>
  )
}
