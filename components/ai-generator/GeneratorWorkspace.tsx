"use client";

import React from "react";
import { GeneratorProvider } from "./GeneratorContext";
import { ChatPanel } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";

/**
 * GeneratorWorkspace — the full 30/70 split-pane workspace.
 * The Provider wraps both panels so they share state.
 */
export function GeneratorWorkspace() {
  return (
    <GeneratorProvider>
      <div className="flex h-full w-full overflow-hidden" dir="rtl">
        {/* ── Left: Chat (30%) ── */}
        <div className="w-[30%] min-w-[280px] max-w-[420px] flex flex-col h-full shrink-0">
          <ChatPanel />
        </div>

        {/* ── Right: Preview (70%) ── */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          <PreviewPanel />
        </div>
      </div>
    </GeneratorProvider>
  );
}
