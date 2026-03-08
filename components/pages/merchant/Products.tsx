import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react";

const products = [
  { id: 1, name: "ساعة ذكية برو", price: "299 ر.س", stock: 45, status: "متوفر", sales: 234 },
  { id: 2, name: "سماعات لاسلكية", price: "150 ر.س", stock: 28, status: "متوفر", sales: 189 },
  { id: 3, name: "حقيبة جلدية", price: "199 ر.س", stock: 0, status: "نفذ", sales: 156 },
  { id: 4, name: "محفظة رجالية", price: "89 ر.س", stock: 67, status: "متوفر", sales: 142 },
  { id: 5, name: "نظارة شمسية", price: "120 ر.س", stock: 12, status: "قليل", sales: 128 },
  { id: 6, name: "قميص كاجوال", price: "79 ر.س", stock: 89, status: "متوفر", sales: 98 },
  { id: 7, name: "حذاء رياضي", price: "249 ر.س", stock: 34, status: "متوفر", sales: 87 },
  { id: 8, name: "ربطة عنق حريرية", price: "59 ر.س", stock: 156, status: "متوفر", sales: 76 },
];

export default function Products() {
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
          { label: "إجمالي المنتجات", value: "234" },
          { label: "متوفر", value: "198" },
          { label: "نفذ من المخزون", value: "12" },
          { label: "مسودات", value: "24" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="بحث عن منتج..." className="pr-10" />
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
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المبيعات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg border border-border"></div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{product.price}</td>
                  <td className="py-4 px-4 text-muted-foreground">{product.stock}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "متوفر" ? "bg-accent/10 text-black" :
                      product.status === "قليل" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{product.sales}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Link href={`/merchant/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
