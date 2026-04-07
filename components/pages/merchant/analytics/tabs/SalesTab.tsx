"use client";

import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { useGetSalesQuery } from "@/lib/services/analyticsApi";
import type { AnalyticsPeriod } from "@/lib/types/analytics";
import { StatCard } from "../StatCard";
import { ChartSkeleton } from "../ChartSkeleton";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import { formatNumber, formatCurrency, formatPercent } from "../formatters";

interface SalesTabProps {
  period: AnalyticsPeriod;
}

const revenueConfig: ChartConfig = {
  revenue: { label: "الإيرادات", color: "var(--color-chart-2)" },
};

export function SalesTab({ period }: SalesTabProps) {
  const { data, isLoading, isError, refetch } = useGetSalesQuery(
    { period },
    { pollingInterval: 60000 },
  );

  const totalRevenue =
    data?.topProducts.reduce((a, p) => a + p.revenue, 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={data ? formatCurrency(data.totalRevenue) : "—"}
          icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          title="عدد الطلبات"
          value={data ? formatNumber(data.totalOrders) : "—"}
          icon={ShoppingBag}
          loading={isLoading}
        />
        <StatCard
          title="متوسط قيمة الطلب"
          value={data ? formatCurrency(data.avgOrderValue) : "—"}
          icon={TrendingUp}
          loading={isLoading}
        />
      </div>

      <div className="flex clex-col gap-4">
        {/* Revenue AreaChart */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton height={300} />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : !data?.daily?.length ? (
              <EmptyState message="لا توجد بيانات للفترة المحددة" />
            ) : (
              <ChartContainer config={revenueConfig} className="">
                <AreaChart data={data.daily}>
                  <defs>
                    <linearGradient
                      id="salesRevenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-chart-2)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-chart-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-chart-2)"
                    fill="url(#salesRevenueGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أكثر المنتجات مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton height={200} />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : !data?.topProducts?.length ? (
              <EmptyState message="لا توجد بيانات للمنتجات" />
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>المنتج</TableHead>
                      <TableHead className="text-start">الكمية</TableHead>
                      <TableHead className="text-start">الإيرادات</TableHead>
                      <TableHead className="w-30">النسبة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topProducts.slice(0, 10).map((product, i) => {
                      const pct =
                        totalRevenue > 0
                          ? (product.revenue / totalRevenue) * 100
                          : 0;
                      return (
                        <TableRow key={product.productId}>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {i + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.productName}
                          </TableCell>
                          <TableCell>
                            {formatNumber(product.quantity)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(product.revenue)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: "var(--color-chart-2)",
                                  }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-10 text-end">
                                {pct.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
