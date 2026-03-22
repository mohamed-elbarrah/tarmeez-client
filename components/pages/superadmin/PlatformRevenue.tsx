import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";

const monthlyRevenue = [
  { month: "يناير", revenue: 125000, subscriptions: 89000, marketplace: 36000 },
  {
    month: "فبراير",
    revenue: 145000,
    subscriptions: 105000,
    marketplace: 40000,
  },
  { month: "مارس", revenue: 178000, subscriptions: 128000, marketplace: 50000 },
  {
    month: "أبريل",
    revenue: 195000,
    subscriptions: 140000,
    marketplace: 55000,
  },
  { month: "مايو", revenue: 220000, subscriptions: 158000, marketplace: 62000 },
  {
    month: "يونيو",
    revenue: 245000,
    subscriptions: 175000,
    marketplace: 70000,
  },
];

export default function PlatformRevenue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إيرادات المنصة</h1>
        <p className="text-muted-foreground">تقارير مالية شاملة</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          {
            label: "إجمالي الإيرادات",
            value: "1,234,560 ر.س",
            change: "+23.4%",
            icon: DollarSign,
          },
          {
            label: "الاشتراكات",
            value: "892,340 ر.س",
            change: "+18.7%",
            icon: Users,
          },
          {
            label: "السوق",
            value: "342,220 ر.س",
            change: "+31.2%",
            icon: CreditCard,
          },
          {
            label: "معدل النمو",
            value: "34.5%",
            change: "+5.1%",
            icon: TrendingUp,
          },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-sm text-primary">{stat.change}</div>
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">الإيرادات الشهرية</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip />
            <Bar
              dataKey="subscriptions"
              fill="var(--primary)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="marketplace"
              fill="var(--foreground)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
