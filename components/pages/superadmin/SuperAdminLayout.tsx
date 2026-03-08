import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Palette,
  Puzzle,
  DollarSign,
  HelpCircle,
  FileText,
  Settings,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const navigation = [
  { name: "لوحة التحكم", href: "/superadmin", icon: LayoutDashboard },
  { name: "المتاجر", href: "/superadmin/stores", icon: Store },
  { name: "التجار", href: "/superadmin/merchants", icon: Users },
  { name: "الخطط", href: "/superadmin/plans", icon: CreditCard },
  { name: "القوالب", href: "/superadmin/themes", icon: Palette },
  { name: "التطبيقات", href: "/superadmin/apps", icon: Puzzle },
  { name: "الإيرادات", href: "/superadmin/revenue", icon: DollarSign },
  { name: "التذاكر", href: "/superadmin/tickets", icon: HelpCircle },
  { name: "السجلات", href: "/superadmin/logs", icon: FileText },
  { name: "الإعدادات", href: "/superadmin/settings", icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <aside className="fixed right-0 top-0 h-full w-64 bg-card border-l border-border z-40">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-lg">ت</span>
            </div>
            <div>
              <span className="text-xl font-bold">ترميز</span>
              <div className="text-xs text-muted-foreground">إدارة المنصة</div>
            </div>
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
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">Admin</div>
              <div className="text-sm text-muted-foreground truncate">Super Admin</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      <div className="mr-64">
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full pr-10 pl-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
