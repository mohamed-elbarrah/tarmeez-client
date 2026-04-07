"use client";

import React, { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { StoreProduct, StoreData } from "@/lib/themes/types";
import ProductImage from "@/lib/themes/store/default/components/ProductImage";
import StarRating from "@/lib/themes/store/default/components/StarRating";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/slices/cartSlice";
import { productViewed } from "@/lib/store/analytics-listener";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/lib/services/reviewsApi";
import { useToggleWishlistMutation } from "@/lib/services/wishlistApi";
import { useGetCustomerMeQuery } from "@/lib/services/customerApi";
import { ThemeEngine } from "@/lib/themes/engine/ThemeEngine";
import { ComponentRegistry } from "@/lib/themes/engine/ComponentRegistry";
import SharedDonationAmountSelector from "@/components/storefront/modules/charity/shared/DonationAmountSelector";
import SharedDonationProgressBar from "@/components/storefront/modules/charity/shared/DonationProgressBar";
import { getDonationProgress } from "@/lib/helpers/donation";

interface Props {
  storeData: StoreData;
  product: StoreProduct;
  themeSlug?: string;
}

export default function CharityProductDetailPage({
  storeData,
  product,
  themeSlug = "charity",
}: Props) {
  const dispatch = useAppDispatch();
  const storeSlug = storeData.slug;
  const engine = new ThemeEngine(storeData, storeData.theme ?? null);
  const theme = engine.getComputedConfig();

  // Resolve ProductCard component
  const ProductCardComponent = ComponentRegistry.get(themeSlug, "ProductCard");

  const { data: customerProfile } = useGetCustomerMeQuery();
  const customer = customerProfile ?? null;

  const dm = product.donationMetadata;
  const targetAmount = dm?.targetAmount ?? 0;
  const currentAmount = dm?.currentAmount ?? 0;
  const donationOptions = dm?.donationOptions ?? [50, 100, 200, 500];
  const allowCustomAmount = dm?.allowCustomAmount ?? true;
  const progressMessages = dm?.progressMessages ?? null;

  // Compute project status from progress
  const { percentage: donationPercent, message: progressMessage } =
    getDonationProgress(currentAmount, targetAmount, progressMessages);
  const projectStatus =
    donationPercent >= 100
      ? "مكتمل"
      : donationPercent >= 75
        ? "قارب على الاكتمال"
        : donationPercent > 0
          ? "جاري التنفيذ"
          : "جديد";
  const projectStatusColor =
    donationPercent >= 100
      ? "#059669"
      : donationPercent >= 75
        ? "#d97706"
        : donationPercent > 0
          ? "#2563eb"
          : "#64748b";

  const [selectedAmount, setSelectedAmount] = useState<number>(
    donationOptions[0],
  );
  const [customValue, setCustomValue] = useState("");
  const isCustom = selectedAmount === 0;

  // Wishlist
  const [toggleWishlist] = useToggleWishlistMutation();
  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted ?? false,
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState<"wishlist" | "review">(
    "wishlist",
  );

  // Reviews
  const { data: reviewsData } = useGetProductReviewsQuery({
    productId: String(product.id),
    storeSlug,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [createReview, { isLoading: submittingReview }] =
    useCreateReviewMutation();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Image gallery
  const productImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];
  const [selectedImage, setSelectedImage] = useState(0);

  // Track product view
  useEffect(() => {
    dispatch(
      productViewed({ productId: String(product.id), storeRef: storeSlug }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  if (!product) return null;

  const handleDonate = () => {
    const effectiveAmount = isCustom ? parseFloat(customValue) : selectedAmount;
    if (!effectiveAmount || effectiveAmount <= 0) {
      toast.error("يرجى اختيار مبلغ التبرع");
      return;
    }
    dispatch(
      addItem({
        storeSlug,
        item: {
          id: product.id,
          name: product.name,
          price: effectiveAmount,
          image: productImages[0] || "",
          quantity: 1,
          isDonation: true,
        },
      }),
    );
    toast.success("تمت إضافة التبرع للسلة");
  };

  const handleWishlist = async () => {
    if (!customer) {
      setAuthModalType("wishlist");
      setShowAuthModal(true);
      return;
    }
    try {
      const result = await toggleWishlist({
        productId: String(product.id),
        storeSlug,
      }).unwrap();
      setIsWishlisted(result.wishlisted);
      toast.success(
        result.wishlisted ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة",
      );
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating < 1) {
      toast.error("يرجى اختيار تقييم");
      return;
    }
    try {
      await createReview({
        rating: reviewRating,
        comment: reviewComment || undefined,
        productId: String(product.id),
        storeSlug,
      }).unwrap();
      toast.success("تم إضافة تقييمك بنجاح");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "حدث خطأ");
    }
  };

  const themeStyles = {
    "--p-color": theme.primary,
    "--s-color": theme.secondary,
    "--a-color": theme.accent,
    "--b-color": theme.buttonColor,
    "--t-color": theme.textColor,
    "--h-color": theme.headingColor,
    "--radius": theme.borderRadius,
    "--font-family": theme.fontFamily,
  } as React.CSSProperties;

  return (
    <div
      className="container py-4 md:py-8"
      dir="rtl"
      style={{ ...themeStyles, fontFamily: "var(--font-family)" }}
    >
      {/* Main Product Card */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-8 bg-white p-6 md:p-6 border border-slate-300 shadow-sm"
        style={{ borderRadius: "calc(var(--radius) * 1.5)" }}
      >
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            className="aspect-square bg-slate-50 border border-slate-300 flex items-center justify-center relative overflow-hidden group"
            style={{ borderRadius: "var(--radius)" }}
          >
            {productImages[selectedImage] ? (
              <ProductImage
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="text-slate-300 font-black text-xl uppercase tracking-widest">
                صورة المشروع
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
                      ? "border-(--p-color) bg-blue-50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Info — Fundraising-first layout */}
        <div className="flex flex-col">
          {/* Category + Wishlist */}
          <div className="flex justify-between items-start mb-3 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1"
                  style={{
                    color: "var(--p-color)",
                    backgroundColor:
                      "color-mix(in srgb, var(--p-color) 10%, transparent)",
                    borderRadius: "calc(var(--radius) * 0.5)",
                  }}
                >
                  {product.category}
                </span>
              )}
            </div>
            <button
              onClick={handleWishlist}
              className={`transition-colors p-2 ${
                isWishlisted
                  ? "text-red-500"
                  : "text-slate-300 hover:text-red-500"
              }`}
            >
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Project Title */}
          <h1
            className="text-3xl md:text-4xl font-black mb-4 leading-tight"
            style={{ color: "var(--h-color)" }}
          >
            {product.name}
          </h1>

          {product.description && (
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 border-r-4 border-slate-300 pr-4">
              {product.description}
            </p>
          )}

          {/* progress & options & CTA */}
          <div className="mt-auto">
            {/* ═══ HERO: Donation Progress ═══ */}
            {targetAmount > 0 && (
              <SharedDonationProgressBar
                progressBarPercent={donationPercent}
                progressMessage={progressMessage}
                goalDisplay={`${targetAmount} ر.س`}
                collectedDisplay={`${currentAmount} ر.س`}
              />
            )}

            {/* ═══ Donation Amount Selector ═══ */}
            <div className="mb-3">
              <SharedDonationAmountSelector
                donationPresets={donationOptions}
                allowCustomAmount={allowCustomAmount}
                selectedAmount={selectedAmount}
                onAmountChange={(amount) => {
                  setSelectedAmount(amount);
                  if (amount !== 0) setCustomValue("");
                }}
              />
            </div>

            {/* ═══ CTA row — button + price pill (mirrors CharityProductCard) ═══ */}
            <div className="flex items-center gap-2 mt-auto pt-2">
              <button
                onClick={handleDonate}
                disabled={
                  isCustom
                    ? !(parseFloat(customValue) > 0)
                    : selectedAmount <= 0
                }
                className="donation-card__cta bg-(--p-color) text-white text-xs font-bold cursor-pointer px-2 py-2 hover:opacity-90 transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
              >
                تبرع الآن
              </button>

              {/* Price pill — input when custom, display when preset */}
              {isCustom ? (
                <div
                  className="flex-1 min-w-0 h-full flex items-center justify-between gap-1 bg-gray-50 border border-gray-200 px-3 overflow-hidden"
                  style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
                >
                  <input
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="المبلغ..."
                    className="flex-1 min-w-0 bg-transparent outline-none text-base font-black text-(--p-color)"
                    min={1}
                  />
                  <span className="text-[11px] font-semibold text-gray-400 tracking-wide shrink-0">
                    ر.س
                  </span>
                </div>
              ) : (
                <div
                  className="flex-1 min-w-0 h-full flex items-center justify-between gap-1 bg-gray-50 border border-gray-200 px-3 cursor-pointer overflow-hidden"
                  style={{ borderRadius: "calc(var(--radius) * 0.5)" }}
                  aria-label={`المبلغ: ${selectedAmount} ر.س`}
                >
                  <span className="font-black text-base text-(--p-color) text-start flex-1">
                    {selectedAmount}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 tracking-wide shrink-0">
                    ر.س
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">
            التقييمات ({reviewsData?.totalReviews ?? 0})
          </h2>
          <button
            onClick={() => {
              if (!customer) {
                setAuthModalType("review");
                setShowAuthModal(true);
              } else {
                setShowReviewForm(!showReviewForm);
              }
            }}
            className="px-6 py-3 text-white font-black text-sm rounded-xl"
            style={{ backgroundColor: "var(--p-color)" }}
          >
            أضف تقييمك
          </button>
        </div>

        {/* Average Rating Summary */}
        {reviewsData && reviewsData.totalReviews > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-300 flex items-center gap-8">
            <div className="text-center">
              <div
                className="text-5xl font-black"
                style={{ color: "var(--p-color)" }}
              >
                {reviewsData.averageRating.toFixed(1)}
              </div>
              <StarRating rating={reviewsData.averageRating} />
              <div className="text-xs text-slate-400 mt-1">
                {reviewsData.totalReviews} تقييم
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-4">{star}</span>
                  <Star
                    size={12}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{
                        width: `${
                          reviewsData.totalReviews > 0
                            ? ((reviewsData.distribution[star] ?? 0) /
                                reviewsData.totalReviews) *
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
            className="bg-white p-6 rounded-2xl border border-slate-300 space-y-4"
          >
            <div>
              <label className="text-sm font-bold block mb-2">تقييمك</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="cursor-pointer"
                  >
                    <Star
                      size={24}
                      className={
                        star <= reviewRating
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                      fill="currentColor"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-bold block mb-2">
                تعليقك (اختياري)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                rows={3}
                placeholder="شاركنا تجربتك..."
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-3 text-white font-bold text-sm rounded-xl disabled:opacity-50"
              style={{ backgroundColor: "var(--p-color)" }}
            >
              {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviewsData?.reviews?.map((review: any) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl border border-slate-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">
                  {(review.customerName || "م")[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">
                    {review.customerName || "عميل"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString(
                      "ar-SA-u-nu-latn",
                    )}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size={14} />
            </div>
            {review.comment && (
              <p className="text-sm text-slate-600">{review.comment}</p>
            )}
          </div>
        ))}
      </section>

      {/* Auth Modal for wishlist/review */}
      {showAuthModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black mb-2">تسجيل الدخول مطلوب</h3>
            <p className="text-sm text-slate-500 mb-6">
              {authModalType === "wishlist"
                ? "سجل دخولك لإضافة المشروع للمفضلة"
                : "سجل دخولك لإضافة تقييم"}
            </p>
            <a
              href={`/store/${storeSlug}/account`}
              className="block w-full py-3 text-white font-bold rounded-xl text-center"
              style={{ backgroundColor: "var(--p-color)" }}
            >
              تسجيل الدخول
            </a>
          </div>
        </div>
      )}
      {/* Related Projects */}
      {storeData.products && storeData.products.length > 1 && (
        <section className="mt-16 space-y-8">
          <h2 className="text-2xl font-black">مشاريع خيرة مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {storeData.products
              .filter(
                (p) => p.id !== product.id && p.category === product.category,
              )
              .slice(0, 4)
              .map((p) => (
                <ProductCardComponent
                  key={p.id}
                  product={p}
                  storeSlug={storeSlug}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
