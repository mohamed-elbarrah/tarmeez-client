import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Tag, ShoppingCart, Mail, TrendingUp } from "lucide-react";

export default function Marketing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">التسويق</h1>
        <p className="text-muted-foreground">أدوات تسويقية لزيادة مبيعاتك</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Link href="/merchant/marketing/coupons">
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">كوبونات الخصم</h3>
            <p className="text-muted-foreground mb-4">إنشاء وإدارة أكواد الخصم</p>
            <div className="text-sm text-accent">12 كوبون نشط →</div>
          </Card>
        </Link>

        <Link href="/merchant/marketing/abandoned-cart">
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">السلة المهجورة</h3>
            <p className="text-muted-foreground mb-4">استرجاع العربات المتروكة</p>
            <div className="text-sm text-accent">45 سلة →</div>
          </Card>
        </Link>

        <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">حملات البريد</h3>
          <p className="text-muted-foreground mb-4">إرسال حملات بريدية</p>
          <div className="text-sm text-accent">8 حملات →</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">أداء الحملات</h3>
        <div className="space-y-4">
          {[
            { name: "خصم الصيف 2026", sent: 2340, opened: 1456, clicks: 892, revenue: "12,340 ر.س" },
            { name: "عرض نهاية الموسم", sent: 1890, opened: 1123, clicks: 678, revenue: "8,920 ر.س" },
            { name: "منتجات جديدة", sent: 3450, opened: 2234, clicks: 1345, revenue: "15,670 ر.س" },
          ].map((campaign, i) => (
            <div key={i} className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold">{campaign.name}</span>
                <span className="text-sm text-accent">{campaign.revenue}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">تم الإرسال</div>
                  <div className="font-medium">{campaign.sent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">تم الفتح</div>
                  <div className="font-medium">{campaign.opened.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">النقرات</div>
                  <div className="font-medium">{campaign.clicks.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
