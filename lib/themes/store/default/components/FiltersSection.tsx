"use client"

import React, { useState } from 'react'
import { ShieldCheck, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeTokens, StoreProduct, StoreCategory } from '@/lib/themes/types'
import ProductCard from '@/lib/themes/store/default/components/ProductCard'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
  categories: StoreCategory[]
  storeSlug: string
  searchQuery: string
  selectedCategory: string
  priceRange: number
  onSearchChange: (q: string) => void
  onCategoryChange: (cat: string) => void
  onPriceChange: (price: number) => void
  onReset: () => void
}

const ITEMS_PER_PAGE = 4

export default function FiltersSection({ 
    theme, 
    products, 
    categories,
    storeSlug,
    searchQuery, 
    selectedCategory, 
    priceRange, 
    onSearchChange, 
    onCategoryChange, 
    onPriceChange, 
    onReset 
}: Props) {
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchPrice = p.price <= priceRange;
    return matchSearch && matchCategory && matchPrice;
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleCategoryChange = (cat: string) => {
    onCategoryChange(cat)
    setCurrentPage(1)
  }

  const handlePriceChange = (price: number) => {
    onPriceChange(price)
    setCurrentPage(1)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-8 bg-white p-6 rounded-3xl border border-gray-100 h-fit sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg">الفلاتر</h3>
            <span onClick={() => { onReset(); setCurrentPage(1); }} className="text-xs text-gray-400 hover:text-red-500 font-bold cursor-pointer transition-colors">إعادة ضبط</span>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm">الفئة</h4>
            <div className="flex flex-wrap gap-2">
              {['الكل', ...categories.map(c => c.name)].map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[var(--p-color)] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm">السعر</h4>
              <span className="text-[10px] font-black text-[var(--p-color)]">حتى {priceRange} ر.س</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="100"
              value={priceRange}
              onChange={(e) => handlePriceChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[var(--p-color)]"
            />
          </div>

          <div className="pt-6 border-t">
             <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                <ShieldCheck size={14}/> ضمان الوكيل المعتمد
             </div>
          </div>
        </aside>

        <div className="flex-grow space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 font-bold">تم العثور على <span className="text-gray-900">{filteredProducts.length}</span> منتج</p>
            <div className="flex items-center gap-2 text-xs font-bold bg-white px-4 py-2 rounded-xl border">
              <SlidersHorizontal size={14} /> ترتيب حسب: الأحدث
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} theme={theme} storeSlug={storeSlug} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-xl bg-white border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page ? 'bg-[var(--p-color)] text-white shadow-lg' : 'bg-white border text-gray-400 hover:border-[var(--p-color)]'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-xl bg-white border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Search size={32}/></div>
              <h3 className="text-lg font-black">عذراً، لم نجد نتائج</h3>
              <p className="text-sm text-gray-400 mt-2">حاول تقليل قيود الفلاتر أو البحث عن كلمة أخرى.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
