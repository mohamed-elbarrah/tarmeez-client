import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'
import type {
  OverviewData,
  TrafficData,
  PagesData,
  FunnelData,
  SalesData,
  HeatmapData,
  AnalyticsPeriod,
} from '@/lib/types/analytics'

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Analytics'],
  endpoints: (build) => ({
    getOverview: build.query<OverviewData, { period?: AnalyticsPeriod }>({
      query: ({ period = '7d' } = {}) => ({
        url: '/merchant/analytics/overview',
        params: { period },
      }),
      providesTags: ['Analytics'],
    }),

    getTraffic: build.query<TrafficData, { period?: AnalyticsPeriod }>({
      query: ({ period = '7d' } = {}) => ({
        url: '/merchant/analytics/traffic',
        params: { period },
      }),
      providesTags: ['Analytics'],
    }),

    getPages: build.query<PagesData, { period?: AnalyticsPeriod }>({
      query: ({ period = '7d' } = {}) => ({
        url: '/merchant/analytics/pages',
        params: { period },
      }),
      providesTags: ['Analytics'],
    }),

    getFunnel: build.query<FunnelData, { period?: AnalyticsPeriod }>({
      query: ({ period = '7d' } = {}) => ({
        url: '/merchant/analytics/funnel',
        params: { period },
      }),
      providesTags: ['Analytics'],
    }),

    getSales: build.query<SalesData, { period?: AnalyticsPeriod }>({
      query: ({ period = '30d' } = {}) => ({
        url: '/merchant/analytics/sales',
        params: { period },
      }),
      providesTags: ['Analytics'],
    }),

    getHeatmap: build.query<
      HeatmapData,
      { page?: string; type?: string; device?: string }
    >({
      query: ({ page = '/', type = 'CLICK', device = 'DESKTOP' } = {}) => ({
        url: '/merchant/analytics/heatmap',
        params: { page, type, device },
      }),
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetOverviewQuery,
  useGetTrafficQuery,
  useGetPagesQuery,
  useGetFunnelQuery,
  useGetSalesQuery,
  useGetHeatmapQuery,
} = analyticsApi
