import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Megaphone,
  Palette,
  Puzzle,
  Settings,
  UsersRound,
  CreditCard,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

const navigation = [
  { name: "لوحة التحكم", href: "/merchant", icon: LayoutDashboard },
  { name: "الطلبات", href: "/merchant/orders", icon: ShoppingCart },
  { name: "المنتجات", href: "/merchant/products", icon: Package },
  { name: "العملاء", href: "/merchant/customers", icon: Users },
  { name: "التحليلات", href: "/merchant/analytics", icon: BarChart3 },
  { name: "التسويق", href: "/merchant/marketing", icon: Megaphone },
  { name: "منشئ الصفحات", href: "/merchant/page-builder", icon: Palette },
  { name: "القوالب", href: "/merchant/themes", icon: Palette },
  { name: "التطبيقات", href: "/merchant/apps", icon: Puzzle },
  { name: "الإعدادات", href: "/merchant/settings", icon: Settings },
  { name: "الفريق", href: "/merchant/team", icon: UsersRound },
  { name: "الفواتير", href: "/merchant/billing", icon: CreditCard },
  { name: "الدعم", href: "/merchant/support", icon: HelpCircle },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-secondary" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-border z-40">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-accent font-bold text-lg">ت</span>
            </div>
            <span className="text-xl font-bold">ترميز</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-accent/10 text-black font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="font-bold text-black">أ</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">أحمد محمد</div>
              <div className="text-sm text-muted-foreground truncate">متجري</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="mr-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full pr-10 pl-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </Button>
              <Button variant="outline">زيارة المتجر</Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
