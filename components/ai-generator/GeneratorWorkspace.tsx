"use client";

import React from "react";
import { GeneratorProvider } from "./GeneratorContext";
import { ChatPanel } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";

interface GeneratorWorkspaceProps {
  /** When set, loads an existing AI page from DB */
  loadPageId?: string;
  /** When true, always starts with a blank workspace (Create New flow) */
  fresh?: boolean;
}

/**
 * GeneratorWorkspace — the full 30/70 split-pane workspace.
 * The Provider wraps both panels so they share state.
 */
export function GeneratorWorkspace({
  loadPageId,
  fresh,
}: GeneratorWorkspaceProps) {
  return (
    <GeneratorProvider loadPageId={loadPageId} fresh={fresh}>
      <div className="flex h-full w-full overflow-hidden" dir="rtl">
        {/* ── Left: Chat (30%) ── */}
        <div className="w-[30%] min-w-70 max-w-105 flex flex-col h-full shrink-0">
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
