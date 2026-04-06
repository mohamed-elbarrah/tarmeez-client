"use client";

import React, { useState } from "react";
import type { FaqSection } from "@/lib/ai-generator/schemas/faq.schema";

export function FaqSectionBlock({
  headline,
  description,
  questions,
}: FaqSection) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="py-14 px-6"
      style={{ background: "var(--bg-color, #ffffff)" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-black text-center mb-3"
          style={{ color: "var(--h-color, #111)" }}
        >
          {headline}
        </h2>
        {description && (
          <p
            className="text-center mb-8"
            style={{ color: "var(--t-color, #555)" }}
          >
            {description}
          </p>
        )}

        <div className="space-y-3">
          {questions.map((q, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 text-start px-5 py-4 font-semibold transition-colors"
                  style={{
                    color: isOpen
                      ? "var(--p-color, #6366f1)"
                      : "var(--h-color, #111)",
                    background: isOpen ? "var(--p-color, #6366f1)10" : "#fff",
                  }}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{q.question}</span>
                  <span className="shrink-0 text-lg">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div
                    className="px-5 py-4 text-sm leading-relaxed"
                    style={{ color: "var(--t-color, #555)" }}
                  >
                    {q.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
