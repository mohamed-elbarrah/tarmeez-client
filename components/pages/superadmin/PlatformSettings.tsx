import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlatformSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إعدادات المنصة</h1>
        <p className="text-muted-foreground">تكوين إعدادات النظام</p>
      </div>

      <Tabs defaultValue="general" dir="rtl">
        <TabsList>
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="email">البريد</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات المنصة</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform-name">اسم المنصة</Label>
                <Input id="platform-name" defaultValue="ترميز" />
              </div>
              <div>
                <Label htmlFor="platform-email">البريد الإلكتروني</Label>
                <Input id="platform-email" defaultValue="info@tarmiz.com" />
              </div>
              <div>
                <Label htmlFor="support-email">بريد الدعم</Label>
                <Input id="support-email" defaultValue="support@tarmiz.com" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">إعدادات SMTP</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="smtp-host">خادم SMTP</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div>
                <Label htmlFor="smtp-port">المنفذ</Label>
                <Input id="smtp-port" defaultValue="587" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">بوابات الدفع</h3>
            <div className="space-y-3">
              {["Stripe", "PayPal", "مدى"].map((gateway, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <span className="font-medium">{gateway}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-accent peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">إعدادات الأمان</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <div className="font-medium mb-1">المصادقة الثنائية</div>
                  <div className="text-sm text-muted-foreground">تفعيل 2FA للمشرفين</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-accent peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
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
