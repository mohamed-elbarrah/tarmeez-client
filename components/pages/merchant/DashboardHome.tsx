"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  Plus,
  ExternalLink,
  Eye,
  Package,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { PeriodSelector } from "./analytics/PeriodSelector";
import { ChartSkeleton } from "./analytics/ChartSkeleton";
import { EmptyState } from "./analytics/EmptyState";
import { ErrorState } from "./analytics/ErrorState";
import {
  formatNumber,
  formatPercent,
  fillSalesDays,
  fillTrafficDays,
  chartTickInterval,
} from "./analytics/formatters";

import {
  useGetMyStoreQuery,
  useGetOrdersQuery,
} from "@/lib/services/merchantApi";
import {
  useGetOverviewQuery,
  useGetTrafficQuery,
  useGetSalesQuery,
} from "@/lib/services/analyticsApi";
import type { AnalyticsPeriod } from "@/lib/types/analytics";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(n: number, currency: string): string {
  return `${Math.round(n).toLocaleString("ar-SA-u-nu-latn")} ${currency}`;
}

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "قيد الانتظار",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  CONFIRMED: {
    label: "مؤكد",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  PROCESSING: {
    label: "قيد المعالجة",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  SHIPPED: {
    label: "قيد التوصيل",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  DELIVERED: {
    label: "مكتمل",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  CANCELLED: {
    label: "ملغي",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  REFUNDED: {
    label: "مسترجع",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

const PERIOD_OPTIONS = [
  { label: "آخر 7 أيام", value: "7d" as AnalyticsPeriod },
  { label: "آخر 30 يوم", value: "30d" as AnalyticsPeriod },
  { label: "آخر 90 يوم", value: "90d" as AnalyticsPeriod },
  { label: "كل الوقت", value: "all" as AnalyticsPeriod },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────

interface SparklineProps {
  data: { value: number }[];
  color: string;
  id: string;
}

function Sparkline({ data, color, id }: SparklineProps) {
  if (!data.length) return null;
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Area
          type="monotoneX"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#spark-${id})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  sparkData?: { value: number }[];
  sparkColor?: string;
  sparkId?: string;
  loading?: boolean;
}

function KpiCard({
  title,
  value,
  trend,
  icon: Icon,
  sparkData,
  sparkColor = "var(--color-chart-1)",
  sparkId = "kpi",
  loading,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className="rounded-2xl border-border/40 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] h-28">
        <CardContent className="p-5 flex items-center justify-between h-full">
          <div className="flex flex-col justify-between h-full gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="w-20">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group h-full"
    >
      <Card className="rounded-2xl border-border/40 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] bg-card overflow-hidden">
        <CardContent className="p-5 flex justify-between h-full relative">
          <div className="flex flex-col gap-1 z-10 relative">
            <h3 className="text-sm font-bold text-muted-foreground">{title}</h3>
            <p className="text-2xl font-black tracking-tight text-foreground">
              {value}
            </p>
            {trend !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold w-fit mt-1 ${
                  isPositive ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {isPositive ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="w-21 h-13 shrink-0 self-end -mr-2 relative z-0">
            {sparkData && sparkData.length > 0 && (
              <Sparkline data={sparkData} color={sparkColor} id={sparkId} />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const mainChartConfig: ChartConfig = {
  visitors: { label: "الزوار", color: "var(--color-chart-1)" },
  orders: { label: "الطلبات", color: "var(--color-chart-2)" },
};

const trafficConfig: ChartConfig = {
  organic: { label: "بحث", color: "var(--color-chart-1)" },
  social: { label: "سوشيال", color: "var(--color-chart-2)" },
  direct: { label: "مباشر", color: "var(--color-chart-3)" },
  referral: { label: "إحالة", color: "var(--color-chart-4)" },
};

const TRAFFIC_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export default function DashboardHome() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");

  const { data: storeData, isLoading: storeLoading } = useGetMyStoreQuery();

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
    refetch: refetchOverview,
  } = useGetOverviewQuery({ period }, { pollingInterval: 60_000 });

  const {
    data: sales,
    isLoading: salesLoading,
    isError: salesError,
    refetch: refetchSales,
  } = useGetSalesQuery({ period }, { pollingInterval: 60_000 });

  const {
    data: traffic,
    isLoading: trafficLoading,
    isError: trafficError,
    refetch: refetchTraffic,
  } = useGetTrafficQuery({ period }, { pollingInterval: 60_000 });

  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({
    limit: 5,
    page: 1,
  });

  const merchant = storeData?.merchant;
  const store = storeData?.store;
  const currency = store?.currencyIcon ?? store?.systemCurrency ?? "ر.س";

  // Fill every day in the period — missing days become 0
  const filledSales = fillSalesDays(sales?.daily ?? [], period);
  const filledTraffic = fillTrafficDays(traffic?.daily ?? [], period);

  const revenueSpark = filledSales.map((d) => ({ value: d.revenue }));
  const ordersSpark = filledSales.map((d) => ({ value: d.orders }));
  const visitorsSpark = filledTraffic.map((d) => ({ value: d.visitors }));

  // Merge visitors (traffic) + orders (sales) by date — both are counts, same scale
  const trafficByDate = new Map(filledTraffic.map((d) => [d.date, d.visitors]));
  const mainChartData = filledSales.map((d) => ({
    date: d.date,
    visitors: trafficByDate.get(d.date) ?? 0,
    orders: d.orders,
  }));

  const mainTickInterval = chartTickInterval(mainChartData.length);

  const trafficSourcesData = traffic
    ? Object.entries(traffic.sources)
        .map(([key, val]) => ({
          name: trafficConfig[key]?.label ?? key,
          value: val,
          key,
        }))
        .filter((d) => d.value > 0)
    : [];

  const topProducts = (sales?.topProducts ?? []).slice(0, 5);
  const recentOrders = (ordersData?.items ?? []).slice(0, 5);

  // ── Today's date ───────────────────────────────────────────────────────────

  const todayAr = new Date().toLocaleDateString("ar-SA-u-nu-latn", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-l from-primary/5 via-background to-background border border-border/50 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            {storeLoading ? (
              <>
                <Skeleton className="h-8 w-56 mb-2" />
                <Skeleton className="h-4 w-72" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground">
                  مرحباً {merchant?.fullName ?? "بك"} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {todayAr} · إليك أبرز ما يحدث في متجرك اليوم
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              className="gap-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/merchant/products/new">
                <Plus className="h-4 w-4" />
                إضافة منتج
              </Link>
            </Button>
            {store && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 rounded-xl"
                asChild
              >
                <Link href={`/store/${store.slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                  عرض المتجر
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          مؤشرات الأداء الرئيسية
        </h2>
        <PeriodSelector
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="إجمالي المبيعات"
          value={overview ? formatAmount(overview.totalRevenue, currency) : "—"}
          trend={overview?.trend.revenue}
          icon={DollarSign}
          sparkData={revenueSpark}
          sparkColor="var(--color-chart-1)"
          sparkId="revenue"
          loading={overviewLoading || salesLoading}
        />
        <KpiCard
          title="الطلبات"
          value={overview ? formatNumber(overview.totalOrders) : "—"}
          trend={overview?.trend.orders}
          icon={ShoppingCart}
          sparkData={ordersSpark}
          sparkColor="var(--color-chart-2)"
          sparkId="orders"
          loading={overviewLoading || salesLoading}
        />
        <KpiCard
          title="الزوار"
          value={overview ? formatNumber(overview.totalVisitors) : "—"}
          trend={overview?.trend.visitors}
          icon={Users}
          sparkData={visitorsSpark}
          sparkColor="var(--color-chart-3)"
          sparkId="visitors"
          loading={overviewLoading || trafficLoading}
        />
        <KpiCard
          title="معدل التحويل"
          value={overview ? formatPercent(overview.conversionRate) : "—"}
          icon={Percent}
          loading={overviewLoading}
        />
      </div>

      {/* ── Central Grid 70/30 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        {/* ── Sales vs Orders Area Chart (70%) ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="xl:col-span-7"
        >
          <Card className="rounded-2xl border-border/60 h-full transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
              <CardTitle className="text-base font-semibold">
                الزوار والطلبات
              </CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-0.5 rounded-full bg-(--color-chart-1)" />
                  الزوار
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-0.5 rounded-full bg-(--color-chart-2)" />
                  الطلبات
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {salesLoading || trafficLoading ? (
                <ChartSkeleton height={300} />
              ) : salesError || trafficError ? (
                <ErrorState
                  onRetry={() => {
                    refetchSales();
                    refetchTraffic();
                  }}
                />
              ) : !mainChartData.length ? (
                <EmptyState message="لا توجد بيانات للفترة المحددة" />
              ) : (
                <ChartContainer config={mainChartConfig} className="  ">
                  <AreaChart
                    data={mainChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="gradVisitors"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-chart-1)"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-chart-1)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradOrders"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-chart-2)"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-chart-2)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      className="stroke-border"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      interval={mainTickInterval}
                      tickFormatter={(d) =>
                        new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatNumber(Number(value))}
                        />
                      }
                    />
                    <Area
                      type="monotoneX"
                      dataKey="visitors"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2.5}
                      fill="url(#gradVisitors)"
                      dot={false}
                    />
                    <Area
                      type="monotoneX"
                      dataKey="orders"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2.5}
                      fill="url(#gradOrders)"
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Right Column (30%) ───────────────────────────────────────── */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          {/* Traffic Sources Donut */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="rounded-2xl border-border/60 transition-shadow duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  مصادر الزيارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trafficLoading ? (
                  <ChartSkeleton height={160} />
                ) : trafficError ? (
                  <ErrorState onRetry={refetchTraffic} />
                ) : !trafficSourcesData.length ? (
                  <EmptyState message="لا توجد بيانات" />
                ) : (
                  <div className="flex flex-col gap-3">
                    <ChartContainer config={trafficConfig} className="h-35">
                      <PieChart>
                        <Pie
                          data={trafficSourcesData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={62}
                          paddingAngle={3}
                        >
                          {trafficSourcesData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={TRAFFIC_COLORS[i % TRAFFIC_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={<ChartTooltipContent hideLabel />}
                        />
                      </PieChart>
                    </ChartContainer>
                    <ul className="space-y-1.5">
                      {trafficSourcesData.map((s, i) => {
                        const total = trafficSourcesData.reduce(
                          (a, d) => a + d.value,
                          0,
                        );
                        const pct =
                          total > 0
                            ? ((s.value / total) * 100).toFixed(0)
                            : "0";
                        return (
                          <li
                            key={s.key}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span
                                className="inline-block w-2 h-2 rounded-full"
                                style={{
                                  background:
                                    TRAFFIC_COLORS[i % TRAFFIC_COLORS.length],
                                }}
                              />
                              {s.name}
                            </span>
                            <span className="font-medium">{pct}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top 5 Products */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex-1"
          >
            <Card className="rounded-2xl border-border/60 h-full transition-shadow duration-300 hover:shadow-lg">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  أفضل المنتجات
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 h-7"
                  asChild
                >
                  <Link href="/merchant/products">
                    عرض الكل
                    <ArrowLeft className="h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {salesLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : salesError ? (
                  <ErrorState onRetry={refetchSales} />
                ) : !topProducts.length ? (
                  <EmptyState
                    message="لا توجد مبيعات حتى الآن"
                    icon={Package}
                  />
                ) : (
                  <ul className="space-y-3">
                    {topProducts.map((p, i) => {
                      const maxRevenue = Math.max(
                        ...topProducts.map((x) => x.revenue),
                        1,
                      );
                      const barPct = (p.revenue / maxRevenue) * 100;
                      return (
                        <li
                          key={p.productId}
                          className="flex items-start gap-2"
                        >
                          <span className="shrink-0 w-5 h-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {p.productName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary/70 transition-all duration-500"
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {formatNumber(p.quantity)} مبيعة
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                            {formatAmount(p.revenue, currency)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ── Recent Orders ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="rounded-2xl border-border/60 transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">
              آخر الطلبات
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 h-7"
              asChild
            >
              <Link href="/merchant/orders">
                عرض الكل
                <ArrowLeft className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                      رقم الطلب
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                      العميل
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                      المبلغ
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                      التاريخ
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                      الحالة
                    </th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 px-4">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-7 w-7 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground text-sm"
                      >
                        لا توجد طلبات حتى الآن
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order: any) => (
                      <tr
                        key={order.orderCode}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150"
                      >
                        <td className="py-3 px-4">
                          <Link
                            href={`/merchant/orders/${order.orderCode}`}
                            className="text-sm font-mono font-medium hover:text-primary transition-colors"
                          >
                            #{order.orderCode}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold">
                          {formatAmount(Number(order.total), currency)}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild
                          >
                            <Link href={`/merchant/orders/${order.orderCode}`}>
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
