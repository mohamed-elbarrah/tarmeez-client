import { createApi } from "@reduxjs/toolkit/query/react";
import {
  Product,
  ProductStats,
  StoreCustomization,
  ProductStatus,
} from "../types/store";
import { baseQueryWithReauth } from "./baseQuery";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Store", "Offers"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      { products: Product[]; stats: ProductStats },
      string | void
    >({
      query: (status) => ({
        url: "/merchant/products",
        params: status ? { status } : undefined,
      }),
      providesTags: ["Products"],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/merchant/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/merchant/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/merchant/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/merchant/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    updateStoreCustomization: builder.mutation<any, StoreCustomization>({
      query: (body) => ({
        url: "/merchant/store/customization",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Store"],
    }),
    uploadStoreImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/merchant/store/upload-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Store"],
    }),

    // ── Offers ──
    getProductOffers: builder.query<any[], string>({
      query: (productId) => `/merchant/products/${productId}/offers`,
      providesTags: ["Offers"],
    }),
    createOffer: builder.mutation<any, { productId: string; data: any }>({
      query: ({ productId, data }) => ({
        url: `/merchant/products/${productId}/offers`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Offers"],
    }),
    updateOffer: builder.mutation<
      any,
      { productId: string; offerId: string; data: any }
    >({
      query: ({ productId, offerId, data }) => ({
        url: `/merchant/products/${productId}/offers/${offerId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Offers"],
    }),
    deleteOffer: builder.mutation<any, { productId: string; offerId: string }>({
      query: ({ productId, offerId }) => ({
        url: `/merchant/products/${productId}/offers/${offerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offers"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStoreCustomizationMutation,
  useUploadStoreImageMutation,
  useGetProductOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = productsApi;
