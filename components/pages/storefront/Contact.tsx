import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">اتصل بنا</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت ممكن
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Information Cards */}
        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-bold mb-2">اتصل بنا</h3>
          <p className="text-muted-foreground text-sm mb-3">
            متاحون من السبت إلى الخميس
          </p>
          <a
            href="tel:+966501234567"
            className="text-accent font-medium hover:underline"
          >
            +966 50 123 4567
          </a>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-bold mb-2">راسلنا</h3>
          <p className="text-muted-foreground text-sm mb-3">
            نرد على جميع الاستفسارات خلال 24 ساعة
          </p>
          <a
            href="mailto:info@mystore.com"
            className="text-accent font-medium hover:underline"
          >
            info@mystore.com
          </a>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-bold mb-2">الدردشة المباشرة</h3>
          <p className="text-muted-foreground text-sm mb-3">
            متاحة من 9 صباحاً إلى 9 مساءً
          </p>
          <Button variant="link" className="text-accent p-0 h-auto">
            ابدأ الدردشة
          </Button>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input id="firstName" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input id="lastName" className="mt-2" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
              <Input id="phone" type="tel" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="subject">الموضوع</Label>
              <Input id="subject" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="message">الرسالة</Label>
              <Textarea
                id="message"
                rows={6}
                placeholder="اكتب رسالتك هنا..."
                className="mt-2"
              />
            </div>

            <Button size="lg" className="w-full gap-2">
              <Send className="w-5 h-5" />
              إرسال الرسالة
            </Button>
          </form>
        </Card>

        {/* Additional Information */}
        <div className="space-y-6">
          {/* Store Location */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold mb-2">موقعنا</h3>
                <p className="text-muted-foreground">
                  شارع الملك فهد، حي النخيل
                  <br />
                  الرياض 12345
                  <br />
                  المملكة العربية السعودية
                </p>
              </div>
            </div>
            <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
          </Card>

          {/* Working Hours */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold mb-4">ساعات العمل</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السبت - الخميس</span>
                    <span className="font-medium">9:00 ص - 9:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الجمعة</span>
                    <span className="font-medium">مغلق</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ Link */}
          <Card className="p-8 bg-secondary">
            <h3 className="font-bold mb-2">لديك سؤال سريع؟</h3>
            <p className="text-muted-foreground mb-4">
              قد تجد الإجابة في قسم الأسئلة الشائعة
            </p>
            <Button variant="outline">
              الأسئلة الشائعة
            </Button>
          </Card>
        </div>
      </div>

      {/* Support Options */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          كيف يمكننا مساعدتك؟
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h4 className="font-bold mb-1">تتبع الطلب</h4>
            <p className="text-sm text-muted-foreground">
              تتبع حالة طلبك
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h4 className="font-bold mb-1">الإرجاع والاستبدال</h4>
            <p className="text-sm text-muted-foreground">
              سياسة الإرجاع
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h4 className="font-bold mb-1">طرق الدفع</h4>
            <p className="text-sm text-muted-foreground">
              خيارات الدفع المتاحة
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="font-bold mb-1">مركز المساعدة</h4>
            <p className="text-sm text-muted-foreground">
              الأسئلة الشائعة
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
