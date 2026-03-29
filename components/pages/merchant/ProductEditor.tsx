"use client";
import {
  ArrowRight,
  Upload,
  Plus,
  X,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Tag,
} from "lucide-react";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetProductOffersQuery,
  useCreateOfferMutation,
  useDeleteOfferMutation,
} from "@/lib/services/productsApi";
import { useGetCategoriesQuery } from "@/lib/services/categoriesApi";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductEditor() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  /** Lightweight color resolver used to pre-fill the color picker when a merchant types a known color name */
  const EDITOR_COLOR_MAP: Record<string, string> = {
    أحمر: "#ef4444",
    red: "#ef4444",
    crimson: "#dc143c",
    وردي: "#ec4899",
    pink: "#ec4899",
    rose: "#f43f5e",
    برتقالي: "#f97316",
    orange: "#f97316",
    أصفر: "#eab308",
    yellow: "#eab308",
    أخضر: "#22c55e",
    green: "#22c55e",
    teal: "#14b8a6",
    زيتوني: "#65a30d",
    olive: "#65a30d",
    أزرق: "#3b82f6",
    blue: "#3b82f6",
    سماوي: "#06b6d4",
    cyan: "#06b6d4",
    كحلي: "#1e40af",
    navy: "#1e40af",
    بنفسجي: "#a855f7",
    purple: "#a855f7",
    أبيض: "#ffffff",
    white: "#ffffff",
    أسود: "#000000",
    black: "#000000",
    رمادي: "#6b7280",
    gray: "#6b7280",
    grey: "#6b7280",
    فضي: "#9ca3af",
    silver: "#9ca3af",
    بني: "#92400e",
    brown: "#92400e",
    ذهبي: "#ca8a04",
    gold: "#ca8a04",
    بيج: "#d4b08c",
    beige: "#d4b08c",
  };
  const resolveColorInEditor = (v: string): string | null => {
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v;
    return EDITOR_COLOR_MAP[v.toLowerCase().trim()] ?? null;
  };

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: existingProduct, isLoading: isProductLoading } =
    useGetProductByIdQuery(productId, { skip: !productId });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: storeInfo } = useGetMyStoreQuery();

  const isCharityTheme = storeInfo?.store?.activityType === "CHARITY";

  const isLoading = isCreating || isUpdating;

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

  // Donation state (only shown when store activityType is CHARITY)
  const [donationEnabled, setDonationEnabled] = useState(false);
  const [donationForm, setDonationForm] = useState({
    targetAmount: 0,
    currentAmount: 0,
    allowCustomAmount: true,
  });
  const [donationPresets, setDonationPresets] = useState<
    { label: string; amount: number }[]
  >([
    { label: "سهم الخير", amount: 50 },
    { label: "سهم البركة", amount: 100 },
    { label: "سهم الإحسان", amount: 200 },
    { label: "سهم العطاء", amount: 500 },
  ]);
  const [progressMessages, setProgressMessages] = useState<
    { percent: string; message: string }[]
  >([
    { percent: "0", message: "كن أول مبادر" },
    { percent: "25", message: "بداية رائعة!" },
    { percent: "50", message: "نصف الطريق" },
    { percent: "75", message: "اقتربنا من الهدف" },
    { percent: "100", message: "تم تحقيق الهدف! شكراً لكم" },
  ]);

  // Variants State
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState<any[]>([
    { name: "", type: "DROPDOWN", values: [] },
  ]);
  const [variants, setVariants] = useState<any[]>([]);
  const [isVariantsOpen, setIsVariantsOpen] = useState(true);

  // Generate variants whenever options or their values change
  useEffect(() => {
    if (!hasVariants) return;

    const validOptions = options.filter(
      (opt) => opt.name && opt.values.length > 0,
    );
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    // Cartesian product helper
    const cartesian = (...a: any[]) =>
      a.reduce((a, b) =>
        a.flatMap((d: any) => b.map((e: any) => [d, e].flat())),
      );

    const optionValues = validOptions.map((opt) =>
      opt.values.map((v: any) => (typeof v === "string" ? v : v.value)),
    );
    const combinations =
      optionValues.length === 1
        ? optionValues[0].map((v: any) => [v])
        : cartesian(...optionValues);

    const newVariants = combinations.map((combo: any[]) => {
      const existing = variants.find(
        (v) => JSON.stringify(v.optionValues) === JSON.stringify(combo),
      );
      return (
        existing || {
          optionValues: combo,
          price: form.price,
          sku: `${form.sku}-${combo.join("-")}`,
          quantity: 0,
          isActive: true,
        }
      );
    });

    setVariants(newVariants);
  }, [options, hasVariants]);

  // Pre-fill form when editing
  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name,
        description: existingProduct.description || "",
        price: existingProduct.price,
        comparePrice: existingProduct.comparePrice || 0,
        cost: existingProduct.cost || 0,
        sku: existingProduct.sku || "",
        barcode: existingProduct.barcode || "",
        quantity: existingProduct.quantity,
        trackStock: existingProduct.trackStock,
        weight: existingProduct.weight || 0,
        isPhysical: existingProduct.isPhysical,
        category: existingProduct.category || "",
        tags: existingProduct.tags.join(", "),
        seoTitle: existingProduct.seoTitle || "",
        seoDesc: existingProduct.seoDesc || "",
      });
      setImages(existingProduct.images);

      // Pre-fill donation metadata if present
      if (existingProduct.donationMetadata) {
        const dm = existingProduct.donationMetadata as any;
        setDonationEnabled(dm.isDonation ?? false);
        setDonationForm({
          targetAmount: dm.targetAmount ?? 0,
          currentAmount: dm.currentAmount ?? 0,
          allowCustomAmount: dm.allowCustomAmount ?? true,
        });
        if (
          Array.isArray(dm.donationOptions) &&
          dm.donationOptions.length > 0
        ) {
          const labels = dm.donationLabels ?? {};
          setDonationPresets(
            dm.donationOptions.map((amt: number, i: number) => ({
              label: labels[String(i)] ?? "",
              amount: amt,
            })),
          );
        }
        if (dm.progressMessages && typeof dm.progressMessages === "object") {
          setProgressMessages(
            Object.entries(dm.progressMessages).map(([k, v]) => ({
              percent: k,
              message: v as string,
            })),
          );
        }
      }

      if (existingProduct.options && existingProduct.options.length > 0) {
        setHasVariants(true);
        setOptions(
          existingProduct.options.map((opt: any) => ({
            name: opt.name,
            type: opt.type,
            values: opt.values.map((v: any) => ({
              value: v.value,
              colorCode: v.colorCode ?? "",
            })),
          })),
        );

        setVariants(
          (existingProduct.variants ?? []).map((v: any) => ({
            optionValues: v.optionValues.map((ov: any) => ov.optionValue.value),
            price: v.price,
            sku: v.sku,
            quantity: v.quantity,
            isActive: v.isActive,
          })),
        );
      }
    }
  }, [existingProduct]);

  const handleSave = async (status: "ACTIVE" | "DRAFT") => {
    try {
      const slug =
        form.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\p{L}\p{N}_-]/gu, "") || `product-${Date.now()}`;

      const payload: any = {
        ...form,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        quantity: Number(form.quantity),
        weight: form.weight ? Number(form.weight) : undefined,
        slug,
        status,
        images,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (!isCharityTheme && hasVariants) {
        payload.options = options.filter(
          (opt) => opt.name && opt.values.length > 0,
        );
        payload.variants = variants;
      }

      // Charity defaults: no shipping, unlimited stock
      if (isCharityTheme) {
        payload.isPhysical = false;
        payload.weight = 0;
        payload.trackStock = false;
        payload.quantity = 99999;
      }

      if (isCharityTheme && donationEnabled) {
        const messagesObj: Record<string, string> = {};
        for (const pm of progressMessages) {
          if (pm.percent && pm.message) {
            messagesObj[pm.percent] = pm.message;
          }
        }
        const labelsObj: Record<string, string> = {};
        donationPresets.forEach((p, i) => {
          if (p.label) labelsObj[String(i)] = p.label;
        });
        payload.donationMetadata = {
          isDonation: true,
          targetAmount: Number(donationForm.targetAmount),
          currentAmount: Number(donationForm.currentAmount),
          donationOptions: donationPresets
            .map((p) => Number(p.amount))
            .filter((n) => !isNaN(n) && n > 0),
          donationLabels: labelsObj,
          allowCustomAmount: donationForm.allowCustomAmount,
          progressMessages: messagesObj,
        };
      } else if (isCharityTheme && !donationEnabled) {
        payload.donationMetadata = null;
      }

      if (productId) {
        await updateProduct({ id: productId, data: payload }).unwrap();
        toast.success("تم تحديث المنتج بنجاح");
        router.push("/merchant/products");
      } else {
        const created = await createProduct(payload).unwrap();
        toast.success("تم إنشاء المنتج بنجاح");
        // Redirect to edit page so merchant can add offers
        router.push(`/merchant/products/${(created as any).id}`);
      }
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("حدث خطأ أثناء حفظ المنتج");
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/merchant/products">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {productId ? "تعديل منتج" : "منتج جديد"}
            </h1>
            <p className="text-muted-foreground">
              {productId
                ? "تعديل بيانات المنتج الموجود"
                : "أضف منتج جديد إلى متجرك"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => handleSave("DRAFT")}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ كمسودة"}
          </Button>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isLoading}
            onClick={() => handleSave("ACTIVE")}
          >
            {isLoading
              ? "جاري النشر..."
              : productId
                ? "تحديث المنتج"
                : "نشر المنتج"}
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
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
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
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-secondary rounded-lg border border-border flex items-center justify-center group"
                >
                  <img
                    src={img}
                    alt="Product"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
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

          {/* Variants Card — hidden in Charity mode */}
          {!isCharityTheme && (
            <Card className="overflow-hidden">
              <div
                className="p-6 flex items-center justify-between border-b cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsVariantsOpen(!isVariantsOpen)}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    id="variants-toggle"
                    checked={hasVariants}
                    onCheckedChange={setHasVariants}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <h3 className="text-lg font-bold">المتغيرات</h3>
                </div>
                <Button variant="ghost" size="icon">
                  {isVariantsOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {hasVariants && isVariantsOpen && (
                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Options List */}
                  <div className="space-y-6">
                    {options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="p-4 bg-muted/30 rounded-lg border border-dashed relative group"
                      >
                        <button
                          onClick={() =>
                            setOptions(options.filter((_, i) => i !== optIdx))
                          }
                          className="absolute -top-2 -left-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <Label>اسم الخيار</Label>
                            <Input
                              placeholder="مثال: الحجم، اللون..."
                              value={opt.name}
                              onChange={(e) => {
                                const newOpts = [...options];
                                newOpts[optIdx].name = e.target.value;
                                setOptions(newOpts);
                              }}
                            />
                          </div>
                          <div>
                            <Label>النوع</Label>
                            <select
                              className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                              value={opt.type}
                              onChange={(e) => {
                                const newOpts = [...options];
                                newOpts[optIdx].type = e.target.value;
                                setOptions(newOpts);
                              }}
                            >
                              <option value="DROPDOWN">قائمة منسدلة</option>
                              <option value="BUTTONS">أزرار نصية</option>
                              <option value="COLORS">
                                أزرار قائمة على اللون
                              </option>
                              <option value="RADIO">أزرار الراديو</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label>القيم</Label>
                          <div className="flex flex-wrap gap-2 p-2 min-h-[42px] border rounded-md bg-background focus-within:ring-2 ring-accent/30 transition-all">
                            {opt.values.map((val: any, valIdx: number) => (
                              <span
                                key={valIdx}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent/10 border border-accent/20 rounded text-sm"
                              >
                                {/* Color swatch + native color picker for COLORS type */}
                                {opt.type === "COLORS" && (
                                  <label
                                    className="cursor-pointer shrink-0"
                                    title="اضغط لاختيار اللون"
                                  >
                                    <input
                                      type="color"
                                      className="sr-only"
                                      value={
                                        val.colorCode && val.colorCode !== ""
                                          ? val.colorCode
                                          : "#888888"
                                      }
                                      onChange={(e) => {
                                        const newOpts = [...options];
                                        newOpts[optIdx].values[valIdx] = {
                                          ...newOpts[optIdx].values[valIdx],
                                          colorCode: e.target.value,
                                        };
                                        setOptions(newOpts);
                                      }}
                                    />
                                    <span
                                      className="w-4 h-4 rounded-full border border-border shadow-sm block hover:scale-110 transition-transform"
                                      style={{
                                        backgroundColor:
                                          val.colorCode && val.colorCode !== ""
                                            ? val.colorCode
                                            : "#888888",
                                      }}
                                    />
                                  </label>
                                )}
                                {typeof val === "string" ? val : val.value}
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                                  onClick={() => {
                                    const newOpts = [...options];
                                    newOpts[optIdx].values = newOpts[
                                      optIdx
                                    ].values.filter(
                                      (_: any, i: number) => i !== valIdx,
                                    );
                                    setOptions(newOpts);
                                  }}
                                />
                              </span>
                            ))}
                            <input
                              className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px]"
                              placeholder="اكتب القيمة ثم اضغط Enter..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const raw = e.currentTarget.value.trim();
                                  const alreadyExists = opt.values.some(
                                    (v: any) =>
                                      (typeof v === "string" ? v : v.value) ===
                                      raw,
                                  );
                                  if (raw && !alreadyExists) {
                                    const newOpts = [...options];
                                    const autoColor = resolveColorInEditor(raw);
                                    newOpts[optIdx].values = [
                                      ...opt.values,
                                      {
                                        value: raw,
                                        colorCode:
                                          opt.type === "COLORS"
                                            ? (autoColor ?? "#888888")
                                            : "",
                                      },
                                    ];
                                    setOptions(newOpts);
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() =>
                        setOptions([
                          ...options,
                          { name: "", type: "DROPDOWN", values: [] },
                        ])
                      }
                      disabled={options.length >= 3}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      أضف خيارًا آخر
                    </Button>
                  </div>

                  {/* Variants List */}
                  {variants.length > 0 && (
                    <div className="pt-6 border-t">
                      <h4 className="font-bold mb-4">
                        قائمة المتغيرات ({variants.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="text-right text-sm text-muted-foreground border-b">
                              <th className="pb-2 font-medium">المتغير</th>
                              <th className="pb-2 font-medium w-32">السعر</th>
                              <th className="pb-2 font-medium w-24">الكمية</th>
                              <th className="pb-2 font-medium w-40">SKU</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {variants.map((variant, idx) => (
                              <tr key={idx} className="group">
                                <td className="py-3 pr-2">
                                  <span className="font-medium">
                                    {variant.optionValues.join(" / ")}
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <Input
                                    type="number"
                                    className="h-8"
                                    value={variant.price}
                                    onChange={(e) => {
                                      const newVars = [...variants];
                                      newVars[idx].price = Number(
                                        e.target.value,
                                      );
                                      setVariants(newVars);
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-2">
                                  <Input
                                    type="number"
                                    className="h-8"
                                    value={variant.quantity}
                                    onChange={(e) => {
                                      const newVars = [...variants];
                                      newVars[idx].quantity = Number(
                                        e.target.value,
                                      );
                                      setVariants(newVars);
                                    }}
                                  />
                                </td>
                                <td className="py-3 pl-2">
                                  <Input
                                    className="h-8"
                                    value={variant.sku}
                                    onChange={(e) => {
                                      const newVars = [...variants];
                                      newVars[idx].sku = e.target.value;
                                      setVariants(newVars);
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

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
                  onChange={(e) =>
                    setForm({ ...form, seoTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="seo-description">وصف SEO</Label>
                <Textarea
                  id="seo-description"
                  rows={3}
                  placeholder="وصف محسّن لمحركات البحث..."
                  value={form.seoDesc}
                  onChange={(e) =>
                    setForm({ ...form, seoDesc: e.target.value })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Offers Section — hidden in Charity mode */}
          {productId && !isCharityTheme && (
            <OffersSection productId={productId} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">
              {isCharityTheme ? "مبلغ التبرع" : "السعر"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">
                  {isCharityTheme ? "مبلغ التبرع الافتراضي" : "السعر"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </div>
              {!isCharityTheme && (
                <>
                  <div>
                    <Label htmlFor="compare-price">السعر قبل الخصم</Label>
                    <Input
                      id="compare-price"
                      type="number"
                      placeholder="0.00"
                      value={form.comparePrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          comparePrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">التكلفة</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="0.00"
                      value={form.cost}
                      onChange={(e) =>
                        setForm({ ...form, cost: Number(e.target.value) })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Inventory — hidden in Charity mode */}
          {!isCharityTheme && (
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
                    onChange={(e) =>
                      setForm({ ...form, barcode: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="track"
                    className="rounded"
                    checked={form.trackStock}
                    onChange={(e) =>
                      setForm({ ...form, trackStock: e.target.checked })
                    }
                  />
                  <Label htmlFor="track" className="cursor-pointer">
                    تتبع المخزون
                  </Label>
                </div>
              </div>
            </Card>
          )}

          {/* Shipping — hidden in Charity mode */}
          {!isCharityTheme && (
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
                    onChange={(e) =>
                      setForm({ ...form, weight: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="physical"
                    className="rounded"
                    checked={form.isPhysical}
                    onChange={(e) =>
                      setForm({ ...form, isPhysical: e.target.checked })
                    }
                  />
                  <Label htmlFor="physical" className="cursor-pointer">
                    منتج مادي
                  </Label>
                </div>
              </div>
            </Card>
          )}

          {/* Organization */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">التصنيف</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">الفئة</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">اختر فئة</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
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

          {/* Donation Settings — only for charity stores */}
          {isCharityTheme && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">إعدادات التبرع</h3>
                <Switch
                  checked={donationEnabled}
                  onCheckedChange={setDonationEnabled}
                />
              </div>
              {donationEnabled && (
                <div className="space-y-5">
                  {/* Target & current amounts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>المبلغ المستهدف (ر.س)</Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="10000"
                        value={donationForm.targetAmount || ""}
                        onChange={(e) =>
                          setDonationForm({
                            ...donationForm,
                            targetAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>المبلغ الحالي (ر.س)</Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={donationForm.currentAmount || ""}
                        onChange={(e) =>
                          setDonationForm({
                            ...donationForm,
                            currentAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Allow custom amount */}
                  <div className="flex items-center justify-between">
                    <Label>السماح بمبلغ مخصص</Label>
                    <Switch
                      checked={donationForm.allowCustomAmount}
                      onCheckedChange={(checked) =>
                        setDonationForm({
                          ...donationForm,
                          allowCustomAmount: checked,
                        })
                      }
                    />
                  </div>

                  {/* Dynamic preset amounts */}
                  <div>
                    <Label className="mb-2 block">مبالغ التبرع المحددة</Label>
                    <div className="space-y-2">
                      {donationPresets.map((preset, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            placeholder="التسمية (مثال: سهم الخير)"
                            value={preset.label}
                            onChange={(e) => {
                              const next = [...donationPresets];
                              next[idx] = {
                                ...next[idx],
                                label: e.target.value,
                              };
                              setDonationPresets(next);
                            }}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            min={1}
                            placeholder="المبلغ"
                            value={preset.amount || ""}
                            onChange={(e) => {
                              const next = [...donationPresets];
                              next[idx] = {
                                ...next[idx],
                                amount: Number(e.target.value),
                              };
                              setDonationPresets(next);
                            }}
                            className="w-28"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setDonationPresets(
                                donationPresets.filter((_, i) => i !== idx),
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setDonationPresets([
                            ...donationPresets,
                            { label: "", amount: 0 },
                          ])
                        }
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة مبلغ
                      </Button>
                    </div>
                  </div>

                  {/* Progress messages */}
                  <div>
                    <Label className="mb-2 block">رسائل التقدم</Label>
                    <div className="space-y-2">
                      {progressMessages.map((pm, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-10 shrink-0 text-center">
                            %{pm.percent}
                          </span>
                          <Input
                            placeholder="الرسالة"
                            value={pm.message}
                            onChange={(e) => {
                              const next = [...progressMessages];
                              next[idx] = {
                                ...next[idx],
                                message: e.target.value,
                              };
                              setProgressMessages(next);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Offers Management Sub-component ── */
function OffersSection({ productId }: { productId: string }) {
  const { data: offers = [], isLoading } = useGetProductOffersQuery(productId);
  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const [showForm, setShowForm] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    quantity: 1,
    price: 0,
    badge: "",
    sortOrder: 0,
    isActive: true,
  });

  const handleCreate = async () => {
    try {
      await createOffer({
        productId,
        data: {
          ...offerForm,
          quantity: Number(offerForm.quantity),
          price: Number(offerForm.price),
          sortOrder: Number(offerForm.sortOrder),
        },
      }).unwrap();
      toast.success("تم إنشاء العرض بنجاح");
      setShowForm(false);
      setOfferForm({
        title: "",
        description: "",
        quantity: 1,
        price: 0,
        badge: "",
        sortOrder: 0,
        isActive: true,
      });
    } catch {
      toast.error("حدث خطأ أثناء إنشاء العرض");
    }
  };

  const handleDelete = async (offerId: string) => {
    try {
      await deleteOffer({ productId, offerId }).unwrap();
      toast.success("تم حذف العرض");
    } catch {
      toast.error("حدث خطأ أثناء حذف العرض");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Tag className="w-5 h-5" />
          عروض التوفير
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة عرض جديد
        </Button>
      </div>

      {showForm && (
        <div className="p-4 mb-4 border border-dashed rounded-lg space-y-3 bg-muted/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>عنوان العرض</Label>
              <Input
                placeholder="اشترِ 2 + 1 مجاناً"
                value={offerForm.title}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>الوصف (اختياري)</Label>
              <Input
                placeholder="وفر 30 ر.س اليوم"
                value={offerForm.description}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label>الكمية</Label>
              <Input
                type="number"
                min={1}
                value={offerForm.quantity}
                onChange={(e) =>
                  setOfferForm({
                    ...offerForm,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>السعر</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={offerForm.price}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, price: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>الشارة (اختياري)</Label>
              <Input
                placeholder="الأكثر مبيعاً"
                value={offerForm.badge}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, badge: e.target.value })
                }
              />
            </div>
            <div>
              <Label>الترتيب</Label>
              <Input
                type="number"
                min={0}
                value={offerForm.sortOrder}
                onChange={(e) =>
                  setOfferForm({
                    ...offerForm,
                    sortOrder: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Switch
                id="offer-active"
                checked={offerForm.isActive}
                onCheckedChange={(v) =>
                  setOfferForm({ ...offerForm, isActive: v })
                }
              />
              <Label htmlFor="offer-active">مفعّل</Label>
            </div>
            <div className="flex gap-2 mr-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                إلغاء
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isCreating || !offerForm.title}
                onClick={handleCreate}
              >
                {isCreating ? "جاري الحفظ..." : "حفظ العرض"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-6">
          لا توجد عروض لهذا المنتج بعد
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-right text-muted-foreground border-b">
                <th className="pb-2 font-medium">العنوان</th>
                <th className="pb-2 font-medium w-20">الكمية</th>
                <th className="pb-2 font-medium w-24">السعر</th>
                <th className="pb-2 font-medium w-24">الشارة</th>
                <th className="pb-2 font-medium w-16">الحالة</th>
                <th className="pb-2 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {offers.map((offer: any) => (
                <tr key={offer.id} className="group">
                  <td className="py-3 pr-2">
                    <div className="font-medium">{offer.title}</div>
                    {offer.description && (
                      <div className="text-xs text-muted-foreground">
                        {offer.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2">{offer.quantity}</td>
                  <td className="py-3 px-2">{Number(offer.price)} ر.س</td>
                  <td className="py-3 px-2">{offer.badge || "—"}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${offer.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {offer.isActive ? "مفعّل" : "معطّل"}
                    </span>
                  </td>
                  <td className="py-3 pl-2">
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
