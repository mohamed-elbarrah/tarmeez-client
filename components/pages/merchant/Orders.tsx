import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  Eye,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useGetOrdersQuery } from "@/lib/services/merchantApi";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "muted" }
> = {
  PENDING: { label: "قيد الانتظار", variant: "secondary" },
  CONFIRMED: { label: "مؤكد", variant: "default" },
  PROCESSING: { label: "قيد المعالجة", variant: "secondary" },
  SHIPPED: { label: "قيد التوصيل", variant: "default" },
  DELIVERED: { label: "مكتمل", variant: "default" },
  CANCELLED: { label: "ملغي", variant: "destructive" },
  REFUNDED: { label: "مسترجع", variant: "muted" },
};

function StatusBadge({ status }: { status: string }) {
  const info = statusMap[status] || {
    label: status,
    variant: "muted" as const,
  };
  const styles = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[info.variant]}`}
    >
      {info.label}
    </span>
  );
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useGetOrdersQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  const items = data?.items || [];
  const stats = data?.stats || {
    total: 0,
    processing: 0,
    shipping: 0,
    completed: 0,
  };
  const totalRaw = data?.total || 0;
  const totalPages = Math.ceil(totalRaw / 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة ومتابعة جميع طلباتك
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          تصدير
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "جميع الطلبات", value: stats.total, icon: ShoppingCart },
          { label: "قيد المعالجة", value: stats.processing, icon: Clock },
          { label: "قيد التوصيل", value: stats.shipping, icon: Truck },
          { label: "مكتمل", value: stats.completed, icon: CheckCircle2 },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="بحث بالرقم..."
          className="pr-10"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                  رقم الطلب
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                  العميل
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                  المنتجات
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                  المبلغ
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                  الحالة
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                  التاريخ
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((order: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/merchant/orders/${order.orderCode}`}
                      className="font-medium text-sm hover:text-primary"
                    >
                      #{order.orderCode}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {order.items?.length || 0} منتج
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {Number(order.total).toLocaleString()} ر.س
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link href={`/merchant/orders/${order.orderCode}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-muted-foreground text-sm"
                  >
                    لا توجد طلبات للعرض
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              عرض {(currentPage - 1) * 10 + 1} -{" "}
              {Math.min(currentPage * 10, totalRaw)} من {totalRaw}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                السابق
              </Button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1,
              ).map((n) => (
                <Button
                  key={n}
                  variant={currentPage === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
