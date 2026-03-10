"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";

export default function StorefrontLayout({
  children,
  store
}: {
  children: React.ReactNode;
  store?: any;
}) {
  const storeUrl = store ? `/store/${store.slug}` : "/store";
  const storeName = store?.name || "متجري";

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Bar */}
      <div className="bg-black text-white py-2 px-6 text-center text-sm">
        <p>شحن مجاني للطلبات فوق 200 ريال 🎉</p>
      </div>

      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href={storeUrl} className="flex items-center gap-2">
              {store?.logo ? (
                <img src={store.logo} alt={storeName} className="h-8 object-contain" />
              ) : (
                <span className="text-2xl font-bold">{storeName}</span>
              )}
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href={storeUrl} className="hover:text-primary transition-colors">الرئيسية</Link>
              <Link href={`${storeUrl}/collection/all`} className="hover:text-primary transition-colors">المنتجات</Link>
              <Link href={`${storeUrl}/collection/new`} className="hover:text-primary transition-colors">الجديد</Link>
              <Link href={`${storeUrl}/collection/sale`} className="hover:text-primary transition-colors">التخفيضات</Link>
              <Link href={`${storeUrl}/blog`} className="hover:text-primary transition-colors">المدونة</Link>
              <Link href={`${storeUrl}/contact`} className="hover:text-primary transition-colors">اتصل بنا</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
              <Link href={`${storeUrl}/account`}>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Link href={`${storeUrl}/cart`}>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                    0
                  </span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-lg">{storeName}</h3>
              <p className="text-sm text-muted-foreground">
                وجهتك الأولى للتسوق الإلكتروني
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href={storeUrl}>الرئيسية</Link></li>
                <li><Link href={`${storeUrl}/collection/all`}>المنتجات</Link></li>
                <li><Link href={`${storeUrl}/blog`}>المدونة</Link></li>
                <li><Link href={`${storeUrl}/contact`}>اتصل بنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">خدمة العملاء</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">سياسة الإرجاع</a></li>
                <li><a href="#">الشحن والتوصيل</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
                <li><a href="#">تتبع الطلب</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{store?.merchant?.email || "info@tarmeez.com"}</li>
                <li>{store?.merchant?.phone || "+966 50 123 4567"}</li>
                <li>الرياض، السعودية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 {storeName}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
