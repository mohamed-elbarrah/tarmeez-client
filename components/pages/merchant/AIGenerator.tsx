"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCcw,
  ChevronRight,
  FileText,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGenerateMutation,
  useGetGenerationQuery,
  useRetryGenerationMutation,
  type GenerationStatus,
} from "@/lib/services/landingPageApi";
import { useGetProductsQuery } from "@/lib/services/productsApi";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";
import { useGetPageQuery } from "@/lib/services/pagesApi";
import { useRole } from "@/hooks/useRole";
import { Resource } from "@/lib/types/rbac";

// ─── Tone options ────────────────────────────────────────────
const TONES = [
  { value: "professional", label: "احترافي" },
  { value: "casual", label: "عفوي" },
  { value: "luxurious", label: "فاخر" },
  { value: "playful", label: "مرح" },
  { value: "urgent", label: "عاجل" },
] as const;

// ─── Status metadata ─────────────────────────────────────────
const STATUS_META: Record<
  GenerationStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "في الانتظار",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
  },
  PROCESSING: {
    label: "جاري المعالجة",
    color: "bg-blue-100 text-blue-700",
    icon: <Cpu className="h-4 w-4 animate-pulse" />,
  },
  COMPLETED: {
    label: "مكتمل",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  FAILED: {
    label: "فشل",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="h-4 w-4" />,
  },
};

