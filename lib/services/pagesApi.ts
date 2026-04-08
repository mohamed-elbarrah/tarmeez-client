import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export interface Page {
  id: string;
  title: string;
  slug: string;
  type: "LANDING" | "CUSTOM" | "POLICY";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  content: Record<string, any>;
  chatHistory?: Array<{ role: string; content: string }> | null;
  showHeader: boolean;
  showFooter: boolean;
  linkedProductId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  version: number;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageDto {
  title: string;
  slug?: string;
  type: "LANDING" | "CUSTOM" | "POLICY";
  linkedProductId?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  content?: Record<string, any>;
}

export interface UpdatePageDto {
  title?: string;
  slug?: string;
  content?: Record<string, any>;
  linkedProductId?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export const pagesApi = createApi({
  reducerPath: "pagesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Pages"],
  endpoints: (builder) => ({
    getPages: builder.query<Page[], void>({
      query: () => "/merchant/pages",
      providesTags: ["Pages"],
    }),

    getPage: builder.query<Page, string>({
      query: (id) => `/merchant/pages/${id}`,
      providesTags: (result, error, id) => [{ type: "Pages", id }],
    }),

    createPage: builder.mutation<Page, CreatePageDto>({
      query: (body) => ({
        url: "/merchant/pages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pages"],
    }),

    updatePage: builder.mutation<Page, { id: string } & UpdatePageDto>({
      query: ({ id, ...body }) => ({
        url: `/merchant/pages/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Pages",
        { type: "Pages", id },
      ],
    }),

    updatePageStatus: builder.mutation<Page, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/merchant/pages/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Pages",
        { type: "Pages", id },
      ],
    }),

    deletePage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/merchant/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),

    getPublicPage: builder.query<Page, { storeSlug: string; pageSlug: string }>(
      {
        query: ({ storeSlug, pageSlug }) =>
          `/stores/${storeSlug}/pages/${pageSlug}`,
      },
    ),

    getOrCreateHomePage: builder.query<Page, void>({
      query: () => "/merchant/pages/home-page",
      providesTags: (result) =>
        result
          ? [{ type: "Pages" as const, id: result.id }, "Pages"]
          : ["Pages"],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useUpdatePageStatusMutation,
  useDeletePageMutation,
  useGetPublicPageQuery,
  useGetOrCreateHomePageQuery,
} = pagesApi;
