import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات متجرك</p>
      </div>

      <Tabs defaultValue="general" dir="rtl">
        <TabsList>
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="domains">النطاقات</TabsTrigger>
          <TabsTrigger value="payments">الدفع</TabsTrigger>
          <TabsTrigger value="shipping">الشحن</TabsTrigger>
          <TabsTrigger value="taxes">الضرائب</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات المتجر</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="store-name">اسم المتجر</Label>
                <Input id="store-name" defaultValue="متجري" />
              </div>
              <div>
                <Label htmlFor="store-email">البريد الإلكتروني</Label>
                <Input id="store-email" type="email" defaultValue="store@example.com" />
              </div>
              <div>
                <Label htmlFor="store-phone">رقم الهاتف</Label>
                <Input id="store-phone" defaultValue="+966 50 123 4567" />
              </div>
              <div>
                <Label htmlFor="store-address">العنوان</Label>
                <Input id="store-address" defaultValue="الرياض، المملكة العربية السعودية" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">نطاقات المتجر</h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">mystore.tarmiz.com</div>
                  <div className="text-sm text-muted-foreground">النطاق الافتراضي</div>
                </div>
                <span className="px-3 py-1 bg-accent/10 rounded-full text-xs">نشط</span>
              </div>
              <Button variant="outline" className="w-full">إضافة نطاق مخصص</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">بوابات الدفع</h3>
            <div className="space-y-3">
              {["مدى", "فيزا / ماستركارد", "Apple Pay", "الدفع عند الاستلام"].map((method, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <span className="font-medium">{method}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">مناطق الشحن</h3>
            <div className="space-y-3">
              {[
                { zone: "الرياض", rate: "25 ر.س", time: "1-2 يوم" },
                { zone: "جدة", rate: "30 ر.س", time: "2-3 أيام" },
                { zone: "الدمام", rate: "30 ر.س", time: "2-3 أيام" },
              ].map((zone, i) => (
                <div key={i} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{zone.zone}</span>
                    <Button variant="ghost" size="sm">تعديل</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {zone.rate} • {zone.time}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">إضافة منطقة</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">إعدادات الضرائب</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tax-rate">نسبة الضريبة (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="15" />
              </div>
              <div>
                <Label htmlFor="tax-number">الرقم الضريبي</Label>
                <Input id="tax-number" placeholder="123456789" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="include-tax" defaultChecked />
                <Label htmlFor="include-tax" className="cursor-pointer">تضمين الضريبة في الأسعار</Label>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">إلغاء</Button>
        <Button className="bg-accent text-black hover:bg-accent/90">حفظ التغييرات</Button>
      </div>
    </div>
  );
}
