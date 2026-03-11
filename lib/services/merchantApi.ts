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
    getCustomers: build.query<any, { search?: string; status?: string; page?: number; limit?: number }>({
      query: (params) => ({ url: '/merchant/customers', method: 'GET', params }),
    }),
    updateCustomerStatus: build.mutation<any, { id: string; status: 'ACTIVE' | 'BANNED' }>({
      query: ({ id, status }) => ({ url: `/merchant/customers/${id}/status`, method: 'PATCH', body: { status } }),
    }),
  }),
})

export const { useGetMyStoreQuery, useGetCustomersQuery, useUpdateCustomerStatusMutation } = merchantApi

export default merchantApi
