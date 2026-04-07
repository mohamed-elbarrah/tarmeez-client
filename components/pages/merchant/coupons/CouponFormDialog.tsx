"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Percent,
  DollarSign,
  Truck,
  Gift,
  Tag,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useGenerateCodeMutation,
  type Coupon,
} from "@/lib/services/couponsApi";
import ProductPicker from "@/components/shared/ProductPicker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Constants ─── */
const TYPE_OPTIONS = [
  { value: "PERCENTAGE", label: "خصم نسبة مئوية", icon: Percent },
  { value: "FIXED_AMOUNT", label: "خصم مبلغ ثابت", icon: DollarSign },
  { value: "FREE_SHIPPING", label: "شحن مجاني", icon: Truck },
  { value: "FREE_PRODUCT", label: "منتج مجاني", icon: Gift },
  { value: "PRODUCT_DISCOUNT", label: "خصم على منتجات محددة", icon: Tag },
] as const;

const STEP_LABELS = [
  "المعلومات الأساسية",
  "إعدادات الخصم",
  "القيود",
  "مراجعة وإنشاء",
];

/* ─── Zod Schema ─── */
const couponSchema = z
  .object({
    name: z.string().trim().min(1, "اسم الكوبون مطلوب"),
    code: z.string().trim().min(1, "كود الكوبون مطلوب"),
    description: z.string().optional(),
    type: z.enum([
      "PERCENTAGE",
      "FIXED_AMOUNT",
      "FREE_SHIPPING",
      "FREE_PRODUCT",
      "PRODUCT_DISCOUNT",
    ]),
    discountValue: z.number().min(0).optional(),
    maxDiscountAmount: z.number().min(0).optional(),
    freeProductId: z.string().optional(),
    freeProductQty: z.number().int().min(1),
    applicableProductIds: z.array(z.string()),
    applicableCategoryIds: z.array(z.string()),
    minOrderAmount: z.number().min(0).optional(),
    maxUsageCount: z.number().int().min(1).optional(),
    perCustomerLimit: z.number().int().min(1),
    customerIds: z.array(z.string()),
    startsAt: z.date().optional(),
    expiresAt: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "PERCENTAGE" || data.type === "PRODUCT_DISCOUNT") {
      if (
        !data.discountValue ||
        data.discountValue < 1 ||
        data.discountValue > 100
      )
        ctx.addIssue({
          code: "custom",
          message: "نسبة الخصم يجب أن تكون بين 1 و 100",
          path: ["discountValue"],
        });
    }
    if (data.type === "FIXED_AMOUNT") {
      if (!data.discountValue || data.discountValue <= 0)
        ctx.addIssue({
          code: "custom",
          message: "مبلغ الخصم مطلوب ويجب أن يكون أكبر من الصفر",
          path: ["discountValue"],
        });
    }
    if (data.type === "FREE_PRODUCT" && !data.freeProductId?.trim())
      ctx.addIssue({
        code: "custom",
        message: "يجب تحديد المنتج المجاني",
        path: ["freeProductId"],
      });
    if (data.type === "PRODUCT_DISCOUNT" && !data.applicableProductIds.length)
      ctx.addIssue({
        code: "custom",
        message: "يجب تحديد منتج واحد على الأقل",
        path: ["applicableProductIds"],
      });
    if (data.startsAt && data.expiresAt && data.expiresAt <= data.startsAt)
      ctx.addIssue({
        code: "custom",
        message: "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء",
        path: ["expiresAt"],
      });
  });

type FormValues = z.infer<typeof couponSchema>;

type CouponType = FormValues["type"];

/* step → fields to validate before advancing */
const STEP_TRIGGERS: Record<number, (keyof FormValues)[]> = {
  0: ["name", "code"],
  1: ["discountValue", "freeProductId", "applicableProductIds"],
  2: ["minOrderAmount", "maxUsageCount", "startsAt", "expiresAt"],
  3: [],
};

