"use client";

import React from "react";
import { Star } from "lucide-react";
import { useProductContext } from "./ProductContext";
import { useProductReviews } from "./useProductReviews";
import StarRating from "../StarRating";
import AuthPromptModal from "./AuthPromptModal";
import { useRouter } from "next/navigation";

/**
 * Reviews organism: rating summary, review submission form, and the reviews list.
 * Logic-free — delegates entirely to useProductReviews.
 */
export default function ProductReviewsSection() {
  const { product, storeSlug } = useProductContext();
  const router = useRouter();

  const {
    reviewsData,
    customer,
    showReviewForm,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    submittingReview,
    handleToggleReviewForm,
    handleSubmitReview,
    showAuthModal,
    closeAuthModal,
  } = useProductReviews();

  const navigateToLogin = () => {
    router.push(
      `/store/${storeSlug}/login?redirect=/store/${storeSlug}/product/${encodeURIComponent(
        product.slug || String(product.id),
      )}`,
    );
  };

  const navigateToRegister = () => {
    router.push(`/store/${storeSlug}/register`);
  };

  return (
    <section className="mt-16 space-y-8">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">
          التقييمات ({reviewsData?.totalReviews ?? 0})
        </h2>
        <button
          onClick={handleToggleReviewForm}
          className="px-6 py-3 text-white font-black text-sm rounded-xl"
          style={{ backgroundColor: "var(--p-color)" }}
        >
          أضف تقييمك
        </button>
      </div>

      {/* ── Rating Summary ────────────────────────────────────────────────── */}
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

      {/* ── Review Form ───────────────────────────────────────────────────── */}
      {showReviewForm && customer && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white p-6 rounded-2xl border border-slate-300 space-y-4"
        >
          <h3 className="font-black">تقييمك للمنتج</h3>

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
                    star <= reviewRating ? "text-amber-400" : "text-slate-200"
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
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none text-sm font-medium h-24 resize-none"
            maxLength={500}
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="px-8 py-3 text-white font-black rounded-xl disabled:opacity-50"
            style={{ backgroundColor: "var(--p-color)" }}
          >
            {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </form>
      )}

      {/* ── Reviews List ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {reviewsData?.reviews?.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Star size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">لا توجد تقييمات بعد — كن أول من يقيّم!</p>
          </div>
        )}
        {reviewsData?.reviews?.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl border border-slate-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-black text-sm">
                  {review.customer.fullName}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString(
                    "ar-SA-u-nu-latn",
                  )}
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

      {/* Auth modal — review path */}
      {showAuthModal && (
        <AuthPromptModal
          type="review"
          onLogin={navigateToLogin}
          onRegister={navigateToRegister}
          onClose={closeAuthModal}
        />
      )}
    </section>
  );
}
