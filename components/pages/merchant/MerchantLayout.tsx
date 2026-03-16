import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetPagesQuery } from "@/lib/services/pagesApi";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
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
  Layout,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const navigation = [
  { name: "لوحة التحكم", href: "/merchant", icon: LayoutDashboard },
  { name: "الطلبات", href: "/merchant/orders", icon: ShoppingCart },
  { name: "المنتجات", href: "/merchant/products", icon: Package },
  { name: "الفئات", href: "/merchant/categories", icon: FolderOpen },
  { name: "العملاء", href: "/merchant/customers", icon: Users },
  { name: "التحليلات", href: "/merchant/analytics", icon: BarChart3 },
  { name: "التسويق", href: "/merchant/marketing", icon: Megaphone },
  { name: "صفحاتي", href: "/merchant/pages", icon: Layout },
  { name: "القوالب", href: "/merchant/themes", icon: Palette },
  { name: "التطبيقات", href: "/merchant/apps", icon: Puzzle },
  { name: "الإعدادات", href: "/merchant/settings", icon: Settings },
  { name: "الفريق", href: "/merchant/team", icon: UsersRound },
  { name: "الفواتير", href: "/merchant/billing", icon: CreditCard },
  { name: "الدعم", href: "/merchant/support", icon: HelpCircle },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: pages } = useGetPagesQuery();
  
  const publishedCount = pages?.filter(p => p.status === 'PUBLISHED').length ?? 0;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SidebarProvider style={{ ["--sidebar-width" as any]: "16rem" } as any}>
        <Sidebar side="right" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center justify-between p-0 px-2">
              <Link href="/" className="flex items-center gap-2 p-4">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold text-lg">ت</span>
                </div>
                <span className="text-lg font-bold">ترميز</span>
              </Link>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href} className="flex items-center gap-3 px-4 py-3 w-full">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        {item.name === "صفحاتي" && publishedCount > 0 && (
                          <span className="bg-[var(--p-color,theme(colors.primary.DEFAULT))] text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {publishedCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-bold text-primary-foreground">أ</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">أحمد محمد</div>
                  <div className="text-sm text-muted-foreground truncate">متجري</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-2xl">

              <div className="flex items-center ">
                <SidebarTrigger />
                <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full pr-10 pl-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              </div>
              
            </div>

            <div className="flex items-center gap-2">
                  <ModeToggle />
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                  </Button>
                  <Button variant="outline">زيارة المتجر</Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
