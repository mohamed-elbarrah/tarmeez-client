"use client";

import React, { useState } from "react";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGenerator } from "./GeneratorContext";
import {
  useGenerateMutation,
  type CreateGenerationDto,
} from "@/lib/services/landingPageApi";
import { useGetProductsQuery } from "@/lib/services/productsApi";
import { toast } from "sonner";

const TONES = [
  { value: "professional", label: "احترافي" },
  { value: "casual", label: "عفوي" },
  { value: "luxurious", label: "فاخر" },
  { value: "playful", label: "مرح" },
  { value: "urgent", label: "عاجل" },
] as const;

export function InitialPromptForm() {
  const { state, dispatch } = useGenerator();
  const { isGenerating } = state;

  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [tone, setTone] = useState<CreateGenerationDto["tone"]>("professional");
  const [productId, setProductId] = useState<string>("__none__");

  const [generate] = useGenerateMutation();
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("الرجاء إدخال وصف المنتج");
      return;
    }

    try {
      const payload: CreateGenerationDto = {
        prompt: prompt.trim(),
        language,
        tone,
        ...(productId && productId !== "__none__" ? { productId } : {}),
      };

      // Add user message to conversation
      dispatch({ type: "ADD_USER_MESSAGE", content: prompt.trim() });

      const result = await generate(payload).unwrap();
      dispatch({ type: "START_GENERATING", generationId: result.id });
    } catch {
      toast.error("حدث خطأ أثناء بدء التوليد");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
      {/* Welcome message */}
      <div className="flex gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[85%]">
          <p className="font-medium text-foreground mb-1">
            مرحباً! أنا مساعدك في إنشاء صفحات الهبوط.
          </p>
          <p className="text-muted-foreground">
            صِف منتجك بالتفصيل وسأبني لك صفحة هبوط احترافية خلال دقيقة واحدة.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt textarea */}
        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-sm font-medium">
            وصف المنتج
          </Label>
          <Textarea
            id="prompt"
            placeholder="مثال: كريم مرطب للبشرة الجافة يحتوي على زبدة الشيا وزيت الأرغان، مناسب للرجال والنساء، السعر 120 ريال..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            maxLength={2000}
            className="resize-none text-sm leading-relaxed"
            disabled={isGenerating}
            required
          />
          <p className="text-xs text-muted-foreground text-end">
            {prompt.length} / 2000
          </p>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">اللغة</Label>
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v as "ar" | "en")}
              disabled={isGenerating}
            >
              <SelectTrigger dir="rtl" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">الإنجليزية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">الأسلوب</Label>
            <Select
              value={tone}
              onValueChange={(v) => setTone(v as CreateGenerationDto["tone"])}
              disabled={isGenerating}
            >
              <SelectTrigger dir="rtl" className="h-8 text-xs">
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
        </div>

        {/* Product */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            المنتج المرتبط <span className="opacity-60">(اختياري)</span>
          </Label>
          {isLoadingProducts ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Select
              value={productId}
              onValueChange={setProductId}
              disabled={isGenerating}
            >
              <SelectTrigger dir="rtl" className="h-8 text-xs">
                <SelectValue placeholder="اختر منتجاً" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="__none__">بدون منتج محدد</SelectItem>
                {(productsData?.products ?? []).map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              توليد الصفحة
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
