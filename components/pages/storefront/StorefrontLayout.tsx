import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
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
            <Link href="/store" className="text-2xl font-bold">متجري</Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/store" className="hover:text-accent transition-colors">الرئيسية</Link>
              <Link href="/store/collection/all" className="hover:text-accent transition-colors">المنتجات</Link>
              <Link href="/store/collection/new" className="hover:text-accent transition-colors">الجديد</Link>
              <Link href="/store/collection/sale" className="hover:text-accent transition-colors">التخفيضات</Link>
              <Link href="/store/blog" className="hover:text-accent transition-colors">المدونة</Link>
              <Link href="/store/contact" className="hover:text-accent transition-colors">اتصل بنا</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
              <Link href="/store/account">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Link href="/store/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-black rounded-full text-xs flex items-center justify-center font-bold">
                    3
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
              <h3 className="font-bold mb-4 text-lg">متجري</h3>
              <p className="text-sm text-muted-foreground">
                وجهتك الأولى للتسوق الإلكتروني
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/store">الرئيسية</Link></li>
                <li><Link href="/store/collection/all">المنتجات</Link></li>
                <li><Link href="/store/blog">المدونة</Link></li>
                <li><Link href="/store/contact">اتصل بنا</Link></li>
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
                <li>info@mystore.com</li>
                <li>+966 50 123 4567</li>
                <li>الرياض، السعودية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 متجري. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
