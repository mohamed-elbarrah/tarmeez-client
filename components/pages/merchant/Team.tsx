import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Trash2 } from "lucide-react";

export default function Team() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">الفريق</h1>
          <p className="text-muted-foreground">إدارة أعضاء الفريق والصلاحيات</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Plus className="w-4 h-4 ml-2" />
          دعوة عضو
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {[
            { name: "أحمد محمد", email: "ahmad@example.com", role: "مالك", status: "نشط" },
            { name: "فاطمة علي", email: "fatima@example.com", role: "مدير", status: "نشط" },
            { name: "محمد خالد", email: "mohammed@example.com", role: "محرر", status: "نشط" },
            { name: "سارة أحمد", email: "sarah@example.com", role: "محرر", status: "معلق" },
          ].map((member, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <span className="font-bold text-black text-lg">{member.name[0]}</span>
                </div>
                <div>
                  <div className="font-medium mb-1">{member.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-left">
                  <div className="text-sm text-muted-foreground mb-1">الدور</div>
                  <div className="font-medium">{member.role}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground mb-1">الحالة</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.status === "نشط" ? "bg-accent/10 text-black" : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {member.status}
                  </span>
                </div>
                {member.role !== "مالك" && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">الأدوار والصلاحيات</h3>
        <div className="space-y-4">
          {[
            { role: "مالك", description: "صلاحيات كاملة على المتجر والإعدادات" },
            { role: "مدير", description: "إدارة المنتجات والطلبات والعملاء" },
            { role: "محرر", description: "تعديل المحتوى والمنتجات فقط" },
            { role: "مشاهد", description: "عرض البيانات فقط بدون تعديل" },
          ].map((role, i) => (
            <div key={i} className="p-4 bg-secondary rounded-lg">
              <div className="font-medium mb-1">{role.role}</div>
              <div className="text-sm text-muted-foreground">{role.description}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
