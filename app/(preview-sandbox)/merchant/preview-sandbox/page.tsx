"use client";

import { useEffect, useState } from "react";
import { AIPageRenderer } from "@/lib/page-builder/renderer/AIPageRenderer";
import type { LandingPageContent } from "@/lib/ai-generator/schemas";

type ThemeVars = Record<string, string>;

interface SandboxMessage {
  type: "UPDATE_CONTENT";
  content?: LandingPageContent;
  theme?: ThemeVars;
}

export default function PreviewSandboxPage() {
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [themeVars, setThemeVars] = useState<ThemeVars>({});

  useEffect(() => {
    function handleMessage(event: MessageEvent<SandboxMessage>) {
      if (event.data?.type !== "UPDATE_CONTENT") return;
      if (event.data.content) setContent(event.data.content);
      if (event.data.theme) setThemeVars(event.data.theme);
    }

    window.addEventListener("message", handleMessage);

    // Signal to the parent frame that this sandbox is ready to receive content.
    // The parent waits for this before sending the first UPDATE_CONTENT message
    // so content is never lost before the listener is attached.
    window.parent.postMessage({ type: "SANDBOX_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      className="store-root light min-h-screen"
      dir="rtl"
      style={themeVars as React.CSSProperties}
    >
      {content ? (
        <AIPageRenderer content={content} />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-muted-foreground">
            جاري تحميل المعاينة...
          </p>
        </div>
      )}
    </div>
  );
}
