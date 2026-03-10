"use client"

import React from 'react'
import { ThemeTokens, StoreProduct } from '../../types'
import HeroBanner from '../components/HeroBanner'
import CategoriesSlider from '../components/CategoriesSlider'
import PromoGrid from '../components/PromoGrid'
import ProductsSection from '../components/ProductsSection'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
  onNavigate: (view: string, product?: StoreProduct) => void
  onCategorySelect: (cat: string) => void
}

export default function HomePage({ theme, products, onNavigate, onCategorySelect }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-16">
      <HeroBanner theme={theme} featuredProduct={products[5]} onNavigate={onNavigate} />
      <CategoriesSlider theme={theme} onCategorySelect={onCategorySelect} />
      <PromoGrid theme={theme} products={products} onNavigate={onNavigate} />
      <ProductsSection theme={theme} products={products} onNavigate={onNavigate} />
    </main>
  )
}
