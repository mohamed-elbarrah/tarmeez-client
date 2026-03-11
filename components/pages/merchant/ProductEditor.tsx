import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Upload, Plus, X, Sparkles } from "lucide-react";
import { useCreateProductMutation } from "@/lib/services/productsApi";

export default function ProductEditor() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    comparePrice: 0,
    cost: 0,
    sku: "",
    barcode: "",
    quantity: 0,
    trackStock: true,
    weight: 0,
    isPhysical: true,
    category: "",
    tags: "",
    seoTitle: "",
    seoDesc: "",
  });

  const [images, setImages] = useState<string[]>([]);

  const handleCreate = async (status: "ACTIVE" | "DRAFT") => {
    try {
      const slug = form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      await createProduct({
        ...form,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        quantity: Number(form.quantity),
        weight: form.weight ? Number(form.weight) : undefined,
        slug,
        status,
        images,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      } as any).unwrap();

      router.push("/merchant/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      // In a real app, show a toast here
    }
  };

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
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => handleCreate("DRAFT")}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ كمسودة"}
          </Button>
          <Button
            className="bg-accent text-black hover:bg-accent/90"
            disabled={isLoading}
            onClick={() => handleCreate("ACTIVE")}
          >
            {isLoading ? "جاري النشر..." : "نشر المنتج"}
          </Button>
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
                <Input
                  id="title"
                  placeholder="مثال: ساعة ذكية برو"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="وصف تفصيلي للمنتج..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">صور المنتج</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = prompt("أدخل رابط الصورة:");
                  if (url) setImages([...images, url]);
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة رابط صورة
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-secondary rounded-lg border border-border flex items-center justify-center group">
                  <img src={img} alt="Product" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <div
                className="aspect-square bg-secondary rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center cursor-pointer text-muted-foreground"
                onClick={() => {
                  const url = prompt("أدخل رابط الصورة:");
                  if (url) setImages([...images, url]);
                }}
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-xs">رابط صورة</span>
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">محركات البحث (SEO)</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seo-title">عنوان SEO</Label>
                <Input
                  id="seo-title"
                  placeholder="عنوان محسّن لمحركات البحث"
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="seo-description">وصف SEO</Label>
                <Textarea
                  id="seo-description"
                  rows={3}
                  placeholder="وصف محسّن لمحركات البحث..."
                  value={form.seoDesc}
                  onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
                />
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
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="compare-price">السعر قبل الخصم</Label>
                <Input
                  id="compare-price"
                  type="number"
                  placeholder="0.00"
                  value={form.comparePrice}
                  onChange={(e) => setForm({ ...form, comparePrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="cost">التكلفة</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                />
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">المخزون</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sku">رمز المنتج (SKU)</Label>
                <Input
                  id="sku"
                  placeholder="ABC-123"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="barcode">الباركود</Label>
                <Input
                  id="barcode"
                  placeholder="1234567890"
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="track"
                  className="rounded"
                  checked={form.trackStock}
                  onChange={(e) => setForm({ ...form, trackStock: e.target.checked })}
                />
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
                <Input
                  id="weight"
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="physical"
                  className="rounded"
                  checked={form.isPhysical}
                  onChange={(e) => setForm({ ...form, isPhysical: e.target.checked })}
                />
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
                <select
                  id="category"
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">اختر فئة</option>
                  <option value="electronics">إلكترونيات</option>
                  <option value="clothing">ملابس</option>
                  <option value="accessories">إكسسوارات</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
                <Input
                  id="tags"
                  placeholder="مثال: ساعة, ذكية, بلوتوث"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
