import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGetPagesQuery } from "@/lib/services/pagesApi";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  PanelRightClose,
  PanelRightOpen,
  ExternalLink,
  Layout,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

import { useRole } from "@/hooks/useRole";
import { Resource, Action } from "@/lib/types/rbac";
import { toast } from "sonner";
import { useEffect } from "react";

const navigation = [
  { name: "لوحة التحكم", href: "/merchant", icon: LayoutDashboard }, // Dashboard is generally open for all
  {
    name: "الطلبات",
    href: "/merchant/orders",
    icon: ShoppingCart,
    resource: Resource.ORDERS,
  },
  {
    name: "المنتجات",
    href: "/merchant/products",
    icon: Package,
    resource: Resource.PRODUCTS,
  },
  {
    name: "الفئات",
    href: "/merchant/categories",
    icon: FolderOpen,
    resource: Resource.CATEGORIES,
  },
  {
    name: "العملاء",
    href: "/merchant/customers",
    icon: Users,
    resource: Resource.CUSTOMERS,
  },
  {
    name: "التحليلات",
    href: "/merchant/analytics",
    icon: BarChart3,
    resource: Resource.ANALYTICS,
  },
  {
    name: "التسويق",
    href: "/merchant/marketing",
    icon: Megaphone,
    resource: Resource.ANALYTICS,
  },
  {
    name: "صفحاتي",
    href: "/merchant/pages",
    icon: Layout,
    resource: Resource.PAGES,
  },
  {
    name: "القوالب",
    href: "/merchant/themes",
    icon: Palette,
    resource: Resource.SETTINGS,
  },
  {
    name: "التطبيقات",
    href: "/merchant/apps",
    icon: Puzzle,
    resource: Resource.SETTINGS,
  },
];

const bottomNavigation = [
  {
    name: "الإعدادات",
    href: "/merchant/settings",
    icon: Settings,
    resource: Resource.SETTINGS,
  },
  {
    name: "الفريق",
    href: "/merchant/team",
    icon: UsersRound,
    resource: Resource.TEAM,
  },
  {
    name: "الفواتير",
    href: "/merchant/billing",
    icon: CreditCard,
    resource: Resource.SETTINGS,
  },
  { name: "الدعم", href: "/merchant/support", icon: HelpCircle },
];

const EXPANDED_WIDTH = "16rem";
const COLLAPSED_WIDTH = "4.5rem";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const { canRead } = useRole();
  const { data: pages } = useGetPagesQuery();
  const { data: storeData } = useGetMyStoreQuery();

  // ROUTE PROTECTION: Sync layout with RBAC
  useEffect(() => {
    const currentNavItem = [...navigation, ...bottomNavigation].find(
      (item) => pathname.startsWith(item.href) && item.href !== "/merchant",
    );

    if (currentNavItem?.resource && !canRead(currentNavItem.resource)) {
      toast.error("عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة");
      window.location.href = "/merchant"; // Simple redirect
    }
  }, [pathname, canRead]);

  const publishedCount =
    pages?.filter((p) => p.status === "PUBLISHED").length ?? 0;
  const merchantName = storeData?.merchant?.fullName ?? "";
  const storeName = storeData?.store?.name ?? "";
  const storeSlug = storeData?.store?.slug ?? "";
  const initials = merchantName ? merchantName.charAt(0) : "ت";

  // Filter Nav Items
  const filteredNav = navigation.filter(
    (item) => !item.resource || canRead(item.resource),
  );

  const filteredBottomNav = bottomNavigation.filter(
    (item) => !item.resource || canRead(item.resource),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen bg-background" dir="rtl">
        {/* ─── Sidebar ─── */}
        <motion.aside
          layout
          className="sticky top-0 h-screen flex flex-col border-l border-sidebar-border bg-sidebar z-40 overflow-hidden"
          animate={{ width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 h-16 border-b border-sidebar-border shrink-0">
            <Link href="/merchant" className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-lg">
                  ت
                </span>
              </div>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden"
                  >
                    ترميز
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {filteredNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/merchant" && pathname.startsWith(item.href));
              return (
                <SidebarLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  expanded={expanded}
                  badge={
                    item.name === "صفحاتي" && publishedCount > 0
                      ? publishedCount
                      : undefined
                  }
                />
              );
            })}
          </nav>

          {/* Bottom Nav */}
          <div className="border-t border-sidebar-border py-3 px-2 space-y-1 shrink-0">
            {filteredBottomNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  expanded={expanded}
                />
              );
            })}
          </div>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-3 shrink-0">
            <Link
              href="/merchant/settings"
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-9 h-9 shrink-0 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="font-bold text-sidebar-primary-foreground text-sm">
                  {initials}
                </span>
              </div>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <div className="text-sm font-medium text-sidebar-foreground truncate">
                      {merchantName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {storeName}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </motion.aside>

        {/* ─── Main Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 border-b border-border bg-card px-6 shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded((v) => !v)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                {expanded ? (
                  <PanelRightClose className="w-5 h-5" />
                ) : (
                  <PanelRightOpen className="w-5 h-5" />
                )}
              </Button>
              <div className="relative max-w-md flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full pr-10 pl-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ModeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              {storeSlug && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link href={`/store/${storeSlug}`} target="_blank">
                    زيارة المتجر
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ─── Sidebar Link Component ─── */
function SidebarLink({
  item,
  isActive,
  expanded,
  badge,
}: {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isActive: boolean;
  expanded: boolean;
  badge?: number;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      } ${!expanded ? "justify-center" : ""}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap overflow-hidden flex-1"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
      {expanded && badge !== undefined && (
        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <span>{item.name}</span>
          {badge !== undefined && (
            <span className="mr-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
