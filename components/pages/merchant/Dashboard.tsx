import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye, Sparkles, ArrowLeft } from "lucide-react";

const revenueData = [
  { date: "1 مار", value: 4200 },
  { date: "5 مار", value: 5100 },
  { date: "10 مار", value: 4800 },
  { date: "15 مار", value: 6200 },
  { date: "20 مار", value: 5900 },
  { date: "25 مار", value: 7100 },
  { date: "30 مار", value: 8400 },
];

const ordersData = [
  { day: "السبت", orders: 45 },
  { day: "الأحد", orders: 52 },
  { day: "الاثنين", orders: 38 },
  { day: "الثلاثاء", orders: 61 },
  { day: "الأربعاء", orders: 48 },
  { day: "الخميس", orders: 73 },
  { day: "الجمعة", orders: 56 },
];

const topProducts = [
  { name: "ساعة ذكية برو", sales: 234, revenue: "23,400 ر.س" },
  { name: "سماعات لاسلكية", sales: 189, revenue: "18,900 ر.س" },
  { name: "حقيبة جلدية", sales: 156, revenue: "15,600 ر.س" },
  { name: "محفظة رجالية", sales: 142, revenue: "7,100 ر.س" },
  { name: "نظارة شمسية", sales: 128, revenue: "12,800 ر.س" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء متجرك</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {[
          {
            label: "إجمالي الإيرادات",
            value: "45,231 ر.س",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
          },
          {
            label: "الطلبات",
            value: "1,234",
            change: "+8.2%",
            trend: "up",
            icon: ShoppingCart,
          },
          {
            label: "الزوار",
            value: "12,456",
            change: "+23.1%",
            trend: "up",
            icon: Eye,
          },
          {
            label: "معدل التحويل",
            value: "3.2%",
            change: "+0.5%",
            trend: "up",
            icon: Users,
          },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-primary" : "text-destructive"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold mb-1">الإيرادات</h3>
              <p className="text-sm text-muted-foreground">آخر 30 يوم</p>
            </div>
            <Button variant="outline" size="sm">تصدير</Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="date" stroke="var(--chart-axis)" />
              <YAxis stroke="var(--chart-axis)" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ fill: "var(--primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold mb-1">الطلبات اليومية</h3>
              <p className="text-sm text-muted-foreground">آخر 7 أيام</p>
            </div>
            <Button variant="outline" size="sm">عرض الكل</Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="day" stroke="var(--chart-axis)" />
              <YAxis stroke="var(--chart-axis)" />
              <Tooltip />
              <Bar dataKey="orders" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">رؤى الذكاء الاصطناعي</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  <strong>زيادة المبيعات:</strong> لاحظنا أن الزوار الذين يشاهدون صفحة "ساعة ذكية برو" لديهم معدل تحويل أعلى بنسبة 34%. نقترح زيادة الحملات التسويقية لهذا المنتج.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  <strong>استهداف أفضل:</strong> معظم عملائك يزورون المتجر بين الساعة 8-10 مساءً. فكر في جدولة إعلاناتك خلال هذه الفترة.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm">
                  <strong>تحسين التحويل:</strong> إضافة صور إضافية للمنتجات قد تزيد معدل التحويل بنسبة 18% حسب البيانات التحليلية.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              عرض جميع التوصيات
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold mb-1">المنتجات الأكثر مبيعاً</h3>
            <p className="text-sm text-muted-foreground">أفضل أداء هذا الشهر</p>
          </div>
          <Button variant="outline" size="sm">عرض التقرير الكامل</Button>
        </div>
        <div className="space-y-4">
          {topProducts.map((product, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg border border-border"></div>
              <div className="flex-1">
                <div className="font-medium mb-1">{product.name}</div>
                <div className="text-sm text-muted-foreground">{product.sales} مبيعة</div>
              </div>
              <div className="text-left">
                <div className="font-bold">{product.revenue}</div>
                <div className="text-sm text-accent">+{Math.round(Math.random() * 20)}%</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold mb-1">آخر الطلبات</h3>
            <p className="text-sm text-muted-foreground">الطلبات الأخيرة في متجرك</p>
          </div>
          <Button variant="outline" size="sm">عرض الكل</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">رقم الطلب</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#1234", customer: "أحمد محمد", amount: "450 ر.س", status: "مكتمل", date: "منذ ساعة" },
                { id: "#1233", customer: "فاطمة علي", amount: "320 ر.س", status: "قيد التوصيل", date: "منذ ساعتين" },
                { id: "#1232", customer: "محمد خالد", amount: "680 ر.س", status: "قيد المعالجة", date: "منذ 3 ساعات" },
                { id: "#1231", customer: "سارة أحمد", amount: "290 ر.س", status: "مكتمل", date: "منذ 5 ساعات" },
                { id: "#1230", customer: "خالد عمر", amount: "540 ر.س", status: "مكتمل", date: "منذ 7 ساعات" },
              ].map((order, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{order.id}</td>
                  <td className="py-4 px-4">{order.customer}</td>
                  <td className="py-4 px-4 font-medium">{order.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${order.status === "مكتمل" ? "bg-primary/10 text-primary" :
                        order.status === "قيد التوصيل" ? "bg-blue-500/10 text-blue-500" :
                          "bg-yellow-500/10 text-yellow-500"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
