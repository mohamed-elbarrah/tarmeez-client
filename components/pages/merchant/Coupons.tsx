import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function Coupons() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">كوبونات الخصم</h1>
          <p className="text-muted-foreground">إدارة أكواد الخصم</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Plus className="w-4 h-4 ml-2" />
          إنشاء كوبون
        </Button>
      </div>

      <div className="grid gap-2">
        {[
          { code: "SUMMER2026", type: "نسبة", value: "20%", used: 234, limit: 1000, expires: "30 يونيو 2026" },
          { code: "WELCOME", type: "مبلغ ثابت", value: "50 ر.س", used: 890, limit: null, expires: "بدون" },
          { code: "FREESHIP", type: "شحن مجاني", value: "-", used: 456, limit: 500, expires: "15 مايو 2026" },
        ].map((coupon, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold font-mono">{coupon.code}</span>
                  <span className="px-3 py-1 bg-accent/10 rounded-full text-xs">{coupon.type}</span>
                </div>
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">القيمة</div>
                    <div className="font-medium">{coupon.value}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">الاستخدام</div>
                    <div className="font-medium">
                      {coupon.used} {coupon.limit && `/ ${coupon.limit}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">تاريخ الانتهاء</div>
                    <div className="font-medium">{coupon.expires}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">الحالة</div>
                    <span className="px-2 py-1 bg-accent/10 rounded-full text-xs font-medium">نشط</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mr-4">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
