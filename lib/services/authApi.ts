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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) {
            dispatch(setUser(data.user))
          }
        } catch (err) {
          dispatch(clearUser())
        }
      },
    }),

    merchantRegister: build.mutation<{ message: string; user: CurrentUser }, MerchantRegisterPayload>({
      query: (body) => ({ url: '/auth/platform/register', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) {
            dispatch(setUser(data.user))
          }
        } catch (err) {
          dispatch(clearUser())
        }
      },
    }),

    customerLogin: build.mutation<{ user: CurrentUser }, CustomerLoginPayload>({
      query: (body) => ({ url: '/auth/customer/login', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) dispatch(setUser(data.user))
        } catch (err) {
          dispatch(clearUser())
        }
      },
    }),

    customerRegister: build.mutation<any, CustomerRegisterPayload>({
      query: (body) => ({ url: '/auth/customer/register', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) dispatch(setUser(data.user))
        } catch (err) {
          dispatch(clearUser())
        }
      },
    }),

    getMe: build.query<CurrentUser | null, void>({
      query: () => ({ url: '/auth/me', method: 'GET' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data ?? null))
        } catch (err) {
          dispatch(setUser(null))
        } finally {
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
        } catch (err) {
          dispatch(clearUser())
        }
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
  useGetMeQuery,
  useLogoutMutation,
} = authApi

export default authApi
