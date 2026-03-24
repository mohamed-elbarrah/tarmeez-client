"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateOrderMutation } from '@/lib/services/ordersApi'
import { useValidateCouponMutation } from '@/lib/services/couponsApi'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { clearCart } from '@/lib/store/slices/cartSlice'
import { checkoutStarted } from '@/lib/store/analytics-listener'
import { useRouter } from 'next/navigation'
import { ThemeTokens } from '@/lib/themes/types'

const checkoutSchema = z.object({
  customerName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  customerPhone: z.string().min(10, 'رقم الجوال غير صحيح'),
  customerEmail: z.string().email('بريد إلكتروني غير صحيح').optional().or(z.literal('')),
  city: z.string().min(2, 'المدينة مطلوبة'),
  region: z.string().min(2, 'المنطقة مطلوبة'),
  street: z.string().min(5, 'يرجى إدخال اسم الشارع بشكل مفصل'),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface Props {
  theme: ThemeTokens
  storeSlug: string
}

export default function CheckoutPage({ theme, storeSlug }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  })
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation()
  const cart = useAppSelector((s) => s.cart.carts[storeSlug]?.items || [])
  const storeData = useAppSelector((s: any) => s.cart.carts[storeSlug]?.storeData)
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    discount: number; message: string; code: string;
    freeProduct?: { id: string; name: string; qty: number };
  } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Track checkout start on mount (ANALYTICS-RULE 4 — sendBeacon via listener)
  const cartRef = useRef(cart)
  useEffect(() => {
    const subtotal = cartRef.current.reduce(
      (s: number, i: any) => s + i.price * i.quantity,
      0,
    )
    dispatch(checkoutStarted({ storeRef: storeSlug, cartTotal: subtotal }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: CheckoutFormData) => {
    if (cart.length === 0) return alert('سلة الشراء فارغة')
    
    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      shippingAddress: {
        city: data.city,
        region: data.region,
        street: data.street,
      },
      paymentMethod: 'cash_on_delivery',
      items: cart.map((i: any) => ({ productId: String(i.id), quantity: i.quantity })),
      notes: data.notes,
      storeSlug: String(storeSlug),
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
    }

    try {
      const res: any = await createOrder(payload).unwrap()
      dispatch(clearCart(storeSlug))
      router.push(`/store/${storeSlug}/order-success?code=${res.orderCode}`)
    } catch (err: any) {
      console.error('Order creation error:', err)
      const errorMessage = Array.isArray(err?.data?.message) 
        ? err.data.message.map((m: any) => 
            typeof m === 'object' ? JSON.stringify(m) : m
          ).join('\n')
        : err?.data?.message || err?.message || 'خطأ أثناء إنشاء الطلب'
      
      alert(errorMessage)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <input {...register('customerName')} placeholder="الاسم الكامل" className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.customerName ? 'border-red-500' : ''}`} />
                {errors.customerName && <p className="text-red-500 text-[10px] pr-2">{errors.customerName.message}</p>}
              </div>
              <div className="space-y-1">
                <input {...register('customerPhone')} placeholder="رقم الجوال" className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.customerPhone ? 'border-red-500' : ''}`} />
                {errors.customerPhone && <p className="text-red-500 text-[10px] pr-2">{errors.customerPhone.message}</p>}
              </div>
              <div className="space-y-1">
                <input {...register('customerEmail')} placeholder="البريد الإلكتروني (اختياري)" className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.customerEmail ? 'border-red-500' : ''}`} />
                {errors.customerEmail && <p className="text-red-500 text-[10px] pr-2">{errors.customerEmail.message}</p>}
              </div>
              <div className="space-y-1">
                <input {...register('city')} placeholder="المدينة" className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.city ? 'border-red-500' : ''}`} />
                {errors.city && <p className="text-red-500 text-[10px] pr-2">{errors.city.message}</p>}
              </div>
              <div className="space-y-1">
                <input {...register('region')} placeholder="المنطقة" className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.region ? 'border-red-500' : ''}`} />
                {errors.region && <p className="text-red-500 text-[10px] pr-2">{errors.region.message}</p>}
              </div>
              <div className="space-y-1">
                <input {...register('street')} placeholder="الشارع" className={`w-full p-3 bg-slate-50 border rounded-lg ${errors.street ? 'border-red-500' : ''}`} />
                {errors.street && <p className="text-red-500 text-[10px] pr-2">{errors.street.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-1">
                <textarea {...register('notes')} placeholder="ملاحظات (اختياري)" className="w-full p-3 bg-slate-50 border rounded-lg h-24" />
              </div>
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
                <div key={item.id} className="flex gap-2 items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border">
                    <img src={item.image || '/placeholder-product.png'} className="w-full h-full object-contain" alt={item.name} />
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-black line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-slate-400">الكمية: {item.quantity}</div>
                  </div>
                  <div className="text-xs font-black whitespace-nowrap">{item.price.toLocaleString()} ر.س</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4 mb-6">
              {/* Coupon input */}
              <div className="space-y-2 pb-3 border-b border-dashed">
                <label className="text-xs font-bold text-slate-500">كوبون الخصم</label>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponError(null); }}
                    placeholder="أدخل كود الخصم"
                    disabled={!!appliedCoupon}
                    className="flex-1 p-2.5 bg-slate-50 border rounded-lg text-sm font-mono uppercase"
                    dir="ltr"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); setCouponError(null); }}
                      className="px-4 py-2 text-sm font-bold border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      إزالة
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!couponCode.trim()) return;
                        setCouponError(null);
                        try {
                          const storeId = storeData?.id;
                          if (!storeId) { setCouponError('معرّف المتجر غير متاح'); return; }
                          const result = await validateCoupon({
                            code: couponCode.trim(),
                            storeId,
                            orderTotal: subtotal,
                            productIds: cart.map((i: any) => String(i.id)),
                          }).unwrap();
                          if (result.valid) {
                            setAppliedCoupon({
                              discount: result.discount,
                              message: result.message || 'تم تطبيق الكوبون',
                              code: couponCode.trim().toUpperCase(),
                              freeProduct: result.freeProduct,
                            });
                          } else {
                            setCouponError(result.message || 'كود الخصم غير صالح');
                          }
                        } catch (err: any) {
                          setCouponError(err?.data?.message || 'حدث خطأ أثناء التحقق');
                        }
                      }}
                      disabled={!couponCode.trim() || isValidating}
                      className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-[var(--p-color)] hover:shadow-md transition-all disabled:opacity-50"
                    >
                      {isValidating ? '...' : 'تطبيق'}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                    ✓ {appliedCoupon.message}
                  </p>
                )}
                {couponError && (
                  <p className="text-xs font-bold text-red-500">
                    {couponError}
                  </p>
                )}
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toLocaleString()} ر.س</span>
              </div>
              {appliedCoupon && appliedCoupon.discount > 0 && (
                <div className="flex justify-between text-sm font-bold text-green-500">
                  <span>الخصم</span>
                  <span>- {appliedCoupon.discount.toLocaleString()} ر.س</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-green-500">
                <span>رسوم الشحن</span>
                <span>مجاني</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-dashed">
                <span>الإجمالي</span>
                <span className="text-[var(--p-color)]">
                  {(subtotal - (appliedCoupon?.discount || 0)).toLocaleString()} ر.س
                </span>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full py-4 text-white font-black rounded-xl bg-[var(--p-color)] hover:shadow-lg transition-all">
              {isLoading ? 'جاري المعالجة...' : 'إتمام الطلب'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
