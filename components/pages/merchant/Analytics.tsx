"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Filter,
  FileText,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RealTimePulse } from "./analytics/RealTimePulse";
import { PeriodSelector } from "./analytics/PeriodSelector";
import { OverviewTab } from "./analytics/tabs/OverviewTab";
import { TrafficTab } from "./analytics/tabs/TrafficTab";
import { SalesTab } from "./analytics/tabs/SalesTab";
import { FunnelTab } from "./analytics/tabs/FunnelTab";
import { PagesTab } from "./analytics/tabs/PagesTab";
import { HeatmapTab } from "./analytics/tabs/HeatmapTab";
import type { AnalyticsPeriod } from "@/lib/types/analytics";

const PERIODS: { label: string; value: AnalyticsPeriod }[] = [
  { label: "اليوم", value: "1d" },
  { label: "7 أيام", value: "7d" },
  { label: "30 يوم", value: "30d" },
  { label: "90 يوم", value: "90d" },
  { label: "سنة", value: "1y" },
];

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "traffic", label: "الزيارات", icon: Users },
  { id: "sales", label: "المبيعات", icon: ShoppingBag },
  { id: "funnel", label: "التحويل", icon: Filter },
  { id: "pages", label: "الصفحات", icon: FileText },
  { id: "heatmap", label: "الخريطة الحرارية", icon: Flame },
];

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإحصائيات</h1>
          <p className="text-sm text-muted-foreground">
            تتبع أداء متجرك في الوقت الحقيقي
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RealTimePulse />
          <PeriodSelector
            value={period}
            onChange={setPeriod}
            options={PERIODS}
          />
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-2 py-2.5",
              "text-sm font-medium transition-colors",
              "border-b-2 -mb-px whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "overview" && <OverviewTab period={period} />}
        {activeTab === "traffic" && <TrafficTab period={period} />}
        {activeTab === "sales" && <SalesTab period={period} />}
        {activeTab === "funnel" && <FunnelTab period={period} />}
        {activeTab === "pages" && <PagesTab period={period} />}
        {activeTab === "heatmap" && <HeatmapTab />}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
