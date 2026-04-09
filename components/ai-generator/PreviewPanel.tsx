"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, ExternalLink, Loader2 } from "lucide-react";
import { useGenerator } from "./GeneratorContext";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─── Default theme fallbacks (mirror ThemeEngine FALLBACK_CONFIG) ────────────

const THEME_DEFAULTS: Record<string, string> = {
  "--p-color": "#2563eb",
  "--s-color": "#0f172a",
  "--a-color": "#f59e0b",
  "--t-color": "#1e293b",
  "--h-color": "#000000",
  "--b-color": "#2563eb",
  "--radius": "8px",
};

export function PreviewPanel() {
  const { state, iframeRef } = useGenerator();
  const { pageContent, previewMode, isRefining, isGenerating, pageId } = state;

  // Fetch the merchant's own store to derive theme CSS variables
  const { data: merchantData } = useGetMyStoreQuery();
  const store = merchantData?.store;

  // True once the sandbox iframe has fired its SANDBOX_READY postMessage
  const [sandboxReady, setSandboxReady] = useState(false);

  // Build theme vars from store brand settings, falling back to defaults
  const themeVars: Record<string, string> = {
    "--p-color": store?.primaryColor ?? THEME_DEFAULTS["--p-color"],
    "--s-color": store?.secondaryColor ?? THEME_DEFAULTS["--s-color"],
    "--a-color": store?.accentColor ?? THEME_DEFAULTS["--a-color"],
    "--t-color": THEME_DEFAULTS["--t-color"],
    "--h-color": THEME_DEFAULTS["--h-color"],
    "--b-color": store?.primaryColor ?? THEME_DEFAULTS["--b-color"],
    "--radius": store?.borderRadius ?? THEME_DEFAULTS["--radius"],
  };
  if (store?.fontFamily) {
    themeVars["fontFamily"] = store.fontFamily;
  }

  // Push current content + theme into the sandbox whenever either changes
  const pushToSandbox = useCallback(() => {
    if (!sandboxReady || !iframeRef.current?.contentWindow || !pageContent) {
      return;
    }
    iframeRef.current.contentWindow.postMessage(
      { type: "UPDATE_CONTENT", content: pageContent, theme: themeVars },
      "*",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxReady, iframeRef, pageContent, JSON.stringify(themeVars)]);

  // Push whenever sandbox is ready or content/theme changes
  useEffect(() => {
    pushToSandbox();
  }, [pushToSandbox]);

  // Listen for SANDBOX_READY from the iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "SANDBOX_READY") {
        setSandboxReady(true);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
          {/* Iframe — loads the real Next.js sandbox route so Tailwind,
              Cairo font, CSS vars, and all React components are available.
              Content is injected after load via postMessage. */}
          <iframe
            ref={iframeRef}
            src="/merchant/preview-sandbox"
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
