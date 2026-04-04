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
import {
  Store,
  Users,
  DollarSign,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

const revenueData = [
  { month: "يناير", revenue: 125000 },
  { month: "فبراير", revenue: 145000 },
  { month: "مارس", revenue: 178000 },
  { month: "أبريل", revenue: 195000 },
  { month: "مايو", revenue: 220000 },
  { month: "يونيو", revenue: 245000 },
];

const storesGrowth = [
  { month: "يناير", stores: 45 },
  { month: "فبراير", stores: 67 },
  { month: "مارس", stores: 89 },
  { month: "أبريل", stores: 112 },
  { month: "مايو", stores: 145 },
  { month: "يونيو", stores: 178 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم الرئيسية</h1>
        <p className="text-muted-foreground">نظرة عامة على المنصة</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {[
          {
            label: "إجمالي المتاجر",
            value: "1,847",
            change: "+12.3%",
            icon: Store,
          },
          {
            label: "التجار النشطون",
            value: "1,234",
            change: "+8.7%",
            icon: Users,
          },
          {
            label: "إيرادات المنصة",
            value: "245,670 ر.س",
            change: "+23.4%",
            icon: DollarSign,
          },
          {
            label: "الطلبات اليوم",
            value: "892",
            change: "+15.2%",
            icon: ShoppingCart,
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
              <div className="flex items-center gap-1 text-sm text-primary">
                {stat.change}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">إيرادات المنصة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">نمو المتاجر</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storesGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar
                dataKey="stores"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">أحدث المتاجر</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  المتجر
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  التاجر
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  الخطة
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  الطلبات
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  تاريخ الإنشاء
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  store: "متجر الإلكترونيات",
                  merchant: "أحمد محمد",
                  plan: "النمو",
                  orders: 234,
                  date: "6 مارس 2026",
                },
                {
                  store: "بوتيك الأزياء",
                  merchant: "فاطمة علي",
                  plan: "الاحترافي",
                  orders: 189,
                  date: "5 مارس 2026",
                },
                {
                  store: "متجر الرياضة",
                  merchant: "محمد خالد",
                  plan: "المبتدئ",
                  orders: 67,
                  date: "5 مارس 2026",
                },
              ].map((store, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-2 font-medium">{store.store}</td>
                  <td className="py-3 px-2">{store.merchant}</td>
                  <td className="py-3 px-2">{store.plan}</td>
                  <td className="py-3 px-2">{store.orders}</td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {store.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
