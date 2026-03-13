'use client'
import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  Category,
} from "@/lib/services/categoriesApi";
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
import { toast } from "sonner";

export default function Categories() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", image: "", sortOrder: 0 });

  const resetForm = () => {
    setForm({ name: "", slug: "", image: "", sortOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}_-]/gu, "")
      || `category-${Date.now()}`;
  };

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: generateSlug(name) });
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, image: cat.image || "", sortOrder: cat.sortOrder });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("اسم الفئة مطلوب");
      return;
    }

    try {
      if (editingId) {
        await updateCategory({ id: editingId, data: form }).unwrap();
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        await createCategory({ ...form, slug: form.slug || generateSlug(form.name) }).unwrap();
        toast.success("تم إنشاء الفئة بنجاح");
      }
      resetForm();
    } catch {
      toast.error("حدث خطأ أثناء حفظ الفئة");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("تم حذف الفئة");
    } catch {
      toast.error("حدث خطأ أثناء حذف الفئة");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">الفئات</h1>
          <p className="text-muted-foreground">إدارة فئات المنتجات في متجرك</p>
        </div>
        <Button
          className="bg-accent text-black hover:bg-accent/90"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          <Plus className="w-4 h-4 ml-2" />
          فئة جديدة
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{editingId ? "تعديل الفئة" : "فئة جديدة"}</h3>
            <button onClick={resetForm}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>اسم الفئة</Label>
              <Input
                placeholder="مثال: إلكترونيات"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div>
              <Label>الرابط (slug)</Label>
              <Input
                placeholder="electronics"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                dir="ltr"
              />
            </div>
            <div>
              <Label>رابط الصورة (اختياري)</Label>
              <Input
                placeholder="https://example.com/image.png"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                dir="ltr"
              />
            </div>
            <div>
              <Label>الترتيب</Label>
              <Input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" onClick={resetForm}>إلغاء</Button>
            <Button
              className="bg-accent text-black hover:bg-accent/90"
              disabled={isCreating || isUpdating || !form.name.trim()}
              onClick={handleSave}
            >
              {(isCreating || isUpdating) ? "جاري الحفظ..." : editingId ? "تحديث" : "إنشاء"}
            </Button>
          </div>
        </Card>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">لا توجد فئات بعد</p>
          <Button
            variant="outline"
            onClick={() => { resetForm(); setShowForm(true); }}
          >
            <Plus className="w-4 h-4 ml-2" />
            أضف أول فئة
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-right text-sm text-muted-foreground border-b bg-muted/30">
                <th className="p-4 font-medium w-10">#</th>
                <th className="p-4 font-medium">الصورة</th>
                <th className="p-4 font-medium">الاسم</th>
                <th className="p-4 font-medium">الرابط</th>
                <th className="p-4 font-medium">المنتجات</th>
                <th className="p-4 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-muted-foreground">
                    <GripVertical className="w-4 h-4 inline-block ml-1" />
                    {idx + 1}
                  </td>
                  <td className="p-4">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-lg border flex items-center justify-center text-muted-foreground text-xs">—</div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-muted-foreground text-sm" dir="ltr">{cat.slug}</td>
                  <td className="p-4">
                    <span className="bg-accent/10 text-sm font-bold px-2 py-1 rounded-full">
                      {cat._count?.products ?? 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الفئة</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف فئة "{cat.name}"؟ سيتم إلغاء ربط المنتجات المرتبطة بها.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(cat.id)}
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
