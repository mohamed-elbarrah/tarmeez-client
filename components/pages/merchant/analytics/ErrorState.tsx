'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <AlertCircle className="h-10 w-10 text-destructive opacity-70" />
      <p className="text-sm">حدث خطأ أثناء تحميل البيانات</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        إعادة المحاولة
      </Button>
    </div>
  )
}
