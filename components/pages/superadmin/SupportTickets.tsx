import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";

export default function SupportTickets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">تذاكر الدعم</h1>
        <p className="text-muted-foreground">إدارة طلبات الدعم</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "مفتوحة", value: "45", color: "bg-yellow-500" },
          { label: "قيد المعالجة", value: "28", color: "bg-blue-500" },
          { label: "محلولة", value: "892", color: "bg-accent" },
          { label: "مغلقة", value: "1,234", color: "bg-muted-foreground" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث في التذاكر..." className="pr-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم التذكرة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الموضوع</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المتجر</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#TICKET-123", subject: "مشكلة في الدفع", store: "متجر الإلكترونيات", status: "مفتوحة", date: "منذ ساعتين" },
                { id: "#TICKET-122", subject: "سؤال عن الشحن", store: "بوتيك الأزياء", status: "قيد المعالجة", date: "منذ يوم" },
                { id: "#TICKET-121", subject: "طلب ميزة جديدة", store: "متجر الرياضة", status: "محلولة", date: "منذ 3 أيام" },
              ].map((ticket, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{ticket.id}</td>
                  <td className="py-4 px-4">{ticket.subject}</td>
                  <td className="py-4 px-4 text-muted-foreground">{ticket.store}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "مفتوحة" ? "bg-yellow-50 text-yellow-700" :
                      ticket.status === "قيد المعالجة" ? "bg-blue-50 text-blue-700" :
                      "bg-accent/10 text-accent-foreground"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{ticket.date}</td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
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
