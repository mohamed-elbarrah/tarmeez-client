import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export interface WishlistProduct {
  id: string
  name: string
  price: number
  comparePrice?: number
  images: string[]
  slug: string
  category?: string
}

export interface WishlistItem {
  id: string
  productId: string
  product: WishlistProduct
  createdAt: string
}

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Wishlist'],
  endpoints: (builder) => ({
    toggleWishlist: builder.mutation<{ wishlisted: boolean }, { productId: string; storeSlug: string }>({
      query: (body) => ({
        url: '/customer/wishlist',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wishlist'],
    }),
    getWishlist: builder.query<WishlistItem[], string>({
      query: (storeSlug) => `/customer/wishlist?storeSlug=${storeSlug}`,
      providesTags: ['Wishlist'],
    }),
  }),
})

export const {
  useToggleWishlistMutation,
  useGetWishlistQuery,
} = wishlistApi

export default wishlistApi
