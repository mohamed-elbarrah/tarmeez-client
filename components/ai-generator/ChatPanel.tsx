"use client";

import React, { useRef, useEffect } from "react";
import { Wand2, RotateCcw } from "lucide-react";
import { useGenerator } from "./GeneratorContext";
import { ConversationThread } from "./ConversationThread";
import { ChatInput } from "./ChatInput";
import { InitialPromptForm } from "./InitialPromptForm";
import { GenerationPoller } from "./GenerationPoller";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatPanel() {
  const { state, dispatch } = useGenerator();
  const { phase, conversation, activeGenerationId, isLoadingPage } = state;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when conversation grows
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.length]);

  const isWorkspace = phase === "workspace";

  return (
    <div className="flex flex-col h-full border-l border-border bg-card">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Wand2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold leading-none">
              مساعد الذكاء الاصطناعي
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isLoadingPage
                ? "جاري تحميل المحادثة..."
                : isWorkspace
                  ? "اكتب لتعديل الصفحة"
                  : "أنشئ صفحة هبوط"}
            </p>
          </div>
        </div>

        {isWorkspace && !isLoadingPage && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => dispatch({ type: "RESET" })}
            title="بدء من جديد"
          >
            <RotateCcw className="h-3.5 w-3.5 me-1" />
            جديد
          </Button>
        )}
      </div>

      {/* ── Polling (invisible) ── */}
      {activeGenerationId && phase === "generating" && (
        <GenerationPoller generationId={activeGenerationId} />
      )}

      {/* ── Scrollable content area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isLoadingPage ? (
          /* Loading skeleton while hydrating from DB */
          <div className="p-4 space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-10 w-4/5" />
          </div>
        ) : phase === "prompt" ? (
          /* Initial prompt form — shown before any generation */
          <InitialPromptForm />
        ) : (
          /* Conversation thread — shown during/after generation */
          <ConversationThread messages={conversation} />
        )}
      </div>

      {/* ── Chat input — only visible in workspace phase ── */}
      {isWorkspace && !isLoadingPage && <ChatInput />}
    </div>
  );
}
