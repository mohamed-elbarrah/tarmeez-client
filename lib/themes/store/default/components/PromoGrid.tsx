import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeTokens, StoreProduct } from '@/lib/themes/types'

interface Props {
  theme: ThemeTokens
  products?: StoreProduct[]
  storeSlug: string
}

export default function PromoGrid({ theme, storeSlug }: Props) {
  const promos = [
    {
      title: 'سماعات AirPods Pro',
      label: 'إلغاء ضجيج نقي',
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      labelColor: 'text-blue-800',
      img: 'https://m.media-amazon.com/images/I/61f1YfTQIPL._AC_SL1500_.jpg',
      link: `/store/${storeSlug}/products?search=AirPods`
    },
    {
      title: 'خصم 50% على الموضة',
      label: 'أفضل الماركات',
      bg: 'bg-pink-100',
      text: 'text-pink-900',
      labelColor: 'text-pink-800',
      img: 'https://m.media-amazon.com/images/I/61N9yD7M45L._AC_SX679_.jpg',
      link: `/store/${storeSlug}/products?category=موضة`
    },
    {
      title: 'البيت الذكي',
      label: 'توفير مذهل',
      bg: 'bg-yellow-100',
      text: 'text-yellow-900',
      labelColor: 'text-yellow-800',
      img: 'https://m.media-amazon.com/images/I/71KkLgG2x6L._AC_SL1500_.jpg',
      link: `/store/${storeSlug}/products?category=إلكترونيات`
    }
  ]

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {promos.map((p, i) => (
        <Link key={i} href={p.link} className={`h-[300px] rounded-[var(--radius)] p-8 relative overflow-hidden ${p.bg} group`}>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className={`text-xs font-bold ${p.labelColor} opacity-60 mb-2`}>{p.label}</p>
              <h3 className={`text-2xl font-bold ${p.text}`}>{p.title}</h3>
            </div>
            <div className={`flex items-center gap-2 text-sm font-bold ${p.text}`}>
              <span>تسوق الآن</span> 
              <ArrowRight size={16} />
            </div>
          </div>
          <div className="absolute left-0 bottom-0 w-2/3 h-2/3 group-hover:scale-110 transition-transform duration-500">
             <Image 
                src={p.img} 
                alt={p.title} 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 66vw, 20vw"
             />
          </div>
        </Link>
      ))}
    </section>
  )
}
