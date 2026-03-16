import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, Eye, ShoppingCart, Download } from "lucide-react";

const trafficData = [
  { source: "بحث جوجل", visits: 4234, percentage: 45 },
  { source: "مباشر", visits: 2156, percentage: 23 },
  { source: "فيسبوك", visits: 1890, percentage: 20 },
  { source: "إنستغرام", visits: 1124, percentage: 12 },
];

const conversionData = [
  { stage: "زوار", count: 12456 },
  { stage: "منتج", count: 8234 },
  { stage: "سلة", count: 3456 },
  { stage: "دفع", count: 1234 },
  { stage: "شراء", count: 892 },
];

const revenueByCategory = [
  { name: "إلكترونيات", value: 45000 },
  { name: "ملابس", value: 32000 },
  { name: "إكسسوارات", value: 28000 },
  { name: "أخرى", value: 15000 },
];

const COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">التحليلات</h1>
          <p className="text-muted-foreground">تقارير شاملة عن أداء متجرك</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-card border border-border rounded-lg">
            <option>آخر 30 يوم</option>
            <option>آخر 7 أيام</option>
            <option>آخر 90 يوم</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "إجمالي الزوار", value: "12,456", change: "+23.1%", icon: Eye },
          { label: "معدل التحويل", value: "3.2%", change: "+0.5%", icon: TrendingUp },
          { label: "متوسط قيمة الطلب", value: "377 ر.س", change: "+12.3%", icon: ShoppingCart },
          { label: "العملاء الجدد", value: "892", change: "+18.7%", icon: Users },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-sm text-primary">{stat.change}</div>
            </div>
            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">مصادر الزيارات</h3>
          <div className="space-y-4">
            {trafficData.map((source, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{source.source}</span>
                  <span className="text-sm text-muted-foreground">{source.visits.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">الإيرادات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">قمع التحويل</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={conversionData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis type="number" stroke="var(--chart-axis)" />
            <YAxis dataKey="stage" type="category" stroke="var(--chart-axis)" />
            <Tooltip />
            <Bar dataKey="count" fill="var(--primary)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
