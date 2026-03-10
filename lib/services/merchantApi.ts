import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'
import type { MerchantDashboardData } from '@/lib/types/auth'

export const merchantApi = createApi({
  reducerPath: 'merchantApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Merchant'],
  endpoints: (build) => ({
    getMyStore: build.query<MerchantDashboardData, void>({
      query: () => ({ url: '/merchant/me', method: 'GET' }),
      providesTags: ['Merchant'],
    }),
  }),
})

export const { useGetMyStoreQuery } = merchantApi

export default merchantApi
