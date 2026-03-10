import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, ProductStats, StoreCustomization, ProductStatus } from '../types/store';

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api',
        credentials: 'include',
    }),
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
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateStoreCustomizationMutation,
} = productsApi;
