import React from 'react'
import { ThemeTokens, StoreProduct } from '../../types'
import ProductCard from './ProductCard'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
  onNavigate: (view: string, product?: StoreProduct) => void
}

export default function ProductsSection({ theme, products, onNavigate }: Props) {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white p-2 rounded-lg animate-pulse"><span>⚡</span></div>
          <h2 className="text-2xl font-black">عروض حصرية</h2>
        </div>
        <button onClick={() => onNavigate('products')} className="text-sm font-bold text-[var(--p-color)]">عرض المزيد</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.slice(0, 5).map(p => (
          <ProductCard key={p.id} product={p} onClick={() => onNavigate('product', p)} theme={theme} />
        ))}
      </div>
    </section>
  )
}
