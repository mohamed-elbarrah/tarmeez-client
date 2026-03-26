import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/lib/services/authApi";
import { customerApi } from "@/lib/services/customerApi";
import authReducer from "./slices/authSlice";
import { merchantApi } from "@/lib/services/merchantApi";
import { superadminApi } from "@/lib/services/superadminApi";
import { productsApi } from "@/lib/services/productsApi";
import cartReducer from "./slices/cartSlice";
import { ordersApi } from "@/lib/services/ordersApi";
import { reviewsApi } from "@/lib/services/reviewsApi";
import { wishlistApi } from "@/lib/services/wishlistApi";
import { categoriesApi } from "@/lib/services/categoriesApi";
import { pagesApi } from "@/lib/services/pagesApi";
import { analyticsApi } from "@/lib/services/analyticsApi";
import { couponsApi } from "@/lib/services/couponsApi";
import { teamApi } from "@/lib/services/teamApi";
import { analyticsListenerMiddleware } from "./analytics-listener";

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
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [pagesApi.reducerPath]: pagesApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(analyticsListenerMiddleware.middleware)
      .concat(
        authApi.middleware,
        customerApi.middleware,
        merchantApi.middleware,
        ordersApi.middleware,
        superadminApi.middleware,
        productsApi.middleware,
        reviewsApi.middleware,
        wishlistApi.middleware,
        categoriesApi.middleware,
        pagesApi.middleware,
        analyticsApi.middleware,
        couponsApi.middleware,
        teamApi.middleware,
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
