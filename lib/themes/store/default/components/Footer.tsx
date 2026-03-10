"use client"

import React from 'react'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { ThemeTokens } from '../../types'

interface Props {
  storeName: string
  theme: ThemeTokens
  onNavigate: (view: string) => void
}

export default function Footer({ storeName, theme, onNavigate }: Props) {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[var(--p-color)]">{storeName || 'E-mox'}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">منصتك المتكاملة لأفضل المنتجات العالمية بأسعار تنافسية. جودة نضمنها لك في كل عملية شراء.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-[var(--p-color)] uppercase tracking-tighter">روابط سريعة</h4>
          <ul className="text-sm text-gray-500 space-y-2 cursor-pointer">
            <li onClick={() => onNavigate('home')}>الرئيسية</li>
            <li onClick={() => onNavigate('products')}>المتجر</li>
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
      <div className="max-w-7xl mx-auto border-t pt-8 text-center text-xs text-gray-400 font-bold">© 2024 جميع الحقوق محفوظة لمتجر {storeName || 'E-mox'}</div>
    </footer>
  )
}
