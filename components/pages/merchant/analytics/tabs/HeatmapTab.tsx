"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetHeatmapQuery,
  useGetPagesQuery,
} from "@/lib/services/analyticsApi";
import { useGetMyStoreQuery } from "@/lib/services/merchantApi";
import type { HeatmapPoint } from "@/lib/types/analytics";
import { EmptyState } from "../EmptyState";
import { ChartSkeleton } from "../ChartSkeleton";
import { ErrorState } from "../ErrorState";
import { formatNumber } from "../formatters";

const TYPE_LABELS: Record<string, string> = {
  click: "نقرات",
  move: "حركة",
  scroll: "تمرير",
};

// Guard against pages with infinite-scroll or animated content (e.g. confetti)
// that continuously resize the body and cause an infinite height loop.
const MAX_PAGE_HEIGHT = 5000;
const HEIGHT_CHANGE_THRESHOLD = 10; // px — ignore sub-threshold fluctuations

function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatmapPoint[],
  width: number,
  height: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  points.forEach(({ x, y, weight }) => {
    const px = (x / 100) * width;
    const py = (y / 100) * height;
    const radius = 30;
    const alpha = Math.min(weight / 20, 0.8);

    const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
    gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(255, 165, 0, ${alpha * 0.5})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
  });
}

export function HeatmapTab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Refs to manage polling interval, ResizeObserver, and debounce timer
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a stable ref to the current iframeHeight so measureHeight can read it
  // without needing it in the useCallback dependency array (which would
  // re-create the function and break the ResizeObserver attachment).
  const iframeHeightRef = useRef(800);

  const [type, setType] = useState("click");
  const [device, setDevice] = useState("desktop");
  // Height of the full page content — drives both iframe and canvas dimensions
  const [iframeHeight, setIframeHeight] = useState(800);

  // Use the same query as MerchantLayout — storeData.store.slug is the reliable source
  const { data: storeData } = useGetMyStoreQuery();
  const storeSlug = storeData?.store?.slug;

  // page is initialized empty and updated once storeSlug is available
  const [page, setPage] = useState("");
  useEffect(() => {
    if (storeSlug && !page) {
      setPage(`/store/${storeSlug}/`);
    }
  }, [storeSlug, page]);

  const { data: pagesData } = useGetPagesQuery({});

  // Build available pages list once both storeSlug and pagesData are ready
  const homePath = storeSlug ? `/store/${storeSlug}/` : "";
  const availablePages = homePath
    ? [
        homePath,
        ...(pagesData?.pages
          ?.map((p) => p.slug)
          .filter((s) => s !== homePath) ?? []),
      ]
    : [];

  const {
    data: heatmapData,
    isLoading,
    isError,
    refetch,
  } = useGetHeatmapQuery(
    { page, type: type.toUpperCase(), device: device.toUpperCase() },
    { skip: !page },
  );

  // ── Height measurement ────────────────────────────────────────────────────

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const stopObserver = useCallback(() => {
    if (roRef.current) {
      roRef.current.disconnect();
      roRef.current = null;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  // Measure the iframe's full static content height.
  // Uses the documentElement instead of body as the observation target because
  // absolutely-positioned elements (confetti, modals) can inflate body.scrollHeight
  // without actually changing the page's layout height.
  const measureHeight = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc?.body) return;

      // Temporarily switch overflow to hidden so positioned/animated children
      // (like confetti canvas) don't inflate the scroll height reading.
      const prevOverflow = doc.documentElement.style.overflow;
      doc.documentElement.style.overflow = "hidden";
      const h = Math.min(
        Math.max(
          doc.documentElement.scrollHeight,
          doc.body.clientHeight, // clientHeight ignores absolutely-positioned overflow
        ),
        MAX_PAGE_HEIGHT,
      );
      doc.documentElement.style.overflow = prevOverflow;

      if (h < 200) return;
      // Only update if the change exceeds the threshold — ignores animation noise
      if (Math.abs(h - iframeHeightRef.current) > HEIGHT_CHANGE_THRESHOLD) {
        iframeHeightRef.current = h;
        setIframeHeight(h);
      }
    } catch {
      // cross-origin frame — keep current height
    }
  }, []);

  // Debounced wrapper used by ResizeObserver to avoid hundreds of calls/second
  const debouncedMeasure = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(measureHeight, 100);
  }, [measureHeight]);

  const handleIframeLoad = useCallback(() => {
    // Measure immediately after DOM is ready
    measureHeight();

    // Attach ResizeObserver to documentElement (not body) to avoid absolutely-
    // positioned animated elements (confetti etc.) triggering infinite growth
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.documentElement) {
        stopObserver();
        const ro = new ResizeObserver(debouncedMeasure);
        ro.observe(doc.documentElement);
        roRef.current = ro;
      }
    } catch {
      // cross-origin — ignore
    }

    // Also poll every 200 ms for 2 s as fallback for web-fonts / lazy images
    stopPolling();
    let elapsed = 0;
    pollRef.current = setInterval(() => {
      measureHeight();
      elapsed += 200;
      if (elapsed >= 2000) stopPolling();
    }, 200);
  }, [measureHeight, debouncedMeasure, stopPolling, stopObserver]);

  // Reset everything when the selected page changes
  useEffect(() => {
    iframeHeightRef.current = 800;
    setIframeHeight(800);
    stopPolling();
    stopObserver();
  }, [page, stopPolling, stopObserver]);

  // Full cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      stopObserver();
    };
  }, [stopPolling, stopObserver]);

  // ── Canvas drawing ────────────────────────────────────────────────────────

  const redraw = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    if (!heatmapData?.points?.length) return;
    const width = containerRef.current.offsetWidth;
    // iframeHeight is the 100% Y baseline — coordinates stored as % of full page
    drawHeatmap(canvasRef.current, heatmapData.points, width, iframeHeight);
  }, [heatmapData, iframeHeight]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Page selector */}
        <Select
          value={page}
          onValueChange={setPage}
          disabled={!availablePages.length}
        >
          <SelectTrigger className="w-50">
            <SelectValue placeholder="اختر صفحة" />
          </SelectTrigger>
          <SelectContent>
            {availablePages.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type selector */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {["click", "move", "scroll"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                type === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Device toggle */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {["desktop", "mobile"].map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                device === d
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d === "desktop" ? "🖥 كمبيوتر" : "📱 موبايل"}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Canvas */}
      <Card>
        <CardContent className="p-0 overflow-hidden rounded-lg">
          {!page || isLoading ? (
            <div className="h-125">
              <ChartSkeleton height={500} />
            </div>
          ) : isError ? (
            <div className="h-125 flex items-center justify-center">
              <ErrorState onRetry={refetch} />
            </div>
          ) : (heatmapData?.total ?? 0) < 100 ? (
            <div className="h-125 flex items-center justify-center">
              <EmptyState
                message="بيانات غير كافية بعد — تحتاج 100 تفاعل على الأقل"
                icon={Flame}
              />
            </div>
          ) : (
            /*
             * Outer div scrolls — the iframe itself never scrolls.
             * The iframe is "flat" (height = full content height) so every
             * pixel of the page is visible and heatmap Y% maps 1-to-1.
             */
            <div className="overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <div
                ref={containerRef}
                className="relative"
                style={{ height: iframeHeight }}
              >
                {/* scrolling="no" forces the iframe to never create its own
                    scrollbar — content flows to its natural height instead */}
                <iframe
                  ref={iframeRef}
                  src={page}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore — scrolling is a valid (deprecated) HTML attr
                  scrolling="no"
                  className="w-full border-0 pointer-events-none select-none block"
                  style={{ height: iframeHeight }}
                  title="معاينة الصفحة"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={handleIframeLoad}
                />
                {/* Canvas is absolutely positioned over the full iframe area */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 opacity-70 pointer-events-none"
                  style={{ width: "100%", height: iframeHeight }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {!isLoading && !isError && heatmapData && heatmapData.total >= 100 && (
        <p className="text-sm text-muted-foreground text-center">
          {formatNumber(heatmapData.total)} نقطة بيانات على صفحة {page}
        </p>
      )}
    </div>
  );
}
