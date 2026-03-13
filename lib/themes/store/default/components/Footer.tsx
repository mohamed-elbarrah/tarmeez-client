"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { ThemeTokens } from '../../types'

interface Props {
  storeSlug: string
  storeName: string
  logo?: string | null
  theme: ThemeTokens
}

export default function Footer({ storeSlug, storeName, logo, theme }: Props) {
  const [logoError, setLogoError] = useState(false)
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {logo && !logoError ? (
              <img src={logo} width={theme.logoWidth} height={theme.logoHeight} style={{ objectFit: 'contain' }} alt={storeName || 'logo'} onError={() => setLogoError(true)} />
            ) : null}
            <h2 className="text-2xl font-black text-[var(--p-color)]">{(!logo || logoError || theme.showStoreName) ? storeName || 'E-mox' : null}</h2>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">منصتك المتكاملة لأفضل المنتجات العالمية بأسعار تنافسية. جودة نضمنها لك في كل عملية شراء.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-[var(--p-color)] uppercase tracking-tighter">روابط سريعة</h4>
          <ul className="text-sm text-gray-500 space-y-2 cursor-pointer">
            <li><Link href={`/store/${storeSlug}`}>الرئيسية</Link></li>
            <li><Link href={`/store/${storeSlug}/products`}>المتجر</Link></li>
            <li>تواصل معنا</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-[var(--p-color)] uppercase tracking-tighter">الدعم والمساعدة</h4>
          <ul className="text-sm text-gray-500 space-y-2 cursor-pointer">
            <li>مركز المساعدة</li>
            <li>سياسة الخصوصية</li>
            <li>الشروط والأحكام</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-[var(--p-color)] uppercase tracking-tighter">تابعنا</h4>
          <div className="flex gap-4 text-gray-400"><Facebook size={20} className="hover:text-blue-600"/><Instagram size={20} className="hover:text-pink-600"/><Twitter size={20} className="hover:text-blue-400"/></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t pt-8 text-center text-xs text-gray-400 font-bold">© 2024 جميع الحقوق محفوظة لمتجر {storeName || 'Tarmeez'}</div>
    </footer>
  )
}
