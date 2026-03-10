import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/lib/services/authApi'
import authReducer from './slices/authSlice'
import { merchantApi } from '@/lib/services/merchantApi'
import { superadminApi } from '@/lib/services/superadminApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [superadminApi.reducerPath]: superadminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      merchantApi.middleware,
      superadminApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
