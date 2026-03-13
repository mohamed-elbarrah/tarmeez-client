import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Ban } from "lucide-react";

export default function StoresManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة المتاجر</h1>
        <p className="text-muted-foreground">عرض وإدارة جميع المتاجر</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "إجمالي المتاجر", value: "1,847" },
          { label: "نشط", value: "1,692" },
          { label: "موقوف", value: "45" },
          { label: "تجريبي", value: "110" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث عن متجر..." className="pr-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المتجر</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاجر</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الخطة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الطلبات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الإيرادات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[
                { store: "متجر الإلكترونيات", merchant: "أحمد محمد", plan: "النمو", orders: 234, revenue: "45,230", status: "نشط" },
                { store: "بوتيك الأزياء", merchant: "فاطمة علي", plan: "الاحترافي", orders: 189, revenue: "32,140", status: "نشط" },
                { store: "متجر الرياضة", merchant: "محمد خالد", plan: "المبتدئ", orders: 67, revenue: "8,920", status: "تجريبي" },
              ].map((store, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{store.store}</td>
                  <td className="py-4 px-4">{store.merchant}</td>
                  <td className="py-4 px-4">{store.plan}</td>
                  <td className="py-4 px-4">{store.orders}</td>
                  <td className="py-4 px-4 font-medium">{store.revenue} ر.س</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      store.status === "نشط" ? "bg-accent/10 text-black" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {store.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
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
