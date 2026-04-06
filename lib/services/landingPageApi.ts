import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export type GenerationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface CreateGenerationDto {
  prompt: string;
  productId?: string;
  language?: "ar" | "en";
  tone?: "professional" | "casual" | "luxurious" | "playful" | "urgent";
}

export interface GenerationSummary {
  id: string;
  status: GenerationStatus;
  prompt: string;
  language: string;
  tone: string;
  pageId: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationDetail extends GenerationSummary {
  storeId: string;
  productId: string | null;
  content: Record<string, unknown> | null;
  errorMessage: string | null;
}

export const landingPageApi = createApi({
  reducerPath: "landingPageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Generation"],
  endpoints: (build) => ({
    generate: build.mutation<GenerationSummary, CreateGenerationDto>({
      query: (body) => ({
        url: "/merchant/landing-page/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Generation"],
    }),

    listGenerations: build.query<GenerationSummary[], void>({
      query: () => "/merchant/landing-page/generations",
      providesTags: ["Generation"],
    }),

    getGeneration: build.query<GenerationDetail, string>({
      query: (id) => `/merchant/landing-page/generations/${id}`,
      providesTags: (result, error, id) => [{ type: "Generation", id }],
    }),

    retryGeneration: build.mutation<GenerationSummary, string>({
      query: (id) => ({
        url: `/merchant/landing-page/generations/${id}/retry`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "Generation",
        { type: "Generation", id },
      ],
    }),
  }),
});

export const {
  useGenerateMutation,
  useListGenerationsQuery,
  useGetGenerationQuery,
  useRetryGenerationMutation,
} = landingPageApi;
