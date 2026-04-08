import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export type GenerationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type RefineScope = "full" | "section" | "field";

export interface CreateGenerationDto {
  prompt: string;
  productId?: string;
  language?: "ar" | "en";
  tone?: "professional" | "casual" | "luxurious" | "playful" | "urgent";
}

export interface RefinePageDto {
  instruction: string;
  scope: RefineScope;
  sectionType?: string;
  fieldPath?: string;
  currentContent: Record<string, any>;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface RefineResult {
  success: boolean;
  scope: RefineScope;
  /** "FULL" or "PARTIAL" — indicates whether the whole page or only specific sections changed */
  updateType: "FULL" | "PARTIAL";
  updatedContent: Record<string, any>;
  affectedSection?: string;
  affectedField?: string;
  /** Section types that were patched (for PARTIAL updates) */
  patchedSections?: string[];
  assistantMessage: string;
  durationMs: number;
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

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIPageSummary {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  linkedProductId: string | null;
  metadata: {
    generationId?: string;
    prompt?: string;
    language?: string;
    tone?: string;
  } | null;
}

export const landingPageApi = createApi({
  reducerPath: "landingPageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Generation", "AIPage"],
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

    refinePage: build.mutation<
      RefineResult,
      { pageId: string; dto: RefinePageDto }
    >({
      query: ({ pageId, dto }) => ({
        url: `/merchant/landing-page/${pageId}/refine`,
        method: "POST",
        body: dto,
      }),
    }),

    listAIPages: build.query<AIPageSummary[], void>({
      query: () => "/merchant/landing-page/ai-pages",
      providesTags: ["AIPage"],
    }),

    getChatHistory: build.query<{ chatHistory: ChatMessage[] }, string>({
      query: (pageId) => `/merchant/landing-page/${pageId}/chat`,
    }),
  }),
});

export const {
  useGenerateMutation,
  useListGenerationsQuery,
  useGetGenerationQuery,
  useRetryGenerationMutation,
  useRefinePageMutation,
  useListAIPagesQuery,
  useGetChatHistoryQuery,
} = landingPageApi;
