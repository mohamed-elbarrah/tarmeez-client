"use client";

import React, { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, ExternalLink, Loader2 } from "lucide-react";
import { useGenerator } from "./GeneratorContext";
import { generatePreviewHtml } from "@/lib/ai-generator/preview-renderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PreviewPanel() {
  const { state, iframeRef } = useGenerator();
  const { pageContent, previewMode, isRefining, isGenerating, pageId, phase } =
    state;

  // Track srcDoc separately so we can update without re-rendering the iframe unnecessarily
  const [srcDoc, setSrcDoc] = useState<string>(() => generatePreviewHtml(null));

  // Regenerate the preview HTML whenever pageContent changes
  useEffect(() => {
    setSrcDoc(generatePreviewHtml(pageContent));
  }, [pageContent]);

  const editUrl = pageId ? `/merchant/page-builder?pageId=${pageId}` : null;

  const isMobile = previewMode === "mobile";

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] dark:bg-[#1a1a1a]">
      {/* ── Toolbar ── */}
      <PreviewToolbar editUrl={editUrl} />

      {/* ── Stage ── */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-6 pt-4">
        {/* Device frame wrapper */}
        <div
          className="relative flex flex-col transition-all duration-300"
          style={{
            width: isMobile ? "375px" : "100%",
            maxWidth: isMobile ? "375px" : "100%",
            minHeight: "600px",
            height: "100%",
          }}
        >
          {/* Iframe */}
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Landing Page Preview"
            className="w-full flex-1 border-0 rounded-lg shadow-xl bg-white transition-all duration-300"
            style={{
              minHeight: "600px",
              outline: isMobile
                ? "2px solid hsl(var(--border))"
                : "1px solid hsl(var(--border))",
              borderRadius: isMobile ? "20px" : "8px",
            }}
            sandbox="allow-same-origin allow-scripts"
          />

          {/* Refining overlay */}
          {isRefining && (
            <div className="absolute inset-0 flex items-start justify-center pt-20 bg-background/50 backdrop-blur-sm rounded-lg z-10">
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-3 shadow-lg text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>جاري تطبيق التعديلات...</span>
              </div>
            </div>
          )}

          {/* Generating overlay */}
          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10 gap-4">
              <div className="flex items-center gap-3 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  يتم إنشاء صفحتك...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  قد يستغرق ذلك دقيقة واحدة
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────

function PreviewToolbar({ editUrl }: { editUrl: string | null }) {
  const { state, dispatch } = useGenerator();
  const { previewMode } = state;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
      {/* Left: device toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() =>
            dispatch({ type: "SET_PREVIEW_MODE", mode: "desktop" })
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            previewMode === "desktop"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Desktop view"
        >
          <Monitor className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">سطح المكتب</span>
        </button>
        <button
          onClick={() => dispatch({ type: "SET_PREVIEW_MODE", mode: "mobile" })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            previewMode === "mobile"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Mobile view"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">الجوال</span>
        </button>
      </div>

      {/* Center: label */}
      <span className="text-xs text-muted-foreground font-medium">
        المعاينة المباشرة
      </span>

      {/* Right: edit link */}
      <div className="flex items-center gap-2">
        {editUrl ? (
          <Button size="sm" variant="outline" asChild>
            <Link href={editUrl} className="flex items-center gap-1.5 text-xs">
              <ExternalLink className="h-3 w-3" />
              فتح في المحرر
            </Link>
          </Button>
        ) : (
          <div className="w-24" />
        )}
      </div>
    </div>
  );
}
