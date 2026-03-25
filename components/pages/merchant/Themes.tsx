import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Eye,
  CheckCircle2,
  Loader2,
  Save,
  Upload,
  ImageIcon,
  Palette,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useUpdateStoreCustomizationMutation,
  useUploadStoreImageMutation,
} from "@/lib/services/productsApi";
import {
  useGetMyStoreQuery,
  useGetAvailableThemesQuery,
  useSwitchThemeMutation,
} from "@/lib/services/merchantApi";
import React from "react";

const AdvancedColorPicker: React.FC<{
  value: string;
  onChange: (hex: string) => void;
  label?: string;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const quick = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#9E9E9E",
    "#607D8B",
    "#000000",
  ];

  const [hex, setHex] = useState(value);
  useEffect(() => setHex(value), [value]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
      >
        <span style={{ background: value }} className="w-6 h-6 rounded" />
        <div className="text-sm">{value}</div>
      </button>

      {open && (
        <div
          className="absolute z-50 right-0 mt-2 w-64 p-3 rounded shadow-lg"
          style={{
            backgroundColor: "var(--color-popover)",
            borderColor: "var(--color-border)",
            color: "var(--color-popover-foreground)",
          }}
        >
          <input
            type="color"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full h-12 p-0"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onBlur={() => onChange(hex)}
              className="text-sm p-1 rounded w-full"
              style={{
                backgroundColor: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
                borderStyle: "solid",
              }}
            />
          </div>

          <div className="grid grid-cols-10 gap-1 mt-3">
            {quick.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setHex(c);
                  onChange(c);
                }}
                style={{ background: c, borderColor: "var(--color-border)" }}
                className="w-6 h-6 rounded border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BrandIdentitySection = () => {
  const { data, isLoading } = useGetMyStoreQuery();
  const [updateCustomization, { isLoading: isSaving }] =
    useUpdateStoreCustomizationMutation();
  const [uploadStoreImage] = useUploadStoreImageMutation();
  const [uploadingKey, setUploadingKey] = useState<"logo" | "favicon" | null>(
    null,
  );

  const [config, setConfig] = useState({
    storeName: "",
    logo: "",
    logoWidth: 120,
    logoHeight: 40,
    showStoreName: true,
    favicon: "",
    primaryColor: "#2563eb",
    secondaryColor: "#0f172a",
    accentColor: "#f59e0b",
    textColor: "#1e293b",
    headingColor: "#000000",
    buttonColor: "#2563eb",
    fontFamily: "'Cairo', sans-serif",
    borderRadius: "20px",
  });

  useEffect(() => {
    if (data?.store) {
      const s: any = data.store;
      setConfig({
        storeName: s.storeName ?? s.name ?? "",
        logo: s.logo ?? "",
        logoWidth: s.logoWidth ?? 120,
        logoHeight: s.logoHeight ?? 40,
        showStoreName: s.showStoreName ?? true,
        favicon: s.favicon ?? "",
        primaryColor: s.primaryColor ?? "#2563eb",
        secondaryColor: s.secondaryColor ?? "#0f172a",
        accentColor: s.accentColor ?? "#f59e0b",
        textColor: s.textColor ?? "#1e293b",
        headingColor: s.headingColor ?? "#000000",
        buttonColor: s.buttonColor ?? "#2563eb",
        fontFamily: s.fontFamily ?? "'Cairo', sans-serif",
        borderRadius: s.borderRadius ?? "20px",
      });
    }
  }, [data]);

  useEffect(() => {
    const name = (config.fontFamily || "")
      .split(",")[0]
      .replace(/['"]/g, "")
      .trim();
    if (!name) return;
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@300;400;600;700&display=swap`;
    const existing = document.querySelector(`link[data-font='${name}']`);
    if (!existing) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.setAttribute("data-font", name);
      document.head.appendChild(l);
    }
  }, [config.fontFamily]);

  const handleUpload = async (
    file?: File,
    key: "logo" | "favicon" = "logo",
  ) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await uploadStoreImage(form).unwrap();
      setConfig((prev) => ({ ...prev, [key]: res.url }));
      const { toast } = await import("sonner");
      toast.success(
        key === "logo" ? "تم رفع الشعار بنجاح ✓" : "تم رفع الأيقونة بنجاح ✓",
      );
    } catch {
      const { toast } = await import("sonner");
      toast.error("فشل رفع الصورة");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    try {
      await updateCustomization({
        storeName: config.storeName,
        logo: config.logo,
        logoWidth: config.logoWidth,
        logoHeight: config.logoHeight,
        showStoreName: config.showStoreName,
        favicon: config.favicon || null,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        textColor: config.textColor,
        headingColor: config.headingColor,
        buttonColor: config.buttonColor,
        fontFamily: config.fontFamily,
        borderRadius: config.borderRadius,
      }).unwrap();
      const { toast } = await import("sonner");
      toast.success("تم حفظ الهوية البصرية بنجاح ✓");
    } catch {
      const { toast } = await import("sonner");
      toast.error("فشل الحفظ، يرجى المحاولة مجدداً");
    }
  };

  const resetToDefaults = () => {
    setConfig({
      storeName: data?.store
        ? ((data.store as any).storeName ?? (data.store as any).name ?? "")
        : "",
      logo: "",
      logoWidth: 120,
      logoHeight: 40,
      showStoreName: true,
      favicon: "",
      primaryColor: "#2563eb",
      secondaryColor: "#0f172a",
      accentColor: "#f59e0b",
      textColor: "#1e293b",
      headingColor: "#000000",
      buttonColor: "#2563eb",
      fontFamily: "'Cairo', sans-serif",
      borderRadius: "20px",
    });
  };

  const colorFields: {
    key: keyof typeof config;
    label: string;
    desc: string;
  }[] = [
    {
      key: "primaryColor",
      label: "اللون الرئيسي",
      desc: "الروابط والحدود والأزرار",
    },
    { key: "secondaryColor", label: "لون الخلفية", desc: "الهيدر والبانر" },
    { key: "accentColor", label: "لون التمييز", desc: "النجوم والشارات" },
    {
      key: "buttonColor",
      label: "لون الأزرار",
      desc: "خلفية الأزرار الرئيسية",
    },
    {
      key: "headingColor",
      label: "لون العناوين",
      desc: "عناوين المنتجات والأقسام",
    },
    { key: "textColor", label: "لون النصوص", desc: "نصوص الوصف والتفاصيل" },
  ];

  if (isLoading)
    return (
      <Card className="p-6 mt-8">
        <div className="animate-pulse h-40 bg-muted rounded" />
      </Card>
    );

  return (
    <Card className="mt-8 overflow-hidden" dir="rtl">
      {/* ── Sticky header with save button ─────────────────────── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-base">تخصيص الهوية البصرية</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            title="إعادة الضبط الافتراضي"
            className="text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin ml-1" />
            ) : (
              <Save className="w-4 h-4 ml-1" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="p-5">
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="colors">الألوان</TabsTrigger>
            <TabsTrigger value="typography">الخطوط والزوايا</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: General ─────────────────────────────────── */}
          <TabsContent value="general" className="space-y-6">
            {/* Store name */}
            <div>
              <Label className="mb-2 block font-medium">
                اسم المتجر / العلامة التجارية
              </Label>
              <Input
                value={config.storeName}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, storeName: e.target.value }))
                }
                placeholder="أدخل اسم متجرك"
              />
            </div>

            {/* Logo upload */}
            <div>
              <Label className="mb-3 block font-medium">شعار المتجر</Label>
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Preview thumbnail */}
                  <div
                    className="shrink-0 w-28 h-16 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {config.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={config.logo}
                        alt="logo preview"
                        style={{
                          width: config.logoWidth,
                          height: config.logoHeight,
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Upload button */}
                    <label className="cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleUpload(e.target.files?.[0], "logo")
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={uploadingKey === "logo"}
                      >
                        <span>
                          {uploadingKey === "logo" ? (
                            <Loader2 className="w-4 h-4 animate-spin ml-1" />
                          ) : (
                            <Upload className="w-4 h-4 ml-1" />
                          )}
                          رفع الشعار
                        </span>
                      </Button>
                    </label>

                    {/* Size presets */}
                    <div className="flex gap-2 flex-wrap">
                      {(
                        [
                          { w: 80, h: 30, label: "صغير" },
                          { w: 120, h: 40, label: "متوسط" },
                          { w: 180, h: 60, label: "كبير" },
                        ] as const
                      ).map(({ w, h, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              logoWidth: w,
                              logoHeight: h,
                            }))
                          }
                          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                            config.logoWidth === w
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Show store name toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                      <input
                        type="checkbox"
                        checked={config.showStoreName}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            showStoreName: e.target.checked,
                          }))
                        }
                      />
                      إظهار الاسم بجانب الشعار
                    </label>
                  </div>
                </div>

                {/* Dimension sliders */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      العرض ({config.logoWidth}px)
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={300}
                      value={config.logoWidth}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          logoWidth: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      الارتفاع ({config.logoHeight}px)
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={150}
                      value={config.logoHeight}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          logoHeight: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Favicon upload */}
            <div>
              <Label className="mb-3 block font-medium">
                أيقونة المتجر (Favicon)
              </Label>
              <div
                className="rounded-xl p-4 flex items-center gap-4"
                style={{
                  backgroundColor: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* 32×32 preview */}
                <div
                  className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {config.favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={config.favicon}
                      alt="favicon preview"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    يُعرض في تبويب المتصفح · الحجم المثالي 32×32 أو 64×64
                  </p>
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUpload(e.target.files?.[0], "favicon")
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      disabled={uploadingKey === "favicon"}
                    >
                      <span>
                        {uploadingKey === "favicon" ? (
                          <Loader2 className="w-4 h-4 animate-spin ml-1" />
                        ) : (
                          <Upload className="w-4 h-4 ml-1" />
                        )}
                        رفع الأيقونة
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Tab 2: Colors ──────────────────────────────────── */}
          <TabsContent value="colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {colorFields.map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--color-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {desc}
                      </div>
                    </div>
                    <AdvancedColorPicker
                      value={config[key] as string}
                      onChange={(v) =>
                        setConfig((prev) => ({ ...prev, [key]: v }))
                      }
                    />
                  </div>
                  {/* Color swatch bar */}
                  <div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: config[key] as string }}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── Tab 3: Typography & Style ──────────────────────── */}
          <TabsContent value="typography" className="space-y-6">
            {/* Font family */}
            <div>
              <Label className="mb-2 block font-medium">خط المتجر</Label>
              <select
                value={config.fontFamily}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, fontFamily: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--color-input)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              >
                <option value="'Cairo', sans-serif">Cairo</option>
                <option value="'Tajawal', sans-serif">Tajawal</option>
                <option value="'Noto Sans Arabic', sans-serif">
                  Noto Sans Arabic
                </option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Poppins', sans-serif">Poppins</option>
              </select>
              {/* Live font preview */}
              <div
                className="mt-3 p-4 rounded-xl text-sm"
                style={{
                  fontFamily: config.fontFamily,
                  backgroundColor: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-card-foreground)",
                }}
              >
                مرحباً بكم في متجرنا – Welcome to our store
              </div>
            </div>

            {/* Border radius */}
            <div>
              <Label className="mb-3 block font-medium">
                استدارة الزوايا – {parseInt(config.borderRadius || "0")}px
              </Label>
              <input
                type="range"
                min={0}
                max={40}
                value={parseInt(config.borderRadius || "0")}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    borderRadius: `${e.target.value}px`,
                  }))
                }
                className="w-full mb-4"
              />
              {/* Shape presets */}
              <div className="flex gap-2 flex-wrap">
                {(
                  [
                    { value: "0px", label: "حاد" },
                    { value: "8px", label: "خفيف" },
                    { value: "16px", label: "متوسط" },
                    { value: "20px", label: "افتراضي" },
                    { value: "32px", label: "دائري" },
                    { value: "9999px", label: "كامل" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        borderRadius: opt.value,
                      }))
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md transition-colors ${
                      config.borderRadius === opt.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 14,
                        borderRadius: opt.value,
                        backgroundColor:
                          config.borderRadius === opt.value
                            ? "currentColor"
                            : "var(--color-muted-foreground)",
                        opacity: 0.4,
                      }}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

// ─── Theme Grid ─────────────────────────────────────────────────────────────

interface ThemeRecord {
  id: string;
  slug: string;
  name: string;
  previewImage: string | null;
}

/** Skeleton placeholder shown while fetching themes */
const ThemeCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-4/3 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  </Card>
);

/** Single theme card */
const ThemeCard = ({
  theme,
  isActive,
  onActivate,
  isSwitching,
}: {
  theme: ThemeRecord;
  isActive: boolean;
  onActivate: (theme: ThemeRecord) => void;
  isSwitching: boolean;
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Card
        className={`overflow-hidden transition-all ${isActive ? "ring-2 ring-primary" : ""}`}
      >
        {/* Preview image / placeholder */}
        <div
          className="aspect-4/3 bg-muted flex items-center justify-center relative cursor-pointer group border-b border-border"
          onClick={() => theme.previewImage && setPreviewOpen(true)}
        >
          {theme.previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.previewImage}
              alt={theme.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">{theme.name}</span>
          )}
          {theme.previewImage && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Eye className="w-6 h-6 text-white" />
            </div>
          )}
          {isActive && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500/90 text-white text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" />
                نشط
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">{theme.name}</h3>
            {isActive && (
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-500"
              >
                مفعّل
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {/* Preview — only shown when a previewImage exists */}
            {theme.previewImage && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="w-4 h-4 ml-1" />
                معاينة
              </Button>
            )}

            <Button
              size="sm"
              className="flex-1"
              disabled={isActive || isSwitching}
              onClick={() => onActivate(theme)}
            >
              {isSwitching ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : isActive ? (
                "مفعّل"
              ) : (
                "تفعيل"
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{theme.name}</DialogTitle>
          </DialogHeader>
          {theme.previewImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.previewImage}
              alt={theme.name}
              className="w-full rounded-lg"
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/** Confirmation dialog before switching themes */
const ConfirmSwitchDialog = ({
  open,
  theme,
  onConfirm,
  onCancel,
  isSwitching,
}: {
  open: boolean;
  theme: ThemeRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSwitching: boolean;
}) => (
  <Dialog
    open={open}
    onOpenChange={(v) => {
      if (!v) onCancel();
    }}
  >
    <DialogContent dir="rtl">
      <DialogHeader>
        <DialogTitle>تغيير القالب</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        هل أنت متأكد من تغيير القالب إلى &quot;{theme?.name}&quot;؟ قد تتغير بعض
        إعدادات الألوان الافتراضية.
      </p>
      <DialogFooter className="flex-row-reverse gap-2">
        <Button onClick={onConfirm} disabled={isSwitching}>
          {isSwitching ? (
            <Loader2 className="w-4 h-4 animate-spin ml-1" />
          ) : null}
          تأكيد التغيير
        </Button>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/** Theme gallery section */
const ThemeGallery = () => {
  const { data: storeData } = useGetMyStoreQuery();
  const { data: themes, isLoading, isError } = useGetAvailableThemesQuery();
  const [switchTheme, { isLoading: isSwitching }] = useSwitchThemeMutation();

  const [pendingTheme, setPendingTheme] = useState<ThemeRecord | null>(null);
  const activeThemeId = storeData?.store?.themeId ?? null;

  const handleActivate = (theme: ThemeRecord) => {
    setPendingTheme(theme);
  };

  const handleConfirm = async () => {
    if (!pendingTheme) return;
    try {
      await switchTheme({ themeId: pendingTheme.id }).unwrap();
      const { toast } = await import("sonner");
      toast.success(`تم تفعيل قالب "${pendingTheme.name}" بنجاح ✓`);
    } catch {
      const { toast } = await import("sonner");
      toast.error("فشل تغيير القالب، يرجى المحاولة مجدداً");
    } finally {
      setPendingTheme(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ThemeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive text-sm mb-3">تعذّر تحميل القوالب</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          إعادة المحاولة
        </Button>
      </Card>
    );
  }

  if (!themes || themes.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-sm">
        لا توجد قوالب متاحة حالياً
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(themes as ThemeRecord[]).map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={theme.id === activeThemeId}
            onActivate={handleActivate}
            isSwitching={isSwitching && pendingTheme?.id === theme.id}
          />
        ))}
      </div>

      <ConfirmSwitchDialog
        open={!!pendingTheme}
        theme={pendingTheme}
        onConfirm={handleConfirm}
        onCancel={() => setPendingTheme(null)}
        isSwitching={isSwitching}
      />
    </>
  );
};

export default function Themes() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold mb-2">القوالب</h1>
        <p className="text-muted-foreground">اختر قالب احترافي لمتجرك</p>
      </div>

      <ThemeGallery />

      <BrandIdentitySection />
    </div>
  );
}
