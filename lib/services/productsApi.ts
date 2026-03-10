import { createApi } from '@reduxjs/toolkit/query/react';
import { Product, ProductStats, StoreCustomization, ProductStatus } from '../types/store';
import { baseQueryWithReauth } from './baseQuery';

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Products', 'Store'],
    endpoints: (builder) => ({
        getProducts: builder.query<{ products: Product[]; stats: ProductStats }, string | void>({
            query: (status) => ({
                url: '/merchant/products',
                params: status ? { status } : undefined,
            }),
            providesTags: ['Products'],
        }),
        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (body) => ({
                url: '/merchant/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
            query: ({ id, data }) => ({
                url: `/merchant/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        deleteProduct: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/merchant/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
        updateStoreCustomization: builder.mutation<any, StoreCustomization>({
            query: (body) => ({
                url: '/merchant/store/customization',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Store'],
        }),
        uploadStoreImage: builder.mutation<{ url: string }, FormData>({
            query: (formData) => ({
                url: '/merchant/store/upload-image',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Store'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateStoreCustomizationMutation,
    useUploadStoreImageMutation,
} = productsApi;
