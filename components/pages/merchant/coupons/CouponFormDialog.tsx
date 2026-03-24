"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw, ChevronLeft, ChevronRight, Check,
  Percent, DollarSign, Truck, Gift, Tag,
} from "lucide-react";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useGenerateCodeMutation,
  type Coupon,
} from "@/lib/services/couponsApi";
import { toast } from "sonner";

const TYPE_OPTIONS = [
  { value: "PERCENTAGE", label: "خصم نسبة مئوية", icon: Percent },
  { value: "FIXED_AMOUNT", label: "خصم مبلغ ثابت", icon: DollarSign },
  { value: "FREE_SHIPPING", label: "شحن مجاني", icon: Truck },
  { value: "FREE_PRODUCT", label: "منتج مجاني", icon: Gift },
  { value: "PRODUCT_DISCOUNT", label: "خصم على منتجات محددة", icon: Tag },
] as const;

const STEP_LABELS = ["المعلومات الأساسية", "إعدادات الخصم", "القيود", "مراجعة وإنشاء"];

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCoupon?: Coupon | null;
}

const defaultForm = {
  name: "",
  code: "",
  description: "",
  type: "PERCENTAGE" as Coupon["type"],
  discountValue: 10,
  maxDiscountAmount: undefined as number | undefined,
  freeProductId: "",
  freeProductQty: 1,
  applicableProductIds: [] as string[],
  applicableCategoryIds: [] as string[],
  minOrderAmount: undefined as number | undefined,
  maxUsageCount: undefined as number | undefined,
  perCustomerLimit: 1,
  customerIds: [] as string[],
  startsAt: "",
  expiresAt: "",
};

