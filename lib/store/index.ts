import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/lib/services/authApi'
import { customerApi } from '@/lib/services/customerApi'
import authReducer from './slices/authSlice'
import { merchantApi } from '@/lib/services/merchantApi'
import { superadminApi } from '@/lib/services/superadminApi'
import { productsApi } from '@/lib/services/productsApi'
import cartReducer from './slices/cartSlice'
import { ordersApi } from '@/lib/services/ordersApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [superadminApi.reducerPath]: superadminApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      customerApi.middleware,
      merchantApi.middleware,
      ordersApi.middleware,
      superadminApi.middleware,
      productsApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
