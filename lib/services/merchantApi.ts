import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { MerchantDashboardData } from '@/lib/types/auth'

export const merchantApi = createApi({
  reducerPath: 'merchantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    credentials: 'include',
  }),
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
