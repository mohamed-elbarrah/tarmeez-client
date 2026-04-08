"use client";

import { GeneratorWorkspace } from "@/components/ai-generator/GeneratorWorkspace";

/**
 * AI Generator page — full-height 30/70 split-pane workspace.
 *
 * The merchant layout wraps children in `<main className="flex-1 p-6">`.
 * We use negative margins to fill the full available height edge-to-edge.
 * The -m-6 offsets the padding and the h calculation accounts for the header (h-16 = 4rem).
 */
export default function AIGeneratorPage() {
  return (
    <div
      className="-m-6 overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <GeneratorWorkspace />
    </div>
  );
}
