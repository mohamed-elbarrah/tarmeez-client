import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeTokens, StoreProduct } from '@/lib/themes/types'

interface Props {
  theme: ThemeTokens
  featuredProduct?: StoreProduct | null
  storeSlug: string
}

export default function HeroBanner({ theme, featuredProduct, storeSlug }: Props) {
  if (!featuredProduct) return null

  return (
    <section 
      className="relative overflow-hidden min-h-[400px] flex items-center p-8 md:p-16 text-white" 
      style={{ 
        backgroundColor: 'var(--s-color)',
        borderRadius: 'var(--radius)' 
      }}
    >
      <div className="relative z-10 max-w-lg space-y-6">
        <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase">
          وصل حديثاً
        </span>
        <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
          {featuredProduct.name}
        </h2>
        <p className="text-lg opacity-80 leading-relaxed text-slate-100">
          اكتشف أفضل العروض والمنتجات الحصرية في متجرنا اليوم. جودة نضمنها لك في كل عملية شراء.
        </p>
        <Link 
          href={`/store/${storeSlug}/product/${featuredProduct.slug || featuredProduct.id}`} 
          className="bg-white text-black px-10 py-3 font-bold shadow-lg hover:scale-105 transition-transform inline-block"
          style={{ borderRadius: 'var(--radius)' }}
        >
          تسوق الآن
        </Link>
      </div>
      <div className="absolute left-0 bottom-0 top-0 w-1/2 hidden md:block select-none pointer-events-none">
        {featuredProduct.image && (
          <Image 
            src={featuredProduct.image} 
            alt={featuredProduct.name} 
            fill
            className="object-contain object-bottom translate-y-10"
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        )}
      </div>
    </section>
  )
}
