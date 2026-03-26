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

const COLOR_MAP: Record<string, string> = {
  أحمر: '#ef4444', red: '#ef4444',
  أزرق: '#3b82f6', blue: '#3b82f6',
  أخضر: '#22c55e', green: '#22c55e',
  أصفر: '#eab308', yellow: '#eab308',
  برتقالي: '#f97316', orange: '#f97316',
  بنفسجي: '#a855f7', purple: '#a855f7',
  وردي: '#ec4899', pink: '#ec4899',
  أبيض: '#ffffff', white: '#ffffff',
  أسود: '#000000', black: '#000000',
  رمادي: '#6b7280', gray: '#6b7280', grey: '#6b7280',
  بني: '#92400e', brown: '#92400e',
  ذهبي: '#ca8a04', gold: '#ca8a04',
  فضي: '#9ca3af', silver: '#9ca3af',
  سماوي: '#06b6d4', cyan: '#06b6d4',
  كحلي: '#1e40af', navy: '#1e40af',
}

function resolveColor(value: string): string | null {
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value
  return COLOR_MAP[value.toLowerCase().trim()] ?? null
}

export default function ProductCard({ product, theme, storeSlug }: Props) {
  const dispatch = useAppDispatch()
  const productUrl = `/store/${storeSlug}/product/${encodeURIComponent(product.slug || product.id)}`
  const displayImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : null)

  // Color option swatches to show on card
  const colorOption = product.options?.find(
    o => o.type === 'COLORS' || o.name.toLowerCase().includes('color') || o.name.includes('لون')
  )
  const colorValues = colorOption?.values ?? []
  const MAX_SWATCHES = 4
  const visibleColors = colorValues.slice(0, MAX_SWATCHES)
  const extraColors = colorValues.length - MAX_SWATCHES

  // Count distinct option combinations (total variants)
  const variantCount = product.variants?.length ?? 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addItem({
      storeSlug,
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: displayImage || '',
        quantity: 1
      }
    }))
  }
  
  return (
    <div 
      className="group bg-white p-4 border border-gray-100 hover:shadow-2xl transition-all relative flex flex-col h-full"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <Link href={productUrl} className="flex flex-col h-full">
        <div 
          className="aspect-square mb-4 overflow-hidden relative bg-gray-50 p-6"
          style={{ borderRadius: 'calc(var(--radius) * 0.75)' }}
        >
          <ProductImage 
            src={displayImage} 
            alt={product.name} 
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-700" 
          />
          {product.discount && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg z-10">
              خصم {product.discount}
            </span>
          )}
        </div>
        <h3 
          className="text-sm font-black line-clamp-2 h-10 mb-2 leading-tight group-hover:text-[var(--p-color)] transition-colors"
          style={{ color: 'var(--h-color)' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-[var(--a-color)] mb-3">
          <Star size={10} fill="currentColor" />
          <span className="text-[10px] font-black text-gray-900">{product.rating}</span>
        </div>

        {/* Variant indicators */}
        {(visibleColors.length > 0 || variantCount > 1) && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {visibleColors.length > 0 ? (
              <>
                {visibleColors.map(v => {
                  const hex = resolveColor(v.value)
                  return (
                    <span
                      key={v.id}
                      title={v.value}
                      className="w-4 h-4 rounded-full border border-slate-200 shadow-sm inline-block shrink-0"
                      style={hex
                        ? { backgroundColor: hex }
                        : { background: 'linear-gradient(135deg,#f3f4f6,#d1d5db)' }
                      }
                    />
                  )
                })}
                {extraColors > 0 && (
                  <span className="text-[9px] font-black text-slate-400">+{extraColors}</span>
                )}
              </>
            ) : variantCount > 1 ? (
              <span
                className="text-[9px] font-black px-2 py-0.5 rounded-full"
                style={{
                  color: 'var(--p-color)',
                  backgroundColor: 'color-mix(in srgb, var(--p-color) 10%, transparent)',
                }}
              >
                {variantCount} خيارات متوفرة
              </span>
            ) : null}
          </div>
        )}
      </Link>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="font-black text-lg text-[var(--p-color)]">{product.price.toLocaleString()} ر.س</span>
          {product.oldPrice && (
            <span className="text-[10px] text-gray-300 line-through font-bold">
              {product.oldPrice.toLocaleString()} ر.س
            </span>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          className="bg-gray-100 p-2.5 text-gray-600 hover:bg-[var(--p-color)] hover:text-white hover:rotate-90 transition-all duration-300 active:scale-90"
          style={{ borderRadius: 'calc(var(--radius) * 0.5)' }}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
