import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery,
  tagTypes: ['Orders'],
  endpoints: (build) => ({
    createOrder: build.mutation<any, any>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    trackOrder: build.query<any, { orderCode: string; storeSlug: string }>({
      query: ({ orderCode, storeSlug }) => ({ url: `/orders/${orderCode}`, method: 'GET', params: { storeSlug } }),
    }),
  }),
})

export const { useCreateOrderMutation, useTrackOrderQuery } = ordersApi

export default ordersApi
