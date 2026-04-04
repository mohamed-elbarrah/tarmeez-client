import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function AbandonedCart() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">السلة المهجورة</h1>
        <p className="text-muted-foreground">استرجاع العربات المتروكة</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "سلات مهجورة", value: "45" },
          { label: "قيمة محتملة", value: "12,340 ر.س" },
          { label: "معدل الاسترجاع", value: "18.5%" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  العميل
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  المنتجات
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  القيمة
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  التاريخ
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  إجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  customer: "أحمد محمد",
                  email: "ahmad@example.com",
                  items: 3,
                  value: "450 ر.س",
                  date: "منذ ساعة",
                },
                {
                  customer: "فاطمة علي",
                  email: "fatima@example.com",
                  items: 2,
                  value: "320 ر.س",
                  date: "منذ ساعتين",
                },
                {
                  customer: "محمد خالد",
                  email: "mohammed@example.com",
                  items: 1,
                  value: "180 ر.س",
                  date: "منذ 3 ساعات",
                },
              ].map((cart, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium">{cart.customer}</div>
                      <div className="text-sm text-muted-foreground">
                        {cart.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">{cart.items} منتج</td>
                  <td className="py-4 px-2 font-medium">{cart.value}</td>
                  <td className="py-4 px-2 text-muted-foreground">
                    {cart.date}
                  </td>
                  <td className="py-4 px-2">
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 ml-2" />
                      إرسال تذكير
                    </Button>
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
