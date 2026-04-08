"use client";

import React, { useEffect, useRef } from "react";
import { Sparkles, User, AlertCircle } from "lucide-react";
import type { Message } from "./GeneratorContext";

interface ConversationThreadProps {
  messages: Message[];
}

export function ConversationThread({ messages }: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 px-4 py-3">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} className="h-px" />
    </div>
  );
}

// ─── Single bubble ────────────────────────────────────────────

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isAssistant = message.role === "assistant";

  if (isSystem) {
    const isError = message.content.startsWith("❌");
    return (
      <div className="flex items-center justify-center">
        <div
          className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${
            isError
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isError && <AlertCircle className="h-3 w-3" />}
          {message.content}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-start gap-2">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
          <User className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[85%] shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant
  return (
    <div className="flex justify-end gap-2">
      <div className="bg-muted rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed max-w-[85%] text-foreground shadow-sm">
        {message.content}
      </div>
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
    </div>
  );
}
