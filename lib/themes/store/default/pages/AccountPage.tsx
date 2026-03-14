"use client"

import React, { useState, useEffect } from 'react'
import { Package, Truck, Heart, Settings, LogOut, ShoppingBag, Eye, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { ThemeTokens } from '@/lib/themes/types'
import { useRouter } from 'next/navigation'
import {
  useGetCustomerMeQuery,
  useGetOrdersQuery,
  useCustomerLogoutMutation,
} from '@/lib/services/customerApi'
import { useGetWishlistQuery, useToggleWishlistMutation } from '@/lib/services/wishlistApi'
import Link from 'next/link'

interface Props {
  theme: ThemeTokens
  storeSlug: string
}

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'قيد الانتظار', color: 'text-amber-600', bg: 'bg-amber-50' },
  CONFIRMED: { label: 'تم التأكيد', color: 'text-blue-600', bg: 'bg-blue-50' },
  PROCESSING: { label: 'قيد التجهيز', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  SHIPPED: { label: 'تم الشحن', color: 'text-purple-600', bg: 'bg-purple-50' },
  DELIVERED: { label: 'تم التوصيل', color: 'text-green-600', bg: 'bg-green-50' },
  CANCELLED: { label: 'ملغي', color: 'text-red-600', bg: 'bg-red-50' },
  REFUNDED: { label: 'مسترجع', color: 'text-gray-600', bg: 'bg-gray-50' },
}

