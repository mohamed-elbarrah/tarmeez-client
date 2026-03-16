'use client'

import {
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useGetTrafficQuery } from '@/lib/services/analyticsApi'
import type { AnalyticsPeriod } from '@/lib/types/analytics'
import { ChartSkeleton } from '../ChartSkeleton'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { formatNumber, countryToFlag } from '../formatters'

interface TrafficTabProps {
  period: AnalyticsPeriod
}

const dailyConfig: ChartConfig = {
  visitors: { label: 'الزوار', color: 'var(--color-chart-1)' },
  pageViews: { label: 'مشاهدات الصفحة', color: 'var(--color-chart-2)' },
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

export function TrafficTab({ period }: TrafficTabProps) {
  const {
    data: traffic,
    isLoading,
    isError,
    refetch,
  } = useGetTrafficQuery({ period }, { pollingInterval: 60000 })

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

  const totalSourceVisitors = sourcesData.reduce((a, d) => a + d.value, 0)

  const topCountries = traffic?.countries?.slice(0, 10) ?? []
  const totalCountryVisits = topCountries.reduce((a, c) => a + c.count, 0)

  return (
    <div className="space-y-6">
      {/* Daily Visitors BarChart */}
      <Card>
        <CardHeader>
          <CardTitle>الزيارات اليومية</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton height={300} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : !traffic?.daily?.length ? (
            <EmptyState message="لا توجد بيانات للفترة المحددة" />
          ) : (
            <ChartContainer config={dailyConfig} className="h-75">
              <BarChart data={traffic.daily}>
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
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="visitors" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pageViews" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Devices + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton height={220} />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : !devicesData.some((d) => d.value > 0) ? (
              <EmptyState message="لا توجد بيانات" />
            ) : (
              <ChartContainer config={{}} className="h-55">
                <PieChart>
                  <Pie
                    data={devicesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {devicesData.map((_, i) => (
                      <Cell key={i} fill={DEVICE_COLORS[i]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Sources Donut */}
        <Card>
          <CardHeader>
            <CardTitle>مصادر الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton height={220} />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : !sourcesData.some((d) => d.value > 0) ? (
              <EmptyState message="لا توجد بيانات" />
            ) : (
              <div className="relative">
                <ChartContainer config={{}} className="h-55">
                  <PieChart>
                    <Pie
                      data={sourcesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                    >
                      {sourcesData.map((_, i) => (
                        <Cell key={i} fill={SOURCE_COLORS[i]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      {formatNumber(totalSourceVisitors)}
                    </p>
                    <p className="text-xs text-muted-foreground">إجمالي</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle>الدول</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton height={200} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : !topCountries.length ? (
            <EmptyState message="لا توجد بيانات جغرافية" />
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الدولة</TableHead>
                    <TableHead className="text-start">الزيارات</TableHead>
                    <TableHead className="text-start">النسبة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCountries.map((c) => (
                    <TableRow key={c.country}>
                      <TableCell className="font-medium">
                        {countryToFlag(c.country)} {c.country}
                      </TableCell>
                      <TableCell>{formatNumber(c.count)}</TableCell>
                      <TableCell>
                        {totalCountryVisits > 0
                          ? ((c.count / totalCountryVisits) * 100).toFixed(1) + '%'
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
