export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return n.toLocaleString('ar-SA')
  return String(n)
}

export function formatCurrency(n: number): string {
  return `${Math.round(n).toLocaleString('ar-SA')} ر.س`
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

export function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return m > 0 ? `${h} س ${m} د` : `${h} س`
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s > 0 ? `${m} د ${s} ث` : `${m} د`
  }
  return `${seconds} ث`
}

export function formatTrend(n: number): string {
  return n >= 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`
}

export function countryToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍'
  const offset = 127397
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + offset))
    .join('')
}
