'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AnalyticsPeriod } from '@/lib/types/analytics'

interface PeriodOption {
  label: string
  value: AnalyticsPeriod
}

interface PeriodSelectorProps {
  value: AnalyticsPeriod
  onChange: (value: AnalyticsPeriod) => void
  options: PeriodOption[]
}

export function PeriodSelector({ value, onChange, options }: PeriodSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as AnalyticsPeriod)}>
      <SelectTrigger className="w-32.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
