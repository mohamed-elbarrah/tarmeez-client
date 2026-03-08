import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Mail, Eye } from "lucide-react";

const customers = [
  { id: 1, name: "أحمد محمد", email: "ahmad@example.com", orders: 12, spent: "4,520 ر.س", location: "الرياض" },
  { id: 2, name: "فاطمة علي", email: "fatima@example.com", orders: 8, spent: "2,340 ر.س", location: "جدة" },
  { id: 3, name: "محمد خالد", email: "mohammed@example.com", orders: 15, spent: "5,890 ر.س", location: "الدمام" },
  { id: 4, name: "سارة أحمد", email: "sarah@example.com", orders: 5, spent: "1,450 ر.س", location: "الرياض" },
  { id: 5, name: "خالد عمر", email: "khalid@example.com", orders: 19, spent: "7,230 ر.س", location: "مكة" },
  { id: 6, name: "نورة سعيد", email: "noura@example.com", orders: 3, spent: "890 ر.س", location: "المدينة" },
  { id: 7, name: "عبدالله حسن", email: "abdullah@example.com", orders: 22, spent: "9,120 ر.س", location: "الرياض" },
];

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">العملاء</h1>
          <p className="text-muted-foreground">إدارة قاعدة عملائك</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Mail className="w-4 h-4 ml-2" />
          إرسال حملة بريدية
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي العملاء", value: "1,847" },
          { label: "عملاء جدد", value: "156" },
          { label: "عملاء متكررون", value: "892" },
          { label: "متوسط القيمة", value: "3,245 ر.س" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث عن عميل..." className="pr-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الموقع</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الطلبات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجمالي الإنفاق</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                        <span className="font-bold text-black">{customer.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{customer.location}</td>
                  <td className="py-4 px-4">{customer.orders}</td>
                  <td className="py-4 px-4 font-medium">{customer.spent}</td>
                  <td className="py-4 px-4">
                    <Link href={`/merchant/customers/${customer.id}`}>
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
      </Card>
    </div>
  );
}
