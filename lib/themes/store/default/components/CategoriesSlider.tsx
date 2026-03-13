"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeTokens, StoreCategory } from '@/lib/themes/types'

interface Props {
  theme: ThemeTokens
  storeSlug: string
  categories?: StoreCategory[]
}

export default function CategoriesSlider({ theme, storeSlug, categories }: Props) {
  const cats = categories && categories.length > 0
    ? categories
    : [
        { id: '1', name: 'جوالات', slug: 'phones', sortOrder: 0 },
        { id: '2', name: 'ساعات', slug: 'watches', sortOrder: 1 },
        { id: '3', name: 'عطور', slug: 'perfumes', sortOrder: 2 },
        { id: '4', name: 'جمال', slug: 'beauty', sortOrder: 3 },
        { id: '5', name: 'منزل', slug: 'home', sortOrder: 4 },
        { id: '6', name: 'موضة', slug: 'clothing', sortOrder: 5 },
      ];

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black">تسوق حسب الفئة</h2>
        <Link href={`/store/${storeSlug}/products`} className="text-sm font-bold text-[var(--p-color)]">عرض الكل</Link>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
        {cats.map((cat, i) => (
          <Link 
            key={cat.id} 
            href={`/store/${storeSlug}/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group"
          >
            <div className="w-24 h-24 rounded-full bg-white border flex items-center justify-center p-5 group-hover:border-[var(--p-color)] group-hover:shadow-md transition-all">
                 <div className="w-full h-full relative">
                   <Image 
                      src={cat.image || `https://cdn-icons-png.flaticon.com/512/3659/${3659899 + i}.png`} 
                      alt={cat.name} 
                      fill 
                      unoptimized={cat.image?.startsWith('https://placehold.co')} 
                      className="object-contain"
                   />
                 </div>
            </div>
            <span className="text-sm font-bold">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
