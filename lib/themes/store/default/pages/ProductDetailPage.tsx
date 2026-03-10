"use client"

import React from 'react'
import { Star, CheckCircle, ShoppingCart, Heart } from 'lucide-react'
import { ThemeTokens, StoreProduct } from '../../types'

interface Props {
  theme: ThemeTokens
  product: StoreProduct
  onAddToCart: (product: StoreProduct) => void
  onBack: () => void
}

export default function ProductDetailPage({ theme, product, onAddToCart, onBack }: Props) {
  if (!product) return null
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-4 text-center">
          <div className="aspect-square bg-[#fcfcfc] rounded-2xl overflow-hidden border p-12">
            <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{product.category}</div>
          <h1 className="text-3xl font-black leading-tight">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[var(--a-color)]">
              <Star size={18} fill="currentColor" /><span className="font-bold text-gray-900">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">(150 تقييم)</span>
            <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">متوفر حالياً</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl space-y-2 border border-gray-100">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[var(--p-color)]">{product.price} ر.س</span>
              {product.oldPrice && <span className="text-lg text-gray-400 line-through font-medium">{product.oldPrice} ر.س</span>}
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-bold">المميزات الرئيسية:</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="flex items-center gap-2 font-medium"><CheckCircle size={16} className="text-green-500"/> شحن سريع وتوصيل آمن لباب منزلك.</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle size={16} className="text-green-500"/> ضمان جودة أصلي 100% من الوكيل.</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle size={16} className="text-green-500"/> إمكانية الاستبدال والاسترجاع السهل.</li>
            </ul>
          </div>
          <div className="flex gap-4 pt-8">
            <button onClick={() => onAddToCart(product)} className="flex-grow bg-[var(--p-color)] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3">
              <ShoppingCart size={22} /> إضافة للسلة
            </button>
            <button className="p-4 border border-gray-100 rounded-2xl text-gray-300 hover:text-red-500 transition-colors">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