export default function CouponFormDialog({
  open,
  onOpenChange,
  editingCoupon,
}: CouponFormDialogProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [generateCode, { isLoading: isGenerating }] = useGenerateCodeMutation();

  useEffect(() => {
    if (editingCoupon) {
      setForm({
        name: editingCoupon.name,
        code: editingCoupon.code,
        description: editingCoupon.description || "",
        type: editingCoupon.type,
        discountValue: editingCoupon.discountValue ?? 10,
        maxDiscountAmount: editingCoupon.maxDiscountAmount,
        freeProductId: editingCoupon.freeProductId || "",
        freeProductQty: editingCoupon.freeProductQty ?? 1,
        applicableProductIds: editingCoupon.applicableProductIds || [],
        applicableCategoryIds: editingCoupon.applicableCategoryIds || [],
        minOrderAmount: editingCoupon.minOrderAmount,
        maxUsageCount: editingCoupon.maxUsageCount,
        perCustomerLimit: editingCoupon.perCustomerLimit ?? 1,
        customerIds: editingCoupon.customerIds || [],
        startsAt: editingCoupon.startsAt
          ? new Date(editingCoupon.startsAt).toISOString().slice(0, 16)
          : "",
        expiresAt: editingCoupon.expiresAt
          ? new Date(editingCoupon.expiresAt).toISOString().slice(0, 16)
          : "",
      });
      setStep(0);
    } else {
      setForm(defaultForm);
      setStep(0);
    }
  }, [editingCoupon, open]);

  const handleGenerateCode = async () => {
    try {
      const result = await generateCode({}).unwrap();
      setForm({ ...form, code: result.code });
    } catch {
      toast.error("حدث خطأ أثناء توليد الكود");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload: any = { ...form };
      if (payload.startsAt) payload.startsAt = new Date(payload.startsAt).toISOString();
      else delete payload.startsAt;
      if (payload.expiresAt) payload.expiresAt = new Date(payload.expiresAt).toISOString();
      else delete payload.expiresAt;
      if (!payload.maxDiscountAmount) delete payload.maxDiscountAmount;
      if (!payload.minOrderAmount) delete payload.minOrderAmount;
      if (!payload.maxUsageCount) delete payload.maxUsageCount;
      if (!payload.freeProductId) delete payload.freeProductId;
      if (!payload.description) delete payload.description;
      if (payload.applicableProductIds?.length === 0) delete payload.applicableProductIds;
      if (payload.applicableCategoryIds?.length === 0) delete payload.applicableCategoryIds;
      if (payload.customerIds?.length === 0) delete payload.customerIds;

      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon.id, data: payload }).unwrap();
        toast.success("تم تحديث الكوبون بنجاح");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("تم إنشاء الكوبون بنجاح");
      }
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.data?.message || "حدث خطأ أثناء حفظ الكوبون";
      toast.error(msg);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.code.trim();
    if (step === 1) {
      if (form.type === "PERCENTAGE") return form.discountValue > 0 && form.discountValue <= 100;
      if (form.type === "FIXED_AMOUNT") return (form.discountValue ?? 0) > 0;
      if (form.type === "FREE_PRODUCT") return !!form.freeProductId;
      if (form.type === "PRODUCT_DISCOUNT") return (form.discountValue ?? 0) > 0;
      return true; // FREE_SHIPPING
    }
    return true;
  };

  const getTypeLabel = (type: string) =>
    TYPE_OPTIONS.find((t) => t.value === type)?.label || type;

  const formatDiscount = () => {
    if (form.type === "PERCENTAGE") return `${form.discountValue}%`;
    if (form.type === "FIXED_AMOUNT") return `${form.discountValue} ر.س`;
    if (form.type === "FREE_SHIPPING") return "شحن مجاني";
    if (form.type === "FREE_PRODUCT") return "منتج مجاني";
    if (form.type === "PRODUCT_DISCOUNT") return `${form.discountValue}%`;
    return "—";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {editingCoupon ? "تعديل الكوبون" : "إنشاء كوبون جديد"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline truncate">
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <Separator className="flex-1 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>اسم الكوبون</Label>
              <Input
                placeholder="مثال: خصم الصيف"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>كود الكوبون</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="SUMMER2026"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  className="font-mono"
                  dir="ltr"
                  disabled={!!editingCoupon}
                />
                {!editingCoupon && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    title="توليد كود عشوائي"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                    />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label>النوع</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as Coupon["type"] })
                }
                disabled={!!editingCoupon}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>الوصف (اختياري)</Label>
              <Textarea
                placeholder="وصف مختصر للكوبون..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Step 2: Discount Settings */}
        {step === 1 && (
          <div className="space-y-4">
            {(form.type === "PERCENTAGE" || form.type === "PRODUCT_DISCOUNT") && (
              <>
                <div>
                  <Label>نسبة الخصم (%)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[form.discountValue]}
                      onValueChange={([v]) =>
                        setForm({ ...form, discountValue: v })
                      }
                      min={1}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1 min-w-[70px]">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={form.discountValue}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            discountValue: Number(e.target.value),
                          })
                        }
                        className="w-16 text-center"
                        dir="ltr"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>الحد الأقصى للخصم (ر.س) — اختياري</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="بدون حد"
                    value={form.maxDiscountAmount ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxDiscountAmount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    dir="ltr"
                  />
                </div>
              </>
            )}

            {form.type === "FIXED_AMOUNT" && (
              <div>
                <Label>مبلغ الخصم (ر.س)</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="50"
                  value={form.discountValue ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, discountValue: Number(e.target.value) })
                  }
                  dir="ltr"
                />
              </div>
            )}

            {form.type === "FREE_SHIPPING" && (
              <Card className="p-6 text-center">
                <Truck className="w-12 h-12 mx-auto text-primary mb-3" />
                <p className="text-muted-foreground">
                  سيتم إعفاء العميل من رسوم الشحن عند استخدام هذا الكوبون
                </p>
              </Card>
            )}

            {form.type === "FREE_PRODUCT" && (
              <>
                <div>
                  <Label>معرّف المنتج المجاني</Label>
                  <Input
                    placeholder="أدخل معرّف المنتج"
                    value={form.freeProductId}
                    onChange={(e) =>
                      setForm({ ...form, freeProductId: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>الكمية المجانية</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.freeProductQty}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        freeProductQty: Number(e.target.value),
                      })
                    }
                    dir="ltr"
                  />
                </div>
              </>
            )}

            {form.type === "PRODUCT_DISCOUNT" && (
              <div>
                <Label>معرّفات المنتجات المؤهلة (مفصولة بفاصلة)</Label>
                <Input
                  placeholder="product-id-1, product-id-2"
                  value={form.applicableProductIds.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      applicableProductIds: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  dir="ltr"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Restrictions */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>الحد الأدنى للطلب (ر.س) — اختياري</Label>
              <Input
                type="number"
                min={0}
                placeholder="بدون حد أدنى"
                value={form.minOrderAmount ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minOrderAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>عدد الاستخدامات الكلي</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="بلا حدود"
                  value={form.maxUsageCount ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxUsageCount: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  dir="ltr"
                />
              </div>
              <div>
                <Label>الحد لكل عميل</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.perCustomerLimit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      perCustomerLimit: Number(e.target.value),
                    })
                  }
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>تاريخ البدء (اختياري)</Label>
                <Input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) =>
                    setForm({ ...form, startsAt: e.target.value })
                  }
                  dir="ltr"
                />
              </div>
              <div>
                <Label>تاريخ الانتهاء (اختياري)</Label>
                <Input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm({ ...form, expiresAt: e.target.value })
                  }
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">الاسم</span>
              <span className="font-medium">{form.name}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">الكود</span>
              <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono">
                {form.code}
              </code>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">النوع</span>
              <Badge variant="secondary">{getTypeLabel(form.type)}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">الخصم</span>
              <span className="font-bold text-primary">{formatDiscount()}</span>
            </div>
            {form.maxDiscountAmount && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">حد أقصى للخصم</span>
                  <span>{form.maxDiscountAmount} ر.س</span>
                </div>
              </>
            )}
            {form.minOrderAmount && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">حد أدنى للطلب</span>
                  <span>{form.minOrderAmount} ر.س</span>
                </div>
              </>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">عدد الاستخدامات</span>
              <span>{form.maxUsageCount ?? "بلا حدود"}</span>
            </div>
            {form.expiresAt && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ينتهي في</span>
                  <span dir="ltr">
                    {new Date(form.expiresAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => (step > 0 ? setStep(step - 1) : onOpenChange(false))}
            disabled={isCreating || isUpdating}
          >
            <ChevronRight className="w-4 h-4 ms-1" />
            {step > 0 ? "السابق" : "إلغاء"}
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              التالي
              <ChevronLeft className="w-4 h-4 me-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "جاري الحفظ..."
                : editingCoupon
                  ? "تحديث الكوبون"
                  : "إنشاء الكوبون"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