// ─── Sub-component: Generation status tracker ─────────────────
function GenerationTracker({
  generationId,
  storeSlug,
  onRetry,
}: {
  generationId: string;
  storeSlug: string | undefined;
  onRetry: () => void;
}) {
  const isTerminal = useRef(false);

  const { data: generation, isLoading } = useGetGenerationQuery(generationId, {
    pollingInterval: isTerminal.current ? 0 : 2000,
  });

  const [retryGeneration, { isLoading: isRetrying }] =
    useRetryGenerationMutation();

  // Stop polling once we reach a terminal state
  const status = generation?.status;
  if (status === "COMPLETED" || status === "FAILED") {
    isTerminal.current = true;
  }

  // Fetch the generated page to get its slug (only when completed)
  const { data: page } = useGetPageQuery(generation?.pageId ?? "", {
    skip: !generation?.pageId || status !== "COMPLETED",
  });

  const handleRetry = async () => {
    try {
      await retryGeneration(generationId).unwrap();
      isTerminal.current = false;
      toast.success("تمت إعادة المحاولة");
    } catch {
      toast.error("حدث خطأ أثناء إعادة المحاولة");
    }
    onRetry();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!generation) return null;

  const meta = STATUS_META[generation.status];
  const previewUrl =
    page?.slug && storeSlug
      ? `${process.env.NEXT_PUBLIC_STORE_BASE_URL ?? ""}/store/${storeSlug}/p/${page.slug}`
      : null;

  const editUrl = generation.pageId
    ? `/merchant/page-builder?pageId=${generation.pageId}`
    : null;

  return (
    <Card
      className="border-2 transition-colors duration-300"
      style={{
        borderColor:
          status === "COMPLETED"
            ? "hsl(var(--primary) / 0.4)"
            : status === "FAILED"
              ? "hsl(var(--destructive) / 0.4)"
              : "hsl(var(--border))",
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold">
            حالة التوليد
          </CardTitle>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}
          >
            {meta.icon}
            {meta.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress steps */}
        <div className="space-y-2">
          <GenerationStep
            label="تحليل المنتج"
            done={status !== "PENDING"}
            active={status === "PENDING"}
            failed={status === "FAILED"}
          />
          <GenerationStep
            label="تخطيط هيكل الصفحة"
            done={status === "COMPLETED" || status === "FAILED"}
            active={status === "PROCESSING"}
            failed={status === "FAILED"}
          />
          <GenerationStep
            label="توليد محتوى الأقسام"
            done={status === "COMPLETED"}
            active={status === "PROCESSING"}
            failed={status === "FAILED"}
          />
        </div>

        {/* Error message */}
        {status === "FAILED" && generation.errorMessage && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {generation.errorMessage}
          </div>
        )}

        {/* Success state */}
        {status === "COMPLETED" && (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              تم إنشاء صفحة الهبوط بنجاح!
            </div>
            <p className="text-xs text-muted-foreground">
              يمكنك الآن معاينة الصفحة أو تعديلها باستخدام محرر الصفحات.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {editUrl && (
                <Button size="sm" asChild>
                  <Link href={editUrl}>
                    <FileText className="h-3.5 w-3.5 me-1.5" />
                    تعديل في المحرر
                  </Link>
                </Button>
              )}
              {previewUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 me-1.5" />
                    معاينة
                  </a>
                </Button>
              )}
              <Button size="sm" variant="ghost" asChild>
                <Link href="/merchant/pages">
                  عرض كل الصفحات
                  <ChevronRight className="h-3.5 w-3.5 ms-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Retry button */}
        {status === "FAILED" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <Loader2 className="h-3.5 w-3.5 me-1.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5 me-1.5" />
            )}
            إعادة المحاولة
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Helper: single progress step ────────────────────────────
function GenerationStep({
  label,
  done,
  active,
  failed,
}: {
  label: string;
  done: boolean;
  active: boolean;
  failed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors
          ${done && !failed ? "bg-primary text-primary-foreground" : ""}
          ${active && !failed ? "bg-primary/20 text-primary ring-2 ring-primary/30" : ""}
          ${failed ? "bg-destructive/20 text-destructive" : ""}
          ${!done && !active && !failed ? "bg-muted text-muted-foreground" : ""}
        `}
      >
        {done && !failed ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : active && !failed ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : failed ? (
          <XCircle className="h-3 w-3" />
        ) : (
          "•"
        )}
      </span>
      <span
        className={
          done && !failed
            ? "text-foreground font-medium"
            : active
              ? "text-foreground"
              : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function AIGenerator() {
  const router = useRouter();
  const { canManage } = useRole();
  const { data: merchantData } = useGetMyStoreQuery();
  // @ts-ignore
  const storeSlug = merchantData?.storeSlug;
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const [generate, { isLoading: isSubmitting }] = useGenerateMutation();

  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [tone, setTone] = useState<
    "professional" | "casual" | "luxurious" | "playful" | "urgent"
  >("professional");
  const [productId, setProductId] = useState<string>("__none__");
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(
    null,
  );

  const canManagePages = canManage(Resource.PAGES);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("الرجاء إدخال وصف المنتج أو الطلب");
      return;
    }
    try {
      const payload = {
        prompt: prompt.trim(),
        language,
        tone,
        ...(productId && productId !== "__none__" ? { productId } : {}),
      };
      const result = await generate(payload).unwrap();
      setActiveGenerationId(result.id);
      toast.success("بدأ التوليد — ستظهر النتيجة هنا خلال دقيقة");
    } catch {
      toast.error("حدث خطأ أثناء بدء عملية التوليد");
    }
  };

  const handleNewGeneration = () => {
    setActiveGenerationId(null);
    setPrompt("");
    setProductId("");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6 px-4" dir="rtl">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            مولّد صفحات الهبوط بالذكاء الاصطناعي
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            صِف منتجك، واختر الأسلوب — وسيبني الذكاء الاصطناعي صفحة هبوط
            احترافية لك
          </p>
        </div>
        <Badge
          variant="secondary"
          className="gap-1.5 shrink-0 bg-primary/10 text-primary border-primary/20 text-xs"
        >
          <Sparkles className="h-3 w-3" />
          Gemini AI
        </Badge>
      </div>

      {/* Tracker (visible after submit) */}
      {activeGenerationId && (
        <div className="space-y-3">
          <GenerationTracker
            generationId={activeGenerationId}
            storeSlug={storeSlug}
            onRetry={() => {}} // polling restarts automatically via new state
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewGeneration}
            className="text-muted-foreground"
          >
            + توليد صفحة جديدة
          </Button>
        </div>
      )}

      {/* Form */}
      {!activeGenerationId && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Prompt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                وصف المنتج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="prompt" className="sr-only">
                  وصف المنتج
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="مثال: كريم مرطب للبشرة الجافة يحتوي على زبدة الشيا وزيت الأرغان، مناسب للرجال والنساء، السعر 120 ريال، يصلح هدية..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="resize-none text-sm leading-relaxed"
                  required
                />
                <p className="text-xs text-muted-foreground text-end">
                  {prompt.length} / 2000
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings row */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                إعدادات التوليد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Language */}
                <div className="space-y-2">
                  <Label className="text-sm">اللغة</Label>
                  <Select
                    value={language}
                    onValueChange={(v) => setLanguage(v as "ar" | "en")}
                  >
                    <SelectTrigger dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label className="text-sm">الأسلوب</Label>
                  <Select
                    value={tone}
                    onValueChange={(v) =>
                      setTone(
                        v as
                          | "professional"
                          | "casual"
                          | "luxurious"
                          | "playful"
                          | "urgent",
                      )
                    }
                  >
                    <SelectTrigger dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product picker */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    المنتج المرتبط{" "}
                    <span className="text-muted-foreground font-normal">
                      (اختياري)
                    </span>
                  </Label>
                  {isLoadingProducts ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={productId} onValueChange={setProductId}>
                      <SelectTrigger dir="rtl">
                        <SelectValue placeholder="اختر منتجاً" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="__none__">— بدون ربط —</SelectItem>
                        {productsData?.products?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !prompt.trim() || !canManagePages}
              size="lg"
              className="gap-2 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري البدء...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  ابدأ التوليد
                </>
              )}
            </Button>
          </div>

          {!canManagePages && (
            <p className="text-xs text-destructive text-end">
              ليس لديك صلاحية إنشاء أو تعديل الصفحات.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
