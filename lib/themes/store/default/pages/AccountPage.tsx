"use client"

import React, { useState } from 'react'
import { Package, MapPin, CreditCard, Heart, Settings, LogOut, ShoppingBag } from 'lucide-react'
import { ThemeTokens, StoreProduct } from '../../types'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch } from '@/lib/store/hooks'
import { clearUser } from '@/lib/store/slices/authSlice'
import {
  useGetCustomerMeQuery,
  useGetOrdersQuery,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMutation,
  useCustomerLogoutMutation,
} from '@/lib/services/customerApi'

interface Props {
  theme: ThemeTokens
  products: StoreProduct[]
}

export default function AccountPage({ theme, products }: Props) {
  const [active, setActive] = useState<'orders' | 'address' | 'payments' | 'settings' | 'wishlist'>('orders')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const { data: profile } = useGetCustomerMeQuery()
  const { data: orders } = useGetOrdersQuery()

  const { data: addresses, refetch: refetchAddresses } = useGetAddressesQuery()
  const [createAddress] = useCreateAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()
  const [updateAddress] = useUpdateAddressMutation()

  const { data: paymentMethods, refetch: refetchPayments } = useGetPaymentMethodsQuery()
  const [createPaymentMethod] = useCreatePaymentMethodMutation()
  const [deletePaymentMethod] = useDeletePaymentMethodMutation()
  const [setDefaultPayment] = useSetDefaultPaymentMutation()

  const [logoutMutation] = useCustomerLogoutMutation()

  const storeBase = (() => {
    if (!pathname) return '/'
    const parts = pathname.split('/').filter(Boolean)
    const idx = parts.indexOf('store')
    if (idx !== -1 && parts.length > idx + 1) return `/store/${parts[idx + 1]}`
    return '/'
  })()

  const handleLogout = async () => {
    try {
      await logoutMutation()
    } catch (e) {
      // ignore
    }
    dispatch(clearUser())
    router.push(storeBase)
  }
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-80 space-y-3">
         <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center mb-6 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--p-color)] to-blue-400 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-lg">{(profile?.fullName || ' ')[0] ?? '؟'}</div>
            <h3 className="font-black text-lg">{profile?.fullName ?? '---'}</h3>
            <p className="text-xs text-gray-400">{profile?.email ?? ''}</p>
         </div>
         {[
           { id: 'orders', label: 'طلباتي الأخيرة', icon: <Package size={18}/> },
           { id: 'address', label: 'عناوين التوصيل', icon: <MapPin size={18}/> },
           { id: 'payments', label: 'طرق الدفع', icon: <CreditCard size={18}/> },
           { id: 'wishlist', label: 'قائمة الأمنيات', icon: <Heart size={18}/> },
           { id: 'settings', label: 'إعدادات الحساب', icon: <Settings size={18}/> },
         ].map((item) => (
           <button
             key={item.id}
             onClick={() => setActive(item.id as any)}
             className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${active === item.id ? 'bg-[var(--p-color)] text-white shadow-lg' : 'bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50'}`}
           >
             {item.icon} {item.label}
           </button>
         ))}
         <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50 hover:bg-red-50 hover:text-red-600">
           <LogOut size={18}/> تسجيل الخروج
         </button>
      </aside>

      <div className="flex-grow space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-black">طلباتك</h2>
           <div className="text-xs font-bold text-gray-400">عرض أخر 6 أشهر</div>
        </div>

        {active === 'orders' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm p-8">
            <h3 className="font-black text-lg mb-4">طلباتك</h3>
            {!orders || orders.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ShoppingBag className="mx-auto mb-4" />
                لا توجد طلبات بعد
              </div>
            ) : (
              orders.map((o: any) => (
                <div key={o.id} className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-black">{o.id}</div>
                      <div className="text-xs text-gray-400">{o.createdAt}</div>
                    </div>
                    <div className="text-sm font-black text-[var(--p-color)]">{o.total}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-black flex items-center gap-2"><MapPin size={18} className="text-[var(--p-color)]"/> عناوين الشحن</h4>
              {(!addresses || addresses.length === 0) ? (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm leading-loose text-gray-400">لا توجد عناوين مضافة</div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a: any) => (
                    <div key={a.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-start">
                      <div>
                        <div className="font-bold">{a.fullName} {a.isDefault && <span className="ml-2 inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded">افتراضي</span>}</div>
                        <div className="text-sm text-gray-500">{a.city}، {a.region}</div>
                        <div className="text-sm text-gray-500">{a.street} {a.buildingNo ? `، مبنى ${a.buildingNo}` : ''}</div>
                        <div className="text-sm text-gray-500 mt-1">{a.phone}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={async () => { await deleteAddress(a.id); refetchAddresses(); }} className="text-red-600 text-xs font-bold">حذف</button>
                        {!a.isDefault && <button onClick={async () => { await updateAddress({ id: a.id, body: { isDefault: true } }); refetchAddresses(); }} className="text-[var(--p-color)] text-xs font-bold">اجعل افتراضي</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <AddressForm onCreated={async () => { await refetchAddresses(); }} createAddress={createAddress} />
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-black flex items-center gap-2"><CreditCard size={18} className="text-[var(--p-color)]"/> طرق الدفع</h4>
              {(!paymentMethods || paymentMethods.length === 0) ? (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm leading-loose text-gray-400">لا توجد بطاقات مضافة</div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((p: any) => (
                    <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="font-black">**** **** **** {p.last4} {p.isDefault && <span className="ml-2 inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded">افتراضي</span>}</div>
                        <div className="text-sm text-gray-500">{p.holderName} • {p.type} • {p.expiryMonth}/{p.expiryYear}</div>
                      </div>
                      <div className="flex gap-2">
                        {!p.isDefault && <button onClick={async () => { await setDefaultPayment(p.id); refetchPayments(); }} className="text-[var(--p-color)] text-xs font-bold">اجعل افتراضي</button>}
                        <button onClick={async () => { await deletePaymentMethod(p.id); refetchPayments(); }} className="text-red-600 text-xs font-bold">حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <PaymentForm onCreated={async () => { await refetchPayments(); }} createPaymentMethod={createPaymentMethod} />
           </div>
        </div>
      </div>
    </main>
  )
}

function AddressForm({ createAddress, onCreated }: any) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState({ fullName: '', phone: '', city: '', region: '', street: '', buildingNo: '', isDefault: false })
  return (
    <div>
      {open ? (
        <div className="space-y-2">
          <input className="w-full p-2 border rounded" placeholder="الاسم" value={state.fullName} onChange={(e) => setState({ ...state, fullName: e.target.value })} />
          <input className="w-full p-2 border rounded" placeholder="الهاتف" value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} />
          <input className="w-full p-2 border rounded" placeholder="المدينة" value={state.city} onChange={(e) => setState({ ...state, city: e.target.value })} />
          <input className="w-full p-2 border rounded" placeholder="المنطقة" value={state.region} onChange={(e) => setState({ ...state, region: e.target.value })} />
          <input className="w-full p-2 border rounded" placeholder="الشارع" value={state.street} onChange={(e) => setState({ ...state, street: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={async () => { await createAddress(state); setState({ fullName: '', phone: '', city: '', region: '', street: '', buildingNo: '', isDefault: false }); setOpen(false); onCreated(); }} className="px-4 py-2 bg-[var(--p-color)] text-white rounded">حفظ</button>
            <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">إلغاء</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-[var(--p-color)] text-white rounded">أضف عنوان</button>
      )}
    </div>
  )
}

function PaymentForm({ createPaymentMethod, onCreated }: any) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState({ type: 'visa', last4: '', expiryMonth: 1, expiryYear: 2026, holderName: '', isDefault: false })
  return (
    <div>
      {open ? (
        <div className="space-y-2">
          <input className="w-full p-2 border rounded" placeholder="نوع البطاقة" value={state.type} onChange={(e) => setState({ ...state, type: e.target.value })} />
          <input className="w-full p-2 border rounded" placeholder="آخر 4 أرقام" value={state.last4} onChange={(e) => setState({ ...state, last4: e.target.value })} />
          <input className="w-full p-2 border rounded" placeholder="صاحب البطاقة" value={state.holderName} onChange={(e) => setState({ ...state, holderName: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={async () => { await createPaymentMethod(state); setState({ type: 'visa', last4: '', expiryMonth: 1, expiryYear: 2026, holderName: '', isDefault: false }); setOpen(false); onCreated(); }} className="px-4 py-2 bg-[var(--p-color)] text-white rounded">حفظ</button>
            <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">إلغاء</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-[var(--p-color)] text-white rounded">أضف بطاقة</button>
      )}
    </div>
  )
}
