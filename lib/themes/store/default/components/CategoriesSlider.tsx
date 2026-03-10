"use client"

import React from 'react'
import { ThemeTokens } from '../../types'

interface Props {
  theme: ThemeTokens
  onCategorySelect: (cat: string) => void
}

export default function CategoriesSlider({ theme, onCategorySelect }: Props) {
  const cats = ['جوالات', 'ساعات', 'عطور', 'جمال', 'منزل', 'موضة']
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black">تسوق حسب الفئة</h2>
        <button onClick={() => onCategorySelect('الكل')} className="text-sm font-bold text-[var(--p-color)]">عرض الكل</button>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
        {cats.map((cat, i) => (
          <div key={i} onClick={() => { onCategorySelect(cat) }} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-white border flex items-center justify-center p-5 group-hover:border-[var(--p-color)] group-hover:shadow-md transition-all">
              <img src={`https://cdn-icons-png.flaticon.com/512/3659/${3659899 + i}.png`} className="w-full h-full object-contain" alt={cat} />
            </div>
            <span className="text-sm font-bold">{cat}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
