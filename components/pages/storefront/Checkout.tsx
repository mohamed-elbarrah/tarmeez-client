import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, CreditCard } from "lucide-react";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const cartItems = [
    {
      id: 1,
      name: "ساعة كلاسيكية فاخرة",
      price: 1299,
      quantity: 1,
    },
    {
      id: 2,
      name: "حذاء رياضي عصري",
      price: 599,
      quantity: 2,
    },
    {
      id: 3,
      name: "نظارة شمسية مصمّمة",
      price: 899,
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      <h1 className="text-4xl font-bold mb-8">إتمام الطلب</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+966 50 123 4567"
                  className="mt-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="newsletter" />
                <label htmlFor="newsletter" className="text-sm cursor-pointer">
                  أرغب في تلقي العروض والتحديثات عبر البريد الإلكتروني
                </label>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">عنوان الشحن</h2>
            <div className="space-y-4">
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
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  placeholder="اسم الشارع ورقم المبنى"
                  className="mt-2"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input id="city" placeholder="الرياض" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="region">المنطقة</Label>
                  <Input id="region" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="postal">الرمز البريدي</Label>
                  <Input id="postal" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="country">الدولة</Label>
                <Input
                  id="country"
                  defaultValue="المملكة العربية السعودية"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Shipping Method */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">طريقة الشحن</h2>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg mb-3">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <label htmlFor="standard" className="cursor-pointer">
                    <p className="font-medium">شحن قياسي</p>
                    <p className="text-sm text-muted-foreground">
                      التوصيل خلال 3-5 أيام عمل
                    </p>
                  </label>
                </div>
                <span className="font-bold text-accent">مجاني</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="express" id="express" />
                  <label htmlFor="express" className="cursor-pointer">
                    <p className="font-medium">شحن سريع</p>
                    <p className="text-sm text-muted-foreground">
                      التوصيل خلال 1-2 أيام عمل
                    </p>
                  </label>
                </div>
                <span className="font-bold">50 ر.س</span>
              </div>
            </RadioGroup>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">طريقة الدفع</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <label
                    htmlFor="credit-card"
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">بطاقة ائتمان</span>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 border border-border rounded">
                          Visa
                        </span>
                        <span className="text-xs px-2 py-1 border border-border rounded">
                          Mastercard
                        </span>
                        <span className="text-xs px-2 py-1 border border-border rounded">
                          مدى
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                  <RadioGroupItem value="apple-pay" id="apple-pay" />
                  <label htmlFor="apple-pay" className="cursor-pointer flex-1">
                    <span className="font-medium">Apple Pay</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                  <RadioGroupItem value="cod" id="cod" />
                  <label htmlFor="cod" className="cursor-pointer flex-1">
                    <span className="font-medium">الدفع عند الاستلام</span>
                  </label>
                </div>
              </div>
            </RadioGroup>

            {/* Credit Card Form */}
            {paymentMethod === "credit-card" && (
              <div className="mt-6 space-y-4 pt-6 border-t border-border">
                <div>
                  <Label htmlFor="cardNumber">رقم البطاقة</Label>
                  <div className="relative mt-2">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="pr-10"
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">رمز الأمان CVV</Label>
                    <Input id="cvv" placeholder="123" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">الاسم على البطاقة</Label>
                  <Input id="cardName" className="mt-2" />
                </div>
              </div>
            )}
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>جميع المعاملات مشفرة وآمنة</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      الكمية: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {(item.price * item.quantity).toLocaleString()} ر.س
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-medium">
                  {subtotal.toLocaleString()} ر.س
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الشحن</span>
                <span className="text-accent font-medium">مجاني</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Total */}
            <div className="flex justify-between mb-6">
              <span className="text-xl font-bold">المجموع</span>
              <span className="text-2xl font-bold">
                {total.toLocaleString()} ر.س
              </span>
            </div>

            {/* Place Order Button */}
            <Button size="lg" className="w-full mb-4">
              تأكيد الطلب
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              بإتمام الطلب، أنت توافق على{" "}
              <a href="#" className="underline">
                الشروط والأحكام
              </a>{" "}
              و
              <a href="#" className="underline">
                سياسة الخصوصية
              </a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
