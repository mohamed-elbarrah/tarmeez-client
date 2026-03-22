"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { useGetFunnelQuery } from "@/lib/services/analyticsApi";
import type { AnalyticsPeriod } from "@/lib/types/analytics";
import { StatCard } from "../StatCard";
import { ChartSkeleton } from "../ChartSkeleton";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import { formatNumber, formatPercent } from "../formatters";

interface FunnelTabProps {
  period: AnalyticsPeriod;
}

const FUNNEL_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function FunnelTab({ period }: FunnelTabProps) {
  const { data, isLoading, isError, refetch } = useGetFunnelQuery(
    { period },
    { pollingInterval: 60000 },
  );

  const steps = data?.steps ?? [];
  const firstCount = steps[0]?.count ?? 0;
  const lastCount = steps[steps.length - 1]?.count ?? 0;
  const cartStep = steps[2]?.count ?? 0;

  const conversionRate =
    firstCount > 0 ? ((lastCount / firstCount) * 100).toFixed(1) : "0.0";

  const abandonRate =
    cartStep > 0 ? ((1 - lastCount / cartStep) * 100).toFixed(1) : "0.0";

  const checkoutCount = steps[3]?.count ?? 0;

  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>مسار التحويل</CardTitle>
          <p className="text-sm text-muted-foreground">
            تتبع رحلة الزائر من الدخول إلى الشراء
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton height={300} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : !steps.length ? (
            <EmptyState message="لا توجد بيانات لمسار التحويل" />
          ) : (
            <div className="space-y-3">
              {steps.map((step, i) => {
                const pct =
                  firstCount > 0 ? (step.count / firstCount) * 100 : 0;
                const dropoff =
                  i > 0 && steps[i - 1].count > 0
                    ? ((1 - step.count / steps[i - 1].count) * 100).toFixed(1)
                    : null;

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">
                        {step.name}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        {formatNumber(step.count)}
                        {dropoff !== null && (
                          <span className="text-destructive ms-2 text-xs">
                            -{dropoff}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-8 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            FUNNEL_COLORS[i % FUNNEL_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="معدل تحويل الزيارة"
          value={isLoading ? "—" : `${conversionRate}%`}
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          title="نسبة إهمال السلة"
          value={isLoading ? "—" : `${abandonRate}%`}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatCard
          title="وصلوا للدفع"
          value={isLoading ? "—" : formatNumber(checkoutCount)}
          icon={Package}
          loading={isLoading}
        />
        <StatCard
          title="أتموا الشراء"
          value={isLoading ? "—" : formatNumber(lastCount)}
          icon={CheckCircle}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
