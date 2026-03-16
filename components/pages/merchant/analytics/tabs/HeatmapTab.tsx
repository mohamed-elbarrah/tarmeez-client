'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useGetHeatmapQuery,
  useGetPagesQuery,
} from '@/lib/services/analyticsApi'
import type { HeatmapPoint } from '@/lib/types/analytics'
import { EmptyState } from '../EmptyState'
import { ChartSkeleton } from '../ChartSkeleton'
import { ErrorState } from '../ErrorState'
import { formatNumber } from '../formatters'

const TYPE_LABELS: Record<string, string> = {
  click: 'نقرات',
  move: 'حركة',
  scroll: 'تمرير',
}

function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatmapPoint[],
  width: number,
  height: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, width, height)

  points.forEach(({ x, y, weight }) => {
    const px = (x / 100) * width
    const py = (y / 100) * height
    const radius = 30
    const alpha = Math.min(weight / 20, 0.8)

    const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius)
    gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`)
    gradient.addColorStop(0.5, `rgba(255, 165, 0, ${alpha * 0.5})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2)
  })
}

export function HeatmapTab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState('/')
  const [type, setType] = useState('click')
  const [device, setDevice] = useState('desktop')

  const { data: pagesData } = useGetPagesQuery({})
  const availablePages = [
    '/',
    ...(pagesData?.pages?.map((p) => p.slug).filter((s) => s !== '/') ?? []),
  ]

  const {
    data: heatmapData,
    isLoading,
    isError,
    refetch,
  } = useGetHeatmapQuery({
    page,
    type: type.toUpperCase(),
    device: device.toUpperCase(),
  })

  const redraw = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return
    if (!heatmapData?.points?.length) return
    const { offsetWidth, offsetHeight } = containerRef.current
    drawHeatmap(canvasRef.current, heatmapData.points, offsetWidth, offsetHeight)
  }, [heatmapData])

  useEffect(() => {
    redraw()
  }, [redraw])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Page selector */}
        <Select value={page} onValueChange={setPage}>
          <SelectTrigger className="w-50">
            <SelectValue placeholder="اختر صفحة" />
          </SelectTrigger>
          <SelectContent>
            {availablePages.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type selector */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {['click', 'move', 'scroll'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'px-3 py-1 rounded-md text-sm transition-colors',
                type === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Device toggle */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {['desktop', 'mobile'].map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={cn(
                'px-3 py-1 rounded-md text-sm transition-colors',
                device === d
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {d === 'desktop' ? '🖥 كمبيوتر' : '📱 موبايل'}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Canvas */}
      <Card>
        <CardContent className="p-0 overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="h-125">
              <ChartSkeleton height={500} />
            </div>
          ) : isError ? (
            <div className="h-125 flex items-center justify-center">
              <ErrorState onRetry={refetch} />
            </div>
          ) : (heatmapData?.total ?? 0) < 100 ? (
            <div className="h-125 flex items-center justify-center">
              <EmptyState
                message="بيانات غير كافية بعد — تحتاج 100 تفاعل على الأقل"
                icon={Flame}
              />
            </div>
          ) : (
            <div className="relative" ref={containerRef}>
              <div className="h-125 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                معاينة الصفحة
              </div>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {!isLoading && !isError && heatmapData && heatmapData.total >= 100 && (
        <p className="text-sm text-muted-foreground text-center">
          {formatNumber(heatmapData.total)} نقطة بيانات على صفحة {page}
        </p>
      )}
    </div>
  )
}
