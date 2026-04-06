import React from "react";
import type { TestimonialsSection } from "@/lib/ai-generator/schemas/testimonials.schema";

export function TestimonialsSectionBlock({
  headline,
  testimonials,
}: TestimonialsSection) {
  return (
    <section className="py-16 px-6 bg-[var(--bg-color,#ffffff)]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-black text-center mb-10"
          style={{ color: "var(--h-color, #111827)" }}
        >
          {headline}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 rounded-2xl border"
              style={{ borderColor: "var(--border-color, #e5e7eb)" }}
            >
              {t.rating && (
                <div className="flex gap-0.5 text-yellow-400 text-sm">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
              )}
              <p
                className="text-sm leading-relaxed flex-1 italic"
                style={{ color: "var(--t-color, #6b7280)" }}
              >
                "{t.quote}"
              </p>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--h-color, #111827)" }}
                >
                  {t.authorName}
                </p>
                {t.authorTitle && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--t-color, #6b7280)" }}
                  >
                    {t.authorTitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
