import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CurrentUser,
  PlatformLoginPayload,
  MerchantRegisterPayload,
  CustomerLoginPayload,
  CustomerRegisterPayload,
} from '@/lib/types/auth'
import { setUser, setInitialized, clearUser } from '@/lib/store/slices/authSlice'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    credentials: 'include',
  }),
  endpoints: (build) => ({
    platformLogin: build.mutation<{ user: CurrentUser }, PlatformLoginPayload>({
      query: (body) => ({ url: '/auth/platform/login', method: 'POST', body }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) {
            dispatch(setUser(data.user))
            const role = data.user.role
            if (role === 'SUPERADMIN') {
              window.location.href = '/superadmin'
            } else if (role === 'MERCHANT') {
              const status = data.user.merchant?.status
              if (status === 'ACTIVE') {
                window.location.href = '/merchant'
              } else if (status === 'PENDING') {
                const email = data.user.email
                window.location.href = `/auth/pending?email=${encodeURIComponent(email)}`
              } else if (status === 'REJECTED') {
                // Let components handle showing a rejection error by throwing
                throw new Error('REJECTED')
              }
            }
          }
        } catch (err) {
          // swallow here; components will get the error
        }
      },
    }),

    merchantRegister: build.mutation<any, MerchantRegisterPayload>({
      query: (body) => ({ url: '/auth/platform/register', method: 'POST', body }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled
          const email = args.email
          window.location.href = `/auth/pending?email=${encodeURIComponent(email)}`
        } catch (err) {}
      },
    }),

    customerLogin: build.mutation<{ user: CurrentUser }, CustomerLoginPayload>({
      query: (body) => ({ url: '/auth/customer/login', method: 'POST', body }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) {
            dispatch(setUser(data.user))
            window.location.href = `/store/${encodeURIComponent(args.storeSlug)}/account`
          }
        } catch (err) {}
      },
    }),

    customerRegister: build.mutation<any, CustomerRegisterPayload>({
      query: (body) => ({ url: '/auth/customer/register', method: 'POST', body }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) {
            // assume server sets cookies and returns user
            // attempt to set user if returned
            // if backend returns user shape use it
            // otherwise redirect to account
            if ((data as any).user) {
              dispatch(setUser((data as any).user))
            }
            window.location.href = `/store/${encodeURIComponent(args.storeSlug)}/account`
          }
        } catch (err) {}
      },
    }),

    getMe: build.query<CurrentUser | null, void>({
      query: () => ({ url: '/auth/me', method: 'GET' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data ?? null))
          dispatch(setInitialized(true))
        } catch (err) {
          dispatch(setUser(null))
          dispatch(setInitialized(true))
        }
      },
    }),

    logout: build.mutation<any, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(clearUser())
          window.location.href = '/auth/login'
        } catch (err) {}
      },
    }),

    refreshTokens: build.mutation<any, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
    }),
  }),
})

export const {
  usePlatformLoginMutation,
  useMerchantRegisterMutation,
  useCustomerLoginMutation,
  useCustomerRegisterMutation,
  useLogoutMutation,
} = authApi

export default authApi
