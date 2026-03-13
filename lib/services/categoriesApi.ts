import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    sortOrder: number;
    _count?: { products: number };
    createdAt: string;
    updatedAt: string;
}

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/merchant/categories',
            providesTags: ['Categories'],
        }),
        getCategoryById: builder.query<Category, string>({
            query: (id) => `/merchant/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Categories', id }],
        }),
        createCategory: builder.mutation<Category, Partial<Category>>({
            query: (body) => ({
                url: '/merchant/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Categories'],
        }),
        updateCategory: builder.mutation<Category, { id: string; data: Partial<Category> }>({
            query: ({ id, data }) => ({
                url: `/merchant/categories/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),
        deleteCategory: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/merchant/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;
