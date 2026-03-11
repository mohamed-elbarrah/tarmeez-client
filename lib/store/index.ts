import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/lib/services/authApi'
import { customerApi } from '@/lib/services/customerApi'
import authReducer from './slices/authSlice'
import { merchantApi } from '@/lib/services/merchantApi'
import { superadminApi } from '@/lib/services/superadminApi'
import { productsApi } from '@/lib/services/productsApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [superadminApi.reducerPath]: superadminApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      customerApi.middleware,
      merchantApi.middleware,
      superadminApi.middleware,
      productsApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
