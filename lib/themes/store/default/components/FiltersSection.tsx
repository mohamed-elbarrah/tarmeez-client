"use client"

import React from 'react'
import { ShieldCheck, SlidersHorizontal, Search } from 'lucide-react'
import { ThemeTokens, StoreProduct } from '@/lib/themes/types'
import ProductCard from '@/lib/themes/store/default/components/ProductCard'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
  storeSlug: string
  searchQuery: string
  selectedCategory: string
  priceRange: number
  onSearchChange: (q: string) => void
  onCategoryChange: (cat: string) => void
  onPriceChange: (price: number) => void
  onReset: () => void
}

export default function FiltersSection({ 
    theme, 
    products, 
    storeSlug,
    searchQuery, 
    selectedCategory, 
    priceRange, 
    onSearchChange, 
    onCategoryChange, 
    onPriceChange, 
    onReset 
}: Props) {
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchPrice = p.price <= priceRange;
    return matchSearch && matchCategory && matchPrice;
  })

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-8 bg-white p-6 rounded-3xl border border-gray-100 h-fit sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg">الفلاتر</h3>
            <span onClick={onReset} className="text-xs text-gray-400 hover:text-red-500 font-bold cursor-pointer transition-colors">إعادة ضبط</span>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm">الفئة</h4>
            <div className="flex flex-wrap gap-2">
              {['الكل', 'جوالات', 'ساعات', 'إلكترونيات', 'موضة', 'منزل', 'عطور'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
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
              onChange={(e) => onPriceChange(parseInt(e.target.value))}
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

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} theme={theme} storeSlug={storeSlug} />
              ))}
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
