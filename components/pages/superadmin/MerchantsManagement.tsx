import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail } from "lucide-react";

export default function MerchantsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة التجار</h1>
        <p className="text-muted-foreground">عرض وإدارة حسابات التجار</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث عن تاجر..." className="pr-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  التاجر
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  المتاجر
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  الإيرادات
                </th>
                <th className="text-right py-4 px-2 text-sm font-medium text-muted-foreground">
                  تاريخ التسجيل
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "أحمد محمد",
                  email: "ahmad@example.com",
                  stores: 2,
                  revenue: "78,450",
                  date: "يناير 2026",
                },
                {
                  name: "فاطمة علي",
                  email: "fatima@example.com",
                  stores: 1,
                  revenue: "32,140",
                  date: "فبراير 2026",
                },
                {
                  name: "محمد خالد",
                  email: "mohammed@example.com",
                  stores: 3,
                  revenue: "125,670",
                  date: "ديسمبر 2025",
                },
              ].map((merchant, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium">{merchant.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {merchant.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">{merchant.stores}</td>
                  <td className="py-4 px-2 font-medium">
                    {merchant.revenue} ر.س
                  </td>
                  <td className="py-4 px-2 text-muted-foreground">
                    {merchant.date}
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
