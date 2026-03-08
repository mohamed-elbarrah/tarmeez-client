import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Upload, Plus, X, Sparkles } from "lucide-react";

export default function ProductEditor() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/merchant/products">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">منتج جديد</h1>
            <p className="text-muted-foreground">أضف منتج جديد إلى متجرك</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">حفظ كمسودة</Button>
          <Button className="bg-accent text-black hover:bg-accent/90">نشر المنتج</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">معلومات المنتج</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">اسم المنتج</Label>
                <Input id="title" placeholder="مثال: ساعة ذكية برو" />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea id="description" rows={6} placeholder="وصف تفصيلي للمنتج..." />
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 ml-2" />
                    إنشاء وصف بالذكاء الاصطناعي
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">صور المنتج</h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square bg-secondary rounded-lg border-2 border-dashed border-border flex items-center justify-center group">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <button className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <button className="aspect-square bg-secondary rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </button>
            </div>
          </Card>

          {/* Variants */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">المتغيرات</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 ml-2" />
                إضافة متغير
              </Button>
            </div>
            <div className="space-y-4">
              {[
                { option: "اللون", values: ["أسود", "أبيض", "رمادي"] },
                { option: "المقاس", values: ["صغير", "وسط", "كبير"] },
              ].map((variant, i) => (
                <div key={i} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{variant.option}</span>
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.values.map((value, j) => (
                      <span key={j} className="px-3 py-1 bg-white rounded-full text-sm border border-border">
                        {value}
                      </span>
                    ))}
                    <button className="px-3 py-1 bg-white rounded-full text-sm border border-dashed border-border hover:border-accent transition-colors">
                      + إضافة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SEO */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">محركات البحث (SEO)</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seo-title">عنوان SEO</Label>
                <Input id="seo-title" placeholder="عنوان محسّن لمحركات البحث" />
              </div>
              <div>
                <Label htmlFor="seo-description">وصف SEO</Label>
                <Textarea id="seo-description" rows={3} placeholder="وصف محسّن لمحركات البحث..." />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">السعر</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">السعر</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="compare-price">السعر قبل الخصم</Label>
                <Input id="compare-price" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="cost">التكلفة</Label>
                <Input id="cost" type="number" placeholder="0.00" />
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">المخزون</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sku">رمز المنتج (SKU)</Label>
                <Input id="sku" placeholder="ABC-123" />
              </div>
              <div>
                <Label htmlFor="barcode">الباركود</Label>
                <Input id="barcode" placeholder="1234567890" />
              </div>
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="track" className="rounded" />
                <Label htmlFor="track" className="cursor-pointer">تتبع المخزون</Label>
              </div>
            </div>
          </Card>

          {/* Shipping */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">الشحن</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">الوزن (كجم)</Label>
                <Input id="weight" type="number" placeholder="0.0" step="0.1" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="physical" className="rounded" defaultChecked />
                <Label htmlFor="physical" className="cursor-pointer">منتج مادي</Label>
              </div>
            </div>
          </Card>

          {/* Organization */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">التصنيف</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">الفئة</Label>
                <select id="category" className="w-full px-3 py-2 bg-white border border-border rounded-lg">
                  <option>اختر فئة</option>
                  <option>إلكترونيات</option>
                  <option>ملابس</option>
                  <option>إكسسوارات</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tags">الوسوم</Label>
                <Input id="tags" placeholder="أدخل الوسوم..." />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
