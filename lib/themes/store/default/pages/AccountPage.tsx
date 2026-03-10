"use client"

import React from 'react'
import { Package, MapPin, CreditCard, Heart, Settings, LogOut } from 'lucide-react'
import { ThemeTokens, StoreProduct } from '../../types'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
}

export default function AccountPage({ theme, products }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-80 space-y-3">
         <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center mb-6 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--p-color)] to-blue-400 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-lg">أ</div>
            <h3 className="font-black text-lg">أحمد القحطاني</h3>
            <p className="text-xs text-gray-400">ahmed.q@email.com</p>
            <span className="inline-block mt-3 bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">عضو ذهبي</span>
         </div>
         {[
           { id: 'orders', label: 'طلباتي الأخيرة', icon: <Package size={18}/>, active: true },
           { id: 'address', label: 'عناوين التوصيل', icon: <MapPin size={18}/> },
           { id: 'payments', label: 'طرق الدفع', icon: <CreditCard size={18}/> },
           { id: 'wishlist', label: 'قائمة الأمنيات', icon: <Heart size={18}/> },
           { id: 'settings', label: 'إعدادات الحساب', icon: <Settings size={18}/> },
           { id: 'logout', label: 'تسجيل الخروج', icon: <LogOut size={18}/>, danger: true }
         ].map((item) => (
           <button 
             key={item.id} 
             className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${item.active ? 'bg-[var(--p-color)] text-white shadow-lg' : 'bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50'} ${item.danger ? 'hover:bg-red-50 hover:text-red-600' : ''}`}
           >
             {item.icon} {item.label}
           </button>
         ))}
      </aside>

      <div className="flex-grow space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-black">طلباتك</h2>
           <div className="text-xs font-bold text-gray-400">عرض أخر 6 أشهر</div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
           <div className="p-6 border-b bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-6 items-center">
                <div><p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">رقم الطلب</p><p className="font-black text-sm">#EM-882941</p></div>
                <div><p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">التاريخ</p><p className="font-black text-sm">12 مارس 2024</p></div>
                <div><p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">الإجمالي</p><p className="font-black text-sm text-[var(--p-color)]">4,550 ر.س</p></div>
              </div>
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">قيد الشحن</span>
           </div>
           <div className="p-8">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border shrink-0">
                   <img src={products[0]?.image} className="w-full h-full object-contain" alt="Order item" />
                </div>
                <div className="flex-grow">
                   <h4 className="font-bold text-sm line-clamp-1">{products[0]?.name}</h4>
                   <p className="text-xs text-gray-400 mt-1">الكمية: 1</p>
                </div>
                <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-[var(--p-color)] transition-colors">تتبع الطلب</button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-black flex items-center gap-2"><MapPin size={18} className="text-[var(--p-color)]"/> عنوان الشحن الافتراضي</h4>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm leading-loose">
                <p className="font-bold">أحمد القحطاني</p>
                <p className="text-gray-500">حي النرجس، شارع العليا</p>
                <p className="text-gray-500">الرياض، المملكة العربية السعودية</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-black flex items-center gap-2"><CreditCard size={18} className="text-[var(--p-color)]"/> بطاقة الدفع الأساسية</h4>
              <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl shadow-md flex justify-between items-center">
                <div className="space-y-1">
                   <p className="text-[10px] opacity-60">Visa Signature</p>
                   <p className="font-black tracking-widest">**** **** **** 4022</p>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 brightness-0 invert" alt="Visa" />
              </div>
           </div>
        </div>
      </div>
    </main>
  )
}
