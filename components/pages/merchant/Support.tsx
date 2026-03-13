import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MessageCircle, BookOpen, Video, Mail } from "lucide-react";

export default function Support() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">الدعم</h1>
          <p className="text-muted-foreground">احصل على المساعدة التي تحتاجها</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Plus className="w-4 h-4 ml-2" />
          تذكرة جديدة
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="ابحث عن مقالات المساعدة..."
          className="pr-12 py-6 text-lg"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: BookOpen, label: "مركز المساعدة", count: "234 مقال" },
          { icon: Video, label: "فيديوهات تعليمية", count: "56 فيديو" },
          { icon: MessageCircle, label: "الدردشة المباشرة", count: "متاح الآن" },
          { icon: Mail, label: "البريد الإلكتروني", count: "support@tarmiz.com" },
        ].map((item, i) => (
          <Card key={i} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
              <item.icon className="w-6 h-6" />
            </div>
            <div className="font-bold mb-1">{item.label}</div>
            <div className="text-sm text-muted-foreground">{item.count}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">المواضيع الشائعة</h3>
        <div className="space-y-3">
          {[
            "كيفية إضافة منتج جديد",
            "إعداد بوابات الدفع",
            "تخصيص قالب المتجر",
            "إدارة الشحن والتوصيل",
            "استخدام تحليلات المتجر",
            "إنشاء كوبونات الخصم",
          ].map((topic, i) => (
            <button
              key={i}
              className="w-full text-right p-4 bg-secondary hover:bg-accent/10 rounded-lg transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">تذاكر الدعم</h3>
        <div className="space-y-3">
          {[
            { id: "#TICKET-123", subject: "مشكلة في الدفع", status: "مفتوحة", date: "منذ ساعتين" },
            { id: "#TICKET-122", subject: "سؤال عن الشحن", status: "قيد المراجعة", date: "منذ يوم" },
            { id: "#TICKET-121", subject: "طلب ميزة جديدة", status: "مغلقة", date: "منذ 3 أيام" },
          ].map((ticket, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <div className="font-medium mb-1">{ticket.subject}</div>
                <div className="text-sm text-muted-foreground">{ticket.id} • {ticket.date}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                ticket.status === "مفتوحة" ? "bg-accent/10 text-black" :
                ticket.status === "قيد المراجعة" ? "bg-blue-50 text-blue-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
