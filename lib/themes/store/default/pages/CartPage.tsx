"use client"

import React, { useEffect } from 'react'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ThemeTokens } from '@/lib/themes/types'
import CartSummary from '../components/CartSummary'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { removeItem, updateQuantity } from '@/lib/store/slices/cartSlice'
import { cartAbandoned } from '@/lib/store/analytics-listener'
import { store } from '@/lib/store'
import ProductImage from '@/lib/themes/store/default/components/ProductImage'

interface Props {
  theme: ThemeTokens
  storeSlug: string
}

export default function CartPage({ theme, storeSlug }: Props) {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(state => state.cart.carts[storeSlug]?.items || [])

  // Fire cart_abandon ONLY when user leaves with items and did NOT go to checkout
  useEffect(() => {
    return () => {
      const items = store.getState().cart.carts[storeSlug]?.items ?? []
      if (
        items.length > 0 &&
        !window.location.pathname.includes('/checkout')
      ) {
        dispatch(cartAbandoned({ storeRef: storeSlug, itemCount: items.length }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onUpdateQty = (id: string | number, delta: number) => {
    const item = cart.find(i => i.id === id)
    if (item) {
      dispatch(updateQuantity({ storeSlug, id, quantity: item.quantity + delta }))
    }
  }

  const onRemove = (id: string | number) => {
    dispatch(removeItem({ storeSlug, id }))
  }

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
              <Link 
                href={`/store/${storeSlug}`} 
                className="bg-[var(--p-color)] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-block"
              >
                ابدأ التسوق
              </Link>
            </div>
            ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-6 items-center shadow-sm">
                <div className="w-20 h-20 relative shrink-0 rounded-xl overflow-hidden bg-gray-50 border">
                  <ProductImage 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-2" 
                    sizes="80px"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-[var(--p-color)] font-black mt-1">{item.price.toLocaleString()} ر.س</p>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-1 shrink-0">
                  <button onClick={() => onUpdateQty(item.id, -1)} className="p-1.5 hover:bg-white rounded-lg"><Minus size={14}/></button>
                  <span className="px-4 font-black text-sm">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.id, 1)} className="p-1.5 hover:bg-white rounded-lg"><Plus size={14}/></button>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            ))
          )}
        </div>
        <CartSummary theme={theme} cart={cart} storeSlug={storeSlug} />
      </div>
    </main>
  )
}
