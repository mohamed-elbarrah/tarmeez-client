import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";

export default function SystemLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">سجلات النظام</h1>
          <p className="text-muted-foreground">عرض نشاطات وأحداث المنصة</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 ml-2" />
          تصدير السجلات
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث في السجلات..." className="pr-10" />
          </div>
          <select className="px-4 py-2 bg-white border border-border rounded-lg">
            <option>جميع الأنواع</option>
            <option>تسجيل دخول</option>
            <option>إنشاء متجر</option>
            <option>تحديث خطة</option>
            <option>خطأ</option>
          </select>
        </div>

        <div className="space-y-2">
          {[
            { type: "إنشاء", message: "تم إنشاء متجر جديد 'متجر الإلكترونيات'", user: "ahmad@example.com", time: "منذ 5 دقائق", level: "info" },
            { type: "تحديث", message: "تم ترقية خطة 'بوتيك الأزياء' إلى الاحترافي", user: "fatima@example.com", time: "منذ 15 دقيقة", level: "success" },
            { type: "دخول", message: "تسجيل دخول ناجح", user: "mohammed@example.com", time: "منذ 30 دقيقة", level: "info" },
            { type: "خطأ", message: "فشل معالجة الدفع", user: "sarah@example.com", time: "منذ ساعة", level: "error" },
            { type: "حذف", message: "تم حذف منتج من المتجر", user: "khalid@example.com", time: "منذ ساعتين", level: "warning" },
          ].map((log, i) => (
            <div key={i} className="p-4 bg-secondary rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.level === "error" ? "bg-red-100 text-red-700" :
                    log.level === "warning" ? "bg-yellow-100 text-yellow-700" :
                    log.level === "success" ? "bg-accent/10 text-black" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {log.type}
                  </span>
                  <span className="font-medium">{log.message}</span>
                </div>
                <span className="text-sm text-muted-foreground">{log.time}</span>
              </div>
              <div className="text-sm text-muted-foreground">{log.user}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
