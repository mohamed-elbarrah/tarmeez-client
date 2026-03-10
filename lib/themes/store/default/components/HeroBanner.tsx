"use client"

import React from 'react'
import { ThemeTokens, StoreProduct } from '../../types'

interface Props {
  theme: ThemeTokens
  featuredProduct: StoreProduct
  onNavigate: (view: string, product?: StoreProduct) => void
}

export default function HeroBanner({ theme, featuredProduct, onNavigate }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius)] min-h-[400px] flex items-center p-8 md:p-16 text-white" style={{ backgroundColor: theme.secondary }}>
      <div className="relative z-10 max-w-lg space-y-6">
        <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase">وصل حديثاً</span>
        <h2 className="text-4xl md:text-5xl font-black leading-tight">iPhone 15 Pro Max</h2>
        <p className="text-lg opacity-80 leading-relaxed">قوة هائلة في تصميم خفيف من التيتانيوم. استمتع بأقوى أداء على الإطلاق.</p>
        <button onClick={() => onNavigate('product', featuredProduct)} className="bg-white text-black px-10 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">تسوق الآن</button>
      </div>
      <div className="absolute left-0 bottom-0 top-0 w-1/2 hidden md:block">
        <img src={featuredProduct.image} className="w-full h-full object-contain object-bottom translate-y-10" alt="Hero" />
      </div>
    </section>
  )
}
