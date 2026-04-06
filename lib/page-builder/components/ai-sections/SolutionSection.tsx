import React from "react";
import type { SolutionSection } from "@/lib/ai-generator/schemas/solution.schema";

export function SolutionSectionBlock({
  headline,
  description,
  points,
  ctaText,
}: SolutionSection) {
  return (
    <section className="py-16 px-6 bg-[var(--bg-color,#ffffff)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ color: "var(--h-color, #111827)" }}
          >
            {headline}
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--t-color, #6b7280)" }}
          >
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {points.map((point, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-xl border"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--p-color, #6366f1) 20%, transparent)",
                background:
                  "color-mix(in srgb, var(--p-color, #6366f1) 5%, transparent)",
              }}
            >
              {point.icon && (
                <span className="text-2xl shrink-0">{point.icon}</span>
              )}
              <div>
                <h3
                  className="font-semibold text-sm mb-1"
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

        {ctaText && (
          <div className="text-center">
            <a
              href="#offer"
              className="inline-block px-8 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--p-color, #6366f1)" }}
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
