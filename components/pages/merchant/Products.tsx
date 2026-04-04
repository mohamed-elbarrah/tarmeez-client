import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/lib/services/productsApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  ACTIVE: { label: "متوفر", variant: "default" },
  DRAFT: { label: "مسودة", variant: "secondary" },
  ARCHIVED: { label: "نفذ", variant: "destructive" },
};

function ProductStatusBadge({ status }: { status: string }) {
  const info = statusMap[status] || {
    label: status,
    variant: "secondary" as const,
  };
  const styles = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[info.variant]}`}
    >
      {info.label}
    </span>
  );
}

export default function Products() {
  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts =
    data?.products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة كتالوج منتجاتك
          </p>
        </div>
        <Button size="sm" className="gap-2" asChild>
          <Link href="/merchant/products/new">
            <Plus className="w-4 h-4" />
            إضافة منتج
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "إجمالي المنتجات",
            value: data?.stats.total ?? 0,
            icon: Package,
          },
          {
            label: "متوفر",
            value: data?.stats.active ?? 0,
            icon: CheckCircle2,
          },
          {
            label: "نفذ من المخزون",
            value: data?.stats.outOfStock ?? 0,
            icon: AlertTriangle,
          },
          { label: "مسودات", value: data?.stats.drafts ?? 0, icon: FileText },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
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
          placeholder="بحث عن منتج..."
          className="pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  المنتج
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  السعر
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  المخزون
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">
                  الحالة
                </th>
                <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    لا توجد منتجات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg border border-border object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted border border-border" />
                        )}
                        <span className="text-sm font-medium">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium">
                      {product.price} ر.س
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      {product.quantity}
                    </td>
                    <td className="py-3 px-2">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/merchant/products/${product.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                هذا الإجراء سيقوم بحذف المنتج نهائياً. لا يمكن
                                التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                {isDeleting ? "جاري الحذف..." : "حذف"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
