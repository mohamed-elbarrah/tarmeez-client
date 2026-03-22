import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const mainNav = [
  { name: "لوحة التحكم", href: "/superadmin", icon: LayoutDashboard },
  { name: "المتاجر", href: "/superadmin/stores", icon: Store },
  { name: "التجار", href: "/superadmin/merchants", icon: Users },
  { name: "الخطط", href: "/superadmin/plans", icon: CreditCard },
  { name: "القوالب", href: "/superadmin/themes", icon: Palette },
  { name: "التطبيقات", href: "/superadmin/apps", icon: Puzzle },
  { name: "الإيرادات", href: "/superadmin/revenue", icon: DollarSign },
];

const bottomNav = [
  { name: "التذاكر", href: "/superadmin/tickets", icon: HelpCircle },
  { name: "السجلات", href: "/superadmin/logs", icon: FileText },
  { name: "الإعدادات", href: "/superadmin/settings", icon: Settings },
];

const EXPANDED_WIDTH = "16rem";
const COLLAPSED_WIDTH = "4.5rem";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

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
          <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
            <Link
              href="/superadmin"
              className="flex items-center gap-3 min-w-0"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-lg">
                  ت
                </span>
              </div>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="text-lg font-bold text-sidebar-foreground whitespace-nowrap">
                      ترميز
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      إدارة المنصة
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {mainNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/superadmin" && pathname.startsWith(item.href));
              return (
                <SidebarNavLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  expanded={expanded}
                />
              );
            })}
          </nav>

          {/* Bottom Nav */}
          <div className="border-t border-sidebar-border py-3 px-2 space-y-1 shrink-0">
            {bottomNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarNavLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  expanded={expanded}
                />
              );
            })}
          </div>

          {/* Admin Profile */}
          <div className="border-t border-sidebar-border p-3 shrink-0">
            <Link
              href="/superadmin/settings"
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-9 h-9 shrink-0 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="font-bold text-sidebar-primary-foreground text-sm">
                  A
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
                      Admin
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Super Admin
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </motion.aside>

        {/* ─── Main Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
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
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ─── Sidebar Nav Link ─── */
function SidebarNavLink({
  item,
  isActive,
  expanded,
}: {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isActive: boolean;
  expanded: boolean;
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
    </Link>
  );

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
