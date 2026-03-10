import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react";
import { useGetProductsQuery, useDeleteProductMutation } from "@/lib/services/productsApi";
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

const statusMap: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: "متوفر", class: "bg-accent/10 text-black" },
  DRAFT: { label: "مسودة", class: "bg-yellow-50 text-yellow-700" },
  ARCHIVED: { label: "نفذ", class: "bg-red-50 text-red-700" },
};

export default function Products() {
  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = data?.products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">المنتجات</h1>
          <p className="text-muted-foreground">إدارة كتالوج منتجاتك</p>
        </div>
        <Link href="/merchant/products/new">
          <Button className="bg-accent text-black hover:bg-accent/90">
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "إجمالي المنتجات", value: data?.stats.total ?? 0 },
          { label: "متوفر", value: data?.stats.active ?? 0 },
          { label: "نفذ من المخزون", value: data?.stats.outOfStock ?? 0 },
          { label: "مسودات", value: data?.stats.drafts ?? 0 },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            {isLoading ? (
              <div className="h-8 w-16 bg-secondary animate-pulse rounded mb-1"></div>
            ) : (
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
            )}
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="بحث عن منتج..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المنتج</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">السعر</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المخزون</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary animate-pulse rounded-lg"></div>
                        <div className="h-4 w-32 bg-secondary animate-pulse rounded"></div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-secondary animate-pulse rounded"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-12 bg-secondary animate-pulse rounded"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-20 bg-secondary animate-pulse rounded-full"></div></td>
                    <td className="py-4 px-4"><div className="h-8 w-16 bg-secondary animate-pulse rounded"></div></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    لا توجد منتجات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 bg-secondary rounded-lg border border-border object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-secondary rounded-lg border border-border"></div>
                        )}
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{product.price} ر.س</td>
                    <td className="py-4 px-4 text-muted-foreground">{product.quantity}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusMap[product.status]?.class}`}>
                        {statusMap[product.status]?.label ?? product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link href={`/merchant/products/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                هذا الإجراء سيقوم بحذف المنتج نهائياً. لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
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
