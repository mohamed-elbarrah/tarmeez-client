"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { useGenerator, useConversationHistory } from "./GeneratorContext";
import {
  useRefinePageMutation,
  type RefinePageDto,
} from "@/lib/services/landingPageApi";
import { toast } from "sonner";

export function ChatInput() {
  const { state, dispatch } = useGenerator();
  const { isRefining, isGenerating, pageId, pageContent, conversation } = state;
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const history = useConversationHistory(state);

  const [refinePage] = useRefinePageMutation();

  const disabled = isRefining || isGenerating || !pageId || !pageContent;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [value]);

  const handleSend = async () => {
    const instruction = value.trim();
    if (!instruction || disabled) return;

    setValue("");

    // Optimistic: add user message immediately
    dispatch({ type: "ADD_USER_MESSAGE", content: instruction });
    dispatch({ type: "SET_REFINING", value: true });

    try {
      const dto: RefinePageDto = {
        instruction,
        scope: "full",
        currentContent: pageContent!,
        conversationHistory: history,
      };

      const result = await refinePage({
        pageId: pageId!,
        dto,
      }).unwrap();

      // Update page content with refined result
      dispatch({ type: "SET_PAGE_CONTENT", content: result.updatedContent });
      dispatch({
        type: "ADD_ASSISTANT_MESSAGE",
        content: result.assistantMessage,
      });
    } catch (err: any) {
      const msg = err?.data?.message ?? "حدث خطأ أثناء التعديل";
      toast.error(msg);
      dispatch({
        type: "ADD_ASSISTANT_MESSAGE",
        content: "⚠️ حدث خطأ. حاول مرة أخرى.",
      });
    } finally {
      dispatch({ type: "SET_REFINING", value: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card p-3 shrink-0">
      {/* Hint line */}
      {!disabled && (
        <p className="text-[10px] text-muted-foreground mb-2 px-1">
          اكتب تعليمات للتعديل — مثلاً: "اجعل العنوان أكثر إثارة"
        </p>
      )}

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled && !pageId
              ? "أنشئ الصفحة أولاً..."
              : "اكتب تعليمات التعديل..."
          }
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 min-h-10 max-h-35 leading-relaxed"
          style={{ height: "40px" }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="h-10 w-10 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="إرسال"
        >
          {isRefining ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
