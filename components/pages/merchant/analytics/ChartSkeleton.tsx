'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface ChartSkeletonProps {
  height?: number
}

export function ChartSkeleton({ height = 300 }: ChartSkeletonProps) {
  return (
    <div className="w-full" style={{ height }}>
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  )
}
