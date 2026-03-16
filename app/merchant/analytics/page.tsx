import type { Metadata } from 'next'
import { AnalyticsDashboard } from '@/components/pages/merchant/Analytics'

export const metadata: Metadata = {
  title: 'الإحصائيات — ترميز',
}

export default function AnalyticsPage() {
  return <AnalyticsDashboard />
}
