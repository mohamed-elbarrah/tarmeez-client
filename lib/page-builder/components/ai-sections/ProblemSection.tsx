import React from "react";
import type { ProblemSection } from "@/lib/ai-generator/schemas/problem.schema";

export function ProblemSectionBlock({
  headline,
  description,
  painPoints,
}: ProblemSection) {
  return (
    <section
      className="py-16 px-6"
      style={{ background: "var(--bg-color, #f9fafb)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ color: "var(--h-color, #111827)" }}
          >
            {headline}
          </h2>
          {description && (
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: "var(--t-color, #6b7280)" }}
            >
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="flex gap-3 p-5 rounded-xl border-2"
              style={{
                borderColor: "color-mix(in srgb, #ef4444 20%, transparent)",
                background: "color-mix(in srgb, #ef4444 5%, transparent)",
              }}
            >
              {point.icon && (
                <span className="text-2xl shrink-0">{point.icon}</span>
              )}
              <div>
                <h3
                  className="font-semibold mb-1 text-sm"
                  style={{ color: "var(--h-color, #111827)" }}
                >
                  {point.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--t-color, #6b7280)" }}
                >
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
