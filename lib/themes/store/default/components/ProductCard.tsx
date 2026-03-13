import React from 'react'
import { Plus, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeTokens, StoreProduct } from '@/lib/themes/types'
import { useAppDispatch } from '@/lib/store/hooks'
import { addItem } from '@/lib/store/slices/cartSlice'

interface Props {
  product: StoreProduct
  theme: ThemeTokens
  storeSlug: string
}

import ProductImage from '@/lib/themes/store/default/components/ProductImage'

export default function ProductCard({ product, theme, storeSlug }: Props) {
  const dispatch = useAppDispatch()
  const productUrl = `/store/${storeSlug}/product/${product.slug || product.id}`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    <div className="group bg-white p-4 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all relative flex flex-col h-full">
      <Link href={productUrl} className="flex flex-col h-full">
        <div className="aspect-square mb-4 overflow-hidden rounded-2xl relative bg-gray-50 p-6">
          <ProductImage 
            src={product.image} 
            alt={product.name} 
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-700" 
          />
          {product.discount && <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg z-10">خصم {product.discount}</span>}
        </div>
        <h3 className="text-sm font-black line-clamp-2 h-10 mb-2 leading-tight group-hover:text-[var(--p-color)] transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 text-[var(--a-color)] mb-3">
          <Star size={10} fill="currentColor" /><span className="text-[10px] font-black text-gray-900">{product.rating}</span>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="font-black text-lg text-[var(--p-color)]">{product.price.toLocaleString()} ر.س</span>
          {product.oldPrice && <span className="text-[10px] text-gray-300 line-through font-bold">{product.oldPrice.toLocaleString()} ر.س</span>}
        </div>
        <button 
          onClick={handleAddToCart}
          className="bg-gray-100 p-2.5 rounded-xl text-gray-600 hover:bg-[var(--p-color)] hover:text-white hover:rotate-90 transition-all duration-300 active:scale-90"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
