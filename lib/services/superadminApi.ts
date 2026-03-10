import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { MerchantProfile } from '@/lib/types/auth'

export const superadminApi = createApi({
  reducerPath: 'superadminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    credentials: 'include',
  }),
  tagTypes: ['Merchants'],
  endpoints: (build) => ({
    getMerchants: build.query<MerchantProfile[], string | void>({
      query: (status) =>
        status ? `/superadmin/merchants?status=${status}` : '/superadmin/merchants',
      providesTags: ['Merchants'],
    }),

    approveMerchant: build.mutation<any, string>({
      query: (id) => ({ url: `/superadmin/merchants/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: ['Merchants'],
    }),

    rejectMerchant: build.mutation<any, string>({
      query: (id) => ({ url: `/superadmin/merchants/${id}/reject`, method: 'PATCH' }),
      invalidatesTags: ['Merchants'],
    }),
  }),
})

export const { useGetMerchantsQuery, useApproveMerchantMutation, useRejectMerchantMutation } = superadminApi

export default superadminApi