export default function AccountPage({ theme, storeSlug }: Props) {
  const [active, setActive] = useState<'orders' | 'tracking' | 'wishlist' | 'settings'>('orders')
  const router = useRouter()
  const storeBase = `/store/${storeSlug}`

  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetCustomerMeQuery()
  const { data: orders } = useGetOrdersQuery()
  const { data: wishlistItems } = useGetWishlistQuery(storeSlug)
  const [toggleWishlist] = useToggleWishlistMutation()
  const [logoutMutation] = useCustomerLogoutMutation()

  useEffect(() => {
    if (!profileLoading && profileError) {
      router.push(`${storeBase}/login?redirect=${storeBase}/account`)
    }
  }, [profileLoading, profileError, router, storeBase])

  const handleLogout = async () => {
    try {
      await logoutMutation()
    } catch {
      // ignore
    }
    router.push(storeBase)
  }

  const handleRemoveWishlist = async (productId: string) => {
    await toggleWishlist({ productId, storeSlug })
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--p-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (profileError) return null

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 space-y-3">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center mb-6 shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--p-color)] to-blue-400 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-lg">
            {(profile?.fullName || ' ')[0] ?? '؟'}
          </div>
          <h3 className="font-black text-lg">{profile?.fullName ?? '---'}</h3>
          <p className="text-xs text-gray-400">{profile?.email ?? ''}</p>
        </div>
        {[
          { id: 'orders', label: 'طلباتي الأخيرة', icon: <Package size={18} /> },
          { id: 'tracking', label: 'تتبع حالة طلبي', icon: <Truck size={18} /> },
          { id: 'wishlist', label: 'منتجاتي المفضلة', icon: <Heart size={18} /> },
          { id: 'settings', label: 'إعدادات الحساب', icon: <Settings size={18} /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id as any)}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${active === item.id ? 'bg-[var(--p-color)] text-white shadow-lg' : 'bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-50 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-grow space-y-8">
        {active === 'orders' && <OrdersTab orders={orders} storeSlug={storeSlug} />}
        {active === 'tracking' && <TrackingTab orders={orders} storeSlug={storeSlug} />}
        {active === 'wishlist' && <WishlistTab items={wishlistItems} storeSlug={storeSlug} onRemove={handleRemoveWishlist} />}
        {active === 'settings' && <SettingsTab profile={profile} />}
      </div>
    </main>
  )
}

/* ─── Orders Tab ─── */
function OrdersTab({ orders, storeSlug }: { orders: any[] | undefined; storeSlug: string }) {
  return (
    <div>
      <h2 className="text-3xl font-black mb-6">طلباتي الأخيرة</h2>
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        {!orders || orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ShoppingBag className="mx-auto mb-4" size={48} />
            <p className="font-bold text-lg">لا توجد طلبات بعد</p>
            <p className="text-sm mt-2">ابدأ التسوق الآن واطلب منتجاتك المفضلة</p>
            <Link
              href={`/store/${storeSlug}/products`}
              className="inline-block mt-4 px-6 py-3 bg-[var(--p-color)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((o: any) => (
              <OrderCard key={o.id} order={o} storeSlug={storeSlug} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order, storeSlug }: { order: any; storeSlug: string }) {
  const [expanded, setExpanded] = useState(false)
  const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING

  return (
    <div className="p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="font-black text-sm">طلب رقم #{order.orderCode}</div>
          <div className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-xs text-gray-400">{order.items?.length ?? 0} منتجات</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-black px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
            {status.label}
          </span>
          <span className="text-sm font-black text-[var(--p-color)]">{order.total?.toLocaleString()} ر.س</span>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-[var(--p-color)] font-bold mt-3 hover:underline"
      >
        <Eye size={14} /> {expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && order.items && (
        <div className="mt-4 space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              {item.productImage && (
                <img src={item.productImage} alt={item.productName} className="w-14 h-14 object-cover rounded-lg" />
              )}
              <div className="flex-grow">
                <div className="font-bold text-sm">{item.productName}</div>
                <div className="text-xs text-gray-400">الكمية: {item.quantity}</div>
              </div>
              <div className="font-black text-sm text-[var(--p-color)]">{item.total?.toLocaleString()} ر.س</div>
            </div>
          ))}
          {order.shippingAddress && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">
              <span className="font-bold text-gray-700">عنوان التوصيل: </span>
              {order.shippingAddress.street}، {order.shippingAddress.city}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Tracking Tab ─── */
function TrackingTab({ orders, storeSlug }: { orders: any[] | undefined; storeSlug: string }) {
  const TRACKING_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

  return (
    <div>
      <h2 className="text-3xl font-black mb-6">تتبع حالة طلبي</h2>
      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <Truck className="mx-auto mb-4" size={48} />
          <p className="font-bold text-lg">لا توجد طلبات للتتبع</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING
            const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED'
            const currentStepIndex = TRACKING_STEPS.indexOf(order.status)

            return (
              <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="font-black text-lg">طلب رقم #{order.orderCode}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    <div className="text-sm font-black text-[var(--p-color)] mt-1">{order.total?.toLocaleString()} ر.س</div>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                {!isCancelled && (
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      {TRACKING_STEPS.map((step, i) => {
                        const stepInfo = ORDER_STATUS_MAP[step]
                        const isActive = i <= currentStepIndex
                        const isCurrent = i === currentStepIndex
                        return (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isCurrent
                                  ? 'bg-[var(--p-color)] text-white shadow-lg scale-110'
                                  : isActive
                                  ? 'bg-[var(--p-color)] text-white'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {i + 1}
                            </div>
                            <span className={`text-[10px] font-bold mt-2 text-center ${isActive ? 'text-[var(--p-color)]' : 'text-gray-400'}`}>
                              {stepInfo.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="absolute top-4 right-8 left-8 h-0.5 bg-gray-100 -z-0">
                      <div
                        className="h-full bg-[var(--p-color)] transition-all"
                        style={{ width: `${Math.max(0, (currentStepIndex / (TRACKING_STEPS.length - 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className={`p-4 rounded-xl text-sm font-bold text-center ${status.bg} ${status.color}`}>
                    {order.status === 'CANCELLED' ? 'تم إلغاء هذا الطلب' : 'تم استرجاع هذا الطلب'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Wishlist Tab ─── */
function WishlistTab({ items, storeSlug, onRemove }: { items: any[] | undefined; storeSlug: string; onRemove: (productId: string) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-black mb-6">منتجاتي المفضلة</h2>
      {!items || items.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <Heart className="mx-auto mb-4" size={48} />
          <p className="font-bold text-lg">لا توجد منتجات مفضلة بعد</p>
          <p className="text-sm mt-2">اضغط على ♥ في أي منتج لإضافته هنا</p>
          <Link
            href={`/store/${storeSlug}/products`}
            className="inline-block mt-4 px-6 py-3 bg-[var(--p-color)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => {
            const product = item.product
            const imageUrl = product.images?.[0] || ''
            const hasDiscount = product.comparePrice && product.comparePrice > product.price
            const discountPercent = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className="relative">
                  <Link href={`/store/${storeSlug}/product/${product.slug || product.id}`}>
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                    </div>
                  </Link>
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all shadow-sm"
                    title="إزالة من المفضلة"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {product.category && (
                    <span className="text-[10px] font-bold text-[var(--p-color)] bg-[var(--p-color)]/5 px-2 py-0.5 rounded-full">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                  )}
                  <Link href={`/store/${storeSlug}/product/${product.slug || product.id}`}>
                    <h3 className="font-bold text-sm line-clamp-2 hover:text-[var(--p-color)] transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[var(--p-color)]">{product.price?.toLocaleString()} ر.س</span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">{product.comparePrice?.toLocaleString()} ر.س</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Settings Tab ─── */
function SettingsTab({ profile }: { profile: any }) {
  return (
    <div>
      <h2 className="text-3xl font-black mb-6">إعدادات الحساب</h2>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">الاسم الكامل</label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">{profile?.fullName ?? '---'}</div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">البريد الإلكتروني</label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">{profile?.email ?? '---'}</div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">رقم الجوال</label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">{profile?.phone ?? '---'}</div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 block">تاريخ التسجيل</label>
            <div className="p-4 bg-gray-50 rounded-xl font-bold text-sm">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
