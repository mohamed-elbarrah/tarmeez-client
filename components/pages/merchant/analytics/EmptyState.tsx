'use client'

import { BarChart2, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  message: string
  icon?: LucideIcon
}

export function EmptyState({ message, icon: Icon = BarChart2 }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <Icon className="h-10 w-10 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
