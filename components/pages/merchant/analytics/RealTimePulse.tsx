'use client'

import { useGetOverviewQuery } from '@/lib/services/analyticsApi'
import { formatNumber } from './formatters'

export function RealTimePulse() {
  const { data } = useGetOverviewQuery({ period: '1d' }, { pollingInterval: 60000 })
  const visitors = data?.totalVisitors ?? 0

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400" />
      </span>
      <span className="text-xs font-medium text-foreground">
        {formatNumber(visitors)} زائر الآن
      </span>
    </div>
  )
}
