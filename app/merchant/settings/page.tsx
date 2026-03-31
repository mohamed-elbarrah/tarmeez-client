"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/lib/services/merchantApi";
import { useRole } from "@/hooks/useRole";
import { Resource } from "@/lib/types/rbac";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Check,
  Save,
  Globe,
  Settings,
  Mail,
  Phone,
  DollarSign,
  Percent,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShoppingCart } from "lucide-react";
import { AssetUploader } from "@/components/merchant/AssetUploader";
import { CheckoutFieldsEditor } from "@/components/merchant/CheckoutFieldsEditor";
import { DEFAULT_CHECKOUT_FIELDS } from "@/lib/themes/store/default/components/checkout/useCheckoutFlow";
import type { CheckoutFieldConfig } from "@/lib/types/auth";
import { SocialLinksRepeater } from "@/components/merchant/SocialLinksRepeater";
import { cn } from "@/lib/utils";

const checkoutFieldSchema = z.object({
  id:          z.string(),
  type:        z.enum(['text', 'phone', 'email', 'textarea', 'address']),
  label:       z.string(),
  placeholder: z.string().optional(),
  enabled:     z.boolean(),
  required:    z.boolean(),
  isCustom:    z.boolean(),
  sortOrder:   z.number(),
});

const settingsSchema = z.object({
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),
  supportEmail: z.string().email("البريد الإلكتروني غير صحيح").nullable().optional().or(z.literal("")),
  supportWhatsapp: z.string().nullable().optional(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url("يجب أن يكون الرابط صحيحاً"),
      icon: z.string().optional(),
    })
  ).nullable().optional(),
  systemCurrency: z.string().min(1, "العملة مطلوبة"),
  currencyIcon: z.string().nullable().optional(),
  taxNumber: z.string().nullable().optional(),
  taxPercentage: z.number().min(0).max(100),
  isTaxEnabled: z.boolean(),
  checkoutFieldsConfig: z.array(checkoutFieldSchema).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { role, isEditor, canUpdate } = useRole();
  const canModify = !isEditor && canUpdate(Resource.SETTINGS);

  console.log('[SettingsPage] Current User Role:', role, 'canModify:', canModify);

  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      systemCurrency: "SAR",
      taxPercentage: 15,
      isTaxEnabled: false,
      socialLinks: [],
      checkoutFieldsConfig: DEFAULT_CHECKOUT_FIELDS,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        ...settings,
        supportEmail: settings.supportEmail || "",
        socialLinks: settings.socialLinks || [],
      checkoutFieldsConfig: (Array.isArray(settings.checkoutFieldsConfig) && settings.checkoutFieldsConfig.length > 0)
          ? (settings.checkoutFieldsConfig as CheckoutFieldConfig[])
          : DEFAULT_CHECKOUT_FIELDS,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateSettings(data).unwrap();
      toast.success("تم حفظ الإعدادات بنجاح");
      reset(data);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4" dir="rtl">
        <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
        <h2 className="text-xl font-bold">عذراً، حدث خطأ ما</h2>
        <p className="text-muted-foreground">فشل تحميل الإعدادات من الخادم</p>
      </div>
    );
  }

  const isTaxEnabled = watch("isTaxEnabled");
  const currentCurrency = watch("systemCurrency");
  const currencyIcon = watch("currencyIcon");
  const checkoutFieldsConfig = watch("checkoutFieldsConfig");

  return (
    <div className="relative pb-24" dir="rtl">
      <TooltipProvider>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {!canModify && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-2 bg-muted rounded-full text-muted-foreground border cursor-help">
                    <Lock className="w-4 h-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ليس لديك صلاحيات لتعديل الإعدادات</p>
                </TooltipContent>
              </Tooltip>
            )}
            <div>
              <h1 className="text-2xl font-bold font-heading">إعدادات المتجر</h1>
              <p className="text-sm text-muted-foreground mt-1">تخصيص هوية المتجر، العملات، الضرائب، وروابط التواصل.</p>
            </div>
          </div>
          
          {!isDirty && settings && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">تم الحفظ التلقائي</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-lg w-full md:w-auto h-auto grid grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="basic" className="gap-2 py-2">
                <Settings className="w-4 h-4" />
                <span>بيانات المتجر</span>
              </TabsTrigger>
              <TabsTrigger value="localization" className="gap-2 py-2">
                <DollarSign className="w-4 h-4" />
                <span>الإقليمة والعملة</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-2 py-2">
                <Globe className="w-4 h-4" />
                <span>التواصل الاجتماعي</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="gap-2 py-2">
                <Percent className="w-4 h-4" />
                <span>الضرائب</span>
              </TabsTrigger>
              <TabsTrigger value="checkout" className="gap-2 py-2">
                <ShoppingCart className="w-4 h-4" />
                <span>إعدادات الدفع</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Info */}
            <TabsContent value="basic" className="space-y-6 animate-in fade-in-50 duration-500">
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                  <CardDescription>إدارة هوية العلامة التجارية وبيانات التواصل.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AssetUploader
                      label="شعار المتجر (Logo)"
                      description="يُنصح بـ 500x500 بكسل، خلفية شفافة."
                      value={watch("logo")}
                      onChange={(url) => setValue("logo", url, { shouldDirty: true })}
                      disabled={!canModify}
                    />
                    <AssetUploader
                      label="أيقونة المتجر (Favicon)"
                      description="يُنصح بـ 32x32 بكسل (ICO/PNG)."
                      value={watch("favicon")}
                      onChange={(url) => setValue("favicon", url, { shouldDirty: true })}
                      disabled={!canModify}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail" className="gap-2 flex items-center">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        البريد الإلكتروني للدعم
                      </Label>
                      <Input
                        id="supportEmail"
                        {...register("supportEmail")}
                        placeholder="support@yourstore.com"
                        dir="ltr"
                        disabled={!canModify}
                        className={errors.supportEmail ? "border-destructive focus:ring-destructive" : "focus:ring-primary"}
                      />
                      {errors.supportEmail && <p className="text-[10px] text-destructive">{errors.supportEmail.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportWhatsapp" className="gap-2 flex items-center">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        رقم واتساب للدعم
                      </Label>
                      <Input
                        id="supportWhatsapp"
                        {...register("supportWhatsapp")}
                        placeholder="9665xxxxxxxx"
                        dir="ltr"
                        disabled={!canModify}
                        className="focus:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Localization */}
            <TabsContent value="localization" className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg">العملة والإقليمية</CardTitle>
                  <CardDescription>تحديد العملة وشكل عرض الأسعار في المتجر.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>عملة النظام الأساسية</Label>
                        <Input
                          {...register("systemCurrency")}
                          placeholder="SAR"
                          dir="ltr"
                          disabled={!canModify}
                          className="focus:ring-primary"
                        />
                      </div>
                      
                      <AssetUploader
                        label="أيقونة العملة (Currency Icon)"
                        description="أيقونة صغيرة تظهر بجانب السعر (SVG يُفضل)."
                        value={currencyIcon}
                        onChange={(url) => setValue("currencyIcon", url, { shouldDirty: true })}
                        disabled={!canModify}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">معاينة عرض السعر في المتجر</Label>
                      <div className="group relative">
                        {/* Premium Card Preview */}
                        <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-border/50 flex flex-col items-center justify-center gap-6 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
                          {/* Decorative elements */}
                          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50" />
                          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50" />
                          
                          <div className="bg-background rounded-2xl p-6 shadow-2xl border border-border/40 flex items-center gap-4 min-w-[240px] transform transition-transform group-hover:scale-105 duration-500 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                              {currencyIcon ? (
                                <img src={currencyIcon} alt="Icon" className="w-8 h-8 object-contain" />
                              ) : (
                                <span className="text-xl font-bold text-primary">{currentCurrency}</span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground font-medium">سعر المنتج المختصر</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-primary mr-1">{currentCurrency}</span>
                                <span className="text-3xl font-black tracking-tight font-mono text-foreground font-sans">100.00</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 relative z-10">
                             <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                             <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                             <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                          </div>

                          <p className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-border/50 relative z-10">
                             عرض تجريبي للشكل النهائي في المتجر
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Social Media */}
            <TabsContent value="social" className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg">روابط التواصل الاجتماعي</CardTitle>
                  <CardDescription>ستظهر هذه الروابط في تذييل المتجر (Footer).</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <SocialLinksRepeater
                    value={watch("socialLinks") || []}
                    onChange={(val) => setValue("socialLinks", val, { shouldDirty: true })}
                    disabled={!canModify}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Tax Settings */}
            <TabsContent value="tax" className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg">إعدادات الضرائب (VAT)</CardTitle>
                  <CardDescription>تفعيل تطبيق الضريبة على الطلبات وإضافة الرقم الضريبي.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border transition-colors hover:bg-muted/30">
                    <div className="space-y-0.5">
                      <Label className="text-base cursor-pointer" htmlFor="tax-toggle">تفعيل الضريبة</Label>
                      <p className="text-xs text-muted-foreground">سيتم احتساب الضريبة تلقائياً في الفاتورة.</p>
                    </div>
                    <Switch
                      id="tax-toggle"
                      checked={isTaxEnabled}
                      onCheckedChange={(val) => setValue("isTaxEnabled", val, { shouldDirty: true })}
                      disabled={!canModify}
                    />
                  </div>

                  <div className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300",
                    !isTaxEnabled && "opacity-40 grayscale pointer-events-none"
                  )}>
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">الرقم الضريبي للمتجر</Label>
                      <Input
                        id="taxNumber"
                        {...register("taxNumber")}
                        placeholder="1234567890"
                        dir="ltr"
                        disabled={!canModify}
                        className="focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxPercentage">نسبة الضريبة (%)</Label>
                      <div className="relative">
                        <Input
                          id="taxPercentage"
                          type="number"
                          {...register("taxPercentage", { valueAsNumber: true })}
                          placeholder="15"
                          dir="ltr"
                          disabled={!canModify}
                          className="pl-8 focus:ring-primary"
                        />
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: Checkout Settings */}
            <TabsContent value="checkout" className="space-y-6 animate-in fade-in-50 duration-500">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg">إعدادات صفحة الدفع</CardTitle>
                  <CardDescription>
                    تحكم في حقول الطلب — اضبط التسمية، النص التوضيحي، والإلزامية لكل حقل.
                    اسحب وأفلت لترتيب الحقول.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CheckoutFieldsEditor
                    value={(checkoutFieldsConfig as CheckoutFieldConfig[]) ?? []}
                    onChange={(fields) =>
                      setValue("checkoutFieldsConfig", fields, { shouldDirty: true })
                    }
                    disabled={!canModify}
                  />
                  <p className="text-[11px] text-muted-foreground pt-1">
                    تنبيه: لا يمكن حذف الحقول الأساسية (اسم، جوال) لكن يمكن إخفاؤها أو تعديل تسميتها.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Sticky Save Bar */}
          {isDirty && canModify && (
            <div className="fixed bottom-6 left-6 right-6 md:left-12 md:right-auto z-50 animate-in slide-in-from-bottom-5 duration-300">
              <div className="bg-background border border-border/60 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-3 flex items-center gap-4 border-primary/20">
                <div className="bg-primary/10 p-2 rounded-lg hidden md:block">
                  <Save className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 hidden md:block">
                  <p className="text-sm font-bold">لديك تغييرات غير محفوظة</p>
                  <p className="text-[10px] text-muted-foreground">تأكد من الحفظ قبل مغادرة الصفحة</p>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => reset()}
                    disabled={isUpdating}
                    className="rounded-xl flex-1 md:flex-none"
                  >
                    إلغاء التعديلات
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl px-8 shadow-lg shadow-primary/20 flex-1 md:flex-none"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "حفظ التغييرات"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </TooltipProvider>
    </div>
  );
}
