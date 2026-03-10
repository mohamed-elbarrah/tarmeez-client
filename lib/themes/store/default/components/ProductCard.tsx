import React from 'react'
import { Plus, Star } from 'lucide-react'
import { StoreProduct, ThemeTokens } from '../../types'

interface Props {
  product: StoreProduct
  theme: ThemeTokens
  onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  return (
    <div onClick={onClick} className="group bg-white p-4 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all cursor-pointer relative">
      <div className="aspect-square mb-4 overflow-hidden rounded-2xl relative bg-gray-50 p-6">
        <img src={product.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={product.name} />
        {product.discount && <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg">خصم {product.discount}</span>}
      </div>
      <h3 className="text-sm font-black line-clamp-2 h-10 mb-2 leading-tight group-hover:text-[var(--p-color)] transition-colors">{product.name}</h3>
      <div className="flex items-center gap-1 text-[var(--a-color)] mb-3">
        <Star size={10} fill="currentColor" /><span className="text-[10px] font-black text-gray-900">{product.rating}</span>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="font-black text-lg text-[var(--p-color)]">{product.price.toLocaleString()} ر.س</span>
          {product.oldPrice && <span className="text-[10px] text-gray-300 line-through font-bold">{product.oldPrice.toLocaleString()} ر.س</span>}
        </div>
        <button className="bg-gray-100 p-2.5 rounded-xl text-gray-600 hover:bg-[var(--p-color)] hover:text-white hover:rotate-90 transition-all duration-300">
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
