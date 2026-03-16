import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { ModeToggle } from "@/components/mode-toggle";

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
      <SidebarProvider style={{ ["--sidebar-width" as any]: "16rem" } as any}>
        <Sidebar side="right" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-4">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-lg">ت</span>
              </div>
              <div>
                <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">ترميز</span>
                <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">إدارة المنصة</div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href} className="flex items-center gap-3 px-4 py-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
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
                  <span className="font-bold text-primary-foreground">A</span>
                </div>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <div className="font-medium truncate">Admin</div>
                  <div className="text-sm text-muted-foreground truncate">Super Admin</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </div>
            </div>
          </SidebarFooter>

          <SidebarRail />
          
        </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2">
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
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
