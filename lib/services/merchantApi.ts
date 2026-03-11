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
    getPaymentSettings: build.query<any, void>({
      query: () => ({ url: '/merchant/store/payment-methods', method: 'GET' }),
      providesTags: ['Merchant'],
    }),
    updatePaymentSettings: build.mutation<any, { enabledMethods: string[] }>({
      query: (body) => ({ url: '/merchant/store/payment-methods', method: 'PATCH', body }),
      invalidatesTags: ['Merchant'],
    }),
    getOrders: build.query<any, { status?: string; page?: number; limit?: number; search?: string }>({
      query: (params) => ({ url: '/merchant/orders', method: 'GET', params }),
      providesTags: ['Merchant'],
    }),
    getOrderByCode: build.query<any, string>({
      query: (orderCode) => ({ url: `/merchant/orders/${orderCode}`, method: 'GET' }),
      providesTags: ['Merchant'],
    }),
    updateOrderStatus: build.mutation<any, { orderCode: string; status: any }>({
      query: ({ orderCode, status }) => ({ url: `/merchant/orders/${orderCode}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Merchant'],
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
