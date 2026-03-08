import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Package, MapPin, Heart, Settings, LogOut } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function Account() {
  const [activeTab, setActiveTab] = useState("orders");

  const orders = [
    {
      id: "#ORD-2024-001",
      date: "2026-03-05",
      status: "قيد التوصيل",
      total: 2497,
      items: 3,
      statusColor: "bg-accent text-black",
    },
    {
      id: "#ORD-2024-002",
      date: "2026-02-28",
      status: "تم التوصيل",
      total: 1299,
      items: 1,
      statusColor: "bg-secondary text-foreground",
    },
    {
      id: "#ORD-2024-003",
      date: "2026-02-15",
      status: "تم التوصيل",
      total: 899,
      items: 1,
      statusColor: "bg-secondary text-foreground",
    },
  ];

  const addresses = [
    {
      id: 1,
      title: "المنزل",
      name: "أحمد محمد",
      address: "شارع الملك فهد، حي النخيل",
      city: "الرياض",
      postal: "12345",
      phone: "+966 50 123 4567",
      isDefault: true,
    },
    {
      id: 2,
      title: "العمل",
      name: "أحمد محمد",
      address: "طريق الملك عبدالله، برج الأعمال",
      city: "الرياض",
      postal: "12346",
      phone: "+966 50 123 4567",
      isDefault: false,
    },
  ];

  const wishlist = [
    {
      id: 1,
      name: "سماعات لاسلكية",
      price: "1,199",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NzI3ODM3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true,
      slug: "wireless-headphones",
    },
    {
      id: 2,
      name: "حقيبة ظهر جلدية",
      price: "799",
      image: "https://images.unsplash.com/photo-1594300418249-eebf1858e9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFja3BhY2slMjBicm93bnxlbnwxfHx8fDE3NzI4MjE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true,
      slug: "leather-backpack",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" dir="rtl">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-lg">أحمد محمد</h3>
              <p className="text-sm text-muted-foreground">
                ahmed@example.com
              </p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "orders"
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>طلباتي</span>
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "addresses"
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50"
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>العناوين</span>
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "wishlist"
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50"
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>قائمة الرغبات</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>الإعدادات</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </nav>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.date} • {order.items} منتج
                        </p>
                      </div>
                      <Badge className={order.statusColor}>{order.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xl">
                        {order.total.toLocaleString()} ر.س
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline">تتبع الطلب</Button>
                        <Button>تفاصيل</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">العناوين</h1>
                <Button>إضافة عنوان جديد</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <Card key={address.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-lg">{address.title}</h3>
                      {address.isDefault && (
                        <Badge className="bg-accent text-black">
                          الافتراضي
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <p className="font-medium">{address.name}</p>
                      <p className="text-muted-foreground">{address.address}</p>
                      <p className="text-muted-foreground">
                        {address.city} {address.postal}
                      </p>
                      <p className="text-muted-foreground">{address.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive"
                      >
                        حذف
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">قائمة الرغبات</h1>
              <div className="grid md:grid-cols-2 gap-6">
                {wishlist.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{item.name}</h3>
                      <p className="text-lg font-bold mb-4">
                        {item.price} ر.س
                      </p>
                      {item.inStock ? (
                        <div className="flex gap-2">
                          <Button className="flex-1">أضف إلى السلة</Button>
                          <Button variant="outline" size="icon">
                            <Heart className="w-5 h-5 fill-current" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary">غير متوفر</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>

              <div className="space-y-6">
                {/* Personal Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">الاسم الأول</Label>
                        <Input
                          id="firstName"
                          defaultValue="أحمد"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">اسم العائلة</Label>
                        <Input
                          id="lastName"
                          defaultValue="محمد"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="ahmed@example.com"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الجوال</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+966 50 123 4567"
                        className="mt-2"
                      />
                    </div>
                    <Button>حفظ التغييرات</Button>
                  </div>
                </Card>

                {/* Change Password */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">تغيير كلمة المرور</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">
                        كلمة المرور الحالية
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        تأكيد كلمة المرور
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="mt-2"
                      />
                    </div>
                    <Button>تحديث كلمة المرور</Button>
                  </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">الإشعارات</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">العروض والتخفيضات</p>
                        <p className="text-sm text-muted-foreground">
                          تلقي إشعارات حول العروض الخاصة
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">تحديثات الطلبات</p>
                        <p className="text-sm text-muted-foreground">
                          تلقي إشعارات حول حالة طلباتك
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">النشرة البريدية</p>
                        <p className="text-sm text-muted-foreground">
                          تلقي آخر الأخبار والمنتجات
                        </p>
                      </div>
                      <input type="checkbox" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
