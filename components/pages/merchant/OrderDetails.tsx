import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Printer, Package, Mail, Phone, MapPin } from "lucide-react";

export default function OrderDetails() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/merchant/orders">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">طلب #1234</h1>
            <p className="text-muted-foreground">تم الطلب في 6 مارس 2026، 3:45 م</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          <Button className="bg-accent text-black hover:bg-accent/90">
            تحديث الحالة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="col-span-2 space-y-6">
          {/* Items */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">المنتجات</h3>
            <div className="space-y-4">
              {[
                { name: "ساعة ذكية برو", variant: "أسود - كبير", price: "299 ر.س", qty: 1, image: "" },
                { name: "سماعات لاسلكية", variant: "أبيض", price: "150 ر.س", qty: 1, image: "" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                  <div className="w-16 h-16 bg-secondary rounded-lg border border-border"></div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.variant}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{item.price}</div>
                    <div className="text-sm text-muted-foreground">الكمية: {item.qty}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span>449 ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span>25 ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الضريبة</span>
                <span>71 ر.س</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>الإجمالي</span>
                <span>545 ر.س</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">سجل الطلب</h3>
            <div className="space-y-4">
              {[
                { status: "تم التوصيل", time: "6 مارس، 5:30 م", description: "تم تسليم الطلب للعميل" },
                { status: "خرج للتوصيل", time: "6 مارس، 2:15 م", description: "الطلب في طريقه للعميل" },
                { status: "تم الشحن", time: "6 مارس، 10:00 ص", description: "تم شحن الطلب مع أرامكس" },
                { status: "قيد التحضير", time: "6 مارس، 9:00 ص", description: "بدأ تحضير الطلب" },
                { status: "تم الطلب", time: "6 مارس، 8:45 ص", description: "تم استلام الطلب من العميل" },
              ].map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-accent" : "bg-secondary"}`}></div>
                    {i < 4 && <div className="w-0.5 h-12 bg-secondary"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium mb-1">{event.status}</div>
                    <div className="text-sm text-muted-foreground mb-1">{event.time}</div>
                    <div className="text-sm">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات العميل</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">الاسم</div>
                <div className="font-medium">أحمد محمد</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href="mailto:ahmad@example.com" className="text-accent hover:underline">ahmad@example.com</a>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">الهاتف</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href="tel:+966501234567" className="text-accent hover:underline">+966 50 123 4567</a>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                عرض جميع الطلبات
              </Button>
            </div>
          </Card>

          {/* Shipping */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">عنوان الشحن</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <div className="font-medium mb-1">أحمد محمد</div>
                  <div className="text-sm text-muted-foreground">
                    شارع الملك فهد<br />
                    الرياض، 12345<br />
                    المملكة العربية السعودية
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">شركة الشحن</div>
                <div className="font-medium">أرامكس</div>
                <div className="text-sm text-accent mt-1">رقم التتبع: ARX123456789</div>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات الدفع</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">طريقة الدفع</div>
                <div className="font-medium">بطاقة ائتمان (فيزا)</div>
                <div className="text-sm text-muted-foreground">•••• 4242</div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">حالة الدفع</div>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-black">
                  مدفوع
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
