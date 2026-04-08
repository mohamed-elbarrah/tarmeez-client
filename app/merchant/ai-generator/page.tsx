"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratorWorkspace } from "@/components/ai-generator/GeneratorWorkspace";
import { AIPagesList } from "@/components/ai-generator/AIPagesList";

type ViewMode = { screen: "list" } | { screen: "workspace"; pageId?: string };

/**
 * AI Generator page — shows either:
 *   1. Pages list (pick an existing page or create new)
 *   2. The full workspace (new empty page, or loaded existing page)
 */
export default function AIGeneratorPage() {
  const [view, setView] = useState<ViewMode>({ screen: "list" });

  if (view.screen === "workspace") {
    return (
      <div
        className="-m-6 overflow-hidden flex flex-col"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* ── Back button ── */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background shrink-0"
          dir="rtl"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setView({ screen: "list" })}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            العودة إلى صفحاتي
          </Button>
        </div>

        {/* ── Workspace fills the rest ── */}
        <div className="flex-1 overflow-hidden">
          <GeneratorWorkspace
            key={view.pageId ?? "new"}
            loadPageId={view.pageId}
            fresh={!view.pageId}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      className="-m-6 overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <AIPagesList
        onSelectPage={(pageId) => setView({ screen: "workspace", pageId })}
        onCreateNew={() => setView({ screen: "workspace" })}
      />
    </div>
  );
}
