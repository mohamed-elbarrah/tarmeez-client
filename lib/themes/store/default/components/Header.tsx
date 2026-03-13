"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ShoppingCart, User, Truck } from 'lucide-react'
import { ThemeTokens } from '@/lib/themes/types'
import { useAppSelector } from '@/lib/store/hooks'

interface Props {
  storeSlug: string
  storeName: string
  logo?: string | null
  theme: ThemeTokens
}

export default function Header({ storeSlug, storeName, logo, theme }: Props) {
  const [logoError, setLogoError] = useState(false)
  const cartCount = useAppSelector(state => state.cart.carts[storeSlug]?.items.length || 0)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/store/${storeSlug}/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="bg-gray-900 text-white py-2 px-8 flex justify-between items-center text-[10px] md:text-xs">
        <span className="flex items-center gap-1 opacity-80"><Truck size={14} /> شحن مجاني للطلبات فوق 200 ريال</span>
        <div className="flex gap-6 opacity-80 font-bold"><span>المساعدة</span></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">
        <Link href={`/store/${storeSlug}`} className="flex items-center gap-4 cursor-pointer">
          {logo && !logoError ? (
            <img
              src={logo}
              width={theme.logoWidth}
              height={theme.logoHeight}
              style={{ objectFit: 'contain' }}
              alt={storeName || 'logo'}
              onError={() => setLogoError(true)}
              className="block"
            />
          ) : null}

          { ( (!logo || logoError) || theme.showStoreName ) && (
            <span style={{ fontFamily: theme.fontFamily }} className="text-3xl font-black text-[var(--p-color)]">
              {storeName || 'E-mox'}
            </span>
          )}
        </Link>
        <form onSubmit={handleSearch} className="flex-grow max-w-xl relative hidden md:block">
          <input
            type="text"
            placeholder="ما الذي تبحث عنه اليوم؟"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-full py-2.5 px-12 text-sm focus:ring-2 focus:ring-[var(--p-color)] outline-none"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </form>
        <div className="flex items-center gap-6">
          <Link href={`/store/${storeSlug}/account`} className="cursor-pointer text-gray-700 flex flex-col items-center hover:text-[var(--p-color)] transition-colors">
            <User size={22} /><span className="text-[10px] mt-1 font-bold">حسابي</span>
          </Link>
          <Link href={`/store/${storeSlug}/cart`} className="relative cursor-pointer text-gray-700 flex flex-col items-center hover:text-[var(--p-color)] transition-colors">
            <ShoppingCart size={22} /><span className="text-[10px] mt-1 font-bold">السلة</span>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[var(--p-color)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
