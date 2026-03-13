import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export interface ReviewCustomer {
  fullName: string
}

export interface Review {
  id: string
  storeId: string
  productId: string
  customerId: string
  customer: ReviewCustomer
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
}

export interface ReviewsResponse {
  reviews: Review[]
  totalReviews: number
  averageRating: number
  distribution: Record<number, number>
}

export interface CreateReviewDto {
  rating: number
  comment?: string
  productId: string
  storeSlug: string
}

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getProductReviews: builder.query<ReviewsResponse, { productId: string; storeSlug: string }>({
      query: ({ productId, storeSlug }) =>
        `/reviews/${productId}?storeSlug=${storeSlug}`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation<Review, CreateReviewDto>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
})

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi

export default reviewsApi
