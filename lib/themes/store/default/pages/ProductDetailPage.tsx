"use client"

import React, { useState } from 'react'
import { Star, ShoppingCart, Heart, Tag, Zap, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StoreProduct, StoreData } from '@/lib/themes/types'
import ProductCard from '@/lib/themes/store/default/components/ProductCard'
import ProductImage from '@/lib/themes/store/default/components/ProductImage'
import StarRating from '@/lib/themes/store/default/components/StarRating'
import { useAppDispatch } from '@/lib/store/hooks'
import { addItem } from '@/lib/store/slices/cartSlice'
import { useGetProductReviewsQuery, useCreateReviewMutation } from '@/lib/services/reviewsApi'
import { useToggleWishlistMutation } from '@/lib/services/wishlistApi'
import { useGetCustomerMeQuery } from '@/lib/services/customerApi'
import { resolveTokens } from '@/lib/themes/store/default/config'

interface Props {
  storeData: StoreData
  product: StoreProduct
}

export default function ProductDetailPage({ storeData, product }: Props) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const storeSlug = storeData.slug
  const products = storeData.products ?? []
  const theme = resolveTokens(storeData)

  const { data: customerProfile } = useGetCustomerMeQuery()
  const customer = customerProfile ?? null

  // Offers
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)

  // Wishlist
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalType, setAuthModalType] = useState<'wishlist' | 'review'>('wishlist')
  const [toggleWishlist] = useToggleWishlistMutation()
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted ?? false)

  // Reviews
  const { data: reviewsData } = useGetProductReviewsQuery({
    productId: String(product.id),
    storeSlug,
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation()
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Image gallery
  const productImages = product.images?.length ? product.images : product.image ? [product.image] : []
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) return null

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    dispatch(
      addItem({
        storeSlug,
        item: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImages[0] || '',
          quantity: 1,
        },
      })
    )
    toast.success('تمت الإضافة للسلة')
  }

  const handleWishlist = async () => {
    if (!customer) {
      setAuthModalType('wishlist')
      setShowAuthModal(true)
      return
    }
    try {
      const result = await toggleWishlist({
        productId: String(product.id),
        storeSlug,
      }).unwrap()
      setIsWishlisted(result.wishlisted)
      toast.success(result.wishlisted ? 'تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة')
    } catch {
      toast.error('حدث خطأ')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reviewRating < 1) {
      toast.error('يرجى اختيار تقييم')
      return
    }
    try {
      await createReview({
        rating: reviewRating,
        comment: reviewComment || undefined,
        productId: String(product.id),
        storeSlug,
      }).unwrap()
      toast.success('تم إضافة تقييمك بنجاح')
      setShowReviewForm(false)
      setReviewRating(0)
      setReviewComment('')
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'حدث خطأ')
    }
  }

  const themeStyles = {
    '--p-color': theme.primary,
    '--s-color': theme.secondary,
    '--a-color': theme.accent,
    '--b-color': theme.buttonColor,
    '--t-color': theme.textColor,
    '--h-color': theme.headingColor,
    '--radius': theme.borderRadius,
    '--font-family': theme.fontFamily,
  } as React.CSSProperties

  const savings =
    product.comparePrice && product.comparePrice > product.price
      ? product.comparePrice - product.price
      : product.oldPrice && product.oldPrice > product.price
        ? product.oldPrice - product.price
        : 0

  const discountPercent =
    savings > 0
      ? Math.round((savings / (product.comparePrice ?? product.oldPrice ?? product.price)) * 100)
      : 0

  return (
    <div 
      className="max-w-6xl mx-auto p-4 md:p-8" 
      dir="rtl" 
      style={{ ...themeStyles, fontFamily: 'var(--font-family)' }}
    >
      {/* Main Product Card */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white p-6 md:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md"
        style={{ borderRadius: 'calc(var(--radius) * 1.5)' }}
      >
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            className="aspect-square bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group"
            style={{ borderRadius: 'var(--radius)' }}
          >
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full z-10 shadow-lg">
                خصم {discountPercent}%
              </span>
            )}
            {productImages[selectedImage] ? (
              <ProductImage
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain  group-hover:scale-110 transition-transform duration-500"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="text-slate-300 font-black text-xl uppercase tracking-widest">
                Product Image
              </div>
            )}
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square border-2 rounded-xl cursor-pointer transition-all overflow-hidden relative ${
                    selectedImage === i
                      ? 'border-[var(--p-color)] bg-blue-50'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <ProductImage src={img} alt="" fill className="object-contain p-2" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            {product.category && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1"
                style={{ 
                  color: 'var(--p-color)', 
                  backgroundColor: 'color-mix(in srgb, var(--p-color) 10%, transparent)',
                  borderRadius: 'calc(var(--radius) * 0.5)'
                }}
              >
                {product.category}
              </span>
            )}
            <button
              onClick={handleWishlist}
              className={`transition-colors p-2 ${
                isWishlisted ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
              }`}
            >
              <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black mb-4 leading-tight"
            style={{ color: 'var(--h-color)' }}
          >
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <Star size={16} className="text-amber-400" fill="currentColor" />
              <span className="font-black text-sm text-amber-700">
                {(product.averageRating ?? product.rating ?? 0).toFixed(1)}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400 border-r pr-4 border-slate-200">
              ({reviewsData?.totalReviews ?? product.reviewCount ?? 0} تقييم من العملاء)
            </span>
            <span className="text-green-600 font-black text-[10px] bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> متوفر الآن
            </span>
          </div>

          {product.description && (
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 border-r-4 border-slate-100 pr-4">
              {product.description}
            </p>
          )}

          {/* Price Section */}
          <div className="p-6 mb-8 border border-slate-100 flex items-center justify-between"
               style={{ backgroundColor: 'bg-slate-50', borderRadius: 'var(--radius)' }}>
            <div className="space-y-1">
              <span className="text-4xl font-black" style={{ color: 'var(--p-color)' }}>
                {product.price.toLocaleString()} ر.س
              </span>
              {savings > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 font-bold line-through">
                    {(product.comparePrice ?? product.oldPrice ?? 0).toLocaleString()} ر.س
                  </span>
                  <span className="text-[10px] font-black text-red-500">
                    وفرت {savings.toLocaleString()} ر.س
                  </span>
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                السعر شامل الضريبة
              </div>
            </div>
          </div>

          {/* Offers Section */}
          {product.offers && product.offers.length > 0 && (
            <div className="mb-8 space-y-4">
              <h4 className="text-sm font-black flex items-center gap-2">
                <Tag size={18} style={{ color: 'var(--p-color)' }} />
                عروض التوفير الحصرية:
              </h4>
              <div className="grid gap-3">
                {product.offers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOffer(offer.id)}
                    className={`relative p-4 border-2 cursor-pointer transition-all flex items-center justify-between overflow-hidden ${
                      selectedOffer === offer.id
                        ? 'border-[var(--p-color)] bg-blue-50/50'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    {offer.badge && (
                      <div className="absolute -left-8 top-2 bg-amber-500 text-white text-[8px] font-black py-1 px-10 -rotate-45">
                        {offer.badge}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOffer === offer.id ? 'border-[var(--p-color)]' : 'border-slate-200'
                        }`}
                      >
                        {selectedOffer === offer.id && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: 'var(--p-color)' }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black">{offer.title}</div>
                        {offer.description && (
                          <div className="text-[10px] font-bold text-slate-400">
                            {offer.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-md font-black">{Number(offer.price)} ر.س</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-4 pt-4 border-t mb-8">
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-500" /> شحن سريع وتوصيل آمن لباب منزلك.
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-500" /> ضمان جودة أصلي 100% من الوكيل.
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-500" /> إمكانية الاستبدال والاسترجاع السهل.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-grow py-5 text-white font-black text-lg shadow-xl transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 group"
              style={{ backgroundColor: 'var(--p-color)', borderRadius: 'var(--radius)' }}
            >
              <ShoppingCart size={22} className="group-hover:animate-bounce" />
              إضافة للسلة
            </button>
          </div>

          {selectedOffer && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase">
              <Zap size={12} className="text-amber-500" /> ينتهي هذا العرض قريباً
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">التقييمات ({reviewsData?.totalReviews ?? 0})</h2>
          <button
            onClick={() => {
              if (!customer) {
                setAuthModalType('review')
                setShowAuthModal(true)
              } else {
                setShowReviewForm(!showReviewForm)
              }
            }}
            className="px-6 py-3 text-white font-black text-sm rounded-xl"
            style={{ backgroundColor: 'var(--p-color)' }}
          >
            أضف تقييمك
          </button>
        </div>

        {/* Average Rating Summary */}
        {reviewsData && reviewsData.totalReviews > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-black" style={{ color: 'var(--p-color)' }}>
                {reviewsData.averageRating.toFixed(1)}
              </div>
              <StarRating rating={reviewsData.averageRating} />
              <div className="text-xs text-slate-400 mt-1">{reviewsData.totalReviews} تقييم</div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-4">{star}</span>
                  <Star size={12} className="text-amber-400" fill="currentColor" />
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{
                        width: `${
                          reviewsData.totalReviews > 0
                            ? ((reviewsData.distribution[star] ?? 0) / reviewsData.totalReviews) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-4">
                    {reviewsData.distribution[star] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && customer && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4"
          >
            <h3 className="font-black">تقييمك للمنتج</h3>

            {/* Star Rating Input */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    className={
                      star <= reviewRating ? 'text-amber-400' : 'text-slate-200'
                    }
                    fill="currentColor"
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="شاركنا تجربتك مع المنتج (اختياري)"
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium h-24 resize-none"
              maxLength={500}
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-8 py-3 text-white font-black rounded-xl disabled:opacity-50"
              style={{ backgroundColor: 'var(--p-color)' }}
            >
              {submittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsData?.reviews?.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Star size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">لا توجد تقييمات بعد — كن أول من يقيّم!</p>
            </div>
          )}
          {reviewsData?.reviews?.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-black text-sm">{review.customer.fullName}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 space-y-8">
          <h2 className="text-2xl font-black">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} theme={theme} storeSlug={storeSlug} />
            ))}
          </div>
        </section>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white p-8 max-w-sm w-full text-center space-y-6"
            style={{ borderRadius: 'calc(var(--radius) * 2)' }}
          >
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              {authModalType === 'review' ? (
                <Star size={32} className="text-amber-400" fill="currentColor" />
              ) : (
                <Heart size={32} className="text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">
                {authModalType === 'review' ? 'أضف تقييمك' : 'أضف للمفضلة'}
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                {authModalType === 'review' 
                  ? 'يجب تسجيل الدخول أو إنشاء حساب لمشاركة تجربتك مع المنتج'
                  : 'يجب تسجيل الدخول أو إنشاء حساب لحفظ المنتجات في مفضلتك'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  router.push(
                    `/store/${storeSlug}/login?redirect=/store/${storeSlug}/product/${product.slug || product.id}`
                  )
                }
                className="flex-1 py-3 text-white font-black rounded-xl"
                style={{ backgroundColor: 'var(--p-color)' }}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-black rounded-xl"
              >
                لاحقاً
              </button>
            </div>
            <button
              onClick={() => router.push(`/store/${storeSlug}/register`)}
              className="text-sm font-bold underline"
              style={{ color: 'var(--p-color)' }}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
