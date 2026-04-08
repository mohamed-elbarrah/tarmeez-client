"use client";

import React from "react";
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useListAIPagesQuery,
  type AIPageSummary,
} from "@/lib/services/landingPageApi";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";

interface AIPagesListProps {
  onSelectPage: (pageId: string) => void;
  onCreateNew: () => void;
}

function StatusBadge({ status }: { status: AIPageSummary["status"] }) {
  if (status === "PUBLISHED")
    return (
      <Badge variant="default" className="text-xs gap-1">
        <CheckCircle2 className="h-3 w-3" />
        منشورة
      </Badge>
    );
  if (status === "DRAFT")
    return (
      <Badge variant="secondary" className="text-xs">
        مسودة
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-xs">
      مؤرشفة
    </Badge>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PageCard({
  page,
  storeSlug,
  onClick,
}: {
  page: AIPageSummary;
  storeSlug: string | undefined;
  onClick: () => void;
}) {
  const prompt = page.metadata?.prompt;
  const tone = page.metadata?.tone;
  const previewUrl = storeSlug ? `/store/${storeSlug}/p/${page.slug}` : null;

  return (
    <Card
      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{page.title}</p>
              {prompt && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-60">
                  {prompt}
                </p>
              )}
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <StatusBadge status={page.status} />
            {tone && (
              <span className="text-[10px] text-muted-foreground capitalize">
                {tone}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>آخر تعديل: {formatDate(page.updatedAt)}</span>
          </div>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
              title="عرض الصفحة في المتجر"
            >
              <ExternalLink className="h-3 w-3" />
              <span>معاينة في المتجر</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AIPagesList({ onSelectPage, onCreateNew }: AIPagesListProps) {
  const {
    data: pages,
    isLoading,
    isError,
  } = useListAIPagesQuery(undefined, {
    // Always refetch when this component mounts (user returns to list after creating a page)
    refetchOnMountOrArgChange: true,
  });
  const { data: storeData } = useGetMyStoreQuery();
  const storeSlug = storeData?.store?.slug;

  return (
    <div className="flex flex-col h-full overflow-hidden" dir="rtl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div>
          <h1 className="text-lg font-semibold">صفحاتي بالذكاء الاصطناعي</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            استمر في تعديل صفحة موجودة أو أنشئ صفحة جديدة
          </p>
        </div>
        <Button onClick={onCreateNew} className="gap-2 shrink-0">
          <PlusCircle className="h-4 w-4" />
          إنشاء صفحة جديدة
        </Button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-muted-foreground">حدث خطأ أثناء تحميل الصفحات</p>
          </div>
        )}

        {!isLoading && !isError && pages?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">لا توجد صفحات بعد</p>
              <p className="text-sm text-muted-foreground mt-1">
                أنشئ أول صفحة هبوط بالذكاء الاصطناعي
              </p>
            </div>
            <Button onClick={onCreateNew} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              إنشاء صفحة جديدة
            </Button>
          </div>
        )}

        {!isLoading && !isError && (pages?.length ?? 0) > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages!.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                storeSlug={storeSlug}
                onClick={() => onSelectPage(page.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
