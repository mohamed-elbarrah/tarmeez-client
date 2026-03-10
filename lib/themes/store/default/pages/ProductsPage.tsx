"use client"

import React, { useState } from 'react'
import { ThemeTokens, StoreProduct } from '../../types'
import FiltersSection from '../components/FiltersSection'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
  initialSearch?: string
  initialCategory?: string
  onProductClick: (product: StoreProduct) => void
}

export default function ProductsPage({ theme, products, initialSearch = '', initialCategory = 'الكل', onProductClick }: Props) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState(5000)

  return (
    <FiltersSection
      theme={theme}
      products={products}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
      priceRange={priceRange}
      onSearchChange={(q) => setSearchQuery(q)}
      onCategoryChange={(c) => setSelectedCategory(c)}
      onPriceChange={(p) => setPriceRange(p)}
      onReset={() => { setSelectedCategory('الكل'); setPriceRange(5000); setSearchQuery('') }}
      onProductClick={onProductClick}
    />
  )
}
