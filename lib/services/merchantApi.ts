import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type { MerchantDashboardData, StoreSettings } from "@/lib/types/auth";


export const merchantApi = createApi({
  reducerPath: "merchantApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Merchant"],
  endpoints: (build) => ({
    getMyStore: build.query<MerchantDashboardData, void>({
      query: () => ({ url: "/merchant/me", method: "GET" }),
      providesTags: ["Merchant"],
    }),
    getPaymentSettings: build.query<any, void>({
      query: () => ({ url: "/merchant/store/payment-methods", method: "GET" }),
      providesTags: ["Merchant"],
    }),
    updatePaymentSettings: build.mutation<any, { enabledMethods: string[] }>({
      query: (body) => ({
        url: "/merchant/store/payment-methods",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Merchant"],
    }),
    getOrders: build.query<
      any,
      { status?: string; page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({ url: "/merchant/orders", method: "GET", params }),
      providesTags: ["Merchant"],
    }),
    getOrderByCode: build.query<any, string>({
      query: (orderCode) => ({
        url: `/merchant/orders/${orderCode}`,
        method: "GET",
      }),
      providesTags: ["Merchant"],
    }),
    updateOrderStatus: build.mutation<any, { orderCode: string; status: any }>({
      query: ({ orderCode, status }) => ({
        url: `/merchant/orders/${orderCode}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Merchant"],
    }),
    getCustomers: build.query<
      any,
      { search?: string; status?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/merchant/customers",
        method: "GET",
        params,
      }),
    }),
    updateCustomerStatus: build.mutation<
      any,
      { id: string; status: "ACTIVE" | "BANNED" }
    >({
      query: ({ id, status }) => ({
        url: `/merchant/customers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    /** PATCH /merchant/store/theme — switches the active theme for the store */
    switchTheme: build.mutation<
      { storeId: string; themeId: string },
      { themeId: string }
    >({
      query: (body) => ({
        url: "/merchant/store/theme",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Merchant"],
    }),
    /** GET /themes — public list of all available themes */
    getAvailableThemes: build.query<any[], void>({
      query: () => "/themes",
    }),
    /** GET /merchant/settings — fetch store settings */
    getSettings: build.query<StoreSettings, void>({
      query: () => ({ url: "/merchant/settings", method: "GET" }),
      providesTags: ["Merchant"],
    }),
    /** PATCH /merchant/settings — update store settings with optimistic update */
    updateSettings: build.mutation<StoreSettings, Partial<StoreSettings>>({
      query: (body) => ({
        url: "/merchant/settings",
        method: "PATCH",
        body,
      }),
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        // Optimistically apply the patch so the UI reflects changes immediately
        const patchResult = dispatch(
          merchantApi.util.updateQueryData("getSettings", undefined, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          // Roll back on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["Merchant"],
    }),
    /** POST /merchant/store/upload-image — uploads a file to the store assets */
    uploadStoreImage: build.mutation<{ url: string }, FormData>({
      query: (body) => ({
        url: "/merchant/store/upload-image",
        method: "POST",
        body,
      }),
    }),
  }),
});



export const {
  useGetMyStoreQuery,
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
  useGetOrdersQuery,
  useGetOrderByCodeQuery,
  useUpdateOrderStatusMutation,
  useSwitchThemeMutation,
    useGetAvailableThemesQuery,
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useUploadStoreImageMutation,
  } = merchantApi;


export default merchantApi;
