"use client"

import React from 'react'
import { Star, CheckCircle, ShoppingCart, Heart } from 'lucide-react'
import Image from 'next/image'
import { ThemeTokens, StoreProduct } from '@/lib/themes/types'
import ProductCard from '@/lib/themes/store/default/components/ProductCard'
import { useAppDispatch } from '@/lib/store/hooks'
import { addItem } from '@/lib/store/slices/cartSlice'

interface Props {
  theme: ThemeTokens
  product: StoreProduct
  products: StoreProduct[]
  storeSlug: string
}

export default function ProductDetailPage({ theme, product, products, storeSlug }: Props) {
  const dispatch = useAppDispatch()
  if (!product) return null

  // Filter related products (same category, different id)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    dispatch(addItem({
      storeSlug,
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity: 1
      }
    }))
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-4 text-center">
          <div className="aspect-square bg-[#fcfcfc] rounded-2xl overflow-hidden border p-12 relative">
             {product.image && (
               <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
               />
             )}
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
              <span className="text-4xl font-black text-[var(--p-color)]">{product.price.toLocaleString()} ر.س</span>
              {product.oldPrice && <span className="text-lg text-gray-400 line-through font-medium">{product.oldPrice.toLocaleString()} ر.س</span>}
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
            <button onClick={handleAddToCart} className="flex-grow bg-[var(--p-color)] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95">
              <ShoppingCart size={22} /> إضافة للسلة
            </button>
            <button className="p-4 border border-gray-100 rounded-2xl text-gray-300 hover:text-red-500 transition-colors">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-black">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} theme={theme} storeSlug={storeSlug} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
