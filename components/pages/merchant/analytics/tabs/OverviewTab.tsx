'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react'
import { useGetOverviewQuery } from '@/lib/services/analyticsApi'
import { useGetTrafficQuery } from '@/lib/services/analyticsApi'
import { useGetSalesQuery } from '@/lib/services/analyticsApi'
import type { AnalyticsPeriod } from '@/lib/types/analytics'
import { StatCard } from '../StatCard'
import { ChartSkeleton } from '../ChartSkeleton'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { formatNumber, formatCurrency, formatPercent } from '../formatters'

interface OverviewTabProps {
  period: AnalyticsPeriod
}

const visitorsConfig: ChartConfig = {
  visitors: { label: 'الزوار', color: 'var(--color-chart-1)' },
}

const revenueConfig: ChartConfig = {
  revenue: { label: 'الإيرادات', color: 'var(--color-chart-2)' },
}

const DEVICE_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-3)',
  'var(--color-chart-5)',
]

const SOURCE_COLORS = [
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

const SOURCE_LABELS: Record<string, string> = {
  organic: 'بحث عضوي',
  social: 'سوشيال ميديا',
  direct: 'مباشر',
  referral: 'إحالة',
}

export function OverviewTab({ period }: OverviewTabProps) {
  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
    refetch: refetchOverview,
  } = useGetOverviewQuery({ period }, { pollingInterval: 60000 })

  const {
    data: traffic,
    isLoading: trafficLoading,
    isError: trafficError,
    refetch: refetchTraffic,
  } = useGetTrafficQuery({ period }, { pollingInterval: 60000 })

  const {
    data: sales,
    isLoading: salesLoading,
    isError: salesError,
    refetch: refetchSales,
  } = useGetSalesQuery({ period }, { pollingInterval: 60000 })

  const devicesData = traffic
    ? [
        { name: 'موبايل', value: traffic.devices.mobile },
        { name: 'تابلت', value: traffic.devices.tablet },
        { name: 'كمبيوتر', value: traffic.devices.desktop },
      ]
    : []

  const sourcesData = traffic
    ? Object.entries(traffic.sources).map(([key, val]) => ({
        name: SOURCE_LABELS[key] ?? key,
        value: val,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="الزوار"
          value={overview ? formatNumber(overview.totalVisitors) : '—'}
          trend={overview?.trend.visitors}
          icon={Users}
          loading={overviewLoading}
          trendLabel="مقارنةً بالفترة السابقة"
        />
        <StatCard
          title="المبيعات"
          value={overview ? formatCurrency(overview.totalRevenue) : '—'}
          trend={overview?.trend.revenue}
          icon={DollarSign}
          loading={overviewLoading}
          trendLabel="مقارنةً بالفترة السابقة"
        />
        <StatCard
          title="الطلبات"
          value={overview ? formatNumber(overview.totalOrders) : '—'}
          trend={overview?.trend.orders}
          icon={ShoppingBag}
          loading={overviewLoading}
          trendLabel="مقارنةً بالفترة السابقة"
        />
        <StatCard
          title="معدل التحويل"
          value={overview ? formatPercent(overview.conversionRate) : '—'}
          icon={TrendingUp}
          loading={overviewLoading}
        />
      </div>

      {/* Row 2: Area Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors AreaChart */}
        <Card>
          <CardHeader>
            <CardTitle>الزيارات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            {trafficLoading ? (
              <ChartSkeleton height={250} />
            ) : trafficError ? (
              <ErrorState onRetry={refetchTraffic} />
            ) : !traffic?.daily?.length ? (
              <EmptyState message="لا توجد بيانات للفترة المحددة" />
            ) : (
              <ChartContainer config={visitorsConfig} className="h-62.5">
                <AreaChart data={traffic.daily}>
                  <defs>
                    <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="var(--color-chart-1)"
                    fill="url(#visitorsGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue AreaChart */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <ChartSkeleton height={250} />
            ) : salesError ? (
              <ErrorState onRetry={refetchSales} />
            ) : !sales?.daily?.length ? (
              <EmptyState message="لا توجد بيانات للفترة المحددة" />
            ) : (
              <ChartContainer config={revenueConfig} className="h-62.5">
                <AreaChart data={sales.daily}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-chart-2)"
                    fill="url(#revenueGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Devices + Sources + Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices PieChart */}
        <Card>
          <CardHeader>
            <CardTitle>الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            {trafficLoading ? (
              <ChartSkeleton height={200} />
            ) : trafficError ? (
              <ErrorState onRetry={refetchTraffic} />
            ) : !devicesData.some((d) => d.value > 0) ? (
              <EmptyState message="لا توجد بيانات" />
            ) : (
              <ChartContainer config={{}} className="h-50">
                <PieChart>
                  <Pie
                    data={devicesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                  >
                    {devicesData.map((_, i) => (
                      <Cell key={i} fill={DEVICE_COLORS[i]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources DonutChart */}
        <Card>
          <CardHeader>
            <CardTitle>مصادر الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            {trafficLoading ? (
              <ChartSkeleton height={200} />
            ) : trafficError ? (
              <ErrorState onRetry={refetchTraffic} />
            ) : !sourcesData.some((d) => d.value > 0) ? (
              <EmptyState message="لا توجد بيانات" />
            ) : (
              <ChartContainer config={{}} className="h-50">
                <PieChart>
                  <Pie
                    data={sourcesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                  >
                    {sourcesData.map((_, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[i]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Cart Summary */}
        <Card>
          <CardHeader>
            <CardTitle>ملخص السلة</CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <ChartSkeleton height={140} />
            ) : overviewError ? (
              <ErrorState onRetry={refetchOverview} />
            ) : !overview ? (
              <EmptyState message="لا توجد بيانات" />
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-chart-2)' }}
                    />
                    <span className="text-sm text-muted-foreground">إضافات للسلة</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatNumber(overview.cartAdds)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-chart-4)' }}
                    />
                    <span className="text-sm text-muted-foreground">سلات مهجورة</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatNumber(overview.cartAbandons)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-chart-5)' }}
                    />
                    <span className="text-sm text-muted-foreground">نسبة الإهمال</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {overview.cartAdds > 0
                      ? formatPercent(
                          (overview.cartAbandons / overview.cartAdds) * 100,
                        )
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-chart-1)' }}
                    />
                    <span className="text-sm text-muted-foreground">بدء الدفع</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatNumber(overview.checkoutStarts)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