const DEFAULT_VALUES: FormValues = {
  name: "",
  code: "",
  description: "",
  type: "PERCENTAGE",
  discountValue: 10,
  freeProductQty: 1,
  applicableProductIds: [],
  applicableCategoryIds: [],
  customerIds: [],
  perCustomerLimit: 1,
};

/* ─── Helpers ─── */
function getTypeLabel(type: string) {
  return TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type;
}

function formatDiscountPreview(values: Partial<FormValues>): string {
  switch (values.type) {
    case "PERCENTAGE":
      return `خصم ${values.discountValue ?? 0}%${values.minOrderAmount ? ` على الطلبات فوق ${values.minOrderAmount} ر.س` : ""}`;
    case "FIXED_AMOUNT":
      return `خصم ${values.discountValue ?? 0} ر.س${values.minOrderAmount ? ` على الطلبات فوق ${values.minOrderAmount} ر.س` : ""}`;
    case "FREE_SHIPPING":
      return "شحن مجاني";
    case "FREE_PRODUCT":
      return `منتج مجاني × ${values.freeProductQty ?? 1}`;
    case "PRODUCT_DISCOUNT":
      return `خصم ${values.discountValue ?? 0}% على منتجات محددة`;
    default:
      return "—";
  }
}

/* ─── Date Picker sub-component ─── */
function DatePickerField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value?: Date;
  onChange: (d: Date | undefined) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium leading-none">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-right font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            {value
              ? value.toLocaleDateString("ar-SA-u-nu-latn", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "اختر تاريخاً"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d: Date | undefined) => {
              onChange(d);
              setOpen(false);
            }}
            disabled={(d: Date) =>
              d < new Date(new Date().setHours(0, 0, 0, 0))
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ─── Props ─── */
interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCoupon?: Coupon | null;
}

