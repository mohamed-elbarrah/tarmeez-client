"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/lib/services/reviewsApi";
import { useGetCustomerMeQuery } from "@/lib/services/customerApi";
import { useProductContext } from "./ProductContext";

/**
 * Encapsulates all review-related logic: fetching, form state, and submission.
 * RTK Query deduplicates useGetCustomerMeQuery across concurrent hooks — no double fetch.
 *
 * Zero JSX — pure logic / RTK bridge.
 */
export function useProductReviews() {
  const { product, storeSlug } = useProductContext();

  const { data: customerProfile } = useGetCustomerMeQuery();
  const customer = customerProfile ?? null;

  const { data: reviewsData } = useGetProductReviewsQuery({
    productId: String(product.id),
    storeSlug,
  });

  const [createReview, { isLoading: submittingReview }] =
    useCreateReviewMutation();

  // ── Form state ─────────────────────────────────────────────────────────────

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // ── Auth modal (review auth only) ──────────────────────────────────────────

  const [showAuthModal, setShowAuthModal] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleToggleReviewForm = () => {
    if (!customer) {
      setShowAuthModal(true);
      return;
    }
    setShowReviewForm((prev) => !prev);
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
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message ?? "حدث خطأ");
    }
  };

  // ── Exposed API ────────────────────────────────────────────────────────────

  return {
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
    // Auth modal
    showAuthModal,
    closeAuthModal: () => setShowAuthModal(false),
  } as const;
}
