// Analytics API response types (ANALYTICS-RULE 7 — aggregated responses only)

// ─── Overview ────────────────────────────────────────────────────────────────

export interface OverviewTrend {
  visitors: number
  revenue: number
  orders: number
}

export interface OverviewData {
  totalVisitors: number
  totalPageViews: number
  avgDuration: number
  bounceRate: number
  cartAdds: number
  cartAbandons: number
  checkoutStarts: number
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  conversionRate: number
  trend: OverviewTrend
}

// ─── Traffic ─────────────────────────────────────────────────────────────────

export interface DailyTraffic {
  date: string
  visitors: number
  pageViews: number
}

export interface CountryTraffic {
  country: string
  count: number
}

export interface TrafficData {
  daily: DailyTraffic[]
  devices: { mobile: number; tablet: number; desktop: number }
  sources: { organic: number; social: number; direct: number; referral: number }
  countries: CountryTraffic[]
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export interface PageStat {
  slug: string
  views: number
  avgDuration: number
  bounceRate: number
}

export interface PagesData {
  pages: PageStat[]
}

// ─── Funnel ──────────────────────────────────────────────────────────────────

export interface FunnelStep {
  name: string
  count: number
}

export interface FunnelData {
  steps: FunnelStep[]
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export interface DailySales {
  date: string
  orders: number
  revenue: number
}

export interface TopProduct {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export interface SalesData {
  daily: DailySales[]
  topProducts: TopProduct[]
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

export interface HeatmapPoint {
  x: number
  y: number
  weight: number
}

export interface HeatmapData {
  points: HeatmapPoint[]
  total: number
  message?: string
}

// ─── Query params ────────────────────────────────────────────────────────────

export type AnalyticsPeriod = '1d' | '7d' | '30d' | '90d' | '1y' | 'all'
