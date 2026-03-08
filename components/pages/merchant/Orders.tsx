import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Eye } from "lucide-react";

const orders = [
  { id: "#1234", customer: "أحمد محمد", email: "ahmad@example.com", amount: "450 ر.س", items: 3, status: "مكتمل", date: "6 مارس 2026" },
  { id: "#1233", customer: "فاطمة علي", email: "fatima@example.com", amount: "320 ر.س", items: 2, status: "قيد التوصيل", date: "6 مارس 2026" },
  { id: "#1232", customer: "محمد خالد", email: "mohammed@example.com", amount: "680 ر.س", items: 5, status: "قيد المعالجة", date: "5 مارس 2026" },
  { id: "#1231", customer: "سارة أحمد", email: "sarah@example.com", amount: "290 ر.س", items: 1, status: "مكتمل", date: "5 مارس 2026" },
  { id: "#1230", customer: "خالد عمر", email: "khalid@example.com", amount: "540 ر.س", items: 4, status: "مكتمل", date: "5 مارس 2026" },
  { id: "#1229", customer: "نورة سعيد", email: "noura@example.com", amount: "380 ر.س", items: 2, status: "ملغي", date: "4 مارس 2026" },
  { id: "#1228", customer: "عبدالله حسن", email: "abdullah@example.com", amount: "720 ر.س", items: 6, status: "مكتمل", date: "4 مارس 2026" },
  { id: "#1227", customer: "مريم عمر", email: "mariam@example.com", amount: "410 ر.س", items: 3, status: "قيد التوصيل", date: "4 مارس 2026" },
];

export default function Orders() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">الطلبات</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع طلباتك</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Download className="w-4 h-4 ml-2" />
          تصدير الطلبات
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "جميع الطلبات", value: "1,234", color: "bg-blue-500" },
          { label: "قيد المعالجة", value: "45", color: "bg-yellow-500" },
          { label: "قيد التوصيل", value: "28", color: "bg-purple-500" },
          { label: "مكتمل", value: "1,161", color: "bg-accent" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث بالرقم، العميل، أو البريد الإلكتروني..." className="pr-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم الطلب</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المنتجات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4">
                    <Link href={`/merchant/orders/${order.id.replace('#', '')}`} className="font-medium hover:text-accent">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{order.items} منتج</td>
                  <td className="py-4 px-4 font-medium">{order.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "مكتمل" ? "bg-accent/10 text-black" :
                      order.status === "قيد التوصيل" ? "bg-blue-50 text-blue-700" :
                      order.status === "قيد المعالجة" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{order.date}</td>
                  <td className="py-4 px-4">
                    <Link href={`/merchant/orders/${order.id.replace('#', '')}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            عرض 1 - 8 من 1,234 طلب
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">السابق</Button>
            <Button variant="outline" size="sm" className="bg-accent text-black">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">التالي</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
