import { createApi } from '@reduxjs/toolkit/query/react'
import { customerBaseQueryWithReauth } from './baseQuery'

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: customerBaseQueryWithReauth,
  endpoints: (build) => ({
    // Profile
    getCustomerMe: build.query<any, void>({ query: () => ({ url: '/auth/customer/me', method: 'GET' }) }),
    updateProfile: build.mutation<any, any>({ query: (body) => ({ url: '/auth/customer/profile', method: 'PATCH', body }) }),

    // Addresses
    getAddresses: build.query<any[], void>({ query: () => ({ url: '/customer/addresses', method: 'GET' }) }),
    createAddress: build.mutation<any, any>({ query: (body) => ({ url: '/customer/addresses', method: 'POST', body }) }),
    updateAddress: build.mutation<any, { id: string; body: any }>({ query: ({ id, body }) => ({ url: `/customer/addresses/${id}`, method: 'PATCH', body }) }),
    deleteAddress: build.mutation<any, string>({ query: (id) => ({ url: `/customer/addresses/${id}`, method: 'DELETE' }) }),

    // Payment Methods
    getPaymentMethods: build.query<any[], void>({ query: () => ({ url: '/customer/payment-methods', method: 'GET' }) }),
    createPaymentMethod: build.mutation<any, any>({ query: (body) => ({ url: '/customer/payment-methods', method: 'POST', body }) }),
    setDefaultPayment: build.mutation<any, string>({ query: (id) => ({ url: `/customer/payment-methods/${id}/default`, method: 'PATCH' }) }),
    deletePaymentMethod: build.mutation<any, string>({ query: (id) => ({ url: `/customer/payment-methods/${id}`, method: 'DELETE' }) }),

    // Orders
    getOrders: build.query<any[], void>({ query: () => ({ url: '/customer/orders', method: 'GET' }) }),

    // Logout (uses customer-specific endpoint)
    customerLogout: build.mutation<any, void>({ query: () => ({ url: '/auth/customer/logout', method: 'POST' }) }),
  }),
})

export const {
  useGetCustomerMeQuery,
  useUpdateProfileMutation,

  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,

  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useSetDefaultPaymentMutation,
  useDeletePaymentMethodMutation,

  useGetOrdersQuery,
  useCustomerLogoutMutation,
} = customerApi

export default customerApi
