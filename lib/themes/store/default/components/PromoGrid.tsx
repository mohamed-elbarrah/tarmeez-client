import React from 'react'
import { ArrowRight } from 'lucide-react'
import { ThemeTokens, StoreProduct } from '../../types'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
  onNavigate: (view: string, product?: StoreProduct) => void
}

export default function PromoGrid({ theme, products, onNavigate }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-[300px] rounded-[var(--radius)] p-8 relative overflow-hidden bg-blue-100 group cursor-pointer">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div><p className="text-xs font-bold text-blue-800 opacity-60 mb-2">إلغاء ضجيج نقي</p><h3 className="text-2xl font-bold text-blue-900">سماعات AirPods Pro</h3></div>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-900"><span>تسوق الآن</span> <ArrowRight size={16} /></div>
        </div>
        <img src="https://m.media-amazon.com/images/I/61f1YfTQIPL._AC_SL1500_.jpg" className="absolute left-0 bottom-0 w-2/3 h-2/3 object-contain group-hover:scale-110 transition-transform duration-500" alt="Promo" />
      </div>
      <div className="h-[300px] rounded-[var(--radius)] p-8 relative overflow-hidden bg-pink-100 group cursor-pointer">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div><p className="text-xs font-bold text-pink-800 opacity-60 mb-2">أفضل الماركات</p><h3 className="text-2xl font-bold text-pink-900">خصم 50% على الموضة</h3></div>
          <div className="flex items-center gap-2 text-sm font-bold text-pink-900"><span>تسوق الآن</span> <ArrowRight size={16} /></div>
        </div>
        <img src="https://m.media-amazon.com/images/I/61N9yD7M45L._AC_SX679_.jpg" className="absolute left-0 bottom-0 w-2/3 h-2/3 object-contain group-hover:scale-110 transition-transform duration-500" alt="Promo" />
      </div>
      <div className="h-[300px] rounded-[var(--radius)] p-8 relative overflow-hidden bg-yellow-100 group cursor-pointer">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div><p className="text-xs font-bold text-yellow-800 opacity-60 mb-2">توفير مذهل</p><h3 className="text-2xl font-bold text-yellow-900">البيت الذكي</h3></div>
          <div className="flex items-center gap-2 text-sm font-bold text-yellow-900"><span>تسوق الآن</span> <ArrowRight size={16} /></div>
        </div>
        <img src="https://m.media-amazon.com/images/I/71KkLgG2x6L._AC_SL1500_.jpg" className="absolute left-0 bottom-0 w-2/3 h-2/3 object-contain group-hover:scale-110 transition-transform duration-500" alt="Promo" />
      </div>
    </section>
  )
}
