"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetPagesQuery } from "@/lib/services/analyticsApi";
import type { AnalyticsPeriod } from "@/lib/types/analytics";
import { ChartSkeleton } from "../ChartSkeleton";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import { formatNumber, formatDuration, formatPercent } from "../formatters";

interface PagesTabProps {
  period: AnalyticsPeriod;
}

function bounceRateColor(rate: number): string {
  if (rate > 70) return "text-destructive";
  if (rate > 40) return "text-muted-foreground";
  return "text-primary";
}

export function PagesTab({ period }: PagesTabProps) {
  const { data, isLoading, isError, refetch } = useGetPagesQuery(
    { period },
    { pollingInterval: 60000 },
  );

  const sortedPages = [...(data?.pages ?? [])].sort(
    (a, b) => b.views - a.views,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>أداء الصفحات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton height={350} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : !sortedPages.length ? (
            <EmptyState message="لا توجد بيانات للصفحات" />
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصفحة</TableHead>
                    <TableHead className="text-start">الزيارات</TableHead>
                    <TableHead className="text-start">متوسط الوقت</TableHead>
                    <TableHead className="text-start">معدل الارتداد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPages.slice(0, 20).map((page) => (
                    <TableRow key={page.slug}>
                      <TableCell className="font-mono text-sm text-foreground">
                        {page.slug}
                      </TableCell>
                      <TableCell>{formatNumber(page.views)}</TableCell>
                      <TableCell>{formatDuration(page.avgDuration)}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            bounceRateColor(page.bounceRate),
                          )}
                        >
                          {formatPercent(page.bounceRate)}
                        </span>
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
  );
}
