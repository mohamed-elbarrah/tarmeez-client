import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Eye, Loader2 } from "lucide-react";
import { useGetOrdersQuery } from "@/lib/services/merchantApi";

const statusTranslations: Record<string, { label: string, color: string }> = {
  PENDING: { label: "قيد الانتظار", color: "bg-yellow-50 text-yellow-700" },
  CONFIRMED: { label: "مؤكد", color: "bg-blue-50 text-blue-700" },
  PROCESSING: { label: "قيد المعالجة", color: "bg-yellow-50 text-yellow-700" },
  SHIPPED: { label: "قيد التوصيل", color: "bg-blue-50 text-blue-700" },
  DELIVERED: { label: "مكتمل", color: "bg-accent/10 text-black" },
  CANCELLED: { label: "ملغي", color: "bg-red-50 text-red-700" },
  REFUNDED: { label: "مسترجع", color: "bg-gray-100 text-gray-700" },
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
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
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const items = data?.items || [];
  const stats = data?.stats || { total: 0, processing: 0, shipping: 0, completed: 0 };
  const totalRaw = data?.total || 0;
  const totalPages = Math.ceil(totalRaw / 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">الطلبات</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع طلباتك</p>
        </div>
        <Button className="bg-accent text-black hover:bg-accent/90">
          <Download className="w-4 h-4 ml-2" />
          تصدير الطلبات
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "جميع الطلبات", value: stats.total.toLocaleString(), color: "bg-blue-500" },
          { label: "قيد المعالجة", value: stats.processing.toLocaleString(), color: "bg-yellow-500" },
          { label: "قيد التوصيل", value: stats.shipping.toLocaleString(), color: "bg-purple-500" },
          { label: "مكتمل", value: stats.completed.toLocaleString(), color: "bg-accent" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم الطلب</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المنتجات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order: any, i: number) => {
                const status = statusTranslations[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
                return (
                  <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/merchant/orders/${order.orderCode}`} className="font-medium hover:text-accent">
                        #{order.orderCode}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{order.items?.length || 0} منتج</td>
                    <td className="py-4 px-4 font-medium">{Number(order.total).toLocaleString()} ر.س</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="py-4 px-4">
                      <Link href={`/merchant/orders/${order.orderCode}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-muted-foreground">
                    لا توجد طلبات للعرض
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              عرض {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalRaw)} من {totalRaw} طلب
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                السابق
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button 
                    key={pageNum}
                    variant="outline" 
                    size="sm" 
                    className={currentPage === pageNum ? "bg-accent text-black" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
