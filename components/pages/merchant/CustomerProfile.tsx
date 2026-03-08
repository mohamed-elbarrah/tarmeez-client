import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin, ShoppingCart } from "lucide-react";

export default function CustomerProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/merchant/customers">
          <Button variant="ghost" size="icon">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-1">أحمد محمد</h1>
          <p className="text-muted-foreground">عميل منذ يناير 2025</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">آخر الطلبات</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <div className="font-medium mb-1">طلب #123{i}</div>
                    <div className="text-sm text-muted-foreground">منذ {i} أيام</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{450 + i * 50} ر.س</div>
                    <span className="text-xs px-2 py-1 bg-accent/10 rounded-full">مكتمل</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات العميل</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <a href="mailto:ahmad@example.com" className="text-accent">ahmad@example.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <span>الرياض، السعودية</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">إحصائيات</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">إجمالي الطلبات</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">إجمالي الإنفاق</span>
                <span className="font-bold">4,520 ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">متوسط الطلب</span>
                <span className="font-bold">377 ر.س</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
