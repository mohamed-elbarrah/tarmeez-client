import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";

export default function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">الفواتير</h1>
        <p className="text-muted-foreground">إدارة الاشتراك والفواتير</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold mb-2">خطة النمو</h3>
            <p className="text-muted-foreground">يتجدد في 6 أبريل 2026</p>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold mb-1">199 ر.س</div>
            <div className="text-sm text-muted-foreground">شهرياً</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[
            "منتجات غير محدودة",
            "تحليلات متقدمة",
            "جميع القوالب",
            "أدوات AI",
            "دعم أولوية",
            "API مخصص"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-accent" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تغيير الخطة</Button>
          <Button variant="outline">إلغاء الاشتراك</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">طريقة الدفع</h3>
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-white rounded border border-border"></div>
            <div>
              <div className="font-medium">فيزا •••• 4242</div>
              <div className="text-sm text-muted-foreground">تنتهي في 12/2026</div>
            </div>
          </div>
          <Button variant="ghost" size="sm">تعديل</Button>
        </div>
        <Button variant="outline">إضافة طريقة دفع</Button>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">سجل الفواتير</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الفاتورة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#INV-1234", date: "6 مارس 2026", amount: "199 ر.س", status: "مدفوعة" },
                { id: "#INV-1233", date: "6 فبراير 2026", amount: "199 ر.س", status: "مدفوعة" },
                { id: "#INV-1232", date: "6 يناير 2026", amount: "199 ر.س", status: "مدفوعة" },
              ].map((invoice, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-4 font-medium">{invoice.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{invoice.date}</td>
                  <td className="py-3 px-4 font-medium">{invoice.amount}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-accent/10 rounded-full text-xs font-medium">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
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
