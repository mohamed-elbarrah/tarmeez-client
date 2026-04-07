import type {
  AnalyticsPeriod,
  DailySales,
  DailyTraffic,
} from "@/lib/types/analytics";

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString("ar-SA-u-nu-latn");
  return String(n);
}

export function formatCurrency(n: number): string {
  return `${Math.round(n).toLocaleString("ar-SA-u-nu-latn")} ر.س`;
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h} س ${m} د` : `${h} س`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m} د ${s} ث` : `${m} د`;
  }
  return `${seconds} ث`;
}

export function formatTrend(n: number): string {
  return n >= 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`;
}

export function countryToFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  const offset = 127397;
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + offset))
    .join("");
}

// ─── Date-range fill utilities ────────────────────────────────────────────────
// The backend only returns days that have data. These helpers generate every
// date in the requested period and merge the real data into it, defaulting
// missing days to 0 — so charts always show the correct time axis.

const PERIOD_DAYS: Partial<Record<AnalyticsPeriod, number>> = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildDateRange(period: AnalyticsPeriod): string[] {
  const days = PERIOD_DAYS[period];
  if (!days) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    result.push(toDateKey(d));
  }
  return result;
}

export function fillSalesDays(
  data: DailySales[],
  period: AnalyticsPeriod,
): DailySales[] {
  const range = buildDateRange(period);
  if (!range.length) return data;
  const map = new Map(data.map((d) => [d.date, d]));
  return range.map((date) => map.get(date) ?? { date, orders: 0, revenue: 0 });
}

export function fillTrafficDays(
  data: DailyTraffic[],
  period: AnalyticsPeriod,
): DailyTraffic[] {
  const range = buildDateRange(period);
  if (!range.length) return data;
  const map = new Map(data.map((d) => [d.date, d]));
  return range.map(
    (date) => map.get(date) ?? { date, visitors: 0, pageViews: 0 },
  );
}

/** Returns the XAxis tick interval so ~7-8 ticks are always visible. */
export function chartTickInterval(dataLength: number): number {
  if (dataLength <= 14) return 0;
  return Math.max(1, Math.floor(dataLength / 8));
}
