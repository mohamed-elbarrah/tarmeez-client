"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { useCreateOrderMutation } from '@/lib/services/ordersApi'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { clearCart } from '@/lib/store/slices/cartSlice'
import { useRouter } from 'next/navigation'

interface Props {
  storeData: any
  theme: any
  cart: any[]
  onSuccess: (orderCode: string) => void
}

export default function CheckoutPage({ storeData, theme, cart, onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const reduxCart = useAppSelector((s) => s.cart.items)
  const dispatch = useAppDispatch()
  const router = useRouter()

  // prefer cart prop, otherwise use redux cart
  const cartSource = cart ?? reduxCart

  // Use storeData.slug directly (flat shape expected)
  const storeSlug = storeData?.slug
  if (!storeSlug) {
    console.error('CheckoutPage: storeData.slug is missing; storeData:', storeData)
  }

  const onSubmit = async (data: any) => {
    if (!cartSource || cartSource.length === 0) return alert('سلة الشراء فارغة')
    if (!storeSlug) return alert('خطأ: لا يوجد متجر محدد')
    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      shippingAddress: {
        fullName: data.fullName || data.customerName,
        phone: data.customerPhone,
        city: data.city,
        region: data.region,
        street: data.street,
        buildingNo: data.buildingNo || undefined,
      },
      paymentMethod: 'cash_on_delivery',
      items: cartSource.map((i: any) => ({ productId: String(i.id), quantity: i.quantity })),
      notes: data.notes,
      storeSlug: String(storeSlug),
    }
    console.debug('createOrder payload', payload)
    try {
      const res: any = await createOrder(payload).unwrap()
      if (typeof onSuccess === 'function') {
        onSuccess(res.orderCode)
      } else {
        dispatch(clearCart())
        router.push(`/store/${storeSlug}/order-success?code=${res.orderCode}`)
      }
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'خطأ أثناء إنشاء الطلب')
    }
  }

  const subtotal = cart.reduce((s: number, i: any) => s + (i.price * i.quantity), 0)

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-black mb-8">إتمام عملية الشراء</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 border rounded-lg">
            <h2 className="text-lg font-black mb-4">عنوان الشحن</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register('customerName', { required: true })} placeholder="الاسم الكامل" className="p-3 bg-slate-50 border rounded-lg" />
              <input {...register('customerPhone', { required: true })} placeholder="رقم الجوال" className="p-3 bg-slate-50 border rounded-lg" />
              <input {...register('customerEmail')} placeholder="البريد الإلكتروني (اختياري)" className="p-3 bg-slate-50 border rounded-lg" />
              <input {...register('city', { required: true })} placeholder="المدينة" className="p-3 bg-slate-50 border rounded-lg" />
              <input {...register('region', { required: true })} placeholder="المنطقة" className="p-3 bg-slate-50 border rounded-lg" />
              <input {...register('street', { required: true })} placeholder="الشارع" className="p-3 bg-slate-50 border rounded-lg" />
              <input {...register('buildingNo')} placeholder="رقم المبنى (اختياري)" className="p-3 bg-slate-50 border rounded-lg md:col-span-2" />
              <textarea {...register('notes')} placeholder="ملاحظات (اختياري)" className="w-full p-3 bg-slate-50 border rounded-lg h-24 md:col-span-2" />
            </div>
          </div>

          <div className="bg-white p-8 border rounded-lg">
            <h2 className="text-lg font-black mb-4">طريقة الدفع</h2>
            <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer">
              <div className="flex items-center gap-3 font-bold">الدفع عند الاستلام</div>
              <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
            </label>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white p-8 border rounded-lg sticky top-6">
            <h3 className="text-lg font-black mb-6 text-center">ملخص الطلب</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center">IMAGE</div>
                  <div className="flex-grow">
                    <div className="text-xs font-black">{item.name}</div>
                    <div className="text-[10px] text-slate-400">الكمية: {item.quantity}</div>
                  </div>
                  <div className="text-xs font-black">{item.price} ر.س</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4 mb-6">
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span>المجموع الفرعي</span>
                <span>{subtotal} ر.س</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-green-500">
                <span>رسوم الشحن</span>
                <span>مجاني</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t">
                <span>الإجمالي</span>
                <span style={{ color: 'var(--p-color)' }}>{subtotal} ر.س</span>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full py-4 text-white font-black rounded-xl" style={{ backgroundColor: 'var(--p-color)' }}>
              {isLoading ? 'جاري المعالجة...' : 'إتمام الطلب'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