/* ─── Main Component ─── */
export default function CouponFormDialog({
  open,
  onOpenChange,
  editingCoupon,
}: CouponFormDialogProps) {
  const [step, setStep] = useState(0);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [generateCode, { isLoading: isGenerating }] = useGenerateCodeMutation();

  const isSaving = isCreating || isUpdating;

  const form = useForm<FormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const watchedValues = form.watch();
  const currentType = watchedValues.type as CouponType;

  /* ── Reset / prefill on open ── */
  useEffect(() => {
    if (!open) return;
    if (editingCoupon) {
      form.reset({
        name: editingCoupon.name,
        code: editingCoupon.code,
        description: editingCoupon.description ?? "",
        type: editingCoupon.type,
        discountValue: editingCoupon.discountValue ?? 10,
        maxDiscountAmount: editingCoupon.maxDiscountAmount,
        freeProductId: editingCoupon.freeProductId ?? "",
        freeProductQty: editingCoupon.freeProductQty ?? 1,
        applicableProductIds: editingCoupon.applicableProductIds ?? [],
        applicableCategoryIds: editingCoupon.applicableCategoryIds ?? [],
        minOrderAmount: editingCoupon.minOrderAmount,
        maxUsageCount: editingCoupon.maxUsageCount,
        perCustomerLimit: editingCoupon.perCustomerLimit ?? 1,
        customerIds: editingCoupon.customerIds ?? [],
        startsAt: editingCoupon.startsAt
          ? new Date(editingCoupon.startsAt)
          : undefined,
        expiresAt: editingCoupon.expiresAt
          ? new Date(editingCoupon.expiresAt)
          : undefined,
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
    setStep(0);
  }, [open, editingCoupon]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Generate random code ── */
  const handleGenerateCode = async () => {
    try {
      const { code } = await generateCode({}).unwrap();
      form.setValue("code", code, { shouldValidate: true });
    } catch {
      toast.error("حدث خطأ أثناء توليد الكود");
    }
  };

  /* ── Advance step with validation ── */
  const handleNext = async () => {
    const fields = STEP_TRIGGERS[step] ?? [];
    const valid = fields.length === 0 || (await form.trigger(fields as any));
    if (valid) setStep((s) => s + 1);
  };

  /* ── Submit ── */
  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: Record<string, unknown> = {
      name: values.name,
      code: values.code,
      type: values.type,
      freeProductQty: values.freeProductQty,
      applicableProductIds: values.applicableProductIds,
      applicableCategoryIds: values.applicableCategoryIds,
      customerIds: values.customerIds,
      perCustomerLimit: values.perCustomerLimit,
    };
    if (values.description) payload.description = values.description;
    if (values.discountValue !== undefined)
      payload.discountValue = values.discountValue;
    if (values.maxDiscountAmount)
      payload.maxDiscountAmount = values.maxDiscountAmount;
    if (values.freeProductId) payload.freeProductId = values.freeProductId;
    if (values.minOrderAmount) payload.minOrderAmount = values.minOrderAmount;
    if (values.maxUsageCount) payload.maxUsageCount = values.maxUsageCount;
    if (values.startsAt) payload.startsAt = values.startsAt.toISOString();
    if (values.expiresAt) payload.expiresAt = values.expiresAt.toISOString();

    try {
      if (editingCoupon) {
        await updateCoupon({
          id: editingCoupon.id,
          data: payload as any,
        }).unwrap();
        toast.success("تم تحديث الكوبون بنجاح");
      } else {
        await createCoupon(payload as any).unwrap();
        toast.success("تم إنشاء الكوبون بنجاح");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "حدث خطأ أثناء حفظ الكوبون");
    }
  });

  /* ─── Step 1: Basic Info ─── */
  function renderStepBasicInfo() {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الكوبون</FormLabel>
              <FormControl>
                <Input placeholder="مثال: خصم الصيف" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كود الكوبون</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="SUMMER2026"
                    className="font-mono"
                    dir="ltr"
                    disabled={!!editingCoupon}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                  {!editingCoupon && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGenerateCode}
                      disabled={isGenerating}
                      title="توليد كود عشوائي"
                    >
                      <RefreshCw
                        className={cn(
                          "h-4 w-4",
                          isGenerating && "animate-spin",
                        )}
                      />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الكوبون</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!editingCoupon}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <opt.icon className="h-4 w-4" />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف (اختياري)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="وصف مختصر للكوبون..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  /* ─── Step 2: Discount Settings ─── */
  function renderStepDiscountSettings() {
    return (
      <div className="space-y-5">
        {/* PERCENTAGE or PRODUCT_DISCOUNT: slider + cap */}
        {(currentType === "PERCENTAGE" ||
          currentType === "PRODUCT_DISCOUNT") && (
          <>
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نسبة الخصم (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 mt-1">
                      <Slider
                        value={[field.value ?? 10]}
                        onValueChange={([v]) => field.onChange(v)}
                        min={1}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="w-16 text-center"
                          dir="ltr"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDiscountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الحد الأقصى للخصم (ر.س) — اختياري</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="بدون حد"
                      dir="ltr"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Product selector for PRODUCT_DISCOUNT */}
            {currentType === "PRODUCT_DISCOUNT" && (
              <FormField
                control={form.control}
                name="applicableProductIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنتجات المؤهلة للخصم</FormLabel>
                    <FormControl>
                      <ProductPicker
                        mode="multi"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        {/* FIXED_AMOUNT */}
        {currentType === "FIXED_AMOUNT" && (
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مبلغ الخصم (ر.س)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="50"
                    dir="ltr"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* FREE_SHIPPING */}
        {currentType === "FREE_SHIPPING" && (
          <Card className="p-6 text-center bg-primary/5 border-primary/20">
            <Truck className="h-12 w-12 mx-auto text-primary mb-3" />
            <p className="font-medium">شحن مجاني بالكامل</p>
            <p className="text-sm text-muted-foreground mt-1">
              سيتم إعفاء العميل من رسوم الشحن تلقائياً عند تطبيق هذا الكوبون
            </p>
          </Card>
        )}

        {/* FREE_PRODUCT */}
        {currentType === "FREE_PRODUCT" && (
          <>
            <FormField
              control={form.control}
              name="freeProductId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المنتج المجاني</FormLabel>
                  <FormControl>
                    <ProductPicker
                      mode="single"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="freeProductQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الكمية المجانية</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      dir="ltr"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    );
  }

  /* ─── Step 3: Restrictions ─── */
  function renderStepRestrictions() {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="minOrderAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحد الأدنى للطلب (ر.س) — اختياري</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="بدون حد أدنى"
                  dir="ltr"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxUsageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاستخدامات الكلية</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="بلا حدود"
                    dir="ltr"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="perCustomerLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحد لكل عميل</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <DatePickerField
                label="تاريخ البدء (اختياري)"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <DatePickerField
                label="تاريخ الانتهاء (اختياري)"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {form.formState.errors.expiresAt && (
          <p className="text-sm text-destructive">
            {form.formState.errors.expiresAt.message}
          </p>
        )}
      </div>
    );
  }

  /* ─── Step 4: Review ─── */
  function renderStepReview() {
    const values = form.getValues();
    const rows: Array<{ label: string; value: React.ReactNode }> = [
      {
        label: "الاسم",
        value: <span className="font-medium">{values.name}</span>,
      },
      {
        label: "الكود",
        value: (
          <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
            {values.code}
          </code>
        ),
      },
      {
        label: "النوع",
        value: <Badge variant="secondary">{getTypeLabel(values.type)}</Badge>,
      },
      {
        label: "الخصم",
        value: (
          <span className="font-bold text-primary">
            {formatDiscountPreview(values)}
          </span>
        ),
      },
    ];
    if (values.maxDiscountAmount)
      rows.push({
        label: "حد الخصم",
        value: `${values.maxDiscountAmount} ر.س`,
      });
    if (values.minOrderAmount)
      rows.push({
        label: "حد أدنى للطلب",
        value: `${values.minOrderAmount} ر.س`,
      });
    rows.push({
      label: "الاستخدامات",
      value: values.maxUsageCount ?? "بلا حدود",
    });
    if (values.expiresAt)
      rows.push({
        label: "ينتهي في",
        value: (
          <span dir="ltr">
            {values.expiresAt.toLocaleDateString("ar-SA-u-nu-latn")}
          </span>
        ),
      });

    return (
      <div className="space-y-3">
        {/* Preview card */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{values.name || "—"}</p>
              <p className="text-sm text-muted-foreground">
                {formatDiscountPreview(values)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-2.5">
          {rows.map((row, i) => (
            <div key={i}>
              {i > 0 && <Separator className="mb-2.5" />}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {row.label}
                </span>
                <span>{row.value}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCoupon ? "تعديل الكوبون" : "إنشاء كوبون جديد"}
          </DialogTitle>
        </DialogHeader>

        {/* ─── Step Indicator ─── */}
        <div className="flex items-center gap-1.5 mb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-1 flex-1 min-w-0">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block truncate">
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className="flex-1 h-px bg-border mx-1 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* ─── Step Content ─── */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            {step === 0 && renderStepBasicInfo()}
            {step === 1 && renderStepDiscountSettings()}
            {step === 2 && renderStepRestrictions()}
            {step === 3 && renderStepReview()}

            {/* ─── Navigation ─── */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  step > 0 ? setStep(step - 1) : onOpenChange(false)
                }
                disabled={isSaving}
              >
                <ChevronRight className="h-4 w-4 ms-1" />
                {step > 0 ? "السابق" : "إلغاء"}
              </Button>

              {step < 3 ? (
                <Button type="button" onClick={handleNext}>
                  التالي
                  <ChevronLeft className="h-4 w-4 me-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin me-2" />
                      جاري الحفظ...
                    </>
                  ) : editingCoupon ? (
                    "تحديث الكوبون"
                  ) : (
                    "إنشاء الكوبون"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
